export default function BuyUsedVehicles() {
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

        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Formal Statement on NZTA Motor Vehicle Register Access
          </h2>
          
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              James Blond Rentals hereby notifies all registered motor vehicle owners that we access information from the 
              New Zealand Transport Agency (NZTA) Motor Vehicle Register under the authority of the relevant gazette notice 
              issued by the New Zealand Transport Agency.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Source of Information</h3>
              <p className="leading-relaxed">
                This statement serves as public notice that your name and address may be obtained from the NZTA Motor Vehicle 
                Register. We display this general statement on our website to advise all registered persons that the motor 
                vehicle register is the source of their personal information when we contact them regarding potential vehicle 
                purchases for our fleet.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Purpose and Use of Information</h3>
              <p className="leading-relaxed mb-3">
                The information obtained from the NZTA Motor Vehicle Register will be accessed when we are considering 
                purchasing your vehicle for our rental fleet. This information is used solely and exclusively for the 
                following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verifying vehicle ownership before making purchase offers</li>
                <li>Contacting registered owners about potential vehicle purchases</li>
                <li>Conducting due diligence on vehicles being considered for our rental fleet</li>
                <li>Ensuring compliance with legal requirements for vehicle transactions</li>
              </ul>
              <p className="leading-relaxed mt-3">
                We do not use this information for any other purpose, and we do not share it with third parties 
                except as required by law.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Right to Opt-Out</h3>
              <p className="leading-relaxed mb-3">
                We hereby advise all registered persons that any person can notify the NZTA Registrar that they do not 
                wish to have their name and address made available under an authorisation. Once you have notified the 
                Registrar of your opt-out preference, your information will no longer be made available to authorised 
                users of the register, including James Blond Rentals.
              </p>
              <p className="leading-relaxed mb-3">
                To exercise this right, you can contact the NZTA directly:
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-semibold mb-2">New Zealand Transport Agency</p>
                <p>Phone: 0800 108 809</p>
                <p>Email: info@nzta.govt.nz</p>
                <p>Website: <a href="https://www.nzta.govt.nz" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.nzta.govt.nz</a></p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="font-semibold text-foreground mb-3">
                Summary Notice to Registered Persons
              </p>
              <p className="leading-relaxed">
                In accordance with our authorisation to access the NZTA Motor Vehicle Register, James Blond Rentals 
                confirms that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
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
}
