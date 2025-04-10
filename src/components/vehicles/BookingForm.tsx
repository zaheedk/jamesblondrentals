
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/lib/types";
import { saveBookingData } from "@/lib/booking-session";
import { parse, format } from "date-fns";

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
  vehicleImageUrl
}: BookingFormProps) {
  const navigate = useNavigate();
  
  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleCategoryTypeId = vehicle.type?.toString() || '0';
    
    let formattedPickupDate = pickupDate;
    let formattedDropoffDate = dropoffDate;
    
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
          formattedDropoffDate = format(parsedDate, 'dd/MM/yyyy');
        }
      }
      
      // Additional validation to ensure dropoff is after pickup
      const pickupDateTime = parseDateTimeStrings(formattedPickupDate, pickupTime);
      const dropoffDateTime = parseDateTimeStrings(formattedDropoffDate, dropoffTime);
      
      if (pickupDateTime && dropoffDateTime && dropoffDateTime <= pickupDateTime) {
        console.error("Invalid date/time: dropoff must be after pickup");
        throw new Error("Drop-off time must be after pick-up time");
      }
    } catch (error) {
      console.error("Error formatting dates:", error);
    }
    
    console.log("Booking form dates:", { 
      original: { pickupDate, dropoffDate },
      formatted: { pickupDate: formattedPickupDate, dropoffDate: formattedDropoffDate }
    });
    
    saveBookingData({
      vehicleId: vehicle.id.toString(),
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      vehicleCategoryTypeId: vehicleCategoryTypeId,
      pickupLocationId,
      pickupLocationName,
      dropoffLocationId,
      dropoffLocationName,
      pickupDate: formattedPickupDate,
      pickupTime,
      dropoffDate: formattedDropoffDate,
      dropoffTime,
      ageId,
      basePrice: typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price || '0'),
      vehicleImage: vehicleImageUrl || getFirstVehicleImage(vehicle)
    });
    
    navigate('/booking');
  };

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
  
  // Helper function to parse date and time strings into a Date object
  const parseDateTimeStrings = (dateStr: string, timeStr: string): Date | null => {
    try {
      const dateParts = dateStr.split('/');
      if (dateParts.length !== 3) return null;
      
      const [day, month, year] = dateParts.map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const date = new Date(year, month - 1, day, hours, minutes);
      return date;
    } catch (error) {
      console.error("Error parsing date time:", error);
      return null;
    }
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
      <input type="hidden" name="basePrice" value={vehicle.price?.toString() || '0'} />
      <input type="hidden" name="vehicleImage" value={vehicleImageUrl || getFirstVehicleImage(vehicle)} />
      
      <Button type="submit" className="w-full">
        Book Now
      </Button>
    </form>
  );
}
