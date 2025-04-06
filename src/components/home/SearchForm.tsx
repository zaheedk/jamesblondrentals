
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isBefore, isAfter, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { toast } from "sonner";

const SearchForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [sameLocation, setSameLocation] = useState(true);
  const [age, setAge] = useState("");
  const [carCategory, setCarCategory] = useState("");
  const [promoCode, setPromoCode] = useState("");
  
  // Derived state
  const [minDropoffDate, setMinDropoffDate] = useState<Date>(addDays(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);

  // Use the RCM API to fetch data
  const { 
    useLocations, 
    useDriverAges,
    useVehicleCategories
  } = useRcmApi();
  
  const { 
    data: locations = [], 
    isLoading: isLoadingLocations,
    isError: isLocationError 
  } = useLocations();
  
  const {
    data: driverAges = [],
    isLoading: isLoadingAges
  } = useDriverAges();
  
  const {
    data: carCategories = [],
    isLoading: isLoadingCategories
  } = useVehicleCategories();

  // Set default dates when component mounts
  useEffect(() => {
    // Set default pickup date to tomorrow
    const tomorrow = addDays(new Date(), 1);
    setPickupDate(tomorrow);
    
    // Set default dropoff date to 3 days after pickup
    const defaultDropoff = addDays(tomorrow, 3);
    setDropoffDate(defaultDropoff);
  }, []);

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
    
    if (isBefore(dropoffDate, pickupDate)) {
      toast.error("Dropoff date must be after pickup date");
      return;
    }
    
    setIsLoading(true);
    
    // Build search params
    const searchParams = new URLSearchParams({
      pickupLocation,
      dropoffLocation: sameLocation ? pickupLocation : dropoffLocation,
      pickupDate: pickupDate.toISOString(),
      dropoffDate: dropoffDate.toISOString(),
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
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Select value={pickupLocation} onValueChange={(value) => {
                  setPickupLocation(value);
                  if (sameLocation) {
                    setDropoffLocation(value);
                  }
                }}>
                  <SelectTrigger id="pickup-location" className={isLoadingLocations ? "animate-pulse" : ""}>
                    <SelectValue placeholder={isLoadingLocations ? "Loading locations..." : 
                      isLocationError ? "Choose location" : "Select pickup location"} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
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
                  onValueChange={setDropoffLocation}
                  disabled={sameLocation}
                >
                  <SelectTrigger id="dropoff-location" className={isLoadingLocations ? "animate-pulse" : ""}>
                    <SelectValue placeholder={isLoadingLocations ? "Loading locations..." : 
                      isLocationError ? "Choose location" : "Select dropoff location"} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
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
                      disabled={(date) => isBefore(date, new Date())}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
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
              
              {/* Driver Age */}
              <div className="space-y-2">
                <Label htmlFor="driver-age">Driver Age</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger id="driver-age" className={isLoadingAges ? "animate-pulse" : ""}>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {driverAges.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.driverage === "26" ? "26+" : option.driverage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Vehicle Category */}
              <div className="space-y-2">
                <Label htmlFor="car-category">Vehicle Category</Label>
                <Select value={carCategory} onValueChange={setCarCategory}>
                  <SelectTrigger id="car-category" className={isLoadingCategories ? "animate-pulse" : ""}>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {carCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
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
              disabled={isLoading || !pickupLocation || !pickupDate || !dropoffDate}
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
