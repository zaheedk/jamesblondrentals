import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RCMExtra, RCMOptionalFee } from '@/lib/api/rcm-api-types';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { BookingSessionData, getBookingData, updateBookingData } from '@/lib/booking-session';
import ExtrasSelectionComponent from '@/components/booking/ExtrasSelection';
import ExitIntentPopup from '@/components/ExitIntentPopup';

const ExtrasSelectionPage = () => {
  const navigate = useNavigate();
  const { rcmApi } = useRcmApi();

  const [bookingData, setBookingData] = useState<BookingSessionData | null>(null);
  const [extras, setExtras] = useState<RCMExtra[]>([]);
  const [optionalFees, setOptionalFees] = useState<RCMOptionalFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExtras, setSelectedExtras] = useState<{
    id: string | number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[]>([]);
  const [selectedExtrasMap, setSelectedExtrasMap] = useState(new Map<string | number, number>());
  
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);

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
        const { extras, optionalfees } = response.results;
        
        const safeExtras = Array.isArray(extras) ? extras : [];
        setExtras(safeExtras);
        
        const safeOptionalFees = Array.isArray(optionalfees) ? optionalfees : [];
        setOptionalFees(safeOptionalFees);
      } else {
        console.error("API returned error or missing results:", response.error || "Unknown error");
        toast.error("Could not load extra options", {
          description: response.error || "The API returned an invalid response",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching extras options:", error);
      toast.error("Failed to load extras options", {
        description: "Please try again later.",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [navigate, rcmApi]);

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

    const selectedAvailableCar = rawApiResponse?.results?.availablecars?.find(
      car => car.vehiclecategoryid.toString() === bookingData?.vehicleId
    );
    
    const mandatoryFees = rawApiResponse?.results?.mandatoryfees?.map((fee: any) => ({
      name: fee.name || "Mandatory Fee",
      amount: fee.totalfeeamount || 0
    })) || [];
    
    updateBookingData({
      selectedExtras: selectedExtrasArray,
      totalRateAfterDiscount: selectedAvailableCar?.totalrateafterdiscount || bookingData?.basePrice,
      totalDiscountAmount: selectedAvailableCar?.totaldiscountamount || 0,
      mandatoryFees: mandatoryFees
    });
    
    navigate('/customer-details');
  };

  if (isLoading || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">Loading extras options...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ExitIntentPopup />
      <h1 className="text-3xl font-bold mb-6">Select Additional Extras</h1>
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-8">
          <ExtrasSelectionComponent 
            extras={extras}
            selectedExtras={selectedExtrasMap}
            onExtraChange={handleExtrasChange}
            currencySymbol="$"
            optionalFees={optionalFees}
          />
          
          <div className="flex flex-col gap-4 pt-4">
            <Button onClick={handleProceedToDetails}>
              Continue to Customer Details
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/insurance-selection')}
            >
              Back to Insurance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtrasSelectionPage;
