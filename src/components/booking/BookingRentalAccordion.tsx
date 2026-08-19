import React from 'react';
import { ChevronDown, Car, MapPin, Calendar, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getBookingData } from '@/lib/booking-session';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { qualifiesForMidweekDiscount } from '@/components/home/form-components/DateTimeUtils';
import RentalDetails from '@/components/payment/RentalDetails';

interface BookingRentalAccordionProps {
  className?: string;
}

const BookingRentalAccordion = ({ className = '' }: BookingRentalAccordionProps) => {
  const bookingData = getBookingData();
  const { useLocations } = useRcmApi();
  const { data: locations = [] } = useLocations();

  if (!bookingData) {
    return null;
  }

  // Use RCM-provided number of days; avoid local calculation per requirements
  const duration = (typeof (bookingData as any).numberofdays === 'number' && (bookingData as any).numberofdays > 0)
    ? (bookingData as any).numberofdays
    : 1;
  
  // Prefer daily rate when available; otherwise fall back to stored total
  const dailyRate = (bookingData as any).dailyrate || 0;
  let basePrice = dailyRate > 0
    ? dailyRate * duration
    : (bookingData.totalRateAfterDiscount || bookingData.basePrice || 0);
    
  // Check if discount qualifies (for display purposes only - discount is applied via API campaign code)
  const pickupDate = new Date(bookingData.pickupDate.split('/').reverse().join('-'));
  const dropoffDate = new Date(bookingData.dropoffDate.split('/').reverse().join('-'));
  const qualifiesForDiscount = qualifiesForMidweekDiscount(pickupDate, dropoffDate) && 
    (bookingData.vehicleName?.toLowerCase().includes('jumbo') || 
     bookingData.vehicleName?.toLowerCase().includes('truck') ||
     bookingData.vehicleName?.toLowerCase().includes('ton') ||
     bookingData.vehicleName?.toLowerCase().includes('box') ||
     bookingData.vehicleName?.toLowerCase().includes('tipper'));
  
  // Note: Discount is applied via API campaign code, not locally
  
  const extrasTotal = bookingData.selectedExtras?.reduce((total, extra) => {
    return total + (extra.price * extra.quantity);
  }, 0) || 0;
  
  // Insurance price is stored as total for the rental (not per day)
  const rawInsurancePrice = bookingData.insurancePrice;
  const insurancePrice = typeof rawInsurancePrice === 'number' ? rawInsurancePrice : parseFloat(String(rawInsurancePrice)) || 0;
  console.log('BookingRentalAccordion - insurance debug:', { 
    rawInsurancePrice, 
    parsedInsurancePrice: insurancePrice,
    typeOf: typeof rawInsurancePrice 
  });
  
  // Mileage charge is per day; multiply by duration if present
  const extraKmsDaily = bookingData.extraKmsPrice || 0;
  const extraKmsTotal = extraKmsDaily * duration;
  
  // Deduplicate mandatory fees by name before calculation (safety net)
  const dedupedFees = (bookingData.mandatoryFees || []).reduce((acc: any[], current: any) => {
    if (!acc.find(fee => fee.name === current.name)) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Separate mandatory fees: bond, one-way fee, and other fees
  const { otherFeesTotal, bondAmount, oneWayFee } = dedupedFees.reduce(
    (acc, fee) => {
      const name = (fee.name || '').toLowerCase();
      const group = ((fee as any).feegroupname || '').toLowerCase();
      const combined = `${name} ${group}`;
      const amount = fee.amount || 0;
      if (name.includes('bond')) acc.bondAmount += amount;
      else if (
        combined.includes('one way') ||
        combined.includes('one-way') ||
        combined.includes('oneway') ||
        combined.includes('relocation') ||
        combined.includes('reloc')
      ) acc.oneWayFee += amount;
      else acc.otherFeesTotal += amount;
      return acc;
    },
    { otherFeesTotal: 0, bondAmount: 0, oneWayFee: 0 }
  );
  
  // Rental + Insurance combined (includes base price, insurance, extras, km charges, and other fees)
  const rentalAndInsurance = basePrice + insurancePrice + extrasTotal + extraKmsTotal + otherFeesTotal;
  
  const totalPrice = Math.max(0, rentalAndInsurance + oneWayFee);
  console.log('BookingRentalAccordion totals:', { duration, dailyRate, basePrice, insurancePrice, extrasTotal, extraKmsTotal, otherFeesTotal, oneWayFee, rentalAndInsurance, totalPrice, qualifiesForDiscount });

  // Get vehicle image with fallback
  const getImageUrl = () => {
    if (!bookingData.vehicleImage) {
      return '/placeholder.svg';
    }
    return bookingData.vehicleImage;
  };

  // Format dates for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return 'Not specified';
    try {
      const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
      return format(parsed, 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };


  // Get location names from API if not present in booking data
  const getLocationName = (locationId: string | number, fallbackName?: string) => {
    if (fallbackName && fallbackName.trim() !== "") {
      return fallbackName;
    }
    
    const location = locations.find(loc => loc.id.toString() === locationId.toString());
    return location?.name || "Location not specified";
  };

  const pickupLocationName = getLocationName(bookingData.pickupLocationId || "", bookingData.pickupLocationName);
  const dropoffLocationName = getLocationName(bookingData.dropoffLocationId || "", bookingData.dropoffLocationName);

  return (
    <div className={`w-full mb-6 ${className}`}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rental-details" className="border rounded-lg shadow-sm bg-card">
          <AccordionTrigger className="hover:no-underline p-2 sm:p-4">
            <div className="flex items-center justify-between w-full gap-2 sm:gap-3">
              {/* Vehicle Image */}
              <div className="w-24 h-16 sm:w-32 sm:h-20 rounded overflow-hidden bg-white flex-shrink-0">
                <img
                  src={getImageUrl()}
                  alt={bookingData.vehicleName || 'Vehicle'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Vehicle Details and Price - Combined on mobile */}
              <div className="text-right min-w-0 flex-1">
                {/* Vehicle name - hidden on mobile when collapsed */}
                <h3 className="hidden sm:block font-semibold text-base sm:text-lg truncate mb-1">{bookingData.vehicleName || 'Selected Vehicle'}</h3>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                  {formatDateForDisplay(bookingData.pickupDate)} - {formatDateForDisplay(bookingData.dropoffDate)}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  NZ${totalPrice.toFixed(2)} <span className="text-xs sm:text-sm font-normal">TOTAL</span>
                </div>
                {/* Price breakdown - hidden on mobile when collapsed */}
                <div className="hidden sm:block text-xs text-muted-foreground space-y-0.5">
                  <div>Rental + Insurance: NZ${rentalAndInsurance.toFixed(2)}</div>
                  {oneWayFee > 0 && <div>One Way Fee: NZ${oneWayFee.toFixed(2)}</div>}
                </div>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="p-4 pt-0">
            <div className="border-t pt-4">
              <RentalDetails
                vehicleName={bookingData.vehicleName || 'Selected Vehicle'}
                pickupLocationName={pickupLocationName}
                dropoffLocationName={dropoffLocationName}
                formattedPickupDate={formatDateForDisplay(bookingData.pickupDate)}
                formattedDropoffDate={formatDateForDisplay(bookingData.dropoffDate)}
                pickupTime={bookingData.pickupTime || ''}
                dropoffTime={bookingData.dropoffTime || ''}
                rentalDuration={duration}
                rateType="daily"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BookingRentalAccordion;