
import React from 'react';
import { Package, ShieldCheck, Truck, Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from '@/components/home/SearchForm';
import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';


const CentralAucklandCargoVanRentals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO title="Cargo Van Hire Central Auckland | James Blond Rentals" description="Rent cargo vans in central Auckland CBD for urban deliveries, courier services and business logistics." canonical="/central-auckland-cargo-van-rentals-hire" />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Central Auckland Cargo Van Rentals & Hire</h1>
            <p className="text-lg text-gray-700 mb-6">
              Convenient, reliable cargo vans for hire in Central Auckland. Perfect for city deliveries, small moves, and business needs in Auckland's bustling urban center.
            </p>
            <div className="flex items-center gap-2">
              <Button asChild size="lg">
                <a href="#booking">Book Now</a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/fleet/vans">View All Vans</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png" 
              alt="Cargo Van for Hire in Central Auckland" 
              className="rounded-lg w-full shadow-lg"
              width="600"
              height="400"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
              City-Center Service
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Central Auckland Van Hire?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Urban-Friendly Vehicles</h3>
                <p className="text-gray-600">Our cargo vans are selected for easy navigation of Central Auckland's busy streets and limited parking.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Well-Maintained Fleet</h3>
                <p className="text-gray-600">All our Central Auckland cargo vans are regularly serviced and cleaned, ensuring reliability for city transport needs.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Variety of Van Sizes</h3>
                <p className="text-gray-600">From compact cargo vans for tight spaces to larger options with extra capacity for city-based businesses.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">CBD-Convenient Location</h3>
                <p className="text-gray-600">Our Central Auckland branch provides quick access for pickup and drop-off, right in the heart of the city.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Van Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Cargo Van Options in Central Auckland</h2>
        
        <Tabs defaultValue="standard">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="standard">Standard Vans</TabsTrigger>
            <TabsTrigger value="premium">Premium Vans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png" 
                  alt="Standard Cargo Van for Central Auckland Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">STANDARD VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for CBD deliveries and urban logistics</li>
                  <li>Easy to drive and park in tight city spaces and parking garages</li>
                  <li>Cargo space: 2000(L) x 1400(W) x 1300(H)</li>
                  <li>Fuel-efficient for stop-start city driving</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/vans/standard-van" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/7924107a-afb6-4c13-aa1d-8dba18465760.png" 
                  alt="Standard Van with Rear Seats" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">STANDARD VAN WITH REAR SEATS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Versatile option for both cargo and passengers</li>
                  <li>Perfect for urban businesses needing staff transport and deliveries</li>
                  <li>Rear seats fold down for extra cargo space when needed</li>
                  <li>Ideal for event companies and mobile businesses in the city</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/vans/standard-rear-seat-van" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="premium">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/3cb301ec-ead2-492a-a9a0-3361c1876b76.png" 
                  alt="Premium Van for Central Auckland Business Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>High-spec cargo van with additional features</li>
                  <li>Superior comfort for professional city-based businesses</li>
                  <li>Enhanced payload capacity for commercial deliveries</li>
                  <li>Professional appearance for upscale urban business use</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/vans/premium-van" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/6dde201c-13f3-4671-9e88-6cc1a388d647.png" 
                  alt="Jumbo Van for Maximum Cargo Space" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">JUMBO VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Maximum cargo space in a van format</li>
                  <li>Perfect for city apartments and office moves</li>
                  <li>Cargo space: 3400(L) x 1700(W) x 1900(H)</li>
                  <li>Great for CBD businesses with larger delivery needs</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/vans/jumbo-van" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Central Auckland Van Hire Solutions</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Business Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Last-mile deliveries for CBD retailers and restaurants</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Office supply and equipment transport between high-rise buildings</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Urban tradespeople needing to transport tools and materials</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Event setup and teardown for city venues and conferences</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Personal Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Moving between city apartments and flats</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Transporting furniture and large items purchased in the city</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Weekend market and pop-up shop transportation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Moving students into city university accommodations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Central Auckland Specific Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Central Auckland Cargo Van Rental Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">CBD Accessibility</h3>
              <p className="text-gray-600 mb-4">
                Our cargo vans are selected for their maneuverability in Central Auckland's busy streets and limited parking spaces. 
                Perfect for navigating between high-rise buildings and tight loading zones.
              </p>
              <p className="font-semibold">Perfect for: Inner-city deliveries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Apartment Moving</h3>
              <p className="text-gray-600 mb-4">
                Specially sized for Auckland's urban apartment buildings, with dimensions that fit standard elevators and tight corridors.
                Ideal for city dwellers moving between flats.
              </p>
              <p className="font-semibold">Perfect for: Inner-city relocations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Business District Convenience</h3>
              <p className="text-gray-600 mb-4">
                Our Central Auckland location puts you minutes away from Queen Street, Wynyard Quarter, and Parnell, 
                making urgent business transport needs quick and hassle-free.
              </p>
              <p className="font-semibold">Perfect for: Commercial logistics</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Frame Section */}
      <section id="booking" className="mb-12 scroll-mt-16">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Central Auckland Cargo Van</h2>
          <p className="text-center mb-6">Check availability and reserve your van today</p>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Is parking included with Central Auckland van rentals?</h3>
            <p className="text-gray-600">
              We provide free parking at our Central Auckland branch during pickup and return. During your rental period, 
              you'll be responsible for finding and paying for parking elsewhere in the city as needed.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can I pick up in Central Auckland and drop off at the airport?</h3>
            <p className="text-gray-600">
              Yes, we offer flexible pick-up and drop-off between all our Auckland locations for your convenience, 
              including our Airport and West Auckland branches for a small additional fee.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do your vans have loading zone permits for CBD access?</h3>
            <p className="text-gray-600">
              Our vans are commercial vehicles that qualify for using loading zones throughout Central Auckland, subject to 
              standard loading zone time restrictions. This makes deliveries and pickups in the CBD much more convenient.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Are after-hours returns available in Central Auckland?</h3>
            <p className="text-gray-600">
              Yes, we offer secure after-hours drop-off options at our Central Auckland location for your convenience. 
              Details will be provided at the time of pickup.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Hire a Van in Central Auckland?</h2>
          <p className="mb-6 text-lg">Book now for the best rates and availability in Auckland's city center!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Reserve Your Van Today</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CentralAucklandCargoVanRentals;
