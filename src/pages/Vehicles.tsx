import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Vehicle, VehicleType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { RCMAvailableCar, RCMMandatoryFee, RCMSeasonalRate } from "@/lib/api/rcm-api-types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface RcmVehicleWithPricing {
  vehicle: RCMAvailableCar;
  seasonalRates: RCMSeasonalRate[];
  mandatoryFee: RCMMandatoryFee | null;
}

const Vehicles = () => {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { useDriverAges, useStep2Vehicles, useVehicleCategories } = useRcmApi();
  const { data: driverAges, isLoading: isLoadingAges, error: driverAgesError } = useDriverAges();
  const { data: categoryTypes } = useVehicleCategories();
  const [uniqueVehicleCategoryTypes, setUniqueVehicleCategoryTypes] = useState<Array<{id: string, name: string}>>([]);

  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [maxPriceAvailable, setMaxPriceAvailable] = useState<number>(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const dropoffTime = searchParams.get("dropoffTime") || "";
  const age = searchParams.get("age") || "";
  const carCategory = searchParams.get("carCategory") || "0";
  const promoCode = searchParams.get("promoCode") || "";

  const getValidAgeId = () => {
    if (age && driverAges?.some(driverAge => String(driverAge.id) === age)) {
      return age;
    }
    
    const defaultAge = driverAges?.find(a => a.isdefault) || driverAges?.[0];
    return defaultAge ? String(defaultAge.id) : "";
  };

  const step2Params = pickupLocation && driverAges?.length ? {
    pickuplocationid: pickupLocation,
    pickupdate: pickupDate,
    pickuptime: pickupTime,
    dropofflocationid: dropoffLocation || pickupLocation,
    dropoffdate: dropoffDate,
    dropofftime: dropoffTime,
    ageid: getValidAgeId(),
    vehiclecategorytypeid: carCategory
  } : null;

  console.log("Car Category Selected (raw):", carCategory);
  console.log("Car Category Type:", typeof carCategory);
  console.log("Step2Params (full):", JSON.stringify(step2Params, null, 2));
  console.log("Step2Params vehiclecategorytypeid:", step2Params?.vehiclecategorytypeid);

  const { data: step2Data, isLoading: isLoadingStep2, error: step2Error } = useStep2Vehicles(step2Params);

  useEffect(() => {
    if (!driverAges?.length) {
      return;
    }

    if (step2Data?.status === "OK" && step2Data.results) {
      setIsLoading(false);
      
      const { availablecars, seasonalrates, mandatoryfees } = step2Data.results;
      
      console.log("Available cars count:", availablecars.length);
      if (availablecars.length > 0) {
        console.log("First available car:", availablecars[0]);
      }
      
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
        
        return {
          id: Number(car.vehiclecategoryid),
          make: car.vehiclecategory.split(' ')[0] || "Unknown",
          model: car.vehiclecategory.split(' ').slice(1).join(' ') || "Vehicle",
          year: new Date().getFullYear(),
          type: String(car.vehiclecategorytypeid) as VehicleType,
          price: totalPrice,
          priceUnit: "total",
          seats: car.numberofadults + car.numberofchildren,
          transmission: "automatic",
          fuelType: "gasoline",
          fuelEfficiency: "N/A",
          available: car.available === 1,
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
          dailyRate: carRates.length > 0 ? carRates[0].dailyrateafterdiscount : 0,
          totalDays: carRates.length > 0 ? carRates[0].numberofdays : 1,
          discountAmount: car.totaldiscountamount
        };
      });
      
      setVehicles(mappedVehicles);
      
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
      toast.error("Failed to load vehicles", { 
        description: "Please try another search or contact support."
      });
    }
  }, [step2Data, step2Error, driverAges]);

  useEffect(() => {
    let results = [...vehicles];
    
    if (vehicleType !== "all") {
      results = results.filter(vehicle => vehicle.type === vehicleType);
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
  }, [vehicles, vehicleType, priceRange, searchTerm]);

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

  const hasApiError = driverAgesError || step2Error;

  function getLocationName(locationId: string) {
    if (locationId === "1") return "Kelston";
    if (locationId === "2") return "Auckland Airport";
    return locationId;
  }

  const isMobile = useIsMobile();

  useEffect(() => {
    setFiltersOpen(!isMobile);
  }, [isMobile]);

  return (
      <main className="flex-grow">
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
            
            {hasApiError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Connection Error</AlertTitle>
                <AlertDescription>
                  We encountered a problem connecting to the reservation system. 
                  This may be due to invalid search parameters.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4 space-y-6">
              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg mb-4">Filters</h2>
                  <CollapsibleTrigger asChild>
                    <button
                      className="lg:hidden text-primary px-2 py-1 rounded transition-colors hover:bg-primary/10"
                    >
                      {filtersOpen ? "Hide Filters" : "Show Filters"}
                    </button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent forceMount>
                  <Card className="p-4">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base">Vehicle Type</Label>
                        <Select
                          value={vehicleType}
                          onValueChange={(value) => setVehicleType(value as VehicleType | "all")}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {uniqueVehicleCategoryTypes.map((categoryType) => (
                              <SelectItem key={categoryType.id} value={categoryType.id}>
                                {categoryType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-base">Price Range (total)</Label>
                        <div className="mt-4">
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
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </aside>
            <div className="lg:w-3/4">
              {isLoading || isLoadingAges || isLoadingStep2 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg shadow animate-pulse bg-gray-200 h-80"></div>
                  ))}
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No vehicles match your criteria</h3>
                  <p className="text-gray-600">Try adjusting your filters to find more options</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle} 
                      totalRateAfterDiscount={typeof vehicle.price === 'number' ? vehicle.price : parseFloat(vehicle.price)}
                      totalDiscountAmount={vehicle.discountAmount}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
  );
};

export default Vehicles;
