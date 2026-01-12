import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sparkles, X, Send, Loader2, ChevronDown, ChevronUp,
  Maximize2, Minimize2, Zap, FileCode, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIHarmonyAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    setIsLoading(true);
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-harmony`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: "chat",
            messages: newMessages,
            context: `Current page: ${location.pathname}`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            if (delta) {
              assistantContent += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response");
      setMessages(prev => prev.slice(0, -1)); // Remove failed message
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
  };

  const quickActions = [
    { icon: Zap, label: "Analyze", action: () => navigate("/ai-harmony") },
    { icon: FileCode, label: "Specs", action: () => navigate("/ai-harmony?tab=specs") },
    { icon: MessageSquare, label: "Chat", action: () => setIsExpanded(true) },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full shadow-lg shadow-red-900/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Open AI Harmony Assistant"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-neutral-900 border border-neutral-700 shadow-2xl shadow-black/50 transition-all duration-300 ${
        isExpanded
          ? "inset-4 md:inset-8 rounded-2xl"
          : isMinimized
          ? "bottom-6 right-6 w-80 h-14 rounded-full"
          : "bottom-6 right-6 w-96 h-[500px] rounded-2xl"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!isMinimized && (
            <div>
              <h3 className="text-sm font-medium text-white">AI Harmony</h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Lavandar Development</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </>
          )}
          {isMinimized && (
            <button
              onClick={() => setIsMinimized(false)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-neutral-800">
              <p className="text-xs text-neutral-400 mb-3">Quick actions</p>
              <div className="flex gap-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-neutral-800 hover:bg-red-600/20 border border-neutral-700 hover:border-red-600/50 rounded-lg transition-all text-neutral-300 hover:text-white"
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="text-xs">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`overflow-y-auto p-4 space-y-4 ${isExpanded ? "h-[calc(100%-180px)]" : "h-[calc(100%-200px)]"}`}>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
                <p className="text-neutral-400 text-sm">
                  How can I help with Lavandar development today?
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-800 text-neutral-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 p-3 rounded-xl">
                  <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-700 bg-neutral-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your requirements..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600/50"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-lg"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AIHarmonyAssistant;