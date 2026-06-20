import React, { useEffect } from 'react';
import { Users, Shield, Star, MapPin, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchForm from '@/components/home/SearchForm';
import { Link } from 'react-router-dom';
import WellingtonInternalLinks from '@/components/WellingtonInternalLinks';
import WellingtonBreadcrumb from '@/components/WellingtonBreadcrumb';
import PageSEO from '@/components/PageSEO';


const WellingtonMinibusRentals = () => {
  useEffect(() => {
    document.title = "Minibus Hire Wellington | 10–12 Seater Rentals – James Blond";
    
    // Update meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Affordable minibus hire in Wellington. Choose from 8, 10, and 12-seater rentals for group travel, tours, and events. Book online today.');
    }
  }, []);

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <WellingtonBreadcrumb currentLabel="Minibus Rental" />
      <PageSEO
        title="Minibus Rental Wellington from $129/day — 10 & 12 Seat Hire Near You"
        description="Minibus hire & 10–12 seat van rental across the Wellington region — CBD, Lower Hutt, Upper Hutt, Petone, Porirua, Tawa, Johnsonville and the Kapiti Coast. Groups, events and family travel."
        canonical="/minibus-hire-wellington"
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Minibus Hire & Van Rental — Wellington (10 & 12 Seat)</h1>
          <p className="text-lg text-gray-700 mb-6">
            Premium minibus rentals across the Wellington region — Wellington CBD, Petone, Lower Hutt, Upper Hutt, Porirua, Tawa, Johnsonville and the Kapiti Coast. Comfortable transport for up to 12 passengers, drive on a standard car licence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg">
              <Link to="#book-now">Book Now</Link>
            </Button>
            <div className="flex items-center text-primary font-semibold">
              <Phone className="h-5 w-5 mr-2" />
              <span>Call: 0800 525 663</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <section id="book-now" className="mb-12">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Book Your Wellington Minibus</h2>
          <p className="text-center mb-6">Check availability and reserve your minibus today</p>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Wellington Minibus Rentals?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Group Travel Specialists</h3>
                <p className="text-gray-600">Over 15 years experience providing minibus rentals for Wellington groups, from airport transfers to wine tours.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Safety First</h3>
                <p className="text-gray-600">All Wellington minibuses are regularly inspected, WOF certified, and equipped with modern safety features.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Comfort</h3>
                <p className="text-gray-600">Air conditioning, comfortable seating, and ample luggage space for Wellington and regional travel.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Central Wellington Location</h3>
                <p className="text-gray-600">Convenient pickup from our branch at 24 Abel Smith Street, Te Aro, close to Wellington CBD and major transport links.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Minibus Options */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Wellington Minibus Fleet</h2>
        
        <Tabs defaultValue="12-seater">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="12-seater">12 Seater Minibus</TabsTrigger>
            <TabsTrigger value="10-seater">10 Seater Minibus</TabsTrigger>
            <TabsTrigger value="premium">Premium Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="12-seater">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/src/assets/wellington-12-seat-van-family-group.jpg" 
                  alt="12 Seater Minibus for Wellington Family Groups" 
                  className="rounded-lg mb-4 w-full"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">12 SEATER MINIBUS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for large families and groups exploring Wellington</li>
                  <li>Comfortable seating for 12 passengers with safety belts</li>
                  <li>Ample luggage space for overnight trips or airport transfers</li>
                  <li>Air conditioning and modern interior features</li>
                  <li>Automatic transmission - easy to drive on Wellington's hills</li>
                  <li>Ideal for: Corporate events, wedding groups, sports teams</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/minibus/12-seat-minibus" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <img 
                  src="/src/assets/12-seater-van-wellington-parliament.jpg" 
                  alt="12 Seater Van at Wellington Parliament Buildings" 
                  className="rounded-lg mb-4 w-full"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">WELLINGTON SIGHTSEEING</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Perfect for Wellington city tours and sightseeing</li>
                  <li>Visit Parliament, Te Papa, Mount Victoria lookout</li>
                  <li>Comfortable transport for day trips to Wairarapa</li>
                  <li>Large windows for scenic viewing around Wellington harbour</li>
                  <li>Professional appearance for corporate tours</li>
                  <li>GPS navigation included for Wellington attractions</li>
                </ul>
                <Button asChild>
                  <Link to="#book-now" className="flex items-center">
                    Book 12 Seater <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="10-seater">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/src/assets/12-seater-van-interior-auckland.jpg" 
                  alt="10 Seater Minibus Interior - Comfortable Wellington Travel" 
                  className="rounded-lg mb-4 w-full"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">10 SEATER MINIBUS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Ideal size for medium groups and families</li>
                  <li>Easier to drive and park than larger minibuses</li>
                  <li>Comfortable seating with individual safety belts</li>
                  <li>More luggage space per passenger than 12-seater</li>
                  <li>Perfect for Wellington wine tours and day trips</li>
                  <li>Excellent fuel economy for longer journeys</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/minibus/10-seat-minibus" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <img 
                  src="/src/assets/12-seater-van-auckland-sky-tower.jpg" 
                  alt="10 Seater Minibus for Wellington Airport Transfers" 
                  className="rounded-lg mb-4 w-full"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">AIRPORT TRANSFERS</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Convenient Wellington Airport pickup and drop-off</li>
                  <li>Space for large groups with luggage</li>
                  <li>Professional service for business travellers</li>
                  <li>Direct route from airport to Wellington CBD</li>
                  <li>Meet and greet service available</li>
                  <li>Fixed pricing - no surge charges</li>
                </ul>
                <Button asChild>
                  <Link to="#book-now" className="flex items-center">
                    Book 10 Seater <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="premium">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/src/assets/auckland-van-fleet-sky-tower.jpg" 
                  alt="Premium Minibus Fleet for Wellington Corporate Travel" 
                  className="rounded-lg mb-4 w-full"
                  loading="lazy"
                />
                <h3 className="font-bold text-xl mb-2">PREMIUM 12 SEATER</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Luxury interior with premium seating and finishes</li>
                  <li>Enhanced comfort for longer Wellington region trips</li>
                  <li>Climate control and entertainment systems</li>
                  <li>Professional appearance for executive transport</li>
                  <li>Perfect for corporate events and VIP guests</li>
                  <li>Superior ride quality on Wellington's challenging roads</li>
                </ul>
                <Button asChild variant="outline">
                  <Link to="/fleet/minibus/premium-12-seat-minibus" className="flex items-center">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
                <h3 className="font-bold text-xl mb-4">Custom Group Solutions</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-2">
                  <li>Multi-day Wellington region tours</li>
                  <li>Corporate shuttle services</li>
                  <li>Wedding party transport</li>
                  <li>Sports team transportation</li>
                  <li>School group excursions</li>
                  <li>Conference delegate transfers</li>
                </ul>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our Wellington team for customised group transport solutions and special rates for extended bookings.
                </p>
                <Button asChild>
                  <Link to="/contact/wellington" className="flex items-center">
                    Get Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Popular Destinations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Wellington Minibus Destinations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Wellington Airport Transfers</h3>
              <p className="text-gray-600 mb-3">
                Convenient group transfers between Wellington Airport and the city centre, suburbs, or Hutt Valley.
              </p>
              <p className="text-sm font-semibold text-primary">20 minutes from CBD</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Wairarapa Wine Tours</h3>
              <p className="text-gray-600 mb-3">
                Perfect for group wine tours to Martinborough and the greater Wairarapa region.
              </p>
              <p className="text-sm font-semibold text-primary">1.5 hours from Wellington</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Kapiti Coast Day Trips</h3>
              <p className="text-gray-600 mb-3">
                Explore Kapiti Island, Paraparaumu Beach, and other coastal attractions north of Wellington.
              </p>
              <p className="text-sm font-semibold text-primary">1 hour from Wellington</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Picton Ferry Terminal</h3>
              <p className="text-gray-600 mb-3">
                Transport groups to catch the Interislander or Bluebridge ferries to the South Island.
              </p>
              <p className="text-sm font-semibold text-primary">2.5 hours from Wellington</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Wellington City Tours</h3>
              <p className="text-gray-600 mb-3">
                Visit Parliament, Te Papa, Cable Car, Mount Victoria, and other iconic Wellington attractions.
              </p>
              <p className="text-sm font-semibold text-primary">Within Wellington city</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Hutt Valley</h3>
              <p className="text-gray-600 mb-3">
                Convenient transport to Lower and Upper Hutt for business meetings or family visits.
              </p>
              <p className="text-sm font-semibold text-primary">30 minutes from Wellington CBD</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Wellington Specific Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Minibus Rental Benefits</h2>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Perfect for Wellington's Terrain</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Powerful engines handle Wellington's steep hills with ease</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Compact enough to navigate narrow inner-city streets</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Stable in Wellington's famous wind conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Easy parking in Wellington's compact CBD area</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Group Travel Made Easy</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Keep your group together - no multiple vehicles needed</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Cost-effective alternative to taxis for large groups</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Flexible pickup and drop-off locations around Wellington</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</span>
                  <span>Professional image for corporate and special events</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Branch Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Address:</span>
                  <p className="text-gray-600">24 Abel Smith Street, Te Aro, Wellington 6011</p>
                </div>
                <div>
                  <span className="font-semibold">Phone:</span>
                  <p className="text-gray-600">0800 525 663</p>
                </div>
                <div>
                  <span className="font-semibold">Email:</span>
                  <p className="text-gray-600">wellington@jamesblond.co.nz</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Opening Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>7:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  24/7 support available for existing bookings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Minibus Rental FAQs</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">How much does minibus hire in Wellington cost?</h3>
            <p className="text-gray-600">
              Minibus hire in Wellington starts from affordable daily rates, with pricing based on the size of the vehicle and the length of the rental. Whether you need a 8-seater for a short trip or a 12-seater for a longer journey, we provide clear, upfront costs with no hidden fees. For an exact quote, call 0800 525 663 or check availability online.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">What minibus sizes are available for hire?</h3>
            <p className="text-gray-600">
              We offer a full range of minibuses to suit different group sizes and travel needs. Our Wellington fleet includes 8-seater, 10-seater, and 12-seater minibuses. Each vehicle is well-maintained, spacious, and designed for comfort, making them ideal for family trips, school outings, business travel, or group events.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can I hire a minibus for one day in Wellington?</h3>
            <p className="text-gray-600">
              Yes, you can hire a minibus for just one day in Wellington. We offer flexible hire options ranging from single-day rentals to longer-term bookings, so you only pay for the time you need. Same-day bookings are available subject to vehicle availability.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Do you provide airport transfers with your minibus?</h3>
            <p className="text-gray-600">
              Yes, our Minibuses are available for airport pickups and drop-offs in Wellington. This makes group travel to and from the airport simple, affordable, and convenient. Whether it's for a family trip, a business group, or visiting guests, our minibuses provide a reliable airport transfer option.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-primary/5 border border-primary/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Book Your Wellington Minibus?</h2>
        <p className="text-lg text-gray-700 mb-6">
          Get your group moving with our reliable minibus rental service. Book online now or call our Wellington team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="#book-now">Book Online Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact/wellington">Contact Wellington Branch</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Need help choosing? Call <strong>0800 525 663</strong> and speak to our Wellington vehicle specialists.
        </p>
      </section>
    </div>
    <WellingtonInternalLinks currentPath="/minibus-hire-wellington" />
    </>
  );
};

export default WellingtonMinibusRentals;