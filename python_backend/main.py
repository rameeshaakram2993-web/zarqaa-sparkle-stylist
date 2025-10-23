"""
ZarqaaCloset AI Fashion Assistant - Python Backend
This is a standalone Python implementation for reference.

Note: The actual Lovable project uses TypeScript edge functions.
This Python code is provided as a reference implementation.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import requests
from typing import List, Dict, Any

app = Flask(__name__)
CORS(app)

# Configuration
LOVABLE_API_KEY = os.getenv('LOVABLE_API_KEY', 'your-api-key-here')
AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions"

# FAQ Knowledge Base (from uploaded PDF)
FAQ_KNOWLEDGE = """
Orders & Payments:
- Payment methods: Debit/credit cards, bank transfers, Cash on Delivery (COD)
- All payments are SSL encrypted
- Changes/cancellations possible only if order hasn't shipped

Shipping & Delivery:
- Deliver all over Pakistan
- Processing: 1-2 business days
- Delivery: 3-5 business days for major cities
- Tracking code provided via SMS/email

Sizing & Fit:
- Detailed size charts on each product page
- If between sizes, recommend going larger
- Exchange available for wrong fit within 7 days

Returns & Exchanges:
- Return/exchange unworn items with tags within 7 days
- Must be in original condition
- Sale items may not qualify
"""


class AIFashionAssistant:
    """AI-powered fashion assistant using Lovable AI Gateway"""
    
    def __init__(self):
        self.api_key = LOVABLE_API_KEY
        self.gateway_url = AI_GATEWAY_URL
    
    def chat_response(self, message: str, conversation_history: List[Dict] = None) -> Dict[str, Any]:
        """
        Get AI response for fashion queries
        
        Args:
            message: User's message
            conversation_history: Previous conversation messages
            
        Returns:
            Dictionary with AI response
        """
        if conversation_history is None:
            conversation_history = []
        
        system_prompt = f"""You are ZarqaaCloset's AI fashion assistant specializing in eastern wear and jewelry.

Key Information:
{FAQ_KNOWLEDGE}

When customers ask about:
1. Fashion advice - Provide style recommendations
2. Product details - Describe eastern wear and jewelry collection
3. Occasions - Suggest appropriate outfits
4. Care instructions - Advise on garment care
5. Shipping/Returns - Use FAQ information

Be warm, helpful, and enthusiastic about fashion."""

        messages = [
            {"role": "system", "content": system_prompt},
            *conversation_history,
            {"role": "user", "content": message}
        ]
        
        try:
            response = requests.post(
                self.gateway_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "google/gemini-2.5-flash",
                    "messages": messages,
                    "stream": False
                }
            )
            
            if response.status_code == 429:
                return {"error": "Rate limit exceeded. Please try again later.", "status": 429}
            
            response.raise_for_status()
            data = response.json()
            
            return {
                "response": data['choices'][0]['message']['content'],
                "status": 200
            }
            
        except requests.exceptions.RequestException as e:
            print(f"Error calling AI Gateway: {e}")
            return {"error": str(e), "status": 500}
    
    def get_style_recommendations(self, occasion: str, preferences: str, budget: int) -> Dict[str, Any]:
        """
        Get AI style recommendations for complete outfit
        
        Args:
            occasion: Event type (wedding, party, casual, formal)
            preferences: Style preferences
            budget: Budget in Rs.
            
        Returns:
            Dictionary with outfit and jewelry recommendations
        """
        system_prompt = """You are an expert AI fashion stylist for ZarqaaCloset.

Create a complete outfit recommendation. Respond ONLY with JSON:
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
}"""

        user_prompt = f"""Create outfit recommendation for:
- Occasion: {occasion}
- Style: {preferences or 'elegant and traditional'}
- Budget: Rs. {budget}

