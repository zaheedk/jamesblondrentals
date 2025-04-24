
import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Fuel } from 'lucide-react';

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
    id: 1,
    name: "Z - Tom Pearce Dr",
    position: { lat: -37.002, lng: 174.785 },
    address: "Tom Pearce Dr, Auckland Airport"
  },
  {
    id: 2,
    name: "Waitomo Fuel",
    position: { lat: -37.006, lng: 174.789 },
    address: "33 Richard Pearse Drive"
  },
  {
    id: 3,
    name: "Mobil",
    position: { lat: -37.008, lng: 174.783 },
    address: "747 Massey Road"
  }
];

const FuelStationsMap = () => {
  const [selectedStation, setSelectedStation] = useState<typeof fuelStations[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const handleMapLoad = useCallback(() => {
    console.log('Google Maps loaded successfully');
    setMapLoaded(true);
  }, []);
  
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <LoadScript 
        googleMapsApiKey="AIzaSyC2BGBMGyKkuOlkIcXj_EcmQ6k7gYcT-rg"
        onLoad={() => console.log("Script loaded successfully")}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={handleMapLoad}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true
          }}
        >
          {fuelStations.map((station) => (
            <Marker
              key={station.id}
              position={station.position}
              onClick={() => setSelectedStation(station)}
              // Using a standard marker without custom path
            />
          ))}
          
          {selectedStation && (
            <InfoWindow
              position={selectedStation.position}
              onCloseClick={() => setSelectedStation(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">{selectedStation.name}</h3>
                <p>{selectedStation.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      {/* Fallback in case map doesn't load */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <Fuel className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p>Loading fuel stations map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelStationsMap;
