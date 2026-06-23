import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMInsuranceOption, RCMKmCharge, RCMExtra, RCMOptionalFee } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData, updateBookingData } from '@/lib/booking-session';
import InsuranceOptions from '@/components/booking/InsuranceOptions';
import KmCharges from '@/components/booking/KmCharges';
import ExtrasSelection from '@/components/booking/ExtrasSelection';
import BookingRentalAccordion from '@/components/booking/BookingRentalAccordion';
import BookingSteps from '@/components/booking/BookingSteps';
import TrustGuaranteeBanner from '@/components/booking/TrustGuaranteeBanner';
import { differenceInDays, parseISO } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { Helmet } from 'react-helmet-async';

const InsuranceAndExtrasSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rcmApi } = useRcmApi();

  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [insuranceOptions, setInsuranceOptions] = useState<RCMInsuranceOption[]>([]);
  const [kmCharges, setKmCharges] = useState<RCMKmCharge[]>([]);
  const [extras, setExtras] = useState<RCMExtra[]>([]);
  const [optionalFees, setOptionalFees] = useState<RCMOptionalFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedInsurance, setSelectedInsurance] = useState<RCMInsuranceOption | null>(null);
  const [selectedKmCharge, setSelectedKmCharge] = useState<RCMKmCharge | null>(null);
  const [selectedExtrasMap, setSelectedExtrasMap] = useState<{ [key: string]: number }>({});
  const [selectedExtras, setSelectedExtras] = useState<Array<{ id: string; name: string; price: number; quantity: number; isOptionalFee?: boolean }>>([]);

  const calculateNumberOfDays = () => {
    if (!bookingData) return 1;
    
    // First, use numberofdays from RCM API if available
    if (bookingData.numberofdays && typeof bookingData.numberofdays === 'number' && bookingData.numberofdays > 0) {
      return bookingData.numberofdays;
    }
    
    // Fallback: calculate from dates if API value not available
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
      return daysDiff >= 0 ? daysDiff + 1 : 1;
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
      if (response.status === "OK" && response.results) {
        const { insuranceoptions, kmcharges, availablecars, extras, optionalfees } = response.results;
        
        setInsuranceOptions(insuranceoptions || []);
        setKmCharges(kmcharges || []);
        setExtras(extras || []);
        setOptionalFees(optionalfees || []);

        // Fetch mandatory fees (e.g., security bond) from step2 so we can subtract bond in totals
        rcmApi.getStep2({
          vehiclecategorytypeid: data.vehicleCategoryTypeId,
          pickuplocationid: data.pickupLocationId,
          pickupdate: data.pickupDate,
          pickuptime: data.pickupTime,
          dropofflocationid: data.dropoffLocationId,
          dropoffdate: data.dropoffDate,
          dropofftime: data.dropoffTime,
          ageid: data.ageId,
          ...(data.campaignCode && { campaigncode: data.campaignCode })
        }).then((step2) => {
          if (step2?.status === 'OK' && step2.results?.mandatoryfees) {
            const mapped = (step2.results.mandatoryfees || []).map((f: any) => ({
              name: f.name || f.feegroupname || 'Fee',
              amount: Number(f.totalfeeamount ?? f.amount ?? 0),
            }));
            // Deduplicate by fee name to prevent accumulation
            const deduped = mapped.reduce((acc: any[], current: any) => {
              if (!acc.find(fee => fee.name === current.name)) {
                acc.push(current);
              }
              return acc;
            }, []);
            updateBookingData({ mandatoryFees: deduped });
          }
        }).catch((e: any) => {
          console.warn('Failed to load mandatory fees from step2:', e);
        });
        
        // Only update totalRateAfterDiscount if it's not already set (preserve discounts from previous steps)
        if (availablecars && availablecars.length > 0 && !data.totalRateAfterDiscount) {
          const selectedCar = availablecars.find(car => 
            car.vehiclecategoryid.toString() === data.vehicleId.toString()
          );
          
          if (selectedCar && selectedCar.totalrateafterdiscount) {
            updateBookingData({
              totalRateAfterDiscount: selectedCar.totalrateafterdiscount,
              dailyrate: selectedCar.discounteddailyrate || selectedCar.avgrate || 0,
            });
          }
        }
        
        // Set default insurance and km charge, but check for previously saved selections first
        let insuranceToSelect = null;
        let kmChargeToSelect = null;
        
        // Check for previously saved selections in booking data
        if (data.insuranceId) {
          insuranceToSelect = insuranceoptions?.find(i => i.id.toString() === data.insuranceId) || null;
        }
        
        if (data.extraKmsId) {
          kmChargeToSelect = kmcharges?.find(k => k.id.toString() === data.extraKmsId) || null;
        }
        
        // Fall back to defaults if no saved selections
        if (!insuranceToSelect) {
          insuranceToSelect = insuranceoptions?.find(i => i.isdefault) || null;
        }
        
        if (!kmChargeToSelect) {
          kmChargeToSelect = kmcharges?.find(k => k.isdefault) || null;
        }
        
        setSelectedInsurance(insuranceToSelect);
        setSelectedKmCharge(kmChargeToSelect);
        
        // Update booking data with default insurance total if selected
        if (insuranceToSelect && !data.insuranceId) {
          const insuranceTotal = parseFloat(String(insuranceToSelect.totalinsuranceamount)) || 0;
          console.log('Default insurance set:', { 
            rawTotal: insuranceToSelect.totalinsuranceamount, 
            parsedTotal: insuranceTotal 
          });
          updateBookingData({
            insuranceId: insuranceToSelect.id?.toString(),
            insuranceName: insuranceToSelect.name || insuranceToSelect.description,
            insurancePrice: insuranceTotal
          });
        }
        
        // Ensure dailyrate is present even if preserved earlier
        if (!data.dailyrate && availablecars && availablecars.length > 0) {
          const selectedCar = availablecars.find(car => 
            car.vehiclecategoryid.toString() === data.vehicleId.toString()
          );
          if (selectedCar) {
            updateBookingData({ dailyrate: selectedCar.discounteddailyrate || selectedCar.avgrate || 0 });
          }
        }
        
        // Restore previously selected extras if they exist
        if (data.selectedExtras && data.selectedExtras.length > 0) {
          const extrasMap: { [key: string]: number } = {};
          const extrasArray: Array<{ id: string; name: string; price: number; quantity: number; isOptionalFee?: boolean }> = [];
          
          data.selectedExtras.forEach(selectedExtra => {
            extrasMap[selectedExtra.id] = selectedExtra.quantity;
            extrasArray.push(selectedExtra);
          });
          
          setSelectedExtrasMap(extrasMap);
          setSelectedExtras(extrasArray);
        }
      } else {
        console.error("API returned error or missing results:", response.error || "Unknown error");
        toast.error("Could not load options", {
          description: response.error || "The API returned an invalid response",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching options:", error);
      toast.error("Failed to load options", {
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
      // Ensure totalinsuranceamount is a proper number
      const insuranceTotal = parseFloat(String(selected.totalinsuranceamount)) || 0;
      console.log('Insurance change:', { 
        selectedId: insuranceId, 
        rawTotalInsuranceAmount: selected.totalinsuranceamount,
        parsedInsuranceTotal: insuranceTotal,
        insuranceName: selected.name
      });
      updateBookingData({
        insuranceId: selected.id?.toString(),
        insuranceName: selected.name || selected.description,
        insurancePrice: insuranceTotal
      });
    }
  };

  const handleKmChargeChange = (kmChargeId: string | number) => {
    const selected = kmCharges.find(k => k.id.toString() === kmChargeId.toString()) || null;
    setSelectedKmCharge(selected);

    // Persist immediately so totals update live in the accordion
    if (selected) {
      updateBookingData({
        extraKmsId: selected.id?.toString(),
        extraKmsName: selected.name || selected.mileagedesc,
        // Store daily rate; we'll multiply by days in the accordion
        extraKmsPrice: selected.dailyrate,
      });
    }
  };

  const handleExtrasChange = (extraId: string | number, quantity: number) => {
    console.log('handleExtrasChange called:', { extraId, quantity });
    const updatedExtrasMap = { ...selectedExtrasMap };
    
    if (quantity === 0) {
      delete updatedExtrasMap[extraId.toString()];
    } else {
      updatedExtrasMap[extraId.toString()] = quantity;
    }
    
    console.log('Updated extras map:', updatedExtrasMap);
    setSelectedExtrasMap(updatedExtrasMap);
    
    // Update selectedExtras array
    const updatedExtras: Array<{ id: string; name: string; price: number; quantity: number; isOptionalFee?: boolean }> = [];
    
    Object.entries(updatedExtrasMap).forEach(([id, qty]) => {
      // Check if it's an extra first
      const extra = extras.find(e => e.id.toString() === id);
      if (extra) {
        updatedExtras.push({
          id: id,
          name: extra.name,
          price: extra.unitprice,
          quantity: qty,
          isOptionalFee: false
        });
      } else {
        // Check if it's an optional fee
        const optionalFee = optionalFees.find(f => f.id.toString() === id);
        if (optionalFee) {
          updatedExtras.push({
            id: id,
            name: optionalFee.feegroupname || optionalFee.name || `Optional Fee ${id}`,
            price: optionalFee.totalfeeamount || optionalFee.fees || 0,
            quantity: qty,
            isOptionalFee: true
          });
        }
      }
    });
    
    console.log('Updated selected extras:', updatedExtras);
    setSelectedExtras(updatedExtras);

    // Persist immediately so totals update in the accordion
    updateBookingData({
      selectedExtras: updatedExtras
    });
  };

  const handleProceedToDetails = () => {
    // Save insurance and km charge data
    if (selectedInsurance) {
      const insuranceTotal = parseFloat(String(selectedInsurance.totalinsuranceamount)) || 0;
      updateBookingData({
        insuranceId: selectedInsurance.id?.toString(),
        insuranceName: selectedInsurance.name || selectedInsurance.description,
        insurancePrice: insuranceTotal,
        extraKmsId: selectedKmCharge?.id?.toString(),
        extraKmsName: selectedKmCharge?.name || selectedKmCharge?.mileagedesc,
        extraKmsPrice: selectedKmCharge?.dailyrate
      });
    }

    // Save extras data
    updateBookingData({
      selectedExtras: selectedExtras
    });

    // Find the selected car details for final booking
    const currentBookingData = getBookingData();
    if (!currentBookingData) {
      toast.error("Booking data not found");
      return;
    }

    // Navigate to customer details
    navigate('/customer-details');
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
    if (data.campaignCode) searchParams.set("campaignCode", data.campaignCode);
    
    navigate(`/vehicles?${searchParams.toString()}`, {
      state: { 
        fromInsurancePage: true,
        resetCategoryFilter: true
      }
    });
  };

  if (isLoading || !bookingData) {
    return (
      <div className="min-h-screen bg-background">
        <BookingSteps currentStep={3} />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Loading options...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Insurance & Extras | James Blond Rentals</title>
        <meta name="description" content="Select insurance cover and optional extras for your James Blond vehicle rental. Choose from excess reduction, GPS, child seats and more." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <BookingSteps currentStep={3} />
      <div className="container mx-auto px-4 py-8">
        <ExitIntentPopup />
        {/* Sticky price summary - keeps total visible as user scrolls through insurance + extras */}
        <div className="sticky top-0 z-30 -mx-4 px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <BookingRentalAccordion key={`accordion-${selectedInsurance?.id}-${selectedKmCharge?.id}-${JSON.stringify(selectedExtras)}`} className="!mb-0" />
        </div>

        <div className="space-y-8 pt-6">
          {/* Insurance Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Insurance Options</h2>
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
          </div>

          {/* Extras Section */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">Optional Extras</h2>
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Skip extras — continue to details →
              </button>
            </div>
            {(extras.length > 0 || optionalFees.length > 0) && (
              <ExtrasSelection
                extras={extras}
                optionalFees={optionalFees}
                selectedExtras={new Map(Object.entries(selectedExtrasMap).map(([k, v]) => [k, v]))}
                onExtraChange={handleExtrasChange}
                currencySymbol="$"
              />
            )}
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
            <Button onClick={handleProceedToDetails}>
              Continue to Details
            </Button>
          </div>
          
          {/* Mobile navigation */}
          <div className="md:hidden pt-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="w-full mb-4"
            >
              Back
            </Button>
          </div>
        </div>
        
        {/* Mobile fixed bottom continue button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
          <Button 
            onClick={handleProceedToDetails}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 text-lg rounded-none"
          >
            Continue to Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceAndExtrasSelection;