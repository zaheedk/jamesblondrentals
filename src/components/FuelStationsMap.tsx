
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

const center = {
  lat: -37.004,
  lng: 174.787
};

const fuelStations = [
  {
    name: "Z - Tom Pearce Dr",
    position: { lat: -37.002, lng: 174.785 }
  },
  {
    name: "Waitomo Fuel",
    position: { lat: -37.006, lng: 174.789 }
  },
  {
    name: "Mobil",
    position: { lat: -37.008, lng: 174.783 }
  }
];

const FuelStationsMap = () => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        {fuelStations.map((station, index) => (
          <Marker
            key={index}
            position={station.position}
            title={station.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default FuelStationsMap;
