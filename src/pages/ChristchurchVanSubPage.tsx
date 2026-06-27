import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Truck, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/home/SearchForm';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { christchurchVanPages, getChristchurchVanPageBySlug, type ChristchurchVanPage } from '@/lib/christchurch-van-pages';

const SITE_URL = 'https://jamesblond.co.nz';

interface Props {
  page?: ChristchurchVanPage;
}

const ChristchurchVanSubPage = ({ page: pageProp }: Props) => {
  const params = useParams<{ slug: string }>();
  const page = pageProp ?? (params.slug ? getChristchurchVanPageBySlug(params.slug) : undefined);

  if (!page) {
    return <Navigate to="/van-hire-christchurch" replace />;
  }

  const pageUrl = `${SITE_URL}${page.path}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Van Hire Christchurch', item: `${SITE_URL}/van-hire-christchurch` },
      { '@type': 'ListItem', position: 3, name: page.breadcrumbLabel, item: pageUrl },
    ],
  };

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: `James Blond Rentals — ${page.breadcrumbLabel}`,
    image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    url: pageUrl,
    telephone: '+64-3-3651-122',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Christchurch',
      addressRegion: 'Canterbury',
      addressCountry: 'NZ',
    },
    areaServed: [page.locationName, 'Christchurch', 'Canterbury'],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1200' },
  };

  const related = christchurchVanPages.filter((p) => p.slug !== page.slug).slice(0, 4);

  return (
    <div className="bg-background text-foreground">
      <PageSEO title={page.metaTitle} description={page.metaDescription} canonical={page.path} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localBusinessLd} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-6 pt-6 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li>/</li>
          <li><Link to="/van-hire-christchurch" className="hover:text-primary">Van Hire Christchurch</Link></li>
          <li>/</li>
          <li aria-current="page" className="text-foreground">{page.breadcrumbLabel}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)] flex flex-col justify-between p-8 md:p-16">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{page.eyebrow}</span>
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-5 w-5" />
              <span className="text-lg font-semibold">Van Hire</span>
            </div>
            <div className="h-px w-full bg-[hsl(0_0%_70%)] mb-10" />
            <h1 className="font-sans font-extrabold tracking-tight text-4xl md:text-5xl leading-[1.05]">
              {page.h1}
            </h1>
            <p className="mt-6 text-base md:text-lg text-[hsl(0_0%_30%)]">{page.intro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg" className="rounded-none px-7">
                <a href="#booking">Check availability</a>
              </Button>
              <a href="tel:+6433651122" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                <Phone className="h-4 w-4" /> Call our Christchurch branch
              </a>
            </div>
          </div>
        </div>
        <div className="bg-[hsl(0_0%_18%)] flex items-center justify-center p-8 md:p-16">
          <div className="relative w-full max-w-md">
            <img src={page.heroImage} alt={page.heroAlt} className="w-full aspect-square object-cover rounded-3xl shadow-2xl" loading="eager" />
            <div className="absolute -bottom-5 -left-5 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-xl">
              <p className="text-[10px] uppercase tracking-widest opacity-80">From</p>
              <p className="font-extrabold text-2xl leading-none">{page.fromPrice} / day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Body content */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-4xl space-y-6">
        {page.bodyParagraphs.map((p, i) => (
          <p key={i} className="text-lg text-muted-foreground leading-relaxed">{p}</p>
        ))}
        <div className="pt-6">
          <Link
            to={page.recommendedVanSlug}
            className="inline-flex items-center gap-2 text-sm font-semibold border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
          >
            See the {page.recommendedVanName} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-[hsl(0_0%_92%)] text-[hsl(0_0%_8%)]">
        <div className="container mx-auto px-6 py-20">
          <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl mb-12 max-w-2xl">
            What people use this van for
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {page.useCases.map((u, i) => (
              <div key={u.title}>
                <span className="font-sans font-extrabold text-4xl text-primary">0{i + 1}</span>
                <h3 className="font-sans font-extrabold text-xl mt-3 tracking-tight">{u.title}</h3>
                <p className="mt-3 text-[hsl(0_0%_30%)] leading-relaxed">{u.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="border-t border-border scroll-mt-20">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl">Book your {page.locationName} van</h2>
            <p className="mt-4 text-muted-foreground">Live availability across our Christchurch van fleet.</p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">Questions</span>
        </div>
        <div className="h-px w-full bg-border mb-8" />
        <h2 className="font-sans font-extrabold tracking-tight text-3xl md:text-4xl mb-10">{page.breadcrumbLabel} FAQ</h2>
        <dl className="divide-y divide-border border-y border-border">
          {page.faqs.map((f) => (
            <div key={f.question} className="py-6 grid md:grid-cols-3 gap-6">
              <dt className="font-sans font-bold text-xl tracking-tight">{f.question}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related Christchurch van pages */}
      <section className="border-t border-border bg-[hsl(0_0%_18%)] text-[hsl(0_0%_92%)]">
        <div className="container mx-auto px-6 py-16">
          <h2 className="font-sans font-extrabold tracking-tight text-2xl md:text-3xl mb-8">More Christchurch &amp; Canterbury van hire</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/van-hire-christchurch" className="block p-5 rounded-xl bg-[hsl(0_0%_24%)] hover:bg-[hsl(0_0%_30%)] transition-colors">
              <p className="text-xs uppercase tracking-widest opacity-70">Main hub</p>
              <p className="mt-2 font-semibold">Van Hire Christchurch</p>
            </Link>
            {related.map((r) => (
              <Link key={r.slug} to={r.path} className="block p-5 rounded-xl bg-[hsl(0_0%_24%)] hover:bg-[hsl(0_0%_30%)] transition-colors">
                <p className="text-xs uppercase tracking-widest opacity-70">{r.eyebrow}</p>
                <p className="mt-2 font-semibold">{r.breadcrumbLabel}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChristchurchVanSubPage;