
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMInsuranceOption, RCMKmCharge, RCMExtra } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData } from '@/lib/booking-session';
import BookingSummary from '@/components/booking/BookingSummary';
import InsuranceOptions from '@/components/booking/InsuranceOptions';
import KmCharges from '@/components/booking/KmCharges';
import ExtrasSelection from '@/components/booking/ExtrasSelection';

const Booking = () => {
  const navigate = useNavigate();
  const { getStep3 } = useRcmApi();

  // State for booking options
  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [insuranceOptions, setInsuranceOptions] = useState<RCMInsuranceOption[]>([]);
  const [kmCharges, setKmCharges] = useState<RCMKmCharge[]>([]);
  const [extras, setExtras] = useState<RCMExtra[]>([]);
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
    
    getStep3({
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
        const { insuranceoptions, kmcharges, extras } = response.results;
        
        setInsuranceOptions(insuranceoptions || []);
        setKmCharges(kmcharges || []);
        setExtras(extras || []);
        
        // Set default selections
        const defaultInsurance = insuranceoptions?.find(i => i.isdefault) || null;
        setSelectedInsurance(defaultInsurance);
        
        const defaultKmCharge = kmcharges?.find(k => k.isdefault) || null;
        setSelectedKmCharge(defaultKmCharge);
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
  }, [navigate, getStep3]);

  // Handle proceeding to customer details page
  const handleProceedToDetails = () => {
    // In a real implementation, you might want to save these selections to session storage
    // For now, we'll just navigate to the customer details page
    navigate('/customer-details');
  };

  // Prepare booking summary data
  const selectedInsuranceForSummary = selectedInsurance ? {
    id: selectedInsurance.id,
    name: selectedInsurance.name,
    price: selectedInsurance.totalinsuranceamount
  } : null;
  
  const selectedExtrasForSummary = selectedExtras.map(e => ({
    id: e.id,
    name: e.name,
    quantity: e.quantity,
    totalPrice: e.totalPrice
  }));
  
  const kmChargePrice = selectedKmCharge ? selectedKmCharge.dailyrate : 0;

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
              selectedInsurance={selectedInsurance}
              onInsuranceChange={setSelectedInsurance}
            />
          )}
          
          {/* Kilometer Charges */}
          {kmCharges.length > 0 && (
            <KmCharges 
              kmCharges={kmCharges}
              selectedKmCharge={selectedKmCharge}
              onKmChargeChange={setSelectedKmCharge}
            />
          )}
          
          {/* Extras Selection */}
          {extras.length > 0 && (
            <ExtrasSelection 
              extras={extras}
              selectedExtras={selectedExtras}
              onExtrasChange={setSelectedExtras}
            />
          )}
          
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
            selectedExtras={selectedExtrasForSummary}
            kmChargePrice={kmChargePrice}
            currencySymbol="$" // This should come from your API data ideally
            vehicleImageUrl={bookingData.vehicleImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
