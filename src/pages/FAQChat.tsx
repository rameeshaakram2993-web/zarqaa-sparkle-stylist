import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles, ArrowLeft, HelpCircle, ShoppingBag, Truck, RefreshCcw, CreditCard, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const faqCategories = [
  { icon: ShoppingBag, label: "Orders & Payments", query: "How do I place an order?" },
  { icon: Truck, label: "Shipping & Delivery", query: "How long will delivery take?" },
  { icon: RefreshCcw, label: "Returns & Exchanges", query: "What is your return policy?" },
  { icon: CreditCard, label: "Discounts & Gift Cards", query: "Do you offer any discounts?" },
  { icon: Shield, label: "Privacy & Security", query: "Is my payment information secure?" },
  { icon: HelpCircle, label: "Contact Support", query: "How can I contact customer support?" },
];

const FAQChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm your ZarqaaCloset FAQ assistant. I can help you with questions about orders, shipping, returns, sizing, and more. What would you like to know?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || userInput;
    if (!text.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("fashion-chat", {
        body: { message: text, conversationHistory: messages, isFAQ: true },
      });

      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display gradient-text">FAQ Assistant</h1>
                <p className="text-xs text-muted-foreground">Get instant answers to your questions</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Quick Categories */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Quick topics:</p>
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-border/50 hover:border-primary hover:bg-primary/5"
                onClick={() => handleCategoryClick(category.query)}
                disabled={isLoading}
              >
                <category.icon className="h-3 w-3" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Card */}
        <Card className="glass-card border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-accent" />
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "glass border border-border/50 rounded-bl-md"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                            <HelpCircle className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">FAQ Assistant</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass border border-border/50 p-4 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-muted/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-3"
              >
                <Input
                  placeholder="Ask about orders, shipping, returns, sizing..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 h-12 rounded-xl border-border/50 bg-background"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !userInput.trim()}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Can't find what you're looking for?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <a href="mailto:support@ZarqaaCloset.com" className="text-primary hover:underline">
                support@ZarqaaCloset.com
              </a>
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">WhatsApp: 0333-5119087</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Mon-Sat, 9AM-8PM</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQChat;
