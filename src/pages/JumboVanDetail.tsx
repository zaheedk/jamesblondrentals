
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
import PageSEO from '@/components/PageSEO';


const JumboVanDetail = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageSEO title="Jumbo Van Hire – Extra Large Cargo Van | James Blond" description="Rent a jumbo van for maximum cargo capacity. Ideal for large deliveries, furniture moves and commercial logistics." canonical="/fleet/vans/jumbo-van" />
      <div className="mb-8">
        <Link to="/fleet/vans" className="text-primary hover:underline">&larr; Back to Vans</Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Power & Efficiency – Jumbo Diesel Van Rentals</h1>
          <p className="text-lg text-gray-700 mb-6">
            Our Jumbo Diesel Vans are built for those who need extra space and fuel efficiency for long hauls. 
            Whether you're transporting goods, moving bulky cargo, or require a spacious vehicle for commercial use, 
            our diesel vans provide the perfect balance of power and economy.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Designed for reliability and performance, our fleet ensures smooth handling and maximum load capacity. 
            Whether for business or personal use, our Jumbo Diesel Van rentals offer a dependable solution. 
            Explore our options and discover why we are the top choice for diesel van hire.
          </p>
        </div>
        
        <div className="relative">
          <img 
            src="/lovable-uploads/6dde201c-13f3-4671-9e88-6cc1a388d647.png" 
            alt="Jumbo Diesel Van" 
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
            <p className="text-lg">Manual & Automatic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Gauge className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mileage Charges</h3>
            <p className="text-lg">39c/km Mileage</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Box className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Max Load</h3>
            <p className="text-lg">1350kg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Box className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cargo Space</h3>
            <p className="text-lg">3300(L) x 1600(W) x 1700(H)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Wind className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Additional Features</h3>
            <ul className="text-lg">
              <li>Twin Side Doors</li>
              <li>Air conditioning</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-700 mb-6">You need to know about service</p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What are the key features of the Jumbo Diesel Van?</AccordionTrigger>
            <AccordionContent>
              Our Jumbo Diesel Vans feature spacious cargo areas (3300L x 1600W x 1700H), twin side doors for easy access, 
              air conditioning for comfort, and can carry loads up to 1350kg. They're perfect for moving large items or 
              commercial transportation needs.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need a special license to rent a Jumbo Diesel Van?</AccordionTrigger>
            <AccordionContent>
              A standard driver's license is sufficient for renting our Jumbo Diesel Vans. However, we recommend 
              having experience with larger vehicles as they require more skill to maneuver than standard cars.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>What is the fuel efficiency of the Jumbo Diesel Van?</AccordionTrigger>
            <AccordionContent>
              Our Jumbo Diesel Vans are designed for optimal fuel efficiency despite their size. While consumption 
              varies based on load and driving conditions, their diesel engines typically offer better mileage for 
              long-distance journeys compared to equivalent petrol vans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Can I use the Jumbo Diesel Van for interstate or commercial transport?</AccordionTrigger>
            <AccordionContent>
              Yes, our Jumbo Diesel Vans are suitable for both personal and commercial use, including interstate travel. 
              For cross-border transport, additional documentation and insurance may be required.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default JumboVanDetail;
