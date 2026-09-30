import { Link } from 'react-router-dom';
import { Zap, FileCheck, IdCard, Users, CreditCard, Clock, KeyRound, Building2, Phone } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import PageHero from '@/components/PageHero';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is online check-in?',
    a: 'Online check-in means you complete your rental paperwork before you arrive. You upload photos of your driver licence, confirm your contact and licence details, add any additional drivers and save your payment card — all from your customer portal. When you get to our yard, there is no form-filling: we verify your licence, hand over the keys and you are on your way.',
  },
  {
    q: 'How much time does pre-check-in save?',
    a: 'A standard rental counter process — photocopying your licence, writing down your details, adding extra drivers and taking payment information — typically takes 15–20 minutes at pick-up. With online check-in, that work is done in advance, so pick-up usually takes only a few minutes. At busy times like weekends and school holidays, the difference is even bigger because there is no queue.',
  },
  {
    q: 'When should I complete my online check-in?',
    a: 'As soon as you have booked, or at least a few hours before pick-up. Your booking confirmation email includes a link to set up your customer portal account. Completing it the evening before an early pick-up is a popular option.',
  },
  {
    q: 'Do I still need to bring my physical licence?',
    a: 'Yes. The uploaded photos let us verify everything in advance, but the driver must present the original physical licence at pick-up — that is a legal requirement. Bring the licence for every driver listed on the booking.',
  },
  {
    q: 'Can I save my payment card before pick-up?',
    a: 'Yes. You can save your card securely through the portal before you arrive. It is held with our payment provider, never seen or stored by our staff, and can be used for the rental payment and security bond at pick-up. You still need the physical card with you at the counter for the bond authorisation.',
  },
  {
    q: 'Can I add additional drivers during online check-in?',
    a: 'Yes. Add each additional driver in the portal with their details and licence photos. We verify them in advance too, so neither of you needs to fill in forms at the counter. Additional drivers must meet the same licence requirements as the main driver.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Your licence photos and details are stored securely and used only to prepare your rental agreement. Card details are tokenised by our payment provider — we never see or store your card number. See our Privacy Policy for the full picture.',
  },
  {
    q: 'What if I do not complete online check-in before arriving?',
    a: 'No problem — you can still check in at the counter as usual, and you can use your phone to complete the portal steps on the spot. It just takes longer than arriving pre-checked-in.',
  },
];

const steps = [
  {
    icon: FileCheck,
    title: 'Book as usual',
    description: 'Choose your vehicle, dates and extras online. Your confirmation email includes a link to your customer portal.',
  },
  {
    icon: IdCard,
    title: 'Upload your licence',
    description: 'Snap the front and back of your driver licence with your phone — no scanning or printing needed.',
  },
  {
    icon: Users,
    title: 'Confirm everyone’s details',
    description: 'Your name, address and licence details are pre-filled from the booking. Add additional drivers the same way.',
  },
  {
    icon: CreditCard,
    title: 'Save your card',
    description: 'Save your payment card securely so payment and the bond are settled in seconds at pick-up.',
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Minutes, not quarters of an hour',
    description: 'The paperwork is done before you arrive, so pick-up is a licence check and a key handover.',
  },
  {
    icon: Zap,
    title: 'No queue at busy times',
    description: 'Pre-checked-in customers go straight to the front — weekends, school holidays and Friday afternoons included.',
  },
  {
    icon: KeyRound,
    title: 'Get on the road sooner',
    description: 'More holiday, more moving day, more work day. Your vehicle is ready and waiting.',
  },
  {
    icon: Building2,
    title: 'Available at every branch',
    description: 'Works the same at West Auckland and all our locations, for cars, vans, utes, trucks and minibuses.',
  },
];

