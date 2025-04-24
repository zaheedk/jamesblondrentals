
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
              path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
              fillColor: "#FF0000",
              fillOpacity: 0.9,
              strokeWeight: 1,
              strokeColor: "#000",
              scale: 1.5,
              anchor: new google.maps.Point(12, 24),
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
