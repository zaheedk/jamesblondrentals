
import { Link, Outlet, useLocation } from "react-router-dom";

const airportLinks = [
  { name: "Auckland Airport", path: "/airport/auckland" },
  { name: "Christchurch Airport", path: "/airport/christchurch" },
  { name: "Wellington Airport", path: "/airport/wellington" },
];

const Airport = () => {
  const location = useLocation();
  const isRootPath = location.pathname === "/airport";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Airport Information</h1>
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
      {isRootPath ? (
        <p className="text-gray-600">
          Select an airport above to view detailed information about our services at that location.
        </p>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Airport;