const OnlineCheckIn = () => (
  <div>
    <PageSEO
      title="Online Check-In & Express Pick-Up – Skip the Counter | James Blond Rentals"
      description="Complete your rental paperwork before you arrive: upload your licence, add drivers and save your card online, then collect your keys in minutes. Express pick-up in Auckland, Christchurch, Wellington and Hamilton."
      canonical="/online-check-in"
    />
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }}
    />

    <PageHero
      eyebrow="Faster pick-ups · Online check-in"
      EyebrowIcon={Zap}
      heading="Skip the counter — check in before you arrive"
      intro="Do your rental paperwork from your phone before pick-up day: licence verified, details confirmed, card saved. When you arrive, we check your licence and hand over the keys — no forms, no queue."
      primaryTo="/vehicles"
      primaryLabel="Book a vehicle"
      features={[
        { Icon: IdCard, title: 'Licence pre-verified', description: 'Upload it once, from your phone.' },
        { Icon: Users, title: 'Extra drivers added early', description: 'Everyone checked in before pick-up.' },
        { Icon: CreditCard, title: 'Card saved securely', description: 'Payment and bond ready to go.' },
        { Icon: Clock, title: 'Pick-up in minutes', description: 'No paperwork, no waiting your turn.' },
      ]}
    />

    <section className="container mx-auto px-6 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">How online check-in works</h2>
      <ol className="grid gap-4 md:grid-cols-4">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <li key={title} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-primary">Step {i + 1}</span>
            </div>
            <p className="mt-3 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">
        Signed in already? Head to your{' '}
        <Link to="/member-dashboard" className="text-primary underline">customer portal</Link> and finish check-in for
        your next booking. Not set up yet? Your booking confirmation email has your invite link, or{' '}
        <Link to="/register" className="text-primary underline">create your account</Link>.
      </p>
    </section>

    <section className="container mx-auto px-6 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Why pick-up with us is faster</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border bg-card p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-3 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container mx-auto px-6 pb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">The typical counter vs pre-checked-in</h2>
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-4 font-semibold">At pick-up</th>
              <th className="p-4 font-semibold">Typical rental counter</th>
              <th className="p-4 font-semibold">James Blond with online check-in</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-4">Driver licence</td>
              <td className="p-4 text-muted-foreground">Photocopied and details written down at the desk</td>
              <td className="p-4">Already verified from your uploaded photos — just show the original</td>
            </tr>
            <tr>
              <td className="p-4">Your details</td>
              <td className="p-4 text-muted-foreground">Address and contact details filled in on paper</td>
              <td className="p-4">Pre-filled from your booking and confirmed online</td>
            </tr>
            <tr>
              <td className="p-4">Additional drivers</td>
              <td className="p-4 text-muted-foreground">Everyone waits to be signed on at the counter</td>
              <td className="p-4">Added and verified in advance in your portal</td>
            </tr>
            <tr>
              <td className="p-4">Payment & bond</td>
              <td className="p-4 text-muted-foreground">Card details taken while you stand at the desk</td>
              <td className="p-4">Card already saved — bond authorised in seconds</td>
            </tr>
            <tr>
              <td className="p-4">Time at the counter</td>
              <td className="p-4 text-muted-foreground">Typically 15–20 minutes, longer when there is a queue</td>
              <td className="p-4">A few minutes — licence check and keys</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="container mx-auto px-6 pb-16">
      <div className="rounded-xl border bg-card p-6 space-y-3 text-sm text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground">Good to know</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The driver must present the original physical licence at pick-up — photos uploaded online speed up verification but do not replace it.</li>
          <li>The security bond is authorised on a physical credit or debit card at the counter, so bring the card you saved.</li>
          <li>Overseas licence holders are welcome to use online check-in; bring your physical licence and any required translation or international permit.</li>
          <li>Your details stay editable — change anything in the portal and it updates on your upcoming bookings.</li>
        </ul>
      </div>
    </section>

    <section className="container mx-auto px-6 pb-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Online check-in FAQs</h2>
      <Accordion type="single" collapsible>
        {faqs.map(({ q, a }) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-8 text-sm text-muted-foreground">
        Questions before you book? Call{' '}
        <a href="tel:0800525663" className="inline-flex items-center gap-1 text-primary underline">
          <Phone className="h-3 w-3" />0800 525 663
        </a>{' '}
        or <Link to="/contact" className="text-primary underline">contact our team</Link>.
      </p>
    </section>
  </div>
);

export default OnlineCheckIn;
