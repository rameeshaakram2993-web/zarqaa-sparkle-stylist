import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, ShoppingBag, Send, Brain, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIThinkingAnimation } from "@/components/AIThinkingAnimation";
import { AIRecommendationCard } from "@/components/AIRecommendationCard";
import { AIFeatureShowcase } from "@/components/AIFeatureShowcase";
import heroBg from "@/assets/hero-bg.jpg";
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

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  occasion: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Recommendation {
  outfit: { name: string; description: string; estimatedPrice: number; category: string };
  jewelry: { name: string; description: string; estimatedPrice: number; category: string };
  styleTips: string[];
  totalCost: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const [stylistForm, setStylistForm] = useState({
    occasion: "wedding",
    preferences: "",
    budget: 5000,
  });

  // Fetch products from database
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("fashion-chat", {
        body: { message: userInput, conversationHistory: messages },
      });

      if (error) throw error;

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("fashion-recommendations", {
        body: stylistForm,
      });

      if (error) throw error;

      setRecommendation(data);
      toast({
        title: "Recommendations Ready!",
        description: "AI has styled a perfect outfit for you.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              ZarqaaCloset AI
            </h1>
            <nav className="flex gap-2">
              {["home", "ai stylist", "faq chat", "products"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "secondary" : "ghost"}
                  onClick={() => setActiveTab(tab)}
                  className="capitalize text-primary-foreground hover:bg-primary-hover"
                >
                  {tab}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "home" && (
          <>
            <section className="relative py-24 rounded-3xl overflow-hidden mb-8">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBg})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-secondary/80" />
              </div>
              <div className="relative z-10 text-center text-primary-foreground px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-in fade-in-50 slide-in-from-top duration-700">
                  <Brain className="h-5 w-5 animate-pulse" />
                  <span className="font-semibold">Advanced AI Technology</span>
                  <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <h2 className="text-6xl font-bold mb-6 animate-in fade-in-50 slide-in-from-bottom duration-700 delay-100">
                  AI-Powered Fashion Assistant
                </h2>
                <p className="text-2xl mb-4 opacity-90 animate-in fade-in-50 slide-in-from-bottom duration-700 delay-200">
                  Neural networks meet eastern elegance
                </p>
                <p className="text-lg mb-10 opacity-80 max-w-2xl mx-auto animate-in fade-in-50 slide-in-from-bottom duration-700 delay-300">
                  Experience intelligent style recommendations powered by A* search algorithms, genetic optimization, and expert fashion AI
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in-50 slide-in-from-bottom duration-700 delay-500">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setActiveTab("ai stylist")}
                    className="shadow-2xl hover:scale-110 transition-transform text-lg px-8 py-6 bg-white hover:bg-white/90"
                  >
                    <Brain className="mr-2 h-6 w-6" />
                    Launch AI Stylist
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setActiveTab("faq chat")}
                    className="shadow-xl hover:scale-105 transition-transform text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10"
                  >
                    <MessageSquare className="mr-2 h-6 w-6" />
                    Chat with AI
                  </Button>
                </div>
                <div className="mt-12 flex items-center justify-center gap-8 text-sm opacity-90 animate-in fade-in-50 slide-in-from-bottom duration-700 delay-700">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>AI-Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Personalized</span>
                  </div>
                </div>
              </div>
            </section>
            
            <AIFeatureShowcase />
          </>
        )}

        {activeTab === "ai stylist" && (
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Brain className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-semibold text-primary">AI-Powered Personal Stylist</span>
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent">
                Your AI Fashion Designer
              </h2>
              <p className="text-muted-foreground text-lg">Advanced algorithms analyzing style, budget, and occasion for perfect recommendations</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleGetRecommendations} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Occasion</label>
                    <Select
                      value={stylistForm.occasion}
                      onValueChange={(value) => setStylistForm({ ...stylistForm, occasion: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Style Preferences</label>
                    <Input
                      placeholder="e.g., traditional, modern, embroidered..."
                      value={stylistForm.preferences}
                      onChange={(e) => setStylistForm({ ...stylistForm, preferences: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Budget: Rs. {stylistForm.budget.toLocaleString()}
                    </label>
                    <Slider
                      value={[stylistForm.budget]}
                      onValueChange={([value]) => setStylistForm({ ...stylistForm, budget: value })}
                      min={1000}
                      max={20000}
                      step={1000}
                      className="mt-2"
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Brain className="mr-2 h-5 w-5 animate-pulse" />
                        AI Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate AI Recommendations
                      </>
                    )}
                  </Button>
                </form>

                {isLoading && <AIThinkingAnimation />}

                {recommendation && !isLoading && (
                  <div className="mt-8">
                    <AIRecommendationCard recommendation={recommendation} />
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {activeTab === "faq chat" && (
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <MessageSquare className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-semibold text-primary">Conversational AI</span>
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent">
                AI Fashion Assistant
              </h2>
              <p className="text-muted-foreground text-lg">Intelligent answers powered by advanced language models</p>
            </div>

            <Card className="h-[600px] flex flex-col border-2 border-primary/20 shadow-xl">
              <CardContent className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground mt-24">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 animate-ping">
                        <Brain className="h-16 w-16 mx-auto opacity-20 text-primary" />
                      </div>
                      <Brain className="h-16 w-16 mx-auto text-primary relative z-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">AI Fashion Expert Ready</h3>
                    <p className="text-lg mb-6">Ask me anything about eastern fashion, styling, or our products!</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                      {[
                        "What's trending in eastern wear?",
                        "How do I choose jewelry for my outfit?",
                        "What's your return policy?",
                        "Style tips for wedding season?"
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setUserInput(suggestion)}
                          className="p-3 bg-muted hover:bg-primary/10 rounded-lg text-sm transition-colors border border-border hover:border-primary/40 text-left"
                        >
                          <Sparkles className="h-4 w-4 inline mr-2 text-primary" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-50 slide-in-from-bottom-5`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-xl shadow-lg ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-primary to-primary-hover text-primary-foreground"
                              : "bg-card border-2 border-primary/20"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="flex items-center gap-2 mb-2 text-primary">
                              <Brain className="h-4 w-4" />
                              <span className="text-xs font-semibold">AI Assistant</span>
                            </div>
                          )}
                          <p className="leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start animate-in fade-in-50">
                        <div className="bg-card border-2 border-primary/20 p-4 rounded-xl shadow-lg">
                          <div className="flex items-center gap-3">
                            <Brain className="h-5 w-5 text-primary animate-pulse" />
                            <span className="text-sm font-medium text-muted-foreground">AI is thinking...</span>
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className="h-2 w-2 bg-primary rounded-full animate-bounce"
                                  style={{ animationDelay: `${i * 0.15}s` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <div className="p-6 border-t bg-muted/30">
                <div className="flex gap-3">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask anything about fashion, products, or styling..."
                    disabled={isLoading}
                    className="text-base py-6 border-2 focus:border-primary"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading} size="lg" className="px-8">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  Powered by advanced AI language models
                </p>
              </div>
            </Card>
          </section>
        )}

        {activeTab === "products" && (
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2">Our Collection</h2>
              <p className="text-muted-foreground">Exquisite eastern wear & jewelry</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const imageName = product.image_url?.split('/').pop() || '';
                const productImage = productImages[imageName] || product1;
                
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      )}
                      <p className="text-2xl font-bold text-primary mb-2">
                        Rs. {product.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="secondary">{product.category}</Badge>
                        {product.occasion && <Badge variant="outline">{product.occasion}</Badge>}
                      </div>
                      <Button className="w-full">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-20 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">ZarqaaCloset AI Fashion Assistant</h3>
          <p className="text-muted-foreground">
            Powered by AI • Personalized Eastern Fashion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
