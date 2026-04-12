
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageSEO from '@/components/PageSEO';


const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageSEO title="Privacy Policy – James Blond Rentals NZ" description="Read our privacy policy to understand how James Blond Rentals collects, uses and protects your personal information." canonical="/privacy" />
      <h1 className="text-3xl font-bold mb-6">Security & Privacy Policy</h1>
      
      <div className="space-y-6">
        <section className="prose max-w-none">
          <p className="text-gray-600">
            This Application collects some Personal Data from its Users.
          </p>
        </section>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="personal-data">
            <AccordionTrigger>Personal Data Collection</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analytics: Google Analytics, Analytics collected directly, Facebook Ads conversion tracking (Facebook pixel) and Google Ads conversion tracking</li>
                <li>Mailing List or Newsletter: country, email address, first name, last name, phone number</li>
                <li>Content commenting via Facebook Comments</li>
                <li>Interaction with external social networks and platforms</li>
                <li>Remarketing and behavioural targeting</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="credit-card">
            <AccordionTrigger>Credit Card Policy</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">
                To protect your personal information, we take reasonable precautions and follow industry best practices to ensure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Information is transmitted using Transport Layer Security technology (TLS)</li>
                <li>All data is encrypted and stored using industry standard AES encryption</li>
                <li>Systems are fully compliant with PCI-DSS requirements</li>
                <li>Currently accepts VISA and MasterCard</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refunds">
            <AccordionTrigger>Refunds</AccordionTrigger>
            <AccordionContent>
              <p>
                When a good or service is purchased using a payment card and a refund is necessary, the refund must be credited back to the account that was originally charged. Refunds in excess of the original sale amount or cash refunds are prohibited.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger>Security Measures</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to cardholder data is restricted to those with a business "need to know"</li>
                <li>Cardholder data shall not be stored on servers or local drives unless encrypted</li>
                <li>Paper media containing cardholder data shall not be stored unless approved</li>
                <li>Email transmission of credit card information is prohibited</li>
                <li>All media containing payment card data is retained for maximum six months</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wireless">
            <AccordionTrigger>Wireless Technology</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">
                James Blond Rentals discourages the use of wireless technology to process or transmit cardholder data. Requests will be reviewed on a case by case basis.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Storage of cardholder data on local drives or external media is prohibited</li>
                <li>Cut-and-paste and print functions during remote access are prohibited</li>
                <li>Modem activation for vendors only when no alternative is available</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="training">
            <AccordionTrigger>Training</AccordionTrigger>
            <AccordionContent>
              <p>
                Employees with access to cardholder data must complete security awareness training upon hire and annually thereafter. They must acknowledge receipt of training and agree to comply with security requirements.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contact">
            <AccordionTrigger>Contact Information</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p><strong>Owner and Data Controller</strong></p>
                <p>James Blond Rentals</p>
                <p>4004 Great North Road</p>
                <p>Kelston 0602, Auckland</p>
                <p>Email: info@jamesblond.co.nz</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Privacy;
