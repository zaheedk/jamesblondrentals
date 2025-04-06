
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Vehicle, VehicleType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useRcmApi } from "@/hooks/use-rcm-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Vehicles = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rcmApi } = useRcmApi();
  
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
  const pickupTime = searchParams.get("pickupTime") || "10:00";
  const dropoffTime = searchParams.get("dropoffTime") || "10:00";

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        
        // If we have search params, use them
        if (pickupLocation && pickupDateStr && dropoffDateStr) {
          const vehiclesData = await rcmApi.getAvailableVehicles({
            pickupLocationId: pickupLocation,
            pickupDate: pickupDateStr,
            pickupTime,
            dropoffLocationId: dropoffLocation || pickupLocation,
            dropoffDate: dropoffDateStr,
            dropoffTime,
          });
          
          // Transform API data to match our Vehicle interface
          const mappedVehicles: Vehicle[] = vehiclesData.map(v => ({
            id: parseInt(v.id.toString()),
            make: v.make || "Unknown",
            model: v.model || "Vehicle",
            year: v.year || new Date().getFullYear(),
            type: (v.category?.toLowerCase() as VehicleType) || "economy",
            price: parseFloat(v.price?.toString()) || 50,
            priceUnit: "day",
            seats: v.passengers || 4,
            transmission: (v.transmission?.toLowerCase() === "a" ? "automatic" : "manual") as "automatic" | "manual",
            fuelType: (v.fuelType?.toLowerCase() || "gasoline") as "gasoline" | "diesel" | "electric" | "hybrid",
            fuelEfficiency: v.fuelConsumption || "35 mpg",
            available: true,
            location: pickupLocation,
            features: typeof v.features === 'string' ? v.features.split(',').map(f => f.trim()) : 
              (Array.isArray(v.features) ? v.features : ["Air Conditioning", "Power Steering"]),
            images: Array.isArray(v.images) && v.images.length > 0 ? 
              v.images.map(img => typeof img === 'string' ? img : (img as any).url || "/placeholder.svg") : 
              ["/placeholder.svg"],
            description: v.description || `${v.make} ${v.model} with ${v.passengers || 4} seats and ${v.transmission === "A" ? "automatic" : "manual"} transmission.`,
          }));
          
          setVehicles(mappedVehicles);
        } else {
          // Get default location and dates if no search params
          const step1Data = await rcmApi.getStep1();
          
          if (step1Data.status === "OK" && step1Data.results?.locations?.length) {
            const defaultLocation = step1Data.results.locations[0];
            
            // Get today's date and add 3 days for return
            const pickupDate = new Date();
            const dropoffDate = new Date();
            dropoffDate.setDate(dropoffDate.getDate() + 3);
            
            const vehiclesData = await rcmApi.getAvailableVehicles({
              pickupLocationId: defaultLocation.id.toString(),
              pickupDate: pickupDate.toISOString().split('T')[0],
              pickupTime: "10:00",
              dropoffLocationId: defaultLocation.id.toString(),
              dropoffDate: dropoffDate.toISOString().split('T')[0],
              dropoffTime: "10:00",
            });
            
            // Transform API data to match our Vehicle interface
            const mappedVehicles: Vehicle[] = vehiclesData.map(v => ({
              id: parseInt(v.id.toString()),
              make: v.make || "Unknown",
              model: v.model || "Vehicle",
              year: v.year || new Date().getFullYear(),
              type: (v.category?.toLowerCase() as VehicleType) || "economy",
              price: parseFloat(v.price?.toString()) || 50,
              priceUnit: "day",
              seats: v.passengers || 4,
              transmission: (v.transmission?.toLowerCase() === "a" ? "automatic" : "manual") as "automatic" | "manual",
              fuelType: (v.fuelType?.toLowerCase() || "gasoline") as "gasoline" | "diesel" | "electric" | "hybrid",
              fuelEfficiency: v.fuelConsumption || "35 mpg",
              available: true,
              location: defaultLocation.location || "Main Location",
              features: typeof v.features === 'string' ? v.features.split(',').map(f => f.trim()) : 
                (Array.isArray(v.features) ? v.features : ["Air Conditioning", "Power Steering"]),
              images: Array.isArray(v.images) && v.images.length > 0 ? 
                v.images.map(img => typeof img === 'string' ? img : (img as any).url || "/placeholder.svg") : 
                ["/placeholder.svg"],
              description: v.description || `${v.make} ${v.model} with ${v.passengers || 4} seats and ${v.transmission === "A" ? "automatic" : "manual"} transmission.`,
            }));
            
            setVehicles(mappedVehicles);
          }
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [rcmApi, pickupLocation, dropoffLocation, pickupDateStr, dropoffDateStr, pickupTime, dropoffTime]);

  useEffect(() => {
    // Apply filters
    let results = [...vehicles];
    
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
    vehicles,
    vehicleType,
    priceRange,
    searchTerm,
    transmission,
    fuelTypes,
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
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg shadow animate-pulse bg-gray-200 h-80"></div>
                  ))}
                </div>
              ) : filteredVehicles.length === 0 ? (
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
