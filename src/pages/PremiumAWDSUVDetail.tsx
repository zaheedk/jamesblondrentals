
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PremiumAWDSUVDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Premium AWD SUV – Toyota Highlander 3.5L V6</h1>
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
              src="/lovable-uploads/b6590bc2-c772-4b70-892b-9a5c173c4d15.png" 
              alt="Toyota Highlander 3.5L V6" 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              The Toyota Highlander 3.5L V6 is your go-to for elevated travel – whether you're driving through the city or heading out on a rugged road trip. This powerful all-wheel drive SUV offers comfort, advanced tech, and room for the whole crew with a 7-seat configuration (note: extra seats reduce luggage space).
            </p>
            <p className="text-lg">
              With a strong V6 engine and smooth automatic transmission, the Highlander handles beautifully on highways and hilly terrain alike.
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
                  "7 Seat Option (reduces boot space)",
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
              <h3 className="font-bold text-lg">How many people can the Highlander seat?</h3>
              <p className="text-gray-600">
                The Toyota Highlander offers a 7-seat configuration, making it perfect for family trips or group outings. Note that using all 7 seats will reduce available luggage space.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is this SUV suitable for towing?</h3>
              <p className="text-gray-600">
                The Toyota Highlander with its 3.5L V6 engine offers good towing capability. Please check with our rental team about specific towing requirements for your rental.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Does it offer good fuel economy?</h3>
              <p className="text-gray-600">
                While the V6 engine prioritizes power and performance, the Highlander offers reasonable fuel economy for its size and capability class, making it suitable for longer journeys.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Can I take it on unsealed roads?</h3>
              <p className="text-gray-600">
                Yes – the AWD system handles gravel roads and rural drives comfortably.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAWDSUVDetail;
