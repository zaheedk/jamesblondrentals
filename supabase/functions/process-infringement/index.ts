import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing infringement image with AI...");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are an OCR and data extraction assistant. Extract infringement notice details from scanned documents. Return ONLY the extracted data using the tool provided. If a field cannot be found, use an empty string. For dates, use dd/MM/yyyy format. For time, use HH:mm format (24hr).`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all infringement details from this scanned notice. Look for: notice number, vehicle registration, offence date and time, issuing agency name and full postal address, offence description, and fee amount.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_infringement",
                description: "Extract structured infringement notice data",
                parameters: {
                  type: "object",
                  properties: {
                    notice_number: {
                      type: "string",
                      description: "The infringement/notice number",
                    },
                    vehicle_registration: {
                      type: "string",
                      description: "Vehicle registration/plate number",
                    },
                    offence_date: {
                      type: "string",
                      description: "Date of offence in dd/MM/yyyy format",
                    },
                    offence_time: {
                      type: "string",
                      description: "Time of offence in HH:mm format",
                    },
                    issuing_agency_name: {
                      type: "string",
                      description: "Name of the issuing authority/agency",
                    },
                    issuing_agency_address: {
                      type: "string",
                      description:
                        "Full postal address of the issuing agency (multiple lines separated by newlines)",
                    },
                    offence_description: {
                      type: "string",
                      description: "Description of the offence",
                    },
                    fee_amount: {
                      type: "string",
                      description: "Total fee amount (e.g. $100.00)",
                    },
                    vehicle_make: {
                      type: "string",
                      description: "Vehicle make if mentioned",
                    },
                    vehicle_type: {
                      type: "string",
                      description: "Vehicle type if mentioned (e.g. Rental Camper)",
                    },
                    location_of_offence: {
                      type: "string",
                      description: "Street/location where offence occurred",
                    },
                  },
                  required: [
                    "notice_number",
                    "vehicle_registration",
                    "offence_date",
                    "offence_time",
                    "issuing_agency_name",
                    "issuing_agency_address",
                    "offence_description",
                    "fee_amount",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "extract_infringement" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI processing failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "AI could not extract data from the document" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extracted = JSON.parse(toolCall.function.arguments);
    console.log("Extracted infringement data:", extracted);

    return new Response(JSON.stringify({ data: extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-infringement error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
