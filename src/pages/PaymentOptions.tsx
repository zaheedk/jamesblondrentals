import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Car } from "lucide-react";

const DEPOSIT_AMOUNT = 50;

const PaymentOptions = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("full");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mandatoryFeesTotal, setMandatoryFeesTotal] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const bookingData = getBookingData();
    
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
      return;
    }
    
    setBookingDetails(bookingData);
    
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
  }, [navigate]);

  const handleImageError = () => {
    console.log("Error loading vehicle image");
    setImageError(true);
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
      const amountToPay = paymentType === "deposit" ? DEPOSIT_AMOUNT : (totalAmount + mandatoryFeesTotal);
      
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
          
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/vehicles")}
                disabled={isLoading}
              >
                Back to Vehicles
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">◌</span> Processing...
                  </>
                ) : (
                  `Proceed to Pay ${paymentType === "deposit" ? formatCurrency(DEPOSIT_AMOUNT) : formatCurrency(totalAmount + mandatoryFeesTotal)}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
