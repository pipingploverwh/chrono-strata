import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Users, GitBranch, Target, Zap, Clock, ArrowRight, FileText, Brain,
  TrendingUp, TrendingDown, AlertCircle, Eye, Layers, BarChart3
} from 'lucide-react';
import LavandarBackground from '@/components/LavandarBackground';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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
  role: 'upstream' | 'downstream';
  posture: string;
  signals: string[];
  operatingModel: Record<string, string>;
}

// Mock data representing the Red Team analysis
const mockTeamAnalysis: TeamAnalysis[] = [
  {
    team: 'Team 14',
    role: 'downstream',
    posture: 'Flow-aware, defensive design, learning-oriented',
    signals: [
      'Moving fast, "don\'t get stuck" posture',
      'Dependency is specific and concrete',
      'Local compensation as default response',
      '"Hostage" language in retrospective'
    ],
    operatingModel: {
      'Flow Awareness': 'High',
      'Design Posture': 'Defensive',
      'Learning': 'Explicit Kaizens',
      'Dependency View': 'System problem'
    }
  },
  {
    team: 'Team 3',
    role: 'upstream',
    posture: 'Throughput-obsessed, reactive workarounds, task-clearing',
    signals: [
      'Extreme WIP: 53 open tasks',
      'Command-and-control facilitation',
      'Dependency pain dismissed',
      'Documentation deprioritized'
    ],
    operatingModel: {
      'Flow Awareness': 'Low',
      'Design Posture': 'Reactive',
      'Learning': 'No capture',
      'Dependency View': "Others' problem"
    }
  }
];

const mockDependencySignals: DependencySignal[] = [
  { team: 'Team 14', type: 'waiting', description: 'Library update from Team 3 blocking staging deployment', severity: 'high' },
  { team: 'Team 14', type: 'compensating', description: 'Wrapper tests and interface POC to reduce upstream exposure', severity: 'medium' },
  { team: 'Team 3', type: 'blocking', description: 'High WIP creating release volatility for dependents', severity: 'high' }
];

const mockRedTeamFindings: RedTeamFinding[] = [
  {
    id: 'RT-001',
    title: 'Decision-by-Absence',
    category: 'decision-framing',
    finding: 'No explicit decision documented for cross-team dependency ownership. The system has made a default decision: dependencies handled locally through workarounds.',
    risk: 'Default decisions are invisible, unreviewed, and persist longer than intended.',
    severity: 'critical'
  },
  {
    id: 'RT-002',
    title: 'Untested Assumptions',
    category: 'assumption-stress',
    finding: 'Four critical assumptions are untested: Team 14 can absorb volatility indefinitely, Team 3 optimizations won\'t destabilize others, delivery speed outweighs coordination cost, teams will self-correct.',
    risk: 'The system is betting on resilience without measuring its cost.',
    severity: 'high'
  },
  {
    id: 'RT-003',
    title: 'Evidence Asymmetry',
    category: 'evidence-adequacy',
    finding: 'Organization over-weighting throughput evidence and under-weighting flow evidence. No end-to-end flow metrics, no visibility into waiting cost.',
    risk: 'Leadership may conclude "things are working" while systemic friction compounds.',
    severity: 'high'
  },
  {
    id: 'RT-004',
    title: 'Masked Degradation',
    category: 'alternative-interpretation',
    finding: 'Plausible alternative to "teams managing pragmatically": teams compensating locally for missing system function, masking degradation.',
    risk: 'The alternative explanation fits the data at least as well as the dominant one.',
    severity: 'medium'
  },
  {
    id: 'RT-005',
    title: 'Structural Brittleness',
    category: 'system-effects',
    finding: 'Local optimization creating architecture divergence, slower onboarding, increased regression risk, normalization of hostage language.',
    risk: 'Local optimization is creating structural brittleness.',
    severity: 'high'
  },
  {
    id: 'RT-006',
    title: 'Closing Window',
    category: 'reversibility',
    finding: 'Situation still reversible but window closing. Defensive patterns accumulating, behavioral norms forming, dependency ownership drifting.',
    risk: 'When workarounds become "the architecture," reversal cost spikes.',
    severity: 'medium'
  },
  {
    id: 'RT-007',
    title: 'Localized Learning',
    category: 'learning-path',
    finding: 'Team 14 exhibits strong learning behavior with explicit Kaizens. Team 3 shows no visible learning loop. No mechanism to promote learning to system level.',
    risk: 'Without system capture, the organization will relearn this lesson repeatedly.',
    severity: 'medium'
  }
];

