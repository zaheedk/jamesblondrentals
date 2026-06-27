import vanHero from '@/assets/cargo-van-south-auckland-skyline.jpg';
import vanInterior from '@/assets/cargo-van-interior-south-auckland.jpg';
import vanFleet from '@/assets/south-auckland-cargo-van-fleet.jpg';
import truckMoving from '@/assets/family-unloading-removal-truck.jpg';
import truckBoxes from '@/assets/truck-moving-boxes-household-items.jpg';
import truckLoading from '@/assets/truck-open-doors-loading-boxes.jpg';
import couplemoving from '@/assets/couple-moving-boxes-truck.jpg';

export type WellingtonPageKind = 'van' | 'truck';

export interface WellingtonSubPage {
  slug: string;
  path: string;
  kind: WellingtonPageKind;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  fromPrice: string;
  recommendedSlug: string;
  recommendedName: string;
  useCases: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  bodyParagraphs: string[];
  breadcrumbLabel: string;
  locationName: string;
}

const baseFaqs = [
  {
    question: 'Do I need a special licence?',
    answer:
      'No. Every van and the 2-tonne and 3-tonne trucks in our Wellington fleet are automatic and can be driven on a standard New Zealand Class 1 car licence — no truck endorsement required.',
  },
  {
    question: 'Is there a one-way drop-off available?',
    answer:
      'Yes. One-way van and truck hire between our Wellington branch and other North or South Island locations is available on request when you book.',
  },
];

