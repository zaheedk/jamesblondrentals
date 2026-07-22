
import React from "react";
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';

const faqData = [
  {
    question: "What do I need to hire a vehicle?",
    answer: (
      <>
        You need a full driver's licence (overseas and international licences accepted if in English, or with an approved translation) and a valid credit or debit card. The minimum age to hire is 21 for most vehicles, 25 for larger vehicles.
      </>
    ),
  },
  {
    question: "What are your hours?",
    answer: (
      <>
        <strong>Auckland:</strong> Monday–Sunday: 8:00 am – 5:00 pm<br />
        <strong>Wellington:</strong> Monday–Sunday: 8:00 am – 5:00 pm<br />
        <span className="text-xs block mt-1">(Last return is 15 minutes before closing.)</span>
      </>
    ),
  },
  {
    question: "Can I use my overseas licence?",
    answer: (
      <>
        Yes, provided the licence is in English or accompanied by an acceptable translation / IDP. <br />
        All drivers must comply with NZTA requirements.
      </>
    ),
  },
  {
    question: "Is there a security bond/deposit?",
    answer: (
      <>
        Yes, a bond is required. The amount varies by vehicle and insurance option. It can be held on a credit card or paid by debit card.
      </>
    ),
  },
  {
    question: "Is there a mileage (kilometre) limit?",
    answer: (
      <>
        Cars and standard vans come with unlimited mileage. <br />
        Commercial vehicles (trucks, trailers, etc.) have a mileage charge per kilometre.
      </>
    ),
  },
  {
    question: "Can I return after hours?",
    answer: (
      <>
        No, we do not offer after hours pickup and drop-off. All vehicles must be collected and returned during our business hours.
      </>
    ),
  },
  {
    question: "Do I need to refuel before returning?",
    answer: (
      <>
        Yes, vehicles must be refuelled to the same level as supplied, or refuelling charges may apply.
      </>
    ),
  },
  {
    question: "Can I add extra drivers?",
    answer: (
      <>
        Yes, at no extra cost. They must meet our age and licensing conditions and must be registered at pick-up.
      </>
    ),
  },
  {
    question: "What is your cancellation policy?",
    answer: (
      <>
        We recommend contacting us as soon as possible to cancel or change a booking. <br />
        Cancellations less than 24 hours in advance may incur charges.
      </>
    ),
  },
  {
    question: "Are pets allowed?",
    answer: (
      <>
        No, pets are not permitted in any vehicle unless authorised in advance. Cleaning charges may apply.
      </>
    ),
  },
  {
    question: "How do I pay for road tolls?",
    answer: (
      <>
        We charge tolls to the card on file plus a small administration fee. You can also pay tolls directly via the <a className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" href="https://tollspayment.nzta.govt.nz/">NZTA website</a>.
      </>
    ),
  },
  {
    question: "What about insurance?",
    answer: (
      <>
        All hires include standard insurance with an excess. Extra cover is available for peace of mind. See our website for full details and options.
      </>
    ),
  },
  {
    question: "Do you deliver or collect vehicles?",
    answer: (
      <>
        Yes, we offer local delivery and collection of passenger vehicles for an additional fee, subject to availability. We cannot guarantee the availability of this service. Please enquire when booking.
      </>
    ),
  },
  {
    question: "Do your vehicles have tow bars?",
    answer: (
      <>
        Some vehicles are fitted with tow bars. Please request this at the time of booking if needed.
      </>
    ),
  },
  {
    question: "Do you provide one way hires?",
    answer: (
      <>
        Yes, we do provide one way hires. Please select pickup and drop-off location on the booking page to see applicable one way fees.
      </>
    ),
  },
  {
    question: "Can I take the vehicle on a ferry?",
    answer: (
      <>
        Taking vehicles on ferry requires prior approval. Only approved vehicles will be allowed on ferries. The vehicle must be returned to Auckland. Hirer is responsible for all ferry costs and for returning on time.
      </>
    ),
  },
  {
    question: "What if I have an accident or breakdown?",
    answer: (
      <>
        Contact us as soon as possible. Our vehicles are covered by roadside assistance nationwide during your hire.
      </>
    ),
  },
  {
    question: "How do I book a vehicle?",
    answer: (
      <>
        Book online via our website or call our team at&nbsp;
        <a className="text-blue-500 underline" href="tel:0800525663">0800 525 663</a>.
      </>
    ),
  },
  {
    question: "Who can I contact for more help?",
    answer: (
      <>
        Phone: <a className="text-blue-500 underline" href="tel:0800525663">0800 525 663</a><br />
        Email: <a className="text-blue-500 underline" href="mailto:info@jamesblond.co.nz">info@jamesblond.co.nz</a>
      </>
    ),
  },
  {
    question: "How do I pay, and is there a bond?",
    answer: (
      <>
        We accept debit and credit cards. A bond may apply depending on your licence type and payment method, refundable on vehicle return.
      </>
    ),
  },
  {
    question: "Do your rental prices include GST and insurance?",
    answer: (
      <>
        Yes, all prices include GST and standard insurance. Optional extras like child seats, GPS, or excess reduction are available.
      </>
    ),
  },
  {
    question: "Is fuel included in the rental rate?",
    answer: (
      <>
        Vehicles are supplied with a full tank and must be returned full. Refuelling charges apply if not returned at the same level.
      </>
    ),
  },
  {
    question: "Can I hire accessories like trolleys or moving blankets?",
    answer: (
      <>
        Yes, we offer a range of hire accessories, including moving trolleys, blankets, and tie-downs. Add them during booking or pickup.
      </>
    ),
  },
  {
    question: "How are toll roads handled in New Zealand?",
    answer: (
      <>
        We offer a toll pass option covering up to 10 toll road trips for a one-time fee. Avoid direct NZTA toll payments during rental.
      </>
    ),
  },
  {
    question: "What happens if I receive a ticket or toll charge?",
    answer: (
      <>
        Infringements are forwarded to us, and transferred into your name. A small admin fee may apply.
      </>
    ),
  },
  {
    question: "What kind of safety checks are done on your vehicles?",
    answer: (
      <>
        All our vehicles undergo regular servicing, tyre and fluid checks, and safety inspections to meet NZTA standards before every hire.
      </>
    ),
  },
  {
    question: "What is the standard insurance excess?",
    answer: (
      <>
        Our standard excess starts at $2,000. You can reduce this with an optional excess reduction plan during booking.
      </>
    ),
  },
  {
    question: "Do you offer long-term vehicle rentals?",
    answer: (
      <>
        Yes, we offer competitive long-term rental rates for cars, vans, and utes. Contact us to get a custom quote.
      </>
    ),
  },
  {
    question: "Do you offer long-term rentals or monthly hire rates?",
    answer: (
      <>
        Yes! We offer special long-term and monthly hire deals for businesses, tradies, or anyone needing extended use. Contact us for a custom quote.
      </>
    ),
  },
  {
    question: "Can I rent a car without a credit card?",
    answer: (
      <>
        Yes, we accept debit cards, but a refundable bond applies. Speak with our team to confirm details based on your rental.
      </>
    ),
  },
  {
    question: "Do you offer insurance to cover damage to or loss of the vehicle?",
    answer: (
      <>
        Yes. This insurance is included in the cost of the hire. Vehicles are covered by full comprehensive insurance with an excess payable. This excess may be reduced with an additional payment. The only things we do not cover are overhead damage, refueling with the wrong fuel and immersion in water. The full cost of repair applies for these three things.
      </>
    ),
  },
  {
    question: "Do I need a special driver's licence to rent a truck or van?",
    answer: (
      <>
        No, you don't need a special licence. A full NZ or overseas driver's licence is all you need to hire and drive our trucks and vans.
      </>
    ),
  },
  {
    question: "Is there anything special I need to know before driving a truck?",
    answer: (
      <>
        While no special licence is needed, trucks are larger and higher than cars. Always watch your overhead clearance, take wider turns, and allow more braking distance.
      </>
    ),
  },
  {
    question: "Are automatic vehicles available for rent?",
    answer: (
      <>
        Yes! Most of our cars, vans, and many trucks come with automatic transmission. You can filter by transmission when browsing our fleet online.
      </>
    ),
  },
  {
    question: "What if I need to change my booking dates?",
    answer: (
      <>
        We're flexible — if your plans change, give us as much notice as possible. We'll do our best to accommodate new dates based on availability.
      </>
    ),
  },
  {
    question: "Does your insurance cover personal belongings?",
    answer: (
      <>
        No, our rental insurance only covers the vehicle. We recommend securing personal travel insurance for your own items during hire.
      </>
    ),
  },
  {
    question: "Do you sell packaging supplies like boxes or tape?",
    answer: (
      <>
        We don't currently sell packaging materials, but we do offer moving trucks, blankets, and tie-downs to make your move easier.
      </>
    ),
  },
  {
    question: "I'm moving house — what size truck should I hire?",
    answer: (
      <>
        We offer a range of moving trucks from 10m³ to 20m³. Need help? Call us and our team can recommend the best size for your move.
      </>
    ),
  },
  {
    question: "Can I request a tarp or cover for messy loads?",
    answer: (
      <>
        Yes! If you're transporting rubbish, soil, or other loose loads, let us know — we can supply covers or tarps with your rental truck.
      </>
    ),
  },
  {
    question: "Do you provide WINZ or MSD vehicle quotes?",
    answer: (
      <>
        Yes, we're happy to provide official quotes for Work and Income New Zealand. Just call or email us your request and requirements.
      </>
    ),
  },
  {
    question: "Can I take the rental truck on the inter-island ferry?",
    answer: (
      <>
        Yes, most of our vehicles are ferry-approved and can travel between the North and South Islands. Check with us if you're booking a large truck.
      </>
    ),
  },
  {
    question: "What are the dimensions of your trucks and vans?",
    answer: (
      <>
        Each vehicle's dimensions and load capacity are listed on our website under the fleet pages. Still unsure? Our team can help.
      </>
    ),
  },
  {
    question: "Do your trucks have tail lifts?",
    answer: (
      <>
        Yes! Many of our box body trucks come with a hydraulic tail lift for easy loading. You'll see it noted in the vehicle specs online.
      </>
    ),
  },
  {
    question: "Are Road User Charges (RUCs) included in the price?",
    answer: (
      <>
        Yes, all RUCs are included in our pricing — no hidden charges. The price you see is the price you pay.
      </>
    ),
  },
  {
    question: "How far can I travel on a full tank?",
    answer: (
      <>
        Fuel range varies by vehicle and load. Our diesel trucks can typically travel between 400–600 km on a full tank.
      </>
    ),
  },
  {
    question: "Is it cheaper to rent a truck than hire movers?",
    answer: (
      <>
        Yes, self-hiring a truck is often far more affordable. You get full control over your schedule, and we provide the right vehicle for the job.
      </>
    ),
  },
  {
    question: "Do you offer special rates for business customers?",
    answer: (
      <>
        Yes! We work with tradespeople, contractors, and businesses of all sizes. Ask us about custom rates or repeat hire discounts.
      </>
    ),
  },
  {
    question: "Can I lease or rent long-term?",
    answer: (
      <>
        Absolutely. We offer weekly and monthly hire plans for cars, vans, utes, and trucks. Perfect for long-term projects or seasonal needs.
      </>
    ),
  },
];

