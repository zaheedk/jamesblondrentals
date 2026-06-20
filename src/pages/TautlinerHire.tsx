import SimpleHubPage from './SimpleHubPage';

const cities = [
  { name: 'Auckland', to: '/auckland-truck-rentals-hire' },
  { name: 'Wellington', to: '/truck-hire-wellington' },
  { name: 'Christchurch', to: '/truck-hire-christchurch' },
  { name: 'Hamilton', to: '/truck-hire-hamilton' },
];

const TautlinerHire = () => (
  <SimpleHubPage
    slug="/tautliner-hire"
    title="Tautliner Hire NZ — Curtain-Side Truck Rental, Same-Day"
    description="Tautliner hire and curtain-side truck rental across NZ. Easy side-loading for pallet freight, trade work and bulky cargo. Same-day pickup at Auckland, Wellington, Christchurch & Hamilton — drive on a car licence."
    h1="Tautliner Hire — Curtain-Side Truck Rental"
    intro="Tautliners (curtain-side trucks) make pallet freight and bulky cargo painless — slide the curtain, load from the side, no climbing onto the deck. Ideal for trade deliveries, event gear, pallet runs and warehouse moves."
    bullets={[
      'Side-loading curtain access',
      'Pallet-friendly deck',
      'Drive on a standard car licence',
      'Same-day pickup at all branches',
      'Daily and weekly hire rates',
      'Great for trade, courier and event work',
    ]}
    primaryCtaTo="/booking"
    primaryCtaLabel="Book a tautliner"
    cities={cities}
    faq={[
      { q: 'What is a tautliner?', a: 'A tautliner is a curtain-sided truck — instead of a hard box, the sides are heavy-duty fabric curtains that slide open, so you can load and unload from the side with a forklift or by hand.' },
      { q: 'Do you have tautliner hire near me?', a: 'James Blond rents curtain-side trucks from branches in Auckland, Wellington, Christchurch and Hamilton with same-day pickup 7 days a week.' },
      { q: 'Do I need a truck licence?', a: 'No — our standard tautliners drive on a Class 1 NZ car licence.' },
      { q: 'When should I pick a tautliner over a box truck?', a: 'Choose a tautliner when you need to side-load pallets or oversized items, or when you\'re unloading multiple drops at different sites. Choose a box truck if your priority is weather seal and security.' },
    ]}
  />
);

export default TautlinerHire;