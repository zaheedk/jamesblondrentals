import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Truck, Caravan } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import PageSEO from '@/components/PageSEO';

const ContactHamilton = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageSEO
        title="Contact Hamilton – James Blond Rentals"
        description="Contact our Hamilton branch for car, van and truck rentals. Find our address, phone number, opening hours and directions."
        canonical="/contact/hamilton"
      />
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
