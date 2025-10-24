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
from typing import List, Dict, Any, Tuple
from collections import defaultdict
import heapq
import random

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


class FashionSearchEngine:
    """Advanced search algorithms for fashion recommendations using A* algorithm"""
    
    def __init__(self, products):
        self.products = products
        self.graph = self._build_product_graph()
    
    def _build_product_graph(self):
        """Build product compatibility graph"""
        graph = defaultdict(list)
        
        for product in self.products:
            for other in self.products:
                if product['id'] != other['id']:
                    if self._are_compatible(product, other):
                        weight = self._calculate_compatibility_score(product, other)
                        graph[product['id']].append((other['id'], weight))
        
        return graph
    
    def _are_compatible(self, product1, product2):
        """Check if two products are compatible"""
        if product1['category'] == product2['category']:
            return False
        
        shared_occasions = set([product1['occasion']]) & set([product2['occasion']])
        return len(shared_occasions) > 0
    
    def _calculate_compatibility_score(self, product1, product2):
        """Calculate compatibility score (lower = better)"""
        score = 0
        
        price_diff = abs(product1['price'] - product2['price'])
        score += price_diff / 1000
        
        if (product1['category'] == 'dress' and product2['category'] == 'jewelry') or \
           (product1['category'] == 'jewelry' and product2['category'] == 'dress'):
            score -= 5
        
        return max(score, 0.1)
    
    def a_star_search(self, start_product_id, budget, max_products=3):
        """A* search for optimal outfit combinations"""
        start_product = next((p for p in self.products if p['id'] == start_product_id), None)
        if not start_product:
            return []
        
        open_set = [(0, 0, [start_product])]
        best_combinations = []
        
        while open_set and len(best_combinations) < 5:
            f_score, g_score, path = heapq.heappop(open_set)
            current_product = path[-1]
            
            if len(path) >= max_products:
                best_combinations.append(path)
                continue
            
            for neighbor_id, weight in self.graph.get(current_product['id'], []):
                neighbor = next((p for p in self.products if p['id'] == neighbor_id), None)
                if not neighbor or neighbor in path:
                    continue
                
                new_cost = g_score + neighbor['price']
                if new_cost > budget:
                    continue
                
                new_path = path + [neighbor]
                new_g_score = new_cost
                h_score = self._heuristic(new_path, budget, max_products)
                f_score = new_g_score + h_score
                
                heapq.heappush(open_set, (f_score, new_g_score, new_path))
        
        return best_combinations
    
    def _heuristic(self, current_path, budget, max_products):
        """Heuristic for A* search"""
        remaining_slots = max_products - len(current_path)
        avg_product_price = sum(p['price'] for p in self.products) / len(self.products) if self.products else 0
        return remaining_slots * avg_product_price


class GeneticFashionOptimizer:
    """Genetic algorithm for generating diverse outfit combinations"""
    
    def __init__(self, products, population_size=50, generations=100):
        self.products = products
        self.population_size = population_size
        self.generations = generations
    
    def create_chromosome(self, budget, max_products=4):
        """Create a random outfit chromosome"""
        categories = ['dress', 'jewelry']
        chromosome = []
        total_cost = 0
        
        while len(chromosome) < max_products and total_cost < budget:
            available_products = [
                p for p in self.products 
                if p['category'] in categories and p not in chromosome
            ]
            
            if not available_products:
                break
                
            product = random.choice(available_products)
            if total_cost + product['price'] <= budget:
                chromosome.append(product)
                total_cost += product['price']
                categories.remove(product['category'])
                if not categories:
                    categories = ['dress', 'jewelry']
        
        return chromosome
    
    def fitness_function(self, chromosome):
        """Calculate fitness of an outfit combination"""
        if len(chromosome) < 2:
            return 0
        
        score = 0
        categories = set(p['category'] for p in chromosome)
        score += len(categories) * 10
        
        total_price = sum(p['price'] for p in chromosome)
        budget = 10000
        price_score = max(0, 100 - abs(total_price - budget) / 100)
        score += price_score
        
        occasions = [p['occasion'] for p in chromosome]
        most_common_occasion = max(set(occasions), key=occasions.count)
        occasion_score = occasions.count(most_common_occasion) * 5
        score += occasion_score
        
        return score
    
    def crossover(self, parent1, parent2):
        """Crossover two outfit combinations"""
        if len(parent1) < 2 or len(parent2) < 2:
            return parent1, parent2
        
        crossover_point = random.randint(1, min(len(parent1), len(parent2)) - 1)
        child1 = parent1[:crossover_point] + parent2[crossover_point:]
        child2 = parent2[:crossover_point] + parent1[crossover_point:]
        
        child1 = self._remove_duplicates(child1)
        child2 = self._remove_duplicates(child2)
        
        return child1, child2
    
    def mutate(self, chromosome, mutation_rate=0.1):
        """Mutate an outfit combination"""
        if random.random() < mutation_rate and len(chromosome) > 1:
            index = random.randint(0, len(chromosome) - 1)
            category = chromosome[index]['category']
            
            alternatives = [
                p for p in self.products 
                if p['category'] == category and p not in chromosome
            ]
            
            if alternatives:
                chromosome[index] = random.choice(alternatives)
        
        return chromosome
    
    def _remove_duplicates(self, chromosome):
        """Remove duplicate products from chromosome"""
        seen = set()
        unique_chromosome = []
        
        for product in chromosome:
            if product['id'] not in seen:
                seen.add(product['id'])
                unique_chromosome.append(product)
        
        return unique_chromosome
    
    def evolve_outfits(self, budget=10000, max_products=4):
        """Evolve population to find best outfit combinations"""
        population = [
            self.create_chromosome(budget, max_products) 
            for _ in range(self.population_size)
        ]
        
        for generation in range(self.generations):
            fitness_scores = [self.fitness_function(chromo) for chromo in population]
            
            parents = []
            for _ in range(self.population_size):
                tournament = random.sample(
                    list(zip(population, fitness_scores)), 
                    min(3, len(population))
                )
                winner = max(tournament, key=lambda x: x[1])[0]
                parents.append(winner)
            
            new_population = []
            for i in range(0, len(parents), 2):
                parent1, parent2 = parents[i], parents[i+1] if i+1 < len(parents) else parents[0]
                child1, child2 = self.crossover(parent1, parent2)
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)
                new_population.extend([child1, child2])
            
            population = new_population[:self.population_size]
        
        fitness_scores = [self.fitness_function(chromo) for chromo in population]
        best_outfits = sorted(zip(population, fitness_scores), key=lambda x: x[1], reverse=True)[:5]
        
        return [outfit for outfit, score in best_outfits]


