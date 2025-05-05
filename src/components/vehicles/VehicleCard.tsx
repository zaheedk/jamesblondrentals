import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import BookingForm from "./BookingForm";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VehicleCardProps {
  vehicle: Vehicle;
  totalRateAfterDiscount?: number;
  totalDiscountAmount?: number;
}

const VehicleCard = ({ 
  vehicle, 
  totalRateAfterDiscount,
  totalDiscountAmount
}: VehicleCardProps) => {
  const [searchParams] = useSearchParams();
  const [imageError, setImageError] = React.useState(false);
  
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const pickupLocationName = searchParams.get("pickupLocationName") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const dropoffLocationName = searchParams.get("dropoffLocationName") || pickupLocationName;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const dropoffTime = searchParams.get("dropoffTime") || "";
  const age = searchParams.get("age") || "";
  
  const getImageUrl = () => {
    if (imageError) {
      return '/placeholder.svg';
    }
    
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
  
  const imageUrl = getImageUrl();
  
  const handleImageError = () => {
    console.log(`Image failed to load for vehicle: ${vehicle.make} ${vehicle.model}`);
    setImageError(true);
  };

  const displayPrice = vehicle.dailyRate || 
    (typeof vehicle.price === 'string' ? parseFloat(vehicle.price) : vehicle.price);
  
  const totalRentalValue = displayPrice * (vehicle.totalDays || 1);
  
  console.log(`Vehicle ${vehicle.make} ${vehicle.model} price calculation:`, {
    dailyRate: vehicle.dailyRate,
    vehiclePrice: vehicle.price,
    totalDays: vehicle.totalDays,
    finalDisplayPrice: displayPrice,
    totalRentalValue,
    numberofhours: vehicle.numberofhours
  });
  
  const isAvailable = (() => {
    console.log(`Vehicle ${vehicle.make} ${vehicle.model} availability:`, vehicle.available, typeof vehicle.available);
    
    if (typeof vehicle.available === 'boolean') {
      return vehicle.available === true;
    }
    if (typeof vehicle.available === 'number') {
      return vehicle.available === 1 || vehicle.available === 2;
    }
    return false;
  })();
  
  // Extract hours from the numberofhours property correctly
  const getNumberOfHours = (): number | undefined => {
    if (typeof vehicle.numberofhours === 'number') {
      return vehicle.numberofhours;
    }
    
    if (vehicle.numberofhours && 
        typeof vehicle.numberofhours === 'object' && 
        'value' in vehicle.numberofhours) {
      const value = vehicle.numberofhours.value;
      if (value && value !== 'undefined' && !isNaN(Number(value))) {
        return Number(value);
      }
    }
    
    return undefined;
  };
  
  // Determine if vehicle is charged hourly or daily based on type or API data
  const isHourlyRate = () => {
    // If numberofhours is available and greater than 0, use hourly rate
    const hours = getNumberOfHours();
    if (hours && hours > 0) {
      return true;
    }
    
    const name = `${vehicle.make} ${vehicle.model}`.toLowerCase();
    
    // Fallback to type-based detection
    return (
      name.includes('truck') || 
      name.includes('box') || 
      name.includes('tipper') || 
      (name.includes('van') && !name.includes('premium')) ||
      name.includes('jumbo')
    );
  };
  
  // Get the rental duration display (hours or days)
  const getRentalDuration = () => {
    // First check if we have explicit hourly data from API
    const hours = getNumberOfHours();
    if (hours && hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    
    if (!vehicle.totalDays) return null;
    
    if (isHourlyRate()) {
      // For hourly vehicles without explicit hourly data, convert days to hours
      const hours = Math.round(vehicle.totalDays * 24);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      // For daily vehicles, display days
      return `${vehicle.totalDays} ${vehicle.totalDays === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <Card className="overflow-hidden shadow-md h-full flex flex-col">
      <AspectRatio ratio={4/3} className="overflow-hidden bg-white">
        <img 
          src={imageUrl} 
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-contain"
          onError={handleImageError}
        />
      </AspectRatio>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl">{vehicle.make} {vehicle.model}</h3>
            <div className="text-sm text-gray-500">
              {vehicle.type && <Badge variant="outline" className="mr-2">{vehicle.type}</Badge>}
              {vehicle.seats && <span className="mr-2">{vehicle.seats} seats</span>}
              {vehicle.transmission && <span>{vehicle.transmission}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">
              ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : '0.00'}
            </div>
            <div className="text-sm font-medium text-primary mt-1">
              {getRentalDuration() ? (
                <span className="block">
                  Total: ${totalRentalValue.toFixed(2)} for {getRentalDuration()}
                </span>
              ) : (
                <span className="text-xs text-gray-600 block">
                  {isHourlyRate() ? `Total: ${getNumberOfHours() || 0} Hours` : 'Daily rate'}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 mb-3">
          {vehicle.description?.substring(0, 120)}
          {vehicle.description && vehicle.description.length > 120 ? '...' : ''}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {vehicle.features && (Array.isArray(vehicle.features) ? vehicle.features : [vehicle.features]).slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isAvailable ? (
          <BookingForm
            vehicle={vehicle}
            pickupLocationId={searchParams.get("pickupLocation") || ""}
            pickupLocationName={searchParams.get("pickupLocationName") || ""}
            dropoffLocationId={searchParams.get("dropoffLocation") || searchParams.get("pickupLocation") || ""}
            dropoffLocationName={searchParams.get("dropoffLocationName") || searchParams.get("pickupLocationName") || ""}
            pickupDate={searchParams.get("pickupDate") || ""}
            dropoffDate={searchParams.get("dropoffDate") || ""}
            pickupTime={searchParams.get("pickupTime") || ""}
            dropoffTime={searchParams.get("dropoffTime") || ""}
            ageId={searchParams.get("age") || ""}
            vehicleImageUrl={imageUrl}
            totalRateAfterDiscount={displayPrice}
            totalDiscountAmount={totalDiscountAmount}
          />
        ) : (
          <div className="w-full p-2 bg-gray-100 text-gray-500 text-center rounded">
            Not Available
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
