import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SAVO_SUPABASE_URL = "https://kmapvntjwhhtfgvjzsof.supabase.co";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CROSS_APP_SECRET = Deno.env.get("CROSS_APP_SECRET");
    if (!CROSS_APP_SECRET) {
      return new Response(
        JSON.stringify({ error: "CROSS_APP_SECRET not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { limit = 50, offset = 0 } = await req.json().catch(() => ({}));

    // Fetch customers batch
    const { data: customers, error: fetchError } = await supabase
      .from("customers")
      .select("id, first_name, last_name, email")
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch customers: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customers || customers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No more customers to process", processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { email: string; success: boolean; error?: string }[] = [];
    
    for (const customer of customers) {
      try {
        const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Customer";
        const password = crypto.randomUUID();

        const response = await fetch(
          `${SAVO_SUPABASE_URL}/functions/v1/create-external-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-cross-app-secret": CROSS_APP_SECRET,
            },
            body: JSON.stringify({
              email: customer.email,
              password,
              full_name: fullName,
              rego_number: "TBC",
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          results.push({ email: customer.email, success: true });
        } else {
          results.push({ email: customer.email, success: false, error: data.error || `Status ${response.status}` });
        }
      } catch (err) {
        results.push({ email: customer.email, success: false, error: err.message });
      }

      // Small delay to avoid overwhelming the Savo API
      await new Promise(r => setTimeout(r, 100));
    }

    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Batch sync complete: ${succeeded} succeeded, ${failed} failed out of ${customers.length}`);

    return new Response(
      JSON.stringify({
        processed: customers.length,
        succeeded,
        failed,
        nextOffset: offset + customers.length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in batch-sync-to-savo:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
