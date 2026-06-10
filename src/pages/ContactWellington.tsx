
import React from 'react';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';


const ContactWellington = () => {
  return (
    <div className="container mx-auto px-4 py-12">
    <PageSEO title="Contact Wellington – James Blond Rentals" description="Contact our Wellington branch for car, van and truck rentals. Find our address, phone number, opening hours and directions." canonical="/contact/wellington" />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — Wellington",
        image: "https://jamesblond.co.nz/lovable-uploads/cccdce30-4e44-423f-8a01-6db19d07e8fd.png",
        url: "https://jamesblond.co.nz/contact/wellington",
        telephone: "+64800525663",
        email: "wellington@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "24 Abel Smith Street",
          addressLocality: "Te Aro",
          addressRegion: "Wellington",
          postalCode: "6011",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-41.2335",
          longitude: "174.9044",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "Wellington",
        },
      }}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What do I need to bring when collecting my rental vehicle?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You need a full, valid driver's licence (in English or with an approved translation) and a credit or debit card for the bond. Prepaid cards are not accepted.",
            },
          },
          {
            "@type": "Question",
            name: "What is the minimum age to rent a vehicle?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You must be at least 21 years old to rent a vehicle with James Blond Rentals. Additional ID may be requested at pickup.",
            },
          },
          {
            "@type": "Question",
            name: "Can I pick up or drop off my rental outside opening hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — after-hours pick up and drop off are available on request. Contact our Wellington branch on 0800 525 663 to arrange this in advance.",
            },
          },
          {
            "@type": "Question",
            name: "Is insurance included in the rental price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Basic cover is included, and you can upgrade to Premium or Ultimate cover at checkout for reduced excess and extra protection.",
            },
          },
          {
            "@type": "Question",
            name: "Do you require a bond or security deposit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, a pre-authorisation hold is placed on your card at pickup. The amount varies by vehicle type and insurance option selected.",
            },
          },
        ],
      }}
    />
    <JsonLd data={bookingHowTo("https://jamesblond.co.nz/contact/wellington")} />
    <JsonLd data={pickupHowTo({ pageUrl: "https://jamesblond.co.nz/contact/wellington", locationName: "Wellington", address: "24 Abel Smith Street, Te Aro, Wellington", isAirport: false })} />
      <h1 className="text-4xl font-bold mb-8 text-center">Wellington Branch</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Address:</p>
                  <p>24 Abel Smith Street</p>
                  <p>Te Aro</p>
                  <p>Wellington 6011</p>
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
                  <a href="mailto:wellington@jamesblond.co.nz" className="hover:text-primary">
                    wellington@jamesblond.co.nz
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
                    James Blond Wellington
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Opening Hours</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Monday - Saturday:</span>
                <span>8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sunday:</span>
                <span>8:00 AM - 5:00 PM</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>After hours pick up and drop off available on request</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto mb-12">
        <ContactForm />
      </div>

      {/* Map */}
      <div className="mt-12 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Location</h2>
            <div className="aspect-video">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.048034246072!2d174.90435287674043!3d-41.23354017131868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d38abe0ba3b16a5%3A0x8e5b3b5c2fec3821!2s24%20Abel%20Smith%20St%2C%20Te%20Aro%2C%20Wellington%206011!5e0!3m2!1sen!2snz!4v1682305436010!5m2!1sen!2snz"
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

export default ContactWellington;
