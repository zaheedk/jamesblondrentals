
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RCMAvailableCar } from "@/lib/api/rcm-api-types";

interface VehicleCardProps {
  vehicle: RCMAvailableCar;
  onBook: () => void;
}

const VehicleCard = ({ vehicle, onBook }: VehicleCardProps) => {
  // Format price to 2 decimals
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Handle book button click
  const handleBookClick = () => {
    console.log("Book button clicked for vehicle:", {
      id: vehicle.vehiclecategoryid,
      name: vehicle.vehiclecategory
    });
    onBook();
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden bg-gray-100">
        {vehicle.imageurl ? (
          <img
            src={vehicle.imageurl}
            alt={vehicle.vehiclecategory}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{vehicle.vehiclecategory}</CardTitle>
        <CardDescription>
          {vehicle.vehicledescription1 || "Standard vehicle"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Passengers:</span>
            <span>{vehicle.numberofadults}</span>
          </div>
          <div className="flex justify-between">
            <span>Luggage:</span>
            <span>{vehicle.numberoflargecases} large, {vehicle.numberofsmallcases} small</span>
          </div>
          {vehicle.vehicledescription2 && (
            <div className="text-muted-foreground mt-2">
              {vehicle.vehicledescription2}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-lg font-bold">
          ${formatPrice(vehicle.totalrateafterdiscount)}
        </div>
        <Button onClick={handleBookClick}>Book Now</Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
