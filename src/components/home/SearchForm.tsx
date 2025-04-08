
import { useEffect, useState } from "react";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { useNavigate } from "react-router-dom";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { LocationSelect } from "./form-components/LocationSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { disablePastDates, getLocationTimeOptions } from "./form-components/DateTimeUtils";
import { RCMLocation, RCMDriverAge } from "@/lib/api/rcm-api-types";
import { toast } from "sonner";

const SearchForm = () => {
  const navigate = useNavigate();
  const { useLocations, useOfficeHours, useDriverAges, useVehicleCategories, useLocationDetails } = useRcmApi();
  
  // Fetch API data
  const { data: locations = [], isLoading: isLocationsLoading, error: locationsError } = useLocations();
  const { data: officeHours = [], isLoading: isOfficeHoursLoading } = useOfficeHours();
  const { data: locationDetails = [], isLoading: isLocationDetailsLoading } = useLocationDetails();
  const { data: driverAges = [], isLoading: isDriverAgesLoading } = useDriverAges();
  const { data: vehicleCategories = [], isLoading: isCategoriesLoading } = useVehicleCategories();
  
  // Form state
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [selectedAgeId, setSelectedAgeId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("0"); // 0 means "All Categories"
  const [sameLocation, setSameLocation] = useState(true);
  
  // Derived state
  const pickupTimeOptions = pickupLocationId && pickupDate
    ? getLocationTimeOptions(pickupLocationId, pickupDate, 'pickup', officeHours, locationDetails)
    : [];
    
  const dropoffTimeOptions = dropoffLocationId && dropoffDate
    ? getLocationTimeOptions(dropoffLocationId, dropoffDate, 'dropoff', officeHours, locationDetails)
    : [];
  
  // Update dropoff location when pickup location changes
  useEffect(() => {
    if (sameLocation && pickupLocationId) {
      setDropoffLocationId(pickupLocationId);
    }
  }, [pickupLocationId, sameLocation]);
  
  // Set default driver age when data is loaded
  useEffect(() => {
    if (driverAges.length > 0 && !selectedAgeId) {
      const defaultAge = driverAges.find(age => age.isdefault);
      if (defaultAge) {
        console.log(`Setting default driver age: ${defaultAge.id} (${defaultAge.driverage})`);
        setSelectedAgeId(defaultAge.id.toString());
      } else {
        console.log(`No default driver age found, using first: ${driverAges[0].id}`);
        setSelectedAgeId(driverAges[0].id.toString());
      }
    }
  }, [driverAges, selectedAgeId]);

  // Helper to get location name by ID
  const getLocationNameById = (id: string): string => {
    const location = locations.find((loc) => String(loc.id) === id);
    return location ? location.name : "";
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocationId || !dropoffLocationId || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime || !selectedAgeId) {
      toast.error("Please complete all fields", {
        description: "All fields are required to search for vehicles."
      });
      return;
    }
    
    console.log("Search form submitted with values:", {
      pickupLocationId,
      pickupLocationName: getLocationNameById(pickupLocationId),
      dropoffLocationId,
      dropoffLocationName: getLocationNameById(dropoffLocationId),
      pickupDate: pickupDate?.toISOString().split('T')[0],
      pickupTime,
      dropoffDate: dropoffDate?.toISOString().split('T')[0],
      dropoffTime,
      ageId: selectedAgeId,
      categoryId: selectedCategoryId
    });
    
    // Build search parameters
    const searchParams = new URLSearchParams();
    searchParams.append("pickupLocationId", pickupLocationId);
    searchParams.append("pickupLocationName", getLocationNameById(pickupLocationId));
    searchParams.append("dropoffLocationId", dropoffLocationId);
    searchParams.append("dropoffLocationName", getLocationNameById(dropoffLocationId));
    searchParams.append("pickupDate", pickupDate?.toISOString().split('T')[0] || "");
    searchParams.append("pickupTime", pickupTime);
    searchParams.append("dropoffDate", dropoffDate?.toISOString().split('T')[0] || "");
    searchParams.append("dropoffTime", dropoffTime);
    searchParams.append("ageId", selectedAgeId);
    searchParams.append("categoryId", selectedCategoryId);
    
    // Navigate to vehicles page
    navigate(`/vehicles?${searchParams.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Find Your Perfect Vehicle</CardTitle>
        <CardDescription>Search our fleet for your next adventure</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationSelect
              id="pickup-location"
              label="Pick-up Location"
              locations={locations as RCMLocation[]}
              value={pickupLocationId}
              onValueChange={setPickupLocationId}
              isLoading={isLocationsLoading}
              hasError={!!locationsError}
            />
            
            <div className="space-y-4">
              <LocationSelect
                id="dropoff-location"
                label="Drop-off Location"
                locations={locations as RCMLocation[]}
                value={dropoffLocationId}
                onValueChange={setDropoffLocationId}
                isLoading={isLocationsLoading}
                hasError={!!locationsError}
                disabled={sameLocation}
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="same-location"
                  checked={sameLocation}
                  onChange={(e) => setSameLocation(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="same-location" className="text-sm text-gray-700">
                  Return to same location
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateSelect
                id="pickup-date"
                label="Pick-up Date"
                date={pickupDate}
                onDateChange={setPickupDate}
                disableDate={(date) => disablePastDates(date, pickupLocationId, locationDetails)}
              />
              
              <TimeSelect
                id="pickup-time"
                label="Pick-up Time"
                time={pickupTime}
                onTimeChange={setPickupTime}
                timeOptions={pickupTimeOptions}
                isLoading={isOfficeHoursLoading || isLocationDetailsLoading}
                disabled={!pickupLocationId || !pickupDate}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateSelect
                id="dropoff-date"
                label="Drop-off Date"
                date={dropoffDate}
                onDateChange={setDropoffDate}
                disableDate={(date) => {
                  // Disable past dates and dates before pickup date
                  if (pickupDate && date < pickupDate) return true;
                  return disablePastDates(date, dropoffLocationId, locationDetails);
                }}
              />
              
              <TimeSelect
                id="dropoff-time"
                label="Drop-off Time"
                time={dropoffTime}
                onTimeChange={setDropoffTime}
                timeOptions={dropoffTimeOptions}
                isLoading={isOfficeHoursLoading || isLocationDetailsLoading}
                disabled={!dropoffLocationId || !dropoffDate}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OptionSelect
              id="driver-age"
              label="Driver Age"
              options={driverAges.map(age => ({
                id: String(age.id),
                name: `${age.driverage} years`
              }))}
              value={selectedAgeId}
              onValueChange={setSelectedAgeId}
              isLoading={isDriverAgesLoading}
              placeholder="Select driver age"
            />
            
            <OptionSelect
              id="vehicle-category"
              label="Vehicle Type (Optional)"
              options={vehicleCategories.map(cat => ({
                id: String(cat.id),
                name: cat.vehiclecategorytype
              }))}
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              isLoading={isCategoriesLoading}
              allOptionId="0"
              allOptionLabel="All Categories"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" size="lg">
            Search Vehicles
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SearchForm;
