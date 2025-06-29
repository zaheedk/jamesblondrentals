
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();

  // For now, we'll handle the specific blog post. In the future, this could be dynamic
  if (id !== 'james-blond-best-west-auckland') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="outline" asChild className="mb-8">
        <Link to="/blog" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium">
            Reviews
          </span>
          
          <h1 className="text-4xl font-bold mt-4 mb-6">
            FAQ: Why I Believe James Blond Rentals Is the Best in West Auckland 🚛
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>James Blond Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>December 29, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>5 min read</span>
            </div>
          </div>
          
          <img 
            src="/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png" 
            alt="James Blond Rentals Fleet" 
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">1. What types of vehicles do they offer?</h2>
                <p className="text-gray-700 leading-relaxed">
                  I love that James Blond Rentals has a vast fleet of vans and trucks—from compact cargo vans and UTEs to 9 m³–25 m³ light trucks with optional tail lifts. They also handle trailers and minibuses, so whether I'm moving house or running an event, they've got me covered.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">2. Why do I choose them over other companies?</h2>
                <p className="text-gray-700 leading-relaxed">
                  They've been local and family-owned since 2004, so they really care. With over 100,000 customers served and 20+ years experience, they've mastered reliability and transparent pricing. I'm talking no hidden fees, unlimited km on many vehicles, and on-site diesel pumps—just what I need for stress-free trips.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">3. Is their pricing competitive?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Absolutely. Their rates are refreshingly honest. I once spent NZ$101 total for a small truck—hire, fuel, kms and returned full. A Google reviewer from Kelston confirms:
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600">
                  "An easy online process … hireage fee $85 … kms $16 … diesel $85 … excess bond was returned."
                </blockquote>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">4. How's their customer service?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Outstanding! Booking online or by phone is easy. I've found the staff knowledgeable and friendly. One reviewer said:
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 mb-4">
                  "The level of service and care … from Tracy … was second to none."
                </blockquote>
                <p className="text-gray-700 leading-relaxed">
                  Trustpilot reviews back this up too:
                </p>
                <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600">
                  "Hands down worth every cent – BANG FOR BUCK!!! Awesome customer service …"
                </blockquote>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">5. Are their vehicles of good quality?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Yes. While some vehicles might show minor wear, every engine is solid. One reviewer noted a "perfectly reliable Suzuki Swift" and a powerful 19‑seater Toyota Coaster that handled hills with ease. Plus, they promptly reimburse any repairs—such as a headlight replacement—without hassle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">6. Are there any downsides?</h2>
                <p className="text-gray-700 leading-relaxed">
                  They're upfront about this: older vehicles may show wear, and airport pick-up comes with a ~$70 shuttle fee. Some customers mention bond delays if paid via credit card—but choosing cash can speed up refunds.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">7. What do the top reviews say?</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Vinod P (Apr 2024) on a family trip:</h4>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600">
                      "We hired the 19 seater … engine was very powerful … no issues going up steep hills … James Blond were quick to reimburse … would use them again."
                    </blockquote>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Stephanie S (Jul 2023):</h4>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600">
                      "Highly recommend … booked the 9 m and 12 m trucks … super easy to drive. Affordable, great customer service and very accommodating."
                    </blockquote>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Ingrid O (Jul 2024):</h4>
                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600">
                      "The level of service … from Tracy … second to none … drove nearly 1200 km … the vehicle never missed a beat."
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">8. Do I find the rental process smooth?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Yes. Online booking is straightforward, and both pick-up and drop-off are quick and easy. One international customer noted both airport pick-up and return were seamless.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">9. Would I recommend them?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Definitely. If you want dependable vans or trucks at great rates—backed by friendly, local service and transparent pricing—James Blond Rentals is my top choice in West Auckland.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">🏆 In summary</h2>
                <p className="text-gray-700 leading-relaxed mb-4">I choose James Blond Rentals because:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Huge and well-maintained fleet</strong> (vans, trucks, trailers, tail-lifts)</li>
                  <li>• <strong>Transparent pricing</strong> with no nasty surprises (unlimited km, diesel pump, no hidden fees)</li>
                  <li>• <strong>Top-notch, friendly service</strong>—especially from staff like Tracy</li>
                  <li>• <strong>Reliable vehicles</strong> with strong performance</li>
                  <li>• <strong>Great reviews</strong> from locals and travellers alike</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Next time I need a vehicle, I'll be calling James Blond—confident I'll get solid value and hassle-free service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-primary p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience the Best Service?</h2>
          <p className="text-lg mb-6">Join over 100,000 satisfied customers who trust James Blond Rentals</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/vehicles">Book Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
