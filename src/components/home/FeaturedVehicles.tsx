import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCategory {
  id: string;
  vehiclecategoryname: string;
}

interface CategoryListResponse {
  status: string;
  results?: VehicleCategory[];
}

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rcmApi } = useRcmApi();
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching premium vehicles...');
        
        const categoryData = await rcmApi.request<CategoryListResponse>('POST', 'categorylist', {
          method: 'categorylist'
        });
        
        const premiumCategories = categoryData.results?.filter((category: VehicleCategory) => 
          category.vehiclecategoryname.toLowerCase().includes('premium')
        ) || [];
        
        console.log('Premium categories:', premiumCategories);
        
        if (premiumCategories.length > 0) {
          const today = new Date();
          const pickupDate = addDays(today, 1);
          const dropoffDate = addDays(pickupDate, 3);
          
          const formattedPickupDate = format(pickupDate, 'dd/MM/yyyy');
          const formattedDropoffDate = format(dropoffDate, 'dd/MM/yyyy');
          
          const pickupTime = "12:00";
          const dropoffTime = "12:00";
          
          const kelstonLocationId = "1";
          
          const vehiclesData = await rcmApi.request('POST', 'step2', {
            method: 'step2',
            pickuplocationid: kelstonLocationId,
            pickupdate: formattedPickupDate,
            pickuptime: pickupTime,
            dropofflocationid: kelstonLocationId,
            dropoffdate: formattedDropoffDate,
            dropofftime: dropoffTime
          });
          
          if (vehiclesData.status === "OK" && vehiclesData.results?.availablecars) {
            const premiumVehicles = vehiclesData.results.availablecars.filter((vehicle: any) => 
              premiumCategories.some((category: VehicleCategory) => 
                category.id === vehicle.vehiclecategoryid
              )
            );
            
            console.log('Premium vehicles:', premiumVehicles);
            setVehicles(premiumVehicles);
          }
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to load premium vehicles", {
          description: "Please try again later"
        });
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [rcmApi]);
  
  const getImageUrl = (vehicle: any) => {
    if (!vehicle.images || !Array.isArray(vehicle.images) || vehicle.images.length === 0) {
      return '/placeholder.svg';
    }
    return vehicle.images[0];
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Premium Vehicles</h2>
          <p className="text-gray-600">Explore our exclusive premium collection</p>
        </div>
        <Link to="/vehicles">
          <Button variant="outline" className="mt-4 sm:mt-0">
            View All Vehicles
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg shadow animate-pulse bg-gray-200 h-80"></div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No premium vehicles available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.slice(0, 3).map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={getImageUrl(vehicle)} 
                  alt={vehicle.vehiclecategory}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-center">{vehicle.vehiclecategory}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVehicles;
