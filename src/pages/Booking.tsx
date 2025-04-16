import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMInsuranceOption, RCMKmCharge, RCMExtra, RCMOptionalFee } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData, updateBookingData } from '@/lib/booking-session';
import BookingSummary from '@/components/booking/BookingSummary';
import InsuranceOptions from '@/components/booking/InsuranceOptions';
import KmCharges from '@/components/booking/KmCharges';
import ExtrasSelection from '@/components/booking/ExtrasSelection';
import { differenceInDays, parseISO } from 'date-fns';

const Booking = () => {
  const navigate = useNavigate();
  const { rcmApi } = useRcmApi();

  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [insuranceOptions, setInsuranceOptions] = useState<RCMInsuranceOption[]>([]);
  const [kmCharges, setKmCharges] = useState<RCMKmCharge[]>([]);
  const [extras, setExtras] = useState<RCMExtra[]>([]);
  const [optionalFees, setOptionalFees] = useState<RCMOptionalFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [selectedInsurance, setSelectedInsurance] = useState<RCMInsuranceOption | null>(null);
  const [selectedKmCharge, setSelectedKmCharge] = useState<RCMKmCharge | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<{
    id: string | number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[]>([]);
  const [selectedExtrasMap, setSelectedExtrasMap] = useState(new Map<string | number, number>());

  const calculateNumberOfDays = () => {
    if (!bookingData) return 1;
    try {
      const pickupDate = typeof bookingData.pickupDate === 'string' ? 
        parseISO(bookingData.pickupDate.includes('/') ? 
        bookingData.pickupDate.split('/').reverse().join('-') : 
        bookingData.pickupDate) : 
        new Date();

      const dropoffDate = typeof bookingData.dropoffDate === 'string' ? 
        parseISO(bookingData.dropoffDate.includes('/') ? 
        bookingData.dropoffDate.split('/').reverse().join('-') : 
        bookingData.dropoffDate) : 
        new Date();

      const daysDiff = differenceInDays(dropoffDate, pickupDate);
      return daysDiff > 0 ? daysDiff : 1;
    } catch (e) {
      console.error('Error calculating rental days:', e);
      return 1;
    }
  };

  useEffect(() => {
    const data = getBookingData();
    if (!data) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate('/');
      return;
    }
    
    setBookingData(data);
    
    setIsLoading(true);
    setApiError(null);
    
    rcmApi.getStep3({
      vehiclecategoryid: data.vehicleId,
      vehiclecategorytypeid: data.vehicleCategoryTypeId,
      pickuplocationid: data.pickupLocationId,
      pickupdate: data.pickupDate,
      pickuptime: data.pickupTime,
      dropofflocationid: data.dropoffLocationId,
      dropoffdate: data.dropoffDate,
      dropofftime: data.dropoffTime,
      ageid: data.ageId,
    })
    .then((response) => {
      console.log('Step3 API full response:', response);
      if (response.status === "OK" && response.results) {
        console.log('Step3 response results:', response.results);
        
        const safeInsuranceOptions = Array.isArray(response.results.insuranceoptions) ? 
          response.results.insuranceoptions : [];
        setInsuranceOptions(safeInsuranceOptions);
        
        const safeKmCharges = Array.isArray(response.results.kmcharges) ? 
          response.results.kmcharges : [];
        setKmCharges(safeKmCharges);
        
        let safeExtras: RCMExtra[] = [];
        if (response.results.extras) {
          if (Array.isArray(response.results.extras)) {
            safeExtras = response.results.extras;
          } else {
            console.warn('Extras is not an array:', response.results.extras);
            try {
              const extrasObj = response.results.extras;
              if (extrasObj && typeof extrasObj === 'object') {
                safeExtras = Object.values(extrasObj);
                console.log('Converted extras object to array:', safeExtras);
              }
            } catch (error) {
              console.error('Failed to convert extras:', error);
            }
          }
        }
        setExtras(safeExtras);
        console.log('Processed extras array:', safeExtras);
        
        const safeOptionalFees = Array.isArray(response.results.optionalfees) ? 
          response.results.optionalfees : [];
        setOptionalFees(safeOptionalFees);
        
        const defaultInsurance = safeInsuranceOptions.find(i => i.isdefault) || 
          (safeInsuranceOptions.length > 0 ? safeInsuranceOptions[0] : null);
        setSelectedInsurance(defaultInsurance);
        
        const defaultKmCharge = safeKmCharges.find(k => k.isdefault) || 
          (safeKmCharges.length > 0 ? safeKmCharges[0] : null);
        setSelectedKmCharge(defaultKmCharge);
      } else {
        console.error("API returned error or missing results:", response.error || "Unknown error");
        setApiError(response.error || "Could not load booking options");
        toast.error("Could not load booking options", {
          description: response.error || "The API returned an invalid response",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching booking options:", error);
      setApiError("Failed to connect to the booking system");
      toast.error("Failed to load booking options", {
        description: "Please try again later.",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [navigate, rcmApi]);

  const handleProceedToDetails = () => {
    const selectedExtrasArray = Array.from(selectedExtrasMap).map(([id, quantity]) => {
      const extra = extras.find(e => e.id.toString() === id.toString());
      const optionalFee = optionalFees.find(f => f.id.toString() === id.toString());
      
      if (extra) {
        return {
          id: id.toString(),
          name: extra.name || extra.description || "Extra item",
          quantity,
          price: extra.unitprice || extra.totalextraamount || 0
        };
      } else if (optionalFee) {
        return {
          id: id.toString(),
          name: optionalFee.name || "Optional fee",
          quantity,
          price: optionalFee.fees || 0
        };
      }
      
      return {
        id: id.toString(),
        name: "Unknown item",
        quantity,
        price: 0
      };
    });
    
    updateBookingData({
      insuranceId: selectedInsurance?.id?.toString(),
      insuranceName: selectedInsurance?.name || selectedInsurance?.description,
      insurancePrice: selectedInsurance?.totalinsuranceamount,
      extraKmsId: selectedKmCharge?.id?.toString(),
      extraKmsName: selectedKmCharge?.name || selectedKmCharge?.mileagedesc,
      extraKmsPrice: selectedKmCharge?.dailyrate,
      selectedExtras: selectedExtrasArray
    });
    
    navigate('/customer-details');
  };

  const handleInsuranceChange = (insuranceId: string | number) => {
    const selected = insuranceOptions.find(i => i.id.toString() === insuranceId.toString()) || null;
    setSelectedInsurance(selected);
  };

  const handleKmChargeChange = (kmChargeId: string | number) => {
    const selected = kmCharges.find(k => k.id.toString() === kmChargeId.toString()) || null;
    setSelectedKmCharge(selected);
  };

  const handleExtrasChange = (extraId: string | number, quantity: number) => {
    const newSelectedExtrasMap = new Map(selectedExtrasMap);
    
    if (quantity <= 0) {
      newSelectedExtrasMap.delete(extraId);
    } else {
      newSelectedExtrasMap.set(extraId, quantity);
    }
    
    setSelectedExtrasMap(newSelectedExtrasMap);
    
    const updatedSelectedExtras = Array.from(newSelectedExtrasMap).map(([id, qty]) => {
      const extra = extras.find(e => e.id.toString() === id.toString());
      const optionalFee = optionalFees.filter(
        fee => !["Deposit", "FullPayment"].includes(fee.name)
      ).find(f => f.id.toString() === id.toString());
      
      if (extra) {
        return {
          id: extra.id,
          name: extra.name,
          quantity: qty,
          unitPrice: extra.unitprice,
          totalPrice: extra.unitprice * qty
        };
      } else if (optionalFee) {
        return {
          id: optionalFee.id,
          name: optionalFee.name,
          quantity: qty,
          unitPrice: optionalFee.fees,
          totalPrice: optionalFee.fees * qty
        };
      } else {
        console.warn("Could not find extra or optional fee with id:", id);
        return null;
      }
    }).filter(Boolean) as {
      id: string | number;
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    
    setSelectedExtras(updatedSelectedExtras);
  };

  const selectedInsuranceForSummary = selectedInsurance ? {
    id: selectedInsurance.id,
    name: selectedInsurance.name || selectedInsurance.description || "Insurance",
    price: selectedInsurance.totalinsuranceamount || 0
  } : null;
  
  const kmChargePrice = selectedKmCharge ? 
    (selectedKmCharge.dailyrate || 0) * calculateNumberOfDays() : 0;
  const numberOfDays = calculateNumberOfDays();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">Loading booking options...</div>
      </div>
    );
  }

  if (apiError && !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <h2 className="text-red-700 font-medium">API Connection Error</h2>
          <p className="text-red-600">{apiError}</p>
        </div>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
      
      {apiError && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <h2 className="text-amber-700 font-medium">Warning</h2>
          <p className="text-amber-600">
            Some booking options could not be loaded. You can continue with limited options 
            or return home to try again.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {insuranceOptions.length > 0 && (
            <InsuranceOptions 
              insuranceOptions={insuranceOptions}
              selectedInsuranceId={selectedInsurance?.id || null}
              onSelectInsurance={handleInsuranceChange}
              currencySymbol="$"
            />
          )}
          
          {kmCharges.length > 0 && (
            <KmCharges 
              kmCharges={kmCharges}
              numberOfDays={calculateNumberOfDays()}
              currencySymbol="$"
            />
          )}
          
          <ExtrasSelection 
            extras={extras}
            selectedExtras={selectedExtrasMap}
            onExtraChange={handleExtrasChange}
            currencySymbol="$"
            optionalFees={optionalFees}
          />
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button onClick={handleProceedToDetails}>
              Continue to Customer Details
            </Button>
          </div>
        </div>
        
        <div>
          <BookingSummary
            pickupLocation={bookingData?.pickupLocationName || ""}
            dropoffLocation={bookingData?.dropoffLocationName || ""}
            pickupDate={bookingData?.pickupDate || ""}
            dropoffDate={bookingData?.dropoffDate || ""}
            vehicleName={bookingData?.vehicleName || ""}
            basePrice={bookingData?.basePrice || 0}
            selectedInsurance={selectedInsuranceForSummary}
            selectedExtras={selectedExtras}
            kmChargePrice={kmChargePrice}
            currencySymbol="$"
            vehicleImageUrl={bookingData?.vehicleImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
