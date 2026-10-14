
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
import JsonLd from '@/components/JsonLd';

// Prices mirror the /price-guide truck table (NZD inc. GST, plus $/km on hourly/daily hires).
const truckPrices = [
  { name: '2T Box (12m³)', size: '3 x 1.6 x 1.8m', hours: '$70', day: '$125', km: '$0.42', slug: '/fleet/trucks/2-tonne-box-12m3' },
  { name: '2T Box + Tail Lift (12m³)', size: '3.1 x 1.8 x 2m', hours: '$80', day: '$140', km: '$0.44', slug: '/fleet/trucks/2-tonne-box-12m3-tail' },
  { name: '2T Box (16m³)', size: '4 x 2 x 2m', hours: '$80', day: '$130', km: '$0.47', slug: '/fleet/trucks/2-tonne-box-16m3' },
  { name: '3T Box + Tail Lift (18–19m³)', size: '4.5 x 2 x 2m', hours: '$100', day: '$160', km: '$0.61', slug: '/fleet/trucks/3-tonne-box-19m3' },
  { name: '2T Tipper', size: '3.1 x 1.6m tray', hours: '$70', day: '$115', km: '$0.39', slug: '/fleet/trucks/2-tonne-tipper' },
];

const sizeGuide = [
  { load: 'Single items, a sofa or fridge, a studio or 1-bedroom flat', truck: '2T Box (12m³)' },
  { load: 'Heavy appliances or a 1–2 bedroom flat', truck: '2T Box + Tail Lift (12m³)' },
  { load: '2–3 bedroom house', truck: '2T Box (16m³)' },
  { load: '3–4 bedroom house or office relocation', truck: '3T Box + Tail Lift (18–19m³)' },
  { load: 'Garden waste, soil, gravel, building rubbish', truck: '2T Tipper' },
];

const faqs = [
  { q: 'How much does truck hire cost in Auckland?', a: 'Truck hire from our West Auckland branch starts at $70 for up to 4 hours or $125 per day for a 2-tonne 12m³ box truck, plus a per-km charge. Hire Monday to Thursday and save 50% on trucks with our midweek deal. See the price guide for every size.' },
  { q: 'Do I need a special licence to drive your trucks?', a: 'Our 2-tonne trucks can be driven on a standard New Zealand car licence. The 3-tonne 19m³ truck requires a Class 2 (HT) licence.' },
  { q: 'What size truck do I need to move house?', a: 'A 2-tonne 12m³ truck suits a studio or 1-bedroom flat, a 16m³ truck suits a 2–3 bedroom house, and the 3-tonne 18–19m³ tail-lift truck suits a 3–4 bedroom house. Use our moving cost calculator for an estimate.' },
  { q: 'Can I hire a truck by the hour?', a: 'Yes. Short hires are charged in 2, 4 and 8 hour blocks, so a quick furniture pick-up costs far less than a full day.' },
  { q: 'Do you offer one-way truck hire from Auckland?', a: 'Yes, one-way truck hire between James Blond branches is available on request — see our one-way truck hire page.' },
  { q: 'Where is your West Auckland branch?', a: 'Our branch is at 4004 Great North Road, Glen Eden, close to Henderson, New Lynn, Kelston, Avondale and Titirangi.' },
  { q: 'How far in advance should I book?', a: 'Book at least 7 days ahead for weekend and month-end moves, especially in summer. Midweek dates usually have better availability.' },
  { q: 'Do you rent moving accessories?', a: 'Yes. Hand trolleys, furniture blankets and straps can be added during booking.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};


const WestAucklandTruckRentals = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        title="Truck Hire Auckland West — Moving Trucks from $125/day | James Blond"
        description="Truck hire in West Auckland from $70 (4 hrs) or $125/day. 12m³ to 19m³ moving trucks with tail lifts and a 2T tipper, 50% off midweek. Glen Eden branch near Henderson & New Lynn."
        canonical="/west-auckland-truck-rentals-hire"
      />
      <JsonLd data={faqJsonLd} />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Truck Hire Auckland — West Auckland Moving Truck Rental</h1>
            <p className="text-lg text-gray-700 mb-6">
              Same-day truck rental and moving truck hire across West Auckland — Henderson, Henderson Valley, New Lynn, Swanson, Te Atatu, Massey, Westgate, Hobsonville, Waitakere and Titirangi. 2-tonne trucks drive on a standard car licence. From $70 for 4 hours or $125 per day, and 50% off Monday–Thursday.
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

      {/* Prices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Truck Hire Prices — West Auckland</h2>
        <p className="text-muted-foreground mb-4">NZD including GST. Hourly and daily hires add a per-km charge. Save 50% when pickup and return are both Monday–Thursday.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Truck</th>
                <th className="text-left p-3">Box size (LxWxH)</th>
                <th className="text-left p-3">Up to 4 hours</th>
                <th className="text-left p-3">Per day</th>
                <th className="text-left p-3">Per km</th>
              </tr>
            </thead>
            <tbody>
              {truckPrices.map((t) => (
                <tr key={t.name} className="border-t">
                  <td className="p-3 font-medium"><Link to={t.slug} className="text-primary underline">{t.name}</Link></td>
                  <td className="p-3">{t.size}</td>
                  <td className="p-3">{t.hours}</td>
                  <td className="p-3">{t.day}</td>
                  <td className="p-3">{t.km}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm mt-3">
          Full rates including multi-day and unlimited-km prices are in our <Link to="/price-guide" className="text-primary underline">price guide</Link>.
          Midweek details: <Link to="/hot-deals/midweek-truck-van-discount" className="text-primary underline">50% off truck and van hire</Link>.
        </p>
      </section>

      {/* Size guide */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">What Size Moving Truck Do I Need?</h2>
        <div className="grid gap-3">
          {sizeGuide.map((g) => (
            <div key={g.truck} className="border rounded-lg p-4 flex flex-col md:flex-row md:justify-between gap-1">
              <span>{g.load}</span>
              <span className="font-semibold text-primary">{g.truck}</span>
            </div>
          ))}
        </div>
        <p className="text-sm mt-3">
          Not sure? Get an estimate with our <Link to="/moving-cost-calculator" className="text-primary underline">moving cost calculator</Link>.
        </p>
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
        <h2 className="text-2xl font-bold mb-6">Truck Hire FAQs</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">{f.q}</h3>
              <p className="text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">More Truck and Van Hire</h2>
        <nav aria-label="Related hire pages" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/auckland-truck-rentals-hire" className="text-primary underline">Truck hire Auckland (all branches)</Link>
          <Link to="/van-hire-auckland" className="text-primary underline">Van hire Auckland</Link>
          <Link to="/west-auckland-van-hire" className="text-primary underline">West Auckland van hire</Link>
          <Link to="/one-way-truck-hire" className="text-primary underline">One-way truck hire</Link>
          <Link to="/fleet/trucks" className="text-primary underline">All trucks</Link>
          <Link to="/moving-cost-calculator" className="text-primary underline">Moving cost calculator</Link>
        </nav>
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
