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

    // Use the new Places API (New) instead of legacy API
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Places API error:', data);
      return new Response(
        JSON.stringify({ error: data.error?.message || 'Failed to fetch reviews' }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const reviews = data.reviews || [];

    // Transform reviews to match our component format
    const transformedReviews = reviews.map((review: any) => ({
      name: review.authorAttribution?.displayName || 'Anonymous',
      date: review.publishTime ? new Date(review.publishTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      rating: review.rating || 5,
      text: review.text?.text || review.originalText?.text || '',
      verified: true,
      initial: (review.authorAttribution?.displayName || 'A').charAt(0).toUpperCase(),
      profile_photo_url: review.authorAttribution?.photoUri,
    }));

    console.log(`Successfully fetched ${transformedReviews.length} reviews`);

    return new Response(
      JSON.stringify({
        businessName: data.displayName?.text || 'James Blond Rentals',
        rating: data.rating || 4.5,
        totalReviews: data.userRatingCount || 0,
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
