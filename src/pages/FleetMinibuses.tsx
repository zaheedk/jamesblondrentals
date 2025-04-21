
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const minibusFeatures = [
  "Automatic transmission",
  "Up to 12 seats (lap-sash seatbelts for safety)",
  "Reverse camera & parking sensors",
  "Air conditioning and heating throughout",
  "Spacious luggage area (behind seats)",
  "Bluetooth stereo & USB charger",
  "Short or long term hire available",
  "Perfect for sports teams, work groups, family events, holidays, and tours",
];

const inclusions = [
  "GST (tax), insurance & AA Roadside Assist included",
  "Unlimited kms for multi-day hires",
  "No hidden charges",
  "Free customer car parking at pick-up",
  "Minimum driver age: 21 years (full licence required)",
];

const reasons = [
  {
    title: "Comfortable & Safe",
    description: "Our Toyota minibuses have modern safety features and comfortable interiors for a pleasant group journey.",
  },
  {
    title: "Easy to Drive",
    description: "Automatic, car licence friendly and a compact design makes city and highway driving easy—even for less experienced drivers.",
  },
  {
    title: "Flexible Hire Terms",
    description: "Competitive daily or long-term rates, with no additional charges for extra drivers or for weekend/weekday hire.",
  },
  {
    title: "Personal Service",
    description: "Friendly, local team ready to help you with quotes or questions about your minibus hire needs.",
  },
];

const faqs = [
  {
    q: "What licence do I need to drive a 12-seater minibus?",
    a: "A standard full car driver licence is all you need to hire and drive our minibuses.",
  },
  {
    q: "Can I drive it out of Auckland or on a ferry?",
    a: "Yes, you're welcome to use the minibus anywhere in New Zealand, including the South Island (please note your itinerary when booking).",
  },
  {
    q: "Is there luggage space?",
    a: "Yes—there is ample cargo space in the rear compartment behind the seats for bags and sports gear.",
  },
  {
    q: "Is insurance included?",
    a: "Yes. Standard insurance is included in the price, with options to reduce excess if you wish.",
  },
];

const MinibusHero = () => (
  <section className="flex flex-col md:flex-row-reverse md:items-center gap-8 mb-12 mt-8 md:mt-12">
    <div className="flex-1 flex items-center justify-center">
      <img
        src="/images/fleet/minibuses/toyota-hiace-minibus.jpg"
        alt="Toyota Hiace Minibus for Hire"
        className="rounded-xl shadow-md w-full max-w-md object-cover border border-primary/20"
        onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
        loading="lazy"
      />
    </div>
    <div className="flex-1">
      <h1 className="text-4xl font-bold text-primary mb-4">Minibus Hire Auckland (12-Seater)</h1>
      <p className="text-lg text-gray-700 mb-4">
        Perfect for group trips, teams, or family events—safe, modern Toyota Hiace 12-seater minibuses. Clean, late model vehicles ready for easy group travel across NZ.
      </p>
      <div className="flex flex-wrap gap-4 mb-2">
        <Button asChild>
          <Link to="/booking">Book Now</Link>
        </Button>
        <Button asChild variant="outline">
          <a href="mailto:info@jamesblond.co.nz?subject=Minibus%20Hire%20Enquiry">Request a Quote</a>
        </Button>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        Or call us: <a href="tel:0800525252" className="underline text-primary">0800 52 52 52</a>
      </div>
    </div>
  </section>
);

const MinibusFeatures = () => (
  <section className="bg-primary/10 rounded-lg p-6 md:p-10 mb-10">
    <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
      <Truck className="w-6 h-6" />
      Minibus Features
    </h2>
    <ul className="list-disc pl-6 space-y-1 text-gray-800">
      {minibusFeatures.map((feature, idx) => (
        <li key={idx}>{feature}</li>
      ))}
    </ul>
  </section>
);

const Inclusions = () => (
  <section className="mb-10">
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary">All Minibus Hires Include</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          {inclusions.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </section>
);

const Reasons = () => (
  <section className="mb-10">
    <h2 className="text-2xl font-bold text-primary mb-6">Why Hire Your Minibus With Us?</h2>
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {reasons.map((reason, idx) => (
        <Card key={idx} className="p-2">
          <CardHeader>
            <CardTitle className="text-lg">{reason.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{reason.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

const MinibusFAQ = () => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-primary">Minibus Hire: Frequently Asked Questions</h2>
    <div className="space-y-6">
      {faqs.map((faq, i) => (
        <div key={i} className="border-l-4 border-primary px-5 py-4 bg-primary/5 rounded-md">
          <dt className="font-semibold text-primary mb-1 text-base">{faq.q}</dt>
          <dd className="text-gray-700">{faq.a}</dd>
        </div>
      ))}
    </div>
  </section>
);

const FleetMinibuses = () => (
  <div className="container mx-auto px-4 py-10 max-w-4xl">
    <MinibusHero />
    <MinibusFeatures />
    <Inclusions />
    <Reasons />
    <MinibusFAQ />
    <div className="text-center mt-8">
      <Button asChild className="mx-2">
        <Link to="/booking">Book Minibus Online</Link>
      </Button>
      <Button asChild variant="outline" className="mx-2">
        <a href="mailto:info@jamesblond.co.nz?subject=Minibus%20Hire%20Enquiry">Request a Quote</a>
      </Button>
    </div>
    <div className="text-center text-sm text-gray-500 mt-4">
      For full terms, see our <Link to="/faq" className="underline text-primary">FAQ page</Link> or contact us anytime.
    </div>
  </div>
);

export default FleetMinibuses;
