
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsMobileMenuOpen(false);
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
              Book
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
                        to="/fleet/cargo-vans" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        Cargo Vans
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
                        to="/fleet/minibus" 
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
            <Link to="/price-guide" className="text-gray-600 hover:text-primary transition-colors font-bold">
              Price Guide
            </Link>
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
            <Link to="/winz-quotes" className="text-gray-600 hover:text-primary transition-colors font-bold">
              WINZ Quotes
            </Link>
            
            {/* Add account navigation */}
            {user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-primary hover:text-primary/80 transition-colors bg-transparent font-bold">
                      <User className="h-4 w-4 mr-1" />
                      Account
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-48 p-2">
                        <div className="px-4 py-2 text-xs text-gray-500 border-b mb-1">
                          {user.email}
                        </div>
                        <Link 
                          to="/member-dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Dashboard
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                        >
                          Sign Out
                        </button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-in">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="fleet" className="border-b-0">
                <AccordionTrigger className="py-2 text-gray-600 hover:text-primary transition-colors">
                  Fleet
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
                    <Link to="/fleet/cars" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Cars
                    </Link>
                    <Link to="/fleet/vans" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Vans
                    </Link>
                    <Link to="/fleet/cargo-vans" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Cargo Vans
                    </Link>
                    <Link to="/fleet/trucks" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Trucks
                    </Link>
                    <Link to="/fleet/utes" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      UTEs
                    </Link>
                    <Link to="/fleet/minibus" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Minibuses
                    </Link>
                    <Link to="/fleet/trailers" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Trailers
                    </Link>
                    <Link to="/fleet/accessories" className="block text-gray-600 hover:text-primary transition-colors py-1" onClick={() => setIsMobileMenuOpen(false)}>
                      Accessories
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="airport" className="border-b-0">
                <AccordionTrigger className="py-2 text-gray-600 hover:text-primary transition-colors">
                  Airport
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="contact" className="border-b-0">
                <AccordionTrigger className="py-2 text-gray-600 hover:text-primary transition-colors">
                  Contact
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
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
                </AccordionContent>
              </AccordionItem>

              {user && (
                <AccordionItem value="account" className="border-b-0">
                  <AccordionTrigger className="py-2 text-primary hover:text-primary transition-colors">
                    My Account
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-2">
                      <div className="text-xs text-gray-500 py-1">
                        {user.email}
                      </div>
                      <Link 
                        to="/member-dashboard" 
                        className="block text-gray-600 hover:text-primary transition-colors py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left text-red-600 hover:text-red-700 transition-colors py-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
            
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Book
              </Link>
              <Link to="/price-guide" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Price Guide
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                FAQ
              </Link>
              <Link to="/winz-quotes" className="text-gray-600 hover:text-primary transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                WINZ Quotes
              </Link>

              {/* Mobile auth buttons */}
              {!user && (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
