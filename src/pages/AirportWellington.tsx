import React from 'react';
import { MapIcon } from 'lucide-react';
import FuelStationsMapWellington from '../components/FuelStationsMapWellington';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';
import WellingtonInternalLinks from '@/components/WellingtonInternalLinks';
import WellingtonBreadcrumb from '@/components/WellingtonBreadcrumb';
import { Link } from 'react-router-dom';
import SearchForm from '@/components/home/SearchForm';
import { wellingtonAirportSEO, wellingtonAirportSearchDefaults } from '@/seo/wellington';

const AirportWellington = () => (
  <>
  <div className="container mx-auto px-4 py-8 space-y-6">
    <WellingtonBreadcrumb currentLabel="Wellington Airport" />
    <PageSEO
      title={wellingtonAirportSEO.title}
      description={wellingtonAirportSEO.description}
      canonical={wellingtonAirportSEO.path}
    />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRental",
        name: "James Blond Rentals — Wellington Airport",
        image: "https://www.jamesblond.co.nz/lovable-uploads/cccdce30-4e44-423f-8a01-6db19d07e8fd.png",
        url: "https://www.jamesblond.co.nz/airport/wellington",
        telephone: "+64800525663",
        email: "wellington@jamesblond.co.nz",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "19 Shelly Bay Road, Miramar",
          addressLocality: "Wellington",
          postalCode: "6022",
          addressCountry: "NZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-41.3276",
          longitude: "174.8056",
        },
        openingHours: "Mo-Su 08:00-17:00",
        areaServed: {
          "@type": "City",
          name: "Wellington",
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
            name: "How do I get to the Wellington Airport rental branch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Call Windy Depot on 027 837 4372 after collecting your bags. Our complimentary 24/7 shuttle service will pick you up from the terminal and take you to 19 Shelly Bay Road, Miramar.",
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
            name: "Can I return my rental car after hours at Wellington Airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "After-hours car returns are available at the airport location; follow the arrangements in your booking confirmation. Commercial vehicles must return to a city location during opening hours and cannot be returned after hours.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a shuttle back to the terminal when I drop off?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. After a quick vehicle check, our shuttle will take you directly to Wellington Airport terminal at no extra charge.",
            },
          },
          {
            "@type": "Question",
            name: "What is the minimum age to rent a vehicle at Wellington Airport?",
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
    <JsonLd data={bookingHowTo("https://www.jamesblond.co.nz/airport/wellington")} />
    <JsonLd data={pickupHowTo({ pageUrl: "https://www.jamesblond.co.nz/airport/wellington", locationName: "Wellington Airport", address: "19 Shelly Bay Road, Miramar, Wellington", isAirport: true, shuttle: "After collecting your bags, call Windy Depot on 027 837 4372 and our complimentary 24/7 shuttle will pick you up from the terminal and take you to 19 Shelly Bay Road, Miramar." })} />
    <section className="mb-8">
      <div className="text-center bg-secondary p-4 rounded-lg mb-6">
        <p className="text-lg font-bold">
          Need a shuttle? Call Windy Depot on <a href="tel:0278374372" className="text-primary hover:underline">027 837 4372</a> to organize your pickup
        </p>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{wellingtonAirportSEO.heading}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Hire a car for your Wellington arrival with off-terminal collection at 19 Shelly Bay Road, Miramar.
            Compare availability and prices for your dates before booking, whether you are heading to Wellington CBD,
            the Hutt Valley, Porirua or the Kāpiti Coast.
          </p>
          <p className="text-gray-600 mb-4">
            Search cars and passenger vehicle options for your trip. We accept a $50 booking deposit, with any unpaid
            rental balance collected at pickup. The deposit is separate from the bond.
          </p>
          <p className="text-gray-600 mb-4">
            Landing with a big load? See our <Link to="/truck-hire-wellington" className="text-primary hover:underline font-medium">truck hire Wellington</Link> range — 2-tonne and 3-tonne moving trucks with tail lifts, ready to collect from our Te Aro branch.
          </p>
          <p className="text-muted-foreground mb-4">
            Prefer city collection? Compare{' '}
            <Link to="/car-rental-wellington-new-zealand" className="text-primary hover:underline font-medium">Wellington CBD car rental</Link>{' '}
            or <Link to="/van-hire-wellington" className="text-primary hover:underline font-medium">Wellington cargo van hire</Link>{' '}
            at our Te Aro branch. Select the pickup location that suits your trip when searching.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Address:</p>
            <p className="text-gray-600">19 Shelly Bay Road, Miramar</p>
            <p className="text-gray-600 mb-2">Wellington 6022, New Zealand</p>
            <p className="text-gray-600">Phone: <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a></p>
            <p className="text-gray-600">Email: <a href="mailto:wellington@jamesblond.co.nz" className="text-primary hover:underline">wellington@jamesblond.co.nz</a></p>
          </div>
        </div>
        <div>
          <img 
            src="/lovable-uploads/cccdce30-4e44-423f-8a01-6db19d07e8fd.png" 
            alt="Wellington Airport Interior" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section id="booking-form" className="py-6 border-t scroll-mt-24">
      <h2 className="text-2xl font-bold mb-3">Check Wellington Airport car hire prices</h2>
      <p className="text-muted-foreground mb-6">
        Airport collection is in Miramar, not at an in-terminal desk or our Te Aro city branch.
        For a one-way car hire, select your actual return branch to check the route and total price.
      </p>
      <div className="max-w-4xl mx-auto">
        <SearchForm {...wellingtonAirportSearchDefaults} />
      </div>
    </section>

    <section className="py-6 border-t">
      <h2 className="text-2xl font-bold mb-3">Airport or Wellington CBD collection?</h2>
      <p className="text-muted-foreground mb-3">
        Wellington CBD collection is at 24 Abel Smith Street, Te Aro, Monday to Saturday, 8am–5pm.
        The CBD branch is closed on Sundays and has no after-hours returns. For Sunday car collection or return,
        search Wellington Airport and check the available times. Commercial vehicles return only to city branches
        during opening hours, not to airport locations.
      </p>
      <Link to="/car-rental-wellington-new-zealand" className="text-primary hover:underline font-medium">Compare Wellington CBD car rental</Link>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Shuttle Service</h3>
      <p className="text-gray-600 mb-4">
        Available 24/7 for stress-free transfers to and from the terminal. Our dedicated shuttle service ensures you can get to your rental vehicle with ease, no matter when your flight arrives.
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>24/7 pickup service available</li>
        <li>Complimentary shuttle transfers</li>
        <li>Fast and convenient service</li>
        <li>Call Windy Depot on <a href="tel:0278374372" className="text-primary hover:underline">027 837 4372</a> to organize shuttle pickup</li>
      </ul>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">What You'll Need on Arrival</h3>
      <p className="text-gray-600 mb-4">
        Please ensure you bring the following with you when collecting your rental:
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
        <li>
          <span className="font-semibold">🪪 Full Driver's Licence</span> – Must be a full and valid licence, in English or accompanied by an approved translation.
        </li>
        <li>
          <span className="font-semibold">💳 Credit or Debit Card</span> – Required for bond and payment. Prepaid cards are not accepted.
        </li>
      </ul>
      <p className="text-gray-600 mt-4">
        You must be at least 21 years old to rent a vehicle. Additional ID may be requested.
      </p>
    </section>

    <section className="py-6 border-t">
      <h2 className="text-2xl font-bold mb-4">Fuel Up Nearby</h2>
      <div className="mb-6">
        <FuelStationsMapWellington />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Z-Broadway</h3>
          <p className="text-gray-600">Broadway, Strathmore Park</p>
          <a 
            href="https://www.google.com/maps?q=Z+Broadway+Strathmore+Park" 
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
          <p className="text-gray-600">1 Bay Road, Kilbirnie</p>
          <a 
            href="https://www.google.com/maps?q=1+Bay+Road+Kilbirnie+Wellington" 
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
  </div>
  <WellingtonInternalLinks currentPath="/airport/wellington" />
  </>
);

export default AirportWellington;
