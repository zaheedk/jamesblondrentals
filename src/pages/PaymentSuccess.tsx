
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { rcmApi } from "@/lib/api/rcm-api";
import { useApiDiagnostics } from "@/hooks/use-api-diagnostics";
import { 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Car, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  RefreshCw
} from "lucide-react";
import moment from "moment";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const result = queryParams.get("result");
  const txnId = queryParams.get("txnId");
  const message = queryParams.get("message");
  const reservationRef = queryParams.get("reservationRef");
  const isManual = queryParams.get("manual") === "true";
  const hasError = queryParams.get("error") === "true";
  const isCorsError = queryParams.get("error") === "cors";
  
  const bookingData = getBookingData();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const { runDiagnostics } = useApiDiagnostics();
  
  const isSuccess = result === "success" || result === "approved";
  
  // Extract Windcave response from URL parameter, if available
  const [windcaveResponse, setWindcaveResponse] = useState<any>(null);
  
  useEffect(() => {
    const windcaveResponseParam = queryParams.get("windcaveResponse");
    
    if (windcaveResponseParam) {
      try {
        const decodedResponse = decodeURIComponent(windcaveResponseParam);
        const parsedResponse = JSON.parse(decodedResponse);
        setWindcaveResponse(parsedResponse);
        console.log("Parsed Windcave response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing Windcave response from URL:", error);
      }
    }
  }, [queryParams]);
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      setIsLoadingDetails(true);
      
      try {
        // In case of CORS errors, initialize API with CORS proxy
        if (isCorsError || isManual || !bookingData) {
          console.log("Using CORS proxy due to previous errors or manual mode");
          rcmApi.initialize({
            useCorsProxy: true,
            useDirectApi: true,
            useMockData: false
          });
        }
        
        // If we have a valid booking reference, try to fetch the booking details
        if (reservationRef || 
            (bookingData && (bookingData.reservationRef || bookingData.bookingReference || bookingData.confirmationNumber))) {
          
          const bookingRef = reservationRef || 
                           bookingData?.reservationRef || 
                           bookingData?.bookingReference || 
                           bookingData?.confirmationNumber;
          
          console.log("Fetching booking details for:", bookingRef);
          
          // Try to fetch booking details
          try {
            // First check API connection
            await runDiagnostics();
            
            // If a transaction ID was provided in the URL, update the session
            if (txnId && bookingData) {
              console.log("Updating booking data with transaction ID:", txnId);
              updateBookingData({ 
                transactionId: txnId,
                paymentStatus: isSuccess ? "Approved" : "Failed",
                reservationRef: bookingRef
              });
            }
            
            console.log("Setting payment info from booking data");
            setPaymentInfo({
              transactionId: txnId || bookingData?.transactionId || "N/A",
              bookingReference: bookingRef,
              totalAmount: bookingData?.totalAmount || bookingData?.paymentAmount || 0,
              vehicleName: bookingData?.vehicleName || "Selected Vehicle",
              pickupDate: bookingData?.pickupDate,
              dropoffDate: bookingData?.dropoffDate,
              pickupLocation: bookingData?.pickupLocation,
              dropoffLocation: bookingData?.dropoffLocation
            });
          } catch (error) {
            console.error("Error fetching booking details:", error);
            // Fall back to session data
            setPaymentInfo({
              transactionId: txnId || bookingData?.transactionId || "N/A",
              bookingReference: bookingRef,
              totalAmount: bookingData?.totalAmount || bookingData?.paymentAmount || 0,
              vehicleName: bookingData?.vehicleName || "Selected Vehicle",
              pickupDate: bookingData?.pickupDate,
              dropoffDate: bookingData?.dropoffDate,
              pickupLocation: bookingData?.pickupLocation,
              dropoffLocation: bookingData?.dropoffLocation
            });
          }
        } else {
          console.log("No booking reference available, using session data");
          // Fall back to session data
          setPaymentInfo({
            transactionId: txnId || bookingData?.transactionId || "N/A",
            bookingReference: bookingData?.reservationRef || bookingData?.bookingReference || "Not available",
            totalAmount: bookingData?.totalAmount || bookingData?.paymentAmount || 0,
            vehicleName: bookingData?.vehicleName || "Selected Vehicle",
            pickupDate: bookingData?.pickupDate,
            dropoffDate: bookingData?.dropoffDate,
            pickupLocation: bookingData?.pickupLocation,
            dropoffLocation: bookingData?.dropoffLocation
          });
        }
      } catch (error) {
        console.error("Error in loadBookingDetails:", error);
        toast.error("Failed to load booking details");
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    loadBookingDetails();
  }, [reservationRef, txnId, isSuccess, bookingData, isCorsError, isManual, runDiagnostics]);
  
  // Function to format booking dates
  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return moment(date).format("ddd, MMM D, YYYY");
  };
  
  // Function to format booking times
  const formatTime = (date: string) => {
    if (!date) return "N/A";
    return moment(date).format("h:mm A");
  };
  
  const handleTryCorsFix = async () => {
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
            description: "Reconnected to API. Reloading page..."
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
        description: "Could not connect to API after multiple attempts."
      });
    } catch (error) {
      console.error("Error during retry:", error);
      toast.error("Failed to establish connection");
    }
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
    target.alt = 'Vehicle image not available';
  };
  
  // If no booking data and not manual mode, redirect to home
  if (!bookingData && !isManual && !isLoading) {
    navigate("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          {isSuccess ? (
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          ) : (
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              {hasError || isCorsError ? (
                <AlertCircle className="w-12 h-12 text-amber-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-2">
            {isSuccess ? "Payment Successful!" : hasError || isCorsError ? "Payment Status Uncertain" : "Payment Failed"}
          </h1>
          
          <p className="text-gray-600 max-w-lg mx-auto">
            {isSuccess 
              ? "Your payment has been processed and your booking is confirmed. Details of your booking are below."
              : isCorsError 
                ? "Due to technical limitations, we couldn't verify your payment status automatically. If you've completed payment, your booking has likely been confirmed."
                : hasError
                  ? "We encountered an error processing your payment status. If you completed payment, your booking may still be confirmed."
                  : message || "Your payment could not be completed. Please try again or contact customer support."}
          </p>
          
          {isCorsError && (
            <Button 
              onClick={handleTryCorsFix}
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again to Verify Payment
            </Button>
          )}
        </div>
        
        {isLoadingDetails ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Booking Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-1">Booking Reference</h3>
                    <p className="text-xl font-semibold">{paymentInfo?.bookingReference || "Not available"}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-1">Transaction ID</h3>
                    <p className="text-gray-800">{paymentInfo?.transactionId || "Not available"}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-1">Total Amount</h3>
                    <p className="text-xl font-bold">${parseFloat(paymentInfo?.totalAmount || 0).toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-5 flex items-start">
                    <Car className="mt-1 mr-2 flex-shrink-0 text-gray-500" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-700">Vehicle</h3>
                      <p className="text-gray-800">{paymentInfo?.vehicleName || "Selected Vehicle"}</p>
                    </div>
                  </div>
                  
                  <div className="mb-5 flex items-start">
                    <Calendar className="mt-1 mr-2 flex-shrink-0 text-gray-500" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-700">Rental Period</h3>
                      <p className="text-gray-800">
                        {formatDate(paymentInfo?.pickupDate)} - {formatDate(paymentInfo?.dropoffDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-5 flex items-start">
                    <Clock className="mt-1 mr-2 flex-shrink-0 text-gray-500" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-700">Pick-up Time</h3>
                      <p className="text-gray-800">{formatTime(paymentInfo?.pickupDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="mt-1 mr-2 flex-shrink-0 text-gray-500" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-700">Pick-up Location</h3>
                      <p className="text-gray-800">{paymentInfo?.pickupLocation || "Selected Location"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <div>
                    <p className="text-gray-600 mb-2">
                      {isSuccess 
                        ? "Your booking details have been sent to your email."
                        : isCorsError || hasError
                          ? "If payment was successful, you should receive a confirmation email."
                          : "You have not been charged for this booking."}
                    </p>
                    <p className="text-sm text-gray-500">
                      For assistance, please contact our customer support.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild>
                      <Link to="/">
                        Return to Home
                      </Link>
                    </Button>
                    
                    {isSuccess && (
                      <Button asChild>
                        <Link to="/vehicles">
                          Browse More Vehicles
                        </Link>
                      </Button>
                    )}
                    
                    {!isSuccess && !isManual && (
                      <Button asChild>
                        <Link to="/payment-options">
                          Try Again
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccess;
