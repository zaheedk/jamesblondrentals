
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useRcmApi } from "@/hooks/use-rcm-api";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { validateUrlParams } from "@/lib/utils";

const Vehicles = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { useStep2Vehicles } = useRcmApi();
  
  // Get vehicle search parameters from URL
  const pickupLocationId = searchParams.get("pickupLocationId");
  const dropoffLocationId = searchParams.get("dropoffLocationId");
  const pickupDate = searchParams.get("pickupDate");
  const pickupTime = searchParams.get("pickupTime");
  const dropoffDate = searchParams.get("dropoffDate");
  const dropoffTime = searchParams.get("dropoffTime");
  const ageId = searchParams.get("ageId");
  const categoryId = searchParams.get("categoryId");
  
  // Validate required parameters
  useEffect(() => {
    const requiredParams = ["pickupLocationId", "dropoffLocationId", "pickupDate", "pickupTime", "dropoffDate", "dropoffTime", "ageId"];
    const { isValid, missingParams } = validateUrlParams(searchParams, requiredParams);
    
    console.log("Vehicle search params validation:", { 
      isValid, 
      missingParams,
      allParams: {
        pickupLocationId,
        dropoffLocationId,
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        ageId,
        categoryId
      }
    });
    
    if (!isValid) {
      toast.error("Missing search parameters", {
        description: "Please fill in all required fields."
      });
      navigate("/");
    }
  }, [searchParams, navigate, pickupLocationId, dropoffLocationId, pickupDate, pickupTime, dropoffDate, dropoffTime, ageId]);
  
  // Build Step2 params from URL parameters
  const [step2Params, setStep2Params] = useState(null);
  
  useEffect(() => {
    if (pickupLocationId && dropoffLocationId && pickupDate && pickupTime && dropoffDate && dropoffTime && ageId) {
      const params = {
        pickuplocationid: pickupLocationId,
        pickupdate: pickupDate,
        pickuptime: pickupTime,
        dropofflocationid: dropoffLocationId,
        dropoffdate: dropoffDate,
        dropofftime: dropoffTime,
        ageid: ageId
      };
      
      // Add category ID if provided
      if (categoryId && categoryId !== "0") {
        params.vehiclecategorytypeid = categoryId;
      }
      
      console.log("Step2 params constructed successfully:", params);
      setStep2Params(params);
    }
  }, [pickupLocationId, dropoffLocationId, pickupDate, pickupTime, dropoffDate, dropoffTime, ageId, categoryId]);
  
  // Fetch available vehicles
  const { data: step2Data, isLoading, error } = useStep2Vehicles(step2Params);

  // Debug logging for step2Data
  useEffect(() => {
    if (step2Data) {
      console.log("Step2 data received:", {
        status: step2Data.status,
        availableCarsCount: step2Data.results?.availablecars?.length || 0
      });
    }
  }, [step2Data]);
  
  // Handle booking a vehicle
  const handleBookVehicle = (vehicle) => {
    console.log("Booking vehicle:", vehicle);
    
    // Extract location names from URL parameters
    const pickupLocationName = searchParams.get("pickupLocationName");
    const dropoffLocationName = searchParams.get("dropoffLocationName");
    
    // Build URL with all required parameters
    const bookingParams = new URLSearchParams();
    bookingParams.append("vehicleId", vehicle.vehiclecategoryid);
    bookingParams.append("vehicleName", vehicle.vehiclecategory);
    bookingParams.append("pickupLocationId", pickupLocationId);
    bookingParams.append("pickupLocationName", pickupLocationName || "");
    bookingParams.append("dropoffLocationId", dropoffLocationId);
    bookingParams.append("dropoffLocationName", dropoffLocationName || "");
    bookingParams.append("pickupDate", pickupDate);
    bookingParams.append("pickupTime", pickupTime);
    bookingParams.append("dropoffDate", dropoffDate);
    bookingParams.append("dropoffTime", dropoffTime);
    bookingParams.append("ageId", ageId);
    bookingParams.append("basePrice", vehicle.totalrateafterdiscount.toString());
    
    console.log("Navigation to booking with params:", Object.fromEntries(bookingParams));
    navigate(`/booking?${bookingParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Vehicles</h2>
          <p className="text-muted-foreground mb-6">{error.message || "Failed to load vehicles"}</p>
          <Button onClick={() => navigate("/")}>Return to Search</Button>
        </div>
      )}

      {!isLoading && !error && step2Data?.results?.availablecars?.length === 0 && (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">No Vehicles Available</h2>
          <p className="text-muted-foreground mb-6">
            No vehicles available for the selected dates and location.
          </p>
          <Button onClick={() => navigate("/")}>Modify Search</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {step2Data?.results?.availablecars?.map((vehicle) => (
          <VehicleCard
            key={vehicle.vehiclecategoryid}
            vehicle={vehicle}
            onBook={() => handleBookVehicle(vehicle)}
          />
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
