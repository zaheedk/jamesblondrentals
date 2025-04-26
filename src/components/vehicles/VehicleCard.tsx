import React from 'react';
import { Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';
import type { RCMVehicle } from '@/lib/api/rcm-api-types';

const VehicleCard = ({ vehicle, onClick }: { vehicle: RCMVehicle; onClick?: () => void }) => {
  const navigate = useNavigate();
  const imageError = false;

  const handleImageError = () => {
    console.log("Error loading vehicle image");
  };
  
  let vehicleImageUrl = "";
  if (vehicle.image) {
    if (vehicle.image.startsWith('http')) {
      vehicleImageUrl = vehicle.image;
    } else {
      vehicleImageUrl = `https://rentalcarmanagerau.blob.core.windows.net/public/nzkuzarentals493/${vehicle.image.replace(/^\/+/, '')}`;
    }
    
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

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
      onClick={handleClick}
    >
      <div className="relative">
        {vehicleImageUrl && !imageError ? (
          <img
            src={vehicleImageUrl}
            alt={vehicle.vehiclecategory}
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
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{vehicle.vehiclecategory}</h3>
        <p className="text-gray-600 text-sm mb-2">{vehicle.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(vehicle.dailyrate)} / day
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
