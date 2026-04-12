import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
}

const SITE_URL = 'https://jamesblond.co.nz';

const PageSEO = ({ title, description, canonical, noindex }: PageSEOProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={`${SITE_URL}${canonical}`} />}
    {noindex && <meta name="robots" content="noindex, nofollow" />}
  </Helmet>
);

export default PageSEO;
