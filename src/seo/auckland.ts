export const aucklandHirePaths = {
  vans: '/van-hire-auckland',
  cars: '/car-hire-auckland',
  trucks: '/auckland-truck-rentals-hire',
  westTrucks: '/west-auckland-truck-rentals-hire',
  east: '/car-van-hire-east-auckland',
};

export const aucklandVanSEO = {
  path: aucklandHirePaths.vans,
  title: 'Van Hire Auckland | Cargo, Moving & Jumbo Vans | James Blond',
  description: 'Compare Auckland cargo and jumbo van hire for moving, trades and deliveries. Pick up in Glen Eden, Auckland Airport or Mt Wellington. Check dates and rates online.',
  heading: 'Van Hire Auckland — Cargo Vans, Jumbo Vans & 12-Seat Minibuses',
  body: 'Auckland van hire for furniture pickups, small moves, trades and deliveries. Collection branches include 4004 Great North Road, Glen Eden; 203 Kirkbride Road, Māngere, near Auckland Airport; and 6C McLennan Road, Mt Wellington, East Auckland. Check your dates for vehicle availability, rental rates and applicable kilometre charges. Passenger minibuses are quoted on request. For a larger move, collect a moving truck from West Auckland; Mt Wellington offers cars and vans only.',
};

export const aucklandCarSEO = {
  path: aucklandHirePaths.cars,
  title: 'Car Hire Auckland | Glen Eden, Airport & Mt Wellington | James Blond',
  description: 'Auckland car rental with economy cars, SUVs and people movers. Explore Glen Eden, Auckland Airport and Mt Wellington pickup options and check live prices online.',
  heading: 'Car Hire Auckland — Local Car Rental',
  body: 'Car hire Auckland from James Blond Rentals. Compare economy cars, midsize cars, SUVs and people movers for work, family visits and North Island travel. Explore collection in Glen Eden, Māngere near Auckland Airport, and Mt Wellington in East Auckland. Search your dates for live availability and prices, and complete online check-in before pickup. Passenger minibus prices are on request.',
};

export function aucklandArticleHirePath(title: string, slug = '') {
  const topic = `${title} ${slug}`.toLowerCase().replace(/-/g, ' ');
  if (!/\bauckland\b/.test(topic) || /\bwellington\b|\bhamilton\b|\bchristchurch\b/.test(topic)) return undefined;
  if (/\bminibus\b|\bseater\b|\bpassenger\b/.test(topic)) return undefined;
  if (/\btruck\b/.test(topic)) return aucklandHirePaths.trucks;
  if (/\bvan\b|\bvans\b/.test(topic)) return aucklandHirePaths.vans;
  if (/\bcar\b|\bcars\b/.test(topic)) return aucklandHirePaths.cars;
  return undefined;
}