import vanHero from '@/assets/cargo-van-south-auckland-skyline.jpg';
import vanInterior from '@/assets/cargo-van-interior-south-auckland.jpg';
import vanFleet from '@/assets/south-auckland-cargo-van-fleet.jpg';
import minibus from '@/assets/12-seater-van-auckland-sky-tower.jpg';

export interface ChristchurchVanPage {
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  fromPrice: string;
  recommendedVanSlug: string;
  recommendedVanName: string;
  useCases: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  bodyParagraphs: string[];
  breadcrumbLabel: string;
  locationName: string; // e.g. "Christchurch", "Rolleston"
}

const baseFaqs = [
  {
    question: 'Do I need a special licence?',
    answer:
      'No. Every van in our Christchurch and Canterbury fleet is automatic and can be driven on a standard New Zealand car (Class 1) licence — including the 12-seat minibus.',
  },
  {
    question: 'Is there a one-way drop-off available?',
    answer:
      'Yes. One-way van hire between our Christchurch branch and other South Island or North Island locations is available on request when you book.',
  },
];

export const christchurchVanPages: ChristchurchVanPage[] = [
  {
    slug: 'cargo-van-hire-christchurch',
    path: '/cargo-van-hire-christchurch',
    metaTitle: 'Cargo Van Hire Christchurch from $69/day — Same-Day Pickup',
    metaDescription:
      'Cargo van rental in Christchurch for trades, couriers and small moves. Standard and jumbo cargo vans from $69/day. Drive on a car licence, same-day pickup.',
    eyebrow: 'Christchurch · Cargo Van',
    h1: 'Cargo Van Hire in Christchurch',
    intro:
      'Sliding side door, flat cargo floor, car licence. The cargo van is the everyday workhorse for Christchurch tradies, couriers, e-commerce operators and weekend movers — and ours start from $69/day.',
    heroImage: vanHero,
    heroAlt: 'Cargo van for hire in Christchurch',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/standard-van',
    recommendedVanName: 'Standard Cargo Van',
    locationName: 'Christchurch',
    breadcrumbLabel: 'Cargo Van Hire Christchurch',
    useCases: [
      { title: 'Couriers & last-mile delivery', description: 'Light, nimble, fuel-efficient — perfect for parcel runs across Hornby, Sydenham and the central city.' },
      { title: 'Tradies on the tools', description: 'Lockable cargo area, twin side doors, easy ladder loading. Daily and weekly rates available.' },
      { title: 'Small furniture moves', description: 'Pair with a hand trolley and you can shift a bedroom of furniture across Christchurch without booking a truck.' },
    ],
    faqs: [
      {
        question: 'How much does a cargo van cost to hire in Christchurch?',
        answer:
          'Cargo van hire in Christchurch starts from $69 per day plus kilometres. Multi-day, weekly and midweek rates lower the daily price further — check our hot deals page for current discounts.',
      },
      {
        question: 'What size cargo van do I need?',
        answer:
          'For courier work or trade tools, the Standard Cargo Van (around 6–8 m³) is plenty. For bigger jobs like flat-pack runs from Riccarton or a small house move, step up to the Jumbo Van (around 10–12 m³).',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Christchurch runs on cargo vans. From courier drivers crossing the Port Hills before dawn to electricians ducking between jobs in Sockburn and Hornby, the cargo van is the most versatile working vehicle on Canterbury roads. Our Christchurch cargo van fleet is sized, priced and maintained for exactly that life.',
      'Every cargo van in our Christchurch fleet is automatic, drives on a standard Class 1 car licence, and comes with unlimited kilometres on most rate plans. Pick up from our Christchurch branch with quick access to State Highway 1, Christchurch Airport and the central city.',
    ],
  },
  {
    slug: 'moving-van-hire-christchurch',
    path: '/moving-van-hire-christchurch',
    metaTitle: 'Moving Van Hire Christchurch — Cargo & Jumbo Vans for House Moves',
    metaDescription:
      'Moving van hire in Christchurch for house moves, flat shifts and student moves. Jumbo vans, hand trolleys and straps available. From $69/day, car licence only.',
    eyebrow: 'Christchurch · Moving Van',
    h1: 'Moving Van Hire in Christchurch',
    intro:
      'Shifting flats in Riccarton, moving a bedroom from Ilam, or clearing out a garage in Cashmere? A jumbo van is usually all you need — cheaper than a truck, easier to park, and you can drive it on a car licence.',
    heroImage: vanFleet,
    heroAlt: 'Moving van loaded for a Christchurch house move',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/jumbo-van',
    recommendedVanName: 'Jumbo Van',
    locationName: 'Christchurch',
    breadcrumbLabel: 'Moving Van Hire Christchurch',
    useCases: [
      { title: 'Studio & one-bedroom moves', description: 'A jumbo van comfortably swallows a bed, a sofa, a fridge and a dozen boxes — no truck licence required.' },
      { title: 'Student flat shifts', description: 'Affordable daily rates and same-day pickup from our Christchurch branch, perfect for end-of-semester moves around Ilam and Riccarton.' },
      { title: 'Garage clear-outs & dump runs', description: 'Pair with a hand trolley and straps for green-waste, e-waste or charity drop-offs.' },
    ],
    faqs: [
      {
        question: 'Will a moving van fit my bedroom of furniture?',
        answer:
          'A Jumbo Van (around 10–12 m³) comfortably fits a queen bed, mattress, sofa, fridge and 10–15 medium boxes. For two-bedroom-plus moves we recommend looking at our Christchurch truck hire range instead.',
      },
      {
        question: 'Do you supply moving accessories?',
        answer:
          'Yes — hand trolleys, large hand trolleys, moving blankets and ratchet straps can all be added when you book your Christchurch moving van.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Most Christchurch moves don\'t need a truck — they need a big van. Our Jumbo Van is the sweet spot for studio, one-bedroom and small two-bedroom moves: enough cube to carry the bed, sofa, fridge and a stack of boxes in one or two loads, but small enough to park outside a Riccarton flat or a Sumner bach.',
      'Hire by the day, the weekend or the week. Add a hand trolley, straps and moving blankets at checkout, and pick up from our Christchurch branch with easy access to SH1, SH73 and the central city.',
    ],
  },
  {
    slug: '12-seater-van-hire-christchurch',
    path: '/12-seater-van-hire-christchurch',
    metaTitle: '12 Seater Van Hire Christchurch — Minibus Rental from $149/day',
    metaDescription:
      '12 seater van hire in Christchurch for sports teams, weddings, ski trips and airport shuttles. Automatic minibus, car licence, from $149/day.',
    eyebrow: 'Christchurch · 12-Seat Minibus',
    h1: '12 Seater Van Hire in Christchurch',
    intro:
      'Twelve seats, twelve seatbelts, air-con and boot space behind row four. Our 12-seat minibus is the easy answer for Christchurch sports teams, ski trips to Mt Hutt, wedding shuttles and airport runs.',
    heroImage: minibus,
    heroAlt: '12 seater van for hire in Christchurch',
    fromPrice: '$149',
    recommendedVanSlug: '/fleet/minibus/12-seat-minibus',
    recommendedVanName: '12-Seat Minibus',
    locationName: 'Christchurch',
    breadcrumbLabel: '12 Seater Van Hire Christchurch',
    useCases: [
      { title: 'Ski trips to Mt Hutt & Porters', description: 'Twelve seats, ski/board capacity in the back. Auto transmission and great visibility on the alpine drive.' },
      { title: 'Sports teams & tournaments', description: 'Single-vehicle travel for the whole squad — gear bags fit behind row four.' },
      { title: 'Weddings, tours & airport shuttles', description: 'Hourly pickups from Christchurch Airport, the CBD, or door-to-door across Canterbury.' },
    ],
    faqs: [
      {
        question: 'Can I drive a 12 seater van on a car licence?',
        answer:
          'Yes. Our 12-seat minibus is automatic and can be driven on a standard New Zealand Class 1 car licence, with no special endorsement required.',
      },
      {
        question: 'How much luggage fits in a 12-seater van?',
        answer:
          'There\'s genuine luggage space behind the back row — enough for the team\'s overnight bags or a set of ski/board bags. For larger loads we can add a luggage trailer.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'A 12 seater van keeps the group together and the cost per person down. Whether it\'s a Saturday-morning rugby trip out of Christchurch, a ski day at Mt Hutt or a wedding shuttle between the church and the reception, one minibus beats three cars on parking, on fuel and on the group photo.',
      'Our Christchurch 12-seat minibus is automatic, drives on a car licence and comes with air-con, USB charging and luggage space behind the rear row. Add a luggage trailer at checkout if you\'re heading away for more than a day.',
    ],
  },
  {
    slug: 'courier-van-hire-christchurch',
    path: '/courier-van-hire-christchurch',
    metaTitle: 'Courier Van Hire Christchurch — Weekly Rates for Owner Drivers',
    metaDescription:
      'Long-term courier van hire in Christchurch for NZ Post, Aramex and owner-driver contractors. Weekly rates, insurance included, signwriting-friendly.',
    eyebrow: 'Christchurch · Courier Van',
    h1: 'Courier Van Hire in Christchurch',
    intro:
      'Backing your contract, replacing a written-off van, or scaling up for the Christmas peak? Our Christchurch courier van rates are built for owner drivers and last-mile operators — weekly and monthly pricing, insurance included.',
    heroImage: vanInterior,
    heroAlt: 'Courier van interior for Christchurch owner drivers',
    fromPrice: '$89',
    recommendedVanSlug: '/fleet/vans/standard-van',
    recommendedVanName: 'Standard Cargo Van',
    locationName: 'Christchurch',
    breadcrumbLabel: 'Courier Van Hire Christchurch',
    useCases: [
      { title: 'NZ Post, Aramex, NZ Couriers contractors', description: 'Sliding side door, low load height and reliable autos — sized for parcel runs across greater Christchurch.' },
      { title: 'Owner-driver replacements', description: 'Short-term cover when your own van is in for service, repair or write-off.' },
      { title: 'Peak-season scaling', description: 'Extra vans for the Christmas, end-of-financial-year and back-to-school rush.' },
    ],
    faqs: [
      {
        question: 'Do you offer weekly courier rates?',
        answer:
          'Yes — see our Courier Operator Deals page for current weekly and 5+ day pricing in Christchurch. Discounts increase with longer rental terms.',
      },
      {
        question: 'Can I add my courier signwriting to the van?',
        answer:
          'Removable magnetic signage is fine. Permanent vinyl or paint changes need written approval — talk to the Christchurch branch before booking.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Couriers can\'t afford a day off the road. Our Christchurch courier van hire is built for that reality — modern automatic cargo vans, simple weekly rates, insurance included, and a Christchurch branch with same-day swap-overs when something goes wrong.',
      'Bring your contract, your run sheet and your magnetic signs — we\'ll have a courier-ready van waiting in Christchurch.',
    ],
  },
  {
    slug: 'van-hire-christchurch-airport',
    path: '/van-hire-christchurch-airport',
    metaTitle: 'Van Hire Christchurch Airport — Cargo & 12 Seat Vans on Arrival',
    metaDescription:
      'Van rental at Christchurch Airport for arriving travellers, families and trades. Cargo vans, jumbo vans and 12-seat minibuses, free shuttle pickup.',
    eyebrow: 'Christchurch Airport · Vans',
    h1: 'Van Hire at Christchurch Airport',
    intro:
      'Land at CHC and pick up a van the same hour. We run a free shuttle from Christchurch Airport (CHC) to our branch, with cargo vans, jumbo vans and 12-seat minibuses ready to drive away.',
    heroImage: vanHero,
    heroAlt: 'Van rental at Christchurch Airport',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/standard-van',
    recommendedVanName: 'Standard Cargo Van',
    locationName: 'Christchurch Airport',
    breadcrumbLabel: 'Van Hire Christchurch Airport',
    useCases: [
      { title: 'Arriving for a ski or tour trip', description: 'Pick up a 12-seat minibus or jumbo van and head straight to Methven, Tekapo or Akaroa.' },
      { title: 'Trades flying in for a project', description: 'Cargo van waiting on arrival — sized for tools, materials and a tight Christchurch parking spot.' },
      { title: 'One-way drop in another city', description: 'Drive south to Queenstown or north to Picton and drop the van at the next branch — one-way hire available on request.' },
    ],
    faqs: [
      {
        question: 'Is there a shuttle from Christchurch Airport to your branch?',
        answer:
          'Yes. We run a free shuttle from the Christchurch Airport (CHC) terminal to our nearby branch — call us once you\'ve collected your bags and we\'ll come and grab you.',
      },
      {
        question: 'Can I pick up a van after a late flight?',
        answer:
          'After-hours and late-flight pickups can be arranged in advance — give the Christchurch branch a call when you book.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Christchurch Airport is the front door to the South Island, and arriving travellers often need a van rather than a car — for ski gear, for trade tools, for a touring group, or for a one-way drive over to the West Coast. Our Christchurch van fleet sits minutes from the CHC terminal, with a free shuttle either way.',
      'Standard cargo vans, long-wheelbase jumbo vans and 12-seat minibuses are all available from the airport, all on a Class 1 car licence and all automatic.',
    ],
  },
  {
    slug: 'van-hire-rolleston',
    path: '/van-hire-rolleston',
    metaTitle: 'Van Hire Rolleston — Cargo & Moving Vans Delivered from Christchurch',
    metaDescription:
      'Van hire for Rolleston and the Selwyn district. Cargo vans, jumbo vans and 12-seat minibuses dispatched from our Christchurch branch — quick collection.',
    eyebrow: 'Selwyn · Rolleston',
    h1: 'Van Hire in Rolleston',
    intro:
      'Rolleston has grown into one of Canterbury\'s busiest commuter and trade hubs — and a lot of those jobs need a van. Pick up from our Christchurch branch (around 25 minutes up SH1) or talk to us about delivery into Rolleston.',
    heroImage: vanHero,
    heroAlt: 'Van hire for Rolleston customers',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/standard-van',
    recommendedVanName: 'Standard Cargo Van',
    locationName: 'Rolleston',
    breadcrumbLabel: 'Van Hire Rolleston',
    useCases: [
      { title: 'Rolleston tradies & sparkies', description: 'Daily and weekly cargo van hire for jobs across Selwyn, Lincoln and West Melton.' },
      { title: 'New-build moves', description: 'Jumbo van hire for the Faringdon, Branthwaite and Lincoln subdivision moves.' },
      { title: 'Selwyn sports clubs', description: '12-seat minibus for junior rugby, netball and football trips into Christchurch.' },
    ],
    faqs: [
      {
        question: 'Do you have a branch in Rolleston?',
        answer:
          'Our nearest branch is in Christchurch, around 25 minutes up SH1 from Rolleston. We service Rolleston, Lincoln, Prebbleton and the wider Selwyn district from there.',
      },
      {
        question: 'How long is the drive from Rolleston to your Christchurch branch?',
        answer:
          'Around 25 minutes via State Highway 1, traffic depending. Most customers find it a quick out-and-back morning collection.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Rolleston is the fastest-growing town in Canterbury, and the volume of trade work, new-build moves and weekend furniture runs around Faringdon, Branthwaite and Lincoln has gone up with it. Most of those jobs are van jobs — not truck jobs — and our Christchurch fleet is a quick SH1 drive away.',
      'Hire a cargo van, jumbo van or 12-seat minibus from our Christchurch branch and you\'ll be back in Rolleston inside an hour.',
    ],
  },
  {
    slug: 'van-hire-rangiora',
    path: '/van-hire-rangiora',
    metaTitle: 'Van Hire Rangiora — Cargo & Moving Vans from Christchurch',
    metaDescription:
      'Van hire serving Rangiora, Kaiapoi and the Waimakariri district. Cargo, jumbo and 12-seat vans available from our Christchurch branch.',
    eyebrow: 'Waimakariri · Rangiora',
    h1: 'Van Hire in Rangiora',
    intro:
      'Rangiora and the Waimakariri district sit a quick 30-minute drive north of Christchurch. Pick up a cargo van, jumbo van or 12-seat minibus from our Christchurch branch — easy access via the Northern Motorway.',
    heroImage: vanFleet,
    heroAlt: 'Van hire for Rangiora customers',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/standard-van',
    recommendedVanName: 'Standard Cargo Van',
    locationName: 'Rangiora',
    breadcrumbLabel: 'Van Hire Rangiora',
    useCases: [
      { title: 'Rangiora & Kaiapoi trades', description: 'Cargo vans for sparkies, plumbers, builders and couriers working across north Canterbury.' },
      { title: 'Lifestyle-block moves', description: 'Jumbo van plus hand trolley for moves between Rangiora, Oxford and West Eyreton.' },
      { title: 'Waimakariri sports & schools', description: '12-seat minibus for Saturday sport runs into Christchurch.' },
    ],
    faqs: [
      {
        question: 'Do you have a Rangiora branch?',
        answer:
          'Our nearest branch is in Christchurch, about 30 minutes south via the Northern Motorway. We regularly serve Rangiora, Kaiapoi, Woodend and the wider Waimakariri district from there.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Rangiora has become a hub for north-Canterbury trades, lifestyle blocks and families commuting into Christchurch — all jobs that often need a van for a day, a weekend or a working week. The Northern Motorway has turned what used to be a long drive into a comfortable 30-minute hop.',
      'Pick up your van from our Christchurch branch and head straight back up SH1 to Rangiora, Kaiapoi or Woodend.',
    ],
  },
  {
    slug: 'van-hire-ashburton',
    path: '/van-hire-ashburton',
    metaTitle: 'Van Hire Ashburton — Cargo & Moving Vans Serving Mid Canterbury',
    metaDescription:
      'Van hire for Ashburton and Mid Canterbury. Pick up cargo vans, jumbo vans or 12-seat minibuses from our Christchurch branch, around an hour up SH1.',
    eyebrow: 'Mid Canterbury · Ashburton',
    h1: 'Van Hire in Ashburton',
    intro:
      'Ashburton sits an hour south of Christchurch on State Highway 1. Our Christchurch van fleet covers Mid-Canterbury trades, moves and tourism runs — including one-way drops further south.',
    heroImage: vanInterior,
    heroAlt: 'Van hire for Ashburton customers',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/jumbo-van',
    recommendedVanName: 'Jumbo Van',
    locationName: 'Ashburton',
    breadcrumbLabel: 'Van Hire Ashburton',
    useCases: [
      { title: 'Mid-Canterbury trades', description: 'Cargo van hire for projects across Ashburton, Methven and Tinwald.' },
      { title: 'Methven ski trips', description: '12-seat minibus rentals for Mt Hutt weekends, picked up from Christchurch.' },
      { title: 'Farm & rural moves', description: 'Jumbo van for furniture, white-ware and equipment runs between Ashburton and Christchurch.' },
    ],
    faqs: [
      {
        question: 'Do you deliver vans to Ashburton?',
        answer:
          'Vans are typically collected from our Christchurch branch, around an hour north via SH1. Delivery into Ashburton may be possible for longer-term hires — call us to discuss.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Ashburton and Mid Canterbury keep a lot of farms, businesses and ski-trip planners busy, and a van is often the right tool for the job. Our Christchurch fleet is an easy hour\'s drive up State Highway 1, with cargo vans, jumbo vans and 12-seat minibuses available.',
      'For Methven and Mt Hutt ski weekends, the 12-seat minibus is the go — twelve seats, gear in the back, automatic transmission and a car licence drive.',
    ],
  },
  {
    slug: 'van-hire-timaru',
    path: '/van-hire-timaru',
    metaTitle: 'Van Hire Timaru — South Canterbury Van Rental from Christchurch',
    metaDescription:
      'Van hire for Timaru and South Canterbury. Cargo, jumbo and 12-seat minibuses from our Christchurch branch — one-way drops welcome.',
    eyebrow: 'South Canterbury · Timaru',
    h1: 'Van Hire in Timaru',
    intro:
      'Timaru sits around two hours south of Christchurch on SH1. Pick a van up from our Christchurch branch and drive south — or arrange a one-way drop on the way to Oamaru, Tekapo or Queenstown.',
    heroImage: vanFleet,
    heroAlt: 'Van hire for Timaru customers',
    fromPrice: '$69',
    recommendedVanSlug: '/fleet/vans/jumbo-van',
    recommendedVanName: 'Jumbo Van',
    locationName: 'Timaru',
    breadcrumbLabel: 'Van Hire Timaru',
    useCases: [
      { title: 'Moves north or south', description: 'Jumbo van for moves between Timaru, Christchurch, Oamaru and Dunedin.' },
      { title: 'South Canterbury tourism', description: '12-seat minibus for Tekapo, Mt Cook and Mackenzie country trips.' },
      { title: 'Trades & deliveries', description: 'Cargo van hire to back projects across Timaru, Geraldine and Temuka.' },
    ],
    faqs: [
      {
        question: 'Can I drop a van off in Timaru after picking it up in Christchurch?',
        answer:
          'One-way van hire from Christchurch into the lower South Island is available on request — please mention Timaru as the drop-off when booking and we\'ll confirm the one-way fee.',
      },
      ...baseFaqs,
    ],
    bodyParagraphs: [
      'Timaru and South Canterbury bring a steady mix of moving, trade and tourism work — and most of it can be done with a van rather than a truck. Our Christchurch fleet is two hours up SH1, with cargo vans, jumbo vans and 12-seat minibuses available.',
      'One-way drops into Timaru and further south can be arranged on request.',
    ],
  },
];

export const getChristchurchVanPageBySlug = (slug: string) =>
  christchurchVanPages.find((p) => p.slug === slug);