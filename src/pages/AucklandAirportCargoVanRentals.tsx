
import React from 'react';
import { Package, ShieldCheck, Truck, Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from '@/components/home/SearchForm';
import { Link } from 'react-router-dom';

const AucklandAirportCargoVanRentals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Auckland Airport Cargo Van Rentals & Hire</h1>
            <p className="text-lg text-gray-700 mb-6">
              Convenient, reliable cargo vans for hire at Auckland Airport. Perfect for visitors, businesses, and anyone needing transport solutions right from the terminal.
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
              alt="Cargo Van for Hire at Auckland Airport" 
              className="rounded-lg w-full shadow-lg"
              width="600"
              height="400"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
              Airport Pickup
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Auckland Airport Van Hire?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Airport Convenience</h3>
                <p className="text-gray-600">Pick up your cargo van right after landing with our airport-based service, saving time and hassle.</p>
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
                <p className="text-gray-600">All our Auckland Airport cargo vans are regularly serviced and cleaned, ensuring reliability for your journey.</p>
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
                <p className="text-gray-600">From compact cargo vans to larger options with extra capacity for visitors with substantial luggage or equipment.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Perfect Location</h3>
                <p className="text-gray-600">Our Auckland Airport branch offers easy access to and from all airport terminals with free shuttle service.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Van Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Cargo Van Options at Auckland Airport</h2>
        
        <Tabs defaultValue="standard">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="standard">Standard Vans</TabsTrigger>
            <TabsTrigger value="premium">Premium Vans</TabsTrigger>
            <TabsTrigger value="specialty">Specialty Vans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png" 
                  alt="Standard Cargo Van for Auckland Airport Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">STANDARD VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for visitors with extra luggage or equipment</li>
                  <li>Easy to drive for those new to New Zealand roads</li>
                  <li>Cargo space: 2000(L) x 1400(W) x 1300(H)</li>
                  <li>Fuel-efficient for Auckland metro driving</li>
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
                  <li>Versatile option for both passengers and cargo</li>
                  <li>Ideal for small groups arriving with equipment</li>
                  <li>Rear seats fold down for extra cargo space when needed</li>
                  <li>Perfect for business travelers with samples or displays</li>
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
                  alt="Premium Van for Auckland Airport Business Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>High-spec cargo van with additional features</li>
                  <li>Superior comfort for longer journeys from the airport</li>
                  <li>Enhanced payload capacity for heavier items</li>
                  <li>Professional appearance for business travelers</li>
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
                  <li>Maximum cargo space for visitors with substantial equipment</li>
                  <li>Perfect for film crews, event managers, and trade show exhibitors</li>
                  <li>Cargo space: 3400(L) x 1700(W) x 1900(H)</li>
                  <li>Ideal for international visitors with extensive luggage</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/vans/jumbo-van" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specialty">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/6dde201c-13f3-4671-9e88-6cc1a388d647.png" 
                  alt="Refrigerated Van for Airport Food Transport" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">REFRIGERATED VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Temperature-controlled cargo space</li>
                  <li>Ideal for food industry professionals visiting New Zealand</li>
                  <li>Essential for transporting temperature-sensitive samples or products</li>
                  <li>Advanced cooling system maintains consistent temperature</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/vans/jumbo-van" className="flex items-center">
                    Contact for Availability <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/7924107a-afb6-4c13-aa1d-8dba18465760.png" 
                  alt="Long-term Van Hire Auckland Airport" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">LONG-TERM HIRE VANS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Special rates for extended stays in New Zealand</li>
                  <li>Flexible contracts from 1-12 months</li>
                  <li>Maintenance included in long-term packages</li>
                  <li>Perfect for contractors on assignment or extended business trips</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/contact/auckland" className="flex items-center">
                    Request Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Van Hire Solutions</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Business Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>International business travelers with display materials or samples</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Film and production crews arriving with equipment</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Event managers setting up conferences or exhibitions</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Overseas contractors beginning work assignments in Auckland</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Personal Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Travelers with sports equipment like surfboards, bikes, or golf clubs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Families arriving with extra luggage for extended stays</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Returning New Zealanders with overseas purchases</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>International students arriving for university terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Airport Specific Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Cargo Van Rental Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Immediate Availability</h3>
              <p className="text-gray-600 mb-4">
                Land and drive with minimal waiting. Our efficient airport service means you can be on your way in your cargo van within minutes of clearing customs.
              </p>
              <p className="font-semibold">Perfect for: Time-sensitive arrivals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Free Airport Shuttle</h3>
              <p className="text-gray-600 mb-4">
                Our complimentary shuttle service picks you up right from the terminal and takes you directly to our nearby Auckland Airport branch to collect your van.
              </p>
              <p className="font-semibold">Perfect for: Hassle-free transitions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Auckland Connectivity</h3>
              <p className="text-gray-600 mb-4">
                From Auckland Airport, immediately access key motorways connecting you to the CBD, North Shore, West Auckland, and beyond. No need to navigate unfamiliar public transport.
              </p>
              <p className="font-semibold">Perfect for: Exploring the entire Auckland region</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Frame Section */}
      <section id="booking" className="mb-12 scroll-mt-16">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Auckland Airport Cargo Van</h2>
          <p className="text-center mb-6">Reserve now for immediate availability upon arrival</p>
          
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
            <h3 className="font-bold mb-2">How do I find the rental desk at Auckland Airport?</h3>
            <p className="text-gray-600">
              After clearing customs, call our courtesy phone number provided in your confirmation email. Our free shuttle 
              will pick you up from the designated meeting point outside the terminal within minutes.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can I return the van to a different location?</h3>
            <p className="text-gray-600">
              Yes, we offer one-way rentals between our Auckland Airport, West Auckland, central Auckland, Wellington, 
              and Christchurch locations for an additional fee. Please specify this requirement when booking.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">What documentation do I need as an international visitor?</h3>
            <p className="text-gray-600">
              International visitors need a valid driver's license from their home country (with English translation if not in English) 
              or an International Driving Permit, along with a passport and a valid credit card for the security deposit.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Are there after-hours pickup options at Auckland Airport?</h3>
            <p className="text-gray-600">
              Yes, we offer after-hours pickup for late flights. Simply select this option when booking and include your 
              flight details so we can monitor any delays and ensure you're taken care of upon arrival.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Hire a Van at Auckland Airport?</h2>
          <p className="mb-6 text-lg">Book now for a seamless transition from plane to van!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Reserve Your Airport Van Today</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AucklandAirportCargoVanRentals;