# Initialize AI assistant and search engines
ai_assistant = AIFashionAssistant()
search_engine = None
genetic_optimizer = None


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


@app.route('/api/advanced-recommendations', methods=['POST', 'OPTIONS'])
def advanced_recommendations():
    """Advanced recommendations using A* search and genetic algorithms"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        budget = data.get('budget', 10000)
        style = data.get('style', 'traditional')
        occasion = data.get('occasion', 'wedding')
        
        products = get_products()[0].json
        filtered_products = [
            p for p in products 
            if p['occasion'] == occasion
        ]
        
        if not filtered_products:
            filtered_products = products
        
        # Initialize engines with filtered products
        temp_search_engine = FashionSearchEngine(filtered_products)
        temp_genetic_optimizer = GeneticFashionOptimizer(filtered_products)
        
        search_results = []
        genetic_results = []
        
        if filtered_products:
            start_product = filtered_products[0]
            search_results = temp_search_engine.a_star_search(start_product['id'], budget)
            genetic_results = temp_genetic_optimizer.evolve_outfits(budget)
        
        return jsonify({
            'searchBased': search_results[:3],
            'geneticBased': genetic_results[:3],
            'budget': budget,
            'occasion': occasion
        }), 200
        
    except Exception as e:
        print(f"Error in advanced recommendations: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/outfit-analyzer', methods=['POST', 'OPTIONS'])
def outfit_analyzer():
    """Analyze outfit compatibility using expert system rules"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.json
        products = data.get('products', [])
        
        if not products:
            return jsonify({"error": "No products provided"}), 400
        
        total_price = sum(p.get('price', 0) for p in products)
        categories = set(p.get('category') for p in products)
        
        # Calculate compatibility score
        compatibility_score = 60
        if len(categories) > 1:
            compatibility_score += 15
        if total_price < 15000:
            compatibility_score += 10
        if len(products) >= 2:
            compatibility_score += 10
        
        analysis = {
            'compatibilityScore': min(compatibility_score, 95),
            'styleCoherence': 'High' if len(products) > 1 else 'Low',
            'priceBalance': 'Good' if total_price < 15000 else 'High',
            'totalCost': total_price,
            'improvementTips': [
                "Consider adding statement jewelry" if 'jewelry' not in categories else "Jewelry complements the outfit well",
                "The color palette works well together",
                "Good mix of traditional and contemporary elements"
            ]
        }
        
        return jsonify(analysis), 200
        
    except Exception as e:
        print(f"Error in outfit analyzer: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "ZarqaaCloset AI Enhanced"}), 200


if __name__ == '__main__':
    print("🤖 ZarqaaCloset AI Fashion Assistant - Enhanced Version")
    print("=" * 60)
    print("Advanced Features:")
    print("  ✅ A* Search for optimal outfit building")
    print("  ✅ Genetic Algorithm for diverse recommendations")
    print("  ✅ Expert System rules for fashion analysis")
    print("=" * 60)
    print("Endpoints:")
    print("  POST /api/fashion-chat - AI fashion chat")
    print("  POST /api/fashion-recommendations - Get style recommendations")
    print("  POST /api/advanced-recommendations - AI-powered outfit suggestions")
    print("  POST /api/outfit-analyzer - Expert outfit analysis")
    print("  GET  /api/products - List products")
    print("  GET  /health - Health check")
    print("=" * 60)
    print(f"Lovable AI Gateway: {AI_GATEWAY_URL}")
    print("Model: google/gemini-2.5-flash")
    print("=" * 60)
    
    # Initialize search engines with products
    products = get_products()[0].json
    search_engine = FashionSearchEngine(products)
    genetic_optimizer = GeneticFashionOptimizer(products)
    
    print("✅ Search engines initialized with product data")
    print("=" * 60)
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
