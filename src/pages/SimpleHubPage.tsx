import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Check, Phone, ArrowRight } from 'lucide-react';

export interface SimpleHubProps {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  bullets: string[];
  primaryCtaTo: string;
  primaryCtaLabel: string;
  cities: { name: string; to: string }[];
  faq: { q: string; a: string }[];
  localBusiness?: Record<string, unknown>;
}

const SimpleHubPage = ({ slug, title, description, h1, intro, bullets, primaryCtaTo, primaryCtaLabel, cities, faq, localBusiness }: SimpleHubProps) => {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <div className="bg-background text-foreground">
      <PageSEO title={title} description={description} canonical={slug} />
      {localBusiness && <JsonLd data={localBusiness} />}
      <JsonLd data={faqLd} />

      <section className="container mx-auto px-6 pt-16 pb-12 md:pt-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">James Blond Rentals · NZ</p>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight max-w-4xl">{h1}</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">{intro}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link to={primaryCtaTo}>{primaryCtaLabel} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="tel:+6498385300"><Phone className="mr-2 h-4 w-4" /> Call James Blond</a>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <Card>
          <CardContent className="p-8">
            <Truck className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-4">What's included</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="font-serif text-3xl md:text-4xl mb-6">Pickup near you</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((c) => (
            <Link key={c.name} to={c.to} className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="font-bold">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1">Same-day hire</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16 mt-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Common questions</h2>
          <div className="space-y-6">
            {faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold mb-2">{f.q}</h3>
                <p className="text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHubPage;