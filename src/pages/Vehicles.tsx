
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
  const { useDriverAges, useStep2Vehicles } = useRcmApi();
  
  const [vehicleType, setVehicleType] = useState<VehicleType | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [searchTerm, setSearchTerm] = useState("");
  const [transmission, setTransmission] = useState<"all" | "automatic" | "manual">("all");
  const [fuelTypes, setFuelTypes] = useState({
    gasoline: false,
    diesel: false,
    electric: false,
    hybrid: false,
  });

  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || "";
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
    // Always include vehiclecategorytypeid, even if it's "0"
    vehiclecategorytypeid: carCategory
  } : null;

  // Enhanced logging
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
        
        return {
          id: Number(car.vehiclecategoryid),
          make: car.vehiclecategory.split(' ')[0] || "Unknown",
          model: car.vehiclecategory.split(' ').slice(1).join(' ') || "Vehicle",
          year: new Date().getFullYear(),
          type: String(car.vehiclecategorytypeid) as VehicleType,
          price: car.totalrateafterdiscount + feeAmount,
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
        const prices = mappedVehicles.map(v => v.price as number);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
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
      const numericPrice = typeof vehicle.price === 'string' 
        ? parseFloat(vehicle.price) 
        : vehicle.price;
        
      return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
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
    
    const selectedFuelTypes = Object.entries(fuelTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
    
    if (selectedFuelTypes.length > 0) {
      results = results.filter(vehicle => selectedFuelTypes.includes(vehicle.fuelType));
    }
    
    setFilteredVehicles(results);
  }, [
    vehicles,
    vehicleType,
    priceRange,
    searchTerm,
    transmission,
    fuelTypes,
  ]);

  const handleFuelTypeChange = (type: keyof typeof fuelTypes) => {
    setFuelTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const hasApiError = driverAgesError || step2Error;

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
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="midsize">Midsize</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="convertible">Convertible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base">Price Range (per day)</Label>
                    <div className="flex justify-between mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={[0, 500]}
                      max={500}
                      step={10}
                      minStepsBetweenThumbs={1}
                      className="mt-2"
                      onValueChange={(values) => setPriceRange(values as [number, number])}
                    />
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

                  <div>
                    <Label className="text-base">Fuel Type</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="gasoline"
                          checked={fuelTypes.gasoline}
                          onCheckedChange={() => handleFuelTypeChange("gasoline")}
                        />
                        <label htmlFor="gasoline" className="ml-2">
                          Gasoline
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="diesel"
                          checked={fuelTypes.diesel}
                          onCheckedChange={() => handleFuelTypeChange("diesel")}
                        />
                        <label htmlFor="diesel" className="ml-2">
                          Diesel
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="electric"
                          checked={fuelTypes.electric}
                          onCheckedChange={() => handleFuelTypeChange("electric")}
                        />
                        <label htmlFor="electric" className="ml-2">
                          Electric
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="hybrid"
                          checked={fuelTypes.hybrid}
                          onCheckedChange={() => handleFuelTypeChange("hybrid")}
                        />
                        <label htmlFor="hybrid" className="ml-2">
                          Hybrid
                        </label>
                      </div>
                    </div>
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
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
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
