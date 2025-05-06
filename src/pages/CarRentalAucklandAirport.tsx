import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Fuel, Airplay } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SearchForm from '@/components/home/SearchForm';

const CarRentalAucklandAirport = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-primary/5 rounded-lg p-6 mb-12">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="bg-primary p-4 text-white text-center rounded-t-lg">
                  <h3 className="text-xl font-bold">Book Your Auckland Airport Vehicle Now</h3>
                </div>
                <div className="p-4">
                  <SearchForm defaultLocationId="7" /> {/* Auckland Airport location ID */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Auckland Airport Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Auckland Airport Car Rentals with James Blond</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              Auckland International Airport is New Zealand's largest and busiest airport, serving as the main gateway to the country. 
              With a James Blond rental car waiting for you at the airport, you can begin your New Zealand adventure the moment you land.
            </p>
            <p className="mb-4">
              Our Auckland Airport branch offers convenient pick-up and drop-off services, allowing you to avoid the hassle of airport transfers 
              and public transport with luggage. Our friendly team will ensure a smooth rental experience so you can get on the road quickly.
            </p>
            <p>
              Whether you're visiting for business or pleasure, our diverse fleet of well-maintained vehicles gives you the freedom to explore 
              Auckland and beyond at your own pace.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Popular Destinations From Auckland Airport</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Auckland CBD</span> - The heart of the city with shopping, dining, and attractions (25 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Waiheke Island Ferry</span> - Access to Auckland's wine island (35 min drive to ferry terminal)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">West Coast Beaches</span> - Piha and Muriwai's black sand beaches (50 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Matakana</span> - Markets, wineries, and coastal walks (1 hour drive)
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Why Choose James Blond */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Why Choose James Blond at Auckland Airport</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Airplay className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Airport Convenience</h3>
              </div>
              <p className="text-center">
                We're just minutes from the terminal with our free shuttle service for seamless transitions from plane to car.
              </p>
              <div className="mt-4 text-center">
                <Button variant="link" asChild>
                  <Link to="/airport/auckland">Airport Shuttle Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Fuel className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Fuel Savings</h3>
              </div>
              <p className="text-center">
                Get 8 cents off per litre at participating Mobil stations with our exclusive fuel discount.
              </p>
              <div className="mt-4 text-center">
                <Button variant="link" asChild>
                  <Link to="/hot-deals/mobil-fuel-discount">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </div>
                <h3 className="text-xl font-semibold">24/7 Support</h3>
              </div>
              <p className="text-center">
                Our team is available around the clock for emergency assistance throughout your rental period.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

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
                    <p>42 Richard Pearse Drive</p>
                    <p>Mangere</p>
                    <p>Auckland 2022</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone:</p>
                    <a href="tel:095757580" className="hover:text-primary">09 575 7580</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email:</p>
                    <a href="mailto:airport@jamesblond.co.nz" className="hover:text-primary">
                      airport@jamesblond.co.nz
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
                  <span>7:30 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>After hours pick up and drop off available by prior arrangement</p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.371530096222!2d174.7814130156934!3d-36.9741162798763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4fe2c15e031b%3A0xebae74862a5cb66!2s42%20Richard%20Pearse%20Dr%2C%20Mangere%2C%20Auckland%202022!5e0!3m2!1sen!2snz!4v1653922221822!5m2!1sen!2snz"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="mb-12">
        <div className="bg-primary/5 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore Auckland?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Book your Auckland Airport rental car today and start your New Zealand adventure immediately after landing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/vehicles">View Our Vehicle Range</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:095757580">Call Us: 09 575 7580</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarRentalAucklandAirport;
