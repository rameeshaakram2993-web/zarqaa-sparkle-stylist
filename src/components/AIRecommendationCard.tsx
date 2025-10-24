import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Award } from "lucide-react";

interface AIRecommendationCardProps {
  recommendation: {
    outfit: { name: string; description: string; estimatedPrice: number; category: string };
    jewelry: { name: string; description: string; estimatedPrice: number; category: string };
    styleTips: string[];
    totalCost: number;
  };
}

export const AIRecommendationCard = ({ recommendation }: AIRecommendationCardProps) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
      {/* AI Badge */}
      <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <span className="font-bold text-lg">AI-Generated Style Recommendation</span>
        <Award className="h-5 w-5 text-secondary" />
      </div>

      {/* Main Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Outfit Card */}
        <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(128,0,32,0.3)] hover:scale-105 duration-300">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="font-bold text-lg">Perfect Outfit</h4>
              <Badge variant="secondary" className="ml-auto">
                {recommendation.outfit.category}
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">{recommendation.outfit.name}</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {recommendation.outfit.description}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                Rs. {recommendation.outfit.estimatedPrice.toLocaleString()}
              </span>
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
          </CardContent>
        </Card>

        {/* Jewelry Card */}
        <Card className="overflow-hidden border-2 border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:scale-105 duration-300">
          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h4 className="font-bold text-lg">Matching Jewelry</h4>
              <Badge variant="outline" className="ml-auto border-secondary">
                {recommendation.jewelry.category}
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3 text-secondary">{recommendation.jewelry.name}</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {recommendation.jewelry.description}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-secondary">
                Rs. {recommendation.jewelry.estimatedPrice.toLocaleString()}
              </span>
              <Award className="h-5 w-5 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Style Tips */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h4 className="font-bold text-lg">AI Style Intelligence</h4>
          </div>
          <ul className="space-y-3">
            {recommendation.styleTips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted/50 transition-colors animate-in fade-in-50 slide-in-from-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <span className="text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Total Cost Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-hover to-secondary p-6 text-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10">
          <p className="text-primary-foreground/80 text-sm font-medium mb-2">
            AI-Optimized Total Investment
          </p>
          <p className="text-4xl font-bold text-primary-foreground flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8" />
            Rs. {recommendation.totalCost.toLocaleString()}
            <Award className="h-8 w-8" />
          </p>
          <p className="text-primary-foreground/70 text-xs mt-2">
            ✨ Perfectly balanced for your budget and style
          </p>
        </div>
      </div>
    </div>
  );
};
