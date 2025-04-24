
import { Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      "Unlimited Kilometres"
    ]
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
    ]
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
    ]
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
      "35c per km mileage charge"
    ]
  },
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
    ]
  },
  {
    id: "single-cab-ute-petrol",
    title: "SINGLE CAB UTE - PETROL",
    subtitle: "Toyota Hilux 2.7L petrol",
    description: "Reliable single cab ute with generous deck space for various loads.",
    specs: [
      "Automatic Transmission",
      "Deck: 2400(L) x 1800(W)",
      "Max Load: 1000kg",
      "Unlimited kilometres"
    ]
  },
  {
    id: "single-cab-ute-diesel",
    title: "SINGLE CAB UTE - DIESEL",
    subtitle: "Toyota Hilux 3.0L diesel turbo",
    description: "Powerful diesel ute perfect for heavy-duty work and towing.",
    specs: [
      "Automatic Transmission",
      "Deck: 2400(L) x 1800(W)",
      "Max Load: 1000kg",
      "25c per km mileage charge",
      "(first 100 kilometres free)​"
    ]
  }
];

const FleetVans = () => (
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
            <Button asChild className="w-full">
              <Link to={`/fleet/vans/${van.id}`}>Know More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

export default FleetVans;
