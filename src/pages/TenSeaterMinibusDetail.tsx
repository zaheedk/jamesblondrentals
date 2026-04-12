
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Calendar, Fuel, MapPin, Car, AirVent, Bluetooth, Anchor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageSEO from '@/components/PageSEO';


const TenSeaterMinibusDetail = () => {
  // Vehicle specifications
  const specs = [
    { icon: <Fuel className="h-5 w-5 text-primary" />, label: "Fuel Type", value: "Petrol" },
    { icon: <Car className="h-5 w-5 text-primary" />, label: "Transmission", value: "Automatic" },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Mileage Charges", value: "Unlimited kilometres" },
  ];

  // Features list
  const features = [
    { icon: <Calendar className="h-4 w-4 text-primary" />, label: "2012 or newer model" },
    { icon: <AirVent className="h-4 w-4 text-primary" />, label: "Full air conditioning" },
    { icon: <Bluetooth className="h-4 w-4 text-primary" />, label: "Bluetooth connectivity" },
    { icon: <Anchor className="h-4 w-4 text-primary" />, label: "Tow bar for extra hauling" },
    { icon: <MapPin className="h-4 w-4 text-primary" />, label: "Full-height seats" },
  ];

  // FAQ items
  const faqs = [
    {
      question: "Can I drive this minibus with a regular licence?",
      answer: "Yes, you can drive this 10-seat minibus with a standard car license (Class 1) in New Zealand."
    },
    {
      question: "Is this a good option for airport or hotel group transfers?",
      answer: "Absolutely! The 10-seater minibus is perfect for airport pickups, hotel transfers, and other group transport needs with its comfortable seating and ample space."
    },
    {
      question: "Does it support long trips across the country?",
      answer: "Yes, with unlimited kilometres included, this minibus is ideal for longer journeys around New Zealand without additional mileage charges."
    },
    {
      question: "Can I tow a trailer with it?",
      answer: "Yes, it comes equipped with a tow bar for light towing."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO title="10-Seat Minibus Hire | James Blond Rentals" description="Hire a 10-seat minibus for medium-sized groups. Comfortable, easy to drive and perfect for day trips and events." canonical="/fleet/minibus/10-seat-minibus" />
      <div className="mb-6">
        <Link to="/fleet/minibus" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Minibuses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">Toyota Hiace ZL</Badge>
            <h1 className="text-3xl font-bold mb-2">10-Seat Minibus</h1>
            <p className="text-lg text-gray-600">Smart Travel for Small Groups</p>
          </div>

          <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img 
              src="/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png"
              alt="10-Seat Toyota Hiace ZL Minibus" 
              className="w-full h-full object-cover"
              loading="lazy"
              width="800" 
              height="450"
            />
          </AspectRatio>

          <div className="prose max-w-none mb-8">
            <p>
              Looking for a reliable and comfortable way to transport a small team or family? The 10-seat Toyota Hiace ZL 
              is the perfect solution. Offering all the essentials – including air conditioning, tow bar, and full-height seats 
              – this minibus is ideal for corporate groups, airport transfers, or weekend adventures.
            </p>
            <p>
              Enjoy peace of mind with automatic transmission, a petrol engine, and unlimited kilometres so you can travel 
              farther without added costs.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Vehicle Specifications</h2>
          
          <div className="grid gap-4 mb-8">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-md shadow-sm">
                <div className="flex-shrink-0 mr-3">
                  {spec.icon}
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-600">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-md shadow-sm">
                <div className="flex-shrink-0 mr-2">
                  {feature.icon}
                </div>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg" asChild>
            <Link to="/">Book Now</Link>
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="bg-primary/5 rounded-lg p-6 mb-12">
        <h2 className="text-xl font-semibold mb-3">Ready to Book?</h2>
        <p className="mb-4">
          Our 10-Seat Minibus is perfect for small group travel of all kinds. Reserve yours today and enjoy a comfortable, 
          hassle-free journey with your team, friends, or family.
        </p>
        <Button size="lg" asChild>
          <Link to="/">Check Availability</Link>
        </Button>
      </div>
    </div>
  );
};

export default TenSeaterMinibusDetail;
