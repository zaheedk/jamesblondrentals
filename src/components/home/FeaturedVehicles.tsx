
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VehicleCard from "../vehicles/VehicleCard";
import { Vehicle, VehicleType } from "@/lib/types";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { toast } from "sonner";

const FeaturedVehicles = () => {
  const [activeCategory, setActiveCategory] = useState<VehicleType | "all">("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rcmApi } = useRcmApi();
  
  // Helper function to format dates for the API (dd/mm/yyyy)
  const formatDateForApi = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        // Get default location from Step1 data
        const step1Data = await rcmApi.getStep1();
        
        if (step1Data.status === "OK" && step1Data.results?.locations?.length && step1Data.results?.driverages?.length) {
          const defaultLocation = step1Data.results.locations[0];
          const defaultDriverAge = step1Data.results.driverages.find(age => age.isdefault) || 
                                  step1Data.results.driverages[0];
          
          // Get tomorrow's date for pickup and add 3 days for return
          const pickupDate = new Date();
          pickupDate.setDate(pickupDate.getDate() + 1); // Tomorrow
          const dropoffDate = new Date();
          dropoffDate.setDate(dropoffDate.getDate() + 4); // 3 days rental
          
          // Format dates properly for API
          const formattedPickupDate = formatDateForApi(pickupDate);
          const formattedDropoffDate = formatDateForApi(dropoffDate);
          
          console.log("Featured vehicles search with dates:", formattedPickupDate, formattedDropoffDate);
          console.log("Using driver age ID:", defaultDriverAge.id);
          
          // Use Step2 API for consistency with the vehicles page
          const vehiclesData = await rcmApi.getStep2({
            pickuplocationid: defaultLocation.id.toString(),
            pickupdate: formattedPickupDate,
            pickuptime: "10:00",
            dropofflocationid: defaultLocation.id.toString(),
            dropoffdate: formattedDropoffDate,
            dropofftime: "10:00",
            ageid: defaultDriverAge.id
          });
          
          if (vehiclesData.status === "OK" && vehiclesData.results?.availablecars) {
            // Transform API data to match our Vehicle interface
            const mappedVehicles: Vehicle[] = vehiclesData.results.availablecars.map(v => ({
              id: parseInt(v.vehiclecategoryid.toString()),
              make: v.vehiclecategory.split(" ")[0] || "Unknown",
              model: v.vehiclecategory.split(" ").slice(1).join(" ") || "Vehicle",
              year: new Date().getFullYear(),
              type: mapCategoryToType(v.vehiclecategory),
              price: parseFloat(v.totalrateafterdiscount.toString()) || 50,
              priceUnit: "day",
              seats: v.numberofadults + v.numberofchildren || 4,
              transmission: "automatic",
              fuelType: "gasoline",
              fuelEfficiency: "35 mpg",
              available: true,
              location: defaultLocation.location || "Main Location",
              features: v.vehicledescription1 ? v.vehicledescription1.split(',').map(f => f.trim()) : ["Air Conditioning", "Power Steering"],
              images: [v.imageurl || "/placeholder.svg"],
              description: v.vehicledescription2 || `${v.vehiclecategory} with ${v.numberofadults + v.numberofchildren || 4} seats.`,
            }));
            
            setVehicles(mappedVehicles);
          } else {
            console.error("No vehicles available in response:", vehiclesData);
            toast.error("Could not load featured vehicles");
            setVehicles([]);
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
  }, [rcmApi]);
  
  // Helper function to map RCM categories to our vehicle types
  const mapCategoryToType = (category: string): VehicleType => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('economy')) return 'economy';
    if (lowerCategory.includes('compact')) return 'compact';
    if (lowerCategory.includes('midsize')) return 'midsize';
    if (lowerCategory.includes('suv')) return 'suv';
    if (lowerCategory.includes('luxury')) return 'luxury';
    if (lowerCategory.includes('van')) return 'van';
    if (lowerCategory.includes('convertible')) return 'convertible';
    return 'economy'; // default
  };
  
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
            <VehicleCard 
              key={vehicle.id}
              id={vehicle.id}
              name={`${vehicle.make} ${vehicle.model}`}
              imageUrl={vehicle.images[0]}
              price={vehicle.price}
              seats={vehicle.seats}
              luggage={2}
              transmission={vehicle.transmission}
              features={vehicle.features}
              category={vehicle.type}
              currencySymbol="$"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVehicles;
