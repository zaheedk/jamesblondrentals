
import React from "react";

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
        <strong>Wellington:</strong> Monday–Saturday: 8:00 am – 5:00 pm<br />
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
        Yes, we offer local delivery and collection for an additional fee. Please enquire when booking.
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
];

const FAQ = () => (
  <div className="container mx-auto px-4 py-16">
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
