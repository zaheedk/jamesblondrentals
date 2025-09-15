import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Calculator } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem'
};

const center = {
  lat: -41.2865,
  lng: 174.7762
};

const nzVehicles = [
  { value: 'toyota-corolla', label: 'Toyota Corolla', consumption: 6.5 },
  { value: 'ford-ranger', label: 'Ford Ranger', consumption: 9.2 },
  { value: 'holden-commodore', label: 'Holden Commodore', consumption: 8.1 },
  { value: 'mazda-cx5', label: 'Mazda CX-5', consumption: 7.4 },
  { value: 'transit-van', label: 'Transit Van', consumption: 11.5 },
  { value: 'isuzu-truck', label: 'Isuzu Truck', consumption: 15.2 }
];

const nzCities = [
  'Auckland CBD',
  'Wellington CBD', 
  'Christchurch CBD',
  'Hamilton CBD',
  'Tauranga CBD',
  'Napier CBD',
  'Palmerston North CBD',
  'Nelson CBD',
  'Rotorua CBD',
  'Invercargill CBD',
  'Queenstown CBD',
  'Dunedin CBD'
];

const FuelCalculator = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fuelPrice, setFuelPrice] = useState('2.50');
  const [consumption, setConsumption] = useState('');
  const [locations, setLocations] = useState(['', '']);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleVehicleChange = useCallback((value: string) => {
    setSelectedVehicle(value);
    const vehicle = nzVehicles.find(v => v.value === value);
    if (vehicle) {
      setConsumption(vehicle.consumption.toString());
    }
  }, []);

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const addStop = () => {
    setLocations([...locations, '']);
  };

  const removeLocation = (index: number) => {
    if (locations.length > 2) {
      const newLocations = locations.filter((_, i) => i !== index);
      setLocations(newLocations);
    }
  };

  const calculateRoute = useCallback(() => {
    if (locations.length < 2 || !locations[0] || !locations[1]) return;

    const directionsService = new google.maps.DirectionsService();
    
    const waypoints = locations.slice(1, -1).map(location => ({
      location: location + ', New Zealand',
      stopover: true
    }));

    directionsService.route(
      {
        origin: locations[0] + ', New Zealand',
        destination: locations[locations.length - 1] + ', New Zealand',
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          
          // Calculate total distance
          let totalDistance = 0;
          result.routes[0].legs.forEach(leg => {
            totalDistance += leg.distance?.value || 0;
          });
          
          const distanceKm = totalDistance / 1000;
          setDistance(distanceKm);
          
          // Calculate fuel cost
          const consumptionNum = parseFloat(consumption);
          const fuelPriceNum = parseFloat(fuelPrice);
          if (consumptionNum && fuelPriceNum) {
            const fuelNeeded = (distanceKm / 100) * consumptionNum;
            const cost = fuelNeeded * fuelPriceNum;
            setEstimatedCost(cost);
          }
        }
      }
    );
  }, [locations, consumption, fuelPrice]);

  return (
    <>
      <Helmet>
        <title>Fuel & Trip Calculator - Plan Your New Zealand Journey | Go Rentals</title>
        <meta name="description" content="Calculate fuel costs and plan your trip across New Zealand. Get accurate estimates for your rental vehicle journey with our interactive trip planner." />
        <meta name="keywords" content="fuel calculator, trip planner, New Zealand travel, rental car calculator, fuel cost estimate" />
        <link rel="canonical" href="https://gorentals.co.nz/fuel-calculator" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Fuel & Trip Calculator
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Plan your New Zealand journey and calculate fuel costs for your rental vehicle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Trip Planning */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Plan your trip
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Vehicle Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">VEHICLE</Label>
                    <Select value={selectedVehicle} onValueChange={handleVehicleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {nzVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.value} value={vehicle.value}>
                            {vehicle.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fuel Cost and Consumption */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">FUEL COST</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={fuelPrice}
                        onChange={(e) => setFuelPrice(e.target.value)}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground">Dollars per litre</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">CONSUMPTION</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={consumption}
                        onChange={(e) => setConsumption(e.target.value)}
                        className="text-center"
                      />
                      <p className="text-xs text-muted-foreground">Litres per 100km</p>
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">ITINERARY</Label>
                    <div className="space-y-3">
                      {locations.map((location, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-green-500' : 
                              index === locations.length - 1 ? 'bg-red-500' : 
                              'bg-blue-500'
                            }`}></div>
                          </div>
                          <Select 
                            value={location} 
                            onValueChange={(value) => handleLocationChange(index, value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder={
                                index === 0 ? "Start location" : 
                                index === locations.length - 1 ? "End location" : 
                                "Stop location"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {nzCities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {locations.length > 2 && index > 0 && index < locations.length - 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLocation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={addStop}
                        className="w-full flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Stop
                      </Button>
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <Button 
                    onClick={calculateRoute}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    disabled={!locations[0] || !locations[1] || !consumption}
                  >
                    Estimate Trip
                  </Button>

                  {/* Results */}
                  {distance > 0 && (
                    <Card className="bg-muted">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Distance:</span>
                            <span className="font-semibold">{distance.toFixed(0)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Estimated Fuel Cost:</span>
                            <span className="font-semibold text-green-600">${estimatedCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Map */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardContent className="p-0">
                  <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
                    <LoadScript 
                      googleMapsApiKey="AIzaSyC2BGBMGyKkuOlkIcXj_EcmQ6k7gYcT-rg"
                      onLoad={() => setMapLoaded(true)}
                    >
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={6}
                        options={{
                          disableDefaultUI: false,
                          zoomControl: true,
                          streetViewControl: true,
                          mapTypeControl: true
                        }}
                      >
                        {directionsResponse && (
                          <DirectionsRenderer 
                            directions={directionsResponse}
                            options={{
                              polylineOptions: {
                                strokeColor: '#3B82F6',
                                strokeWeight: 5,
                                strokeOpacity: 0.8
                              }
                            }}
                          />
                        )}
                      </GoogleMap>
                    </LoadScript>
                    
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
                          <p>Loading New Zealand map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FuelCalculator;