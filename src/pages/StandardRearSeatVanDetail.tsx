
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

const StandardRearSeatVanDetail = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/fleet/vans" className="text-primary hover:underline">&larr; Back to Vans</Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Comfort & Versatility – Standard Rear Seat Van Rentals</h1>
          <p className="text-lg text-gray-700 mb-6">
            Our Standard Rear Seat Vans provide a spacious and comfortable seating arrangement, making them ideal for group travel, family outings, or business transportation. With ample legroom and flexible seating configurations, these vans ensure a smooth and enjoyable ride for all passengers.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Designed for convenience and reliability, our fleet is perfect for both short and long-distance trips. Whether you need a van for airport transfers, corporate use, or group adventures, our Standard Rear Seat Vans offer the perfect solution. Explore our rental options and travel in comfort today!
          </p>
        </div>
        
        <div className="relative">
          <img 
            src="/lovable-uploads/7924107a-afb6-4c13-aa1d-8dba18465760.png" 
            alt="Standard Rear Seat Van" 
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
            <p className="text-lg">Automatic Transmission</p>
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
            <p className="text-lg">1900(L) x 1400(W) x 1500(H)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Wind className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Additional Features</h3>
            <ul className="text-lg">
              <li>Air conditioning</li>
              <li>Cargo van with extra row of seats</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-700 mb-6">You need to know about Standard Rear Seat Van Rentals</p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is there space for luggage in the Standard Rear Seat Van?</AccordionTrigger>
            <AccordionContent>
              Yes, our Standard Rear Seat Vans offer ample luggage space despite having an extra row of seats. The cargo area measures 1900(L) x 1400(W) x 1500(H), providing plenty of room for your belongings.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need a special license to drive a Standard Rear Seat Van?</AccordionTrigger>
            <AccordionContent>
              No, you can drive our Standard Rear Seat Vans with a standard car license, as they're designed for easy operation by regular drivers.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I rent a Standard Rear Seat Van for long-distance travel?</AccordionTrigger>
            <AccordionContent>
              Absolutely! Our vans are perfect for long trips and are available with flexible mileage options. Let us know your travel plans to find the best rental package for you.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default StandardRearSeatVanDetail;
