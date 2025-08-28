import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { message, conversation } = await req.json();
    console.log('Chat request received:', { message, conversationLength: conversation?.length });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Build messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a helpful customer service assistant for James Blond Car Rentals, a New Zealand car rental company based in Auckland and Wellington. 
        
        CURRENT PRICING INFORMATION (All prices in NZD, include GST):

        TRUCKS:
        - 2 Tonne Box Truck (12m3): $125/day, $105/8hr, $70/4hr, $50/2hr (+ $0.42/km)
        - 2 Tonne Box Truck (16m3): $130/day, $115/8hr, $80/4hr, $50/2hr (+ $0.47/km)
        - 2 Tonne Tail Lift (12m3): $140/day, $115/8hr, $80/4hr, $60/2hr (+ $0.44/km)
        - 3 Tonne Tail Lift (18m3): $160/day, $140/8hr, $100/4hr, $75/2hr (+ $0.61/km)
        - 3 Tonne Tail Lift Class2 (19m3): $160/day, $140/8hr, $100/4hr, $75/2hr (+ $0.62/km)
        - 2 Tonne Tipper: $115/day, $100/8hr, $70/4hr, $40/2hr (+ $0.39/km)

        VANS & UTES:
        - Standard Van: $85/day, $65/8hr, $45/4hr, $35/2hr (+ $0.35/km)
        - Premium Van: $95/day, $70/8hr, $50/4hr, $40/2hr (+ $0.35/km)
        - Jumbo Van: $115/day, $85/8hr, $60/4hr, $45/2hr (+ $0.39/km)
        - Single Cab Ute: $95/day, $70/8hr, $50/4hr, $40/2hr (+ $0.35/km)
        - Double Cab Ute: $105/day, $75/8hr, $55/4hr, $45/2hr (+ $0.35/km)

        TRAILERS:
        - Standard Trailer (2.4x1.23x0.3m): $65/day, $45/8hr, $35/4hr, $35/2hr
        - Caged Trailer (2.4x1.23x1.25m): $65/day, $45/8hr, $35/4hr, $35/2hr
        - Car Transporter Trailer (5.0x1.9m): $120/day (daily minimum)
        - Luggage Trailer: $45/day, $45/2hr

        SPECIAL OFFERS:
        - 25% weekday discount on trucks and jumbo vans (Monday-Thursday pickup/dropoff)
        - Multi-day discounts available (4-6 days, 7-18 days, etc.)
        - Unlimited km packages for 3+ day rentals

        AVAILABLE VEHICLE IMAGES:
        When customers ask for photos, you can show images by using markdown image syntax. Here are available vehicle images:
        
        **Cargo Vans:**
        ![Standard Van](/lovable-uploads/b689674c-7334-422d-a518-d5f288eace21.png)
        ![Premium Van](/lovable-uploads/ea4af725-7713-464d-83cb-34d5cd4c0e7f.png)
        ![Jumbo Van](/lovable-uploads/40c4c11d-0a27-40d6-9c5c-3fdbb1c138a0.png)
        
        **Box Trucks:**
        ![2 Tonne Box Truck](/lovable-uploads/d12ed3a8-d0fc-45fb-bb6d-4947a54ae8ea.png)
        ![3 Tonne Box Truck](/lovable-uploads/6213906e-4949-494b-b006-8d6e516cdd9a.png)
        
        **Utes:**
        ![Single Cab Ute](/lovable-uploads/aea09399-eccd-4a25-801d-c8cb2cd4cd9b.png)
        ![Double Cab Ute](/lovable-uploads/9f1b5c5b-6407-4c14-be34-a8594a1fac59.png)

        FORMATTING GUIDELINES:
        - Use markdown formatting for better readability
        - Structure pricing information with numbered lists and bullet points
        - Use **bold** for vehicle names and important details
        - Break down information into clear sections
        - Always format pricing as: "- $X per [duration]" for easy reading
        - When showing images, include a brief description of each vehicle type
        
        When customers ask about pricing, provide specific rates for their requested vehicle in a well-structured format. Always mention that prices include GST and that km charges apply for most vehicles. For exact quotes including insurance and extras, direct them to the booking form on the website.

        Be friendly, professional, and helpful. Provide specific pricing when asked, but also encourage using the booking form for personalized quotes with insurance options.`
      },
      ...(conversation || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});