
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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  
  // Fallback URL for demo purposes
  const WINDCAVE_PAYMENT_URL = "https://sec.windcave.com/pxmi3/EF4054F622D6C4C1BCABA908582B2E191A35B4C818154175";

  useEffect(() => {
    // Get booking data from session
    const bookingData = getBookingData();
    
    if (!bookingData) {
      setError("No booking information found");
      setIsLoading(false);
      return;
    }
    
    // In a real implementation, this would call your backend API
    // For demo purposes, we'll simulate the API call
    const simulateCreatePayment = async () => {
      try {
        // This simulates the code you provided
        const baseUrl = window.location.origin;
        console.log('Base URL:', baseUrl);
        
        // In a real implementation, you would make an actual API call like this:
        /*
        const response = await fetch("/api/RentalCarManagerApi/CreatedpsPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "method": "createdpspayment",
            "reservationref": bookingData.vehicleId,
            "amount": bookingData.basePrice,
            "returnurl": `${baseUrl}/payment-success`
          })
        });
        const responseData = await response.json();
        */
        
        // For demo, we'll simulate a successful response
        setTimeout(() => {
          // Simulate response with payment URL
          const simulatedResponse = {
            data: JSON.stringify({
              status: "OK",
              url: WINDCAVE_PAYMENT_URL
            })
          };
          
          const data = JSON.parse(simulatedResponse.data);
          console.log('Payment session created:', data);
          
          if (data.status === "OK") {
            setPaymentUrl(data.url);
          } else {
            setError("Failed to create payment session");
          }
          
          setIsLoading(false);
        }, 1500);
      } catch (err) {
        console.error("Error creating payment:", err);
        setError("An error occurred while setting up the payment");
        setIsLoading(false);
      }
    };
    
    simulateCreatePayment();
  }, []);

  // Show Windcave in an iframe
  const showWindcaveIframe = () => {
    if (!paymentUrl) {
      toast.error("Payment URL not available");
      return;
    }
    
    setShowIframe(true);
    toast.info("Loading payment form...");
  };

  // Redirect to Windcave payment page
  const handleRedirectToPayment = () => {
    try {
      if (!paymentUrl) {
        toast.error("Payment URL not available");
        return;
      }
      
      toast.info("Redirecting to payment gateway...");
      window.location.href = paymentUrl;
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
          ) : showIframe ? (
            <div className="space-y-4">
              <div className="relative h-[600px] w-full border rounded-lg overflow-hidden">
                <iframe 
                  src={paymentUrl || ""}
                  frameBorder="0" 
                  id="paymentIFrame" 
                  className="absolute inset-0 w-full h-full"
                  title="Windcave Payment"
                ></iframe>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setShowIframe(false)}>
                  Back
                </Button>
                <Button onClick={handleSimulateComplete}>
                  Simulate Payment Complete
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h2>
                
                <div className="text-gray-700 space-y-4">
                  <p>You can complete your payment using one of the following methods:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-2">Option 1: Embedded Payment Form</h3>
                      <p className="text-sm mb-3">Complete your payment without leaving this page.</p>
                      <Button 
                        onClick={showWindcaveIframe}
                        variant="outline"
                        className="w-full"
                      >
                        Pay in Embedded Form
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-2">Option 2: Redirect to Payment Page</h3>
                      <p className="text-sm mb-3">You will be redirected to Windcave's secure payment page.</p>
                      <Button 
                        onClick={handleRedirectToPayment}
                        className="w-full"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Go to Payment Page
                      </Button>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
                    <div className="flex flex-col space-y-2">
                      <p><span className="font-medium">Important:</span> After payment is complete, you will be redirected back to our website.</p>
                    </div>
                  </Alert>
                </div>
              </div>
              
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
