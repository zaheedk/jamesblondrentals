import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    const placeId = Deno.env.get('GOOGLE_PLACE_ID');

    if (!apiKey || !placeId) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Missing API credentials' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching reviews for place ID:', placeId);

    // Fetch place details including reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return new Response(
        JSON.stringify({ error: data.error_message || 'Failed to fetch reviews' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = data.result;
    const reviews = result.reviews || [];

    // Transform reviews to match our component format
    const transformedReviews = reviews.map((review: any) => ({
      name: review.author_name,
      date: new Date(review.time * 1000).toISOString().split('T')[0],
      rating: review.rating,
      text: review.text,
      verified: true,
      initial: review.author_name.charAt(0).toUpperCase(),
      profile_photo_url: review.profile_photo_url,
    }));

    console.log(`Successfully fetched ${transformedReviews.length} reviews`);

    return new Response(
      JSON.stringify({
        businessName: result.name,
        rating: result.rating,
        totalReviews: result.user_ratings_total,
        reviews: transformedReviews,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-google-reviews function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
