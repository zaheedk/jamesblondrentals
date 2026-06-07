import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import CustomerReviews from "@/components/home/CustomerReviews";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { ChevronDown, CalendarClock, Users, MapPin, Crown, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


const Index = () => {
  const [faqOpen, setFaqOpen] = useState(false);


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
      <Helmet>
        <title>Low Cost Car, Van & Truck Hire New Zealand</title>
        <meta name="description" content="Affordable car, van and truck hire in Auckland, Wellington and Christchurch. Book online with James Blond Rentals – no hidden fees, just trusted service." />
      </Helmet>
      
      <Hero />
      
      <CustomerReviews />
      
      <FeaturedVehicles />
      
      
      {/* Trust Strip */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <h2 className="gradient-text text-balance mb-4">Why Kiwis Trust James Blond</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reliable car, van, truck and minibus hire across New Zealand since 2004.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="card-elegant p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarClock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">Since 2004</div>
              <div className="text-sm text-muted-foreground">20+ years of experience</div>
            </div>
            
            <div className="card-elegant p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">100,000+</div>
              <div className="text-sm text-muted-foreground">Happy customers</div>
            </div>
            
            <div className="card-elegant p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">4 Locations</div>
              <div className="text-sm text-muted-foreground">Across NZ</div>
            </div>
            
            <div className="card-elegant p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">Premium</div>
              <div className="text-sm text-muted-foreground">Quality fleet</div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Learn more about us
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            <div className="card-feature overflow-hidden group">
              <img 
                src={minivansGroupImage} 
                alt="12-seater minibus rental Wellington with family group near Parliament building for group travel" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.5"/><path d="M2 7h8"/><path d="M2 17h8"/><path d="M22 17h-4"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                  </div>
                  <h3 className="text-foreground">Minivans for Groups</h3>
                </div>
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
            
            <div className="card-feature overflow-hidden group">
              <img 
                src={familyVehicleImage} 
                alt="7-seater SUV rental Auckland with Sky Tower view perfect for family car hire New Zealand" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10h-1"/><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/><path d="M7 17h6"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                  </div>
                  <h3 className="text-foreground">Family Vehicles</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  For smaller groups or families, our 7-seater car hire options are perfect. 
                  These vehicles offer ample room without compromising on style or efficiency.
                </p>
                <Button variant="outline" asChild size="sm">
                  <Link to="/fleet/cars/premium-seven-seat-suv">7-Seater SUVs</Link>
                </Button>
              </div>
            </div>
            
            <div className="card-feature overflow-hidden group">
              <img 
                src={ecoFriendlyImage} 
                alt="Eco-friendly hybrid car rental New Zealand with low emissions for sustainable travel" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                  </div>
                  <h3 className="text-foreground">Eco-Friendly Options</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Looking to reduce your carbon footprint? We offer hybrid cars for rent, combining fuel efficiency with 
                  lower emissions. Perfect for eco-conscious drivers.
                </p>
                <Button variant="outline" asChild size="sm">
                  <Link to="/fleet/cars">Hybrid Cars</Link>
                </Button>
              </div>
            </div>
            
            <div className="card-feature overflow-hidden group">
              <img 
                src={suvAdventureImage} 
                alt="AWD SUV rental New Zealand mountain adventure driving on alpine roads and scenic terrain" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                  </div>
                  <h3 className="text-foreground">SUVs & Adventure</h3>
                </div>
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
                <h3 className="text-foreground mb-4">Trusted Experience</h3>
                <p className="text-muted-foreground">
                  James Blond Rentals is a well trusted name when it comes to car rental or truck rental company in Auckland. 
                  We understand the importance of convenience when it comes to renting a vehicle.
                </p>
              </div>
              <div className="card-elegant p-6">
                <h3 className="text-foreground mb-4">Easy Online Booking</h3>
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
                  <h3 className="text-2xl font-bold text-primary">James Blond Guarantee</h3>
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
                  <Link to="/truck-hire-wellington">Wellington Trucks</Link>
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

      {/* FAQ Section */}
      <section className="section-padding bg-muted/20 border-t">
        <div className="container mx-auto container-padding">
          <Collapsible open={faqOpen} onOpenChange={setFaqOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full mb-6 text-left group">
              <div>
                <h2 className="text-xl font-bold mb-2">Frequently Asked Questions</h2>
                <p className="text-muted-foreground text-sm">
                  Get answers to common questions about van and truck hire
                </p>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${faqOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              <div className="max-w-4xl">
                <Accordion type="single" collapsible className="w-full text-sm">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left text-sm font-medium">Do you offer van hire in Auckland and Wellington?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, James Blond Rentals provides affordable van hire in both Auckland and Wellington, with multiple sizes including 7-seater, 10-seater and 12-seater options.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left text-sm font-medium">Can I hire a moving truck in Auckland or Wellington?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, moving truck hire is available in both Auckland and Wellington. Daily and multi-day hire options are offered with flexible booking times.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left text-sm font-medium">Is same day rental available for vans or trucks?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Same day rental for vans and trucks is often available depending on fleet status. Call 0800 525 663 to check current availability.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left text-sm font-medium">Do you provide airport pickup for rentals?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, van rental with airport pickup can be arranged in Auckland. Please contact us in advance to confirm timing and vehicle size.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left text-sm font-medium">What documents do I need to rent a van or truck?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      A valid driver licence and a payment method for the bond are required for all rentals. Additional ID may be requested for certain vehicles.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left text-sm font-medium">Are weekend rentals available in both cities?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, weekend truck and van rentals are available in both Auckland and Wellington. Early booking is recommended during busy periods.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-left text-sm font-medium">How much does it cost to hire a van in Auckland?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Van hire prices in Auckland depend on the vehicle size and rental duration. Daily rates start from affordable options, with discounts for longer rentals.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-left text-sm font-medium">Can I hire a truck in Wellington for moving house?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, moving truck hire is available in Wellington for house moves, office relocations, and deliveries. Trucks can be hired for a single day or longer periods.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-9">
                    <AccordionTrigger className="text-left text-sm font-medium">Do you provide 12 seater van hire for group travel?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, 12 seater vans are available for hire, perfect for group trips, sports teams, or family outings in both Auckland and Wellington.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-10">
                    <AccordionTrigger className="text-left text-sm font-medium">What licence do I need to rent a moving truck?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Most moving trucks can be driven on a standard full car licence. Larger trucks may require a Class 2 licence depending on weight.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-11">
                    <AccordionTrigger className="text-left text-sm font-medium">Is one way truck hire available between Auckland and Wellington?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, one way truck hire can be arranged between branches. Availability and extra fees apply, so booking ahead is recommended.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-12">
                    <AccordionTrigger className="text-left text-sm font-medium">Do rental vans include insurance?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, rental vans and trucks include standard insurance. Optional excess reduction and additional cover can be added for extra peace of mind.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-13">
                    <AccordionTrigger className="text-left text-sm font-medium">Can I rent a van with unlimited kilometres?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, unlimited kilometre van hire is available on selected rentals. Always confirm during booking as conditions may vary by vehicle type.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-14">
                    <AccordionTrigger className="text-left text-sm font-medium">Do you offer weekend specials for truck hire?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Weekend truck and van hire is popular in both Auckland and Wellington. Book early to secure vehicles and check for available weekend packages.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-15">
                    <AccordionTrigger className="text-left text-sm font-medium">Can international visitors rent vans or trucks?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      Yes, overseas visitors can hire vans and trucks using a valid driver licence in English or an approved international driving permit.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-16">
                    <AccordionTrigger className="text-left text-sm font-medium">What is the bond required for van or truck rental?</AccordionTrigger>
                    <AccordionContent className="text-left text-sm">
                      A refundable bond is required for all rentals. The amount depends on the vehicle type and insurance option chosen.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

    </div>
  );
};

export default Index;
