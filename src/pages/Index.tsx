
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { toast } from "sonner";
import { useApiDiagnostics } from "@/hooks/use-api-diagnostics";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ApiHealthStatus from "@/components/system/ApiHealthStatus";

const Index = () => {
  const { initializeApi } = useRcmApi();
  const { runDiagnostics } = useApiDiagnostics();
  const [apiConnectionFailed, setApiConnectionFailed] = useState(false);
  
  useEffect(() => {
    // Initialize the API with connection enabled
    initializeApi({ 
      enableApi: true, // Explicitly enable the API
      useMockData: false,
      apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
      apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
      apiUrl: "/api/rcm/booking/v3.2/"
    }).then(() => {
      // Run diagnostics to check API connectivity
      runDiagnostics().then(result => {
        console.log("API diagnostics result:", result);
        if (!result.apiAccessible) {
          toast.error("API Connection Failed", {
            description: "Using demo data instead. Real bookings will not be processed."
          });
          setApiConnectionFailed(true);
          
          // Fall back to mock data if API is not accessible
          initializeApi({
            enableApi: true,
            useMockData: true,
            apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
            apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
            apiUrl: "/api/rcm/booking/v3.2/"
          });
        }
      });
    }).catch(error => {
      console.error("Failed to initialize API:", error);
      setApiConnectionFailed(true);
    });
  }, [initializeApi, runDiagnostics]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ApiHealthStatus onlyShowOnError={true} />
        {apiConnectionFailed && (
          <Alert variant="destructive" className="max-w-4xl mx-auto mt-4">
            <AlertTitle>API Connection Failed</AlertTitle>
            <AlertDescription>
              Unable to connect to the booking system API. The application is running in demo mode.
              Real bookings cannot be processed until the API connection is restored.
            </AlertDescription>
          </Alert>
        )}
        <Hero />
        <FeaturedVehicles />
        
        {/* Why Choose Us Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Roadster Rentals</h2>
            
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
        
        {/* Call to Action */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Perfect Ride?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Choose from our extensive fleet of vehicles and enjoy a smooth rental experience from start to finish.
            </p>
            <Button asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="/vehicles">Browse All Vehicles</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
