import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { parseISO, parse, differenceInDays, isValid } from "date-fns";
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
import { getBookingData, BookingSessionData } from "@/lib/booking-session";

const Booking = () => {
  const navigate = useNavigate();
  const { rcmApi, useStep3Details } = useRcmApi();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [step3Params, setStep3Params] = useState<RCMStep3Request | null>(null);
  const [paramError, setParamError] = useState<string | null>(null);
  const [numberOfDays, setNumberOfDays] = useState<number>(1);
  
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string | number | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Map<string | number, number>>(new Map());
  
  useEffect(() => {
    const data = getBookingData();
    console.log('Retrieved booking data from session:', data);
    setBookingData(data);

    if (!data) {
      const errorMsg = 'Missing booking data. Please select a vehicle first.';
      setParamError(errorMsg);
      console.error(errorMsg);
      toast.error("Missing booking data", {
        description: "Please return to the vehicle search page and select a vehicle."
      });
      setIsLoading(false);
      return;
    }

    try {
      let pickupDateObj: Date;
      let dropoffDateObj: Date;
      
      if (data.pickupDate) {
        if (data.pickupDate.includes('T')) {
          pickupDateObj = parseISO(data.pickupDate);
        } else if (data.pickupDate.includes('/')) {
          pickupDateObj = parse(data.pickupDate, 'dd/MM/yyyy', new Date());
        } else {
          pickupDateObj = new Date(data.pickupDate);
        }
        
        if (!isValid(pickupDateObj)) {
          throw new Error(`Invalid pickup date: ${data.pickupDate}`);
        }
      } else {
        throw new Error("Pickup date is missing");
      }
      
      if (data.dropoffDate) {
        if (data.dropoffDate.includes('T')) {
          dropoffDateObj = parseISO(data.dropoffDate);
        } else if (data.dropoffDate.includes('/')) {
          dropoffDateObj = parse(data.dropoffDate, 'dd/MM/yyyy', new Date());
        } else {
          dropoffDateObj = new Date(data.dropoffDate);
        }
        
        if (!isValid(dropoffDateObj)) {
          throw new Error(`Invalid dropoff date: ${data.dropoffDate}`);
        }
      } else {
        throw new Error("Dropoff date is missing");
      }
      
      const days = Math.max(differenceInDays(dropoffDateObj, pickupDateObj) || 1, 1);
      setNumberOfDays(days);
      
      console.group('Booking Data from Session Storage');
      console.log('vehicleId:', data.vehicleId);
      console.log('vehicleCategoryTypeId:', data.vehicleCategoryTypeId);
      console.log('pickupLocationId:', data.pickupLocationId);
      console.log('dropoffLocationId:', data.dropoffLocationId);
      console.log('pickupDate:', data.pickupDate, '(Parsed:', pickupDateObj.toISOString(), ')');
      console.log('pickupTime:', data.pickupTime);
      console.log('dropoffDate:', data.dropoffDate, '(Parsed:', dropoffDateObj.toISOString(), ')');
      console.log('dropoffTime:', data.dropoffTime);
      console.log('ageId:', data.ageId);
      console.log('vehicleName:', data.vehicleName);
      console.log('basePrice:', data.basePrice);
      console.log('Full Booking Data:', JSON.stringify(data, null, 2));
      console.groupEnd();
      
      const params: RCMStep3Request = {
        vehiclecategoryid: data.vehicleId,
        vehiclecategorytypeid: data.vehicleCategoryTypeId,
        pickuplocationid: data.pickupLocationId,
        pickupdate: data.pickupDate,
        pickuptime: data.pickupTime,
        dropofflocationid: data.dropoffLocationId,
        dropoffdate: data.dropoffDate,
        dropofftime: data.dropoffTime,
        ageid: data.ageId
      };
      
      console.group('Step 3 Request Parameters');
      console.log('Vehicle Category ID:', params.vehiclecategoryid);
      console.log('Vehicle Category Type ID:', params.vehiclecategorytypeid);
      console.log('Pickup Location ID:', params.pickuplocationid);
      console.log('Pickup Date:', params.pickupdate);
      console.log('Pickup Time:', params.pickuptime);
      console.log('Dropoff Location ID:', params.dropofflocationid);
      console.log('Dropoff Date:', params.dropoffdate);
      console.log('Dropoff Time:', params.dropofftime);
      console.log('Age ID:', params.ageid);
      console.log('Full Request Object:', JSON.stringify(params, null, 2));
      console.groupEnd();
      
      setStep3Params(params);
      
      setBookingDetails({
        vehicleId: data.vehicleId,
        vehicleName: data.vehicleName || "Selected Vehicle",
        pickupLocationId: data.pickupLocationId,
        pickupLocationName: data.pickupLocationName || "Pickup Location",
        dropoffLocationId: data.dropoffLocationId,
        dropoffLocationName: data.dropoffLocationName || "Dropoff Location",
        pickupDate: pickupDateObj,
        pickupTime: data.pickupTime,
        dropoffDate: dropoffDateObj,
        dropoffTime: data.dropoffTime,
        ageId: data.ageId,
        basePrice: data.basePrice
      });
      setParamError(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error setting up Step3 params:", error);
      setParamError(`Error setting up booking parameters: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error("Error setting up booking parameters", {
        description: "Please return to the vehicle search page and try again."
      });
      setIsLoading(false);
    }
  }, []);
  
  const { data: step3Data, isLoading: isStep3Loading, error: step3Error } = useStep3Details(step3Params);
  
  useEffect(() => {
    console.group('Step 3 API Response');
    console.log('Loading:', isStep3Loading);
    console.log('Error:', step3Error);
    console.log('Data:', step3Data);
    if (step3Data?.results) {
      console.log('Insurance Options:', step3Data.results.insuranceoptions?.length || 0);
      console.log('Km Charges:', step3Data.results.kmcharges?.length || 0);
      console.log('Extras:', step3Data.results.extras?.length || 0);
    }
    console.groupEnd();
    
    if (step3Data?.results?.insuranceoptions) {
      const defaultInsurance = step3Data.results.insuranceoptions.find(ins => ins.isdefault);
      if (defaultInsurance) {
        setSelectedInsuranceId(defaultInsurance.id);
      } else if (step3Data.results.insuranceoptions.length > 0) {
        setSelectedInsuranceId(step3Data.results.insuranceoptions[0].id);
      }
    }
  }, [step3Data, isStep3Loading, step3Error]);
  
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
  
  const handleInsuranceChange = (insuranceId: string | number) => {
    setSelectedInsuranceId(insuranceId);
  };
  
  const handleExtraChange = (extraId: string | number, quantity: number) => {
    const updatedExtras = new Map(selectedExtras);
    
    if (quantity > 0) {
      updatedExtras.set(extraId, quantity);
    } else {
      updatedExtras.delete(extraId);
    }
    
    setSelectedExtras(updatedExtras);
  };
  
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
  
  const getKmChargePrice = () => {
    if (!step3Data?.results?.kmcharges) return 0;
    
    const defaultKmCharge = step3Data.results.kmcharges.find(km => km.isdefault);
    if (!defaultKmCharge) return 0;
    
    return defaultKmCharge.dailyrate * numberOfDays;
  };
  
  const getCurrencySymbol = () => {
    return step3Data?.results?.locationfees?.currencysymbol || "$";
  };
  
  const handleContinue = () => {
    const selectedInsurance = getSelectedInsurance();
    const selectedExtrasDetails = getSelectedExtrasDetails();
    
    if (!bookingData) {
      toast.error("Missing booking data", {
        description: "Please return to vehicle selection and try again."
      });
      return;
    }
    
    const updatedBookingData = {
      ...bookingData,
      insuranceId: selectedInsurance?.id,
      insuranceName: selectedInsurance?.name,
      insurancePrice: selectedInsurance?.price,
      extras: selectedExtrasDetails,
      kmChargePrice: getKmChargePrice(),
      totalPrice: (
        bookingData.basePrice + 
        (selectedInsurance?.price || 0) + 
        selectedExtrasDetails.reduce((sum, extra) => sum + extra.totalPrice, 0) + 
        getKmChargePrice()
      )
    };
    
    sessionStorage.setItem('rcm_booking_final', JSON.stringify(updatedBookingData));
    navigate('/customer-details');
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

  if (isLoading || isStep3Loading) {
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
