
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, Car, MapPin } from 'lucide-react';
import { getBookingData } from '@/lib/booking-session';
import { format, isValid, parse } from 'date-fns';

interface RentalDetailsProps {
  vehicleName: string;
  pickupLocationName: string | null | undefined;
  dropoffLocationName: string | null | undefined;
  formattedPickupDate: string;
  formattedDropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  rentalDuration: number;
  rateType?: "hourly" | "daily";
  numberOfHours?: number;
}

const RentalDetails = ({
  vehicleName,
  pickupLocationName,
  dropoffLocationName,
  formattedPickupDate,
  formattedDropoffDate,
  pickupTime,
  dropoffTime,
  rentalDuration,
  rateType = "daily",
  numberOfHours,
}: RentalDetailsProps) => {
  const sessionData = getBookingData();
  const rcmDays = (typeof sessionData?.numberofdays === 'number' && sessionData.numberofdays > 0) ? sessionData.numberofdays : undefined;

  const displayPickupLocation = pickupLocationName &&
    pickupLocationName !== "undefined" &&
    pickupLocationName !== "null" &&
    pickupLocationName.trim() !== "" ?
    pickupLocationName : "Not specified";

  const displayDropoffLocation = dropoffLocationName &&
    dropoffLocationName !== "undefined" &&
    dropoffLocationName !== "null" &&
    dropoffLocationName.trim() !== "" ?
    dropoffLocationName : "Not specified";

  const shortDate = (raw: string): string => {
    if (!raw) return "";
    try {
      const datePart = raw.split(' ')[0];
      if (datePart.includes('/')) {
        const parsed = parse(datePart, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) return format(parsed, 'EEE d MMM');
      }
      const fallback = new Date(raw);
      if (isValid(fallback)) return format(fallback, 'EEE d MMM');
    } catch {
      // fall through
    }
    return raw;
  };

  const shortPickup = shortDate(formattedPickupDate);
  const shortDropoff = shortDate(formattedDropoffDate);

  // Compute duration display using RCM-provided values
  const getDurationDisplay = () => {
    // Prefer explicit hourly value when provided by RCM
    if (rateType === "hourly") {
      if (typeof numberOfHours === 'number' && numberOfHours > 0) {
        return `${numberOfHours} ${numberOfHours === 1 ? 'hour' : 'hours'}`;
      }
      // If hourly but no hours provided, do not convert locally; fall back to days from RCM
    }
    const days = (typeof rcmDays === 'number' && rcmDays > 0) ? rcmDays : (rentalDuration || 1);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className="mb-4">
      {vehicleName && (
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{vehicleName}</span>
        </p>
      )}
      <Accordion type="single" collapsible className="rounded-lg border bg-muted/30 px-4">
        <AccordionItem value="trip" className="border-b-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="min-w-0 text-left">
              <p className="flex items-center gap-2 text-sm font-medium min-w-0">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {displayPickupLocation} → {displayDropoffLocation}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {shortPickup}{pickupTime ? `, ${pickupTime}` : ''} → {shortDropoff}{dropoffTime ? `, ${dropoffTime}` : ''}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Pickup</p>
                  <p className="font-medium text-sm">{displayPickupLocation}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{shortPickup}</span>
                    {pickupTime && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pickupTime}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Drop-off</p>
                  <p className="font-medium text-sm">{displayDropoffLocation}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{shortDropoff}</span>
                    {dropoffTime && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{dropoffTime}</span>}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Total rental duration: <span className="font-medium text-foreground">{getDurationDisplay()}</span>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RentalDetails;
