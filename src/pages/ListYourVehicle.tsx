import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Check, Phone, Mail, ArrowRight, ShieldCheck, Wallet, Users, Car, TrendingUp } from 'lucide-react';

const FB_CAMPAIGN_UTM = 'utm_source=facebook&utm_medium=cpc&utm_campaign=list_your_vehicle&utm_content=landing_page';

const trackMetaEvent = (event: string, params?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('track', event, params);
    }
  } catch {
    // Never let pixel tracking break the page
  }
};


const revenueSplit = [
  { item: 'Vehicle purchase or lease', owner: true, jb: false },
  { item: 'Comprehensive rental-use insurance', owner: true, jb: false },
  { item: 'Registration, WOF/COF, servicing, tyres', owner: true, jb: false },
  { item: 'Roadside assistance membership', owner: true, jb: false },
  { item: 'Marketing, website and Google Ads', owner: false, jb: true },
  { item: 'Bookings, payments and rental agreements', owner: false, jb: true },
  { item: 'Customer service, 7 days', owner: false, jb: true },
  { item: 'Damage claims and infringement handling', owner: false, jb: true },
];

const faq = [
  {
    q: 'How does the 70/30 revenue share work?',
    a: 'You receive 70% of the net rental revenue earned by your vehicle and James Blond retains 30%. Net rental revenue means the rental charge after GST, third-party booking fees and merchant/card fees. Extras such as insurance excess reduction, accessories and one-way fees are settled separately as set out in your owner agreement.',
  },
  {
    q: 'Who pays for insurance?',
    a: 'The vehicle owner does. Your policy must specifically cover commercial rental use — a standard private or business policy is not enough. We can introduce you to brokers who write rental-use cover in New Zealand, but the policy sits in your name.',
  },
  {
    q: 'What does James Blond actually do?',
    a: 'We handle demand and administration: listing your vehicle on jamesblond.co.nz, paid search, phone and email enquiries, quoting, bookings, payments, rental agreements, driver checks, security bonds, damage claims and infringement processing.',
  },
  {
    q: 'Who is responsible if the vehicle is damaged?',
    a: 'We take a security bond from every renter, complete a photo condition report at pickup and return, and pursue recovery from the renter for damage they cause. Amounts above the recoverable excess are dealt with under your insurance policy, so the residual risk sits with the owner as the asset holder.',
  },
  {
    q: 'How and when do I get paid?',
    a: 'Monthly. You receive a statement showing every booking your vehicle completed, gross revenue, deductions and your 70% share, paid by bank transfer to your nominated account.',
  },
  {
    q: 'Do I have to hand over my vehicle full time?',
    a: 'To be listed the vehicle needs to be reliably available, kept presentable and reachable for pickups and returns. Owners can block out dates, but frequent blocks reduce utilisation and therefore your earnings.',
  },
  {
    q: 'What vehicles are you looking for?',
    a: 'Commercial and people-moving vehicles where demand outstrips our own fleet: cargo vans, furniture and box trucks, utes, trailers and minibuses. Late-model, well-presented vehicles with clean service history are preferred.',
  },
  {
    q: 'What are my likely earnings?',
    a: 'Earnings depend on vehicle type, location and utilisation, so we do not publish guaranteed returns. Talk to us and we will show you real utilisation and rate data for your vehicle category and branch so you can model it yourself.',
  },
  {
    q: 'Is there a joining fee?',
    a: 'No joining fee. James Blond only earns when your vehicle earns, which keeps our incentives aligned with yours.',
  },
  {
    q: 'How long is the agreement?',
    a: 'An initial 12-month term, then month to month with 30 days notice from either side. The full terms are set out in the owner agreement we provide before you commit.',
  },
];

