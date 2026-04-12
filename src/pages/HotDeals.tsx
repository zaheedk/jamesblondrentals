import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Truck, Calendar, Percent, ArrowRight } from "lucide-react";
import PageSEO from '@/components/PageSEO';


const HotDeals = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Hot Deals – Exclusive Rental Offers | James Blond Rentals" description="Save on your next vehicle rental with James Blond's exclusive hot deals. Fuel discounts, midweek specials and courier operator deals." canonical="/hot-deals" />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hot <span className="text-primary">Deals</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't miss out on our exclusive rental offers and savings opportunities. 
              Limited time deals to help you save on your next vehicle rental.
            </p>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Mid-Week Truck & Van Discount */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  25% OFF
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Mid-Week Truck & Van Special</CardTitle>
                      <CardDescription className="text-lg">Save 25% on Monday-Thursday rentals</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Valid Monday through Thursday</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>All trucks and jumbo vans included</span>
                    </div>
                    <p className="text-muted-foreground">
                      Beat the weekend rush and save big! Perfect for moves, deliveries, and large item transport during quieter weekdays.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/hot-deals/midweek-truck-van-discount">
                        Learn More & Book <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mobil Fuel Discount */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  6¢/L OFF
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Fuel className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Mobil Fuel Discount</CardTitle>
                      <CardDescription className="text-lg">Exclusive fuel savings for our customers</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Fuel className="h-4 w-4" />
                      <span>6¢ per litre discount</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Percent className="h-4 w-4" />
                      <span>Available at participating Mobil stations</span>
                    </div>
                    <p className="text-muted-foreground">
                      Save on fuel costs during your rental period with our exclusive Mobil fuel discount program. Perfect for longer trips and extended rentals.
                    </p>
                    <Button asChild className="w-full" variant="outline">
                      <Link to="/hot-deals/mobil-fuel-discount">
                        Learn More & Save <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Courier Operator Deals */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  FROM $89
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Courier Operator Special</CardTitle>
                      <CardDescription className="text-lg">Professional rates for 5+ day rentals</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>5+ day minimum rental</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>Vans from $89, Trucks from $119 per day</span>
                    </div>
                    <p className="text-muted-foreground">
                      Special pricing for professional courier operators including Easy Rider 2000 excess insurance. Perfect for delivery services and logistics companies.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/hot-deals/courier-operator-deals">
                        View Courier Rates <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose from our current deals and start your booking today. More exclusive offers added regularly.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/">Book Your Rental Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HotDeals;