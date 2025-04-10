
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { rcmApi } from "@/lib/api/rcm-api";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const bookingData = getBookingData();
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
      return;
    }
    
    // Get the reservation reference with proper fallbacks
    // Priority: reservationRef > bookingReference > confirmationNumber > reservationNo
    const reservationRef = bookingData.reservationRef || 
                          bookingData.bookingReference || 
                          bookingData.confirmationNumber || 
                          bookingData.reservationNo ||
                          bookingData.vehicleId; // last resort fallback
    
    console.log('Using reservation reference:', reservationRef);
    
    const createPayment = async () => {
      try {
        const returnUrl = encodeURIComponent(`${window.location.origin}/payment-success`);
        console.log('Return URL (encoded):', returnUrl);
        
        const requestPayload = {
          method: "createdpspayment",
          reservationref: reservationRef,
          amount: bookingData.basePrice,
          returnurl: returnUrl
        };

        console.log('Payment request payload:', requestPayload);

        // Use the RCM API client instead of direct fetch
        const paymentSession = await rcmApi.createPaymentSession(requestPayload);
        
        console.log('Payment session created:', paymentSession);

        // Check for RedirectUrl in the results object
        if (paymentSession.status === "OK" && paymentSession.results?.RedirectUrl) {
          setPaymentUrl(paymentSession.results.RedirectUrl);
        } else {
          throw new Error('Invalid payment session response - missing RedirectUrl');
        }
      } catch (error) {
        console.error('Error creating payment session:', error);
        toast.error("Payment Error", {
          description: "Failed to create payment session. Please try again.",
        });
        
        // In case of error, add option to continue to success page for testing
        if (process.env.NODE_ENV !== 'production') {
          setTimeout(() => {
            setIsLoading(false);
            setPaymentUrl(null);
          }, 1000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    createPayment();
  }, [navigate, bookingData]);

  // Handler for iframe load errors
  const handleIframeError = () => {
    console.error('Payment iframe failed to load properly');
    setIframeError(true);
    toast.error("Payment Form Error", {
      description: "The payment form failed to load. Please try again or contact support.",
    });
  };

  const handleManualContinue = () => {
    navigate("/payment-success");
  };

  const refreshPaymentPage = () => {
    setIsLoading(true);
    setIframeError(false);
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Preparing secure payment...</p>
            </div>
          ) : paymentUrl && !iframeError ? (
            <div className="w-full">
              <div className="bg-blue-50 p-3 mb-4 rounded text-sm">
                <p>If the payment form doesn't load properly, try clicking the button below:</p>
                <div className="mt-2">
                  <a 
                    href={paymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Open Payment Form in New Tab
                  </a>
                </div>
              </div>
              <iframe 
                src={paymentUrl}
                className="w-full h-[600px] border-0"
                title="Payment Form"
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-modals"
                onError={handleIframeError}
              ></iframe>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">
                {iframeError 
                  ? "The payment form failed to load in this window." 
                  : "Failed to load payment form."}
              </p>
              <div className="space-y-4">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={refreshPaymentPage}
                >
                  Try Again
                </button>
                
                {iframeError && paymentUrl && (
                  <div className="mt-4">
                    <a 
                      href={paymentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Open Payment Form in New Tab
                    </a>
                  </div>
                )}
                
                {/* Add option to continue to success page for testing */}
                {process.env.NODE_ENV !== 'production' && (
                  <div>
                    <p className="text-gray-600 my-4">For development/testing purposes:</p>
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={handleManualContinue}
                    >
                      Continue to Confirmation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
