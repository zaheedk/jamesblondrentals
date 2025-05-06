
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PalletJackDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/fleet/accessories">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Accessories
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Pallet Jack Hire – Move Heavy Loads with Ease</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Make lifting and shifting heavy items a breeze with our heavy-duty pallet jacks, available as a convenient add-on 
            when hiring a truck, van or trailer from James Blond Rentals. Designed for practicality and strength, our pallet jacks 
            are perfect for warehouses, home moves, event setups or commercial deliveries.
          </p>
          
          <p className="text-lg text-gray-700 mb-6">
            Built for stability and manoeuvrability, the pallet jack offers a maximum lifting capacity of 1000kg, 
            making it ideal for handling medium-sized pallets and bulky goods.
          </p>
          
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Maximum load capacity: 1000kg
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Maximum load capacity: 1000kg",
                "Compact size for easier navigation",
                "Durable steel construction",
                "Smooth-rolling wheels",
                "Ergonomic handle design",
                "Easy to operate pump action"
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
                  <span>Available as an add-on when hiring trucks, vans, or trailers</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Delivered and collected with your vehicle rental</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Simple operation with brief demonstration available at pickup</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/7399d499-7037-41fe-b5c3-3d013ad2163e.png" 
                alt="Pallet Jack" 
                className="w-full h-full object-contain p-4"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Pallet Jack rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Can I hire a pallet jack on its own?</h3>
                <p className="text-gray-700">
                  Our pallet jacks are available as add-ons to truck, van, or trailer rentals. They cannot be hired
                  separately due to transport logistics. When you rent a suitable vehicle, you can easily add a pallet
                  jack to your booking.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">What can I lift with a pallet jack?</h3>
                <p className="text-gray-700">
                  A pallet jack is designed to lift and transport items loaded on pallets or skids. They're perfect for
                  moving boxed goods, furniture, appliances, and other heavy items that are stable enough to be lifted
                  from underneath. The maximum load capacity is 1000kg.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Do I need experience to use it?</h3>
                <p className="text-gray-700">
                  While previous experience is helpful, pallet jacks are relatively straightforward to operate. Our team
                  can provide a brief demonstration at pickup. The basic operation involves positioning the forks under
                  a pallet, pumping the handle to raise the load, and then pulling or pushing to move the load.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Where can I use it?</h3>
                <p className="text-gray-700">
                  Pallet jacks are ideal for warehouses, loading docks, residential moving, or event logistics. They work
                  best on smooth, flat surfaces like concrete, asphalt, or industrial flooring. They're not suitable for
                  rough terrain, grass, or heavily textured surfaces.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PalletJackDetail;
