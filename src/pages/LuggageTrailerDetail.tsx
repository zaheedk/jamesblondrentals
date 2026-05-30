
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


const LuggageTrailerDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Luggage Trailer Hire | James Blond Rentals" description="Hire a luggage trailer for extra cargo space on road trips, airport transfers and group travel." canonical="/fleet/trailers/luggage-trailer" />
      <div className="mb-6">
        <Link to="/fleet/trailers">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Trailers
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Secure & Versatile – Luggage Trailer Hire</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Our luggage trailers are designed for secure and efficient transportation of goods, equipment, and bulky items. 
            Made from durable materials with secure lockable covers, these trailers ensure your belongings remain protected 
            during transport for both personal and commercial use.
          </p>
          
          <p className="text-lg text-gray-700 mb-8">
            Available in multiple sizes to suit your needs, each trailer fits a 7/8 inch standard 
            NZ tow-ball and operates on a 12-volt lighting system (not suitable for 24-volt systems). Rent one today 
            for a reliable and hassle-free transport solution!
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Sizes Available</h3>
            <Card className="p-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Small: 1400(L) x 1100(W) x 1200(H)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Medium: 1800(L) x 1200(W) x 1200(H)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Large: 2000(L) x 1400(W) x 1150(H)</span>
                </li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4 mb-8">
            <h3 className="font-medium mb-2">Max Load</h3>
            <p className="text-xl font-bold">500kg</p>
          </Card>
          
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
                "Secure / Lockable",
                "Weatherproof design",
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
                src="/lovable-uploads/ea4af725-7713-464d-83cb-34d5cd4c0e7f.png" 
                alt="Luggage Trailer" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-700 mb-4">You need to know about Luggage Trailer rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What kind of vehicle can tow this trailer?</h3>
                <p className="text-gray-700">
                  Most standard vehicles with a properly installed tow bar can tow our luggage trailers. The trailers 
                  use a standard 7/8 inch NZ tow-ball connection. Always check your vehicle's towing capacity to ensure 
                  it can safely handle the trailer and your intended load.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is the luggage trailer covered and secure?</h3>
                <p className="text-gray-700">
                  Yes, our luggage trailers come with lockable covers to keep your belongings protected from the 
                  elements and secure during transport. This makes them ideal for transporting valuable items, luggage, 
                  camping gear, and other possessions that need to stay dry and secure.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">What are the best uses for this trailer?</h3>
                <p className="text-gray-700">
                  Luggage trailers are versatile and perfect for moving household items, going on camping trips, 
                  transporting sports equipment, airport runs with lots of luggage, or any situation where you need 
                  additional secure storage space outside your vehicle.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is it difficult to tow?</h3>
                <p className="text-gray-700">
                  Not at all. Just check the lights, balance your load, and keep to 90km/h max. The luggage trailers 
                  are designed for easy towing, with smooth handling characteristics. They're ideal even for those with 
                  limited towing experience.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LuggageTrailerDetail;
