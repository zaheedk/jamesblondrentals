import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import WellingtonInternalLinks from '@/components/WellingtonInternalLinks';
import WellingtonBreadcrumb from '@/components/WellingtonBreadcrumb';


const WellingtonMinibusHireCBD = () => {
  useEffect(() => {
    document.title = "Wellington Minibus Hire CBD | 10 & 12 Seater Van Rentals";
  }, []);
  
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <WellingtonBreadcrumb currentLabel="CBD Minibus Hire" />
      <PageSEO
        title="Minibus Hire Wellington CBD — 10 & 12 Seat Van Rental, Walk-In Pickup"
        description="10 and 12-seat minibus hire from our Wellington CBD branch — easy walk-in pickup for groups travelling to Lower Hutt, Upper Hutt, Petone, Porirua, Tawa or the Kapiti Coast."
        canonical="/wellington-minibus-hire-cbd"
      />
      {/* Hero Section */}
      <section className="bg-primary/5 rounded-lg p-6 mb-12">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Wellington CBD Minibus Hire & Van Rental</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl text-center">
            Comfortable 10 and 12-seat minibus rentals from our Wellington CBD branch — easy walk-in pickup for groups heading to Petone, Lower Hutt, Upper Hutt, Porirua, Tawa, Johnsonville and the Kapiti Coast. Corporate events, family trips and sightseeing tours.
          </p>
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="bg-primary p-4 text-white text-center rounded-t-lg">
                  <h3 className="text-xl font-bold">Book Your Wellington CBD Minibus Now</h3>
                </div>
                <div className="p-4">
                  <SearchForm defaultLocation="Wellington CBD" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Wellington CBD Minibus Hire */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Group Transportation in Wellington's Heart</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              When exploring Wellington CBD with a group, our minibus rentals provide the perfect transportation solution. With spacious seating for 10 or 12 passengers, everyone can travel together comfortably while discovering the capital's attractions.
            </p>
            <p className="mb-4">
              Our Wellington CBD minibuses are ideal for corporate teams, conference groups, family reunions, tourist groups, or any occasion where you need reliable group transportation through the city's bustling streets and scenic harbor areas.
            </p>
            <p>
              With our convenient Wellington branch location, accessing your minibus for CBD exploration is quick and easy, allowing you to maximize your time experiencing New Zealand's vibrant capital.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Popular Wellington CBD Destinations</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Te Papa Museum</span> - New Zealand's national museum with easy group access (5 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Wellington Cable Car</span> - Historic transport to Botanic Garden (3 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Parliament Buildings</span> - New Zealand's seat of government (2 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Weta Workshop</span> - Movie magic experiences in Miramar (15 min drive)
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Minibus Options */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Wellington CBD Minibus Fleet</h2>
        
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
                    alt="Premium 12-Seat LDV Deliver 9 Minibus for Wellington CBD hire" 
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
                  <li>Automatic transmission for smooth city driving</li>
                  <li>Full air conditioning throughout the cabin</li>
                  <li>Bluetooth connectivity for entertainment</li>
                  <li>Perfect for executive CBD tours and VIP groups</li>
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
                    alt="Standard 12-Seat Toyota Hiace ZX Minibus for Wellington CBD hire" 
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
                  <li>Ideal for family CBD exploration and tour groups</li>
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
                    alt="10-Seat Toyota Hiace ZL Minibus for Wellington CBD hire" 
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
                  <li>Automatic transmission for easy city driving</li>
                  <li>Air conditioning throughout</li>
                  <li>Unlimited kilometers for exploring Wellington</li>
                  <li>Perfect balance of space and maneuverability in CBD</li>
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
                    alt="8-Seat Toyota Estima Van for Wellington CBD hire" 
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
                  <li>Ideal for executive CBD transfers</li>
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
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Wellington CBD Minibuses?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Bus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">CBD Navigation Experts</h3>
              <p className="text-gray-600">Our minibuses are perfectly sized for Wellington's CBD streets while providing comfortable group travel.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Central Location</h3>
              <p className="text-gray-600">Located in Wellington for quick access to all CBD attractions and business districts.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="font-semibold mb-2">Cost-Effective Tours</h3>
              <p className="text-gray-600">One minibus is more economical than multiple taxis or rideshares for CBD exploration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington CBD Minibus Rental Solutions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Corporate & Business</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Conference delegate transportation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Corporate team building events</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Client tours and business meetings</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Executive airport transfers</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Tourism & Events</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Wellington city sightseeing tours</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Cultural and museum visits</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Food and wine tours</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Festival and event transportation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Branch Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Wellington Branch Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-primary" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>68 Kahu Road</p>
                    <p>Paremata</p>
                    <p>Wellington 5024</p>
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
                  <span className="font-medium">Monday - Friday:</span>
                  <span>7:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Extended hours available for CBD pickups and events</p>
                  <p className="mt-2">Corporate bookings receive priority service</p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2986.1234567890123!2d174.86666671234567!3d-41.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d38b123456789ab%3A0x1234567890abcdef!2s68%20Kahu%20Rd%2C%20Paremata%2C%20Wellington%205024%2C%20New%20Zealand!5e0!3m2!1sen!2sus!4v1656465456146!5m2!1sen!2sus"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wellington Branch Location"
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
            <h3 className="font-bold mb-2">Do I need a special license to drive a minibus in Wellington?</h3>
            <p className="text-gray-600">
              A standard New Zealand car license (Class 1) is all you need to drive our minibuses. International visitors can use their home country license (with translation if not in English) or an International Driving Permit.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Is parking available for minibuses in Wellington CBD?</h3>
            <p className="text-gray-600">
              Yes, there are several parking options for minibuses in Wellington CBD including Wilson Parking buildings and selected street parking areas. We provide guidance on the best parking locations for your destinations.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Can you deliver the minibus to my CBD location?</h3>
            <p className="text-gray-600">
              Yes, we offer delivery and pickup services within Wellington CBD for an additional fee. This is particularly convenient for hotel pickups and corporate events.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2">Are there any restrictions for driving in Wellington CBD?</h3>
            <p className="text-gray-600">
              Our minibuses are designed to navigate Wellington's CBD streets comfortably. We provide route guidance and advice on the best routes to avoid height-restricted areas and narrow streets.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12 text-center">
        <div className="bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Book Your Wellington CBD Minibus?</h2>
          <p className="mb-6 text-lg max-w-3xl mx-auto">
            Whether you're planning a corporate event, sightseeing tour, or family outing, our minibuses provide comfortable and convenient transportation for exploring Wellington's vibrant CBD.
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
    <WellingtonInternalLinks currentPath="/wellington-minibus-hire-cbd" />
    </>
  );
};

export default WellingtonMinibusHireCBD;