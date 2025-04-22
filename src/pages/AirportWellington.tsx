
import React from 'react';

const AirportWellington = () => (
  <div className="space-y-6">
    <section className="mb-8">
      <div className="text-center bg-secondary p-4 rounded-lg mb-6">
        <p className="text-lg font-bold">
          Need a shuttle? Call Windy Depot on <a href="tel:0278374372" className="text-primary hover:underline">027 837 4372</a> to organize your pickup
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Wellington Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Touching down in Wellington and need a ride you can count on? James Blond Rentals at Wellington Airport offers convenient, airport-close car and commercial vehicle hire. Our pickup location at 19 Shelly Bay Road, Miramar makes it quick and easy to get on the road right after landing.
          </p>
          <p className="text-gray-600 mb-4">
            We provide a full fleet of well-maintained vehicles including cars, SUVs, vans, minibuses, and trailers – all backed by our excellent service and 24/7 shuttle support.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Address:</p>
            <p className="text-gray-600">19 Shelly Bay Road, Miramar</p>
            <p className="text-gray-600 mb-2">Wellington 6022, New Zealand</p>
            <p className="text-gray-600">Phone: <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a></p>
            <p className="text-gray-600">Email: <a href="mailto:info@jamesblond.co.nz" className="text-primary hover:underline">info@jamesblond.co.nz</a></p>
          </div>
        </div>
        <div>
          <img 
            src="/lovable-uploads/cccdce30-4e44-423f-8a01-6db19d07e8fd.png" 
            alt="Wellington Airport Interior" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Shuttle Service</h3>
      <p className="text-gray-600 mb-4">
        Available 24/7 for stress-free transfers to and from the terminal. Our dedicated shuttle service ensures you can get to your rental vehicle with ease, no matter when your flight arrives.
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>24/7 pickup service available</li>
        <li>Complimentary shuttle transfers</li>
        <li>Fast and convenient service</li>
        <li>Call Windy Depot on <a href="tel:0278374372" className="text-primary hover:underline">027 837 4372</a> to organize shuttle pickup</li>
      </ul>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">What You'll Need on Arrival</h3>
      <p className="text-gray-600 mb-4">
        Please ensure you bring the following with you when collecting your rental:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>
          <span className="font-semibold">🪪 Full Driver's Licence</span> – Must be a full and valid licence, in English or accompanied by an approved translation.
        </li>
        <li>
          <span className="font-semibold">💳 Credit or Debit Card</span> – Required for bond and payment. Prepaid cards are not accepted.
        </li>
      </ul>
      <p className="text-gray-600 mt-4">
        You must be at least 21 years old to rent a vehicle. Additional ID may be requested.
      </p>
    </section>
  </div>
);

export default AirportWellington;
