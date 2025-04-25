
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { rcmApi } from "@/lib/api/rcm-api";
import { RCMBookingResponse } from "@/lib/api/rcm-api-types";
import { differenceInDays, parseISO, isValid, format, addDays } from "date-fns";
import PaymentStatusHeader from "@/components/payment/PaymentStatusHeader";
import RentalDetails from "@/components/payment/RentalDetails";
import PaymentSummary from "@/components/payment/PaymentSummary";

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
  vehicleCategoryId?: string | number;
  vehicleCategoryTypeId?: string | number;
  pickupLocationId?: string | number;
  dropoffLocationId?: string | number;
  driverageId?: string | number;
  insuranceId?: string | number;
  extraKmsId?: string | number;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
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

  const handleImageError = () => {
    console.log("Error loading vehicle image");
    setImageError(true);
  };

  const handleSaveQuotation = async () => {
    try {
      if (!bookingDetails) {
        toast.error("No booking details available to save quote");
        return;
      }

      const sessionData = getBookingData();

      const today = new Date();
      const formattedToday = format(today, "dd/MMM/yyyy");
      
      let pickupDate = bookingDetails.pickupDate;
      let dropoffDate = bookingDetails.dropoffDate;
      
      const isPickupToday = pickupDate.includes(formattedToday.split('/')[1]) && 
                          pickupDate.includes(formattedToday.split('/')[0]);
                          
      if (isPickupToday) {
        const newPickupDate = addDays(today, 2);
        pickupDate = format(newPickupDate, "dd/MMM/yyyy");
        
        const rentalDays = rentalDuration || 3;
        const newDropoffDate = addDays(newPickupDate, rentalDays);
        dropoffDate = format(newDropoffDate, "dd/MMM/yyyy");
        
        console.log(`Updated dates: Pickup ${pickupDate}, Dropoff ${dropoffDate}`);
      }

      let customerInfo = null;
      try {
        if (bookingDetails.reservationRef) {
          console.log("Fetching booking details for reservation:", bookingDetails.reservationRef);
          const response = await rcmApi.request('POST', 'bookinginfo', {
            method: 'bookinginfo',
            reservationref: bookingDetails.reservationRef
          });
          
          const apiResponse = response as { status: string, results?: any, error?: string };
          
          if (apiResponse.status === "OK" && apiResponse.results?.customerinfo?.[0]) {
            customerInfo = apiResponse.results.customerinfo[0];
            console.log("Retrieved customer info from API:", customerInfo);
          }
        }
      } catch (error) {
        console.error("Failed to fetch customer details:", error);
      }

      const requestPayload = {
        vehiclecategoryid: bookingDetails.vehicleCategoryId || sessionData?.vehicleCategoryId || 6,
        vehiclecategorytypeid: bookingDetails.vehicleCategoryTypeId || sessionData?.vehicleCategoryTypeId || 6,
        pickuplocationid: bookingDetails.pickupLocationId || sessionData?.pickupLocationId || 1,
        pickupdate: pickupDate,
        pickuptime: bookingDetails.pickupTime,
        dropofflocationid: bookingDetails.dropoffLocationId || sessionData?.dropoffLocationId || 1,
        dropoffdate: dropoffDate,
        dropofftime: bookingDetails.dropoffTime,
        ageid: bookingDetails.driverageId || sessionData?.ageId || 4,
        bookingtype: 1,
        emailoption: 1,
        transmission: sessionData?.transmission || 0,
        insuranceid: bookingDetails.insuranceId || sessionData?.insuranceId || 0,
        extrakmsid: bookingDetails.extraKmsId || sessionData?.extraKmsId || 0,
        customer: {
          firstname: customerInfo?.firstname || bookingDetails.customerFirstName || sessionData?.customerFirstName || "Guest",
          lastname: customerInfo?.lastname || bookingDetails.customerLastName || sessionData?.customerLastName || "Customer",
          email: customerInfo?.email || bookingDetails.customerEmail || sessionData?.customerEmail || "quote@example.com",
          phone: customerInfo?.phone || customerInfo?.mobile || bookingDetails.customerPhone || sessionData?.customerPhone || "",
          dateofbirth: customerInfo?.dateofbirth || bookingDetails.customerDob || sessionData?.customerDob || "",
          licenseexpires: customerInfo?.licenseexpires || bookingDetails.customerLicenseExpiry || sessionData?.customerLicenseExpiry || "",
          address: customerInfo?.address || bookingDetails.customerAddress || sessionData?.customerAddress || "",
          city: customerInfo?.city || "",
          state: customerInfo?.state || "",
          postcode: customerInfo?.postcode || ""
        }
      };
      
      console.log('Sending save quotation request with payload:', requestPayload);

      const bookingResponse = await rcmApi.request<RCMBookingResponse>('POST', 'booking', requestPayload);
      
      console.log('Complete API response from save quotation:', bookingResponse);

      if (bookingResponse.status === "OK") {
        toast.success("Quotation saved successfully!", {
          description: `Check your email for the quote details.`
        });
      } else {
        throw new Error(bookingResponse.error || "Failed to save quotation");
      }
    } catch (error) {
      console.error("Failed to save quotation:", error);
      toast.error("Failed to save quotation", {
        description: error instanceof Error ? error.message : "Please try again or contact support"
      });
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching booking details on payment success page");
        
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
          toast.success("Payment Successful", {
            description: "Your booking has been confirmed."
          });
        }

        const sessionData = getBookingData();
        console.log("Session data retrieved:", sessionData);
        
        const bookingReservationRef = reservationRef || 
                                     (sessionData && (
                                       sessionData.reservationRef ||
                                       sessionData.bookingReference ||
                                       sessionData.confirmationNumber ||
                                       sessionData.reservationNo
                                     ));

        if (bookingReservationRef) {
          try {
            const response = await rcmApi.request<RCMBookingResponse>('POST', 'bookinginfo', {
              method: 'bookinginfo',
              reservationref: bookingReservationRef
            });

            const apiResponse = response as RCMBookingResponse;
            console.log("API Response for booking details:", apiResponse);

            if (apiResponse.status === "OK" && apiResponse.results) {
              const bookingInfo = apiResponse.results.bookinginfo?.[0] || {};
              const paymentInfo = apiResponse.results.paymentinfo || [];
              const customerInfo = apiResponse.results.customerinfo?.[0] || {};
              
              console.log("Booking info from API:", bookingInfo);
              console.log("Payment info from API:", paymentInfo);
              console.log("Customer info from API:", customerInfo);
              
              const totalPayment = paymentInfo.reduce((sum, payment) => {
                return sum + (parseFloat(payment.paidamount) || 0);
              }, 0);
              
              console.log("Total payment calculated from API:", totalPayment);
              
              let apiVehicleImageUrl = "";
              if (bookingInfo.vehicleimage) {
                if (bookingInfo.urlpathfordocuments) {
                  apiVehicleImageUrl = `${bookingInfo.urlpathfordocuments.replace(/\/$/, "")}/${bookingInfo.vehicleimage.replace(/^\//, "")}`;
                } else {
                  apiVehicleImageUrl = bookingInfo.vehicleimage;
                }
                console.log("Created vehicle image URL from API data:", apiVehicleImageUrl);
              }

              const apiMandatoryFeesFromOldField = bookingInfo.mandatoryfees || [];
              const apiExtraFees = apiResponse.results.extrafees || [];
              const apiMandatoryFeesFromExtraFees = apiExtraFees
                .filter((fee: any) => !fee.isoptionalfee)
                .map((fee: any) => ({
                  name: fee.name,
                  amount: typeof fee.fees === "number" ? fee.fees : parseFloat(fee.fees) || 0,
                }));

              const combinedMandatoryFees = [
                ...(apiMandatoryFeesFromOldField.map((fee: any) => ({
                  name: fee.name ?? "",
                  amount: typeof fee.amount === "number"
                    ? fee.amount
                    : fee.amount
                      ? parseFloat(fee.amount)
                      : (typeof fee.totalfeeamount === "number" ? fee.totalfeeamount : parseFloat(fee.totalfeeamount) || 0),
                })) ?? []),
                ...apiMandatoryFeesFromExtraFees,
              ];

              const convertedDetails: BookingDetails = {
                vehicleName: bookingInfo.vehiclecategory || sessionData?.vehicleName || 'Vehicle',
                pickupDate: bookingInfo.pickupdate || sessionData?.pickupDate || '',
                pickupTime: bookingInfo.pickuptime || sessionData?.pickupTime || '',
                dropoffDate: bookingInfo.dropoffdate || sessionData?.dropoffDate || '',
                dropoffTime: bookingInfo.dropofftime || sessionData?.dropoffTime || '',
                paymentAmount: paymentStatus === "success" ? (totalPayment || parseFloat(bookingInfo.payment) || sessionData?.paymentAmount || 0) : 0,
                basePrice: parseFloat(bookingInfo.totalcost) || sessionData?.basePrice || 0,
                reservationRef: bookingReservationRef,
                vehicleImage: apiVehicleImageUrl || sessionData?.vehicleImage || '',
                insuranceName: bookingInfo.insuranceoption || sessionData?.insuranceName || '',
                insurancePrice: parseFloat(bookingInfo.insuranceamount) || sessionData?.insurancePrice || 0,
                selectedExtras: sessionData?.selectedExtras || [],
                pickupLocationName: bookingInfo.pickuplocationname || bookingInfo.pickuplocation || sessionData?.pickupLocationName || "Not specified",
                dropoffLocationName: bookingInfo.dropofflocationname || bookingInfo.dropofflocation || sessionData?.dropoffLocationName || "Not specified",
                totalRateAfterDiscount: parseFloat(bookingInfo.totalrateafterdiscount) || sessionData?.totalRateAfterDiscount || 0,
                mandatoryFees: combinedMandatoryFees.length > 0 ? combinedMandatoryFees : (sessionData?.mandatoryFees || []),
                numberofdays: parseInt(bookingInfo.numberofdays) ||
                  (sessionData?.pickupDate && sessionData?.dropoffDate ?
                    calculateRentalDuration(sessionData.pickupDate, sessionData.dropoffDate) : 0),
                dailyrate: parseFloat(bookingInfo.dailyrate) ||
                  (sessionData?.basePrice && sessionData?.numberofdays ?
                    sessionData.basePrice / sessionData.numberofdays : 0),
                totalcost: parseFloat(bookingInfo.totalcost) || sessionData?.totalcost || 0,
                payment: paymentStatus === "success" ? (totalPayment || parseFloat(bookingInfo.payment) || sessionData?.payment || 0) : 0,
                balancedue: parseFloat(bookingInfo.balancedue) || sessionData?.balancedue || 0,
                customerFirstName: customerInfo.firstname || sessionData?.customerFirstName || '',
                customerLastName: customerInfo.lastname || sessionData?.customerLastName || '',
                customerEmail: customerInfo.email || sessionData?.customerEmail || '',
                customerPhone: customerInfo.phone || customerInfo.mobile || sessionData?.customerPhone || ''
              };
              setBookingDetails(convertedDetails);
              if (convertedDetails.pickupDate && convertedDetails.dropoffDate) {
                const days = calculateRentalDuration(convertedDetails.pickupDate, convertedDetails.dropoffDate);
                setRentalDuration(days);
              }
              
              console.log("Booking details set from API:", convertedDetails);
              
              if (paymentStatus === "success") {
                clearBookingData();
                console.log("Booking data cleared from session after successful payment");
              }
            } else {
              throw new Error(apiResponse.error || "Failed to fetch booking details");
            }
          } catch (apiError) {
            console.error("Error fetching booking details from API:", apiError);
            // We'll fall back to session data below
          }
        }
        
        if (!bookingDetails && sessionData) {
          console.log("Using session data as fallback for booking details");

          const cleanedSessionData = JSON.parse(JSON.stringify(sessionData, (key, value) => {
            if (value && typeof value === 'object' && value._type === 'undefined') {
              return undefined;
            }
            return value;
          }));
          
          let vehicleImage = cleanedSessionData.vehicleImage || '';
          if (vehicleImage) {
            if (vehicleImage.includes('rentalcarmanagerau.blob.core.windows.net') && 
                vehicleImage.indexOf('rentalcarmanagerau.blob.core.windows.net') !== 
                vehicleImage.lastIndexOf('rentalcarmanagerau.blob.core.windows.net')) {
              const baseUrl = 'https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/';
              const filename = vehicleImage.split('/').pop();
              vehicleImage = baseUrl + filename;
            } else if (!vehicleImage.includes('http')) {
              vehicleImage = `https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/${vehicleImage}`;
            }
          }
          
          const convertedDetails: BookingDetails = {
            vehicleName: cleanedSessionData.vehicleName || 'Vehicle',
            pickupDate: cleanedSessionData.pickupDate || '',
            pickupTime: cleanedSessionData.pickupTime || '', 
            dropoffDate: cleanedSessionData.dropoffDate || '',
            dropoffTime: cleanedSessionData.dropoffTime || '',
            paymentAmount: paymentStatus === "success" ? (cleanedSessionData.payment || cleanedSessionData.paymentAmount || 1) : 0,
            basePrice: cleanedSessionData.basePrice || 0,
            paymentType: cleanedSessionData.paymentType,
            customerFirstName: cleanedSessionData.customerFirstName,
            customerLastName: cleanedSessionData.customerLastName,
            customerEmail: cleanedSessionData.customerEmail,
            customerPhone: cleanedSessionData.customerPhone,
            customerDob: cleanedSessionData.customerDob,
            customerLicenseExpiry: cleanedSessionData.customerLicenseExpiry,
            customerAddress: cleanedSessionData.customerAddress,
            reservationRef: bookingReservationRef,
            vehicleImage: vehicleImage,
            insuranceName: cleanedSessionData.insuranceName,
            insurancePrice: cleanedSessionData.insurancePrice || 0,
            selectedExtras: cleanedSessionData.selectedExtras?.map(extra => ({
              name: extra.name,
              quantity: extra.quantity,
              price: extra.price
            })) || [],
            extraKmsName: cleanedSessionData.extraKmsName,
            extraKmsPrice: cleanedSessionData.extraKmsPrice,
            pickupLocationName: cleanedSessionData.pickupLocationName || "Not specified",
            dropoffLocationName: cleanedSessionData.dropoffLocationName || "Not specified",
            totalRateAfterDiscount: cleanedSessionData.totalRateAfterDiscount || 0,
            mandatoryFees: cleanedSessionData.mandatoryFees || [],
            numberofdays: cleanedSessionData.numberofdays || 
                        (cleanedSessionData.pickupDate && cleanedSessionData.dropoffDate ? 
                          calculateRentalDuration(cleanedSessionData.pickupDate, cleanedSessionData.dropoffDate) : 1),
            dailyrate: cleanedSessionData.dailyrate || 
                      (cleanedSessionData.basePrice && cleanedSessionData.numberofdays ? 
                        cleanedSessionData.basePrice / cleanedSessionData.numberofdays : 0),
            totalcost: cleanedSessionData.totalcost || cleanedSessionData.basePrice || 0,
            payment: paymentStatus === "success" ? (cleanedSessionData.payment || cleanedSessionData.paymentAmount || 0) : 0,
            balancedue: cleanedSessionData.balancedue || 0,
            pickupLocationId: cleanedSessionData.pickupLocationId,
            dropoffLocationId: cleanedSessionData.dropoffLocationId,
            vehicleCategoryId: cleanedSessionData.vehicleCategoryId,
            vehicleCategoryTypeId: cleanedSessionData.vehicleCategoryTypeId,
            driverageId: cleanedSessionData.driverageId || cleanedSessionData.ageId,
            insuranceId: cleanedSessionData.insuranceId,
            extraKmsId: cleanedSessionData.extraKmsId
          };
          
          setBookingDetails(convertedDetails);
          
          if (convertedDetails.pickupDate && convertedDetails.dropoffDate) {
            const days = calculateRentalDuration(convertedDetails.pickupDate, convertedDetails.dropoffDate);
            setRentalDuration(days);
          }
          
          console.log("Booking details set from session:", convertedDetails);
          
          if (paymentStatus === "success") {
            clearBookingData();
            console.log("Booking data cleared from session after successful payment (fallback path)");
          }
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
  }, [navigate, location, paymentStatus]);

  useEffect(() => {
    const loadGoogleAnalytics = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-MHKY18WZYH`;
      
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(...args: any[]){ window.dataLayer.push(arguments); };
        
        window.gtag('js', new Date());
        window.gtag('config', 'G-MHKY18WZYH');
        
        if (paymentStatus === 'success' && bookingDetails) {
          try {
            window.gtag('event', 'purchase', {
              currency: 'NZD',
              transaction_id: transactionId || 'unknown',
              value: bookingDetails.paymentAmount || 0,
              items: [
                {
                  item_id: bookingDetails.reservationRef || 'unknown',
                  item_name: bookingDetails.vehicleName || 'Vehicle',
                  price: bookingDetails.paymentAmount || 0,
                  quantity: 1
                }
              ]
            });
            console.log('Google Analytics purchase event tracked successfully');
          } catch (error) {
            console.error('Error tracking purchase event:', error);
          }
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Analytics script');
      };
      
      document.head.appendChild(script);
      
      return () => {
        try {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        } catch (error) {
          console.error('Error cleaning up GA script:', error);
        }
      };
    };
    
    loadGoogleAnalytics();
  }, [paymentStatus, bookingDetails, transactionId]);

  const calculateRentalDuration = (pickupDate: string, dropoffDate: string) => {
    try {
      let pickup: Date | null = null;
      let dropoff: Date | null = null;
      
      if (pickupDate.includes('T') || pickupDate.includes('-')) {
        pickup = parseISO(pickupDate);
      } else {
        const parts = pickupDate.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          pickup = new Date(year, month, day);
          
          if (!isValid(pickup)) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
            if (monthIndex !== -1) {
              pickup = new Date(parseInt(parts[2]), monthIndex, parseInt(parts[0]));
            }
          }
        }
      }
      
      if (dropoffDate.includes('T') || dropoffDate.includes('-')) {
        dropoff = parseISO(dropoffDate);
      } else {
        const parts = dropoffDate.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          dropoff = new Date(year, month, day);
          
          if (!isValid(dropoff)) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthIndex = monthNames.findIndex(m => parts[1].includes(m));
            if (monthIndex !== -1) {
              dropoff = new Date(parseInt(parts[2]), monthIndex, parseInt(parts[0]));
            }
          }
        }
      }
      
      if (isValid(pickup) && isValid(dropoff)) {
        const days = differenceInDays(dropoff, pickup) + 1;
        console.log(`Rental duration calculated: ${days} days`);
        return days > 0 ? days : 0;
      } else {
        console.error("Invalid date format for duration calculation:", { pickupDate, dropoffDate });
        return 1;
      }
    } catch (error) {
      console.error("Error calculating rental duration:", error);
      return 1;
    }
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
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  let formattedPickupDate = bookingDetails.pickupDate;
  let formattedDropoffDate = bookingDetails.dropoffDate;
  
  try {
    if (bookingDetails.pickupDate) {
      if (bookingDetails.pickupDate.includes('T') || bookingDetails.pickupDate.includes('-')) {
        formattedPickupDate = format(parseISO(bookingDetails.pickupDate), 'dd/MM/yyyy');
      } else if (bookingDetails.pickupDate.includes('/')) {
        formattedPickupDate = bookingDetails.pickupDate;
      }
    }
    
    if (bookingDetails.dropoffDate) {
      if (bookingDetails.dropoffDate.includes('T') || bookingDetails.dropoffDate.includes('-')) {
        formattedDropoffDate = format(parseISO(bookingDetails.dropoffDate), 'dd/MM/yyyy');
      } else if (bookingDetails.dropoffDate.includes('/')) {
        formattedDropoffDate = bookingDetails.dropoffDate;
      }
    }
  } catch (error) {
    console.error("Error formatting dates:", error);
  }

  const pickupLocationName = bookingDetails.pickupLocationName && 
                            bookingDetails.pickupLocationName !== "undefined" ? 
                            bookingDetails.pickupLocationName : "Not specified";

  const dropoffLocationName = bookingDetails.dropoffLocationName && 
                             bookingDetails.dropoffLocationName !== "undefined" ? 
                             bookingDetails.dropoffLocationName : "Not specified";

  let vehicleImageUrl = "";
  if (bookingDetails?.vehicleImage) {
    if (bookingDetails.vehicleImage.startsWith('http')) {
      if (bookingDetails.vehicleImage.includes('rentalcarmanagerau.blob.core.windows.net') && 
          bookingDetails.vehicleImage.indexOf('rentalcarmanagerau.blob.core.windows.net') !== 
          bookingDetails.vehicleImage.lastIndexOf('rentalcarmanagerau.blob.core.windows.net')) {
        const baseUrl = 'https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/';
        const filename = bookingDetails.vehicleImage.split('/').pop();
        vehicleImageUrl = baseUrl + filename;
      } else {
        vehicleImageUrl = bookingDetails.vehicleImage;
      }
    } else {
      vehicleImageUrl = `https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/${bookingDetails.vehicleImage.replace(/^\/+/, '')}`;
    }
    
    vehicleImageUrl = vehicleImageUrl.replace(/([^:])\/+/g, '$1/');
    
    console.log("Vehicle image URL:", vehicleImageUrl);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <PaymentStatusHeader 
          status={paymentStatus}
          errorMessage={errorMessage}
          transactionId={transactionId}
          reservationRef={bookingDetails.reservationRef}
        />

        {bookingDetails && (
          <>
            {vehicleImageUrl && !imageError && (
              <div className="w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden bg-gray-100 mb-6 max-h-[180px]">
                <img
                  src={vehicleImageUrl}
                  alt={bookingDetails.vehicleName}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              </div>
            )}
            
            {imageError && (
              <div className="w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden bg-gray-100 mb-6 max-h-[180px] flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-300" />
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-6">
              <Car className="h-6 w-6 text-gray-500" />
              <h2 className="text-2xl font-semibold">{bookingDetails.vehicleName}</h2>
            </div>

            <RentalDetails 
              vehicleName={bookingDetails.vehicleName}
              pickupLocationName={pickupLocationName}
              dropoffLocationName={dropoffLocationName}
              formattedPickupDate={formattedPickupDate}
              formattedDropoffDate={formattedDropoffDate}
              pickupTime={bookingDetails.pickupTime}
              dropoffTime={bookingDetails.dropoffTime}
              rentalDuration={rentalDuration}
            />

            <PaymentSummary
              rentalDays={bookingDetails.numberofdays || rentalDuration || 1}
              dailyRate={bookingDetails.dailyrate || (bookingDetails.basePrice / (bookingDetails.numberofdays || rentalDuration || 1))}
              insuranceName={bookingDetails.insuranceName}
              insurancePrice={bookingDetails.insurancePrice}
              extraKmsName={bookingDetails.extraKmsName}
              extraKmsPrice={bookingDetails.extraKmsPrice}
              selectedExtras={bookingDetails.selectedExtras}
              mandatoryFees={bookingDetails.mandatoryFees}
              totalCost={bookingDetails.totalcost || bookingDetails.basePrice}
              payment={bookingDetails.payment}
              balanceDue={bookingDetails.balancedue}
            />
            
            {paymentStatus === "success" ? (
              <Button onClick={() => navigate("/")} className="w-full">
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
                  onClick={handleSaveQuotation}
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
