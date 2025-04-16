import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { rcmApi } from "@/lib/api/rcm-api";
import type { RCMPaymentResponse, RCMPaymentConfirmationResponse } from "@/lib/api/rcm-api-types";
import moment from "moment";
import { useApiDiagnostics } from "@/hooks/use-api-diagnostics";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [apiConnectionFailed, setApiConnectionFailed] = useState(false);
  const bookingData = getBookingData();
  const { runDiagnostics } = useApiDiagnostics();
  
  const queryParams = new URLSearchParams(location.search);
  const windcaveResult = queryParams.get("result");
  
  useEffect(() => {
    const initializePage = async () => {
      // Initialize API with CORS proxy for published app
      if (window.location.hostname.includes('lovable.app') || window.location.hostname.includes('lovable.dev')) {
        console.log("Initializing API with CORS proxy for published app");
        rcmApi.initialize({
          useCorsProxy: true,
          useDirectApi: true,
          useMockData: false
        });
      }
      
      if (!bookingData) {
        toast.error("No booking information found", {
          description: "Please start a new booking.",
        });
        navigate("/");
        return;
      }
      
      if (windcaveResult) {
        await checkPaymentStatus(windcaveResult);
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
      
      await createPayment(reservationRef, paymentAmount);
    };
    
    initializePage();
  }, [navigate, bookingData, windcaveResult, location.search]);
  
  const createPayment = async (reservationRef: string | number | undefined, paymentAmount: number | undefined) => {
    try {
      const returnUrl = encodeURIComponent(`${window.location.origin}/payment`);
      console.log('Return URL (encoded):', returnUrl);
      
      const requestPayload = {
        method: "createdpspayment",
        reservationref: reservationRef,
        amount: paymentAmount,
        returnurl: returnUrl
      };

      console.log('Payment request payload:', requestPayload);

      // Run API diagnostics to check connection before making the request
      const diagnosticResult = await runDiagnostics();
      console.log('API diagnostics result:', diagnosticResult);
      
      if (!diagnosticResult.apiAccessible) {
        console.error('API connection is not available:', diagnosticResult.message);
        setApiConnectionFailed(true);
        setIsLoading(false);
        return;
      }

      const paymentSession = await rcmApi.createPaymentSession(requestPayload);
      
      console.log('Payment session created:', paymentSession);

      if (paymentSession.status === "OK" && paymentSession.results?.RedirectUrl) {
        window.location.href = paymentSession.results.RedirectUrl;
      } else {
        throw new Error('Invalid payment session response - missing RedirectUrl');
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      
      // If we get a CORS error, try falling back to mock data
      if (error instanceof Error && (error.message.includes("CORS") || error.message.includes("cors"))) {
        console.log("CORS error detected, trying alternative connection");
        
        try {
          // Try a different CORS proxy approach
          rcmApi.initialize({
            useCorsProxy: true,
            useDirectApi: true,
            useMockData: false
          });
          
          // Run diagnostics again to verify connection
          const retryDiagnostic = await runDiagnostics();
          if (retryDiagnostic.apiAccessible) {
            // If we restored connection, try again
            toast.info("Reconnected to payment gateway", {
              description: "Retrying payment creation..."
            });
            
            // Wait a moment before retrying
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            return;
          }
        } catch (retryError) {
          console.error("Error trying alternative connection:", retryError);
        }
      }
      
      toast.error("Payment Error", {
        description: "Failed to create payment session. Please try again.",
      });
      
      setApiConnectionFailed(true);
      setIsLoading(false);
    }
  };
  
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
      
      try {
        const response = await rcmApi.request<RCMPaymentResponse>('POST', 'getdpspayment', requestPayload);
        
        console.log('Payment status check response:', response);
        
        if (response && response.results) {
          const transactionId = response.results.TransactionId || 'N/A';
          
          let paymentStatus: "Approved" | "Failed" | "Pending" | "Unknown" = "Unknown";
          if (response.results.Status === "Approved") {
            paymentStatus = "Approved";
            try {
              await confirmPayment(response.results);
            } catch (confirmError) {
              console.error("Error confirming payment, but payment was approved:", confirmError);
              // Continue with success flow even if confirmation failed
            }
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
          
          // Add the Windcave response as a URL parameter for reference on the success page
          try {
            const windcaveResponseStr = encodeURIComponent(JSON.stringify(response));
            params.append('windcaveResponse', windcaveResponseStr);
          } catch (encodeError) {
            console.error("Error encoding Windcave response for URL:", encodeError);
          }
          
          if (response.results.Status !== 'Approved') {
            params.append('message', response.results.ResponseText || 'Payment failed');
          }
          
          navigate(`/payment-success?${params.toString()}`);
        } else {
          throw new Error('Invalid payment status response');
        }
      } catch (apiError) {
        console.error('Error checking payment status from API:', apiError);
        
        // If we hit a CORS error, pass through to success page and let it handle it
        const params = new URLSearchParams();
        if (windcaveResult.toLowerCase().includes('approved')) {
          params.append('result', 'success');
          params.append('txnId', 'CORS-ERROR');
          params.append('reservationRef', reservationRef.toString());
          params.append('error', 'cors');
        } else {
          params.append('result', 'failed');
          params.append('error', 'cors');
          params.append('message', 'Could not verify payment status due to connection issues. Please contact support.');
        }
        
        navigate(`/payment-success?${params.toString()}`);
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

  const handleRetry = async () => {
    setIsLoading(true);
    
    try {
      // Try different CORS proxy configurations
      const configurations = [
        // Try direct API with a CORS proxy
        { useCorsProxy: true, useDirectApi: true, useMockData: false },
        // Try different CORS proxy
        { useCorsProxy: true, useDirectApi: true, useMockData: false, corsProxyIndex: 1 },
        // Try another CORS proxy
        { useCorsProxy: true, useDirectApi: true, useMockData: false, corsProxyIndex: 2 },
      ];
      
      for (const config of configurations) {
        console.log("Trying API configuration:", config);
        rcmApi.initialize(config);
        
        // Test the connection
        const diagnosticResult = await runDiagnostics();
        console.log("API diagnostics result:", diagnosticResult);
        
        if (diagnosticResult.apiAccessible) {
          toast.success("API Connection Restored", {
            description: "Reconnected to payment gateway. Reloading..."
          });
          
          // Wait a moment before reloading
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }
      }
      
      // If all configurations failed
      toast.error("Connection Failed", {
        description: "Could not connect to payment gateway after multiple attempts."
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error during retry:", error);
      setIsLoading(false);
    }
  };

  const handleManualContinue = () => {
    // Forward any existing params
    const currentParams = new URLSearchParams(location.search);
    const forwardParams = new URLSearchParams();
    
    if (currentParams.has("result")) {
      forwardParams.append("result", currentParams.get("result") || "");
    } else {
      forwardParams.append("result", "success");
    }
    
    forwardParams.append("manual", "true");
    
    navigate(`/payment-success?${forwardParams.toString()}`);
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
          ) : apiConnectionFailed ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to connect to payment gateway.</p>
              <p className="mb-6">We're experiencing issues connecting to our payment provider due to CORS restrictions.</p>
              <div className="space-y-4">
                <Button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                  onClick={handleRetry}
                >
                  Try Alternative Connection
                </Button>
                
                <div>
                  <Button
                    variant="outline"
                    className="px-4 py-2 w-full"
                    onClick={() => navigate("/payment-options")}
                  >
                    Back to Payment Options
                  </Button>
                </div>
                
                <div>
                  <p className="text-gray-600 my-4">
                    If you completed payment in a separate window or received a confirmation email:
                  </p>
                  <Button 
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                    onClick={handleManualContinue}
                  >
                    Continue to Confirmation
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to connect to payment gateway.</p>
              <div className="space-y-4">
                <Button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleRetry}
                >
                  Try Again
                </Button>
                
                <div>
                  <Button
                    variant="outline"
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mt-4"
                    onClick={() => navigate("/payment-options")}
                  >
                    Back to Payment Options
                  </Button>
                </div>
                
                {process.env.NODE_ENV !== 'production' && (
                  <div>
                    <p className="text-gray-600 my-4">For development/testing purposes:</p>
                    <Button 
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={handleManualContinue}
                    >
                      Continue to Confirmation
                    </Button>
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
