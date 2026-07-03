import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, CalendarCheck } from 'lucide-react';

/**
 * Mobile-only sticky bottom bar with Call + Book Now.
 * Hidden on desktop, and on booking/payment/admin/chromeless routes
 * where a persistent CTA would compete with the in-page primary action.
 */
const HIDE_ON_PREFIXES = [
  '/booking',
  '/payment',
  '/customer-details',
  '/insurance-and-extras',
  '/admin',
  '/photos',
  '/photo-gallery',
  '/ra',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

const StickyMobileBookBar = () => {
  const location = useLocation();
  const hidden = HIDE_ON_PREFIXES.some((p) => location.pathname.startsWith(p));
  if (hidden) return null;

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.25)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="region"
      aria-label="Quick booking actions"
    >
      <div className="flex items-stretch gap-2 px-3 py-2">
        <a
          href="tel:+64800525663"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-primary text-primary font-semibold text-sm py-2.5 active:scale-[0.98] transition"
          aria-label="Call James Blond Rentals"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <Link
          to="/#booking-form"
          className="flex-[1.6] inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm py-2.5 shadow-md active:scale-[0.98] transition"
          aria-label="Book a rental now"
        >
          <CalendarCheck className="h-4 w-4" />
          Book Now · from $35
        </Link>
      </div>
    </div>
  );
};

export default StickyMobileBookBar;