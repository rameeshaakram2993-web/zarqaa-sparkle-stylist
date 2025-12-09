import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, ChevronRight, Zap, Dna, Brain, Target, Shuffle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AlgorithmStep {
  id: number;
  title: string;
  description: string;
  visual: string;
}

const aStarSteps: AlgorithmStep[] = [
  { id: 1, title: "Initialize Search", description: "Start with an empty outfit and set the initial cost (gScore) to 0. Calculate heuristic score based on budget utilization.", visual: "init" },
  { id: 2, title: "Explore Neighbors", description: "Look at all available products that could be added to the current outfit combination.", visual: "explore" },
  { id: 3, title: "Calculate Scores", description: "For each product, calculate gScore (actual cost) + hScore (estimated remaining value) = fScore.", visual: "calculate" },
  { id: 4, title: "Select Best Path", description: "Choose the product with the lowest fScore - this balances cost efficiency with occasion matching.", visual: "select" },
  { id: 5, title: "Check Budget", description: "Verify the new combination stays within budget constraints. If exceeded, backtrack and try alternatives.", visual: "budget" },
  { id: 6, title: "Goal Reached", description: "When we have a complete outfit (top, bottom, jewelry), return the optimal combination found.", visual: "goal" },
];

const geneticSteps: AlgorithmStep[] = [
  { id: 1, title: "Generate Population", description: "Create an initial population of random outfit combinations (chromosomes).", visual: "population" },
  { id: 2, title: "Evaluate Fitness", description: "Score each outfit based on occasion match, budget efficiency, and category diversity.", visual: "fitness" },
  { id: 3, title: "Natural Selection", description: "Select the fittest outfits to become parents for the next generation.", visual: "selection" },
  { id: 4, title: "Crossover", description: "Combine traits from two parent outfits to create offspring with mixed characteristics.", visual: "crossover" },
  { id: 5, title: "Mutation", description: "Randomly swap some items to introduce variety and prevent local optima.", visual: "mutation" },
  { id: 6, title: "Evolution Complete", description: "After multiple generations, the fittest outfit emerges as the recommendation.", visual: "complete" },
];

const expertSteps: AlgorithmStep[] = [
  { id: 1, title: "Load Rules", description: "Initialize the knowledge base with professional styling rules and fashion principles.", visual: "rules" },
  { id: 2, title: "Analyze Outfit", description: "Extract features from the recommended outfit: colors, categories, occasions, prices.", visual: "analyze" },
  { id: 3, title: "Apply Color Rules", description: "Check color coordination: complementary colors score higher, clashing colors are flagged.", visual: "colors" },
  { id: 4, title: "Check Occasion Match", description: "Verify all items are appropriate for the specified occasion (formal, casual, party).", visual: "occasion" },
  { id: 5, title: "Category Coverage", description: "Ensure the outfit has proper coverage: top + bottom + accessories for completeness.", visual: "coverage" },
  { id: 6, title: "Generate Tips", description: "Output styling tips and validation score based on all applied rules.", visual: "tips" },
];

