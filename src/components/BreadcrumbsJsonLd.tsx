import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://jamesblond.co.nz';

const toTitle = (slug: string) =>
  slug
    .split('-')
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    // Common cleanups
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bThe\b/g, 'the');

/**
 * Auto-generated BreadcrumbList JSON-LD based on the current pathname.
 * Mounted once in AppLayout so every route gets breadcrumb structured data.
 * Skipped on the homepage and admin/transactional routes.
 */
const BreadcrumbsJsonLd = () => {
  const { pathname } = useLocation();

  if (
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/ra') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/customer-details') ||
    pathname.startsWith('/insurance-and-extras') ||
    pathname.startsWith('/photos') ||
    pathname.startsWith('/photo-gallery') ||
    pathname.startsWith('/airport/') ||
    pathname.startsWith('/contact/')
  ) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
    ...segments.map((seg, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: toTitle(decodeURIComponent(seg)),
      item: `${SITE_URL}/${segments.slice(0, i + 1).join('/')}`,
    })),
  ];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default BreadcrumbsJsonLd;