
import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const utes = [
  {
    id: "premium-double-cab-ute",
    title: "PREMIUM DOUBLE CAB UTE - PETROL",
    subtitle: "Toyota Hilux Workmate 2.7L petrol",
    description: "Versatile double cab ute perfect for both work and recreational use.",
    specs: [
      "Automatic Transmission",
      "Bluetooth",
      "Roof Racks",
      "Towbar",
      "Tray: 1700 (L) x 1800 (W)",
      "Max Load: 900kg",
      "Max Towing: 3500kg",
      "Unlimited kilometers"
    ],
    image: "/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png"
  },
  {
    id: "single-cab-ute-petrol",
    title: "SINGLE CAB UTE - PETROL",
    subtitle: "Toyota Hilux 2.7L petrol",
    description: "Reliable single cab ute with generous deck space for various loads.",
    specs: [
      "Manual Transmission",
      "Deck: 2400(L) x 1800(W)",
      "Max Load: 1000kg",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/234be2bf-bb8a-4e38-90ba-899a4b1eaf38.png"
  },
  {
    id: "single-cab-ute-diesel",
    title: "SINGLE CAB UTE - DIESEL",
    subtitle: "Toyota Hilux 3.0L diesel turbo",
    description: "Powerful diesel ute perfect for heavy-duty work and towing.",
    specs: [
      "Manual Transmission",
      "Deck: 2400(L) x 1800(W)",
      "Max Load: 1000kg",
      "25c per km mileage charge",
      "(first 100 kilometres free)​"
    ],
    image: "/lovable-uploads/234be2bf-bb8a-4e38-90ba-899a4b1eaf38.png"
  }
];

const FleetUtes = () => (
  <div className="container mx-auto px-4 py-10">
    <PageSEO
      title="UTE Hire – Double Cab & Single Cab Utes | James Blond Rentals"
      description="Hire reliable utes in Auckland. Choose from double cab and single cab utes, petrol or diesel, perfect for work and recreation."
      canonical="/fleet/utes"
    />
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Our UTE Fleet</h1>
      <p className="text-lg text-gray-700">
        From double cab to single cab, petrol or diesel - find the perfect UTE for your needs.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {utes.map((ute) => (
        <Card key={ute.id} className="flex flex-col h-full">
          {ute.image && (
            <AspectRatio ratio={4/3} className="w-full">
              <img 
                src={ute.image} 
                alt={`${ute.title}`} 
                className="w-full h-full object-cover rounded-t-lg"
                loading="lazy"
                width="400"
                height="300"
              />
            </AspectRatio>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">{ute.title}</CardTitle>
            <CardDescription className="text-xl font-semibold">{ute.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 mb-4">{ute.description}</p>
            <ul className="space-y-2">
              {ute.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{spec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to={`/fleet/utes/${ute.id}`}>
              <Button variant="outline" className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

export default FleetUtes;
