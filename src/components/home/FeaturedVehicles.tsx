
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VehicleCard from "../vehicles/VehicleCard";
import { vehicles } from "@/lib/mock-data";
import { Vehicle, VehicleType } from "@/lib/types";

const FeaturedVehicles = () => {
  const [activeCategory, setActiveCategory] = useState<VehicleType | "all">("all");
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} showDetails={true} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedVehicles;
