
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LazyImage } from "@/components/LazyImage";

const ThreeTonneBoxTailLiftDetail = () => {
  const specs = [
    { label: "Fuel Type", value: "Diesel" },
    { label: "Transmission", value: "Automatic" },
    { label: "Mileage Charges", value: "61c per km mileage charge" },
    { label: "Max Load", value: "3000kg" },
    { label: "Box Dimensions", value: "4400(L) x 2100(W) x 2050(H)" },
    { label: "Max Tail Lift Load", value: "400kg" },
    { label: "License Required", value: "Class-2 (HT) license" }
  ];

  const additionalFeatures = [
    "Hydraulic Tail Lift"
  ];

  const faqs = [
    {
      question: "What are the benefits of renting a truck with a tail lift?",
      answer: "A tail lift provides significant ergonomic advantages, reducing the physical strain of loading and unloading heavy items. It allows for easy handling of palletized goods, heavy equipment, and bulky furniture without requiring a loading dock or ramp. This feature saves time, reduces labor costs, and minimizes the risk of injury or damage to your goods."
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
      answer: "Yes, a 61c per km mileage charge applies. Pricing may vary based on availability, so please confirm at the time of booking."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/fleet/trucks">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trucks
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">3 Tonne Box Truck (18m³) + Tail Lift</h1>
        <p className="text-lg text-gray-700 mb-4">High-Capacity & Convenient – Perfect for Large Cargo Transport</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <LazyImage 
              src="/lovable-uploads/4506c6fc-4eef-4997-a040-7482f1872bab.png" 
              alt="3 Tonne Box Truck with Tail Lift - 18m³ cargo capacity for large deliveries" 
              className="w-full h-full"
              width={1200}
              height={675}
              loading="eager"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p>
              Our 3 Tonne Box Truck (18m³) with Tail Lift is the ideal solution for large cargo transport, removals, and business deliveries. Equipped with an automatic transmission and a hydraulic tail lift with a 400kg capacity, this truck makes loading and unloading heavy items effortless.
            </p>
            <p>
              With a 4400mm (L) x 2100mm (W) x 2050mm (H) box size and a maximum load capacity of 3000kg, it provides ample space for bulkier goods while ensuring smooth handling on the road. A Class-2 (HT) license is required to operate this vehicle. Rent one today for efficient and stress-free transportation!
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
          <h3 className="text-xl font-bold mb-4">About the 3 Tonne Box Truck (18m³) with Tail Lift</h3>
          <div className="prose max-w-none">
            <p>
              The 3 Tonne Box Truck (18m³) with Tail Lift is our premium heavy-duty transportation solution, designed for businesses and individuals who need to move larger loads with ease and efficiency.
            </p>
            <h4 className="text-lg font-semibold mt-4">Perfect For:</h4>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Commercial deliveries and distribution</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Large home or office relocations</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Transporting heavy machinery or equipment</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Retail inventory transport</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Event equipment and supplies transportation</span>
              </li>
            </ul>
            <p className="mt-4">
              With its spacious cargo area and convenient hydraulic tail lift, this truck provides a professional solution for your heavy-duty transportation needs. The automatic transmission ensures a comfortable driving experience, even for longer journeys.
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

      <div className="bg-primary/5 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">Ready to Rent?</h3>
        <p className="mb-4">Contact us today to check availability and book your 3 Tonne Box Truck with Tail Lift rental.</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/fleet">Explore Other Vehicles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThreeTonneBoxTailLiftDetail;
