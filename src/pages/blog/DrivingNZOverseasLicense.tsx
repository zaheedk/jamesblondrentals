import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, MapPin } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import heroImg from '@/assets/auckland-car-rental-coastal-road.jpg';

const SITE_URL = 'https://jamesblond.co.nz';
const SLUG = 'driving-in-new-zealand-with-overseas-license';
const URL = `${SITE_URL}/blog/${SLUG}`;
const PUBLISHED = '2026-07-09';

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Driving in New Zealand with an Overseas Licence: The Complete 2026 Guide',
  description:
    'Everything overseas visitors need to drive a rental car in New Zealand — licence rules for US, UK, Australia and China drivers, insurance, road rules and common mistakes.',
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
    { '@type': 'ListItem', position: 3, name: 'Driving in NZ with an Overseas Licence', item: URL },
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need an international driver’s licence to drive in New Zealand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, an International Driving Permit (IDP) is not required if your overseas licence is in English. If your licence is in another language you must carry either an accurate English translation from an approved provider (NZTA, embassy, or authorised translator) or an IDP. You can drive in New Zealand on a valid overseas licence for up to 12 months.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I drive in New Zealand with a US driver’s licence?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A current US state driver’s licence is accepted for up to 12 months. You do not need an IDP because the licence is already in English. Bring the physical card — photos or app-only licences are not accepted at rental counters.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do UK drivers need anything extra to hire a car in New Zealand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. A full UK photocard licence is accepted for up to 12 months. Provisional licences are not accepted. Remember New Zealand drives on the left, the same as the UK.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Australians drive in New Zealand on their Australian licence?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A full Australian state or territory licence is valid in New Zealand for up to 12 months. Learner and P1 licences are not accepted for rental vehicles.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Chinese drivers hire a rental car in New Zealand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, but you must present your Chinese licence together with an accurate English translation from an NZTA-approved translator, or an International Driving Permit issued in China before you arrived. We can also arrange a certified translation at pickup.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need rental car insurance in New Zealand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'New Zealand law does not require you to buy additional cover, but hiring without it exposes you to the full vehicle value if you have an accident. Every James Blond rental includes Basic cover with a bond; most overseas visitors upgrade to Premium or Ultimate to reduce the excess to zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum age to rent a car in New Zealand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You must be at least 21 years old with a full licence held for 12 months or more to rent from James Blond Rentals. Drivers under 25 may have limited vehicle options.',
      },
    },
  ],
};

