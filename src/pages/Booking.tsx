
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookingSummary from "@/components/booking/BookingSummary";
import InsuranceOptions from "@/components/booking/InsuranceOptions";
import KmCharges from "@/components/booking/KmCharges";
import ExtrasSelection from "@/components/booking/ExtrasSelection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { RCMStep3Request, RCMStep3Response, RCMSeasonalRate } from "@/lib/api/rcm-api-types";
import { useRcmApi } from "@/hooks/use-rcm-api";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rcmApi } = useRcmApi();
  const bookingSession = getBookingData();
  
  const [selectedInsurance, setSelectedInsurance] = useState<{ id: string | number; name: string; price: number } | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<{ id: string | number; name: string; quantity: number; totalPrice: number }[]>([]);
  const [selectedKmCharge, setSelectedKmCharge] = useState<{ id: string | number; name: string; price: number } | null>(null);
  const [seasonalRates, setSeasonalRates] = useState<{
    season?: string;
    rateperiod: string;
    numberofdays: number;
    dailyRate: number;
    totalAmount: number;
    discountAmount?: number;
    dailyratebeforediscount?: number;
    discounttype?: string;
    discountname?: string;
  }[]>([]);
  const [mandatoryFees, setMandatoryFees] = useState<{
    name: string;
    amount: number;
  }[]>([]);
  
  const step3Request: RCMStep3Request = {
    vehiclecategoryid: bookingSession?.vehicleId || "",
    vehiclecategorytypeid: bookingSession?.vehicleCategoryTypeId || "",
    pickuplocationid: bookingSession?.pickupLocationId || "",
    pickupdate: bookingSession?.pickupDate || "",
    pickuptime: bookingSession?.pickupTime || "",
    dropofflocationid: bookingSession?.dropoffLocationId || "",
    dropoffdate: bookingSession?.dropoffDate || "",
    dropofftime: bookingSession?.dropoffTime || "",
    ageid: bookingSession?.ageId || "1",
    campaigncode: bookingSession?.campaignCode
  };
  
  const { data: step3Data, isLoading, error } = useQuery<RCMStep3Response>({
    queryKey: ['step3', step3Request],
    queryFn: () => rcmApi.getStep3(step3Request),
    enabled: !!bookingSession?.vehicleId
  });
  
  useEffect(() => {
    if (step3Data && step3Data.results) {
      // Process seasonal rates
      if (step3Data.results.seasonalrates && Array.isArray(step3Data.results.seasonalrates)) {
        const rates = step3Data.results.seasonalrates.map((rate: any) => ({
          season: rate.season || "",
          rateperiod: rate.rateperiod || "",
          numberofdays: rate.numberofdays || 0,
          dailyRate: rate.dailyratebeforediscount || 0,
          dailyratebeforediscount: rate.dailyratebeforediscount || 0,
          totalAmount: rate.dailyrateafterdiscount || 0,
          discountAmount: rate.discountrate || 0,
          discounttype: rate.discounttype || "",
          discountname: rate.discountname || ""
        }));
        setSeasonalRates(rates);
      }
      
      // Process mandatory fees
      if (step3Data.results.mandatoryfees && Array.isArray(step3Data.results.mandatoryfees)) {
        const fees = step3Data.results.mandatoryfees.map((fee: any) => ({
          name: fee.name || "Mandatory Fee",
          amount: fee.totalfeeamount || 0
        }));
        setMandatoryFees(fees);
      }
      
      // Set default insurance if available
      if (step3Data.results.insuranceoptions && step3Data.results.insuranceoptions.length > 0) {
        const defaultInsurance = step3Data.results.insuranceoptions.find(ins => ins.isdefault);
        if (defaultInsurance) {
          setSelectedInsurance({
            id: defaultInsurance.id,
            name: defaultInsurance.name,
            price: defaultInsurance.totalinsuranceamount
          });
        }
      }
      
      // Set default km charge if available
      if (step3Data.results.kmcharges && step3Data.results.kmcharges.length > 0) {
        const defaultKmCharge = step3Data.results.kmcharges.find(km => km.isdefault);
        if (defaultKmCharge) {
          setSelectedKmCharge({
            id: defaultKmCharge.id,
            name: defaultKmCharge.name,
            price: defaultKmCharge.dailyrate
          });
        }
      }
    }
  }, [step3Data]);
  
  const handleInsuranceSelect = (insurance: { id: string | number; name: string; price: number }) => {
    setSelectedInsurance(insurance);
  };
  
  const handleKmChargeSelect = (kmCharge: { id: string | number; name: string; price: number } | null) => {
    setSelectedKmCharge(kmCharge);
  };
  
  const handleExtraSelect = (extras: { id: string | number; name: string; quantity: number; totalPrice: number }[]) => {
    setSelectedExtras(extras);
  };
  
  const handleContinue = () => {
    // Update booking session with selected options
    updateBookingData({
      insuranceId: selectedInsurance?.id,
      insuranceName: selectedInsurance?.name,
      insurancePrice: selectedInsurance?.price,
      extraKmsId: selectedKmCharge?.id,
      extraKmsName: selectedKmCharge?.name,
      extraKmsPrice: selectedKmCharge?.price,
      selectedExtras: selectedExtras.map(extra => ({
        id: extra.id.toString(),
        name: extra.name,
        quantity: extra.quantity,
        price: extra.totalPrice / extra.quantity
      }))
    });
    
    // Navigate to customer details page
    navigate("/customer-details");
  };
  
  if (isLoading) {
    return <div className="container mx-auto p-4">Loading booking options...</div>;
  }
  
  if (error || !step3Data) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <h2 className="text-lg font-medium">Error loading booking options</h2>
          <p className="mt-2">Please try again or contact customer support.</p>
        </div>
        <Button onClick={() => navigate("/vehicles")}>Back to Vehicles</Button>
      </div>
    );
  }

  // Calculate the rental duration
  const calculateRentalDuration = () => {
    try {
      const pickupDate = bookingSession?.pickupDate;
      const dropoffDate = bookingSession?.dropoffDate;
      
      if (pickupDate && dropoffDate) {
        // Simple calculation assuming format is dd/MM/yyyy
        const [pDay, pMonth, pYear] = pickupDate.split('/').map(Number);
        const [dDay, dMonth, dYear] = dropoffDate.split('/').map(Number);
        
        if (!isNaN(pDay) && !isNaN(pMonth) && !isNaN(pYear) && 
            !isNaN(dDay) && !isNaN(dMonth) && !isNaN(dYear)) {
          const pickup = new Date(pYear, pMonth - 1, pDay);
          const dropoff = new Date(dYear, dMonth - 1, dDay);
          const diffTime = dropoff.getTime() - pickup.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the pickup day
          return diffDays > 0 ? diffDays : 1;
        }
      }
    } catch (e) {
      console.error("Error calculating duration:", e);
    }
    
    return seasonalRates.reduce((total, rate) => total + rate.numberofdays, 0) || 1;
  };

  const rentalDuration = calculateRentalDuration();
  const currencySymbol = bookingSession?.currencySymbol || "$";
  
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <InsuranceOptions 
              insuranceOptions={step3Data.results.insuranceoptions || []}
              selectedInsuranceId={selectedInsurance?.id || null}
              onSelectInsurance={handleInsuranceSelect}
              currencySymbol={currencySymbol}
            />
            
            <KmCharges 
              kmCharges={step3Data.results.kmcharges || []}
              numberOfDays={rentalDuration}
              currencySymbol={currencySymbol}
            />
            
            <ExtrasSelection 
              extras={step3Data.results.extras || []}
              onSelect={handleExtraSelect}
              selectedExtras={selectedExtras}
            />
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
              <Button onClick={handleContinue}>Continue to Customer Details</Button>
            </div>
          </div>
        </div>
        
        <div>
          <BookingSummary 
            pickupLocation={bookingSession?.pickupLocationName || ""}
            dropoffLocation={bookingSession?.dropoffLocationName || ""}
            pickupDate={bookingSession?.pickupDate || ""}
            dropoffDate={bookingSession?.dropoffDate || ""}
            vehicleName={bookingSession?.vehicleName || ""}
            basePrice={bookingSession?.basePrice || 0}
            selectedInsurance={selectedInsurance}
            selectedExtras={selectedExtras}
            kmChargePrice={selectedKmCharge?.price || 0}
            currencySymbol={currencySymbol}
            vehicleImageUrl={bookingSession?.vehicleImage}
            seasonalRates={seasonalRates}
            mandatoryFees={mandatoryFees}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