const FAQ = () => (
  <div className="container mx-auto px-4 py-16">
    <PageSEO title="Frequently Asked Questions – James Blond Rentals NZ" description="Find answers to common questions about hiring vehicles from James Blond Rentals including age requirements, licence needs, insurance and pickup procedures." canonical="/faq" />
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { q: "What do I need to hire a vehicle?", a: "A full driver's licence (overseas and international licences accepted if in English, or with an approved translation) and a valid credit or debit card. Minimum age is 21 for most vehicles, 25 for larger vehicles." },
          { q: "What are your hours?", a: "Auckland and Wellington branches are open Monday to Sunday, 8:00 am to 5:00 pm. Last return is 15 minutes before closing." },
          { q: "Can I use my overseas licence?", a: "Yes, provided the licence is in English or accompanied by an acceptable translation or IDP. All drivers must comply with NZTA requirements." },
          { q: "Is there a security bond or deposit?", a: "Yes, a bond is required. The amount varies by vehicle and insurance option and can be held on a credit card or paid by debit card." },
          { q: "Is there a mileage limit?", a: "Cars and standard vans come with unlimited mileage. Commercial vehicles such as trucks and trailers have a per-kilometre mileage charge." },
          { q: "Can I return after hours?", a: "No, after-hours pickup and drop-off are not offered. All vehicles must be collected and returned during business hours." },
          { q: "Do I need to refuel before returning?", a: "Yes, vehicles must be refuelled to the same level as supplied or refuelling charges may apply." },
          { q: "Can I add extra drivers?", a: "Yes, at no extra cost. Additional drivers must meet age and licensing conditions and be registered at pick-up." },
          { q: "What is your cancellation policy?", a: "Contact us as soon as possible to cancel or change a booking. Cancellations less than 24 hours in advance may incur charges." },
          { q: "What about insurance?", a: "All hires include standard insurance with an excess starting at $2,000. Optional excess reduction is available during booking." },
          { q: "Do you provide one-way hires?", a: "Yes. Select pickup and drop-off locations on the booking page to see applicable one-way fees." },
          { q: "Do I need a special licence to rent a truck or van?", a: "No, a full NZ or overseas driver's licence is all you need to hire and drive our trucks and vans." },
          { q: "Are Road User Charges (RUCs) included?", a: "Yes, all RUCs are included in pricing — the price you see is the price you pay." },
          { q: "How do I book a vehicle?", a: "Book online via jamesblond.co.nz or call 0800 525 663." },
        ].map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
    <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
    <div className="divide-y divide-gray-200 max-w-2xl mx-auto">
      {faqData.map((faq, idx) => (
        <div key={idx} className="py-6">
          <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
          <div className="text-gray-700 leading-relaxed">{faq.answer}</div>
        </div>
      ))}
    </div>
  </div>
);

export default FAQ;
