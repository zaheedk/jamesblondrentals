
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Car, Save } from "lucide-react";
import PaymentSummary from "@/components/payment/PaymentSummary";
import RentalDetails from "@/components/payment/RentalDetails";
import { rcmApi } from "@/lib/api/rcm-api";
import { RCMBookingResponse } from "@/lib/api/rcm-api-types";
import { format, addDays } from "date-fns";

const DEPOSIT_AMOUNT = 50;

const PaymentOptions = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("full");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mandatoryFeesTotal, setMandatoryFeesTotal] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);

  useEffect(() => {
    const bookingData = getBookingData();
    
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
      return;
    }
    
    console.log("Booking Data Locations:", {
      pickupLocation: bookingData.pickupLocationName,
      dropoffLocation: bookingData.dropoffLocationName,
      fullBookingData: bookingData
    });
    
    const pickupLocationName = bookingData.pickupLocationName || "Location not available";
    const dropoffLocationName = bookingData.dropoffLocationName || "Location not available";
    
    setBookingDetails({
      ...bookingData,
      pickupLocationName,
      dropoffLocationName
    });
    
    let calculatedDays = 1;
    
    if (bookingData.numberofdays && typeof bookingData.numberofdays === 'number' && bookingData.numberofdays > 0) {
      console.log("Using numberofdays from API response:", bookingData.numberofdays);
      calculatedDays = bookingData.numberofdays;
    } 
    else if (bookingData.pickupDate && bookingData.dropoffDate) {
      try {
        const pickupDate = new Date(bookingData.pickupDate);
        const dropoffDate = new Date(bookingData.dropoffDate);
        if (pickupDate && dropoffDate && !isNaN(pickupDate.getTime()) && !isNaN(dropoffDate.getTime())) {
          const timeDiff = dropoffDate.getTime() - pickupDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          calculatedDays = Math.max(1, daysDiff);
          console.log("Calculated rental days from dates:", calculatedDays);
        }
      } catch (error) {
        console.error("Error calculating rental days:", error);
        calculatedDays = 1;
      }
    }
    
    setRentalDays(calculatedDays);
    updateBookingData({ rentalDays: calculatedDays });
    
    const basePrice = bookingData.totalRateAfterDiscount || bookingData.basePrice || 0;
    console.log("Using price for calculation:", basePrice, 
      bookingData.totalRateAfterDiscount ? "(from totalRateAfterDiscount)" : "(from basePrice)");
    
    const insurancePrice = bookingData.insurancePrice || 0;
    const extrasTotal = (bookingData.selectedExtras || []).reduce(
      (sum: number, extra: any) => sum + (extra.price * extra.quantity), 
      0
    );
    
    const mandatoryTotal = (bookingData.mandatoryFees || []).reduce(
      (sum: number, fee: any) => sum + fee.amount,
      0
    );
    setMandatoryFeesTotal(mandatoryTotal);
    
    const calculatedTotal = basePrice + insurancePrice + extrasTotal;
    setTotalAmount(calculatedTotal);
    
    console.log("Payment calculation details:", {
      basePrice,
      rentalDays: calculatedDays,
      insurancePrice,
      extrasTotal,
      mandatoryTotal,
      calculatedTotal,
      fullData: bookingData
    });

    console.log("Booking data from session:", bookingData);
  }, [navigate]);

  const handleImageError = () => {
    console.log("Error loading vehicle image");
    setImageError(true);
  };

  const handleSaveQuotation = async () => {
    try {
      if (!bookingDetails) {
        toast.error("No booking details available to save quote");
        return;
      }

      const sessionData = getBookingData();

      const today = new Date();
      const formattedToday = format(today, "dd/MMM/yyyy");
      
      let pickupDate = bookingDetails.pickupDate;
      let dropoffDate = bookingDetails.dropoffDate;
      
      const isPickupToday = pickupDate.includes(formattedToday.split('/')[1]) && 
                          pickupDate.includes(formattedToday.split('/')[0]);
                          
      if (isPickupToday) {
        const newPickupDate = addDays(today, 2);
        pickupDate = format(newPickupDate, "dd/MMM/yyyy");
        
        // Fixed: Now using the already defined rentalDays variable
        const newDropoffDate = addDays(newPickupDate, rentalDays || 3);
        dropoffDate = format(newDropoffDate, "dd/MMM/yyyy");
        
        console.log(`Updated dates: Pickup ${pickupDate}, Dropoff ${dropoffDate}`);
      }

      let customerInfo = null;
      try {
        if (bookingDetails.reservationRef) {
          console.log("Fetching booking details for reservation:", bookingDetails.reservationRef);
          const response = await rcmApi.request('POST', 'bookinginfo', {
            method: 'bookinginfo',
            reservationref: bookingDetails.reservationRef
          });
          
          const apiResponse = response as { status: string, results?: any, error?: string };
          
          if (apiResponse.status === "OK" && apiResponse.results?.customerinfo?.[0]) {
            customerInfo = apiResponse.results.customerinfo[0];
            console.log("Retrieved customer info from API:", customerInfo);
          }
        }
      } catch (error) {
        console.error("Failed to fetch customer details:", error);
      }

      const vehicleCategoryId = typeof bookingDetails.vehicleCategoryId === 'string' 
        ? parseInt(bookingDetails.vehicleCategoryId) || 6 
        : bookingDetails.vehicleCategoryId || 6;
        
      const vehicleCategoryTypeId = typeof bookingDetails.vehicleCategoryTypeId === 'string' 
        ? parseInt(bookingDetails.vehicleCategoryTypeId) || 6 
        : bookingDetails.vehicleCategoryTypeId || 6;
        
      const pickupLocationId = typeof bookingDetails.pickupLocationId === 'string' 
        ? parseInt(bookingDetails.pickupLocationId) || 1 
        : bookingDetails.pickupLocationId || 1;
        
      const dropoffLocationId = typeof bookingDetails.dropoffLocationId === 'string' 
        ? parseInt(bookingDetails.dropoffLocationId) || 1 
        : bookingDetails.dropoffLocationId || 1;
        
      const ageid = typeof bookingDetails.driverageId === 'string' 
        ? parseInt(bookingDetails.driverageId) || 4 
        : bookingDetails.driverageId || 4;
        
      const insuranceid = typeof bookingDetails.insuranceId === 'string' 
        ? parseInt(bookingDetails.insuranceId) || 0 
        : bookingDetails.insuranceId || 0;
        
      const extrakmsid = typeof bookingDetails.extraKmsId === 'string' 
        ? parseInt(bookingDetails.extraKmsId) || 0 
        : bookingDetails.extraKmsId || 0;

      const requestPayload = {
        vehiclecategoryid: vehicleCategoryId,
        vehiclecategorytypeid: vehicleCategoryTypeId,
        pickuplocationid: pickupLocationId,
        pickupdate: pickupDate,
        pickuptime: bookingDetails.pickupTime,
        dropofflocationid: dropoffLocationId,
        dropoffdate: dropoffDate,
        dropofftime: bookingDetails.dropoffTime,
        ageid: ageid,
        bookingtype: 1,
        emailoption: 1,
        transmission: sessionData?.transmission || 0,
        insuranceid: insuranceid,
        extrakmsid: extrakmsid,
        customer: {
          firstname: customerInfo?.firstname || bookingDetails.customerFirstName || sessionData?.customerFirstName || "Guest",
          lastname: customerInfo?.lastname || bookingDetails.customerLastName || sessionData?.customerLastName || "Customer",
          email: customerInfo?.email || bookingDetails.customerEmail || sessionData?.customerEmail || "quote@example.com",
          phone: customerInfo?.phone || customerInfo?.mobile || bookingDetails.customerPhone || sessionData?.customerPhone || "",
          dateofbirth: customerInfo?.dateofbirth || bookingDetails.customerDob || sessionData?.customerDob || "",
          licenseexpires: customerInfo?.licenseexpires || bookingDetails.customerLicenseExpiry || sessionData?.customerLicenseExpiry || "",
          address: customerInfo?.address || bookingDetails.customerAddress || sessionData?.customerAddress || "",
          city: customerInfo?.city || "",
          state: customerInfo?.state || "",
          postcode: customerInfo?.postcode || ""
        }
      };
      
      console.log('Sending save quotation request with payload:', requestPayload);

      const bookingResponse = await rcmApi.request<RCMBookingResponse>('POST', 'booking', requestPayload);
      
      console.log('Complete API response from save quotation:', bookingResponse);

      if (bookingResponse.status === "OK") {
        toast.success("Quotation saved successfully!", {
          description: `Check your email for the quote details.`
        });
      } else {
        throw new Error(bookingResponse.error || "Failed to save quotation");
      }
    } catch (error) {
      console.error("Failed to save quotation:", error);
      toast.error("Failed to save quotation", {
        description: error instanceof Error ? error.message : "Please try again or contact support"
      });
    }
  };

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center py-8">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const amountToPay = paymentType === "deposit" ? DEPOSIT_AMOUNT : totalAmount;
      
      updateBookingData({
        paymentAmount: amountToPay,
        paymentType: paymentType
      });
      
      navigate("/payment");
    } catch (error) {
      console.error("Error processing payment option:", error);
      toast.error("An error occurred", {
        description: "Could not proceed with payment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Payment Options</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          {bookingDetails?.vehicleImage && !imageError ? (
            <div className="w-full mb-6">
              <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={bookingDetails.vehicleImage}
                  alt={bookingDetails.vehicleName}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              </AspectRatio>
            </div>
          ) : (
            <div className="w-full mb-6">
              <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-300" />
              </AspectRatio>
            </div>
          )}

          <RentalDetails
            vehicleName={bookingDetails?.vehicleName || ""}
            pickupLocationName={bookingDetails?.pickupLocationName || ""}
            dropoffLocationName={bookingDetails?.dropoffLocationName || ""}
            formattedPickupDate={bookingDetails?.pickupDate || ""}
            formattedDropoffDate={bookingDetails?.dropoffDate || ""}
            pickupTime={bookingDetails?.pickupTime || ""}
            dropoffTime={bookingDetails?.dropoffTime || ""}
            rentalDuration={rentalDays}
          />

          <PaymentSummary
            rentalDays={rentalDays}
            dailyRate={bookingDetails?.basePrice || 0}
            insuranceName={bookingDetails?.insuranceName}
            insurancePrice={bookingDetails?.insurancePrice}
            extraKmsName={bookingDetails?.extraKmsName}
            extraKmsPrice={bookingDetails?.extraKmsPrice}
            selectedExtras={bookingDetails?.selectedExtras}
            mandatoryFees={bookingDetails?.mandatoryFees}
            totalCost={totalAmount}
            payment={paymentType === "deposit" ? DEPOSIT_AMOUNT : totalAmount}
            balanceDue={paymentType === "deposit" ? totalAmount - DEPOSIT_AMOUNT : 0}
          />
          
          <div className="mb-6">
            <RadioGroup 
              value={paymentType} 
              onValueChange={(value) => setPaymentType(value as "deposit" | "full")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="full" id="payment-full" />
                <Label htmlFor="payment-full" className="flex-grow cursor-pointer">
                  <div className="font-medium">Pay in Full</div>
                  <div className="text-sm text-gray-600">Pay {formatCurrency(totalAmount)} now</div>
                </Label>
                <div className="font-bold">{formatCurrency(totalAmount)}</div>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="deposit" id="payment-deposit" />
                <Label htmlFor="payment-deposit" className="flex-grow cursor-pointer">
                  <div className="font-medium">Pay Deposit</div>
                  <div className="text-sm text-gray-600">
                    Pay {formatCurrency(DEPOSIT_AMOUNT)} now, {formatCurrency(totalAmount - DEPOSIT_AMOUNT)} at pickup
                  </div>
                </Label>
                <div className="font-bold">{formatCurrency(DEPOSIT_AMOUNT)}</div>
              </div>
            </RadioGroup>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">◌</span> Processing...
                </>
              ) : (
                `Proceed to Pay ${paymentType === "deposit" ? formatCurrency(DEPOSIT_AMOUNT) : formatCurrency(totalAmount)}`
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleSaveQuotation}
              className="w-full"
            >
              <Save className="mr-2" />
              Save Quotation
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
