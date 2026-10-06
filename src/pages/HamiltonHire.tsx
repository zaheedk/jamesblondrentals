import { Link } from 'react-router-dom';
import { ArrowRight, Car, MapPin, Phone, Truck, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import roadTrip from '@/assets/hero-summer-nz-corrected.jpg';
import cargoVan from '@/assets/truck-open-doors-loading-boxes.jpg';
import movingTruck from '@/assets/family-unloading-removal-truck.jpg';

const hireOptions = [
  { title: 'Car hire Hamilton', icon: Car, image: roadTrip, alt: 'SUV on a New Zealand road trip', to: '/car-hire-hamilton', description: 'For business trips, everyday driving and Waikato weekends. Compare the cars and SUVs available for your dates.', uses: 'City visits · Raglan weekends · Business travel' },
  { title: 'Van hire Hamilton', icon: Package, image: cargoVan, alt: 'Cargo van with open rear doors and moving boxes', to: '/van-hire-hamilton', description: 'Room for furniture, tools and deliveries. Explore cargo and jumbo vans, then check the load space against your job.', uses: 'Furniture runs · Trades · Small moves' },
  { title: 'Truck hire Hamilton', icon: Truck, image: movingTruck, alt: 'Family unloading furniture and boxes from a moving truck', to: '/truck-hire-hamilton', description: 'For the bigger move. Compare moving trucks and tail-lift options, with vehicle specifications to help you choose.', uses: 'House moves · Bulky loads · Business deliveries' },
];

const faqs = [
  { question: 'Where can I book car rental in Hamilton?', answer: 'Book Hamilton car rental with James Blond Rentals by choosing Hamilton as your pickup location and entering your dates. Compare live availability and prices online. Our Hamilton branch is at 17 Bandon Street, Frankton — see the branch page for directions and collection details.' },
  { question: 'How much does car hire in Hamilton cost?', answer: 'Car hire prices depend on your travel dates, vehicle category and hire length. Search your dates for a current quote rather than relying on a fixed starting price. Check the kilometre allowance and cover options for the vehicle you select before completing your booking.' },
  { question: 'Can I hire a cargo van in Hamilton for moving furniture?', answer: 'Cargo vans suit furniture collections, boxes, tools and smaller moves around Hamilton. A jumbo van can suit larger loads. Compare the vehicle’s load dimensions and carrying capacity with your items; for a full house move, look at our Hamilton moving trucks instead.' },
  { question: 'What should I look for when booking truck hire in Hamilton?', answer: 'Consider the size and weight of your load, access at both addresses and whether a tail lift would help. Our Hamilton truck hire page explains the vehicle options. Check live availability for your dates and confirm the licence requirement for the particular truck before booking.' },
  { question: 'Can I drive a hire van or moving truck on a car licence?', answer: 'Many cargo vans and smaller moving trucks can be driven on a full Class 1 car licence, but the requirement depends on the specific vehicle. Check its specifications and your licence eligibility before booking. Call 0800 525 663 if you are unsure which vehicle suits your licence and load.' },
  { question: 'Do you offer weekly car, van and truck hire in Hamilton?', answer: 'Enter your full hire period in the booking search to compare prices and availability for a week or longer. Rates vary with dates and vehicle type. For an ongoing business hire or a longer rental, contact the team to discuss your requirements.' },
  { question: 'Can I arrange car rental for a Hamilton Airport arrival?', answer: 'This page’s booking search is for our Hamilton branch in Frankton, not an airport pickup location. If you are flying into Hamilton Airport, contact us before booking to confirm collection arrangements. Do not assume airport delivery or a shuttle is included.' },
  { question: 'Can I book one-way hire from Hamilton to Auckland or Wellington?', answer: 'Choose a different return location in the booking search to check the route, available vehicles and quoted charges. One-way hire depends on the vehicle, dates and branch availability. Contact us if your required route does not return a suitable option.' },
  { question: 'Do you offer minibus or 12-seater van hire in Hamilton?', answer: 'For group travel, see our Hamilton minibus hire page and contact the team for availability and a quote. Minibus rates are on request, rather than a fixed advertised daily price.' },
  { question: 'How can I make my Hamilton pickup quicker?', answer: 'Use the customer portal to complete your personal details and driving licence information before collection. You can also add drivers to your booking in advance. See our online check-in page for the pre-check-in options.' },
];

const HamiltonHire = () => (
  <main className="bg-background text-foreground tracking-normal [&_h1]:tracking-normal [&_h2]:tracking-normal [&_h3]:tracking-normal">
    <PageSEO title="Car, Van & Truck Hire Hamilton | James Blond Rentals" description="Compare car rental, cargo van and moving truck hire in Hamilton. Check live prices and availability, collect in Frankton and check in online before pickup." canonical="/vehicle-hire-hamilton" />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jamesblond.co.nz/' }, { '@type': 'ListItem', position: 2, name: 'Hamilton vehicle hire', item: 'https://www.jamesblond.co.nz/vehicle-hire-hamilton' }] }} />

    <section className="relative isolate overflow-hidden">
      <img src={roadTrip} alt="SUV travelling through New Zealand countryside" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-foreground/65" />
      <div className="container px-6 py-16 md:py-24 text-primary-foreground">
        <p className="mb-5 flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4" /> James Blond Rentals · Hamilton, Waikato</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">Car, van &amp; truck hire Hamilton</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">A Waikato road trip, a furniture run or moving day. Find the right vehicle, with pickup from our Frankton branch.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild variant="cta" size="lg"><a href="#booking">Check Hamilton availability <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          <Button asChild variant="secondary" size="lg"><a href="tel:0800525663"><Phone className="mr-2 h-4 w-4" />0800 525 663</a></Button>
        </div>
        <p className="mt-8 text-sm">17 Bandon Street · Frankton · Hamilton</p>
      </div>
    </section>

    <section className="border-b border-border bg-muted/50">
      <div className="container grid gap-4 px-6 py-6 sm:grid-cols-3">
        {['Live prices for your dates', 'Local pickup in Frankton', 'Online pre-check-in'].map(label => <p key={label} className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />{label}</p>)}
      </div>
    </section>

    <section className="container px-6 py-14 md:py-20" aria-labelledby="hire-options">
      <p className="text-sm font-semibold text-primary">Hamilton rental vehicles</p>
      <h2 id="hire-options" className="mt-3 text-3xl font-bold">Choose what you need to move.</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">Compare cars, cargo vans and moving trucks for Hamilton CBD, Te Rapa, Hamilton East, Hillcrest and the wider Waikato. Vehicle availability varies by date.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {hireOptions.map(({ title, icon: Icon, image, alt, to, description, uses }) => (
          <article key={to} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            <img src={image} alt={alt} className="aspect-[3/2] w-full object-cover" loading="lazy" />
            <div className="flex flex-1 flex-col p-6">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <p className="mb-6 mt-4 text-xs font-medium text-muted-foreground">{uses}</p>
              <Button asChild variant="outline" className="mt-auto w-full"><Link to={to}>Explore {title.split(' ')[0].toLowerCase()} hire <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section id="booking" className="scroll-mt-24 border-y border-border bg-muted/40">
      <div className="container grid items-start gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold text-primary">Your Hamilton hire</p>
          <h2 className="mt-3 text-3xl font-bold">Check prices &amp; availability.</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">Choose your pickup and return dates to see the vehicles available. Your quote reflects the dates, hire length and vehicle you select.</p>
          <div className="mt-8 space-y-6 border-t border-border pt-8">
            <div className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-semibold">Hamilton pickup</h3><p className="mt-1 text-muted-foreground">17 Bandon Street, Frankton, Hamilton 3204</p><Button asChild variant="link" className="h-auto px-0"><Link to="/contact/hamilton">Branch details &amp; directions <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></div>
            <div><h3 className="font-semibold">Moving house?</h3><p className="mt-2 text-muted-foreground">Compare load space before choosing a van or truck. Larger furniture and multiple rooms may call for a moving truck.</p><Button asChild variant="link" className="h-auto px-0"><Link to="/moving-cost-calculator">Plan your move <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
            <div><h3 className="font-semibold">Get ready before pickup</h3><p className="mt-2 text-muted-foreground">Complete your details and licence information online ahead of collection.</p><Button asChild variant="link" className="h-auto px-0"><Link to="/online-check-in">Online check-in <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
          </div>
        </div>
        <SearchForm defaultPickupLocation="17" defaultDropoffLocation="17" />
      </div>
    </section>

    <section className="container px-6 py-14 md:py-20" aria-labelledby="hamilton-faq">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div><p className="text-sm font-semibold text-primary">Before you book</p><h2 id="hamilton-faq" className="mt-3 text-3xl font-bold">Hamilton hire FAQs</h2><p className="mt-4 text-muted-foreground">Car rental, van hire and moving truck questions, answered.</p><Button asChild variant="outline" className="mt-6"><a href="tel:0800525663"><Phone className="mr-2 h-4 w-4" /> Talk to the team</a></Button></div>
        <Accordion type="single" collapsible className="border-t border-border">
          {faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`}><AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger><AccordionContent className="text-base leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </div>
      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8">
        {[['/moving-truck-hire-hamilton', 'Hamilton moving trucks'], ['/furniture-truck-hire-hamilton', 'Furniture truck hire'], ['/hamilton-minibus-hire', 'Hamilton minibus hire'], ['/one-way-car-hire/hamilton-to-auckland', 'Hamilton to Auckland car hire']].map(([to, label]) => <Link key={to} to={to} className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">{label}<ArrowRight className="h-4 w-4" /></Link>)}
      </div>
    </section>
  </main>
);

export default HamiltonHire;