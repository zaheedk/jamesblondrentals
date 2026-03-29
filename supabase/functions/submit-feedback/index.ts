import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  rating: number;
  suggestions?: string;
  bookingReference?: string;
  customerName?: string;
  customerEmail?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      userId = user?.id || null;
    }

    const { rating, suggestions, bookingReference, customerName, customerEmail }: FeedbackRequest = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be between 1 and 5" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
        customer_name: customerName,
        customer_email: customerEmail,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save feedback" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send notification via Resend
    try {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        const stars = '⭐'.repeat(rating);
        const emailHtml = `
          <h2>New Booking Feedback</h2>
          <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
          <p><strong>Customer:</strong> ${customerName || 'N/A'}</p>
          <p><strong>Email:</strong> ${customerEmail || 'N/A'}</p>
          <p><strong>Booking Ref:</strong> ${bookingReference || 'N/A'}</p>
          ${suggestions ? `<p><strong>Suggestions:</strong> ${suggestions}</p>` : ''}
        `;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "James Blond Rentals <info@jamesblond.co.nz>",
            to: ["zaheed@jamesblond.co.nz"],
            subject: `New Feedback: ${stars} (${rating}/5)`,
            html: emailHtml,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Resend API error:", errData);
        } else {
          console.log("Feedback notification email sent via Resend");
        }
      }
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feedback submitted successfully",
        feedbackId: feedback.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in submit-feedback function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
