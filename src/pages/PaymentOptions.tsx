import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

const DEPOSIT_AMOUNT = 1;

const PaymentOptions = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("full");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

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
    
    // Calculate total amount including base price, insurance, extras, and mandatory fees
    const basePrice = bookingData.basePrice || 174.90;
    const insurancePrice = bookingData.insurancePrice || 0;
    const extrasTotal = (bookingData.selectedExtras || []).reduce(
      (sum: number, extra: any) => sum + (extra.price * extra.quantity), 
      0
    );
    const mandatoryFeesTotal = 500; // Security Bond
    
    const calculatedTotal = basePrice + insurancePrice + extrasTotal + mandatoryFeesTotal;
    setTotalAmount(calculatedTotal);
  }, [navigate]);

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

  const fullAmount = totalAmount;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const amountToPay = paymentType === "deposit" ? DEPOSIT_AMOUNT : fullAmount;
      
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Vehicle Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Vehicle:</span> {bookingDetails.vehicleName}</p>
                <p><span className="font-medium">Pickup:</span> {bookingDetails.pickupDate} at {bookingDetails.pickupTime}</p>
                <p><span className="font-medium">Return:</span> {bookingDetails.dropoffDate} at {bookingDetails.dropoffTime}</p>
              </div>
              <div>
                <p><span className="font-medium">Base Amount:</span> {formatCurrency(bookingDetails.basePrice || 174.90)}</p>
                {bookingDetails.insurancePrice > 0 && (
                  <p><span className="font-medium">Insurance:</span> {formatCurrency(bookingDetails.insurancePrice)}</p>
                )}
                {bookingDetails.selectedExtras?.length > 0 && (
                  <p><span className="font-medium">Extras:</span> {formatCurrency(bookingDetails.selectedExtras.reduce(
                    (sum: number, extra: any) => sum + (extra.price * extra.quantity), 
                    0
                  ))}</p>
                )}
                <p><span className="font-medium">Security Bond:</span> {formatCurrency(500)}</p>
                <p className="font-medium mt-2 text-lg">Total Amount: {formatCurrency(fullAmount)}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Choose Payment Option</h2>
              
              <RadioGroup
                value={paymentType}
                onValueChange={(value) => setPaymentType(value as "deposit" | "full")}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="deposit" id="deposit" />
                  <Label htmlFor="deposit" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Pay Deposit Only</p>
                      <p className="text-gray-600 text-sm">Pay {formatCurrency(DEPOSIT_AMOUNT)} now and the remaining {formatCurrency(fullAmount - DEPOSIT_AMOUNT)} upon collection</p>
                    </div>
                  </Label>
                  <div className="text-lg font-semibold">{formatCurrency(DEPOSIT_AMOUNT)}</div>
                </div>
                
                <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Pay Full Amount</p>
                      <p className="text-gray-600 text-sm">Pay the full amount now</p>
                    </div>
                  </Label>
                  <div className="text-lg font-semibold">{formatCurrency(fullAmount)}</div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Back
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
                  `Proceed to Pay ${paymentType === "deposit" ? formatCurrency(DEPOSIT_AMOUNT) : formatCurrency(fullAmount)}`
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
