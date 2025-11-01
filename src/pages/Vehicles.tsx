import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Vehicle, VehicleType } from "@/lib/types";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { RCMAvailableCar, RCMMandatoryFee, RCMSeasonalRate } from "@/lib/api/rcm-api-types";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCampaignCode } from "@/lib/utils";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import BookingSteps from "@/components/booking/BookingSteps";

interface RcmVehicleWithPricing {
  vehicle: RCMAvailableCar;
  seasonalRates: RCMSeasonalRate[];
  mandatoryFee: RCMMandatoryFee | null;
}

// Helper function to check if location is Auckland Airport or South Auckland
const isAucklandAirportOrSouthAuckland = (locationId: string, locations: any[], locationName?: string) => {
  const location = locations.find(loc => String(loc.id) === String(locationId));
  console.log('Checking location for discount:', { locationId, location, locationName, allLocations: locations });
  
  // Check by location data from API
  if (location) {
    const apiLocationName = location.location?.toLowerCase() || '';
    const isMatch = apiLocationName.includes('auckland airport') || 
           apiLocationName.includes('south auckland') ||
           (apiLocationName.includes('airport') && apiLocationName.includes('auckland'));
    
    console.log('Location name check (API):', { apiLocationName, isMatch });
    if (isMatch) return true;
  }
  
  // Fallback: check by location name from search params
  if (locationName) {
    const searchLocationName = locationName.toLowerCase();
    const isMatch = searchLocationName.includes('auckland airport') || 
           searchLocationName.includes('south auckland') ||
           (searchLocationName.includes('airport') && searchLocationName.includes('auckland'));
    
    console.log('Location name check (search params):', { searchLocationName, isMatch });
    return isMatch;
  }
  
  return false;
};

