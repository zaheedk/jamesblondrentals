
import { Link, Outlet } from "react-router-dom";

const airportLinks = [
  { name: "About Airport Service", path: "/airport/about" },
  { name: "Auckland Airport Shuttle", path: "/airport/shuttle" },
  { name: "Directions", path: "/airport/directions" },
];

const Airport = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold mb-4">Airport Information</h1>
    <p className="mb-8 text-gray-600">
      Everything you need to know about our airport pickup, drop-off, and shuttle services.
    </p>
    <div className="flex flex-wrap gap-4 mb-6">
      {airportLinks.map(link => (
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

export default Airport;
