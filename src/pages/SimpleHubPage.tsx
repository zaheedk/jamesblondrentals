import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Check, Phone, ArrowRight, ShieldCheck, MapPin, Wallet } from 'lucide-react';
import PageHero from '@/components/PageHero';

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
  /** Optional price table — competitors ranking above us all show rates on-page. */
  priceTable?: { heading: string; note?: string; rows: { item: string; daily: string; weekend?: string; best: string }[] };
  /** Optional extra editorial sections for topical depth. */
  sections?: { h2: string; body: string; points?: string[] }[];
}

const SimpleHubPage = ({ slug, title, description, h1, intro, bullets, primaryCtaTo, primaryCtaLabel, cities, faq, localBusiness, priceTable, sections }: SimpleHubProps) => {
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

      <PageHero
        eyebrow="James Blond Rentals · NZ"
        EyebrowIcon={Truck}
        heading={h1}
        intro={intro}
        primaryTo={primaryCtaTo}
        primaryLabel={primaryCtaLabel}
        phone="+6498385300"
        phoneLabel="Call James Blond"
        features={[
          { Icon: Wallet, title: 'Transparent rates', description: 'Published GST-inclusive pricing with no hidden booking fees.' },
          { Icon: MapPin, title: 'Branches nationwide', description: 'Pickup in Auckland, Wellington, Christchurch and Hamilton.' },
          { Icon: ShieldCheck, title: 'Well-maintained fleet', description: 'Late-model, serviced vehicles with insurance options available.' },
          { Icon: Check, title: 'Easy booking', description: 'Book online in minutes or call our team seven days a week.' },
        ]}
      />

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

      {priceTable && (
        <section className="container mx-auto px-6 py-12 border-t">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">{priceTable.heading}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-4 font-semibold">Trailer / vehicle</th>
                  <th className="p-4 font-semibold">Daily</th>
                  <th className="p-4 font-semibold">Weekend</th>
                  <th className="p-4 font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody>
                {priceTable.rows.map((r) => (
                  <tr key={r.item} className="border-t border-border">
                    <td className="p-4 font-medium">{r.item}</td>
                    <td className="p-4">{r.daily}</td>
                    <td className="p-4">{r.weekend ?? '—'}</td>
                    <td className="p-4 text-muted-foreground">{r.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {priceTable.note && <p className="mt-4 text-sm text-muted-foreground">{priceTable.note}</p>}
        </section>
      )}

      {sections?.map((s) => (
        <section key={s.h2} className="container mx-auto px-6 py-12 border-t">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 max-w-3xl">{s.h2}</h2>
          <p className="text-muted-foreground max-w-3xl">{s.body}</p>
          {s.points && (
            <ul className="mt-6 grid md:grid-cols-2 gap-3 max-w-4xl">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

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