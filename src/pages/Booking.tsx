
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { vehicles, locations } from "@/lib/mock-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Vehicle } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sameLocation, setSameLocation] = useState(true);
  const [insuranceOption, setInsuranceOption] = useState("basic");
  const [additionalDrivers, setAdditionalDrivers] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [gps, setGps] = useState(false);

  const vehicleId = searchParams.get("vehicleId");
  const queryPickupLocation = searchParams.get("pickupLocation");
  const queryDropoffLocation = searchParams.get("dropoffLocation");
  const queryPickupDate = searchParams.get("pickupDate");
  const queryDropoffDate = searchParams.get("dropoffDate");

  useEffect(() => {
    // Set pickup/dropoff from URL if available
    if (queryPickupLocation) setPickupLocation(queryPickupLocation);
    if (queryDropoffLocation) setDropoffLocation(queryDropoffLocation);
    if (queryPickupDate) setPickupDate(new Date(queryPickupDate));
    if (queryDropoffDate) setDropoffDate(new Date(queryDropoffDate));
    
    // Load vehicle if ID is provided
    if (vehicleId) {
      const foundVehicle = vehicles.find(v => v.id === Number(vehicleId));
      if (foundVehicle) {
        setVehicle(foundVehicle);
      }
    }
  }, [vehicleId, queryPickupLocation, queryDropoffLocation, queryPickupDate, queryDropoffDate]);

  const calculateDuration = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateSubtotal = () => {
    if (!vehicle) return 0;
    return vehicle.price * calculateDuration();
  };

  const calculateExtras = () => {
    let totalExtras = 0;
    if (additionalDrivers) totalExtras += 10 * calculateDuration();
    if (childSeat) totalExtras += 8 * calculateDuration();
    if (gps) totalExtras += 5 * calculateDuration();
    
    // Insurance costs
    switch (insuranceOption) {
      case "premium":
        totalExtras += 15 * calculateDuration();
        break;
      case "full":
        totalExtras += 25 * calculateDuration();
        break;
      default:
        // Basic insurance included
        break;
    }
    
    return totalExtras;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateExtras();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupDate || !dropoffDate || !pickupLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required rental details",
        variant: "destructive",
      });
      return;
    }
    
    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required personal details",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit to the backend/API
    toast({
      title: "Booking Submitted!",
      description: "Your booking request has been received. Confirmation will be sent to your email.",
      variant: "default",
    });
    
    // Navigate to a thank you page or back to home
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="text-primary inline-flex items-center hover:underline"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Rental Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Rental Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-location">Pickup Location*</Label>
                      <Select 
                        value={pickupLocation} 
                        onValueChange={setPickupLocation}
                        required
                      >
                        <SelectTrigger id="pickup-location">
                          <SelectValue placeholder="Select pickup location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dropoff-location">Dropoff Location*</Label>
                        <label className="flex items-center">
                          <Checkbox
                            checked={sameLocation}
                            onCheckedChange={(checked) => {
                              setSameLocation(!!checked);
                              if (checked) setDropoffLocation(pickupLocation);
                            }}
                            className="mr-2 h-4 w-4"
                          />
                          <span className="text-sm">Same as pickup</span>
                        </label>
                      </div>
                      <Select 
                        value={sameLocation ? pickupLocation : dropoffLocation}
                        onValueChange={setDropoffLocation}
                        disabled={sameLocation}
                        required
                      >
                        <SelectTrigger id="dropoff-location">
                          <SelectValue placeholder="Select dropoff location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pickup-date">Pickup Date*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="pickup-date"
                            variant="outline"
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
                            disabled={(date) => date < new Date()}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dropoff-date">Dropoff Date*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dropoff-date"
                            variant="outline"
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
                            disabled={(date) => date < (pickupDate || new Date())}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Personal Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name*</Label>
                      <Input
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name*</Label>
                      <Input
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Additional Options */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Additional Options</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Insurance Options</h3>
                      <RadioGroup value={insuranceOption} onValueChange={setInsuranceOption}>
                        <div className="flex items-start space-x-2 mb-3">
                          <RadioGroupItem value="basic" id="basic" className="mt-1" />
                          <div>
                            <Label htmlFor="basic" className="font-medium">Basic Coverage</Label>
                            <p className="text-sm text-gray-600">
                              Includes liability coverage and collision damage waiver with deductible
                              <span className="block font-medium text-gray-800">Included in base price</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2 mb-3">
                          <RadioGroupItem value="premium" id="premium" className="mt-1" />
                          <div>
                            <Label htmlFor="premium" className="font-medium">Premium Coverage</Label>
                            <p className="text-sm text-gray-600">
                              Includes basic coverage plus reduced deductible and glass protection
                              <span className="block font-medium text-gray-800">$15/day</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="full" id="full" className="mt-1" />
                          <div>
                            <Label htmlFor="full" className="font-medium">Full Coverage</Label>
                            <p className="text-sm text-gray-600">
                              Comprehensive coverage with zero deductible, roadside assistance, and personal effects protection
                              <span className="block font-medium text-gray-800">$25/day</span>
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Extras</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="additional-driver" 
                            checked={additionalDrivers}
                            onCheckedChange={(checked) => setAdditionalDrivers(!!checked)}
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor="additional-driver" className="font-medium">Additional Driver</Label>
                            <p className="text-sm text-gray-600">Add another driver to your rental contract</p>
                            <p className="text-sm font-medium">$10/day</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="child-seat" 
                            checked={childSeat}
                            onCheckedChange={(checked) => setChildSeat(!!checked)}
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor="child-seat" className="font-medium">Child Seat</Label>
                            <p className="text-sm text-gray-600">Safety-approved child seat for your convenience</p>
                            <p className="text-sm font-medium">$8/day</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="gps" 
                            checked={gps}
                            onCheckedChange={(checked) => setGps(!!checked)}
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor="gps" className="font-medium">GPS Navigation</Label>
                            <p className="text-sm text-gray-600">Never get lost with premium GPS</p>
                            <p className="text-sm font-medium">$5/day</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  {vehicle ? (
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-16 rounded-md overflow-hidden bg-gray-100">
                          {vehicle.images[0] && (
                            <img
                              src={vehicle.images[0]}
                              alt={vehicle.model}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-600">{vehicle.year} · {vehicle.type}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Duration:</span>
                          <span>{calculateDuration()} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rental rate:</span>
                          <span>${vehicle.price}/day</span>
                        </div>
                        {pickupLocation && (
                          <div className="flex justify-between text-sm">
                            <span>Pickup location:</span>
                            <span>{pickupLocation}</span>
                          </div>
                        )}
                        {dropoffLocation && !sameLocation && (
                          <div className="flex justify-between text-sm">
                            <span>Dropoff location:</span>
                            <span>{dropoffLocation}</span>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-semibold">${calculateSubtotal()}</span>
                        </div>
                        
                        {calculateExtras() > 0 && (
                          <div className="flex justify-between">
                            <span>Extras & Insurance:</span>
                            <span className="font-semibold">${calculateExtras()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-primary">${calculateTotal()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handleSubmit}
                        disabled={!pickupLocation || !pickupDate || !dropoffDate}
                      >
                        Complete Booking
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No vehicle selected</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        asChild
                      >
                        <Link to="/vehicles">Browse Vehicles</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
