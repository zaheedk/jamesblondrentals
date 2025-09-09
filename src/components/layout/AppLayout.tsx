
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from '@/components/chat/ChatWidget';
import { ResourcePreloader } from '@/components/ResourcePreloader';
import { ImageOptimizer } from '@/components/ImageOptimizer';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <ResourcePreloader />
      <ImageOptimizer />
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
