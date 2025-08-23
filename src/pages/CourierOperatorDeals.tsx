import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Shield, Clock, Users, CheckCircle, Calendar, DollarSign } from "lucide-react";

const CourierOperatorDeals = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Courier Operator <span className="text-primary">Special Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Exclusive rates for professional courier operators. 
              Minimum 5-day rental required for special pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/booking">Book Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Special Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Professional Courier Rates</h2>
              <p className="text-xl text-muted-foreground">
                Special pricing for 5+ day rentals with Easy Rider 2000 excess insurance included
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              
              {/* Standard Cargo Van */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  SPECIAL
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Standard Cargo Van</CardTitle>
                      <CardDescription>Perfect for daily deliveries</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">$89</div>
                      <div className="text-muted-foreground">per day</div>
                      <div className="text-sm text-muted-foreground">5+ day minimum</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Easy Rider 2000 excess insurance included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Reliable and fuel efficient</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Perfect for urban deliveries</span>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/booking">Book Standard Van</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Jumbo Van */}
              <Card className="relative overflow-hidden border-primary shadow-lg">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  POPULAR
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Jumbo Van</CardTitle>
                      <CardDescription>Extra capacity for larger loads</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">$109</div>
                      <div className="text-muted-foreground">per day</div>
                      <div className="text-sm text-muted-foreground">5+ day minimum</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Easy Rider 2000 excess insurance included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Maximum cargo capacity</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Perfect for bulk deliveries</span>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/booking">Book Jumbo Van</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 2 Ton Truck */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  HEAVY DUTY
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">2 Ton Truck</CardTitle>
                      <CardDescription>For heavy cargo and equipment</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">$119</div>
                      <div className="text-muted-foreground">per day</div>
                      <div className="text-sm text-muted-foreground">5+ day minimum</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Easy Rider 2000 excess insurance included</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>2-tonne payload capacity</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Perfect for heavy equipment</span>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/booking">Book 2 Ton Truck</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Courier Services */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Courier Services?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Insurance Included</h3>
                  <p className="text-sm text-muted-foreground">
                    Easy Rider 2000 excess insurance included with all rentals for peace of mind.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Flexible Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimum 5-day rental periods with options for longer-term arrangements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Fleet</h3>
                  <p className="text-sm text-muted-foreground">
                    Well-maintained, reliable vehicles perfect for professional courier operations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Business Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicated support team for business customers with priority service.
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Minimum Rental Period
                    </h3>
                    <p className="text-muted-foreground">
                      Special courier operator pricing requires a minimum 5-day rental period. 
                      Shorter rentals will be charged at standard daily rates.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Insurance Coverage
                    </h3>
                    <p className="text-muted-foreground">
                      Easy Rider 2000 excess insurance is included in all courier operator rentals. 
                      This provides comprehensive coverage with reduced excess liability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Pricing
                    </h3>
                    <p className="text-muted-foreground">
                      Rates shown are per day for 5+ day rentals and include GST. 
                      Additional charges may apply for fuel, cleaning, or damage beyond normal wear and tear.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Eligibility
                    </h3>
                    <p className="text-muted-foreground">
                      This offer is available to registered courier operators and delivery businesses. 
                      Proof of business registration may be required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Article written by <span className="font-semibold">Zaheed Kanthawala</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact us today to discuss your courier operation needs and secure your special pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/booking">Book Your Vehicles</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourierOperatorDeals;