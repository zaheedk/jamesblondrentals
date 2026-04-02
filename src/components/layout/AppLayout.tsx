
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { ResourcePreloader } from '@/components/ResourcePreloader';

const CHROMELESS_ROUTES = ['/admin/rental-agreement', '/photos', '/photo-gallery', '/ra'];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isChromeless = CHROMELESS_ROUTES.some(route => location.pathname.startsWith(route));

  if (isChromeless) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ResourcePreloader />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default AppLayout;
