
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCategory {
  id: number;
  vehiclecategorytypeid: number;
  categorytype: string;
  vehiclecategoryname: string;
  description: string;
  numberofadults: number;
  numberofchildren: number;
  numberoflargecases: number;
  numberofsmallcases: number;
  vehicledescription1: string;
  vehicledescription2: string;
  vehicledescription3: string;
  vehicledescriptionurl: string;
  imageurl: string;
  sippcode: string | null;
  brandid: number;
  companyid: number;
}

interface CategoryListResponse {
  status: string;
  error: string;
  results: VehicleCategory[];
  ms: number;
  issues: any[];
}

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { rcmApi } = useRcmApi();
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching premium vehicles...');
        
        const response = await rcmApi.request<CategoryListResponse>('POST', 'categorylist', {
          method: 'categorylist'
        });
        
        if (response.status === "OK") {
          const luxuryVehicles = response.results.filter((vehicle) => 
            vehicle.categorytype.toLowerCase() === 'luxury'
          );
          
          console.log('Luxury vehicles:', luxuryVehicles);
          setVehicles(luxuryVehicles);
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
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Luxury Vehicles</h2>
          <p className="text-gray-600">Explore our exclusive luxury collection</p>
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
          <p className="text-gray-600">No luxury vehicles available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={vehicle.imageurl} 
                  alt={vehicle.vehiclecategoryname}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-center">{vehicle.vehiclecategoryname}</h3>
                <p className="text-gray-600 text-center mt-2">{vehicle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedVehicles;
