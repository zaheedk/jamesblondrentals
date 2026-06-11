
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
import { Button } from "@/components/ui/button";
import PageSEO from '@/components/PageSEO';


const TwoTonneBox16m3Detail = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageSEO title="2-Tonne Box Truck 16m³ Hire | James Blond Rentals" description="Hire a large 2-tonne 16m³ box truck for house moves and big deliveries. Maximum cargo space on a car licence." canonical="/fleet/trucks/2-tonne-box-16m3" />
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

      <div className="mt-12 bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-6">Truck Hire by Location — FAQs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Where can I hire a 2-tonne box truck in New Zealand?</h3>
              <p className="text-lg text-gray-700">
                James Blond Rentals offers 2-tonne box trucks across multiple locations including <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland</Link>, <Link to="/west-auckland-truck-rentals" className="text-primary hover:underline">West Auckland</Link>, <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington</Link>, <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch</Link>, <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">Central Christchurch</Link>, and <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton</Link>. Book online or call your nearest branch.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">How much does it cost to hire a truck in Auckland?</h3>
              <p className="text-lg text-gray-700">
                2-tonne truck hire rates in Auckland depend on rental duration and mileage. Daily rates are competitive with a per-km charge (47c/km for this model). Visit our <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland truck hire page</Link> for current pricing or request a quote.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Can I pick up a truck in Christchurch city centre?</h3>
              <p className="text-lg text-gray-700">
                Yes, we offer convenient <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">central Christchurch truck hire</Link> as well as wider <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch</Link>. Same-day pickup is often available when you book in advance.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Do I need a special licence to hire a truck in Wellington?</h3>
              <p className="text-lg text-gray-700">
                No — our 2-tonne box trucks can be driven on a standard car licence in Wellington and all other NZ locations. For larger 3-tonne trucks, a Class-2 (HT) licence is required. See our <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington truck hire page</Link> for more details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-primary/5 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">Related City Links</h2>
        <p className="text-lg text-gray-700 mb-4">
          The 2 Tonne Box Truck (16m³) offers maximum cargo space on a car licence, making it a top choice for large house moves. Find local availability in these popular locations.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland Truck Hire</Link>
          <Link to="/west-auckland-truck-rentals" className="text-primary hover:underline">West Auckland</Link>
          <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington Truck Hire</Link>
          <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch Truck Hire</Link>
          <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">Central Christchurch</Link>
          <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton Truck Hire</Link>
        </div>
      </div>

      <div className="mt-12 bg-muted/30 rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4">Truck Hire Locations</h2>
        <p className="text-lg text-gray-700 mb-4">
          This truck is available across our nationwide branches. Explore our truck hire hub and city pages for local rates and availability.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/truck-hire" className="text-primary hover:underline">Truck Hire NZ</Link>
          <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland Truck Hire</Link>
          <Link to="/west-auckland-truck-rentals" className="text-primary hover:underline">West Auckland</Link>
          <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington Truck Hire</Link>
          <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch Truck Hire</Link>
          <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">Central Christchurch</Link>
          <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton Truck Hire</Link>
        </div>
      </div>

      <div className="mt-12 bg-primary text-primary-foreground rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Get a Quote & Book Now</h2>
        <p className="mb-6 opacity-90 max-w-2xl mx-auto">
          Ready to hire this 2-tonne box truck? Choose your nearest branch for local rates, live availability, and instant booking.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/auckland-truck-rentals">Auckland Truck Hire</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/west-auckland-truck-rentals">West Auckland</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/wellington-truck-rentals">Wellington Truck Hire</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/christchurch-truck-rentals">Christchurch Truck Hire</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/central-christchurch-truck-hire">Central Christchurch</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/hamilton-truck-rentals">Hamilton Truck Hire</Link>
          </Button>
        </div>
        <p className="text-sm opacity-80">
          Not sure which location? <Link to="/truck-hire" className="underline hover:no-underline">View all truck hire locations</Link> or <Link to="/contact" className="underline hover:no-underline">contact us</Link> for help.
        </p>
      </div>
    </div>
  );
};

export default TwoTonneBox16m3Detail;
