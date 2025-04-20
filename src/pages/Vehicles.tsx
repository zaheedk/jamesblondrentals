import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  const { data: categoryTypes } = useVehicleCategories();
  const [uniqueVehicleCategoryTypes, setUniqueVehicleCategoryTypes] = useState<Array<{id: string, name: string}>>([]);

  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [searchTerm, setSearchTerm] = useState("");
  const [transmission, setTransmission] = useState<"all" | "automatic" | "manual">("all");

  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const dropoffTime = searchParams.get("dropoffTime") || "";
  const age = searchParams.get("age") || "";
  const carCategory = searchParams.get("carCategory") || "0";
  const promoCode = searchParams.get("promoCode") || "";

  const { data: driverAges, isLoading: isLoadingAges, error: driverAgesError } = useDriverAges();
  
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
        // Calculate the price range based on the total prices
        const prices = mappedVehicles.map(v => v.price as number);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPriceValue = Math.ceil(Math.max(...prices));
        setMaxPrice(maxPriceValue);
        // Only set the price range if it's the first time (or if the current range is the default)
        
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
    
    // Filter based on price range
    results = results.filter(vehicle => {
      const price = typeof vehicle.price === 'string' 
        ? parseFloat(vehicle.price) 
        : vehicle.price;
      return price >= minPrice && price <= maxPrice;
    });
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        vehicle =>
          vehicle.make.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term)
      );
    }
    
    if (transmission !== "all") {
      results = results.filter(vehicle => vehicle.transmission === transmission);
    }
    
    setFilteredVehicles(results);
  }, [
    vehicles,
    vehicleType,
    minPrice,
    maxPrice,
    searchTerm,
    transmission,
  ]);

  const hasApiError = driverAgesError || step2Error;

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Available Vehicles</h1>
                {pickupLocation && (
                  <p className="text-gray-600">
                    Location: {pickupLocation}
                    {pickupDate && dropoffDate && (
                      <> | {pickupDate} - {dropoffDate}</>
                    )}
                  </p>
                )}
              </div>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
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
              <Card className="p-4">
                <h2 className="font-bold text-lg mb-4">Filters</h2>

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
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label className="text-sm">Minimum Price: ${minPrice}</Label>
                        <Slider
                          value={[minPrice]}
                          max={maxPrice}
                          step={10}
                          className="mt-2"
                          onValueChange={(values) => setMinPrice(values[0])}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Maximum Price: ${maxPrice}</Label>
                        <Slider
                          value={[maxPrice]}
                          min={minPrice}
                          max={Math.max(minPrice + 100, 1000)}
                          step={10}
                          className="mt-2"
                          onValueChange={(values) => setMaxPrice(values[0])}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base">Transmission</Label>
                    <Select
                      value={transmission}
                      onValueChange={(value) => setTransmission(value as "all" | "automatic" | "manual")}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
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
      <Footer />
    </div>
  );
};

export default Vehicles;
