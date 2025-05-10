import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Calendar, Fuel, MapPin, Car, AirVent, Bluetooth, Anchor } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Premium12SeatMinibusDetail = () => {
  // Vehicle specifications
  const specs = [
    { icon: <Fuel className="h-5 w-5 text-primary" />, label: "Fuel Type", value: "Diesel" },
    { icon: <Car className="h-5 w-5 text-primary" />, label: "Transmission", value: "Automatic" },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Mileage Charges", value: "Unlimited kilometres" },
  ];

  // Features list
  const features = [
    { icon: <Calendar className="h-4 w-4 text-primary" />, label: "2024 or newer model" },
    { icon: <AirVent className="h-4 w-4 text-primary" />, label: "Full air conditioning" },
    { icon: <Bluetooth className="h-4 w-4 text-primary" />, label: "Bluetooth connectivity" },
    { icon: <Anchor className="h-4 w-4 text-primary" />, label: "Tow bar included" },
    { icon: <MapPin className="h-4 w-4 text-primary" />, label: "Luxury interior" },
  ];

  // FAQ items
  const faqs = [
    {
      question: "Do I need a special licence to drive this minibus?",
      answer: "No, you only need a standard car license (Class 1) to drive this premium 12-seater minibus in New Zealand."
    },
    {
      question: "What makes this the premium version?",
      answer: "The LDV Deliver 9 is our newest model (2024 or newer) with luxury interior features, enhanced comfort, and a superior driving experience."
    },
    {
      question: "Can I take this vehicle on long-distance trips?",
      answer: "Absolutely! The Premium 12-seater comes with unlimited kilometres, making it perfect for long road trips throughout New Zealand."
    },
    {
      question: "Does it have luggage space?",
      answer: "Yes, the LDV Deliver 9 offers excellent luggage space at the rear of the vehicle, perfect for storing bags, equipment, or other travel essentials."
    },
    {
      question: "Is this vehicle suitable for corporate events?",
      answer: "Yes! It's our top recommendation for corporate transport, airport transfers, and VIP group travel."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/fleet/minibuses" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Minibuses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2 bg-primary/10">Premium</Badge>
            <h1 className="text-3xl font-bold mb-2">Premium 12-Seat Minibus</h1>
            <p className="text-lg text-gray-600">LDV Deliver 9 - Executive Group Travel</p>
          </div>

          <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img 
              src="/lovable-uploads/6a274083-edb0-4ac2-8e40-4ac3703a8660.png"
              alt="Premium 12-Seat LDV Deliver 9 Minibus" 
              className="w-full h-full object-cover"
              loading="lazy"
              width="800"
              height="450"
            />
          </AspectRatio>

          <div className="prose max-w-none mb-8">
            <p>
              Elevate your group travel experience with our premium 12-seater LDV Deliver 9. 
              This 2024 or newer model features luxury interior appointments, enhanced comfort seating, 
              and a smooth, quiet ride that makes it perfect for executive transport, special occasions, 
              and premium group travel.
            </p>
            <p>
              With automatic transmission and unlimited kilometres, the Premium 12-Seat Minibus provides 
              the ultimate in group travel comfort and convenience throughout New Zealand.
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

          <h2 className="text-xl font-semibold mb-4">Premium Features</h2>
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
        <h2 className="text-xl font-semibold mb-3">Ready for Premium Group Travel?</h2>
        <p className="mb-4">
          Our Premium 12-Seat Minibus offers the highest level of comfort for group travel. 
          Perfect for executive transport, special events, and occasions where you want to make an impression.
        </p>
        <Button size="lg" asChild>
          <Link to="/">Check Availability</Link>
        </Button>
      </div>
    </div>
  );
};

export default Premium12SeatMinibusDetail;
