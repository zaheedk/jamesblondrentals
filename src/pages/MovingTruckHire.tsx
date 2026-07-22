import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  Clock,
  PhoneCall,
  MapPin,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TruckQuoteSearchForm from "@/components/home/TruckQuoteSearchForm";
import truckOpenDoors from "@/assets/truck-open-doors-loading-boxes.jpg";
import familyUnpacking from "@/assets/family-unpacking-moving-truck.jpg";

/**
 * Conversion-focused Google Ads landing page for the
 * "moving truck hire" / "truck hire auckland" keyword cluster.
 * Path: /moving-truck-hire-auckland
 */
const MovingTruckHire = () => {
  const canonical = "https://jamesblondrentals.lovable.app/moving-truck-hire-auckland";

  const trucks = [
    {
      name: "2 Tonne Box · 12m³",
      slug: "2-tonne-box-12m3",
      image: "/lovable-uploads/b1bd35e2-4d58-4900-86c5-dfe61a852d78.png",
      best: "1–2 bedroom move",
      from: "$119",
      features: [
        "Automatic, car licence",
        "Box 3.1m × 1.75m × 2.05m",
        "Fits a small apartment",
      ],
    },
    {
      name: "2 Tonne Box · 12m³ + Tail Lift",
      slug: "2-tonne-box-12m3-tail",
      image: "/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png",
      best: "Heavy furniture & appliances",
      from: "$149",
      features: [
        "400kg hydraulic tail lift",
        "Easy single-person loading",
        "Most popular for house moves",
      ],
      popular: true,
    },
    {
      name: "3 Tonne Box · 19m³ + Tail Lift",
      slug: "3-tonne-box-19m3",
      image: "/lovable-uploads/e4f29c45-82c9-460d-a508-4abd64ca9dd4.png",
      best: "3–4 bedroom home move",
      from: "$199",
      features: [
        "Largest in our fleet",
        "Box 4.8m × 2.1m × 2.1m",
        "One-trip family moves",
      ],
    },
  ];

  const trustItems = [
    { icon: Wallet, title: "Best price guarantee", body: "Find a like-for-like quote cheaper? We'll beat it." },
    { icon: ShieldCheck, title: "Insurance included", body: "All trucks come with comprehensive cover, reduce excess at checkout." },
    { icon: Clock, title: "24/7 roadside assist", body: "AA-backed support nationwide — call any time, day or night." },
    { icon: MapPin, title: "3 Auckland locations", body: "City, Airport & Manukau pickup. Same-day hire available." },
  ];

  const faqs = [
    {
      q: "Do I need a special licence to drive a moving truck?",
      a: "No — every truck on this page can be driven on a standard NZ class 1 (car) licence. They're automatic and easy to handle.",
    },
    {
      q: "How much does it cost to hire a moving truck in Auckland?",
      a: "Daily hire starts from $119 for a 12m³ 2-tonne box truck. Tail-lift trucks and the larger 19m³ start a little higher. Use the quote tool above for live pricing on your dates.",
    },
    {
      q: "Can I pick up today?",
      a: "Yes, subject to availability. Same-day moving truck hire is available at all three Auckland branches — book online or call us.",
    },
    {
      q: "Is insurance included?",
      a: "Yes. All rentals include standard insurance with a reducible excess. You can lower the excess to $0 at checkout.",
    },
    {
      q: "Can I drop the truck off at a different branch?",
      a: "One-way hires are available between our Auckland City, Airport and Manukau branches — and to our Wellington and Christchurch locations on request.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Moving Truck Hire",
    provider: {
      "@type": "LocalBusiness",
      name: "James Blond Rentals",
      areaServed: "Auckland, New Zealand",
      telephone: "+64-9-368-4307",
    },
    areaServed: "Auckland",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "119",
      highPrice: "249",
      priceCurrency: "NZD",
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div>
      <Helmet>
        <title>Moving Truck Hire Auckland | From $119/day · James Blond</title>
        <meta
          name="description"
          content="Cheap moving truck hire in Auckland from $119/day. 2 & 3 tonne box trucks with tail lift, insurance included, 24/7 roadside. Book online in 60 seconds."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Moving Truck Hire Auckland | From $119/day" />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-primary/5 border-b">
        <div className="container mx-auto px-4 py-10 md:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <Star className="h-3.5 w-3.5 fill-current" />
              Rated 4.8 / 5 by Auckland movers
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Moving Truck Hire Auckland — <span className="text-primary">from $119/day</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl">
              Tail-lift box trucks, automatic transmission, insurance included.
              Same-day pickup from 3 Auckland branches. Book in under a minute.
            </p>
            <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6 mb-6 text-sm">
              {[
                "Drive on a car licence",
                "Unlimited Auckland km",
                "Free cancellation 24h prior",
                "24/7 AA roadside assist",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#quote">
                  Get an instant quote <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+6493684307">
                  <PhoneCall className="mr-2 h-4 w-4" /> 09 368 4307
                </a>
              </Button>
            </div>
          </div>

          <div id="quote" className="bg-card rounded-2xl shadow-xl border p-4 md:p-6 scroll-mt-24">
            <h2 className="text-xl font-bold mb-1">Check availability & price</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Live pricing — no card needed to quote.
            </p>
            <TruckQuoteSearchForm fallbackTruckSlug="2-tonne-box-12m3-tail" />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2 h-fit">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUCK OPTIONS */}
      <section className="container mx-auto px-4 py-14">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl font-bold mb-3">Pick the right truck for your move</h2>
          <p className="text-muted-foreground">
            All three are automatic, drive on a car licence and include insurance.
            Not sure which size? Most 2–3 bedroom moves fit our 12m³ tail-lift truck.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {trucks.map((t) => (
            <Card
              key={t.slug}
              className={`relative overflow-hidden ${t.popular ? "ring-2 ring-primary" : ""}`}
            >
              {t.popular && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full z-10">
                  Most popular
                </div>
              )}
              <div className="aspect-[4/3] bg-muted">
                <img
                  src={t.image}
                  alt={`${t.name} moving truck hire Auckland`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="pt-5">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">from</div>
                    <div className="font-bold text-primary">{t.from}/day</div>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                  Best for: {t.best}
                </div>
                <ul className="space-y-1.5 mb-5 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link to={`/moving-truck-hire-auckland?truck=${t.slug}#quote`}>Book now</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={`/fleet/trucks/${t.slug}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-14">
          <h2 className="text-3xl font-bold text-center mb-10">Book in 3 simple steps</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { n: "1", title: "Get a quote", body: "Enter your pickup branch and dates above for an instant price." },
              { n: "2", title: "Reserve online", body: "Add insurance and any extras, then pay online to lock in your booking." },
              { n: "3", title: "Pick up & move", body: "Show your licence at the branch, we hand over the keys — usually in under 10 minutes." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <img
            src={familyUnpacking}
            alt="Family unpacking a James Blond moving truck in Auckland"
            className="rounded-2xl shadow-lg w-full"
            loading="lazy"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Trusted by 50,000+ Auckland movers</h2>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-6">
              "Quick pickup, the tail lift saved our backs and the price was honestly half what
              the big chains quoted. Will rent again next move."
              <footer className="not-italic text-sm mt-2 font-semibold text-foreground">
                — Sarah K., Mount Eden
              </footer>
            </blockquote>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <div className="text-3xl font-bold text-primary">4.8★</div>
                <div className="text-muted-foreground">Google rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-muted-foreground">Auckland branches</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">20+ yrs</div>
                <div className="text-muted-foreground">Renting in NZ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Moving truck hire FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative">
        <img
          src={truckOpenDoors}
          alt="James Blond moving truck loaded with boxes"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80" />
        <div className="relative container mx-auto px-4 py-16 text-center text-primary-foreground">
          <Truck className="h-10 w-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Ready to book your moving truck?
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Live availability across Auckland City, Airport and Manukau — quote in 60 seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="#quote">Get my quote</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <a href="tel:+6493684307">
                <PhoneCall className="mr-2 h-4 w-4" /> Call 09 368 4307
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovingTruckHire;