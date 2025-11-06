import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { Label } from "@/components/ui/label";
import { formatCurrency, getCampaignCode } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Car, Save } from "lucide-react";
import PaymentSummary from "@/components/payment/PaymentSummary";
import RentalDetails from "@/components/payment/RentalDetails";
import { rcmApi } from "@/lib/api/rcm-api";
import { RCMBookingResponse } from "@/lib/api/rcm-api-types";
import { format, addDays } from "date-fns";
import { useRcmApi } from "@/hooks/use-rcm-api";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const DEPOSIT_AMOUNT = 50;

const PaymentOptions = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("full");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mandatoryFeesTotal, setMandatoryFeesTotal] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [bookingInfoTotalCost, setBookingInfoTotalCost] = useState<number | undefined>(undefined);
  const [lastRequestPayload, setLastRequestPayload] = useState<any>(null);
  const [securityBond, setSecurityBond] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLicense, setAcceptedLicense] = useState(false);
  const [acceptedBond, setAcceptedBond] = useState(false);
  const { useLocationDetails } = useRcmApi();
  const { data: locationDetails } = useLocationDetails();

  // Fire GA4 and Google Ads conversion once booking is successfully created (reservationRef present)
  const hasFiredGAReservation = React.useRef(false);
  useEffect(() => {
    const reservationRef = (bookingDetails as any)?.reservationRef || getBookingData()?.reservationRef;
    if (!hasFiredGAReservation.current && reservationRef) {
      try {
        const gaId = 'G-4E4P8VX8DK';
        const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`);
        if (!existing) {
          const s = document.createElement('script');
          s.async = true;
          s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(s);
        }

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = (window as any).gtag || function(){ (window as any).dataLayer.push(arguments); };
        (window as any).gtag('js', new Date());
        (window as any).gtag('config', gaId);

        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-11070147455/6vhkCISpqYkYEP-W1J4p',
          transaction_id: ''
        });

        hasFiredGAReservation.current = true;
      } catch (err) {
        console.error('GA tag fire failed (G-4E4P8VX8DK):', err);
      }
    }
  }, [bookingDetails]);

  useEffect(() => {
    const bookingData = getBookingData();
    
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
      return;
    }
    
    console.log("Full booking session data:", bookingData);
    
    const pickupLocationId = bookingData.pickupLocationId;
    const dropoffLocationId = bookingData.dropoffLocationId;
    
    console.log("Location IDs:", { 
      pickupLocationId, 
      dropoffLocationId,
      locations: locationDetails || []
    });
    
    let pickupLocationName = "Location not available";
    let dropoffLocationName = "Location not available";
    
    if (locationDetails && locationDetails.length > 0) {
      const pickupLoc = locationDetails.find(
        (loc: any) => String(loc.id) === String(pickupLocationId)
      );
      
      const dropoffLoc = locationDetails.find(
        (loc: any) => String(loc.id) === String(dropoffLocationId)
      );
      
      if (pickupLoc) {
        pickupLocationName = pickupLoc.location || pickupLocationName;
        console.log("Found pickup location:", pickupLocationName);
      }
      
      if (dropoffLoc) {
        dropoffLocationName = dropoffLoc.location || dropoffLocationName;
        console.log("Found dropoff location:", dropoffLocationName);
      }
    } else {
      pickupLocationName = bookingData.pickupLocationName || pickupLocationName;
      dropoffLocationName = bookingData.dropoffLocationName || dropoffLocationName;
    }
    
    console.log("Final location names:", { pickupLocationName, dropoffLocationName });
    
    setBookingDetails(prevState => ({
      ...prevState,
      ...bookingData,
      pickupLocationName,
      dropoffLocationName
    }));

    let calculatedDays = 1;
    let calculatedTotal = 0;
    
    if (bookingData.numberofdays && typeof bookingData.numberofdays === 'number' && bookingData.numberofdays > 0) {
      console.log("Using numberofdays from booking data:", bookingData.numberofdays);
      calculatedDays = bookingData.numberofdays;
    } 
    else if (bookingData.pickupDate && bookingData.dropoffDate) {
      try {
        const pickupDate = new Date(bookingData.pickupDate);
        const dropoffDate = new Date(bookingData.dropoffDate);
        if (pickupDate && dropoffDate && !isNaN(pickupDate.getTime()) && !isNaN(dropoffDate.getTime())) {
          const timeDiff = dropoffDate.getTime() - pickupDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          // Add 1 to include both pickup and dropoff days
          calculatedDays = Math.max(1, daysDiff + 1);
          console.log("Calculated rental days from dates:", calculatedDays);
        }
      } catch (error) {
        console.error("Error calculating rental days:", error);
        calculatedDays = 1;
      }
    }
    
    setRentalDays(calculatedDays);
    updateBookingData({ rentalDays: calculatedDays });
    
    if (calculatedTotal > 0) {
      setTotalAmount(calculatedTotal);
    } else {
      const basePrice = bookingData.totalRateAfterDiscount || bookingData.basePrice || 0;
      console.log("Using price for calculation:", basePrice, 
        bookingData.totalRateAfterDiscount ? "(from totalRateAfterDiscount)" : "(from basePrice)");
      
      const insurancePrice = bookingData.insurancePrice || 0;
      const extrasTotal = (bookingData.selectedExtras || []).reduce(
        (sum: number, extra: any) => sum + (extra.price * extra.quantity), 
        0
      );
      
      // Deduplicate mandatory fees by name before calculating total
      const deduplicatedMandatoryFees = (bookingData.mandatoryFees || []).reduce((acc: any[], current: any) => {
        const existingFee = acc.find(fee => fee.name === current.name);
        if (!existingFee) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      const mandatoryTotal = deduplicatedMandatoryFees.reduce(
        (sum: number, fee: any) => sum + fee.amount,
        0
      );
      setMandatoryFeesTotal(mandatoryTotal);
      
      const calculatedTotal = basePrice + insurancePrice + extrasTotal;
      setTotalAmount(calculatedTotal);
      
      console.log("Payment calculation details:", {
        basePrice,
        rentalDays: calculatedDays,
        insurancePrice,
        extrasTotal,
        mandatoryTotal,
        calculatedTotal,
        fullData: bookingData
      });
    }

    // Deduplicate mandatory fees by name before calculating total
    const deduplicatedMandatoryFees = (bookingData.mandatoryFees || []).reduce((acc: any[], current: any) => {
      const existingFee = acc.find(fee => fee.name === current.name);
      if (!existingFee) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    const mandatoryTotal = deduplicatedMandatoryFees.reduce(
      (sum: number, fee: any) => sum + fee.amount,
      0
    );
    
    const fullTotal = totalAmount + mandatoryTotal;
    setTotalCost(fullTotal);
    
    console.log("Total cost calculation:", {
      totalAmount,
      mandatoryTotal,
      fullTotal
    });

    if (bookingData.reservationRef) {
      fetchBookingDetails(bookingData.reservationRef);
    }
  }, [navigate, locationDetails]);

  // Reset image error when vehicle image changes
  useEffect(() => {
    if (bookingDetails?.vehicleImage) {
      setImageError(false);
    }
  }, [bookingDetails?.vehicleImage]);

  const fetchBookingDetails = async (reservationRef: string) => {
    try {
      console.log("Fetching booking details for reservation:", reservationRef);
      const response = await rcmApi.request<RCMBookingResponse>('POST', 'bookinginfo', {
        method: 'bookinginfo',
        reservationref: reservationRef
      });
      
      console.log("Booking info API response:", response);
      
      if (response.status === "OK" && response.results?.bookinginfo?.[0]) {
        const bookingInfo = response.results.bookinginfo[0];
        
        // Extract security bond from extrafees
        let bondAmount = 0;
        const bondFee = response.results.extrafees?.find((fee: any) => fee.isbondfee === true);
        if (bondFee) {
          bondAmount = typeof bondFee.fees === 'string' ? parseFloat(bondFee.fees) : bondFee.fees;
          setSecurityBond(bondAmount);
        }

        // Update booking details with the vehicle category information from API
        const updatedBookingData = {
          vehicleCategoryId: bookingInfo.vehiclecategoryid,
          vehicleName: bookingInfo.vehiclecategory,
          vehicleImage: bookingInfo.vehicleimage,
          numberofdays: typeof bookingInfo.numberofdays === 'string' 
            ? parseInt(bookingInfo.numberofdays) 
            : bookingInfo.numberofdays,
          dailyrate: typeof bookingInfo.dailyrate === 'string' 
            ? parseFloat(bookingInfo.dailyrate) 
            : bookingInfo.dailyrate,
          totalcost: typeof bookingInfo.totalcost === 'string' 
            ? parseFloat(bookingInfo.totalcost) 
            : bookingInfo.totalcost
        };
        
        // Update session storage with the correct vehicle category information
        updateBookingData(updatedBookingData);
        
        // Update local state, preserving existing vehicle image if new one is not provided
        setBookingDetails(prev => ({ 
          ...prev, 
          ...updatedBookingData,
          // Always preserve the existing image if the new one is empty or undefined
          vehicleImage: updatedBookingData.vehicleImage && updatedBookingData.vehicleImage.trim() !== '' 
            ? updatedBookingData.vehicleImage 
            : prev?.vehicleImage
        }));
        
        if (bookingInfo.totalcost) {
          const totalCostValue = Number(bookingInfo.totalcost);
          
          if (!isNaN(totalCostValue)) {
            // Subtract security bond from total cost for display purposes
            const displayTotalCost = totalCostValue - bondAmount;
            setBookingInfoTotalCost(displayTotalCost);
            setTotalCost(displayTotalCost);
            console.log("Set total cost from booking info (excluding security bond):", displayTotalCost, "Original:", totalCostValue, "Bond:", bondAmount);
          } else {
            console.warn("Invalid totalcost value:", bookingInfo.totalcost);
          }
        }
        
        if (bookingInfo.numberofdays) {
          const daysValue = Number(bookingInfo.numberofdays);
          if (!isNaN(daysValue) && daysValue > 0) {
            setRentalDays(daysValue);
            console.log("Set rental days from booking info:", daysValue);
          }
        }
        
        console.log("Updated booking details with vehicle category info:", updatedBookingData);
      }
      
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
    }
  };

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
        
        const newDropoffDate = addDays(newPickupDate, rentalDays || 3);
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

      const vehicleCategoryId = typeof bookingDetails.vehicleCategoryId === 'string' 
        ? parseInt(bookingDetails.vehicleCategoryId) 
        : bookingDetails.vehicleCategoryId;
        
      const vehicleCategoryTypeId = typeof bookingDetails.vehicleCategoryTypeId === 'string' 
        ? parseInt(bookingDetails.vehicleCategoryTypeId) 
        : bookingDetails.vehicleCategoryTypeId;

      // Validate required vehicle IDs
      if (!vehicleCategoryId || !vehicleCategoryTypeId) {
        console.error("Missing vehicle category information:", { vehicleCategoryId, vehicleCategoryTypeId });
        toast.error("Missing vehicle information", {
          description: "Please select a vehicle again to save the quote."
        });
        return;
      }
        
      const pickupLocationId = typeof bookingDetails.pickupLocationId === 'string' 
        ? parseInt(bookingDetails.pickupLocationId) || 1 
        : bookingDetails.pickupLocationId || 1;
        
      const dropoffLocationId = typeof bookingDetails.dropoffLocationId === 'string' 
        ? parseInt(bookingDetails.dropoffLocationId) || 1 
        : bookingDetails.dropoffLocationId || 1;
        
      const ageid = typeof bookingDetails.driverageId === 'string' 
        ? parseInt(bookingDetails.driverageId) || 4 
        : bookingDetails.driverageId || 4;
        
      const insuranceid = typeof bookingDetails.insuranceId === 'string' 
        ? parseInt(bookingDetails.insuranceId) || 0 
        : bookingDetails.insuranceId || 0;
        
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
        vehiclecategorytypeid: vehicleCategoryTypeId,
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
        // Ensure campaign code is properly included to preserve discount
        ...(getCampaignCode(
          bookingDetails.campaignCode || sessionData?.campaignCode || "", 
          pickupDate, 
          dropoffDate,
          sessionData?.vehicleName,
          sessionData?.vehicleCategoryTypeId
        ) ? { 
          campaigncode: getCampaignCode(
            bookingDetails.campaignCode || sessionData?.campaignCode || "", 
            pickupDate, 
            dropoffDate,
            sessionData?.vehicleName,
            sessionData?.vehicleCategoryTypeId
          ) 
        } : {}),
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
      
      const finalCampaignCode = getCampaignCode(
        bookingDetails.campaignCode || sessionData?.campaignCode || "", 
        pickupDate, 
        dropoffDate,
        sessionData?.vehicleName,
        sessionData?.vehicleCategoryTypeId
      );
      
      console.log('Campaign code debug info:', {
        bookingDetailsCampaignCode: bookingDetails.campaignCode,
        sessionDataCampaignCode: sessionData?.campaignCode,
        vehicleName: sessionData?.vehicleName,
        vehicleCategoryTypeId: sessionData?.vehicleCategoryTypeId,
        totalDiscountAmount: sessionData?.totalDiscountAmount,
        finalCampaignCode: finalCampaignCode,
        pickupDate,
        dropoffDate
      });
      
      console.log('Sending save quotation request with payload:', requestPayload);
      setLastRequestPayload(requestPayload);

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

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center py-8">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all checkboxes are checked
    if (!acceptedTerms || !acceptedLicense || !acceptedBond) {
      toast.error("Please accept all terms and conditions", {
        description: "You must agree to all requirements before proceeding.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const amountToPay = paymentType === "deposit" ? DEPOSIT_AMOUNT : totalCost;
      
      updateBookingData({
        paymentAmount: amountToPay,
        paymentType: paymentType
      });
      
      navigate("/payment");
    } catch (error) {
      console.error("Error processing payment option:", error);
      toast.error("An error occurred", {
        description: "Could not proceed with payment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ExitIntentPopup />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Payment Options</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          {(() => {
            const imageUrl = bookingDetails?.vehicleImage && !imageError 
              ? (bookingDetails.vehicleImage.startsWith('http') 
                  ? bookingDetails.vehicleImage 
                  : `https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/${bookingDetails.vehicleImage}`)
              : null;
            
            console.log('Vehicle image debug:', {
              originalImage: bookingDetails?.vehicleImage,
              imageError,
              constructedUrl: imageUrl,
              shouldShowImage: !!(bookingDetails?.vehicleImage && !imageError)
            });
            
            return imageUrl ? (
              <div className="w-full mb-6">
                <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={bookingDetails.vehicleName}
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                    onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="w-full mb-6">
                <AspectRatio ratio={4/3} className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <Car className="h-24 w-24 text-gray-300" />
                </AspectRatio>
              </div>
            );
          })()}

          <RentalDetails
            vehicleName={bookingDetails?.vehicleName || ""}
            pickupLocationName={bookingDetails?.pickupLocationName || ""}
            dropoffLocationName={bookingDetails?.dropoffLocationName || ""}
            formattedPickupDate={bookingDetails?.pickupDate || ""}
            formattedDropoffDate={bookingDetails?.dropoffDate || ""}
            pickupTime={bookingDetails?.pickupTime || ""}
            dropoffTime={bookingDetails?.dropoffTime || ""}
            rentalDuration={rentalDays}
          />

          <PaymentSummary
            rentalDays={rentalDays}
            dailyRate={(bookingDetails?.dailyrate && bookingDetails.dailyrate > 0)
              ? bookingDetails.dailyrate
              : (rentalDays > 0 ? ((bookingDetails?.totalcost || bookingDetails?.basePrice || 0) / rentalDays) : 0)}
            insuranceName={bookingDetails?.insuranceName}
            insurancePrice={bookingDetails?.insurancePrice}
            extraKmsName={bookingDetails?.extraKmsName}
            extraKmsPrice={bookingDetails?.extraKmsPrice}
            selectedExtras={bookingDetails?.selectedExtras}
            mandatoryFees={bookingDetails?.mandatoryFees ? 
              bookingDetails.mandatoryFees.reduce((acc: any[], current: any) => {
                const existingFee = acc.find(fee => fee.name === current.name);
                if (!existingFee) {
                  acc.push(current);
                }
                return acc;
              }, []) : []
            }
            totalCost={totalCost}
            bookingInfoTotalCost={bookingInfoTotalCost}
            payment={paymentType === "deposit" ? DEPOSIT_AMOUNT : totalCost}
            balanceDue={paymentType === "deposit" ? totalCost - DEPOSIT_AMOUNT : 0}
          />
          
          {/* Complete your booking section */}
          <Card className="mb-6 bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Complete your booking</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-1 border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" className="font-semibold underline hover:text-primary-foreground/80" target="_blank">
                      Terms & Conditions
                    </Link>
                    .
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="license"
                    checked={acceptedLicense}
                    onCheckedChange={(checked) => setAcceptedLicense(checked as boolean)}
                    className="mt-1 border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                  />
                  <Label htmlFor="license" className="text-sm leading-relaxed cursor-pointer">
                    To hire a vehicle, you will need a valid and full or restricted Driver's Licence depending on the type of vehicle you are hiring. I consent to James Blond verifying my driver licence details with authorised third-party services for the purposes of identity verification and rental eligibility - Please select to confirm
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="bond"
                    checked={acceptedBond}
                    onCheckedChange={(checked) => setAcceptedBond(checked as boolean)}
                    className="mt-1 border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                  />
                  <Label htmlFor="bond" className="text-sm leading-relaxed cursor-pointer">
                    A Full or Restricted Driver's License and a valid Credit/Debit Card matching the name of the hirer must be provided for payment and security at the time of vehicle pick up. The bond of either $200 or $300 will be applied to your card at the time of pick up, depending on the type of vehicle you have booked.
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <RadioGroup 
              value={paymentType} 
              onValueChange={(value) => setPaymentType(value as "deposit" | "full")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="full" id="payment-full" />
                <Label htmlFor="payment-full" className="flex-grow cursor-pointer">
                  <div className="font-medium">Pay in Full</div>
                  <div className="text-sm text-gray-600">Pay {formatCurrency(totalCost)} now</div>
                </Label>
                <div className="font-bold">{formatCurrency(totalCost)}</div>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value="deposit" id="payment-deposit" />
                <Label htmlFor="payment-deposit" className="flex-grow cursor-pointer">
                  <div className="font-medium">Pay Deposit</div>
                  <div className="text-sm text-gray-600">
                    Pay {formatCurrency(DEPOSIT_AMOUNT)} now, {formatCurrency(totalCost - DEPOSIT_AMOUNT)} at pickup
                  </div>
                </Label>
                <div className="font-bold">{formatCurrency(DEPOSIT_AMOUNT)}</div>
              </div>
            </RadioGroup>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button 
              type="submit"
              disabled={isLoading || !acceptedTerms || !acceptedLicense || !acceptedBond}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">◌</span> Processing...
                </>
              ) : (
                `Proceed to Pay ${paymentType === "deposit" ? formatCurrency(DEPOSIT_AMOUNT) : formatCurrency(totalCost)}`
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleSaveQuotation}
              className="w-full"
            >
              <Save className="mr-2" />
              Save Quotation
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
