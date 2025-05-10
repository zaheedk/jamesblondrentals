
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  
  // Define the routes where we want a minimized footer
  const bookingRoutes = [
    '/booking', 
    '/insurance-selection', 
    '/extras-selection', 
    '/customer-details', 
    '/payment-options', 
    '/payment',
    '/payment-success',
    '/vehicles'  // Added vehicles route
  ];

  const isBookingRoute = bookingRoutes.some(route => location.pathname.startsWith(route));

  if (isBookingRoute) {
    return (
      <footer className="bg-gray-900 text-white mt-auto py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">James Blond Rentals Booking Process</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">James Blond Rentals</h3>
            <p className="text-gray-300 mb-4">
              Premium car rental service providing quality vehicles for your travel needs.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/jamesblond.auckland" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/fleet" className="text-gray-300 hover:text-white transition-colors">Fleet</Link>
              </li>
              <li>
                <Link to="/hot-deals/mobil-fuel-discount" className="text-gray-300 hover:text-white transition-colors">Hot Deals</Link>
              </li>
              <li>
                <Link to="/airport" className="text-gray-300 hover:text-white transition-colors">Airport</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              <p>4004 Great North Road</p>
              <p>Glen Eden, Auckland 0602</p>
              <p className="mt-2">Phone: 0800 525 663</p>
              <p>Email: info@jamesblond.co.nz</p>
            </address>
            
            {/* New specialized rentals section */}
            <h3 className="text-lg font-bold mb-2 mt-6">Specialized Rentals</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/auckland-truck-rentals-hire" className="text-gray-300 hover:text-white transition-colors text-sm">Auckland Truck Rentals</Link>
              </li>
              <li>
                <Link to="/west-auckland-truck-rentals-hire" className="text-gray-300 hover:text-white transition-colors text-sm">West Auckland Truck Rentals</Link>
              </li>
              <li>
                <Link to="/wellington-truck-rentals-hire" className="text-gray-300 hover:text-white transition-colors text-sm">Wellington Truck Rentals</Link>
              </li>
              <li>
                <Link to="/wellington-cargo-van-rentals-hire" className="text-gray-300 hover:text-white transition-colors text-sm">Wellington Cargo Van Rentals</Link>
              </li>
              <li>
                <Link to="/west-auckland-cargo-van-rentals-hire" className="text-gray-300 hover:text-white transition-colors text-sm">West Auckland Cargo Van Rentals</Link>
              </li>
              <li>
                <Link to="/auckland-airport-cargo-van-rentals-hire" className="text-gray-300 hover:text-white transition-colors text-sm">Auckland Airport Cargo Van Rentals</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} James Blond Rentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
