
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Car } from 'lucide-react';
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
                  <SearchForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Auckland Airport Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Auckland Airport Car Rental</h1>
        <h2 className="text-2xl font-bold mb-6">Explore Auckland with James Blond</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">
              Auckland Airport is New Zealand's largest and busiest international gateway, serving as the perfect starting point for your North Island adventure. With a James Blond rental car, you'll have the freedom to explore Auckland and beyond at your own pace.
            </p>
            <p className="mb-4">
              From the vibrant city center to stunning beaches and vineyards, having your own vehicle gives you the flexibility to discover Auckland's attractions without being constrained by public transport schedules.
            </p>
            <p>
              Our Auckland Airport branch offers convenient vehicle pickup and drop-off, making it easy to start your journey as soon as you arrive in New Zealand.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Popular Destinations Around Auckland</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Auckland City</span> - Explore New Zealand's largest city (25 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Waiheke Island</span> - Visit the beautiful wine island via ferry from downtown (30 min to ferry terminal)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Piha Beach</span> - Experience the rugged west coast black sand beach (50 min drive)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Hobbiton Movie Set</span> - Tour the famous Lord of the Rings filming location (2 hr drive)
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Why Choose James Blond */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Why Choose James Blond for Your Auckland Airport Car Rental</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Car className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Airport Convenience</h3>
              </div>
              <p className="text-center">
                Easy pickup and drop-off at our Auckland Airport location, just minutes from the terminal.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                </div>
                <h3 className="text-xl font-semibold">Competitive Pricing</h3>
              </div>
              <p className="text-center">
                We offer transparent pricing with no hidden fees or surprise charges.
              </p>
              <div className="mt-4 text-center">
                <Button variant="link" asChild>
                  <Link to="/hot-deals/mobil-fuel-discount">Fuel Discount</Link>
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
                Our friendly team is always available to assist you with any queries or issues.
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
            Book your rental car today and enjoy the freedom to discover Auckland and beyond at your own pace.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/vehicles?pickupLocation=7&dropoffLocation=7">View Our Vehicle Range</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:0800525663">Call Us: 0800 525 663</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarRentalAucklandAirport;
