
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';


const Premium2WDSUVDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Premium 2WD SUV Hire | James Blond Rentals" description="Hire a premium 2WD SUV for comfortable city and highway driving. Ideal for couples and small families." canonical="/fleet/cars/premium-2wd-suv" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Premium 5-Seat SUV – Kia Sportage 2.0L</h1>
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
              src="/lovable-uploads/841454d4-8948-4c3b-ad99-d73b843deee8.png" 
              alt="Kia Sportage 2.0L" 
              className="w-full h-full object-cover"
              width="800"
              height="450"
              fetchPriority="high"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Enjoy the perfect blend of performance, comfort, and smart tech with the Kia Sportage 2.0L, our premium 2WD SUV. Ideal for everyday drives, weekend escapes or business trips, this five-seater offers excellent fuel economy and a spacious, tech-loaded cabin to make every ride enjoyable.
            </p>
            <p className="text-lg">
              From reversing with confidence to cruising safely with lane assist, the Kia Sportage makes driving easier, smarter, and more comfortable.
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
                    <p className="text-base">Diesel/Petrol</p>
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
                  "Apple CarPlay & Android Auto",
                  "Smart Cruise Control",
                  "Lane Assist",
                  "Dual-Zone Air Conditioning",
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
              <h3 className="font-bold text-lg">How many people can the Kia Sportage seat?</h3>
              <p className="text-gray-600">
                The Kia Sportage comfortably seats 5 adults with ample legroom and headspace for everyone to enjoy the journey.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is this a good option for short trips and errands?</h3>
              <p className="text-gray-600">
                Absolutely! The Kia Sportage is perfect for everyday driving with its easy maneuverability, comfortable ride, and excellent fuel efficiency.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Can I sync my smartphone with the vehicle?</h3>
              <p className="text-gray-600">
                Yes, the Kia Sportage comes with both Apple CarPlay and Android Auto integration, allowing you to seamlessly connect your smartphone for navigation, music, and calls.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is unlimited mileage included?</h3>
              <p className="text-gray-600">
                Yes, like all our SUVs, the 2WD comes with unlimited kilometres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium2WDSUVDetail;
