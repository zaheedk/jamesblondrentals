
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
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/900107e8-dbcb-44ce-96a9-0588959abf24.png" 
              alt="James Blond Rentals Logo" 
              className="h-10 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/fleet" className="text-gray-600 hover:text-primary transition-colors">
              Fleet
            </Link>
            <Link to="/airport" className="text-gray-600 hover:text-primary transition-colors">
              Airport
            </Link>
            <Link to="/faq" className="text-gray-600 hover:text-primary transition-colors">
              FAQ
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-primary transition-colors bg-transparent">
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
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/fleet" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Fleet
              </Link>
              <Link to="/airport" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Airport
              </Link>
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
