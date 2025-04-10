
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we'll use a placeholder payment URL
  // In a real implementation, this would be generated from your payment provider
  const DEMO_PAYMENT_URL = "https://example.com/payment";

  useEffect(() => {
    // Get booking data from session
    const bookingData = getBookingData();
    
    if (!bookingData) {
      setError("No booking information found");
      return;
    }
    
    // In a real implementation, you would:
    // 1. Create a payment session with your payment provider
    // 2. Get the payment URL from the response
    // 3. Set the payment URL in the state
    
    // For demo purposes, we'll simulate a payment URL after a delay
    const timer = setTimeout(() => {
      setPaymentUrl(DEMO_PAYMENT_URL);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handlePaymentComplete = () => {
    // For demo purposes - in production this would be handled by the payment provider's callbacks
    // Clear booking data as it's no longer needed
    clearBookingData();
    navigate("/payment-success");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">{error}</p>
          <p className="mt-2">Please start a new booking.</p>
        </div>
        <Button 
          onClick={() => navigate("/")}
          className="mt-4"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <LoaderCircle className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-lg">Preparing Payment Gateway...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <iframe 
                  src={paymentUrl}
                  title="Payment Gateway"
                  className="w-full h-full"
                  onLoad={() => console.log("Payment iframe loaded")}
                />
              </div>
              
              {/* For demo purposes only - in production these would be handled by the payment provider */}
              <div className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handlePaymentComplete}>
                  Simulate Payment Complete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
