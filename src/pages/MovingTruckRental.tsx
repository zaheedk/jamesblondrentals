import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland', to: '/auckland-truck-rentals-hire' },
  { name: 'Wellington', to: '/truck-hire-wellington' },
  { name: 'Christchurch', to: '/truck-hire-christchurch' },
  { name: 'Hamilton', to: '/truck-hire-hamilton' },
  { name: 'West Auckland', to: '/west-auckland-truck-rentals-hire' },
];

const MovingTruckRental = () => (
  <SimpleHubPage
    slug="/moving-truck-rental"
    title="Moving Truck Rental NZ from $35/hr — Same-Day Moving Truck Hire"
    description="Moving truck rental near you from $35/hr. 2-tonne and 3-tonne moving trucks with tail lifts, ramps and tie-down points. Same-day pickup at Auckland, Wellington, Christchurch and Hamilton — drive on a car licence."
    h1="Moving Truck Rental — Same-Day Moving Truck Hire"
    intro="Renting a moving truck shouldn't take a week of phone calls. James Blond moving trucks come ready to load — tail lift or ramp, tie-down points, blankets available, hourly rates from $35/hr. Drive on a standard NZ car licence, no endorsements required."
    bullets={[
      '2-tonne and 3-tonne moving trucks',
      'Tail lifts and ramps available',
      'Drive on a standard car licence',
      'Same-day pickup, 7 days a week',
      'Hourly, daily and weekly rates',
      'Optional moving blankets, hand trolleys and straps',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a moving truck"
    cities={cities}
    faq={[
      { q: 'How much does it cost to rent a moving truck in NZ?', a: 'James Blond moving trucks start from $35/hr and around $129/day for a 2-tonne, with 3-tonne and tail-lift trucks slightly higher. Same-day quotes are available from any branch.' },
      { q: 'What size moving truck should I rent?', a: 'For a one-bedroom apartment a 2-tonne 12m³ truck is usually plenty. For a two- or three-bedroom house a 2-tonne 16m³ or 3-tonne 19m³ with tail lift is the right call.' },
      { q: 'Do I need a truck licence to drive a moving truck?', a: 'No — every moving truck in our fleet drives on a standard NZ Class 1 car licence.' },
      { q: 'Can I do a one-way move?', a: 'One-way and long-distance moves between Auckland, Hamilton, Wellington and Christchurch are available on request when booking.' },
    ]}
  />
);

export default MovingTruckRental;