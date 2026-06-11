
import React from 'react';
import { Truck, Home, Box, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TruckQuoteSearchForm from '@/components/home/TruckQuoteSearchForm';
import { Link } from 'react-router-dom';
import familyUnloadingTruck from '@/assets/family-unloading-removal-truck.jpg';
import familyUnpacking from '@/assets/family-unpacking-moving-truck.jpg';
import PageSEO from '@/components/PageSEO';


const WestAucklandTruckRentals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO title="Truck Hire West Auckland | James Blond Rentals" description="Rent trucks in West Auckland including Henderson, New Lynn and Waitakere. Convenient pickup for moving and deliveries." canonical="/west-auckland-truck-rentals-hire" />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cheap and Affordable Furniture & Moving Truck Hire West Auckland</h1>
            <p className="text-lg text-gray-700 mb-6">
              Making your move simpler, faster and more affordable with our range of rental trucks specifically designed for West Auckland residents.
            </p>
            <div className="flex items-center gap-2">
              <Button asChild size="lg">
                <a href="#booking">Book Now</a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/fleet/trucks">View All Trucks</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/072db196-b7e0-4726-bd11-9dd208534e9e.png" 
              alt="Box Truck for Moving in West Auckland" 
              className="rounded-lg w-full shadow-lg"
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
              Most Popular
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Your West Auckland Move?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Local Expertise</h3>
                <p className="text-gray-600">Based in West Auckland, we know the area's needs and provide trucks suited for local moves.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Perfect for Home Moves</h3>
                <p className="text-gray-600">Our truck sizes are ideal for moving from apartments to family homes across West Auckland.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Box className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Affordable Hourly Rates</h3>
                <p className="text-gray-600">Competitive pricing with flexible hourly rates to make your West Auckland move budget-friendly.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Easy Self-Service</h3>
                <p className="text-gray-600">No need for professional movers - our trucks are designed for simple DIY moving.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Truck Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Truck Options for West Auckland Moves</h2>
        
        <Tabs defaultValue="furniture">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="furniture">Furniture Moving</TabsTrigger>
            <TabsTrigger value="house">House Moving</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="furniture">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png" 
                  alt="Box Truck for Furniture Moving" 
                  className="rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (12M³)</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for moving large furniture pieces</li>
                  <li>Automatic transmission for easy driving</li>
                  <li>Box: 3100(L) x 1750(W) x 2050(H)</li>
                  <li>Fits apartment and small home contents</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-box-12m3" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-box-12m3#booking`}>Book Now</Link></Button></div>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png" 
                  alt="Box Truck with Tail Lift" 
                  className="rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (12M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Tail lift makes loading heavy furniture easy</li>
                  <li>Perfect for West Auckland's hilly terrain</li>
                  <li>Max Tail Lift Load: 400kg</li>
                  <li>Great for moving heavy appliances and furniture</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-box-12m3-tail" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-box-12m3-tail#booking`}>Book Now</Link></Button></div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="house">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/a00bb0d9-fccc-4d69-a9ab-28d894f74538.png" 
                  alt="Large Box Truck" 
                  className="rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (16M³)</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Ideal for 2-3 bedroom home moves in West Auckland</li>
                  <li>Air conditioning for comfort in summer moves</li>
                  <li>Box: 3800(L) x 2000(W) x 2000(H)</li>
                  <li>Spacious interior for full house contents</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-box-16m3" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-box-16m3#booking`}>Book Now</Link></Button></div>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png" 
                  alt="Large Box Truck with Tail Lift" 
                  className="rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">3 TONNE BOX (19M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Our largest option for complete house moves</li>
                  <li>Perfect for larger West Auckland homes</li>
                  <li>Box: 4800(L) x 2100(W) x 2100(H)</li>
                  <li>Tail lift for easy loading of heavy items</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/3-tonne-box-19m3" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=3-tonne-box-19m3#booking`}>Book Now</Link></Button></div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="commercial">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/ca896f7e-9bda-4926-b23c-e80cbeb348cb.png" 
                  alt="Tipper Truck" 
                  className="rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE TIPPER</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for West Auckland landscaping projects</li>
                  <li>Ideal for construction waste removal</li>
                  <li>Tray: 3100(L) x 1600(W)</li>
                  <li>Easy unloading with tipper functionality</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-tipper" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-tipper#booking`}>Book Now</Link></Button></div>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/4506c6fc-4eef-4997-a040-7482f1872bab.png" 
                  alt="Large Box Truck with Tail Lift for Commercial Use" 
                  className="rounded-lg mb-4"
                />
                <h3 className="font-bold text-xl mb-2">3 TONNE BOX (18M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Ideal for West Auckland retail businesses</li>
                  <li>Perfect for office relocations</li>
                  <li>Box: 4400(L) x 2100(W) x 2050(H)</li>
                  <li>Hydraulic tail lift for easy loading</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/3-tonne-box-18m3" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=3-tonne-box-18m3#booking`}>Book Now</Link></Button></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Customer Experience Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img 
              src={familyUnloadingTruck}
              alt="Happy family unloading furniture from rental truck in West Auckland"
              className="rounded-lg shadow-lg w-full h-auto"
              loading="lazy"
              width="800"
              height="600"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Trusted by West Auckland Families</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied customers who've made their West Auckland moves easier with our reliable truck rentals. 
              Our fleet is perfect for residential moves, furniture transport, and business relocations throughout West Auckland.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold">Easy Self-Service</h3>
                  <p className="text-sm text-muted-foreground">Pick up, move, and return at your convenience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold">Transparent Pricing</h3>
                  <p className="text-sm text-muted-foreground">No hidden fees, pay only for the time you use</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold">Well-Maintained Fleet</h3>
                  <p className="text-sm text-muted-foreground">Regular servicing ensures reliable performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">West Auckland Moving Tips</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div>
                <h3 className="font-bold text-xl mb-4">Planning Your West Auckland Move</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Book your truck at least a week in advance for weekend moves</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>Plan your route to avoid West Auckland's busiest roads during peak hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Organize plenty of helpers - loading and unloading goes much faster</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                    <span>Check truck dimensions to ensure your larger items will fit</span>
                  </li>
                </ul>
              
                <h3 className="font-bold text-xl mb-4 mt-6">Loading Your Truck Efficiently</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                    <span>Load heaviest items first and place them at the front of the truck</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                    <span>Use furniture blankets to protect items (available as extras)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                    <span>Disassemble furniture when possible to save space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                    <span>Consider our hand trolley extras for moving heavy items</span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <img 
                src={familyUnpacking}
                alt="Family unpacking moving boxes from rental truck at new West Auckland home"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
                width="400"
                height="600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* West Auckland Specific Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">West Auckland Moving Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Residential Moves</h3>
              <p className="text-gray-600 mb-4">
                From Henderson to Titirangi, New Lynn to Te Atatu, our trucks are perfectly sized for 
                West Auckland's diverse housing. Hourly rates mean you only pay for the time you need.
              </p>
              <p className="font-semibold">Best for: Home moves within West Auckland suburbs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Furniture Transport</h3>
              <p className="text-gray-600 mb-4">
                Need to move a new sofa home from the store? Our smaller trucks are perfect for 
                single-item furniture moves around West Auckland. No need to hire a full removal service.
              </p>
              <p className="font-semibold">Best for: Large item purchases and furniture delivery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Business Relocations</h3>
              <p className="text-gray-600 mb-4">
                Moving your West Auckland business? Our larger trucks with tail lifts make 
                office relocations simple and cost-effective. Weekend availability lets you move without disrupting business.
              </p>
              <p className="font-semibold">Best for: Office and small shop relocations</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Frame Section */}
      <section id="booking" className="mb-12 scroll-mt-16">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your West Auckland Truck Rental</h2>
          <p className="text-center mb-6">Check availability and reserve your moving truck today</p>
          
          <div className="max-w-4xl mx-auto">
            <TruckQuoteSearchForm />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do I need a special license to drive your trucks in West Auckland?</h3>
            <p className="text-gray-600">
              For our 2-tonne trucks, a standard New Zealand car license is sufficient. For our 3-tonne trucks, 
              a Class 2 (HT) license is required by law.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">How much does it cost to rent a truck in West Auckland?</h3>
            <p className="text-gray-600">
              Our trucks are charged at hourly rates starting from $35/hour plus kilometer charge. 
              The exact rate depends on the truck size and features like tail lifts. Check each truck listing for specific pricing.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">How far in advance should I book a truck for moving in West Auckland?</h3>
            <p className="text-gray-600">
              We recommend booking at least 7 days in advance for weekend moves, especially during summer months 
              and at month-end when demand is highest. Mid-week bookings often have better availability.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do you offer moving accessories for rent in West Auckland?</h3>
            <p className="text-gray-600">
              Yes, we offer moving accessories including hand trolleys, furniture blankets, straps, and tie-downs. 
              These can be added during the booking process. We recommend our hand trolleys for navigating West Auckland's hilly terrain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Move in West Auckland?</h2>
          <p className="mb-6 text-lg">Book your rental truck today and make moving day easier!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Book Your Truck Now</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WestAucklandTruckRentals;
