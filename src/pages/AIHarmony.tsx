import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Sparkles, Zap, FileCode, MessageSquare, Loader2, 
  CheckCircle2, AlertTriangle, Clock, ChevronRight,
  Code, Database, Palette, Plug, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description: string;
  type: "frontend" | "backend" | "database" | "integration" | "design";
  priority: "high" | "medium" | "low";
  estimatedHours: number;
  dependencies: number[];
}

interface AnalysisResult {
  summary: string;
  complexity: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  tasks: Task[];
  risks: string[];
  recommendations: string[];
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
    }[];
    dataFlow: string;
  };
  database: {
    tables: {
      name: string;
      columns: { name: string; type: string; nullable: boolean }[];
      rlsPolicies: string[];
    }[];
  };
  edgeFunctions: {
    name: string;
    purpose: string;
    endpoints: string[];
    authentication: string;
  }[];
  integrations: string[];
  implementationOrder: string[];
}

const typeIcons = {
  frontend: Code,
  backend: Zap,
  database: Database,
  integration: Plug,
  design: Palette,
};

const priorityColors = {
  high: "text-red-500 bg-red-500/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  low: "text-green-500 bg-green-500/10",
};

const complexityColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

const AIHarmonyPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "analyze";
  
  const [requirements, setRequirements] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSpecs, setIsGeneratingSpecs] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [specsResult, setSpecsResult] = useState<SpecsResult | null>(null);

  const analyzeRequirements = async () => {
    if (!requirements.trim()) {
      toast.error("Please enter requirements to analyze");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-harmony", {
        body: { type: "analyze", requirements },
      });

      if (error) throw error;
      if (data?.success && data.data) {
        setAnalysisResult(data.data);
        toast.success("Requirements analyzed successfully");
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
      const { data, error } = await supabase.functions.invoke("ai-harmony", {
        body: { type: "specs", requirements },
      });

      if (error) throw error;
      if (data?.success && data.data) {
        setSpecsResult(data.data);
        toast.success("Specifications generated successfully");
      }
    } catch (error) {
      console.error("Specs error:", error);
      toast.error("Failed to generate specifications");
    } finally {
      setIsGeneratingSpecs(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f1]">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-light text-white">AI Harmony</h1>
              <p className="text-sm text-neutral-400">Intelligent Development Orchestrator</p>
            </div>
          </div>
          <p className="text-neutral-400 max-w-2xl">
            Transform requirements into actionable development tasks, generate technical specifications, 
            and get AI-powered guidance for building Lavandar features.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <Tabs defaultValue={initialTab} className="space-y-8">
          <TabsList className="bg-neutral-100 p-1 rounded-lg">
            <TabsTrigger value="analyze" className="data-[state=active]:bg-white data-[state=active]:text-red-600 gap-2">
              <Zap className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-white data-[state=active]:text-red-600 gap-2">
              <FileCode className="w-4 h-4" />
              Specs
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white data-[state=active]:text-red-600 gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Describe your requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="E.g., Add a real-time notification system that alerts venue staff when crowd density exceeds thresholds..."
                  className="w-full h-64 p-4 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none"
                />
                <Button
                  onClick={analyzeRequirements}
                  disabled={isAnalyzing || !requirements.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Requirements
                    </>
                  )}
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {analysisResult ? (
                  <>
                    {/* Summary */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium text-neutral-900">Analysis Summary</h3>
                        <span className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded ${complexityColors[analysisResult.complexity]} bg-current/10`}>
                          {analysisResult.complexity} complexity
                        </span>
                      </div>
                      <p className="text-neutral-600 mb-4">{analysisResult.summary}</p>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Clock className="w-4 h-4" />
                        <span>Estimated: {analysisResult.estimatedHours} hours</span>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">
                        Development Tasks ({analysisResult.tasks?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {analysisResult.tasks?.map((task) => {
                          const TypeIcon = typeIcons[task.type] || Code;
                          return (
                            <div key={task.id} className="p-4 bg-neutral-50 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <TypeIcon className="w-4 h-4 text-neutral-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-neutral-900 truncate">{task.title}</h4>
                                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  <p className="text-sm text-neutral-500">{task.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                                    <span>{task.type}</span>
                                    <span>~{task.estimatedHours}h</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Risks & Recommendations */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <h4 className="text-sm font-medium text-orange-800">Risks</h4>
                        </div>
                        <ul className="space-y-2">
                          {analysisResult.risks?.map((risk, i) => (
                            <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <h4 className="text-sm font-medium text-green-800">Recommendations</h4>
                        </div>
                        <ul className="space-y-2">
                          {analysisResult.recommendations?.map((rec, i) => (
                            <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
                    <Zap className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">
                      Enter your requirements and click analyze to get a breakdown of development tasks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Specs Tab */}
          <TabsContent value="specs" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Describe what you want to build
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="E.g., Build a real-time fan sentiment dashboard that aggregates social media mentions, in-venue feedback, and behavioral signals..."
                  className="w-full h-64 p-4 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none"
                />
                <Button
                  onClick={generateSpecs}
                  disabled={isGeneratingSpecs || !requirements.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-lg"
                >
                  {isGeneratingSpecs ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileCode className="w-4 h-4 mr-2" />
                      Generate Specifications
                    </>
                  )}
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {specsResult ? (
                  <>
                    {/* Architecture Overview */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Architecture Overview</h3>
                      <p className="text-neutral-600 mb-4">{specsResult.architecture?.overview}</p>
                      <p className="text-sm text-neutral-500 italic">{specsResult.architecture?.dataFlow}</p>
                    </div>

                    {/* Components */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">
                        Components ({specsResult.architecture?.components?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {specsResult.architecture?.components?.map((comp, i) => (
                          <div key={i} className="p-4 bg-neutral-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Code className="w-4 h-4 text-red-600" />
                              <span className="font-mono text-sm font-medium text-neutral-900">{comp.name}</span>
                            </div>
                            <p className="text-sm text-neutral-500 mb-2">{comp.purpose}</p>
                            <p className="text-xs text-neutral-400 font-mono">{comp.path}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Database */}
                    {specsResult.database?.tables?.length > 0 && (
                      <div className="bg-white border border-neutral-200 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Database Schema</h3>
                        <div className="space-y-3">
                          {specsResult.database.tables.map((table, i) => (
                            <div key={i} className="p-4 bg-neutral-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Database className="w-4 h-4 text-red-600" />
                                <span className="font-mono text-sm font-medium">{table.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {table.columns?.map((col, j) => (
                                  <span key={j} className="text-xs bg-neutral-200 text-neutral-600 px-2 py-1 rounded font-mono">
                                    {col.name}: {col.type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Implementation Order */}
                    {specsResult.implementationOrder?.length > 0 && (
                      <div className="bg-neutral-900 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Implementation Order</h3>
                        <div className="space-y-3">
                          {specsResult.implementationOrder.map((step, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {i + 1}
                              </div>
                              <span className="text-neutral-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-12 text-center">
                    <FileCode className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">
                      Describe your feature and get detailed technical specifications including architecture, components, and database schema.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-2xl mx-auto">
              <MessageSquare className="w-16 h-16 text-red-500/50 mx-auto mb-6" />
              <h3 className="text-2xl font-light text-neutral-900 mb-4">Interactive Development Chat</h3>
              <p className="text-neutral-500 mb-6">
                Use the floating AI Harmony assistant (bottom right) for real-time conversational guidance 
                on any page throughout the Lavandar platform.
              </p>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Open Assistant
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIHarmonyPage;