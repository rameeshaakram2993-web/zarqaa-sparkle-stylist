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

    // Comprehensive FAQ knowledge base from FAQs.pdf
    const faqKnowledge = `
## ORDERS & PAYMENTS
- How to place an order: Browse collection, select item, choose size/variant, click "Add to Cart", proceed to checkout, fill shipping details, choose payment method, confirm order. You'll receive confirmation email/SMS.
- Payment methods: Debit/credit cards (Visa, MasterCard), online bank transfers, Cash on Delivery (COD) if available in your area. All payments secured with SSL encryption.
- Payment security: Industry-standard SSL encryption on checkout. Card/bank details never stored in plain text. We comply with payment-gateway security protocols.
- Cancel/modify order: Only possible if order hasn't shipped. Contact customer support ASAP with order number. If in transit, use return/exchange process after delivery.

## SHIPPING & DELIVERY
- Delivery coverage: All over Pakistan. International shipping may be available - check "Shipping & Delivery" page.
- Delivery time: Processing 1-2 business days. Major cities: 3-5 business days. Remote areas may take longer. Expedited shipping available.
- Track order: You'll receive tracking code via SMS/email when dispatched. Use courier website or "Track Order" page.
- Lost/damaged package: Don't accept damaged packages or have courier note damage. Contact us immediately with photos and order details.

## SIZING & FIT
- What size to order: Check detailed size chart on product page (bust, waist, hips, length in inches/cm). Between sizes? Go larger for comfort. Fabric type affects fit.
- True to size: Generally yes, but styles vary (fitted vs relaxed). Always check size guide and product description.
- Wrong fit: May be eligible for exchange (subject to condition). Follow exchange instructions promptly.

## RETURNS & EXCHANGES
- Return policy: Return/exchange unworn, unwashed items with tags intact within 7 days of delivery. Sale/"Final Sale" items may not qualify.
- How to initiate: Visit "Returns & Exchanges" page or contact support with order number, item, and reason. Items must be repackaged and shipped back within timeframe.
- Return shipping: Customer pays unless item is defective or wrong. Exchanges may be free.
- Refund timing: Processed after we receive and inspect returned item meeting our criteria.

## PRODUCT & QUALITY
- Manufacturing: Designed and manufactured in Pakistan with vetted factories/partners ensuring quality and ethical production.
- Fabrics: Premium cotton lawn, chiffon, linen, silk blends, high-quality synthetics. Fabric composition listed on product page.
- Restocking: Popular styles restocked based on demand. Use "Notify Me" button for alerts.
- Care instructions: Each item has care label (machine wash cold, gentle cycle, hang-dry, iron low). Delicate fabrics (silk, chiffon): hand-wash or dry-clean.

## DISCOUNTS & PROMOTIONS
- Discounts: Seasonal sales, newsletter promo codes, first-time customer offers. Check homepage, newsletter, social media.
- Using discount codes: Enter code exactly at checkout in "Promo Code" field. One code per order unless specified.
- Gift cards: Digital gift cards available via email. Gift wrapping available at checkout (small fee or free above threshold).

## ACCOUNT, PRIVACY & SECURITY
- Account: Optional - track orders, save addresses, view purchases, manage returns. Guest checkout also available.
- Privacy: Personal data used only for order processing. Not shared with third parties for marketing without opt-in. See Privacy Policy page.
- Marketing emails: Only if you opt-in. Unsubscribe via email link or account preferences.

## CONTACT & SUPPORT
- Contact methods: Live chat (during support hours), Email: support@ZarqaaCloset.com, WhatsApp/Phone: 0333-5119087
- Support hours: Monday to Saturday, 9:00 AM to 8:00 PM (local time). Response within 24 hours.

## SUSTAINABILITY
- Ethical production: Fabrics from trusted suppliers, manufacturing partners follow labor standards, minimize waste and packaging. See "About Us" or "Sustainability" page.
- Wholesale: Contact wholesale@ZarqaaCloset.com for bulk/corporate purchases with custom pricing.
`;

    const systemPrompt = `You are ZarqaaCloset's AI FAQ assistant specializing in eastern wear and jewelry.

Use this FAQ knowledge base to answer customer questions accurately:
${faqKnowledge}

Guidelines:
1. Answer questions directly using the FAQ information above
2. Be warm, helpful, and professional
3. Keep responses concise but complete
4. If a question isn't covered in the FAQ, politely direct them to contact support
5. For fashion advice, you can also provide style recommendations for eastern wear
6. Always mention specific contact details when relevant (email: support@ZarqaaCloset.com, WhatsApp: 0333-5119087)`;

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
