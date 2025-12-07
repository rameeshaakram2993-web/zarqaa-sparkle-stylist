import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Dna, BookOpen, Zap, Brain, TrendingUp, Sparkles } from "lucide-react";

export const AIFeatureShowcase = () => {
  const algorithms = [
    {
      icon: Target,
      name: "A* Search Algorithm",
      badge: "Pathfinding",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      description: "Efficiently finds optimal outfit combinations from thousands of possibilities using heuristic-based search.",
      features: [
        "O(n log n) time complexity",
        "Budget constraint optimization",
        "Occasion-based heuristics",
        "Fastest path to perfect outfits"
      ],
      metric: "< 50ms",
      metricLabel: "Search Time"
    },
    {
      icon: Dna,
      name: "Genetic Algorithm",
      badge: "Evolution",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      description: "Evolves creative and diverse outfit suggestions through simulated natural selection and mutation.",
      features: [
        "20+ generations evolved",
        "Population-based search",
        "Creative combination discovery",
        "Fitness-driven selection"
      ],
      metric: "50+",
      metricLabel: "Individuals/Gen"
    },
    {
      icon: BookOpen,
      name: "Expert System",
      badge: "Knowledge-Based",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
      description: "Applies professional styling rules and fashion expertise to validate and enhance recommendations.",
      features: [
        "6+ validation rules",
        "Occasion-specific logic",
        "Color coordination checks",
        "Budget balance analysis"
      ],
      metric: "100%",
      metricLabel: "Rule Coverage"
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          <span className="font-semibold text-primary">AI Technology Stack</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">
          Three Powerful Algorithms Working Together
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Our fashion AI combines multiple algorithmic approaches to deliver the most intelligent styling recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {algorithms.map((algo, index) => (
          <Card 
            key={algo.name}
            className={`relative overflow-hidden border-2 ${algo.borderColor} hover:shadow-xl transition-all duration-300 group`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              index === 0 ? "from-blue-500 to-blue-400" :
              index === 1 ? "from-purple-500 to-purple-400" :
              "from-amber-500 to-amber-400"
            }`} />
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${algo.bgColor} group-hover:scale-110 transition-transform`}>
                  <algo.icon className={`h-6 w-6 ${algo.color}`} />
                </div>
                <Badge variant="outline" className={algo.color}>
                  {algo.badge}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{algo.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{algo.description}</p>
              
              <ul className="space-y-2 mb-6">
                {algo.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Zap className={`h-3 w-3 ${algo.color}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className={`p-4 rounded-lg ${algo.bgColor}`}>
                <div className={`text-3xl font-bold ${algo.color}`}>{algo.metric}</div>
                <div className="text-xs text-muted-foreground">{algo.metricLabel}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-center mb-8">How Our AI Works Together</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <h4 className="font-semibold mb-1">1. A* Search</h4>
              <p className="text-xs text-muted-foreground">Finds optimal combinations using budget & occasion heuristics</p>
            </div>
            
            <div className="hidden md:block">
              <TrendingUp className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <Dna className="h-8 w-8 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-1">2. Genetic Evolution</h4>
              <p className="text-xs text-muted-foreground">Evolves diverse alternatives through selection & mutation</p>
            </div>
            
            <div className="hidden md:block">
              <TrendingUp className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                <BookOpen className="h-8 w-8 text-amber-500" />
              </div>
              <h4 className="font-semibold mb-1">3. Expert Validation</h4>
              <p className="text-xs text-muted-foreground">Validates against fashion rules & generates style tips</p>
            </div>
            
            <div className="hidden md:block">
              <TrendingUp className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
            </div>
            
            {/* Result */}
            <div className="flex flex-col items-center text-center max-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-1">Perfect Outfit</h4>
              <p className="text-xs text-muted-foreground">AI-curated recommendation with matching products</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
