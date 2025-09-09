
import SearchForm from "./SearchForm";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-[500px] md:min-h-[600px]">
      {/* Hero image with proper dimensions and optimization */}
      <img
        src="/lovable-uploads/77a83dde-2283-4edc-8c35-e6c97bc2f296.png"
        alt="Premium car rental with mountain reflection"
        className="absolute inset-0 w-full h-full object-cover"
        width="1920"
        height="600"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container mx-auto px-4 py-12 sm:py-20 md:py-28 relative z-10">
        {/* Hero content */}
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Premium Car, Van and Truck Rentals for Your Journey
          </h1>
          <p className={`text-base md:text-lg text-white/90 mb-6 md:mb-8 ${isMobile ? 'hidden' : 'block'}`}>
            Explore our fleet of luxury and economy vehicles for any occasion.
            Book with ease and hit the road with confidence.
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
