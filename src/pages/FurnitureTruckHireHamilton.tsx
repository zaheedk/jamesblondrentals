import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Hamilton Truck Hire', to: '/truck-hire-hamilton' },
  { name: 'Hamilton Van Hire', to: '/van-hire-hamilton' },
  { name: 'Hamilton Car Hire', to: '/car-hire-hamilton' },
  { name: 'Contact Hamilton', to: '/contact/hamilton' },
];

const FurnitureTruckHireHamilton = () => (
  <SimpleHubPage
    slug="/furniture-truck-hire-hamilton"
    title="Furniture Truck Hire Hamilton from $35/hr — Tail-Lift Movers"
    description="Furniture truck hire in Hamilton from $35/hr. 2-tonne and 3-tonne furniture trucks with tail lifts, blankets and tie-downs. Same-day pickup in Frankton, drive on a car licence."
    h1="Furniture Truck Hire Hamilton — Tail-Lift Movers from $35/hr"
    intro="Moving a couch, a fridge or a full lounge suite around the Waikato? Our Hamilton furniture trucks are built for it — tail lift, low-loading deck, moving blankets and tie-down points included. Pickup from our Frankton branch, drive on a standard car licence, hourly rates from $35/hr."
    bullets={[
      '2-tonne and 3-tonne furniture trucks',
      'Hydraulic tail lifts (400 kg) for whiteware and heavy furniture',
      'Moving blankets, hand trolleys and tie-down straps available',
      'Drive on a standard NZ Class 1 car licence',
      'Same-day pickup from Frankton, 7 days a week',
      'Hourly, daily and weekly rates — no padded day rates',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a furniture truck"
    cities={cities}
    faq={[
      { q: 'How much does furniture truck hire cost in Hamilton?', a: 'Furniture trucks in Hamilton start from $35/hr plus kilometres, with daily rates from around $129/day for a 2-tonne. Tail-lift and 3-tonne trucks are slightly higher. Quotes are instant when you book online.' },
      { q: 'Which size furniture truck do I need?', a: 'For a one-bedroom apartment a 2-tonne 12 m³ is plenty. For a two- or three-bedroom Hamilton home, a 2-tonne 16 m³ or 3-tonne 19 m³ with tail lift is the right call.' },
      { q: 'Do your Hamilton furniture trucks have tail lifts?', a: 'Yes — our 2-tonne 12 m³ tail-lift and 3-tonne 19 m³ trucks both have 400 kg hydraulic tail lifts, ideal for fridges, washers, dressers and pianos.' },
      { q: 'Where do I pick the truck up in Hamilton?', a: 'All Hamilton furniture trucks are collected from our Frankton branch at 17 Bandon Street, with easy access to SH1 and SH3 for moves across the Waikato.' },
      { q: 'Can I take a furniture truck from Hamilton to Auckland or Tauranga?', a: 'Yes — one-way and long-distance moves between Hamilton, Auckland, Tauranga and Wellington are available on request when booking.' },
      { q: 'Do I need a special licence?', a: 'No. Every 2-tonne furniture truck drives on a standard NZ Class 1 car licence. The 3-tonne 19 m³ requires a Class 2 (HT) licence.' },
      { q: 'What is the minimum age to hire a furniture truck in Hamilton?', a: 'You must be at least 21 years old and hold a full New Zealand licence (or an approved overseas equivalent in English, or with an approved translation).' },
      { q: 'Is insurance included with Hamilton furniture truck hire?', a: 'Basic insurance is included with a standard excess. You can reduce your excess at the counter by upgrading to Premium or Ultimate cover for extra peace of mind on furniture moves.' },
      { q: 'Is a bond or security deposit required?', a: 'Yes — a refundable pre-authorisation hold is placed on your credit or debit card at pickup. The amount depends on the truck size and insurance option you choose. Prepaid cards are not accepted.' },
      { q: 'Are moving blankets, trolleys and straps included?', a: 'Moving blankets, hand trolleys, large hand trolleys and ratchet straps are available as low-cost extras at the counter, and they nearly always pay for themselves on a Hamilton move.' },
      { q: 'How does fuel work?', a: 'Trucks are supplied full and should be returned full. Mobil, Z and BP stations within a few minutes of our Frankton branch make refuelling easy. A refuelling fee applies if returned short.' },
      { q: 'Are there kilometre limits on Hamilton furniture truck hire?', a: 'Hourly hires include a generous local kilometre allowance, with a small per-kilometre charge beyond that. Daily and weekly rates with higher km caps are available — perfect for full Waikato or out-of-region moves.' },
      { q: 'Can I pick up or drop off outside opening hours?', a: 'Yes — after-hours pick up and drop off are available on request. Phone our Hamilton branch on 0800 525 663 to arrange this in advance.' },
    ]}
  />
);

export default FurnitureTruckHireHamilton;