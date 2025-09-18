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

  // Calculate rental duration first
  const calculateDuration = () => {
    if (!bookingData.pickupDate || !bookingData.dropoffDate) return 1;
    try {
      const pickup = parse(bookingData.pickupDate, 'dd/MM/yyyy', new Date());
      const dropoff = parse(bookingData.dropoffDate, 'dd/MM/yyyy', new Date());
      const diffInTime = dropoff.getTime() - pickup.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
      return Math.max(1, diffInDays);
    } catch {
      return 1;
    }
  };

  const duration = calculateDuration();
  
  // Use totalrateafterdiscount from availablecars in the API response
  // This is stored in bookingData.totalRateAfterDiscount when set from insurance/extras pages
  const basePrice = bookingData.totalRateAfterDiscount || bookingData.basePrice || 0;
  
  const extrasTotal = bookingData.selectedExtras?.reduce((total, extra) => {
    return total + (extra.price * extra.quantity);
  }, 0) || 0;
  
  // Insurance price is stored as total for the rental (not per day)
  const insurancePrice = bookingData.insurancePrice || 0;
  
  // Mileage charge is per day; multiply by duration if present
  const extraKmsDaily = bookingData.extraKmsPrice || 0;
  const extraKmsTotal = extraKmsDaily * duration;
  
  // Separate mandatory fees: include all except bond
  const { nonBondFeesTotal, bondAmount } = (bookingData.mandatoryFees || []).reduce(
    (acc, fee) => {
      const name = (fee.name || '').toLowerCase();
      const amount = fee.amount || 0;
      if (name.includes('bond')) acc.bondAmount += amount;
      else acc.nonBondFeesTotal += amount;
      return acc;
    },
    { nonBondFeesTotal: 0, bondAmount: 0 }
  );
  
  const totalPrice = Math.max(0, basePrice + nonBondFeesTotal + insurancePrice + extrasTotal + extraKmsTotal);

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
                {/* Additional price details - hidden on mobile when collapsed */}
                <div className="hidden sm:block text-xs text-muted-foreground">
                  Includes taxes, fees & surcharges
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