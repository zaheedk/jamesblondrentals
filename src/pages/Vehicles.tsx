
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { vehicles } from "@/lib/mock-data";
import { Vehicle, VehicleType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Vehicles = () => {
  const [searchParams] = useSearchParams();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  
  // Filter states
  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [searchTerm, setSearchTerm] = useState("");
  const [transmission, setTransmission] = useState<"all" | "automatic" | "manual">("all");
  const [fuelTypes, setFuelTypes] = useState({
    gasoline: false,
    diesel: false,
    electric: false,
    hybrid: false,
  });

  // Get search params
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || "";
  const pickupDateStr = searchParams.get("pickupDate") || "";
  const dropoffDateStr = searchParams.get("dropoffDate") || "";

  useEffect(() => {
    // Apply filters
    let results = [...vehicles];
    
    // Filter by location if specified
    if (pickupLocation) {
      results = results.filter(vehicle => vehicle.location === pickupLocation);
    }
    
    // Filter by vehicle type
    if (vehicleType !== "all") {
      results = results.filter(vehicle => vehicle.type === vehicleType);
    }
    
    // Filter by price range
    results = results.filter(
      vehicle => vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1]
    );
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        vehicle =>
          vehicle.make.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term)
      );
    }
    
    // Filter by transmission
    if (transmission !== "all") {
      results = results.filter(vehicle => vehicle.transmission === transmission);
    }
    
    // Filter by fuel types
    const selectedFuelTypes = Object.entries(fuelTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
    
    if (selectedFuelTypes.length > 0) {
      results = results.filter(vehicle => selectedFuelTypes.includes(vehicle.fuelType));
    }
    
    setFilteredVehicles(results);
  }, [
    vehicleType,
    priceRange,
    searchTerm,
    transmission,
    fuelTypes,
    pickupLocation,
    dropoffLocation,
    pickupDateStr,
    dropoffDateStr,
  ]);

  const handleFuelTypeChange = (type: keyof typeof fuelTypes) => {
    setFuelTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Available Vehicles</h1>
                {pickupLocation && (
                  <p className="text-gray-600">
                    Location: {pickupLocation}
                    {pickupDateStr && dropoffDateStr && (
                      <> | {new Date(pickupDateStr).toLocaleDateString()} - {new Date(dropoffDateStr).toLocaleDateString()}</>
                    )}
                  </p>
                )}
              </div>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-1/4 space-y-6">
              <Card className="p-4">
                <h2 className="font-bold text-lg mb-4">Filters</h2>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base">Vehicle Type</Label>
                    <Select
                      value={vehicleType}
                      onValueChange={(value) => setVehicleType(value as VehicleType | "all")}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="midsize">Midsize</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="convertible">Convertible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base">Price Range (per day)</Label>
                    <div className="flex justify-between mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 200]}
                      max={200}
                      step={10}
                      minStepsBetweenThumbs={1}
                      className="mt-2"
                      onValueChange={(values) => setPriceRange(values as [number, number])}
                    />
                  </div>

                  <div>
                    <Label className="text-base">Transmission</Label>
                    <Select
                      value={transmission}
                      onValueChange={(value) => setTransmission(value as "all" | "automatic" | "manual")}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base">Fuel Type</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="gasoline"
                          checked={fuelTypes.gasoline}
                          onCheckedChange={() => handleFuelTypeChange("gasoline")}
                        />
                        <label htmlFor="gasoline" className="ml-2">
                          Gasoline
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="diesel"
                          checked={fuelTypes.diesel}
                          onCheckedChange={() => handleFuelTypeChange("diesel")}
                        />
                        <label htmlFor="diesel" className="ml-2">
                          Diesel
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="electric"
                          checked={fuelTypes.electric}
                          onCheckedChange={() => handleFuelTypeChange("electric")}
                        />
                        <label htmlFor="electric" className="ml-2">
                          Electric
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="hybrid"
                          checked={fuelTypes.hybrid}
                          onCheckedChange={() => handleFuelTypeChange("hybrid")}
                        />
                        <label htmlFor="hybrid" className="ml-2">
                          Hybrid
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </aside>

            {/* Vehicle Grid */}
            <div className="lg:w-3/4">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No vehicles match your criteria</h3>
                  <p className="text-gray-600">Try adjusting your filters to find more options</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Vehicles;
