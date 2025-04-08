import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3X3, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRcmApi } from "@/hooks/use-rcm-api";
import VehicleCard from "@/components/vehicles/VehicleCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RCMStep2Request } from "@/lib/api/rcm-api-types";
import { toast } from "sonner";

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { useLocations, useDriverAges, useVehicleCategories, useStep2Vehicles } = useRcmApi();
  const [isGridView, setIsGridView] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Locations data
  const { data: locations, isLoading: isLocationsLoading } = useLocations();
  const { data: driverAges, isLoading: isDriverAgesLoading } = useDriverAges();
  const { data: vehicleCategories } = useVehicleCategories();
  
  // Search parameters - ensure consistent parameter naming
  const pickupLocationId = searchParams.get("pickupLocation") || searchParams.get("pickupLocationId") || "1";
  const pickupLocationName = searchParams.get("pickupLocationName");
  const dropoffLocationId = searchParams.get("dropoffLocation") || searchParams.get("dropoffLocationId") || pickupLocationId;
  const dropoffLocationName = searchParams.get("dropoffLocationName");
  const pickupDate = searchParams.get("pickupDate") || new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '/');
  const pickupTime = searchParams.get("pickupTime") || "10:00";
  const dropoffDate = searchParams.get("dropoffDate") || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '/');
  const dropoffTime = searchParams.get("dropoffTime") || "10:00";
  const ageId = searchParams.get("age");
  
  console.log("Search parameters:", {
    pickupLocationId, dropoffLocationId, pickupDate, pickupTime, dropoffDate, dropoffTime, ageId
  });
  
  // Get the default age ID from the driver ages data
  const [validAgeId, setValidAgeId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (ageId) {
      // If we have an age ID from the URL, use that
      setValidAgeId(ageId);
      console.log('Using age ID from URL:', ageId);
    } else if (driverAges && driverAges.length > 0) {
      // Otherwise, find a default
      const defaultAge = driverAges.find(age => age.isdefault);
      const firstAvailableAge = driverAges[0];
      
      const appropriateAgeId = defaultAge?.id || firstAvailableAge?.id;
      
      if (appropriateAgeId) {
        console.log('Using default driver age ID:', appropriateAgeId);
        setValidAgeId(appropriateAgeId.toString());
      }
    }
  }, [driverAges, ageId]);
  
  // Log search parameters for debugging
  console.log("Car Category Selected (raw):", categoryFilter);
  console.log("Car Category Type:", typeof categoryFilter);
  
  // Construct Step2 parameters, but only if we have a valid age ID
  const [step2Params, setStep2Params] = useState<RCMStep2Request | null>(null);
  
  useEffect(() => {
    if (validAgeId) {
      // Ensure we're using the correct parameter names expected by the API
      const params: RCMStep2Request = {
        pickuplocationid: pickupLocationId,
        pickupdate: pickupDate, // This should already be in DD/MM/YYYY format
        pickuptime: pickupTime,
        dropofflocationid: dropoffLocationId,
        dropoffdate: dropoffDate, // This should already be in DD/MM/YYYY format
        dropofftime: dropoffTime,
        ageid: validAgeId
      };
      
      // Add category filter if selected
      if (categoryFilter && categoryFilter !== "0") {
        params.vehiclecategorytypeid = categoryFilter;
      }
      
      console.log("Creating Step2Params with valid ageid:", params);
      setStep2Params(params);
    } else {
      console.log("Waiting for valid driver age ID before creating step2Params");
    }
  }, [pickupLocationId, pickupDate, pickupTime, dropoffLocationId, dropoffDate, dropoffTime, 
      validAgeId, categoryFilter]);
  
  // Fetch available vehicles
  const { 
    data: step2Data, 
    isLoading: isVehiclesLoading, 
    error: vehiclesError,
    refetch: refetchVehicles
  } = useStep2Vehicles(step2Params);

  // Log available cars
  useEffect(() => {
    if (step2Data?.results?.availablecars) {
      console.log("Available cars count:", step2Data.results.availablecars.length);
      if (step2Data.results.availablecars.length > 0) {
        console.log("First available car:", step2Data.results.availablecars[0]);
      }
    } else if (step2Data?.status === "ERR") {
      console.error("API returned error:", step2Data.error);
      toast.error("API Error", { description: step2Data.error });
    }
  }, [step2Data]);

  // Get pickup location name if not provided
  const getPickupLocationName = () => {
    if (pickupLocationName) return pickupLocationName;
    if (locations) {
      const location = locations.find(loc => loc.id.toString() === pickupLocationId);
      return location ? location.name : "Selected Location";
    }
    return "Selected Location";
  };
  
  // Get dropoff location name if not provided
  const getDropoffLocationName = () => {
    if (dropoffLocationName) return dropoffLocationName;
    if (locations) {
      const location = locations.find(loc => loc.id.toString() === dropoffLocationId);
      return location ? location.name : "Selected Location";
    }
    return "Selected Location";
  };

  // Update filter
  const handleCategoryFilter = (categoryId: string) => {
    setCategoryFilter(categoryId);
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.set("categoryId", categoryId);
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>
        
        {/* Search Criteria Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pickup</h3>
              <p className="font-medium">{getPickupLocationName()}</p>
              <p className="text-sm">{pickupDate} {pickupTime}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Drop-off</h3>
              <p className="font-medium">{getDropoffLocationName()}</p>
              <p className="text-sm">{dropoffDate} {dropoffTime}</p>
            </div>
            <div className="md:col-span-2 flex justify-end items-center space-x-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Vehicles</SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  {/* Category Filter */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Vehicle Category</h3>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant={categoryFilter === "0" || !categoryFilter ? "default" : "outline"}
                        onClick={() => handleCategoryFilter("0")}
                        className="justify-start"
                      >
                        All Categories
                      </Button>
                      {vehicleCategories?.map((category) => (
                        <Button
                          key={category.id}
                          variant={categoryFilter === category.id.toString() ? "default" : "outline"}
                          onClick={() => handleCategoryFilter(category.id.toString())}
                          className="justify-start"
                        >
                          {category.vehiclecategorytype}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button 
                variant="ghost"
                className="border"
                onClick={() => setIsGridView(true)}
                size="icon"
                disabled={isGridView}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"
                className="border"
                onClick={() => setIsGridView(false)}
                size="icon"
                disabled={!isGridView}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Driver Age Loading State */}
        {isDriverAgesLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 mb-4">
            <h3 className="font-medium">Loading driver age requirements...</h3>
            <p>Please wait while we retrieve available options.</p>
          </div>
        )}
        
        {/* Loading State */}
        {isVehiclesLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error State */}
        {vehiclesError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <h3 className="font-medium">Error loading vehicles</h3>
            <p>The API returned an error: {vehiclesError instanceof Error ? vehiclesError.message : "Unknown error"}</p>
            <p className="mt-2">Please try again or adjust your search criteria.</p>
          </div>
        )}
        
        {/* No Results */}
        {step2Data?.results?.availablecars && step2Data.results.availablecars.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            <h3 className="font-medium">No vehicles available</h3>
            <p>Please try different dates or locations.</p>
          </div>
        )}
        
        {/* Results Grid */}
        {step2Data?.results?.availablecars && step2Data.results.availablecars.length > 0 && (
          <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
            {step2Data.results.availablecars.map((car) => (
              <VehicleCard
                key={car.vehiclecategoryid}
                id={car.vehiclecategoryid}
                name={car.vehiclecategory}
                imageUrl={car.imageurl || "/placeholder.svg"}
                price={car.totalrateafterdiscount}
                seats={car.numberofadults + car.numberofchildren}
                luggage={car.numberoflargecases + car.numberofsmallcases}
                transmission="Auto"
                features={[]}
                category={car.vehiclecategory}
                currencySymbol="$"
                searchContext={{
                  pickupLocationId,
                  pickupLocationName: getPickupLocationName(),
                  dropoffLocationId,
                  dropoffLocationName: getDropoffLocationName(),
                  pickupDate,
                  pickupTime,
                  dropoffDate,
                  dropoffTime,
                  ageId: validAgeId || "1" // Use our validated ageId
                }}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Vehicles;
