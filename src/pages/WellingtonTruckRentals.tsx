
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck, Home, Box, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TruckQuoteSearchForm from '@/components/home/TruckQuoteSearchForm';
import { Link } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';
import truckMovingBoxes from '@/assets/truck-moving-boxes-household-items.jpg';
import truckOpenDoors from '@/assets/truck-open-doors-loading-boxes.jpg';
import familyUnloading from '@/assets/family-unloading-removal-truck.jpg';
import familyUnpacking from '@/assets/family-unpacking-moving-truck.jpg';
import coupleMoving from '@/assets/couple-moving-boxes-truck.jpg';

const WellingtonTruckRentals = () => {
  return (
    <>
      <Helmet>
        <title>Truck Hire Wellington from $35/hr — Moving Truck Rental Near You</title>
        <meta name="description" content="Truck rental & hire in Wellington from $35/hr — CBD, Lower Hutt, Upper Hutt, Petone, Porirua, Kapiti, Johnsonville. Same-day moving truck pickup, drive on a car licence." />
        <meta name="keywords" content="truck hire Wellington, truck rental Wellington, moving truck Lower Hutt, truck hire Upper Hutt, truck hire Petone, truck rental Porirua, Kapiti truck hire" />
        <link rel="canonical" href="https://www.jamesblond.co.nz/truck-hire-wellington" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Truck Hire & Moving Truck Rental — Wellington</h1>
            <p className="text-lg text-gray-700 mb-6">
              Same-day truck rental and moving truck hire across the Wellington region — Wellington CBD, Te Aro, Newtown, Kilbirnie, Johnsonville, Petone, Lower Hutt, Upper Hutt, Porirua, Tawa and the Kapiti Coast. 2-tonne and 3-tonne trucks from $35/hr, drive on a standard car licence.
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
            <LazyImage 
              src="/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png" 
              alt="Box Truck for Moving in Wellington" 
              className="rounded-lg w-full shadow-lg"
              width={600}
              height={400}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
              Most Popular
            </div>
          </div>
        </div>
      </div>

      {/* Booking Frame Section */}
      <section id="booking" className="mb-12 scroll-mt-16">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Wellington Truck Rental</h2>
          <p className="text-center mb-6">Check availability and reserve your moving truck today</p>
          
          <div className="max-w-4xl mx-auto">
            <TruckQuoteSearchForm 
              defaultPickupLocation="11"
              defaultDropoffLocation="11"
              defaultCarCategory="12"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Truck Hire in Wellington</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Wellington Specialists</h3>
                <p className="text-gray-600">Based in central Wellington, we know the area's unique terrain and provide trucks suited for local moves.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Ideal for Hilly Terrain</h3>
                <p className="text-gray-600">Our trucks are selected specifically to handle Wellington's steep streets and compact spaces.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Box className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Competitive Rates</h3>
                <p className="text-gray-600">Flexible hourly rates to make your Wellington move budget-friendly, with no hidden costs.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Central Location</h3>
                <p className="text-gray-600">Conveniently located at 24 Abel Smith Street, Te Aro, making pickup and drop-off quick and easy for your move.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Truck Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Truck Options for Wellington Moves</h2>
        
        <Tabs defaultValue="furniture">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="furniture">Furniture Moving</TabsTrigger>
            <TabsTrigger value="house">House Moving</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="furniture">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <LazyImage 
                  src="/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png" 
                  alt="Box Truck for Furniture Moving" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (12M³)</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for apartment moves in Wellington's compact spaces</li>
                  <li>Automatic transmission for easier handling on steep streets</li>
                  <li>Box: 3100(L) x 1750(W) x 2050(H)</li>
                  <li>Fits typical Wellington apartment contents</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-box-12m3" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-box-12m3#booking`}>Book Now</Link></Button></div>
              </div>
              
              <div>
                <LazyImage 
                  src="/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png" 
                  alt="Box Truck with Tail Lift" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (12M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Essential for Wellington's multi-story apartment buildings</li>
                  <li>Tail lift makes loading on steep streets easier</li>
                  <li>Max Tail Lift Load: 400kg</li>
                  <li>Perfect for moving up and down Wellington's hills</li>
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
                <LazyImage 
                  src="/lovable-uploads/a00bb0d9-fccc-4d69-a9ab-28d894f74538.png" 
                  alt="Large Box Truck" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (16M³)</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Ideal for 2-3 bedroom home moves in Wellington</li>
                  <li>Manual transmission with good torque for hills</li>
                  <li>Box: 3800(L) x 2000(W) x 2000(H)</li>
                  <li>Spacious interior for complete house moves</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-box-16m3" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-box-16m3#booking`}>Book Now</Link></Button></div>
              </div>
              
              <div>
                <LazyImage 
                  src="/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png" 
                  alt="Large Box Truck with Tail Lift" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">3 TONNE BOX (19M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Our largest option for complete Wellington house moves</li>
                  <li>Perfect for larger homes in suburbs like Karori or Khandallah</li>
                  <li>Box: 4800(L) x 2100(W) x 2100(H)</li>
                  <li>Tail lift for easy loading of heavy furniture</li>
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
                <LazyImage 
                  src="/lovable-uploads/ca896f7e-9bda-4926-b23c-e80cbeb348cb.png" 
                  alt="Tipper Truck" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE TIPPER</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for Wellington landscaping and renovation projects</li>
                  <li>Ideal for construction waste removal in tight urban areas</li>
                  <li>Tray: 3100(L) x 1600(W)</li>
                  <li>Manual transmission with good hill-climbing ability</li>
                </ul>
                <div className="flex flex-wrap gap-2"><Button asChild variant="outline">
                  <Link to="/fleet/trucks/2-tonne-tipper" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button><Button asChild><Link to={`?truck=2-tonne-tipper#booking`}>Book Now</Link></Button></div>
              </div>
              
              <div>
                <LazyImage 
                  src="/lovable-uploads/4506c6fc-4eef-4997-a040-7482f1872bab.png" 
                  alt="Large Box Truck with Tail Lift for Commercial Use" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">3 TONNE BOX (18M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Ideal for Wellington CBD business relocations</li>
                  <li>Perfect for retail and office moves in compact city spaces</li>
                  <li>Box: 4400(L) x 2100(W) x 2050(H)</li>
                  <li>Hydraulic tail lift for loading on uneven terrain</li>
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

      {/* Tips Section with Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Moving Tips</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Planning Your Wellington Move</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                    <span>Book at least two weeks in advance for weekend moves in Wellington</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                    <span>Plan your route to avoid the Mount Victoria tunnel during peak hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                    <span>Check weather forecasts - Wellington winds can affect driving larger vehicles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                    <span>Reserve parking with the council for loading/unloading in CBD areas</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-xl mb-4">Navigating Wellington's Challenges</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                    <span>Use lower gears when descending steep streets like Aro or Brooklyn hills</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                    <span>Secure items well - Wellington's winding roads can shift cargo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                    <span>Consider a tail lift truck for multi-story apartment buildings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                    <span>Allow extra time for narrow streets in older suburbs like Newtown</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <LazyImage 
                src={truckOpenDoors}
                alt="Moving truck with open doors ready for loading household items in Wellington"
                className="rounded-lg w-full h-auto shadow-md"
                width={400}
                height={300}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={70}
              />
              <LazyImage 
                src={truckMovingBoxes}
                alt="Truck loaded with moving boxes and household belongings for Wellington relocation"
                className="rounded-lg w-full h-auto shadow-md"
                width={400}
                height={300}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={70}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Wellington Specific Info with Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Moving Services</h2>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <LazyImage 
              src={familyUnloading}
              alt="Family unloading furniture from removal truck into their new Wellington home"
              className="rounded-lg w-full h-auto shadow-lg mb-6"
              width={600}
              height={400}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={70}
            />
          </div>
          <div>
            <LazyImage 
              src={familyUnpacking}
              alt="Family unpacking moving boxes from rental truck in Wellington"
              className="rounded-lg w-full h-auto shadow-lg mb-6"
              width={600}
              height={400}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={70}
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Apartment Moves</h3>
              <p className="text-gray-600 mb-4">
                From compact CBD apartments to multi-level homes in Kelburn or Brooklyn, our 
                trucks are specially selected for Wellington's unique housing. Hourly rates 
                give you flexibility for quick moves.
              </p>
              <p className="font-semibold">Best for: Inner-city apartment relocations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Student Relocations</h3>
              <p className="text-gray-600 mb-4">
                Moving between flats in Te Aro, Aro Valley or Newtown? Our smaller trucks 
                are perfect for typical student moves, with space for flatmates to combine their belongings.
              </p>
              <p className="font-semibold">Best for: Affordable end-of-term housing changes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Business Relocations</h3>
              <p className="text-gray-600 mb-4">
                Moving your Wellington business? Our larger trucks with tail lifts make 
                office relocations in the CBD simple and safe. Weekend availability lets 
                you move without disrupting business.
              </p>
              <p className="font-semibold">Best for: Retail and office moves within the capital</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hutt Valley Services with Image */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Truck Hire Services for Lower Hutt & Upper Hutt</h2>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Extending our Wellington truck rental services to the entire Hutt Valley region. We proudly serve 
            Lower Hutt and Upper Hutt with the same quality trucks and competitive rates.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-primary">Lower Hutt Truck Rentals</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold mb-2">Serving All Lower Hutt Suburbs</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Petone - Perfect for character home moves and renovations</li>
                  <li>• Eastbourne - Scenic coastal moves with our smaller trucks</li>
                  <li>• Naenae - Family-friendly truck options for growing households</li>
                  <li>• Taita - Industrial area relocations and business moves</li>
                  <li>• Wainuiomata - Valley moves with trucks suited for winding roads</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Lower Hutt Moving Advantages</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Easier parking and loading compared to Wellington CBD</li>
                  <li>• Less traffic congestion for faster moving times</li>
                  <li>• Larger driveways accommodate our bigger trucks</li>
                  <li>• Quick access via SH2 for efficient pickup/delivery</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-4 text-primary">Upper Hutt Truck Rentals</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold mb-2">Covering All Upper Hutt Areas</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Totara Park - Family home moves with larger truck options</li>
                  <li>• Heretaunga - Central location with easy truck access</li>
                  <li>• Elderslea - Rural property moves and lifestyle block relocations</li>
                  <li>• Pinehaven - Hillside homes requiring careful navigation</li>
                  <li>• Silverstream - Valley floor moves with convenient loading</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Upper Hutt Specialty Services</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Rural property and lifestyle block relocations</li>
                  <li>• Construction material transport for renovations</li>
                  <li>• Garden and landscaping project support</li>
                  <li>• Multi-trip moves for larger rural properties</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
          
          <div className="flex items-start">
            <LazyImage 
              src={coupleMoving}
              alt="Couple loading boxes into rental truck for Wellington Hutt Valley move"
              className="rounded-lg w-full h-auto shadow-lg sticky top-4"
              width={400}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={70}
            />
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg p-6 border border-primary/20">
          <h3 className="font-bold text-xl mb-4 text-center">Hutt Valley Travel Times & Logistics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Lower Hutt</h4>
              <p className="text-gray-600 text-sm">20-30 minutes from our Wellington depot via SH2. Easy highway access for efficient service.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Upper Hutt</h4>
              <p className="text-gray-600 text-sm">35-45 minutes from Wellington depot. Scenic valley route with plenty of truck-friendly roads.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Delivery Available</h4>
              <p className="text-gray-600 text-sm">We can deliver trucks directly to your Hutt Valley location for added convenience.</p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">How much does it cost to hire a truck in Wellington?</h3>
            <p className="text-gray-600">
              Truck hire in Wellington starts from affordable daily rates, and the cost depends on the size of the truck and how long you need it. For an exact quote, call 0800 525 663 or book online.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do you offer same-day truck rentals?</h3>
            <p className="text-gray-600">
              Yes, same-day truck rentals are available in Wellington, subject to availability. You can often book and drive away on the very same day.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">What size trucks can I hire in Wellington?</h3>
            <p className="text-gray-600">
              We offer a range of trucks, from smaller models for lighter loads to larger trucks suitable for moving house or handling commercial deliveries.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do your trucks come with insurance?</h3>
            <p className="text-gray-600">
              Yes, all our truck rentals include standard insurance options, and you can add extra coverage for additional peace of mind when booking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Move in Wellington?</h2>
          <p className="mb-6 text-lg">Book your rental truck today and tackle those Wellington hills with confidence!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Book Your Truck Now</a>
          </Button>
        </div>
      </section>
      </div>
    </>
  );
};

export default WellingtonTruckRentals;