const mockCounterfactuals: Counterfactual[] = [
  {
    scenario: 'Do Nothing for 6 Months',
    description: 'Leadership maintains status quo. No explicit dependency ownership created.',
    expectedMetrics: [
      'Carryover rising or volatile',
      'Blocked days staying elevated',
      'Flow efficiency trending down',
      'WIP inflation',
      'Gap widening between planned and done'
    ],
    disprovingSignal: 'A stable cross-team sequencing mechanism with explicit owners and reduced blocked-days without adding overhead.',
    conclusion: 'System will ship while converting unresolved dependencies into invisible tax, technical divergence, and normalized waiting.'
  },
  {
    scenario: 'Overreact and Centralize',
    description: 'Leadership introduces central dependency board, mandatory escalation, pre-approval for cross-team work.',
    expectedMetrics: [
      'Decision latency increasing',
      'Coach credibility declining',
      'Teams optimizing for compliance',
      'COE becoming bottleneck',
      'Local learning collapsing'
    ],
    disprovingSignal: 'Centralized coordination that maintains team autonomy and learning velocity.',
    conclusion: 'Centralization converts coordination problems into queueing problems, killing local learning.'
  }
];

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

const BeenaRedTeam: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['synthesis', 'findings']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LavandarBackground variant="dark" showWaves showPolygons intensity={0.6} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
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
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Team 14 Daily Sync
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Team 3 Daily Sync
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Team 14 Retrospective
            </Badge>
          </div>
        </motion.header>

        {/* One-Sentence Verdict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl bg-gradient-to-r from-red-500/10 via-purple-500/10 to-violet-500/10 border border-red-500/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-sm uppercase tracking-wider text-red-400/80 mb-2">Red Team Verdict</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                The current approach works only because downstream teams are paying an invisible tax. 
                That tax is increasing, unmeasured, and unsustainable.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Analysis Grid */}
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
              {mockTeamAnalysis.map((team, index) => (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-white">{team.team}</h3>
                    <Badge className={team.role === 'downstream' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'}>
                      {team.role}
                    </Badge>
                  </div>
                  
                  <p className="text-purple-300/70 text-sm mb-4">{team.posture}</p>
                  
                  <div className="space-y-2 mb-4">
                    {team.signals.map((signal, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{signal}</span>
                      </div>
                    ))}
                  </div>
                  
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
                </motion.div>
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Cross-Document Synthesis */}
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
              <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Asymmetry of System Awareness
                </h4>
                <p className="text-sm text-white/70">
                  Team 14 sees dependencies as a shared system problem. Team 3 treats dependencies as someone else's issue.
                  <span className="block mt-2 text-purple-300/80 italic">
                    This asymmetry creates structural waiting, not interpersonal conflict.
                  </span>
                </p>
              </Card>
              
              <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Two Operating Models Coexist
                </h4>
                <p className="text-sm text-white/70">
                  Flow-aware vs throughput-obsessed. Defensive design vs reactive workarounds.
                  <span className="block mt-2 text-purple-300/80 italic">
                    This is a system-level misalignment, not a team performance issue.
                  </span>
                </p>
              </Card>
              
              <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Waiting Is Unowned
                </h4>
                <p className="text-sm text-white/70">
                  Team 14 experiences waiting as externally imposed. Team 3 normalizes waiting as background noise.
                  <span className="block mt-2 text-purple-300/80 italic">
                    Waiting is a decision — but no one owns it.
                  </span>
                </p>
              </Card>
              
              <Card className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Invisible to Leadership
                </h4>
                <p className="text-sm text-white/70">
                  No visible owner for cross-team sequencing. Both teams appear "busy." Work is shipping.
                  <span className="block mt-2 text-purple-300/80 italic">
                    This is a quiet systemic failure mode.
                  </span>
                </p>
              </Card>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {/* Red Team Findings */}
        <Collapsible open={expandedSections.includes('findings')} onOpenChange={() => toggleSection('findings')}>
          <CollapsibleTrigger className="w-full mb-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Red Team Findings</span>
                <Badge className="bg-red-500/20 text-red-300">{mockRedTeamFindings.length} Issues</Badge>
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
              {mockRedTeamFindings.map((finding, index) => {
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
                            {finding.category.replace('-', ' ')}
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

        {/* Counterfactuals */}
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
              {mockCounterfactuals.map((cf, index) => (
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
                      {cf.expectedMetrics.map((metric, i) => (
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

        {/* Recommended Path */}
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
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-light text-purple-400 mb-2">01</div>
              <h4 className="text-white font-medium mb-1">Create Dependency Decision Object</h4>
              <p className="text-sm text-white/60">For Team 3 ↔ Team 14 sequencing</p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-light text-purple-400 mb-2">02</div>
              <h4 className="text-white font-medium mb-1">Assign Decision Owner</h4>
              <p className="text-sm text-white/60">Not a committee — one person</p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-light text-purple-400 mb-2">03</div>
              <h4 className="text-white font-medium mb-1">15-Minute Weekly Checkpoint</h4>
              <p className="text-sm text-white/60">With disconfirming signals defined</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-white/5">
            <p className="text-sm text-white/80">
              <span className="text-purple-400 font-medium">Key insight:</span> This is not coach-solvable at the team level without escalation of a decision gap. 
              The correct intervention is to make dependency ownership explicit — not to solve the dependency.
            </p>
          </div>
        </motion.div>

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
