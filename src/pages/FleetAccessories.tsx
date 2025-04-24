
import React from 'react';
import { ChildSeat, BoosterSeat, PalletJack, Straps, HandTrolley, LargeHandTrolley } from 'lucide-react';
import { Button } from "@/components/ui/button";

const accessories = [
  {
    title: "Child Seat",
    description: "Ensure safe travel for smaller children with our child seats, suitable for most rental vehicles. Please note that we do not provide capsule seats or baby seats for children under 6-8 months.",
    icon: ChildSeat,
  },
  {
    title: "Booster Seat",
    description: "Designed for older toddlers who are not yet tall enough to use an adult seatbelt. Provides added height and security to keep your child safe on the road.",
    icon: BoosterSeat,
  },
  {
    title: "Pallet Jack",
    description: "Ideal for lifting and transporting small to medium-sized pallets with ease. Built for durability and supports a maximum load of 1000kg for heavy-duty handling.",
    icon: PalletJack,
  },
  {
    title: "Straps & Ratchet",
    description: "Secure your cargo safely in the truck bed or van using our heavy-duty ratchet straps. Sold as a pair to provide extra stability and prevent shifting during transit.",
    icon: Straps,
  },
  {
    title: "Hand Trolley",
    description: "Reduce the strain of moving heavy items with this durable hand trolley. Its sturdy frame and smooth wheels make transporting goods quick and effortless.",
    icon: HandTrolley,
  },
  {
    title: "Large Hand Trolley",
    description: "Designed for larger, bulkier loads, this trolley makes lifting and transporting heavy items easier. Its reinforced frame provides extra stability for demanding tasks.",
    icon: LargeHandTrolley,
  }
];

const FleetAccessories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Smart Add-Ons</h2>
        <p className="text-xl text-gray-600">
          The Right Accessories for Every Move
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accessories.map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 mx-auto">
              <item.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">{item.title}</h3>
            <p className="text-gray-600 mb-6 text-center">
              {item.description}
            </p>
            <div className="text-center">
              <Button variant="outline" className="hover:bg-primary hover:text-white transition-colors">
                Know More
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetAccessories;
