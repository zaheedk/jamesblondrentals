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
              <div className="text-2xl font-bold text-foreground mb-1">6 Locations</div>
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

      {/* Popular Vehicle Types */}
      <section className="section-padding bg-muted/40">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <h2 className="text-balance mb-4">Popular Vehicle Types</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the right vehicle for every job — from compact city cars to heavy-duty trucks and group minibuses.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/minibus/10-seat-minibus">10-Seater Minibus</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/minibus/12-seat-minibus">12-Seater Minibus</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/cars/premium-seven-seat-suv">7-Seater SUV</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/cars/premium-2wd-suv">2WD SUV</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/cars/premium-awd-suv">AWD SUV</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/cars">Compact Car</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/cars">Hybrid Car</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/trucks">2-Tonne Truck</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/trucks">3-Tonne Truck</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/utes">Hilux Ute</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/trailers">Cage Trailer</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/fleet/trailers">Furniture Trailer</Link>
            </Button>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="min-w-48">
              <Link to="/vehicles">View All Vehicles</Link>
            </Button>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><path d="M12 18v-4"/><path d="M8 12v6"/><path d="M16 16v2"/></svg>
              </div>
              <h3 className="text-foreground mb-3">Christchurch Airport</h3>
              <p className="text-muted-foreground mb-6">Pick up your rental right at Christchurch International Airport</p>
              <Button variant="outline" asChild>
                <Link to="/airport/christchurch">View Details</Link>
              </Button>
            </div>
            <div className="card-feature text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="text-foreground mb-3">Christchurch Central</h3>
              <p className="text-muted-foreground mb-6">Car, van and truck hire in the heart of Christchurch city</p>
              <Button variant="outline" asChild>
                <Link to="/contact/christchurch-central">View Details</Link>
              </Button>
            </div>
            <div className="card-feature text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="text-foreground mb-3">Hamilton</h3>
              <p className="text-muted-foreground mb-6">Affordable van and truck hire serving the Waikato region</p>
              <Button variant="outline" asChild>
                <Link to="/contact/hamilton">View Details</Link>
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
