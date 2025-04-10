import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMInsuranceOption, RCMKmCharge, RCMExtra, RCMOptionalFee } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData } from '@/lib/booking-session';
import BookingSummary from '@/components/booking/BookingSummary';
import InsuranceOptions from '@/components/booking/InsuranceOptions';
import KmCharges from '@/components/booking/KmCharges';
import ExtrasSelection from '@/components/booking/ExtrasSelection';
import { differenceInDays, parseISO } from 'date-fns';

const Booking = () => {
  const navigate = useNavigate();
  const { rcmApi } = useRcmApi();

  // State for booking options
  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [insuranceOptions, setInsuranceOptions] = useState<RCMInsuranceOption[]>([]);
  const [kmCharges, setKmCharges] = useState<RCMKmCharge[]>([]);
  const [extras, setExtras] = useState<RCMExtra[]>([]);
  const [optionalFees, setOptionalFees] = useState<RCMOptionalFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected options state
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

  // Calculate number of days for rental
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

  // Get booking data from session storage
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
    
    // Fetch step 3 data (options)
    setIsLoading(true);
    
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
      if (response.status === "OK" && response.results) {
        const { insuranceoptions, kmcharges, extras, optionalfees } = response.results;
        
        // Ensure we always have arrays, even if API returns null/undefined
        setInsuranceOptions(insuranceoptions || []);
        setKmCharges(kmcharges || []);
        
        // Create a safe copy of extras array
        const safeExtras = Array.isArray(extras) ? extras : [];
        setExtras(safeExtras);
        
        // Create a safe copy of optional fees array
        const safeOptionalFees = Array.isArray(optionalfees) ? optionalfees : [];
        setOptionalFees(safeOptionalFees);
        
        // Set default selections
        const defaultInsurance = insuranceoptions?.find(i => i.isdefault) || null;
        setSelectedInsurance(defaultInsurance);
        
        const defaultKmCharge = kmcharges?.find(k => k.isdefault) || null;
        setSelectedKmCharge(defaultKmCharge);
      } else {
        console.error("API returned error or missing results:", response.error || "Unknown error");
        toast.error("Could not load booking options", {
          description: response.error || "The API returned an invalid response",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching booking options:", error);
      toast.error("Failed to load booking options", {
        description: "Please try again later.",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [navigate, rcmApi]);

  // Handle proceeding to customer details page
  const handleProceedToDetails = () => {
    navigate('/customer-details');
  };

  // Handle insurance selection
  const handleInsuranceChange = (insuranceId: string | number) => {
    const selected = insuranceOptions.find(i => i.id.toString() === insuranceId.toString()) || null;
    setSelectedInsurance(selected);
  };

  // Handle km charge selection
  const handleKmChargeChange = (kmChargeId: string | number) => {
    const selected = kmCharges.find(k => k.id.toString() === kmChargeId.toString()) || null;
    setSelectedKmCharge(selected);
  };

  // Handle extras selection
  const handleExtrasChange = (extraId: string | number, quantity: number) => {
    const newSelectedExtrasMap = new Map(selectedExtrasMap);
    
    if (quantity <= 0) {
      newSelectedExtrasMap.delete(extraId);
    } else {
      newSelectedExtrasMap.set(extraId, quantity);
    }
    
    setSelectedExtrasMap(newSelectedExtrasMap);
    
    // Update the selectedExtras array for BookingSummary
    const updatedSelectedExtras = Array.from(newSelectedExtrasMap).map(([id, qty]) => {
      // Check in both extras and optionalFees arrays
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
          quantity: 1, // Optional fees always have quantity 1
          unitPrice: optionalFee.fees,
          totalPrice: optionalFee.fees
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

  // Prepare booking summary data
  const selectedInsuranceForSummary = selectedInsurance ? {
    id: selectedInsurance.id,
    name: selectedInsurance.name,
    price: selectedInsurance.totalinsuranceamount
  } : null;
  
  const kmChargePrice = selectedKmCharge ? selectedKmCharge.dailyrate * calculateNumberOfDays() : 0;
  const numberOfDays = calculateNumberOfDays();

  if (isLoading || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">Loading booking options...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Options Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Insurance Options */}
          {insuranceOptions.length > 0 && (
            <InsuranceOptions 
              insuranceOptions={insuranceOptions}
              selectedInsuranceId={selectedInsurance?.id || null}
              onSelectInsurance={handleInsuranceChange}
              currencySymbol="$"
            />
          )}
          
          {/* Kilometer Charges */}
          {kmCharges.length > 0 && (
            <KmCharges 
              kmCharges={kmCharges}
              numberOfDays={calculateNumberOfDays()}
              currencySymbol="$"
            />
          )}
          
          {/* Extras Selection */}
          <ExtrasSelection 
            extras={extras}
            selectedExtras={selectedExtrasMap}
            onExtraChange={handleExtrasChange}
            currencySymbol="$"
            optionalFees={optionalFees}
          />
          
          {/* Navigation Buttons */}
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
        
        {/* Booking Summary */}
        <div>
          <BookingSummary
            pickupLocation={bookingData.pickupLocationName || ""}
            dropoffLocation={bookingData.dropoffLocationName || ""}
            pickupDate={bookingData.pickupDate}
            dropoffDate={bookingData.dropoffDate}
            vehicleName={bookingData.vehicleName || ""}
            basePrice={bookingData.basePrice}
            selectedInsurance={selectedInsuranceForSummary}
            selectedExtras={selectedExtras}
            kmChargePrice={kmChargePrice}
            currencySymbol="$"
            vehicleImageUrl={bookingData.vehicleImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
