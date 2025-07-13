import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { X, Truck } from "lucide-react";
import truckPromoBanner from "@/assets/truck-promo-banner.jpg";

const Index = () => {
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    document.title = "Affordable Car, Van and Truck Rentals - Auckland & Wellington - James Blond Rentals";
  }, []);

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

  // Show campaign modal on page load - only once per session
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('winter-campaign-modal-seen');
    
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowCampaignModal(true);
        sessionStorage.setItem('winter-campaign-modal-seen', 'true');
      }, 1500); // Show after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      <Hero />
      
      {/* Winter Campaign Banner */}
      <section className="bg-gradient-to-r from-primary to-primary/90 py-4">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>
                <h3 className="text-xl font-bold text-white">Winter Premium Special!</h3>
              </div>
              <p className="text-white/90 text-lg mb-4">
                <span className="font-bold text-yellow-300">Save 25%</span> on all Premium Cars and People Movers with code <span className="font-mono bg-white/20 px-2 py-1 rounded text-white font-bold">WINTER25</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm text-white/80">
                <span>📅 Valid until 31st August</span>
                <span className="hidden sm:inline">•</span>
                <span>⏰ Minimum 3 days rental required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedVehicles />
      
      {/* Truck & Jumbo Van Monday-Thursday Discount Banner */}
      <section className="relative min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${truckPromoBanner})`,
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
        
        <div className="container mx-auto container-padding py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Truck className="h-10 w-10 text-yellow-400" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Weekday Truck Special!
              </h2>
              <Truck className="h-10 w-10 text-yellow-400" />
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <div className="text-center mb-6">
                <div className="text-6xl md:text-7xl font-bold text-yellow-400 mb-2">25%</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-4">OFF</div>
                <p className="text-xl md:text-2xl text-white/95 font-semibold">
                  All Trucks & Jumbo Vans
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="bg-yellow-400/20 px-4 py-2 rounded-lg border border-yellow-400/30">
                  <span className="text-yellow-400 font-bold text-lg">Monday to Thursday Rentals</span>
                </div>
              </div>
              
              <p className="text-white/90 text-lg mb-6">
                Perfect for business moves, deliveries, and large cargo transportation during weekdays.
                Same week pickup and dropoff required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold min-w-48">
                  <Link to="/fleet/trucks">View Trucks</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black min-w-48">
                  <Link to="/fleet/vans/jumbo-van">View Jumbo Vans</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-white/80">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Valid for Monday-Thursday same week rentals</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span>🚛</span>
                <span>Automatic discount applied during booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About James Blond Section */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="gradient-text text-balance mb-4">About James Blond Rentals</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
          </div>
          <div className="max-w-4xl mx-auto space-y-8 text-muted-foreground">
            <div className="card-elegant p-8 text-center">
              <p className="text-lg leading-relaxed">
                James Blond Rentals, established in <span className="font-semibold text-primary">2004</span>, has evolved into one of the leading car rental companies, 
                known for its commitment to excellence and customer satisfaction. With a client base exceeding <span className="font-semibold text-primary">half a million</span> 
                satisfied customers, James Blond Rentals offers a diverse and expansive fleet, including premium vehicles 
                and executive-class options to cater to discerning travellers.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-elegant p-6">
                <h4 className="text-foreground mb-4">Perfect Vehicle Match</h4>
                <p>
                  Whether you're seeking an affordable rental or a luxurious driving experience, James Blond Rentals ensures 
                  you'll find the perfect vehicle for your needs.
                </p>
              </div>
              <div className="card-elegant p-6">
                <h4 className="text-foreground mb-4">Convenient Locations</h4>
                <p>
                  With convenient locations, including service from both domestic and international terminals at Auckland Airport, 
                  the company provides seamless access to top-quality rental options.
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                James Blond Rentals is dedicated to delivering the very best in commercial and car rental experiences, 
                combining global reach with unparalleled quality and service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Fleet Section */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-balance mb-4">Our Fleet</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Looking for the perfect vehicle for your next journey? Our extensive range of car rentals has something for every need. 
              Whether you're travelling with a large group or need a vehicle for a family outing, we've got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <div className="card-feature group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.5"/><path d="M2 7h8"/><path d="M2 17h8"/><path d="M22 17h-4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-3">Minivans for Groups</h3>
                  <p className="text-muted-foreground mb-4">
                    If you need space for a big group, consider our 10-seater minivan rental or our 12-seater minivan rental options. 
                    These spacious vehicles are ideal for family trips, group vacations, or even business events where comfort and 
                    room are essential.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild size="sm">
                      <Link to="/fleet/minibus/10-seat-minibus">10-Seater Minivan</Link>
                    </Button>
                    <Button variant="outline" asChild size="sm">
                      <Link to="/fleet/minibus/12-seat-minibus">12-Seater Minivan</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-feature group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10h-1"/><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/><path d="M7 17h6"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-3">Family Vehicles</h3>
                  <p className="text-muted-foreground mb-4">
                    For smaller groups or families, our 7-seater car hire options are perfect. 
                    These vehicles offer ample room without compromising on style or efficiency.
                  </p>
                  <Button variant="outline" asChild size="sm">
                    <Link to="/fleet/cars/premium-seven-seat-suv">7-Seater SUVs</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="card-feature group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-3">Eco-Friendly Options</h3>
                  <p className="text-muted-foreground mb-4">
                    Looking to reduce your carbon footprint? We offer hybrid cars for rent, combining fuel efficiency with 
                    lower emissions. Perfect for eco-conscious drivers.
                  </p>
                  <Button variant="outline" asChild size="sm">
                    <Link to="/fleet/cars">Hybrid Cars</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="card-feature group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground mb-3">SUVs & Adventure</h3>
                  <p className="text-muted-foreground mb-4">
                    Our SUV rentals provide both power and space, perfect for tackling different terrains and ensuring 
                    a comfortable ride on any adventure.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" asChild size="sm">
                      <Link to="/fleet/cars/premium-2wd-suv">2WD SUVs</Link>
                    </Button>
                    <Button variant="outline" asChild size="sm">
                      <Link to="/fleet/cars/premium-awd-suv">AWD SUVs</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="card-elegant p-8 max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground mb-6">
                No matter what your transportation needs are, our diverse fleet of vehicles ensures you'll find the perfect match. 
                Book your rental today and enjoy a stress-free journey with a vehicle that meets all your requirements.
              </p>
              <Button asChild size="lg" className="min-w-48">
                <Link to="/vehicles">View All Vehicles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Book with Confidence Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-balance mb-4">Book with Confidence</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-elegant p-6">
                <h4 className="text-foreground mb-4">Trusted Experience</h4>
                <p className="text-muted-foreground">
                  James Blond Rentals is a well trusted name when it comes to car rental or truck rental company in Auckland. 
                  We understand the importance of convenience when it comes to renting a vehicle.
                </p>
              </div>
              <div className="card-elegant p-6">
                <h4 className="text-foreground mb-4">Easy Online Booking</h4>
                <p className="text-muted-foreground">
                  Our online booking platform allows you to reserve your desired vehicle from the comfort of your own home, 
                  saving you time and eliminating the need for in-person visits.
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
                With a few clicks, you can select the dates, pick-up and drop-off locations, and choose from our extensive fleet 
                of well-maintained rental cars, trucks, vans and more. Our user-friendly interface ensures a hassle-free booking 
                process, making your travel arrangements a breeze.
              </p>
              <div className="card-elegant bg-gradient-to-r from-primary/5 to-primary/10 p-8 max-w-3xl mx-auto border-primary/20">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
                  <h4 className="text-2xl font-bold text-primary">James Blond Guarantee</h4>
                </div>
                <p className="text-lg font-medium text-primary/90">
                  No hidden costs. No surprise taxes. Transparent Rental policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Locations */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-balance mb-4">Popular Rental Locations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="card-feature text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><path d="M12 18v-4"/><path d="M8 12v6"/><path d="M16 16v2"/></svg>
              </div>
              <h3 className="text-foreground mb-3">Auckland Airport</h3>
              <p className="text-muted-foreground mb-6">Convenient rentals minutes from Auckland International Airport</p>
              <Button variant="outline" asChild>
                <Link to="/car-rental-auckland-airport-new-zealand">View Details</Link>
              </Button>
            </div>
            <div className="card-feature text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="text-foreground mb-3">Wellington City</h3>
              <p className="text-muted-foreground mb-6">Explore the capital city with our Wellington branch</p>
              <Button variant="outline" asChild>
                <Link to="/car-rental-wellington-new-zealand">View Details</Link>
              </Button>
            </div>
            <div className="card-feature text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
              </div>
              <h3 className="text-foreground mb-3">Specialized Rentals</h3>
              <p className="text-muted-foreground mb-6">Purpose-built vehicles for every need</p>
              <div className="flex flex-col gap-2">
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
          
          {/* Auckland Region Cargo Vans Section */}
          <div className="card-elegant p-8 max-w-5xl mx-auto">
            <h3 className="text-center mb-8 text-foreground">Auckland Region Cargo Van Rentals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" asChild size="sm" className="h-auto py-3">
                <Link to="/central-auckland-cargo-van-rentals-hire">Central Auckland Cargo Vans</Link>
              </Button>
              <Button variant="outline" asChild size="sm" className="h-auto py-3">
                <Link to="/west-auckland-cargo-van-rentals-hire">West Auckland Cargo Vans</Link>
              </Button>
              <Button variant="outline" asChild size="sm" className="h-auto py-3">
                <Link to="/south-auckland-cargo-van-rentals-hire">South Auckland Cargo Vans</Link>
              </Button>
              <Button variant="outline" asChild size="sm" className="h-auto py-3">
                <Link to="/auckland-airport-cargo-van-rentals-hire">Airport Cargo Vans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Section */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-balance mb-6">Why Choose James Blond Rentals</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-feature text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-foreground mb-4">Quality Vehicles</h3>
              <p className="text-muted-foreground">All our vehicles are thoroughly inspected and maintained to ensure your safety and comfort.</p>
            </div>
            
            <div className="card-feature text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20m-8-8h16"/></svg>
              </div>
              <h3 className="text-foreground mb-4">Affordable Rates</h3>
              <p className="text-muted-foreground">Competitive pricing with no hidden fees, plus special discounts for extended rentals.</p>
            </div>
            
            <div className="card-feature text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-foreground mb-4">24/7 Support</h3>
              <p className="text-muted-foreground">Our customer service team is available around the clock to assist you with any needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white mb-6 text-balance">Ready to Book Your Perfect Ride?</h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Choose from our extensive fleet of vehicles and enjoy a smooth rental experience from start to finish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="min-w-48">
                <Link to="/vehicles">Browse Fleet</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-w-48 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Modal */}
      <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-r from-primary to-primary/90 border-primary/30">
          <div className="absolute right-4 top-4">
            <button
              onClick={() => setShowCampaignModal(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4 text-white" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>
              <DialogTitle className="text-2xl font-bold text-white">Winter Premium Special!</DialogTitle>
            </div>
            <p className="text-white/90 text-lg mb-6">
              <span className="font-bold text-yellow-300">Save 25%</span> on all Premium Cars and People Movers with code
            </p>
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <span className="font-mono text-2xl font-bold text-white">WINTER25</span>
            </div>
            <div className="space-y-2 text-sm text-white/90 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span>📅</span>
                <span>Valid until 31st August</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>⏰</span>
                <span>Minimum 3 days rental required</span>
              </div>
            </div>
            <Button 
              onClick={() => setShowCampaignModal(false)}
              variant="secondary" 
              size="lg" 
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
