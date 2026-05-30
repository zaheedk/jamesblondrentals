
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageSEO from '@/components/PageSEO';


const HandTrolleyDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Hand Trolley Hire | James Blond Rentals" description="Add a hand trolley to your rental for easy moving of boxes and heavy items. Compact and versatile." canonical="/fleet/accessories/hand-trolley" />
      <div className="mb-6">
        <Link to="/fleet/accessories">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Accessories
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Hand Trolley – Moving Made Effortless</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Take the strain off your back and get the job done faster with our durable hand trolleys, perfect 
            for home moves, warehouse tasks, office relocations or event setups. Whether you're moving boxes, 
            small furniture or equipment, this handy tool helps you move more with less effort.
          </p>
          
          <p className="text-lg text-gray-700 mb-6">
            Sturdy and smooth-rolling, the hand trolley is built to handle heavy loads without the hassle.
            Designed for practicality and ease of use, it's the perfect companion for any moving job.
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
                "Sturdy steel frame construction",
                "Smooth wheels for easy manoeuvring",
                "Ideal for boxes and furniture",
                "Lightweight and easy to transport",
                "Compact design for storage",
                "Rubberized handle for comfortable grip"
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
                alt="Hand Trolley" 
                className="w-full h-full object-contain p-4"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-700 mb-4">You need to know about Hand Trolley rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Can I use the trolley with any vehicle?</h3>
                <p className="text-gray-700">
                  Yes, our hand trolleys can be rented alongside any of our vehicles, from small cars to trucks. 
                  The compact design means it can be easily stored in the trunk of a car, the back of a van, or 
                  in a truck bed, making it a versatile addition to any rental.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is it difficult to use?</h3>
                <p className="text-gray-700">
                  Not at all. Our hand trolleys are designed for ease of use with an intuitive tilt-and-roll mechanism. 
                  Simply position the trolley against the item you wish to move, tilt back, and roll. The ergonomic handles 
                  and balanced design make it accessible even for those with no prior experience.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is there a weight limit?</h3>
                <p className="text-gray-700">
                  Our standard hand trolleys have a recommended weight capacity of up to 150kg. For heavier items, 
                  we recommend our large hand trolley which has a higher capacity. Always ensure you're using the 
                  trolley within its weight limits and for appropriate items to avoid damage or accidents.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is the hand trolley included in the vehicle rental?</h3>
                <p className="text-gray-700">
                  The hand trolley is available as an optional accessory—just request it when booking. 
                  It's not automatically included with the vehicle rental but can be easily added for a 
                  small additional fee, either at the time of online booking or when you arrive to collect your vehicle.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HandTrolleyDetail;
