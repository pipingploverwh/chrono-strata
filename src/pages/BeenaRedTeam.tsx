import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Users, GitBranch, Target, Zap, Clock, ArrowRight, FileText, Brain,
  TrendingUp, TrendingDown, AlertCircle, Eye, Layers, BarChart3, Upload, Download
} from 'lucide-react';
import LavandarBackground from '@/components/LavandarBackground';
import DocumentUploader from '@/components/DocumentUploader';
import BeenaReportExport from '@/components/BeenaReportExport';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// BeenaAI Sprint Analysis Schema types
interface DependencySignal {
  team: string;
  type: 'blocking' | 'waiting' | 'compensating';
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface RedTeamFinding {
  id: string;
  title: string;
  category: 'decision-framing' | 'assumption-stress' | 'evidence-adequacy' | 'alternative-interpretation' | 'system-effects' | 'reversibility' | 'learning-path';
  risk: string;
  finding: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface Counterfactual {
  scenario: string;
  description: string;
  expectedMetrics: string[];
  disprovingSignal: string;
  conclusion: string;
}

interface TeamAnalysis {
  team: string;
  role: 'upstream' | 'downstream' | 'peer';
  posture: string;
  signals: string[];
  operatingModel: Record<string, string>;
}

interface CrossSynthesis {
  title: string;
  icon: string;
  observation: string;
  implication: string;
}

interface Intervention {
  step: number;
  title: string;
  description: string;
}

interface Analysis {
  verdict: string;
  sourceDocuments: string[];
  teamAnalysis: TeamAnalysis[];
  dependencySignals: DependencySignal[];
  crossDocumentSynthesis: CrossSynthesis[];
  redTeamFindings: RedTeamFinding[];
  counterfactuals: Counterfactual[];
  interventions: Intervention[];
  keyInsight: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
    default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'decision-framing': return Target;
    case 'assumption-stress': return AlertTriangle;
    case 'evidence-adequacy': return Eye;
    case 'alternative-interpretation': return Brain;
    case 'system-effects': return Layers;
    case 'reversibility': return Clock;
    case 'learning-path': return TrendingUp;
    default: return Shield;
  }
};

const getSynthesisIcon = (iconName: string) => {
  switch (iconName) {
    case 'Zap': return Zap;
    case 'Layers': return Layers;
    case 'Clock': return Clock;
    case 'Eye': return Eye;
    case 'Brain': return Brain;
    case 'Target': return Target;
    default: return Zap;
  }
};

const BeenaRedTeam: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['synthesis', 'findings']);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleAnalysisComplete = (newAnalysis: Analysis) => {
    setAnalysis(newAnalysis);
    setActiveTab('results');
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LavandarBackground variant="dark" showWaves showPolygons intensity={0.6} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-white">
                BeenaAI Sprint Analysis
              </h1>
              <p className="text-purple-300/70 text-sm">
                Red Team Lens • Cross-Document Synthesis
              </p>
            </div>
          </div>
        </motion.header>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'results')} className="mb-8">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="upload" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              disabled={!analysis}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analysis Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-white mb-2">Upload Sprint Transcripts</h2>
                  <p className="text-white/60 text-sm">
                    Upload meeting transcripts, daily syncs, retrospectives, or sprint planning notes. 
                    BeenaAI will analyze them for systemic issues and organizational anti-patterns.
                  </p>
                </div>
                
                <DocumentUploader 
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisStart={handleAnalysisStart}
                />
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {analysis && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Action Bar with Export */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {analysis.sourceDocuments?.map((doc, i) => (
                      <Badge key={i} className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                  
                  <BeenaReportExport analysis={analysis} />
                </div>

                {/* One-Sentence Verdict */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-r from-red-500/10 via-purple-500/10 to-violet-500/10 border border-red-500/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-sm uppercase tracking-wider text-red-400/80 mb-2">Red Team Verdict</h2>
                      <p className="text-lg text-white/90 leading-relaxed">
                        {analysis.verdict}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Team Analysis Grid */}
                {analysis.teamAnalysis?.length > 0 && (
                  <Collapsible open={expandedSections.includes('teams')} onOpenChange={() => toggleSection('teams')}>
                    <CollapsibleTrigger className="w-full mb-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">Team Analysis</span>
                          <Badge className="bg-purple-500/20 text-purple-300">{analysis.teamAnalysis.length} Teams</Badge>
                        </div>
                        {expandedSections.includes('teams') ? (
                          <ChevronDown className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-purple-400" />
                        )}
                      </motion.div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid md:grid-cols-2 gap-6 mb-8"
                      >
                        {analysis.teamAnalysis.map((team, index) => (
                          <motion.div
                            key={team.team}
                            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-medium text-white">{team.team}</h3>
                              <Badge className={team.role === 'downstream' ? 'bg-blue-500/20 text-blue-300' : team.role === 'upstream' ? 'bg-orange-500/20 text-orange-300' : 'bg-green-500/20 text-green-300'}>
                                {team.role}
                              </Badge>
                            </div>
                            
                            <p className="text-purple-300/70 text-sm mb-4">{team.posture}</p>
                            
                            <div className="space-y-2 mb-4">
                              {team.signals?.map((signal, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                                  <span className="text-purple-400 mt-1">•</span>
                                  <span>{signal}</span>
                                </div>
                              ))}
                            </div>
                            
                            {team.operatingModel && (
                              <div className="border-t border-white/10 pt-4 mt-4">
                                <h4 className="text-xs uppercase tracking-wider text-purple-400/60 mb-3">Operating Model</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(team.operatingModel).map(([key, value]) => (
                                    <div key={key} className="text-xs">
                                      <span className="text-white/50">{key}:</span>
                                      <span className="text-white/90 ml-1">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Cross-Document Synthesis */}
                {analysis.crossDocumentSynthesis?.length > 0 && (
                  <Collapsible open={expandedSections.includes('synthesis')} onOpenChange={() => toggleSection('synthesis')}>
                    <CollapsibleTrigger className="w-full mb-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <GitBranch className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">Cross-Document Synthesis</span>
                        </div>
                        {expandedSections.includes('synthesis') ? (
                          <ChevronDown className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid md:grid-cols-2 gap-4 mb-8"
                      >
                        {analysis.crossDocumentSynthesis.map((item, index) => {
                          const IconComponent = getSynthesisIcon(item.icon);
                          return (
                            <Card key={index} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                              <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                                <IconComponent className="w-4 h-4" /> {item.title}
                              </h4>
                              <p className="text-sm text-white/70">
                                {item.observation}
                                <span className="block mt-2 text-purple-300/80 italic">
                                  {item.implication}
                                </span>
                              </p>
                            </Card>
                          );
                        })}
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Red Team Findings */}
                {analysis.redTeamFindings?.length > 0 && (
                  <Collapsible open={expandedSections.includes('findings')} onOpenChange={() => toggleSection('findings')}>
                    <CollapsibleTrigger className="w-full mb-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">Red Team Findings</span>
                          <Badge className="bg-red-500/20 text-red-300">{analysis.redTeamFindings.length} Issues</Badge>
                        </div>
                        {expandedSections.includes('findings') ? (
                          <ChevronDown className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 mb-8"
                      >
                        {analysis.redTeamFindings.map((finding, index) => {
                          const IconComponent = getCategoryIcon(finding.category);
                          return (
                            <motion.div
                              key={finding.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-purple-500/20">
                                    <IconComponent className="w-4 h-4 text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-white font-medium">{finding.title}</h4>
                                    <span className="text-xs text-purple-400/60 uppercase tracking-wider">
                                      {finding.category.replace(/-/g, ' ')}
                                    </span>
                                  </div>
                                </div>
                                <Badge className={`${getSeverityColor(finding.severity)} border`}>
                                  {finding.severity}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-white/70 mb-3">{finding.finding}</p>
                              
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300/90">{finding.risk}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Counterfactuals */}
                {analysis.counterfactuals?.length > 0 && (
                  <Collapsible open={expandedSections.includes('counterfactuals')} onOpenChange={() => toggleSection('counterfactuals')}>
                    <CollapsibleTrigger className="w-full mb-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 text-purple-400" />
                          <span className="text-white font-medium">Counterfactual Analysis</span>
                        </div>
                        {expandedSections.includes('counterfactuals') ? (
                          <ChevronDown className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid md:grid-cols-2 gap-6 mb-8"
                      >
                        {analysis.counterfactuals.map((cf, index) => (
                          <motion.div
                            key={cf.scenario}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              {index === 0 ? (
                                <TrendingDown className="w-5 h-5 text-orange-400" />
                              ) : (
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                              )}
                              <h4 className="text-lg font-medium text-white">{cf.scenario}</h4>
                            </div>
                            
                            <p className="text-sm text-white/60 mb-4">{cf.description}</p>
                            
                            <div className="mb-4">
                              <h5 className="text-xs uppercase tracking-wider text-purple-400/60 mb-2">Expected Metrics</h5>
                              <div className="space-y-1">
                                {cf.expectedMetrics?.map((metric, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="text-red-400">↑</span>
                                    <span>{metric}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-3">
                              <h5 className="text-xs uppercase tracking-wider text-green-400/80 mb-1">Disproving Signal</h5>
                              <p className="text-sm text-green-300/80">{cf.disprovingSignal}</p>
                            </div>
                            
                            <p className="text-sm text-white/80 italic border-l-2 border-purple-500/50 pl-3">
                              {cf.conclusion}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Recommended Path */}
                {analysis.interventions?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/30 mb-8"
                  >
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Minimum Viable Intervention
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      {analysis.interventions.map((intervention) => (
                        <div key={intervention.step} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-2xl font-light text-purple-400 mb-2">{String(intervention.step).padStart(2, '0')}</div>
                          <h4 className="text-white font-medium mb-1">{intervention.title}</h4>
                          <p className="text-sm text-white/60">{intervention.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    {analysis.keyInsight && (
                      <div className="mt-6 p-4 rounded-lg bg-white/5">
                        <p className="text-sm text-white/80">
                          <span className="text-purple-400 font-medium">Key insight:</span> {analysis.keyInsight}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8 border-t border-white/10"
        >
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
            BeenaAI Sprint Analysis Schema
          </p>
          <p className="text-sm text-purple-400/60">
            Red Team • Evidence-Based • Reversible Decisions
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default BeenaRedTeam;
