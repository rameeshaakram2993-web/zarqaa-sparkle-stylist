import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// A* SEARCH ALGORITHM
// Finds optimal outfit combinations efficiently
// ============================================
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  occasion: string;
}

interface SearchNode {
  outfit: Product | null;
  jewelry: Product | null;
  gScore: number; // Cost from start
  hScore: number; // Heuristic estimate to goal
  fScore: number; // Total score (gScore + hScore)
}

function aStarSearch(
  outfits: Product[],
  jewelry: Product[],
  budget: number,
  targetOccasion: string,
  preferences: string = ""
): { outfit: Product | null; jewelry: Product | null; score: number } {
  console.log("🔍 A* Search: Finding optimal combination for occasion:", targetOccasion, "preferences:", preferences);
  console.log("📊 Searching through", outfits.length, "outfits and", jewelry.length, "jewelry items");
  
  const openSet: SearchNode[] = [];
  let bestNode: SearchNode = { outfit: null, jewelry: null, gScore: Infinity, hScore: Infinity, fScore: Infinity };
  
  // Parse preferences into keywords for matching
  const preferenceKeywords = preferences.toLowerCase().split(/[\s,]+/).filter(k => k.length > 2);
  
  // Occasion priority mapping (higher = more formal, should spend more)
  const occasionPriority: Record<string, number> = {
    'wedding': 1.0,
    'formal': 0.9,
    'party': 0.7,
    'casual': 0.4,
    'traditional': 0.8,
    'festive': 0.85
  };
  
  const targetPriority = occasionPriority[targetOccasion] || 0.5;
  
  // Generate all possible combinations as nodes
  for (const outfit of outfits) {
    for (const jewel of jewelry) {
      const totalCost = outfit.price + jewel.price;
      
      // Skip if over budget
      if (totalCost > budget) continue;
      
      // ========================================
      // IMPROVED SCORING: Style-first approach
      // ========================================
      
      // 1. OCCASION MATCHING (Primary factor - 40% weight)
      let occasionScore = 0;
      const outfitOccasionMatch = outfit.occasion?.toLowerCase() === targetOccasion.toLowerCase();
      const jewelryOccasionMatch = jewel.occasion?.toLowerCase() === targetOccasion.toLowerCase();
      
      if (outfitOccasionMatch) occasionScore += 0.25;  // Strong bonus for outfit match
      if (jewelryOccasionMatch) occasionScore += 0.15; // Good bonus for jewelry match
      if (outfitOccasionMatch && jewelryOccasionMatch) occasionScore += 0.10; // Coordination bonus
      
      // 2. PREFERENCE MATCHING (Secondary factor - 25% weight)
      let preferenceScore = 0;
      if (preferenceKeywords.length > 0) {
        const outfitText = `${outfit.name} ${outfit.description || ''}`.toLowerCase();
        const jewelryText = `${jewel.name} ${jewel.description || ''}`.toLowerCase();
        
        for (const keyword of preferenceKeywords) {
          if (outfitText.includes(keyword)) preferenceScore += 0.08;
          if (jewelryText.includes(keyword)) preferenceScore += 0.05;
        }
        // Cap preference bonus
        preferenceScore = Math.min(preferenceScore, 0.25);
      }
      
      // 3. BUDGET UTILIZATION (Tertiary factor - 20% weight)
      // For formal occasions, prefer utilizing MORE budget for quality
      // For casual, being economical is fine
      const budgetUtilization = totalCost / budget;
      let budgetScore = 0;
      
      if (targetPriority >= 0.7) {
        // Formal/Wedding: Reward higher budget utilization (quality matters)
        if (budgetUtilization >= 0.7 && budgetUtilization <= 0.95) {
          budgetScore = 0.20;
        } else if (budgetUtilization >= 0.5 && budgetUtilization < 0.7) {
          budgetScore = 0.12;
        } else if (budgetUtilization >= 0.3 && budgetUtilization < 0.5) {
          budgetScore = 0.05;
        }
      } else {
        // Casual: More flexible budget utilization
        if (budgetUtilization >= 0.4 && budgetUtilization <= 0.85) {
          budgetScore = 0.18;
        } else if (budgetUtilization >= 0.25 && budgetUtilization < 0.4) {
          budgetScore = 0.12;
        }
      }
      
      // 4. COORDINATION & QUALITY (15% weight)
      let coordinationScore = 0;
      
      // Price balance between items (avoid cheap jewelry with expensive dress or vice versa)
      const priceRatio = Math.min(outfit.price, jewel.price) / Math.max(outfit.price, jewel.price);
      if (priceRatio >= 0.3 && priceRatio <= 0.8) {
        coordinationScore += 0.10; // Well-balanced investment
      }
      
      // Category coordination
      if (outfit.category === "dress" && jewel.category === "jewelry") {
        coordinationScore += 0.05;
      }
      
      // ========================================
      // CALCULATE FINAL SCORE
      // ========================================
      // Higher score = better (we invert for A* which minimizes)
      const totalBenefit = occasionScore + preferenceScore + budgetScore + coordinationScore;
      
      // g-score: Inverted benefit (A* minimizes, so lower = better)
      const gScore = 1 - totalBenefit;
      
      // h-score: Small cost efficiency factor (secondary consideration)
      // Only slightly penalize very cheap options for formal occasions
      let hScore = 0;
      if (targetPriority >= 0.7 && budgetUtilization < 0.3) {
        hScore = 0.15; // Small penalty for too cheap on formal occasions
      }
      
      const fScore = gScore + hScore;
      
      const node: SearchNode = { outfit, jewelry: jewel, gScore, hScore, fScore };
      openSet.push(node);
      
      // Log top candidates for debugging
      if (outfitOccasionMatch && jewelryOccasionMatch) {
        console.log(`  🎯 Match: ${outfit.name} + ${jewel.name} | Occasion: ✓ | Score: ${(1-fScore).toFixed(3)} | Cost: Rs.${totalCost}`);
      }
    }
  }
  
  // Sort by fScore (lower is better in A*)
  openSet.sort((a, b) => a.fScore - b.fScore);
  
  if (openSet.length > 0) {
    bestNode = openSet[0];
    console.log("✅ A* Search complete. Best combination:", bestNode.outfit?.name, "+", bestNode.jewelry?.name);
    console.log("   Final Score:", (1 - bestNode.fScore).toFixed(3), "| Cost: Rs.", (bestNode.outfit?.price || 0) + (bestNode.jewelry?.price || 0));
  } else {
    console.log("⚠️ A* Search: No valid combinations found within budget");
  }
  
  return {
    outfit: bestNode.outfit,
    jewelry: bestNode.jewelry,
    score: bestNode.fScore
  };
}

