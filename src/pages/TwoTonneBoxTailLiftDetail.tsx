
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import PageSEO from '@/components/PageSEO';


const TwoTonneBoxTailLiftDetail = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="2-Tonne Box Truck with Tail Lift Hire | James Blond" description="Hire a 2-tonne truck with hydraulic tail lift for easy loading of heavy items. Perfect for furniture and appliance moves." canonical="/fleet/trucks/2-tonne-box-12m3-tail" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Effortless Loading – 2 Tonne Box Truck (12m³) + Tail Lift Rental</h1>
        <div className="flex gap-2">
          <Link to="/fleet/trucks">
            <Button variant="outline" size="sm">Back to Trucks</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            <img 
              src="/lovable-uploads/d4f3f3f9-68b5-425e-83e7-7e468c0da49f.png" 
              alt="2 Tonne Box Truck (12m³) with Tail Lift" 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Our 2 Tonne Box Truck (12m³) with Tail Lift is designed to make loading and unloading heavy cargo easier than ever. 
              Featuring an automatic transmission and a powerful tail lift with a max load capacity of 400kg, this truck is perfect 
              for businesses, furniture removals, and bulk deliveries.
            </p>
            <p className="text-lg mb-4">
              With a 3100mm (L) x 1800mm (W) x 2000mm (H) box size and a maximum load capacity of 2000kg, it provides the space 
              and efficiency needed for hassle-free transportation. Rent one today and experience smooth, effortless logistics!
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
                    <p className="text-base">44c per km</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                      <polyline points="16 16 12 12 8 16"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Max Load</h3>
                    <p className="text-base">2000kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M21 7 H3 V3h18v4z"/>
                      <path d="M21 11V7H3v4"/>
                      <path d="M21 15v-4H3v4"/>
                      <path d="M21 19v-4H3v4"/>
                      <path d="M3 19v2h18v-2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Cargo Space</h3>
                    <p className="text-base">3100(L) x 1800(W) x 2000(H)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 2H2v20h20V2z"></path>
                      <path d="M22 14H2"></path>
                      <path d="M12 2v20"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Tail Lift Capacity</h3>
                    <p className="text-base">400kg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3">Additional Features</h3>
              <ul className="space-y-2">
                {[
                  "Twin Side Doors",
                  "Hydraulic Tail Lift",
                  "Air conditioning"
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
              <h3 className="font-bold text-lg">What are the benefits of renting a truck with a tail lift?</h3>
              <p className="text-gray-600">
                A tail lift makes loading and unloading heavy items significantly easier, reducing manual handling and the risk of injuries. It's ideal for bulky furniture, appliances, or palletized goods.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Do I need a special license to drive this truck?</h3>
              <p className="text-gray-600">
                No, a standard car license is sufficient to drive our 2 Tonne Box Truck with Tail Lift. No special endorsements are required.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">What is the maximum weight capacity of the tail lift?</h3>
              <p className="text-gray-600">
                The hydraulic tail lift can safely lift up to 400kg, making it perfect for heavy furniture, equipment, and palletized goods.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Is there a mileage charge for this rental?</h3>
              <p className="text-gray-600">
                Yes, a 44c per km mileage charge applies. Pricing may vary based on availability, so please confirm at the time of booking.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-muted/30 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">Truck Hire Locations</h2>
        <p className="text-muted-foreground mb-4">
          This truck is available across our nationwide branches. Explore our truck hire hub and city pages for local rates and availability.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/truck-hire" className="text-primary hover:underline">Truck Hire NZ</Link>
          <Link to="/auckland-truck-rentals" className="text-primary hover:underline">Auckland Truck Hire</Link>
          <Link to="/west-auckland-truck-rentals" className="text-primary hover:underline">West Auckland</Link>
          <Link to="/wellington-truck-rentals" className="text-primary hover:underline">Wellington Truck Hire</Link>
          <Link to="/christchurch-truck-rentals" className="text-primary hover:underline">Christchurch Truck Hire</Link>
          <Link to="/central-christchurch-truck-hire" className="text-primary hover:underline">Central Christchurch</Link>
          <Link to="/hamilton-truck-rentals" className="text-primary hover:underline">Hamilton Truck Hire</Link>
        </div>
      </div>
    </div>
  );
};

export default TwoTonneBoxTailLiftDetail;
