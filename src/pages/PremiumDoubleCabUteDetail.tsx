
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Fuel, Car, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const PremiumDoubleCabUteDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/fleet/utes">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to UTEs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Power & Versatility – Premium Double Cab UTE Rentals</h1>
          <p className="text-lg text-gray-700 mb-6">
            Our Premium Double Cab UTE (Petrol) is built for both work and adventure, offering a perfect blend of power, comfort, and versatility. Whether you need a reliable vehicle for business, outdoor activities, or heavy-duty hauling, this UTE delivers superior performance and efficiency.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            With a spacious double cab for passengers and a durable cargo bed for transporting equipment or goods, it's the ideal choice for various travel needs. Rent a Premium Double Cab UTE (Petrol) today and experience a vehicle designed for both power and practicality!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <Fuel size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Fuel Type</h3>
              <p className="font-bold">Petrol</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <Car size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Transmission</h3>
              <p className="font-bold">Automatic Transmission</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <Route size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">Mileage Charges</h3>
              <p className="font-bold">Unlimited Kilometres</p>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Max Load</h3>
              <p className="text-2xl font-bold">3500kg</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Tray Area</h3>
              <p className="text-2xl font-bold">1700(L) x 1800(W)</p>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Additional Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><path d="m9 16 2 2 4-4"/></svg>
                </div>
                <span className="font-medium">Roof Racks</span>
              </Card>
              <Card className="p-4 flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                </div>
                <span className="font-medium">Towbar</span>
              </Card>
            </div>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={16/9}>
              <img 
                src="/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png" 
                alt="Premium Double Cab UTE - Petrol" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Premium Double Cab UTE Rentals</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What are the key features of the Premium Double Cab UTE (Petrol)?</h3>
                <p className="text-gray-700">
                  The Premium Double Cab UTE (Petrol) features a spacious double cab for passenger comfort, a durable cargo bed, roof racks, towbar, automatic transmission, and unlimited kilometers. It combines functionality with comfort for various transportation needs.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">Is the Premium Double Cab UTE suitable for off-road driving?</h3>
                <p className="text-gray-700">
                  Yes, the Premium Double Cab UTE is capable of handling moderate off-road conditions. Its sturdy build and reliable performance make it suitable for both urban and rural environments, though extreme off-road usage should be discussed with our rental team.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">What is the towing capacity of the Premium Double Cab UTE (Petrol)?</h3>
                <p className="text-gray-700">
                  The Premium Double Cab UTE (Petrol) has a towing capacity of up to 3500kg, making it ideal for hauling trailers, boats, or other heavy equipment for work or recreational purposes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">Do I need a special license to rent a Premium Double Cab UTE?</h3>
                <p className="text-gray-700">
                  No, a standard full driver's license is sufficient for renting and driving a Premium Double Cab UTE (Petrol). No special endorsements are required.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PremiumDoubleCabUteDetail;
