import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import truckMovingBoxes from "@/assets/truck-moving-boxes-household-items.jpg";
import familyUnloadingTruck from "@/assets/family-unloading-removal-truck.jpg";

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
      "61c per km mileage charge"
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
    <PageSEO title="Truck Hire NZ – 2 & 3 Tonne Trucks | James Blond" description="Hire trucks from 2-tonne to 3-tonne box trucks, tail-lift trucks and tippers. Perfect for moving house or business deliveries." canonical="/fleet/trucks" />
    {/* Hero Section with Image */}
    <div className="grid md:grid-cols-5 gap-8 mb-12 items-center">
      <div className="md:col-span-3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Heavy-Duty Fleet – The Right Truck for Every Job</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Choose from our range of professional trucks for all your heavy-duty transportation needs. 
          From furniture moves to commercial deliveries, we have the perfect truck rental solution.
        </p>
        <Button asChild size="lg">
          <a href="#trucks">View Our Fleet</a>
        </Button>
      </div>
      <div className="md:col-span-2">
        <img 
          src={truckMovingBoxes}
          alt="Professional moving truck loaded with boxes and household items for furniture removals"
          className="rounded-lg shadow-lg w-full h-auto"
          loading="eager"
          width="600"
          height="400"
        />
      </div>
    </div>
    
    {/* Truck Grid Section */}
    <div id="trucks" className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Truck Fleet</h2>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trucks.map((truck) => (
          <Card key={truck.id} className="flex flex-col h-full">
            {truck.image && (
              <AspectRatio ratio={16/9} className="w-full">
                <img 
                  src={truck.image} 
                  alt={`${truck.title} rental truck for moving and transport`} 
                  className="w-full h-full object-cover rounded-t-lg"
                  loading="lazy"
                  width="400"
                  height="225"
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
                truck.id === "2-tonne-box-16m3" || truck.id === "3-tonne-box-18m3" ||
                truck.id === "3-tonne-box-19m3") ? (
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

    {/* Moving Experience Section */}
    <div className="grid md:grid-cols-5 gap-8 mt-16 bg-muted/30 p-8 rounded-xl items-center">
      <div className="md:col-span-2">
        <img 
          src={familyUnloadingTruck}
          alt="Happy family unloading furniture and boxes from moving truck rental"
          className="rounded-lg shadow-lg w-full h-auto"
          loading="lazy"
          width="600"
          height="400"
        />
      </div>
      <div className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-4">Make Your Move Easy</h2>
        <p className="text-muted-foreground mb-4">
          Our professional truck fleet is designed to make your moving experience as smooth as possible. 
          Whether you're relocating your home, transporting furniture, or handling commercial deliveries, 
          our trucks are equipped to handle the job.
        </p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>Easy-to-drive automatic transmission available</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>Spacious cargo areas for household items</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>Tail lift options for heavy items</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>Competitive hourly rates with transparent pricing</span>
          </li>
        </ul>
        <Button asChild>
          <Link to="/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default FleetTrucks;