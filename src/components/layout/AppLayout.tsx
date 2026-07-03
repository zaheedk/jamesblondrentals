import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { ResourcePreloader } from '@/components/ResourcePreloader';
import PromoBanner from './PromoBanner';
import EarlyWeekBanner from './EarlyWeekBanner';
import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import SocialProofNotifications from '@/components/SocialProofNotifications';
import StickyMobileBookBar from './StickyMobileBookBar';

const CHROMELESS_ROUTES = ['/admin/rental-agreement', '/photos', '/photo-gallery', '/ra'];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isChromeless = CHROMELESS_ROUTES.some(route => location.pathname.startsWith(route));

  if (isChromeless) {
    return (
      <div className="min-h-screen bg-background">
        <BreadcrumbsJsonLd />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbsJsonLd />
      <ResourcePreloader />
      <PromoBanner />
      <EarlyWeekBanner />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <SocialProofNotifications />
      <StickyMobileBookBar />
      {/* Reserve space so the sticky bar never covers page content on mobile */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </div>
  );
};

export default AppLayout;
