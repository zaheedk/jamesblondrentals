
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isBefore, isAfter, parseISO, isValid, getDay, addHours, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { toast } from "sonner";
import { RCMLocationDetail, RCMOfficeTime } from "@/lib/api/rcm-api-types";

// Default location ID - Kelston
const DEFAULT_LOCATION_ID = "625";

// Map JavaScript day numbers (0-6, Sunday-Saturday) to API dayofweek (1-7, Monday-Sunday)
const JS_TO_API_DAY_MAP: { [key: number]: number } = {
  0: 7, // Sunday -> 7
  1: 1, // Monday -> 1
  2: 2, // Tuesday -> 2
  3: 3, // Wednesday -> 3
  4: 4, // Thursday -> 4
  5: 5, // Friday -> 5
  6: 6, // Saturday -> 6
};

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
    data: locations = [], 
    isLoading: isLoadingLocations, 
    error: locationError 
  } = useLocations();
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
    data: locationDetails = [] 
  } = useLocationDetails();
  
  // Determine if there was a location error
  const isLocationError = !!locationError;
  
  // Initialize API on component mount - now without settings dialog
  useEffect(() => {
    initializeApi({
      apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
      apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
      apiUrl: "https://apis.rentalcarmanager.com/booking/v3.2",
      useMockData: false
    }).catch(error => {
      console.error('Failed to initialize API:', error);
      toast.error("Error connecting to booking system", {
        description: "Please try again later"
      });
    });
  }, []);

  // Set default dates and location when component loads
  useEffect(() => {
    if (!pickupDate) {
      // Get today's date as default
      const today = new Date();
      setPickupDate(today);
      
      // Default dropoff date is 3 days after pickup
      const defaultDropoff = addDays(today, 3);
      setDropoffDate(defaultDropoff);
    }
    
    // Default to Kelston location
    setPickupLocation(DEFAULT_LOCATION_ID);
    setDropoffLocation(DEFAULT_LOCATION_ID);
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
          const hoursRequired = requiredNoticeDays * 24;
          newMinPickupDate = addHours(new Date(), hoursRequired);
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
  }, [pickupLocation, locationDetails]);

  // Update minimum dropoff date when pickup date changes
  useEffect(() => {
    if (pickupDate) {
      setMinDropoffDate(pickupDate);
      
      // If current dropoff date is before new pickup date, update it
      if (dropoffDate && isBefore(dropoffDate, pickupDate)) {
        setDropoffDate(addDays(pickupDate, 1));
      }
    }
  }, [pickupDate]);

  // Update time options when location or date changes
  useEffect(() => {
    if (pickupLocation && pickupDate && isValid(pickupDate)) {
      const options = getLocationTimeOptions(pickupLocation, pickupDate, 'pickup');
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
  }, [pickupLocation, pickupDate]);

  // Update dropoff time options when location/date changes
  useEffect(() => {
    const selectedLocation = sameLocation ? pickupLocation : dropoffLocation;
    
    if (selectedLocation && dropoffDate && isValid(dropoffDate)) {
      const options = getLocationTimeOptions(selectedLocation, dropoffDate, 'dropoff');
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
  }, [dropoffLocation, dropoffDate, sameLocation, pickupLocation]);

  // Helper function to get office hours for a specific location and day
  const getLocationTimeOptions = (locationId: string, date: Date, type: 'pickup' | 'dropoff'): string[] => {
    if (!date || !isValid(date) || !locationId) return [];

    const jsDay = getDay(date);
    const apiDayOfWeek = JS_TO_API_DAY_MAP[jsDay];
    
    console.log(`Finding hours for location ${locationId} on day ${apiDayOfWeek} (JS day: ${jsDay})`);
    
    // Get the required notice period for this location
    const selectedLocationDetail = locationDetails.find(
      loc => String(loc.id) === String(locationId)
    );
    
    const requiredNoticeDays = selectedLocationDetail?.noticerequired_numberofdays || 0;
    
    // Find office hours for the selected location and day
    const locationOfficeHours = officeHours.filter(
      time => {
        const locIdMatches = String(time.locationid) === String(locationId);
        const dayMatches = time.dayofweek === apiDayOfWeek;
        return locIdMatches && dayMatches;
      }
    );
    
    if (locationOfficeHours.length === 0) {
      console.log(`No office hours found for location ${locationId} on day ${apiDayOfWeek}`);
      
      // Try to get default hours from location details as fallback
      const locationDetail = locationDetails.find(loc => String(loc.id) === String(locationId));
      if (locationDetail) {
        console.log(`Using default hours for ${locationId}: ${locationDetail.officeopeningtime} - ${locationDetail.officeclosingtime}`);
        return generateTimeOptions(locationDetail.officeopeningtime, locationDetail.officeclosingtime, date, requiredNoticeDays);
      }
      
      // Return default office hours if none found
      return generateTimeOptions("09:00", "17:00", date, requiredNoticeDays);
    }
    
    // Get the first match
    const hours = locationOfficeHours[0];
    
    let startTime, endTime;
    
    if (type === 'pickup') {
      startTime = hours.startpickup || hours.openingtime;
      endTime = hours.endpickup || hours.closingtime;
    } else { // dropoff
      startTime = hours.startdropoff || hours.openingtime;
      endTime = hours.enddropoff || hours.closingtime;
    }
    
    console.log(`Office hours for ${type} at location ${locationId} on day ${apiDayOfWeek}:`, 
      `${startTime} - ${endTime}`);
    
    // Handle special case for 24-hour locations
    if (startTime === "00:00" && (endTime === "00:00" || endTime === "24:00")) {
      return generate24HourOptions(date, requiredNoticeDays);
    }
    
    return generateTimeOptions(startTime, endTime, date, requiredNoticeDays);
  };

  // Generate time options for 24-hour operations
  const generate24HourOptions = (date: Date, requiredNoticeDays: number): string[] => {
    const options: string[] = [];
    const now = new Date();
    const isToday = isSameDay(date, now);
    const isTomorrow = isSameDay(date, addDays(now, 1));
    
    // For notice periods, calculate the earliest allowed time
    let earliestAllowedTime: Date;
    if (requiredNoticeDays > 0) {
      // For 1 day notice, ensure it's at least 24 hours from now
      earliestAllowedTime = addHours(now, requiredNoticeDays * 24);
    } else {
      earliestAllowedTime = new Date(now);
    }
    
    // Generate times in 30-minute intervals for a full 24 hours
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        // Create a test date for this time slot
        const testDate = new Date(date);
        testDate.setHours(hour, minute, 0, 0);
        
        // Skip times in the past if the date is today
        if (isToday && (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes()))) {
          continue;
        }
        
        // Skip times that don't provide enough notice
        if ((isToday || (isTomorrow && requiredNoticeDays >= 1)) && 
            isBefore(testDate, earliestAllowedTime)) {
          continue;
        }
        
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    
    return options;
  };

  // Generate time options in 30-minute intervals between open and close times
  const generateTimeOptions = (openTime: string, closeTime: string, date: Date, requiredNoticeDays: number): string[] => {
    if (!openTime || !closeTime) return [];
    
    const options: string[] = [];
    const now = new Date();
    const isToday = isSameDay(date, now);
    const isTomorrow = isSameDay(date, addDays(now, 1));
    
    // For notice periods, calculate the earliest allowed time
    let earliestAllowedTime: Date;
    if (requiredNoticeDays > 0) {
      // For 1 day notice, ensure it's at least 24 hours from now
      earliestAllowedTime = addHours(now, requiredNoticeDays * 24);
    } else {
      earliestAllowedTime = new Date(now);
    }
    
    // Parse times (expecting format like "09:00" or "17:30")
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    // Handle special case for midnight closing (00:00)
    const closingInMinutes = closeTime === "00:00" ? 24 * 60 : closeHour * 60 + closeMinute;
    
    // Convert to minutes for easier calculation
    let startInMinutes = openHour * 60 + openMinute;
    
    // Check if date is today and adjust startInMinutes to current time (rounded up to next 30 min)
    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      // Round up to next 30-min slot
      const roundedCurrentMinutes = Math.ceil((currentMinutes + 1) / 30) * 30;
      startInMinutes = Math.max(startInMinutes, roundedCurrentMinutes);
    }
    
    // Generate times in 30-minute intervals
    for (let minutes = startInMinutes; minutes < closingInMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60) % 24;
      const minute = minutes % 60;
      
      // Create a test date for this time slot
      const testDate = new Date(date);
      testDate.setHours(hour, minute, 0, 0);
      
      // Skip times that don't provide enough notice
      if ((isToday || (isTomorrow && requiredNoticeDays >= 1)) && 
          isBefore(testDate, earliestAllowedTime)) {
        continue;
      }
      
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      options.push(`${formattedHour}:${formattedMinute}`);
    }
    
    return options;
  };

  // Helper functions to get display text for dropdowns
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => String(loc.id) === locationId);
    return location ? location.name : "";
  };

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
        const minAllowedDate = addHours(new Date(), hoursRequired);
        
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

  // Helper function to combine date and time into ISO string
  const combineDateTime = (date: Date | undefined, time: string): string => {
    if (!date || !isValid(date) || !time) {
      return new Date().toISOString();
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    
    return newDate.toISOString();
  };

  // Helper to disable past dates and respect notice period requirements
  const disablePastDates = (date: Date) => {
    // Always disable dates in the past
    if (isBefore(date, new Date())) {
      return true;
    }
    
    // If a pickup location is selected, respect its notice requirement
    if (pickupLocation) {
      const selectedLocation = locationDetails.find(
        loc => String(loc.id) === pickupLocation
      );
      
      if (selectedLocation) {
        const requiredNoticeDays = selectedLocation?.noticerequired_numberofdays || 0;
        
        if (requiredNoticeDays > 0) {
          // Calculate the minimum allowed date based on required notice hours
          const hoursRequired = requiredNoticeDays * 24;
          const minAllowedDate = addHours(new Date(), hoursRequired);
          
          // Disable dates that don't provide enough notice
          if (isBefore(date, minAllowedDate)) {
            return true;
          }
        }
      }
    }
    
    return false;
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
              <div className="space-y-2">
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Select value={pickupLocation} onValueChange={(value) => {
                  console.log("Setting pickup location to:", value);
                  setPickupLocation(value);
                  if (sameLocation) {
                    setDropoffLocation(value);
                  }
                }}>
                  <SelectTrigger id="pickup-location" className={isLoadingLocations ? "animate-pulse" : ""}>
                    <SelectValue>
                      {pickupLocation ? getLocationName(pickupLocation) : 
                        isLoadingLocations ? "Loading locations..." : 
                        isLocationError ? "Choose location" : "Select pickup location"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isLocationError && <p className="text-xs text-amber-600">Using fallback locations - couldn't connect to server</p>}
              </div>

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
                <Select 
                  value={sameLocation ? pickupLocation : dropoffLocation}
                  onValueChange={(value) => {
                    console.log("Setting dropoff location to:", value);
                    setDropoffLocation(value);
                  }}
                  disabled={sameLocation}
                >
                  <SelectTrigger id="dropoff-location" className={isLoadingLocations ? "animate-pulse" : ""}>
                    <SelectValue>
                      {(sameLocation ? pickupLocation : dropoffLocation) ? 
                        getLocationName(sameLocation ? pickupLocation : dropoffLocation) : 
                        isLoadingLocations ? "Loading locations..." : 
                        isLocationError ? "Choose location" : "Select dropoff location"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup Date */}
              <div className="space-y-2">
                <Label htmlFor="pickup-date">Pickup Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="pickup-date"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      initialFocus
                      disabled={disablePastDates}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Pickup Time */}
              <div className="space-y-2">
                <Label htmlFor="pickup-time">Pickup Time</Label>
                <Select 
                  value={pickupTime} 
                  onValueChange={setPickupTime}
                  disabled={!pickupLocation || !pickupDate || pickupTimeOptions.length === 0}
                >
                  <SelectTrigger id="pickup-time">
                    <SelectValue placeholder={
                      isLoadingOfficeHours ? "Loading times..." :
                      !pickupLocation ? "Select location first" :
                      !pickupDate ? "Select date first" :
                      pickupTimeOptions.length === 0 ? "No times available" :
                      "Select pickup time"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupTimeOptions.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dropoff Date */}
              <div className="space-y-2">
                <Label htmlFor="dropoff-date">Dropoff Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="dropoff-date"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dropoffDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dropoffDate ? format(dropoffDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={dropoffDate}
                      onSelect={setDropoffDate}
                      initialFocus
                      disabled={(date) => isBefore(date, minDropoffDate)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Dropoff Time */}
              <div className="space-y-2">
                <Label htmlFor="dropoff-time">Dropoff Time</Label>
                <Select 
                  value={dropoffTime} 
                  onValueChange={setDropoffTime}
                  disabled={
                    !dropoffDate || 
                    !(sameLocation ? pickupLocation : dropoffLocation) || 
                    dropoffTimeOptions.length === 0
                  }
                >
                  <SelectTrigger id="dropoff-time">
                    <SelectValue placeholder={
                      isLoadingOfficeHours ? "Loading times..." :
                      !(sameLocation ? pickupLocation : dropoffLocation) ? "Select location first" :
                      !dropoffDate ? "Select date first" :
                      dropoffTimeOptions.length === 0 ? "No times available" :
                      "Select dropoff time"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {dropoffTimeOptions.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Driver Age */}
              <div className="space-y-2">
                <Label htmlFor="driver-age">Driver Age</Label>
                <Select value={age} onValueChange={(value) => {
                  console.log("Setting age to:", value);
                  setAge(value);
                }}>
                  <SelectTrigger id="driver-age" className={isLoadingAges ? "animate-pulse" : ""}>
                    <SelectValue>
                      {age ? getDriverAgeName(age) : "Select age"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {driverAges.map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.driverage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Vehicle Category */}
              <div className="space-y-2">
                <Label htmlFor="car-category">Vehicle Category</Label>
                <Select value={carCategory} onValueChange={(value) => {
                  console.log("Setting car category to:", value);
                  setCarCategory(value);
                }}>
                  <SelectTrigger id="car-category" className={isLoadingCategories ? "animate-pulse" : ""}>
                    <SelectValue>
                      {carCategory ? getCategoryName(carCategory) : "All Categories"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {carCategories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.vehiclecategorytype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
