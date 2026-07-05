import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/eco-hybrid-car-nz-landscape.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'hanmer-springs-weekend-from-christchurch-car-hire';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-06-26';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Hanmer Springs weekend from Christchurch: car-hire itinerary',
  description:
    'How to plan a two-day Hanmer Springs weekend from Christchurch — driving times, thermal pools, best rental car and the return via Waipara wine country.',
  image: `${SITE_URL}${heroImg}`,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { '@type': 'Organization', name: 'James Blond Rentals' },
  publisher: {
    '@type': 'Organization',
    name: 'James Blond Rentals',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    { '@type': 'ListItem', position: 3, name: 'Hanmer Springs weekend from Christchurch', item: URL },
  ],
};

const ChristchurchHanmerSprings = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Hanmer Springs Weekend from Christchurch: Car-Hire Itinerary (2026)"
      description="Plan a two-day Hanmer Springs weekend from Christchurch. Driving times, thermal pools, best rental car and how to loop back via Waipara wine country."
      canonical={`/blog/${SLUG}`}
      ogType="article"
      ogImage={`${SITE_URL}${heroImg}`}
    />
    <JsonLd data={articleLd} />
    <JsonLd data={breadcrumbLd} />

    <div className="container mx-auto px-6 pt-12 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
    </div>

    <header className="container mx-auto px-6 pt-8 pb-10 max-w-3xl">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Canterbury · Weekend</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        Hanmer Springs weekend from Christchurch: the car-hire itinerary
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 26 June 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 7 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> 135 km north</span>
      </div>
    </header>

    <img src={heroImg} alt="Hire car on the Waipara wine-country road between Christchurch and Hanmer Springs" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        Hanmer Springs sits 135&nbsp;km north of Christchurch — an alpine thermal village that's
        become Canterbury's favourite weekend escape. With a hire car you can leave the city after
        lunch on Friday and be soaking in a hot pool by dinner.
      </p>

      <h2>Getting there</h2>
      <p>
        Drive time is about <strong>1 hour 45 minutes</strong> via SH1 north to Waipara, then SH7
        inland to the Hanmer Springs turn-off. The road is sealed and easy — any car in our{' '}
        <Link to="/car-hire-christchurch">Christchurch car hire range</Link> handles it.
      </p>

      <h2>Two-day itinerary</h2>
      <h3>Day 1 — Christchurch to Hanmer Springs</h3>
      <ul>
        <li>Pick up your car mid-morning at our Moorhouse Ave branch.</li>
        <li>Coffee &amp; lunch stop in Waipara — Pegasus Bay or Black Estate winery.</li>
        <li>Check in to your accommodation by 4&nbsp;pm.</li>
        <li>Sunset session at the Hanmer Springs Thermal Pools.</li>
      </ul>
      <h3>Day 2 — activities and the return</h3>
      <ul>
        <li>Morning walk in Conical Hill or Waterfall Track.</li>
        <li>Optional: jet-boat, bungy or MTB at Hanmer Adventure.</li>
        <li>Late-lunch loop back via Waipara wineries.</li>
        <li>Drop off in central Christchurch or at the airport by 6&nbsp;pm.</li>
      </ul>

      <h2>Best rental for a Hanmer weekend</h2>
      <p>
        For a couple, our <Link to="/fleet/cars/premium-economy">Premium Economy</Link> is the
        cheapest option. For a family or ski-weekend combo (Hanmer's Amuri Ski Area is 45 minutes
        further on), step up to a <Link to="/fleet/cars/premium-compact-suv">Premium Compact SUV</Link>
        {' '}or the <Link to="/fleet/cars/premium-awd-suv">Premium AWD SUV</Link> for winter.
      </p>

      <h2>Book your Christchurch car</h2>
      <p>
        <Link to="/car-hire-christchurch">→ Christchurch car hire — check availability</Link><br />
        <Link to="/blog/akaroa-day-trip-from-christchurch-car-hire-guide">→ Akaroa day-trip guide</Link><br />
        <Link to="/blog/mt-hutt-ski-guide-awd-hire-christchurch">→ Mt Hutt ski guide</Link>
      </p>
    </div>
  </article>
);

export default ChristchurchHanmerSprings;