// ============================================
// GENETIC ALGORITHM
// Evolves creative outfit combinations
// ============================================
interface Chromosome {
  outfitIndex: number;
  jewelryIndex: number;
  fitness: number;
}

function geneticAlgorithm(
  outfits: Product[],
  jewelry: Product[],
  budget: number,
  targetOccasion: string,
  generations: number = 20,
  populationSize: number = 50
): { outfit: Product | null; jewelry: Product | null; fitness: number } {
  console.log("🧬 Genetic Algorithm: Evolving", populationSize, "individuals over", generations, "generations");
  
  if (outfits.length === 0 || jewelry.length === 0) {
    return { outfit: null, jewelry: null, fitness: 0 };
  }
  
  // Pre-filter valid combinations that are within budget
  const validPairs: Array<{ outfitIndex: number; jewelryIndex: number }> = [];
  for (let oi = 0; oi < outfits.length; oi++) {
    for (let ji = 0; ji < jewelry.length; ji++) {
      if (outfits[oi].price + jewelry[ji].price <= budget) {
        validPairs.push({ outfitIndex: oi, jewelryIndex: ji });
      }
    }
  }
  
  // If no valid pairs exist within budget, return null
  if (validPairs.length === 0) {
    console.log("⚠️ No valid combinations within budget of", budget);
    return { outfit: null, jewelry: null, fitness: 0 };
  }
  
  console.log("📊 Found", validPairs.length, "valid combinations within budget");
  
  // Fitness function
  const calculateFitness = (chromosome: { outfitIndex: number; jewelryIndex: number }): number => {
    const outfit = outfits[chromosome.outfitIndex];
    const jewel = jewelry[chromosome.jewelryIndex];
    const totalCost = outfit.price + jewel.price;
    
    if (totalCost > budget) return 0; // Invalid - over budget
    
    let fitness = 100;
    
    // Occasion matching bonus
    if (outfit.occasion === targetOccasion) fitness += 30;
    if (jewel.occasion === targetOccasion) fitness += 20;
    
    // Budget efficiency (prefer good value)
    const budgetRatio = totalCost / budget;
    if (budgetRatio >= 0.5 && budgetRatio <= 0.9) {
      fitness += 25 * budgetRatio;
    }
    
    // Diversity bonus (different categories = good coordination)
    if (outfit.category !== jewel.category) fitness += 15;
    
    // Price balance bonus
    const priceRatio = Math.min(outfit.price, jewel.price) / Math.max(outfit.price, jewel.price);
    fitness += priceRatio * 10;
    
    return fitness;
  };
  
  // Initialize population from valid pairs only
  let population: Array<{ outfitIndex: number; jewelryIndex: number; fitness: number }> = [];
  for (let i = 0; i < populationSize; i++) {
    const randomPair = validPairs[Math.floor(Math.random() * validPairs.length)];
    const chromosome = {
      outfitIndex: randomPair.outfitIndex,
      jewelryIndex: randomPair.jewelryIndex,
      fitness: 0
    };
    chromosome.fitness = calculateFitness(chromosome);
    population.push(chromosome);
  }
  
  // Evolution loop
  for (let gen = 0; gen < generations; gen++) {
    // Selection: Tournament selection
    const newPopulation: typeof population = [];
    
    while (newPopulation.length < populationSize) {
      // Tournament selection
      const tournament = [];
      for (let t = 0; t < 3; t++) {
        tournament.push(population[Math.floor(Math.random() * population.length)]);
      }
      const parent1 = tournament.reduce((a, b) => a.fitness > b.fitness ? a : b);
      
      const tournament2 = [];
      for (let t = 0; t < 3; t++) {
        tournament2.push(population[Math.floor(Math.random() * population.length)]);
      }
      const parent2 = tournament2.reduce((a, b) => a.fitness > b.fitness ? a : b);
      
      // Crossover - but ensure result is valid
      let child = {
        outfitIndex: Math.random() > 0.5 ? parent1.outfitIndex : parent2.outfitIndex,
        jewelryIndex: Math.random() > 0.5 ? parent1.jewelryIndex : parent2.jewelryIndex,
        fitness: 0
      };
      
      // Check if crossover result is valid, if not pick from valid pairs
      if (outfits[child.outfitIndex].price + jewelry[child.jewelryIndex].price > budget) {
        const randomPair = validPairs[Math.floor(Math.random() * validPairs.length)];
        child.outfitIndex = randomPair.outfitIndex;
        child.jewelryIndex = randomPair.jewelryIndex;
      }
      
      // Mutation (10% chance) - but stay within valid pairs
      if (Math.random() < 0.1) {
        const randomPair = validPairs[Math.floor(Math.random() * validPairs.length)];
        child.outfitIndex = randomPair.outfitIndex;
        child.jewelryIndex = randomPair.jewelryIndex;
      }
      
      child.fitness = calculateFitness(child);
      newPopulation.push(child);
    }
    
    population = newPopulation;
  }
  
  // Find best individual
  const best = population.reduce((a, b) => a.fitness > b.fitness ? a : b);
  
  console.log("✅ Genetic Algorithm complete. Best fitness:", best.fitness.toFixed(2));
  
  return {
    outfit: outfits[best.outfitIndex],
    jewelry: jewelry[best.jewelryIndex],
    fitness: best.fitness
  };
}

