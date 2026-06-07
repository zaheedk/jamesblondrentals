import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, isBefore, format, parse } from "date-fns";
import { toast } from "sonner";
import { useRcmApi } from "@/hooks/use-rcm-api";
import Cookies from "js-cookie";

import { LocationSelect } from "./form-components/LocationSelect";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { 
  disablePastDates, 
  getLocationTimeOptions, 
  combineDateTime,
  getDefaultPickupDate,
  getDefaultDropoffDate,
  getNowInNZ
} from "./form-components/DateTimeUtils";

// Update location ID if needed - we'll find Kelston location dynamically instead
const DEFAULT_LOCATION_ID = ""; // Empty to force finding Kelston

interface SearchFormProps {
  defaultPickupLocation?: string;
  defaultDropoffLocation?: string;
  defaultCarCategory?: string;
  defaultLocation?: string;
}

const SearchForm = ({ 
  defaultPickupLocation,
  defaultDropoffLocation,
  defaultCarCategory = "0",
  defaultLocation
}: SearchFormProps = {}) => {
  const navigate = useNavigate();
  
  // Check cookies immediately on component mount
  const savedPickupLocationId = Cookies.get('pickupLocation');
  const savedDropoffLocationId = Cookies.get('dropoffLocation');
  const savedSameLocation = Cookies.get('sameLocation');
  console.log("🍪 SearchForm mounted - cookies found:", { 
    pickup: savedPickupLocationId, 
    dropoff: savedDropoffLocationId,
    sameLocation: savedSameLocation
  });
  
  const [pickupLocation, setPickupLocation] = useState(savedPickupLocationId || "");
  const [dropoffLocation, setDropoffLocation] = useState(savedDropoffLocationId || "");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [sameLocation, setSameLocation] = useState(savedSameLocation === 'true' || savedSameLocation === undefined);
  const [age, setAge] = useState("");
  const [carCategory, setCarCategory] = useState(defaultCarCategory);

  // Update category when defaultCarCategory prop changes
  useEffect(() => {
    if (defaultCarCategory && defaultCarCategory !== "0") {
      setCarCategory(defaultCarCategory);
    }
  }, [defaultCarCategory]);
  const [campaignCode, setCampaignCode] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessingDates, setIsProcessingDates] = useState(false);

  const [minDropoffDate, setMinDropoffDate] = useState<Date>(getNowInNZ()); // Allow same day
  const [isLoading, setIsLoading] = useState(false);
  const [pickupTimeOptions, setPickupTimeOptions] = useState<string[]>([]);
  const [dropoffTimeOptions, setDropoffTimeOptions] = useState<string[]>([]);
  const [minPickupDate, setMinPickupDate] = useState<Date>(getNowInNZ());

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
          console.log("Available locations:", locations.map(loc => ({id: loc.id, name: loc.name})));
          
          let defaultLocation;
          let defaultDropoffLoc;
          
          // Priority 1: Check cookies for saved locations
          const savedPickupLocationId = Cookies.get('pickupLocation');
          const savedDropoffLocationId = Cookies.get('dropoffLocation');
          
          console.log("🔍 Checking cookies during initialization:", { 
            pickup: savedPickupLocationId, 
            dropoff: savedDropoffLocationId,
            availableLocations: locations.length 
          });
          
          if (savedPickupLocationId) {
            defaultLocation = locations.find(loc => String(loc.id) === savedPickupLocationId);
            if (defaultLocation) {
              console.log("✓ Using saved pickup location from cookie:", defaultLocation.name);
            } else {
              console.log("✗ Cookie pickup location not found in locations list");
            }
          }
          
          if (savedDropoffLocationId) {
            defaultDropoffLoc = locations.find(loc => String(loc.id) === savedDropoffLocationId);
            if (defaultDropoffLoc) {
              console.log("✓ Using saved dropoff location from cookie:", defaultDropoffLoc.name);
            } else {
              console.log("✗ Cookie dropoff location not found in locations list");
            }
          }
          
          // Priority 2: Use prop-provided default location if available
          if (!defaultLocation && defaultPickupLocation) {
            defaultLocation = locations.find(loc => String(loc.id) === defaultPickupLocation);
            console.log("Using prop default pickup location:", defaultLocation?.name);
          }
          
          // Priority 3: Fallback to West Auckland if no prop provided
          if (!defaultLocation) {
            const westAucklandLocation = locations.find(loc => 
              loc.name.toLowerCase().includes('west auckland')
            );
            
            console.log("Found West Auckland location:", westAucklandLocation);
            
            defaultLocation = westAucklandLocation || 
                             locations.find(loc => String(loc.id) === DEFAULT_LOCATION_ID) || 
                             locations[0];
          }
          
          console.log("Setting default pickup location:", defaultLocation.name);
          setPickupLocation(String(defaultLocation.id));
          
          // Set dropoff location
          if (sameLocation) {
            const dropoffLocationId = defaultDropoffLoc ? String(defaultDropoffLoc.id) : 
                                     (defaultDropoffLocation || String(defaultLocation.id));
            setDropoffLocation(dropoffLocationId);
          } else if (defaultDropoffLoc) {
            setDropoffLocation(String(defaultDropoffLoc.id));
          }
        }

        // Set default driver age
        if (!age && driverAges.length > 0) {
          const defaultAge = driverAges.find(a => a.isdefault) || driverAges[0];
          setAge(String(defaultAge.id));
        }

        // Set default dates only once, now using NZ time-aware functions
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

    // If same day rental, validate that dropoff time is after pickup time
    if (pickupDate && dropoffDate && pickupDate.toDateString() === dropoffDate.toDateString() && pickupTime && dropoffTime) {
      validateSameDayTimes();
    }
  }, [dropoffLocation, dropoffDate, sameLocation, pickupLocation, officeHours, locationDetails, isInitialized, isProcessingDates, dropoffTime, pickupTime, pickupDate]);

  // Function to validate that dropoff time is after pickup time for same-day rentals
  const validateSameDayTimes = () => {
    if (!pickupTime || !dropoffTime || !pickupDate || !dropoffDate) return;
    
    // Only validate if it's the same day
    if (pickupDate.toDateString() !== dropoffDate.toDateString()) return;
    
    // Parse times to compare
    const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
    const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
    
    // Convert to minutes for easy comparison
    const pickupTotalMinutes = pickupHour * 60 + pickupMinute;
    const dropoffTotalMinutes = dropoffHour * 60 + dropoffMinute;
    
    // Allow as little as 15 minutes between pickup and dropoff
    const minimumMinutesDifference = 15;
    
    if (dropoffTotalMinutes < pickupTotalMinutes + minimumMinutesDifference) {
      // Find first available time at least minimumMinutesDifference after pickup time
      const availableTime = dropoffTimeOptions.find(time => {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute;
        return totalMinutes >= pickupTotalMinutes + minimumMinutesDifference;
      });
      
      if (availableTime) {
        console.log(`Adjusting dropoff time from ${dropoffTime} to ${availableTime} to ensure minimum ${minimumMinutesDifference} minute difference`);
        setDropoffTime(availableTime);
      } else {
        // If no valid time available, suggest next day
        console.log("No suitable dropoff time available that meets minimum time difference");
        toast.error(`Dropoff must be at least ${minimumMinutesDifference} minutes after pickup`, {
          description: "Please select a later time or date"
        });
        
        const nextDay = new Date(dropoffDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setDropoffDate(nextDay);
      }
    }
  };

  // Handle pickup date changes and update dropoff date accordingly
  const handlePickupDateChange = useCallback((date: Date | undefined) => {
    if (!date) return;
    
    console.log("Pickup date changed to:", date);
    setPickupDate(date);
    
    // We need to set minDropoffDate, but we need to create a new Date object
    // to avoid reference issues while still allowing same-day selection
    const newMinDate = new Date(date.getTime());
    setMinDropoffDate(newMinDate);
    
    // Only update dropoff date if it's before the new pickup date
    if (dropoffDate && isBefore(dropoffDate, date)) {
      console.log("Dropoff date is before new pickup date, updating to same day");
      setDropoffDate(new Date(date.getTime())); // Create a new Date instance to avoid reference issues
    }
  }, [dropoffDate]);

  // Handle pickup time change
  const handlePickupTimeChange = (time: string) => {
    setPickupTime(time);
    
    // If same day rental, validate that dropoff time is after pickup time
    if (pickupDate && dropoffDate && pickupDate.toDateString() === dropoffDate.toDateString()) {
      setTimeout(() => validateSameDayTimes(), 0);
    }
  };

  // Helper function to check if a location is Wellington CBD
  const isWellingtonCBD = (locationId: string) => {
    if (!locationId || !locationDetails.length) return false;
    return locationDetails.some(loc => 
      String(loc.id) === locationId && 
      loc.location?.toLowerCase().includes('wellington') && 
      loc.location?.toLowerCase().includes('cbd')
    );
  };

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

    // Additional validation for date and time combinations
    if (pickupDate && dropoffDate && pickupDate.toDateString() === dropoffDate.toDateString()) {
      // For same-day rentals, validate times with minimum 15 minutes difference
      const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
      const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
      
      const pickupTotalMinutes = pickupHour * 60 + pickupMinute;
      const dropoffTotalMinutes = dropoffHour * 60 + dropoffMinute;
      
      if (dropoffTotalMinutes < pickupTotalMinutes + 15) {
        toast.error("Drop-off time must be at least 15 minutes after pickup time");
        return;
      }
    } else if (pickupDate && dropoffDate && isBefore(dropoffDate, pickupDate)) {
      toast.error("Drop-off date cannot be before pickup date");
      return;
    }
    
    const formattedPickupDate = formatDateForApi(pickupDate!);
    const formattedDropoffDate = formatDateForApi(dropoffDate!);
    
    const ageParam = age || getDefaultAgeId();
    
    // Build search params object with proper promo code handling
    const searchParamsObj: Record<string, string> = {
      pickupLocation,
      dropoffLocation: dropoffLocation || pickupLocation,
      pickupDate: formattedPickupDate,
      dropoffDate: formattedDropoffDate,
      pickupTime,
      dropoffTime,
      age: ageParam,
      carCategory
    };

    // Only add campaign code if it's not empty
    if (campaignCode && campaignCode.trim()) {
      searchParamsObj.campaignCode = campaignCode.trim();
      console.log("Including campaign code in search:", campaignCode.trim());
    }
    
    const searchParams = new URLSearchParams(searchParamsObj);
    
    console.log("Navigating to vehicles with params:", searchParams.toString());
    navigate(`/vehicles?${searchParams.toString()}`);
  };

  return (
    <Card className="shadow-2xl border border-white/40 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
      <CardContent className="p-6 md:p-10">
        <div className="mb-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight italic">Find Your Vehicle</h3>
          <div className="h-1 w-12 bg-sky-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSearch}>
          <div className="space-y-6">
            {/* Pick-up Location */}
            <div className="space-y-2">
              <Label htmlFor="pickup-location" className="text-sm font-medium">Pick-up Location</Label>
              <LocationSelect 
                id="pickup-location"
                label=""
                locations={locations}
                value={pickupLocation}
                onValueChange={(value) => {
                  console.log("📍 Setting pickup location:", value);
                  setPickupLocation(value);
                  Cookies.set('pickupLocation', value, { expires: 365 });
                  console.log("🍪 Saved pickup cookie:", Cookies.get('pickupLocation'));
                  if (sameLocation) {
                    setDropoffLocation(value);
                    Cookies.set('dropoffLocation', value, { expires: 365 });
                    console.log("🍪 Saved dropoff cookie (same):", Cookies.get('dropoffLocation'));
                  }
                }}
                isLoading={isLoadingLocations}
                hasError={isLocationError}
              />
            </div>

            {/* Pick-up Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                <DateSelect
                  id="pickup-date"
                  label="Pick up Date"
                  date={pickupDate}
                  onDateChange={handlePickupDateChange}
                  disableDate={(date) => disablePastDates(date, pickupLocation, locationDetails)}
                  locationId={pickupLocation}
                  locationDetails={locationDetails}
                />
                </div>
                <div className="space-y-2">
                <TimeSelect
                  id="pickup-time"
                  label="Pick up Time"
                  time={pickupTime}
                  onTimeChange={handlePickupTimeChange}
                  timeOptions={pickupTimeOptions}
                  isLoading={isLoadingOfficeHours}
                  disabled={!pickupLocation || !pickupDate || pickupTimeOptions.length === 0}
                  placeholder={!pickupLocation ? "Select location first" : !pickupDate ? "Select date first" : undefined}
                />
                </div>
              </div>

              <div className="space-y-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                <DateSelect
                  id="dropoff-date"
                  label="Drop off Date"
                  date={dropoffDate}
                  onDateChange={setDropoffDate}
                  disableDate={(date) => {
                    if (!pickupDate) return true;
                    const dateWithoutTime = new Date(date);
                    dateWithoutTime.setHours(0, 0, 0, 0);
                    const pickupWithoutTime = new Date(pickupDate);
                    pickupWithoutTime.setHours(0, 0, 0, 0);
                    return dateWithoutTime < pickupWithoutTime;
                  }}
                  locationId={sameLocation ? pickupLocation : dropoffLocation}
                  locationDetails={locationDetails}
                  allowSameDay={true}
                  defaultMonth={pickupDate}
                />
                </div>
                <div className="space-y-2">
                <TimeSelect
                  id="dropoff-time"
                  label="Drop off Time"
                  time={dropoffTime}
                  onTimeChange={setDropoffTime}
                  timeOptions={dropoffTimeOptions}
                  isLoading={isLoadingOfficeHours}
                  disabled={!dropoffDate || !(sameLocation ? pickupLocation : dropoffLocation) || dropoffTimeOptions.length === 0}
                  placeholder={!(sameLocation ? pickupLocation : dropoffLocation) ? "Select location first" : !dropoffDate ? "Select date first" : undefined}
                />
                </div>
              </div>
            </div>

            {/* Return Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dropoff-location" className="text-sm font-medium">Return Location</Label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={sameLocation}
                    onChange={() => {
                      const newSameLocation = !sameLocation;
                      setSameLocation(newSameLocation);
                      Cookies.set('sameLocation', String(newSameLocation), { expires: 365 });
                      console.log("🍪 Saved sameLocation cookie:", newSameLocation);
                      
                      // If unchecking, restore dropoff location from cookie
                      if (!newSameLocation) {
                        const savedDropoff = Cookies.get('dropoffLocation');
                        if (savedDropoff) {
                          console.log("🔄 Restoring dropoff location from cookie:", savedDropoff);
                          setDropoffLocation(savedDropoff);
                        }
                      } else {
                        // If checking, sync dropoff with pickup
                        setDropoffLocation(pickupLocation);
                        Cookies.set('dropoffLocation', pickupLocation, { expires: 365 });
                      }
                    }}
                  />
                  <span className="text-sm">Same as Pickup</span>
                </label>
              </div>
              <LocationSelect
                id="dropoff-location"
                label=""
                locations={locations}
                value={sameLocation ? pickupLocation : dropoffLocation}
                onValueChange={(value) => {
                  console.log("📍 Setting dropoff location:", value);
                  setDropoffLocation(value);
                  Cookies.set('dropoffLocation', value, { expires: 365 });
                  console.log("🍪 Saved dropoff cookie:", Cookies.get('dropoffLocation'));
                }}
                isLoading={isLoadingLocations}
                hasError={isLocationError}
                disabled={sameLocation}
              />
            </div>

            {/* Age, Category and Promo Code */}
            <div className="grid grid-cols-1 gap-4">
              {/* Age and Category Row for Mobile */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <OptionSelect
                    id="driver-age"
                    label="Age"
                    value={age}
                    onValueChange={setAge}
                    options={driverAges.map(age => ({ id: String(age.id), name: age.driverage }))}
                    getOptionName={getDriverAgeName}
                    isLoading={isLoadingAges}
                    placeholder="Select age"
                  />
                </div>
                
                <div className="space-y-2">
                  <OptionSelect
                    id="car-category"
                    label="Category"
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
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="space-y-2">
                <Label htmlFor="campaign-code" className="text-sm font-medium">Promo Code</Label>
                <Input 
                  id="campaign-code" 
                  type="text" 
                  value={campaignCode} 
                  onChange={(e) => setCampaignCode(e.target.value)}
                  placeholder="Enter campaign code" 
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-auto py-5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-lg rounded-2xl shadow-lg shadow-yellow-400/30 active:scale-[0.98] transition-all focus-visible:ring-4 focus-visible:ring-yellow-400/40"
              disabled={isLoading || !pickupLocation || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime}
            >
              {isLoading ? "Searching..." : "Search Available Vehicles →"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
