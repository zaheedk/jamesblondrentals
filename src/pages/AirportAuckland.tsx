
import React from 'react';

const AirportAuckland = () => (
  <div className="space-y-6">
    <section className="mb-8">
      <div className="text-center bg-secondary p-4 rounded-lg mb-6">
        <p className="text-lg font-bold">
          Need a Shuttle? Call James Blond on <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a> to organise your pick up
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Auckland Airport Car Rental</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-600 mb-4">
            Visiting Auckland and need a reliable rental straight from the airport? Look no further than James Blond Rentals at Auckland Airport. Conveniently located just minutes from both the Domestic and International Terminals, we provide fast, friendly service with a full fleet of rental options, from cars to trucks, trailers, and minibuses.
          </p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">Address:</p>
            <p className="text-gray-600">310 Landing Drive</p>
            <p className="text-gray-600 mb-2">Mangere, Auckland 2022, New Zealand</p>
            <p className="text-gray-600">Phone: <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a></p>
            <p className="text-gray-600">Email: <a href="mailto:info@jamesblond.co.nz" className="text-primary hover:underline">info@jamesblond.co.nz</a></p>
          </div>
        </div>
        <div>
          <img 
            src="/lovable-uploads/6a274083-edb0-4ac2-8e40-4ac3703a8660.png" 
            alt="Auckland International Airport" 
            className="rounded-lg w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section className="py-6 border-t">
      <h3 className="text-xl font-semibold mb-4">24/7 Airport Shuttle Transfers</h3>
      <p className="text-gray-600 mb-4">
        Once your flight arrives and you've collected your bags, please call us on <a href="tel:0800525663" className="text-primary hover:underline">0800 525 663</a>. One of our friendly shuttle drivers will pick you up from the designated pickup zone.
      </p>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Domestic Terminal Pickup:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Exit the terminal and follow the signs for "Rental Car Shuttles" located outside Door 9</li>
            <li>Cross the first lane of traffic and wait at the courtesy shuttle pickup zone</li>
            <li>Our blue and white James Blond shuttle van will arrive shortly to take you to our Airpark Drive branch</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">International Terminal Pickup:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Exit the terminal through Door 11 near the arrivals area and turn right</li>
            <li>Proceed along the covered walkway until you reach the offsite shuttle pickup bay</li>
            <li>Watch for the James Blond shuttle van - our team will be there to assist with your bags</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Drop-Off Instructions:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li>Return your vehicle to 310 Landing Drive, Mangere</li>
            <li>After a quick check, we'll shuttle you directly to your terminal</li>
            <li>For early or after-hours returns, follow the signage to our drop-off box and contact our shuttle team</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
);

export default AirportAuckland;

