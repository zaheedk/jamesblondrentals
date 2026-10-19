import { Link } from 'react-router-dom';
import { ArrowRight, Car, MapPin, Phone, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import roadTrip from '@/assets/hero-summer-nz-corrected.jpg';
import cargoVan from '@/assets/truck-open-doors-loading-boxes.jpg';

const hireOptions = [
  { title: 'Car hire East Auckland', icon: Car, image: roadTrip, alt: 'SUV on a New Zealand road trip', to: '/car-hire-auckland', description: 'Everyday cars and SUVs for work, visiting family or a weekend away. Compare what is available for your dates.', uses: 'Business travel · Weekends away · Replacement vehicle' },
  { title: 'Van hire East Auckland', icon: Package, image: cargoVan, alt: 'Cargo van with open rear doors and moving boxes', to: '/van-hire', description: 'Room for furniture, tools and deliveries. Cargo vans drive on a standard NZ car licence.', uses: 'Furniture runs · Trades · Small moves' },
];

const faqs = [
  { question: 'Where can I hire a car or van in East Auckland?', answer: 'Our East Auckland branch is at 6C McLennan Road, Mt Wellington. Choose Mt Wellington as your pickup location, enter your dates and compare live prices and availability online.' },
  { question: 'What vehicles can I hire from Mt Wellington?', answer: 'Mt Wellington offers cars and vans. For moving trucks, see our West Auckland truck hire branch in Glen Eden.' },
  { question: 'Is Mt Wellington handy for Panmure, Ellerslie, Howick and Botany?', answer: 'Yes. Mt Wellington is close to Penrose, Ellerslie, Panmure, Onehunga, Glen Innes and St Johns, and is an easy drive from Pakuranga, Howick, Botany and East Tamaki.' },
  { question: 'How much does car or van hire in East Auckland cost?', answer: 'Prices depend on your dates, vehicle and hire length. Search your dates for a live quote, and check the kilometre allowance and cover options before booking.' },
  { question: 'Can I hire a van for moving furniture in East Auckland?', answer: 'Cargo vans suit furniture pickups, boxes, tools and smaller moves. Compare the van load space with your items before booking. Use the moving cost calculator to plan the size you need.' },
  { question: 'Do I need a special licence to drive a hire van?', answer: 'No — our cargo vans can be driven on a full NZ Class 1 car licence or an approved overseas equivalent.' },
  { question: 'Can I return the vehicle to a different branch?', answer: 'Choose a different return location in the search to check one-way options and any charges. Availability depends on the vehicle and dates.' },
  { question: 'How can I make my Mt Wellington pickup quicker?', answer: 'Add your personal details and driving licence in your customer account before collection, and add any extra drivers in advance. See our online check-in page.' },
];

const EastAucklandHire = () => (
  <main className="bg-background text-foreground tracking-normal [&_h1]:tracking-normal [&_h2]:tracking-normal [&_h3]:tracking-normal">
    <PageSEO title="Car & Van Hire East Auckland – Mt Wellington | James Blond Rentals" description="Car hire and van hire in East Auckland from our Mt Wellington branch. Handy for Panmure, Ellerslie, Howick and Botany. Live prices and availability online." canonical="/car-van-hire-east-auckland" />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.jamesblond.co.nz/' }, { '@type': 'ListItem', position: 2, name: 'East Auckland car & van hire', item: 'https://www.jamesblond.co.nz/car-van-hire-east-auckland' }] }} />

    <section className="relative isolate overflow-hidden">
      <img src={roadTrip} alt="SUV travelling through New Zealand countryside" className="absolute inset-0 -z-20 h-full w-full object-cover object-right" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-foreground/65" />
      <div className="container px-6 py-16 md:py-24 text-primary-foreground">
        <p className="mb-5 flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4" /> James Blond Rentals · Mt Wellington, East Auckland</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">Car &amp; van hire East Auckland</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">A weekend away, a furniture run or a work job. Pick up a car or van from our Mt Wellington branch.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild variant="cta" size="lg"><a href="#booking">Check Mt Wellington availability <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          <Button asChild variant="secondary" size="lg"><a href="tel:0800525663"><Phone className="mr-2 h-4 w-4" />0800 525 663</a></Button>
        </div>
        <p className="mt-8 text-sm">6C McLennan Road · Mt Wellington · Auckland</p>
      </div>
    </section>

    <section className="border-b border-border bg-muted/50">
      <div className="container grid gap-4 px-6 py-6 sm:grid-cols-3">
        {['Live prices for your dates', 'Local pickup in Mt Wellington', 'Online pre-check-in'].map(label => <p key={label} className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />{label}</p>)}
      </div>
    </section>

    <section className="container px-6 py-14 md:py-20" aria-labelledby="hire-options">
      <p className="text-sm font-semibold text-primary">East Auckland rental vehicles</p>
      <h2 id="hire-options" className="mt-3 text-3xl font-bold">Cars and vans, close to home.</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">For Mt Wellington, Penrose, Ellerslie, Panmure, Glen Innes, Pakuranga, Howick, Botany and East Tamaki. Vehicle availability varies by date.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
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
          <p className="text-sm font-semibold text-primary">Your East Auckland hire</p>
          <h2 className="mt-3 text-3xl font-bold">Check prices &amp; availability.</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">Choose your pickup and return dates to see the vehicles available. Your quote reflects the dates, hire length and vehicle you select.</p>
          <div className="mt-8 space-y-6 border-t border-border pt-8">
            <div className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><h3 className="font-semibold">Mt Wellington pickup</h3><p className="mt-1 text-muted-foreground">6C McLennan Road, Mt Wellington, Auckland</p><Button asChild variant="link" className="h-auto px-0"><Link to="/contact/mt-wellington">Branch details &amp; directions <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></div>
            <div><h3 className="font-semibold">Moving house?</h3><p className="mt-2 text-muted-foreground">Compare van load space with your items. For a bigger move, see our West Auckland moving trucks.</p><Button asChild variant="link" className="h-auto px-0"><Link to="/moving-cost-calculator">Plan your move <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
            <div><h3 className="font-semibold">Get ready before pickup</h3><p className="mt-2 text-muted-foreground">Complete your details and licence information online ahead of collection.</p><Button asChild variant="link" className="h-auto px-0"><Link to="/online-check-in">Online check-in <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
          </div>
        </div>
        <SearchForm defaultPickupLocation="19" defaultDropoffLocation="19" preferDefaultLocation />
      </div>
    </section>

    <section className="container px-6 py-14 md:py-20" aria-labelledby="east-auckland-faq">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div><p className="text-sm font-semibold text-primary">Before you book</p><h2 id="east-auckland-faq" className="mt-3 text-3xl font-bold">East Auckland hire FAQs</h2><p className="mt-4 text-muted-foreground">Car and van hire questions, answered.</p><Button asChild variant="outline" className="mt-6"><a href="tel:0800525663"><Phone className="mr-2 h-4 w-4" /> Talk to the team</a></Button></div>
        <Accordion type="single" collapsible className="border-t border-border">
          {faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`}><AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger><AccordionContent className="text-base leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </div>
      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-8">
        {[['/car-hire-auckland', 'Auckland car hire'], ['/van-hire', 'Van hire NZ'], ['/west-auckland-truck-rentals-hire', 'West Auckland truck hire']].map(([to, label]) => <Link key={to} to={to} className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">{label}<ArrowRight className="h-4 w-4" /></Link>)}
      </div>
    </section>
  </main>
);

export default EastAucklandHire;