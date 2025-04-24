
import React from 'react';
import { Globe, Users, Award, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => (
  <div className="container mx-auto px-4 py-12 space-y-16">
    {/* Hero Section */}
    <section className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About James Blond Car and Truck Rental</h1>
      <p className="text-xl text-gray-600">
        Established in 2004, James Blond Rentals has evolved into one of the leading car rental companies, 
        known for its commitment to excellence and customer satisfaction.
      </p>
    </section>

    {/* Stats Section */}
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Since 2004</h3>
          <p className="text-gray-600">Years of Excellence</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">100,000+</h3>
          <p className="text-gray-600">Satisfied Customers</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Premium</h3>
          <p className="text-gray-600">Vehicle Selection</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">3</h3>
          <p className="text-gray-600">NZ Locations</p>
        </CardContent>
      </Card>
    </section>

    {/* Main Content */}
    <section className="max-w-4xl mx-auto space-y-8">
      <div className="prose max-w-none">
        <p className="text-gray-600 leading-relaxed">
          With a client base exceeding 100,000 satisfied customers, James Blond Rentals offers a diverse 
          and expansive fleet, including premium vehicles and executive-class options to cater to 
          discerning travelers.
        </p>
        
        <p className="text-gray-600 leading-relaxed">
          Whether you're seeking an affordable rental or a luxurious driving experience, James Blond 
          Rentals ensures you'll find the perfect vehicle for your needs. With convenient locations, 
          including service from both domestic and international terminals at Auckland Airport, the 
          company provides seamless access to top-quality rental options.
        </p>

        <p className="text-gray-600 leading-relaxed">
          James Blond Rentals is dedicated to delivering the very best in commercial and car rental 
          experiences, combining global reach with unparalleled quality and service.
        </p>
      </div>
    </section>

    {/* Vehicle Options */}
    <section className="bg-gray-50 rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Vehicle Range</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Group Travel Solutions</h3>
          <p className="text-gray-600 mb-4">
            For larger groups, we offer 10-seater and 12-seater minivan rentals, perfect for family 
            trips, group vacations, or business events. Our 7-seater and 8-seater options provide 
            the perfect balance for smaller groups needing extra space.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Eco-Friendly Options</h3>
          <p className="text-gray-600 mb-4">
            Our hybrid cars combine fuel efficiency with lower emissions, perfect for eco-conscious 
            drivers. We also offer SUVs for those seeking both power and space, ideal for any terrain 
            or adventure.
          </p>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-primary text-white rounded-lg p-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
      <p className="text-xl mb-8">Find the perfect vehicle for your next adventure.</p>
      <a 
        href="/fleet" 
        className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        View Our Fleet
      </a>
    </section>
  </div>
);

export default About;
