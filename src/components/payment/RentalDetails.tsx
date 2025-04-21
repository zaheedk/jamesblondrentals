
import React from 'react';
import { MapPin, Clock } from 'lucide-react';

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
          <div className="flex items-start gap-2 flex-1">
            <MapPin className="h-4 w-4 mt-1" />
            <div>
              <p className="font-medium">Pickup Location</p>
              <p className="text-gray-700">{pickupLocationName || "Not specified"}</p>
              <p className="text-sm text-gray-600">{formattedPickupDate} - {pickupTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 flex-1">
            <MapPin className="h-4 w-4 mt-1" />
            <div>
              <p className="font-medium">Drop-off Location</p>
              <p className="text-gray-700">{dropoffLocationName || "Not specified"}</p>
              <p className="text-sm text-gray-600">{formattedDropoffDate} - {dropoffTime}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 mt-1" />
          <div>
            <p className="font-medium">Duration</p>
            <p>{rentalDuration} day{rentalDuration !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
