
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageSEO from '@/components/PageSEO';


const LargeHandTrolleyDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Large Hand Trolley Hire | James Blond Rentals" description="Hire a large hand trolley for moving heavy appliances, furniture and bulky items with ease." canonical="/fleet/accessories/large-hand-trolley" />
      <div className="mb-6">
        <Link to="/fleet/accessories">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Accessories
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Large Hand Trolley – Extra Strength for Bulky Loads</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            When you're handling oversized or heavier items, our Large Hand Trolley steps up to the challenge. 
            This upgraded version of our standard hand trolley offers a reinforced frame and extra stability, 
            making it perfect for transporting bulky boxes, appliances, and other heavy equipment.
          </p>
          
          <p className="text-lg text-gray-700 mb-6">
            Designed for demanding jobs like office relocations, warehouse work, or trade show setups, 
            it helps reduce physical strain and improves efficiency with every load.
          </p>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Available as an optional accessory with any vehicle rental
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Reinforced steel frame",
                "Smooth, heavy-duty wheels",
                "Wide base for improved load balance",
                "Built to handle oversized cargo with ease",
                "Higher weight capacity than standard trolley",
                "Ergonomic handles for better control"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Rental Information</h3>
            <Card className="p-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Available as an optional add-on to any vehicle rental</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Request at time of booking or pickup (subject to availability)</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Delivered and collected with your vehicle</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/2462a28e-2cb6-44ef-82b9-b46b5559d465.png" 
                alt="Large Hand Trolley" 
                className="w-full h-full object-contain p-4"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Large Hand Trolley rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What's the difference between the standard and large hand trolley?</h3>
                <p className="text-gray-700">
                  The large hand trolley features a reinforced frame, wider base, and higher weight capacity than our standard 
                  model. It's specifically designed for bulkier, heavier items like large appliances, stacked boxes, and oversized 
                  equipment that require extra stability during transport.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Can it be used with any rental vehicle?</h3>
                <p className="text-gray-700">
                  Yes, our large hand trolley can be rented alongside any of our vehicles. It's compact enough to fit 
                  in most of our vans, trucks, and larger vehicles. For smaller vehicles like cars, we recommend checking 
                  the trunk dimensions first to ensure it will fit properly.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is it easy to handle?</h3>
                <p className="text-gray-700">
                  Despite its larger size and greater capacity, our large hand trolley remains manageable for most users. 
                  It features ergonomic handles and well-balanced design that makes it surprisingly easy to maneuver when loaded. 
                  The heavy-duty wheels provide smooth movement across most surfaces.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is it included in the rental?</h3>
                <p className="text-gray-700">
                  The large hand trolley is available as an optional add-on to your vehicle rental—just request it when booking. 
                  It's not automatically included with the vehicle rental but can be easily added for a small additional fee, 
                  either at the time of online booking or when you arrive to collect your vehicle.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LargeHandTrolleyDetail;
