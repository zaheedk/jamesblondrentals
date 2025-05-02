
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const trucks = [
  {
    id: "2-tonne-box-9m3",
    title: "2 TONNE BOX (9M³)",
    subtitle: "Automatic & Manual Transmission",
    specs: [
      "Box: 3100(L) x 1600(W) x 1800(H)",
      "Max Load: 2000kg",
      "Depending on availability* 42c per km mileage charge"
    ],
    image: "/lovable-uploads/072db196-b7e0-4726-bd11-9dd208534e9e.png"
  },
  {
    id: "2-tonne-box-12m3",
    title: "2 TONNE BOX (12M³)",
    subtitle: "Automatic Transmission",
    specs: [
      "Box: 3100(L) x 1750(W) x 2050(H)",
      "Max Load: 2000kg",
      "44c per km mileage charge"
    ],
    image: "/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png"
  },
  {
    id: "2-tonne-box-12m3-tail",
    title: "2 TONNE BOX (12M³) +TAIL LIFT",
    subtitle: "Automatic Transmission",
    specs: [
      "Box: 3100(L) x 18000(W) x 2000(H)",
      "Max Load: 2000kg",
      "Max Tail Lift Load: 400kg",
      "44c per km mileage charge"
    ],
    image: "/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png"
  },
  {
    id: "2-tonne-tipper",
    title: "2 TONNE TIPPER",
    subtitle: "Manual Transmission",
    specs: [
      "Tray: 3100(L) x 1600(W)",
      "Max Load: 2000kg",
      "39c per km mileage charge"
    ],
    image: "/lovable-uploads/ca896f7e-9bda-4926-b23c-e80cbeb348cb.png"
  },
  {
    id: "2-tonne-box-16m3",
    title: "2 TONNE BOX (16M³)",
    subtitle: "Manual Transmission",
    specs: [
      "Air conditioning",
      "Box: 3800(L) x 2000(W) x 2000(H)",
      "Max Load: 2000kg",
      "*47c per km mileage charge"
    ],
    image: "/lovable-uploads/a00bb0d9-fccc-4d69-a9ab-28d894f74538.png"
  },
  {
    id: "3-tonne-box-18m3",
    title: "3 TONNE BOX (18M³) +TAIL LIFT",
    subtitle: "Automatic Transmission",
    specs: [
      "Hydraulic Tail Lift",
      "Box: 4400(L) x 2100(W) x 2050(H)",
      "Max Load: 3000kg",
      "Max Tail Lift Load: 400kg",
      "62c per km mileage charge (Requires class-2 (HT) license)"
    ],
    image: "/lovable-uploads/4506c6fc-4eef-4997-a040-7482f1872bab.png"
  },
  {
    id: "3-tonne-box-19m3",
    title: "3 TONNE BOX (19M³) +TAIL LIFT",
    subtitle: "Automatic Transmission",
    specs: [
      "Box: 4800(L) x 2100(W) x 2100(H)",
      "Max Load: 3800kg",
      "62c per km mileage charge (Requires class-2 (HT) license)"
    ],
    image: "/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png"
  }
];

const FleetTrucks = () => (
  <div className="container mx-auto px-4 py-10">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Heavy-Duty Fleet – The Right Truck for Every Job</h1>
      <p className="text-lg text-gray-700">
        Choose from our range of professional trucks for all your heavy-duty transportation needs.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trucks.map((truck) => (
        <Card key={truck.id} className="flex flex-col h-full">
          {truck.image && (
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src={truck.image} 
                alt={`${truck.title}`} 
                className="w-full h-full object-cover rounded-t-lg"
              />
            </AspectRatio>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">{truck.title}</CardTitle>
            <CardDescription className="text-xl font-semibold">{truck.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {truck.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{spec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {(truck.id === "2-tonne-box-9m3" || truck.id === "2-tonne-box-12m3" || 
              truck.id === "2-tonne-box-12m3-tail" || truck.id === "2-tonne-tipper" ||
              truck.id === "2-tonne-box-16m3" || truck.id === "3-tonne-box-18m3") ? (
              <Link to={`/fleet/trucks/${truck.id}`} className="w-full">
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

export default FleetTrucks;
