import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import SearchForm from '@/components/home/SearchForm';
import familyCarImage from '@/assets/auckland-airport-family-car-rental.jpg';
import coastalRoadImage from '@/assets/auckland-car-rental-coastal-road.jpg';
import carFleetImage from '@/assets/auckland-airport-car-fleet.jpg';

const AucklandAirportCarRentals = () => {
  return (
    <>
      <Helmet>
        <title>Cheap Car Rentals | Auckland Airport - James Blond</title>
        <meta name="description" content="Affordable car rentals at Auckland Airport. Cheap daily rates on economy cars, sedans, wagons & SUVs. Book your Auckland Airport car hire today with flexible terms & unlimited km options!" />
        <meta name="keywords" content="cheap car rentals Auckland Airport, Auckland Airport car hire, budget car rental Auckland, airport car rental deals, affordable cars Auckland" />
        <link rel="canonical" href="https://jamesblond.co.nz/auckland-airport-car-rentals" />
      </Helmet>
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-primary/5 rounded-lg p-6 mb-12">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Cheap Car Rentals at Auckland Airport - Budget-Friendly Rates</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl text-center">
            Find affordable car hire at Auckland Airport with James Blond Rentals. From economy cars to SUVs, we offer competitive daily rates with flexible rental terms and unlimited kilometer options.
          </p>
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="bg-primary p-4 text-white text-center rounded-t-lg">
                  <h3 className="text-xl font-bold">Book Your Auckland Airport Car Rental Now</h3>
                </div>
                <div className="p-4">
                  <SearchForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Convenient Car Rentals at Auckland Airport</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="mb-4">
              When you land at Auckland Airport, getting on the road quickly is essential. James Blond Rentals offers a wide range of cheap car rentals right at Auckland Airport, making it easy to start your New Zealand adventure without delay.
            </p>
            <p className="mb-4">
              Whether you're visiting Auckland for business, exploring the North Island on holiday, or need a reliable vehicle for everyday use, our Auckland Airport car hire service has you covered. We offer economy cars, mid-size sedans, station wagons, and SUVs to suit every travel need and budget.
            </p>
            <p className="mb-4">
              Our convenient location near both domestic and international terminals means you can pick up your rental car within minutes of collecting your luggage. With flexible rental terms, competitive rates, and excellent customer service, we make car hire at Auckland Airport stress-free.
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Popular Auckland Destinations from the Airport</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Auckland CBD</span> - Quick 25-minute drive to downtown hotels and attractions
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Mission Bay & Beaches</span> - Explore Auckland's stunning waterfront (30 min drive)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">North Shore</span> - Visit Takapuna, Devonport and beautiful beaches (35 min drive)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Coromandel Peninsula</span> - Perfect day trip or weekend getaway (2 hr drive)
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-1">
            <AspectRatio ratio={3/4} className="rounded-lg overflow-hidden mb-4">
              <img 
                src={familyCarImage}
                alt="Happy family in rental car at Auckland Airport ready for New Zealand road trip" 
                className="w-full h-full object-cover"
                width="400"
                height="533"
                loading="lazy"
              />
            </AspectRatio>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Car Fleet Overview with Image */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Auckland Airport Car Fleet</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <AspectRatio ratio={3/4} className="rounded-lg overflow-hidden">
              <img 
                src={coastalRoadImage}
                alt="Rental car driving on scenic Auckland coastal highway with ocean views" 
                className="w-full h-full object-cover"
                width="400"
                height="533"
                loading="lazy"
              />
            </AspectRatio>
          </div>
          <div className="md:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Economy Cars</h3>
                  <p className="text-gray-600 mb-3">Fuel-efficient and budget-friendly, perfect for solo travelers or couples exploring Auckland.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      From $29/day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Automatic available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Great fuel economy
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Mid-Size Sedans</h3>
                  <p className="text-gray-600 mb-3">Comfortable and spacious for families and business travelers with extra luggage.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      From $45/day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      5-seat capacity
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Ample boot space
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Station Wagons</h3>
                  <p className="text-gray-600 mb-3">Extra cargo space ideal for families or longer trips around New Zealand.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      From $55/day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Large cargo area
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      5-7 passengers
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">SUVs & 4WDs</h3>
                  <p className="text-gray-600 mb-3">Premium vehicles perfect for adventure travel and challenging New Zealand terrain.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      From $65/day
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      AWD available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      7-seat options
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button asChild size="lg">
                <Link to="/fleet/cars">
                  View Complete Car Fleet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Why Choose Section with Image */}
      <section className="mb-12">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose James Blond for Auckland Airport Car Hire?</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <h3 className="font-semibold mb-2">Cheapest Rates Guaranteed</h3>
                  <p className="text-gray-600">We offer the most competitive car rental rates at Auckland Airport with no hidden fees. Get cheap daily rates and long-term discounts.</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Airport Convenience</h3>
                  <p className="text-gray-600">Located minutes from Auckland Airport terminals. Quick shuttle service ensures you're on the road fast after your flight lands.</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Flexible Rental Terms</h3>
                  <p className="text-gray-600">Daily, weekly, and monthly rates available. Unlimited kilometers on most vehicles. Easy one-way rentals between our branches.</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Modern, Well-Maintained Fleet</h3>
                  <p className="text-gray-600">All our rental cars are regularly serviced and maintained to the highest standards. Clean, reliable vehicles you can trust.</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <AspectRatio ratio={3/4} className="rounded-lg overflow-hidden">
                <img 
                  src={carFleetImage}
                  alt="Modern car rental fleet at Auckland Airport with Sky Tower backdrop" 
                  className="w-full h-full object-cover"
                  width="400"
                  height="533"
                  loading="lazy"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Information */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Car Rental Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">What You'll Need</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Valid driver's license (held for at least 1 year)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Credit card for security deposit</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Proof of identity (passport for international visitors)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Booking confirmation (online booking recommended)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Rental Inclusions</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Unlimited kilometers on most rentals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>24/7 roadside assistance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Comprehensive insurance options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Free airport shuttle service</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Branch Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Branch Contact</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>310 Landing Drive</p>
                    <p>Mangere</p>
                    <p>Auckland 2022</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone:</p>
                    <a href="tel:0800525663" className="hover:text-primary">0800 525 663</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email:</p>
                    <a href="mailto:info@jamesblond.co.nz" className="hover:text-primary">
                      info@jamesblond.co.nz
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/airport/auckland">
                    Full Contact Information <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Sunday:</span>
                  <span>6:00 AM - 10:00 PM</span>
                </div>
                <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">After Hours Service</p>
                  <p className="text-sm text-gray-600">
                    Need to pick up or drop off outside these hours? Contact us in advance to arrange after-hours service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map */}
      <section className="mb-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Find Us at Auckland Airport</h3>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.7946511769863!2d174.77963197680923!3d-37.00880337223573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4fa5d0a7d5a7%3A0x2a5c7d3b8c7d9a0e!2s310%20Landing%20Dr%2C%20M%C4%81ngere%2C%20Auckland%202022!5e0!3m2!1sen!2snz!4v1682305436010!5m2!1sen!2snz"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What's the minimum age to rent a car?</h3>
              <p className="text-gray-600">Drivers must be at least 21 years old with a full license held for minimum 1 year. Additional young driver fee may apply for drivers under 25.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Do you offer unlimited kilometers?</h3>
              <p className="text-gray-600">Yes! Most of our car rentals come with unlimited kilometers, perfect for exploring Auckland and the North Island without restrictions.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Can I pick up at the airport and drop off elsewhere?</h3>
              <p className="text-gray-600">Absolutely! We offer one-way rentals between our Auckland, Wellington, and Christchurch locations. One-way fees may apply.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What insurance options are available?</h3>
              <p className="text-gray-600">We offer comprehensive insurance packages with various excess options. Full coverage insurance available to reduce your liability to zero.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Auckland Airport Car Rental?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Get cheap car rental rates at Auckland Airport with James Blond Rentals. Book online now or call us for the best deals!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link to="/fleet/cars">
              View Our Car Fleet
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
            <a href="tel:0800525663">
              Call 0800 525 663
            </a>
          </Button>
        </div>
      </section>
    </div>
    </>
  );
};

export default AucklandAirportCarRentals;
