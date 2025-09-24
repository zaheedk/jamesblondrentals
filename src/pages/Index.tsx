import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import truckPromoBanner from "@/assets/truck-promo-banner.jpg";


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
      
      {/* Truck & Jumbo Van Monday-Thursday Discount Banner */}
      <section className="relative min-h-[400px] overflow-hidden">
        <img
          src={truckPromoBanner}
          alt="Truck rental promotion banner"
          className="absolute inset-0 w-full h-full object-cover"
          width="1920"
          height="400"
          loading="lazy"
          decoding="async"
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
      
      {/* Comprehensive Vehicle Types Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-balance mb-4">Complete Vehicle Rental Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              From economy cars to luxury SUVs, cargo vans to moving trucks - we have the perfect vehicle for every journey across New Zealand
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Economy & Compact Cars */}
            <div className="card-elegant p-6">
              <h3 className="text-foreground mb-3">Economy & Compact Cars</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Fuel-efficient vehicles perfect for city driving and budget-conscious travelers. Ideal for 1-4 passengers.
              </p>
              <div className="text-xs text-muted-foreground">
                Economy • Compact • Hatchback • City Cars
              </div>
            </div>
            
            {/* Family SUVs & 4WDs */}
            <div className="card-elegant p-6">
              <h3 className="text-foreground mb-3">Family SUVs & 4WDs</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Spacious 7-seater and 8-seater SUVs with 4WD capability. Perfect for family adventures and rough terrain.
              </p>
              <div className="text-xs text-muted-foreground">
                7-Seater • 8-Seater • 4WD • AWD • Premium SUV
              </div>
            </div>
            
            {/* Minibuses & People Movers */}
            <div className="card-elegant p-6">
              <h3 className="text-foreground mb-3">Minibuses & People Movers</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Large group transportation with 10-seater, 12-seater minivans and minibuses for events and group travel.
              </p>
              <div className="text-xs text-muted-foreground">
                10-Seater • 12-Seater • Minivan • Minibus • Group Transport
              </div>
            </div>
            
            {/* Commercial Vans */}
            <div className="card-elegant p-6">
              <h3 className="text-foreground mb-3">Commercial Vans</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Cargo vans and panel vans for deliveries, moving, and commercial use. Various sizes available.
              </p>
              <div className="text-xs text-muted-foreground">
                Cargo Van • Panel Van • Transit Van • Commercial Vehicle
              </div>
            </div>
            
            {/* Trucks & Moving Vehicles */}
            <div className="card-elegant p-6">
              <h3 className="text-foreground mb-3">Trucks & Moving Vehicles</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Box trucks, tipper trucks, and furniture trucks for large moves and commercial operations.
              </p>
              <div className="text-xs text-muted-foreground">
                Box Truck • Tipper Truck • Furniture Truck • Moving Truck
              </div>
            </div>
            
            {/* Premium & Luxury */}
            <div className="card-elegant p-6">
              <h3 className="text-foreground mb-3">Premium & Luxury</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Luxury cars, premium sedans, and executive vehicles for special occasions and business travel.
              </p>
              <div className="text-xs text-muted-foreground">
                Luxury Car • Premium Sedan • Executive • High-End Vehicle
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Easy Booking Process Section */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-balance mb-4">Simple 4-Step Booking Process</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Book your rental vehicle in minutes with our streamlined online booking system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="card-feature text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-foreground mb-3">Select Dates & Location</h3>
              <p className="text-muted-foreground text-sm">
                Choose your pickup and dropoff dates, times, and location from our convenient branches
              </p>
            </div>
            
            <div className="card-feature text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-foreground mb-3">Choose Your Vehicle</h3>
              <p className="text-muted-foreground text-sm">
                Browse our extensive fleet and select the perfect vehicle for your needs and budget
              </p>
            </div>
            
            <div className="card-feature text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-foreground mb-3">Add Extras & Insurance</h3>
              <p className="text-muted-foreground text-sm">
                Customize your rental with optional extras like GPS, child seats, and comprehensive insurance
              </p>
            </div>
            
            <div className="card-feature text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-foreground mb-3">Confirm & Pay</h3>
              <p className="text-muted-foreground text-sm">
                Review your booking details, provide driver information, and complete secure online payment
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="card-elegant p-6 max-w-2xl mx-auto">
              <h4 className="text-foreground mb-3">Online Booking Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>✓ Instant confirmation</div>
                <div>✓ Best rate guarantee</div>
                <div>✓ 24/7 booking availability</div>
                <div>✓ Secure payment</div>
                <div>✓ Easy modifications</div>
                <div>✓ Digital receipts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Locations & Services */}
      <section className="section-padding bg-background">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-balance mb-4">Rental Locations Across New Zealand</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Convenient pickup and dropoff locations in major cities and airports throughout New Zealand
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Auckland Services */}
            <div className="card-elegant p-8">
              <h3 className="text-foreground mb-6">Auckland Region Services</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Airport Services</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Auckland Airport Domestic</li>
                      <li>• Auckland Airport International</li>
                      <li>• Airport shuttle service</li>
                      <li>• Terminal pickup/dropoff</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">City Locations</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Central Auckland</li>
                      <li>• West Auckland</li>
                      <li>• South Auckland</li>
                      <li>• North Shore</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-2">Specialized Auckland Services</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Cargo Van Rentals</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Truck Hire</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Minibus Rentals</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Airport Transfers</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wellington Services */}
            <div className="card-elegant p-8">
              <h3 className="text-foreground mb-6">Wellington Region Services</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Airport & City</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Wellington Airport</li>
                      <li>• Wellington CBD</li>
                      <li>• Lower Hutt</li>
                      <li>• Upper Hutt</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Regional Areas</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Porirua</li>
                      <li>• Kapiti Coast</li>
                      <li>• Wairarapa</li>
                      <li>• Marlborough</li>
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-2">Wellington Specialties</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Capital City Tours</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Business Rentals</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Government Contracts</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">Ferry Connections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="card-elegant p-6 max-w-4xl mx-auto">
              <h4 className="text-foreground mb-4">Additional Services Available</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div>One-way rentals</div>
                <div>Long-term leasing</div>
                <div>Corporate accounts</div>
                <div>Emergency replacements</div>
                <div>Delivery service</div>
                <div>Airport meet & greet</div>
                <div>After-hours pickup</div>
                <div>Insurance claims</div>
              </div>
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

    </div>
  );
};

export default Index;