// ============================================
// EXPERT SYSTEM
// Rule-based fashion validation and tips
// ============================================
interface StyleRule {
  name: string;
  condition: (outfit: Product, jewelry: Product, occasion: string) => boolean;
  tip: string;
  weight: number;
}

function expertSystem(
  outfit: Product | null,
  jewelry: Product | null,
  occasion: string
): { score: number; tips: string[]; validationPassed: boolean } {
  console.log("📚 Expert System: Validating outfit combination");
  
  if (!outfit || !jewelry) {
    return { score: 0, tips: ["No products available for this criteria"], validationPassed: false };
  }
  
  const rules: StyleRule[] = [
    {
      name: "Occasion Match - Outfit",
      condition: (o, j, occ) => o.occasion === occ,
      tip: "✓ Outfit perfectly matches the occasion",
      weight: 25
    },
    {
      name: "Occasion Match - Jewelry",
      condition: (o, j, occ) => j.occasion === occ,
      tip: "✓ Jewelry complements the occasion beautifully",
      weight: 20
    },
    {
      name: "Budget Balance",
      condition: (o, j, occ) => {
        const ratio = o.price / j.price;
        return ratio >= 0.5 && ratio <= 3;
      },
      tip: "✓ Well-balanced investment between outfit and jewelry",
      weight: 15
    },
    {
      name: "Category Coordination",
      condition: (o, j, occ) => o.category === "dress" && j.category === "jewelry",
      tip: "✓ Classic dress and jewelry pairing for maximum elegance",
      weight: 15
    },
    {
      name: "Formal Occasion Rule",
      condition: (o, j, occ) => {
        if (occ === "wedding" || occ === "formal") {
          return o.price >= 4000 && j.price >= 2000;
        }
        return true;
      },
      tip: "✓ Premium pieces selected for formal occasion",
      weight: 10
    },
    {
      name: "Casual Balance",
      condition: (o, j, occ) => {
        if (occ === "casual") {
          return o.price <= 5000;
        }
        return true;
      },
      tip: "✓ Appropriately styled for casual wear",
      weight: 10
    }
  ];
  
  let totalScore = 0;
  const tips: string[] = [];
  let rulesPassed = 0;
  
  for (const rule of rules) {
    if (rule.condition(outfit, jewelry, occasion)) {
      totalScore += rule.weight;
      tips.push(rule.tip);
      rulesPassed++;
    }
  }
  
  // Add dynamic tips based on combination
  if (outfit.occasion === jewelry.occasion) {
    tips.push("✓ Perfectly coordinated occasion styling");
    totalScore += 5;
  }
  
  // Add styling recommendations
  tips.push(`💡 Pair with ${occasion === "wedding" ? "traditional clutch and heels" : "complementary accessories"}`);
  tips.push(`💡 Consider ${occasion === "formal" ? "elegant updo hairstyle" : "natural flowing hair"} to complete the look`);
  
  const validationPassed = rulesPassed >= 3;
  
  console.log("✅ Expert System complete. Score:", totalScore, "Rules passed:", rulesPassed);
  
  return { score: totalScore, tips, validationPassed };
}

