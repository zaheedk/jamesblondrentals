
const AirportAuckland = () => (
  <div className="space-y-6">
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Auckland Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Our Auckland Airport car rentals depot is conveniently located just 5 minutes from Auckland International Airport. We provide a complimentary shuttle service for all our customers between the airport and our rental depot.
          </p>
          <p className="text-gray-600 mb-4">
            We offer a wide range of modern, reliable rental vehicles at competitive rates with exceptional service. Every rental comes with unlimited kilometres and 24/7 AA Roadside Assistance for your peace of mind.
          </p>
          <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
          <p className="text-gray-600">Monday to Sunday: 7:30am - 6:00pm</p>
          <p className="text-gray-600 italic mt-2">After hours service available on request</p>
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
            alt="Auckland Airport Location" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Free Shuttle Service</h3>
      <p className="text-gray-600 mb-4">
        To arrange your complimentary shuttle pickup, please call us on arrival at Auckland Airport. Our friendly driver will collect you from the following locations:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>International Terminal: Outside Door 8 (Arrivals Level)</li>
        <li>Domestic Terminal: Outside the Arrivals area</li>
      </ul>
    </section>
  </div>
);

export default AirportAuckland;
