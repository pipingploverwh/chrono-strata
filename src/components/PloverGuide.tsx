import { useState, useRef, useEffect } from "react";
import { X, Minimize2, Maximize2, Send, Bird } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguageState } from "@/hooks/useLanguage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/plover-guide`;

export default function PloverGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguageState();

  const quickActions = [
    { label: t('plover.chat.browseMenu'), message: language === 'ja' ? "どんな商品がありますか？" : "What products do you have available?" },
    { label: t('plover.chat.beginnerTips'), message: language === 'ja' ? "カンナビス初心者です。おすすめは？" : "I'm new to cannabis, what would you recommend?" },
    { label: t('plover.chat.bestValue'), message: language === 'ja' ? "お得な商品は何ですか？" : "What's the best deal for regular smokers?" },
    { label: t('plover.chat.storeHours'), message: language === 'ja' ? "営業時間と場所を教えてください" : "What are your hours and where are you located?" },
  ];

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
            { role: "assistant", content: language === 'ja' 
              ? "今たくさんの質問を受けています！少し待ってからもう一度お試しください。" 
              : "I'm getting a lot of questions right now! Please try again in a moment." },
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
        { role: "assistant", content: language === 'ja' 
          ? "おっと！予期せぬ問題が発生しました。もう一度お試しください。" 
          : "Oops! Something unexpected happened. Please try again." },
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
        data-chat-toggle
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-plover-sage text-plover-cream shadow-lg hover:bg-plover-sage/90 transition-all hover:scale-105"
      >
        <Bird className="w-5 h-5" />
        <span className="font-medium">{t('plover.chatWithPiper')}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col bg-plover-cream border border-plover-dune/30 shadow-2xl transition-all duration-300",
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
          "flex items-center justify-between px-4 border-b border-plover-dune/20",
          isMinimized ? "py-2" : "py-3"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-plover-sage/20 flex items-center justify-center">
            <Bird className="w-5 h-5 text-plover-sage" />
          </div>
          <div>
            <h3 className="font-medium text-plover-earth text-sm">Piper</h3>
            {!isMinimized && (
              <p className="text-xs text-plover-earth/50">{t('plover.chat.yourGuide')}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-plover-earth/50 hover:text-plover-earth hover:bg-plover-dune/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          {!isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-plover-earth/50 hover:text-plover-earth hover:bg-plover-dune/20"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-plover-earth/50 hover:text-plover-earth hover:bg-plover-dune/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-plover-sand">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-plover-sage/20 flex items-center justify-center mb-4">
                  <Bird className="w-8 h-8 text-plover-sage" />
                </div>
                <h4 className="font-medium text-plover-earth mb-2">
                  {t('plover.chat.welcomeFlock')}
                </h4>
                <p className="text-sm text-plover-earth/60 mb-6">
                  {t('plover.chat.intro')}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      className="px-3 py-1.5 text-xs rounded-full bg-plover-cream border border-plover-dune/30 text-plover-earth hover:border-plover-sage/50 transition-colors"
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
                        ? "bg-plover-sage text-plover-cream rounded-br-md"
                        : "bg-plover-cream text-plover-earth rounded-bl-md border border-plover-dune/20"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <Bird className="inline w-3.5 h-3.5 mr-1.5 text-plover-sage" />
                    )}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-plover-cream text-plover-earth rounded-2xl rounded-bl-md px-4 py-2.5 text-sm border border-plover-dune/20">
                  <Bird className="inline w-3.5 h-3.5 mr-1.5 text-plover-sage" />
                  <span className="animate-pulse">{t('plover.chat.thinking')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-plover-dune/20 bg-plover-cream">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('plover.chat.placeholder')}
                className="flex-1 px-4 py-2.5 rounded-full bg-plover-sand text-plover-earth placeholder:text-plover-earth/40 focus:outline-none focus:ring-2 focus:ring-plover-sage/30 text-sm border border-plover-dune/20"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-plover-sage hover:bg-plover-sage/90 text-plover-cream h-10 w-10"
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