
const Hero = () => {
  return (
    <div className="relative h-[600px] text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2400')`,
        }}
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
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
