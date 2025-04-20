
import { Truck } from "lucide-react";

const vans = [
  {
    title: "Toyota Hiace Van (Petrol, New Shape)",
    img: "/images/fleet/vans/toyota-hiace-new-shape-petrol.jpg",
    description:
      "The latest Toyota Hiace petrol auto van – famous for reliability and easy driving. Perfect for moving flat, furniture, business deliveries or day trips.",
    specs: [
      "Automatic transmission, petrol",
      "3 seats",
      "6.2m³ cargo space (L 2.53m x W 1.77m x H 1.28m)",
      "Reversing camera",
      "Cruise control",
    ],
  },
  {
    title: "Toyota Hiace ZX Jumbo (Diesel)",
    img: "/images/fleet/vans/toyota-hiace-jumbo-diesel.jpg",
    description:
      "Need even more space? The long wheelbase Hiace Jumbo has room for all your gear, with 9.3 cubic metres of cargo space. Diesel auto, perfect for bulky deliveries.",
    specs: [
      "Automatic transmission, diesel",
      "3 seats",
      "9.3m³ cargo space (L 2.93m x W 1.70m x H 1.85m)",
      "Reversing camera & sensors",
      "Cruise control",
    ],
  },
  {
    title: "Toyota Hiace ZL 12-Seater Minibus",
    img: "/images/fleet/vans/toyota-hiace-12-seater-minibus.jpg",
    description:
      "Comfortable and safe transport for teams, groups or larger families. 12 seats with lap-sash seatbelts, automatic, air con and reversing camera.",
    specs: [
      "Automatic transmission, petrol",
      "12 seats (lap-sash seatbelts)",
      "Reversing camera",
      "Air conditioning",
      "Luggage storage",
    ],
  },
  {
    title: "Toyota Hilux SR5 2WD Ute (Flat Deck)",
    img: "/images/fleet/vans/toyota-hilux-sr5-ute.jpg",
    description:
      "Legendary Hilux ute with wide flat deck for worksites, tradies or weekend projects. Room for building supplies or large items.",
    specs: [
      "Automatic, petrol",
      "3 seats",
      "Flat deck (L 2.38m x W 1.77m)",
      "Towbar",
      "Bluetooth & USB",
    ],
  },
];

const inclusions = [
  "GST (tax), insurance and standard mileage included.",
  "Unlimited kilometres for multi-day hires.",
  "AA 24hr roadside assistance.",
  "Bluetooth, air conditioning & USB.",
  "FREE parking for your car at our yard.",
  "One day minimum hire period. Minimum renter age is 21 with Full Licence.",
];

const faqs = [
  {
    question: "What licence do I need to drive a van or ute?",
    answer: "A full car licence is required to hire and drive any James Blond van, ute or minibus.",
  },
  {
    question: "Do you allow one way hires?",
    answer: "No, all vans and utes must be returned to our yard in Auckland.",
  },
  {
    question: "Can I tow with your vans or utes?",
    answer: "Our utes are fitted with towbars and suitable for towing. Please contact us if you need to tow with another vehicle.",
  },
  {
    question: "What is included in the hire price?",
    answer: "All prices include GST, insurance, AA roadside cover, standard mileage, and unlimited kilometres on multi-day hires (see terms).",
  },
];

const FleetVans = () => (
  <div className="container mx-auto px-4 py-10 max-w-5xl">
    <h1 className="text-4xl font-bold mb-3 text-primary">Vans & Utes for Hire Auckland</h1>
    <p className="text-lg text-gray-700 mb-6">
      Modern Toyota vans, minibuses and utes – perfect for moving house, deliveries, sports teams, trades or group outings.<br />
      Book online or <span className="text-primary font-semibold">call us to reserve!</span>
    </p>

    <div className="bg-primary/10 rounded-lg mb-10 p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-3 text-primary">Included with All Van and Ute Hires</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-base pl-2">
          {inclusions.map((item, idx) => (
            <li key={idx} className="mb-1">{item}</li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/images/fleet/vans/vans-montage.jpg"
          alt="Selection of Vans and Utes"
          className="rounded-lg shadow-lg w-full max-w-[340px] object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {vans.map((van, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow hover:shadow-xl border border-gray-100 flex flex-col"
        >
          <img
            src={van.img}
            alt={van.title}
            className="w-full h-56 object-cover rounded-t-xl"
            onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
            loading="lazy"
          />
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-xl">{van.title}</h3>
            </div>
            <p className="text-gray-700 mb-2">{van.description}</p>
            <ul className="list-disc list-inside text-gray-600 text-sm mb-4 pl-2">
              {van.specs.map((f, i) => (
                <li key={i} className="mb-1">{f}</li>
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

    <div className="mb-14 bg-white rounded-xl shadow border border-primary/30 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-2 text-primary">Van & Ute Hire Auckland – FAQs</h2>
      <dl className="divide-y divide-gray-200">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4 first:pt-0">
            <dt className="font-semibold text-primary mb-1">{faq.question}</dt>
            <dd className="text-gray-700 pl-2">{faq.answer}</dd>
          </div>
        ))}
      </dl>
      <p className="text-gray-600 text-base mt-4">
        For more info, see our <a href="/faq" className="text-primary underline hover:no-underline">main FAQ page</a>.
      </p>
    </div>
  </div>
);

export default FleetVans;
