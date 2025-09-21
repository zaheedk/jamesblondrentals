import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import SearchForm from '@/components/home/SearchForm';

const AucklandAirportMinibusRentals = () => {
  return (
    <>
      <Helmet>
        <title>Affordable 10 and 12 Seater Vans Rental Auckland New Zealand</title>
        <meta name="description" content="Premium minibus rentals at Auckland Airport. 10 & 12 seater vans perfect for groups, families & corporate travel. Book your Auckland Airport minibus hire today!" />
      </Helmet>
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-primary/5 rounded-lg p-6 mb-12">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Auckland Airport Minibus Rentals & Hire</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl text-center">
            Comfortable, reliable minibus rentals for groups traveling to and from Auckland Airport. Perfect for family vacations, corporate travel, and special occasions.
          </p>
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="bg-primary p-4 text-white text-center rounded-t-lg">
                  <h3 className="text-xl font-bold">Book Your Auckland Airport Minibus Now</h3>
                </div>
                <div className="p-4">
                  <SearchForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Auckland Airport Minibus Rentals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Group Transportation Made Easy at Auckland Airport</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              When traveling with a group through Auckland Airport, our minibus rentals provide the perfect transportation solution. With spacious seating for 10 or 12 passengers, everyone can travel together comfortably without the need for multiple vehicles.
            </p>
            <p className="mb-4">
              Our Auckland Airport minibuses are ideal for family reunions, corporate teams, sports groups, wedding parties, or any occasion where you need reliable group transportation. All our vehicles are well-maintained, clean, and ready for your journey.
            </p>
            <p>
              With our convenient Auckland Airport branch location, picking up your minibus upon arrival is quick and easy, allowing you to start your New Zealand adventure without delay.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Popular Group Destinations Around Auckland</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Waiheke Island</span> - Transport your group to the ferry terminal for a wine tour adventure (30 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Waitakere Ranges</span> - Explore Auckland's stunning rainforests and beaches as a group (45 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Matakana</span> - Visit the famous farmers markets and vineyards with friends (1 hr drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Hobbiton Movie Set</span> - Take your group on a Lord of the Rings tour (2 hr drive)
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Minibus Options */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Auckland Airport Minibus Fleet</h2>
        
        <Tabs defaultValue="12-seater">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="12-seater">12-Seat Minibuses</TabsTrigger>
            <TabsTrigger value="10-seater">10-Seat Minibuses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="12-seater">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <AspectRatio ratio={16/9} className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src="https://lh3.googleusercontent.com/p/AF1QipP4NNI7qFZnIYiTD7vszdysstoTlvTZJ6V-ApI=s680-w680-h510-rw" 
                    alt="Premium 12-Seat LDV Deliver 9 Minibus for Auckland Airport hire" 
                    className="w-full h-full object-cover"
                    width="600"
                    height="338"
                    loading="lazy"
                  />
                </AspectRatio>
                <Badge className="mb-2 bg-primary/10 text-primary">Premium</Badge>
                <h3 className="font-bold text-xl mb-2">PREMIUM 12-SEAT MINIBUS</h3>
                <p className="text-gray-600 mb-3">LDV Deliver 9 (2024 or newer)</p>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Luxury interior with full-height comfortable seating</li>
                  <li>Automatic transmission for smooth driving experience</li>
                  <li>Full air conditioning throughout the cabin</li>
                  <li>Bluetooth connectivity for entertainment</li>
                  <li>Perfect for executive airport transfers and VIP groups</li>
                </ul>
                <Button asChild>
                  <Link to="/fleet/minibus/premium-12-seat-minibus" className="w-full">
                    View Details
                  </Link>
                </Button>
              </div>
              
              <div>
                <AspectRatio ratio={16/9} className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png" 
                    alt="Standard 12-Seat Toyota Hiace ZX Minibus for Auckland Airport hire" 
                    className="w-full h-full object-cover"
                    width="600"
                    height="338"
                    loading="lazy"
                  />
                </AspectRatio>
                <h3 className="font-bold text-xl mb-2">12-SEAT MINIBUS</h3>
                <p className="text-gray-600 mb-3">Toyota Hiace ZX (2017 or newer)</p>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Spacious interior with full-height seating</li>
                  <li>Available in automatic or manual transmission</li>
                  <li>Air conditioning throughout the cabin</li>
                  <li>Cargo barrier for luggage security</li>
                  <li>Ideal for family airport transfers and tour groups</li>
                </ul>
                <Button asChild>
                  <Link to="/fleet/minibus/12-seat-minibus" className="w-full">
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="10-seater">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <AspectRatio ratio={16/9} className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png" 
                    alt="10-Seat Toyota Hiace ZL Minibus for Auckland Airport hire" 
                    className="w-full h-full object-cover"
                    width="600"
                    height="338"
                    loading="lazy"
                  />
                </AspectRatio>
                <h3 className="font-bold text-xl mb-2">10-SEAT MINIBUS</h3>
                <p className="text-gray-600 mb-3">Toyota Hiace ZL (2012 or newer)</p>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Comfortable seating for medium-sized groups</li>
                  <li>Automatic transmission for easy driving</li>
                  <li>Air conditioning throughout</li>
                  <li>Unlimited kilometers for exploring New Zealand</li>
                  <li>Perfect balance of space and maneuverability</li>
                </ul>
                <Button asChild>
                  <Link to="/fleet/minibus/10-seat-minibus" className="w-full">
                    View Details
                  </Link>
                </Button>
              </div>
              
              <div>
                <AspectRatio ratio={16/9} className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src="/lovable-uploads/959f182c-4210-4140-a46a-86ced485f4bd.png" 
                    alt="8-Seat Toyota Estima Van for Auckland Airport hire" 
                    className="w-full h-full object-cover"
                    width="600"
                    height="338"
                    loading="lazy"
                  />
                </AspectRatio>
                <h3 className="font-bold text-xl mb-2">8-SEAT VAN</h3>
                <p className="text-gray-600 mb-3">Toyota Estima (2017)</p>
                <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                  <li>Luxury interior perfect for smaller groups</li>
                  <li>Twin side doors for easy access</li>
                  <li>Bluetooth connectivity</li>
                  <li>Air conditioning throughout</li>
                  <li>Ideal for executive airport transfers</li>
                </ul>
                <Button asChild variant="outline">
                  <span className="w-full">Coming Soon</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Auckland Airport Minibuses?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Bus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Group Travel Specialists</h3>
              <p className="text-gray-600">Our minibuses are specifically designed for comfortable group travel with ample legroom and storage space.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Auckland Airport Convenience</h3>
              <p className="text-gray-600">Located just minutes from the terminals for quick and hassle-free pickup and drop-off.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="font-semibold mb-2">Cost-Effective Travel</h3>
              <p className="text-gray-600">One minibus is more economical than multiple car rentals, with savings on fuel and rental fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Minibus Rental Solutions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Family & Group Travel</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Family reunions and multi-generational travel</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Friend groups exploring Auckland and beyond</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Wedding parties and special celebrations</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>School and university groups on educational trips</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Business & Tourism</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Corporate team transfers and retreats</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Conference and event shuttle services</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Tour groups exploring Auckland's attractions</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Sports teams traveling to competitions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Branch Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Branch Information</h2>
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
                <div className="mt-4 text-sm text-gray-600">
                  <p>After hours pickup and drop off available on request</p>
                  <p className="mt-2">Group bookings receive priority service</p>
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
            <h3 className="text-2xl font-semibold mb-6">Location</h3>
            <div className="aspect-video">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3187.6396102095876!2d174.77388371562642!3d-36.99685879096521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4fec941e66f7%3A0xb193950514fff676!2s310%20Landing%20Dr%2C%20Mangere%2C%20Auckland%202022%2C%20New%20Zealand!5e0!3m2!1sen!2sus!4v1656465456146!5m2!1sen!2sus"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Auckland Airport Branch Location"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">What license do I need to drive a minibus in New Zealand?</h3>
            <p className="text-gray-600">
              A standard New Zealand car license (Class 1) is all you need to drive our minibuses. International visitors can use their home country license (with translation if not in English) or an International Driving Permit.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">How much luggage space is available in the minibuses?</h3>
            <p className="text-gray-600">
              Our 12-seater and 10-seater minibuses both feature adequate luggage space at the rear. The 12-seater Premium LDV Deliver 9 offers the most generous storage capacity for large groups with substantial luggage needs.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Are there any special rates for airport minibus rentals?</h3>
            <p className="text-gray-600">
              Yes, we offer special airport rates and packages for minibus rentals, including discounted long-term rentals and corporate rates. Contact our Auckland Airport branch for current promotions.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can I pick up at Auckland Airport and drop off at another location?</h3>
            <p className="text-gray-600">
              Yes, we offer flexible one-way rentals between our Auckland Airport, Auckland City, Wellington, and Christchurch branches. Additional fees may apply depending on the locations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Book Your Auckland Airport Minibus?</h2>
          <p className="mb-6 text-lg max-w-3xl mx-auto">
            Whether you're planning a family vacation, corporate retreat, or tour group, our minibuses provide comfortable and cost-effective transportation for your Auckland adventure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <a href="#top">Book Now</a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-white/90" asChild>
              <a href="tel:0800525663">Call Us: 0800 525 663</a>
            </Button>
          </div>
        </div>
      </section>
     </div>
    </>
  );
};

export default AucklandAirportMinibusRentals;
