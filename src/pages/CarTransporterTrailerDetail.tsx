
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
            Fitted with a heavy-duty winch, it's ideal for loading vehicles of various conditions. 
            The tilt deck makes it easier to load low-clearance vehicles, and the extended length 
            accommodates most cars with ease.
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Deck Size</h3>
            <Card className="p-6">
              <p className="text-lg">5000(L) x 1900(W)</p>
            </Card>
          </div>
          
          <Card className="p-4 mb-8">
            <h3 className="font-medium mb-2">Max Load</h3>
            <p className="text-xl font-bold">1940kg</p>
          </Card>
          
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
                "Wheel straps included",
                "Sturdy ramp system"
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
                  Due to the trailer's size and maximum load capacity of 1940kg, you'll need a vehicle with a suitable towing capacity. 
                  Your towing vehicle must have a current Warrant of Fitness (WOF) and Registration. We recommend medium to large SUVs, 
                  utes, or vehicles specifically rated for towing.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is the trailer easy to load and unload?</h3>
                <p className="text-gray-700">
                  Yes, the trailer features a tilt deck design and comes equipped with a heavy-duty winch, making loading and unloading 
                  straightforward even for non-running vehicles. The tilt functionality is particularly helpful for cars with low ground clearance.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Can I transport commercial vehicles or utes?</h3>
                <p className="text-gray-700">
                  The trailer can accommodate most standard passenger cars and some smaller commercial vehicles, depending on their weight and dimensions. 
                  The deck size is 5000mm (L) x 1900mm (W), which fits most standard vehicles. For larger vehicles or utes, please check with us first 
                  to ensure compatibility.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is reversing with this trailer difficult?</h3>
                <p className="text-gray-700">
                  Due to its size, it may take practice. Always plan for wider turns and more space when manoeuvring. 
                  We recommend having a spotter to help guide you when reversing, especially in tight spaces or if you have limited 
                  experience with larger trailers.
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
