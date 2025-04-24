
import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Fuel } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

const center = {
  lat: -41.322,
  lng: 174.805
};

const fuelStations = [
  {
    id: 1,
    name: "Z-Broadway",
    position: { lat: -41.317, lng: 174.794 },
    address: "Broadway, Strathmore Park"
  },
  {
    id: 2,
    name: "Mobil",
    position: { lat: -41.306, lng: 174.808 },
    address: "1 Bay Road, Kilbirnie"
  }
];

const FuelStationsMapWellington = () => {
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

export default FuelStationsMapWellington;
