
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppWidget from '@/components/support/WhatsAppWidget';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default AppLayout;
