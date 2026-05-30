
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageSEO from '@/components/PageSEO';


const BoosterSeatDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Booster Seat Hire | James Blond Rentals" description="Hire a booster seat for children aged 5-7 years with your vehicle rental. NZ safety standard compliant." canonical="/fleet/accessories/booster-seat" />
      <div className="mb-6">
        <Link to="/fleet/accessories">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={20} />
            Back to Accessories
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Secure Support for Growing Kids – Booster Seat Hire</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-lg text-gray-700 mb-6">
            Ideal for older toddlers and young children who are not quite tall enough for adult seatbelts, 
            our booster seats provide added height and essential safety support while travelling. These seats 
            make sure your child can sit comfortably and be correctly restrained using the vehicle's standard seatbelt.
          </p>
          
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only suitable for older toddlers and young children who can sit properly
            </AlertDescription>
          </Alert>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Designed for older toddlers and young children",
                "Elevates the child to a safe seatbelt height",
                "Comfortable seat base with arm support",
                "Suitable for most James Blond rental vehicles",
                "Lightweight and portable",
                "Meets NZ safety standards"
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
                  <span>Available for daily, weekly, or full rental period hire</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Simple installation with guidance available if needed</span>
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2 mr-2" />
                  <span>Sanitized between rentals for hygiene and safety</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="overflow-hidden mb-6">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/aded4525-6592-42ec-9193-53b898de2c13.png" 
                alt="Booster Seat" 
                className="w-full h-full object-contain p-4"
              />
            </AspectRatio>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-700 mb-4">You need to know about Booster Seat rentals service</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What age is a booster seat suitable for?</h3>
                <p className="text-gray-700">
                  Booster seats are typically suitable for children aged 4-11 years old who have outgrown their forward-facing 
                  car seat but are still too small for an adult seatbelt alone. The exact suitability depends on the child's 
                  size and weight rather than just age.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Can I use a booster seat in a van or minibus?</h3>
                <p className="text-gray-700">
                  Yes, our booster seats can be used in most of our rental vehicles, including vans and minibuses. 
                  However, they must be installed in seats with proper three-point seatbelts (lap and diagonal).
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Is it legal to use booster seats in NZ?</h3>
                <p className="text-gray-700">
                  Yes, booster seats are legal and recommended in New Zealand. By law, children must be properly 
                  restrained by an approved child restraint until they reach 7 years of age. However, safety experts 
                  recommend using appropriate restraints (which may include booster seats) until a child can properly 
                  fit an adult seatbelt, which is typically when they are 148cm tall.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">How do I install it?</h3>
                <p className="text-gray-700">
                  Place the seat on the vehicle seat and ensure the child uses the seatbelt across the shoulder and lap as 
                  per instructions. The booster seat should sit flat on the vehicle seat, and the vehicle's seatbelt should 
                  route through the correct belt guides on the booster seat. Our staff can provide quick installation guidance 
                  at pickup if needed.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoosterSeatDetail;
