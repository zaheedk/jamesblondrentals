
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect } from "react";

const vans = [
  {
    id: "premium-van",
    title: "PREMIUM VAN",
    subtitle: "Toyota Hiace 2.7L petrol",
    description: "Perfect for moving house, deliveries or business use with ample cargo space and easy-to-drive automatic transmission.",
    specs: [
      "Automatic Transmission",
      "Cargo van",
      "Front Seats Only",
      "Twin Side Doors",
      "Cargo: 2800(L) x 1400(W) x 1500(H)",
      "Max Load: 1000kg",
      "100 Kilometres Free Per Day"
    ],
    image: "/lovable-uploads/3cb301ec-ead2-492a-a9a0-3361c1876b76.png"
  },
  {
    id: "standard-van",
    title: "STANDARD VAN",
    subtitle: "Toyota Hiace 2.7L petrol",
    description: "Reliable and spacious cargo van suitable for various transportation needs.",
    specs: [
      "Transmission subject to Availability",
      "Cargo van",
      "Front Seats Only",
      "Twin Side Doors",
      "Cargo: 2800(L) x 1400(W) x 1500(H)",
      "Max Load: 1000kg",
      "Unlimited Kilometres"
    ],
    image: "/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png"
  },
  {
    id: "standard-rear-seat-van",
    title: "STANDARD REAR SEAT VAN",
    subtitle: "Toyota Hiace 2.7L petrol",
    description: "Perfect balance of cargo space and passenger capacity with additional row of seats.",
    specs: [
      "Automatic Transmission",
      "Cargo van with extra row of seats",
      "Twin Side Doors",
      "Air conditioning",
      "Cargo: 1900(L) x 1400(W) x 1500(H)",
      "Max Load: 1000kg",
      "Unlimited Kilometres"
    ],
    image: "/lovable-uploads/7924107a-afb6-4c13-aa1d-8dba18465760.png"
  },
  {
    id: "jumbo-van",
    title: "JUMBO VAN DIESEL",
    subtitle: "Ford Transit / Fiat Ducato",
    description: "Large capacity cargo van ideal for bigger moves and commercial use.",
    specs: [
      "Manual & Automatic Transmission",
      "Large capacity cargo van",
      "Twin Side Doors",
      "Air conditioning",
      "Cargo: 3300(L) x 1600(W) x 1900(H)",
      "Max Load: 1350kg",
      "39c per km mileage charge"
    ],
    image: "/lovable-uploads/6dde201c-13f3-4671-9e88-6cc1a388d647.png"
  }
];

const FleetVans = () => {
  // Set page title when component mounts
  useEffect(() => {
    // Save the original title to restore it when component unmounts
    const originalTitle = document.title;
    document.title = "Hire Cargo Vans - Auckland & Wellington";
    
    // Restore the original title when the component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Our Extensive Fleet – Choose the Right Vehicle</h1>
        <p className="text-lg text-gray-700">
          From compact vans to powerful utes, we have the perfect vehicle for your needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vans.map((van) => (
          <Card key={van.id} className="flex flex-col h-full">
            {van.image && (
              <AspectRatio ratio={16/9} className="w-full">
                <img 
                  src={van.image} 
                  alt={`${van.title}`} 
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </AspectRatio>
            )}
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">{van.title}</CardTitle>
              <CardDescription className="text-xl font-semibold">{van.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 mb-4">{van.description}</p>
              <ul className="space-y-2">
                {van.specs.map((spec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-gray-600">{spec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {van.id === "premium-van" && (
                <Link to="/fleet/vans/premium-van">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              )}
              {van.id === "standard-van" && (
                <Link to="/fleet/vans/standard-van">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              )}
              {van.id === "standard-rear-seat-van" && (
                <Link to="/fleet/vans/standard-rear-seat-van">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              )}
              {van.id === "jumbo-van" && (
                <Link to="/fleet/vans/jumbo-van">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FleetVans;
