import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Dna, BookOpen, Zap, Brain, ArrowRight, Sparkles } from "lucide-react";

export const AIFeatureShowcase = () => {
  const algorithms = [
    {
      icon: Target,
      name: "A* Search Algorithm",
      badge: "Pathfinding",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10",
      textColor: "text-blue-500",
      description: "Efficiently finds optimal outfit combinations from thousands of possibilities using heuristic-based search.",
      features: [
        "O(n log n) time complexity",
        "Budget constraint optimization",
        "Occasion-based heuristics",
        "Fastest path to perfect outfits"
      ],
      metric: "<50ms",
      metricLabel: "Search Time"
    },
    {
      icon: Dna,
      name: "Genetic Algorithm",
      badge: "Evolution",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10",
      textColor: "text-purple-500",
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
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/10",
      textColor: "text-amber-500",
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

  const steps = [
    { icon: Target, color: "blue", title: "A* Search", desc: "Finds optimal combinations" },
    { icon: Dna, color: "purple", title: "Genetic Evolution", desc: "Evolves diverse alternatives" },
    { icon: BookOpen, color: "amber", title: "Expert Validation", desc: "Validates against rules" },
    { icon: Sparkles, color: "gradient", title: "Perfect Outfit", desc: "AI-curated recommendation" },
  ];

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
          <Brain className="h-4 w-4 mr-2 animate-pulse" />
          AI Technology Stack
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 gradient-text">
          Three Powerful Algorithms
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Our fashion AI combines multiple algorithmic approaches to deliver the most intelligent styling recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {algorithms.map((algo, index) => (
          <Card 
            key={algo.name}
            className="glass-card relative overflow-hidden group hover-lift border-0"
          >
            {/* Top gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${algo.gradient}`} />
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${algo.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${algo.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <algo.icon className={`h-7 w-7 ${algo.textColor}`} />
                </div>
                <Badge variant="outline" className={`${algo.textColor} border-current/30`}>
                  {algo.badge}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold font-display mb-3">{algo.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{algo.description}</p>
              
              <ul className="space-y-3 mb-8">
                {algo.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full ${algo.iconBg} flex items-center justify-center`}>
                      <Zap className={`h-3 w-3 ${algo.textColor}`} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className={`p-5 rounded-2xl bg-gradient-to-r ${algo.bgGradient}`}>
                <div className={`text-4xl font-bold font-display ${algo.textColor}`}>{algo.metric}</div>
                <div className="text-sm text-muted-foreground mt-1">{algo.metricLabel}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works - Modern Timeline */}
      <Card className="glass-card border-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        <CardContent className="p-12">
          <h3 className="text-2xl md:text-3xl font-bold font-display text-center mb-12">
            How Our AI Works Together
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
                    step.color === "gradient" 
                      ? "bg-gradient-to-br from-primary to-secondary" 
                      : step.color === "blue" ? "bg-blue-500/10"
                      : step.color === "purple" ? "bg-purple-500/10"
                      : "bg-amber-500/10"
                  }`}>
                    <step.icon className={`h-10 w-10 ${
                      step.color === "gradient" ? "text-primary-foreground"
                      : step.color === "blue" ? "text-blue-500"
                      : step.color === "purple" ? "text-purple-500"
                      : "text-amber-500"
                    }`} />
                  </div>
                  <h4 className="font-semibold font-display mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground max-w-[140px]">{step.desc}</p>
                </div>
                
                {idx < steps.length - 1 && (
                  <div className="hidden md:block mx-6">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};