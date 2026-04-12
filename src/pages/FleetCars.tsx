
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PageSEO from '@/components/PageSEO';


const cars = [
  {
    id: "premium-economy",
    title: "PREMIUM ECONOMY",
    subtitle: "Suzuki Swift 1.3L",
    specs: [
      "5 Door Hatchback",
      "Automatic Transmission",
      "AUX/USB/Bluetooth",
      "Air Conditioning",
      "5 Star Fuel Economy",
      "Reversing Camera",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/e7217b00-38b3-40d6-9ef7-fdc2760ee602.png"
  },
  {
    id: "premium-economy-wagon",
    title: "PREMIUM ECONOMY WAGON",
    subtitle: "Toyota Corolla Wagon 1.5L",
    specs: [
      "5 Door Wagon",
      "Automatic Transmission",
      "AUX/USB/Bluetooth",
      "Air Conditioning",
      "5 Star Fuel Economy",
      "Reversing Camera",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/9b8d1865-27f0-467a-a59e-aff51e626e79.png"
  },
  {
    id: "premium-compact-suv",
    title: "PREMIUM COMPACT SUV",
    subtitle: "Kia Seltos 2.0L",
    specs: [
      "5 Door SUV",
      "Automatic Transmission",
      "Apple CarPlay & Android Auto",
      "Smart Cruise Control",
      "Lane Assist",
      "Dual-Zone Air Conditioning",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/bdb0efeb-afa5-4ce7-b1fc-aace84a0222f.png"
  },
  {
    id: "premium-2wd-suv",
    title: "PREMIUM 5-SEAT SUV",
    subtitle: "Kia Sportage 2.0L",
    specs: [
      "5 Door SUV",
      "Automatic Transmission",
      "Apple CarPlay & Android Auto",
      "Smart Cruise Control",
      "Lane Assist",
      "Dual-Zone Air Conditioning",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/841454d4-8948-4c3b-ad99-d73b843deee8.png"
  },
  {
    id: "premium-awd-suv",
    title: "PREMIUM AWD SUV",
    subtitle: "Toyota Highlander 3.5L V6",
    specs: [
      "5 Door SUV",
      "Automatic Transmission",
      "AUX/USB/Bluetooth",
      "7 Seat Option (reduces boot space)",
      "5 Star ANCAP Safety Rating",
      "7 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/b6590bc2-c772-4b70-892b-9a5c173c4d15.png"
  }
];

const FleetCars = () => {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Cars for Hire – SUVs, Sedans & Economy | James Blond" description="Browse our range of rental cars including premium SUVs, compact SUVs, midsize sedans and economy vehicles across NZ." canonical="/fleet/cars" />
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Bargain Premium Car Rentals in New Zealand</h1>
      <p className="text-lg text-gray-700">
        Hire a compact, wagon, or SUV at affordable rates.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Card key={car.id} className="flex flex-col h-full">
          {car.image && (
            <AspectRatio ratio={4/3} className="w-full">
              <img 
                src={car.image} 
                alt={`${car.title}`} 
                className={`w-full h-full rounded-t-lg ${
                  car.id === 'premium-economy-wagon' 
                    ? 'object-contain bg-gray-50' 
                    : 'object-cover'
                }`}
                loading="lazy"
                width="400"
                height="300"
              />
            </AspectRatio>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">{car.title}</CardTitle>
            <CardDescription className="text-xl font-semibold">{car.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {car.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{spec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to={`/fleet/cars/${car.id}`} className="w-full">
              <Button variant="outline" className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>

    {/* FAQ Section */}
    <section className="mt-16 border-t pt-8">
      <Collapsible open={faqOpen} onOpenChange={setFaqOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full mb-6 text-left group">
          <div>
            <h2 className="text-xl font-bold mb-2">Car Rental FAQ</h2>
            <p className="text-muted-foreground text-sm">
              Get answers to common questions about car rentals in Auckland
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform ${faqOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <div className="max-w-4xl">
            <Accordion type="single" collapsible className="w-full text-sm">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-sm font-medium">What do I need to rent a car in Auckland from James Blond?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  You'll need a valid full driver's licence (international licences are welcome), photo ID, and a credit or debit card.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-sm font-medium">Is there a minimum age requirement to hire a car?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Yes, you must be at least 21 years old to rent a car from us. Drivers under 25 may incur a young driver surcharge.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-sm font-medium">Are there any mileage limits on rental cars?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  All our rental cars come with generous mileage limits. Some vehicles offer unlimited kilometres — check your booking details or ask us directly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-sm font-medium">Can I rent a car for just one day?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Absolutely. We offer flexible rental durations — whether it's just for a day, a weekend, or a longer trip.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-sm font-medium">Do your cars come with insurance?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Yes, all vehicles include standard insurance. You can choose to upgrade for additional protection and lower excess.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-sm font-medium">Can I take the rental car outside Auckland?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Yes, you're free to explore New Zealand. Just let us know if you're planning long-distance travel so we can guide you on the best vehicle options.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left text-sm font-medium">How much does it cost to rent a car in Auckland?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Prices vary based on vehicle type, duration, and season. Use our online booking tool or call us on 0800 525 663 for an instant quote.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left text-sm font-medium">Can I add an extra driver to my rental?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Yes, additional drivers can be added for a small fee. All drivers must present their licence at pickup.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left text-sm font-medium">What happens if I return the car late?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  We allow a grace period, but late returns may incur extra charges. It's best to notify us in advance if there's a delay.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left text-sm font-medium">Do you offer child seats or GPS add-ons?</AccordionTrigger>
                <AccordionContent className="text-left text-sm">
                  Yes, we have child seats, GPS units, and other accessories available. Add them when booking or request at pickup.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  </div>
  );
};

export default FleetCars;
