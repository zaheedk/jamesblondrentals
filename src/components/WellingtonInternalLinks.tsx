import { Link } from "react-router-dom";

const WELLINGTON_LINKS = [
  { to: "/truck-hire-wellington", label: "Truck Hire Wellington" },
  { to: "/van-hire-wellington", label: "Van Hire Wellington" },
  { to: "/car-rental-wellington-new-zealand", label: "Car Hire Wellington" },
  { to: "/minibus-hire-wellington", label: "Minibus Hire Wellington" },
  { to: "/wellington-minibus-hire", label: "10 & 12 Seat Minibus Hire — Wellington" },
  { to: "/wellington-10-12-seat-van-minibus-rental", label: "10 & 12 Seat Van Rental — Wellington" },
  { to: "/wellington-minibus-hire-cbd", label: "Wellington CBD Minibus Hire" },
  // Van satellites
  { to: "/cargo-van-hire-wellington", label: "Cargo Van Hire Wellington" },
  { to: "/moving-van-hire-wellington", label: "Moving Van Hire Wellington" },
  { to: "/van-hire-wellington-airport", label: "Van Hire Wellington Airport" },
  { to: "/van-hire-lower-hutt", label: "Van Hire Lower Hutt" },
  { to: "/van-hire-porirua", label: "Van Hire Porirua" },
  { to: "/van-hire-kapiti-coast", label: "Van Hire Kāpiti Coast" },
  // Truck satellites
  { to: "/small-truck-hire-wellington", label: "Small Truck Hire Wellington" },
  { to: "/moving-truck-hire-wellington", label: "Moving Truck Hire Wellington" },
  { to: "/furniture-truck-hire-wellington", label: "Furniture Truck Hire Wellington" },
  { to: "/truck-hire-lower-hutt", label: "Truck Hire Lower Hutt" },
  { to: "/truck-hire-porirua", label: "Truck Hire Porirua" },
  { to: "/airport/wellington", label: "Wellington Airport Pickup" },
  { to: "/contact/wellington", label: "Contact Wellington Branch" },
];

interface Props {
  currentPath?: string;
  heading?: string;
}

export default function WellingtonInternalLinks({ currentPath, heading = "Other Wellington vehicle rentals" }: Props) {
  const links = WELLINGTON_LINKS.filter((l) => l.to !== currentPath);
  return (
    <section className="section-padding border-t bg-muted/30">
      <div className="container mx-auto container-padding max-w-5xl">
        <h2 className="text-balance mb-2">{heading}</h2>
        <p className="text-muted-foreground mb-6">
          Browse our full Wellington fleet — covering CBD, Lower Hutt, Upper Hutt, Petone, Porirua, Tawa, Johnsonville, and Kapiti Coast.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-primary hover:underline font-medium">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}