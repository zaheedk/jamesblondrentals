import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import carHero from '@/assets/auckland-car-rental-coastal-road.jpg';
import familySuv from '@/assets/auckland-7-seater-suv-family.jpg';

const whoItSuits = [
  ['New to Auckland', 'Arriving on a work contract or visa and not ready to buy — hire monthly while you settle.'],
  ['Between cars', 'Insurance write-off, a long repair or a new car on order: keep driving without a purchase.'],
  ['Business and contractors', 'Project-length hires for staff, with invoicing and swap-outs if the job changes.'],
  ['Extended visits', 'Family visiting for a season, or a long holiday where a monthly rate beats daily pricing.'],
];

const included = [
  'Servicing, WOF and registration handled by us',
  'Roadside assistance for the whole hire',
  'Swap to a different class if your needs change',
  'Pickup from Glen Eden (West Auckland) or Auckland Airport, Māngere',
  'Cars, SUVs, 7-seaters, vans and utes on the same terms',
];

const LongTermCarHireAuckland = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long is a long-term car hire?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Anything from a full week upward. Most long-term customers hire by the month and renew as needed, and we quote per month for hires of one month or longer.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does long-term car hire in Auckland cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Monthly rates are quoted on request because they depend on the vehicle class, the length of the hire and the time of year. Weekly and monthly rates work out lower per day than daily hire — call 0800 525 663 or send us your dates for a quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who pays for servicing and maintenance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We do. Servicing, WOF, registration and roadside assistance are all covered for the length of the hire — you cover fuel and the agreed hire charges.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I change vehicles part-way through?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. If your needs change — a bigger car for family visiting, or a van for a move — we can swap you into another class subject to availability.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is long-term hire cheaper than buying a car?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends how long you need it. For stays of a few months, hiring usually avoids the cost and risk of buying and reselling, plus compliance, servicing and repairs. For multi-year use, buying is normally cheaper.',
        },
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <PageSEO
        title="Long Term Car Hire Auckland | Weekly & Monthly Rates | James Blond"
        description="Long-term and monthly car hire in Auckland. Weekly and monthly rates, servicing and roadside assistance included, pickup in West Auckland or at Auckland Airport."
        canonical="/long-term-car-hire-auckland"
      />
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-6">
                Auckland · Weekly & monthly hire
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight">
                Long-term car hire in Auckland,
                <span className="italic text-primary"> without buying.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
                A car for a month, a season or the length of a contract — servicing, WOF,
                registration and roadside assistance all on us. Pick up in Glen Eden or at
                Auckland Airport and hand it back when you're done.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl">
                Shorter trip?{' '}
                <Link to="/car-hire-auckland" className="underline hover:text-primary font-medium">See daily car hire in Auckland</Link>
                {' '}or{' '}
                <Link to="/west-auckland-car-hire" className="underline hover:text-primary font-medium">our West Auckland branch</Link>.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button asChild size="lg" className="rounded-full px-7">
                  <a href="#quote">Get a monthly quote</a>
                </Button>
                <a
                  href="tel:0800525663"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                >
                  <Phone className="h-4 w-4" /> Call 0800 525 663
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <img
                src={carHero}
                alt="Rental car on an Auckland road"
                className="w-full aspect-[4/5] object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mb-12">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Who it suits
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              When a month makes more sense than a day.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {whoItSuits.map(([t, d], i) => (
              <div key={t} className="border-t border-border pt-6 flex gap-6">
                <span className="font-serif text-3xl text-primary leading-none">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl">{t}</h3>
                  <p className="mt-2 text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">
            What's included
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            The running around is ours.
          </h2>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {included.map((row) => (
              <li key={row} className="py-4 flex items-start gap-3 text-sm md:text-base">
                <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                <span>{row}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Monthly pricing is quoted on request — it depends on the vehicle class, the
            length of the hire and the season. Daily and weekly rates for cars are on our{' '}
            <Link to="/price-guide" className="underline hover:text-primary">price guide</Link>.
          </p>
        </div>
        <img
          src={familySuv}
          alt="SUV rental parked in Auckland"
          className="w-full aspect-[5/6] object-cover"
          loading="lazy"
        />
      </section>

      <section id="quote" className="border-t border-border scroll-mt-20 bg-muted/40">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Reserve</p>
            <h2 className="font-serif text-4xl md:text-5xl">Price a long hire</h2>
            <p className="mt-4 text-muted-foreground">
              Enter your dates for live pricing, or{' '}
              <a href="tel:0800525663" className="underline hover:text-primary">call 0800 525 663</a>{' '}
              and we'll quote a monthly rate.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <p className="text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">Questions</p>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Long-term car hire FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {faqJsonLd.mainEntity.map((q) => (
            <div key={q.name} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-serif text-xl">{q.name}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{q.acceptedAnswer.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};

export default LongTermCarHireAuckland;
