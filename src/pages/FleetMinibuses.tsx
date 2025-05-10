import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Bluetooth, AirVent, Anchor } from "lucide-react";

const minibuses = [
  {
    id: "premium-12-seat-minibus",
    title: "PREMIUM 12-SEAT MINIBUS",
    subtitle: "LDV Deliver 9",
    specs: [
      "2024 or newer",
      "Automatic Transmission",
      "Air conditioning throughout",
      "Bluetooth",
      "Luxury Interior",
      "Tow Bar",
      "Diesel",
      "Full-Height Seats",
      "Unlimited kilometres"
    ],
    image: "https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw"
  },
  {
    id: "12-seat-minibus",
    title: "12-SEAT MINIBUS",
    subtitle: "Toyota Hiace ZX",
    specs: [
      "2017 or newer",
      "Automatic & Manual Transmission",
      "Air conditioning throughout",
      "Bluetooth",
      "Cargo Barrier",
      "Tow Bar",
      "Diesel",
      "Full-Height Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
  },
  {
    id: "10-seat-minibus",
    title: "10-SEAT MINIBUS",
    subtitle: "Toyota Hiace ZL",
    specs: [
      "2012 or newer",
      "Automatic Transmission",
      "Air conditioning throughout",
      "Unlimited kilometres",
      "Tow Bar",
      "Petrol",
      "Full-Height Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png"
  },
  {
    id: "8-seat-van",
    title: "8-SEAT VAN",
    subtitle: "Toyota Estima 2017",
    specs: [
      "Automatic Transmission",
      "Twin side doors",
      "Bluetooth",
      "Air conditioning throughout",
      "Petrol",
      "Luxury",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/959f182c-4210-4140-a46a-86ced485f4bd.png"
  }
];

const FleetMinibuses = () => (
  <div className="container mx-auto px-4 py-10">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Spacious Minibuses – Travel Together with Ease</h1>
      <p className="text-lg text-gray-700">
        Choose from our range of comfortable minibuses for group travel and special occasions.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {minibuses.map((minibus) => (
        <Card key={minibus.id} className="flex flex-col h-full">
          {minibus.image && (
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src={minibus.image} 
                alt={`${minibus.title}`} 
                className="w-full h-full object-cover rounded-t-lg"
                loading="lazy"
                width="400"
                height="225"
              />
            </AspectRatio>
          )}
          <CardHeader>
            {minibus.title.toLowerCase().includes("luxury") || minibus.title.toLowerCase().includes("premium") ? (
              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                {minibus.title.toLowerCase().includes("premium") ? "Premium" : "Luxury"}
              </span>
            ) : null}
            <CardTitle className="text-lg font-bold text-primary">{minibus.title}</CardTitle>
            <CardDescription className="text-xl font-semibold">{minibus.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {minibus.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  {spec.toLowerCase().includes("bluetooth") && <Bluetooth className="h-4 w-4 text-primary" />}
                  {spec.toLowerCase().includes("air conditioning") && <AirVent className="h-4 w-4 text-primary" />}
                  {spec.toLowerCase().includes("tow bar") && <Anchor className="h-4 w-4 text-primary" />}
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{spec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {minibus.id === "12-seat-minibus" || minibus.id === "10-seat-minibus" || minibus.id === "premium-12-seat-minibus" ? (
              <Link to={`/fleet/minibuses/${minibus.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            ) : (
              <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

export default FleetMinibuses;
