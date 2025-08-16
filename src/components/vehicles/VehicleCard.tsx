import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import BookingForm from "./BookingForm";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Users, Luggage, Gauge, Info, Cog } from "lucide-react";

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
      <CardHeader className="pb-3">
        {vehicle.fuelType === "electric" && (
          <Badge className="w-fit mb-2 bg-green-100 text-green-800 border-green-200">
            Electric Vehicle
          </Badge>
        )}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg capitalize">
              {vehicle.type} {vehicle.type === "suv" ? "SUV" : ""}
            </h3>
            {vehicle.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {stripHtmlTags(vehicle.description)}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{vehicle.seats}</span>
              </div>
              <div className="flex items-center gap-1">
                <Luggage className="w-4 h-4" />
                <span>2</span>
              </div>
              <div className="flex items-center gap-1">
                <Cog className="w-4 h-4" />
                <span>A</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${displayRate.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">NZD</span>
              </div>
              {hasDailyDiscount && (
                <div className="text-xs text-muted-foreground line-through">
                  ${avgRate.toFixed(2)}/day
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0 flex-grow">
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
            campaignCode={searchParams.get("campaignCode") || ""}
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
