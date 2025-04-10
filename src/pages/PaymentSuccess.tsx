import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FrownIcon } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import { rcmApi } from "@/lib/api/rcm-api";

interface BookingDetails {
  vehicleName: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  paymentAmount: number;
  basePrice: number;
  paymentType?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerDob?: string;
  customerLicenseExpiry?: string;
  customerAddress?: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [windcaveResponseDetails, setWindcaveResponseDetails] = useState<{
    amount?: number;
    transactionDate?: string;
    status?: string;
    transactionId?: string;
    cardDetails?: {
      cardholder?: string;
      payType?: string;
      cardNumber?: string;
    };
  }>({});

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        
        const queryParams = new URLSearchParams(location.search);
        const result = queryParams.get("result");
        const txnId = queryParams.get("txnId") || "N/A";
        const reservationRef = queryParams.get("reservationRef");
        
        setTransactionId(txnId);
        
        if (result === "failed" || queryParams.get("error")) {
          setPaymentStatus("failed");
          setErrorMessage(queryParams.get("message") || "Your payment was not successful. Please try again.");
          toast.error("Payment Failed", {
            description: queryParams.get("message") || "Your payment was not successful. Please try again."
          });
        } else if (result === "cancelled") {
          setPaymentStatus("failed");
          setErrorMessage("You cancelled the payment process.");
          toast.error("Payment Cancelled", {
            description: "You cancelled the payment process."
          });
        } else {
          setPaymentStatus("success");
          clearBookingData();
          toast.success("Payment Successful", {
            description: "Your booking has been confirmed."
          });
        }
        
        const sessionBookingData = getBookingData();
        
        if (reservationRef && (!sessionBookingData || reservationRef !== sessionBookingData.reservationRef)) {
          console.log("Fetching booking details using reservation reference:", reservationRef);
          
          try {
            const requestPayload = {
              method: "getreservation",
              reservationref: reservationRef
            };
            
            const response = await rcmApi.request('POST', 'getreservation', requestPayload);
            
            const typedResponse = response as { status: string, results?: any };
            
            console.log("Booking details response:", typedResponse);
            
            if (typedResponse && typedResponse.status === "OK" && typedResponse.results) {
              const apiBookingDetails = mapApiResponseToBookingDetails(typedResponse.results, reservationRef);
              setBookingDetails(apiBookingDetails);
            } else {
              throw new Error("Failed to fetch booking details");
            }
          } catch (error) {
            console.error("Error fetching booking details:", error);
            if (sessionBookingData) {
              const convertedDetails: BookingDetails = {
                vehicleName: sessionBookingData.vehicleName || 'Vehicle',
                pickupDate: sessionBookingData.pickupDate,
                pickupTime: sessionBookingData.pickupTime, 
                dropoffDate: sessionBookingData.dropoffDate,
                dropoffTime: sessionBookingData.dropoffTime,
                paymentAmount: sessionBookingData.paymentAmount || 0,
                basePrice: sessionBookingData.basePrice || 0,
                paymentType: sessionBookingData.paymentType,
                customerFirstName: sessionBookingData.customerFirstName,
                customerLastName: sessionBookingData.customerLastName,
                customerEmail: sessionBookingData.customerEmail,
                customerPhone: sessionBookingData.customerPhone,
                customerDob: sessionBookingData.customerDob,
                customerLicenseExpiry: sessionBookingData.customerLicenseExpiry,
                customerAddress: sessionBookingData.customerAddress
              };
              setBookingDetails(convertedDetails);
            }
          }
        } else if (sessionBookingData) {
          const convertedDetails: BookingDetails = {
            vehicleName: sessionBookingData.vehicleName || 'Vehicle',
            pickupDate: sessionBookingData.pickupDate,
            pickupTime: sessionBookingData.pickupTime, 
            dropoffDate: sessionBookingData.dropoffDate,
            dropoffTime: sessionBookingData.dropoffTime,
            paymentAmount: sessionBookingData.paymentAmount || 0,
            basePrice: sessionBookingData.basePrice || 0,
            paymentType: sessionBookingData.paymentType,
            customerFirstName: sessionBookingData.customerFirstName,
            customerLastName: sessionBookingData.customerLastName,
            customerEmail: sessionBookingData.customerEmail,
            customerPhone: sessionBookingData.customerPhone,
            customerDob: sessionBookingData.customerDob,
            customerLicenseExpiry: sessionBookingData.customerLicenseExpiry,
            customerAddress: sessionBookingData.customerAddress
          };
          setBookingDetails(convertedDetails);
        }
        
        const windcaveResponse = queryParams.get("windcaveResponse");
        
        if (windcaveResponse) {
          try {
            const parsedResponse = JSON.parse(decodeURIComponent(windcaveResponse));
            console.log("Full Windcave Response:", parsedResponse);
            
            setWindcaveResponseDetails({
              amount: parsedResponse.results?.Amount,
              transactionDate: parsedResponse.results?.TransactionDate,
              status: parsedResponse.results?.Status,
              transactionId: parsedResponse.results?.TransactionId,
              cardDetails: {
                cardholder: parsedResponse.results?.Card?.Cardholder,
                payType: parsedResponse.results?.Card?.PayType,
                cardNumber: parsedResponse.results?.Card?.CardNumber
              }
            });
          } catch (parseError) {
            console.error("Error parsing Windcave response:", parseError);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchBookingDetails:", error);
        setIsLoading(false);
        toast.error("Error", {
          description: "Failed to load booking details."
        });
      }
    };
    
