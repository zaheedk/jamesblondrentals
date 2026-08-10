import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, type LucideIcon } from 'lucide-react';

export interface PageHeroFeature {
  Icon: LucideIcon;
  title: string;
  description: string;
}

interface PageHeroProps {
  /** Small pill above the headline, e.g. "Van hire · Auckland" */
  eyebrow?: string;
  EyebrowIcon?: LucideIcon;
  heading: string;
  intro: string;
  primaryTo?: string;
  primaryHref?: string;
  primaryLabel?: string;
  phone?: string;
  phoneLabel?: string;
  features?: PageHeroFeature[];
  footnote?: ReactNode;
}

/**
 * Site-wide hero: split layout with headline + CTAs on the left and a
 * 2x2 feature card grid on the right. Shared styling for every page.
 */
const PageHero = ({
  eyebrow,
  EyebrowIcon,
  heading,
  intro,
  primaryTo,
  primaryHref,
  primaryLabel = 'Book now',
  phone = '0800525663',
  phoneLabel = '0800 525 663',
  features,
  footnote,
}: PageHeroProps) => (
  <section className="container mx-auto px-6 py-16 md:py-24">
    <div className={features?.length ? 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center' : ''}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="hero-badge mb-6">
            {EyebrowIcon && <EyebrowIcon className="w-4 h-4" />}
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
          {heading}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{intro}</p>
        <div className="flex flex-wrap gap-4 mb-6">
          {(primaryTo || primaryHref) && (
            <Button size="lg" variant="cta" asChild>
              {primaryHref ? (
                <a href={primaryHref}>
                  {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <Link to={primaryTo!}>
                  {primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </Button>
          )}
          <Button size="lg" variant="outline" asChild>
            <a href={`tel:${phone}`}>
              <Phone className="mr-2 h-4 w-4" /> {phoneLabel}
            </a>
          </Button>
        </div>
        {footnote && <p className="text-sm text-muted-foreground">{footnote}</p>}
      </div>

      {features?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  </section>
);

export default PageHero;