import { Link } from 'react-router-dom';
import { CreditCard, CalendarClock, ShieldCheck, Wallet, HelpCircle } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import PageHero from '@/components/PageHero';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import klarnaImg from '@/assets/klarna-badge.svg';

const faqs = [
  {
    q: 'How does Klarna Pay in 4 work for a vehicle hire?',
    a: 'At checkout you choose Klarna instead of card. Klarna splits your rental total into 4 equal, interest-free instalments. The first instalment is charged today and the remaining three are automatically charged every two weeks to the card you save with Klarna.',
  },
  {
    q: 'Does Klarna cover the security bond?',
    a: 'No. Klarna covers the rental amount only. The security bond is still taken by credit or debit card, in the vehicle at pickup, and is released after the vehicle is returned undamaged.',
  },
  {
    q: 'Can I pay the $50 deposit with Klarna?',
    a: 'No. Klarna is available for the full rental amount only. If you would prefer to pay a $50 non-refundable deposit now and the balance later, choose the credit or debit card option at checkout.',
  },
  {
    q: 'Is there any interest or fee?',
    a: 'Klarna Pay in 4 is interest-free. James Blond Rentals does not add a surcharge for using Klarna. Klarna may charge you a late fee if an instalment fails — see Klarna\u2019s own terms for the amounts that apply to you.',
  },
  {
    q: 'Who approves the Klarna payment?',
    a: 'Klarna does. Approval is decided by Klarna at the time of purchase, based on their own checks, and is not guaranteed. If Klarna declines, you can complete the booking with a credit or debit card instead.',
  },
  {
    q: 'What happens if I cancel or change my booking?',
    a: 'Our standard cancellation terms apply. Any refund is returned through Klarna, which then adjusts or cancels your remaining instalments. Refunds can take a few business days to appear.',
  },
];

const PayWithKlarna = () => (
  <div>
    <PageSEO
      title="Pay in 4 with Klarna – Vehicle Hire NZ | James Blond Rentals"
      description="Split your car, van, ute or truck hire into 4 interest-free instalments with Klarna at James Blond Rentals checkout. See how it works, eligibility and terms."
      canonical="/pay-with-klarna"
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }}
    />

    <PageHero
      eyebrow="Payment options · Klarna"
      EyebrowIcon={Wallet}
      heading="Pay in 4 with Klarna"
      intro="Book your car, van, ute or truck today and split the rental into 4 equal, interest-free instalments. Choose Klarna at checkout — no extra fee from us."
      primaryTo="/vehicles"
      primaryLabel="Book a vehicle"
      features={[
        { Icon: CalendarClock, title: '4 instalments', description: 'Every two weeks, interest-free.' },
        { Icon: CreditCard, title: 'First payment today', description: 'The rest are charged automatically.' },
        { Icon: ShieldCheck, title: 'Bond stays on card', description: 'Klarna covers the rental amount only.' },
        { Icon: HelpCircle, title: 'Approval by Klarna', description: 'Subject to Klarna’s checks at checkout.' },
      ]}
      footnote={
        <span className="inline-flex items-center gap-2">
          Available at checkout with <img src={klarnaImg} alt="Klarna" className="h-6 w-auto" />
        </span>
      }
    />

    <section className="container mx-auto px-6 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">How it works</h2>
      <ol className="grid gap-4 md:grid-cols-4">
        {[
          'Pick your vehicle, dates and any extras as usual.',
          'At the payment step choose Klarna instead of card.',
          'Klarna shows your 4 instalments and takes the first one today.',
          'The remaining 3 are charged automatically, every 2 weeks.',
        ].map((step, i) => (
          <li key={step} className="rounded-xl border bg-card p-5">
            <span className="text-sm font-bold text-primary">Step {i + 1}</span>
            <p className="mt-2 text-sm text-muted-foreground">{step}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="container mx-auto px-6 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Terms of service for Klarna payments</h2>
      <div className="rounded-xl border bg-card p-6 space-y-4 text-sm text-muted-foreground">
        <p>
          Klarna is offered through our payment provider Airwallex. When you choose Klarna you enter a
          separate credit agreement with Klarna for the rental amount. Your hire itself remains governed by our{' '}
          <Link to="/terms" className="text-primary underline">Terms &amp; Conditions</Link>.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Eligibility.</strong> Klarna Pay in 4 is subject to approval by Klarna and to their minimum and maximum order values. Availability can depend on your billing country and card. Approval is not guaranteed and is decided solely by Klarna.</li>
          <li><strong>Amount covered.</strong> Klarna may be used for the full rental amount only. The $50 non-refundable deposit option is not available with Klarna.</li>
          <li><strong>Security bond.</strong> The security bond is excluded from any Klarna payment. It is pre-authorised or charged on a credit or debit card at pickup and released after the vehicle is returned undamaged and on time.</li>
          <li><strong>Charges after pickup.</strong> Fuel, cleaning, late-return fees, traffic infringements, administration fees and damage costs cannot be added to a Klarna plan and will be charged to the card held on file, as set out in our Terms &amp; Conditions.</li>
          <li><strong>Instalments and late fees.</strong> The first instalment is taken at checkout; the remaining three are collected by Klarna at approximately two-week intervals. James Blond Rentals does not charge interest or a surcharge for Klarna. Klarna may apply late or failed-payment fees under your agreement with them.</li>
          <li><strong>Cancellations and refunds.</strong> Our standard cancellation fees apply (see clause 18 of our Terms &amp; Conditions). Approved refunds are processed back through Klarna, which will adjust or cancel your remaining instalments. Processing times are set by Klarna and your bank.</li>
          <li><strong>Payment disputes.</strong> Questions about your instalment schedule, payment dates or late fees must be raised with Klarna. Questions about your booking, vehicle or charges should be raised with us.</li>
          <li><strong>Data.</strong> To process a Klarna payment we share the order amount, currency, booking reference and your contact details with Airwallex and Klarna. Their handling of your data is covered by their own privacy policies; ours is set out in our{' '}
            <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.</li>
          <li><strong>Availability.</strong> We may add, limit or withdraw Klarna as a payment method at any time without notice. If Klarna is unavailable at checkout, credit and debit card payment remains available.</li>
        </ul>
        <p>
          Klarna is a trademark of Klarna Bank AB (publ). James Blond Rentals (Kanthawala Ltd) is not a lender and does not
          provide credit. Please read Klarna’s own terms before you confirm a Klarna payment.
        </p>
      </div>
    </section>

    <section className="container mx-auto px-6 pb-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Klarna FAQs</h2>
      <Accordion type="single" collapsible>
        {faqs.map(({ q, a }) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-8 text-sm text-muted-foreground">
        Still unsure? <Link to="/contact" className="text-primary underline">Contact our team</Link> or view our{' '}
        <Link to="/price-guide" className="text-primary underline">price guide</Link> before you book.
      </p>
    </section>
  </div>
);

export default PayWithKlarna;
