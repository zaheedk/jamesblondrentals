
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMInsuranceOption, RCMKmCharge } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData, updateBookingData } from '@/lib/booking-session';
import InsuranceOptions from '@/components/booking/InsuranceOptions';
import KmCharges from '@/components/booking/KmCharges';
import { differenceInDays, parseISO } from 'date-fns';

const InsuranceSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rcmApi } = useRcmApi();

  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [insuranceOptions, setInsuranceOptions] = useState<RCMInsuranceOption[]>([]);
  const [kmCharges, setKmCharges] = useState<RCMKmCharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedInsurance, setSelectedInsurance] = useState<RCMInsuranceOption | null>(null);
  const [selectedKmCharge, setSelectedKmCharge] = useState<RCMKmCharge | null>(null);
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);

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
      setRawApiResponse(response);
      
      if (response.status === "OK" && response.results) {
        const { insuranceoptions, kmcharges } = response.results;
        
        setInsuranceOptions(insuranceoptions || []);
        setKmCharges(kmcharges || []);
        
        const defaultInsurance = insuranceoptions?.find(i => i.isdefault) || null;
        setSelectedInsurance(defaultInsurance);
        
        const defaultKmCharge = kmcharges?.find(k => k.isdefault) || null;
        setSelectedKmCharge(defaultKmCharge);
      } else {
        console.error("API returned error or missing results:", response.error || "Unknown error");
        toast.error("Could not load insurance options", {
          description: response.error || "The API returned an invalid response",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching insurance options:", error);
      toast.error("Failed to load insurance options", {
        description: "Please try again later.",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [navigate, rcmApi]);

  const handleInsuranceChange = (insuranceId: string | number) => {
    const selected = insuranceOptions.find(i => i.id.toString() === insuranceId.toString()) || null;
    setSelectedInsurance(selected);
  };

  const handleKmChargeChange = (kmChargeId: string | number) => {
    const selected = kmCharges.find(k => k.id.toString() === kmChargeId.toString()) || null;
    setSelectedKmCharge(selected);
  };

  const handleContinueToExtras = () => {
    if (selectedInsurance) {
      updateBookingData({
        insuranceId: selectedInsurance.id?.toString(),
        insuranceName: selectedInsurance.name || selectedInsurance.description,
        insurancePrice: selectedInsurance.totalinsuranceamount,
        extraKmsId: selectedKmCharge?.id?.toString(),
        extraKmsName: selectedKmCharge?.name || selectedKmCharge?.mileagedesc,
        extraKmsPrice: selectedKmCharge?.dailyrate
      });
    }
    
    navigate('/extras-selection');
  };

  const handleBack = () => {
    // Navigate back to the vehicles page and ensure a complete refresh of the search
    // We need to create the search parameters manually from the booking data
    const data = getBookingData();
    if (!data) {
      navigate('/');
      return;
    }
    
    const searchParams = new URLSearchParams();
    if (data.pickupLocationId) searchParams.set("pickupLocation", data.pickupLocationId.toString());
    if (data.dropoffLocationId) searchParams.set("dropoffLocation", data.dropoffLocationId.toString());
    if (data.pickupDate) searchParams.set("pickupDate", data.pickupDate.toString());
    if (data.dropoffDate) searchParams.set("dropoffDate", data.dropoffDate.toString());
    if (data.pickupTime) searchParams.set("pickupTime", data.pickupTime.toString());
    if (data.dropoffTime) searchParams.set("dropoffTime", data.dropoffTime.toString());
    if (data.ageId) searchParams.set("age", data.ageId.toString());
    if (data.vehicleCategoryTypeId) searchParams.set("carCategory", data.vehicleCategoryTypeId.toString());
    if (data.promoCode) searchParams.set("promoCode", data.promoCode);
    
    navigate(`/vehicles?${searchParams.toString()}`, {
      state: { 
        forceRefresh: true,
        fromInsurancePage: true 
      }
    });
  };

  if (isLoading || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">Loading insurance options...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Insurance Options</h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
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
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
            <Button onClick={handleContinueToExtras}>
              Continue to Extras
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSelection;
