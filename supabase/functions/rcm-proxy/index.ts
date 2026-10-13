const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RCM_API_BASE = "https://apis.rentalcarmanager.com/booking/v3.2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { method: rcmMethod, apiKey, signature, body } = await req.json();

    if (!apiKey || !signature || !body) {
      return new Response(
        JSON.stringify({ status: "error", error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rcmUrl = `${RCM_API_BASE}?apikey=${apiKey}`;
    
    console.log(`Proxying RCM API request: ${rcmMethod || "unknown"} to ${rcmUrl}`);

    // Retry on RCM rate limits (429) with backoff so concurrent site traffic
    // doesn't surface as errors to users.
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let rcmResponse: Response | null = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      rcmResponse = await fetch(rcmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "signature": signature,
        },
        body: JSON.stringify(body),
      });
      if (rcmResponse.status !== 429) break;
      const wait = Math.min(2000 * Math.pow(2, attempt), 8000);
      console.log(`RCM 429 rate limit, retrying in ${wait}ms (attempt ${attempt + 1})`);
      await sleep(wait);
    }
    if (!rcmResponse) throw new Error("RCM request failed");

    const contentType = rcmResponse.headers.get("content-type") || "";
    
    if (contentType.includes("text/html")) {
      console.error("RCM API returned HTML instead of JSON");
      return new Response(
        JSON.stringify({ status: "error", error: "RCM API returned unexpected HTML response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await rcmResponse.text();
    
    return new Response(data, {
      status: rcmResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("RCM proxy error:", error);
    return new Response(
      JSON.stringify({ status: "error", error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
