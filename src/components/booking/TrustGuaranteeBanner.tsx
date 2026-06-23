import React from 'react';
import { ShieldCheck, BadgePercent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustGuaranteeBannerProps {
  className?: string;
}

const TrustGuaranteeBanner = ({ className }: TrustGuaranteeBannerProps) => {
  return (
    <div
      className={cn(
        "w-full bg-muted/50 border-y",
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BadgePercent className="h-5 w-5 text-primary flex-shrink-0" />
            <span>Best Price Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustGuaranteeBanner;
