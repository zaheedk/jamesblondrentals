import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageSEO from '@/components/PageSEO';


const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <PageSEO title="Terms & Conditions – James Blond Rentals NZ" description="Read the full terms and conditions for hiring vehicles from James Blond Rentals including liability, insurance, fuel policy and damage procedures." canonical="/terms" />
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-8 text-gray-700">
        Subject to the terms & conditions contained on the front and reverse hereof of which the hirer(s) acknowledges that they are aware, 
        the hirer agrees to rent the above vehicle and elects to pay all amounts payable under this agreement. By signing this contract, 
        you hereby agree to these terms and authorise Kanthawala Ltd charging your credit card for the rental, the bond and any additional costs incurred.
      </p>

      <Accordion type="single" collapsible>
        <AccordionItem value="accidents">
          <AccordionTrigger>1. Accidents</AccordionTrigger>
          <AccordionContent>
            Any accident must be reported within twenty four (24) hours and must be accompanied by a police report. 
            Should the hirer(s) fail to comply with any conditions of this contract, all losses and damages suffered 
            by the owner arising out of such failure shall be borne by and paid for by the hirer(s).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="traffic">
          <AccordionTrigger>2. Traffic Infringements</AccordionTrigger>
          <AccordionContent>
            The Hirer(s) accept responsibility for all traffic violations infringements, including parking, speeding 
            and lane violations and impound fees incurred during the rental. A $35 administration fee will apply for 
            any fines received.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="responsibility">
          <AccordionTrigger>3. Hirer(s) Responsibility</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining water and oil levels is the hirer(s) responsibility. Any approved cost incurred will be 
                  reimbursed upon production of a receipt. Should any malfunction of the vehicle occur, any warning 
                  light or any sign of overheating, you must stop the vehicle immediately and contact Kanthawala Ltd or 
                  you will be held liable and loss of bond may occur.</li>
              <li>Vehicles are provided in a clean and tidy manner and should be returned in a similar state otherwise 
                  a cleaning fee will apply.</li>
              <li>We have a zero tolerance NON SMOKING policy. Please don't smoke in the vehicle. A $200 fine/cleaning 
                  fee will be enforced.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns">
          <AccordionTrigger>4. Late Returns</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>$20 per hour up to 4 hours, after that full day charge. $200 non-compliance fee if you do not notify 
                  us and take prior approval for late return.</li>
              <li>We only accept pickups and returns at our Kelston and Wellington CBD Branch during our opening hours 
                  (8:00am-5:00pm) 7-days.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="drivers">
          <AccordionTrigger>5. Persons Who May Drive Vehicle</AccordionTrigger>
          <AccordionContent>
            Only persons added to the rental agreement are permitted to drive the vehicle. $200 non-compliance fee if 
            a driver not on agreement drives the vehicle.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payments">
          <AccordionTrigger>6. Payments By Hirer</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Deposit Required:</strong> A non-refundable deposit of $50 is required for all bookings.</li>
              <li>The hirer shall pay to the owner as payment for the hire of the vehicle, accessories, insurance upgrade 
                  options, and any extra charges incurred for the period of hire the sum as specified in this agreement.</li>
              <li>In addition the hirer shall pay to the owner on termination of the hiring a distance charge at the rate 
                  referred to in this agreement. The total distance that the hirer may run the vehicle during the period 
                  of hire shall not exceed the number of kilometres specified in this agreement.</li>
              <li>The hirer shall also pay for fuel (but not oil) used in the vehicle during the period of hire.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="insurance">
          <AccordionTrigger>7. Insurance</AccordionTrigger>
          <AccordionContent>
            The hirer shall ensure that all reasonable care is taken in handling & parking the vehicle, & that it 
            is left securely locked when not in use.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="indemnity">
          <AccordionTrigger>8. Indemnity</AccordionTrigger>
          <AccordionContent>
            <p>Subject to the exclusions set out below, the hirer and any driver authorised to drive the vehicle is:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>fully indemnified in respect of any liability he/she might have to the owner in respect of loss or 
                  of damage to the vehicle and any consequential loss of revenue or other expenses of the owner 
                  including towing and salvage costs associated with the recovery of the vehicle & its accessories 
                  and spare parts.</li>
              <li>indemnified to the extent of $NZ250,000 in respect of any liability he/she might have for damage 
                  to any property (including injury to any animal) belonging to any other person and arising out of 
                  the use of the vehicle.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exclusions">
          <AccordionTrigger>9. Exclusions</AccordionTrigger>
          <AccordionContent>
            <p>The indemnities referred to above shall not apply where the damage, injury or loss arises when:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>The driver of the vehicle is under the influence of alcohol, or any drug which affects his/her ability 
                  to drive the vehicle;</li>
              <li>The vehicle is in an unsafe or un-roadworthy condition that arose during the course of the hire and 
                  that caused or contributed to the damage or loss, and the hirer or the driver was aware or ought to 
                  have been aware of the unsafe or un-roadworthy condition of the vehicle;</li>
              <li>The vehicle is operated in any race, speed test, rally or contest;</li>
              <li>Any damage caused to the vehicle above the height of the windscreen or third party damage to property 
                  caused by the vehicle above this height is excluded from our cover and will be the responsibility of 
                  the hirer;</li>
              <li>The vehicle is driven by any person who at the time when he/she drives the vehicle is disqualified 
                  from holding or has never held a driver's license appropriate for that vehicle;</li>
              <li>The vehicle is damaged due to driver abuse or negligence;</li>
              <li>The vehicle is operated on any restricted roads;</li>
              <li>The vehicle is operated outside the term of hire or any agreed extension of that term.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="owner-obligations">
          <AccordionTrigger>10. Owner's Obligations</AccordionTrigger>
          <AccordionContent>
            The owner shall supply the vehicle in a safe & roadworthy condition & shall be responsible for all 
            ordinary costs of running the vehicle during the term of the hire except to the extent that by the 
            terms of this agreement those costs are payable by the hirer.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="repairs">
          <AccordionTrigger>11-14. Mechanical Repairs & Maintenance</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>The hirer must report any damage or repairs needed within 24 hours.</li>
              <li>No repairs should be undertaken without owner's authority except in emergencies.</li>
              <li>No interference with vehicle systems is allowed except in emergencies.</li>
              <li>Punctures, Tyre Damage, Glass, Lenses & headlight damage are at the hirer's expense unless covered 
                  by insurance upgrade.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vehicle-use">
          <AccordionTrigger>15. Use of the Vehicle</AccordionTrigger>
          <AccordionContent>
            <p>The hirer shall not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Use the vehicle for hire or reward without owner's knowledge</li>
              <li>Sublet or hire the vehicle to others</li>
              <li>Operate the vehicle under influence of alcohol or drugs</li>
              <li>Use in races or contests</li>
              <li>Tow without authorization</li>
              <li>Breach any traffic laws</li>
              <li>Exceed passenger or weight limits</li>
              <li>Allow unlicensed drivers to operate the vehicle</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vehicle-return">
          <AccordionTrigger>16. Return of the Vehicle</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>The vehicle must be returned at the agreed time and location.</li>
              <li>Overdue vehicles without contact may be reported as stolen, with all recovery costs passed to the hirer.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="termination">
          <AccordionTrigger>17. Immediate Return of Vehicle</AccordionTrigger>
          <AccordionContent>
            The owner shall have the right to terminate the hiring and take immediate possession of the vehicle if 
            the hirer fails to comply with any terms or if the vehicle is damaged.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cancellation">
          <AccordionTrigger>18. Cancellation Fees</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>The $50 deposit required for all bookings is non-refundable.</li>
              <li>A cancellation fee of 1 days hireage applies if cancelled 24-72 hours before pickup.</li>
              <li>For cancellations within 24 hours or no-shows, the fee is $150 or 50% of the total rental, whichever is greater.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="repairs-remediation">
          <AccordionTrigger>19. Damage Repairs/Remediation</AccordionTrigger>
          <AccordionContent>
            The owner will arrange for any repairs at his discretion with a repair agent/provider of his choosing.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="midweek-discount">
          <AccordionTrigger>20. Midweek 25% Discount</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>The 25% Midweek Discount applies <strong>only to bookings made online</strong> through our website.</li>
              <li>Bookings made over the phone or in store <strong>do not qualify</strong> for the midweek discount.</li>
              <li>The discount applies to eligible vehicle categories for Monday–Thursday rentals within the same week.</li>
              <li>This offer cannot be combined with other promotional codes or discounts unless otherwise stated.</li>
              <li>Kanthawala Ltd reserves the right to modify or withdraw this offer at any time without prior notice.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">Additional Notes:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• A copy of this agreement must be kept in the vehicle throughout the hire period.</li>
          <li>• Vehicle may be fitted and monitored with GPS Tracking Technology.</li>
          <li>• Account must remain in credit unless prior credit terms have been agreed.</li>
          <li>• Any shortfall is payable immediately upon vehicle return.</li>
          <li>• Unpaid accounts will be sent for collection, with all associated costs charged to the hirer.</li>
        </ul>
      </div>
    </div>
  );
};

export default Terms;
