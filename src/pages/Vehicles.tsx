import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RCMAvailableCar } from "@/lib/api/rcm-api-types";
import { toast } from "sonner";

const Vehicles = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { useStep2Vehicles, useLocations } = useRcmApi();
  const [vehicleCategoryTypeId, setVehicleCategoryTypeId] = useState<string | null>(null);
  const [pickupLocationId, setPickupLocationId] = useState<string | null>(null);
  const [dropoffLocationId, setDropoffLocationId] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [dropoffDate, setDropoffDate] = useState<string | null>(null);
  const [dropoffTime, setDropoffTime] = useState<string | null>(null);
  const [ageId, setAgeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paramError, setParamError] = useState<string | null>(null);
  
  // Extract search parameters
  useEffect(() => {
    const vehicleCategoryTypeId = searchParams.get("vehicleCategoryTypeId");
    const pickupLocationId = searchParams.get("pickuplocationid");
    const dropoffLocationId = searchParams.get("dropofflocationid");
    const pickupDate = searchParams.get("pickupdate");
    const pickupTime = searchParams.get("pickuptime");
    const dropoffDate = searchParams.get("dropoffdate");
    const dropoffTime = searchParams.get("dropofftime");
    const ageId = searchParams.get("ageid");
    
    if (!pickupLocationId || !dropoffLocationId || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime || !ageId) {
      setParamError("Missing required parameters. Please go back and fill in all the search criteria.");
      setIsLoading(false);
      return;
    }
    
    setVehicleCategoryTypeId(vehicleCategoryTypeId);
    setPickupLocationId(pickupLocationId);
    setDropoffLocationId(dropoffLocationId);
    setPickupDate(pickupDate);
    setPickupTime(pickupTime);
    setDropoffDate(dropoffDate);
    setDropoffTime(dropoffTime);
    setAgeId(ageId);
    setIsLoading(false);
  }, [searchParams]);
  
  // Construct Step2 parameters
  const step2Params = {
    vehiclecategorytypeid: vehicleCategoryTypeId || "0",
    pickuplocationid: pickupLocationId || "",
    pickupdate: pickupDate || "",
    pickuptime: pickupTime || "",
    dropofflocationid: dropoffLocationId || "",
    dropoffdate: dropoffDate || "",
    dropofftime: dropoffTime || "",
    ageid: ageId || ""
  };
  
  // Fetch available vehicles using the useStep2Vehicles hook
  const { data: step2Data, isLoading: isStep2Loading, error: step2Error } = useStep2Vehicles(step2Params);
  
  // Fetch locations using the useLocations hook
  const { data: locations, isLoading: isLocationsLoading, error: locationsError } = useLocations();
  
  // Function to get location name by ID
  const locationName = (locationId: string | null) => {
    if (!locations || isLocationsLoading || locationsError || !locationId) return "Loading...";
    const location = locations.find(loc => String(loc.id) === locationId);
    return location ? location.name : "Unknown Location";
  };

  const handleSelectVehicle = (vehicle: RCMAvailableCar) => {
    // Create URL parameters for the booking page
    const params = new URLSearchParams();
    params.append("vehicleId", String(vehicle.vehiclecategoryid));
    params.append("vehicleCategoryTypeId", String(vehicle.vehiclecategorytypeid));
    params.append("vehicleName", vehicle.vehiclecategory);
    params.append("pickupLocationId", String(searchParams.get("pickuplocationid")));
    params.append("pickupLocationName", locationName(searchParams.get("pickuplocationid")));
    params.append("dropoffLocationId", String(searchParams.get("dropofflocationid")));
    params.append("dropoffLocationName", locationName(searchParams.get("dropofflocationid")));
    params.append("pickupDate", searchParams.get("pickupdate") || "");
    params.append("pickupTime", searchParams.get("pickuptime") || "");
    params.append("dropoffDate", searchParams.get("dropoffdate") || "");
    params.append("dropoffTime", searchParams.get("dropofftime") || "");
    params.append("ageId", String(searchParams.get("ageid") || ""));
    params.append("basePrice", String(vehicle.totalrateafterdiscount));

    navigate(`/booking?${params.toString()}`);
  };
  
  if (paramError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>
        <div className="text-red-500">Error: {paramError}</div>
        <Button onClick={() => navigate("/")}>Go back to home page</Button>
      </div>
    );
  }
  
  if (isLoading || isStep2Loading || isLocationsLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle><Skeleton /></CardTitle>
                <CardDescription><Skeleton /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (step2Error || locationsError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>
        <div className="text-red-500">Error: {step2Error?.message || locationsError?.message || "Failed to load vehicles."}</div>
        <Button onClick={() => navigate("/")}>Go back to home page</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>
      
      {step2Data?.results?.availablecars && step2Data.results.availablecars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {step2Data.results.availablecars.map((vehicle) => (
            <Card key={vehicle.vehiclecategoryid}>
              <CardHeader>
                <CardTitle>{vehicle.vehiclecategory}</CardTitle>
                <CardDescription>{vehicle.vehicledescription1}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={vehicle.imageurl} alt={vehicle.vehiclecategory} className="w-full h-40 object-cover rounded-md mb-4" />
                <div className="space-y-2">
                  <div>
                    <Label>Price</Label>
                    <Input type="text" value={`${vehicle.totalrateafterdiscount} ${step2Data?.results?.locationfees?.[0]?.currencysymbol || "$"}`} readOnly />
                  </div>
                  <div>
                    <Label>Passengers</Label>
                    <Input type="text" value={vehicle.numberofadults.toString()} readOnly />
                  </div>
                  <div>
                    <Label>Luggage</Label>
                    <Input type="text" value={`${vehicle.numberoflargecases} Large, ${vehicle.numberofsmallcases} Small`} readOnly />
                  </div>
                  <Button onClick={() => handleSelectVehicle(vehicle)}>Select Vehicle</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No vehicles available for the selected criteria.</div>
      )}
    </div>
  );
};

export default Vehicles;
