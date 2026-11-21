export const wellingtonCarSEO = {
  path: '/car-rental-wellington-new-zealand',
  title: 'Car Rental Wellington CBD | Car Hire in Te Aro | James Blond',
  description: 'Compare Wellington car hire at 24 Abel Smith Street, Te Aro. Live prices for your dates, $50 booking deposit and the remaining rental balance at pickup.',
  heading: 'Car Hire Wellington — Te Aro Car Rental',
  body: 'Wellington car hire and car rental from James Blond Rentals at 24 Abel Smith Street, Te Aro. Collect in Wellington CBD for city trips, Hutt Valley visits or travel to Porirua and the Kāpiti Coast. Compare economy cars, family cars and SUVs, check availability and prices for your dates, and ask about one-way hire to other branches.',
};

export const wellingtonAirportSEO = {
  path: '/airport/wellington',
  title: 'Wellington Airport Car Rental | Miramar Pickup | James Blond',
  description: 'Book Wellington Airport car hire with pickup at 19 Shelly Bay Road, Miramar. Check live availability and prices, shuttle details and airport return arrangements.',
  heading: 'Wellington Airport Car Rental',
  body: 'Wellington Airport car hire from James Blond Rentals, with off-terminal collection at 19 Shelly Bay Road, Miramar. Search your dates for cars and current prices. Call Windy Depot on 027 837 4372 after collecting your bags for the complimentary shuttle. Wellington CBD collection is separate, at 24 Abel Smith Street, Te Aro, Monday to Saturday, 8am to 5pm. Commercial vehicles must return to a city branch during opening hours, never after hours at an airport.',
};

// Page-scoped defaults take precedence on local pages without writing cookies.
export const wellingtonCarSearchDefaults = {
  defaultPickupLocation: '11', defaultDropoffLocation: '11', defaultCarCategory: '1', preferDefaultLocation: true,
};
export const wellingtonVanSearchDefaults = {
  defaultPickupLocation: '11', defaultDropoffLocation: '11', defaultCarCategory: '11', preferDefaultLocation: true,
};
export const wellingtonAirportSearchDefaults = {
  defaultPickupLocation: '13', defaultDropoffLocation: '13', defaultCarCategory: '1', preferDefaultLocation: true,
};

export const wellingtonVanSEO = {
  path: '/van-hire-wellington',
  title: 'Van Hire Wellington | Cargo & Moving Vans | James Blond',
  description: 'Wellington van hire from our Te Aro branch. Compare cargo, jumbo and moving vans for CBD and Hutt Valley jobs. Check availability and current rental prices.',
  heading: 'Van Hire Wellington — Cargo & Moving Vans',
  body: 'Van hire and van rental in Wellington from 24 Abel Smith Street, Te Aro. Compare standard cargo vans and jumbo moving vans for furniture, tools and deliveries around Wellington CBD, Lower Hutt, Petone and Porirua. Collection is at the Te Aro branch, not at each suburb. Check the price guide for rental rates and kilometre charges, then search your dates for live availability. Passenger van and minibus rates are on request.',
};

export const wellingtonAliases: Record<string, string> = {
  '/car-hire-wellington': wellingtonCarSEO.path,
  '/car-rental-wellington': wellingtonCarSEO.path,
  '/wellington-car-rental': wellingtonCarSEO.path,
  '/wellington-cargo-van-rentals': wellingtonVanSEO.path,
  '/wellington-truck-rentals': '/truck-hire-wellington',
};

export function isWellingtonVanArticle(title: string, slug = '') {
  const subject = `${title} ${slug}`;
  return /\bwellington\b/i.test(subject) && /\bvans?\b/i.test(subject);
}