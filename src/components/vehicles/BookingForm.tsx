import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/lib/types";
import { saveBookingData } from "@/lib/booking-session";
import { parse, format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
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
  campaignCode?: string;
}

// NZ timezone constant
const NZ_TIMEZONE = 'Pacific/Auckland';

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
  totalDiscountAmount,
  campaignCode
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

  // Determine if vehicle is charged hourly or daily based on type
  const isHourlyRate = () => {
    const name = `${vehicle.make} ${vehicle.model}`.toLowerCase();
    
    // Check if vehicle is a truck or van that should use hourly rate
    return (
      name.includes('truck') || 
      name.includes('box') || 
      name.includes('tipper') || 
      (name.includes('van') && !name.includes('premium')) ||
      name.includes('jumbo')
    );
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
    
    // Get current time in NZ timezone for validation
    const nowInNZ = toZonedTime(new Date(), NZ_TIMEZONE);
    
    // Comprehensive date and time validation with 15-minute minimum
    if (parsedPickupDate && parsedDropoffDate) {
      // Compare dates without time component first
      const pickupDay = new Date(parsedPickupDate);
      pickupDay.setHours(0, 0, 0, 0);
      
      const dropoffDay = new Date(parsedDropoffDate);
      dropoffDay.setHours(0, 0, 0, 0);
      
      if (dropoffDay < pickupDay) {
        // Drop-off date is before pickup date
        toast.error("Drop-off date cannot be before pickup date");
        return;
      }
      
      // For same dates, compare times with 15-minute minimum
      if (pickupDay.getTime() === dropoffDay.getTime()) {
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
      }
      
      // Check if pickup is in the past (NZ time)
      const pickupDateTime = new Date(parsedPickupDate);
      pickupDateTime.setHours(
        parseInt(pickupTime.split(':')[0], 10),
        parseInt(pickupTime.split(':')[1], 10),
        0, 0
      );
      
      if (pickupDateTime < nowInNZ) {
        toast.error("Pickup time cannot be in the past");
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
      basePrice: vehicle.price,
      rateType: isHourlyRate() ? 'hourly' : 'daily'
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
      vehicleImage: vehicleImageUrl || getFirstVehicleImage(vehicle),
      rateType: isHourlyRate() ? 'hourly' : 'daily', // Add rate type to booking data
      campaignCode: campaignCode || ""
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
      <input type="hidden" name="rateType" value={isHourlyRate() ? 'hourly' : 'daily'} />
      <input type="hidden" name="campaignCode" value={campaignCode || ''} />
      
      <Button type="submit" className="w-full py-6 text-lg font-semibold">
        Select
      </Button>
    </form>
  );
}
