import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap, Star, CheckCircle, TrendingUp, Target, Dna, BookOpen } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const productImages: Record<string, string> = {
  "product-1.jpg": product1,
  "product-2.jpg": product2,
  "product-3.jpg": product3,
  "product-4.jpg": product4,
  "product-5.jpg": product5,
  "product-6.jpg": product6,
};

interface RecommendationItem {
  id?: string;
  name: string;
  description: string;
  estimatedPrice: number;
  category: string;
  image_url?: string;
  occasion?: string;
}

interface AlgorithmMetrics {
  aStarScore: number;
  geneticFitness: number;
  expertScore: number;
  validationPassed: boolean;
}

interface AIRecommendationCardProps {
  recommendation: {
    outfit: RecommendationItem | null;
    jewelry: RecommendationItem | null;
    styleTips: string[];
    totalCost: number;
    algorithmMetrics?: AlgorithmMetrics;
  };
}

const getProductImage = (imageUrl: string | undefined): string => {
  if (!imageUrl) return product1;
  const imageName = imageUrl.split('/').pop() || '';
  return productImages[imageName] || product1;
};

export const AIRecommendationCard = ({ recommendation }: AIRecommendationCardProps) => {
  const metrics = recommendation.algorithmMetrics;
  
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      {/* Algorithm Performance Dashboard */}
      {metrics && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="font-bold text-lg">AI Algorithm Performance</h3>
              {metrics.validationPassed && (
                <Badge className="bg-green-500 text-white ml-auto">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validated
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* A* Search */}
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold">A* Search</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">
                  {((1 - metrics.aStarScore) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Optimal Path Found</p>
              </div>
              
              {/* Genetic Algorithm */}
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Dna className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold">Genetic</span>
                </div>
                <div className="text-2xl font-bold text-purple-500">
                  {metrics.geneticFitness.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Fitness Score</p>
              </div>
              
              {/* Expert System */}
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold">Expert</span>
                </div>
                <div className="text-2xl font-bold text-amber-500">
                  {metrics.expertScore}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Rule Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-2">
          <Sparkles className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          <span className="font-semibold text-primary">AI-Generated Recommendation</span>
        </div>
      </div>

      {/* Products Grid with Images */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Outfit Card */}
        {recommendation.outfit && (
          <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={getProductImage(recommendation.outfit.image_url)} 
                alt={recommendation.outfit.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                <Zap className="h-3 w-3 mr-1" />
                A* Optimized
              </Badge>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-bold text-lg drop-shadow-lg">{recommendation.outfit.name}</h4>
                <p className="text-2xl font-bold drop-shadow-lg">
                  Rs. {recommendation.outfit.estimatedPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm mb-3">{recommendation.outfit.description}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{recommendation.outfit.category}</Badge>
                {recommendation.outfit.occasion && (
                  <Badge variant="outline">{recommendation.outfit.occasion}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jewelry Card */}
        {recommendation.jewelry && (
          <Card className="overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-xl group">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={getProductImage(recommendation.jewelry.image_url)} 
                alt={recommendation.jewelry.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                <Dna className="h-3 w-3 mr-1" />
                Genetically Evolved
              </Badge>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-bold text-lg drop-shadow-lg">{recommendation.jewelry.name}</h4>
                <p className="text-2xl font-bold drop-shadow-lg">
                  Rs. {recommendation.jewelry.estimatedPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm mb-3">{recommendation.jewelry.description}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{recommendation.jewelry.category}</Badge>
                {recommendation.jewelry.occasion && (
                  <Badge variant="outline">{recommendation.jewelry.occasion}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expert System Tips */}
      <Card className="border-2 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <h4 className="font-bold text-lg">Expert System Style Analysis</h4>
          </div>
          <ul className="space-y-2">
            {recommendation.styleTips.map((tip, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-sm animate-in fade-in-50 slide-in-from-left-3"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tip.startsWith("✓") ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : tip.startsWith("💡") ? (
                  <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                )}
                <span>{tip.replace(/^[✓💡]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Total Cost */}
      <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">AI-Optimized Total Investment</p>
            <p className="text-4xl font-bold">Rs. {recommendation.totalCost.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
              <Brain className="h-4 w-4" />
              <span>3 Algorithms Combined</span>
            </div>
            <div className="flex gap-1">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">A*</Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">GA</Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">Expert</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