const ListYourVehicle = () => {
  useEffect(() => {
    trackMetaEvent('ViewContent', {
      content_name: 'List Your Vehicle',
      content_category: 'Vehicle Owner Partnership',
      content_type: 'landing_page',
      value: 0,
      currency: 'NZD',
    });
  }, []);

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
      <PageSEO
        title="List Your Vehicle | Earn 70% With James Blond Rentals NZ"
        description="Own a van, truck, ute, trailer or minibus? List it with James Blond Rentals and keep 70% of net rental revenue. We handle bookings, payments and customer service."
        canonical="/list-your-vehicle"
      />
      <JsonLd data={faqLd} />

      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: headline, copy, CTAs */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-muted/60 border border-border rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-primary mb-6">
              <Car className="w-4 h-4" />
              Vehicle Owner Partnerships
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Put your vehicle to work. Keep 70% of the rental revenue.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Own a cargo van, furniture truck, ute, trailer or minibus? List it with James Blond and we will bring the customers, run the bookings and handle the day-to-day — you keep the asset and 70% of net revenue.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button size="lg" variant="cta" asChild>
                <a
                  href={`mailto:info@jamesblond.co.nz?subject=List%20my%20vehicle%20with%20James%20Blond%20%7C%20Source%3A%20${encodeURIComponent(FB_CAMPAIGN_UTM)}`}
                  onClick={() => {
                    trackMetaEvent('Lead', { content_name: 'List Your Vehicle', currency: 'NZD', value: 0 });
                    trackMetaEvent('Contact', { content_name: 'List Your Vehicle - Email' });
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> Register your interest
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="tel:0800525663"
                  onClick={() => trackMetaEvent('Contact', { content_name: 'List Your Vehicle - Phone' })}
                >
                  <Phone className="mr-2 h-4 w-4" /> 0800 525 663
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Already have questions?{' '}
              <Link to="/contact" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                Contact our team <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>

          {/* Right: 2x2 feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                Icon: Wallet,
                title: 'You earn 70%',
                description: 'Receive 70% of net rental revenue every month from completed bookings.',
              },
              {
                Icon: Users,
                title: 'We bring demand',
                description: 'Website, Google Ads, branch enquiries and repeat commercial customers.',
              },
              {
                Icon: ShieldCheck,
                title: 'We run the rental',
                description: 'Rental agreements, driver checks, security bonds, photos and damage handling.',
              },
              {
                Icon: TrendingUp,
                title: 'Monthly payouts',
                description: 'Clear statements per booking, with your share paid to your bank account.',
              },
            ].map(({ Icon, title, description }) => (
              <div
                key={title}
                className="bg-muted/40 border border-border rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="text-3xl md:text-4xl mb-4">Who is responsible for what</h2>
        <p className="text-muted-foreground max-w-3xl mb-6">
          No grey areas. The owner carries the asset and its running costs; James Blond carries demand generation
          and the rental operation.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4 font-semibold">Responsibility</th>
                <th className="p-4 font-semibold">Vehicle owner</th>
                <th className="p-4 font-semibold">James Blond</th>
              </tr>
            </thead>
            <tbody>
              {revenueSplit.map((r) => (
                <tr key={r.item} className="border-t border-border">
                  <td className="p-4 font-medium">{r.item}</td>
                  <td className="p-4">{r.owner ? <Check className="h-4 w-4 text-primary" /> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="p-4">{r.jb ? <Check className="h-4 w-4 text-primary" /> : <span className="text-muted-foreground">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Indicative only. The signed owner agreement sets the binding terms, including how extras, one-way fees and
          damage recoveries are treated.
        </p>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="text-3xl md:text-4xl mb-6">How the revenue share is calculated</h2>
        <ol className="space-y-4 max-w-3xl text-muted-foreground list-decimal pl-6">
          <li>A customer books your vehicle through James Blond and pays us directly.</li>
          <li>GST, card/merchant fees and any third-party booking fees are deducted to give net rental revenue.</li>
          <li>Net rental revenue is split 70% to you, 30% to James Blond.</li>
          <li>Recoverable costs caused by a renter (fuel, cleaning, infringements, damage recoveries) are passed through to whoever bore them.</li>
          <li>You receive a monthly statement per booking and payment to your nominated bank account.</li>
        </ol>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="text-3xl md:text-4xl mb-6">Vehicles we want most</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Cargo vans', to: '/cargo-van-hire' },
            { name: 'Furniture & box trucks', to: '/truck-hire' },
            { name: 'Utes', to: '/ute-hire' },
            { name: 'Trailers', to: '/fleet/trailers' },
            { name: 'Minibuses', to: '/fleet/minibuses' },
            { name: 'Passenger vans', to: '/fleet/vans' },
            { name: 'Tipper trucks', to: '/tipper-truck-hire' },
            { name: 'Cars & SUVs', to: '/fleet/cars' },
          ].map((v) => (
            <Link key={v.name} to={v.to} className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
              <Car className="h-4 w-4 text-primary mb-2" />
              <div className="font-bold">{v.name}</div>
              <div className="text-xs text-muted-foreground mt-1">See current demand</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16 mt-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl mb-8">Owner questions, answered</h2>
          <div className="space-y-6">
            {faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold mb-2">{f.q}</h3>
                <p className="text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <a href="mailto:info@jamesblond.co.nz?subject=List%20my%20vehicle%20with%20James%20Blond">
                <Mail className="mr-2 h-4 w-4" /> Talk to us about listing
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:0800525663"><Phone className="mr-2 h-4 w-4" /> 0800 525 663</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListYourVehicle;
