import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { LoaderCircle, CreditCard, AlertCircle, ExternalLink, Info, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [showResponseData, setShowResponseData] = useState(false);
  const [apiConnectionFailed, setApiConnectionFailed] = useState(false);
  
  const WINDCAVE_PAYMENT_URL = "https://sec.windcave.com/pxmi3/EF4054F622D6C4C1BCABA908582B2E191A35B4C818154175";

  useEffect(() => {
    const bookingData = getBookingData();
    
    if (!bookingData) {
      setError("No booking information found");
      setIsLoading(false);
      return;
    }
    
    const createPayment = async () => {
      try {
        const returnUrl = encodeURIComponent(`${window.location.origin}/payment-success`);
        console.log('Return URL (encoded):', returnUrl);
        
        const requestPayload = {
          "method": "createdpspayment",
          "reservationref": bookingData.vehicleId,
          "amount": bookingData.basePrice,
          "returnurl": returnUrl
        };
        
        setTimeout(() => {
          try {
            if (Math.random() > 0.7) {
              throw new Error("Simulated API failure");
            }
            
            const simulatedResponse = {
              data: JSON.stringify({
                status: "OK",
                url: WINDCAVE_PAYMENT_URL,
                transactionId: "TX" + Math.floor(Math.random() * 1000000),
                merchantReference: "REF" + Math.floor(Math.random() * 1000000),
                timestamp: new Date().toISOString()
              })
            };
            
            const data = JSON.parse(simulatedResponse.data);
            console.log('Payment session created:', data);
            
            setResponseData({
              request: requestPayload,
              response: data
            });
            
            if (data.status === "OK") {
              const validatedUrl = validatePaymentUrl(data.url);
              setPaymentUrl(validatedUrl);
            } else {
              setError("Failed to create payment session");
              setApiConnectionFailed(true);
            }
            
            setIsLoading(false);
          } catch (error) {
            console.error("Simulated API error:", error);
            setApiConnectionFailed(true);
            setResponseData({
              request: requestPayload,
              response: {
                status: "ERROR",
                error: "API connection failure",
                message: "Could not establish connection to payment provider"
              }
            });
            setIsLoading(false);
          }
        }, 1500);
      } catch (err) {
        console.error("Error creating payment:", err);
        setError("An error occurred while setting up the payment");
        setApiConnectionFailed(true);
        setIsLoading(false);
      }
    };
    
    createPayment();
  }, []);

  const validatePaymentUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch (e) {
      console.error("Invalid payment URL:", url, e);
      toast.error("Invalid payment URL received from server");
      return WINDCAVE_PAYMENT_URL;
    }
  };

  const toggleResponseData = () => {
    setShowResponseData(prev => !prev);
  };

  const handleRedirectToPayment = () => {
    try {
      if (!paymentUrl) {
        toast.error("Payment URL not available");
        return;
      }
      
      toast.info("Redirecting to payment gateway...");
      
      const validUrl = validatePaymentUrl(paymentUrl);
      
      const newWindow = window.open(validUrl, "_blank", "noopener,noreferrer");
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        toast.error("Popup was blocked by browser");
        window.location.href = validUrl;
      }
    } catch (error) {
      console.error("Error redirecting to payment gateway:", error);
      toast.error("Failed to redirect to payment gateway");
    }
  };
  
  const openPaymentPopup = () => {
    try {
      if (!paymentUrl) {
        toast.error("Payment URL not available");
        return;
      }
      
      const validUrl = validatePaymentUrl(paymentUrl);
      
      const width = 800;
      const height = 700;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      const popupFeatures = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,status=yes,toolbar=no`;
      console.log("Opening popup with URL:", validUrl);
      console.log("Popup features:", popupFeatures);
      
      const popup = window.open(
        validUrl,
        "WindcavePayment",
        popupFeatures
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        toast.error("Popup blocked by browser");
        window.location.href = validUrl;
        return;
      }
      
      toast.info("Payment window opened");
      
      const checkPopupInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupInterval);
          toast.info("Payment window closed");
        }
      }, 1000);
    } catch (error) {
      console.error("Error opening payment popup:", error);
      toast.error("Failed to open payment window");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSimulateComplete = () => {
    toast.success("Payment processed successfully");
    navigate("/payment-success");
  };

  const showDiagnosticInfo = () => {
    const diagnosticInfo = {
      userAgent: navigator.userAgent,
      windowSize: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      },
      location: {
        origin: window.location.origin,
        pathname: window.location.pathname,
        href: window.location.href
      },
      paymentUrl: paymentUrl
    };
    
    console.log("Diagnostic info:", diagnosticInfo);
    
    setResponseData(prev => ({
      ...prev,
      diagnosticInfo
    }));
    
    setShowResponseData(true);
    
    toast.info("Browser diagnostic information collected");
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
              {apiConnectionFailed && (
                <Alert variant="destructive" className="mb-4">
                  <WifiOff className="h-4 w-4 mr-2" />
                  <AlertTitle>API Connection Error</AlertTitle>
                  <AlertDescription>
                    We're experiencing difficulty connecting to the payment provider's API. 
                    This application is running in demonstration mode with simulated data.
                    <p className="mt-2 font-medium">
                      Actual API access requires proper network configuration and authorization.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              
              {responseData && (
                <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      Payment Request/Response Data
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={showDiagnosticInfo}
                      >
                        Show Diagnostic Info
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleResponseData}
                      >
                        {showResponseData ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                  </div>
                  
                  {showResponseData && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Request Payload:</h4>
                        <div className="bg-gray-100 p-3 rounded overflow-auto max-h-40">
                          <pre className="text-xs">
                            {JSON.stringify(responseData.request, null, 2)}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Response Data:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Field</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {responseData.response && Object.entries(responseData.response).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium">{key}</TableCell>
                                <TableCell>{String(value)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {responseData.diagnosticInfo && (
                        <div>
                          <h4 className="font-medium mb-2">Diagnostic Information:</h4>
                          <div className="bg-gray-100 p-3 rounded overflow-auto max-h-60">
                            <pre className="text-xs">
                              {JSON.stringify(responseData.diagnosticInfo, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h2>
                
                <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>
                      {apiConnectionFailed 
                        ? "Running in demo mode. No actual payment will be processed."
                        : "Windcave reported a 'bad URL' error. This may be due to URL formatting or parameters."}
                    </span>
                  </div>
                </Alert>
                
                <div className="text-gray-700 space-y-4">
                  <p>You can complete your payment using one of the following methods:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-2">Option 1: Payment in New Window</h3>
                      <p className="text-sm mb-3">Complete your payment in a popup window.</p>
                      <Button 
                        onClick={openPaymentPopup}
                        variant="outline"
                        className="w-full"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay in Popup Window
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-2">Option 2: Go to Payment Page</h3>
                      <p className="text-sm mb-3">Open Windcave's secure payment page in a new tab.</p>
                      <Button 
                        onClick={handleRedirectToPayment}
                        className="w-full"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Payment Page
                      </Button>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
                    <div className="flex flex-col space-y-2">
                      <p><span className="font-medium">Important:</span> After payment is complete, please return to this page.</p>
                      <p className="text-sm italic">Note: This is a demonstration application. No actual payment will be processed.</p>
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
