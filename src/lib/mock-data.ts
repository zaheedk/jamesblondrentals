
import { Vehicle } from './types';

export const vehicles: Vehicle[] = [
  {
    id: 1,
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2023,
    type: "luxury",
    price: 120,
    priceUnit: "day",
    seats: 5,
    transmission: "automatic",
    fuelType: "gasoline",
    fuelEfficiency: "28 mpg",
    features: ["Leather seats", "Navigation system", "Bluetooth", "Backup camera", "Sunroof"],
    images: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000&auto=format&fit=crop"
    ],
    available: true,
    location: "Main Airport",
    description: "Experience luxury and performance in this elegant Mercedes-Benz C-Class. Perfect for business trips or special occasions."
  },
  {
    id: 2,
    make: "Toyota",
    model: "Camry",
    year: 2022,
    type: "midsize",
    price: 75,
    priceUnit: "day",
    seats: 5,
    transmission: "automatic",
    fuelType: "hybrid",
    fuelEfficiency: "52 mpg",
    features: ["Backup camera", "Bluetooth", "Cruise control", "Lane assist", "Apple CarPlay"],
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop"
    ],
    available: true,
    location: "Downtown",
    description: "The reliable and fuel-efficient Toyota Camry Hybrid offers comfort and performance for any journey."
  },
  {
    id: 3,
    make: "BMW",
    model: "X5",
    year: 2023,
    type: "suv",
    price: 150,
    priceUnit: "day",
    seats: 7,
    transmission: "automatic",
    fuelType: "diesel",
    fuelEfficiency: "32 mpg",
    features: ["Leather seats", "Navigation", "Panoramic roof", "Heated seats", "360° camera"],
    images: [
      "https://images.unsplash.com/photo-1571207060011-415e3edeb9fb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622023986317-350b2cfdcf8c?q=80&w=1000&auto=format&fit=crop"
    ],
    available: true,
    location: "Main Airport",
    description: "This premium BMW X5 SUV combines luxury, space and performance for an unforgettable driving experience."
  },
  {
    id: 4,
    make: "Ford",
    model: "Mustang",
    year: 2023,
    type: "convertible",
    price: 130,
    priceUnit: "day",
    seats: 4,
    transmission: "automatic",
    fuelType: "gasoline",
    fuelEfficiency: "25 mpg",
    features: ["Convertible top", "Leather seats", "Premium sound", "Navigation", "Performance package"],
    images: [
      "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop"
    ],
    available: true,
    location: "Downtown",
    description: "Feel the wind in your hair with this iconic Ford Mustang convertible, combining style, power and the open road."
  },
  {
    id: 5,
    make: "Honda",
    model: "Civic",
    year: 2022,
    type: "economy",
    price: 55,
    priceUnit: "day",
    seats: 5,
    transmission: "automatic",
    fuelType: "gasoline",
    fuelEfficiency: "36 mpg",
    features: ["Backup camera", "Bluetooth", "Apple CarPlay", "Android Auto", "Cruise control"],
    images: [
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000&auto=format&fit=crop"
    ],
    available: true,
    location: "Central Station",
    description: "The economical and reliable Honda Civic offers great fuel efficiency and comfort for your daily drives."
  },
  {
    id: 6,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    type: "luxury",
    price: 110,
    priceUnit: "day",
    seats: 5,
    transmission: "automatic",
    fuelType: "electric",
    fuelEfficiency: "142 MPGe",
    features: ["Autopilot", "Glass roof", "Large touchscreen", "Premium sound", "Free supercharging"],
    images: [
      "https://images.unsplash.com/photo-1554744512-783e8dc69b10?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1000&auto=format&fit=crop"
    ],
    available: true,
    location: "Downtown",
    description: "Experience the future of driving with the Tesla Model 3, featuring cutting-edge technology and zero emissions."
  }
];

export const locations = [
  "Main Airport",
  "Downtown",
  "Central Station",
  "West Terminal",
  "East Terminal"
];
