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

  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const displayRate = vehicle.dailyRate || 0;
  const totalAmount = vehicle.ratesubtotal || 0;
  
  // Calculate total rate before discount for comparison
  const totalRateBeforeDiscount = totalRateAfterDiscount ? totalRateAfterDiscount + (totalDiscountAmount || 0) : null;
  const hasDiscount = totalRateBeforeDiscount && totalRateAfterDiscount && totalRateBeforeDiscount !== totalRateAfterDiscount;
  
  // Check if there's a daily rate discount based on total rate differences
  const avgRate = (vehicle as any).avgrate || 0;
  const discountedDailyRate = (vehicle as any).discounteddailyrate || 0;
  const hasDailyDiscount = hasDiscount && avgRate > 0 && discountedDailyRate > 0;
  
  console.log(`Vehicle ${vehicle.make} ${vehicle.model} discount debug:`, {
    hasDiscount,
    totalRateAfterDiscount,
    totalRateBeforeDiscount,
    totalDiscountAmount,
    avgRate,
    discountedDailyRate,
    hasDailyDiscount,
    vehicleType: vehicle.type
  });
  
  console.log(`Vehicle ${vehicle.make} ${vehicle.model} price calculation:`, {
    dailyRate: vehicle.dailyRate,
    ratesubtotal: vehicle.ratesubtotal,
    displayRate,
    totalAmount
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

  const getNumberOfHours = () => {
    if (!vehicle.numberofhours) return null;
    
    if (typeof vehicle.numberofhours === 'number') {
      return vehicle.numberofhours;
    }
    
    if (typeof vehicle.numberofhours === 'object' && vehicle.numberofhours.value) {
      return parseFloat(vehicle.numberofhours.value);
    }
    
    return null;
  };

  const numberOfHours = getNumberOfHours();

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
              {hasDailyDiscount ? (
                <span className="flex items-center gap-2">
                  <span className="line-through text-gray-500">
                    ${avgRate.toFixed(2)}
                  </span>
                  <span className="text-primary">
                    ${discountedDailyRate.toFixed(2)}
                  </span>
                </span>
              ) : (
                <span>${displayRate.toFixed(2)}</span>
              )}
              {vehicle.rateperiod === "day" && <span className="text-sm font-normal text-gray-600 ml-1">per day</span>}
              {vehicle.rateperiod === "hour" && numberOfHours && (
                <span className="text-sm font-normal text-gray-600 ml-1">
                  for ({numberOfHours} hours)
                </span>
              )}
            </div>
            <div className="text-sm text-primary mt-1">
              <span className="block font-medium">
                {hasDiscount ? (
                  <span className="text-primary font-bold">
                    Total: ${totalRateAfterDiscount?.toFixed(2)}
                  </span>
                ) : (
                  <span>Total: ${totalAmount.toFixed(2)}</span>
                )}
              </span>
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
            totalRateAfterDiscount={displayRate}
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
