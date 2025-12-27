
import { useState, useEffect, useCallback, memo, startTransition } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [searchParams, setSearchParams] = useState(""); 
  const { rcmApi, useLocations } = useRcmApi();
  const { data: locations = [] } = useLocations();
  const isMobile = useIsMobile();
  
  const getDefaultLocation = useCallback(async (): Promise<string> => {
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
  }, [locations]);

  const getDefaultSearchParams = useCallback(async () => {
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
  }, [getDefaultLocation]);
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        
        const response = await rcmApi.request<CategoryListResponse>('POST', 'categorylist', {
          method: 'categorylist'
        });
        
        if (response.status === "OK") {
          // Get only first 4 premium vehicles to improve performance
          const premiumVehicles = response.results
            .filter(vehicle => vehicle.vehiclecategoryname.toLowerCase().includes('premium'))
            .slice(0, 4);
          
          // Use startTransition for non-urgent state updates to improve INP
          startTransition(() => {
            setVehicles(premiumVehicles);
          });
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to load premium vehicles", {
          description: "Please try again later"
        });
        startTransition(() => {
          setVehicles([]);
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [rcmApi]);
  
  useEffect(() => {
    if (locations.length > 0) {
      getDefaultSearchParams().then(params => {
        // Use startTransition for non-urgent state updates
        startTransition(() => {
          setSearchParams(params);
        });
      });
    }
  }, [locations, getDefaultSearchParams]);
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Premium Vehicles</h2>
          <p className="text-gray-600">Explore our exclusive premium collection</p>
        </div>
        <div className="flex gap-4 items-center mt-4 sm:mt-0">
          <Link to={`/vehicles?${searchParams}`}>
            <Button variant="outline">
              View All Vehicles
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg shadow animate-pulse bg-gray-200 h-64"></div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No premium vehicles available at this time.</p>
        </div>
      ) : (
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {vehicles.map((vehicle) => (
              <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="mx-2">
                  <AspectRatio ratio={4/3} className="overflow-hidden bg-white">
                    {/* Optimized image loading with proper sizes */}
                    <img 
                      src={`${vehicle.imageurl}?f=webp&q=60&w=400&h=300&fit=cover`} 
                      alt={vehicle.vehiclecategoryname}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      width="400"
                      height="300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <h3 className="text-lg md:text-xl font-bold text-center">{vehicle.vehiclecategoryname}</h3>
                    {!isMobile && (
                      <p className="text-gray-600 text-center mt-2">{vehicle.description}</p>
                    )}
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
