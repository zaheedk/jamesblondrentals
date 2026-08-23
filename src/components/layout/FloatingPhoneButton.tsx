import React from 'react';
import { useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';

/**
 * Mobile-only floating phone action button.
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

const FloatingPhoneButton = () => {
  const location = useLocation();
  const hidden = HIDE_ON_PREFIXES.some((p) => location.pathname.startsWith(p));
  if (hidden) return null;

  return (
    <a
      href="tel:+64800525663"
      className="md:hidden fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
      aria-label="Call James Blond Rentals"
    >
      <Phone className="h-6 w-6" />
    </a>
  );
};

export default FloatingPhoneButton;
