
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PageSEO from '@/components/PageSEO';


const TwoTonneTipperDetail = () => {
  const specs = [
    { label: "Fuel Type", value: "Diesel" },
    { label: "Transmission", value: "Manual" },
    { label: "Mileage Charges", value: "39c per km mileage charge" },
    { label: "Max Load", value: "2000kg" },
    { label: "Tray Area", value: "3100(L) x 1600(W)" }
  ];

  const additionalFeatures = [
    "Air conditioning"
  ];

  const faqs = [
    {
      question: "What is a tipper truck used for?",
      answer: "A tipper truck is primarily used for transporting loose materials like soil, sand, gravel, and construction debris. The hydraulic tipping mechanism allows for quick and effortless unloading, making it ideal for construction sites, landscaping projects, and waste removal."
    },
    {
      question: "Do I need a special license to drive this truck?",
      answer: "No, our 2 Tonne Tipper Truck can be driven on a standard car license (Class 1). This makes it accessible for both professional contractors and DIY enthusiasts."
    },
    {
      question: "What is the maximum load capacity of the tipper truck?",
      answer: "The maximum load capacity is 2000kg (2 tonnes), making it suitable for transporting substantial amounts of materials while remaining manageable to drive."
    },
    {
      question: "Is there a mileage charge for this rental?",
      answer: "Yes, a 39c per km mileage charge applies. Pricing may vary based on availability, so please confirm at the time of booking."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="2-Tonne Tipper Truck Hire | James Blond Rentals" description="Rent a 2-tonne tipper truck for landscaping, rubbish removal and construction. Easy hydraulic tipping mechanism." canonical="/fleet/trucks/2-tonne-tipper" />
      <div className="mb-6">
        <Link to="/fleet/trucks">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trucks
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">2 Tonne Tipper Truck</h1>
        <p className="text-lg text-gray-700 mb-4">Heavy-Duty & Efficient – Perfect for Construction and Landscaping Projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <AspectRatio ratio={16/9} className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src="/lovable-uploads/ca896f7e-9bda-4926-b23c-e80cbeb348cb.png" 
              alt="2 Tonne Tipper Truck" 
              className="w-full h-full object-contain"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p>
              Our 2 Tonne Tipper Truck is designed for heavy-duty jobs, making it ideal for construction, landscaping, and bulk material transport. With a manual transmission and a durable tipping tray, this truck allows for quick and easy unloading of soil, gravel, or debris.
            </p>
            <p>
              With a 3100mm (L) x 1600mm (W) tray size and a maximum load capacity of 2000kg, it's the perfect solution for commercial and personal projects. Rent one today and experience the power and efficiency of a tipper truck!
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
          <h3 className="text-xl font-bold mb-4">About the 2 Tonne Tipper Truck</h3>
          <div className="prose max-w-none">
            <p>
              The 2 Tonne Tipper Truck is a versatile vehicle designed for efficiency and power in material transport and disposal. Its hydraulic tipping mechanism makes unloading quick and effortless, saving valuable time on job sites.
            </p>
            <h4 className="text-lg font-semibold mt-4">Perfect For:</h4>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Construction material transport (gravel, sand, cement, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Landscaping projects requiring soil, mulch, or stone delivery</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Waste and debris removal from renovation sites</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Garden and yard clean-up projects</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mr-2 mt-2"></span>
                <span>Agricultural use for feed, fertilizer, or produce transport</span>
              </li>
            </ul>
            <p className="mt-4">
              With its robust design and reliable performance, the 2 Tonne Tipper Truck is a cost-effective solution for both commercial contractors and DIY enthusiasts.
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

      <div className="mt-12 bg-primary/5 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">Related City Links</h2>
        <p className="text-gray-700 mb-4">
          The 2 Tonne Tipper Truck is especially popular for construction and landscaping projects. Find local availability in these key locations.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland Truck Hire</Link>
          <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch Truck Hire</Link>
          <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton Truck Hire</Link>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold mb-6">Truck Hire by Location — FAQs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Where can I hire a tipper truck in New Zealand?</h3>
              <p className="text-gray-700">
                James Blond Rentals offers 2-tonne tipper trucks for construction and landscaping in <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland</Link>, <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch</Link>, and <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton</Link>. Book online or call your nearest branch.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is a tipper truck good for landscaping projects in Auckland?</h3>
              <p className="text-gray-700">
                Yes, our 2-tonne tipper truck is ideal for landscaping in Auckland. The hydraulic tipping mechanism makes unloading soil, mulch, and gravel effortless. Visit our <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland truck hire page</Link> to check availability and rates.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Can I hire a tipper truck for rubbish removal in Christchurch?</h3>
              <p className="text-gray-700">
                Absolutely. Our 2-tonne tipper is popular for construction debris and garden waste removal in <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch</Link> and <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">central Christchurch</Link>. Book online for same-day or next-day hire.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Do I need a special licence to drive a tipper truck in Hamilton?</h3>
              <p className="text-gray-700">
                No — our 2-tonne tipper trucks can be driven on a standard car licence in Hamilton and all other NZ locations. For larger 3-tonne trucks, a Class-2 (HT) licence is required. See our <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton truck hire page</Link> for more details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">Ready to Rent?</h3>
        <p className="mb-4">Contact us today to check availability and book your 2 Tonne Tipper Truck rental.</p>
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

export default TwoTonneTipperDetail;
