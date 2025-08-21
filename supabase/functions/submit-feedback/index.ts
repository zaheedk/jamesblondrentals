import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  rating: number;
  suggestions?: string;
  bookingReference?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      userId = user?.id || null;
    }

    // Parse request body
    const { rating, suggestions, bookingReference }: FeedbackRequest = await req.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be between 1 and 5" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Save feedback to database using service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: feedback, error: dbError } = await supabaseService
      .from("booking_feedback")
      .insert({
        rating,
        suggestions,
        user_id: userId,
        booking_reference: bookingReference,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save feedback" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send email notification
    try {
      const emailContent = `
        <h2>New Booking Experience Feedback Received</h2>
        <p><strong>Rating:</strong> ${rating}/5</p>
        <p><strong>Booking Reference:</strong> ${bookingReference || 'N/A'}</p>
        <p><strong>User ID:</strong> ${userId || 'Guest'}</p>
        <p><strong>Suggestions:</strong></p>
        <p>${suggestions || 'No suggestions provided'}</p>
        <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p>Feedback ID: ${feedback.id}</p>
      `;

      await resend.emails.send({
        from: "James Blond Feedback <feedback@jamesblond.co.nz>",
        to: ["zaheed@jamesblond.co.nz"],
        subject: `Booking Experience Feedback - Rating: ${rating}/5`,
        html: emailContent,
      });

      console.log("Email sent successfully to zaheed@jamesblond.co.nz");
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feedback submitted successfully",
        feedbackId: feedback.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in submit-feedback function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});