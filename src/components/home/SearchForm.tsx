
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, isBefore, format } from "date-fns";
import { toast } from "sonner";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { rcmApi } from "@/lib/api/rcm-api";

import { LocationSelect } from "./form-components/LocationSelect";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { 
  disablePastDates, 
  getLocationTimeOptions, 
  combineDateTime 
} from "./form-components/DateTimeUtils";

const DEFAULT_LOCATION_ID = "625";

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
  
  const [minDropoffDate, setMinDropoffDate] = useState<Date>(addDays(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);
  const [pickupTimeOptions, setPickupTimeOptions] = useState<string[]>([]);
  const [dropoffTimeOptions, setDropoffTimeOptions] = useState<string[]>([]);
  const [minPickupDate, setMinPickupDate] = useState<Date>(new Date());
  const [showApiDetails, setShowApiDetails] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [step1Response, setStep1Response] = useState<any>(null);

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

  useEffect(() => {
    console.log('Setting default dates');
    const today = new Date();
    
    if (!pickupDate) {
      setPickupDate(today);
      
      const defaultDropoff = addDays(today, 3);
      setDropoffDate(defaultDropoff);
      console.log('Default dates set', { today, defaultDropoff });
    }
  }, []);

  useEffect(() => {
    if (pickupLocation && locationDetails.length > 0) {
      const selectedLocationDetail = locationDetails.find(
        loc => String(loc.id) === pickupLocation
      );
      
      if (selectedLocationDetail) {
        const requiredNoticeDays = selectedLocationDetail.noticerequired_numberofdays || 0;
        
        let newMinPickupDate = new Date();
        
        if (requiredNoticeDays > 0) {
          newMinPickupDate = addDays(new Date(), requiredNoticeDays);
          console.log(`Location ${pickupLocation} requires ${requiredNoticeDays} days notice. Min pickup date set to ${newMinPickupDate.toISOString()}`);
        }
        
        setMinPickupDate(newMinPickupDate);
        
        if (pickupDate && isBefore(pickupDate, newMinPickupDate)) {
          const updatedDate = new Date(newMinPickupDate);
          console.log(`Current pickup date ${pickupDate.toISOString()} is before min date ${newMinPickupDate.toISOString()}, updating to ${updatedDate.toISOString()}`);
          setPickupDate(updatedDate);
          
          const newMinDropoffDate = addDays(updatedDate, 1);
          if (dropoffDate && isBefore(dropoffDate, newMinDropoffDate)) {
            setDropoffDate(newMinDropoffDate);
          }
        }
      }
    }
  }, [pickupLocation, locationDetails, pickupDate, dropoffDate]);

  useEffect(() => {
    if (pickupDate) {
      setMinDropoffDate(pickupDate);
      
      if (dropoffDate && isBefore(dropoffDate, pickupDate)) {
        setDropoffDate(addDays(pickupDate, 1));
      }
    }
  }, [pickupDate, dropoffDate]);

  useEffect(() => {
    if (pickupLocation && pickupDate) {
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
      } else if (options.length === 0) {
        console.log(`No pickup times available for location ${pickupLocation} on ${pickupDate.toISOString()}, trying next day`);
        const nextDay = addDays(pickupDate, 1);
        console.log(`Setting pickup date to next day: ${nextDay.toISOString()}`);
        setPickupDate(nextDay);
        
        if (dropoffDate && !isBefore(dropoffDate, nextDay)) {
          const newDropoffDate = addDays(nextDay, 1);
          console.log(`Updating dropoff date to: ${newDropoffDate.toISOString()}`);
          setDropoffDate(newDropoffDate);
        }
        setPickupTime("");
      }
    }
  }, [pickupLocation, pickupDate, officeHours, locationDetails, pickupTime, dropoffDate]);

  useEffect(() => {
    const selectedLocation = sameLocation ? pickupLocation : dropoffLocation;
    
    if (selectedLocation && dropoffDate) {
      const options = getLocationTimeOptions(selectedLocation, dropoffDate, 'dropoff', officeHours, locationDetails);
      setDropoffTimeOptions(options);
      
      if (options.length > 0 && !dropoffTime) {
        console.log(`Setting default dropoff time to ${options[0]}`);
        setDropoffTime(options[0]);
      } else if (options.length > 0 && dropoffTime && !options.includes(dropoffTime)) {
        console.log(`Current dropoff time ${dropoffTime} not available, updating to ${options[0]}`);
        setDropoffTime(options[0]);
      } else if (options.length === 0) {
        console.log(`No dropoff times available for location ${selectedLocation} on ${dropoffDate.toISOString()}, clearing dropoff time`);
        setDropoffTime("");
      }
    }
  }, [dropoffLocation, dropoffDate, sameLocation, pickupLocation, officeHours, locationDetails, dropoffTime]);

  useEffect(() => {
    if (rcmApi) {
      const lastRequestDetails = rcmApi.getLastRequestDetails();
      setApiResponse(lastRequestDetails);
    }
  }, [rcmApi]);

  useEffect(() => {
    const fetchStep1Response = async () => {
      try {
        const response = await rcmApi.getStep1();
        setStep1Response(response);
      } catch (error) {
        console.error('Error fetching Step1 response:', error);
      }
    };

    fetchStep1Response();
  }, []);

  const getDefaultAgeId = () => {
    if (!driverAges?.length) return "";
    const defaultAge = driverAges.find(a => a.isdefault) || driverAges[0];
    return defaultAge ? String(defaultAge.id) : "";
  };

  useEffect(() => {
    if (driverAges?.length && !age) {
      setAge(getDefaultAgeId());
    }
  }, [driverAges]);

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
          <Button 
            variant="outline" 
            onClick={() => setShowApiDetails(!showApiDetails)}
          >
            {showApiDetails ? "Hide API Details" : "Show API Details"}
          </Button>
        </div>

        {showApiDetails && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Step1 API Response:</h3>
                <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {JSON.stringify(step1Response, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                onDateChange={setPickupDate}
                disableDate={(date) => disablePastDates(date, pickupLocation, locationDetails)}
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
