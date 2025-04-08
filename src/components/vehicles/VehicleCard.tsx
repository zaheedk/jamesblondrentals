
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/lib/types";

interface VehicleCardProps {
  // Direct props
  id?: string | number;
  name?: string;
  imageUrl?: string;
  price?: number | string;
  seats?: number;
  luggage?: number;
  transmission?: string;
  features?: string[] | string;
  category?: string;
  currencySymbol?: string;
  
  // Search context parameters
  searchContext?: {
    pickupLocationId: string;
    pickupLocationName?: string;
    dropoffLocationId: string;
    dropoffLocationName?: string;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    ageId: string;
  };
  
  // Alternative approach with vehicle object
  vehicle?: Vehicle;
  showDetails?: boolean;
}

const VehicleCard = (props: VehicleCardProps) => {
  // If we have a vehicle prop, extract data from it
  const vehicle = props.vehicle;
  
  // Extract data prioritizing direct props, then falling back to vehicle object props
  const {
    id = vehicle?.id,
    name = vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle",
    imageUrl = vehicle?.images?.[0] || "/placeholder.svg",
    price = vehicle?.price || 0,
    seats = vehicle?.seats || 4,
    luggage = vehicle?.luggage || 2,
    transmission = vehicle?.transmission || "automatic",
    features = vehicle?.features || [],
    category = vehicle?.type || "economy",
    currencySymbol = "$",
    searchContext = props.searchContext,
    showDetails = props.showDetails
  } = props;
  
  const featuresList = Array.isArray(features) 
    ? features 
    : typeof features === 'string' && features ? features.split(',') : [];
  
  // Build the detail link with all necessary parameters
  const buildDetailLink = () => {
    if (!searchContext) return `/vehicle/${id}`;
    
    const params = new URLSearchParams();
    
    // Add required booking parameters
    params.append('vehicleId', id?.toString() || "0");
    params.append('vehicleName', name);
    params.append('basePrice', typeof price === 'string' ? price : price?.toString() || "0");
    
    // Add search context parameters
    params.append('pickupLocationId', searchContext.pickupLocationId);
    if (searchContext.pickupLocationName) {
      params.append('pickupLocationName', searchContext.pickupLocationName);
    }
    params.append('dropoffLocationId', searchContext.dropoffLocationId);
    if (searchContext.dropoffLocationName) {
      params.append('dropoffLocationName', searchContext.dropoffLocationName);
    }
    params.append('pickupDate', searchContext.pickupDate);
    params.append('pickupTime', searchContext.pickupTime);
    params.append('dropoffDate', searchContext.dropoffDate);
    params.append('dropoffTime', searchContext.dropoffTime);
    params.append('ageId', searchContext.ageId);
    
    return `/vehicle/${id}?${params.toString()}`;
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        {category && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/80 text-black">
              {category}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow pt-4">
        <h3 className="text-lg font-bold tracking-tight">{name}</h3>
        
        <div className="grid grid-cols-3 gap-2 my-3 text-sm">
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <span className="text-gray-500">Seats</span>
            <span className="font-medium">{seats}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <span className="text-gray-500">Luggage</span>
            <span className="font-medium">{luggage}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <span className="text-gray-500">Trans</span>
            <span className="font-medium">{transmission === "automatic" ? "Auto" : "Manual"}</span>
          </div>
        </div>
        
        {featuresList.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Features</h4>
            <div className="flex flex-wrap gap-1">
              {featuresList.slice(0, 3).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {feature.trim()}
                </Badge>
              ))}
              {featuresList.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{featuresList.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold text-lg">
            {currencySymbol}{formatCurrency(price)}
            <span className="text-xs font-normal text-gray-500">/day</span>
          </div>
          <Button asChild>
            <Link to={buildDetailLink()}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
