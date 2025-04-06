
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, isBefore } from "date-fns";
import { toast } from "sonner";
import { useRcmApi } from "@/hooks/use-rcm-api";

import { LocationSelect } from "./form-components/LocationSelect";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { 
  disablePastDates, 
  getLocationTimeOptions, 
  combineDateTime 
} from "./form-components/DateTimeUtils";

// Default location ID - Kelston
const DEFAULT_LOCATION_ID = "625";

const SearchForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [pickupLocation, setPickupLocation] = useState(DEFAULT_LOCATION_ID);
  const [dropoffLocation, setDropoffLocation] = useState(DEFAULT_LOCATION_ID);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [sameLocation, setSameLocation] = useState(true);
  const [age, setAge] = useState("");
  const [carCategory, setCarCategory] = useState("");
  const [promoCode, setPromoCode] = useState("");
  
  // Derived state
  const [minDropoffDate, setMinDropoffDate] = useState<Date>(addDays(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);
  const [pickupTimeOptions, setPickupTimeOptions] = useState<string[]>([]);
  const [dropoffTimeOptions, setDropoffTimeOptions] = useState<string[]>([]);
  const [minPickupDate, setMinPickupDate] = useState<Date>(new Date());

  // Use the RCM API to fetch data
  const { 
    initializeApi,
    useLocations, 
    useDriverAges,
    useVehicleCategories,
    useOfficeHours,
    useLocationDetails
  } = useRcmApi();
  
  // Get data from hooks
  const { 
    data: locationsData = [], 
    isLoading: isLoadingLocations, 
    error: locationError 
  } = useLocations();
  
  // Convert any numeric IDs to strings to match RCMLocation type
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
  
  // Convert any numeric IDs to strings for locationDetails as well
  const locationDetails = locationDetailsData.map(loc => ({
    ...loc,
    id: String(loc.id)
  }));
  
  // Determine if there was a location error
  const isLocationError = !!locationError;
  
  // Initialize API on component mount - now without settings dialog
  useEffect(() => {
    initializeApi({
      apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
      apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
      apiUrl: "https://apis.rentalcarmanager.com/booking/v3.2",
      useMockData: true // Set to true to ensure we get data while fixing API issues
    }).catch(error => {
      console.error('Failed to initialize API:', error);
      toast.error("Error connecting to booking system", {
        description: "Please try again later"
      });
    });
  }, [initializeApi]);

  // Set default dates and location when component loads
  useEffect(() => {
    console.log('Setting default locations and dates');
    // Get today's date as default
    const today = new Date();
    
    // Only set dates if they haven't been set already
    if (!pickupDate) {
      setPickupDate(today);
      
      // Default dropoff date is 3 days after pickup
      const defaultDropoff = addDays(today, 3);
      setDropoffDate(defaultDropoff);
      console.log('Default dates set', { today, defaultDropoff });
    }
    
    // Force set the locations to Kelston on initial render
    setPickupLocation(DEFAULT_LOCATION_ID);
    setDropoffLocation(DEFAULT_LOCATION_ID);
    
    // Log for debugging
    console.log(`Setting default location to: ${DEFAULT_LOCATION_ID}`);
  }, []);

  // Update minimum pickup date when pickup location changes or when location details load
  useEffect(() => {
    if (pickupLocation && locationDetails.length > 0) {
      const selectedLocationDetail = locationDetails.find(
        loc => String(loc.id) === pickupLocation
      );
      
      if (selectedLocationDetail) {
        // Get the required notice period in days
        const requiredNoticeDays = selectedLocationDetail.noticerequired_numberofdays || 0;
        
        // Calculate the minimum pickup date based on notice period
        let newMinPickupDate = new Date();
        
        if (requiredNoticeDays > 0) {
          // If notice is required, add the required number of days
          newMinPickupDate = addDays(new Date(), requiredNoticeDays);
        }
        
        setMinPickupDate(newMinPickupDate);
        
        // If current pickup date is before minimum, update it
        if (pickupDate && isBefore(pickupDate, newMinPickupDate)) {
          setPickupDate(new Date(newMinPickupDate));
          
          // Also update dropoff date if needed
          const newMinDropoffDate = addDays(newMinPickupDate, 1);
          if (dropoffDate && isBefore(dropoffDate, newMinDropoffDate)) {
            setDropoffDate(newMinDropoffDate);
          }
        }
        
        console.log(`Location ${pickupLocation} requires ${requiredNoticeDays} days notice`);
      }
    }
  }, [pickupLocation, locationDetails, pickupDate, dropoffDate]);

  // Update minimum dropoff date when pickup date changes
  useEffect(() => {
    if (pickupDate) {
      setMinDropoffDate(pickupDate);
      
      // If current dropoff date is before new pickup date, update it
      if (dropoffDate && isBefore(dropoffDate, pickupDate)) {
        setDropoffDate(addDays(pickupDate, 1));
      }
    }
  }, [pickupDate, dropoffDate]);

  // Update time options when location or date changes
  useEffect(() => {
    if (pickupLocation && pickupDate) {
      const options = getLocationTimeOptions(pickupLocation, pickupDate, 'pickup', officeHours, locationDetails);
      setPickupTimeOptions(options);
      
      // Set default pickup time to first available time
      if (options.length > 0 && !pickupTime) {
        setPickupTime(options[0]);
      } else if (options.length > 0 && pickupTime && !options.includes(pickupTime)) {
        // If current time is not in new options, set to first available
        setPickupTime(options[0]);
      } else if (options.length === 0) {
        setPickupTime("");
      }
    }
  }, [pickupLocation, pickupDate, officeHours, locationDetails, pickupTime]);

  // Update dropoff time options when location/date changes
  useEffect(() => {
    const selectedLocation = sameLocation ? pickupLocation : dropoffLocation;
    
    if (selectedLocation && dropoffDate) {
      const options = getLocationTimeOptions(selectedLocation, dropoffDate, 'dropoff', officeHours, locationDetails);
      setDropoffTimeOptions(options);
      
      // Set default dropoff time to first available time
      if (options.length > 0 && !dropoffTime) {
        setDropoffTime(options[0]);
      } else if (options.length > 0 && dropoffTime && !options.includes(dropoffTime)) {
        // If current time is not in new options, set to first available
        setDropoffTime(options[0]);
      } else if (options.length === 0) {
        setDropoffTime("");
      }
    }
  }, [dropoffLocation, dropoffDate, sameLocation, pickupLocation, officeHours, locationDetails, dropoffTime]);

  // Helper functions to get display text for dropdowns
  const getDriverAgeName = (ageId: string) => {
    const driverAge = driverAges.find(a => String(a.id) === ageId);
    return driverAge ? driverAge.driverage : "";
  };

  const getCategoryName = (categoryId: string) => {
    const category = carCategories.find(c => String(c.id) === categoryId);
    return category ? category.vehiclecategorytype : "";
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!pickupLocation) {
      toast.error("Please select a pickup location");
      return;
    }
    
    if (!dropoffLocation && !sameLocation) {
      toast.error("Please select a dropoff location");
      return;
    }
    
    if (!pickupDate) {
      toast.error("Please select a pickup date");
      return;
    }
    
    if (!dropoffDate) {
      toast.error("Please select a dropoff date");
      return;
    }
    
    if (!pickupTime) {
      toast.error("Please select a pickup time");
      return;
    }
    
    if (!dropoffTime) {
      toast.error("Please select a dropoff time");
      return;
    }
    
    if (isBefore(dropoffDate, pickupDate)) {
      toast.error("Dropoff date must be after pickup date");
      return;
    }
    
    // Ensure the selected times respect the required notice period
    const selectedLocation = locationDetails.find(
      loc => String(loc.id) === pickupLocation
    );
    
    if (selectedLocation) {
      const requiredNoticeDays = selectedLocation.noticerequired_numberofdays || 0;
      
      if (requiredNoticeDays > 0) {
        const hoursRequired = requiredNoticeDays * 24;
        const minAllowedDate = new Date();
        minAllowedDate.setDate(minAllowedDate.getDate() + requiredNoticeDays);
        
        const pickupDateTime = combineDateTime(pickupDate, pickupTime);
        const pickupDateObj = new Date(pickupDateTime);
        
        if (isBefore(pickupDateObj, minAllowedDate)) {
          toast.error(`This location requires ${requiredNoticeDays} day(s) advance notice for bookings`);
          return;
        }
      }
    }
    
    setIsLoading(true);
    
    // Create full ISO date strings with the selected dates and times
    const pickupDateTime = combineDateTime(pickupDate, pickupTime);
    const dropoffDateTime = combineDateTime(dropoffDate, dropoffTime);
    
    // Build search params
    const searchParams = new URLSearchParams({
      pickupLocation,
      dropoffLocation: sameLocation ? pickupLocation : dropoffLocation,
      pickupDate: pickupDateTime,
      dropoffDate: dropoffDateTime,
      ...(age && { age }),
      ...(carCategory && { carCategory }),
      ...(promoCode && { promoCode })
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate(`/vehicles?${searchParams.toString()}`);
    }, 500);
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Find Your Vehicle</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Location */}
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

              {/* Dropoff Location */}
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

              {/* Pickup Date */}
              <DateSelect
                id="pickup-date"
                label="Pickup Date"
                date={pickupDate}
                onDateChange={setPickupDate}
                disableDate={(date) => disablePastDates(date, pickupLocation, locationDetails)}
              />

              {/* Pickup Time */}
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

              {/* Dropoff Date */}
              <DateSelect
                id="dropoff-date"
                label="Dropoff Date"
                date={dropoffDate}
                onDateChange={setDropoffDate}
                disableDate={(date) => isBefore(date, minDropoffDate)}
              />

              {/* Dropoff Time */}
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
              
              {/* Driver Age */}
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
              
              {/* Vehicle Category */}
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
              />
              
              {/* Promo Code */}
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
