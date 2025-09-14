import React from 'react';
import { Package, ShieldCheck, Truck, Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from '@/components/home/SearchForm';
import { Link } from 'react-router-dom';

const WellingtonCargoVanRentals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Wellington Cargo Van Rentals & Hire</h1>
          <p className="text-lg text-gray-700 mb-6">
            Affordable, reliable cargo vans for hire in Wellington. Perfect for small moves, deliveries, and business needs throughout the capital city.
          </p>
        </div>
      </div>

      {/* Booking Form Section - Moved to Top */}
      <section className="mb-12">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Wellington Cargo Van</h2>
          <p className="text-center mb-6">Check availability and reserve your van today</p>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Wellington Van Hire?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Perfect for Wellington City</h3>
                <p className="text-gray-600">Our cargo vans are ideal for navigating Wellington's compact streets and finding parking in the busy CBD.</p>
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
                <p className="text-gray-600">All our Wellington cargo vans are regularly serviced and cleaned, ensuring reliability for your job.</p>
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
                <p className="text-gray-600">From compact cargo vans to larger options with extra capacity for bigger Wellington moves.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Central Location</h3>
                <p className="text-gray-600">Our Wellington branch in Te Aro provides easy access for pickup and drop-off in the heart of the city.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Van Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Cargo Van Options in Wellington</h2>
        
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
                  alt="Standard Cargo Van for Wellington Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">STANDARD VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for small moves and deliveries around Wellington</li>
                  <li>Easy to drive and park in Wellington's compact streets</li>
                  <li>Cargo space: 2000(L) x 1400(W) x 1300(H)</li>
                  <li>Fuel-efficient for Wellington city driving</li>
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
                  <li>Ideal for businesses with mobile staff in Wellington</li>
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
                  alt="Premium Van for Wellington Business Hire" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>High-spec cargo van with additional features</li>
                  <li>Superior comfort for long delivery days around Wellington</li>
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
                  <li>Perfect for apartment moves in Wellington</li>
                  <li>Cargo space: 3400(L) x 1700(W) x 1900(H)</li>
                  <li>Still compact enough to navigate Wellington's narrow streets</li>
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
                  alt="Refrigerated Van for Wellington Food Deliveries" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">REFRIGERATED VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Temperature-controlled cargo space</li>
                  <li>Perfect for food deliveries across Wellington</li>
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
                  alt="Long-term Van Hire Wellington" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">LONG-TERM HIRE VANS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Special rates for Wellington businesses needing extended hire</li>
                  <li>Flexible contracts from 1-12 months</li>
                  <li>Maintenance included in long-term packages</li>
                  <li>Perfect for seasonal business needs or contracts</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/contact/wellington" className="flex items-center">
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
        <h2 className="text-2xl font-bold mb-6">Wellington Van Hire Solutions</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Business Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Courier and delivery services throughout Wellington region</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Retail stock transfers between Wellington CBD and suburban stores</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Tradespeople needing to transport tools and materials</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Mobile businesses servicing Wellington homes and offices</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Personal Uses</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Small apartment moves within Wellington city</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Transporting large purchases from retailers</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Weekend DIY projects requiring materials transport</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Moving students into Wellington university accommodation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Wellington Specific Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Cargo Van Rental Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">City-Friendly Size</h3>
              <p className="text-gray-600 mb-4">
                Wellington's narrow streets and limited parking make cargo vans the perfect choice for urban deliveries and moves. 
                Navigate tight spaces that trucks can't access, and find parking even in the busy CBD.
              </p>
              <p className="font-semibold">Perfect for: Inner-city Wellington deliveries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Hill-Climbing Power</h3>
              <p className="text-gray-600 mb-4">
                Our Wellington cargo vans are specially selected with engines that can handle the city's steep terrain. 
                Easily tackle the hills of Kelburn, Brooklyn, or Karori with confidence.
              </p>
              <p className="font-semibold">Perfect for: Wellington's hilly suburbs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Weather-Ready</h3>
              <p className="text-gray-600 mb-4">
                Wellington's famous wind and occasional wild weather is no problem for our cargo vans. 
                Keep your goods protected from the elements while transporting them across the city.
              </p>
              <p className="font-semibold">Perfect for: Year-round reliability</p>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">What license do I need to hire a van in Wellington?</h3>
            <p className="text-gray-600">
              A standard New Zealand full driver's license is sufficient for all our cargo vans. 
              International visitors can use their home license (with translation if not in English) or an International Driving Permit.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do your Wellington vans have automatic transmission?</h3>
            <p className="text-gray-600">
              Yes, most of our cargo vans in Wellington feature automatic transmission, making them easier to 
              drive in stop-start city traffic and on Wellington's steep hills.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can I pick up in Wellington and drop off in Auckland?</h3>
            <p className="text-gray-600">
              Yes, one-way rentals between our Wellington and Auckland locations are available for an additional 
              fee. Please specify this requirement when booking.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do you offer weekend specials for Wellington van hire?</h3>
            <p className="text-gray-600">
              Yes, we frequently offer weekend specials for Wellington cargo van rentals. Check our website 
              for current promotions or ask our staff when booking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Hire a Van in Wellington?</h2>
          <p className="mb-6 text-lg">Book now for the best rates and availability in the capital city!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Reserve Your Van Today</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WellingtonCargoVanRentals;
