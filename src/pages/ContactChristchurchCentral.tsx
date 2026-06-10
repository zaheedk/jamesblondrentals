
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';


const ContactChristchurchCentral = () => {
  return (
    <div className="container mx-auto px-4 py-12">
    <PageSEO title="Contact Christchurch Central – James Blond Rentals" description="Contact our Christchurch Central branch for convenient city vehicle hire. Address, phone and opening hours available." canonical="/contact/christchurch-central" />
    <JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://jamesblond.co.nz/"},{"@type":"ListItem","position":2,"name":"Contact Us","item":"https://jamesblond.co.nz/contact"},{"@type":"ListItem","position":3,"name":"Christchurch Central Branch","item":"https://jamesblond.co.nz/contact/christchurch-central"}]}} />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — Christchurch Central",
        url: "https://jamesblond.co.nz/contact/christchurch-central",
        telephone: "+64800525663",
        email: "christchurch@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "515 Moorhouse Avenue",
          addressLocality: "Waltham",
          addressRegion: "Christchurch",
          postalCode: "8011",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-43.5400",
          longitude: "172.6478",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "Christchurch",
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
              text: "Yes — after-hours pick up and drop off are available on request. Contact our Christchurch Central branch on 0800 525 663 to arrange this in advance.",
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
    <JsonLd data={bookingHowTo("https://jamesblond.co.nz/contact/christchurch-central")} />
    <JsonLd data={pickupHowTo({ pageUrl: "https://jamesblond.co.nz/contact/christchurch-central", locationName: "Christchurch Central", address: "515 Moorhouse Avenue, Waltham, Christchurch", isAirport: false })} />
      <h1 className="text-4xl font-bold mb-8 text-center">Christchurch Central Branch</h1>
      
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
                  <p>515 Moorhouse Avenue</p>
                  <p>Waltham</p>
                  <p>Christchurch 8011</p>
                  <p>New Zealand</p>
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
                  <a href="mailto:christchurch@jamesblond.co.nz" className="hover:text-primary">
                    christchurch@jamesblond.co.nz
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
                    James Blond Christchurch
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
              <div className="mt-4 text-sm text-muted-foreground">
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891.5!2d172.6478!3d-43.5400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d318a3a8b7b1b1b%3A0x1!2s515%20Moorhouse%20Avenue%2C%20Waltham%2C%20Christchurch%208011!5e0!3m2!1sen!2snz"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="James Blond Christchurch Central Location"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactChristchurchCentral;
