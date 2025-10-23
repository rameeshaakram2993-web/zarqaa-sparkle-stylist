import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, ShoppingBag, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, name: "Embroidered Lawn Suit", price: 4500, category: "dress", image: product1 },
  { id: 2, name: "Kundan Jewelry Set", price: 8500, category: "jewelry", image: product2 },
  { id: 3, name: "Silk Saree", price: 6500, category: "dress", image: product3 },
  { id: 4, name: "Traditional Earrings", price: 2500, category: "jewelry", image: product4 },
  { id: 5, name: "Designer Kurta", price: 3500, category: "dress", image: product5 },
  { id: 6, name: "Bridal Necklace", price: 12000, category: "jewelry", image: product6 },
];

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
  const { toast } = useToast();

  const [stylistForm, setStylistForm] = useState({
    occasion: "wedding",
    preferences: "",
    budget: 5000,
  });

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
          <section className="relative py-20 rounded-2xl overflow-hidden mb-12">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
            </div>
            <div className="relative z-10 text-center text-primary-foreground">
              <h2 className="text-5xl font-bold mb-4">AI-Powered Fashion Assistant</h2>
              <p className="text-xl mb-8 opacity-90">
                Smart recommendations for eastern wear & jewelry
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setActiveTab("ai stylist")}
                className="shadow-lg hover:scale-105 transition-transform"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start AI Stylist
              </Button>
            </div>
          </section>
        )}

        {activeTab === "ai stylist" && (
          <section className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">AI Personal Stylist</h2>
              <p className="text-muted-foreground">Let AI create your perfect outfit</p>
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                </form>

                {recommendation && (
                  <div className="mt-8 p-6 bg-accent/10 rounded-lg">
                    <h3 className="text-2xl font-bold mb-4">Your AI Style Recommendation</h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Main Outfit</h4>
                        <p className="text-sm font-medium">{recommendation.outfit.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {recommendation.outfit.description}
                        </p>
                        <p className="text-lg font-bold text-primary mt-2">
                          Rs. {recommendation.outfit.estimatedPrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Jewelry</h4>
                        <p className="text-sm font-medium">{recommendation.jewelry.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {recommendation.jewelry.description}
                        </p>
                        <p className="text-lg font-bold text-primary mt-2">
                          Rs. {recommendation.jewelry.estimatedPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Style Tips:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {recommendation.styleTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                      <p className="text-xl font-bold text-primary mt-4">
                        Total Cost: Rs. {recommendation.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {activeTab === "faq chat" && (
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">AI Fashion Assistant</h2>
              <p className="text-muted-foreground">Ask me anything about eastern fashion!</p>
            </div>

            <Card className="h-[500px] flex flex-col">
              <CardContent className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground mt-20">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me about eastern fashion, sizing, shipping, or style advice!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-4 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about fashion, sizing, shipping..."
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
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
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">
                      Rs. {product.price.toLocaleString()}
                    </p>
                    <Badge variant="secondary" className="mb-3">
                      {product.category}
                    </Badge>
                    <Button className="w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
