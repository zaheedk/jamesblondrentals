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

  // Calculate total price
  const basePrice = bookingData.totalRateAfterDiscount || bookingData.basePrice || 0;
  const extrasTotal = bookingData.selectedExtras?.reduce((total, extra) => {
    return total + (extra.price * extra.quantity);
  }, 0) || 0;
  const mandatoryFeesTotal = bookingData.mandatoryFees?.reduce((total, fee) => {
    return total + fee.amount;
  }, 0) || 0;
  const totalPrice = basePrice + extrasTotal + mandatoryFeesTotal;

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

  // Calculate rental duration
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
          <AccordionTrigger className="hover:no-underline p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Vehicle Image */}
                <div className="w-16 h-12 sm:w-32 sm:h-20 rounded overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={getImageUrl()}
                    alt={bookingData.vehicleName || 'Vehicle'}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                {/* Vehicle Details */}
                <div className="text-right min-w-0 flex-1">
                  {/* Vehicle name - hidden on mobile when collapsed */}
                  <h3 className="hidden sm:block font-semibold text-base sm:text-lg truncate">{bookingData.vehicleName || 'Selected Vehicle'}</h3>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {formatDateForDisplay(bookingData.pickupDate)} - {formatDateForDisplay(bookingData.dropoffDate)}
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right sm:mr-4 flex-shrink-0">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  NZ${totalPrice.toFixed(2)} <span className="text-xs sm:text-sm font-normal">TOTAL</span>
                </div>
                {/* Additional price details - hidden on mobile when collapsed */}
                <div className="hidden sm:block text-xs text-muted-foreground">
                  Includes taxes, fees & surcharges
                </div>
                <div className="hidden sm:block text-xs text-green-600 font-medium">
                  Unlimited free kilometers
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