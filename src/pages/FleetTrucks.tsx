import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';
import RelatedLocations from '@/components/RelatedLocations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShieldCheck, Truck, ArrowRight, Phone, MapPin } from "lucide-react";
import truckMovingBoxes from "@/assets/truck-moving-boxes-household-items.jpg";
import familyUnloadingTruck from "@/assets/family-unloading-removal-truck.jpg";

const trucks = [
  {
    id: "3-tonne-box-19m3",
    title: "3 TONNE BOX (19M³) +TAIL LIFT",
    subtitle: "Automatic Transmission",
    specs: [
      "Box: 4800(L) x 2100(W) x 2100(H)",
      "Max Load: 3800kg",
      "62c per km mileage charge (Requires class-2 (HT) license)"
    ],
    image: "/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png",
    badge: "Largest Load"
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
    id: "2-tonne-tipper",
    title: "2 TONNE TIPPER",
    subtitle: "Manual Transmission",
    specs: [
      "Tray: 3100(L) x 1600(W)",
      "Max Load: 2000kg",
      "39c per km mileage charge"
    ],
    image: "/lovable-uploads/ca896f7e-9bda-4926-b23c-e80cbeb348cb.png"
  }
];

const locationLinks = [
  { name: "Auckland", to: "/auckland-truck-rentals-hire" },
  { name: "Wellington", to: "/truck-hire-wellington" },
  { name: "Christchurch", to: "/truck-hire-christchurch" },
  { name: "Hamilton", to: "/truck-hire-hamilton" },
  { name: "West Auckland", to: "/west-auckland-truck-rentals" },
  { name: "South Auckland", to: "/south-auckland-truck-rentals" },
];

const FleetTrucks = () => {
  const [featuredTruck, ...otherTrucks] = trucks;

  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO
        title="Truck Hire NZ – 2 & 3 Tonne Trucks | James Blond"
        description="Hire trucks from 2-tonne to 3-tonne box trucks, tail-lift trucks and tippers. Perfect for moving house or business deliveries across NZ."
        canonical="/fleet/trucks"
      />

      {/* Bento Grid Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Hero Tile */}
        <div className="lg:col-span-8 bg-primary text-primary-foreground rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between min-h-[420px] shadow-xl">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6">
              <Truck className="w-4 h-4" />
              NZ-wide truck rental
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Heavy-Duty Fleet – The Right Truck for Every Job
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-xl leading-relaxed">
              Choose from our range of professional trucks for all your heavy-duty transportation needs.
              From furniture moves to commercial deliveries, we have the perfect truck rental solution.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center mt-8">
            <Button asChild size="lg" variant="cta" className="rounded-full shadow-lg hover:shadow-cta/20">
              <a href="#trucks">
                View Our Fleet
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground bg-transparent">
              <a href="tel:0800525663">
                <Phone className="mr-2 h-4 w-4" /> 0800 525 663
              </a>
            </Button>
          </div>
        </div>

        {/* Feature Tile */}
        <div className="lg:col-span-4 bg-card rounded-[2.5rem] p-8 shadow-sm border border-border flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Fully Insured</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Drive with peace of mind. Standard insurance is included, with upgrade options for extra protection and lower excess.
          </p>
        </div>
      </div>

      {/* Fleet Bento Grid */}
      <div id="trucks" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-8">
        {/* Featured truck */}
        <div className="lg:col-span-4">
          <TruckCard truck={featuredTruck} featured />
        </div>

        {/* Other trucks row 1 */}
        {otherTrucks.slice(0, 2).map((truck) => (
          <div key={truck.id} className="lg:col-span-4">
            <TruckCard truck={truck} />
          </div>
        ))}

        {/* Other trucks row 2 */}
        {otherTrucks.slice(2, 5).map((truck) => (
          <div key={truck.id} className="lg:col-span-4">
            <TruckCard truck={truck} />
          </div>
        ))}

        {/* Banner tile */}
        <div className="lg:col-span-6 bg-cta text-cta-foreground rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3">Make Your Move Easy</h2>
            <p className="text-cta-foreground/90 max-w-md">
              Our professional truck fleet is designed to make your moving experience smooth — whether you're relocating your home, transporting furniture, or handling commercial deliveries.
            </p>
          </div>
          <Button asChild variant="default" className="bg-cta-foreground text-cta hover:bg-cta-foreground/90 rounded-full px-6 py-3 shadow-sm relative z-10">
            <Link to="/contact">Get in Touch</Link>
          </Button>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Remaining trucks */}
        {otherTrucks.slice(5).map((truck) => (
          <div key={truck.id} className="lg:col-span-6">
            <TruckCard truck={truck} />
          </div>
        ))}
      </div>

      {/* Locations Bento Tile */}
      <div className="bg-muted/40 rounded-[2.5rem] p-8 border border-border mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Truck hire by city</h3>
            <p className="text-sm text-muted-foreground">Find truck rentals at your nearest James Blond branch.</p>
          </div>
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {locationLinks.map((loc) => (
            <Link
              key={loc.name}
              to={loc.to}
              className="px-4 py-3 bg-card rounded-2xl border border-border text-sm font-semibold text-foreground hover:text-primary hover:border-primary/30 transition-colors text-center"
            >
              {loc.name}
            </Link>
          ))}
        </div>
      </div>

      <RelatedLocations vehicleType="trucks" title="More truck hire locations" />
    </div>
  );
};

interface TruckCardProps {
  truck: typeof trucks[0];
  featured?: boolean;
}

const TruckCard = ({ truck, featured }: TruckCardProps) => (
  <Card className={`flex flex-col h-full overflow-hidden rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow group ${featured ? 'ring-1 ring-primary/10' : ''}`}>
    {truck.image && (
      <AspectRatio ratio={featured ? 4/3 : 16/9} className="w-full bg-muted">
        <img
          src={truck.image}
          alt={`${truck.title} rental truck for moving and transport`}
          className="w-full h-full object-cover"
          loading="lazy"
          width={featured ? 400 : 400}
          height={featured ? 300 : 225}
        />
      </AspectRatio>
    )}
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <CardTitle className={`font-bold text-primary ${featured ? 'text-xl' : 'text-lg'}`}>{truck.title}</CardTitle>
        {truck.badge && (
          <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full whitespace-nowrap">
            {truck.badge}
          </span>
        )}
      </div>
      <CardDescription className={`font-semibold text-foreground ${featured ? 'text-lg' : 'text-base'}`}>{truck.subtitle}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-2">
        {truck.specs.map((spec, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            <span className="text-muted-foreground text-sm">{spec}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Link to={`/fleet/trucks/${truck.id}`} className="w-full">
        <Button variant="outline" className="w-full rounded-full group-hover:border-primary group-hover:text-primary transition-colors">
          View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default FleetTrucks;