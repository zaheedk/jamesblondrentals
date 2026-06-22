import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Hamilton Truck Hire', to: '/truck-hire-hamilton' },
  { name: 'Furniture Truck Hire', to: '/furniture-truck-hire-hamilton' },
  { name: 'Hamilton Van Hire', to: '/van-hire-hamilton' },
  { name: 'Contact Hamilton', to: '/contact/hamilton' },
];

const MovingTruckHireHamilton = () => (
  <SimpleHubPage
    slug="/moving-truck-hire-hamilton"
    title="Moving Truck Hire Hamilton from $35/hr — Same-Day House Movers"
    description="Moving truck hire in Hamilton from $35/hr. 2-tonne and 3-tonne moving trucks with tail lifts, blankets and tie-downs. Same-day pickup in Frankton, drive on a car licence."
    h1="Moving Truck Hire Hamilton — Same-Day House Movers"
    intro="Moving house in Hamilton shouldn't take a week of phone calls. Our moving trucks come ready to go — tail lift or ramp, tie-down points, optional blankets and trolleys, hourly rates from $35/hr. Drive on a standard NZ car licence, no endorsements needed for the 2-tonne fleet."
    bullets={[
      '2-tonne 12 m³ and 16 m³ moving trucks',
      '3-tonne 19 m³ truck with hydraulic tail lift',
      'Optional blankets, hand trolleys and ratchet straps',
      'Drive on a standard NZ Class 1 car licence',
      'Same-day pickup from our Frankton branch',
      'One-way moves to Auckland, Tauranga and Wellington on request',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a moving truck"
    cities={cities}
    faq={[
      { q: 'How much does a moving truck cost in Hamilton?', a: 'Moving trucks in Hamilton start from $35/hr plus kilometres, with daily rates from around $129/day for a 2-tonne. Tail-lift and 3-tonne options are a little higher.' },
      { q: 'What size moving truck do I need for my Hamilton move?', a: 'For a one-bedroom apartment a 2-tonne 12 m³ is plenty. For a 2–3 bedroom Hamilton home, the 2-tonne 16 m³ or 3-tonne 19 m³ with tail lift handles it in one trip.' },
      { q: 'Can I move from Hamilton to Auckland or Tauranga in one of your trucks?', a: 'Yes — one-way and long-distance moves between Hamilton, Auckland, Tauranga and Wellington are available on request when booking.' },
      { q: 'Do I need a truck licence?', a: 'No — every 2-tonne moving truck drives on a standard NZ Class 1 car licence. The 3-tonne 19 m³ requires a Class 2 (HT) licence.' },
      { q: 'Where do I pick the moving truck up?', a: 'All Hamilton moving trucks are collected from our Frankton branch at 17 Bandon Street, minutes from SH1 and SH3.' },
      { q: 'Can I book a moving truck in Hamilton on short notice?', a: 'Yes — same-day and next-day moving truck hire is usually available, especially midweek. Online booking confirms instantly with live availability.' },
      { q: 'What is the minimum age to hire a moving truck?', a: 'Drivers must be at least 21 years old with a full NZ licence, or an approved overseas equivalent in English (or with an approved translation).' },
      { q: 'Is insurance included with Hamilton moving truck hire?', a: 'Basic insurance is included with a standard excess. You can reduce your excess at the counter by upgrading to Premium or Ultimate cover — recommended on big move days.' },
      { q: 'Is a bond required at pickup?', a: 'Yes — a refundable pre-authorisation hold is placed on your credit or debit card. The amount depends on the truck and insurance option chosen. Prepaid cards are not accepted.' },
      { q: 'How does fuel work on a moving truck?', a: 'Trucks are supplied full and must be returned full. Mobil, Z and BP stations within a few minutes of Frankton make this easy. A refuelling fee applies if returned short.' },
      { q: 'Are there kilometre limits or extra charges?', a: 'Hourly hires include a generous local kilometre allowance with a small per-kilometre charge beyond. Daily and weekly rates with higher km caps suit full Waikato or out-of-region moves — see the booking page for the exact figures.' },
      { q: 'Can I pick up or drop off outside opening hours?', a: 'Yes — after-hours pick up and drop off are available on request. Call our Hamilton branch on 0800 525 663 to arrange in advance.' },
      { q: 'How early should I book my moving truck?', a: 'Weekends and end-of-month dates fill up fast in Hamilton — book 1–2 weeks ahead if you can. Midweek (Tuesday–Thursday) almost always has same-day availability.' },
    ]}
  />
);

export default MovingTruckHireHamilton;