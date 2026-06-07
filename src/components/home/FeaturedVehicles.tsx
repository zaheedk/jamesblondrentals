import { Link } from "react-router-dom";
import { Car, Truck, Bus, CarFront, Caravan, Package } from "lucide-react";

const fleetCategories = [
  {
    title: "Car Hire",
    description:
      "Economy hatchbacks, sedans, and SUVs for city driving, road trips, and family holidays across New Zealand.",
    href: "/fleet/cars",
    image: "/lovable-uploads/e7217b00-38b3-40d6-9ef7-fdc2760ee602.png",
    imageAlt:
      "Suzuki Swift premium economy rental car at James Blond Rentals Auckland",
    icon: Car,
  },
  {
    title: "Van Hire",
    description:
      "Cargo vans, premium vans, and jumbo vans perfect for moving house, deliveries, and trade jobs.",
    href: "/fleet/vans",
    image: "/lovable-uploads/3cb301ec-ead2-492a-a9a0-3361c1876b76.png",
    imageAlt:
      "Toyota Hiace premium cargo van for hire at James Blond Rentals",
    icon: Package,
  },
  {
    title: "Minibus Hire",
    description:
      "8 to 12-seater minibuses ideal for sports teams, school trips, events, and group travel in NZ.",
    href: "/fleet/minibus",
    image: "/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png",
    imageAlt:
      "Toyota Hiace 12-seat minibus rental for group travel New Zealand",
    icon: Bus,
  },
  {
    title: "Truck Hire",
    description:
      "2-tonne to 3-tonne box trucks, tail-lift trucks, and tippers for house moves and commercial use.",
    href: "/fleet/trucks",
    image: "/lovable-uploads/072db196-b7e0-4726-bd11-9dd208534e9e.png",
    imageAlt:
      "2-tonne box truck rental for moving house at James Blond Rentals",
    icon: Truck,
  },
  {
    title: "UTE Hire",
    description:
      "Single cab and double cab utes, petrol and diesel, with tow bars and roof racks for work or play.",
    href: "/fleet/utes",
    image: "/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png",
    imageAlt:
      "Toyota Hilux premium double cab ute for hire in Auckland NZ",
    icon: CarFront,
  },
  {
    title: "Trailer Hire",
    description:
      "Cage trailers, luggage trailers, and car transporters for hauling gear, moving, or vehicle recovery.",
    href: "/fleet/trailers",
    image: "/lovable-uploads/ca4fe6a5-97a6-4d6c-a675-a0ad2e3e4856.png",
    imageAlt:
      "Steel cage trailer rental for hauling and moving in New Zealand",
    icon: Caravan,
  },
];

const FeaturedVehicles = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Hire Cars, Vans, Trucks &amp; More Across NZ
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Browse our full fleet of rental vehicles available in Auckland,
          Wellington, Christchurch, and Hamilton. From compact cars to heavy-duty
          trucks, find the right vehicle at the right price.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {fleetCategories.map((category) => (
          <Link
            key={category.href}
            to={category.href}
            className="group card-elegant overflow-hidden flex flex-col h-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            aria-label={`${category.title} – ${category.description}`}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={category.image}
                alt={category.imageAlt}
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                width="400"
                height="250"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  <category.icon className="w-3.5 h-3.5" />
                  {category.title}
                </span>
              </div>
            </div>

            <div className="p-5 md:p-6 flex flex-col flex-grow">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed flex-grow">
                {category.description}
              </p>
              <span className="inline-flex items-center text-primary font-semibold text-sm mt-4 group-hover:underline underline-offset-4">
                Browse {category.title}
                <svg
                  className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": fleetCategories.map((cat, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": cat.title,
            "url": `https://jamesblond.co.nz${cat.href}`,
            "description": cat.description,
          })),
        })}
      </script>
    </section>
  );
};

export default FeaturedVehicles;
