
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GoogleAnalytics from "../analytics/GoogleAnalytics";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  
  // Effect to handle scrolling to top and focusing on main content when route changes
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Set focus to main content for accessibility
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // Set tabIndex to -1 so it's not in the regular tab order but can receive focus programmatically
      mainContent.tabIndex = -1;
      mainContent.focus({ preventScroll: true }); // Focus without additional scrolling
    }
  }, [location.pathname]); // Dependency on pathname ensures this runs on route changes

  return (
    <div className="flex flex-col min-h-screen">
      <GoogleAnalytics />
      <Navbar />
      <main id="main-content" className="flex-grow outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
