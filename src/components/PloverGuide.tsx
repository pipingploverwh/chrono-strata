import { useState, useRef, useEffect } from "react";
import { X, Minimize2, Maximize2, Send, Bird } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/plover-guide`;

const quickActions = [
  { label: "Browse Menu", message: "What products do you have available?" },
  { label: "Beginner Tips", message: "I'm new to cannabis, what would you recommend?" },
  { label: "Best Value", message: "What's the best deal for regular smokers?" },
  { label: "Store Hours", message: "What are your hours and where are you located?" },
];

export default function PloverGuide() {
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
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "I'm getting a lot of questions right now! Please try again in a moment. 🐦" },
          ]);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      // Add empty assistant message to update progressively
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        { role: "assistant", content: "Oops! Looks like the tide came in unexpectedly. Please try again! 🌊" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
    setInput("");
  };

  const handleQuickAction = (message: string) => {
    if (isLoading) return;
    streamChat(message);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-plover-ocean text-white shadow-lg hover:bg-plover-ocean/90 transition-all hover:scale-105"
      >
        <Bird className="w-5 h-5" />
        <span className="font-medium">Chat with Piper</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col bg-plover-dune border border-plover-ocean/20 shadow-2xl transition-all duration-300",
        isExpanded
          ? "inset-4 rounded-2xl"
          : isMinimized
          ? "bottom-6 right-6 w-72 h-14 rounded-full"
          : "bottom-6 right-6 w-96 h-[32rem] rounded-2xl"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 border-b border-plover-ocean/10",
          isMinimized ? "py-2" : "py-3"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐦</span>
          <div>
            <h3 className="font-medium text-plover-driftwood text-sm">Piper</h3>
            {!isMinimized && (
              <p className="text-xs text-plover-driftwood/60">Your Piping Plover Guide</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-plover-driftwood/70 hover:text-plover-driftwood hover:bg-plover-sand"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          {!isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-plover-driftwood/70 hover:text-plover-driftwood hover:bg-plover-sand"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-plover-driftwood/70 hover:text-plover-driftwood hover:bg-plover-sand"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🐦</div>
                <h4 className="font-medium text-plover-driftwood mb-2">
                  Welcome to the flock!
                </h4>
                <p className="text-sm text-plover-driftwood/70 mb-6">
                  I'm Piper, your friendly guide to The Piping Plover Dispensary.
                  How can I help you today?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      className="px-3 py-1.5 text-xs rounded-full bg-plover-ocean/10 text-plover-ocean hover:bg-plover-ocean/20 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.role === "user"
                        ? "bg-plover-ocean text-white rounded-br-md"
                        : "bg-plover-sand text-plover-driftwood rounded-bl-md"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <span className="mr-1">🐦</span>
                    )}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-plover-sand text-plover-driftwood rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
                  <span className="mr-1">🐦</span>
                  <span className="animate-pulse">Piper is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-plover-ocean/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Piper anything..."
                className="flex-1 px-4 py-2.5 rounded-full bg-plover-sand text-plover-driftwood placeholder:text-plover-driftwood/50 focus:outline-none focus:ring-2 focus:ring-plover-ocean/30 text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-plover-ocean hover:bg-plover-ocean/90 text-white h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
