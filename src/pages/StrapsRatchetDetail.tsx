
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StrapsRatchetDetail = () => {
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

      <h1 className="text-3xl font-bold mb-4">Straps & Ratchet – Secure Your Load with Confidence</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Ensure your cargo stays put with our heavy-duty ratchet strap sets, perfect for keeping items 
            secure during transport. Whether you're moving furniture, equipment, or commercial goods, 
            these straps are essential for added safety and stability.
          </p>
          
          <p className="text-lg text-gray-700 mb-6">
            Our straps are available to rent as a pair and work seamlessly with trucks, trailers, and vans. 
            Strong, adjustable, and reliable – they're your go-to tie-down solution for a stress-free move.
          </p>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Always check that straps are properly secured before driving
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Comes in a pair for balanced and secure cargo hold",
                "Designed for use with truck beds, vans, and trailers",
                "Heavy-duty tension and locking mechanism",
                "Prevents cargo from shifting or tipping during transit",
                "Adjustable length to fit various load sizes",
                "Simple ratchet operation for easy tightening"
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
                  <span>Rented as a pair (two straps per rental)</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Available as an add-on to any vehicle rental</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Demonstration available at pickup if needed</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/6242ae39-7570-4898-b18a-1fa9753856af.png" 
                alt="Straps & Ratchet" 
                className="w-full h-full object-contain p-4"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Straps and Ratchet rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Are the straps compatible with all rental vehicles?</h3>
                <p className="text-gray-700">
                  Yes, our ratchet straps are designed to work with all our rental vehicles that have tie-down points,
                  including trucks, vans, and trailers. The adjustable length makes them versatile for different
                  vehicle types and cargo sizes.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">How many straps come in one rental?</h3>
                <p className="text-gray-700">
                  Each rental includes a pair of straps (two straps total). This allows for balanced securing of cargo
                  from multiple points. If you need additional straps for larger or more complex loads, you can request
                  extra pairs at the time of booking.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Can I rent them without a vehicle?</h3>
                <p className="text-gray-700">
                  Our straps are available as add-ons to vehicle rentals only. We don't offer them as standalone
                  rentals as they're specifically designed to complement our vehicle fleet for safe transportation
                  of cargo.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">What if I'm not familiar with how to use them?</h3>
                <p className="text-gray-700">
                  No problem – our team will show you how to secure and release the ratchets during pick-up.
                  The mechanism is straightforward once demonstrated, and we'll make sure you're comfortable
                  using them before you leave our premises.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StrapsRatchetDetail;
