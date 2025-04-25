
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Simple site config object to replace the missing import
const siteConfig = {
  name: "James Blond Rentals"
};

export function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          {siteConfig.name}
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/about" className="text-sm font-medium">About</Link>
          <Link to="/vehicles" className="text-sm font-medium">Vehicles</Link>
          <Link to="/fleet" className="text-sm font-medium">Fleet</Link>
          <Link to="/airport" className="text-sm font-medium">Airport</Link>
          <Link to="/faq" className="text-sm font-medium">FAQ</Link>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <Button asChild>
            <Link to={isHomePage ? "/booking" : "/"}>
              {isHomePage ? "Book Now" : "Home"}
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
