
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Fuel, Percent, MapPin, CreditCard } from "lucide-react";

const MobilFuelDiscount = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">8 cents per litre discount</h1>
          <p className="text-xl text-gray-600">
            Exclusive fuel savings for James Blond Rental customers at participating Mobil stations
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-lg">
              <div className="bg-primary rounded-full p-3">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Save on Every Litre</h3>
                <p>Get 8 cents off per litre on any fuel purchase at participating Mobil stations.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-lg">
              <div className="bg-primary rounded-full p-3">
                <Fuel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">All Fuel Types</h3>
                <p>Discount applies to all fuel types when filling your rental vehicle.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-lg">
              <div className="bg-primary rounded-full p-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nationwide Coverage</h3>
                <p>Available at participating Mobil service stations throughout New Zealand.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-lg">
              <div className="bg-primary rounded-full p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Multiple Payment Options</h3>
                <p>Use the discount with in-store payment or at the Pay at Pump system.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">How to Redeem Your Discount</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                  If paying inside the store:
                </h3>
                <ol className="list-decimal pl-10 space-y-2">
                  <li>Confirm with the site that the discount is accepted.</li>
                  <li>Fill the rental vehicle with the appropriate fuel.</li>
                  <li>Walk inside the store and tell the cashier which pump number you are on.</li>
                  <li>Hand the cashier your key tag (the barcoded key tag for the rental vehicle).</li>
                  <li>Pay the cashier for the fuel using your preferred method of payment.</li>
                </ol>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                  If paying using the pay at pump:
                </h3>
                <ol className="list-decimal pl-10 space-y-2">
                  <li>Insert or tap your payment card at the Pay at Pump terminal.</li>
                  <li>Select type of card, i.e. Credit or Debit.</li>
                  <li>Enter your pin number.</li>
                  <li>Scan the key tag barcode.</li>
                  <li>Lift the pump handle and begin filling the vehicle.</li>
                  <li>Replace handle when filling complete.</li>
                  <li>If you would like a receipt, then press the 'Receipt' button.</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Find Your Nearest Mobil Station</h2>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <p className="mb-4">
                To find your nearest Mobil service station, scan the QR code on your James Blond key tag 
                or visit the Mobil website.
              </p>
              <p className="mb-6">
                Mobil stations can be found throughout New Zealand, making it convenient to fill up 
                wherever your journey takes you.
              </p>
              <Button asChild size="lg">
                <a href="https://www.mobil.co.nz/en-nz/find-station" target="_blank" rel="noopener noreferrer">
                  Find Nearest Station
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-12" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is the discount available at all Mobil stations?</AccordionTrigger>
              <AccordionContent>
                The discount is only applicable at participating Mobil service stations throughout New Zealand. 
                Please confirm with the specific station before filling up.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I use the discount for any fuel type?</AccordionTrigger>
              <AccordionContent>
                Yes, the 8 cents per litre discount applies to any fuel type that you purchase when filling your 
                James Blond rental vehicle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What do I need to show to get the discount?</AccordionTrigger>
              <AccordionContent>
                You need to present the barcoded key tag attached to your James Blond rental vehicle keys to 
                the staff at the Mobil service station before payment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I use the discount if I'm not renting from James Blond?</AccordionTrigger>
              <AccordionContent>
                No, the key tag barcode discount is only valid for James Blond rental vehicles. The discount is 
                provided as part of our exclusive partnership with Mobil.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">Ready to Save on Fuel?</h2>
          <p className="mb-6">
            Book your next vehicle rental with James Blond and enjoy exclusive 8 cents per litre savings at 
            Mobil stations nationwide.
          </p>
          <Button size="lg" asChild>
            <Link to="/vehicles">View Our Vehicle Range</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilFuelDiscount;
