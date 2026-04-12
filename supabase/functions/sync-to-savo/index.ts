import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SAVO_SUPABASE_URL = "https://kmapvntjwhhtfgvjzsof.supabase.co";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CROSS_APP_SECRET = Deno.env.get("CROSS_APP_SECRET");
    if (!CROSS_APP_SECRET) {
      console.error("CROSS_APP_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Cross-app secret not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, fullName, regoNumber } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a random password for the Savo account
    const password = crypto.randomUUID();

    console.log(`Creating Savo account for ${email} with rego ${regoNumber || "none"}`);

    const response = await fetch(
      `${SAVO_SUPABASE_URL}/functions/v1/create-external-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cross-app-secret": CROSS_APP_SECRET,
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName || "Customer",
          rego_number: regoNumber || "TBC",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Savo account creation failed:", data);
      return new Response(
        JSON.stringify({ error: data.error || "Failed to create Savo account" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Savo account created/synced for ${email}. Login URL generated.`);

    // Return the login_url so the frontend can store/display it
    return new Response(
      JSON.stringify({
        success: true,
        login_url: data.login_url,
        user_id: data.user_id,
        expires_at: data.expires_at,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in sync-to-savo:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
