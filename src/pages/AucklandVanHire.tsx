import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Users, Shield, Clock, Phone, Star } from 'lucide-react';
import vanImage from '@/assets/12-seater-van-auckland-sky-tower.jpg';
import vanInteriorImage from '@/assets/12-seater-van-interior-auckland.jpg';
import fleetImage from '@/assets/auckland-van-fleet-sky-tower.jpg';
import PageSEO from '@/components/PageSEO';
import SearchForm from '@/components/home/SearchForm';


const AucklandVanHire = () => {
  useEffect(() => {
    document.title = '12 Seater Van Hire Auckland | Group Transport | James Blond Car Rentals';
    
    // SEO meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional 12 seater van hire in Auckland. Perfect for group transport, airport transfers, and city tours. Competitive rates and premium vehicles available.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Professional 12 seater van hire in Auckland. Perfect for group transport, airport transfers, and city tours. Competitive rates and premium vehicles available.';
      document.head.appendChild(meta);
    }
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Seats 12 Passengers',
      description: 'Comfortable seating for up to 12 people with ample legroom'
    },
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'Comprehensive insurance coverage and 24/7 roadside assistance'
    },
    {
      icon: Clock,
      title: 'Flexible Booking',
      description: 'Hourly, daily, weekly rates available for all trip types'
    },
    {
      icon: MapPin,
      title: 'Auckland Wide',
      description: 'Service across Auckland including airport transfers'
    }
  ];

  const destinations = [
    'Auckland CBD & Sky Tower',
    'Auckland Airport Transfers',
    'Waiheke Island Ferry Terminal',
    'North Shore Beaches',
    'Waitakere Ranges',
    'Auckland Museum & Domain'
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="12-Seater Van Hire Auckland from $129/day — Minibus Rental" description="Rent a 12-seater van or minibus in Auckland from $129/day for group travel, sports teams and events. Same-day pickup, drive on a car licence." canonical="/12-seater-van-hire-auckland" />
      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/fleet" className="hover:text-primary">Fleet</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">12 Seater Van Hire Auckland</span>
          </nav>
        </div>
      </div>

      {/* Above-the-fold quote form */}
      <section id="booking-form" className="py-6 bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Get an instant Auckland minibus quote</h2>
            <p className="text-sm text-muted-foreground">Choose dates — live pricing in seconds.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchForm defaultCategoryName="Minibus" />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                12 Seater Van Hire <span className="text-primary">Auckland</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Premium group transport solutions in Auckland. Perfect for family outings, 
                corporate events, and tourist groups exploring New Zealand's largest city.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild>
                  <Link to="/">Get Quote Now</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/fleet/minibuses/twelve-seater">View Fleet Details</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>0800 525 663</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>5-Star Service</span>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src={vanImage} 
                alt="12 seater van hire Auckland with Sky Tower in background - professional group transport" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our 12 Seater Van Hire in Auckland?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Van Interior Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src={vanInteriorImage} 
                alt="Spacious interior of 12 seater van Auckland hire with comfortable passenger seating" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Comfort & Safety First
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our 12-seater vans feature modern interiors with comfortable seating, 
                air conditioning, and premium safety features. Perfect for exploring 
                Auckland's attractions in style and comfort.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span>Premium passenger seating with excellent legroom</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span>Climate control air conditioning</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span>Large windows for scenic viewing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span>Easy entry/exit with sliding doors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Auckland Destinations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {destinations.map((destination, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">{destination}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Image Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Auckland Van Fleet</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern, well-maintained 12-seater vans ready for your Auckland adventure. 
              All vehicles undergo regular safety inspections and professional cleaning.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <img 
              src={fleetImage} 
              alt="Auckland 12 seater van rental fleet with Sky Tower - professional vehicle hire service" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Auckland Service Areas
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Central Auckland</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Auckland CBD</li>
                <li>Ponsonby & Grey Lynn</li>
                <li>Parnell & Newmarket</li>
                <li>Mount Eden & Epsom</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">North Shore</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Takapuna & Milford</li>
                <li>Devonport & Northcote</li>
                <li>Albany & Greenhithe</li>
                <li>Long Bay & Torbay</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">South & East</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Manukau & Pakuranga</li>
                <li>Botany & Howick</li>
                <li>Papakura & Clevedon</li>
                <li>Franklin District</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">West Auckland</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Henderson & New Lynn</li>
                <li>Waitakere & Titirangi</li>
                <li>Kumeu & Huapai</li>
                <li>Piha & Muriwai</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Auckland Van Hire?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get an instant quote for your 12-seater van rental in Auckland. 
            Professional service, competitive rates, and premium vehicles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/">Get Instant Quote</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Call Us: 0800 525 663</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AucklandVanHire;