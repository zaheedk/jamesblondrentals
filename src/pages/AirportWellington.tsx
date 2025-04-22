
const AirportWellington = () => (
  <div className="space-y-6">
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Wellington Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Our Wellington Airport car rental location offers convenient access to both the airport and city center. We provide complimentary pickup and drop-off services for all our customers.
          </p>
          <p className="text-gray-600 mb-4">
            We offer a diverse range of vehicles to suit your needs, from compact cars to SUVs. All rentals include unlimited kilometres and standard insurance coverage.
          </p>
          <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
          <p className="text-gray-600">Monday to Sunday: 8:00am - 5:30pm</p>
          <p className="text-gray-600 italic mt-2">After hours service available on request</p>
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
            alt="Wellington Airport Location" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Shuttle Service</h3>
      <p className="text-gray-600 mb-4">
        Our courtesy shuttle operates throughout our business hours. To arrange pickup, please call us once you've collected your luggage:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>Main Terminal: Outside the arrivals area</li>
        <li>Look for our branded shuttle van</li>
      </ul>
    </section>
  </div>
);

export default AirportWellington;
