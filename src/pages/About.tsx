
import React from 'react';
import { Globe, Users, Award, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => (
  <div className="container mx-auto px-4 py-12 space-y-16">
    {/* Hero Section */}
    <section className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About James Blond Car and Truck Rental</h1>
      <p className="text-xl text-gray-600">
        We are New Zealand's premier car and truck rental company, providing quality vehicles for tourists and locals alike since 1989.
      </p>
    </section>

    {/* Story Section */}
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-gray-600 mb-4">
          James Blond has been providing rental vehicles to New Zealanders and tourists since 1989. 
          Founded on the principles of excellent service and competitive pricing, we've grown into 
          one of Auckland's most trusted vehicle rental companies.
        </p>
        <p className="text-gray-600">
          Our fleet includes a wide range of vehicles from compact cars to trucks, vans, and 
          minibuses. We take pride in maintaining our vehicles to the highest standards and 
          offering competitive rates without compromising on quality or service.
        </p>
      </div>
      <div className="relative h-[400px]">
        <img 
          src="https://jamesblond.co.nz/wp-content/uploads/2023/05/James-Blond-Car-Rentals-Auckland-1-1.png" 
          alt="James Blond Rental Fleet" 
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
    </section>

    {/* Stats Section */}
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">34+ Years</h3>
          <p className="text-gray-600">Of Experience</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">10,000+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">4.8/5</h3>
          <p className="text-gray-600">Customer Rating</p>
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

    {/* Values Section */}
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Customer First</h3>
          <p className="text-gray-600">
            We prioritize your needs and satisfaction, ensuring a seamless rental experience from start to finish.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Quality Service</h3>
          <p className="text-gray-600">
            Our well-maintained fleet and professional team guarantee reliable service every time.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Competitive Pricing</h3>
          <p className="text-gray-600">
            We offer great value without compromising on the quality of our vehicles or service.
          </p>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-primary text-white rounded-lg p-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
      <p className="text-xl mb-8">Experience the James Blond difference today.</p>
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
