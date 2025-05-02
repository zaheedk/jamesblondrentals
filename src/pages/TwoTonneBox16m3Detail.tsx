
import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, CarFront, Gauge, Box, Wind } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const TwoTonneBox16m3Detail = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/fleet/trucks" className="text-primary hover:underline">&larr; Back to Trucks</Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Spacious & Reliable – 2 Tonne Box Truck (16m³) Rental</h1>
          <p className="text-lg text-gray-700 mb-6">
            Our 2 Tonne Box Truck (16m³) is the perfect choice for transporting larger loads with ease. 
            Equipped with a manual transmission and air conditioning, this truck ensures a comfortable 
            and efficient driving experience for moving furniture, deliveries, or business transportation needs.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            With a 3800mm (L) x 2000mm (W) x 2000mm (H) box size and a maximum load capacity of 2000kg, 
            it provides ample space for bulky items while maintaining smooth handling on the road. 
            Rent one today and get the job done hassle-free!
          </p>
        </div>
        
        <div className="relative">
          <img 
            src="/lovable-uploads/a00bb0d9-fccc-4d69-a9ab-28d894f74538.png" 
            alt="2 Tonne Box Truck (16m³)" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Fuel className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fuel Type</h3>
            <p className="text-lg">Diesel</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CarFront className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transmission</h3>
            <p className="text-lg">Manual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Gauge className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mileage Charges</h3>
            <p className="text-lg">47c per km mileage charge</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Box className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Max Load</h3>
            <p className="text-lg">2000kg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Box className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cargo Space</h3>
            <p className="text-lg">3800(L) x 2000(W) x 2000(H)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Wind className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Additional Features</h3>
            <ul className="text-lg">
              <li>Air conditioning</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-700 mb-6">You need to know about 2 Tonne Box Truck (16m³) rental service</p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What makes the 2 Tonne Box Truck (16m³) a good choice for moving?</AccordionTrigger>
            <AccordionContent>
              The 2 Tonne Box Truck (16m³) is ideal for moving because of its spacious 16m³ cargo area that can 
              accommodate furniture and large household items. With dimensions of 3800(L) x 2000(W) x 2000(H), 
              it provides ample space while still being manageable to drive. The manual transmission gives you 
              better control over the vehicle, and the air conditioning ensures a comfortable driving experience 
              even when moving during warmer months.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need a special license to drive this truck?</AccordionTrigger>
            <AccordionContent>
              No, you don't need a special license to drive our 2 Tonne Box Truck (16m³). A standard car license 
              is sufficient as this vehicle falls within the weight category permitted for standard license holders. 
              However, we do recommend some experience with larger vehicles if you're not accustomed to driving 
              trucks of this size.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Does this truck come with air conditioning?</AccordionTrigger>
            <AccordionContent>
              Yes, this 2 Tonne Box Truck (16m³) comes equipped with air conditioning for your comfort. 
              This feature ensures a pleasant driving experience regardless of the weather conditions, 
              making it ideal for long-distance moves or deliveries, especially during summer months.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Is there a mileage charge for this truck?</AccordionTrigger>
            <AccordionContent>
              Yes, a 47c per km mileage charge applies. Pricing may vary based on availability, 
              so please confirm at the time of booking. We recommend planning your route in advance 
              to estimate the total mileage and associated costs for your rental.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default TwoTonneBox16m3Detail;
