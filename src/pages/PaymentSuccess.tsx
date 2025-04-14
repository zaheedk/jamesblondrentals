
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FrownIcon, Calendar, Shield, Package } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import { rcmApi } from "@/lib/api/rcm-api";
import { differenceInDays, parseISO, isValid } from "date-fns";
import BookingSummary from "@/components/booking/BookingSummary";

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
  reservationRef?: string;
  vehicleImage?: string;
  insuranceName?: string;
  insurancePrice?: number;
  selectedExtras?: Array<{name: string; quantity: number; price: number}>;
  extraKmsName?: string;
  extraKmsPrice?: number;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rentalDuration, setRentalDuration] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [windcaveResponseDetails, setWindcaveResponseDetails] = useState<{
    amount?: number;
    transactionDate?: string;
    status?: string;
    transactionId?: string;
    reservationRef?: string;
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
        
        console.log("URL Parameters:", {
          result,
          txnId,
          reservationRef
        });
        
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
        console.log("Session booking data:", sessionBookingData);
        
        const windcaveResponse = queryParams.get("windcaveResponse");
        let parsedWindcaveResponse: any = null;
        
        if (windcaveResponse) {
          try {
            parsedWindcaveResponse = JSON.parse(decodeURIComponent(windcaveResponse));
            console.log("Full Windcave Response:", parsedWindcaveResponse);
            
            const windcaveReservationRef = parsedWindcaveResponse.results?.ReservationRef || 
                                          parsedWindcaveResponse.ReservationRef;
            
            console.log("Windcave Reservation Ref:", windcaveReservationRef);
            
            if (windcaveReservationRef && (!reservationRef || windcaveReservationRef !== reservationRef)) {
              console.log("Using reservation reference from Windcave response:", windcaveReservationRef);
              
              setWindcaveResponseDetails({
                amount: parsedWindcaveResponse.results?.Amount,
                transactionDate: parsedWindcaveResponse.results?.TransactionDate,
                status: parsedWindcaveResponse.results?.Status,
                transactionId: parsedWindcaveResponse.results?.TransactionId,
                reservationRef: windcaveReservationRef,
                cardDetails: {
                  cardholder: parsedWindcaveResponse.results?.Card?.Cardholder,
                  payType: parsedWindcaveResponse.results?.Card?.PayType,
                  cardNumber: parsedWindcaveResponse.results?.Card?.CardNumber
                }
              });
              
              if (windcaveReservationRef) {
                await fetchBookingFromRCM(windcaveReservationRef);
                setIsLoading(false);
                return;
              }
            }
            
            setWindcaveResponseDetails({
              amount: parsedWindcaveResponse.results?.Amount,
              transactionDate: parsedWindcaveResponse.results?.TransactionDate,
              status: parsedWindcaveResponse.results?.Status,
              transactionId: parsedWindcaveResponse.results?.TransactionId,
              reservationRef: reservationRef,
              cardDetails: {
                cardholder: parsedWindcaveResponse.results?.Card?.Cardholder,
                payType: parsedWindcaveResponse.results?.Card?.PayType,
                cardNumber: parsedWindcaveResponse.results?.Card?.CardNumber
              }
            });
          } catch (parseError) {
            console.error("Error parsing Windcave response:", parseError);
          }
        }
        
        const bookingReservationRef = reservationRef || 
                                     (sessionBookingData && (
                                       sessionBookingData.reservationRef ||
                                       sessionBookingData.bookingReference ||
                                       sessionBookingData.confirmationNumber ||
                                       sessionBookingData.reservationNo ||
                                       sessionBookingData.windcaveReservationRef
                                     ));
                                     
        console.log("Using reservation reference for API call:", bookingReservationRef);
        
        if (bookingReservationRef && (!sessionBookingData || bookingReservationRef !== sessionBookingData.reservationRef)) {
          console.log("Fetching booking details using reservation reference:", bookingReservationRef);
          await fetchBookingFromRCM(bookingReservationRef);
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
            customerAddress: sessionBookingData.customerAddress,
            reservationRef: bookingReservationRef,
            vehicleImage: sessionBookingData.vehicleImage,
            insuranceName: sessionBookingData.insuranceName,
            insurancePrice: sessionBookingData.insurancePrice,
            selectedExtras: sessionBookingData.selectedExtras?.map(extra => ({
              name: extra.name,
              quantity: extra.quantity,
              price: extra.price
            })),
            extraKmsName: sessionBookingData.extraKmsName,
            extraKmsPrice: sessionBookingData.extraKmsPrice
          };
          setBookingDetails(convertedDetails);
          
          // Calculate rental duration
          if (convertedDetails.pickupDate && convertedDetails.dropoffDate) {
            calculateRentalDuration(convertedDetails.pickupDate, convertedDetails.dropoffDate);
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
    
    const fetchBookingFromRCM = async (reservationRef: string) => {
      try {
        if (!reservationRef) {
          console.error("No reservation reference provided for API call");
          return false;
        }
        
        const requestPayload = {
          method: "bookinginfo",
          reservationref: reservationRef
        };
        
        console.log("Fetching booking details with payload:", requestPayload);
        
        const response = await rcmApi.request('POST', 'bookinginfo', requestPayload);
        
        const typedResponse = response as { status: string, results?: any };
        
        console.log("Booking details response from RCM:", typedResponse);
        
        if (typedResponse && typedResponse.status === "OK" && typedResponse.results) {
          const apiBookingDetails = mapApiResponseToBookingDetails(typedResponse.results, reservationRef);
          setBookingDetails(apiBookingDetails);
          
          // Calculate rental duration
          if (apiBookingDetails.pickupDate && apiBookingDetails.dropoffDate) {
            calculateRentalDuration(apiBookingDetails.pickupDate, apiBookingDetails.dropoffDate);
          }
          return true;
        } else {
          throw new Error("Failed to fetch booking details");
        }
      } catch (error) {
        console.error("Error fetching booking details from RCM:", error);
        return false;
      }
    };
    
    const calculateRentalDuration = (pickupDate: string, dropoffDate: string) => {
      try {
        let pickup, dropoff;
        
        // Try to parse as ISO date
        if (pickupDate.includes('T') || pickupDate.includes('-')) {
          pickup = parseISO(pickupDate);
        } else {
          // Try to parse dd/MM/yyyy format
          const [day, month, year] = pickupDate.split('/').map(Number);
          pickup = new Date(year, month - 1, day);
        }
        
        if (dropoffDate.includes('T') || dropoffDate.includes('-')) {
          dropoff = parseISO(dropoffDate);
        } else {
          const [day, month, year] = dropoffDate.split('/').map(Number);
          dropoff = new Date(year, month - 1, day);
        }
        
        if (!isValid(pickup) && pickupDate.includes('/')) {
          const parts = pickupDate.split('/');
          if (parts.length === 3) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const day = parseInt(parts[0]);
            const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
            const year = parseInt(parts[2]);
            
            if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
              pickup = new Date(year, monthIndex, day);
            }
          }
        }
        
        if (!isValid(dropoff) && dropoffDate.includes('/')) {
          const parts = dropoffDate.split('/');
          if (parts.length === 3) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const day = parseInt(parts[0]);
            const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
            const year = parseInt(parts[2]);
            
            if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
              dropoff = new Date(year, monthIndex, day);
            }
          }
        }
        
        if (isValid(pickup) && isValid(dropoff)) {
          const days = differenceInDays(dropoff, pickup) + 1; // +1 to include the pickup day
          setRentalDuration(days > 0 ? days : 0);
          console.log(`Rental duration: ${days} days`);
        } else {
          console.error("Invalid date format for duration calculation:", { pickupDate, dropoffDate });
        }
      } catch (error) {
        console.error("Error calculating rental duration:", error);
      }
    };
    
    fetchBookingDetails();
  }, [navigate, location]);
  
  const mapApiResponseToBookingDetails = (apiResponse: any, reservationRef: string): BookingDetails => {
    const bookingInfo = apiResponse.bookinginfo && apiResponse.bookinginfo[0] ? apiResponse.bookinginfo[0] : {};
    const customerInfo = apiResponse.customerinfo && apiResponse.customerinfo[0] ? apiResponse.customerinfo[0] : {};
    const paymentInfo = apiResponse.paymentinfo && apiResponse.paymentinfo[0] ? apiResponse.paymentinfo[0] : {};
    
    // Try to extract extras from the API response
    const extrasInfo: Array<{name: string; quantity: number; price: number}> = [];
    if (apiResponse.extras && Array.isArray(apiResponse.extras)) {
      apiResponse.extras.forEach((extra: any) => {
        extrasInfo.push({
          name: extra.description || extra.name || "Extra item",
          quantity: parseInt(extra.quantity) || 1,
          price: parseFloat(extra.amount) || 0
        });
      });
    }
    
    return {
      vehicleName: bookingInfo.vehiclecategory || "Vehicle",
      pickupDate: bookingInfo.pickupdate || "N/A",
      pickupTime: bookingInfo.pickuptime || "N/A",
      dropoffDate: bookingInfo.dropoffdate || "N/A",
      dropoffTime: bookingInfo.dropofftime || "N/A",
      paymentAmount: parseFloat(paymentInfo.paidamount) || parseFloat(bookingInfo.totalcost) || 0,
      basePrice: parseFloat(bookingInfo.totalcost) || 0,
      customerFirstName: customerInfo.firstname || "N/A",
      customerLastName: customerInfo.lastname || "N/A",
      customerEmail: customerInfo.email || "N/A",
      customerPhone: customerInfo.phone || customerInfo.mobile || "N/A",
      customerDob: customerInfo.dateofbirth || "N/A",
      customerLicenseExpiry: customerInfo.licenseexpires || "N/A",
      customerAddress: customerInfo.fulladdress || customerInfo.address || "N/A",
      reservationRef: reservationRef,
      vehicleImage: bookingInfo.imageurl || bookingInfo.vehicleimageurl,
      insuranceName: bookingInfo.insuranceoption || paymentInfo.insuranceoption,
      insurancePrice: parseFloat(bookingInfo.insuranceamount) || parseFloat(paymentInfo.insuranceamount) || 0,
      selectedExtras: extrasInfo,
      extraKmsName: bookingInfo.kmcharge || bookingInfo.kmoption,
      extraKmsPrice: parseFloat(bookingInfo.kmchargeamount) || 0
    };
  };
  
  const handleImageError = () => {
    console.log("Error loading vehicle image");
    setImageError(true);
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
    firstName: bookingDetails?.customerFirstName || "Not provided",
    lastName: bookingDetails?.customerLastName || "Not provided",
    email: bookingDetails?.customerEmail || "Not provided",
    phone: bookingDetails?.customerPhone || "Not provided",
    dob: bookingDetails?.customerDob || "Not provided",
    licenseExpiry: bookingDetails?.customerLicenseExpiry || "Not provided",
    address: bookingDetails?.customerAddress || "Not provided"
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
          {windcaveResponseDetails.reservationRef && (
            <p><strong>Reservation Reference:</strong> {windcaveResponseDetails.reservationRef}</p>
          )}
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
            {/* Vehicle image section */}
            {bookingDetails.vehicleImage && !imageError && (
              <div className="w-full aspect-video rounded-md mb-6 overflow-hidden">
                <img
                  src={bookingDetails.vehicleImage}
                  alt={bookingDetails.vehicleName}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
            
            <div className="text-left mb-8 border-t border-b py-4">
              <div className="flex justify-between py-2">
                <span className="font-medium">Vehicle:</span> 
                <span>{bookingDetails?.vehicleName}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Pickup Date:</span> 
                <span>{bookingDetails?.pickupDate} at {bookingDetails?.pickupTime}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Return Date:</span> 
                <span>{bookingDetails?.dropoffDate} at {bookingDetails?.dropoffTime}</span>
              </div>
              
              {/* Duration of hire */}
              <div className="flex justify-between py-2 items-center">
                <span className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Duration of Hire:
                </span> 
                <span>{rentalDuration} day{rentalDuration !== 1 ? 's' : ''}</span>
              </div>
              
              {/* Insurance option */}
              {bookingDetails?.insuranceName && (
                <div className="flex justify-between py-2 items-center">
                  <span className="font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2" /> Insurance:
                  </span> 
                  <span>
                    {bookingDetails.insuranceName}
                    {bookingDetails.insurancePrice > 0 && 
                      ` (${formatCurrency(bookingDetails.insurancePrice)})`}
                  </span>
                </div>
              )}
              
              {/* KM charge option */}
              {bookingDetails?.extraKmsName && (
                <div className="flex justify-between py-2">
                  <span className="font-medium">Mileage Option:</span> 
                  <span>
                    {bookingDetails.extraKmsName}
                    {bookingDetails.extraKmsPrice !== 0 && 
                      ` (${formatCurrency(bookingDetails.extraKmsPrice)})`}
                  </span>
                </div>
              )}
              
              {/* Extras */}
              {bookingDetails?.selectedExtras && bookingDetails.selectedExtras.length > 0 && (
                <div className="py-2">
                  <div className="font-medium flex items-center mb-2">
                    <Package className="h-4 w-4 mr-2" /> Extras:
                  </div>
                  {bookingDetails.selectedExtras.map((extra, index) => (
                    <div key={index} className="flex justify-between pl-6 py-1">
                      <span>
                        {extra.name} {extra.quantity > 1 ? `× ${extra.quantity}` : ''}
                      </span>
                      <span>{formatCurrency(extra.price)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between py-2">
                <span className="font-medium">Payment Amount:</span> 
                <span>{formatCurrency(bookingDetails?.paymentAmount || bookingDetails?.basePrice || 0)}</span>
              </div>
              
              {bookingDetails?.paymentType === "deposit" && bookingDetails?.basePrice && bookingDetails?.paymentAmount && (
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
