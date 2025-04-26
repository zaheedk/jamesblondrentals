import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Users, Calendar, Fuel, Ban } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Vehicle } from '@/lib/types';
import { updateBookingData } from '@/lib/booking-session';

interface VehicleCardProps {
  vehicle: Vehicle;
  totalRateAfterDiscount: number;
  totalDiscountAmount?: number;
  showViewDetailsButton?: boolean;
}

const VehicleCard = ({ 
  vehicle, 
  totalRateAfterDiscount,
  totalDiscountAmount = 0,
  showViewDetailsButton = true 
}: VehicleCardProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const dropoffTime = searchParams.get("dropoffTime") || "";
  const age = searchParams.get("age") || "";
  
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (pickupLocation) params.append("pickupLocation", pickupLocation);
    if (dropoffLocation) params.append("dropoffLocation", dropoffLocation);
    if (pickupDate) params.append("pickupDate", pickupDate);
    if (dropoffDate) params.append("dropoffDate", dropoffDate);
    if (pickupTime) params.append("pickupTime", pickupTime);
    if (dropoffTime) params.append("dropoffTime", dropoffTime);
    if (age) params.append("age", age);
    return params.toString();
  };
  
  const handleBookNow = () => {
    updateBookingData({
      vehicleId: vehicle.id,
      vehicleCategoryTypeId: String(vehicle.type),
      totalRateAfterDiscount,
      totalDiscountAmount
    });
    
    navigate(`/booking?${buildQueryString()}&vehicleId=${vehicle.id}&vehicleCategoryTypeId=${vehicle.type}`);
  };
  
  const viewDetailsUrl = `/vehicle/${vehicle.id}?${buildQueryString()}`;
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative">
        <img 
          src={vehicle.images[0] || "/placeholder.svg"} 
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center text-sm">
              <Ban className="h-4 w-4 mr-1" />
              <span>Unavailable</span>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow pt-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">
            {vehicle.make} {vehicle.model}
          </h3>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium capitalize">
            {vehicle.type}
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{vehicle.totalDays || 1} {vehicle.totalDays === 1 ? 'Day' : 'Days'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Fuel className="h-4 w-4 mr-2" />
            <span>Fuel: {vehicle.fuelType}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col border-t pt-4">
        <div className="w-full flex justify-between items-baseline mb-4">
          <div>
            <div className="flex items-center">
              <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-gray-600">Free cancellation</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">${totalRateAfterDiscount.toFixed(2)}</div>
            {totalDiscountAmount > 0 && (
              <div className="text-xs text-green-600">Save ${totalDiscountAmount.toFixed(2)}</div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {showViewDetailsButton && (
            <Button variant="outline" asChild>
              <Link to={viewDetailsUrl}>View Details</Link>
            </Button>
          )}
          <Button 
            disabled={!vehicle.available} 
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
