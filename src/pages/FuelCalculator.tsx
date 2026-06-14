import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Calculator } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useRcmApi } from '@/hooks/use-rcm-api';

// Static libraries array to prevent LoadScript reloading
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem'
};

const center = {
  lat: -41.2865,
  lng: 174.7762
};

// Default fuel consumption estimates by vehicle category
const defaultConsumptionByCategory: Record<string, number> = {
  'Car': 7.0,
  'Small Car': 6.0,
  'Medium Car': 7.5,
  'Large Car': 8.5,
  'Premium Car': 9.0,
  'SUV': 10.0,
  'Van': 11.5,
  'Truck': 15.0,
  'Ute': 9.5,
  'Minibus': 12.0,
  'People Mover': 10.5
};


const FuelCalculator = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fuelPrice, setFuelPrice] = useState('2.50');
  const [consumption, setConsumption] = useState('');
  const [locations, setLocations] = useState(['', '']);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [kmCharges, setKmCharges] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const autocompleteRefs = useRef<(google.maps.places.Autocomplete | null)[]>([]);

  const { useVehicleCategories, useStep3Details, useDriverAges } = useRcmApi();
  const { data: vehicleCategories = [], isLoading: isLoadingCategories } = useVehicleCategories();
  const { data: driverAges = [] } = useDriverAges();
  
  // Fetch km charges when a vehicle is selected and we have driver ages
  const defaultAge = driverAges.find(age => age.isdefault) || driverAges[0];
  const step3Params = selectedCategory && defaultAge ? {
    vehiclecategoryid: selectedCategory.id,
    vehiclecategorytypeid: selectedCategory.vehiclecategorytypeid || selectedCategory.id,
    pickuplocationid: '1', // dummy location id  
    pickupdate: new Date().toLocaleDateString('en-GB'),
    pickuptime: '10:00',
    dropofflocationid: '1', // dummy return location
    dropoffdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
    dropofftime: '10:00',
    ageid: defaultAge.id.toString()
  } : null;
  
  const { data: step3Data } = useStep3Details(step3Params);

  // Categories that should include km charges
  const categoriesWithKmCharges = ['Truck', 'Jumbo Van', 'Premium Van', 'Van'];

  useEffect(() => {
    if (step3Data?.results?.kmcharges && selectedCategory) {
      const categoryType = selectedCategory.vehiclecategorytype;
      if (categoriesWithKmCharges.some(cat => categoryType.includes(cat))) {
        // Get the first km charge rate (usually per km rate)
        const kmCharge = step3Data.results.kmcharges[0];
        if (kmCharge) {
          setKmCharges(kmCharge.feeforeachadditionalkm || 0);
        }
      } else {
        setKmCharges(0);
      }
    } else {
      setKmCharges(0);
    }
  }, [step3Data, selectedCategory]);

  const handleVehicleChange = useCallback((value: string) => {
    setSelectedVehicle(value);
    const category = vehicleCategories.find(c => c.id.toString() === value);
    if (category) {
      setSelectedCategory(category);
      // Use default consumption based on category type or fallback to 8.0
      const categoryType = category.vehiclecategorytype;
      const defaultConsumption = defaultConsumptionByCategory[categoryType] || 8.0;
      setConsumption(defaultConsumption.toString());
    }
  }, [vehicleCategories]);

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const onPlaceChanged = (index: number) => {
    const autocomplete = autocompleteRefs.current[index];
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        handleLocationChange(index, place.formatted_address);
      }
    }
  };

  const addStop = () => {
    setLocations([...locations, '']);
    // Initialize autocomplete ref for new location
    autocompleteRefs.current.push(null);
  };

  const removeLocation = (index: number) => {
    if (locations.length > 2) {
      const newLocations = locations.filter((_, i) => i !== index);
      setLocations(newLocations);
      // Remove corresponding autocomplete ref
      autocompleteRefs.current.splice(index, 1);
    }
  };

  const calculateRoute = useCallback(() => {
    if (locations.length < 2 || !locations[0] || !locations[1]) return;
    if (!mapLoaded || !window.google?.maps) {
      console.error('Google Maps API not loaded yet');
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    
    const waypoints = locations.slice(1, -1).map(location => ({
      location: location,
      stopover: true
    }));

    directionsService.route(
      {
        origin: locations[0],
        destination: locations[locations.length - 1],
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
            const fuelCost = fuelNeeded * fuelPriceNum;
            
            // Add km charges for applicable vehicles
            const kmCost = kmCharges * distanceKm;
            const totalCost = fuelCost + kmCost;
            
            setEstimatedCost(totalCost);
          }
        }
      }
    );
  }, [locations, consumption, fuelPrice, kmCharges, mapLoaded]);

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

          <LoadScript
            googleMapsApiKey="AIzaSyC2BGBMGyKkuOlkIcXj_EcmQ6k7gYcT-rg"
            libraries={GOOGLE_MAPS_LIBRARIES}
            onLoad={() => {
              setMapLoaded(true);
              autocompleteRefs.current = new Array(locations.length).fill(null);
            }}
            onError={(e) => console.error('Google Maps failed to load:', e)}
          >
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
                        {isLoadingCategories ? (
                          <SelectItem value="loading" disabled>Loading vehicle types...</SelectItem>
                        ) : (
                          vehicleCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.vehiclecategorytype}
                            </SelectItem>
                          ))
                        )}
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
                          <div className="flex-1">
                            {mapLoaded ? (
                            <Autocomplete
                              onLoad={(autocomplete) => {
                                autocompleteRefs.current[index] = autocomplete;
                              }}
                              onPlaceChanged={() => onPlaceChanged(index)}
                              options={{
                                componentRestrictions: { country: 'nz' },
                                types: ['address']
                              }}
                            >
                              <Input
                                value={location}
                                onChange={(e) => handleLocationChange(index, e.target.value)}
                                placeholder={
                                  index === 0 ? "Enter start address" : 
                                  index === locations.length - 1 ? "Enter destination address" : 
                                  "Enter stop address"
                                }
                                className="w-full"
                              />
                            </Autocomplete>
                            ) : (
                              <Input
                                value={location}
                                onChange={(e) => handleLocationChange(index, e.target.value)}
                                placeholder="Loading map..."
                                className="w-full"
                                disabled
                              />
                            )}
                          </div>
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
                          {(() => {
                            const consumptionNum = parseFloat(consumption);
                            const fuelPriceNum = parseFloat(fuelPrice);
                            const fuelNeeded = (distance / 100) * consumptionNum;
                            const fuelCost = fuelNeeded * fuelPriceNum;
                            const kmCost = kmCharges * distance;
                            
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Fuel Cost:</span>
                                  <span className="font-semibold">${fuelCost.toFixed(2)}</span>
                                </div>
                                {kmCharges > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">KM Charges (${kmCharges.toFixed(2)}/km):</span>
                                    <span className="font-semibold">${kmCost.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="border-t pt-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Total Estimated Cost:</span>
                                    <span className="font-bold text-green-600">${estimatedCost.toFixed(2)}</span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
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
                      onLoad={() => {
                        setMapLoaded(true);
                        // Initialize autocomplete refs array
                        autocompleteRefs.current = new Array(locations.length).fill(null);
                      }}
                      onError={(e) => console.error('Google Maps failed to load:', e)}
                      libraries={GOOGLE_MAPS_LIBRARIES}
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