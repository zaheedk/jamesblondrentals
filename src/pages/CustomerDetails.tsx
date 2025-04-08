
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateSelect } from "@/components/home/form-components/DateSelect";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Basic booking details from URL params
  const vehicleId = searchParams.get("vehicleId");
  const vehicleName = searchParams.get("vehicleName");
  const pickupLocationId = searchParams.get("pickupLocationId");
  const pickupLocationName = searchParams.get("pickupLocationName");
  const dropoffLocationId = searchParams.get("dropoffLocationId");
  const dropoffLocationName = searchParams.get("dropoffLocationName");
  const pickupDateStr = searchParams.get("pickupDate");
  const pickupTime = searchParams.get("pickupTime");
  const dropoffDateStr = searchParams.get("dropoffDate");
  const dropoffTime = searchParams.get("dropoffTime");
  const insuranceId = searchParams.get("insuranceId");
  const insuranceName = searchParams.get("insuranceName");
  const insurancePrice = searchParams.get("insurancePrice");
  const totalPrice = searchParams.get("totalPrice");
  
  // Parse dates from string
  const pickupDate = pickupDateStr ? new Date(pickupDateStr) : null;
  const dropoffDate = dropoffDateStr ? new Date(dropoffDateStr) : null;
  
  // Customer details state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseIssueCountry, setLicenseIssueCountry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState<Date | undefined>(undefined);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [foundUs, setFoundUs] = useState("");
  const [areaOfUse, setAreaOfUse] = useState("");
  const [transmission, setTransmission] = useState("0"); // Default to "No Preference"
  const [collectionPoint, setCollectionPoint] = useState("");
  const [comments, setComments] = useState("");
  const [travellerCount, setTravellerCount] = useState("");
  const [flightNo, setFlightNo] = useState("");
  
  // Mock data for dropdowns
  const countryOptions = [
    { id: "AU", name: "Australia" },
    { id: "NZ", name: "New Zealand" },
    { id: "US", name: "United States" },
    { id: "GB", name: "United Kingdom" },
    { id: "CA", name: "Canada" }
  ];
  
  const foundUsOptions = [
    { id: "1", name: "Search Engine" },
    { id: "2", name: "Social Media" },
    { id: "3", name: "Friend Recommendation" },
    { id: "4", name: "Travel Agency" },
    { id: "5", name: "Other" }
  ];
  
  const areaOfUseOptions = [
    { id: "1", name: "Local City" },
    { id: "2", name: "Interstate" },
    { id: "3", name: "Rural Areas" },
    { id: "4", name: "National Parks" },
    { id: "5", name: "Other" }
  ];

  // Check if required parameters are available
  useEffect(() => {
    if (!vehicleId || !pickupLocationId || !dropoffLocationId || !pickupDateStr || !dropoffDateStr) {
      setError("Missing required booking parameters");
      toast.error("Missing required booking parameters", {
        description: "Please return to the vehicle search page and try again."
      });
    }
  }, [vehicleId, pickupLocationId, dropoffLocationId, pickupDateStr, dropoffDateStr]);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!firstName || !lastName || !email) {
      toast.error("Missing required fields", {
        description: "Please fill in your name and email to get a quote."
      });
      return;
    }
    
    // Submit quote logic would go here
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Quote requested successfully", {
        description: "We'll email you the quote details shortly."
      });
      setIsLoading(false);
      // Navigate to confirmation page
      navigate("/booking-confirmation?type=quote");
    }, 1500);
  };
  
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // More comprehensive validation for booking
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields."
      });
      return;
    }
    
    // Submit booking logic would go here
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Booking submitted successfully", {
        description: "We'll email you the booking confirmation shortly."
      });
      setIsLoading(false);
      // Navigate to confirmation page
      navigate("/booking-confirmation?type=booking");
    }, 1500);
  };
  
  // If there's an error, display it
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Customer Details</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate("/vehicles")}>
          Return to Vehicle Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Details</h1>
      
      {/* Basic booking summary */}
      <div className="bg-white rounded-md p-4 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Vehicle:</span> {vehicleName}</p>
            <p><span className="font-medium">Pickup:</span> {pickupLocationName}</p>
            <p><span className="font-medium">Pickup Date:</span> {pickupDate ? format(pickupDate, 'MMM dd, yyyy') : 'N/A'} at {pickupTime}</p>
            <p><span className="font-medium">Insurance:</span> {insuranceName || 'Standard'}</p>
          </div>
          <div>
            <p><span className="font-medium">Total Price:</span> ${totalPrice}</p>
            <p><span className="font-medium">Dropoff:</span> {dropoffLocationName}</p>
            <p><span className="font-medium">Dropoff Date:</span> {dropoffDate ? format(dropoffDate, 'MMM dd, yyyy') : 'N/A'} at {dropoffTime}</p>
          </div>
        </div>
      </div>
      
      <form>
        {/* Essential Customer Details */}
        <div className="bg-white rounded-md p-4 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Required Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="Enter your first name" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travellerCount">Number of Travellers</Label>
              <Select value={travellerCount} onValueChange={setTravellerCount}>
                <SelectTrigger id="travellerCount">
                  <SelectValue placeholder="Select number of travellers" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 6 ? 'or more' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="flightNo">Flight Number (if applicable)</Label>
              <Input 
                id="flightNo" 
                value={flightNo} 
                onChange={(e) => setFlightNo(e.target.value)} 
                placeholder="Enter flight number if arriving by air"
              />
            </div>
          </div>
        </div>
        
        {/* Additional Details (Optional) */}
        <div className="bg-white rounded-md p-4 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Optional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <DateSelect
                id="dob"
                label=""
                date={dateOfBirth}
                onDateChange={setDateOfBirth}
                disableDate={(date) => {
                  const today = new Date();
                  const minAge = new Date();
                  minAge.setFullYear(today.getFullYear() - 18);
                  return date > minAge;
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNo">License Number</Label>
              <Input 
                id="licenseNo" 
                value={licenseNo} 
                onChange={(e) => setLicenseNo(e.target.value)} 
                placeholder="Enter your license number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseIssueCountry">License Issue Country</Label>
              <Select value={licenseIssueCountry} onValueChange={setLicenseIssueCountry}>
                <SelectTrigger id="licenseIssueCountry">
                  <SelectValue placeholder="Select country of license issue" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(country => (
                    <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">License Expiry Date</Label>
              <DateSelect
                id="licenseExpiry"
                label=""
                date={licenseExpiry}
                onDateChange={setLicenseExpiry}
                disableDate={(date) => {
                  const today = new Date();
                  return date < today;
                }}
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Address Information */}
          <h3 className="text-lg font-semibold mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Enter your street address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                placeholder="Enter your city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input 
                id="state" 
                value={state} 
                onChange={(e) => setState(e.target.value)} 
                placeholder="Enter your state or province"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode/ZIP</Label>
              <Input 
                id="postcode" 
                value={postcode} 
                onChange={(e) => setPostcode(e.target.value)} 
                placeholder="Enter your postcode or ZIP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(country => (
                    <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Additional Rental Information */}
          <h3 className="text-lg font-semibold mb-4">Additional Rental Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="foundUs">How did you find us?</Label>
              <Select value={foundUs} onValueChange={setFoundUs}>
                <SelectTrigger id="foundUs">
                  <SelectValue placeholder="Select how you found us" />
                </SelectTrigger>
                <SelectContent>
                  {foundUsOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaOfUse">Area of Use</Label>
              <Select value={areaOfUse} onValueChange={setAreaOfUse}>
                <SelectTrigger id="areaOfUse">
                  <SelectValue placeholder="Select area of use" />
                </SelectTrigger>
                <SelectContent>
                  {areaOfUseOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission Preference</Label>
              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger id="transmission">
                  <SelectValue placeholder="Select transmission preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Preference</SelectItem>
                  <SelectItem value="1">Automatic</SelectItem>
                  <SelectItem value="2">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionPoint">Collection Point</Label>
              <Input 
                id="collectionPoint" 
                value={collectionPoint} 
                onChange={(e) => setCollectionPoint(e.target.value)} 
                placeholder="Enter your preferred collection point"
              />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea 
                id="comments" 
                value={comments} 
                onChange={(e) => setComments(e.target.value)} 
                placeholder="Enter any comments or special requests" 
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="bg-white rounded-md p-4 mb-6 shadow-sm">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="termsAccepted"
              className="mt-1"
            />
            <Label htmlFor="termsAccepted" className="text-sm">
              I understand that a deposit of 20% (or the full hire if less than $100.00) will be required to confirm this booking.
              I understand and accept the <a href="#" className="text-primary underline">Terms & Conditions</a>.
            </Label>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            type="button" 
            onClick={handleSubmitQuote} 
            variant="outline"
            disabled={isLoading}
          >
            Email Quote
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmitBooking}
            disabled={isLoading}
          >
            Book Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetails;
