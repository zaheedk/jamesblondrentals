import React from 'react';
import { MapIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import FuelStationsMapChristchurch from '../components/FuelStationsMapChristchurch';

const AirportChristchurch = () => (
  <div className="container mx-auto px-4 py-8 space-y-6">
    <Helmet>
      <title>Christchurch Airport Car Rental | James Blond Rentals</title>
      <meta name="description" content="Rent a car at Christchurch Airport with James Blond Rentals. Free shuttle service, affordable rates and a wide range of vehicles." />
    </Helmet>
    <section className="mb-8">
      <div className="text-center bg-secondary p-4 rounded-lg mb-6">
        <p className="text-lg font-bold">
          Need a Shuttle? Call James Blond on <a href="tel:0800247727" className="text-primary hover:underline">0800 24 77 27</a> or <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a> to organise your pick up
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Christchurch Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Flying into Christchurch and need a convenient, reliable rental? James Blond Rentals at Christchurch Airport has you covered. Located just minutes from the terminal at 17/25 Logistics Drive, Harewood, we provide an easy, stress-free rental experience with shuttle service to and from the airport.
          </p>
          <p className="text-gray-600 mb-4">
            Whether you're travelling for business or adventure, our wide selection of rental vehicles – from cars and SUVs to vans, trucks, and trailers – ensures we've got the perfect fit for your trip.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Address:</p>
            <p className="text-gray-600">17/25 Logistics Drive, Harewood</p>
            <p className="text-gray-600 mb-2">Christchurch 8544, New Zealand</p>
            <p className="text-gray-600">Phone: <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a></p>
            <p className="text-gray-600">Email: <a href="mailto:info@jamesblond.co.nz" className="text-primary hover:underline">info@jamesblond.co.nz</a></p>
          </div>
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
            alt="Christchurch Airport Location" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Shuttle Service</h3>
      <p className="text-gray-600 mb-4">
        The GREEN MOTION - Christchurch Airport car hire location is located out of the airport. Our team is ready to pick you up when you arrive.
      </p>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Pickup Instructions:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>After collecting your bags, dial 'M1' on the Airport freephone (located on a pillar at the exit from international arrivals)</li>
            <li>Or call <a href="tel:0800247727" className="text-primary hover:underline">0800 24 77 27</a> or <a href="tel:0800468468" className="text-primary hover:underline">0800 468 468</a></li>
            <li>Wait for collection at Domestic arrivals at "Door-1 or Door-2"</li>
            <li>Take the Airpark shuttle service to the Green Motion location</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Drop-Off Instructions:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Return your vehicle to 17/25 Logistics Drive, Harewood</li>
            <li>After a quick check, we'll shuttle you directly to your terminal</li>
            <li>For early or after-hours returns, follow the signage to our drop-off box and contact our shuttle team</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h2 className="text-2xl font-bold mb-4">Fuel Up Nearby</h2>
      <div className="mb-6">
        <FuelStationsMapChristchurch />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Allied Fuel</h3>
          <p className="text-gray-600">75 Orchard Road, Christchurch Airport</p>
          <a 
            href="https://www.google.com/maps?q=75+Orchard+Road+Christchurch+Airport" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-primary hover:underline"
          >
            <MapIcon className="w-4 h-4 mr-1" />
            View on map
          </a>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">BP</h3>
          <p className="text-gray-600">661 Russley Road, Harewood</p>
          <a 
            href="https://www.google.com/maps?q=661+Russley+Road+Harewood+Christchurch" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-primary hover:underline"
          >
            <MapIcon className="w-4 h-4 mr-1" />
            View on map
          </a>
        </div>
      </div>
    </section>
  </div>
);

export default AirportChristchurch;
