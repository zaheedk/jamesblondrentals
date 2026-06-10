import React from 'react';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';


const ContactAucklandAirport = () => {
  return (
    <div className="container mx-auto px-4 py-12">
    <PageSEO title="Contact Auckland Airport – James Blond Rentals" description="Contact our Auckland Airport branch for vehicle pickup and drop-off. Get directions, phone number and opening hours." canonical="/contact/auckland-airport" />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — Auckland Airport",
        image: "https://jamesblond.co.nz/lovable-uploads/6a274083-edb0-4ac2-8e40-4ac3703a8660.png",
        url: "https://jamesblond.co.nz/contact/auckland-airport",
        telephone: "+64800525663",
        email: "info@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "203 Kirkbride Road",
          addressLocality: "Mangere",
          addressRegion: "Auckland",
          postalCode: "2022",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-36.9785",
          longitude: "174.7855",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "Auckland",
        },
      }}
    />
      <h1 className="text-4xl font-bold mb-8 text-center">Auckland Airport Branch</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Address:</p>
                  <p>203 Kirkbride Road</p>
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
              
              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Facebook:</p>
                  <a 
                    href="https://www.facebook.com/jamesblondrentals" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary"
                  >
                    James Blond Auckland
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Opening Hours</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Monday - Sunday:</span>
                <span>8:00 AM - 5:00 PM</span>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>After hours pick up and drop off available on request</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <ContactForm />
      </div>

      <div className="mt-12 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Location</h2>
            <div className="aspect-video">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.1!2d174.7855!3d-36.9785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d4fb1c5b1b1b1%3A0x1b1b1b1b1b1b1b1b!2s203%20Kirkbride%20Rd%2C%20M%C4%81ngere%2C%20Auckland%202022!5e0!3m2!1sen!2snz!4v1682305436010!5m2!1sen!2snz"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactAucklandAirport;
