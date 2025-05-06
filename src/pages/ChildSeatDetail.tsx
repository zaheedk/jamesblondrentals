
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ChildSeatDetail = () => {
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

      <h1 className="text-3xl font-bold mb-4">Safe Travel for Little Passengers – Child Seat Hire</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            When travelling with young children, safety is everything. That's why James Blond Rentals 
            offers quality child seats that fit securely into most rental vehicles. Designed for children 
            over 6–8 months, these seats ensure comfort and protection throughout your journey.
          </p>
          
          <p className="text-lg text-gray-700 mb-8">
            Our child seats are suitable for a range of vehicle types and come with easy-to-follow 
            fitting instructions. Please note we do not provide capsule or infant seats for babies 
            under 6 months of age.
          </p>

          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Not suitable for babies under 6 months of age
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "For children older than 6–8 months",
                "Comfortable padding",
                "Secure Harness",
                "Easy to fit",
                "Height-adjustable headrest",
                "Washable covers"
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
                  <span>Installation guidance available at pickup</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Available for daily, weekly, or duration-of-trip rental</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Thoroughly sanitized between rentals</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png" 
                alt="Child Seat" 
                className="w-full h-full object-contain p-4"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mb-4">You need to know about Child Seat rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Can I use this seat for newborns?</h3>
                <p className="text-gray-700">
                  No, our child seats are designed for children over 6-8 months of age. We do not provide capsule 
                  or infant seats for newborns or babies under 6 months. If you need a seat for a younger baby, 
                  we recommend bringing your own appropriate infant seat.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Are the seats cleaned between hires?</h3>
                <p className="text-gray-700">
                  Yes, all our child seats undergo thorough cleaning and sanitization between rentals. 
                  We follow strict hygiene protocols to ensure the seats are clean and safe for your child.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Can I install the seat myself?</h3>
                <p className="text-gray-700">
                  Yes, our child seats come with clear installation instructions. Our staff can also provide 
                  guidance on correct installation at the time of pickup. However, it is ultimately the parent's 
                  responsibility to ensure the seat is correctly installed.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is the seat forward-facing or rear-facing?</h3>
                <p className="text-gray-700">
                  Most seats are forward-facing, suitable for toddlers and small children. These are designed 
                  for children who can sit upright unassisted (typically over 6-8 months old).
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildSeatDetail;
