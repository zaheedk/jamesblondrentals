
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PageSEO from "@/components/PageSEO";
import JsonLd from "@/components/JsonLd";

const vans = {
  "hiace-petrol": {
    title: "Toyota Hiace Van (Petrol, New Shape)",
    img: "/images/fleet/vans/toyota-hiace-new-shape-petrol.jpg",
    description: "The latest Toyota Hiace petrol auto van – famous for reliability and easy driving. Perfect for moving flat, furniture, business deliveries or day trips.",
    longDescription: [
      "Our Toyota Hiace petrol vans are the perfect size for moving house, furniture deliveries, or business use. With automatic transmission, they're easy to drive even if you're not used to larger vehicles.",
      "The spacious cargo area offers 6.2 cubic meters of space, easily fitting a small apartment's worth of boxes and furniture. The wide sliding doors on both sides make loading and unloading simple from any angle."
    ],
    features: [
      "Automatic transmission for easy driving",
      "Petrol engine - economical and responsive",
      "3 seats with comfortable cabin",
      "6.2m³ cargo space (L 2.53m x W 1.77m x H 1.28m)",
      "Sliding doors on both sides for easy access",
      "Reversing camera for safety",
      "Cruise control for highway driving",
      "Air conditioning",
      "Bluetooth connectivity",
      "USB charging ports"
    ],
    idealFor: [
      "Moving house or apartment",
      "Furniture deliveries",
      "Work tools and materials",
      "Airport pickups with lots of luggage",
      "Weekend projects requiring space",
      "Small business deliveries"
    ]
  },
  "hiace-jumbo": {
    title: "Toyota Hiace ZX Jumbo (Diesel)",
    img: "/images/fleet/vans/toyota-hiace-jumbo-diesel.jpg",
    description: "Need even more space? The long wheelbase Hiace Jumbo has room for all your gear, with 9.3 cubic metres of cargo space. Diesel auto, perfect for bulky deliveries.",
    longDescription: [
      "The Toyota Hiace ZX Jumbo diesel van is our largest van offering, with an impressive 9.3 cubic meters of cargo space in the extended wheelbase design.",
      "Ideal for larger moves and bulky items, this van combines carrying capacity with the reliability and ease of driving Toyota is known for. The diesel engine offers excellent fuel economy even when fully loaded."
    ],
    features: [
      "Automatic transmission for easy driving",
      "Economical diesel engine",
      "3 seats with comfortable cabin",
      "9.3m³ cargo space (L 2.93m x W 1.70m x H 1.85m)",
      "Sliding doors for easy access",
      "Reversing camera and parking sensors",
      "Cruise control for highway driving",
      "Air conditioning",
      "Bluetooth connectivity",
      "High roof design for tall items"
    ],
    idealFor: [
      "Larger house or office moves",
      "Bulky furniture deliveries",
      "Trade workers with large equipment",
      "Small business logistics",
      "Band equipment transport",
      "Market vendors with display equipment"
    ]
  },
  "hiace-minibus": {
    title: "Toyota Hiace ZL 12-Seater Minibus",
    img: "/images/fleet/vans/toyota-hiace-12-seater-minibus.jpg",
    description: "Comfortable and safe transport for teams, groups or larger families. 12 seats with lap-sash seatbelts, automatic, air con and reversing camera.",
    longDescription: [
      "Our Toyota Hiace ZL 12-Seater Minibus is perfect for group transport needs, comfortably seating up to 12 passengers with proper lap-sash seatbelts for all seats.",
      "Whether you're moving a sports team to a match, transporting wedding guests, or taking a large family on vacation, this spacious and comfortable minibus offers convenient and cost-effective group transportation."
    ],
    features: [
      "Automatic transmission for smooth driving",
      "Petrol engine",
      "12 seats all with proper lap-sash seatbelts",
      "Air conditioning throughout",
      "Reversing camera for safety",
      "Ample luggage storage behind rear seats",
      "Easy entry with sliding passenger door",
      "Comfortable interior with good headroom",
      "Bluetooth connectivity",
      "USB charging ports"
    ],
    idealFor: [
      "Sports teams and clubs",
      "School groups and field trips",
      "Wedding party transportation",
      "Large family outings",
      "Corporate team building events",
      "Airport transfers for groups",
      "Tour groups"
    ]
  },
  "hilux-ute": {
    title: "Toyota Hilux SR5 2WD Ute (Flat Deck)",
    img: "/images/fleet/vans/toyota-hilux-sr5-ute.jpg",
    description: "Legendary Hilux ute with wide flat deck for worksites, tradies or weekend projects. Room for building supplies or large items.",
    longDescription: [
      "The Toyota Hilux SR5 2WD Ute combines practical utility with comfortable driving. The wide flat deck makes it perfect for tradies, DIY projects, or moving items that won't fit in a conventional vehicle.",
      "With the reliability Toyota is famous for and the versatility of an open deck, this ute is ideal for both work and weekend projects. The automatic transmission makes for easy driving around town or on longer trips."
    ],
    features: [
      "Automatic transmission",
      "Petrol engine",
      "3 seats in comfortable cabin",
      "Spacious flat deck (L 2.38m x W 1.77m)",
      "Towbar fitted as standard",
      "Air conditioning",
      "Bluetooth connectivity",
      "USB charging ports",
      "Easy to drive and park",
      "Excellent visibility"
    ],
    idealFor: [
      "Tradies and contractors",
      "Building supplies transport",
      "Garden supplies and plants",
      "Weekend DIY projects",
      "Moving bulky items",
      "Outdoor equipment transport",
      "Furniture pickup"
    ]
  }
};

