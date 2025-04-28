import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, isBefore, format } from "date-fns";
import { toast } from "sonner";
import { useRcmApi } from "@/hooks/use-rcm-api";

import { LocationSelect } from "./form-components/LocationSelect";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { 
  disablePastDates, 
  getLocationTimeOptions, 
  combineDateTime,
  getDefaultPickupDate,
  getDefaultDropoffDate
} from "./form-components/DateTimeUtils";

// Update location ID if needed - we'll find Kelston location dynamically instead
const DEFAULT_LOCATION_ID = ""; // Empty to force finding Kelston

const SearchForm = () => {
  const navigate = useNavigate();
  
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [sameLocation, setSameLocation] = useState(true);
  const [age, setAge] = useState("");
  const [carCategory, setCarCategory] = useState("0");
  const [promoCode, setPromoCode] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessingDates, setIsProcessingDates] = useState(false);

  const [minDropoffDate, setMinDropoffDate] = useState<Date>(addDays(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);
  const [pickupTimeOptions, setPickupTimeOptions] = useState<string[]>([]);
  const [dropoffTimeOptions, setDropoffTimeOptions] = useState<string[]>([]);
  const [minPickupDate, setMinPickupDate] = useState<Date>(new Date());

  const { 
    initializeApi,
    useLocations, 
    useDriverAges,
    useVehicleCategories,
    useOfficeHours,
    useLocationDetails
  } = useRcmApi();
  
  const { 
    data: locationsData = [], 
    isLoading: isLoadingLocations, 
    error: locationError 
  } = useLocations();
  
  const locations = locationsData.map(loc => ({
    ...loc,
    id: String(loc.id)
  }));
  
  const { 
    data: driverAges = [], 
    isLoading: isLoadingAges 
  } = useDriverAges();
  const { 
    data: carCategories = [], 
    isLoading: isLoadingCategories 
  } = useVehicleCategories();
  const { 
    data: officeHours = [], 
    isLoading: isLoadingOfficeHours 
  } = useOfficeHours();
  const { 
    data: locationDetailsData = [] 
  } = useLocationDetails();
  
  const locationDetails = locationDetailsData.map(loc => ({
    ...loc,
    id: String(loc.id)
  }));
  
  const isLocationError = !!locationError;
  
  useEffect(() => {
    initializeApi({
      apiKey: import.meta.env.VITE_RCM_API_KEY,
      apiSecret: import.meta.env.VITE_RCM_API_SECRET,
      apiUrl: "/api/rcm/booking/v3.2",
      useMockData: false
    }).catch(error => {
      console.error('Failed to initialize API:', error);
      toast.error("Error connecting to booking system", {
        description: "Please check your internet connection or try again later"
      });
    });
  }, [initializeApi]);

  // Set up initial values once data is loaded
  useEffect(() => {
    if (isInitialized || isProcessingDates) return;

    const shouldInitialize = 
      locations.length > 0 && 
      driverAges.length > 0 && 
      !isLoadingLocations && 
      !isLoadingAges;

    if (shouldInitialize) {
      setIsProcessingDates(true);

      try {
        // Set default location
        if (!pickupLocation && locations.length > 0) {
          // Look for Kelston first
          const kelstonLocation = locations.find(loc => 
            loc.name.toLowerCase().includes('kelston')
          );
          
          const defaultLocation = kelstonLocation || 
                                  locations.find(loc => String(loc.id) === DEFAULT_LOCATION_ID) || 
                                  locations[0];
          
          console.log("Setting default pickup location:", defaultLocation.name);
          setPickupLocation(String(defaultLocation.id));
          if (sameLocation) {
            setDropoffLocation(String(defaultLocation.id));
          }
        }

        // Set default driver age
        if (!age && driverAges.length > 0) {
          const defaultAge = driverAges.find(a => a.isdefault) || driverAges[0];
          setAge(String(defaultAge.id));
        }

        // Set default dates only once
        if (!pickupDate) {
          const defaultPickup = getDefaultPickupDate();
          console.log('Default pickup date:', defaultPickup);
          setPickupDate(defaultPickup);
          
          const defaultDropoff = getDefaultDropoffDate(defaultPickup);
          console.log('Default dropoff date:', defaultDropoff);
          setDropoffDate(defaultDropoff);
        }

        setIsInitialized(true);
      } finally {
        setIsProcessingDates(false);
      }
    }
  }, [
    locations, 
    driverAges, 
    isLoadingLocations, 
    isLoadingAges, 
    pickupLocation, 
    pickupDate, 
    isInitialized,
    isProcessingDates,
    sameLocation,
    age
  ]);

  // Update pickup time options whenever pickup location or date changes
  useEffect(() => {
    if (isProcessingDates || !isInitialized) return;
    if (!pickupLocation || !pickupDate) return;

    console.log(`Fetching pickup time options for location ${pickupLocation} on ${pickupDate.toISOString()}`);
    
    const options = getLocationTimeOptions(pickupLocation, pickupDate, 'pickup', officeHours, locationDetails);
    console.log(`Got ${options.length} pickup time options`);
    setPickupTimeOptions(options);
    
    if (options.length > 0 && !pickupTime) {
      console.log(`Setting default pickup time to ${options[0]}`);
      setPickupTime(options[0]);
    } else if (options.length > 0 && pickupTime && !options.includes(pickupTime)) {
      console.log(`Current pickup time ${pickupTime} not available, updating to ${options[0]}`);
      setPickupTime(options[0]);
    }
  }, [pickupLocation, pickupDate, officeHours, locationDetails, isInitialized, isProcessingDates, pickupTime]);

  // Update dropoff time options whenever dropoff details change
  useEffect(() => {
    if (isProcessingDates || !isInitialized) return;

    const selectedLocation = sameLocation ? pickupLocation : dropoffLocation;
    
    if (!selectedLocation || !dropoffDate) return;
    
    const options = getLocationTimeOptions(selectedLocation, dropoffDate, 'dropoff', officeHours, locationDetails);
    setDropoffTimeOptions(options);
    
    if (options.length > 0 && !dropoffTime) {
      console.log(`Setting default dropoff time to ${options[0]}`);
      setDropoffTime(options[0]);
    } else if (options.length > 0 && dropoffTime && !options.includes(dropoffTime)) {
      console.log(`Current dropoff time ${dropoffTime} not available, updating to ${options[0]}`);
      setDropoffTime(options[0]);
    }
  }, [dropoffLocation, dropoffDate, sameLocation, pickupLocation, officeHours, locationDetails, isInitialized, isProcessingDates, dropoffTime]);

  // Handle pickup date changes and update dropoff date accordingly
  const handlePickupDateChange = useCallback((date: Date | undefined) => {
    if (!date) return;
    
    setPickupDate(date);
    
    // Always set dropoff date to pickup date + 1 day
    const newDropoffDate = getDefaultDropoffDate(date);
    setDropoffDate(newDropoffDate);
  }, []);

  const getDefaultAgeId = () => {
    if (!driverAges?.length) return "";
    const defaultAge = driverAges.find(a => a.isdefault) || driverAges[0];
    return defaultAge ? String(defaultAge.id) : "";
  };

  const getDriverAgeName = (ageId: string) => {
    const ageObj = driverAges?.find(a => String(a.id) === ageId);
    return ageObj ? ageObj.driverage : "";
  };

  const getCategoryName = (categoryId: string) => {
    if (categoryId === "0") return "All Categories";
    
    const category = carCategories.find(c => String(c.id) === categoryId);
    return category ? category.vehiclecategorytype : "";
  };

  const formatDateForApi = (date: Date): string => {
    return format(date, 'dd/MM/yyyy');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation) {
      toast.error("Please select a pickup location");
      return;
    }
    
    if (!pickupDate || !dropoffDate) {
      toast.error("Please select both pickup and drop-off dates");
      return;
    }
    
    if (!pickupTime || !dropoffTime) {
      toast.error("Please select both pickup and drop-off times");
      return;
    }
    
    const formattedPickupDate = formatDateForApi(pickupDate!);
    const formattedDropoffDate = formatDateForApi(dropoffDate!);
    
    const ageParam = age || getDefaultAgeId();
    
    const searchParams = new URLSearchParams({
      pickupLocation,
      dropoffLocation: dropoffLocation || pickupLocation,
      pickupDate: formattedPickupDate,
      dropoffDate: formattedDropoffDate,
      pickupTime,
      dropoffTime,
      age: ageParam,
      carCategory,
      ...(promoCode && { promoCode })
    });
    
    console.log("Navigating to vehicles with params:", searchParams.toString());
    navigate(`/vehicles?${searchParams.toString()}`);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Find Your Vehicle</h3>
        </div>

        <form onSubmit={handleSearch}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationSelect 
                id="pickup-location"
                label="Pickup Location"
                locations={locations}
                value={pickupLocation}
                onValueChange={(value) => {
                  setPickupLocation(value);
                  if (sameLocation) {
                    setDropoffLocation(value);
                  }
                }}
                isLoading={isLoadingLocations}
                hasError={isLocationError}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dropoff-location">Dropoff Location</Label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={sameLocation}
                      onChange={() => setSameLocation(!sameLocation)}
                    />
                    <span className="text-sm">Same as pickup</span>
                  </label>
                </div>
                <LocationSelect
                  id="dropoff-location"
                  label=""
                  locations={locations}
                  value={sameLocation ? pickupLocation : dropoffLocation}
                  onValueChange={setDropoffLocation}
                  isLoading={isLoadingLocations}
                  hasError={isLocationError}
                  disabled={sameLocation}
                />
              </div>

              <DateSelect
                id="pickup-date"
                label="Pickup Date"
                date={pickupDate}
                onDateChange={handlePickupDateChange}
                disableDate={(date) => disablePastDates(date, pickupLocation, locationDetails)}
                locationId={pickupLocation}
              />

              <TimeSelect
                id="pickup-time"
                label="Pickup Time"
                time={pickupTime}
                onTimeChange={setPickupTime}
                timeOptions={pickupTimeOptions}
                isLoading={isLoadingOfficeHours}
                disabled={!pickupLocation || !pickupDate || pickupTimeOptions.length === 0}
                placeholder={!pickupLocation ? "Select location first" : !pickupDate ? "Select date first" : undefined}
              />

              <DateSelect
                id="dropoff-date"
                label="Dropoff Date"
                date={dropoffDate}
                onDateChange={setDropoffDate}
                disableDate={(date) => isBefore(date, minDropoffDate)}
                locationId={sameLocation ? pickupLocation : dropoffLocation}
              />

              <TimeSelect
                id="dropoff-time"
                label="Dropoff Time"
                time={dropoffTime}
                onTimeChange={setDropoffTime}
                timeOptions={dropoffTimeOptions}
                isLoading={isLoadingOfficeHours}
                disabled={!dropoffDate || !(sameLocation ? pickupLocation : dropoffLocation) || dropoffTimeOptions.length === 0}
                placeholder={!(sameLocation ? pickupLocation : dropoffLocation) ? "Select location first" : !dropoffDate ? "Select date first" : undefined}
              />
              
              <OptionSelect
                id="driver-age"
                label="Driver Age"
                value={age}
                onValueChange={setAge}
                options={driverAges.map(age => ({ id: String(age.id), name: age.driverage }))}
                getOptionName={getDriverAgeName}
                isLoading={isLoadingAges}
                placeholder="Select age"
              />
              
              <OptionSelect
                id="car-category"
                label="Vehicle Category"
                value={carCategory}
                onValueChange={setCarCategory}
                options={carCategories.map(category => ({ id: String(category.id), name: category.vehiclecategorytype }))}
                getOptionName={getCategoryName}
                isLoading={isLoadingCategories}
                placeholder="All Categories"
                defaultValue="All Categories"
                allOptionId="0"
                allOptionLabel="All Categories"
              />
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="promo-code">Promo Code (Optional)</Label>
                <Input 
                  id="promo-code" 
                  type="text" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code" 
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !pickupLocation || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime}
            >
              {isLoading ? "Searching..." : "Search Available Cars"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
