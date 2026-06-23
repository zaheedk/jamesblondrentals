import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import CustomerReviews from "@/components/home/CustomerReviews";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { ChevronDown, CalendarClock, Users, MapPin, Crown, ArrowRight } from "lucide-react";
import PageSEO from '@/components/PageSEO';
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
import aucklandAirportImg from "@/assets/locations/auckland-airport.jpg";
import wellingtonCityImg from "@/assets/locations/wellington-city.jpg";
import christchurchAirportImg from "@/assets/locations/christchurch-airport.jpg";
import christchurchCentralImg from "@/assets/locations/christchurch-central.jpg";
import hamiltonImg from "@/assets/locations/hamilton.jpg";
import westAucklandImg from "@/assets/locations/west-auckland.jpg";


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
      <PageSEO
        title="Low Cost Car, Van & Truck Hire New Zealand"
        description="Affordable car, van and truck hire in Auckland, Wellington and Christchurch. Book online with James Blond Rentals – no hidden fees, just trusted service."
        canonical="/"
      />
      
      <Hero />

      <CustomerReviews />
      
      <FeaturedVehicles />
      
      
      {/* Trust Strip */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto container-padding max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="gradient-text text-balance mb-4">Why Kiwis Trust James Blond</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted rental solutions for every journey since 2004.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Hero stat — 100k customers */}
            <div className="md:col-span-2 bg-primary rounded-3xl p-10 text-primary-foreground flex flex-col justify-between shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300 min-h-[260px]">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground/90" />
              </div>
              <div className="mt-12">
                <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">100,000+</div>
                <div className="text-primary-foreground/80 text-lg">Happy customers served across New Zealand</div>
              </div>
            </div>

            {/* Since 2004 */}
            <div className="bg-muted/40 rounded-3xl p-8 flex flex-col justify-between border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-primary font-bold text-xs tracking-widest uppercase">Since</div>
              <div className="mt-8">
                <div className="text-4xl font-black text-foreground">2004</div>
                <div className="text-muted-foreground mt-1 italic">20 Years Experience</div>
              </div>
            </div>

            {/* 7 Locations */}
            <div className="bg-muted/40 rounded-3xl p-8 flex flex-col justify-between border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-primary font-bold text-xs tracking-widest uppercase">Network</div>
              <div className="mt-8">
                <div className="text-4xl font-black text-foreground">7</div>
                <div className="text-muted-foreground mt-1 italic">Locations Across NZ</div>
              </div>
            </div>

            {/* Premium service wide */}
            <div className="md:col-span-2 bg-primary/10 rounded-3xl p-8 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-primary/15">
              <div className="max-w-[70%]">
                <div className="text-2xl font-bold text-primary">Premium Service</div>
                <div className="text-primary/70 mt-2">Exceptional support and a modern fleet for every Kiwi journey.</div>
              </div>
              <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center shadow-lg shrink-0">
                <Crown className="w-9 h-9 text-primary" />
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
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
      <section className="section-padding bg-muted/10">
        <div className="container mx-auto container-padding max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-balance mb-2">Popular Rental Locations</h2>
              <p className="text-muted-foreground">Convenient pickup and drop-off hubs across the country.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center font-bold text-primary hover:text-primary/80 transition-colors">
              View all locations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Auckland Airport", desc: "24/7 terminal shuttle and easy pickup right by the arrivals hall.", img: aucklandAirportImg, href: "/car-rental-auckland-airport-new-zealand" },
              { name: "Wellington City", desc: "Located in the heart of the CBD, perfect for business or leisure.", img: wellingtonCityImg, href: "/car-rental-wellington-new-zealand" },
              { name: "Christchurch Airport", desc: "South Island gateway with direct airport access and shuttle service.", img: christchurchAirportImg, href: "/airport/christchurch" },
              { name: "Christchurch Central", desc: "Downtown access for easy pickup when staying in the city.", img: christchurchCentralImg, href: "/contact/christchurch-central" },
              { name: "Hamilton", desc: "Centrally located for Waikato travel and local hire needs.", img: hamiltonImg, href: "/contact/hamilton" },
              { name: "West Auckland", desc: "Conveniently serving the west with trucks, vans and cars.", img: westAucklandImg, href: "/west-auckland-truck-rentals-hire" },
            ].map((loc) => (
              <Link
                key={loc.name}
                to={loc.href}
                className="group relative h-80 lg:h-96 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 block"
              >
                <img
                  src={loc.img}
                  alt={`${loc.name} rental location`}
                  loading="lazy"
                  width={600}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-7 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-2xl font-bold">{loc.name}</h3>
                  <p className="text-white/80 mt-2 text-sm max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">{loc.desc}</p>
                  <div className="mt-5 flex items-center text-white font-bold text-xs tracking-[0.15em] opacity-90">
                    VIEW DETAILS <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Hire by City — internal-link SEO block */}
      <section className="section-padding border-t bg-background">
        <div className="container mx-auto container-padding max-w-6xl">
          <div className="mb-10">
            <h2 className="text-balance mb-2">Hire by city &amp; vehicle type</h2>
            <p className="text-muted-foreground">Same-day truck, van, ute and car rental at every James Blond branch.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                city: 'Auckland',
                links: [
                  { label: 'Truck hire Auckland', to: '/auckland-truck-rentals-hire' },
                  { label: 'Van hire Auckland', to: '/central-auckland-cargo-van-rentals-hire' },
                  { label: 'Car hire Auckland', to: '/car-hire-auckland' },
                  { label: '12-seater minibus Auckland', to: '/12-seater-van-hire-auckland' },
                ],
              },
              {
                city: 'Wellington',
                links: [
                  { label: 'Truck hire Wellington', to: '/truck-hire-wellington' },
                  { label: 'Van hire Wellington', to: '/van-hire-wellington' },
                  { label: 'Car hire Wellington', to: '/car-rental-wellington-new-zealand' },
                  { label: 'Minibus hire Wellington', to: '/minibus-hire-wellington' },
                  { label: '10 & 12 seat minibus Wellington', to: '/wellington-minibus-hire' },
                  { label: '10 & 12 seat van rental Wellington', to: '/wellington-10-12-seat-van-minibus-rental' },
                  { label: 'Wellington CBD minibus hire', to: '/wellington-minibus-hire-cbd' },
                  { label: 'Wellington airport pickup', to: '/airport/wellington' },
                ],
              },
              {
                city: 'Christchurch',
                links: [
                  { label: 'Truck hire Christchurch', to: '/truck-hire-christchurch' },
                  { label: 'Van hire Christchurch', to: '/van-hire-christchurch' },
                  { label: 'Car hire Christchurch', to: '/car-hire-christchurch' },
                  { label: 'Christchurch CBD hire', to: '/central-christchurch-car-hire' },
                ],
              },
              {
                city: 'Hamilton & national',
                links: [
                  { label: 'Truck hire Hamilton', to: '/truck-hire-hamilton' },
                  { label: 'Van hire Hamilton', to: '/van-hire-hamilton' },
                  { label: 'Car hire Hamilton', to: '/car-hire-hamilton' },
                  { label: 'Ute hire NZ', to: '/ute-hire' },
                  { label: 'Pickup truck rental', to: '/pickup-truck-rental' },
                  { label: 'Moving truck rental', to: '/moving-truck-rental' },
                  { label: 'Tipper truck hire', to: '/tipper-truck-hire' },
                  { label: 'Tautliner hire', to: '/tautliner-hire' },
                ],
              },
            ].map((col) => (
              <div key={col.city}>
                <h3 className="font-bold mb-3">{col.city}</h3>
                <ul className="space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
