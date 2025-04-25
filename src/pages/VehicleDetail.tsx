
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronLeft, ChevronRight, MapPin, Users, Gauge, Fuel, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Vehicle } from "@/lib/types";
import { useRcmApi } from "@/hooks/use-rcm-api";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { rcmApi } = useRcmApi();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pickupLocation = searchParams.get("pickupLocation") || "";
  const dropoffLocation = searchParams.get("dropoffLocation") || pickupLocation;
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "10:00";
  const dropoffTime = searchParams.get("dropoffTime") || "10:00";
  
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        try {
          const vehicleData = await rcmApi.getVehicleById(id);
          
          if (vehicleData) {
            const mappedVehicle: Vehicle = {
              id: parseInt(vehicleData.id.toString()),
              make: vehicleData.make || "Unknown",
              model: vehicleData.model || "Vehicle",
              year: vehicleData.year || new Date().getFullYear(),
              type: (vehicleData.category?.toLowerCase() as any) || "economy",
              price: parseFloat(vehicleData.price?.toString()) || 50,
              priceUnit: "day",
              seats: vehicleData.passengers || 4,
              transmission: (vehicleData.transmission?.toLowerCase() === "a" ? "automatic" : "manual") as "automatic" | "manual",
              fuelType: (vehicleData.fuelType?.toLowerCase() || "gasoline") as "gasoline" | "diesel" | "electric" | "hybrid",
              fuelEfficiency: vehicleData.fuelConsumption || "35 mpg",
              available: true,
              location: pickupLocation || "Main Location",
              features: typeof vehicleData.features === 'string' ? 
                vehicleData.features.split(',').map(f => f.trim()) : 
                (Array.isArray(vehicleData.features) ? vehicleData.features : 
                ["Air Conditioning", "Power Steering", "Bluetooth", "USB Port"]),
              images: Array.isArray(vehicleData.images) && vehicleData.images.length > 0 ? 
                vehicleData.images.map(img => typeof img === 'string' ? img : (img as any).url || "/placeholder.svg") : 
                ["/placeholder.svg"],
              description: vehicleData.description || 
                `${vehicleData.make} ${vehicleData.model} with ${vehicleData.passengers || 4} seats and ${vehicleData.transmission === "A" ? "automatic" : "manual"} transmission.`,
            };
            
            setVehicle(mappedVehicle);
            return;
          }
        } catch (detailError) {
          console.error("Could not fetch vehicle by ID:", detailError);
          // Continue to fallback method
        }
        
        if (pickupLocation && pickupDate && dropoffDate) {
          const vehiclesData = await rcmApi.getAvailableVehicles({
            pickupLocationId: pickupLocation,
            pickupDate,
            pickupTime,
            dropoffLocationId: dropoffLocation,
            dropoffDate,
            dropoffTime,
          });
          
          const foundVehicle = vehiclesData.find(v => v.id === id);
          
          if (foundVehicle) {
            const mappedVehicle: Vehicle = {
              id: parseInt(foundVehicle.id.toString()),
              make: foundVehicle.make || "Unknown",
              model: foundVehicle.model || "Vehicle",
              year: foundVehicle.year || new Date().getFullYear(),
              type: (foundVehicle.category?.toLowerCase() as any) || "economy",
              price: parseFloat(foundVehicle.price?.toString()) || 50,
              priceUnit: "day",
              seats: foundVehicle.passengers || 4,
              transmission: (foundVehicle.transmission?.toLowerCase() === "a" ? "automatic" : "manual") as "automatic" | "manual",
              fuelType: (foundVehicle.fuelType?.toLowerCase() || "gasoline") as "gasoline" | "diesel" | "electric" | "hybrid",
              fuelEfficiency: foundVehicle.fuelConsumption || "35 mpg",
              available: true,
              location: pickupLocation,
              features: typeof foundVehicle.features === 'string' ? 
                foundVehicle.features.split(',').map(f => f.trim()) : 
                (Array.isArray(foundVehicle.features) ? foundVehicle.features : 
                ["Air Conditioning", "Power Steering", "Bluetooth", "USB Port"]),
              images: Array.isArray(foundVehicle.images) && foundVehicle.images.length > 0 ? 
                foundVehicle.images.map(img => typeof img === 'string' ? img : (img as any).url || "/placeholder.svg") : 
                ["/placeholder.svg"],
              description: foundVehicle.description || 
                `${foundVehicle.make} ${foundVehicle.model} with ${foundVehicle.passengers || 4} seats and ${foundVehicle.transmission === "A" ? "automatic" : "manual"} transmission.`,
            };
            
            setVehicle(mappedVehicle);
          } else {
            setError("Vehicle not found with the given parameters.");
          }
        } else {
          const step1Data = await rcmApi.getStep1();
          
          if (step1Data.status === "OK" && step1Data.results?.locations?.length) {
            const defaultLocation = step1Data.results.locations[0];
            
            const today = new Date();
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 3);
            
            const todayStr = today.toISOString().split('T')[0];
            const returnStr = returnDate.toISOString().split('T')[0];
            
            const vehiclesData = await rcmApi.getAvailableVehicles({
              pickupLocationId: defaultLocation.id.toString(),
              pickupDate: todayStr,
              pickupTime: "10:00",
              dropoffLocationId: defaultLocation.id.toString(),
              dropoffDate: returnStr,
              dropoffTime: "10:00",
            });
            
            const foundVehicle = vehiclesData.find(v => v.id === id);
            
            if (foundVehicle) {
              const mappedVehicle: Vehicle = {
                id: parseInt(foundVehicle.id.toString()),
                make: foundVehicle.make || "Unknown",
                model: foundVehicle.model || "Vehicle",
                year: foundVehicle.year || new Date().getFullYear(),
                type: (foundVehicle.category?.toLowerCase() as any) || "economy",
                price: parseFloat(foundVehicle.price?.toString()) || 50,
                priceUnit: "day",
                seats: foundVehicle.passengers || 4,
                transmission: (foundVehicle.transmission?.toLowerCase() === "a" ? "automatic" : "manual") as "automatic" | "manual",
                fuelType: (foundVehicle.fuelType?.toLowerCase() || "gasoline") as "gasoline" | "diesel" | "electric" | "hybrid",
                fuelEfficiency: foundVehicle.fuelConsumption || "35 mpg",
                available: true,
                location: defaultLocation.location || "Main Location",
                features: typeof foundVehicle.features === 'string' ? 
                  foundVehicle.features.split(',').map(f => f.trim()) : 
                  (Array.isArray(foundVehicle.features) ? foundVehicle.features : 
                  ["Air Conditioning", "Power Steering", "Bluetooth", "USB Port"]),
                images: Array.isArray(foundVehicle.images) && foundVehicle.images.length > 0 ? 
                  foundVehicle.images.map(img => typeof img === 'string' ? img : (img as any).url || "/placeholder.svg") : 
                  ["/placeholder.svg"],
                description: foundVehicle.description || 
                  `${foundVehicle.make} ${foundVehicle.model} with ${foundVehicle.passengers || 4} seats and ${foundVehicle.transmission === "A" ? "automatic" : "manual"} transmission.`,
              };
              
              setVehicle(mappedVehicle);
            } else {
              setError("Vehicle not found.");
            }
          }
        }
        
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        setError("Failed to load vehicle details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id, rcmApi, pickupLocation, dropoffLocation, pickupDate, dropoffDate, pickupTime, dropoffTime]);
  
  const nextImage = () => {
    if (vehicle && vehicle.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (vehicle && vehicle.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleBookNow = () => {
    let bookingUrl = `/booking?vehicleId=${vehicle?.id}`;
    
    if (pickupLocation) bookingUrl += `&pickupLocation=${pickupLocation}`;
    if (dropoffLocation) bookingUrl += `&dropoffLocation=${dropoffLocation}`;
    if (pickupDate) bookingUrl += `&pickupDate=${pickupDate}`;
    if (dropoffDate) bookingUrl += `&dropoffDate=${dropoffDate}`;
    if (pickupTime) bookingUrl += `&pickupTime=${pickupTime}`;
    if (dropoffTime) bookingUrl += `&dropoffTime=${dropoffTime}`;
    
    navigate(bookingUrl);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !vehicle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <p className="mb-6">{error || "The vehicle you're looking for doesn't exist or has been removed."}</p>
          <Button asChild>
            <Link to="/vehicles">Browse All Vehicles</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/vehicles" className="text-primary inline-flex items-center hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to vehicles
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden aspect-video shadow-lg">
                <img
                  src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                
                {vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {vehicle.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6">
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="policy">Rental Policy</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Vehicle Description</h3>
                    <p className="text-gray-600 mb-6">{vehicle.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Year</span>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">{vehicle.year}</span>
                        </div>
                      </div>
                      <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Type</span>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="capitalize">
                            {vehicle.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Seats</span>
                        <div className="flex items-center mt-1">
                          <Users className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">{vehicle.seats} seats</span>
                        </div>
                      </div>
                      <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Transmission</span>
                        <div className="flex items-center mt-1">
                          <Gauge className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium capitalize">{vehicle.transmission}</span>
                        </div>
                      </div>
                      <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Fuel Type</span>
                        <div className="flex items-center mt-1">
                          <Fuel className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium capitalize">{vehicle.fuelType}</span>
                        </div>
                      </div>
                      <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Fuel Efficiency</span>
                        <div className="flex items-center mt-1">
                          <span className="font-medium">{vehicle.fuelEfficiency}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="pt-4">
                    <h3 className="text-lg font-semibold mb-4">Vehicle Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-primary mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="policy" className="pt-4">
                    <h3 className="text-lg font-semibold mb-2">Rental Policy</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Valid driver's license required for all drivers</li>
                      <li>Minimum age: 21 years (surcharge may apply for drivers under 25)</li>
                      <li>Security deposit required at pickup</li>
                      <li>Full insurance coverage available for purchase</li>
                      <li>Fuel policy: Return with same amount as at pickup</li>
                      <li>Mileage: Unlimited</li>
                      <li>Late return fee: $25 per hour</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <Badge variant="outline" className="capitalize">
                    {vehicle.type}
                  </Badge>
                </div>
                
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Available at:</p>
                    <p className="text-gray-600">{vehicle.location}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Rental rate</span>
                    <div>
                      <span className="font-semibold text-xl text-primary">${vehicle.price}</span>
                      <span className="text-sm text-gray-500">/{vehicle.priceUnit}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Availability</span>
                    <span className={`text-sm font-medium ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                      {vehicle.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-3" 
                  disabled={!vehicle.available}
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/contact">Ask a Question</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetail;
