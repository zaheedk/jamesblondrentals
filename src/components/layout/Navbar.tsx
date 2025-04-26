import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png" 
              alt="James Blond Rentals Logo" 
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-bold">
              Home
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-primary transition-colors bg-transparent font-bold">
                    Fleet
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link 
                        to="/fleet/cars" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Cars
                      </Link>
                      <Link 
                        to="/fleet/vans" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Vans
                      </Link>
                      <Link 
                        to="/fleet/trucks" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Trucks
                      </Link>
                      <Link 
                        to="/fleet/utes" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        UTEs
                      </Link>
                      <Link 
                        to="/fleet/minibuses" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Minibuses
                      </Link>
                      <Link 
                        to="/fleet/trailers" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Trailers
                      </Link>
                      <Link 
                        to="/fleet/accessories" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Accessories
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-primary transition-colors bg-transparent font-bold">
                    Airport
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link 
                        to="/airport/auckland" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Auckland
                      </Link>
                      <Link 
                        to="/airport/wellington" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Wellington
                      </Link>
                      <Link 
                        to="/airport/christchurch" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Christchurch
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link to="/faq" className="text-gray-600 hover:text-primary transition-colors font-bold">
              FAQ
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-primary transition-colors bg-transparent font-bold">
                    Contact
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link 
                        to="/contact/auckland" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Auckland
                      </Link>
                      <Link 
                        to="/contact/wellington" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Wellington
                      </Link>
                      <Link 
                        to="/contact/christchurch" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Christchurch
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors font-bold">
              About
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <div className="py-2 pl-4 space-y-2">
                <p className="font-medium text-gray-600">Fleet:</p>
                <Link to="/fleet/cars" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Cars
                </Link>
                <Link to="/fleet/vans" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Vans
                </Link>
                <Link to="/fleet/trucks" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Trucks
                </Link>
                <Link to="/fleet/utes" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  UTEs
                </Link>
                <Link to="/fleet/minibuses" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Minibuses
                </Link>
                <Link to="/fleet/trailers" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Trailers
                </Link>
                <Link to="/fleet/accessories" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Accessories
                </Link>
              </div>
              <div className="py-2 pl-4 space-y-2">
                <p className="font-medium text-gray-600">Airport:</p>
                <Link to="/airport/auckland" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Auckland
                </Link>
                <Link to="/airport/wellington" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Wellington
                </Link>
                <Link to="/airport/christchurch" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Christchurch
                </Link>
              </div>
              <Link to="/faq" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                FAQ
              </Link>
              <div className="py-2 pl-4 space-y-2">
                <p className="font-medium text-gray-600">Contact:</p>
                <Link to="/contact/auckland" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Auckland
                </Link>
                <Link to="/contact/wellington" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Wellington
                </Link>
                <Link to="/contact/christchurch" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                  Christchurch
                </Link>
              </div>
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
