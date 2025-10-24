import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, Network, Dna, CheckCircle2 } from "lucide-react";

export const AIFeatureShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: "Neural Style Analysis",
      description: "Advanced AI analyzes thousands of style combinations to find your perfect match",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Network,
      title: "A* Search Algorithm",
      description: "Optimal pathfinding through product compatibility graphs for best outfit combinations",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Dna,
      title: "Genetic Optimization",
      description: "Evolutionary algorithm generates diverse, high-quality fashion recommendations",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle2,
      title: "Expert System Rules",
      description: "Fashion expertise encoded in AI for intelligent outfit compatibility analysis",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="font-semibold text-primary">Powered by Advanced AI</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">AI-Driven Fashion Intelligence</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the future of personal styling with cutting-edge algorithms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-border hover:border-primary/40 transition-all hover:shadow-xl hover:-translate-y-2 duration-300 animate-in fade-in-50 slide-in-from-bottom-10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className={`${feature.bgColor} ${feature.color} h-14 w-14 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">{feature.title}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border-2 border-primary/20">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
            <p className="text-lg font-semibold text-center">
              <span className="text-primary">Real-time AI processing</span> for personalized recommendations
            </p>
            <Sparkles className="h-8 w-8 text-secondary animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
