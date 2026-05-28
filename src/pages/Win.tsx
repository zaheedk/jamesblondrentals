import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trophy, CheckCircle2, Calendar, Gift, Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageSEO from '@/components/PageSEO';

const SITE_URL = 'https://jamesblond.co.nz';

const Win = () => {
  const promotionLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'Win Up to $200 Back on Your Rental – Monthly Giveaway',
    description:
      'Every month James Blond Rentals draws 5 lucky winners who each receive up to $200 back from their rental amount. Open to all customers who hire a vehicle from us – no entry form required.',
    url: `${SITE_URL}/win`,
    priceCurrency: 'NZD',
    eligibleCustomerType: 'https://schema.org/Enumeration',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'James Blond Rentals',
      url: SITE_URL,
    },
  };

  return (
    <div className="bg-background">
      <PageSEO
        title="Win Up to $200 Back on Your Rental | James Blond Rentals"
        description="Every month 5 lucky James Blond Rentals customers win up to $200 back on their rental. Hire a car, van, ute or truck in Auckland, Wellington or Christchurch to be automatically entered."
        canonical="/win"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(promotionLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Monthly Customer Giveaway
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Win up to <span className="underline decoration-4 underline-offset-4">$200 back</span> on your rental
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            Every single month, 5 lucky James Blond Rentals customers win up to $200 back from
            their rental amount. No forms, no fuss — just hire from us and you're in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="text-base font-semibold">
              <Link to="/booking">Book a vehicle now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base font-semibold bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/vehicles">Browse the fleet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Car, title: '1. Hire a vehicle', body: 'Book any car, van, ute, minibus or truck from James Blond Rentals — across Auckland, Wellington or Christchurch.' },
            { icon: Calendar, title: '2. Drawn monthly', body: 'At the end of every month our system automatically draws 5 winners from that month\'s completed rentals.' },
            { icon: Gift, title: '3. Get up to $200 back', body: 'Winners receive up to $200 back from their rental amount — credited directly. We notify you by email.' },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-2">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Eligibility / terms */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">The fine print</h2>
          <ul className="space-y-4">
            {[
              'Open to anyone who completes a vehicle hire with James Blond Rentals — cars, vans, utes, minibuses and trucks all qualify.',
              'No entry form required. Every completed rental in the month is automatically entered.',
              '5 winners are drawn at the end of each calendar month by our automated system.',
              'Winners receive up to $200 back from their rental amount, credited or refunded to the original payment method.',
              'Winners are contacted by email — please make sure your booking email is correct.',
              'Ongoing promotion with no end date. Cancelled or no-show bookings are not eligible.',
            ].map(item => (
              <li key={item} className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to be one of this month's 5 winners?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Book your next rental with James Blond — low rates, friendly service, and a real chance to win up to $200 back.
        </p>
        <Button asChild size="lg" className="text-base font-semibold">
          <Link to="/booking">Start your booking</Link>
        </Button>
      </section>
    </div>
  );
};

export default Win;