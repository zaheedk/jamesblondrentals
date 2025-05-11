
import { useState, useEffect } from "react";
import SearchForm from "./SearchForm";

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Preload the hero image
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=75'; // Lower quality, smaller size
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className="relative min-h-[500px] md:min-h-[600px]">
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=75')`, // Lower quality, smaller size for mobile
          backgroundColor: '#1a365d', // Placeholder color while image loads
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container mx-auto px-4 py-12 sm:py-20 md:py-28 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Premium Car, Van and Truck Rentals for Your Journey
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8">
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
