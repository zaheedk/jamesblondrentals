
import React from 'react';
import { Package, ShieldCheck, Truck, Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from '@/components/home/SearchForm';
import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';


const WestAucklandCargoVanRentals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO title="Cargo Van Hire West Auckland | James Blond Rentals" description="Hire cargo vans in West Auckland for deliveries, courier work and commercial transport in the western suburbs." canonical="/west-auckland-cargo-van-rentals-hire" />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">West Auckland Cargo Van Rentals & Hire</h1>
            <p className="text-lg text-gray-700 mb-6">
              Affordable, reliable cargo vans for hire in West Auckland. Perfect for small moves, deliveries, and business needs throughout Auckland's western suburbs.
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
              alt="Cargo Van for Hire in West Auckland" 
              className="rounded-lg w-full shadow-lg"
              width="600"
              height="400"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
              Most Popular
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for West Auckland Van Hire?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Perfect for West Auckland</h3>
                <p className="text-gray-600">Our cargo vans are ideal for navigating West Auckland's diverse terrain and industrial areas.</p>
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
                <p className="text-gray-600">All our West Auckland cargo vans are regularly serviced and cleaned, ensuring reliability for your job.</p>
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
                <p className="text-gray-600">From compact cargo vans to larger options with extra capacity for bigger moves across West Auckland.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Convenient Location</h3>
                <p className="text-gray-600">Our West Auckland branch provides easy access for pickup and drop-off, serving Henderson, New Lynn, and all western suburbs.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Van Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Cargo Van Options in West Auckland</h2>
        
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
                  alt="Standard Cargo Van for West Auckland Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">STANDARD VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for small moves and deliveries around West Auckland</li>
                  <li>Easy to drive and park in local shopping centers and industrial areas</li>
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
                  <li>Versatile option for both cargo and passengers</li>
                  <li>Perfect for team deliveries or combined people/goods transport</li>
                  <li>Rear seats fold down for extra cargo space when needed</li>
                  <li>Ideal for businesses with mobile staff in West Auckland</li>
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
                  alt="Premium Van for West Auckland Business Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>High-spec cargo van with additional features</li>
                  <li>Superior comfort for long delivery days around West Auckland</li>
                  <li>Enhanced payload capacity for heavier items</li>
                  <li>Professional appearance for business deliveries</li>
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
                  <li>Perfect for apartment moves in West Auckland</li>
                  <li>Cargo space: 3400(L) x 1700(W) x 1900(H)</li>
                  <li>Great for transporting bulky items to and from industrial areas</li>
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
                  alt="Refrigerated Van for West Auckland Food Deliveries" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">REFRIGERATED VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Temperature-controlled cargo space</li>
                  <li>Perfect for food deliveries across West Auckland</li>
                  <li>Essential for catering companies and food suppliers</li>
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
                  alt="Long-term Van Hire West Auckland" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">LONG-TERM HIRE VANS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Special rates for West Auckland businesses needing extended hire</li>
                  <li>Flexible contracts from 1-12 months</li>
                  <li>Maintenance included in long-term packages</li>
                  <li>Perfect for seasonal business needs or contracts</li>
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
        <h2 className="text-2xl font-bold mb-6">West Auckland Van Hire Solutions</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Business Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Courier and delivery services throughout West Auckland suburbs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Retail stock transfers between stores in Henderson, New Lynn and beyond</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Tradespeople needing to transport tools and materials to worksites</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Mobile businesses servicing West Auckland homes and businesses</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Personal Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Moving between apartments or homes in the western suburbs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Transporting large purchases from West Auckland retailers</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Weekend DIY projects requiring materials transport</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Moving students into West Auckland accommodation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* West Auckland Specific Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">West Auckland Cargo Van Rental Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Industrial Area Access</h3>
              <p className="text-gray-600 mb-4">
                West Auckland's industrial zones in Henderson, Glendene and Avondale are easily accessible with our cargo vans. 
                Perfect for business deliveries and goods collection from warehouses and manufacturing sites.
              </p>
              <p className="font-semibold">Perfect for: Business deliveries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Suburban Mobility</h3>
              <p className="text-gray-600 mb-4">
                Navigate West Auckland's diverse suburbs with ease. From the winding roads of Titirangi to the wider streets of Henderson, 
                our vans are right-sized for the area's varied landscapes.
              </p>
              <p className="font-semibold">Perfect for: Local moves and deliveries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Regional Connectivity</h3>
              <p className="text-gray-600 mb-4">
                Ideal for transport needs between West Auckland and the rest of the Auckland region. 
                Easy access to motorways means you can efficiently travel to the North Shore, South Auckland or the CBD.
              </p>
              <p className="font-semibold">Perfect for: Cross-city logistics</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Frame Section */}
      <section id="booking" className="mb-12 scroll-mt-16">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your West Auckland Cargo Van</h2>
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
            <h3 className="font-bold mb-2">What license do I need to hire a van in West Auckland?</h3>
            <p className="text-gray-600">
              A standard New Zealand full driver's license is sufficient for all our cargo vans. 
              International visitors can use their home license (with translation if not in English) or an International Driving Permit.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can I pick up in West Auckland and drop off in another Auckland location?</h3>
            <p className="text-gray-600">
              Yes, we offer flexible pick-up and drop-off between all our Auckland locations for your convenience, 
              including our Central Auckland and Airport branches.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Are there age restrictions for renting cargo vans in West Auckland?</h3>
            <p className="text-gray-600">
              Drivers must be at least 21 years old and have held a full valid license for at least 12 months. 
              Additional fees may apply for drivers under 25.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do you offer weekend specials for West Auckland van hire?</h3>
            <p className="text-gray-600">
              Yes, we frequently offer weekend specials for West Auckland cargo van rentals. Check our website 
              for current promotions or ask our staff when booking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Hire a Van in West Auckland?</h2>
          <p className="mb-6 text-lg">Book now for the best rates and availability across Auckland's western suburbs!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Reserve Your Van Today</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WestAucklandCargoVanRentals;
