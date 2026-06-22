import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Truck, Caravan, Sofa, Box } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';

const ContactHamilton = () => {
  return (
    <div className="container mx-auto px-4 py-12">
    <PageSEO
      title="Contact Hamilton – James Blond Rentals"
      description="Contact our Hamilton branch for car, van and truck rentals. Find our address, phone number, opening hours and directions."
      canonical="/contact/hamilton"
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — Hamilton",
        url: "https://jamesblond.co.nz/contact/hamilton",
        telephone: "+64800525663",
        email: "info@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "17 Bandon Street",
          addressLocality: "Frankton",
          addressRegion: "Hamilton",
          postalCode: "3204",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-37.7833",
          longitude: "175.2667",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "Hamilton",
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
              text: "Yes — after-hours pick up and drop off are available on request. Contact our Hamilton branch on 0800 525 663 to arrange this in advance.",
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
    <JsonLd data={bookingHowTo("https://jamesblond.co.nz/contact/hamilton")} />
    <JsonLd data={pickupHowTo({ pageUrl: "https://jamesblond.co.nz/contact/hamilton", locationName: "Hamilton", address: "17 Bandon Street, Frankton, Hamilton", isAirport: false })} />
      <h1 className="text-4xl font-bold mb-8 text-center">Hamilton Branch</h1>

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
                  <p>17 Bandon Street</p>
                  <p>Frankton</p>
                  <p>Hamilton 3204</p>
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
                    James Blond Hamilton
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
                <p>After hours pick up and drop off available on request</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hamilton Services */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/hamilton-truck-rentals-hire" className="group">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Hamilton Truck Rentals</h3>
                  <p className="text-sm text-gray-600">Moving trucks & commercial hire from $35/hr</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/hamilton-van-hire" className="group">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Caravan className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Hamilton Van Hire</h3>
                  <p className="text-sm text-gray-600">Cargo vans & 12-seater minibuses from $69/day</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/furniture-truck-hire-hamilton" className="group">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Sofa className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Furniture Truck Hire</h3>
                  <p className="text-sm text-gray-600">Tail-lift trucks for Hamilton home & furniture moves</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/trailer-hire-hamilton" className="group">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Trailer Hire</h3>
                  <p className="text-sm text-gray-600">Cage, luggage & car-transporter trailers in Hamilton</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/moving-truck-hire-hamilton" className="group">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Moving Truck Hire</h3>
                  <p className="text-sm text-gray-600">Same-day house movers from $35/hr in Hamilton</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
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
                title="James Blond Rentals Hamilton location map"
                src="https://maps.google.com/maps?q=17+Bandon+Street,+Frankton,+Hamilton+3204,+New+Zealand&z=15&output=embed"
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

export default ContactHamilton;
