
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [showApiDetails, setShowApiDetails] = useState(false);
  
  // Get tomorrow's date in dd/MM/yyyy format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pickupDate = tomorrow.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/');

  // Get the day after tomorrow
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  const dropoffDate = dayAfter.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/');

  // Construct search URL with default parameters
  const searchParams = new URLSearchParams({
    pickupLocation: "7", // Auckland Airport location ID (updated from "2" to "7")
    dropoffLocation: "7",
    pickupDate,
    dropoffDate,
    pickupTime: "08:00",
    dropoffTime: "08:00",
    age: "4", // Default age group
    carCategory: "3" // SUV category (updated from "2" to "3")
  }).toString();

  // Create request details object to display
  const requestDetails = {
    method: "step2",
    pickuplocationid: "7", // Auckland Airport
    pickupdate: pickupDate,
    pickuptime: "08:00",
    dropofflocationid: "7",
    dropoffdate: dropoffDate, 
    dropofftime: "08:00",
    ageid: "4",
    vehiclecategorytypeid: "3" // SUV
  };

  return (
    <div>
      <Hero />
      
      <FeaturedVehicles />
      
      {/* Book with Confidence Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Book with Confidence</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
            <p className="leading-relaxed">
              'James Blond Rentals' is a well trusted name when it comes to car rental or truck rental company in Auckland. 
              We understand the importance of convenience when it comes to renting a vehicle. Our online booking platform allows 
              you to reserve your desired vehicle from the comfort of your own home, saving you time and eliminating the need 
              for in-person visits.
            </p>
            <p className="leading-relaxed">
              With a few clicks, you can select the dates, pick-up and drop-off locations, and choose from our extensive fleet 
              of well-maintained rental cars, trucks, vans and more. Our user-friendly interface ensures a hassle-free booking 
              process, making your travel arrangements a breeze.
            </p>
            <div className="bg-primary/5 p-6 rounded-lg mt-8 text-center">
              <p className="text-xl font-semibold text-primary">
                James Blond Guarantee! No hidden costs. No surprise taxes. Transparent Rental policy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* API Request Details Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">API Request Details</h2>
            <Button 
              variant="outline" 
              onClick={() => setShowApiDetails(!showApiDetails)}
            >
              {showApiDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>
          
          {showApiDetails && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Request to RCM API for "View All Vehicles"</h3>
                  <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm">
                      {JSON.stringify(requestDetails, null, 2)}
                    </pre>
                  </div>
                  <p className="text-sm text-gray-600">
                    URL Parameters: {searchParams}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      
      {/* Why Choose Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose James Blond Rentals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Vehicles</h3>
              <p className="text-gray-600">All our vehicles are thoroughly inspected and maintained to ensure your safety and comfort.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordable Rates</h3>
              <p className="text-gray-600">Competitive pricing with no hidden fees, plus special discounts for extended rentals.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is available around the clock to assist you with any needs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Perfect Ride?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Choose from our extensive fleet of vehicles and enjoy a smooth rental experience from start to finish.
          </p>
          <Button asChild className="bg-white text-primary hover:bg-gray-100">
            <Link to={`/vehicles?${searchParams}`}>Browse All Vehicles</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
