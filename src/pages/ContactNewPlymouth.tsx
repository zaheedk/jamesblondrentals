import React from 'react';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';

const ContactNewPlymouth = () => {
  return (
    <div className="container mx-auto px-4 py-12">
    <PageSEO
      title="Contact New Plymouth – James Blond Rentals"
      description="Contact our New Plymouth Airport branch for car, van and truck rentals in Taranaki. Find our phone number, opening hours and directions."
      canonical="/contact/new-plymouth"
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — New Plymouth Airport",
        url: "https://www.jamesblond.co.nz/contact/new-plymouth",
        telephone: "+64800525663",
        email: "info@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "192 Airport Drive",
          addressLocality: "Bell Block",
          addressRegion: "Taranaki",
          addressCountry: "NZ",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "New Plymouth",
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
            name: "What is the minimum age to rent a vehicle at New Plymouth Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You must be at least 23 years old to rent a vehicle from our New Plymouth Airport branch. Additional ID may be requested at pickup.",
            },
          },
          {
            "@type": "Question",
            name: "Can I pick up or drop off my rental outside opening hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — after-hours pick up and unattended drop off are available at New Plymouth Airport. Contact us on 0800 525 663 to arrange this in advance.",
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
    <JsonLd data={bookingHowTo("https://www.jamesblond.co.nz/contact/new-plymouth")} />
    <JsonLd data={pickupHowTo({ pageUrl: "https://www.jamesblond.co.nz/contact/new-plymouth", locationName: "New Plymouth Airport", address: "192 Airport Drive, Bell Block, New Plymouth", isAirport: true })} />
      <h1 className="text-4xl font-bold mb-8 text-center">New Plymouth Airport Branch</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Our Taranaki branch at New Plymouth Airport, with cars, vans and trucks for the coast, the mountain and everything in between.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
        {/* Contact Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-primary" />
                <div>
                  <p className="font-medium">Address:</p>
                  <p>192 Airport Drive</p>
                  <p>Bell Block, New Plymouth</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Phone:</p>
                  <a href="tel:0800525663" className="hover:text-primary">
                    0800 525 663
                  </a>
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
                    James Blond Rentals
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
                <span className="font-medium">Monday - Sunday:</span>
                <span>8:00 AM - 5:00 PM</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>After hours pick up and unattended drop off available on request</p>
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
                title="James Blond Rentals New Plymouth Airport location map"
                src="https://maps.google.com/maps?q=192+Airport+Drive,+Bell+Block,+New+Plymouth,+New+Zealand&z=14&output=embed"
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

export default ContactNewPlymouth;
