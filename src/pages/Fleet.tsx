
import { Link, Outlet } from "react-router-dom";

const fleetLinks = [
  { name: "Cars", path: "/fleet/cars" },
  { name: "Vans", path: "/fleet/vans" },
  { name: "Trucks", path: "/fleet/trucks" },
  { name: "Minibuses", path: "/fleet/minibuses" },
  { name: "Trailers", path: "/fleet/trailers" },
  { name: "Furniture Truck", path: "/fleet/furniture-truck" },
];

const Fleet = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold mb-4">Our Fleet</h1>
    <p className="mb-8 text-gray-600">
      Explore our diverse range of vehicles for every journey, from cars to trailers and trucks.
    </p>
    <div className="flex flex-wrap gap-4 mb-6">
      {fleetLinks.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          {link.name}
        </Link>
      ))}
    </div>
    <Outlet />
  </div>
);

export default Fleet;
