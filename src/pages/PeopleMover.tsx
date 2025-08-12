import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const seo = {
  title: "People Mover Rentals: 8, 10, 12 Seaters | James Blond",
  description:
    "Premium 8, 10 and 12 seater people movers in NZ. Kia Carnival, Toyota HiAce, LDV Deliver 9. Unlimited km, zero excess option. Auckland, Wellington, Christchurch.",
  canonical: "https://jamesblond.co.nz/people-mover",
};

export default function PeopleMover() {
  useEffect(() => {
    // Title
    document.title = seo.title;

    // Meta description
    const descId = "meta-description-people-mover";
    let metaDesc = document.querySelector(`meta[name="description"]`);
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", seo.description);
    (metaDesc as any).id = descId;

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", seo.canonical);

    // JSON-LD structured data
    const ldJson = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'People Mover Rentals',
      areaServed: [
        { '@type': 'City', name: 'Auckland' },
        { '@type': 'City', name: 'Wellington' },
        { '@type': 'City', name: 'Christchurch' },
      ],
      provider: { '@type': 'Organization', name: 'James Blond Rentals' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'People Movers',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: '8-Seater Kia Carnival',
          },
          {
            '@type': 'OfferCatalog',
            name: '10-Seater Toyota HiAce',
          },
          {
            '@type': 'OfferCatalog',
            name: '12-Seater LDV Deliver 9',
          },
        ],
      },
    };

    const scriptId = "ldjson-people-mover";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ldJson);
  }, []);

  return (
    <div>
      <header className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge className="mb-3" variant="secondary">Premium People Movers</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">People Mover Rentals in New Zealand</h1>
            <p className="mt-3 text-muted-foreground">
              Travel together in comfort with our premium 8, 10 and 12 seater people movers.
              All vans are under 2 years old, offer generous luggage space, include unlimited
              kilometres, and you can choose to reduce the insurance excess to zero.
            </p>
            <p className="mt-2 text-muted-foreground">
              Popular with tour operators from the Far East and across Asia including Indonesia,
              Malaysia, Singapore and India. Pick up and drop off in Auckland, Wellington or
              Christchurch.
            </p>
            <div className="mt-6">
              <Link to="/booking">
                <Button size="lg">Check Availability</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* 8-Seater */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">8-Seater Kia Carnival</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src="/lovable-uploads/aea09399-eccd-4a25-801d-c8cb2cd4cd9b.png"
                  alt="Kia Carnival 8-seater people mover with ample luggage space"
                  loading="lazy"
                  className="w-full h-44 object-cover rounded-md border"
                  width={800}
                  height={300}
                />
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Premium 8 seats with generous luggage capacity</li>
                  <li>Late-model fleet — less than 2 years old</li>
                  <li>Unlimited kilometres included</li>
                  <li>Optional zero insurance excess</li>
                  <li>Ideal for family and small group travel</li>
                </ul>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link to="/booking"><Button>Check Availability</Button></Link>
              </CardFooter>
            </Card>

            {/* 10-Seater */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">10-Seater Toyota HiAce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src="/lovable-uploads/f40953dd-07c7-405f-a446-bbb6de3b2aac.png"
                  alt="Toyota HiAce 10-seater people mover ideal for tour operators"
                  loading="lazy"
                  className="w-full h-44 object-cover rounded-md border"
                  width={800}
                  height={300}
                />
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Comfortable 10-seat layout with ample luggage space</li>
                  <li>Under 2 years old for reliability and comfort</li>
                  <li>Unlimited kilometres included</li>
                  <li>Optional zero insurance excess</li>
                  <li>Popular with tour operators from Asia</li>
                </ul>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link to="/fleet/minibus/10-seat-minibus"><Button variant="secondary">View Details</Button></Link>
                <Link to="/booking"><Button>Check Availability</Button></Link>
              </CardFooter>
            </Card>

            {/* 12-Seater */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">12-Seater LDV Deliver 9</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src="/lovable-uploads/bdd5521d-5fab-4187-8d79-fcf80b3f46db.png"
                  alt="LDV Deliver 9 12-seater people mover with large luggage area"
                  loading="lazy"
                  className="w-full h-44 object-cover rounded-md border"
                  width={800}
                  height={300}
                />
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Spacious 12-seat configuration with excellent luggage room</li>
                  <li>Late-model vehicles — less than 2 years old</li>
                  <li>Unlimited kilometres included</li>
                  <li>Optional zero insurance excess</li>
                  <li>Perfect for larger families and tour groups</li>
                </ul>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link to="/fleet/minibus/12-seat-minibus"><Button variant="secondary">View Details</Button></Link>
                <Link to="/booking"><Button>Check Availability</Button></Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-10 rounded-lg border p-5 bg-muted/30">
            <h2 className="text-lg font-semibold">Pick-up and Drop-off Locations</h2>
            <p className="mt-2 text-muted-foreground">
              Collect and return your people mover at any of our branches in Auckland, Wellington or Christchurch.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
