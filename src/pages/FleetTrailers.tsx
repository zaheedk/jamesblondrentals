import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const trailers = [
  {
    id: "cage-trailer",
    title: "TRAILER WITH A CAGE",
    specs: [
      "Made of durable steel",
      "Surrounded by an alloy cage",
      "Fit 7/8 inch standard NZ tow-ball",
      "12-volt system for lights",
    ],
    dimensions: {
      label: "Tray",
      specs: "2400(L) x 1200(W)",
    },
    maxLoad: "750kg",
    warning: "not suited to 24-volt systems",
    image: "/lovable-uploads/ca4fe6a5-97a6-4d6c-a675-a0ad2e3e4856.png"
  },
  {
    id: "luggage-trailer",
    title: "LUGGAGE TRAILER",
    specs: [
      "Secure / Lockable",
      "Fit 7/8 inch standard NZ tow-ball",
      "12-volt system for lights",
    ],
    dimensions: {
      label: "Sizes Available",
      specs: [
        "Small: 1400(L) x1100(W) x1200(H)",
        "Medium: 1800(L) x1200(W) x1200(H)",
        "Large: 2000(L) x1400(W) x1150(H)",
      ]
    },
    maxLoad: "500kg",
    warning: "not suited to 24-volt systems",
    image: "/lovable-uploads/ea4af725-7713-464d-83cb-34d5cd4c0e7f.png"
  },
  {
    id: "car-transporter",
    title: "CAR TRANSPORTER TRAILER",
    specs: [
      "Tilt / Flat deck trailer",
      "Heavy duty winch",
    ],
    dimensions: {
      label: "Deck",
      specs: "5000(L) x 1900(W)",
    },
    maxLoad: "1940kg",
    warning: "Towing vehicle must have WOF/REG",
    image: "/lovable-uploads/3f2ac575-135b-409f-b546-6ef7cdb9c9d9.png"
  }
];

const FleetTrailers = () => (
  <div className="container mx-auto px-4 py-10">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold mb-4">Versatile Fleet – Reliable Trailers & Flat Deck Solutions</h1>
      <p className="text-lg text-gray-700">
        Choose from our range of professional trailers for all your hauling needs.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {trailers.map((trailer) => (
        <Card key={trailer.id} className="flex flex-col">
          {trailer.image && (
            <AspectRatio ratio={16/9} className="w-full">
              <img 
                src={trailer.image} 
                alt={`${trailer.title}`} 
                className="w-full h-full object-cover rounded-t-lg"
              />
            </AspectRatio>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">{trailer.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 mb-4">
              {trailer.specs.map((spec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-gray-600">{spec}</span>
                </li>
              ))}
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">{trailer.dimensions.label}</h3>
              {Array.isArray(trailer.dimensions.specs) ? (
                <ul className="space-y-1">
                  {trailer.dimensions.specs.map((spec, index) => (
                    <li key={index} className="text-gray-600">{spec}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">{trailer.dimensions.specs}</p>
              )}
            </div>

            <div className="font-semibold text-primary mb-4">
              Max Load: {trailer.maxLoad}
            </div>

            {trailer.warning && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {trailer.warning}
                </AlertDescription>
              </Alert>
            )}

            {trailer.note && (
              <p className="text-gray-600 italic">{trailer.note}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to={`/fleet/trailers/${trailer.id}`}>Know More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

export default FleetTrailers;
