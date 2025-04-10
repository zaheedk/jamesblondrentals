
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import BookingForm from "./BookingForm";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const [searchParams] = useSearchParams();
  
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const pickupLocationName = searchParams.get("pickupLocationName") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const dropoffLocationName = searchParams.get("dropoffLocationName") || pickupLocationName;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const dropoffTime = searchParams.get("dropoffTime") || "";
  const age = searchParams.get("age") || "";
  
  // Get the image URL correctly handling different data formats
  const getImageUrl = () => {
    if (!vehicle.images || !Array.isArray(vehicle.images) || vehicle.images.length === 0) {
      return '/placeholder.svg';
    }
    
    const image = vehicle.images[0];
    
    // Check if the image is a string
    if (typeof image === 'string') {
      return image;
    }
    
    // Check if the image is an object with a url property
    if (image && typeof image === 'object') {
      // Use type assertion to access url property safely
      return 'url' in image ? image.url : '/placeholder.svg';
    }
    
    return '/placeholder.svg';
  };
  
  return (
    <Card className="overflow-hidden shadow-md h-full flex flex-col">
      <div 
        className="h-48 bg-center bg-cover" 
        style={{ backgroundImage: `url(${getImageUrl()})` }}
      />
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
              ${typeof vehicle.price === 'string' ? vehicle.price : vehicle.price?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-500">
              {vehicle.priceUnit === 'day' 
                ? 'per day' 
                : vehicle.priceUnit === 'total' 
                  ? 'total' 
                  : ''}
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
        {vehicle.available ? (
          <BookingForm
            vehicle={vehicle}
            pickupLocationId={pickupLocation}
            pickupLocationName={pickupLocationName}
            dropoffLocationId={dropoffLocation}
            dropoffLocationName={dropoffLocationName}
            pickupDate={pickupDate}
            dropoffDate={dropoffDate}
            pickupTime={pickupTime}
            dropoffTime={dropoffTime}
            ageId={age}
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
