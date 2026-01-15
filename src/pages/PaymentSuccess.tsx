import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { getBookingData, clearBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { formatCurrency, getCampaignCode } from "@/lib/utils";
import { rcmApi } from "@/lib/api/rcm-api";
import { RCMBookingResponse } from "@/lib/api/rcm-api-types";
import { differenceInDays, parseISO, isValid, format, addDays } from "date-fns";
import PaymentStatusHeader from "@/components/payment/PaymentStatusHeader";
import RentalDetails from "@/components/payment/RentalDetails";
import PaymentSummary from "@/components/payment/PaymentSummary";
import BookingExperienceSurvey from "@/components/feedback/BookingExperienceSurvey";
import { useCreateBooking, updateBookingPaymentStatus } from "@/hooks/use-bookings";
import { useAuth } from "@/contexts/AuthContext";

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
  mandatoryFees?: Array<{name: string; amount: number; quantity?: number}>;
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
    gtag: (...args: any[]) => void;
  }
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const createBooking = useCreateBooking();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rentalDuration, setRentalDuration] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showSurvey, setShowSurvey] = useState<boolean>(false);

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

      // Default to standard category values that are known to work
      let vehicleCategoryId = 6; // Default economy car
      let vehicleCategoryTypeId = 1; // Default automatic
      
      // Try to get values from bookingDetails first
      if (bookingDetails.vehicleCategoryId) {
        vehicleCategoryId = typeof bookingDetails.vehicleCategoryId === 'string' 
          ? parseInt(bookingDetails.vehicleCategoryId) || 6 
          : bookingDetails.vehicleCategoryId || 6;
      }
      
      // For vehicleCategoryTypeId, we'll use 1 (automatic) as default since 6 is invalid
      if (bookingDetails.vehicleCategoryTypeId) {
        // Even if provided, we'll ensure it's a valid value (1 or 2)
        const parsedTypeId = typeof bookingDetails.vehicleCategoryTypeId === 'string'
          ? parseInt(bookingDetails.vehicleCategoryTypeId)
          : bookingDetails.vehicleCategoryTypeId;
        
        // Only use 1 (automatic) or 2 (manual) as these are the valid values
        vehicleCategoryTypeId = parsedTypeId === 2 ? 2 : 1;
      }
      
      // For safeguard, also check session data
      if (!bookingDetails.vehicleCategoryTypeId && sessionData?.vehicleCategoryTypeId) {
        const parsedTypeId = typeof sessionData.vehicleCategoryTypeId === 'string'
          ? parseInt(sessionData.vehicleCategoryTypeId)
          : sessionData.vehicleCategoryTypeId;
          
        // Only use 1 (automatic) or 2 (manual) as these are the valid values
        vehicleCategoryTypeId = parsedTypeId === 2 ? 2 : 1;
      }
      
      // If we still don't have a valid vehicle type ID, use 1 (automatic) as default
      if (vehicleCategoryTypeId !== 1 && vehicleCategoryTypeId !== 2) {
        vehicleCategoryTypeId = 1;
      }
      
      console.log("Using vehicle category ID:", vehicleCategoryId);
      console.log("Using vehicle category type ID:", vehicleCategoryTypeId);
        
      const pickupLocationId = typeof bookingDetails.pickupLocationId === 'string' 
        ? parseInt(bookingDetails.pickupLocationId) || 1 
        : bookingDetails.pickupLocationId || 1;
        
      const dropoffLocationId = typeof bookingDetails.dropoffLocationId === 'string' 
        ? parseInt(bookingDetails.dropoffLocationId) || 1 
        : bookingDetails.dropoffLocationId || 1;
        
      const ageid = typeof bookingDetails.driverageId === 'string' 
        ? parseInt(bookingDetails.driverageId) || 4 
        : bookingDetails.driverageId || 4;
        
      // Get insurance ID from API response if available
      let insuranceid = 0;
      if (customerInfo && sessionData?.reservationRef) {
        try {
          const response = await rcmApi.request<RCMBookingResponse>('POST', 'bookinginfo', {
            method: 'bookinginfo',
            reservationref: sessionData.reservationRef
          });
          
          if (response.status === "OK" && response.results?.extrafees) {
            const insuranceFee = response.results.extrafees.find((fee: any) => fee.isinsurancefee === true);
            if (insuranceFee) {
              insuranceid = (insuranceFee as any).extrafeeid || 0;
              console.log("Found insurance ID from API:", insuranceid);
            }
          }
        } catch (error) {
          console.error("Failed to fetch insurance ID from API:", error);
        }
      }
      
      // Fallback to booking details if API call failed
      if (insuranceid === 0) {
        insuranceid = typeof bookingDetails.insuranceId === 'string' 
          ? parseInt(bookingDetails.insuranceId) || 0 
          : bookingDetails.insuranceId || 0;
      }
        
      const extrakmsid = typeof bookingDetails.extraKmsId === 'string' 
        ? parseInt(bookingDetails.extraKmsId) || 0 
        : bookingDetails.extraKmsId || 0;

      // Prepare optional fees array from selected extras
      const optionalFees = sessionData?.selectedExtras?.map(extra => ({
        id: extra.id,
        qty: extra.quantity
      })) || [];
      
      console.log('Optional fees prepared for save quotation:', optionalFees);

      const requestPayload = {
        vehiclecategoryid: vehicleCategoryId,
        vehiclecategorytypeid: vehicleCategoryTypeId, // Using corrected value here
        pickuplocationid: pickupLocationId,
        pickupdate: pickupDate,
        pickuptime: bookingDetails.pickupTime,
        dropofflocationid: dropoffLocationId,
        dropoffdate: dropoffDate,
        dropofftime: bookingDetails.dropoffTime,
        ageid: ageid,
        bookingtype: 1,
        emailoption: 1,
        transmission: sessionData?.transmission || 0,
        insuranceid: insuranceid,
        extrakmsid: extrakmsid,
        // Include optional fees (extras) with correct qty parameter
        optionalfees: optionalFees,
        campaigncode: getCampaignCode(
          sessionData?.campaignCode || "", 
          pickupDate, 
          dropoffDate,
          sessionData?.vehicleName,
          sessionData?.vehicleCategoryTypeId
        ),
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

  // Function to update booking payment status in Supabase database
  // Takes status and txnId as parameters to avoid async state issues
  const updateBookingInSupabaseWithStatus = async (
    bookingDetails: BookingDetails, 
    sessionData: any, 
    status: 'success' | 'failed' | 'pending',
    txnId: string
  ) => {
    const bookingRef = bookingDetails.reservationRef || 
                       sessionData?.reservationRef || 
                       sessionData?.bookingReference ||
                       sessionData?.confirmationNumber ||
                       sessionData?.reservationNo;

    if (!bookingRef) {
      console.log("No booking reference found, cannot update payment status");
      return;
    }

    try {
      console.log("Updating booking payment status in Supabase...", { 
        bookingRef, 
        status, 
        txnId 
      });
      
      const result = await updateBookingPaymentStatus(
        bookingRef,
        status === 'success' ? 'paid' : 'pending',
        status === 'success' ? 'confirmed' : 'pending',
        txnId || undefined
      );

      if (result) {
        console.log("Booking payment status updated successfully:", result);
      } else {
        console.log("Could not update booking - may not exist in database yet");
      }
    } catch (error) {
      console.error("Failed to update booking payment status:", error);
      // Don't show error to user as this is a background operation
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
          // Show survey after successful payment
          setTimeout(() => setShowSurvey(true), 2000);
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
            console.log("Fetching booking info for reservation ref:", bookingReservationRef);
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
                const paymentAmount = typeof payment.paidamount === 'string' 
                  ? parseFloat(payment.paidamount) || 0 
                  : payment.paidamount || 0;
                return sum + paymentAmount;
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
                  amount: fee.totalfeeamount || (typeof fee.fees === "number" ? fee.fees : parseFloat(fee.fees) || 0),
                  quantity: 1
                }));

              // Combine and deduplicate mandatory fees by name
              const allMandatoryFees = [
                ...(apiMandatoryFeesFromOldField.map((fee: any) => ({
                  name: fee.name ?? "",
                  amount: fee.totalfeeamount || 
                         (typeof fee.amount === "number" ? fee.amount :
                          parseFloat(fee.amount) || 0),
                  quantity: 1
                })) ?? []),
                ...apiMandatoryFeesFromExtraFees,
              ];

              // Deduplicate by fee name, keeping the first occurrence
              const combinedMandatoryFees = allMandatoryFees.reduce((acc: any[], current: any) => {
                const existingFee = acc.find(fee => fee.name === current.name);
                if (!existingFee) {
                  acc.push(current);
                }
                return acc;
              }, []);
              
              const pickupLocationFromApi = bookingInfo.pickuplocationname || 
                                          bookingInfo.pickuplocation || 
                                          sessionData?.pickupLocationName || 
                                          "Location not available";
                                          
              const dropoffLocationFromApi = bookingInfo.dropofflocationname || 
                                           bookingInfo.dropofflocation || 
                                           sessionData?.dropoffLocationName || 
                                           "Location not available";
              
              console.log("Location information from API:", {
                pickup: pickupLocationFromApi,
                dropoff: dropoffLocationFromApi
              });
              
              let rentalDaysFromDates = 1;
              if (bookingInfo.pickupdate && bookingInfo.dropoffdate) {
                rentalDaysFromDates = calculateRentalDuration(
                  bookingInfo.pickupdate, 
                  bookingInfo.dropoffdate
                );
                console.log("Rental duration calculated from dates:", rentalDaysFromDates);
              }
              
              const numberofdays = typeof bookingInfo.numberofdays === 'string' ? 
                parseInt(bookingInfo.numberofdays) : 
                bookingInfo.numberofdays || 
                rentalDaysFromDates || 1;
                
              console.log("Rental days from API:", numberofdays);
              
              const paymentAmount = paymentStatus === "success" ? 
                (totalPayment || 
                  (typeof bookingInfo.payment === 'string' ? parseFloat(bookingInfo.payment) : bookingInfo.payment) || 
                  sessionData?.paymentAmount || 
                  0) : 
                0;

              const basePrice = typeof bookingInfo.totalcost === 'string' ? 
                parseFloat(bookingInfo.totalcost) : 
                bookingInfo.totalcost || 
                sessionData?.basePrice || 
                0;

              const insurancePrice = typeof bookingInfo.insuranceamount === 'string' ? 
                parseFloat(bookingInfo.insuranceamount) : 
                bookingInfo.insuranceamount || 
                sessionData?.insurancePrice || 
                0;

              const totalRateAfterDiscount = typeof bookingInfo.totalrateafterdiscount === 'string' ? 
                parseFloat(bookingInfo.totalrateafterdiscount) : 
                bookingInfo.totalrateafterdiscount || 
                sessionData?.totalRateAfterDiscount || 
                basePrice;

              const dailyrate = typeof bookingInfo.dailyrate === 'string' ? 
                parseFloat(bookingInfo.dailyrate) : 
                bookingInfo.dailyrate || 
                (basePrice && numberofdays && numberofdays > 0 ?
                  basePrice / numberofdays : 
                  0);

              const totalcost = typeof bookingInfo.totalcost === 'string' ? 
                parseFloat(bookingInfo.totalcost) : 
                bookingInfo.totalcost || 
                totalRateAfterDiscount || 
                sessionData?.totalcost || 
                basePrice;

              const payment = paymentStatus === "success" ? 
                (totalPayment || 
                  (typeof bookingInfo.payment === 'string' ? parseFloat(bookingInfo.payment) : bookingInfo.payment) || 
                  sessionData?.payment || 
                  0) : 
                0;

              const mandatoryFeesTotal = combinedMandatoryFees.reduce((sum, fee) => {
                return sum + (fee.amount || 0);
              }, 0);
              
              const extrasTotal = (sessionData?.selectedExtras || []).reduce(
                (sum, extra) => sum + (extra.price || 0), 
                0
              );
              
              const allCosts = totalcost + mandatoryFeesTotal + extrasTotal;
              const balanceDue = allCosts - payment;
              
              const apiBalanceDue = typeof bookingInfo.balancedue === 'string' 
                ? parseFloat(bookingInfo.balancedue) 
                : bookingInfo.balancedue;

              const calculatedBalanceDue = balanceDue > 0 ? balanceDue : 0;

              const convertedDetails: BookingDetails = {
                vehicleName: bookingInfo.vehiclecategory || sessionData?.vehicleName || 'Vehicle',
                pickupDate: bookingInfo.pickupdate || sessionData?.pickupDate || '',
                pickupTime: bookingInfo.pickuptime || sessionData?.pickupTime || '',
                dropoffDate: bookingInfo.dropoffdate || sessionData?.dropoffDate || '',
                dropoffTime: bookingInfo.dropofftime || sessionData?.dropoffTime || '',
                paymentAmount: paymentAmount,
                basePrice: basePrice,
                reservationRef: bookingReservationRef,
                vehicleImage: apiVehicleImageUrl || sessionData?.vehicleImage || '',
                insuranceName: bookingInfo.insuranceoption || sessionData?.insuranceName || '',
                insurancePrice: insurancePrice,
                selectedExtras: sessionData?.selectedExtras || [],
                pickupLocationName: pickupLocationFromApi,
                dropoffLocationName: dropoffLocationFromApi,
                totalRateAfterDiscount: totalRateAfterDiscount,
                mandatoryFees: combinedMandatoryFees.length > 0 ? combinedMandatoryFees : (sessionData?.mandatoryFees || []),
                numberofdays: numberofdays,
                dailyrate: dailyrate,
                totalcost: totalcost,
                payment: payment,
                balancedue: apiBalanceDue ?? calculatedBalanceDue,
                customerFirstName: customerInfo.firstname || sessionData?.customerFirstName || '',
                customerLastName: customerInfo.lastname || sessionData?.customerLastName || '',
                customerEmail: customerInfo.email || sessionData?.customerEmail || '',
                customerPhone: customerInfo.phone || customerInfo.mobile || sessionData?.customerPhone || '',
                vehicleCategoryId: bookingInfo.vehiclecategoryid || sessionData?.vehicleCategoryId,
                vehicleCategoryTypeId: (bookingInfo as any).vehiclecategorytypeid || sessionData?.vehicleCategoryTypeId,
                pickupLocationId: (bookingInfo as any).pickuplocationid || sessionData?.pickupLocationId,
                dropoffLocationId: (bookingInfo as any).dropofflocationid || sessionData?.dropoffLocationId,
                driverageId: (bookingInfo as any).ageid || sessionData?.driverageId || sessionData?.ageId,
                insuranceId: (bookingInfo as any).insuranceid || sessionData?.insuranceId,
                extraKmsId: (bookingInfo as any).extrakmsid || sessionData?.extraKmsId
              };
              
              setBookingDetails(convertedDetails);
              
              // Use RCM-provided number of days only; avoid local calculation
              const rcmDays = (typeof numberofdays === 'number' && numberofdays > 0) ? numberofdays : 1;
              setRentalDuration(rcmDays);
              console.log('Setting rental duration from API numberofdays:', rcmDays);
              
              console.log("Booking details set from API:", convertedDetails);
              
              // Update booking payment status in Supabase after successful payment
              // Use 'result' from URL params (not state) since state update is async
              if (result === 'success') {
                await updateBookingInSupabaseWithStatus(convertedDetails, sessionData, 'success', txnId);
                clearBookingData();
                console.log("Booking data cleared from session after successful payment");
              }
            } else {
              throw new Error(apiResponse.error || "Failed to fetch booking details");
            }
          } catch (apiError) {
            console.error("Error fetching booking details from API:", apiError);
            // Fall back to session data for failed API calls
            if (sessionData) {
              setUpSessionDataFallback(sessionData, result || 'pending', txnId);
            }
          }
        } else if (sessionData) {
          // No reservation reference but session data exists
          setUpSessionDataFallback(sessionData, result || 'pending', txnId);
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

    // Function to set up booking details from session data
    const setUpSessionDataFallback = async (sessionData: any, resultStatus: string, txnId: string) => {
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

      let pickupLocationFromSession = cleanedSessionData.pickupLocationName || "Location not available";
      let dropoffLocationFromSession = cleanedSessionData.dropoffLocationName || "Location not available";
      
      if (pickupLocationFromSession === "undefined" || pickupLocationFromSession === "null" || pickupLocationFromSession === null) {
        pickupLocationFromSession = "Location not available";
      }
      
      if (dropoffLocationFromSession === "undefined" || dropoffLocationFromSession === "null" || dropoffLocationFromSession === null) {
        dropoffLocationFromSession = "Location not available";
      }
      
      console.log("Location names from session:", {
        pickup: pickupLocationFromSession,
        dropoff: dropoffLocationFromSession
      });

      const rentalDaysFromDates = cleanedSessionData.pickupDate && cleanedSessionData.dropoffDate ? 
        calculateRentalDuration(cleanedSessionData.pickupDate, cleanedSessionData.dropoffDate) : 1;
          
      const numberofdays = cleanedSessionData.numberofdays || rentalDaysFromDates || 1;
          
      console.log("Rental days calculated from session:", numberofdays);

      const basePrice = cleanedSessionData.basePrice || cleanedSessionData.totalRateAfterDiscount || 0;
      const dailyrate = cleanedSessionData.dailyrate || 
        (basePrice && numberofdays && numberofdays > 0 ? 
          basePrice / numberofdays : 0);

      const totalcost = cleanedSessionData.totalcost || 
                      cleanedSessionData.totalRateAfterDiscount || 
                      cleanedSessionData.basePrice || 0;
                      
      console.log("Total cost from session:", totalcost);

      const paymentAmount = paymentStatus === "success" ? 
        (cleanedSessionData.payment || cleanedSessionData.paymentAmount || 0) : 0;
      
      // Deduplicate mandatory fees from session data by name
      const sessionMandatoryFees = (cleanedSessionData.mandatoryFees || []).reduce((acc: any[], current: any) => {
        const existingFee = acc.find(fee => fee.name === current.name);
        if (!existingFee) {
          acc.push({
            ...current,
            amount: current.totalfeeamount || current.amount || 0,
            quantity: 1
          });
        }
        return acc;
      }, []);
      
      const mandatoryFeesWithQuantity = sessionMandatoryFees;
      
      const mandatoryFeesTotal = mandatoryFeesWithQuantity.reduce(
        (sum: number, fee: any) => sum + (fee.amount || 0), 
        0
      );
      
      const extrasTotal = (cleanedSessionData.selectedExtras || []).reduce(
        (sum: number, extra: any) => sum + (extra.price || 0), 
        0
      );
      
      const allCosts = totalcost + mandatoryFeesTotal + extrasTotal;
      const balanceDue = allCosts - paymentAmount;
      
      const calculatedBalanceDue = balanceDue > 0 ? balanceDue : 0;

      const convertedDetails: BookingDetails = {
        vehicleName: cleanedSessionData.vehicleName || 'Vehicle',
        pickupDate: cleanedSessionData.pickupDate || '',
        pickupTime: cleanedSessionData.pickupTime || '', 
        dropoffDate: cleanedSessionData.dropoffDate || '',
        dropoffTime: cleanedSessionData.dropoffTime || '',
        paymentAmount: paymentAmount,
        basePrice: basePrice,
        paymentType: cleanedSessionData.paymentType,
        customerFirstName: cleanedSessionData.customerFirstName,
        customerLastName: cleanedSessionData.customerLastName,
        customerEmail: cleanedSessionData.customerEmail,
        customerPhone: cleanedSessionData.customerPhone,
        customerDob: cleanedSessionData.customerDob,
        customerLicenseExpiry: cleanedSessionData.customerLicenseExpiry,
        customerAddress: cleanedSessionData.customerAddress,
        reservationRef: cleanedSessionData.reservationRef || cleanedSessionData.bookingReference || 
                       cleanedSessionData.confirmationNumber || cleanedSessionData.reservationNo,
        vehicleImage: vehicleImage,
        insuranceName: cleanedSessionData.insuranceName,
        insurancePrice: cleanedSessionData.insurancePrice || 0,
        selectedExtras: cleanedSessionData.selectedExtras?.map((extra: any) => ({
          name: extra.name,
          quantity: extra.quantity,
          price: extra.price
        })) || [],
        extraKmsName: cleanedSessionData.extraKmsName,
        extraKmsPrice: cleanedSessionData.extraKmsPrice,
        pickupLocationName: pickupLocationFromSession,
        dropoffLocationName: dropoffLocationFromSession,
        totalRateAfterDiscount: cleanedSessionData.totalRateAfterDiscount || basePrice,
        mandatoryFees: mandatoryFeesWithQuantity || [],
        numberofdays: numberofdays,
        dailyrate: dailyrate,
        totalcost: totalcost,
        payment: paymentAmount,
        balancedue: balanceDue,
        pickupLocationId: cleanedSessionData.pickupLocationId,
        dropoffLocationId: cleanedSessionData.dropoffLocationId,
        vehicleCategoryId: cleanedSessionData.vehicleCategoryId,
        vehicleCategoryTypeId: cleanedSessionData.vehicleCategoryTypeId,
        driverageId: cleanedSessionData.driverageId || cleanedSessionData.ageId,
        insuranceId: cleanedSessionData.insuranceId,
        extraKmsId: cleanedSessionData.extraKmsId
      };
      
      setBookingDetails(convertedDetails);
      
      // Use RCM-provided number of days only; avoid local calculation
      const rcmDays = (typeof numberofdays === 'number' && numberofdays > 0) ? numberofdays : 1;
      setRentalDuration(rcmDays);
      console.log('Setting rental duration from RCM numberofdays:', rcmDays);
      
      console.log("Booking details set from session:", convertedDetails);
      
      // Update booking payment status in Supabase after successful payment
      if (resultStatus === "success") {
        await updateBookingInSupabaseWithStatus(convertedDetails, cleanedSessionData, 'success', txnId);
        clearBookingData();
        console.log("Booking data cleared from session after successful payment (fallback path)");
      }
    };

    fetchBookingDetails();
  }, [location, paymentStatus]);

  useEffect(() => {
    const gaId = 'G-4E4P8VX8DK';
    const ensureGAScript = () => {
      const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
      if (!existing) {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(s);
      }
    };

    if (paymentStatus === 'success') {
      try {
        ensureGAScript();

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

        window.gtag('js', new Date());
        window.gtag('config', gaId);

        window.gtag('event', 'conversion', {
          send_to: 'AW-11070147455/Us8gCObpsbIaEP-W1J4p',
          value: 1.0,
          currency: 'NZD',
          transaction_id: ''
        });
        console.log('Google Ads conversion event fired on payment success');
      } catch (err) {
        console.error('Failed to fire GA/Ads tags on payment success:', err);
      }
    }
  }, [paymentStatus]);

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
        return days > 0 ? days : 1;
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

  const pickupLocationName = bookingDetails?.pickupLocationName && 
                           bookingDetails.pickupLocationName !== "undefined" ? 
                           bookingDetails.pickupLocationName : "Location not available";

  const dropoffLocationName = bookingDetails?.dropoffLocationName && 
                            bookingDetails.dropoffLocationName !== "undefined" ? 
                            bookingDetails.dropoffLocationName : "Location not available";

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
          reservationRef={bookingDetails?.reservationRef}
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
              totalCost={bookingDetails.totalcost || bookingDetails.totalRateAfterDiscount || bookingDetails.basePrice}
              payment={bookingDetails.payment || bookingDetails.paymentAmount}
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
      
      <BookingExperienceSurvey 
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        bookingReference={bookingDetails?.reservationRef}
        customerName={bookingDetails ? `${bookingDetails.customerFirstName || ''} ${bookingDetails.customerLastName || ''}`.trim() : undefined}
        customerEmail={bookingDetails?.customerEmail}
      />
    </div>
  );
};

export default PaymentSuccess;
