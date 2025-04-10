
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingData } from "@/lib/booking-session";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const bookingData = getBookingData();

  useEffect(() => {
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
      return;
    }
    
    const reservationRef = bookingData.reservationRef || 
                          bookingData.bookingReference || 
                          bookingData.confirmationNumber || 
                          bookingData.vehicleId;
    
    console.log('Using reservation reference:', reservationRef);
    
    const createPayment = async () => {
      try {
        const returnUrl = encodeURIComponent(`${window.location.origin}/payment-success`);
        console.log('Return URL (encoded):', returnUrl);
        
        const requestPayload = {
          "method": "createdpspayment",
          "reservationref": reservationRef,
          "amount": bookingData.basePrice,
          "returnurl": returnUrl
        };

        console.log('Payment request payload:', requestPayload);

        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          throw new Error(`Payment API error: ${response.status}`);
        }

        const paymentSession = await response.json();
        console.log('Payment session created:', paymentSession);

        if (paymentSession.status === "OK" && paymentSession.url) {
          setPaymentUrl(paymentSession.url);
        } else {
          throw new Error('Invalid payment session response');
        }
      } catch (error) {
        console.error('Error creating payment session:', error);
        toast.error("Payment Error", {
          description: "Failed to create payment session. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createPayment();
  }, [navigate, bookingData]);

  // Log diagnostic info for debugging
  useEffect(() => {
    if (paymentUrl) {
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
        paymentUrl
      };
      
      console.info('Diagnostic info:', diagnosticInfo);
    }
  }, [paymentUrl]);

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
          ) : paymentUrl ? (
            <div className="w-full">
              <iframe 
                src={paymentUrl}
                className="w-full h-[600px] border-0"
                title="Payment Form"
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
              ></iframe>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to load payment form.</p>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
