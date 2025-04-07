
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { format, differenceInDays } from "date-fns";
import InsuranceOptions from "@/components/booking/InsuranceOptions";
import KmCharges from "@/components/booking/KmCharges";
import ExtrasSelection from "@/components/booking/ExtrasSelection";
import BookingSummary from "@/components/booking/BookingSummary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { RCMStep3Request, RCMStep3Response, RCMInsuranceOption } from "@/lib/api/rcm-api-types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rcmApi, useStep3Details } = useRcmApi();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [step3Params, setStep3Params] = useState<RCMStep3Request | null>(null);
  const [paramError, setParamError] = useState<string | null>(null);
  
  // State for selected options
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string | number | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Map<string | number, number>>(new Map());
  
  // Get params from URL with all possible case variations
  const getParam = (name: string): string | null => {
    // Try different case variations
    const variations = [
      name, 
      name.toLowerCase(), 
      name.toUpperCase(), 
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    ];
    
    for (const variant of variations) {
      const value = searchParams.get(variant);
      if (value) return value;
    }
    return null;
  };
  
  const vehicleId = getParam("vehicleId") || getParam("vehiclecategoryid");
  const pickupLocationId = getParam("pickupLocationId") || getParam("PickupLocationID");
  const dropoffLocationId = getParam("dropoffLocationId") || getParam("DropOffLocationID");
  const pickupDate = getParam("pickupDate") || getParam("PickupDate");
  const pickupTime = getParam("pickupTime") || getParam("PickupTime");
  const dropoffDate = getParam("dropoffDate") || getParam("ReturnDate");
  const dropoffTime = getParam("dropoffTime") || getParam("ReturnTime");
  const ageId = getParam("ageId") || getParam("Age");
  const vehicleName = getParam("vehicleName");
  const basePriceStr = getParam("basePrice");
  const basePrice = basePriceStr ? parseFloat(basePriceStr) : 0;
  const pickupLocationName = getParam("pickupLocationName");
  const dropoffLocationName = getParam("dropoffLocationName");
  
  console.log("URL Parameters:", {
    vehicleId,
    pickupLocationId,
    dropoffLocationId,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    ageId,
    vehicleName,
    basePrice
  });
  
  // Calculate number of days for KM charges calculation
  const numberOfDays = pickupDate && dropoffDate ? 
    differenceInDays(new Date(dropoffDate), new Date(pickupDate)) + 1 : 1;
  
  // Fetch Step3 data
  useEffect(() => {
    // Validate required parameters immediately when component mounts
    let missingParams = [];
    if (!vehicleId) missingParams.push("vehicleId");
    if (!pickupLocationId) missingParams.push("pickupLocationId");
    if (!dropoffLocationId) missingParams.push("dropoffLocationId");
    if (!pickupDate) missingParams.push("pickupDate");
    if (!pickupTime) missingParams.push("pickupTime");
    if (!dropoffDate) missingParams.push("dropoffDate");
    if (!dropoffTime) missingParams.push("dropoffTime");
    if (!ageId) missingParams.push("ageId");
    
    if (missingParams.length > 0) {
      const errorMsg = `Missing required parameters: ${missingParams.join(", ")}`;
      setParamError(errorMsg);
      console.error(errorMsg);
      toast.error("Missing required booking parameters", {
        description: "Please return to the vehicle search page and try again."
      });
      setIsLoading(false);
      return;
    }

    try {
      // Log available parameters for debugging
      console.log("Available URL parameters:", {
        vehicleId,
        pickupLocationId,
        dropoffLocationId,
        pickupDate,
        pickupTime,
        dropoffDate, 
        dropoffTime,
        ageId
      });

      // Construct Step3 parameters - matching the casing from the ASP.NET code
      const params: RCMStep3Request = {
        vehiclecategoryid: vehicleId!,
        pickuplocationid: pickupLocationId!,
        pickupdate: pickupDate!,
        pickuptime: pickupTime!,
        dropofflocationid: dropoffLocationId!,
        dropoffdate: dropoffDate!,
        dropofftime: dropoffTime!,
        ageid: ageId!
      };
      
      console.log("Step3 params:", params);
      setStep3Params(params);
      
      setBookingDetails({
        vehicleId,
        vehicleName: vehicleName || "Selected Vehicle",
        pickupLocationId,
        pickupLocationName: pickupLocationName || "Pickup Location",
        dropoffLocationId,
        dropoffLocationName: dropoffLocationName || "Dropoff Location",
        pickupDate: new Date(pickupDate!),
        pickupTime,
        dropoffDate: new Date(dropoffDate!),
        dropoffTime,
        ageId,
        basePrice
      });
      setParamError(null);
    } catch (error) {
      console.error("Error setting up Step3 params:", error);
      setParamError("Error setting up booking parameters");
      toast.error("Error setting up booking parameters", {
        description: "Please return to the vehicle search page and try again."
      });
      setIsLoading(false);
    }
  }, [vehicleId, pickupLocationId, dropoffLocationId, pickupDate, pickupTime, dropoffDate, dropoffTime, ageId]);
  
  // Fetch step3 data from API
  const { data: step3Data, isLoading: isStep3Loading, error: step3Error } = useStep3Details(step3Params);
  
  // Set default insurance option when data is loaded
  useEffect(() => {
    if (step3Data?.results?.insuranceoptions) {
      const defaultInsurance = step3Data.results.insuranceoptions.find(ins => ins.isdefault);
      if (defaultInsurance) {
        setSelectedInsuranceId(defaultInsurance.id);
      } else if (step3Data.results.insuranceoptions.length > 0) {
        setSelectedInsuranceId(step3Data.results.insuranceoptions[0].id);
      }
    }
  }, [step3Data]);
  
  // Set default extras when data is loaded
  useEffect(() => {
    if (step3Data?.results?.extras) {
      const newSelectedExtras = new Map<string | number, number>();
      step3Data.results.extras.forEach(extra => {
        if (extra.isdefault) {
          newSelectedExtras.set(extra.id, 1);
        }
      });
      setSelectedExtras(newSelectedExtras);
    }
  }, [step3Data]);
  
  // Handle insurance selection
  const handleInsuranceChange = (insuranceId: string | number) => {
    setSelectedInsuranceId(insuranceId);
  };
  
  // Handle extras selection
  const handleExtraChange = (extraId: string | number, quantity: number) => {
    const updatedExtras = new Map(selectedExtras);
    
    if (quantity > 0) {
      updatedExtras.set(extraId, quantity);
    } else {
      updatedExtras.delete(extraId);
    }
    
    setSelectedExtras(updatedExtras);
  };
  
  // Get selected insurance details
  const getSelectedInsurance = () => {
    if (!selectedInsuranceId || !step3Data?.results?.insuranceoptions) return null;
    
    const insurance = step3Data.results.insuranceoptions.find(
      ins => ins.id.toString() === selectedInsuranceId.toString()
    );
    
    return insurance ? {
      id: insurance.id,
      name: insurance.name,
      price: insurance.totalinsuranceamount
    } : null;
  };
  
  // Get selected extras details
  const getSelectedExtrasDetails = () => {
    if (!step3Data?.results?.extras) return [];
    
    return Array.from(selectedExtras.entries())
      .map(([extraId, quantity]) => {
        const extra = step3Data.results.extras.find(
          e => e.id.toString() === extraId.toString()
        );
        
        return extra ? {
          id: extra.id,
          name: extra.name,
          quantity,
          totalPrice: quantity * extra.unitprice
        } : null;
      })
      .filter(Boolean) as { id: string | number; name: string; quantity: number; totalPrice: number }[];
  };
  
  // Calculate KM charge price
  const getKmChargePrice = () => {
    if (!step3Data?.results?.kmcharges) return 0;
    
    const defaultKmCharge = step3Data.results.kmcharges.find(km => km.isdefault);
    if (!defaultKmCharge) return 0;
    
    return defaultKmCharge.dailyrate * numberOfDays;
  };
  
  // Get currency symbol
  const getCurrencySymbol = () => {
    return step3Data?.results?.locationfees?.currencysymbol || "$";
  };
  
  // Handle continue to customer details
  const handleContinue = () => {
    const selectedInsurance = getSelectedInsurance();
    const selectedExtrasDetails = getSelectedExtrasDetails();
    
    // Build URL parameters for next step
    const params = new URLSearchParams();
    params.append("vehicleId", vehicleId || "");
    params.append("vehicleName", vehicleName || "");
    params.append("pickupLocationId", pickupLocationId || "");
    params.append("pickupLocationName", pickupLocationName || "");
    params.append("dropoffLocationId", dropoffLocationId || "");
    params.append("dropoffLocationName", dropoffLocationName || "");
    params.append("pickupDate", pickupDate || "");
    params.append("pickupTime", pickupTime || "");
    params.append("dropoffDate", dropoffDate || "");
    params.append("dropoffTime", dropoffTime || "");
    params.append("ageId", ageId || "");
    params.append("basePrice", basePrice.toString());
    
    if (selectedInsurance) {
      params.append("insuranceId", selectedInsurance.id.toString());
      params.append("insuranceName", selectedInsurance.name);
      params.append("insurancePrice", selectedInsurance.price.toString());
    }
    
    if (selectedExtrasDetails.length > 0) {
      params.append("extras", JSON.stringify(selectedExtrasDetails));
    }
    
    params.append("kmChargePrice", getKmChargePrice().toString());
    params.append("totalPrice", (
      basePrice + 
      (selectedInsurance?.price || 0) + 
      selectedExtrasDetails.reduce((sum, extra) => sum + extra.totalPrice, 0) + 
      getKmChargePrice()
    ).toString());
    
    // Navigate to customer details page
    navigate(`/customer-details?${params.toString()}`);
  };

  if (paramError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Booking Options</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Missing Parameters</AlertTitle>
          <AlertDescription>
            {paramError}. Please return to vehicle selection.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate("/vehicles")}>
          Return to Vehicle Selection
        </Button>
      </div>
    );
  }

  if (isStep3Loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Loading booking options...</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (step3Error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Error loading booking options</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>API Error</AlertTitle>
          <AlertDescription>
            There was an error loading the booking options. This may be due to invalid parameters.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate("/vehicles")}>
          Return to Vehicle Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Booking Options</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {step3Data?.results?.insuranceoptions && step3Data.results.insuranceoptions.length > 0 && (
            <InsuranceOptions
              insuranceOptions={step3Data.results.insuranceoptions}
              selectedInsuranceId={selectedInsuranceId}
              onSelectInsurance={handleInsuranceChange}
              currencySymbol={getCurrencySymbol()}
            />
          )}
          
          {step3Data?.results?.kmcharges && step3Data.results.kmcharges.length > 0 && (
            <KmCharges
              kmCharges={step3Data.results.kmcharges}
              numberOfDays={numberOfDays}
              currencySymbol={getCurrencySymbol()}
            />
          )}
          
          {step3Data?.results?.extras && (
            <ExtrasSelection
              extras={step3Data.results.extras}
              selectedExtras={selectedExtras}
              onExtraChange={handleExtraChange}
              currencySymbol={getCurrencySymbol()}
            />
          )}
          
          <div className="pt-6">
            <Button size="lg" onClick={handleContinue}>
              Continue to Customer Details
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-1">
          {bookingDetails && (
            <BookingSummary
              vehicleName={bookingDetails.vehicleName}
              pickupLocation={bookingDetails.pickupLocationName}
              dropoffLocation={bookingDetails.dropoffLocationName}
              pickupDate={bookingDetails.pickupDate}
              dropoffDate={bookingDetails.dropoffDate}
              basePrice={bookingDetails.basePrice}
              selectedInsurance={getSelectedInsurance()}
              selectedExtras={getSelectedExtrasDetails()}
              kmChargePrice={getKmChargePrice()}
              currencySymbol={getCurrencySymbol()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
