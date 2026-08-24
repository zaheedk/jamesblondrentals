import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ResourcePreloader } from '@/components/ResourcePreloader';
import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import SiteJsonLd from '@/components/SiteJsonLd';
import ChristchurchBreadcrumbs from '@/components/ChristchurchBreadcrumbs';
import SocialProofNotifications from '@/components/SocialProofNotifications';
import FloatingPhoneButton from './FloatingPhoneButton';

const CHROMELESS_ROUTES = ['/admin/rental-agreement', '/photos', '/photo-gallery', '/ra', '/embed/'];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isChromeless = CHROMELESS_ROUTES.some(route => location.pathname.startsWith(route));

  if (isChromeless) {
    return (
      <div className="min-h-screen bg-background">
        <SiteJsonLd />
        <BreadcrumbsJsonLd />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteJsonLd />
      <BreadcrumbsJsonLd />
      <ResourcePreloader />
      <Navbar />
      <main className="flex-1">
        <ChristchurchBreadcrumbs />
        {children}
      </main>
      <Footer />
      <SocialProofNotifications />
      <FloatingPhoneButton />
    </div>
  );
};

export default AppLayout;
