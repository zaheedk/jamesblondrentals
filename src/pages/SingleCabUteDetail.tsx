
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const SingleCabUteDetail = () => {
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
          <h1 className="text-3xl font-bold mb-2">Durable & Efficient – Single Cab UTE Rentals</h1>
          <p className="text-lg text-gray-700 mb-6">
            Our Single Cab UTE (Petrol) is the perfect choice for those who need a tough, reliable, and fuel-efficient vehicle for work or transport. With a powerful petrol engine, a spacious cargo tray, and a sturdy build, it's designed for both business and everyday use.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Whether you're hauling equipment, making deliveries, or heading off on an adventure, this Single Cab UTE provides the durability and performance you need. Rent one today and experience efficiency and power in a compact yet capable package!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-fuel"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Fuel Type</h3>
              <p className="font-bold">Petrol</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10H6l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><path d="M14 17H9"/><path d="M5 17a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z"/><path d="M15 17a2 2 0 1 0 4 0c0-1.1-.9-2-2-2s-2 .9-2 2Z"/><path d="m5 10 2-5h9l2 5"/></svg>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Transmission</h3>
              <p className="font-bold">Automatic Transmission</p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-right"><path d="M7 7l10 10"/><polyline points="17 7 17 17 7 17"/></svg>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Mileage Charges</h3>
              <p className="font-bold">Unlimited Kilometres</p>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Max Load</h3>
              <p className="text-2xl font-bold">1000kg</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Tray Area</h3>
              <p className="text-2xl font-bold">2400(L) x 1800(W)</p>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={16/9}>
              <img 
                src="/lovable-uploads/234be2bf-bb8a-4e38-90ba-899a4b1eaf38.png" 
                alt="Single Cab UTE - Petrol" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Single Cab UTE (Petrol) Rentals</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What are the key features of the Single Cab UTE (Petrol)?</h3>
                <p className="text-gray-700">
                  The Single Cab UTE features a spacious 2400(L) x 1800(W) tray, automatic transmission, 1000kg load capacity, and comes with unlimited kilometers – perfect for work and personal use.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">Is the Single Cab UTE suitable for heavy loads?</h3>
                <p className="text-gray-700">
                  Yes, with a maximum load capacity of 1000kg, the Single Cab UTE is designed to handle substantial cargo while maintaining performance and fuel efficiency.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">Can I use the Single Cab UTE for off-road driving?</h3>
                <p className="text-gray-700">
                  While the Single Cab UTE can handle various terrains, extreme off-road usage should be discussed with our rental team first to ensure proper vehicle selection and coverage.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold">Do I need a special license to rent a Single Cab UTE?</h3>
                <p className="text-gray-700">
                  No, a standard full driver's license is all that's required to rent and drive a Single Cab UTE (Petrol). No additional endorsements are necessary.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleCabUteDetail;
