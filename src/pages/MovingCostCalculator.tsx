import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';
import PageHero from '@/components/PageHero';
import MovingCostCalculator, { MOVING_VEHICLES } from '@/components/tools/MovingCostCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Truck, Ruler, Wallet, Copy, Check } from 'lucide-react';

const SITE_URL = 'https://www.jamesblond.co.nz';
const EMBED_SNIPPET = `<iframe src="${SITE_URL}/embed/moving-cost-calculator" width="100%" height="880" style="border:0;max-width:960px" loading="lazy" title="Moving truck size & cost calculator by James Blond Rentals"></iframe>
<p style="font:14px system-ui">Calculator by <a href="${SITE_URL}/moving-cost-calculator">James Blond Rentals</a></p>`;

const FAQS = [
  {
    q: 'What size truck do I need to move a 2 bedroom house in NZ?',
    a: 'A furnished two-bedroom home is usually 20–25m³ of goods. A 16m³ furniture truck handles it in two trips locally, or a 3T 18–19m³ tail lift truck in one or two trips. If you are moving between cities, size up so it is a single load.',
  },
  {
    q: 'How much does it cost to move house yourself in New Zealand?',
    a: 'Hiring a truck yourself typically costs between $105 and $300 in vehicle hire plus a per-kilometre charge, compared with $800–$2,500 for a full removal company. The calculator above uses James Blond published rates so you can compare before you book.',
  },
  {
    q: 'Is a van or a truck cheaper for moving?',
    a: 'A cargo van has a lower per-kilometre rate and a similar 8-hour hire price, so it is cheaper if your load fits in 6–9m³. Once you pass roughly 9m³, one truck trip beats two or three van trips on both cost and time.',
  },
  {
    q: 'Do I need a special licence to drive a moving truck?',
    a: 'Our 2T box and tail lift trucks are driveable on a full New Zealand class 1 car licence (or an accepted overseas equivalent). Larger class 2 trucks require a class 2 licence.',
  },
];

const MovingCostCalculatorPage = () => {
  const [copied, setCopied] = useState(false);

  const copySnippet = async () => {
    await navigator.clipboard.writeText(EMBED_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <PageSEO
        title="Moving Truck Size & Cost Calculator NZ | James Blond"
        description="Work out what size moving truck you need and what your DIY move will cost. Free NZ calculator using James Blond's published van and truck rates."
        canonical="/moving-cost-calculator"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Moving Truck Size & Cost Calculator',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            url: `${SITE_URL}/moving-cost-calculator`,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'NZD' },
            provider: { '@type': 'Organization', name: 'James Blond Rentals', url: SITE_URL },
          })}
        </script>
      </Helmet>

      <PageHero
        eyebrow="Free tool · New Zealand"
        EyebrowIcon={Calculator}
        heading="Moving truck size & cost calculator"
        intro="Tell us what you're shifting and we'll recommend the right van or truck, estimate how many trips you'll need, and price the move using our published rates."
        primaryTo="/booking"
        primaryLabel="Book a moving truck"
        features={[
          { Icon: Ruler, title: 'Right size, first time', description: 'Volume estimate matched to real load-space dimensions.' },
          { Icon: Wallet, title: 'Real rates', description: 'Hire plus per-kilometre pricing from our price guide.' },
          { Icon: Truck, title: 'Van or truck', description: 'See when one truck trip beats three van runs.' },
          { Icon: Calculator, title: 'Embed it free', description: 'Drop the calculator on your own site in one line.' },
        ]}
      />

      <section className="container mx-auto px-6 pb-16">
        <MovingCostCalculator />
      </section>

      <section className="container mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Moving vehicle sizes at a glance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOVING_VEHICLES.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground">{v.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Load space {v.loadSpace}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  From ${v.eightHour.toFixed(2)} for 8 hours · ${v.perKm.toFixed(2)}/km
                </p>
                <Link
                  to={v.fleetPath}
                  className="text-sm font-medium text-primary hover:underline mt-3 inline-block"
                >
                  View {v.name} details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Full rates, weekend and unlimited-kilometre options are on our{' '}
          <Link to="/price-guide" className="text-primary hover:underline">
            price guide
          </Link>
          .
        </p>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-border bg-muted/40 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-3">Add this calculator to your website</h2>
          <p className="text-muted-foreground mb-5 max-w-2xl">
            Free for movers, property managers, real estate agencies and storage operators to embed. Copy the
            snippet below — it stays up to date automatically.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-foreground/90 p-4 text-xs text-background">
            <code>{EMBED_SNIPPET}</code>
          </pre>
          <Button className="mt-4" onClick={copySnippet} variant="outline">
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied' : 'Copy embed code'}
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Moving truck questions</h2>
        <div className="space-y-4 max-w-3xl">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
              <p className="text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-8 text-sm">
          <Link to="/furniture-truck-hire-auckland" className="text-primary hover:underline">
            Furniture truck hire
          </Link>
          <Link to="/moving-truck-hire-auckland" className="text-primary hover:underline">
            Moving truck hire
          </Link>
          <Link to="/cargo-van-hire" className="text-primary hover:underline">
            Cargo van hire
          </Link>
          <Link to="/price-guide" className="text-primary hover:underline">
            Price guide
          </Link>
        </div>
      </section>
    </>
  );
};

export default MovingCostCalculatorPage;