// ============================================
// MAIN HANDLER
// ============================================
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { occasion, preferences, budget } = await req.json();
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log("🎯 Fashion Recommendation Request:", { occasion, preferences, budget });
    console.log("============================================");

    // Fetch products from database
    const { data: products, error } = await supabase
      .from("products")
      .select("*");
    
    if (error) throw error;
    
    // Separate outfits and jewelry
    const outfits = products.filter((p: Product) => p.category === "dress");
    const jewelry = products.filter((p: Product) => p.category === "jewelry");
    
    console.log("📦 Products loaded:", outfits.length, "outfits,", jewelry.length, "jewelry items");

    // ============================================
    // RUN ALL THREE ALGORITHMS
    // ============================================
    
    // 1. A* Search - Find optimal combination
    console.log("\n--- Running A* Search Algorithm ---");
    const aStarResult = aStarSearch(outfits, jewelry, budget, occasion, preferences);
    
    // 2. Genetic Algorithm - Evolve creative combinations
    console.log("\n--- Running Genetic Algorithm ---");
    const geneticResult = geneticAlgorithm(outfits, jewelry, budget, occasion);
    
    // 3. Expert System - Validate and generate tips
    console.log("\n--- Running Expert System ---");
    
    // Choose best result (prefer A* for optimal, fallback to genetic for creativity)
    const selectedOutfit = aStarResult.outfit || geneticResult.outfit;
    const selectedJewelry = aStarResult.jewelry || geneticResult.jewelry;
    
    // If no valid combination found within budget, return style tips only
    if (!selectedOutfit || !selectedJewelry) {
      console.log("⚠️ No products available within budget of", budget);
      
      return new Response(
        JSON.stringify({
          outfit: null,
          jewelry: null,
          noProductsAvailable: true,
          styleTips: [
            `We don't have products matching your budget of Rs. ${budget.toLocaleString()}`,
            `For ${occasion} occasions, consider classic silhouettes that never go out of style`,
            "Accessorize with statement pieces to elevate any outfit",
            "Mix and match textures for a rich, layered look",
            `${preferences || "Traditional"} styles work beautifully with coordinated color palettes`,
            "Visit our store for more affordable options coming soon!"
          ],
          totalCost: 0,
          algorithmMetrics: {
            aStarScore: aStarResult.score,
            geneticFitness: geneticResult.fitness,
            expertScore: 0,
            validationPassed: false
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const expertResult = expertSystem(selectedOutfit, selectedJewelry, occasion);

    console.log("\n============================================");
    console.log("🎉 All algorithms completed successfully!");

    // Build response with actual product data
    const response = {
      outfit: selectedOutfit ? {
        id: selectedOutfit.id,
        name: selectedOutfit.name,
        description: selectedOutfit.description,
        estimatedPrice: selectedOutfit.price,
        category: selectedOutfit.category,
        image_url: selectedOutfit.image_url,
        occasion: selectedOutfit.occasion
      } : null,
      jewelry: selectedJewelry ? {
        id: selectedJewelry.id,
        name: selectedJewelry.name,
        description: selectedJewelry.description,
        estimatedPrice: selectedJewelry.price,
        category: selectedJewelry.category,
        image_url: selectedJewelry.image_url,
        occasion: selectedJewelry.occasion
      } : null,
      styleTips: expertResult.tips,
      totalCost: (selectedOutfit?.price || 0) + (selectedJewelry?.price || 0),
      algorithmMetrics: {
        aStarScore: aStarResult.score,
        geneticFitness: geneticResult.fitness,
        expertScore: expertResult.score,
        validationPassed: expertResult.validationPassed
      }
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error in fashion-recommendations:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
