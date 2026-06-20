import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland', to: '/auckland-truck-rentals-hire' },
  { name: 'Wellington', to: '/truck-hire-wellington' },
  { name: 'Christchurch', to: '/truck-hire-christchurch' },
  { name: 'Hamilton', to: '/truck-hire-hamilton' },
];

const TipperTruckHire = () => (
  <SimpleHubPage
    slug="/tipper-truck-hire"
    title="Tipper Truck Hire NZ from $99/day — Same-Day Tip Truck Rental"
    description="Tipper truck hire near you from $99/day. 2-tonne tipper trucks for landscaping, demolition, soil, green-waste and dump runs. Same-day pickup at Auckland, Wellington, Christchurch & Hamilton. Drive on a car licence."
    h1="Tipper Truck Hire — Tip Truck Rental Near You"
    intro="Need a tipper truck right now? Our 2-tonne hydraulic tipper trucks are perfect for landscaping jobs, demolition runs, green-waste dumps, soil and gravel cartage. Hydraulic tip deck, 1,000kg+ payload, drive on a standard NZ car licence."
    bullets={[
      '2-tonne hydraulic tipper deck',
      'Up to 1,000kg payload',
      'Drive on a standard car licence',
      'Same-day pickup at all branches',
      'Hourly, daily and weekly rates',
      'Tip-run friendly — landscaping, demo & green waste',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a tipper now"
    cities={cities}
    faq={[
      { q: 'Do you have tipper truck hire near me?', a: 'James Blond rents tipper trucks from branches in Auckland (CBD, Penrose, Airport, West Auckland, South Auckland), Wellington CBD, Christchurch (CBD & Airport) and Hamilton — same-day pickup is available 7 days a week.' },
      { q: 'How much does it cost to hire a tipper truck?', a: 'Tipper truck hire starts from around $99/day with hourly and weekly rates also available. Call your nearest branch for a same-day quote.' },
      { q: 'Do I need a special licence for a tipper truck?', a: 'No. Our 2-tonne tipper trucks can be driven on a standard NZ Class 1 car licence — no truck or trailer endorsement required.' },
      { q: 'Can I use the tipper for green waste or dump runs?', a: 'Yes. The hydraulic tip deck makes green-waste, soil, gravel and demolition runs straightforward. Just return the truck swept clean.' },
    ]}
  />
);

export default TipperTruckHire;