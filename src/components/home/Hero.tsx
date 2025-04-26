
import SearchForm from "./SearchForm";

const Hero = () => {
  return (
    <div className="relative bg-cover bg-center text-white" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/lovable-uploads/c035e15d-1147-4064-8160-f30639544281.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Premium Car Rentals for Your Journey
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
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
