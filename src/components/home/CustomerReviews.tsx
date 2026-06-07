import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
  initial: string;
  profile_photo_url?: string;
}

interface GoogleReviewsData {
  businessName: string;
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

const CustomerReviews = () => {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-google-reviews');
        
        if (error) {
          console.error('Error fetching reviews:', error);
          toast({
            title: "Error loading reviews",
            description: "Could not load Google reviews. Showing cached reviews.",
            variant: "destructive"
          });
          return;
        }

        setReviewsData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [toast]);

  // Fallback reviews if API fails
  const fallbackReviews: Review[] = [
    {
      name: "Tia Epiha",
      date: "2024-11-28",
      rating: 4,
      text: "Cheap Straightforward and easy to work with.. Would definetly use there rental vehicles again..",
      verified: true,
      initial: "T"
    },
    {
      name: "Tracey Hopkins",
      date: "2024-11-24",
      rating: 5,
      text: "Great service, excellent truck, no problems at all. Will definitely use Basic Rentals again. Highly recommend them.",
      verified: true,
      initial: "T"
    }
  ];

  const reviews = reviewsData?.reviews || fallbackReviews;
  const rating = reviewsData?.rating || 4.5;
  const totalReviews = reviewsData?.totalReviews || 215;
  return (
    <section className="py-10 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact header bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
            <h2 className="text-2xl md:text-3xl font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm tracking-wide">
                {rating >= 4.5 ? 'EXCELLENT' : rating >= 4 ? 'GOOD' : 'GREAT'}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : star - rating < 1
                        ? 'fill-yellow-400/50 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalReviews}</span> reviews on
              </span>
              <svg className="w-16 h-5" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                <path fill="#4285F4" d="M225 3v65h-9.5V3h9.5z"/>
                <path fill="#34A853" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                <path fill="#EA4335" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
              </svg>
            </div>
          </div>

          {/* Reviews Carousel */}
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-[210px] bg-card/80 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{review.initial}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-sm leading-tight">{review.name}</div>
                            <div className="text-xs text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed line-clamp-5 flex-1">
                        {review.text}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>

          <div className="text-center mt-4">
            <a
              href="https://www.google.com/search?q=james+blond+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium"
            >
              View all reviews on Google →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
