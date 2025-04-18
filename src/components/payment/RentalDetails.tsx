
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <div>
            <p className="font-medium">Pickup Location</p>
            <p>{pickupLocationName || "Not specified"}</p>
            <p>{formattedPickupDate} - {pickupTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <div>
            <p className="font-medium">Drop-off Location</p>
            <p>{dropoffLocationName || "Not specified"}</p>
            <p>{formattedDropoffDate} - {dropoffTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
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
