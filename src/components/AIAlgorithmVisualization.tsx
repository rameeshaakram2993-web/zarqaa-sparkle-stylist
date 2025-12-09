import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Dna, 
  BookOpen, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  Sparkles,
  Brain,
  Zap,
  Network,
  GitBranch,
  Filter
} from "lucide-react";

interface AlgorithmStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subSteps: string[];
}

const algorithms: AlgorithmStep[] = [
  {
    id: "astar",
    name: "A* Search Algorithm",
    description: "Finding optimal outfit combination within budget constraints",
    icon: <Target className="h-5 w-5" />,
    color: "text-blue-500",
    subSteps: [
      "Initializing search space with available products",
      "Calculating heuristic cost for each combination",
      "Exploring lowest-cost nodes first",
      "Pruning budget-exceeding paths",
      "Converging on optimal solution"
    ]
  },
  {
    id: "genetic",
    name: "Genetic Algorithm",
    description: "Evolving creative outfit suggestions through natural selection",
    icon: <Dna className="h-5 w-5" />,
    color: "text-purple-500",
    subSteps: [
      "Creating initial population of 50 outfits",
      "Evaluating fitness scores for each individual",
      "Selecting fittest candidates for breeding",
      "Applying crossover and mutation operators",
      "Evolving through 20 generations"
    ]
  },
  {
    id: "expert",
    name: "Expert System",
    description: "Validating recommendations using fashion expertise rules",
    icon: <BookOpen className="h-5 w-5" />,
    color: "text-amber-500",
    subSteps: [
      "Loading fashion rule knowledge base",
      "Checking color coordination rules",
      "Validating occasion appropriateness",
      "Applying style harmony principles",
      "Computing final validation score"
    ]
  }
];

export const AIAlgorithmVisualization = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next sub-step or algorithm
          if (currentSubStep < algorithms[currentAlgorithm].subSteps.length - 1) {
            setCurrentSubStep((s) => s + 1);
          } else if (currentAlgorithm < algorithms.length - 1) {
            setCurrentAlgorithm((a) => a + 1);
            setCurrentSubStep(0);
          } else {
            // Reset for continuous loop
            setCurrentAlgorithm(0);
            setCurrentSubStep(0);
          }
          return 0;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentAlgorithm, currentSubStep]);

  const currentAlgo = algorithms[currentAlgorithm];

  return (
    <div className="space-y-6 py-8 animate-in fade-in-50 duration-500">
      {/* Main Processing Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full mb-4">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          <span className="font-semibold text-lg">AI Recommendation Engine Active</span>
          <Sparkles className="h-5 w-5 text-secondary animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Algorithm Pipeline Visualization */}
      <div className="flex justify-center items-center gap-2 mb-6">
        {algorithms.map((algo, index) => (
          <div key={algo.id} className="flex items-center">
            <div 
              className={`
                relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500
                ${index === currentAlgorithm 
                  ? `bg-gradient-to-br from-${algo.color.replace('text-', '')} to-${algo.color.replace('text-', '')}/50 scale-110 ring-4 ring-${algo.color.replace('text-', '')}/30` 
                  : index < currentAlgorithm 
                    ? 'bg-green-500/20 border-2 border-green-500' 
                    : 'bg-muted border-2 border-border'
                }
              `}
            >
              {index < currentAlgorithm ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <span className={index === currentAlgorithm ? algo.color : 'text-muted-foreground'}>
                  {algo.icon}
                </span>
              )}
              {index === currentAlgorithm && (
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              )}
            </div>
            {index < algorithms.length - 1 && (
              <ArrowRight className={`mx-2 h-4 w-4 transition-colors duration-300 ${
                index < currentAlgorithm ? 'text-green-500' : 'text-muted-foreground'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Algorithm Detail Card */}
      <Card className={`border-2 transition-all duration-500 overflow-hidden ${
        currentAlgo.color.replace('text-', 'border-')
      }/30`}>
        <div className={`h-1 bg-gradient-to-r ${
          currentAlgo.id === 'astar' ? 'from-blue-500 to-blue-300' :
          currentAlgo.id === 'genetic' ? 'from-purple-500 to-purple-300' :
          'from-amber-500 to-amber-300'
        }`} />
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${
              currentAlgo.id === 'astar' ? 'from-blue-500/20 to-blue-500/5' :
              currentAlgo.id === 'genetic' ? 'from-purple-500/20 to-purple-500/5' :
              'from-amber-500/20 to-amber-500/5'
            }`}>
              <span className={currentAlgo.color}>{currentAlgo.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{currentAlgo.name}</h3>
              <p className="text-sm text-muted-foreground">{currentAlgo.description}</p>
            </div>
            <Badge className={`${
              currentAlgo.id === 'astar' ? 'bg-blue-500' :
              currentAlgo.id === 'genetic' ? 'bg-purple-500' :
              'bg-amber-500'
            } text-white`}>
              Processing
            </Badge>
          </div>

          {/* Sub-steps Visualization */}
          <div className="space-y-3 mb-4">
            {currentAlgo.subSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  index === currentSubStep 
                    ? 'bg-muted/50 border border-primary/30' 
                    : index < currentSubStep 
                      ? 'opacity-60' 
                      : 'opacity-40'
                }`}
              >
                {index < currentSubStep ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : index === currentSubStep ? (
                  <div className="relative">
                    <Circle className={`h-4 w-4 ${currentAlgo.color} flex-shrink-0`} />
                    <div className={`absolute inset-0 rounded-full ${currentAlgo.color} animate-ping opacity-50`} />
                  </div>
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${index === currentSubStep ? 'font-medium' : ''}`}>
                  {step}
                </span>
                {index === currentSubStep && (
                  <Zap className={`ml-auto h-4 w-4 ${currentAlgo.color} animate-pulse`} />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentSubStep + 1} of {currentAlgo.subSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Integration Diagram */}
      <Card className="border border-border/50 bg-gradient-to-br from-muted/30 to-background">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">A* → Optimal Path</span>
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-purple-500" />
              <span className="text-muted-foreground">GA → Creative Variety</span>
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">Expert → Validation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Indicator */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full ${
              currentAlgo.id === 'astar' ? 'bg-blue-500' :
              currentAlgo.id === 'genetic' ? 'bg-purple-500' :
              'bg-amber-500'
            } animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};
