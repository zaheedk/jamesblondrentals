import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { useStep2Vehicles } = useRcmApi();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract search parameters
  const pickupLocationId = searchParams.get("pickupLocationId");
  const pickupLocationName = searchParams.get("pickupLocationName");
  const dropoffLocationId = searchParams.get("dropoffLocationId");
  const dropoffLocationName = searchParams.get("dropoffLocationName");
  const pickupDate = searchParams.get("pickupDate");
  const pickupTime = searchParams.get("pickupTime");
  const dropoffDate = searchParams.get("dropoffDate");
  const dropoffTime = searchParams.get("dropoffTime");
  const ageId = searchParams.get("ageId");
  const vehicleName = searchParams.get("vehicleName");
  const basePrice = searchParams.get("basePrice");

  // Fetch vehicle details
  const step2Params = pickupLocationId && pickupDate && pickupTime && dropoffLocationId && dropoffDate && dropoffTime && ageId ? {
    pickuplocationid: pickupLocationId,
    pickupdate: pickupDate,
    pickuptime: pickupTime,
    dropofflocationid: dropoffLocationId,
    dropoffdate: dropoffDate,
    dropofftime: dropoffTime,
    ageid: ageId,
    vehiclecategorytypeid: "0" // Get all vehicle types
  } : null;

  const { data: step2Data, isLoading: isStep2Loading, error: step2Error } = useStep2Vehicles(step2Params);

  // Process data once received
  useEffect(() => {
    if (!isStep2Loading && step2Data && id) {
      const foundVehicle = step2Data.results?.availablecars?.find(
        car => car.vehiclecategoryid.toString() === id
      );

      if (foundVehicle) {
        setVehicle({
          id: foundVehicle.vehiclecategoryid,
          name: foundVehicle.vehiclecategory,
          description: [
            foundVehicle.vehicledescription1,
            foundVehicle.vehicledescription2,
            foundVehicle.vehicledescription3
          ].filter(Boolean).join(' '),
          seats: foundVehicle.numberofadults + foundVehicle.numberofchildren,
          luggage: foundVehicle.numberoflargecases + foundVehicle.numberofsmallcases,
          imageUrl: foundVehicle.imageurl,
          price: foundVehicle.totalrateafterdiscount,
          features: []
        });
      } else {
        setError("Vehicle not found");
      }
      setIsLoading(false);
    } else if (!isStep2Loading && step2Error) {
      setError("Failed to load vehicle details");
      setIsLoading(false);
    }
  }, [id, step2Data, isStep2Loading, step2Error]);

  // If manually navigated to this page without search parameters
  useEffect(() => {
    if (!pickupLocationId || !pickupDate || !dropoffDate) {
      setIsLoading(false);
    }
  }, [pickupLocationId, pickupDate, dropoffDate]);

  // Calculate rental duration
  const rentalDuration = (pickupDate && dropoffDate) 
    ? differenceInDays(new Date(dropoffDate), new Date(pickupDate)) + 1
    : 0;
  
  const handleBookNow = () => {
    // Prepare booking parameters
    const bookingParams = new URLSearchParams();
    
    // Vehicle details
    bookingParams.append("vehicleId", id || "");
    bookingParams.append("vehicleName", vehicle?.name || vehicleName || "");
    bookingParams.append("basePrice", String(vehicle?.price || basePrice || 0));
    
    // Required booking parameters
    bookingParams.append("pickupLocationId", pickupLocationId || "");
    bookingParams.append("pickupLocationName", pickupLocationName || "");
    bookingParams.append("dropoffLocationId", dropoffLocationId || "");
    bookingParams.append("dropoffLocationName", dropoffLocationName || "");
    bookingParams.append("pickupDate", pickupDate || "");
    bookingParams.append("pickupTime", pickupTime || "");
    bookingParams.append("dropoffDate", dropoffDate || "");
    bookingParams.append("dropoffTime", dropoffTime || "");
    bookingParams.append("ageId", ageId || "");
    
    // Navigate to booking page
    navigate(`/booking?${bookingParams.toString()}`);
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <Card className="max-w-lg mx-auto my-10">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button asChild>
                <Link to="/vehicles">View All Vehicles</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pickupLocationId || !pickupDate || !dropoffDate) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <Card className="max-w-lg mx-auto my-10">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Missing Search Parameters</h1>
              <p className="text-gray-600 mb-4">
                Please start your search from the home page to select your rental dates and location.
              </p>
              <Button asChild>
                <Link to="/">Go to Home Page</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <Card className="max-w-lg mx-auto my-10">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
              <p className="text-gray-600 mb-4">
                The requested vehicle could not be found or is no longer available.
              </p>
              <Button asChild>
                <Link to="/vehicles">View All Vehicles</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Image */}
          <div className="lg:col-span-2">
            <img 
              src={vehicle.imageUrl || "/placeholder.svg"}
              alt={vehicle.name}
              className="w-full h-[400px] object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          
          {/* Booking Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{vehicle.name}</h1>
              {vehicle.description && (
                <p className="mt-2 text-gray-600">{vehicle.description}</p>
              )}
            </div>
            
            {/* Rental Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-xl">Rental Details</h2>
                
                {/* Dates */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Pick-up</span>
                      <p>{pickupDate && format(new Date(pickupDate), 'MMM dd, yyyy')} {pickupTime}</p>
                      <p className="text-sm">{pickupLocationName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Drop-off</span>
                      <p>{dropoffDate && format(new Date(dropoffDate), 'MMM dd, yyyy')} {dropoffTime}</p>
                      <p className="text-sm">{dropoffLocationName}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{rentalDuration} day{rentalDuration !== 1 ? 's' : ''} rental</p>
                </div>
                
                {/* Price */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">Base Price:</span>
                    <span className="text-xl font-bold">${vehicle.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 text-right">(${(vehicle.price / rentalDuration).toFixed(2)} per day)</p>
                  <p className="text-xs text-gray-500 mt-1">*Additional taxes and fees may apply</p>
                </div>
                
                {/* Book Button */}
                <Button onClick={handleBookNow} className="w-full mt-4">Book Now</Button>
              </CardContent>
            </Card>
            
            {/* Vehicle Features */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-xl">Vehicle Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Seats</span>
                    <p>{vehicle.seats}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">Luggage</span>
                    <p>{vehicle.luggage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetail;