const AlgorithmCard = ({ 
  title, 
  icon: Icon, 
  steps, 
  color,
  isActive,
  onSelect 
}: { 
  title: string; 
  icon: any; 
  steps: AlgorithmStep[]; 
  color: string;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !isActive) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, isActive, steps.length]);

  const handlePlay = () => {
    onSelect();
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className={`p-6 bg-card/50 backdrop-blur-sm border transition-all duration-500 ${isActive ? 'ring-2 ring-primary scale-[1.02]' : 'hover:bg-card/70'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground">{title}</h3>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isPlaying ? "secondary" : "default"}
            onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
            className="flex-1"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg transition-all duration-500 ${
                index === currentStep
                  ? 'bg-primary/20 border border-primary/50 scale-[1.02]'
                  : index < currentStep
                  ? 'bg-muted/50 opacity-60'
                  : 'bg-muted/30 opacity-40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground animate-pulse'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${index === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </h4>
                  {index === currentStep && (
                    <p className="text-xs text-muted-foreground mt-1 animate-fade-in">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const FlowDiagram = () => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const nodes = [
    { id: 1, label: "User Input", icon: Target, x: 50, y: 50, description: "Occasion, preferences, budget" },
    { id: 2, label: "A* Search", icon: Zap, x: 25, y: 150, description: "Find optimal path" },
    { id: 3, label: "Genetic Algorithm", icon: Dna, x: 50, y: 150, description: "Evolve creative solutions" },
    { id: 4, label: "Expert System", icon: Brain, x: 75, y: 150, description: "Validate with rules" },
    { id: 5, label: "Best Outfit", icon: CheckCircle, x: 50, y: 250, description: "Final recommendation" },
  ];

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50 overflow-hidden">
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Lines from input to algorithms */}
        <line x1="50" y1="18" x2="25" y2="45" stroke="url(#lineGradient)" strokeWidth="0.3" className="animate-pulse" />
        <line x1="50" y1="18" x2="50" y2="45" stroke="url(#lineGradient)" strokeWidth="0.3" className="animate-pulse" />
        <line x1="50" y1="18" x2="75" y2="45" stroke="url(#lineGradient)" strokeWidth="0.3" className="animate-pulse" />
        {/* Lines from algorithms to output */}
        <line x1="25" y1="55" x2="50" y2="75" stroke="url(#lineGradient)" strokeWidth="0.3" className="animate-pulse" />
        <line x1="50" y1="55" x2="50" y2="75" stroke="url(#lineGradient)" strokeWidth="0.3" className="animate-pulse" />
        <line x1="75" y1="55" x2="50" y2="75" stroke="url(#lineGradient)" strokeWidth="0.3" className="animate-pulse" />
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${
            activeNode === node.id ? 'scale-110 z-10' : 'hover:scale-105'
          }`}
          style={{ left: `${node.x}%`, top: `${node.y / 3}%` }}
          onMouseEnter={() => setActiveNode(node.id)}
          onMouseLeave={() => setActiveNode(null)}
        >
          <div className={`p-3 rounded-xl bg-card border shadow-lg ${
            activeNode === node.id ? 'ring-2 ring-primary' : ''
          }`}>
            <node.icon className={`w-6 h-6 mx-auto mb-1 ${
              node.id === 1 ? 'text-blue-500' :
              node.id === 2 ? 'text-amber-500' :
              node.id === 3 ? 'text-green-500' :
              node.id === 4 ? 'text-purple-500' :
              'text-primary'
            }`} />
            <p className="text-xs font-medium text-center whitespace-nowrap">{node.label}</p>
          </div>
          {activeNode === node.id && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-popover rounded-lg shadow-xl border text-xs text-center whitespace-nowrap animate-fade-in z-20">
              {node.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const AlgorithmVisualization = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Algorithm Visualization
              </h1>
              <p className="text-sm text-muted-foreground">Interactive step-by-step explanations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Flow Overview */}
        <section className="animate-fade-in">
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-primary" />
            System Architecture Flow
          </h2>
          <FlowDiagram />
        </section>

        {/* Algorithm Cards */}
        <section>
          <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-primary" />
            Algorithm Deep Dive
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <AlgorithmCard
              title="A* Search"
              icon={Zap}
              steps={aStarSteps}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              isActive={activeAlgorithm === 'astar'}
              onSelect={() => setActiveAlgorithm('astar')}
            />
            <AlgorithmCard
              title="Genetic Algorithm"
              icon={Dna}
              steps={geneticSteps}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
              isActive={activeAlgorithm === 'genetic'}
              onSelect={() => setActiveAlgorithm('genetic')}
            />
            <AlgorithmCard
              title="Expert System"
              icon={Brain}
              steps={expertSteps}
              color="bg-gradient-to-br from-purple-500 to-violet-600"
              isActive={activeAlgorithm === 'expert'}
              onSelect={() => setActiveAlgorithm('expert')}
            />
          </div>
        </section>

        {/* Legend */}
        <section className="bg-card/50 backdrop-blur-sm rounded-2xl border p-6">
          <h3 className="font-display font-bold text-foreground mb-4">How It Works Together</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">A* Search</h4>
                <p className="text-muted-foreground">Efficiently navigates the product space to find the optimal outfit within budget constraints.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Dna className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Genetic Algorithm</h4>
                <p className="text-muted-foreground">Evolves creative and diverse outfit combinations through simulated natural selection.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Expert System</h4>
                <p className="text-muted-foreground">Validates recommendations using professional styling rules and provides actionable tips.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AlgorithmVisualization;