const DrivingNZOverseasLicense = () => (
  <article className="bg-background text-foreground">
    <PageSEO
      title="Driving in NZ with an Overseas Licence: Complete Guide (2026)"
      description="Overseas visitor driving in New Zealand? Licence rules for US, UK, Australia and China drivers, rental insurance, IDP requirements and key NZ road rules explained."
      canonical={`/blog/${SLUG}`}
      ogType="article"
      ogImage={`${SITE_URL}${heroImg}`}
    />
    <JsonLd data={articleLd} />
    <JsonLd data={breadcrumbLd} />
    <JsonLd data={faqLd} />

    <div className="container mx-auto px-6 pt-12 max-w-3xl">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>
    </div>

    <header className="container mx-auto px-6 pt-8 pb-10 max-w-3xl">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Visitor guide · Licensing</p>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
        Driving in New Zealand with an overseas licence: the complete 2026 guide
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 9 July 2026</span>
        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> 10 min read</span>
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> New Zealand</span>
      </div>
    </header>

    <img src={heroImg} alt="Rental car on a coastal New Zealand highway — overseas licence driving guide" className="w-full max-h-[520px] object-cover" loading="eager" />

    <div className="container mx-auto px-6 py-14 max-w-3xl prose prose-lg prose-neutral dark:prose-invert">
      <p className="lead text-xl leading-relaxed">
        If you’re flying into Auckland, Wellington or Christchurch and picking up a rental car,
        the good news is that New Zealand makes it easy for overseas visitors to drive. You can use
        your home country licence for up to <strong>12 months</strong> — no NZ licence needed — provided
        you meet a few simple conditions. Here’s exactly what you need to know before you get behind
        the wheel.
      </p>

      <h2>The basic rules for driving in NZ on an overseas licence</h2>
      <ul>
        <li>Your licence must be <strong>current and valid</strong> (not expired).</li>
        <li>You must carry the <strong>physical licence</strong> with you whenever you drive.</li>
        <li>If it is <strong>not in English</strong>, you also need an accurate English translation
          from NZTA, your embassy, an authorised translator, or an International Driving Permit (IDP).</li>
        <li>You can only drive vehicles in the same class as your home licence permits.</li>
        <li>After 12 months of living in NZ you must convert to a New Zealand licence — this doesn’t
          apply to tourists on shorter visits.</li>
      </ul>

      <h2>Do I need an International Driver’s Licence (IDP) for New Zealand?</h2>
      <p>
        Short answer: <strong>only if your licence is not in English.</strong> An IDP is essentially
        a certified translation of your home licence. If you hold a US, UK, Canadian, Australian,
        Irish, South African or NZ-English licence, you do <em>not</em> need an IDP — your licence
        already works.
      </p>
      <p>
        “International driver’s licence NZ” is one of the top searches from visitors, and the
        confusion is understandable: NZ Police and rental companies will always accept an IDP, so
        many travellers get one “just in case.” That’s fine, but for English-language licences it’s
        not a legal requirement.
      </p>

      <h2>Country-by-country: what licence do you need?</h2>

      <h3>United States</h3>
      <p>
        Any valid US state licence is accepted for up to 12 months. Bring the physical card —
        mobile/app licences (Apple Wallet, state DMV apps) are <strong>not accepted</strong> at
        rental counters or by NZ Police. Remember: NZ drives on the <strong>left</strong>, gives
        way differently at intersections, and speed limits are in <strong>km/h</strong>.
      </p>

      <h3>United Kingdom</h3>
      <p>
        Full UK photocard licences are accepted for up to 12 months. Provisional (learner) licences
        are <strong>not</strong> accepted. If you still have the old paper counterpart, you don’t
        need to bring it — the photocard is enough.
      </p>

      <h3>Australia</h3>
      <p>
        Full Australian state and territory licences (NSW, VIC, QLD, WA, SA, TAS, ACT, NT) are
        accepted for up to 12 months. Learner and P1 licences are <strong>not</strong> accepted for
        hire vehicles. Digital licences on the Service NSW or myGov app are not accepted at pickup
        — bring the physical card.
      </p>

      <h3>China</h3>
      <p>
        Chinese driver licences are accepted <strong>only</strong> alongside one of the following:
      </p>
      <ul>
        <li>A certified English translation from an NZTA-approved translator (we can arrange this at pickup for a small fee).</li>
        <li>An International Driving Permit issued in China <em>before</em> you arrived in NZ (IDPs cannot be issued once you’re in New Zealand).</li>
      </ul>

      <h3>Other countries</h3>
      <p>
        If your licence is in a non-English language (Japanese, Korean, Thai, Arabic, French,
        German, Spanish, etc.), the same rule applies: bring your licence plus either an approved
        English translation or an IDP.
      </p>

      <h2>Insurance: do I need rental car insurance in New Zealand?</h2>
      <p>
        New Zealand law does <strong>not</strong> require you to purchase additional rental
        insurance, and there is no personal auto policy from home that will typically cover a
        rental here (US and Canadian credit-card cover is often void once you leave North America).
        Every James Blond rental includes:
      </p>
      <ul>
        <li><strong>Basic cover</strong> — included in every rate. Comes with a bond/excess of up to $3,900 depending on vehicle class.</li>
        <li><strong>Premium cover</strong> — popular with tourists. Reduces the excess to $500.</li>
        <li><strong>Ultimate cover</strong> — zero excess. Recommended for South Island alpine touring, campervan-style trips or long itineraries.</li>
      </ul>
      <p>
        See <Link to="/price-guide">our price guide</Link> for current cover pricing, or add cover
        at checkout when you book.
      </p>

      <h2>NZ road rules overseas visitors most often get caught by</h2>
      <ul>
        <li><strong>We drive on the LEFT.</strong> Same as UK, Australia, Japan. Opposite of US, Europe, most of Asia.</li>
        <li><strong>Give way rules.</strong> At a T-intersection the terminating road gives way. At uncontrolled intersections, give way to any vehicle coming from your right.</li>
        <li><strong>Speed limits are in km/h.</strong> Open road is 100 km/h, urban areas 50 km/h, many rural roads are now 80 km/h.</li>
        <li><strong>Seatbelts are compulsory</strong> for every passenger, every seat, every trip. Fines apply to the driver.</li>
        <li><strong>Zero mobile phone use</strong> while driving — including at traffic lights. Use a mounted holder and hands-free only.</li>
        <li><strong>Alcohol limit is 0.05</strong> (250 mg/L breath) for drivers 20+, and <strong>zero</strong> for drivers under 20.</li>
        <li><strong>One-lane bridges</strong> are common on rural roads. A red arrow means give way to oncoming traffic.</li>
        <li><strong>Passing lanes are short.</strong> Don’t tailgate — wait for the marked passing lane.</li>
      </ul>

      <h2>What you actually need at the rental counter</h2>
      <ol>
        <li>Your <strong>physical driver licence</strong> (not a photo, not a phone).</li>
        <li>An <strong>English translation or IDP</strong> if your licence isn’t in English.</li>
        <li>A <strong>credit or debit card</strong> in the driver’s name for the bond.</li>
        <li>Your <strong>booking confirmation</strong> (email or printout).</li>
        <li><strong>Passport</strong> — recommended for ID verification.</li>
      </ol>

      <h2>Common mistakes overseas visitors make</h2>
      <ul>
        <li><strong>Booking a car too small.</strong> NZ roads are winding and hilly. If you’re driving Auckland–Wellington or the South Island loop, size up to a Premium Midsize or Compact SUV.</li>
        <li><strong>Skipping insurance upgrade.</strong> Gravel roads and wildlife (especially in Fiordland and the West Coast) cause more claims than city driving.</li>
        <li><strong>Underestimating drive times.</strong> Google Maps times are optimistic — add 20% for realistic planning.</li>
        <li><strong>Trying to drive too far in one day.</strong> Auckland to Wellington is 640 km / 8.5 hours minimum.</li>
      </ul>

      <h2>Ready to book?</h2>
      <p>
        We’re a Kiwi-owned rental company with branches at every major arrival point in New
        Zealand. Book online in about 60 seconds and pick up your car at the airport or in the
        city.
      </p>
      <p>
        <Link to="/airport/auckland">→ Auckland Airport car hire</Link><br />
        <Link to="/airport/wellington">→ Wellington Airport car hire</Link><br />
        <Link to="/airport/christchurch">→ Christchurch Airport car hire</Link><br />
        <Link to="/one-way-car-hire">→ One-way hire between the North and South Islands</Link><br />
        <Link to="/fleet/cars">→ Browse the full car fleet</Link>
      </p>
    </div>

    <aside className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 py-14 max-w-3xl">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">Related reading</p>
        <ul className="space-y-3">
          <li>
            <Link to="/blog/akaroa-day-trip-from-christchurch-car-hire-guide" className="hover:text-primary">
              → Akaroa day trip from Christchurch — the complete car-hire guide
            </Link>
          </li>
          <li>
            <Link to="/blog/one-way-car-hire-christchurch-to-queenstown" className="hover:text-primary">
              → One-way car hire: Christchurch to Queenstown
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-primary">
              → Rental FAQs — age, bond, insurance and pickup
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  </article>
);

export default DrivingNZOverseasLicense;