import SearchForm from "./SearchForm";
import { useIsMobile } from "@/hooks/use-mobile";
import heroImage from "@/assets/hero-ski-season.jpg";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="hero-container relative">
      {/* Mobile-optimized hero image with responsive srcset */}
      <img
        src={heroImage}
        alt="Car rental in New Zealand - scenic drive around Lake Taupo during summer"
        className="hero-image"
        width="1920"
        height="960"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="hero-overlay"></div>
      
      <div className="container mx-auto px-4 py-12 sm:py-20 md:py-28 relative z-10">
        {/* Hero content */}
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Car, Van, Minibus & Truck Hire in Auckland, Wellington & Christchurch
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
