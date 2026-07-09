import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/**
 * Visible hub-and-spoke breadcrumbs for Christchurch pages.
 * JSON-LD equivalent lives in BreadcrumbsJsonLd (auto-mounted in AppLayout);
 * this component renders the *visible* trail so users and Google see the
 * same hierarchy: Home > Christchurch > <Page>.
 */
const CHRISTCHURCH_HUB = '/car-hire-christchurch';

const CHRISTCHURCH_PAGES: Record<string, string> = {
  '/car-hire-christchurch': 'Car Hire',
  '/truck-hire-christchurch': 'Truck Hire',
  '/van-hire-christchurch': 'Van Hire',
  '/central-christchurch-car-hire': 'Central Christchurch Car Hire',
  '/central-christchurch-truck-hire': 'Central Christchurch Truck Hire',
  '/central-christchurch-van-hire': 'Central Christchurch Van Hire',
  '/airport/christchurch': 'Christchurch Airport',
  '/contact/christchurch': 'Contact Christchurch',
  '/contact/christchurch-central': 'Contact Christchurch Central',
};

const ChristchurchBreadcrumbs = () => {
  const { pathname } = useLocation();
  const label = CHRISTCHURCH_PAGES[pathname];
  if (!label) return null;

  const isHub = pathname === CHRISTCHURCH_HUB;

  return (
    <div className="container mx-auto px-4 pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {isHub ? (
            <BreadcrumbItem>
              <BreadcrumbPage>Christchurch</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={CHRISTCHURCH_HUB}>Christchurch</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ChristchurchBreadcrumbs;