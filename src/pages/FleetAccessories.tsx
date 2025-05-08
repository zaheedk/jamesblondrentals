
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const accessories = [
  {
    title: "Child Seat",
    description: "Ensure safe travel for smaller children with our child seats, suitable for most rental vehicles. Please note that we do not provide capsule seats or baby seats for children under 6-8 months.",
    image: "/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png",
    link: "/fleet/accessories/child-seat"
  },
  {
    title: "Booster Seat",
    description: "Designed for older toddlers who are not yet tall enough to use an adult seatbelt. Provides added height and security to keep your child safe on the road.",
    image: "/lovable-uploads/aded4525-6592-42ec-9193-53b898de2c13.png",
    link: "/fleet/accessories/booster-seat"
  },
  {
    title: "Pallet Jack",
    description: "Ideal for lifting and transporting small to medium-sized pallets with ease. Built for durability and supports a maximum load of 1000kg for heavy-duty handling.",
    image: "/lovable-uploads/7399d499-7037-41fe-b5c3-3d013ad2163e.png",
    link: "/fleet/accessories/pallet-jack"
  },
  {
    title: "Straps & Ratchet",
    description: "Secure your cargo safely in the truck bed or van using our heavy-duty ratchet straps. Sold as a pair to provide extra stability and prevent shifting during transit.",
    image: "/lovable-uploads/6242ae39-7570-4898-b18a-1fa9753856af.png",
    link: "/fleet/accessories/straps-ratchet"
  },
  {
    title: "Hand Trolley",
    description: "Reduce the strain of moving heavy items with this durable hand trolley. Its sturdy frame and smooth wheels make transporting goods quick and effortless.",
    image: "/lovable-uploads/2462a28e-2cb6-44ef-82b9-b46b5559d465.png",
    link: "/fleet/accessories/hand-trolley"
  },
  {
    title: "Large Hand Trolley",
    description: "Designed for larger, bulkier loads, this trolley makes lifting and transporting heavy items easier. Its reinforced frame provides extra stability for demanding tasks.",
    image: "/lovable-uploads/2462a28e-2cb6-44ef-82b9-b46b5559d465.png",
    link: "/fleet/accessories/large-hand-trolley"
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
            {item.image && (
              <div className="flex items-center justify-center mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="max-h-48 object-contain rounded-lg"
                  loading="lazy"
                  width="200"
                  height="150"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold text-center mb-4">{item.title}</h3>
            <p className="text-gray-600 mb-6 text-center">
              {item.description}
            </p>
            {item.link && (
              <div className="flex justify-center">
                <Link to={item.link}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetAccessories;
