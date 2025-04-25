import { Link, Outlet, useLocation } from "react-router-dom";
import { CalendarIcon, MapPinIcon, PhoneIcon, PlaneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      {isRootPath ? (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">James Blond Rentals – Airport Pickups</h1>
            <p className="text-2xl font-semibold text-primary">Land, Grab Your Bags & Go – We'll Be There</p>
            <p className="text-gray-600 text-lg">
              Touching down in Auckland? Let James Blond Rentals make your arrival smooth and stress-free with our fast, friendly, and reliable airport pickup service. Whether you're flying in for business, a family vacation, or a spontaneous adventure, we're ready and waiting to get you on the road with zero hassle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {airportLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="block"
              >
                <div className="bg-[#0EA5E9] hover:bg-white transition-colors rounded-lg shadow-md">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-4 text-white hover:text-[#0EA5E9] py-6"
                  >
                    <PlaneIcon className="w-6 h-6" />
                    <span className="text-lg font-bold">{link.name}</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Why Choose Our Airport Pickup Service?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <PlaneIcon className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Fast & Convenient</h3>
                      <p className="text-gray-600">We meet you right outside the terminal. No long waits, no confusing shuttle zones—just hop in and go.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <CalendarIcon className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Car Ready When You Are</h3>
                      <p className="text-gray-600">Your rental car is prepped, fueled, and waiting for you. We'll even help with your bags and get you on your way in minutes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <MapPinIcon className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Just Minutes From the Airport</h3>
                      <p className="text-gray-600">Our depot is located less than 5 minutes from Auckland, Wellington and Christchurch Airports, meaning you're not wasting time getting to your destination.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <PhoneIcon className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Friendly, Local Support</h3>
                      <p className="text-gray-600">Need help finding us or updating your pickup time? Our local team is just a phone call away—and always happy to help.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <div className="grid gap-4">
              <div className="flex gap-4 items-center">
                <span className="text-2xl font-bold text-primary">1.</span>
                <div>
                  <h3 className="font-semibold">Book Online or Call Us</h3>
                  <p className="text-gray-600">Select "Airport Pickup" when booking your rental. Easy.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <span className="text-2xl font-bold text-primary">2.</span>
                <div>
                  <h3 className="font-semibold">Flight Info = Perfect Timing</h3>
                  <p className="text-gray-600">Give us your flight number, and we'll track your arrival so we're there when you land.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <span className="text-2xl font-bold text-primary">3.</span>
                <div>
                  <h3 className="font-semibold">Follow Instructions</h3>
                  <p className="text-gray-600">Follow the respective airport instructions that you received on your confirmation email.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <span className="text-2xl font-bold text-primary">4.</span>
                <div>
                  <h3 className="font-semibold">Drive Away Happy</h3>
                  <p className="text-gray-600">Paperwork is quick, and you'll be on the road in no time.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Travel Made Easy</h2>
            <p className="text-gray-600">
              At James Blond Rentals, we don't just hand over keys—we deliver peace of mind. Whether you're arriving at 6am or midnight, we make sure you're picked up, taken care of, and on the road with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
              <Button size="lg" asChild>
                <Link to="/booking">Book Now</Link>
              </Button>
              <p className="text-gray-600">
                or call us at <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a> and ask about our airport pickup service!
              </p>
            </div>
          </section>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Airport;
