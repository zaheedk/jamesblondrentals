
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMInsuranceOption, RCMKmCharge } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData, updateBookingData } from '@/lib/booking-session';
import InsuranceOptions from '@/components/booking/InsuranceOptions';
import KmCharges from '@/components/booking/KmCharges';
import BookingRentalAccordion from '@/components/booking/BookingRentalAccordion';
import { differenceInDays, parseISO } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import DebugApiResponse from '@/components/diagnostics/DebugApiResponse';

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
      ...(data.campaignCode && { campaigncode: data.campaignCode })
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
    
    // Update booking data immediately so accordion shows correct total
    if (selected) {
      const numberOfDays = calculateNumberOfDays();
      const perDayRate = selected.totalinsuranceamount / numberOfDays;
      updateBookingData({
        insurancePrice: perDayRate
      });
    }
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
    // Navigate back to the vehicles page without applying category filter
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
    // Removed the vehicleCategoryTypeId parameter to avoid filtering
    if (data.campaignCode) searchParams.set("campaignCode", data.campaignCode);
    
    navigate(`/vehicles?${searchParams.toString()}`, {
      state: { 
        fromInsurancePage: true,
        resetCategoryFilter: true  // Add flag to indicate category filter should be reset
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
      <ExitIntentPopup />
      <BookingRentalAccordion />
      
      <div className="space-y-8">
        {insuranceOptions.length > 0 && (
          <InsuranceOptions 
            insuranceOptions={insuranceOptions}
            selectedInsuranceId={selectedInsurance?.id || null}
            onSelectInsurance={handleInsuranceChange}
            currencySymbol="$"
            numberOfDays={calculateNumberOfDays()}
          />
        )}
        
        <div className="bg-gray-50 rounded-lg p-6">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-left w-full hover:text-primary">
              <ChevronDown className="h-4 w-4" />
              <span className="font-medium">Important Insurance Information</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Excess</h3>
                <p>This amount will be charged to your card in the event of any damage to the car. If the cost of the damage is lower than the excess, the difference will be refunded to you once the claim has been processed.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bond</h3>
                <p>When you pick up your car, this amount will be held on your credit card for 5-10 working days, depending on your bank and card type.</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

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
        
        {/* Debug API Response */}
        <DebugApiResponse 
          title="Insurance API Response"
          data={rawApiResponse}
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default InsuranceSelection;