const VanDetail = () => {
  const { vanId } = useParams();
  const van = vanId ? vans[vanId as keyof typeof vans] : null;
  
  if (!van) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Van Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find information about this van.</p>
        <Button asChild>
          <Link to="/fleet/vans">Back to Vans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <PageSEO
        title={`${van.title} | James Blond Rentals`.slice(0, 60)}
        description={van.description.slice(0, 160)}
        canonical={`/fleet/vans/${vanId}`}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: van.title,
          image: `https://jamesblond.co.nz${van.img}`,
          description: van.description,
          brand: { "@type": "Brand", name: "James Blond Rentals" },
          category: "Vehicle Rental",
        }}
      />
      <div className="mb-4">
        <Link to="/fleet/vans" className="text-primary hover:underline inline-flex items-center">
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" /> Back to Vans & Utes
        </Link>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{van.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        <div className="md:col-span-7">
          <img 
            src={van.img} 
            alt={van.title} 
            className="w-full rounded-lg shadow-lg"
            onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
          />
        </div>
        
        <div className="md:col-span-5">
          <h2 className="text-xl font-semibold mb-3 text-primary">Overview</h2>
          <p className="text-gray-700 mb-6">{van.description}</p>
          
          <div className="bg-primary/10 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Ideal For:</h3>
            <ul className="list-disc list-inside">
              {van.idealFor.map((item, index) => (
                <li key={index} className="mb-1 text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
          
          <Button asChild className="w-full">
            <Link to="/booking">Book This Vehicle</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">About This Vehicle</h2>
          {van.longDescription.map((paragraph, index) => (
            <p key={index} className="mb-3 text-gray-700">{paragraph}</p>
          ))}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Features & Specifications</h2>
          <ul className="list-disc list-inside space-y-2">
            {van.features.map((feature, index) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Booking Information</h2>
        <p className="mb-4">
          This vehicle can be hired from our Auckland depot. We offer flexible hire periods starting from just one day.
        </p>
        <p className="mb-6">
          All our van and ute hires include GST, insurance, AA roadside assistance, and unlimited kilometers for multi-day hires.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/booking">Book Online</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="tel:0800525252">Call to Reserve: 0800 52 52 52</a>
          </Button>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-4">Need a Different Vehicle?</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/fleet/cars">Cars</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/fleet/trucks">Trucks</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/fleet/trailers">Trailers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VanDetail;
