
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";

const cars = [
  {
    id: "premium-seven-seat-suv",
    category: "PREMIUM 7-SEAT AWD SUV",
    model: "KIA Sorento 2.2L Diesel",
    features: [
      "Automatic IVT Transmission",
      "5-star ANCAP safety rating",
      "Reversing Camera",
      "Air conditioning",
      "Apple / Android in-car system",
      "Smart Cruise Control",
      "System Lane exit / Driver attention alerts"
    ],
    image: "/lovable-uploads/2aa5cc60-af01-4571-864b-f2955d9e129b.png"
  },
  {
    id: "premium-2wd-suv",
    category: "PREMIUM 2WD SUV",
    model: "Kia Sportage 2.0L",
    features: [
      "Automatic IVT Transmission",
      "5-star ANCAP safety rating",
      "Reversing Camera",
      "Air conditioning",
      "Apple / Android in-car system",
      "Smart Cruise Control",
      "System Lane exit / Driver attention alerts"
    ],
    image: "/lovable-uploads/841454d4-8948-4c3b-ad99-d73b843deee8.png"
  },
  {
    id: "premium-compact-suv",
    category: "PREMIUM COMPACT SUV",
    model: "KIA Seltos 2.0L",
    features: [
      "Automatic IVT Transmission",
      "5-star ANCAP safety rating",
      "Reversing Camera",
      "Air conditioning",
      "Apple / Android in-car system",
      "Smart Cruise Control",
      "System Lane exit / Driver attention alerts"
    ],
    image: "/lovable-uploads/bdb0efeb-afa5-4ce7-b1fc-aace84a0222f.png"
  },
  {
    id: "premium-awd-suv",
    category: "PREMIUM AWD SUV",
    model: "Toyota Highlander 3.5L V6",
    features: [
      "Automatic Transmission",
      "5-star ANCAP safety rating",
      "Reversing Camera",
      "Air conditioning",
      "All wheel drive (AWD)",
      "Bluetooth AUX and USB",
      "7 seat option (reduces luggage space)"
    ],
    image: "/lovable-uploads/b6590bc2-c772-4b70-892b-9a5c173c4d15.png"
  },
  {
    id: "premium-4wd-suv",
    category: "PREMIUM 4WD SUV",
    model: "Toyota RAV4 2.5L",
    features: [
      "Automatic Transmission",
      "5-star ANCAP safety rating",
      "5-star Fuel economy rating",
      "All wheel drive (AWD)",
      "Reversing Camera",
      "Air conditioning",
      "Bluetooth AUX and USB",
      "Adaptive Cruise Control System"
    ],
    image: "/lovable-uploads/733eee77-e3c1-45e2-a28a-a44ef4299df4.png"
  },
  {
    id: "premium-economy",
    category: "PREMIUM ECONOMY",
    model: "Suzuki Swift 1.3L",
    features: [
      "Automatic Transmission",
      "5-star ANCAP safety rating",
      "5-star Fuel economy rating",
      "Reversing Camera",
      "Air conditioning",
      "Bluetooth AUX and USB"
    ],
    image: "/lovable-uploads/e7217b00-38b3-40d6-9ef7-fdc2760ee602.png"
  },
  {
    id: "premium-midsize",
    category: "PREMIUM MIDSIZE",
    model: "Toyota Corolla Hatch 2L",
    features: [
      "Automatic Transmission",
      "5-star ANCAP safety rating",
      "6-star Fuel economy rating",
      "Reversing Camera",
      "Air conditioning",
      "Bluetooth AUX and USB",
      "Adaptive Cruise Control System"
    ],
    image: "/lovable-uploads/88ff5179-c7dc-499f-9b7d-e3d934ec686c.png"
  },
  {
    category: "PREMIUM ECONOMY WAGON",
    model: "Toyota Corolla Wagon 1.5L",
    features: [
      "Automatic Transmission",
      "5-star ANCAP safety rating",
      "Reversing Camera",
      "Air conditioning",
      "Bluetooth AUX and USB"
    ]
  }
];

const FleetCars = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Versatile Cars & SUVs – Drive with Confidence</h1>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, index) => (
        <Card key={index} className="flex flex-col h-full">
          {car.image && (
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src={car.image} 
                alt={`${car.model}`} 
                className="w-full h-full object-cover rounded-t-lg"
              />
            </AspectRatio>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">{car.category}</CardTitle>
            <CardDescription className="text-xl font-semibold">{car.model}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {car.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {car.id ? (
              <Link to={`/fleet/cars/${car.id}`} className="w-full">
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

export default FleetCars;
