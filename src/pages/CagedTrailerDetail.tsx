
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PageSEO from '@/components/PageSEO';


const CagedTrailerDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Cage Trailer Hire | James Blond Rentals" description="Rent a cage trailer for garden waste, rubbish removal and general hauling. Easy to tow and load." canonical="/fleet/trailers/cage-trailer" />
      <div className="mb-6">
        <Link to="/fleet/trailers">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Trailers
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Secure & Durable – Trailer with Cage Rental</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Our Trailer with Cage is designed for safe and efficient transportation of goods, equipment, and bulky items. 
            Made from durable steel and surrounded by a sturdy alloy cage, this trailer ensures secure hauling for both 
            personal and commercial use.
          </p>
          
          <p className="text-lg text-gray-700 mb-8">
            Featuring a 2400mm (L) x 1200mm (W) tray with a maximum load capacity of 750kg, it fits a 7/8 inch standard 
            NZ tow-ball and operates on a 12-volt lighting system (not suitable for 24-volt systems). Rent one today 
            for a reliable and hassle-free transport solution!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Tray Dimensions</h3>
              <p className="text-xl font-bold">2400(L) x 1200(W)</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Max Load</h3>
              <p className="text-xl font-bold">750kg</p>
            </Card>
          </div>
          
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Not suited to 24-volt systems
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Made of durable steel",
                "Surrounded by an alloy cage",
                "Fit 7/8 inch standard NZ tow-ball",
                "12-volt system for lights"
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
                src="/lovable-uploads/ca4fe6a5-97a6-4d6c-a675-a0ad2e3e4856.png" 
                alt="Trailer with Cage" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Trailer with Cage rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What is the benefit of a trailer with a cage?</h3>
                <p className="text-gray-700">
                  A caged trailer provides secure containment for loose items, garden waste, or oddly shaped cargo that might 
                  otherwise shift or fall during transport. The cage acts as a safety feature, allowing you to transport more 
                  items without the need for extensive tie-down systems.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">What towing connection is required for this trailer?</h3>
                <p className="text-gray-700">
                  Our caged trailer uses a standard 7/8 inch NZ tow-ball connection, which is compatible with most vehicles 
                  equipped with a tow bar. Make sure your vehicle has the appropriate tow bar installed before renting.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is this trailer suitable for heavy loads?</h3>
                <p className="text-gray-700">
                  The caged trailer has a maximum load capacity of 750kg, making it suitable for medium-weight transportation 
                  needs. It's perfect for household moves, garden waste, construction materials, and similar applications, but 
                  not designed for extremely heavy industrial loads.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Does the trailer have a lighting system?</h3>
                <p className="text-gray-700">
                  Yes, it operates on a 12-volt system for lights but is not compatible with 24-volt systems. Ensure your 
                  vehicle matches this requirement before towing.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CagedTrailerDetail;
