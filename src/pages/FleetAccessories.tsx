
import React from 'react';

const FleetAccessories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Vehicle Accessories</h2>
      <p className="text-gray-600 mb-6">
        Browse our selection of high-quality vehicle accessories to enhance your rental experience.
      </p>
      {/* TODO: Add actual accessories content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">GPS Navigation</h3>
          <p className="text-gray-500">Stay on track with our reliable GPS devices.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Child Seats</h3>
          <p className="text-gray-500">Ensure child safety with our range of child seats.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Roof Racks</h3>
          <p className="text-gray-500">Extra storage for all your adventure gear.</p>
        </div>
      </div>
    </div>
  );
};

export default FleetAccessories;
