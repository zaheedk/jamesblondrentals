import { Link, useLocation } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layout/main-nav";

export function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          {siteConfig.name}
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link to={isHomePage ? "/booking" : "/"}>Book Now</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