export const wellingtonVanTruckPages: WellingtonSubPage[] = [
  // ============== VAN SATELLITES ==============
  {
    slug: 'cargo-van-hire-wellington',
    path: '/cargo-van-hire-wellington',
    kind: 'van',
    metaTitle: 'Cargo Van Hire Wellington from $69/day — Same-Day Pickup',
    metaDescription:
      'Cargo van rental in Wellington for trades, couriers and small moves. Standard and jumbo cargo vans from $69/day. Drive on a car licence, same-day pickup.',
    eyebrow: 'Wellington · Cargo Van',
    h1: 'Cargo Van Hire in Wellington',
    intro:
      'Sliding side door, flat cargo floor, car licence. The cargo van is the everyday workhorse for Wellington tradies, couriers and weekend movers — and ours start from $69/day, picked up from our Te Aro branch.',
    heroImage: vanHero,
    heroAlt: 'Cargo van for hire in Wellington',
    fromPrice: '$69',
    recommendedSlug: '/fleet/vans/standard-van',
    recommendedName: 'Standard Cargo Van',
    locationName: 'Wellington',
    breadcrumbLabel: 'Cargo Van Hire Wellington',
    useCases: [
      { title: 'Couriers & last-mile delivery', description: 'Light, nimble and fuel-efficient — sized for parcel runs across the CBD, Newtown, Kilbirnie and Miramar.' },
      { title: 'Tradies on the tools', description: 'Lockable cargo area, twin side doors and easy ladder loading. Daily and weekly rates for jobs across the capital.' },
      { title: 'Small furniture moves', description: 'Pair with a hand trolley and shift a bedroom of furniture between Te Aro, Mt Vic and Aro Valley without booking a truck.' },
    ],
    faqs: [
      {
        question: 'How much does a cargo van cost to hire in Wellington?',
        answer:
          'Cargo van hire in Wellington starts from $69 per day plus kilometres. Multi-day, weekly and midweek rates lower the daily price further — see the hot deals page for current discounts.',
      },
      {
        question: 'What size cargo van do I need?',
        answer:
          'For courier work or trade tools, the Standard Cargo Van (around 6–8 m³) is plenty. For bigger jobs like flat-pack runs from Petone or a small house move, step up to the Jumbo Van (around 10–12 m³).',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Wellington runs on cargo vans. From courier drivers crossing the CBD before dawn to sparkies ducking between jobs in Newtown and Kilbirnie, the cargo van is the most versatile working vehicle on the capital\'s roads. Our Wellington cargo van fleet is sized, priced and maintained for exactly that life.',
      'Every cargo van in our Wellington fleet is automatic, drives on a Class 1 car licence and comes with unlimited kilometres on most rate plans. Pick up from our Te Aro branch with quick access to SH1, the waterfront and Wellington Airport.',
    ],
  },
  {
    slug: 'moving-van-hire-wellington',
    path: '/moving-van-hire-wellington',
    kind: 'van',
    metaTitle: 'Moving Van Hire Wellington — Cargo & Jumbo Vans for House Moves',
    metaDescription:
      'Moving van hire in Wellington for house moves, flat shifts and student moves. Jumbo vans, hand trolleys and straps available. From $69/day, car licence only.',
    eyebrow: 'Wellington · Moving Van',
    h1: 'Moving Van Hire in Wellington',
    intro:
      'Shifting flats in Te Aro, moving a bedroom from Kelburn, or clearing out a garage in Karori? A jumbo van is usually all you need — cheaper than a truck, easier on Wellington streets, and you can drive it on a car licence.',
    heroImage: vanFleet,
    heroAlt: 'Moving van loaded for a Wellington house move',
    fromPrice: '$69',
    recommendedSlug: '/fleet/vans/jumbo-van',
    recommendedName: 'Jumbo Van',
    locationName: 'Wellington',
    breadcrumbLabel: 'Moving Van Hire Wellington',
    useCases: [
      { title: 'Studio & one-bedroom moves', description: 'A jumbo van comfortably swallows a bed, sofa, fridge and a dozen boxes — no truck licence required.' },
      { title: 'Student flat shifts', description: 'Affordable daily rates and same-day pickup from Te Aro — perfect for end-of-trimester moves around Kelburn and Aro Valley.' },
      { title: 'Garage clear-outs & dump runs', description: 'Pair with a hand trolley and straps for green-waste, e-waste or charity drop-offs.' },
    ],
    faqs: [
      {
        question: 'Will a moving van fit my bedroom of furniture?',
        answer:
          'A Jumbo Van (around 10–12 m³) comfortably fits a queen bed, mattress, sofa, fridge and 10–15 medium boxes. For two-bedroom-plus moves, look at our Wellington truck hire range.',
      },
      {
        question: 'Do you supply moving accessories?',
        answer:
          'Yes — hand trolleys, large hand trolleys, moving blankets and ratchet straps can be added when you book your Wellington moving van.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Most Wellington moves don\'t need a truck — they need a big van. Our Jumbo Van is the sweet spot for studio, one-bedroom and small two-bedroom moves: enough cube to carry the bed, sofa, fridge and a stack of boxes in one or two loads, but small enough to park outside a Te Aro flat or a Mt Vic terrace.',
      'Hire by the day, the weekend or the week. Add a hand trolley, straps and moving blankets at checkout, and collect from our Te Aro branch with easy access to SH1 and the inner-city suburbs.',
    ],
  },
  {
    slug: 'van-hire-wellington-airport',
    path: '/van-hire-wellington-airport',
    kind: 'van',
    metaTitle: 'Van Hire Wellington Airport — Cargo & Jumbo Vans on Arrival',
    metaDescription:
      'Van rental near Wellington Airport for arriving travellers, families and trades. Cargo vans, jumbo vans and minibuses, quick pickup from our Te Aro branch.',
    eyebrow: 'Wellington Airport · Vans',
    h1: 'Van Hire near Wellington Airport',
    intro:
      'Land at WLG and pick up a van the same hour. Our Te Aro branch is a short ride from Wellington Airport, with cargo vans, jumbo vans and 12-seat minibuses ready to drive away.',
    heroImage: vanHero,
    heroAlt: 'Van rental at Wellington Airport',
    fromPrice: '$69',
    recommendedSlug: '/fleet/vans/standard-van',
    recommendedName: 'Standard Cargo Van',
    locationName: 'Wellington Airport',
    breadcrumbLabel: 'Van Hire Wellington Airport',
    useCases: [
      { title: 'Arriving for a tour or wedding', description: 'Pick up a jumbo van or 12-seat minibus and head straight to Martinborough, the Wairarapa or the Kāpiti Coast.' },
      { title: 'Trades flying in for a project', description: 'Cargo van waiting on arrival — sized for tools, materials and a tight Wellington parking spot.' },
      { title: 'One-way drop in another city', description: 'Drive north to Auckland or south to Christchurch (via the ferry) and drop the van at the next branch — one-way hire available on request.' },
    ],
    faqs: [
      {
        question: 'How do I get from Wellington Airport to your branch?',
        answer:
          'Our Te Aro branch is around 10 minutes from Wellington Airport (WLG) by taxi or rideshare. Call the branch when you land and we\'ll have the van ready.',
      },
      {
        question: 'Can I pick up a van after a late flight?',
        answer:
          'After-hours and late-flight pickups can be arranged in advance — give the Wellington branch a call when you book.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Wellington Airport is the front door to the lower North Island, and arriving travellers often need a van rather than a car — for golf bags, for trade tools, for a touring group, or for a one-way drive north. Our Wellington van fleet sits minutes from the WLG terminal in Te Aro.',
      'Standard cargo vans, long-wheelbase jumbo vans and 12-seat minibuses are all available, all on a Class 1 car licence and all automatic.',
    ],
  },
  {
    slug: 'van-hire-lower-hutt',
    path: '/van-hire-lower-hutt',
    kind: 'van',
    metaTitle: 'Van Hire Lower Hutt — Cargo & Moving Vans from Te Aro Branch',
    metaDescription:
      'Van hire serving Lower Hutt, Petone and the Hutt Valley. Cargo, jumbo and 12-seat vans from our Wellington Te Aro branch — quick collection via SH2.',
    eyebrow: 'Hutt Valley · Lower Hutt',
    h1: 'Van Hire in Lower Hutt',
    intro:
      'Lower Hutt and the wider Hutt Valley sit a 15-minute drive from our Te Aro branch via SH2. Pick up a cargo van, jumbo van or 12-seat minibus and head straight back out to Petone, Naenae or Stokes Valley.',
    heroImage: vanFleet,
    heroAlt: 'Van hire for Lower Hutt and Hutt Valley customers',
    fromPrice: '$69',
    recommendedSlug: '/fleet/vans/standard-van',
    recommendedName: 'Standard Cargo Van',
    locationName: 'Lower Hutt',
    breadcrumbLabel: 'Van Hire Lower Hutt',
    useCases: [
      { title: 'Hutt Valley tradies', description: 'Daily and weekly cargo van hire for jobs across Petone, Naenae, Wainuiomata and Upper Hutt.' },
      { title: 'House & flat moves', description: 'Jumbo van plus hand trolley for moves between Petone, Lower Hutt and the inner city.' },
      { title: 'Sports clubs & schools', description: '12-seat minibus for Saturday-sport runs and weekend trips out of the Hutt.' },
    ],
    faqs: [
      {
        question: 'Do you have a Lower Hutt branch?',
        answer:
          'Our nearest branch is in Te Aro, Wellington — about 15 minutes from Lower Hutt via SH2. We regularly serve Petone, Lower Hutt, Naenae, Wainuiomata and Upper Hutt from there.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'The Hutt Valley packs a lot of trade work, suburban moving and weekend furniture runs into a relatively small area, and the short hop down SH2 means our Te Aro fleet is a practical alternative to driving further afield. Most jobs out here are van jobs, not truck jobs.',
      'Hire a cargo van, jumbo van or 12-seat minibus from our Wellington branch and you\'ll be back in Lower Hutt inside half an hour.',
    ],
  },
  {
    slug: 'van-hire-porirua',
    path: '/van-hire-porirua',
    kind: 'van',
    metaTitle: 'Van Hire Porirua — Cargo & Moving Vans from Wellington',
    metaDescription:
      'Van hire for Porirua, Tawa, Whitby and Cannons Creek. Cargo vans, jumbo vans and 12-seat minibuses from our Wellington Te Aro branch.',
    eyebrow: 'Wellington Region · Porirua',
    h1: 'Van Hire in Porirua',
    intro:
      'Porirua sits 20 minutes north of our Te Aro branch on SH1. Pick up a cargo van, jumbo van or 12-seat minibus and you\'ll be back in Porirua, Tawa or Whitby inside the hour.',
    heroImage: vanHero,
    heroAlt: 'Van hire for Porirua customers',
    fromPrice: '$69',
    recommendedSlug: '/fleet/vans/standard-van',
    recommendedName: 'Standard Cargo Van',
    locationName: 'Porirua',
    breadcrumbLabel: 'Van Hire Porirua',
    useCases: [
      { title: 'Porirua & Tawa trades', description: 'Cargo van hire for sparkies, plumbers, builders and couriers working across the northern suburbs.' },
      { title: 'Subdivision & first-home moves', description: 'Jumbo van for moves around Whitby, Aotea, Pāuatahanui and Plimmerton.' },
      { title: 'Marae, church & community groups', description: '12-seat minibus for weekend trips, hui and sports runs.' },
    ],
    faqs: [
      {
        question: 'Do you have a Porirua branch?',
        answer:
          'Our nearest branch is in Te Aro, Wellington, around 20 minutes south of Porirua via SH1. We serve Porirua, Tawa, Whitby, Plimmerton and the wider region from there.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Porirua has grown into one of Wellington\'s busiest commuter and trade hubs — and a lot of those jobs need a van. SH1 makes the trip from Te Aro a quick 20-minute run, with motorway parking and a fleet sized for tight suburban driveways.',
      'Cargo vans for trades, jumbo vans for moves, and 12-seat minibuses for group trips — all available from our Wellington branch.',
    ],
  },
  {
    slug: 'van-hire-kapiti-coast',
    path: '/van-hire-kapiti-coast',
    kind: 'van',
    metaTitle: 'Van Hire Kapiti Coast — Paraparaumu, Waikanae & Otaki Van Rental',
    metaDescription:
      'Van hire serving the Kāpiti Coast — Paraparaumu, Waikanae, Raumati and Ōtaki. Cargo, jumbo and 12-seat vans from our Wellington Te Aro branch.',
    eyebrow: 'Wellington Region · Kāpiti Coast',
    h1: 'Van Hire on the Kāpiti Coast',
    intro:
      'Paraparaumu, Waikanae, Raumati and Ōtaki are a 40-minute drive up the Kāpiti Expressway from our Te Aro branch. Pick up a van and you\'ll be on the coast inside the hour.',
    heroImage: vanFleet,
    heroAlt: 'Van hire for Kapiti Coast customers',
    fromPrice: '$69',
    recommendedSlug: '/fleet/vans/jumbo-van',
    recommendedName: 'Jumbo Van',
    locationName: 'Kāpiti Coast',
    breadcrumbLabel: 'Van Hire Kapiti Coast',
    useCases: [
      { title: 'Kāpiti trades & deliveries', description: 'Cargo van hire for projects across Paraparaumu, Waikanae and Ōtaki.' },
      { title: 'Bach & beach-house moves', description: 'Jumbo van for furniture and white-ware runs between Wellington and the coast.' },
      { title: 'Group trips & retreats', description: '12-seat minibus for weekend retreats, family weddings and surf-trip crews.' },
    ],
    faqs: [
      {
        question: 'How long is the drive from Wellington to Paraparaumu?',
        answer:
          'Around 40 minutes via the Kāpiti Expressway, traffic depending. Most customers find it a comfortable out-and-back morning collection.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'The Kāpiti Coast is increasingly a Wellington suburb with a 40-minute commute, and the Kāpiti Expressway has made our Te Aro fleet a practical choice for Paraparaumu, Waikanae and Ōtaki customers. Whether it\'s a bach refit, a beach move or a Kāpiti Island day-trip, a van is usually the right tool.',
      'Cargo vans, jumbo vans and 12-seat minibuses are all available from our Wellington branch — and one-way drops further north can be arranged on request.',
    ],
  },

  // ============== TRUCK SATELLITES ==============
  {
    slug: 'small-truck-hire-wellington',
    path: '/small-truck-hire-wellington',
    kind: 'truck',
    metaTitle: 'Small Truck Hire Wellington — 2 Tonne Box Trucks on a Car Licence',
    metaDescription:
      'Small truck hire in Wellington — 2 tonne box trucks from 9 m³ to 16 m³, drivable on a Class 1 car licence. Daily, weekly and midweek rates from $129/day.',
    eyebrow: 'Wellington · Small Truck',
    h1: 'Small Truck Hire in Wellington',
    intro:
      'When a van is too small and a 3-tonne truck is overkill, our 2-tonne box trucks are the sweet spot. 9 m³, 12 m³ and 16 m³ box bodies — all automatic, all car-licence drives, all picked up from our Te Aro branch.',
    heroImage: truckLoading,
    heroAlt: 'Small box truck for hire in Wellington',
    fromPrice: '$129',
    recommendedSlug: '/fleet/trucks/2-tonne-box-12m3',
    recommendedName: '2 Tonne Box Truck (12 m³)',
    locationName: 'Wellington',
    breadcrumbLabel: 'Small Truck Hire Wellington',
    useCases: [
      { title: 'One- and two-bedroom moves', description: 'A 12 m³ box truck shifts a one-bedroom unit in a single load — bed, sofa, fridge, washing machine and 20+ boxes.' },
      { title: 'Tradies & small deliveries', description: 'Walk-through cargo space and tie-rails for materials, tools and pallets.' },
      { title: 'Garage clear-outs & dump runs', description: 'Big enough to clear a Wellington garage in one trip without booking the biggest truck on the lot.' },
    ],
    faqs: [
      {
        question: 'Can I drive a small truck on a car licence in New Zealand?',
        answer:
          'Yes. Our 2-tonne and 3-tonne box trucks are under 6,000 kg GVM, so they\'re drivable on a standard Class 1 car licence with no truck endorsement required.',
      },
      {
        question: 'What size small truck do I need?',
        answer:
          'For a studio or bedroom move, 9 m³ is enough. For a one-bedroom flat, go 12 m³. For a small two-bedroom, step up to 16 m³ or our 3-tonne range.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'A lot of Wellington moves and trade jobs fall in the awkward middle — too big for a van, too small to need our biggest truck. Our 2-tonne box trucks fill that gap perfectly: 9, 12 or 16 cubic metres of lockable cargo space, all on a car licence, all automatic, all priced for daily and weekly hire.',
      'Pick up from our Te Aro branch with quick access to SH1, SH2 and the inner-city suburbs. Pair with a hand trolley, straps and moving blankets at checkout.',
    ],
  },
  {
    slug: 'moving-truck-hire-wellington',
    path: '/moving-truck-hire-wellington',
    kind: 'truck',
    metaTitle: 'Moving Truck Hire Wellington — Box Trucks for House Moves',
    metaDescription:
      'Moving truck hire in Wellington for one, two and three-bedroom house moves. 2 and 3 tonne box trucks, tail lifts available, car licence only. From $129/day.',
    eyebrow: 'Wellington · Moving Truck',
    h1: 'Moving Truck Hire in Wellington',
    intro:
      'Moving a house in Wellington means hills, narrow streets and tight driveways. Our 2 and 3-tonne box trucks are the right size for that job — big enough to shift a two or three-bedroom home in one or two loads, small enough to park outside it.',
    heroImage: truckMoving,
    heroAlt: 'Family unloading a moving truck in Wellington',
    fromPrice: '$129',
    recommendedSlug: '/fleet/trucks/3-tonne-box-19m3',
    recommendedName: '3 Tonne Box Truck (19 m³)',
    locationName: 'Wellington',
    breadcrumbLabel: 'Moving Truck Hire Wellington',
    useCases: [
      { title: 'Two & three-bedroom moves', description: '18–19 m³ box bodies shift most family-sized Wellington moves in a single load.' },
      { title: 'Apartment moves with a tail lift', description: 'Optional hydraulic tail lift for moving white-ware and heavy furniture out of CBD apartments.' },
      { title: 'Inter-city moves', description: 'Drive Wellington–Auckland or Wellington–Christchurch (via ferry) one-way — drop-off at any branch on request.' },
    ],
    faqs: [
      {
        question: 'How big a moving truck do I need in Wellington?',
        answer:
          'One bedroom: 12 m³. Two bedrooms: 16 m³. Three bedrooms or apartment with white-ware: 18–19 m³ or larger. Our team can size it up for you over the phone.',
      },
      {
        question: 'Do you offer one-way moving truck hire from Wellington?',
        answer:
          'Yes. One-way truck hire from Wellington to Auckland, Hamilton and Christchurch (via the ferry) is available on request — the one-way fee is confirmed at booking.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Wellington moves test a truck. Steep driveways in Kelburn, tight terraces in Mt Vic, weather that turns on a dime — you want a truck that\'s easy to handle, easy to park, and sized for the actual job. Our moving truck range covers everything from a studio shift to a three-bedroom family move.',
      'All trucks are automatic, drive on a Class 1 car licence and can be picked up from our Te Aro branch. Add a hand trolley, ratchet straps and moving blankets at checkout, and book a tail-lift truck if you\'re dealing with apartments or heavy white-ware.',
    ],
  },
  {
    slug: 'furniture-truck-hire-wellington',
    path: '/furniture-truck-hire-wellington',
    kind: 'truck',
    metaTitle: 'Furniture Truck Hire Wellington — Box Trucks with Hand Trolleys',
    metaDescription:
      'Furniture truck hire in Wellington. Box trucks from 12 m³ to 19 m³, walk-through cargo, hand trolleys and moving blankets available. Car licence only.',
    eyebrow: 'Wellington · Furniture Truck',
    h1: 'Furniture Truck Hire in Wellington',
    intro:
      'Bought a sofa from a Wellington warehouse, picked up a dining suite from Trade Me, or clearing out a parents\' place in Khandallah? Our furniture trucks make the job a one-trip job — and you can drive them on your car licence.',
    heroImage: couplemoving,
    heroAlt: 'Furniture truck loaded for a Wellington pickup',
    fromPrice: '$129',
    recommendedSlug: '/fleet/trucks/2-tonne-box-12m3-tail',
    recommendedName: '2 Tonne Box Truck with Tail Lift',
    locationName: 'Wellington',
    breadcrumbLabel: 'Furniture Truck Hire Wellington',
    useCases: [
      { title: 'Single-item furniture pickups', description: 'Box body fits a three-seater sofa, queen bed or dining suite with room to spare.' },
      { title: 'Trade Me & marketplace runs', description: 'Spend a Saturday doing multiple pickups across Wellington in a single truck.' },
      { title: 'Estate & house clearances', description: 'Pair with a hand trolley and straps for heavy lounge and bedroom items.' },
    ],
    faqs: [
      {
        question: 'Do you supply hand trolleys and moving blankets?',
        answer:
          'Yes — hand trolleys, large hand trolleys, moving blankets and ratchet straps can be added to your Wellington furniture truck booking at checkout.',
      },
      {
        question: 'Can I get a truck with a tail lift?',
        answer:
          'Yes. Our 2-tonne tail-lift truck is the easiest way to load heavy single items like washing machines, fridges and sofas without lifting them at full height.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Furniture is the most common reason Wellingtonians hire a truck for the day. A new sofa from a Tory Street warehouse, a Trade Me dining suite in Petone, a wardrobe pickup from a friend in Newtown — it almost always needs more than a car can carry, but rarely needs a removalist.',
      'Our 2-tonne and 3-tonne box trucks are sized for exactly that job, and the tail-lift option turns the heavy items into a one-person job. All drivable on a Class 1 car licence.',
    ],
  },
  {
    slug: 'truck-hire-lower-hutt',
    path: '/truck-hire-lower-hutt',
    kind: 'truck',
    metaTitle: 'Truck Hire Lower Hutt — Moving & Furniture Trucks from Wellington',
    metaDescription:
      'Truck hire serving Lower Hutt, Petone and the Hutt Valley. 2 and 3 tonne box trucks from our Wellington Te Aro branch — car licence drives.',
    eyebrow: 'Hutt Valley · Lower Hutt',
    h1: 'Truck Hire in Lower Hutt',
    intro:
      'Lower Hutt, Petone and the Hutt Valley sit a short drive down SH2 from our Te Aro branch. Hire a 2 or 3-tonne box truck for moving day and you\'ll be parked outside your Petone or Naenae place inside half an hour.',
    heroImage: truckBoxes,
    heroAlt: 'Box truck for hire serving Lower Hutt',
    fromPrice: '$129',
    recommendedSlug: '/fleet/trucks/2-tonne-box-12m3',
    recommendedName: '2 Tonne Box Truck (12 m³)',
    locationName: 'Lower Hutt',
    breadcrumbLabel: 'Truck Hire Lower Hutt',
    useCases: [
      { title: 'Hutt Valley house moves', description: 'Box trucks sized for two and three-bedroom moves across Petone, Naenae, Wainuiomata and Stokes Valley.' },
      { title: 'Furniture pickups', description: 'Single-trip runs to Wellington warehouses for new lounge, bedroom or dining furniture.' },
      { title: 'Garage & estate clear-outs', description: 'Big enough to clear a Hutt Valley garage in one or two trips to the transfer station.' },
    ],
    faqs: [
      {
        question: 'Do you have a Lower Hutt truck branch?',
        answer:
          'Our nearest branch is in Te Aro, Wellington — about 15 minutes from Lower Hutt via SH2. We serve Petone, Lower Hutt, Naenae, Wainuiomata and Upper Hutt from there.',
      },
      {
        question: 'Can I drive your trucks on a car licence?',
        answer:
          'Yes. Our 2-tonne and 3-tonne box trucks are under 6,000 kg GVM and drive on a standard Class 1 car licence.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'The Hutt Valley does a steady volume of house moves, furniture pickups and dump runs, and the short hop down SH2 makes our Wellington truck fleet a practical alternative to driving across town. Most Hutt jobs are box-truck jobs — 2-tonne for one and two-bedroom moves, 3-tonne for family-sized loads.',
      'Hire a moving truck from Te Aro and you\'ll be in Petone, Lower Hutt or Upper Hutt inside half an hour.',
    ],
  },
  {
    slug: 'truck-hire-porirua',
    path: '/truck-hire-porirua',
    kind: 'truck',
    metaTitle: 'Truck Hire Porirua — Moving Trucks from Wellington',
    metaDescription:
      'Truck hire for Porirua, Tawa, Whitby and Cannons Creek. 2 and 3 tonne box trucks from our Wellington Te Aro branch — car licence only.',
    eyebrow: 'Wellington Region · Porirua',
    h1: 'Truck Hire in Porirua',
    intro:
      'Porirua and the northern suburbs are 20 minutes up SH1 from our Te Aro branch. Hire a 2 or 3-tonne box truck and you\'ll be back in Porirua, Tawa or Whitby inside the hour — ready to move.',
    heroImage: truckLoading,
    heroAlt: 'Box truck for hire serving Porirua',
    fromPrice: '$129',
    recommendedSlug: '/fleet/trucks/3-tonne-box-19m3',
    recommendedName: '3 Tonne Box Truck (19 m³)',
    locationName: 'Porirua',
    breadcrumbLabel: 'Truck Hire Porirua',
    useCases: [
      { title: 'Subdivision & first-home moves', description: '18–19 m³ box trucks sized for new-build moves around Whitby, Aotea and Plimmerton.' },
      { title: 'Family house moves', description: 'Two and three-bedroom moves across Tawa, Porirua and Cannons Creek.' },
      { title: 'Bulk pickups & dump runs', description: 'Single-trip transfer-station runs and bulky-item pickups across the northern suburbs.' },
    ],
    faqs: [
      {
        question: 'Do you have a Porirua branch?',
        answer:
          'Our nearest branch is in Te Aro, Wellington — around 20 minutes south via SH1. We serve Porirua, Tawa, Whitby, Plimmerton and the wider region from there.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Porirua keeps adding new homes, new families and new moving jobs to the calendar — and SH1 puts our Wellington truck fleet within easy reach. Most Porirua moves fit a 2-tonne box truck; family moves and bigger subdivisions step up to the 3-tonne range.',
      'All trucks drive on a Class 1 car licence and can be picked up from our Te Aro branch.',
    ],
  },
];

export const getWellingtonSubPageBySlug = (slug: string) =>
  wellingtonVanTruckPages.find((p) => p.slug === slug);