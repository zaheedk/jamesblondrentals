
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CarTransporterTrailerDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/fleet/trailers">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Trailers
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Secure & Durable – Car Transporter Trailer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Our Car Transporter Trailer is a robust, flat-deck tilt trailer designed for safely transporting vehicles. 
            Whether you're relocating a project car, assisting a breakdown recovery, or moving a vehicle from A to B, 
            this trailer offers reliability, strength, and peace of mind.
          </p>
          
          <p className="text-lg text-gray-700 mb-8">
            Fitted with a heavy-duty winch, it's ideal for loading vehicles of various conditions. The tilt deck makes 
            it easier to load low-clearance vehicles, and the extended length accommodates most cars with ease.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Deck Dimensions</h3>
              <p className="text-xl font-bold">5000(L) x 1900(W)</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Max Load</h3>
              <p className="text-xl font-bold">1940kg</p>
            </Card>
          </div>
          
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Towing vehicle must have WOF/REG
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Tilt / Flat deck trailer",
                "Heavy duty winch",
                "Secure tie-down points",
                "Robust construction"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={16/9}>
              <img 
                src="/lovable-uploads/3f2ac575-135b-409f-b546-6ef7cdb9c9d9.png" 
                alt="Car Transporter Trailer" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Car Transporter Trailer rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What kind of towing vehicle do I need?</h3>
                <p className="text-gray-700">
                  You'll need a vehicle with sufficient towing capacity for both the trailer (which is substantial) and 
                  the vehicle being transported. The towing vehicle must have a current Warrant of Fitness (WOF) and 
                  Registration. SUVs, larger utes, or vehicles specifically rated for heavy towing are recommended.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is the trailer easy to load and unload?</h3>
                <p className="text-gray-700">
                  Yes, the trailer features a tilt deck design that makes loading and unloading straightforward, especially 
                  for low-clearance vehicles. The heavy-duty winch assists with pulling non-running vehicles onto the deck, 
                  reducing manual effort and ensuring safe loading operations.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Can I transport commercial vehicles or utes?</h3>
                <p className="text-gray-700">
                  The trailer can accommodate most standard passenger vehicles and some smaller commercial vehicles or utes, 
                  depending on their dimensions and weight. The deck size of 5000mm x 1900mm provides ample space, but always 
                  check that the combined weight stays within the 1940kg maximum load capacity.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is reversing with this trailer difficult?</h3>
                <p className="text-gray-700">
                  Due to its size, it may take practice. Always plan for wider turns and more space when manoeuvring. We 
                  recommend practicing in an open area before attempting tight spaces, and having a spotter to guide you when 
                  possible.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarTransporterTrailerDetail;