Suggest main outfit and jewelry that work together."""

        try:
            response = requests.post(
                self.gateway_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "google/gemini-2.5-flash",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "stream": False
                }
            )
            
            response.raise_for_status()
            data = response.json()
            ai_response = data['choices'][0]['message']['content']
            
            # Remove markdown code blocks if present
            ai_response = ai_response.replace('```json', '').replace('```', '').strip()
            
            recommendations = json.loads(ai_response)
            return recommendations
            
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            return {"error": str(e), "status": 500}


# Initialize AI assistant
ai_assistant = AIFashionAssistant()


@app.route('/api/fashion-chat', methods=['POST', 'OPTIONS'])
def fashion_chat():
    """Fashion chat endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        message = data.get('message', '')
        conversation_history = data.get('conversationHistory', [])
        
        result = ai_assistant.chat_response(message, conversation_history)
        
        if result.get('status') != 200:
            return jsonify(result), result.get('status', 500)
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in fashion-chat: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/fashion-recommendations', methods=['POST', 'OPTIONS'])
def fashion_recommendations():
    """Fashion recommendations endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        occasion = data.get('occasion', 'wedding')
        preferences = data.get('preferences', '')
        budget = data.get('budget', 5000)
        
        recommendations = ai_assistant.get_style_recommendations(
            occasion, preferences, budget
        )
        
        if 'error' in recommendations:
            return jsonify(recommendations), recommendations.get('status', 500)
        
        return jsonify(recommendations), 200
        
    except Exception as e:
        print(f"Error in fashion-recommendations: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/products', methods=['GET'])
def get_products():
    """
    Get products from database
    
    Note: In production, this would connect to your database.
    This is a mock implementation.
    """
    products = [
        {
            "id": "1",
            "name": "Embroidered Lawn Suit",
            "description": "Elegant burgundy lawn suit with intricate gold embroidery",
            "price": 4500,
            "category": "dress",
            "occasion": "wedding",
            "image_url": "/assets/product-1.jpg"
        },
        {
            "id": "2",
            "name": "Kundan Jewelry Set",
            "description": "Luxurious kundan necklace and earrings set",
            "price": 8500,
            "category": "jewelry",
            "occasion": "bridal",
            "image_url": "/assets/product-2.jpg"
        },
        {
            "id": "3",
            "name": "Silk Saree",
            "description": "Beautiful silk saree in deep burgundy with gold border",
            "price": 6500,
            "category": "dress",
            "occasion": "formal",
            "image_url": "/assets/product-3.jpg"
        },
        {
            "id": "4",
            "name": "Traditional Earrings",
            "description": "Gold-plated kundan earrings with pearl drops",
            "price": 2500,
            "category": "jewelry",
            "occasion": "party",
            "image_url": "/assets/product-4.jpg"
        },
        {
            "id": "5",
            "name": "Designer Kurta",
            "description": "Modern designer kurta in burgundy with gold embroidery",
            "price": 3500,
            "category": "dress",
            "occasion": "casual",
            "image_url": "/assets/product-5.jpg"
        },
        {
            "id": "6",
            "name": "Bridal Necklace",
            "description": "Stunning bridal necklace set with kundan and pearls",
            "price": 12000,
            "category": "jewelry",
            "occasion": "bridal",
            "image_url": "/assets/product-6.jpg"
        }
    ]
    
    return jsonify(products), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "ZarqaaCloset AI"}), 200


if __name__ == '__main__':
    print("🤖 ZarqaaCloset AI Fashion Assistant - Python Backend")
    print("=" * 60)
    print("Endpoints:")
    print("  POST /api/fashion-chat - AI fashion chat")
    print("  POST /api/fashion-recommendations - Get style recommendations")
    print("  GET  /api/products - List products")
    print("  GET  /health - Health check")
    print("=" * 60)
    print(f"Lovable AI Gateway: {AI_GATEWAY_URL}")
    print("Model: google/gemini-2.5-flash")
    print("=" * 60)
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
