import PageSEO from '@/components/PageSEO';
import MovingCostCalculator from '@/components/tools/MovingCostCalculator';

const SITE_URL = 'https://www.jamesblond.co.nz';

/** Chromeless, embeddable version of the moving cost calculator (used in iframes). */
const EmbedMovingCostCalculator = () => (
  <>
    <PageSEO
      title="Moving Truck Size & Cost Calculator | James Blond"
      description="Embeddable moving truck size and cost calculator by James Blond Rentals."
      noindex
    />
    <div className="min-h-screen bg-background">
      <MovingCostCalculator embedded bookingUrl={`${SITE_URL}/booking?utm_source=embed&utm_medium=widget&utm_campaign=moving-calculator`} />
      <p className="px-6 pb-6 text-xs text-muted-foreground">
        Estimates use published James Blond Rentals rates (NZD, incl. GST).{' '}
        <a
          className="text-primary hover:underline"
          href={`${SITE_URL}/moving-cost-calculator?utm_source=embed&utm_medium=widget&utm_campaign=moving-calculator`}
          target="_blank"
          rel="noopener"
        >
          Calculator by James Blond Rentals
        </a>
      </p>
    </div>
  </>
);

export default EmbedMovingCostCalculator;
