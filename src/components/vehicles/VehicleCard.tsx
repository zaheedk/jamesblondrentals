
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fuel, Users, Gauge, DollarSign } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  showDetails?: boolean;
}

const VehicleCard = ({ vehicle, showDetails = false }: VehicleCardProps) => {
  // Format currency to display properly
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(numAmount);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg car-transition border-0 shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={vehicle.images[0] || "/placeholder.svg"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover car-transition hover:scale-105"
        />
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-2 px-4">
              Sold Out
            </Badge>
          </div>
        )}
        {vehicle.type && (
          <Badge className="absolute top-3 right-3 capitalize">
            {vehicle.type}
          </Badge>
        )}
      </div>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">
            {vehicle.make} {vehicle.model}
          </h3>
          <div className="text-right">
            <span className="text-xl font-semibold text-primary">
              {formatCurrency(vehicle.price)}
            </span>
            <span className="text-sm text-gray-500">
              {vehicle.priceUnit === 'day' ? '/day' : ' total'}
            </span>
          </div>
        </div>
        
        {vehicle.dailyRate && vehicle.totalDays && (
          <div className="text-sm text-gray-600 mt-1">
            <DollarSign className="inline h-4 w-4 mr-1" />
            {formatCurrency(vehicle.dailyRate)}/day x {vehicle.totalDays} days
          </div>
        )}
        
        {vehicle.discountAmount > 0 && (
          <div className="text-sm text-amber-600 mt-1">
            Includes {formatCurrency(vehicle.discountAmount)} in discounts
          </div>
        )}
        
        <div className="flex flex-wrap items-center text-sm text-gray-600 mt-3 gap-4">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{vehicle.seats} seats</span>
          </div>
          <div className="flex items-center">
            <Gauge className="mr-1 h-4 w-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center">
            <Fuel className="mr-1 h-4 w-4" />
            <span>{vehicle.fuelType}</span>
          </div>
        </div>
        
        {vehicle.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {vehicle.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex w-full">
          {!vehicle.available ? (
            <Button 
              variant="secondary" 
              className="w-full" 
              disabled
            >
              Sold Out
            </Button>
          ) : showDetails ? (
            <Button 
              variant="default" 
              className="w-full"
              asChild
            >
              <Link to={`/vehicle/${vehicle.id}`}>View Details</Link>
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-1/2 mr-2"
                asChild
              >
                <Link to={`/vehicle/${vehicle.id}`}>Details</Link>
              </Button>
              <Button 
                className="w-1/2"
                asChild
              >
                <Link to={`/booking?vehicleId=${vehicle.id}`}>Book Now</Link>
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
