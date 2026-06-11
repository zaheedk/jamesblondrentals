
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

const ChristchurchTruckRentals = () => {
  return (
    <>
      <Helmet>
        <title>Truck Hire Christchurch | Affordable Truck Rentals – James Blond</title>
        <meta name="description" content="Book affordable truck hire in Christchurch. Perfect for moving, business deliveries, and heavy loads. Flexible daily and weekly rentals – no hidden costs." />
        <meta name="keywords" content="Christchurch truck rentals, moving trucks Christchurch, furniture truck hire, Christchurch moving, truck hire Canterbury" />
        <link rel="canonical" href="https://www.jamesblond.co.nz/truck-hire-christchurch" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Truck Hire in Christchurch – Affordable Rentals</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Making your move in Christchurch easier and more affordable with our range of rental trucks tailored for the Garden City.
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
              alt="Box Truck for Moving in Christchurch" 
              className="rounded-lg w-full shadow-lg"
              width={600}
              height={400}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
            />
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">
              Most Popular
            </div>
          </div>
        </div>
      </div>

      {/* Booking Frame Section */}
      <section id="booking" className="mb-12 scroll-mt-16">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Christchurch Truck Rental</h2>
          <p className="text-center mb-6">Check availability and reserve your moving truck today</p>
          
          <div className="max-w-4xl mx-auto">
            <TruckQuoteSearchForm 
              defaultPickupLocation="14"
              defaultDropoffLocation="14"
              defaultCarCategory="12"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Truck Hire in Christchurch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Christchurch Specialists</h3>
                <p className="text-muted-foreground">Based in Christchurch with two convenient locations – Airport and Central – we know the area and provide trucks suited for local moves.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flat & Easy Roads</h3>
                <p className="text-muted-foreground">Christchurch's flat terrain makes truck driving easy, perfect for first-time movers and DIY relocations.</p>
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
                <p className="text-muted-foreground">Flexible daily rates to make your Christchurch move budget-friendly, with no hidden costs.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Two Locations</h3>
                <p className="text-muted-foreground">Pick up from our Airport branch at 17/25 Logistics Drive or Central branch at 515 Moorhouse Avenue – whichever is more convenient.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Truck Options */}
      <section className="mb-12 bg-muted/50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Truck Options for Christchurch Moves</h2>
        
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
                  alt="Box Truck for Furniture Moving in Christchurch" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (12M³)</h3>
                <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
                  <li>Perfect for apartment and unit moves across Christchurch</li>
                  <li>Automatic transmission for easy city driving</li>
                  <li>Box: 3100(L) x 1750(W) x 2050(H)</li>
                  <li>Ideal for single bedroom or studio moves</li>
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
                  alt="Box Truck with Tail Lift for Christchurch" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (12M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
                  <li>Great for loading heavy furniture with ease</li>
                  <li>Tail lift simplifies loading from ground level</li>
                  <li>Max Tail Lift Load: 400kg</li>
                  <li>Perfect for appliances and heavy items</li>
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
                  alt="Large Box Truck for Christchurch House Moves" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE BOX (16M³)</h3>
                <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
                  <li>Ideal for 2-3 bedroom home moves in Christchurch</li>
                  <li>Manual transmission with plenty of power</li>
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
                  alt="Large Box Truck with Tail Lift for Christchurch" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">3 TONNE BOX (19M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
                  <li>Our largest option for complete Christchurch house moves</li>
                  <li>Perfect for larger homes in suburbs like Merivale or Fendalton</li>
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
                  alt="Tipper Truck for Christchurch" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">2 TONNE TIPPER</h3>
                <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
                  <li>Perfect for Christchurch landscaping and renovation projects</li>
                  <li>Ideal for construction waste removal</li>
                  <li>Tray: 3100(L) x 1600(W)</li>
                  <li>Great for garden and building site clean-ups</li>
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
                  alt="Large Box Truck with Tail Lift for Commercial Use in Christchurch" 
                  className="rounded-lg mb-4"
                  width={500}
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={70}
                />
                <h3 className="font-bold text-xl mb-2">3 TONNE BOX (18M³) +TAIL LIFT</h3>
                <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
                  <li>Ideal for Christchurch business relocations</li>
                  <li>Perfect for retail and office moves</li>
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

      {/* Tips Section with Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Christchurch Moving Tips</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Planning Your Christchurch Move</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                    <span>Book early for weekend moves, especially during summer and university term changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                    <span>Plan your route – Christchurch's grid layout makes navigation straightforward</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                    <span>Check for road works in the CBD – ongoing rebuild areas may affect access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                    <span>Take advantage of Christchurch's flat roads for easier and faster loading</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-xl mb-4">Making the Most of Your Rental</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                    <span>Use our tail lift trucks for heavy appliances and furniture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                    <span>Secure items well – Canterbury nor'westers can be gusty</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                    <span>Consider renting straps and a hand trolley for additional convenience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                    <span>Fuel up nearby – we have fuel stations close to both branches</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <LazyImage 
                src={truckOpenDoors}
                alt="Moving truck with open doors ready for loading household items in Christchurch"
                className="rounded-lg w-full h-auto shadow-md"
                width={400}
                height={300}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={70}
              />
              <LazyImage 
                src={truckMovingBoxes}
                alt="Truck loaded with moving boxes and household belongings for Christchurch relocation"
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

      {/* Christchurch Specific Info with Images */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Christchurch Moving Services</h2>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <LazyImage 
              src={familyUnloading}
              alt="Family unloading furniture from removal truck into their new Christchurch home"
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
              alt="Family unpacking moving boxes from rental truck in Christchurch"
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
              <h3 className="font-bold text-xl mb-2">Apartment & Unit Moves</h3>
              <p className="text-muted-foreground mb-4">
                From modern CBD apartments to units in Riccarton or Addington, our 
                trucks make moving simple. Christchurch's flat streets mean easy driving 
                and loading for everyone.
              </p>
              <p className="font-semibold">Best for: Inner-city apartment relocations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Student Relocations</h3>
              <p className="text-muted-foreground mb-4">
                Moving between flats in Ilam, Riccarton or Upper Riccarton near the University 
                of Canterbury? Our smaller trucks are perfect for student moves with affordable rates.
              </p>
              <p className="font-semibold">Best for: Affordable end-of-term housing changes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Business Relocations</h3>
              <p className="text-muted-foreground mb-4">
                Moving your Christchurch business? Our larger trucks with tail lifts make 
                office and retail relocations simple. Weekend availability lets 
                you move without disrupting business.
              </p>
              <p className="font-semibold">Best for: Office and retail moves across Canterbury</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Canterbury Suburbs Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Truck Hire Across Greater Christchurch</h2>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 mb-6">
          <p className="text-lg text-muted-foreground mb-4">
            Our Christchurch truck rental services cover the entire Greater Christchurch area and beyond. 
            From Rangiora to Rolleston, we've got your move covered.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-primary">North & West Christchurch</h3>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">Serving Northern & Western Suburbs</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Merivale – Character home moves and renovations</li>
                  <li>• Fendalton – Large family home relocations</li>
                  <li>• Papanui – Residential and commercial moves</li>
                  <li>• Riccarton – Student and apartment moves</li>
                  <li>• Rangiora – Rural and lifestyle block relocations</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Moving Advantages</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Wide streets and easy parking for truck loading</li>
                  <li>• Close to our Airport branch at Logistics Drive</li>
                  <li>• Quick access via the Northern Motorway</li>
                  <li>• Flat terrain makes driving larger trucks simple</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-4 text-primary">South & East Christchurch</h3>
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">Covering Southern & Eastern Areas</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Halswell – Growing suburb with new developments</li>
                  <li>• Lincoln – Rural town moves and relocations</li>
                  <li>• Rolleston – Selwyn district family moves</li>
                  <li>• Sumner – Coastal suburb relocations</li>
                  <li>• Lyttelton – Port hills and harbour-side moves</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Southern Specialty Services</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• New build relocations in Rolleston and Lincoln</li>
                  <li>• Construction material transport</li>
                  <li>• Garden and landscaping project support</li>
                  <li>• Close to our Central branch on Moorhouse Ave</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
          
          <div className="flex items-start">
            <LazyImage 
              src={coupleMoving}
              alt="Couple loading boxes into rental truck for Christchurch move"
              className="rounded-lg w-full h-auto shadow-lg sticky top-4"
              width={400}
              height={500}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={70}
            />
          </div>
        </div>
        
        <div className="mt-8 bg-card rounded-lg p-6 border border-primary/20">
          <h3 className="font-bold text-xl mb-4 text-center">Our Christchurch Branches</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Airport Branch</h4>
              <p className="text-muted-foreground text-sm">17/25 Logistics Drive, Harewood. Convenient for moves in the north and west of the city.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Central Branch</h4>
              <p className="text-muted-foreground text-sm">515 Moorhouse Avenue, Waltham. Ideal for CBD, south and east Christchurch moves.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Delivery Available</h4>
              <p className="text-muted-foreground text-sm">We can deliver trucks directly to your Christchurch location for added convenience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">How much does it cost to hire a truck in Christchurch?</h3>
            <p className="text-muted-foreground">
              Truck hire in Christchurch starts from affordable daily rates, and the cost depends on the size of the truck and how long you need it. For an exact quote, call 0800 525 663 or book online.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do you offer same-day truck rentals in Christchurch?</h3>
            <p className="text-muted-foreground">
              Yes, same-day truck rentals are available in Christchurch, subject to availability. You can often book and drive away on the very same day.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">What size trucks can I hire in Christchurch?</h3>
            <p className="text-muted-foreground">
              We offer a range of trucks, from smaller models for lighter loads to larger trucks suitable for moving house or handling commercial deliveries.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do your trucks come with insurance?</h3>
            <p className="text-muted-foreground">
              Yes, all our truck rentals include standard insurance options, and you can add extra coverage for additional peace of mind when booking.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Which Christchurch branch should I pick up from?</h3>
            <p className="text-muted-foreground">
              We have two branches – our Airport branch at 17/25 Logistics Drive is ideal for moves in the north and west, while our Central branch at 515 Moorhouse Avenue is best for CBD, south and east Christchurch moves.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-primary-foreground">
          <h2 className="text-2xl font-bold mb-4">Ready to Move in Christchurch?</h2>
          <p className="mb-6 text-lg">Book your rental truck today and enjoy stress-free moving on Christchurch's flat, easy roads!</p>
          <Button variant="secondary" size="lg" asChild>
            <a href="#booking">Book Your Truck Now</a>
          </Button>
        </div>
      </section>
      </div>
    </>
  );
};

export default ChristchurchTruckRentals;
