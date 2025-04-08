
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
  const { data: driverAges } = useDriverAges();
  const { data: vehicleCategories } = useVehicleCategories();
  
  // Search parameters
  const pickupLocationId = searchParams.get("pickupLocationId") || searchParams.get("pickuplocationid") || "1";
  const pickupLocationName = searchParams.get("pickupLocationName");
  const dropoffLocationId = searchParams.get("dropoffLocationId") || searchParams.get("dropofflocationid") || pickupLocationId;
  const dropoffLocationName = searchParams.get("dropoffLocationName");
  
  // Format date params correctly for the API (dd/MM/yyyy)
  const formatDateForApi = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) {
      console.error("Invalid date format:", dateStr);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${tomorrow.getDate().toString().padStart(2, '0')}/${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}/${tomorrow.getFullYear()}`;
    }
  };
  
  // Get default dates if needed
  const getDefaultPickupDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; 
  };
  
  const getDefaultDropoffDate = () => {
    const afterTomorrow = new Date();
    afterTomorrow.setDate(afterTomorrow.getDate() + 4);
    return afterTomorrow.toISOString().split('T')[0];
  };
  
  const pickupDateRaw = searchParams.get("pickupDate") || searchParams.get("pickupdate") || getDefaultPickupDate();
  const pickupTime = searchParams.get("pickupTime") || searchParams.get("pickuptime") || "10:00";
  const dropoffDateRaw = searchParams.get("dropoffDate") || searchParams.get("dropoffdate") || getDefaultDropoffDate();
  const dropoffTime = searchParams.get("dropoffTime") || searchParams.get("dropofftime") || "10:00";
  
  // Format dates for API
  const pickupDate = formatDateForApi(pickupDateRaw);
  const dropoffDate = formatDateForApi(dropoffDateRaw);
  
  // Get driver age ID (from first available if not specified)
  const [selectedAgeId, setSelectedAgeId] = useState<string | number>("4");
  
  // Set proper age ID when driverAges are loaded
  useEffect(() => {
    if (driverAges && driverAges.length > 0) {
      const ageParam = searchParams.get("age");
      if (ageParam) {
        setSelectedAgeId(ageParam);
      } else {
        const defaultAge = driverAges.find(age => age.isdefault) || driverAges[0];
        setSelectedAgeId(defaultAge.id);
      }
    }
  }, [driverAges, searchParams]);
  
  // Log search parameters for debugging
  console.log("Car Category Selected (raw):", categoryFilter);
  console.log("Date formats - pickup:", pickupDate, "dropoff:", dropoffDate);
  console.log("Selected age ID:", selectedAgeId, "Type:", typeof selectedAgeId);
  
  // Construct Step2 parameters
  const step2Params: RCMStep2Request | null = selectedAgeId ? {
    pickuplocationid: pickupLocationId,
    pickupdate: pickupDate,
    pickuptime: pickupTime,
    dropofflocationid: dropoffLocationId,
    dropoffdate: dropoffDate,
    dropofftime: dropoffTime,
    ageid: selectedAgeId
  } : null;
  
  // Add category filter if selected
  if (step2Params && categoryFilter && categoryFilter !== "0") {
    step2Params.vehiclecategorytypeid = categoryFilter;
  }
  
  console.log("Step2Params (full):", step2Params);
  
  // Fetch available vehicles
  const { 
    data: step2Data, 
    isLoading: isVehiclesLoading, 
    error: vehiclesError,
    refetch: refetchVehicles
  } = useStep2Vehicles(step2Params);

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
  
  // Log available cars
  useEffect(() => {
    if (step2Data?.results?.availablecars) {
      console.log("Available cars count:", step2Data.results.availablecars.length);
      if (step2Data.results.availablecars.length > 0) {
        console.log("First available car:", step2Data.results.availablecars[0]);
      }
    }
  }, [step2Data]);

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
              <p className="text-sm">{pickupDateRaw} {pickupTime}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Drop-off</h3>
              <p className="font-medium">{getDropoffLocationName()}</p>
              <p className="text-sm">{dropoffDateRaw} {dropoffTime}</p>
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
                  
                  {/* Driver Age Selection */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium">Driver Age</h3>
                    <div className="flex flex-col space-y-2">
                      {driverAges && driverAges.map((age) => (
                        <Button
                          key={age.id}
                          variant={selectedAgeId === age.id ? "default" : "outline"}
                          onClick={() => setSelectedAgeId(age.id)}
                          className="justify-start"
                        >
                          {age.driverage}
                          {age.isdefault && <span className="ml-2 text-xs opacity-70">(Default)</span>}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
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
            <p>Please try again or adjust your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => refetchVehicles()}
            >
              Retry
            </Button>
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
                  pickupDate: pickupDateRaw,
                  pickupTime,
                  dropoffDate: dropoffDateRaw,
                  dropoffTime,
                  ageId: selectedAgeId
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
