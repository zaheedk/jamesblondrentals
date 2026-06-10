import React from 'react';
import { MapIcon, Navigation } from 'lucide-react';
import FuelStationsMap from '../components/FuelStationsMap';
import { Button } from '@/components/ui/button';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';

const AirportAuckland = () => (
  <div className="container mx-auto px-4 py-8 space-y-6">
    <PageSEO title="Auckland Airport Car Rental | James Blond Rentals" description="Rent cars, vans, trucks and minibuses at Auckland Airport. Free shuttle from both domestic and international terminals." canonical="/airport/auckland" />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — Auckland Airport",
        image: "https://jamesblond.co.nz/lovable-uploads/6a274083-edb0-4ac2-8e40-4ac3703a8660.png",
        url: "https://jamesblond.co.nz/airport/auckland",
        telephone: "+64800525663",
        email: "info@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5/203 Kirkbride Road",
          addressLocality: "Mangere",
          addressRegion: "Auckland",
          postalCode: "2022",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-36.9785",
          longitude: "174.7855",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "Auckland",
        },
      }}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I get to the Auckland Airport rental branch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Call 0800 525 663 after collecting your bags. For domestic arrivals, wait at the courtesy shuttle zone outside Door 9. For international arrivals, exit via Door 11 and proceed to the offsite shuttle pickup bay. Our blue and white James Blond shuttle van will collect you and take you to 203 Kirkbride Road, Mangere.",
            },
          },
          {
            "@type": "Question",
            name: "What do I need to bring when collecting my rental vehicle?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You need a full, valid driver's licence (in English or with an approved translation) and a credit or debit card for the bond. Prepaid cards are not accepted.",
            },
          },
          {
            "@type": "Question",
            name: "Can I return my rental car after hours at Auckland Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — early or after-hours returns are available. Return the vehicle to 5/203 Kirkbride Road, Mangere, follow the drop-off signage and contact our shuttle team for a terminal transfer.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a shuttle back to the terminal when I drop off?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. After a quick vehicle check, our shuttle will take you directly to your terminal at no extra charge.",
            },
          },
          {
            "@type": "Question",
            name: "What is the minimum age to rent a vehicle at Auckland Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You must be at least 21 years old. Additional ID may be requested at pickup.",
            },
          },
          {
            "@type": "Question",
            name: "Is insurance included in the rental price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Basic cover is included, and you can upgrade to Premium or Ultimate cover at checkout for reduced excess and extra protection.",
            },
          },
        ],
      }}
    />
    <JsonLd data={bookingHowTo("https://jamesblond.co.nz/airport/auckland")} />
    <JsonLd data={pickupHowTo({ pageUrl: "https://jamesblond.co.nz/airport/auckland", locationName: "Auckland Airport", address: "5/203 Kirkbride Road, Mangere, Auckland", isAirport: true, shuttle: "After collecting your bags, call 0800 525 663 and our free shuttle will collect you from the Auckland International or Domestic terminal and take you to 5/203 Kirkbride Road, Mangere." })} />
    <section className="mb-8">
      <div className="text-center bg-secondary p-4 rounded-lg mb-6">
        <p className="text-lg font-bold">
          Need a Shuttle? Call James Blond on <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a> to organise your pick up
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Auckland Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Visiting Auckland and need a reliable rental straight from the airport? Look no further than James Blond Rentals at Auckland Airport. Conveniently located just minutes from both the Domestic and International Terminals, we provide fast, friendly service with a full fleet of rental options, from cars to trucks, trailers, and minibuses.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Address:</p>
            <p className="text-gray-600">5/203 Kirkbride Road</p>
            <p className="text-gray-600 mb-2">Mangere, Auckland 2022, New Zealand</p>
            <p className="text-gray-600">Phone: <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a></p>
            <p className="text-gray-600">Email: <a href="mailto:info@jamesblond.co.nz" className="text-primary hover:underline">info@jamesblond.co.nz</a></p>
          </div>
        </div>
        <div>
          <img 
            src="/lovable-uploads/6a274083-edb0-4ac2-8e40-4ac3703a8660.png" 
            alt="Auckland International Airport" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">24/7 Airport Shuttle Transfers</h3>
      <p className="text-gray-600 mb-4">
        Once your flight arrives and you've collected your bags, please call us on <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a>. One of our friendly shuttle drivers will pick you up from the designated pickup zone.
      </p>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Domestic Terminal Pickup:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Exit the terminal and follow the signs for "Rental Car Shuttles" located outside Door 9</li>
            <li>Cross the first lane of traffic and wait at the courtesy shuttle pickup zone</li>
            <li>Our blue and white James Blond shuttle van will arrive shortly to take you to our Airpark Drive branch</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">International Terminal Pickup:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Exit the terminal through Door 11 near the arrivals area and turn right</li>
            <li>Proceed along the covered walkway until you reach the offsite shuttle pickup bay</li>
            <li>Watch for the James Blond shuttle van - our team will be there to assist with your bags</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Drop-Off Instructions:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Return your vehicle to 5/203 Kirkbride Road, Mangere</li>
            <li>After a quick check, we'll shuttle you directly to your terminal</li>
            <li>For early or after-hours returns, follow the signage to our drop-off box and contact our shuttle team</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h2 className="text-2xl font-bold mb-4">Fuel Up Nearby</h2>
      <div className="mb-6">
        <FuelStationsMap />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Z - Tom Pearce Dr</h3>
          <p className="text-gray-600">Service Station</p>
          <a 
            href="https://www.google.com/maps?q=Z+Tom+Pearce+Dr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-primary hover:underline"
          >
            <MapIcon className="w-4 h-4 mr-1" />
            View on map
          </a>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Waitomo Fuel</h3>
          <p className="text-gray-600">33 Richard Pearse Drive</p>
          <a 
            href="https://www.google.com/maps?q=33+Richard+Pearse+Drive+Auckland" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-primary hover:underline"
          >
            <MapIcon className="w-4 h-4 mr-1" />
            View on map
          </a>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Mobil</h3>
          <p className="text-gray-600">747 Massey Road</p>
          <a 
            href="https://www.google.com/maps?q=747+Massey+Road+Auckland" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-primary hover:underline"
          >
            <MapIcon className="w-4 h-4 mr-1" />
            View on map
          </a>
        </div>
      </div>
    </section>
    
    {/* View Vehicles CTA */}
    <section className="py-6 border-t">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Ready to Book Your Auckland Airport Rental?</h3>
        <Button className="mt-2" asChild>
          <a href="https://www.jamesblond.co.nz/fleet/cars" target="_blank" rel="noopener noreferrer">
            View Our Vehicle Range
          </a>
        </Button>
      </div>
    </section>
  </div>
);

export default AirportAuckland;
