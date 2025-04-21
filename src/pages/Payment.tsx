
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { rcmApi } from "@/lib/api/rcm-api";
import type { RCMPaymentResponse, RCMPaymentConfirmationResponse } from "@/lib/api/rcm-api-types";
import moment from "moment";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const bookingData = getBookingData();
  
  const queryParams = new URLSearchParams(location.search);
  const windcaveResult = queryParams.get("result");
  
  useEffect(() => {
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
      return;
    }
    
    if (windcaveResult) {
      checkPaymentStatus(windcaveResult);
      return;
    }
    
    const reservationRef = bookingData.reservationRef || 
                          bookingData.bookingReference || 
                          bookingData.confirmationNumber || 
                          bookingData.reservationNo ||
                          bookingData.vehicleId;
    
    console.log('Using reservation reference:', reservationRef);
    
    const paymentAmount = bookingData.paymentAmount || bookingData.basePrice;
    console.log('Payment amount:', paymentAmount);
    
    const createPayment = async () => {
      try {
        // Ensure we're using the absolute URL with origin to avoid routing issues
        const origin = window.location.origin;
        const returnUrl = encodeURIComponent(`${origin}/payment-success`);
        console.log('Return URL (encoded):', returnUrl);
        
        const requestPayload = {
          method: "createdpspayment",
          reservationref: reservationRef,
          amount: paymentAmount,
          returnurl: returnUrl
        };

        console.log('Payment request payload:', requestPayload);

        const paymentSession = await rcmApi.createPaymentSession(requestPayload);
        
        console.log('Payment session created:', paymentSession);

        if (paymentSession.status === "OK" && paymentSession.results?.RedirectUrl) {
          window.location.href = paymentSession.results.RedirectUrl;
        } else {
          throw new Error('Invalid payment session response - missing RedirectUrl');
        }
      } catch (error) {
        console.error('Error creating payment session:', error);
        toast.error("Payment Error", {
          description: "Failed to create payment session. Please try again.",
        });
        
        if (process.env.NODE_ENV !== 'production') {
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      }
    };

    createPayment();
  }, [navigate, bookingData, windcaveResult, location.search]);
  
  const checkPaymentStatus = async (windcaveResult: string) => {
    try {
      setIsLoading(true);
      console.log('Checking payment status with result:', windcaveResult);
      
      const reservationRef = bookingData?.reservationRef || 
                            bookingData?.bookingReference || 
                            bookingData?.confirmationNumber || 
                            bookingData?.reservationNo ||
                            bookingData?.vehicleId;
      
      if (!reservationRef) {
        throw new Error('No reservation reference found');
      }
      
      const requestPayload = {
        method: "getdpspayment",
        reservationref: reservationRef,
        result: windcaveResult
      };
      
      console.log('Payment status check payload:', requestPayload);
      
      const response = await rcmApi.request<RCMPaymentResponse>('POST', 'getdpspayment', requestPayload);
      
      console.log('Payment status check response:', response);
      
      if (response && response.results) {
        const transactionId = response.results.TransactionId || 'N/A';
        
        let paymentStatus: "Approved" | "Failed" | "Pending" | "Unknown" = "Unknown";
        if (response.results.Status === "Approved") {
          paymentStatus = "Approved";
          await confirmPayment(response.results);
        } else if (response.results.Status === "Failed") {
          paymentStatus = "Failed";
        } else if (response.results.Status === "Pending") {
          paymentStatus = "Pending";
        }
        
        updateBookingData({ 
          transactionId: transactionId,
          paymentStatus: paymentStatus,
          reservationRef: response.results.ReservationRef || reservationRef
        });
        
        const params = new URLSearchParams();
        params.append('result', response.results.Status === 'Approved' ? 'success' : 'failed');
        params.append('txnId', transactionId);
        params.append('reservationRef', response.results.ReservationRef || reservationRef);
        
        if (response.results.Status !== 'Approved') {
          params.append('message', response.results.ResponseText || 'Payment failed');
        }
        
        navigate(`/payment-success?${params.toString()}`);
      } else {
        throw new Error('Invalid payment status response');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      
      const params = new URLSearchParams();
      params.append('result', 'failed');
      params.append('error', 'true');
      params.append('message', error instanceof Error ? error.message : 'Unknown payment error');
      
      navigate(`/payment-success?${params.toString()}`);
    }
  };

  const confirmPayment = async (paymentInfo: any) => {
    try {
      console.log('Confirming payment with info:', paymentInfo);
      
      const reservationRef = bookingData?.reservationRef || 
                            bookingData?.bookingReference || 
                            bookingData?.confirmationNumber || 
                            bookingData?.reservationNo ||
                            bookingData?.vehicleId;
      
      if (!reservationRef) {
        throw new Error('No reservation reference found');
      }
      
      const requestPayload = {
        method: "confirmpayment",
        reservationref: reservationRef,
        amount: paymentInfo.Amount,
        success: true,
        paytype: 'Windcave',
        paydate: moment().format('DD/MM/YYYY'),
        supplierid: 2,
        transactid: paymentInfo.RebillingToken || '',
        dpstxnref: paymentInfo.TransactionId,
        paysource: 'Payment from website',
        transtype: "Payment"
      };
      
      console.log('Payment confirmation payload:', requestPayload);
      
      const response = await rcmApi.request<RCMPaymentConfirmationResponse>('POST', 'confirmpayment', requestPayload);
      
      console.log('Payment confirmation response:', response);
      
      if (response.status !== "OK") {
        console.error('Payment confirmation failed:', response.error);
        toast.error("Payment Confirmation Error", {
          description: "Payment was processed but confirmation failed. Please contact support.",
        });
      } else {
        console.log('Payment confirmed successfully');
      }
      
      return response;
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error("Payment Confirmation Error", {
        description: "Please contact support with your booking reference.",
      });
      throw error;
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    window.location.reload();
  };

  const handleManualContinue = () => {
    navigate("/payment-success");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Processing Payment</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Processing your payment...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your payment status.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to connect to payment gateway.</p>
              <div className="space-y-4">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
                
                <div>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mt-4"
                    onClick={() => navigate("/payment-options")}
                  >
                    Back to Payment Options
                  </button>
                </div>
                
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
