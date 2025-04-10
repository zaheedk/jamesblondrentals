
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VehicleCard from "../vehicles/VehicleCard";
import { Vehicle, VehicleType } from "@/lib/types";
import { useRcmApi } from "@/hooks/use-rcm-api";

const FeaturedVehicles = () => {
  const [activeCategory, setActiveCategory] = useState<VehicleType | "all">("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rcmApi } = useRcmApi();
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        // Get default location from Step1 data
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
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [rcmApi]);
  
  const categories: { label: string; value: VehicleType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Economy", value: "economy" },
    { label: "Compact", value: "compact" },
    { label: "Midsize", value: "midsize" },
    { label: "SUV", value: "suv" },
    { label: "Luxury", value: "luxury" }
  ];
  
  const filteredVehicles = vehicles.filter(vehicle => 
    activeCategory === "all" || vehicle.type === activeCategory
  ).slice(0, 3);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
          <p className="text-gray-600">Explore our top picks for your next journey</p>
        </div>
        
        <Link to="/vehicles">
          <Button variant="outline" className="mt-4 sm:mt-0">
            View All Vehicles
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-wrap mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`mr-2 mb-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg shadow animate-pulse bg-gray-200 h-80"></div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No vehicles available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVehicles;
