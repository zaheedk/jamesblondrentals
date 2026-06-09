import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
}

const SITE_URL = 'https://jamesblond.co.nz';
const DEFAULT_OG_IMAGE = `${SITE_URL}/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png`;

const PageSEO = ({ title, description, canonical, noindex, ogImage, ogType = 'website' }: PageSEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={`${SITE_URL}${canonical}`} />}
    {noindex && <meta name="robots" content="noindex, nofollow" />}

    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    {canonical && <meta property="og:url" content={`${SITE_URL}${canonical}`} />}
    <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />
  </Helmet>
);

export default PageSEO;
