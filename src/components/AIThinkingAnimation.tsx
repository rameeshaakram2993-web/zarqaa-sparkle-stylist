import { Sparkles, Brain, Zap } from "lucide-react";

export const AIThinkingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <Brain className="h-12 w-12 text-primary opacity-30" />
        </div>
        <Brain className="h-12 w-12 text-primary relative z-10 animate-pulse" />
      </div>
      
      <div className="flex items-center gap-2 text-primary font-medium">
        <Sparkles className="h-4 w-4 animate-spin" />
        <span className="animate-pulse">AI analyzing your style preferences...</span>
        <Zap className="h-4 w-4 animate-bounce" />
      </div>
      
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};
