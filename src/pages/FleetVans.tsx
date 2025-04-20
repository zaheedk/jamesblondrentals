
import { Car, Truck, Van } from "lucide-react";

const vans = [
  {
    title: "Toyota Hiace Van (Petrol)",
    img: "/images/vans/toyota-hiace-petrol.jpg", // Placeholder, should upload or adjust as received
    description: "Perfect for shifting, deliveries or business trips. 6.2 cubic metre cargo space. Petrol auto, 3 seat belts, reversing camera.",
    features: [
      "Automatic, petrol",
      "3 seats",
      "Reversing camera",
      "Cargo capacity: 6.2m³"
    ]
  },
  {
    title: "Toyota Hiace ZX Jumbo (Diesel)",
    img: "/images/vans/toyota-hiace-jumbo.jpg", // Placeholder
    description: "The long wheelbase jumbo! Even more space for bulky loads and big jobs. Diesel auto, 3 seat belts, reversing camera & sensors.",
    features: [
      "Automatic, diesel",
      "3 seats",
      "Reversing camera & sensors",
      "Cargo capacity: 9.3m³"
    ]
  },
  {
    title: "Toyota Hiace ZL 12-Seater Minibus",
    img: "/images/vans/toyota-hiace-12seater.jpg", // Placeholder
    description: "Safe, comfortable transport for your team or group. 12 seats, automatic, reversing camera and air conditioning.",
    features: [
      "Automatic",
      "12 seats",
      "Reversing camera",
      "Air conditioning"
    ]
  },
  {
    title: "Toyota Hilux SR5 2WD Utility",
    img: "/images/vans/toyota-hilux-ute.jpg", // Placeholder
    description: "Legendary Hilux utility, ready for worksites or adventuring. 2WD, flat deck, automatic, 3 seat belts.",
    features: [
      "Automatic, petrol",
      "3 seats",
      "Flat deck",
      "Tow bar"
    ]
  },
];

const inclusions = [
  "GST (tax), insurance and standard mileage included.",
  "Unlimited kilometres on multi-day hires.",
  "One day minimum hire period.",
  "AA 24hr roadside assistance.",
  "Bluetooth, air conditioning & USB.",
  "FREE parking for your car at our yard."
];

const FleetVans = () => (
  <div className="container mx-auto px-4 py-10 max-w-6xl">
    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">Vans & Utes for Hire</h1>
    <p className="text-lg text-gray-700 mb-4">
      Perfect for moving house, trade jobs, sports teams or group outings. Book online or <span className="text-primary font-semibold">call us to reserve!</span>
    </p>
    <div className="bg-primary/10 rounded-lg p-5 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Why Hire from James Blond?</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-base">
            {inclusions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="https://jamesblond.co.nz/wp-content/uploads/2019/03/james-blond-vans-1.jpg"
            alt="Selection of Vans"
            className="rounded-lg shadow-lg max-w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {vans.map((van, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 flex flex-col">
          <img
            src={van.img}
            alt={van.title}
            className="w-full h-56 object-cover rounded-t-xl"
            onError={e => { e.currentTarget.src='/placeholder.svg'; }}
            loading="lazy"
          />
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Van className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{van.title}</h3>
            </div>
            <p className="text-gray-700 mb-2 flex-1">{van.description}</p>
            <ul className="list-disc list-inside text-gray-500 text-sm mb-4 space-y-0">
              {van.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <a
              href="/booking"
              className="inline-block mt-auto bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 text-center"
            >
              Book Now
            </a>
          </div>
        </div>
      ))}
    </section>

    <div className="my-12 bg-white rounded-xl shadow p-6 md:p-8 border border-primary/30">
      <h2 className="text-2xl font-semibold mb-2 text-primary">FAQ: Van & Ute Hire</h2>
      <p className="text-gray-600 text-base mb-2">
        Check our <a href="/faq" className="text-primary underline hover:no-underline">FAQ page</a> for details about hiring, insurance, payments and more.
      </p>
      <p className="text-gray-600 text-base mb-2">
        Full licence required to hire and drive any James Blond van or ute.
      </p>
      <p className="text-gray-600 text-base">
        We offer short and long-term hire. Corporate and tradie clients welcome!
      </p>
    </div>
  </div>
);

export default FleetVans;