    fetchBookingDetails();
  }, [navigate, location]);
  
  const mapApiResponseToBookingDetails = (apiResponse: any, reservationRef: string): BookingDetails => {
    return {
      vehicleName: apiResponse.vehicleName || apiResponse.vehiclecategory || "Vehicle",
      pickupDate: apiResponse.pickupdate || "N/A",
      pickupTime: apiResponse.pickuptime || "N/A",
      dropoffDate: apiResponse.dropoffdate || "N/A",
      dropoffTime: apiResponse.dropofftime || "N/A",
      paymentAmount: parseFloat(apiResponse.totalamount) || 0,
      basePrice: parseFloat(apiResponse.totalamount) || 0,
      customerFirstName: apiResponse.firstname || "N/A",
      customerLastName: apiResponse.lastname || "N/A",
      customerEmail: apiResponse.email || "N/A",
      customerPhone: apiResponse.phone || apiResponse.mobile || "N/A",
      customerDob: apiResponse.dateofbirth || "N/A",
      customerLicenseExpiry: apiResponse.licenseexpires || "N/A",
      customerAddress: apiResponse.address || "N/A"
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Booking Details Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't retrieve your booking details. If you've just completed a booking,
            please contact customer support with your transaction ID.
          </p>
          <p className="text-gray-600 mb-6">Transaction ID: {transactionId}</p>
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const customerDetails = {
    firstName: bookingDetails.customerFirstName || "Not provided",
    lastName: bookingDetails.customerLastName || "Not provided",
    email: bookingDetails.customerEmail || "Not provided",
    phone: bookingDetails.customerPhone || "Not provided",
    dob: bookingDetails.customerDob || "Not provided",
    licenseExpiry: bookingDetails.customerLicenseExpiry || "Not provided",
    address: bookingDetails.customerAddress || "Not provided"
  };

  const renderWindcavePaymentDetails = () => {
    if (!windcaveResponseDetails.status) return null;

    return (
      <div className="bg-gray-100 rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold mb-2">Payment Transaction Details</h3>
        <div className="space-y-2">
          <p><strong>Status:</strong> {windcaveResponseDetails.status}</p>
          <p><strong>Amount:</strong> ${windcaveResponseDetails.amount?.toFixed(2)}</p>
          <p><strong>Transaction ID:</strong> {windcaveResponseDetails.transactionId}</p>
          <p><strong>Transaction Date:</strong> {windcaveResponseDetails.transactionDate}</p>
          {windcaveResponseDetails.cardDetails && (
            <div>
              <h4 className="font-medium mt-2">Card Details</h4>
              <p><strong>Cardholder:</strong> {windcaveResponseDetails.cardDetails.cardholder}</p>
              <p><strong>Card Number:</strong> {windcaveResponseDetails.cardDetails.cardNumber}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {paymentStatus === "success" ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your booking. Your reservation is confirmed.
            </p>
            <p className="text-gray-600 mb-8">
              A confirmation email has been sent to your email address.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-6">Payment Request Failed</h1>
            <div className="bg-red-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FrownIcon className="h-12 w-12 text-red-500" />
            </div>
            <p className="text-xl font-medium mb-8">Failed Payment</p>
            
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Transaction Number</h2>
              <p className="text-lg mb-6">{transactionId || "0000000000"}</p>
              
              <h2 className="text-2xl font-bold mb-4">Customer Request Details</h2>
              
              <div className="space-y-2 text-left max-w-md mx-auto">
                <p><span className="font-medium">First Name: </span>{customerDetails.firstName}</p>
                <p><span className="font-medium">Last Name: </span>{customerDetails.lastName}</p>
                <p><span className="font-medium">Email - ID: </span>{customerDetails.email}</p>
                <p><span className="font-medium">Mobile No: </span>{customerDetails.phone}</p>
                <p><span className="font-medium">Date of Birth: </span>{customerDetails.dob}</p>
                <p><span className="font-medium">License Expires: </span>{customerDetails.licenseExpiry}</p>
                <p><span className="font-medium">Full Address: </span>{customerDetails.address}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
              <Button 
                onClick={() => navigate("/payment")}
                className="bg-[#342F63] hover:bg-[#25224A] text-white px-8 py-2 rounded-full text-lg"
              >
                TRY AGAIN
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate("/payment-options")}
                className="bg-[#342F63] hover:bg-[#25224A] text-white px-8 py-2 rounded-full text-lg"
              >
                SAVE QUOTATION
              </Button>
            </div>
            
            <p className="text-red-500 mt-4">Note :- Please filled Valid details</p>
          </>
        )}
        
        {paymentStatus === "success" && (
          <>
            <div className="text-left mb-8 border-t border-b py-4">
              <div className="flex justify-between py-2">
                <span className="font-medium">Vehicle:</span> 
                <span>{bookingDetails.vehicleName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Pickup Date:</span> 
                <span>{bookingDetails.pickupDate} at {bookingDetails.pickupTime}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Return Date:</span> 
                <span>{bookingDetails.dropoffDate} at {bookingDetails.dropoffTime}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Payment Amount:</span> 
                <span>{formatCurrency(bookingDetails.paymentAmount || bookingDetails.basePrice)}</span>
              </div>
              {bookingDetails.paymentType === "deposit" && (
                <div className="flex justify-between py-2">
                  <span className="font-medium">Balance Due:</span> 
                  <span>{formatCurrency(bookingDetails.basePrice - bookingDetails.paymentAmount)}</span>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </>
        )}
        
        {renderWindcavePaymentDetails()}
      </div>
    </div>
  );
};

export default PaymentSuccess;
