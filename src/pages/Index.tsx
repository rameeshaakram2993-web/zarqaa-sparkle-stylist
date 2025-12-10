import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, ShoppingBag, Send, Brain, Zap, Star, ArrowRight, ChevronRight, Dna } from "lucide-react";
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
      
      // Check if no products available in budget
      if (data.noProductsAvailable) {
        toast({
          title: "No Products Available",
          description: "We don't have products in your budget range. Here are some style tips instead!",
        });
      } else {
        toast({
          title: "Recommendations Ready!",
          description: "AI has styled a perfect outfit for you.",
        });
      }
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

  const navItems = [
    { id: "home", label: "Home", icon: Sparkles },
    { id: "ai stylist", label: "AI Stylist", icon: Brain },
    { id: "faq chat", label: "Chat", icon: MessageSquare },
    { id: "products", label: "Shop", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display gradient-text">ZarqaaCloset</h1>
                <p className="text-xs text-muted-foreground">AI Fashion Assistant</p>
              </div>
            </div>
            <nav className="flex gap-1 p-1 glass-card">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(item.id)}
                  className={`capitalize gap-2 transition-all duration-300 ${
                    activeTab === item.id 
                      ? "bg-primary text-primary-foreground shadow-lg glow-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  size="sm"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
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
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 rounded-3xl overflow-hidden mb-16">
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url(${heroBg})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/85 to-primary/80" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float" />
              <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
              <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-accent/20 blur-2xl animate-float" style={{ animationDelay: "4s" }} />
              
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 animate-fade-in">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium text-background/90">AI-Powered Fashion Revolution</span>
                  <ChevronRight className="h-4 w-4 text-background/70" />
                </div>
                
                <h2 className="text-5xl md:text-7xl font-bold font-display mb-6 text-background leading-tight animate-slide-up">
                  Your Personal
                  <span className="block gradient-text-hero">AI Stylist</span>
                </h2>
                
                <p className="text-lg md:text-xl mb-10 text-background/80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
                  Experience intelligent style recommendations powered by A* search, genetic optimization, and expert fashion AI
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  <Button
                    size="lg"
                    onClick={() => setActiveTab("ai stylist")}
                    className="bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 text-primary-foreground shadow-xl glow-primary hover:scale-105 transition-all duration-300 text-base px-8 py-6 rounded-xl group"
                  >
                    <Brain className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Launch AI Stylist
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setActiveTab("faq chat")}
                    className="bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background/20 transition-all duration-300 text-base px-8 py-6 rounded-xl"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Chat with AI
                  </Button>
                </div>
                
                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
                  {[
                    { value: "<50ms", label: "AI Response" },
                    { value: "3", label: "Algorithms" },
                    { value: "100%", label: "Personalized" },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-background">{stat.value}</div>
                      <div className="text-xs text-background/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Algorithm Visualization Link */}
            <div className="flex justify-center mb-12">
              <Link to="/algorithms">
                <Button variant="outline" size="lg" className="group gap-3 px-6 py-6 rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5">
                  <Dna className="h-5 w-5 text-primary group-hover:animate-pulse" />
                  <span className="font-display">Explore AI Algorithm Visualization</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <AIFeatureShowcase />
          </>
        )}

        {activeTab === "ai stylist" && (
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                AI-Powered Styling
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 gradient-text">
                Your AI Fashion Designer
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Advanced algorithms analyzing style, budget, and occasion for perfect recommendations
              </p>
            </div>

            <Card className="glass-card border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <CardContent className="p-8">
                <form onSubmit={handleGetRecommendations} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        Occasion
                      </label>
                      <Select
                        value={stylistForm.occasion}
                        onValueChange={(value) => setStylistForm({ ...stylistForm, occasion: value })}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="party">Party</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        Style Preferences
                      </label>
                      <Input
                        placeholder="e.g., traditional, modern, embroidered..."
                        value={stylistForm.preferences}
                        onChange={(e) => setStylistForm({ ...stylistForm, preferences: e.target.value })}
                        className="h-12 rounded-xl border-border/50 bg-muted/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-accent" />
                        Budget
                      </label>
                      <span className="text-2xl font-bold gradient-text">
                        Rs. {stylistForm.budget.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={[stylistForm.budget]}
                      onValueChange={([value]) => setStylistForm({ ...stylistForm, budget: value })}
                      min={1000}
                      max={20000}
                      step={1000}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Rs. 1,000</span>
                      <span>Rs. 20,000</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 transition-all duration-300 glow-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Brain className="mr-2 h-5 w-5 animate-pulse" />
                        AI Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate AI Recommendations
                        <ArrowRight className="ml-2 h-5 w-5" />
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
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
                <MessageSquare className="h-4 w-4 mr-2 animate-pulse" />
                Conversational AI
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 gradient-text">
                AI Fashion Assistant
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Intelligent answers powered by advanced language models
              </p>
            </div>

            <Card className="h-[650px] flex flex-col glass-card border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-accent" />
              <CardContent className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="text-center mt-16">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Brain className="h-10 w-10 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold font-display mb-3">AI Fashion Expert Ready</h3>
                    <p className="text-muted-foreground mb-8">Ask me anything about eastern fashion, styling, or our products!</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {[
                        "What's trending in eastern wear?",
                        "How do I choose jewelry for my outfit?",
                        "What's your return policy?",
                        "Style tips for wedding season?"
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setUserInput(suggestion)}
                          className="p-4 glass-card text-left hover:scale-[1.02] transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-primary to-primary-hover text-primary-foreground rounded-br-md"
                              : "glass-card rounded-bl-md"
                          }`}
                        >
                          {msg.role === "assistant" && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <Brain className="h-3 w-3 text-primary-foreground" />
                              </div>
                              <span className="text-xs font-medium text-primary">AI Assistant</span>
                            </div>
                          )}
                          <p className="leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="glass-card p-4 rounded-2xl rounded-bl-md">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                              <Brain className="h-3 w-3 text-primary-foreground" />
                            </div>
                            <span className="text-sm text-muted-foreground">Thinking...</span>
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
              <div className="p-6 border-t border-border/50 bg-muted/30">
                <div className="flex gap-3">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask anything about fashion, products, or styling..."
                    disabled={isLoading}
                    className="h-12 rounded-xl border-border/50 bg-background/50"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading} 
                    size="lg" 
                    className="px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:opacity-90"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {activeTab === "products" && (
          <section>
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 px-4 py-2">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Curated Collection
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 gradient-text">
                Our Collection
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Exquisite eastern wear & jewelry curated by AI
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const imageName = product.image_url?.split('/').pop() || '';
                const productImage = productImages[imageName] || product1;
                
                return (
                  <Card key={product.id} className="glass-card overflow-hidden group hover-lift border-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Button
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 bg-background/90 text-foreground hover:bg-background"
                        size="sm"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Quick View
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex gap-2 mb-3">
                        <Badge className="bg-primary/10 text-primary border-primary/20">{product.category}</Badge>
                        {product.occasion && <Badge variant="outline">{product.occasion}</Badge>}
                      </div>
                      <h3 className="font-semibold font-display text-lg mb-2">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold gradient-text">
                          Rs. {product.price.toLocaleString()}
                        </p>
                        <Button size="sm" className="rounded-xl">
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mt-24 border-t border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display gradient-text">ZarqaaCloset</h3>
                <p className="text-sm text-muted-foreground">AI Fashion Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Powered by AI
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Personalized Style
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Instant Results
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;