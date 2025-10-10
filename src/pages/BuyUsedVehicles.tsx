import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BuyUsedVehicles = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          We Buy Used Vehicles for Our Fleet
        </h1>
        
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-muted-foreground text-lg mb-6">
            James Blond Rentals is always looking to purchase quality used vehicles to add to our rental fleet. 
            If you're looking to sell your vehicle, we'd love to hear from you.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            NZTA Motor Vehicle Register Information
          </h2>
          <p className="text-muted-foreground mb-4">
            To verify vehicle ownership and obtain accurate vehicle information, we access data from the 
            New Zealand Transport Agency (NZTA) Motor Vehicle Register under the appropriate gazette notice authorization.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="source">
            <AccordionTrigger className="text-xl font-semibold">
              How will you tell persons whose information has come from the register about the fact that the register was the source of the information?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4">
              <p>
                We display this general statement on our website to advise registered persons that their 
                name and address may be obtained from the NZTA Motor Vehicle Register when we are assessing 
                vehicles for potential purchase for our fleet.
              </p>
              <p>
                This notice is publicly available on this page to ensure transparency about our use of the register.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="usage">
            <AccordionTrigger className="text-xl font-semibold">
              How will you tell persons whose information has come from the register about what you use the information for?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4">
              <p>
                The information obtained from the NZTA Motor Vehicle Register is used solely for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verifying vehicle ownership before making purchase offers</li>
                <li>Contacting registered owners about potential vehicle purchases</li>
                <li>Conducting due diligence on vehicles being considered for our rental fleet</li>
                <li>Ensuring compliance with legal requirements for vehicle transactions</li>
              </ul>
              <p>
                We do not use this information for any other purpose, and we do not share it with third parties 
                except as required by law.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="opt-out">
            <AccordionTrigger className="text-xl font-semibold">
              How will you tell persons whose information has come from the register about the fact that they can notify the Registrar that they do not wish to have their names and addresses made available under an authorisation?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4">
              <p>
                Any person can notify the NZTA Registrar that they do not wish to have their name and address 
                made available under an authorisation.
              </p>
              <p>
                To exercise this right, you can contact the NZTA directly:
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-semibold mb-2">New Zealand Transport Agency</p>
                <p>Phone: 0800 108 809</p>
                <p>Email: info@nzta.govt.nz</p>
                <p>Website: <a href="https://www.nzta.govt.nz" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.nzta.govt.nz</a></p>
              </div>
              <p>
                Once you have notified the Registrar of your opt-out preference, your information will no longer 
                be made available to authorised users of the register, including James Blond Rentals.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-card border border-border rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Official Notice
          </h2>
          <div className="text-muted-foreground space-y-4">
            <p className="font-semibold">
              Notice to Registered Persons - Motor Vehicle Register Access
            </p>
            <p>
              James Blond Rentals advises that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your name and address may be obtained from the NZTA Motor Vehicle Register
              </li>
              <li>
                This access is authorised under the relevant gazette notice issued by the New Zealand Transport Agency
              </li>
              <li>
                This information will be accessed when we are considering purchasing your vehicle for our rental fleet, 
                and will be used to verify ownership and contact you regarding potential purchase opportunities
              </li>
              <li>
                You can notify the NZTA Registrar (contact details provided above) that you do not wish to have 
                your name and address made available under an authorisation
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Interested in selling your vehicle to us?
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default BuyUsedVehicles;
