
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPinIcon } from 'lucide-react';

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

// SVG path for a map pin marker
const markerPath = "M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.94 7.53 14.42 7.85 14.81c0.17 0.2 0.48 0.2 0.65 0C12.47 22.92 20.5 14.44 20.5 8.5C20.5 3.81 16.69 0 12 0z";

const FuelStationsMap = () => {
  const [selectedStation, setSelectedStation] = useState<typeof fuelStations[0] | null>(null);
  
  return (
    <LoadScript googleMapsApiKey="AIzaSyC2BGBMGyKkuOlkIcXj_EcmQ6k7gYcT-rg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
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
            title={station.name}
            onClick={() => setSelectedStation(station)}
            icon={{
              path: markerPath,
              fillColor: "#FF0000",
              fillOpacity: 0.9,
              strokeWeight: 1,
              strokeColor: "#000",
              scale: 1.5,
              anchor: { x: 12, y: 24 }
            }}
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
  );
};

export default FuelStationsMap;
