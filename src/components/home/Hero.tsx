
import SearchForm from "./SearchForm";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="hero-container relative">
      {/* Mobile-optimized hero image with responsive srcset */}
      <img
        src="/lovable-uploads/77a83dde-2283-4edc-8c35-e6c97bc2f296.png?w=800&h=400&q=50&f=webp&fit=cover"
        srcSet="/lovable-uploads/77a83dde-2283-4edc-8c35-e6c97bc2f296.png?w=480&h=240&q=45&f=webp&fit=cover 480w,
                /lovable-uploads/77a83dde-2283-4edc-8c35-e6c97bc2f296.png?w=800&h=400&q=50&f=webp&fit=cover 800w,
                /lovable-uploads/77a83dde-2283-4edc-8c35-e6c97bc2f296.png?w=1200&h=600&q=55&f=webp&fit=cover 1200w"
        sizes="100vw"
        alt="Best price car rental with mountain reflection"
        className="hero-image"
        width="800"
        height="400"
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
