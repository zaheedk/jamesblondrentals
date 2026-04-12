
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Calendar, Fuel, MapPin, Car, AirVent, Bluetooth, Anchor, Users, Shield, Clock, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageSEO from '@/components/PageSEO';


const Premium12SeatMinibusDetail = () => {
  useEffect(() => {
    document.title = "Hire Premium 12-Seat Minibus New Zealand | LDV Deliver 9 Rental | James Blond";
  }, []);

  // Enhanced vehicle specifications
  const specs = [
    { icon: <Car className="h-5 w-5 text-primary" />, label: "Vehicle Model", value: "LDV Deliver 9" },
    { icon: <Users className="h-5 w-5 text-primary" />, label: "Seating Capacity", value: "12 Passengers" },
    { icon: <Fuel className="h-5 w-5 text-primary" />, label: "Fuel Type", value: "Diesel Engine" },
    { icon: <Car className="h-5 w-5 text-primary" />, label: "Transmission", value: "Automatic" },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Model Year", value: "2024 or Newer" },
    { icon: <MapPin className="h-5 w-5 text-primary" />, label: "Mileage", value: "Unlimited Kilometres" },
  ];

  // Enhanced premium features
  const premiumFeatures = [
    { icon: <AirVent className="h-4 w-4 text-primary" />, label: "Full air conditioning throughout" },
    { icon: <Bluetooth className="h-4 w-4 text-primary" />, label: "Bluetooth connectivity & hands-free calling" },
    { icon: <Anchor className="h-4 w-4 text-primary" />, label: "Heavy-duty tow bar (2000kg capacity)" },
    { icon: <Shield className="h-4 w-4 text-primary" />, label: "Luxury interior with premium seating" },
    { icon: <Users className="h-4 w-4 text-primary" />, label: "Full-height comfortable seats" },
    { icon: <Car className="h-4 w-4 text-primary" />, label: "Latest safety features & technology" },
  ];

  // Popular use cases
  const useCases = [
    { icon: <Users className="h-4 w-4 text-primary" />, title: "Corporate Events", desc: "Executive transport for business meetings and conferences" },
    { icon: <MapPin className="h-4 w-4 text-primary" />, title: "Airport Transfers", desc: "Premium group transfers to/from airports" },
    { icon: <Calendar className="h-4 w-4 text-primary" />, title: "Wedding Parties", desc: "Elegant transport for bridal parties and guests" },
    { icon: <Car className="h-4 w-4 text-primary" />, title: "Tourism Groups", desc: "Comfortable sightseeing tours across New Zealand" },
  ];

  // Comprehensive FAQ
  const faqs = [
    {
      question: "What licence do I need to hire a 12-seat minibus in New Zealand?",
      answer: "You only need a standard New Zealand Class 1 (full) driver's licence to hire and drive our 12-seat minibus. No special endorsements required for vehicles under 3.5 tonnes."
    },
    {
      question: "What makes this Premium 12-seat minibus different?",
      answer: "Our Premium LDV Deliver 9 is our flagship minibus featuring 2024 or newer models with luxury interior appointments, enhanced comfort seating, superior sound insulation, and premium finishes throughout. It's perfect for executive transport and special occasions."
    },
    {
      question: "Are there kilometre restrictions on minibus hire?",
      answer: "No, our Premium 12-seat minibus rental includes unlimited kilometres throughout New Zealand. Drive from Auckland to Wellington, explore the South Island, or take any journey without worrying about distance charges."
    },
    {
      question: "How much luggage space is available?",
      answer: "The LDV Deliver 9 offers generous rear cargo space that can accommodate luggage for all 12 passengers. Perfect for airport transfers, multi-day tours, or events where guests have bags and equipment."
    },
    {
      question: "Can I hire this minibus for multi-day trips?",
      answer: "Absolutely! Our Premium 12-seat minibus is ideal for extended New Zealand road trips. With unlimited kilometres, comfortable seating, and reliable diesel engine, it's perfect for exploring both North and South Islands."
    },
    {
      question: "What's included in the rental price?",
      answer: "Your Premium 12-seat minibus hire includes unlimited kilometres, comprehensive insurance options, 24/7 roadside assistance, and full tank of diesel. Additional extras like GPS navigation and child seats are available."
    },
    {
      question: "Where can I pick up the minibus in New Zealand?",
      answer: "We offer Premium 12-seat minibus pickup from our Auckland, Wellington, and Christchurch locations. Airport pickup and delivery services are available for added convenience."
    },
    {
      question: "Is this minibus suitable for elderly passengers?",
      answer: "Yes, the LDV Deliver 9 features easy entry/exit with lower step height, comfortable full-height seats, and smooth automatic transmission making it ideal for passengers of all ages including seniors."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO title="Premium 12-Seat Minibus Hire | James Blond Rentals" description="Rent a premium 12-seat minibus with enhanced comfort and features. Ideal for executive group transport and VIP events." canonical="/fleet/minibus/premium-12-seat-minibus" />
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/fleet" className="hover:text-primary">Fleet</Link>
          <span>/</span>
          <Link to="/fleet/minibus" className="hover:text-primary">Minibus</Link>
          <span>/</span>
          <span className="text-foreground">Premium 12-Seat Minibus</span>
        </nav>
        <Link to="/fleet/minibus" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Minibus Fleet
        </Link>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="mb-6">
            <Badge variant="outline" className="mb-3 bg-primary/10 text-primary border-primary/20">
              Premium Executive
            </Badge>
            <h1 className="text-4xl font-bold mb-3 text-foreground">
              Premium 12-Seat Minibus Hire New Zealand
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              LDV Deliver 9 - Luxury Group Transport & Executive Travel
            </p>
            <p className="text-lg mb-6">
              Experience the ultimate in group travel comfort with our premium 12-seater minibus rental. 
              Perfect for corporate events, wedding parties, airport transfers, and luxury tourism across New Zealand.
            </p>
          </div>

          <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden mb-6">
            <img 
              src="https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw"
              alt="Premium 12-Seat LDV Deliver 9 Minibus for hire in New Zealand" 
              className="w-full h-full object-cover"
              loading="lazy"
              width="800"
              height="450"
            />
          </AspectRatio>

          {/* Key Benefits */}
          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Our Premium 12-Seat Minibus?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Latest 2024 Models</h3>
                  <p className="text-sm text-muted-foreground">Brand new LDV Deliver 9 with latest safety features and luxury appointments</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Unlimited Kilometres</h3>
                  <p className="text-sm text-muted-foreground">Explore all of New Zealand without distance restrictions or additional charges</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Executive Comfort</h3>
                  <p className="text-sm text-muted-foreground">Luxury interior with premium seating for up to 12 passengers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="bg-card border rounded-lg p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6">Vehicle Specifications</h2>
          
          <div className="space-y-4 mb-8">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="flex items-center space-x-3">
                  {spec.icon}
                  <span className="text-muted-foreground">{spec.label}</span>
                </div>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <Button className="w-full" size="lg" asChild>
              <Link to="/">Get Instant Quote</Link>
            </Button>
            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>

          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-semibold">Need Help?</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Call our minibus rental experts for personalized service
            </p>
            <p className="font-semibold text-primary">0800 525 663</p>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Premium Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Premium Features & Amenities</h2>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto text-muted-foreground">
          Our Premium 12-seat minibus hire comes equipped with luxury features designed to make your group travel experience exceptional.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-card border rounded-lg">
              {feature.icon}
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Use Cases Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Perfect for Every Occasion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-card border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  {useCase.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Detailed Description */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">About Our Premium 12-Seat Minibus</h2>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            The LDV Deliver 9 represents the pinnacle of minibus rental in New Zealand. This premium 12-seater vehicle 
            combines executive comfort with practical functionality, making it the ideal choice for discerning travelers 
            who refuse to compromise on quality.
          </p>
          
          <h3 className="text-2xl font-semibold mb-4">Executive Interior Design</h3>
          <p className="mb-4">
            Step inside and experience luxury travel redefined. Our Premium 12-seat minibus features:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Premium fabric seating with enhanced lumbar support</li>
            <li>Individual armrests and cup holders for each passenger</li>
            <li>Tinted windows for privacy and UV protection</li>
            <li>LED interior lighting for comfortable evening travel</li>
            <li>Multiple USB charging ports throughout the cabin</li>
            <li>Premium sound system with Bluetooth connectivity</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Advanced Safety Features</h3>
          <p className="mb-4">
            Safety is paramount in our Premium 12-seat minibus rental. The LDV Deliver 9 includes:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Electronic Stability Control (ESC)</li>
            <li>Anti-lock Braking System (ABS)</li>
            <li>Multiple airbags throughout the cabin</li>
            <li>Reverse camera and parking sensors</li>
            <li>Advanced driver assistance systems</li>
            <li>Regular safety inspections and maintenance</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4">Efficient Diesel Performance</h3>
          <p className="mb-6">
            The LDV Deliver 9's modern diesel engine delivers exceptional fuel efficiency while providing smooth, 
            quiet operation. With automatic transmission and unlimited kilometres included, you can explore 
            New Zealand's stunning landscapes without worrying about fuel costs or distance charges.
          </p>
        </div>
      </div>

      <Separator className="my-12" />

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto text-muted-foreground">
          Everything you need to know about hiring our Premium 12-seat minibus in New Zealand.
        </p>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Call to Action */}
      <div className="bg-primary/5 rounded-lg p-8 mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Premium Group Travel?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
          Book your Premium 12-seat minibus hire today and discover why businesses and families across 
          New Zealand choose James Blond for their executive group transport needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8" asChild>
            <Link to="/">Book Now - Get Instant Quote</Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link to="/contact">Speak to Our Team</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Available for pickup in Auckland, Wellington & Christchurch
        </p>
      </div>

      {/* Related Links */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Explore Our Full Minibus Fleet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/fleet/minibus/12-seat-minibus" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Car className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Standard 12-Seat Minibus</p>
              <p className="text-sm text-muted-foreground">Toyota Hiace - Reliable & affordable</p>
            </div>
          </Link>
          <Link to="/fleet/minibus/10-seat-minibus" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">10-Seat Minibus</p>
              <p className="text-sm text-muted-foreground">Toyota Hiace ZL - Compact group travel</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Premium12SeatMinibusDetail;
