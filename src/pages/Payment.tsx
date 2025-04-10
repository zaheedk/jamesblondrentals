
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // In a real implementation, you would generate this URL from your payment provider API
  // For Windcave, this would be the URL returned from the payment creation API
  const WINDCAVE_PAYMENT_URL = "https://sec.windcave.com/pxmi3/EF4054F622D6C4C1BCABA908582B2E191A35B4C818154175";

  useEffect(() => {
    // Get booking data from session
    const bookingData = getBookingData();
    
    if (!bookingData) {
      setError("No booking information found");
      return;
    }
    
    // In a real implementation, you would:
    // 1. Call your backend API to create a payment session with Windcave
    // 2. Get the payment URL from the response
    // 3. Set the payment URL in the state
    
    // For demo purposes, we'll simulate a Windcave payment URL after a delay
    const timer = setTimeout(() => {
      setPaymentUrl(WINDCAVE_PAYMENT_URL);
      setIsLoading(false);
    }, 1500);
    
    // Add event listener for payment messages
    window.addEventListener("message", handlePaymentMessage);
    
    // Prevent users from accidentally navigating away during payment
    window.onbeforeunload = () => {
      return "Are you sure you want to leave? Your booking is not completed yet.";
    };
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", handlePaymentMessage);
      window.onbeforeunload = null;
    };
  }, []);

  // Function to handle payment messages from iframe
  const handlePaymentMessage = (event: MessageEvent) => {
    // For Windcave, you need to check the origin and data structure
    // Replace with your actual Windcave domain in production
    if (event.origin !== "https://sec.windcave.com") return;
    
    try {
      // Check if the message contains Windcave result data
      if (event.data && event.data.WindcaveResult) {
        // Process Windcave payment result
        checkPaymentStatus(event.data.WindcaveResult);
      }
    } catch (error) {
      console.error("Error processing payment message:", error);
    }
  };

  // Function to check payment status with your backend
  const checkPaymentStatus = (windcaveResult: any) => {
    // In a real implementation, you would:
    // 1. Call your backend API to verify the payment status
    // 2. Handle success/failure based on the response
    
    // For demo purposes, we'll simulate a successful payment
    console.log("Processing Windcave payment result:", windcaveResult);
    handlePaymentComplete();
  };

  const handlePaymentComplete = () => {
    // For demo purposes - in production this would be handled by verifying the payment status
    toast.success("Payment processed successfully");
    navigate("/payment-success");
  };
  
  const handlePaymentFailed = () => {
    toast.error("Payment failed. Please try again.");
  };

  const handleCancel = () => {
    window.onbeforeunload = null;
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
              <p className="text-lg">Preparing Windcave Payment Gateway...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <iframe 
                  src={paymentUrl}
                  title="Windcave Payment Gateway"
                  className="w-full h-full"
                  onLoad={() => console.log("Windcave payment iframe loaded")}
                  // Allow necessary permissions for payment gateway
                  allow="payment"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
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
