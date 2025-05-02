
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PremiumEconomyWagonDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Premium Economy Wagon – Toyota Corolla Wagon 1.5L</h1>
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
              src="/lovable-uploads/ca4fe6a5-97a6-4d6c-a675-a0ad2e3e4856.png" 
              alt="Toyota Corolla Wagon 1.5L" 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              The Toyota Corolla Wagon 1.5L is a practical and versatile option, combining fuel efficiency with the added space of a station wagon. Whether you're heading to the office, picking up weekend supplies, or planning a short road trip, this premium economy option keeps things simple and affordable.
            </p>
            <p className="text-lg mb-4">
              With smooth handling and generous cargo room, it's perfect for couples, small families or solo drivers who need a bit more space without sacrificing ease of use.
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
              <h3 className="font-bold text-lg">How does the Corolla Wagon differ from the hatchback?</h3>
              <p className="text-gray-600">
                The Corolla Wagon offers significantly more cargo space than the hatchback, with an extended rear section that provides additional storage room while maintaining the same easy driving characteristics.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is it suitable for longer journeys?</h3>
              <p className="text-gray-600">
                Yes, the Corolla Wagon is comfortable for longer drives with supportive seats and a smooth ride quality, making it a great choice for day trips and weekend getaways.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">Does it come with safety tech?</h3>
              <p className="text-gray-600">
                Yes, the Toyota Corolla Wagon comes with essential safety features including a reversing camera and has earned a 5-star ANCAP safety rating for your peace of mind.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is this car good for small families?</h3>
              <p className="text-gray-600">
                Absolutely – it comfortably fits 4-5 people with room in the back for strollers or groceries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumEconomyWagonDetail;
