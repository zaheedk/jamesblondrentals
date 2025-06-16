
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

  // Strip HTML tags from description
  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
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
    numberofhours: vehicle.numberofhours,
    rateperiod: vehicle.rateperiod,
    ratesubtotal: vehicle.ratesubtotal
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
  
  // Get the rental duration display based on rateperiod
  const getRentalDuration = () => {
    if (vehicle.rateperiod === "hour") {
      const hours = getNumberOfHours();
      if (hours && hours > 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      }
    }
    
    if (vehicle.rateperiod === "day" && vehicle.totalDays) {
      return `${vehicle.totalDays} ${vehicle.totalDays === 1 ? 'day' : 'days'}`;
    }
    
    return null;
  };

  // Determine what rate information to display based on rateperiod from API
  const getRateDisplay = () => {
    const rateSubtotal = vehicle.ratesubtotal || displayPrice;
    
    // Use rateperiod from API response to determine display
    if (vehicle.rateperiod === "hour") {
      const hours = getNumberOfHours();
      if (hours && hours > 0) {
        const hourlyRate = rateSubtotal / hours;
        return (
          <div className="space-y-1">
            <span className="block text-sm text-gray-600">
              ${hourlyRate.toFixed(2)} per hour for {hours} {hours === 1 ? 'hour' : 'hours'}
            </span>
            <span className="block font-medium">
              Total: ${rateSubtotal.toFixed(2)}
            </span>
          </div>
        );
      }
    }
    
    if (vehicle.rateperiod === "day" && vehicle.totalDays && vehicle.totalDays > 0) {
      const dailyRate = rateSubtotal / vehicle.totalDays;
      return (
        <div className="space-y-1">
          <span className="block text-sm text-gray-600">
            ${dailyRate.toFixed(2)} per day for {vehicle.totalDays} {vehicle.totalDays === 1 ? 'day' : 'days'}
          </span>
          <span className="block font-medium">
            Total: ${rateSubtotal.toFixed(2)}
          </span>
        </div>
      );
    }
    
    // Fallback for vehicles without specific rate period info
    return (
      <span className="block font-medium">
        Total: ${rateSubtotal.toFixed(2)}
      </span>
    );
  };

  return (
    <Card className="overflow-hidden shadow-md h-full flex flex-col">
      <AspectRatio ratio={4/3} className="overflow-hidden bg-white">
        <img 
          src={imageUrl} 
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-contain"
          onError={handleImageError}
          loading="lazy"
          width="400"
          height="300"
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
            <div className="text-sm text-primary mt-1">
              {getRateDisplay()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 mb-3">
          {stripHtmlTags(vehicle.description)?.substring(0, 120)}
          {vehicle.description && stripHtmlTags(vehicle.description).length > 120 ? '...' : ''}
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
