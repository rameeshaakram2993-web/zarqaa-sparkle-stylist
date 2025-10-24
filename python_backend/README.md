# ZarqaaCloset Python Backend

This is a **reference implementation** of the ZarqaaCloset AI Fashion Assistant in Python. 

**Note:** The actual Lovable project uses TypeScript edge functions (already deployed). This Python code is provided as an alternative backend if you want to run it separately.

## Features

- ✅ AI Fashion Chat using Lovable AI Gateway
- ✅ Style Recommendations (occasion-based)
- ✅ **Advanced A* Search Algorithm** for optimal outfit combinations
- ✅ **Genetic Algorithm** for diverse outfit generation
- ✅ **Expert System** for outfit compatibility analysis
- ✅ FAQ Knowledge from your uploaded PDF
- ✅ Products API endpoint

## Setup

### 1. Install Dependencies

```bash
cd python_backend
pip install -r requirements.txt
```

### 2. Set Environment Variables

Create a `.env` file:

```bash
LOVABLE_API_KEY=your-lovable-api-key-here
```

### 3. Run the Server

```bash
python main.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Fashion Chat
```bash
POST /api/fashion-chat
Content-Type: application/json

{
  "message": "What should I wear to a wedding?",
  "conversationHistory": []
}
```

### 2. Style Recommendations
```bash
POST /api/fashion-recommendations
Content-Type: application/json

{
  "occasion": "wedding",
  "preferences": "traditional elegant",
  "budget": 10000
}
```

### 3. Advanced Recommendations (A* + Genetic Algorithm)
```bash
POST /api/advanced-recommendations
Content-Type: application/json

{
  "occasion": "wedding",
  "style": "traditional elegant",
  "budget": 15000
}
```

### 4. Outfit Analyzer (Expert System)
```bash
POST /api/outfit-analyzer
Content-Type: application/json

{
  "products": [
    {"id": "1", "name": "Embroidered Suit", "price": 4500, "category": "dress"},
    {"id": "2", "name": "Kundan Set", "price": 8500, "category": "jewelry"}
  ]
}
```

### 5. Get Products
```bash
GET /api/products
```

### 6. Health Check
```bash
GET /health
```

## Advanced Algorithms

### A* Search Algorithm
- Builds a product compatibility graph
- Uses A* pathfinding to find optimal outfit combinations
- Considers budget constraints and product compatibility
- Returns top 5 best combinations

### Genetic Algorithm
- Creates diverse outfit combinations through evolution
- Uses fitness function to evaluate outfit quality
- Implements crossover and mutation for variety
- Population-based approach for multiple solutions

### Expert System
- Rule-based outfit compatibility analysis
- Evaluates style coherence and price balance
- Provides actionable improvement tips
- Calculates compatibility scores

## Integration with Lovable Project

Your Lovable project is already using the TypeScript edge functions which work the same way. This Python implementation is just for reference or if you want to:

1. Run a separate Python backend with advanced AI algorithms
2. Customize the backend logic
3. Add additional Python-specific features
4. Experiment with A* search and genetic algorithms

## FAQ Knowledge

The FAQ responses are embedded in the system prompt from your uploaded PDF, including:
- Orders & Payments information
- Shipping & Delivery details
- Sizing & Fit guidelines
- Returns & Exchanges policy

## Database Connection

To connect to a real database (PostgreSQL, MySQL, etc.), update the `get_products()` function in `main.py` to use your database connection.

Example with PostgreSQL:
```python
import psycopg2

def get_products():
    conn = psycopg2.connect(
        host="your-db-host",
        database="your-db-name",
        user="your-username",
        password="your-password"
    )
    cur = conn.cursor()
    cur.execute("SELECT * FROM products")
    products = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(products)
```

## Notes

- The Python backend uses the **same Lovable AI Gateway** as the TypeScript version
- All AI responses come from `google/gemini-2.5-flash` model
- CORS is enabled for local development
- For production, add proper authentication and security measures
