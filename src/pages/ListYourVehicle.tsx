import { Link } from 'react-router-dom';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Phone, Mail, ArrowRight, ShieldCheck, Wallet, Users, Car } from 'lucide-react';

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

      <section className="container mx-auto px-6 pt-16 pb-12 md:pt-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">Vehicle owner partnerships · NZ</p>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight max-w-4xl">
          Put your vehicle to work. Keep 70% of the rental revenue.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          If you own a cargo van, furniture truck, ute, trailer or minibus — or you want to enter the rental
          industry without building a business from scratch — list it with James Blond. You own the asset, we bring
          the customers and run the day-to-day.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <a href="mailto:info@jamesblond.co.nz?subject=List%20my%20vehicle%20with%20James%20Blond">
              <Mail className="mr-2 h-4 w-4" /> Register your interest <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="tel:0800525663"><Phone className="mr-2 h-4 w-4" /> 0800 525 663</a>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="font-serif text-3xl md:text-4xl mb-8">The model in one line</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: Wallet, h: 'You own it, you earn 70%', p: 'You buy or already own the vehicle and receive 70% of net rental revenue every month.' },
            { Icon: Users, h: 'We bring the demand', p: 'Website, Google Ads, branch enquiries and repeat commercial customers — plus quoting and bookings.' },
            { Icon: ShieldCheck, h: 'We run the rental', p: 'Rental agreements, driver checks, security bonds, condition photos, damage and infringement handling.' },
          ].map(({ Icon, h, p }) => (
            <Card key={h}>
              <CardContent className="p-8">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{h}</h3>
                <p className="text-muted-foreground">{p}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Who is responsible for what</h2>
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
        <h2 className="font-serif text-3xl md:text-4xl mb-6">How the revenue share is calculated</h2>
        <ol className="space-y-4 max-w-3xl text-muted-foreground list-decimal pl-6">
          <li>A customer books your vehicle through James Blond and pays us directly.</li>
          <li>GST, card/merchant fees and any third-party booking fees are deducted to give net rental revenue.</li>
          <li>Net rental revenue is split 70% to you, 30% to James Blond.</li>
          <li>Recoverable costs caused by a renter (fuel, cleaning, infringements, damage recoveries) are passed through to whoever bore them.</li>
          <li>You receive a monthly statement per booking and payment to your nominated bank account.</li>
        </ol>
      </section>

      <section className="container mx-auto px-6 py-12 border-t">
        <h2 className="font-serif text-3xl md:text-4xl mb-6">Vehicles we want most</h2>
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
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Owner questions, answered</h2>
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
