
import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, CarFront, Gauge, Box } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const StandardVanDetail = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/fleet/vans" className="text-primary hover:underline">&larr; Back to Vans</Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Reliable & Spacious – Standard Van Rentals</h1>
          <p className="text-lg text-gray-700 mb-6">
            Our Standard Van Rentals offer the perfect balance of space, comfort, and reliability for various 
            transportation needs. Whether you're moving goods, planning a group trip, or need an efficient 
            vehicle for business purposes, our standard vans provide a practical and cost-effective solution.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Designed for both personal and commercial use, our fleet ensures a smooth and hassle-free experience. 
            Whether you're transporting cargo or passengers, our Standard Vans deliver versatility and performance. 
            Explore our rental options and see why we are the trusted choice for van hire.
          </p>
        </div>
        
        <div className="relative">
          <img 
            src="/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png" 
            alt="Standard Van" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Fuel className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fuel Type</h3>
            <p className="text-lg">Petrol</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CarFront className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transmission</h3>
            <p className="text-lg">Transmission subject to Availability</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Gauge className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mileage Charges</h3>
            <p className="text-lg">Unlimited Kilometres</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Box className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Max Load</h3>
            <p className="text-lg">1000kg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Box className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cargo Space</h3>
            <p className="text-lg">3300(L) x 1600(W) x 1900(H)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-2">Additional Features</h3>
            <ul className="text-lg">
              <li>Twin Side Doors</li>
              <li>Front Seats Only</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-700 mb-6">You need to know about service</p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What are the key features of the Standard Van?</AccordionTrigger>
            <AccordionContent>
              Standard vans are Toyota Hiace 2.7 L petrol vans. Some vans come along with Tow bar, please call to request one.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need a special license to rent a Standard Van?</AccordionTrigger>
            <AccordionContent>
              No, you can drive our vans either on a restricted or full car license.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Is there a mileage limit on Standard Van rentals?</AccordionTrigger>
            <AccordionContent>
              No, all standard vans come with unlimited kilometres.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I rent a Standard Van for long-distance travel?</AccordionTrigger>
            <AccordionContent>
              Yes, our standard vans come with unlimited kilometres.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default StandardVanDetail;
