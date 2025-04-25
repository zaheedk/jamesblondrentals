
import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface RentalDetailsProps {
  vehicleName: string;
  pickupLocationName: string;
  dropoffLocationName: string;
  formattedPickupDate: string;
  formattedDropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  rentalDuration: number;
}

const RentalDetails = ({
  vehicleName,
  pickupLocationName,
  dropoffLocationName,
  formattedPickupDate,
  formattedDropoffDate,
  pickupTime,
  dropoffTime,
  rentalDuration
}: RentalDetailsProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="flex items-start gap-2 flex-1 mb-4 md:mb-0">
            <MapPin className="h-4 w-4 mt-1" />
            <div>
              <p className="font-medium">Pickup Location</p>
              <p className="text-gray-700 font-bold">{pickupLocationName || "Not specified"}</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <p className="text-sm text-gray-600">{formattedPickupDate}</p>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <p className="text-sm text-gray-600">{pickupTime}</p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 flex-1">
            <MapPin className="h-4 w-4 mt-1" />
            <div>
              <p className="font-medium">Drop-off Location</p>
              <p className="text-gray-700 font-bold">{dropoffLocationName || "Not specified"}</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <p className="text-sm text-gray-600">{formattedDropoffDate}</p>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <p className="text-sm text-gray-600">{dropoffTime}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-2">
          <Calendar className="h-4 w-4 mr-1" />
          <p className="font-medium">Rental Duration: <span className="text-gray-700">{rentalDuration} day{rentalDuration !== 1 ? 's' : ''}</span></p>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
