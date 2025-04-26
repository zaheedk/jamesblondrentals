
import React from 'react';
import { Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import type { RCMVehicle } from '@/lib/api/rcm-api-types';

interface VehicleCardProps {
  vehicle: RCMVehicle | any; // Using any here to accommodate both RCMVehicle and the custom Vehicle type
  onClick?: () => void;
  totalRateAfterDiscount?: number;
  totalDiscountAmount?: number;
}

const VehicleCard = ({ vehicle, onClick, totalRateAfterDiscount, totalDiscountAmount }: VehicleCardProps) => {
  const navigate = useNavigate();
  const imageError = false;

  const handleImageError = () => {
    console.log("Error loading vehicle image");
  };
  
  let vehicleImageUrl = "";
  // Handle both RCMVehicle.images and custom Vehicle.image property
  if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    const imageSource = typeof vehicle.images[0] === 'string' ? vehicle.images[0] : (vehicle.images[0]?.url || '');
    if (imageSource.startsWith('http')) {
      vehicleImageUrl = imageSource;
    } else if (imageSource) {
      vehicleImageUrl = `https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/${imageSource.replace(/^\/+/, '')}`;
    }
  } else if (vehicle.image) { // Support for custom Vehicle type from Vehicles.tsx
    if (vehicle.image.startsWith('http')) {
      vehicleImageUrl = vehicle.image;
    } else {
      vehicleImageUrl = `https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/${vehicle.image.replace(/^\/+/, '')}`;
    }
  }
  
  if (vehicleImageUrl) {
    vehicleImageUrl = vehicleImageUrl.replace(/([^:])\/+/g, '$1/');
    console.log("Vehicle image URL:", vehicleImageUrl);
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const vehicleCategoryId = String(vehicle.id);
      const vehicleCategoryTypeId = String(vehicle.type || '1');
      navigate(`/vehicle/${vehicleCategoryId}?type=${vehicleCategoryTypeId}`);
    }
  };

  const vehicleName = vehicle.vehiclecategory || vehicle.name || `${vehicle.make} ${vehicle.model}`.trim();
  const vehicleDescription = vehicle.description || '';
  const dailyRate = vehicle.dailyrate || vehicle.price || 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
      onClick={handleClick}
    >
      <div className="relative">
        {vehicleImageUrl && !imageError ? (
          <img
            src={vehicleImageUrl}
            alt={vehicleName}
            className="w-full h-48 object-contain p-4"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100">
            <Car className="h-24 w-24 text-gray-300" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{vehicleName}</h3>
        <p className="text-gray-600 text-sm mb-2">{vehicleDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(totalRateAfterDiscount || dailyRate)} / day
          </span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
