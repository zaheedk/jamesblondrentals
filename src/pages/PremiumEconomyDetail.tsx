
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';


const PremiumEconomyDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Premium Economy Car Hire | James Blond Rentals" description="Rent an affordable economy car with excellent fuel efficiency. Perfect for budget-conscious city and commuter driving." canonical="/fleet/cars/premium-economy" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Premium Economy – Suzuki Swift 1.3L</h1>
        <div className="flex gap-2">
          <Link to="/fleet/cars">
            <Button variant="outline" size="sm">Back to Cars</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img 
              src="/lovable-uploads/e7217b00-38b3-40d6-9ef7-fdc2760ee602.png" 
              alt="Suzuki Swift 1.3L" 
              className="w-full h-full object-cover"
              width="800"
              height="450"
              fetchPriority="high"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              The Suzuki Swift 1.3L is the perfect city companion – compact, agile, and incredibly efficient. This premium economy hatchback is ideal for solo drivers, couples, or anyone seeking affordable mobility without compromising on safety or features. Easy to park, fun to drive, and packed with must-have tech, it's the smart choice for zipping around town or short trips.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 10V7c0-4-2-4-8-4s-8 0-8 4v11a2 2 0 0 0 2 2h2"/>
                      <path d="M18 21h2a2 2 0 0 0 2-2v-2.417a5 5 0 0 1-5.285-1.188L16 14.5M9 11h2M9 6h2"/>
                      <path d="m15.325 14.075.675-.75.675.75a2.5 2.5 0 0 0 3.325 0v0a2.5 2.5 0 0 0 0-3.5L16 6.5l-4 4.075v0a2.5 2.5 0 0 0 0 3.5v0a2.5 2.5 0 0 0 3.325 0Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Fuel Type</h3>
                    <p className="text-base">Diesel</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Transmission</h3>
                    <p className="text-base">Automatic</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M5 17a4 4 0 0 0 8 0"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M15 17a4 4 0 0 0 8 0"/>
                      <circle cx="19" cy="9" r="2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Mileage Charges</h3>
                    <p className="text-base">Unlimited kilometres</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3">Features</h3>
              <ul className="space-y-2">
                {[
                  "Reversing Camera",
                  "Bluetooth AUX and USB",
                  "5-Star Fuel Economy Rating",
                  "5-Star ANCAP Safety Rating"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Is the Suzuki Swift good for new drivers?</h3>
              <p className="text-gray-600">
                Yes, the Suzuki Swift is an excellent choice for new drivers due to its compact size, responsive handling, and comprehensive safety features, making it easier to maneuver and park.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">How many people does it seat?</h3>
              <p className="text-gray-600">
                The Suzuki Swift comfortably seats up to 5 people, though it's most comfortable for 4 adults on longer journeys.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Does it support smartphone connection?</h3>
              <p className="text-gray-600">
                Yes, the Swift comes with Bluetooth connectivity as well as USB ports, allowing you to connect your smartphone for hands-free calls and audio streaming.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is this suitable for long-distance travel?</h3>
              <p className="text-gray-600">
                It's best suited for short to medium trips, but still performs well on highways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumEconomyDetail;
