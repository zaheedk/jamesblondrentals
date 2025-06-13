
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Calendar, Fuel, MapPin, Car, AirVent, Bluetooth, Anchor } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TwelveSeaterMinibusDetail = () => {
  // Vehicle specifications
  const specs = [
    { icon: <Fuel className="h-5 w-5 text-primary" />, label: "Fuel Type", value: "Diesel" },
    { icon: <Car className="h-5 w-5 text-primary" />, label: "Transmission", value: "Automatic & Manual" },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Mileage Charges", value: "Unlimited kilometres" },
  ];

  // Features list
  const features = [
    { icon: <Calendar className="h-4 w-4 text-primary" />, label: "2017 or newer model" },
    { icon: <AirVent className="h-4 w-4 text-primary" />, label: "Full air conditioning" },
    { icon: <Bluetooth className="h-4 w-4 text-primary" />, label: "Bluetooth connectivity" },
    { icon: <Anchor className="h-4 w-4 text-primary" />, label: "Tow bar & cargo barrier" },
    { icon: <MapPin className="h-4 w-4 text-primary" />, label: "Full-height seats" },
  ];

  // FAQ items
  const faqs = [
    {
      question: "Do I need a special licence to drive this minibus?",
      answer: "No, you only need a standard car license (Class 1) to drive this 12-seater minibus in New Zealand."
    },
    {
      question: "Can I take this vehicle on long-distance trips?",
      answer: "Absolutely! The 12-seater comes with unlimited kilometres, making it perfect for long road trips throughout New Zealand."
    },
    {
      question: "Does it have luggage space?",
      answer: "Yes, there is adequate luggage space available at the rear of the vehicle, perfect for storing bags, equipment, or other travel essentials."
    },
    {
      question: "Is this vehicle suitable for airport transfers or group charters?",
      answer: "Yes! It's commonly used for airport shuttles, wedding guest transport, and corporate outings."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/fleet/minibus" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Minibuses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">LDV Deliver 9</Badge>
            <h1 className="text-3xl font-bold mb-2">12-Seat Minibus</h1>
            <p className="text-lg text-gray-600">Group Travel Made Easy</p>
          </div>

          <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img 
              src="/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
              alt="12-Seat LDV Deliver 9 Minibus" 
              className="w-full h-full object-cover"
              loading="lazy"
              width="800"
              height="450"
            />
          </AspectRatio>

          <div className="prose max-w-none mb-8">
            <p>
              Whether you're planning a group adventure, corporate event, or family trip, our 12-seater LDV Deliver 9 
              offers the perfect combination of comfort, practicality, and performance. With full-height seats, modern features, 
              and a spacious interior, it's designed to keep everyone happy on the road.
            </p>
            <p>
              Choose between automatic or manual transmission, and enjoy seamless travel throughout New Zealand with unlimited kilometres.
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
          Our 12-Seat Minibus is perfect for group travel of all kinds. Reserve yours today and enjoy a comfortable, 
          spacious journey with your team, friends, or family.
        </p>
        <Button size="lg" asChild>
          <Link to="/">Check Availability</Link>
        </Button>
      </div>
    </div>
  );
};

export default TwelveSeaterMinibusDetail;
