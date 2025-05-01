
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PremiumSevenSeatSUVDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Premium 7-Seat SUV – Kia Sorento 2.2L Diesel</h1>
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
              src="/lovable-uploads/2aa5cc60-af01-4571-864b-f2955d9e129b.png" 
              alt="Kia Sorento 2.2L Diesel" 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Looking for power, comfort and tech in one sleek package? The Kia Sorento 2.2L Diesel is the ultimate family or group travel SUV. With seating for up to 7 passengers, this premium AWD vehicle offers next-level comfort, modern features, and advanced safety to give you total confidence on every road trip.
            </p>
            <p className="text-lg">
              Whether you're heading on a long-distance holiday or exploring New Zealand's scenic drives, the Sorento delivers space, control, and style in equal measure.
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
              <h3 className="font-bold text-lg">Is this SUV suitable for long trips?</h3>
              <p className="text-gray-600">
                Absolutely! The Kia Sorento is designed for comfort on long journeys with ergonomic seating, smooth ride quality, and excellent fuel efficiency for extended travel.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Can I fit luggage for 7 people in the back?</h3>
              <p className="text-gray-600">
                With all 7 seats in use, there's limited space for large luggage. However, the third-row seats can fold down when not needed, creating substantial cargo space for luggage.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Does the vehicle include GPS?</h3>
              <p className="text-gray-600">
                The vehicle supports Apple CarPlay and Android Auto, allowing you to use your phone's navigation apps through the vehicle's display screen.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is it available with unlimited kilometres?</h3>
              <p className="text-gray-600">
                Yes – our Kia Sorento bookings include unlimited kilometres so you can explore stress-free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSevenSeatSUVDetail;
