export const wellingtonCarSEO = {
  path: '/car-rental-wellington-new-zealand',
  title: 'Car Hire Wellington | Te Aro Car Rental | James Blond',
  description: 'Book Wellington car hire from 24 Abel Smith Street, Te Aro. Compare cars and SUVs, check prices for your dates and explore one-way rental options.',
  heading: 'Car Hire Wellington — Te Aro Car Rental',
  body: 'Wellington car hire and car rental from James Blond Rentals at 24 Abel Smith Street, Te Aro. Collect in Wellington CBD for city trips, Hutt Valley visits or travel to Porirua and the Kāpiti Coast. Compare economy cars, family cars and SUVs, check availability and prices for your dates, and ask about one-way hire to other branches.',
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