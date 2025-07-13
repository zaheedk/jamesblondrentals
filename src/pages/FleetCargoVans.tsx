import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Package, Shield, MapPin, Clock, Users, Wrench } from 'lucide-react';

const FleetCargoVans = () => {
  useEffect(() => {
    document.title = "Cargo Van Hire Auckland & Wellington - James Blond Rentals";
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Cargo Van Rentals Auckland - Moving Made Easy</h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover our premium fleet of cargo vans perfect for moving, deliveries, and commercial transport. 
            From standard vans to high roof jumbo options, we have the right cargo van for your needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/vehicles?category=van">Book Your Cargo Van</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/price-guide">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Van Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Cargo Van Fleet</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Standard Van */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <img 
                src="/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png" 
                alt="Standard Cargo Van for Moving and Deliveries" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-3">Standard Cargo Van</h3>
              <p className="text-gray-600 mb-4">
                Perfect for small to medium moving jobs, furniture transport, and commercial deliveries. 
                Reliable and fuel-efficient cargo van ideal for Auckland city driving.
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Load space: 2000(L) x 1400(W) x 1300(H)</li>
                <li>• Payload: Up to 1000kg</li>
                <li>• Perfect for apartment moves</li>
                <li>• Easy to drive and park</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fleet/vans/standard-van">View Details</Link>
              </Button>
            </CardContent>
          </Card>

          {/* High Roof Van */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <img 
                src="/lovable-uploads/3cb301ec-ead2-492a-a9a0-3361c1876b76.png" 
                alt="High Roof Cargo Van for Large Items" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-3">High Roof Cargo Van</h3>
              <p className="text-gray-600 mb-4">
                Enhanced cargo space with high roof design. Ideal for moving tall furniture, 
                appliances, and bulky items that require extra vertical clearance.
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• High roof for maximum height</li>
                <li>• Perfect for wardrobes and tall items</li>
                <li>• Professional moving solution</li>
                <li>• Rear and side door access</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fleet/vans/premium-van">View Details</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Jumbo Van */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <img 
                src="/lovable-uploads/6dde201c-13f3-4671-9e88-6cc1a388d647.png" 
                alt="Jumbo Cargo Van for Large Moving Jobs" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-3">Jumbo Cargo Van</h3>
              <p className="text-gray-600 mb-4">
                Our largest cargo van option with maximum storage capacity. Perfect for house moves, 
                commercial relocations, and transporting large volumes of goods.
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• Load space: 3400(L) x 1700(W) x 1700(H)</li>
                <li>• Maximum cargo capacity</li>
                <li>• Ideal for house moves</li>
                <li>• Professional grade reliability</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/fleet/vans/jumbo-van">View Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Our Cargo Vans */}
      <section className="mb-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose James Blond Cargo Vans?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Fully Insured</h3>
            <p className="text-gray-600">All our cargo vans come with comprehensive insurance coverage for your peace of mind.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Well Maintained</h3>
            <p className="text-gray-600">Regular servicing and maintenance ensure reliable performance for your moving needs.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Flexible Rental</h3>
            <p className="text-gray-600">Hourly, daily, weekly or monthly cargo van hire options to suit your schedule.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Multiple Locations</h3>
            <p className="text-gray-600">Convenient pickup locations across Auckland including airport and city branches.</p>
          </div>
        </div>
      </section>

      {/* Moving Solutions */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Perfect Cargo Van Solutions for Every Move</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Residential Moving</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Package className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold">Apartment & Small Home Moves</h4>
                  <p className="text-gray-600">Our standard cargo vans are perfect for studio, one or two-bedroom apartment relocations.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold">Family Home Moving</h4>
                  <p className="text-gray-600">High roof and jumbo vans handle large furniture, appliances, and complete household moves.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold">Student Relocations</h4>
                  <p className="text-gray-600">Affordable cargo van hire for university students moving between accommodations.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">Commercial Transport</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Truck className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold">Delivery Services</h4>
                  <p className="text-gray-600">Reliable cargo vans for courier services, e-commerce deliveries, and logistics operations.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold">Office Relocations</h4>
                  <p className="text-gray-600">Professional moving solutions for office furniture, equipment, and document transport.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold">Trade & Construction</h4>
                  <p className="text-gray-600">Secure cargo space for tools, materials, and equipment transport to job sites.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auckland Areas Served */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Cargo Van Hire Across Auckland</h2>
        
        <div className="bg-primary/5 rounded-lg p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-xl mb-4">Central Auckland</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Auckland CBD cargo van rental</li>
                <li>• Ponsonby and Grey Lynn moves</li>
                <li>• Parnell office relocations</li>
                <li>• Newmarket commercial transport</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">West Auckland</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Henderson cargo van hire</li>
                <li>• New Lynn moving services</li>
                <li>• Titirangi residential moves</li>
                <li>• Kumeu and Huapai relocations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">Airport & South</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Auckland Airport van pickup</li>
                <li>• Mangere commercial transport</li>
                <li>• Manukau moving solutions</li>
                <li>• Botany Downs relocations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Tips */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Essential Moving Tips for Cargo Van Rentals</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Before Your Move</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Measure large furniture to ensure it fits in your chosen cargo van</li>
                <li>• Book moving supplies: blankets, straps, and trolleys</li>
                <li>• Plan your route and check parking restrictions</li>
                <li>• Pack heavy items in small boxes to prevent damage</li>
                <li>• Label boxes clearly for efficient unloading</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Loading Your Cargo Van</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Load heavy items first, placing them against the front wall</li>
                <li>• Use moving blankets to protect furniture surfaces</li>
                <li>• Secure all items with tie-down straps</li>
                <li>• Fill gaps with soft items to prevent movement</li>
                <li>• Keep the load balanced for safe driving</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary p-8 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Cargo Van?</h2>
        <p className="text-xl mb-8">
          Get moving with Auckland's most trusted cargo van rental company. 
          Professional service, competitive rates, and reliable vehicles.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/vehicles?category=van">Book Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
            <Link to="/contact/auckland">Get Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FleetCargoVans;
