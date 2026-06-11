import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LazyImage } from "@/components/LazyImage";
import PageSEO from '@/components/PageSEO';


const ThreeTonneBox19m3Detail = () => {
  const specs = [
    { label: "Engine", value: "3.0L Diesel Turbo" },
    { label: "Fuel Type", value: "Diesel" },
    { label: "Transmission", value: "Automatic" },
    { label: "Mileage Charges", value: "62c per km mileage charge" },
    { label: "Max Load", value: "3800kg" },
    { label: "Box Dimensions", value: "4800(L) x 2100(W) x 2100(H)" },
    { label: "License Required", value: "Class-2 (HT) license" }
  ];

  const additionalFeatures = [
    "Hydraulic Tail Lift"
  ];

  const faqs = [
    {
      question: "What are the benefits of the 3 Tonne Box Truck (19m³)?",
      answer: "The 3 Tonne Box Truck (19m³) offers exceptional cargo capacity with its spacious 19m³ box, making it ideal for large-scale moves, business logistics, and commercial deliveries. Its powerful 3.0L diesel turbo engine provides excellent pulling power while maintaining fuel efficiency, and the automatic transmission ensures a comfortable driving experience. The truck's hydraulic tail lift adds convenience for loading and unloading heavy items without manual lifting."
    },
    {
      question: "What license is required to drive this truck?",
      answer: "This vehicle requires a Class-2 (HT) license to operate legally. This is because the truck exceeds the weight limits for a standard car license. Please ensure you or your designated driver has the appropriate license before renting."
    },
    {
      question: "What is the maximum weight the tail lift can handle?",
      answer: "The hydraulic tail lift has a maximum capacity of 400kg. This is sufficient for most large appliances, furniture items, and palletized goods. For safety reasons, please do not exceed this weight limit when using the tail lift."
    },
    {
      question: "Is there a mileage charge for this truck rental?",
      answer: "Yes, a 62c per km mileage charge applies. Pricing may vary based on availability, so please confirm at the time of booking."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="3-Tonne Box Truck 19m³ Hire | James Blond Rentals" description="Hire our largest box truck – 3-tonne 19m³ for maximum cargo capacity. Ideal for large house moves and business logistics." canonical="/fleet/trucks/3-tonne-box-19m3" />
      <div className="mb-6">
        <Link to="/fleet/trucks">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trucks
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">3 Tonne Box Truck (19m³) + Tail Lift</h1>
        <p className="text-lg text-gray-700 mb-4">Heavy-Duty & Spacious – Perfect for Commercial Transport</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <LazyImage 
              src="/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png" 
              alt="3 Tonne Box Truck with Tail Lift - 19m³ cargo capacity for commercial transport" 
              className="w-full h-full"
              width={1200}
              height={675}
              loading="eager"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p>
              Our 3 Tonne Box Truck (19m³) with Tail Lift is designed for large cargo transport, removals, and commercial deliveries. Powered by a 3.0L diesel turbo engine and equipped with an automatic transmission, this truck provides a powerful and fuel-efficient transport solution. The hydraulic tail lift makes loading and unloading heavy cargo effortless.
            </p>
            <p>
              With a 4800mm (L) x 2100mm (W) x 2100mm (H) box size and a maximum load capacity of 3800kg, this truck is perfect for businesses and individuals needing a high-capacity vehicle. A Class-2 (HT) license is required to operate this vehicle. Rent one today and move heavy loads with ease!
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Vehicle Specifications</h2>
          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex justify-between border-b pb-2">
                <span className="text-gray-600">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>

          {additionalFeatures.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Additional Features</h3>
              <ul className="space-y-2">
                {additionalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-10">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="p-4 bg-white rounded-lg shadow-sm mt-2">
          <h3 className="text-xl font-bold mb-4">About the 3 Tonne Box Truck (19m³) with Tail Lift</h3>
          <div className="prose max-w-none">
            <p>
              The 3 Tonne Box Truck (19m³) with Tail Lift is our premium heavy-duty transportation solution, designed for businesses and individuals who need to move larger loads with ease and efficiency.
            </p>
            <h4 className="text-lg font-semibold mt-4">Perfect For:</h4>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Large-scale commercial deliveries</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Complete office or warehouse relocations</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Heavy machinery or equipment transport</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Logistics and distribution operations</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Building materials and construction supply delivery</span>
              </li>
            </ul>
            <p className="mt-4">
              With its spacious 19m³ cargo area, powerful diesel turbo engine, and convenient hydraulic tail lift, this truck provides a professional solution for your heavy-duty transportation needs. The automatic transmission ensures a comfortable driving experience, even for longer journeys.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="faq" className="p-4 bg-white rounded-lg shadow-sm mt-2">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold">{faq.question}</h4>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-primary/5 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">Related City Links</h2>
        <p className="text-gray-700 mb-4">
          The 3 Tonne Box Truck (19m³) is our largest capacity truck, popular for major commercial relocations and logistics. Find local availability in these key locations.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland Truck Hire</Link>
          <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington Truck Hire</Link>
          <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch Truck Hire</Link>
          <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton Truck Hire</Link>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-6">Truck Hire by Location — FAQs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Where can I hire a 3-tonne truck with tail lift in New Zealand?</h3>
              <p className="text-gray-700">
                James Blond Rentals offers 3-tonne box trucks with tail lifts in major centres including <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland</Link>, <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington</Link>, <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch</Link>, and <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton</Link>. Book online or call your nearest branch.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Do I need a Class-2 licence to hire a 3-tonne truck in Auckland?</h3>
              <p className="text-gray-700">
                Yes, our 3-tonne trucks require a Class-2 (HT) licence to operate legally in Auckland and all other NZ locations. Please ensure your driver holds the correct licence before booking. Visit our <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland truck hire page</Link> for details.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Is a 3-tonne truck suitable for commercial moves in Wellington?</h3>
              <p className="text-gray-700">
                Yes, the 3-tonne box truck with tail lift is perfect for commercial relocations, freight transport, and large deliveries in <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington</Link>. The 19m³ capacity and hydraulic tail lift make heavy loading easy.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Can I hire a 3-tonne truck for business deliveries in Christchurch?</h3>
              <p className="text-gray-700">
                Absolutely. Our 3-tonne trucks are popular with businesses for inventory transport, distribution, and large-scale deliveries in <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch</Link> and <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">central Christchurch</Link>. Book online or call for corporate rates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold mb-3">Truck Hire Locations</h2>
        <p className="text-gray-700 mb-4">
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

      <div className="bg-primary/5 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">Ready to Rent?</h3>
        <p className="mb-4">Contact us today to check availability and book your 3 Tonne Box Truck (19m³) with Tail Lift rental.</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/fleet">Explore Other Vehicles</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 bg-primary text-primary-foreground rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Get a Quote & Book Now</h2>
        <p className="mb-6 opacity-90 max-w-2xl mx-auto">
          Ready to hire this 3-tonne truck? A Class-2 (HT) licence is required. Choose your nearest branch for local rates, live availability, and instant booking.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/auckland-truck-rentals?truck=3-tonne-box-19m3#booking">Auckland Truck Hire</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/wellington-truck-rentals?truck=3-tonne-box-19m3#booking">Wellington Truck Hire</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/christchurch-truck-rentals?truck=3-tonne-box-19m3#booking">Christchurch Truck Hire</Link>
          </Button>
          <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Link to="/hamilton-truck-rentals?truck=3-tonne-box-19m3#booking">Hamilton Truck Hire</Link>
          </Button>
        </div>
        <p className="text-sm opacity-80">
          Not sure which location? <Link to="/truck-hire" className="underline hover:no-underline">View all truck hire locations</Link> or <Link to="/contact" className="underline hover:no-underline">contact us</Link> for help.
        </p>
      </div>
    </div>
  );
};

export default ThreeTonneBox19m3Detail;
