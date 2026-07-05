import JsonLd from './JsonLd';

const SITE_URL = 'https://jamesblond.co.nz';

/**
 * Global Organization + AggregateRating structured data.
 * Rendered once via AppLayout so every page ships a business-level
 * rating signal — improves rich-result eligibility and gives LLM
 * search engines (ChatGPT, Perplexity, Gemini) a trust signal to cite.
 */
const SiteJsonLd = () => {
  const organization = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'AutoRental'],
    '@id': `${SITE_URL}/#organization`,
    name: 'James Blond Rentals',
    alternateName: 'James Blond Car, Van & Truck Hire',
    url: SITE_URL,
    logo: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    image: `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`,
    telephone: '+64800525663',
    email: 'info@jamesblond.co.nz',
    priceRange: '$$',
    foundingDate: '2004',
    description:
      "New Zealand's leading independent car, van, minibus and truck rental company. Branches in Auckland, Auckland Airport, West Auckland, South Auckland, Wellington, Christchurch and Hamilton.",
    areaServed: [
      { '@type': 'Country', name: 'New Zealand' },
      { '@type': 'City', name: 'Auckland' },
      { '@type': 'City', name: 'Wellington' },
      { '@type': 'City', name: 'Christchurch' },
      { '@type': 'City', name: 'Hamilton' },
    ],
    sameAs: [
      'https://www.facebook.com/jamesblondrentals',
      'https://www.instagram.com/jamesblondrentals',
      'https://www.google.com/search?q=James+Blond+Rentals',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1247',
      reviewCount: '1247',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'James Blond Rentals',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/vehicles?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={[organization, website]} />;
};

export default SiteJsonLd;