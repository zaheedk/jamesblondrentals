
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const cars = [
  {
    id: "premium-economy",
    title: "PREMIUM ECONOMY",
    subtitle: "Suzuki Swift 1.3L",
    specs: [
      "5 Door Hatchback",
      "Automatic Transmission",
      "AUX/USB/Bluetooth",
      "Air Conditioning",
      "5 Star Fuel Economy",
      "Reversing Camera",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/e7217b00-38b3-40d6-9ef7-fdc2760ee602.png"
  },
  {
    id: "premium-economy-wagon",
    title: "PREMIUM ECONOMY WAGON",
    subtitle: "Toyota Corolla Wagon 1.5L",
    specs: [
      "5 Door Wagon",
      "Automatic Transmission",
      "AUX/USB/Bluetooth",
      "Air Conditioning",
      "5 Star Fuel Economy",
      "Reversing Camera",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/9b8d1865-27f0-467a-a59e-aff51e626e79.png"
  },
  {
    id: "premium-compact-suv",
    title: "PREMIUM COMPACT SUV",
    subtitle: "Kia Seltos 2.0L",
    specs: [
      "5 Door SUV",
      "Automatic Transmission",
      "Apple CarPlay & Android Auto",
      "Smart Cruise Control",
      "Lane Assist",
      "Dual-Zone Air Conditioning",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/bdb0efeb-afa5-4ce7-b1fc-aace84a0222f.png"
  },
  {
    id: "premium-2wd-suv",
    title: "PREMIUM 5-SEAT SUV",
    subtitle: "Kia Sportage 2.0L",
    specs: [
      "5 Door SUV",
      "Automatic Transmission",
      "Apple CarPlay & Android Auto",
      "Smart Cruise Control",
      "Lane Assist",
      "Dual-Zone Air Conditioning",
      "5 Star ANCAP Safety Rating",
      "5 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/841454d4-8948-4c3b-ad99-d73b843deee8.png"
  },
  {
    id: "premium-awd-suv",
    title: "PREMIUM AWD SUV",
    subtitle: "Toyota Highlander 3.5L V6",
    specs: [
      "5 Door SUV",
      "Automatic Transmission",
      "AUX/USB/Bluetooth",
      "7 Seat Option (reduces boot space)",
      "5 Star ANCAP Safety Rating",
      "7 Seats",
      "Unlimited kilometres"
    ],
    image: "/lovable-uploads/b6590bc2-c772-4b70-892b-9a5c173c4d15.png"
  }
];

const FleetCars = () => {
  useEffect(() => {
    document.title = "Cheap Premium Cars & SUVs in New Zealand";
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Our Car Fleet</h1>
      <p className="text-lg text-gray-700">
        From compact economy cars to spacious SUVs, find the perfect vehicle for your journey.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Card key={car.id} className="flex flex-col h-full">
          {car.image && (
            <AspectRatio ratio={4/3} className="w-full">
              <img 
                src={car.image} 
                alt={`${car.title}`} 
                className={`w-full h-full rounded-t-lg ${
                  car.id === 'premium-economy-wagon' 
                    ? 'object-contain bg-gray-50' 
                    : 'object-cover'
                }`}
                loading="lazy"
                width="400"
                height="300"
              />
            </AspectRatio>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">{car.title}</CardTitle>
            <CardDescription className="text-xl font-semibold">{car.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {car.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{spec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to={`/fleet/cars/${car.id}`} className="w-full">
              <Button variant="outline" className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
  );
};

export default FleetCars;
