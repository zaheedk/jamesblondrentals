import SearchForm from "./SearchForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="hero-container relative">
      {/* Responsive WebP hero image with JPEG fallback */}
      <picture>
        <source
          srcSet="/hero-spring-768w.webp 768w, /hero-spring-1200w.webp 1200w, /hero-spring-1920w.webp 1920w"
          sizes="100vw"
          type="image/webp"
        />
        <img
          src="/hero-spring.jpg"
          alt="Car rental in New Zealand - scenic spring drive through green hills and mountain roads"
          className="hero-image"
          width="1920"
          height="960"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
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

        <div id="booking-form" className="max-w-4xl mx-auto scroll-mt-20">
          <SearchForm />
        </div>

        {/* Descriptive internal links to key city hubs */}
        <nav aria-label="Popular hire pages" className="max-w-4xl mx-auto mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <Link to="/car-hire-auckland" className="text-white/90 underline hover:text-white">Car hire Auckland</Link>
          <Link to="/auckland-airport-car-rentals" className="text-white/90 underline hover:text-white">Auckland Airport car rental</Link>
          <Link to="/auckland-truck-rentals-hire" className="text-white/90 underline hover:text-white">Truck hire Auckland</Link>
          <Link to="/van-hire-auckland" className="text-white/90 underline hover:text-white">Van hire Auckland</Link>
        </nav>
      </div>
    </div>
  );
};

export default Hero;
