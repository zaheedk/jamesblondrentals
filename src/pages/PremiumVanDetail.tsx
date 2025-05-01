
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

const PremiumVanDetail = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/fleet/vans" className="text-primary hover:underline">&larr; Back to Vans</Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Experience Premium Van Rentals</h1>
          <p className="text-lg text-gray-700 mb-6">
            We offer a versatile range of van rental services tailored to meet all your transportation needs. 
            Whether you're moving cargo, planning a group trip, or need a spacious vehicle for business purposes, 
            we have the ideal solution for you.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our fleet includes well-maintained vans designed for both personal and commercial use, 
            ensuring reliability and comfort. Whether you need a van for a family outing, corporate transport, 
            or logistics, our services are customised to meet your needs. Discover our premium van rental options 
            and why we are the preferred choice for van hire.
          </p>
        </div>
        
        <div className="relative">
          <img 
            src="/lovable-uploads/3cb301ec-ead2-492a-a9a0-3361c1876b76.png" 
            alt="Premium Van" 
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
            <p className="text-lg">Automatic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Gauge className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mileage Charges</h3>
            <p className="text-lg">Unlimited kilometres</p>
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
            <p className="text-lg">2800(L) x 1400(W) x 1500(H)</p>
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
            <AccordionTrigger>What types of premium vans are available for rent?</AccordionTrigger>
            <AccordionContent>
              Our premium van fleet includes Toyota Hiace 2.7L petrol vans with automatic transmission, 
              designed for optimum performance and comfort during your rental period.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need a special license to rent a premium van?</AccordionTrigger>
            <AccordionContent>
              No, our premium vans can be driven on a standard car license. 
              You just need a valid driver's license that you've held for at least 12 months.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Are there any mileage limits on premium van rentals?</AccordionTrigger>
            <AccordionContent>
              No, our premium van rentals come with unlimited kilometers, 
              so you can travel as far as you need without incurring additional charges.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I take a premium van on long-distance or international trips?</AccordionTrigger>
            <AccordionContent>
              Yes, our premium vans are available for long-distance rentals. 
              However, international travel may require additional permissions, insurance, and documentation. 
              Please inform us in advance if you plan to travel across borders.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PremiumVanDetail;
