import React, { useEffect } from 'react';
import { Users, Car, Navigation, Shield, ArrowRight, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from '@/components/home/SearchForm';
import { Link } from 'react-router-dom';
import WellingtonInternalLinks from '@/components/WellingtonInternalLinks';
import PageSEO from '@/components/PageSEO';


const WellingtonMinibusHire = () => {
  useEffect(() => {
    document.title = "Cheap 10 & 12 Seat Van Minibus Hire Wellington | Toyota Hiace Rental";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Affordable 10 & 12 seater Toyota Hiace minibus hire in Wellington, Lower Hutt & Upper Hutt. Cheap family van rentals for group travel with unlimited kilometres.');
    }
  }, []);

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        title="Minibus Hire Wellington from $129/day — 10 & 12 Seat Van Rental Near You"
        description="10 and 12-seat minibus hire & van rental across the Wellington region — CBD, Lower Hutt, Upper Hutt, Petone, Porirua, Tawa, Johnsonville and the Kapiti Coast. Group travel, weddings, corporate events. Drive on a car licence."
        canonical="/wellington-minibus-hire"
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">10 & 12 Seat Minibus Hire & Van Rental — Wellington</h1>
            <p className="text-lg text-gray-700 mb-6">
              Affordable Toyota Hiace minibus rentals across the Wellington region — Wellington CBD, Te Aro, Newtown, Kilbirnie, Johnsonville, Petone, Lower Hutt, Upper Hutt, Porirua, Tawa and the Kapiti Coast. Drive on a standard car licence.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Button asChild size="lg">
                <a href="#booking">Book Now</a>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/fleet/minibus">View All Minibuses</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>04 472 7328</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Book Online 24/7</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png" 
              alt="Toyota Hiace 12 Seat Minibus Wellington" 
              className="rounded-lg w-full shadow-lg"
              width="600"
              height="400"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
              Toyota Hiace
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <section id="booking" className="mb-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Your Wellington Minibus</h2>
        <SearchForm />
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Wellington Minibus Hire?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Family-Friendly</h3>
                <p className="text-gray-600">Spacious Toyota Hiace minibuses perfect for family trips and group adventures around Wellington.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Wellington Ready</h3>
                <p className="text-gray-600">Our minibuses handle Wellington's hills with ease - perfect for trips to Lower and Upper Hutt.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Affordable Rates</h3>
                <p className="text-gray-600">Cheap daily rates with unlimited kilometres - explore all of Wellington region without extra costs.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Central Location</h3>
                <p className="text-gray-600">Conveniently located at 24 Abel Smith Street, Te Aro, Wellington for quick pickup and drop-off for your family trip.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Family Traveling Image */}
      <section className="mb-12">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <img 
                src="/lovable-uploads/wellington-12-seat-van-family-group.jpg" 
                alt="Family group enjoying Toyota Hiace minibus trip in Wellington" 
                className="rounded-lg w-full shadow-lg"
                width="600"
                height="400"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Perfect for Family Adventures</h3>
              <p className="text-lg text-gray-700 mb-4">
                Our Toyota Hiace minibuses provide comfortable seating for up to 12 passengers, making them ideal for 
                family reunions, airport transfers, or exploring Wellington's beautiful attractions together.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>• Full air conditioning throughout</li>
                <li>• Bluetooth connectivity for entertainment</li>
                <li>• Spacious luggage compartment</li>
                <li>• Easy to drive with standard car licence</li>
              </ul>
              <Button asChild>
                <Link to="/fleet/minibus/12-seat-minibus">View 12-Seat Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Minibus Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Popular Toyota Hiace Minibus Options for Wellington</h2>
        
        <Tabs defaultValue="12-seat">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="12-seat">12-Seat Minibus</TabsTrigger>
            <TabsTrigger value="10-seat">10-Seat Minibus</TabsTrigger>
            <TabsTrigger value="premium">Premium Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="12-seat">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png" 
                  alt="Toyota Hiace 12 Seat Minibus for Wellington Family Groups" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">TOYOTA HIACE 12-SEAT MINIBUS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for large families visiting Wellington attractions</li>
                  <li>Automatic & manual transmission options available</li>
                  <li>Full air conditioning throughout - stay comfortable year-round</li>
                  <li>Unlimited kilometres for Wellington, Lower Hutt & Upper Hutt trips</li>
                  <li>Spacious luggage area for family belongings</li>
                  <li>Diesel engine for affordable long-distance travel</li>
                </ul>
                <div className="bg-primary/10 p-3 rounded-md mb-4">
                  <p className="text-sm font-semibold text-primary">Most Popular Choice for Wellington Families</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/fleet/minibus/12-seat-minibus" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <img 
                  src="/lovable-uploads/12-seater-van-interior-auckland.jpg" 
                  alt="Comfortable interior of 12 seat Toyota Hiace minibus" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">INTERIOR FEATURES</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Full-height seats for adult passenger comfort</li>
                  <li>Bluetooth audio system for family entertainment</li>
                  <li>Large windows for scenic Wellington views</li>
                  <li>Easy entry/exit through twin sliding doors</li>
                  <li>Cargo barrier for passenger safety</li>
                  <li>USB charging ports (select models)</li>
                </ul>
                <div className="bg-green-100 p-3 rounded-md mb-4">
                  <p className="text-sm font-semibold text-green-700">✓ No special licence required - drive with standard car licence</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="10-seat">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png" 
                  alt="Toyota Hiace 10 Seat Minibus Wellington" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">TOYOTA HIACE 10-SEAT MINIBUS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Ideal for medium-sized family groups in Wellington</li>
                  <li>Automatic transmission for easy city driving</li>
                  <li>Full air conditioning throughout the vehicle</li>
                  <li>Perfect size for airport transfers and day trips</li>
                  <li>Petrol engine - affordable and reliable</li>
                  <li>Great for exploring Wellington's suburbs and attractions</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/minibus/10-seat-minibus" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Perfect For:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>Wellington Airport group transfers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>Day trips to Martinborough wine region</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>Wellington city tours for extended families</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>Corporate team outings and events</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="premium">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/lovable-uploads/959f182c-4210-4140-a46a-86ced485f4bd.png" 
                  alt="Premium 8 Seat Van Wellington" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM 8-SEAT VAN</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Toyota Estima - luxury comfort for Wellington trips</li>
                  <li>Automatic transmission with smooth hill climbing</li>
                  <li>Twin side doors for easy access</li>
                  <li>Premium interior with superior comfort</li>
                  <li>Perfect for special occasions and VIP transport</li>
                  <li>Ideal for smaller groups wanting luxury travel</li>
                </ul>
                <div className="bg-yellow-100 p-3 rounded-md mb-4">
                  <p className="text-sm font-semibold text-yellow-700">Premium Option - Luxury Wellington Travel</p>
                </div>
              </div>
              
              <div>
                <img 
                  src="https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw" 
                  alt="Premium LDV Deliver 9 Minibus" 
                  className="rounded-lg mb-4"
                  width="500"
                  height="300"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM 12-SEAT MINIBUS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Latest model LDV Deliver 9 - top of the range</li>
                  <li>Luxury interior with premium appointments</li>
                  <li>Advanced air conditioning system</li>
                  <li>Modern Bluetooth and entertainment features</li>
                  <li>Perfect for wedding groups and special events</li>
                  <li>Available for premium Wellington experiences</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/minibus/premium-12-seat-minibus" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Wellington Tips Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Minibus Travel Tips</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Planning Your Wellington Group Trip</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Book your Toyota Hiace minibus early for weekend family trips</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Plan routes avoiding Mount Victoria tunnel during peak times</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Check Wellington weather - our vans handle all conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Consider parking arrangements for CBD destinations</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Best Wellington Family Destinations</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">•</span>
                  <span>Wellington Zoo - easy parking for minibuses</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">•</span>
                  <span>Te Papa Museum - central location, group-friendly</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">•</span>
                  <span>Zealandia - accessible via our reliable minibuses</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">•</span>
                  <span>Day trips to Martinborough wine region</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Wellington Specific Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington & Hutt Valley Minibus Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Airport Transfers</h3>
              <p className="text-gray-600 mb-4">
                Convenient Wellington Airport transfers for families and groups. Our Toyota Hiace 
                minibuses provide comfortable, affordable transport for up to 12 passengers with luggage.
              </p>
              <p className="font-semibold">Perfect for: Family arrival/departure transfers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Family Day Trips</h3>
              <p className="text-gray-600 mb-4">
                Explore Wellington region with extended family - visit attractions like Zealandia, 
                Wellington Zoo, or take scenic drives to the Hutt Valley with unlimited kilometres.
              </p>
              <p className="font-semibold">Perfect for: Weekend family adventures</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-2">Special Events</h3>
              <p className="text-gray-600 mb-4">
                Wedding transport, corporate events, or special celebrations - our premium minibuses 
                ensure your group travels together comfortably throughout Wellington.
              </p>
              <p className="font-semibold">Perfect for: Weddings and corporate events</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hutt Valley Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Cheap Minibus Hire for Lower Hutt & Upper Hutt</h2>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Extending our affordable Wellington minibus rental services throughout the Hutt Valley. 
            We proudly serve Lower Hutt and Upper Hutt families with the same quality Toyota Hiace minibuses and competitive rates.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Lower Hutt Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Petone to Wellington CBD group transport</li>
              <li>• Eastbourne family day trip shuttles</li>
              <li>• Wainuiomata community group hire</li>
              <li>• Lower Hutt shopping centre transfers</li>
              <li>• Days Bay and Sunshine Bay family outings</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm font-semibold text-blue-700">
                ✓ Pickup and drop-off available throughout Lower Hutt
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-4">Upper Hutt Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Trentham to Wellington transport</li>
              <li>• Silverstream family group bookings</li>
              <li>• Heretaunga sports team transport</li>
              <li>• Upper Hutt school group hire</li>
              <li>• Rimutaka Forest Park family adventures</li>
            </ul>
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-sm font-semibold text-green-700">
                ✓ Affordable rates with unlimited kilometres for Hutt Valley trips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Wellington Minibus?</h2>
        <p className="text-xl mb-6">
          Get a quote for your affordable Toyota Hiace minibus hire in Wellington, Lower Hutt, or Upper Hutt today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <a href="#booking">Get Instant Quote</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100" asChild>
            <a href="tel:044727328">Call Now: 04 472 7328</a>
          </Button>
        </div>
        <p className="text-sm mt-4 opacity-90">
          Book online 24/7 or call during business hours for immediate assistance
        </p>
      </section>
    </div>
    <WellingtonInternalLinks currentPath="/wellington-minibus-hire" />
    </>
  );
};

export default WellingtonMinibusHire;