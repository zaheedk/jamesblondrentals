import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Truck, Car, CarFront, Bus, Caravan, Forklift, Package } from "lucide-react";

const fleetLinks = [
  { name: "Cars", path: "/fleet/cars", icon: Car },
  { name: "Vans", path: "/fleet/vans", icon: Truck },
  { name: "Cargo Vans", path: "/fleet/cargo-vans", icon: Package },
  { name: "UTEs", path: "/fleet/utes", icon: CarFront },
  { name: "Trucks", path: "/fleet/trucks", icon: Truck },
  { name: "Minibuses", path: "/fleet/minibus", icon: Bus },
  { name: "Trailers", path: "/fleet/trailers", icon: Caravan },
  { name: "Accessories", path: "/fleet/accessories", icon: Forklift },
];

const fleetCategories = [
  {
    title: "🚚 Trucks & Moving Vans",
    description: "From compact 2-ton trucks to powerful 6-ton curtain siders with tail lifts, our truck selection is ideal for house moves, furniture transport, or commercial deliveries. All our moving trucks can be driven on a standard car licence, and we offer options with trolleys, blankets, and tie-downs for added convenience."
  },
  {
    title: "🚐 Vans & Minibuses",
    description: "Need a spacious cargo van or a people mover for a group trip? Our fleet includes everything from compact vans for quick deliveries to 10–12-seater minibuses perfect for sports teams, school outings, or weekend adventures with friends and family."
  },
  {
    title: "🚗 Cars & SUVs",
    description: "From small, zippy economy cars to comfortable sedans and family-friendly SUVs, we have a range of rental vehicles to suit your lifestyle and budget. All our vehicles are regularly serviced and equipped for safe, stress-free driving."
  },
  {
    title: "🛻 Utes & Trailers",
    description: "If you need something tough and versatile, check out our utes—ideal for tradespeople, weekend DIY projects, or garden clean-ups. Pair it with one of our trailer options for even more hauling power."
  }
];

const benefits = [
  "Huge range: One of the largest fleets in West Auckland and beyond",
  "Flexible hire terms: Hourly, daily, weekly or long-term rentals",
  "Competitive pricing: Affordable rates with no hidden fees",
  "Convenient extras: GPS, tow bars, roof racks, and moving gear available",
  "Customer-first service: Friendly, local team committed to making your rental experience smooth and hassle-free"
];

const Fleet = () => {
  const location = useLocation();
  const isRootFleetRoute = location.pathname === '/fleet';

  useEffect(() => {
    if (isRootFleetRoute) {
      document.title = "Vehicle Fleet - Cars, Vans, Trucks & More - James Blond Rentals";
    }
  }, [isRootFleetRoute]);

  return (
    <div className="container mx-auto px-4 py-8">
      {isRootFleetRoute ? (
        <>
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-6">Explore the James Blond Rentals Fleet</h1>
            <p className="text-lg text-gray-600 mb-8">
              At James Blond Rentals, we take pride in offering one of the most diverse and reliable vehicle rental fleets in Auckland. 
              Whether you're moving house, relocating a business, planning a road trip, or need a temporary vehicle for work, 
              we've got the right set of wheels for you. Our extensive fleet is modern, well-maintained, and ready to go—backed by 
              excellent service and unbeatable value.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            {fleetLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {fleetCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Choose James Blond Rentals?</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Book with Confidence</h2>
            <p className="text-lg">
              With easy online booking, fast pick-up, and flexible drop-off options, getting on the road is quick and simple. 
              Browse our fleet today and discover why James Blond Rentals is one of Auckland's most trusted names in vehicle hire.
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-4 mb-8">
          {fleetLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Fleet;
