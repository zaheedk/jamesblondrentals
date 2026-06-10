export const bookingHowTo = (pageUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to book a rental vehicle with James Blond Rentals",
  description:
    "Reserve a car, van, ute, truck or minibus from James Blond Rentals in a few quick steps.",
  totalTime: "PT3M",
  url: pageUrl,
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose your pickup branch and dates",
      text: "Open the booking form, select your preferred pickup branch, then choose your pickup and return dates and times.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Pick a vehicle",
      text: "Browse available cars, vans, utes, trucks and minibuses and choose the vehicle that suits your trip and budget.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Add insurance and extras",
      text: "Select your insurance cover (Basic, Premium or Ultimate) and add any extras such as child seats, GPS or trailers.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Enter your details and pay",
      text: "Complete the driver details, accept the rental terms, then pay securely with a credit or debit card to confirm your booking.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Receive your confirmation",
      text: "Check your email for a booking confirmation with your reservation number, pickup address and contact details.",
    },
  ],
});

interface PickupOptions {
  pageUrl: string;
  locationName: string;
  address: string;
  shuttle?: string;
  isAirport?: boolean;
}

export const pickupHowTo = ({
  pageUrl,
  locationName,
  address,
  shuttle,
  isAirport,
}: PickupOptions) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: `How to pick up your rental vehicle at ${locationName}`,
  description: `Step-by-step pickup process for collecting your rental vehicle from James Blond Rentals ${locationName}.`,
  totalTime: "PT15M",
  url: pageUrl,
  supply: [
    { "@type": "HowToSupply", name: "Full valid driver's licence" },
    { "@type": "HowToSupply", name: "Credit or debit card for bond" },
    { "@type": "HowToSupply", name: "Booking confirmation" },
  ],
  step: [
    isAirport
      ? {
          "@type": "HowToStep",
          position: 1,
          name: "Call for the shuttle on arrival",
          text:
            shuttle ??
            `After collecting your bags, call our shuttle team on 0800 525 663 to arrange pickup from the terminal.`,
        }
      : {
          "@type": "HowToStep",
          position: 1,
          name: "Travel to the branch",
          text: `Make your way to our branch at ${address} during opening hours (8am–5pm, 7 days).`,
        },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Present your documents",
      text: "Show your booking confirmation, full driver's licence (English or with an approved translation) and credit/debit card for the bond.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Sign the rental agreement",
      text: "Review and sign the rental agreement, including chosen insurance cover and any extras.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Inspect the vehicle",
      text: "Walk around the vehicle with our team, note any existing damage and check the fuel level before driving off.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Drive away",
      text: "Collect the keys, set your destination and enjoy your James Blond Rentals vehicle. Call us any time on 0800 525 663 if you need support.",
    },
  ],
});