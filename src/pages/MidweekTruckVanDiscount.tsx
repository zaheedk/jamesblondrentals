import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Truck, Calendar, Percent, Phone, Mail } from "lucide-react";

const MidweekTruckVanDiscount = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Percent className="h-4 w-4" />
              LIMITED TIME OFFER
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Save <span className="text-primary">25%</span> on Mid-Week 
              <br />Truck & Jumbo Van Rentals
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Beat the weekend rush and save big! Rent our trucks and jumbo vans Monday to Thursday 
              and enjoy 25% off your rental. Perfect for moves, deliveries, and large item transport.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/">Book Now & Save 25%</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/price-guide">View Price Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Mid-Week Discount Details</h2>
              <p className="text-lg text-muted-foreground">
                Take advantage of quieter mid-week periods and save on your truck and van rentals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader className="text-center">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>When to Save</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Rentals starting Monday through Thursday qualify for the full 25% discount
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Eligible Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>All truck rentals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Jumbo van rentals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Cargo van upgrades</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Percent className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Your Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">25% OFF</div>
                    <p className="text-muted-foreground">
                      Applied automatically to your rental rate
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Section */}
            <div className="bg-muted/50 rounded-lg p-8 mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">Why Choose Mid-Week Rentals?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Better Availability</h4>
                    <p className="text-muted-foreground">More vehicle options and pickup times available</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Less Traffic</h4>
                    <p className="text-muted-foreground">Easier driving conditions and quicker deliveries</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Flexible Scheduling</h4>
                    <p className="text-muted-foreground">More convenient pickup and return times</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Personalized Service</h4>
                    <p className="text-muted-foreground">More time for our staff to assist you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Truck & Van Hire FAQ</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What documents do I need to hire a truck or van?</AccordionTrigger>
                <AccordionContent>
                  You'll need a valid driver's license (held for at least 1 year), a credit card for the security deposit, and proof of identity. International visitors may need an International Driving Permit depending on their country of origin.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What's included in the rental price?</AccordionTrigger>
                <AccordionContent>
                  Our rental rates include comprehensive insurance, 24/7 roadside assistance, unlimited kilometers (conditions apply), and basic tools like tie-down straps. Fuel is not included and vehicles should be returned with the same fuel level.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How much can I load in the truck or van?</AccordionTrigger>
                <AccordionContent>
                  Each vehicle has specific weight and volume limits. Our 2-tonne trucks can carry up to 2,000kg, while our jumbo vans typically handle 1,200-1,500kg. Detailed specifications are provided during booking, and we'll help you choose the right vehicle for your needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I extend my rental if I need more time?</AccordionTrigger>
                <AccordionContent>
                  Yes, subject to availability. Contact us as soon as possible if you need to extend your rental. Extensions are charged at the standard hourly or daily rate, and the 25% mid-week discount may not apply to extension periods.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Do you provide moving equipment?</AccordionTrigger>
                <AccordionContent>
                  We offer optional extras including furniture pads, hand trolleys, ratchet straps, and furniture dollies. These can be added during the booking process for an additional fee.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>What if I have an accident or breakdown?</AccordionTrigger>
                <AccordionContent>
                  All our vehicles include comprehensive insurance and 24/7 roadside assistance. In case of an accident, call the police if required, then contact our emergency line immediately. For breakdowns, our roadside assistance will help get you back on the road or provide a replacement vehicle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>How far in advance should I book?</AccordionTrigger>
                <AccordionContent>
                  We recommend booking 2-7 days in advance, especially during peak moving periods (end of month, summer months). However, same-day bookings are often available during mid-week periods when you can take advantage of our 25% discount.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Are there any restrictions on where I can drive?</AccordionTrigger>
                <AccordionContent>
                  Our vehicles can be driven anywhere in New Zealand on sealed roads. Off-road driving is not permitted. Some vehicles may have restrictions for certain areas - these will be clearly explained during pickup.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Save 25%?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your mid-week truck or jumbo van rental today and start saving
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/">Book Your Rental Now</Link>
            </Button>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Phone className="h-5 w-5" />
              <span>Or call: 0800 525 663</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MidweekTruckVanDiscount;