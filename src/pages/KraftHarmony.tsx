import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Sparkles, Zap, FileCode, MessageSquare, Loader2, 
  CheckCircle2, AlertTriangle, Clock, ChevronRight,
  Code, Database, Palette, Plug, ArrowRight, Send,
  Building2, Users, CloudSun, MapPin, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  type: "frontend" | "backend" | "database" | "integration" | "design" | "operations";
  priority: "high" | "medium" | "low";
  estimatedHours: number;
  dependencies: number[];
  venueSystem?: string;
}

interface AnalysisResult {
  summary: string;
  complexity: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  venueImpact?: {
    operations: string;
    fanExperience: string;
    revenue: string;
  };
  tasks: Task[];
  risks: string[];
  recommendations: string[];
  strataIntegration?: string;
}

interface SpecsResult {
  architecture: {
    overview: string;
    components: {
      name: string;
      path: string;
      purpose: string;
      props: { name: string; type: string; required: boolean }[];
      hooks: string[];
      venueIntegration?: string;
    }[];
    dataFlow: string;
  };
  database: {
    tables: {
      name: string;
      columns: { name: string; type: string; nullable: boolean }[];
      rlsPolicies: string[];
      venueDataType?: string;
    }[];
  };
  edgeFunctions: {
    name: string;
    purpose: string;
    endpoints: string[];
    authentication: string;
    venueIntegration?: string;
  }[];
  integrations: string[];
  implementationOrder: string[];
  gameDayConsiderations?: string[];
  strataIntegration?: {
    weatherTriggers: string[];
    automatedResponses: string[];
  };
}

const typeIcons = {
  frontend: Code,
  backend: Zap,
  database: Database,
  integration: Plug,
  design: Palette,
  operations: Building2,
};

const priorityColors = {
  high: "text-[#c8102e] bg-[#c8102e]/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  low: "text-green-500 bg-green-500/10",
};

const complexityColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-[#c8102e]",
};

const KraftHarmonyPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "analyze";
  
  const [requirements, setRequirements] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("gillette");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSpecs, setIsGeneratingSpecs] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [specsResult, setSpecsResult] = useState<SpecsResult | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const venues = [
    { id: "gillette", name: "Gillette Stadium", capacity: "65,878" },
    { id: "patriot-place", name: "Patriot Place", capacity: "1.3M sq ft" },
    { id: "revolution", name: "Revolution Training", capacity: "5,000" },
  ];

  const analyzeRequirements = async () => {
    if (!requirements.trim()) {
      toast.error("Please enter requirements to analyze");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("kraft-harmony", {
        body: { type: "analyze", requirements, venue: selectedVenue },
      });

      if (error) throw error;
      if (data?.success && data.data) {
        setAnalysisResult(data.data);
        toast.success("Requirements analyzed for Kraft Group");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze requirements");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSpecs = async () => {
    if (!requirements.trim()) {
      toast.error("Please enter requirements to generate specs");
      return;
    }

    setIsGeneratingSpecs(true);
    setSpecsResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("kraft-harmony", {
        body: { type: "specs", requirements, venue: selectedVenue },
      });

      if (error) throw error;
      if (data?.success && data.data) {
        setSpecsResult(data.data);
        toast.success("Specifications generated for Kraft Group");
      }
    } catch (error) {
      console.error("Specs error:", error);
      toast.error("Failed to generate specifications");
    } finally {
      setIsGeneratingSpecs(false);
    }
  };

  const streamChat = async (userMessage: string) => {
    setIsChatLoading(true);
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setChatInput("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kraft-harmony`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: "chat",
            messages: newMessages,
            context: `Venue: ${selectedVenue}`,
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
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    streamChat(chatInput.trim());
  };

  return (
    <div className="min-h-screen bg-[#002244]">
      {/* Kraft Group Header */}
      <header className="bg-gradient-to-r from-[#002244] via-[#002244] to-[#c8102e] border-b border-[#c8102e]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#c8102e] rounded-xl flex items-center justify-center shadow-lg shadow-[#c8102e]/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Kraft AI Harmony</h1>
                <p className="text-sm text-[#c8102e] font-medium">Venue & Sports Operations Intelligence</p>
              </div>
            </div>
            <Link to="/strata" className="text-sm text-neutral-400 hover:text-white transition-colors">
              ← Back to STRATA
            </Link>
          </div>
          
          {/* Venue Selector */}
          <div className="flex items-center gap-4 mt-6">
            <MapPin className="w-4 h-4 text-[#c8102e]" />
            <div className="flex gap-2">
              {venues.map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedVenue === venue.id
                      ? "bg-[#c8102e] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {venue.name}
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-neutral-300 max-w-2xl mt-6">
            AI-powered development orchestrator tailored for Kraft Group's venue technology, 
            fan experience systems, and game day operations.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Building2, label: "Venues", value: "3 Properties" },
            { icon: Users, label: "Capacity", value: "65,878+" },
            { icon: CloudSun, label: "STRATA", value: "Integrated" },
            { icon: ShieldCheck, label: "Operations", value: "24/7" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
              <stat.icon className="w-5 h-5 text-[#c8102e] mb-2" />
              <p className="text-xs text-neutral-400">{stat.label}</p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue={initialTab} className="space-y-8">
          <TabsList className="bg-white/5 backdrop-blur border border-white/10 p-1 rounded-lg">
            <TabsTrigger value="analyze" className="data-[state=active]:bg-[#c8102e] data-[state=active]:text-white text-white/70 gap-2">
              <Zap className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-[#c8102e] data-[state=active]:text-white text-white/70 gap-2">
              <FileCode className="w-4 h-4" />
              Specs
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-[#c8102e] data-[state=active]:text-white text-white/70 gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white">
                  Describe your venue/operations requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="E.g., Create a real-time crowd density monitoring system that integrates with STRATA weather data to automatically adjust concession staffing during rain delays..."
                  className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#c8102e]/50 focus:border-[#c8102e] resize-none"
                />
                <Button
                  onClick={analyzeRequirements}
                  disabled={isAnalyzing || !requirements.trim()}
                  className="w-full bg-[#c8102e] hover:bg-[#a00d25] text-white py-6 rounded-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing for Kraft Group...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Requirements
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-6">
                {analysisResult ? (
                  <>
                    {/* Summary */}
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Analysis Summary</h3>
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded ${complexityColors[analysisResult.complexity]} bg-current/10`}>
                          {analysisResult.complexity}
                        </span>
                      </div>
                      <p className="text-neutral-300 mb-4">{analysisResult.summary}</p>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Clock className="w-4 h-4" />
                        <span>Estimated: {analysisResult.estimatedHours} hours</span>
                      </div>
                    </div>

                    {/* Venue Impact */}
                    {analysisResult.venueImpact && (
                      <div className="bg-[#c8102e]/10 border border-[#c8102e]/30 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#c8102e]" />
                          Venue Impact
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-[#c8102e] font-medium uppercase mb-1">Operations</p>
                            <p className="text-sm text-neutral-300">{analysisResult.venueImpact.operations}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#c8102e] font-medium uppercase mb-1">Fan Experience</p>
                            <p className="text-sm text-neutral-300">{analysisResult.venueImpact.fanExperience}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#c8102e] font-medium uppercase mb-1">Revenue</p>
                            <p className="text-sm text-neutral-300">{analysisResult.venueImpact.revenue}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STRATA Integration */}
                    {analysisResult.strataIntegration && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudSun className="w-4 h-4 text-blue-400" />
                          <h4 className="text-sm font-medium text-white">STRATA Integration</h4>
                        </div>
                        <p className="text-sm text-neutral-300">{analysisResult.strataIntegration}</p>
                      </div>
                    )}

                    {/* Tasks */}
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Development Tasks ({analysisResult.tasks?.length || 0})
                      </h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {analysisResult.tasks?.map((task) => {
                          const TypeIcon = typeIcons[task.type] || Code;
                          return (
                            <div key={task.id} className="p-4 bg-white/5 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#c8102e]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <TypeIcon className="w-4 h-4 text-[#c8102e]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-white truncate">{task.title}</h4>
                                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  <p className="text-sm text-neutral-400">{task.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                                    <span>{task.type}</span>
                                    <span>~{task.estimatedHours}h</span>
                                    {task.venueSystem && (
                                      <span className="text-[#c8102e]">{task.venueSystem}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <Building2 className="w-12 h-12 text-[#c8102e]/50 mx-auto mb-4" />
                    <p className="text-neutral-400">
                      Enter your venue/operations requirements to get a Kraft-specific analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Specs Tab */}
          <TabsContent value="specs" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white">
                  Describe what you want to build for Kraft Group
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="E.g., Build a game day dashboard showing real-time concession sales, crowd flow, parking utilization, and weather alerts..."
                  className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#c8102e]/50 focus:border-[#c8102e] resize-none"
                />
                <Button
                  onClick={generateSpecs}
                  disabled={isGeneratingSpecs || !requirements.trim()}
                  className="w-full bg-[#c8102e] hover:bg-[#a00d25] text-white py-6 rounded-lg"
                >
                  {isGeneratingSpecs ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Kraft Specs...
                    </>
                  ) : (
                    <>
                      <FileCode className="w-4 h-4 mr-2" />
                      Generate Specifications
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-6">
                {specsResult ? (
                  <>
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4">Architecture Overview</h3>
                      <p className="text-neutral-300 mb-4">{specsResult.architecture?.overview}</p>
                      <p className="text-sm text-neutral-500 italic">{specsResult.architecture?.dataFlow}</p>
                    </div>

                    {/* Game Day Considerations */}
                    {specsResult.gameDayConsiderations && specsResult.gameDayConsiderations.length > 0 && (
                      <div className="bg-[#c8102e]/10 border border-[#c8102e]/30 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#c8102e]" />
                          Game Day Considerations
                        </h3>
                        <ul className="space-y-2">
                          {specsResult.gameDayConsiderations.map((consideration, i) => (
                            <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-[#c8102e] mt-0.5 flex-shrink-0" />
                              {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Components */}
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Components ({specsResult.architecture?.components?.length || 0})
                      </h3>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {specsResult.architecture?.components?.map((comp, i) => (
                          <div key={i} className="p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Code className="w-4 h-4 text-[#c8102e]" />
                              <span className="font-mono text-sm font-medium text-white">{comp.name}</span>
                            </div>
                            <p className="text-sm text-neutral-400 mb-2">{comp.purpose}</p>
                            <p className="text-xs text-neutral-500 font-mono">{comp.path}</p>
                            {comp.venueIntegration && (
                              <p className="text-xs text-[#c8102e] mt-2">⚡ {comp.venueIntegration}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Implementation Order */}
                    {specsResult.implementationOrder?.length > 0 && (
                      <div className="bg-[#002244] border border-[#c8102e]/30 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Implementation Order</h3>
                        <div className="space-y-3">
                          {specsResult.implementationOrder.map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-[#c8102e] rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {i + 1}
                              </div>
                              <p className="text-sm text-neutral-300">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <FileCode className="w-12 h-12 text-[#c8102e]/50 mx-auto mb-4" />
                    <p className="text-neutral-400">
                      Enter your requirements to generate Kraft-specific technical specifications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-8">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden h-[600px] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-[#c8102e]/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Kraft AI Operations Assistant</h3>
                    <p className="text-neutral-400 max-w-md mx-auto">
                      Ask about venue technology, fan experience systems, STRATA integration, 
                      game day operations, or any Kraft Group-specific development needs.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                      {[
                        "How do I integrate with STRATA weather?",
                        "Optimize concession staffing",
                        "Real-time crowd analytics",
                        "Parking system integration",
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => streamChat(suggestion)}
                          className="px-4 py-2 bg-white/5 hover:bg-[#c8102e]/20 border border-white/10 hover:border-[#c8102e]/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-xl text-sm ${
                          msg.role === "user"
                            ? "bg-[#c8102e] text-white"
                            : "bg-white/10 text-neutral-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <Loader2 className="w-5 h-5 text-[#c8102e] animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about Kraft Group venue operations..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c8102e]/50"
                    disabled={isChatLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="bg-[#c8102e] hover:bg-[#a00d25] text-white px-6 rounded-lg"
                  >
                    {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KraftHarmonyPage;
