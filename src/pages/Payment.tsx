
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { LoaderCircle, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // In a real implementation, this URL would come from your backend API
  const WINDCAVE_PAYMENT_URL = "https://sec.windcave.com/pxmi3/EF4054F622D6C4C1BCABA908582B2E191A35B4C818154175";

  useEffect(() => {
    // Get booking data from session
    const bookingData = getBookingData();
    
    if (!bookingData) {
      setError("No booking information found");
      setIsLoading(false);
      return;
    }
    
    // In a real implementation, you would:
    // 1. Call your backend API to create a payment session with Windcave
    // 2. Get the payment URL from the response
    
    // For demo purposes, we'll simulate preparing a payment session after a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Function to handle redirect to Windcave payment page
  const handleRedirectToPayment = () => {
    try {
      toast.info("Redirecting to payment gateway...");
      // Immediately redirect to Windcave payment page
      window.location.href = WINDCAVE_PAYMENT_URL;
    } catch (error) {
      console.error("Error redirecting to payment gateway:", error);
      toast.error("Failed to redirect to payment gateway");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // For demo purposes only
  const handleSimulateComplete = () => {
    toast.success("Payment processed successfully");
    navigate("/payment-success");
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <p className="mt-2">Please start a new booking.</p>
          </AlertDescription>
        </Alert>
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
              <p className="text-lg">Preparing Windcave Payment Gateway...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h2>
                
                <div className="text-gray-700 space-y-4">
                  <p>You will be redirected to Windcave's secure payment page to complete your transaction.</p>
                  
                  <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                    <div className="flex flex-col space-y-2">
                      <p><span className="font-medium">Important:</span> Please do not close your browser during the payment process.</p>
                      <p><span className="font-medium">Note:</span> After payment is complete, you will be redirected back to our website.</p>
                    </div>
                  </Alert>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={handleRedirectToPayment}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Secure Payment
                  </Button>
                </div>
              </div>
              
              {/* For demo purposes only - in production these would be handled by the payment provider */}
              <div className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSimulateComplete}>
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
