import React, { useEffect, useState } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

const Booking = () => {
  const navigate = useNavigate();
  const { rcmApi } = useRcmApi();

  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [insuranceOptions, setInsuranceOptions] = useState<RCMInsuranceOption[]>([]);
  const [kmCharges, setKmCharges] = useState<RCMKmCharge[]>([]);
  const [extras, setExtras] = useState<RCMExtra[]>([]);
  const [optionalFees, setOptionalFees] = useState<RCMOptionalFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);

  const [seasonalRates, setSeasonalRates] = useState<{
    dailyRate: number;
    totalAmount: number;
    discountAmount?: number;
  }[]>([]);
  const [mandatoryFees, setMandatoryFees] = useState<{
    name: string;
    amount: number;
  }[]>([]);

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
      
      console.log("Raw API Response:", response);
      
      if (response.status === "OK" && response.results) {
        const { insuranceoptions, kmcharges, extras, optionalfees } = response.results;
        
        console.log("Available cars:", response.results.availablecars);
        
        setInsuranceOptions(insuranceoptions || []);
        setKmCharges(kmcharges || []);
        
        const safeExtras = Array.isArray(extras) ? extras : [];
        setExtras(safeExtras);
        
        const safeOptionalFees = Array.isArray(optionalfees) ? optionalfees : [];
        setOptionalFees(safeOptionalFees);
        
        const defaultInsurance = insuranceoptions?.find(i => i.isdefault) || null;
        setSelectedInsurance(defaultInsurance);
        
        const defaultKmCharge = kmcharges?.find(k => k.isdefault) || null;
        setSelectedKmCharge(defaultKmCharge);
        
        if (response.results.seasonalrates && Array.isArray(response.results.seasonalrates)) {
          const rates = response.results.seasonalrates.map((rate: any) => ({
            dailyRate: rate.dailyratebeforediscount || 0,
            totalAmount: rate.dailyrateafterdiscount || 0,
            discountAmount: rate.discountrate || 0
          }));
          setSeasonalRates(rates);
        }
        
        if (response.results.mandatoryfees && Array.isArray(response.results.mandatoryfees)) {
          const fees = response.results.mandatoryfees.map((fee: any) => ({
            name: fee.name || "Mandatory Fee",
            amount: fee.totalfeeamount || 0
          }));
          setMandatoryFees(fees);
        }
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

  console.log("Data passed to BookingSummary:", {
    availableCars: rawApiResponse?.results?.availablecars || [],
    selectedVehicleCategoryId: bookingData.vehicleId
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="raw-api-response">
              <AccordionTrigger className="text-lg font-semibold">
                Raw API Response
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-4">
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <pre className="text-xs whitespace-pre-wrap overflow-auto">
                      {JSON.stringify(rawApiResponse, null, 2)}
                    </pre>
                  </ScrollArea>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
            pickupLocation={bookingData.pickupLocationName || ""}
            dropoffLocation={bookingData.dropoffLocationName || ""}
            pickupDate={bookingData.pickupDate}
            dropoffDate={bookingData.dropoffDate}
            vehicleName={bookingData.vehicleName || ""}
            selectedInsurance={selectedInsuranceForSummary}
            selectedExtras={selectedExtras}
            kmChargePrice={kmChargePrice}
            currencySymbol="$"
            vehicleImageUrl={bookingData.vehicleImage}
            availableCars={rawApiResponse?.results?.availablecars || []}
            selectedVehicleCategoryId={bookingData.vehicleId}
            mandatoryFees={mandatoryFees}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
