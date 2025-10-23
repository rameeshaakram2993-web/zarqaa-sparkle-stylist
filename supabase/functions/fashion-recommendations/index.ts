import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { occasion, preferences, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Fashion recommendation request:", { occasion, preferences, budget });

    const systemPrompt = `You are an expert AI fashion stylist for ZarqaaCloset, specializing in eastern wear and jewelry.

Create a complete outfit recommendation based on the user's input. Consider:
1. Main outfit (suit, saree, kurta, or lehenga)
2. Complementary jewelry (necklace, earrings, or bangles)
3. Style coordination and color matching
4. Budget constraints

Respond ONLY with a JSON object in this exact format (no other text):
{
  "outfit": {
    "name": "Outfit name",
    "description": "Detailed description",
    "estimatedPrice": 5000,
    "category": "dress"
  },
  "jewelry": {
    "name": "Jewelry name",
    "description": "Detailed description",
    "estimatedPrice": 3000,
    "category": "jewelry"
  },
  "styleTips": [
    "Style tip 1",
    "Style tip 2",
    "Style tip 3"
  ],
  "totalCost": 8000
}`;

    const userPrompt = `Create a complete outfit recommendation for:
- Occasion: ${occasion}
- Style preferences: ${preferences || "elegant and traditional"}
- Budget: Rs. ${budget}

Suggest a main outfit and complementary jewelry that work together beautifully.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response
    const recommendations = JSON.parse(aiResponse);

    console.log("Recommendations generated successfully");

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fashion-recommendations:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