const Vehicles = () => {
  const sessionVehiclesKey = 'rcm-vehicles-data';
  
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const { useDriverAges, useStep2Vehicles, useVehicleCategories, useLocations } = useRcmApi();
  const { data: driverAges, isLoading: isLoadingAges, error: driverAgesError } = useDriverAges();
  const { data: categoryTypes } = useVehicleCategories();
  const { data: locations = [] } = useLocations();
  const [uniqueVehicleCategoryTypes, setUniqueVehicleCategoryTypes] = useState<Array<{id: string, name: string}>>([]);

  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [maxPriceAvailable, setMaxPriceAvailable] = useState<number>(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const pickupLocationName = searchParams.get("pickupLocationName") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const dropoffLocationName = searchParams.get("dropoffLocationName") || pickupLocationName;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const dropoffTime = searchParams.get("dropoffTime") || "";
  const age = searchParams.get("age") || "";
  const carCategory = searchParams.get("carCategory") || "0";
  const campaignCode = searchParams.get("campaignCode") || "";

  console.log('Current search params:', {
    pickupLocation,
    pickupLocationName,
    dropoffLocation,
    dropoffLocationName
  });

  // Redirect to home if no query parameters
  useEffect(() => {
    if (!pickupLocation && !pickupDate && !dropoffDate && !age) {
      navigate("/");
    }
  }, [pickupLocation, pickupDate, dropoffDate, age, navigate]);

  const getValidAgeId = () => {
    if (age && driverAges?.some(driverAge => String(driverAge.id) === age)) {
      return age;
    }
    
    const defaultAge = driverAges?.find(a => a.isdefault) || driverAges?.[0];
    return defaultAge ? String(defaultAge.id) : "";
  };

  // Generate campaign code - for midweek discount, we pass category info
  const effectiveCampaignCode = getCampaignCode(
    campaignCode || "", 
    pickupDate, 
    dropoffDate,
    "", // vehicle name not available at this stage
    carCategory // pass category ID to help determine if it's truck/van
  );

  console.log('Campaign code being passed to API:', {
    effectiveCampaignCode,
    originalCampaignCode: campaignCode,
    pickupDate,
    dropoffDate,
    carCategory
  });

  const step2Params = pickupLocation && driverAges?.length ? {
    pickuplocationid: pickupLocation,
    pickupdate: pickupDate,
    pickuptime: pickupTime,
    dropofflocationid: dropoffLocation || pickupLocation,
    dropoffdate: dropoffDate,
    dropofftime: dropoffTime,
    ageid: getValidAgeId(),
    vehiclecategorytypeid: carCategory,
    campaigncode: effectiveCampaignCode
  } : null;

  const { data: step2Data, isLoading: isLoadingStep2, error: step2Error, refetch: refetchStep2 } = useStep2Vehicles(step2Params);

  useEffect(() => {
    const shouldRefetchData = Boolean(
      (location.state?.forceRefresh || location.state?.fromInsurancePage) && 
      step2Params && 
      !hasAttemptedRefresh
    );
    
    if (shouldRefetchData) {
      console.log("Refreshing vehicles data after navigation back...", {
        params: step2Params,
        state: location.state
      });
      
      setIsLoading(true);
      setHasAttemptedRefresh(true);
      refetchStep2();
      
      window.history.replaceState({}, document.title);
    }

    if (location.state?.resetCategoryFilter) {
      console.log("Resetting category filters after returning from insurance page");
      setSelectedVehicleTypes([]);
    }
  }, [location.state, refetchStep2, step2Params, hasAttemptedRefresh]);

  useEffect(() => {
    setHasAttemptedRefresh(false);
  }, [pickupLocation, dropoffLocation, pickupDate, dropoffDate, pickupTime, dropoffTime, age, carCategory]);

  useEffect(() => {
    if (!driverAges?.length) {
      return;
    }

    if (step2Data?.status === "OK" && step2Data.results) {
      setIsLoading(false);
      
      const { availablecars, seasonalrates, mandatoryfees } = step2Data.results;
      
      const availableStatusCounts = availablecars.reduce((acc, car) => {
        const status = car.available;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      availablecars.forEach((car, index) => {
        console.log(`Car ${index + 1} Details:
          - Available: ${car.available}
          - Available Message: ${car.availablemessage || 'No message'}
          - Vehicle Category: ${car.vehiclecategory}
          - Vehicle Category ID: ${car.vehiclecategoryid}
          - Total Rate After Discount: ${car.totalrateafterdiscount}
        `);
      });
      
      // Summary of available counts by category
      console.log('Available vehicle summary:', availablecars.map(car => ({
        category: car.vehiclecategory,
        categoryTypeId: car.vehiclecategorytypeid,
        available: car.available,
        availableMessage: car.availablemessage
      })));
      
      const mappedVehicles: Vehicle[] = availablecars.map(car => {
        const carRates = seasonalrates.filter(rate => 
          String(rate.vehiclecategoryid) === String(car.vehiclecategoryid)
        );
        
        const mandatoryFee = mandatoryfees.find(fee => 
          String(fee.vehiclecategoryid) === String(car.vehiclecategoryid) && 
          String(fee.vehiclecategorytypeid) === String(car.vehiclecategorytypeid)
        );
        
        const feeAmount = mandatoryFee ? Number(mandatoryFee.totalfeeamount) : 0;
        const totalPrice = car.totalrateafterdiscount + feeAmount;
        
        // Determine rate period and related data from seasonal rates
        const firstRate = carRates[0];
        let rateperiod: "hour" | "day" | undefined;
        let numberofhours: number | undefined;
        let ratesubtotal: number;
        
        if (firstRate) {
          // If numberofhours exists in seasonal rate, it's hourly
          if (firstRate.numberofhours && firstRate.numberofhours > 0) {
            rateperiod = "hour";
            numberofhours = firstRate.numberofhours;
          } else if (firstRate.numberofdays && firstRate.numberofdays > 0) {
            rateperiod = "day";
          } else {
            // Fallback to daily if no clear period
            rateperiod = "day";
          }
          
          // Use the actual ratesubtotal if available, otherwise calculate it
          if (firstRate.ratesubtotal !== undefined) {
            ratesubtotal = firstRate.ratesubtotal;
          } else {
            // Calculate ratesubtotal based on daily rate and number of days/hours
            if (rateperiod === "hour" && numberofhours) {
              ratesubtotal = firstRate.dailyrateafterdiscount * numberofhours;
            } else {
              ratesubtotal = firstRate.dailyrateafterdiscount * (firstRate.numberofdays || 1);
            }
          }
        } else {
          // No seasonal rate data, fallback to car data
          rateperiod = "day";
          ratesubtotal = car.totalrateafterdiscount;
        }
        
        console.log(`Vehicle ${car.vehiclecategory} rate data:`, {
          rateperiod,
          numberofhours,
          ratesubtotal,
          firstRate,
          totalDays: firstRate?.numberofdays
        });
        
        // Clean up category name by removing prefixes like (S), (P), etc.
        const cleanCategoryName = car.vehiclecategory.replace(/^\([A-Z]\)\s*/, '');
        
        // Apply 25% discount for Auckland Airport and South Auckland
        const isAucklandAirportOrSouth = isAucklandAirportOrSouthAuckland(pickupLocation, locations, pickupLocationName);
        const shouldApplyDiscount = isAucklandAirportOrSouth;
        const discountMultiplier = shouldApplyDiscount ? 0.75 : 1; // 25% discount
        const discountedTotalPrice = totalPrice * discountMultiplier;
        
        console.log(`Vehicle ${car.vehiclecategory} discount check:`, {
          isAucklandAirportOrSouth,
          shouldApplyDiscount,
          originalPrice: totalPrice,
          discountedPrice: discountedTotalPrice,
          vehicleCategoryTypeId: car.vehiclecategorytypeid
        });
        
        // Determine transmission type from vehicle descriptions
        const descriptions = [car.vehicledescription1, car.vehicledescription2, car.vehicledescription3]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        const isManual = descriptions.includes('manual');
        const transmissionType = isManual ? "manual" : "automatic";
        
        return {
          id: Number(car.vehiclecategoryid),
          make: cleanCategoryName.split(' ')[0] || "Unknown",
          model: cleanCategoryName.split(' ').slice(1).join(' ') || "Vehicle",
          year: new Date().getFullYear(),
          type: cleanCategoryName as VehicleType,
          vehicleCategoryTypeId: Number(car.vehiclecategorytypeid), // Add the numeric category type ID
          price: discountedTotalPrice,
          priceUnit: "total",
          seats: car.numberofadults + car.numberofchildren,
          transmission: transmissionType,
          fuelType: "gasoline",
          fuelEfficiency: "N/A",
          available: car.available,
          location: pickupLocation,
          features: [
            `${car.numberofadults} Adults`,
            `${car.numberofchildren} Children`,
            `${car.numberoflargecases} Large Cases`,
            `${car.numberofsmallcases} Small Cases`
          ],
          images: [car.imageurl],
          description: [car.vehicledescription1, car.vehicledescription2, car.vehicledescription3]
            .filter(Boolean)
            .join(' '),
          dailyRate: firstRate?.dailyrateafterdiscount || 0,
          totalDays: firstRate?.numberofdays || 1,
          discountAmount: car.totaldiscountamount,
          numberofhours: numberofhours,
          rateperiod: rateperiod,
          ratesubtotal: ratesubtotal,
          avgrate: car.avgrate || 0,
          discounteddailyrate: car.discounteddailyrate || 0,
          categoryfriendlydescription: car.categoryfriendlydescription,
          hasLocationDiscount: shouldApplyDiscount
        };
      });
      
      mappedVehicles.forEach((vehicle) => {
        console.log(`Mapped vehicle ${vehicle.make} ${vehicle.model} - available: ${vehicle.available}, type: ${typeof vehicle.available}`);
      });
      
      setVehicles(mappedVehicles);
      
      try {
        sessionStorage.setItem(sessionVehiclesKey, JSON.stringify(mappedVehicles));
      } catch (e) {
        console.error("Error saving vehicles to session storage:", e);
      }
      
      if (mappedVehicles.length > 0) {
        const prices = mappedVehicles.map(v => {
          const numPrice = typeof v.price === 'string' ? parseFloat(v.price) : (v.price || 0);
          return numPrice;
        });
        
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        
        console.log(`Price range calculated: min=${minPrice}, max=${maxPrice}`);
        
        setMaxPriceAvailable(maxPrice);
        
        if (priceRange[0] === 0 && priceRange[1] === 500) {
          setPriceRange([minPrice, maxPrice]);
        } else {
          const adjustedMin = Math.max(minPrice, Math.min(priceRange[0], maxPrice));
          const adjustedMax = Math.min(maxPrice, Math.max(priceRange[1], minPrice));
          if (adjustedMin !== priceRange[0] || adjustedMax !== priceRange[1]) {
            setPriceRange([adjustedMin, adjustedMax]);
          }
        }
      } else {
        console.log("No vehicles found in the response");
        toast.info("No vehicles found", {
          description: "Try adjusting your search criteria"
        });
      }
    } else if (step2Error) {
      setIsLoading(false);
      console.error("Error fetching vehicles:", step2Error);
      
      try {
        const cachedVehiclesData = sessionStorage.getItem(sessionVehiclesKey);
        if (cachedVehiclesData && location.state?.fromInsurancePage) {
          const parsedVehicles = JSON.parse(cachedVehiclesData) as Vehicle[];
          console.log("Using cached vehicles data:", parsedVehicles.length);
          setVehicles(parsedVehicles);
          toast.info("Using previously loaded vehicles", {
            description: "Couldn't refresh the data. Showing recent results."
          });
          return;
        }
      } catch (e) {
        console.error("Error loading cached vehicles data:", e);
      }
      
      toast.error("Failed to load vehicles", { 
        description: "Please try another search or contact support."
      });
    }
  }, [step2Data, step2Error, driverAges, location.state]);

  useEffect(() => {
    let results = [...vehicles];
    
    if (selectedVehicleTypes.length > 0) {
      results = results.filter(vehicle => 
        selectedVehicleTypes.includes(String(vehicle.vehicleCategoryTypeId))
      );
    }
    
    results = results.filter(vehicle => {
      const price = typeof vehicle.price === 'string' 
        ? parseFloat(vehicle.price) 
        : (vehicle.price || 0);
      
      console.log(`Filtering vehicle ${vehicle.make} ${vehicle.model}: price=${price}, range=[${priceRange[0]}, ${priceRange[1]}]`);
      
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        vehicle =>
          vehicle.make.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term)
      );
    }
    
    console.log(`Filtered vehicles: ${results.length} out of ${vehicles.length}`);
    setFilteredVehicles(results);
  }, [vehicles, selectedVehicleTypes, priceRange, searchTerm]);

  useEffect(() => {
    if (categoryTypes?.length) {
      const formattedTypes = categoryTypes
        .map(type => ({
          id: String(type.id),
          name: type.vehiclecategorytype
        }))
        .sort((a, b) => {
          const typeA = categoryTypes.find(t => String(t.id) === a.id);
          const typeB = categoryTypes.find(t => String(t.id) === b.id);
          return (typeA?.displayorder ?? 0) - (typeB?.displayorder ?? 0);
        });
      setUniqueVehicleCategoryTypes(formattedTypes);
    }
  }, [categoryTypes]);

  useEffect(() => {
    if (step2Data?.status === "OK" && step2Data.results) {
      const { availablecars } = step2Data.results;
      
      const vehiclesWithCategoryId1 = availablecars.filter(car => 
        String(car.vehiclecategoryid) === "1"
      );
      
      console.log("Vehicles with vehiclecategoryid = 1:", vehiclesWithCategoryId1);
      
      vehiclesWithCategoryId1.forEach(car => {
        console.log(`Vehicle Category ID 1 Details:
          - Available: ${car.available}
          - Vehicle Category: ${car.vehiclecategory}
          - Total Rate After Discount: ${car.totalrateafterdiscount}
        `);
      });
    }
  }, [step2Data, step2Error, driverAges]);

  const hasApiError = driverAgesError || step2Error;

  function getLocationName(locationId: string) {
    const location = locations.find(loc => String(loc.id) === locationId);
    return location ? location.name : locationId;
  }

  const isMobile = useIsMobile();

  useEffect(() => {
    setFiltersOpen(!isMobile);
  }, [isMobile]);

  return (
    <main className="flex-grow">
      <ExitIntentPopup />
      <BookingSteps currentStep={2} />
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Available Vehicles</h1>
              {pickupLocation && (
                <p className="text-gray-600">
                  Location: {getLocationName(pickupLocation)}
                  {pickupDate && dropoffDate && (
                    <> | {pickupDate} - {dropoffDate}</>
                  )}
                </p>
              )}
            </div>
          </div>

          {hasApiError && !hasAttemptedRefresh && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Connection Error</AlertTitle>
              <AlertDescription>
                We encountered a problem connecting to the reservation system. 
                {vehicles.length > 0 ? " Showing previously loaded vehicles." : " This may be due to invalid search parameters."}
              </AlertDescription>
            </Alert>
          )}

          {hasApiError && hasAttemptedRefresh && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Using cached data</AlertTitle>
              <AlertDescription>
                We're showing the previously loaded vehicles. To refresh, try a new search.
              </AlertDescription>
            </Alert>
          )}

        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Dropdown */}
        <div className="mb-6 flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Vehicle Types
                <ChevronDown className="h-4 w-4" />
                {selectedVehicleTypes.length > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                    {selectedVehicleTypes.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4 bg-background border z-50">
              <div className="space-y-3">
                {uniqueVehicleCategoryTypes.map((categoryType) => (
                  <div key={categoryType.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${categoryType.id}`}
                      checked={selectedVehicleTypes.includes(categoryType.id)}
                      onCheckedChange={(checked) => {
                        setSelectedVehicleTypes(prev => {
                          if (checked) {
                            return [...prev, categoryType.id];
                          }
                          return prev.filter(id => id !== categoryType.id);
                        });
                      }}
                    />
                    <Label
                      htmlFor={`type-${categoryType.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {categoryType.name}
                    </Label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4 bg-background border z-50">
              <div className="space-y-4">
                <Label className="text-base font-bold">Price Range (total)</Label>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={maxPriceAvailable}
                    step={10}
                    minStepsBetweenThumbs={1}
                    className="mt-2"
                    onValueChange={(values: [number, number]) => {
                      const newValues: [number, number] = [
                        values[0],
                        Math.min(values[1], maxPriceAvailable)
                      ];
                      console.log("New price range:", newValues);
                      setPriceRange(newValues);
                    }}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Vehicles Grid */}
        <div>
          {isLoading || isLoadingAges || isLoadingStep2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-lg shadow animate-pulse bg-gray-200 h-80"></div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No vehicles match your criteria</h3>
              <p className="text-gray-600">Try adjusting your filters to find more options</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredVehicles.map((vehicle) => (
                 <VehicleCard 
                   key={vehicle.id} 
                   vehicle={vehicle} 
                   totalRateAfterDiscount={vehicle.ratesubtotal || (typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price))}
                   totalDiscountAmount={vehicle.discountAmount}
                   hasLocationDiscount={(vehicle as any).hasLocationDiscount}
                 />
               ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Vehicles;
