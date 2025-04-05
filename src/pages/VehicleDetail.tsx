
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronLeft, ChevronRight, MapPin, Users, Gauge, Fuel, Calendar } from "lucide-react";
import { vehicles } from "@/lib/mock-data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Vehicle } from "@/lib/types";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const vehicleId = Number(id);
    const foundVehicle = vehicles.find(v => v.id === vehicleId);
    
    if (foundVehicle) {
      setVehicle(foundVehicle);
    }
  }, [id]);
  
  if (!vehicle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <p className="mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/vehicles">Browse All Vehicles</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };
  
  const handleBookNow = () => {
    navigate(`/booking?vehicleId=${vehicle.id}`);
  };
  
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
            {/* Vehicle Images Section */}
            <div className="lg:col-span-2">
              <div className="relative rounded-lg overflow-hidden aspect-video shadow-lg">
                <img
                  src={vehicle.images[currentImageIndex]}
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
            
            {/* Booking Summary Section */}
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
