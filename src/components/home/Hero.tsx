
import SearchForm from "./SearchForm";

const Hero = () => {
  return (
    <div className="relative bg-cover bg-center text-white" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '800px'
    }}>
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10"> {/* Reduced padding to move content up */}
        <div className="max-w-3xl mx-auto text-center mb-6"> {/* Reduced margin bottom */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"> {/* Reduced margin bottom */}
            Premium Car Rentals for Your Journey
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6"> {/* Adjusted margin bottom */}
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
