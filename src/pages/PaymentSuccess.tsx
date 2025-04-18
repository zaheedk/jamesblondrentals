import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FrownIcon, Calendar, Shield, Package, MapPin, Clock, Car } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/utils";
import { rcmApi } from "@/lib/api/rcm-api";
import { differenceInDays, parseISO, isValid } from "date-fns";

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
  pickupLocationName?: string;
  dropoffLocationName?: string;
  totalRateAfterDiscount?: number;
  mandatoryFees?: Array<{name: string; amount: number}>;
  numberofdays?: number;
  dailyrate?: number;
  totalcost?: number;
  payment?: number;
  balancedue?: number;
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

  const handleImageError = () => {
    console.log("Error loading vehicle image");
    setImageError(true);
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        
        const queryParams = new URLSearchParams(location.search);
        const result = queryParams.get("result");
        const txnId = queryParams.get("txnId") || "N/A";
        const reservationRef = queryParams.get("reservationRef");
        
        console.log("URL Parameters:", { result, txnId, reservationRef });
        
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

        // Get booking reference from either URL params, Windcave response, or session data
        const sessionData = getBookingData();
        const bookingReservationRef = reservationRef || 
                                     (sessionData && (
                                       sessionData.reservationRef ||
                                       sessionData.bookingReference ||
                                       sessionData.confirmationNumber ||
                                       sessionData.reservationNo
                                     ));

        if (bookingReservationRef) {
          console.log("Fetching booking details for reservation:", bookingReservationRef);
          const response = await rcmApi.request('POST', 'bookinginfo', {
            method: 'bookinginfo',
            reservationref: bookingReservationRef
          });

          if (response.status === "OK" && response.results) {
            console.log("API Response:", response);
            const bookingInfo = response.results.bookinginfo?.[0] || {};
            const paymentInfo = response.results.paymentinfo?.[0] || {};
            
            const convertedDetails: BookingDetails = {
              vehicleName: bookingInfo.vehiclecategory || sessionData?.vehicleName || 'Vehicle',
              pickupDate: bookingInfo.pickupdate || sessionData?.pickupDate || '',
              pickupTime: bookingInfo.pickuptime || sessionData?.pickupTime || '',
              dropoffDate: bookingInfo.dropoffdate || sessionData?.dropoffDate || '',
              dropoffTime: bookingInfo.dropofftime || sessionData?.dropoffTime || '',
              paymentAmount: parseFloat(paymentInfo.paidamount) || sessionData?.paymentAmount || 0,
              basePrice: parseFloat(bookingInfo.totalcost) || sessionData?.basePrice || 0,
              reservationRef: bookingReservationRef,
              vehicleImage: bookingInfo.vehicleimage || sessionData?.vehicleImage || '',
              insuranceName: bookingInfo.insuranceoption || sessionData?.insuranceName || '',
              insurancePrice: parseFloat(bookingInfo.insuranceamount) || sessionData?.insurancePrice || 0,
              selectedExtras: sessionData?.selectedExtras || [],
              pickupLocationName: bookingInfo.pickuplocationname || sessionData?.pickupLocationName || "Not specified",
              dropoffLocationName: bookingInfo.dropofflocationname || sessionData?.dropoffLocationName || "Not specified",
              totalRateAfterDiscount: parseFloat(bookingInfo.totalrateafterdiscount) || sessionData?.totalRateAfterDiscount || 0,
              mandatoryFees: bookingInfo.mandatoryfees || sessionData?.mandatoryFees || [],
              numberofdays: parseInt(bookingInfo.numberofdays) || 
                          (sessionData?.pickupDate && sessionData?.dropoffDate ? 
                            calculateRentalDuration(sessionData.pickupDate, sessionData.dropoffDate) : 0),
              dailyrate: parseFloat(bookingInfo.dailyrate) || 
                        (sessionData?.basePrice && sessionData?.numberofdays ? 
                          sessionData.basePrice / sessionData.numberofdays : 0),
              totalcost: parseFloat(bookingInfo.totalcost) || sessionData?.totalcost || 0,
              payment: parseFloat(paymentInfo.paidamount) || sessionData?.payment || 0,
              balancedue: parseFloat(bookingInfo.balancedue) || sessionData?.balancedue || 0
            };

            setBookingDetails(convertedDetails);
            if (convertedDetails.pickupDate && convertedDetails.dropoffDate) {
              const days = calculateRentalDuration(convertedDetails.pickupDate, convertedDetails.dropoffDate);
              setRentalDuration(days);
            }
          }
        } else if (sessionData) {
          const convertedDetails: BookingDetails = {
            vehicleName: sessionData.vehicleName || 'Vehicle',
            pickupDate: sessionData.pickupDate,
            pickupTime: sessionData.pickupTime, 
            dropoffDate: sessionData.dropoffDate,
            dropoffTime: sessionData.dropoffTime,
            paymentAmount: sessionData.paymentAmount || 0,
            basePrice: sessionData.basePrice || 0,
            paymentType: sessionData.paymentType,
            customerFirstName: sessionData.customerFirstName,
            customerLastName: sessionData.customerLastName,
            customerEmail: sessionData.customerEmail,
            customerPhone: sessionData.customerPhone,
            customerDob: sessionData.customerDob,
            customerLicenseExpiry: sessionData.customerLicenseExpiry,
            customerAddress: sessionData.customerAddress,
            reservationRef: bookingReservationRef,
            vehicleImage: sessionData.vehicleImage,
            insuranceName: sessionData.insuranceName,
            insurancePrice: sessionData.insurancePrice,
            selectedExtras: sessionData.selectedExtras?.map(extra => ({
              name: extra.name,
              quantity: extra.quantity,
              price: extra.price
            })),
            extraKmsName: sessionData.extraKmsName,
            extraKmsPrice: sessionData.extraKmsPrice,
            pickupLocationName: sessionData.pickupLocationName || "Not specified",
            dropoffLocationName: sessionData.dropoffLocationName || "Not specified",
            totalRateAfterDiscount: sessionData.totalRateAfterDiscount,
            mandatoryFees: sessionData.mandatoryFees,
            numberofdays: sessionData.numberofdays || calculateRentalDuration(sessionData.pickupDate, sessionData.dropoffDate),
            dailyrate: sessionData.dailyrate || (sessionData.basePrice / calculateRentalDuration(sessionData.pickupDate, sessionData.dropoffDate)),
            totalcost: sessionData.totalcost || sessionData.basePrice,
            payment: sessionData.payment || sessionData.paymentAmount,
            balancedue: sessionData.balancedue || 0
          };
          setBookingDetails(convertedDetails);
          
          calculateRentalDuration(convertedDetails.pickupDate, convertedDetails.dropoffDate);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setIsLoading(false);
        toast.error("Error", {
          description: "Failed to load booking details."
        });
      }
    };

    fetchBookingDetails();
  }, [navigate, location]);

  const formattedPickupDate = bookingDetails?.pickupDate ? new Date(bookingDetails.pickupDate).toLocaleDateString() : "N/A";
  const formattedDropoffDate = bookingDetails?.dropoffDate ? new Date(bookingDetails.dropoffDate).toLocaleDateString() : "N/A";

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

  const renderPaymentSummary = () => {
    if (!bookingDetails) return null;

    // Log all details received from the API
    console.log('📦 Booking Details Received:', {
      numberofdays: bookingDetails.numberofdays,
      dailyrate: bookingDetails.dailyrate,
      totalcost: bookingDetails.totalcost,
      payment: bookingDetails.payment,
      balancedue: bookingDetails.balancedue,
      basePrice: bookingDetails.basePrice,
      fullBookingDetails: bookingDetails
    });

    // Calculate rental value from days and daily rate, or use base price
    const rentalDays = bookingDetails.numberofdays || rentalDuration || 1;
    const dailyRate = bookingDetails.dailyrate || (bookingDetails.basePrice / rentalDays);
    const rentalValue = rentalDays * dailyRate;
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-2">
          {/* Rental Value */}
          <div className="flex justify-between">
            <span>Rental Value ({rentalDays} days × ${dailyRate.toFixed(2)})</span>
            <span>{formatCurrency(rentalValue)}</span>
          </div>

          {/* Insurance */}
          {bookingDetails.insurancePrice > 0 && (
            <div className="flex justify-between">
              <span>{bookingDetails.insuranceName || 'Insurance'}</span>
              <span>{formatCurrency(bookingDetails.insurancePrice)}</span>
            </div>
          )}

          {/* Extra Kilometers */}
          {bookingDetails.extraKmsPrice > 0 && (
            <div className="flex justify-between">
              <span>{bookingDetails.extraKmsName || 'Mileage Charge'}</span>
              <span>{formatCurrency(bookingDetails.extraKmsPrice)}</span>
            </div>
          )}

          {/* Extra Fees */}
          {bookingDetails.selectedExtras && bookingDetails.selectedExtras.length > 0 && (
            <>
              <div className="border-t border-gray-300 my-2 pt-2">
                <div className="font-medium mb-2">Extra Items</div>
                {bookingDetails.selectedExtras.map((extra, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{extra.name} {extra.quantity > 1 ? `(x${extra.quantity})` : ''}</span>
                    <span>{formatCurrency(extra.price)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Mandatory Fees */}
          {bookingDetails.mandatoryFees && bookingDetails.mandatoryFees.length > 0 && (
            <>
              <div className="border-t border-gray-300 my-2 pt-2">
                <div className="font-medium mb-2">Mandatory Fees</div>
                {bookingDetails.mandatoryFees.map((fee, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{fee.name}</span>
                    <span>{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Total Cost */}
          <div className="border-t border-gray-300 my-2 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total Cost</span>
              <span>{formatCurrency(bookingDetails.totalcost || (bookingDetails.basePrice + (bookingDetails.insurancePrice || 0) + (bookingDetails.extraKmsPrice || 0) + (bookingDetails.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0)))}</span>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="flex justify-between text-green-600">
            <span>Paid</span>
            <span>{formatCurrency(bookingDetails.payment || bookingDetails.paymentAmount || 0)}</span>
          </div>

          {/* Balance Due */}
          {(bookingDetails.balancedue || 0) > 0 && (
            <div className="flex justify-between text-red-600 font-bold">
              <span>Balance Due</span>
              <span>{formatCurrency(bookingDetails.balancedue || 0)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const calculateRentalDuration = (pickupDate: string, dropoffDate: string) => {
    try {
      let pickup, dropoff;
      
      if (pickupDate.includes('T') || pickupDate.includes('-')) {
        pickup = parseISO(pickupDate);
      } else {
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
        const days = differenceInDays(dropoff, pickup) + 1;
        setRentalDuration(days > 0 ? days : 0);
        console.log(`Rental duration: ${days} days`);
      } else {
        console.error("Invalid date format for duration calculation:", { pickupDate, dropoffDate });
      }
    } catch (error) {
      console.error("Error calculating rental duration:", error);
    }
    return differenceInDays(dropoff, pickup) + 1;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Payment Status Section */}
        {paymentStatus === "success" ? (
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your booking. Your reservation is confirmed.
            </p>
            {bookingDetails?.reservationRef && (
              <p className="mt-2 text-blue-500 font-medium">
                Reservation Reference: {bookingDetails.reservationRef}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="bg-red-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FrownIcon className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <p className="text-gray-600 mb-4">
              Transaction ID: {transactionId || "N/A"}
            </p>
          </div>
        )}

        {bookingDetails && (
          <>
            {/* Vehicle Image */}
            {bookingDetails?.vehicleImage && !imageError && (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mb-6">
                <img
                  src={bookingDetails.vehicleImage}
                  alt={bookingDetails.vehicleName}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
            
            {/* Vehicle Name */}
            <div className="flex items-center gap-2 mb-6">
              <Car className="h-6 w-6 text-gray-500" />
              <h2 className="text-2xl font-semibold">{bookingDetails?.vehicleName}</h2>
            </div>

            {/* Rental Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p>{bookingDetails.pickupLocationName || "Not specified"}</p>
                    <p>{formattedPickupDate} - {bookingDetails.pickupTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Drop-off Location</p>
                    <p>{bookingDetails.dropoffLocationName || "Not specified"}</p>
                    <p>{formattedDropoffDate} - {bookingDetails.dropoffTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p>{rentalDuration} day{rentalDuration !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            {renderPaymentSummary()}
            {renderWindcavePaymentDetails()}
            
            {/* Action Buttons */}
            {paymentStatus === "success" ? (
              <Button 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Return to Home
              </Button>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 justify-center">
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
