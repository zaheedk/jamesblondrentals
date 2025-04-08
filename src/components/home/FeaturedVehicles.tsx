
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VehicleCard from "../vehicles/VehicleCard";
import { Vehicle, VehicleType } from "@/lib/types";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { RCMAvailableCar } from "@/lib/api/rcm-api-types";

const FeaturedVehicles = () => {
  const [activeCategory, setActiveCategory] = useState<VehicleType | "all">("all");
  const [vehicles, setVehicles] = useState<RCMAvailableCar[]>([]);
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
          
          setVehicles(vehiclesData);
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
  
  // Filter vehicles based on active category
  const filteredVehicles = activeCategory === "all" 
    ? vehicles.slice(0, 3)
    : vehicles
        .filter(vehicle => {
          // Try to match the category based on the vehicle category name
          const categoryName = vehicle.vehiclecategory?.toLowerCase() || "";
          return categoryName.includes(activeCategory);
        })
        .slice(0, 3);
  
  // Placeholder onBook function
  const handleBookClick = () => {
    console.log("Book button clicked - navigating to search form");
    // In featured vehicles, we just navigate to the search form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
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
            <VehicleCard 
              key={vehicle.vehiclecategoryid} 
              vehicle={vehicle} 
              onBook={handleBookClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVehicles;
