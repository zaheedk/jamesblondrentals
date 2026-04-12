
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';


const PremiumMidsizeDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Premium Midsize Car Hire | James Blond Rentals" description="Hire a comfortable midsize car with ample boot space. Great balance of economy and comfort for longer journeys." canonical="/fleet/cars/premium-midsize" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Premium Midsize – Toyota Corolla Hatch 2.0L</h1>
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
              src="/lovable-uploads/88ff5179-c7dc-499f-9b7d-e3d934ec686c.png" 
              alt="Toyota Corolla Hatch 2.0L" 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              The Toyota Corolla Hatch 2.0L is the perfect blend of efficiency, comfort, and innovation. This premium midsize hatchback is ideal for everyday commuting or weekend escapes. With a stylish look and agile handling, it's as fun to drive as it is practical.
            </p>
            <p className="text-lg mb-4">
              Great for solo travellers, couples or small families, the Corolla Hatch offers fantastic fuel economy and cutting-edge driver assist features for peace of mind on every journey.
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
                    <p className="text-base">Petrol</p>
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
                  "Adaptive Cruise Control System",
                  "Lane Assist",
                  "Air Conditioning",
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
              <h3 className="font-bold text-lg">Is the Toyota Corolla Hatch spacious enough for road trips?</h3>
              <p className="text-gray-600">
                Yes, the Toyota Corolla Hatch offers a comfortable amount of space for 4 passengers and has a surprisingly roomy boot for its class, making it suitable for weekend getaways and road trips.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is it easy to drive and park?</h3>
              <p className="text-gray-600">
                Absolutely. The Corolla Hatch features responsive steering, good visibility, and a compact footprint that makes city driving and parallel parking a breeze.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Does the Corolla Hatch offer good value?</h3>
              <p className="text-gray-600">
                The Toyota Corolla Hatch delivers excellent value with its impressive fuel efficiency, low maintenance costs, and comprehensive suite of features included as standard.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is this vehicle suitable for business use?</h3>
              <p className="text-gray-600">
                Yes – it's professional, reliable, and packed with tech that supports mobile working.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumMidsizeDetail;
