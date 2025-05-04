import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/lib/types";
import { saveBookingData } from "@/lib/booking-session";
import { parse, format } from "date-fns";
import { toast } from "sonner";

interface BookingFormProps {
  vehicle: Vehicle;
  pickupLocationId: string;
  pickupLocationName?: string;
  dropoffLocationId: string;
  dropoffLocationName?: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  ageId: string;
  vehicleImageUrl?: string;
  totalRateAfterDiscount?: number;
  totalDiscountAmount?: number;
}

export default function BookingForm({ 
  vehicle,
  pickupLocationId,
  pickupLocationName,
  dropoffLocationId,
  dropoffLocationName,
  pickupDate,
  dropoffDate,
  pickupTime,
  dropoffTime,
  ageId,
  vehicleImageUrl,
  totalRateAfterDiscount,
  totalDiscountAmount
}: BookingFormProps) {
  const navigate = useNavigate();
  
  const getFirstVehicleImage = (vehicle: Vehicle): string => {
    if (!vehicle.images || !Array.isArray(vehicle.images) || vehicle.images.length === 0) {
      return '/placeholder.svg';
    }
    
    const image = vehicle.images[0];
    
    if (typeof image === 'string') {
      return image;
    }
    
    if (image && typeof image === 'object' && 'url' in image) {
      return (image as {url: string}).url;
    }
    
    return '/placeholder.svg';
  };

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    let formattedPickupDate = pickupDate;
    let formattedDropoffDate = dropoffDate;
    let parsedPickupDate: Date | null = null;
    let parsedDropoffDate: Date | null = null;
    
    try {
      if (pickupDate) {
        let parsedDate;
        
        if (pickupDate.includes('T')) {
          parsedDate = new Date(pickupDate);
        } else if (pickupDate.includes('/')) {
          parsedDate = parse(pickupDate, 'dd/MM/yyyy', new Date());
        } else {
          parsedDate = new Date(pickupDate);
        }
        
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          parsedPickupDate = parsedDate;
          formattedPickupDate = format(parsedDate, 'dd/MM/yyyy');
        }
      }
      
      if (dropoffDate) {
        let parsedDate;
        
        if (dropoffDate.includes('T')) {
          parsedDate = new Date(dropoffDate);
        } else if (dropoffDate.includes('/')) {
          parsedDate = parse(dropoffDate, 'dd/MM/yyyy', new Date());
        } else {
          parsedDate = new Date(dropoffDate);
        }
        
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          parsedDropoffDate = parsedDate;
          formattedDropoffDate = format(parsedDate, 'dd/MM/yyyy');
        }
      }
    } catch (error) {
      console.error("Error formatting dates:", error);
    }
    
    // Comprehensive date and time validation with 15-minute minimum
    if (parsedPickupDate && parsedDropoffDate) {
      // For same dates, compare times with 15-minute minimum
      if (parsedPickupDate.toDateString() === parsedDropoffDate.toDateString()) {
        console.log("Same day booking detected, validating times with 15-minute minimum");
        // Parse times to compare
        const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
        const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
        
        const pickupTotalMinutes = pickupHour * 60 + pickupMinute;
        const dropoffTotalMinutes = dropoffHour * 60 + dropoffMinute;
        
        if (dropoffTotalMinutes < pickupTotalMinutes + 15) {
          toast.error("Drop-off time must be at least 15 minutes after pickup time");
          return;
        }
      } else if (parsedDropoffDate < parsedPickupDate) {
        // If not same day, just compare dates
        toast.error("Drop-off date cannot be before pickup date");
        return;
      }
    }
    
    console.log("Booking form dates:", { 
      original: { pickupDate, dropoffDate },
      formatted: { pickupDate: formattedPickupDate, dropoffDate: formattedDropoffDate }
    });
    
    console.log("Saving booking data with rate details:", {
      totalRateAfterDiscount,
      totalDiscountAmount,
      basePrice: vehicle.price
    });
    
    saveBookingData({
      vehicleId: vehicle.id.toString(),
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      vehicleCategoryTypeId: vehicle.type?.toString() || '0',
      pickupLocationId,
      pickupLocationName,
      dropoffLocationId,
      dropoffLocationName,
      pickupDate: formattedPickupDate,
      pickupTime,
      dropoffDate: formattedDropoffDate,
      dropoffTime,
      ageId,
      basePrice: totalRateAfterDiscount || (typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price || '0')),
      totalRateAfterDiscount,
      totalDiscountAmount,
      vehicleImage: vehicleImageUrl || getFirstVehicleImage(vehicle)
    });
    
    navigate('/booking');
  };

  return (
    <form onSubmit={handleBookNow}>
      <input type="hidden" name="vehicleId" value={vehicle.id} />
      <input type="hidden" name="vehicleName" value={`${vehicle.make} ${vehicle.model}`} />
      <input type="hidden" name="vehicleCategoryTypeId" value={vehicle.type?.toString() || '0'} />
      <input type="hidden" name="pickupLocationId" value={pickupLocationId} />
      <input type="hidden" name="pickupLocationName" value={pickupLocationName} />
      <input type="hidden" name="dropoffLocationId" value={dropoffLocationId} />
      <input type="hidden" name="dropoffLocationName" value={dropoffLocationName} />
      <input type="hidden" name="pickupDate" value={pickupDate} />
      <input type="hidden" name="pickupTime" value={pickupTime} />
      <input type="hidden" name="dropoffDate" value={dropoffDate} />
      <input type="hidden" name="dropoffTime" value={dropoffTime} />
      <input type="hidden" name="ageId" value={ageId} />
      <input type="hidden" name="basePrice" value={totalRateAfterDiscount?.toString() || vehicle.price?.toString() || '0'} />
      <input type="hidden" name="vehicleImage" value={vehicleImageUrl || getFirstVehicleImage(vehicle)} />
      <input type="hidden" name="totalRateAfterDiscount" value={totalRateAfterDiscount?.toString() || ''} />
      <input type="hidden" name="totalDiscountAmount" value={totalDiscountAmount?.toString() || ''} />
      
      <Button type="submit" className="w-full">
        Book Now
      </Button>
    </form>
  );
}
