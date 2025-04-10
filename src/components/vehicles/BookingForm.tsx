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
  ageId
}: BookingFormProps) {
  const navigate = useNavigate();
  
  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine vehicle category type ID from vehicle properties
    // Use type instead of category since category may not exist on Vehicle type
    const vehicleCategoryTypeId = vehicle.type?.toString() || '0';
    
    // Format dates in dd/MM/yyyy format for API compatibility
    let formattedPickupDate = pickupDate;
    let formattedDropoffDate = dropoffDate;
    
    try {
      // Parse and format dates appropriately
      if (pickupDate) {
        let parsedDate;
        
        if (pickupDate.includes('T')) {
          // Handle ISO date format
          parsedDate = new Date(pickupDate);
        } else if (pickupDate.includes('/')) {
          // Handle dd/MM/yyyy format
          parsedDate = parse(pickupDate, 'dd/MM/yyyy', new Date());
        } else {
          // Handle other date formats
          parsedDate = new Date(pickupDate);
        }
        
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          formattedPickupDate = format(parsedDate, 'dd/MM/yyyy');
        }
      }
      
      if (dropoffDate) {
        let parsedDate;
        
        if (dropoffDate.includes('T')) {
          // Handle ISO date format
          parsedDate = new Date(dropoffDate);
        } else if (dropoffDate.includes('/')) {
          // Handle dd/MM/yyyy format
          parsedDate = parse(dropoffDate, 'dd/MM/yyyy', new Date());
        } else {
          // Handle other date formats
          parsedDate = new Date(dropoffDate);
        }
        
        if (parsedDate && !isNaN(parsedDate.getTime())) {
          formattedDropoffDate = format(parsedDate, 'dd/MM/yyyy');
        }
      }
    } catch (error) {
      console.error("Error formatting dates:", error);
      // Keep original strings if formatting fails
    }
    
    console.log("Booking form dates:", { 
      original: { pickupDate, dropoffDate },
      formatted: { pickupDate: formattedPickupDate, dropoffDate: formattedDropoffDate }
    });
    
    // Save booking data to session storage
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
      basePrice: typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price || '0')
    });
    
    // Navigate to the booking page
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
      <input type="hidden" name="basePrice" value={vehicle.price?.toString() || '0'} />
      
      <Button type="submit" className="w-full">
        Book Now
      </Button>
    </form>
  );
}
