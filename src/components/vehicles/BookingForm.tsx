
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/lib/types";
import { saveBookingData } from "@/lib/booking-session";

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
    // First check if vehicle.category exists, if not, use vehicle.type or default to '0'
    const vehicleCategoryTypeId = vehicle.category?.toString() || 
                                  vehicle.type?.toString() || 
                                  '0';
    
    // Save booking data to session storage
    saveBookingData({
      vehicleId: vehicle.id.toString(),
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      vehicleCategoryTypeId: vehicleCategoryTypeId,
      pickupLocationId,
      pickupLocationName,
      dropoffLocationId,
      dropoffLocationName,
      pickupDate,
      pickupTime,
      dropoffDate,
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
      <input type="hidden" name="vehicleCategoryTypeId" value={vehicle.category?.toString() || vehicle.type?.toString() || '0'} />
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
