
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import { format } from "date-fns";

const Index = () => {
  // Get today's date at noon as the default pickup date
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const pickupDate = format(today, "dd/MM/yyyy");

  // Get the same day at a later time for dropoff as default
  // Users can now select same-day dropoff
  const dropoffDate = format(today, "dd/MM/yyyy");

  // Construct search URL with default parameters
  const searchParams = new URLSearchParams({
    pickupLocation: "7", // Auckland Airport location ID
    dropoffLocation: "7",
    pickupDate,
    dropoffDate,
    pickupTime: "12:00", // Consistent noon time
    dropoffTime: "16:00", // Default to 4:00 PM for same-day dropoff
    age: "4", // Default age group
    carCategory: "0" // All categories
  }).toString();

  return (
    <div>
      <Hero />
      
      <FeaturedVehicles />
      
      {/* About James Blond Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About James Blond Rentals</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
            <p className="leading-relaxed">
              James Blond Rentals, established in 2004, has evolved into one of the leading car rental companies, 
              known for its commitment to excellence and customer satisfaction. With a client base exceeding half a million 
              satisfied customers, James Blond Rentals offers a diverse and expansive fleet, including premium vehicles 
              and executive-class options to cater to discerning travellers.
            </p>
            <p className="leading-relaxed">
              Whether you're seeking an affordable rental or a luxurious driving experience, James Blond Rentals ensures 
              you'll find the perfect vehicle for your needs. With convenient locations, including service from both 
              domestic and international terminals at Auckland Airport, the company provides seamless access to top-quality 
              rental options.
            </p>
            <p className="leading-relaxed">
              James Blond Rentals is dedicated to delivering the very best in commercial and car rental experiences, 
              combining global reach with unparalleled quality and service.
            </p>
          </div>
        </div>
      </section>

      {/* Our Fleet Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Fleet</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
            <p className="leading-relaxed">
              Looking for the perfect vehicle for your next journey? Our extensive range of car rentals has something for every need. 
              Whether you're travelling with a large group or need a vehicle for a family outing, we've got you covered.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-primary">Minivans for Groups</h3>
                <p>
                  If you need space for a big group, consider our 10-seater minivan rental or our 12-seater minivan rental options. 
                  These spacious vehicles are ideal for family trips, group vacations, or even business events where comfort and 
                  room are essential. Each minivan is well-maintained and equipped with modern amenities to ensure a smooth ride.
                </p>
                <div className="mt-4">
                  <Button variant="outline" asChild size="sm" className="mr-2 mb-2">
                    <Link to="/fleet/minibuses/10-seat-minibus">10-Seater Minivan</Link>
                  </Button>
                  <Button variant="outline" asChild size="sm" className="mb-2">
                    <Link to="/fleet/minibuses/12-seat-minibus">12-Seater Minivan</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-primary">Family Vehicles</h3>
                <p>
                  For smaller groups or families, our 7-seater car hire and 8-seater for rent options are perfect. 
                  These vehicles offer ample room without compromising on style or efficiency. They are ideal for 
                  those who need a bit more space but don't require a full-sized minivan.
                </p>
                <div className="mt-4">
                  <Button variant="outline" asChild size="sm" className="mr-2">
                    <Link to="/fleet/cars/premium-seven-seat-suv">7-Seater SUVs</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-primary">Eco-Friendly Options</h3>
                <p>
                  Looking to reduce your carbon footprint? We offer hybrid cars for rent, combining fuel efficiency with 
                  lower emissions. These cars are perfect for eco-conscious drivers who still want the performance and 
                  reliability of a traditional vehicle.
                </p>
                <div className="mt-4">
                  <Button variant="outline" asChild size="sm">
                    <Link to="/fleet/cars">Hybrid Cars</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-primary">SUVs & Adventure</h3>
                <p>
                  If you're an SUV enthusiast, our SUV rentals provide both power and space, perfect for tackling different 
                  terrains and ensuring a comfortable ride on any adventure. Whether you're navigating city streets or 
                  heading off-road, our SUVs are ready for the challenge.
                </p>
                <div className="mt-4">
                  <Button variant="outline" asChild size="sm" className="mr-2 mb-2">
                    <Link to="/fleet/cars/premium-2wd-suv">2WD SUVs</Link>
                  </Button>
                  <Button variant="outline" asChild size="sm" className="mb-2">
                    <Link to="/fleet/cars/premium-awd-suv">AWD SUVs</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="mb-6">
                No matter what your transportation needs are, our diverse fleet of vehicles ensures you'll find the perfect match. 
                Book your rental today and enjoy a stress-free journey with a vehicle that meets all your requirements.
              </p>
              <Button asChild>
                <Link to="/vehicles">View All Vehicles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Book with Confidence Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Book with Confidence</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
            <p className="leading-relaxed">
              'James Blond Rentals' is a well trusted name when it comes to car rental or truck rental company in Auckland. 
              We understand the importance of convenience when it comes to renting a vehicle. Our online booking platform allows 
              you to reserve your desired vehicle from the comfort of your own home, saving you time and eliminating the need 
              for in-person visits.
            </p>
            <p className="leading-relaxed">
              With a few clicks, you can select the dates, pick-up and drop-off locations, and choose from our extensive fleet 
              of well-maintained rental cars, trucks, vans and more. Our user-friendly interface ensures a hassle-free booking 
              process, making your travel arrangements a breeze.
            </p>
            <div className="bg-primary/5 p-6 rounded-lg mt-8 text-center">
              <p className="text-xl font-semibold text-primary">
                James Blond Guarantee! No hidden costs. No surprise taxes. Transparent Rental policy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Locations */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Rental Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Auckland Airport</h3>
              <p className="mb-4">Convenient rentals minutes from Auckland International Airport</p>
              <Button variant="outline" asChild>
                <Link to="/car-rental-auckland-airport-new-zealand">View Details</Link>
              </Button>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Wellington City</h3>
              <p className="mb-4">Explore the capital city with our Wellington branch</p>
              <Button variant="outline" asChild>
                <Link to="/car-rental-wellington-new-zealand">View Details</Link>
              </Button>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Specialized Rentals</h3>
              <p className="mb-4">Purpose-built vehicles for every need</p>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" asChild size="sm">
                  <Link to="/west-auckland-truck-rentals-hire">West Auckland Trucks</Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <Link to="/wellington-truck-rentals-hire">Wellington Trucks</Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <Link to="/wellington-cargo-van-rentals-hire">Wellington Cargo Vans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose James Blond Rentals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Vehicles</h3>
              <p className="text-gray-600">All our vehicles are thoroughly inspected and maintained to ensure your safety and comfort.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordable Rates</h3>
              <p className="text-gray-600">Competitive pricing with no hidden fees, plus special discounts for extended rentals.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is available around the clock to assist you with any needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Perfect Ride?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Choose from our extensive fleet of vehicles and enjoy a smooth rental experience from start to finish.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
