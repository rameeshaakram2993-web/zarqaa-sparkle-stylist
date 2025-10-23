const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Fashion chat request received:", message);

    // System prompt with FAQ knowledge
    const systemPrompt = `You are ZarqaaCloset's AI fashion assistant specializing in eastern wear and jewelry. 

Key Information:
- Orders & Payments: We accept debit/credit cards, bank transfers, and Cash on Delivery (COD). All payments are SSL encrypted.
- Shipping: We deliver all over Pakistan. Standard processing is 1-2 business days. Delivery takes 3-5 business days for major cities.
- Sizing: Check our detailed size charts on product pages. If between sizes, we recommend going larger for comfort.
- Returns: Return or exchange unworn items with tags within 7 days of delivery. Sale items may not qualify.
- Customer Support: Available for any questions about orders, sizing, or products.

When customers ask about:
1. Fashion advice - Provide style recommendations based on occasion and preferences
2. Product details - Describe our eastern wear collection (suits, sarees, kurtas) and jewelry (kundan, traditional earrings, necklaces)
3. Occasions - Suggest appropriate outfits for weddings, parties, casual, or formal events
4. Care instructions - Advise on caring for embroidered and silk garments
5. Shipping/Returns - Use the FAQ information above

Be warm, helpful, and enthusiastic about fashion. Keep responses concise and actionable.`;

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
          ...conversationHistory,
          { role: "user", content: message },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fashion-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
