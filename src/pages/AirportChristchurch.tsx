
const AirportChristchurch = () => (
  <div className="space-y-6">
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Christchurch Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Our Christchurch Airport car rental depot is located just minutes from Christchurch International Airport. We provide a complimentary shuttle service between the airport and our rental location.
          </p>
          <p className="text-gray-600 mb-4">
            Choose from our extensive fleet of well-maintained vehicles, from economical cars to spacious vans. All rentals include unlimited kilometres and comprehensive insurance options.
          </p>
          <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
          <p className="text-gray-600">Monday to Sunday: 8:00am - 5:00pm</p>
          <p className="text-gray-600 italic mt-2">After hours service available on request</p>
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
            alt="Christchurch Airport Location" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Airport Pickup Service</h3>
      <p className="text-gray-600 mb-4">
        Our shuttle service operates during business hours. Upon arrival, please call our office and we'll arrange immediate pickup from:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>International Terminal: Outside the main exit</li>
        <li>Domestic Terminal: Outside the baggage claim area</li>
      </ul>
    </section>
  </div>
);

export default AirportChristchurch;
