import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Shield, Clock } from "lucide-react";

const JumboTaxiLaunch = () => {
  const seo = {
    title: "Jumbo Taxi Service Launch - Premium Group Transportation | James Blond Rentals",
    description: "Announcing the launch of our new Jumbo Taxi Service! Premium group transportation with professional drivers for Auckland and beyond.",
    canonical: "https://www.jamesblond.co.nz/jumbo-taxi-launch"
  };

  useEffect(() => {
    document.title = seo.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description);
    }
    
    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', seo.canonical);
    }
    
    // Add JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Jumbo Taxi Service Launch",
      "description": seo.description,
      "author": {
        "@type": "Organization",
        "name": "James Blond Rentals"
      },
      "publisher": {
        "@type": "Organization",
        "name": "James Blond Rentals",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.jamesblond.co.nz/logo.png"
        }
      }
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const features = [
    {
      icon: Users,
      title: "Group Transportation",
      description: "Comfortable rides for up to 12 passengers in our premium vehicles"
    },
    {
      icon: Shield,
      title: "Professional Drivers",
      description: "Licensed, experienced drivers providing safe and reliable service"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock service for your convenience"
    },
    {
      icon: Car,
      title: "Premium Fleet",
      description: "Modern, well-maintained vehicles for maximum comfort"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Introducing Jumbo Taxi Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Premium group transportation with professional drivers - now available across Auckland and beyond!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
              >
                <a href="https://jumbotaxi.co.nz" target="_blank" rel="noopener noreferrer">
                  Visit Jumbo Taxi Website
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <a href="tel:0800525663">Call 0800 525 663</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-3xl text-center">🎉 Big News from James Blond Rentals!</CardTitle>
                <CardDescription className="text-lg text-center">
                  We're excited to announce the launch of our new taxi service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg leading-relaxed">
                  After years of providing premium vehicle rentals, we're expanding our services to include 
                  professional taxi transportation. Our new <strong>Jumbo Taxi Service</strong> brings the same 
                  quality and reliability you've come to expect from James Blond Rentals.
                </p>
                <p className="text-lg leading-relaxed">
                  Whether you need airport transfers, group transportation for events, or reliable rides around 
                  Auckland, our professional drivers and premium vehicles are ready to serve you.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Launch Special Offer</h3>
                  <p className="text-lg">
                    <strong>10% off</strong> your first Jumbo Taxi booking when you mention "LAUNCH2024"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Valid until 31st December 2024</p>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="text-center py-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Experience Jumbo Taxi?</h2>
                <p className="text-lg mb-8 text-muted-foreground">
                  Visit our dedicated Jumbo Taxi website to book your ride or learn more about our services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <a href="https://jumbotaxi.co.nz" target="_blank" rel="noopener noreferrer">
                      Book Your Jumbo Taxi
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="tel:0800525663">Call Now: 0800 525 663</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JumboTaxiLaunch;