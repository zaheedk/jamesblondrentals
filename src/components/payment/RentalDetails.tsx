
import React from 'react';
import { MapPin, Calendar, Clock, Car } from 'lucide-react';

interface RentalDetailsProps {
  vehicleName: string;
  pickupLocationName: string | null | undefined;
  dropoffLocationName: string | null | undefined;
  formattedPickupDate: string;
  formattedDropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  rentalDuration: number;
  rateType?: "hourly" | "daily";
  numberOfHours?: number;
}

const RentalDetails = ({
  vehicleName,
  pickupLocationName,
  dropoffLocationName,
  formattedPickupDate,
  formattedDropoffDate,
  pickupTime,
  dropoffTime,
  rentalDuration,
  rateType = "daily",
  numberOfHours,
}: RentalDetailsProps) => {
  const displayPickupLocation = pickupLocationName && 
    pickupLocationName !== "undefined" && 
    pickupLocationName !== "null" ? 
    pickupLocationName : "Not specified";
  
  const displayDropoffLocation = dropoffLocationName && 
    dropoffLocationName !== "undefined" && 
    dropoffLocationName !== "null" ? 
    dropoffLocationName : "Not specified";

  // Calculate hours for hourly rate display
  const getDurationDisplay = () => {
    // First check if we have explicit hourly data
    if (numberOfHours !== undefined && numberOfHours > 0) {
      return `${numberOfHours} ${numberOfHours === 1 ? 'hour' : 'hours'}`;
    }
    
    // Fallback to the previous logic
    if (rateType === "hourly") {
      const hours = Math.round(rentalDuration * 24); // Convert days to hours
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${rentalDuration || 1} ${rentalDuration === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
      
      {vehicleName && (
        <div className="flex items-center gap-2 mb-4">
          <Car className="h-4 w-4 mt-0.5" />
          <div>
            <p className="font-medium">Vehicle</p>
            <p className="text-gray-700 font-bold">{vehicleName}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="flex items-start gap-2 flex-1 mb-4 md:mb-0">
            <MapPin className="h-4 w-4 mt-1" />
            <div className="flex-1">
              <div className="flex flex-col">
                <p className="font-medium">Pickup Location</p>
                <p className="text-gray-700 font-bold mb-2">{displayPickupLocation}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="bg-white border rounded p-2 flex-1 min-w-0">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 truncate">{formattedPickupDate}</p>
                  </div>
                </div>
                <div className="bg-white border rounded p-2 flex-1 min-w-0">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 truncate">{pickupTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 flex-1">
            <MapPin className="h-4 w-4 mt-1" />
            <div className="flex-1">
              <div className="flex flex-col">
                <p className="font-medium">Drop-off Location</p>
                <p className="text-gray-700 font-bold mb-2">{displayDropoffLocation}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="bg-white border rounded p-2 flex-1 min-w-0">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 truncate">{formattedDropoffDate}</p>
                  </div>
                </div>
                <div className="bg-white border rounded p-2 flex-1 min-w-0">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 truncate">{dropoffTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          <Calendar className="h-4 w-4 mr-2" />
          <p className="text-sm text-gray-600">
            Total Rental Duration: <span className="font-medium">{getDurationDisplay()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
