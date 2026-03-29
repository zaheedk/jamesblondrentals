import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only process emails starting with "zaheedk" (testing phase)
    const emailLower = email.toLowerCase();
    if (!emailLower.startsWith("zaheedk")) {
      console.log(`Skipping account creation for ${email} - not in test group`);
      return new Response(
        JSON.stringify({ skipped: true, message: "Email not in test group" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === emailLower
    );

    if (userExists) {
      console.log(`User ${email} already exists, skipping`);
      return new Response(
        JSON.stringify({ skipped: true, message: "User already exists" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the user with inviteUserByEmail - this sends a password setup email
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: `${firstName || ""} ${lastName || ""}`.trim(),
      },
      redirectTo: `${Deno.env.get("SITE_URL") || "https://jamesblondrentals.lovable.app"}/reset-password`,
    });

    if (error) {
      console.error("Error creating user account:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Account created and invite sent to ${email}`);

    return new Response(
      JSON.stringify({ success: true, userId: data.user?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-booking-account:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
