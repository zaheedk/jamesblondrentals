
import SearchForm from "./SearchForm";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="hero-container relative">
      {/* Optimized hero image with proper sizing */}
      <img
        src="/lovable-uploads/77a83dde-2283-4edc-8c35-e6c97bc2f296.png?w=1920&h=600&q=60&f=webp&fit=cover"
        alt="Premium car rental with mountain reflection"
        className="hero-image"
        width="1920"
        height="600"
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        sizes="100vw"
        style={{ aspectRatio: '16/9' }}
      />
      <div className="hero-overlay"></div>
      
      <div className="container mx-auto px-4 py-12 sm:py-20 md:py-28 relative z-10">
        {/* Hero content */}
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Car Van and Truck Hire New Zealand | Premium Vehicle Rentals
          </h1>
          <p className={`text-base md:text-lg text-white/90 mb-6 md:mb-8 ${isMobile ? 'hidden' : 'block'}`}>
            Premium car hire, van hire, and truck hire across Auckland, Wellington, and Christchurch. 
            Explore our fleet of luxury and economy vehicles for any occasion.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;
