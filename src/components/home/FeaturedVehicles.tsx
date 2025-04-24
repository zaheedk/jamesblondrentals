import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { format } from "date-fns";

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
  const { rcmApi, useLocations } = useRcmApi();
  const { data: locations = [] } = useLocations();
  
  const getDefaultLocation = async (): Promise<string> => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      const isAuckland = latitude >= -37.3 && latitude <= -36.5 && 
                        longitude >= 174.2 && longitude <= 175.0;
                        
      const isWellington = latitude >= -41.4 && latitude <= -41.1 && 
                          longitude >= 174.7 && longitude <= 175.0;
      
      const kelstonLocation = locations.find(loc => 
        loc.name.toLowerCase().includes('kelston')
      );
      
      const wellingtonCBDLocation = locations.find(loc => 
        loc.name.toLowerCase().includes('wellington') && 
        loc.name.toLowerCase().includes('cbd')
      );
      
      const aucklandAirportLocation = locations.find(loc => 
        loc.name.toLowerCase().includes('auckland') && 
        loc.name.toLowerCase().includes('airport')
      );
      
      if (isAuckland && kelstonLocation) {
        console.log('User is in Auckland, defaulting to Kelston');
        return String(kelstonLocation.id);
      } else if (isWellington && wellingtonCBDLocation) {
        console.log('User is in Wellington, defaulting to Wellington CBD');
        return String(wellingtonCBDLocation.id);
      } else if (aucklandAirportLocation) {
        console.log('Defaulting to Auckland Airport');
        return String(aucklandAirportLocation.id);
      }
      
      return String(locations[0]?.id || "7");
      
    } catch (error) {
      console.log('Geolocation error or denied, defaulting to Auckland Airport');
      const aucklandAirport = locations.find(loc => 
        loc.name.toLowerCase().includes('auckland') && 
        loc.name.toLowerCase().includes('airport')
      );
      return String(aucklandAirport?.id || locations[0]?.id || "7");
    }
  };

  const getDefaultSearchParams = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pickupDate = format(tomorrow, 'dd/MM/yyyy');
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    const dropoffDate = format(dayAfter, 'dd/MM/yyyy');
    
    const defaultLocationId = await getDefaultLocation();
    
    const searchParams = new URLSearchParams({
      pickupLocation: defaultLocationId,
      dropoffLocation: defaultLocationId,
      pickupDate,
      dropoffDate,
      pickupTime: "08:00",
      dropoffTime: "08:00",
      age: "4", // Default age group
      carCategory: "0" // All categories
    });
    
    return searchParams.toString();
  };
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching premium vehicles...');
        
        const response = await rcmApi.request<CategoryListResponse>('POST', 'categorylist', {
          method: 'categorylist'
        });
        
        if (response.status === "OK") {
          const premiumVehicles = response.results.filter((vehicle) => 
            vehicle.vehiclecategoryname.toLowerCase().includes('premium')
          );
          
          console.log('Filtered premium vehicles:', premiumVehicles);
          setVehicles(premiumVehicles);
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
  
  const [searchParams, setSearchParams] = useState("");
  
  useEffect(() => {
    getDefaultSearchParams().then(params => {
      setSearchParams(params);
    });
  }, [locations]);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Premium Vehicles</h2>
          <p className="text-gray-600">Explore our exclusive premium collection</p>
        </div>
        <Link to={`/vehicles?${searchParams}`}>
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
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {vehicles.map((vehicle) => (
              <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="mx-2">
                  <AspectRatio ratio={4/3} className="overflow-hidden bg-white">
                    <img 
                      src={vehicle.imageurl} 
                      alt={vehicle.vehiclecategoryname}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-center">{vehicle.vehiclecategoryname}</h3>
                    <p className="text-gray-600 text-center mt-2">{vehicle.description}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

export default FeaturedVehicles;
