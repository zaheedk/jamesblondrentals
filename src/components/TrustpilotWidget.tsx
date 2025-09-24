import { useEffect } from 'react';

const TrustpilotWidget = () => {
  useEffect(() => {
    // Load Trustpilot script if not already loaded
    if (typeof (window as any).Trustpilot === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;
      document.head.appendChild(script);
    } else {
      // If script is already loaded, just reload the widgets
      (window as any).Trustpilot.loadFromElement(document.querySelector('.trustpilot-widget'));
    }
  }, []);

  return (
    <div className="w-full">
      <div 
        className="trustpilot-widget" 
        data-locale="en-US" 
        data-template-id="56278e9abfbbba0bdcd568bc" 
        data-businessunit-id="644255b4e1aca5253183e2b7" 
        data-style-height="52px" 
        data-style-width="100%" 
        data-token="120d6c80-aefe-44e5-b4f6-dddcd800ab93"
      >
        <a 
          href="https://www.trustpilot.com/review/jamesblond.co.nz" 
          target="_blank" 
          rel="noopener"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
};

export default TrustpilotWidget;