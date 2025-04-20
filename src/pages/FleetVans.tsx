import { Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const vans = [
  {
    id: "hiace-petrol",
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
    id: "hiace-jumbo",
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
    id: "hilux-ute",
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
  <div className="container mx-auto px-4 py-10 max-w-6xl">
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-3 text-primary">Vans & Utes for Hire Auckland</h1>
      <p className="text-lg text-gray-700 mb-2">
        Modern Toyota vans, minibuses and utes – perfect for moving house, deliveries, sports teams, trades or group outings.
      </p>
      <p className="text-lg text-gray-700 mb-6">
        Book online or <span className="text-primary font-semibold">call us at 0800 52 52 52</span> to reserve!
      </p>
    </div>

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

    <h2 className="text-3xl font-bold mb-6 text-primary">Our Van & Ute Fleet</h2>
    
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {vans.map((van) => (
        <Card key={van.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-64 overflow-hidden">
            <img
              src={van.img}
              alt={van.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
              loading="lazy"
            />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">{van.title}</CardTitle>
            </div>
            <CardDescription className="text-base text-gray-700">{van.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2 text-primary">Vehicle Features:</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm pl-2">
              {van.specs.map((spec, i) => (
                <li key={i} className="mb-1">{spec}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link to={`/fleet/vans/${van.id}`}>Know More</Link>
            </Button>
            <Button asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>

    <section className="mb-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">Moving House or Office?</h2>
      <div className="bg-secondary/20 p-6 rounded-lg">
        <p className="text-lg mb-4">
          Our vans and utes are perfect for moving house or small office relocations. Save money by doing it yourself with a reliable, spacious vehicle.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/booking">Book a Van</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/fleet/furniture-truck">Need Something Bigger?</Link>
          </Button>
        </div>
      </div>
    </section>

    <div className="mb-14 bg-white rounded-xl shadow border border-primary/30 p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">Van & Ute Hire Auckland – FAQs</h2>
      <dl className="divide-y divide-gray-200">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4 first:pt-0">
            <dt className="font-semibold text-primary mb-1 text-lg">{faq.question}</dt>
            <dd className="text-gray-700 pl-2">{faq.answer}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-base mb-4">
          For more information about our van and ute hire options, see our <Link to="/faq" className="text-primary underline hover:no-underline">main FAQ page</Link>.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/booking">Book Online Now</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="tel:0800525252">Call Us: 0800 52 52 52</a>
          </Button>
        </div>
      </div>
    </div>

    <section className="text-center mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Need a Different Vehicle?</h2>
      <p className="mb-6">Browse our other vehicle categories:</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild variant="outline">
          <Link to="/fleet/cars">Cars</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/fleet/trucks">Trucks</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/fleet/minibuses">Minibuses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/fleet/trailers">Trailers</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default FleetVans;
