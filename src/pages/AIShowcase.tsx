import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Sparkles, FileText, Thermometer, MessageSquare, Search,
  Eye, Target, Zap, Upload, Play, Loader2, CheckCircle, AlertCircle,
  ArrowRight, ExternalLink, Cpu, Layers, Wand2, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LavandarBackground from '@/components/LavandarBackground';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  useCases: string[];
  badge: 'default' | 'fast' | 'pro';
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash Preview',
    provider: 'Google',
    description: 'Default model. Balanced speed and capability for efficient tasks.',
    useCases: ['Chat assistants', 'Document analysis', 'General reasoning'],
    badge: 'default'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'OCR, chat parsing, and multimodal tasks with good reasoning.',
    useCases: ['OCR extraction', 'Image analysis', 'Chat parsing'],
    badge: 'fast'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Top-tier for complex reasoning, large context, and visual+text tasks.',
    useCases: ['Red Team analysis', 'Complex documents', 'Heavy reasoning'],
    badge: 'pro'
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    description: 'Powerful all-rounder with excellent reasoning and multimodal support.',
    useCases: ['Advanced reasoning', 'Long context', 'Complex analysis'],
    badge: 'pro'
  }
];

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  model: string;
  edgeFunction: string;
  demoType: 'text' | 'chat' | 'upload';
  link?: string;
}

const AI_FEATURES: AIFeature[] = [
  {
    id: 'beena',
    name: 'BeenaAI Red Team',
    description: 'Organizational transformation analysis with AI-powered Red Team findings.',
    icon: Target,
    model: 'gemini-2.5-pro',
    edgeFunction: 'beena-analysis',
    demoType: 'upload',
    link: '/beena'
  },
  {
    id: 'thermal',
    name: 'Thermal Magic',
    description: 'Psychoacoustic audio analysis and ambient track generation.',
    icon: Thermometer,
    model: 'gemini-2.5-flash',
    edgeFunction: 'thermal-magic',
    demoType: 'upload',
    link: '/thermal-visualizer'
  },
  {
    id: 'ocr',
    name: 'AI OCR',
    description: 'Extract text from images with high accuracy using vision AI.',
    icon: Eye,
    model: 'gemini-2.5-flash',
    edgeFunction: 'ai-ocr',
    demoType: 'upload',
    link: '/screenshots'
  },
  {
    id: 'chat-parser',
    name: 'Chat Parser',
    description: 'Parse chat screenshots into structured conversation data.',
    icon: MessageSquare,
    model: 'gemini-2.5-flash',
    edgeFunction: 'ai-chat-parser',
    demoType: 'upload'
  },
  {
    id: 'harmony',
    name: 'AI Harmony',
    description: 'Platform intelligence for requirements analysis and specifications.',
    icon: Sparkles,
    model: 'gemini-3-flash',
    edgeFunction: 'ai-harmony',
    demoType: 'chat'
  },
  {
    id: 'kraft',
    name: 'Kraft Harmony',
    description: 'Specialized AI for venue operations and fan experience optimization.',
    icon: Zap,
    model: 'gemini-3-flash',
    edgeFunction: 'kraft-harmony',
    demoType: 'chat',
    link: '/kraft-harmony'
  },
  {
    id: 'predictions',
    name: 'Game Predictions',
    description: 'Real-time sports predictions based on game state and weather.',
    icon: Target,
    model: 'gemini-3-flash',
    edgeFunction: 'game-predictions',
    demoType: 'text'
  },
  {
    id: 'sourcing',
    name: 'Lavender Sourcing Agent',
    description: 'AI-powered product sourcing and arbitrage opportunity detection.',
    icon: Search,
    model: 'gemini-3-flash',
    edgeFunction: 'lavender-sourcing-agent',
    demoType: 'text',
    link: '/lavender-agent'
  }
];

// Live Demo Component
const LiveDemo = ({ feature }: { feature: AIFeature }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDemo = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let response;
      
      switch (feature.id) {
        case 'harmony':
          response = await supabase.functions.invoke('ai-harmony', {
            body: { type: 'analyze', requirements: input }
          });
          break;
        case 'predictions':
          response = await supabase.functions.invoke('game-predictions', {
            body: { 
              gameState: {
                homeTeam: 'Patriots',
                awayTeam: 'Jets',
                homeScore: 14,
                awayScore: 7,
                quarter: 3,
                timeRemaining: '8:45',
                weather: { conditions: 'Clear', temperature: 45, windSpeed: 12 }
              }
            }
          });
          break;
        case 'sourcing':
          response = await supabase.functions.invoke('lavender-sourcing-agent', {
            body: { 
              scrapedContent: input,
              sourceUrl: 'https://example.com',
              mode: 'analyze'
            }
          });
          break;
        default:
          response = await supabase.functions.invoke('ai-harmony', {
            body: { type: 'chat', messages: [{ role: 'user', content: input }] }
          });
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      const resultText = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
      
      setResult(resultText);
      toast.success('AI analysis complete');
    } catch (error) {
      console.error('Demo error:', error);
      toast.error('Failed to run demo');
      setResult('Error: Could not complete the analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          feature.id === 'predictions' 
            ? 'Describe a game scenario...'
            : feature.id === 'sourcing'
            ? 'Paste product page content to analyze...'
            : 'Enter your requirements or question...'
        }
        className="min-h-[100px] bg-surface-1 border-border"
      />
      <Button 
        onClick={runDemo} 
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Run Analysis
          </>
        )}
      </Button>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-surface-2 border border-border"
        >
          <pre className="text-xs text-foreground/80 whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto">
            {result}
          </pre>
        </motion.div>
      )}
    </div>
  );
};

const AIShowcase: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LavandarBackground variant="dark" showWaves showPolygons intensity={0.5} />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
            AI Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the AI-powered features of Chrono-Strata. All models run through 
            the Lovable AI Gateway with automatic rate limiting and usage tracking.
          </p>
        </motion.div>

        {/* Models Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium text-foreground">AI Models</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AI_MODELS.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="p-5 h-full bg-card/50 backdrop-blur border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant={model.badge === 'default' ? 'default' : 'outline'}
                      className={
                        model.badge === 'pro' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                          : model.badge === 'fast'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : ''
                      }
                    >
                      {model.badge === 'default' ? 'Default' : model.badge === 'fast' ? 'Fast' : 'Pro'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{model.provider}</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{model.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.useCases.map((use) => (
                      <span key={use} className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-muted-foreground">
                        {use}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium text-foreground">AI-Powered Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                >
                  <Card 
                    className={`p-5 h-full bg-card/50 backdrop-blur border-border hover:border-primary/30 transition-all cursor-pointer ${
                      selectedFeature?.id === feature.id ? 'border-primary ring-1 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedFeature(selectedFeature?.id === feature.id ? null : feature)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{feature.name}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-muted-foreground">
                          {feature.model}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                          {feature.edgeFunction}
                        </span>
                      </div>
                      {feature.link && (
                        <a 
                          href={feature.link}
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Live Demo Section */}
        {selectedFeature && selectedFeature.demoType === 'text' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-3 mb-6">
                <Wand2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-medium text-foreground">
                  Live Demo: {selectedFeature.name}
                </h2>
              </div>
              <LiveDemo feature={selectedFeature} />
            </Card>
          </motion.section>
        )}

        {/* Architecture Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-medium text-foreground">Architecture</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: 'hsl(var(--margin-high))' }} />
                  <span className="font-medium text-foreground">Edge Functions</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  All AI processing runs through Supabase Edge Functions, keeping API keys secure 
                  and enabling server-side streaming.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: 'hsl(var(--margin-high))' }} />
                  <span className="font-medium text-foreground">Lovable AI Gateway</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unified API gateway providing access to Google Gemini and OpenAI models 
                  without managing individual API keys.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: 'hsl(var(--margin-high))' }} />
                  <span className="font-medium text-foreground">Rate Limiting</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Built-in rate limiting with 429/402 error handling. Graceful degradation 
                  and user-friendly error messages.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {[
            { label: 'BeenaAI Red Team', href: '/beena', icon: Target },
            { label: 'Thermal Visualizer', href: '/thermal-visualizer', icon: Thermometer },
            { label: 'Screenshot Tools', href: '/screenshots', icon: Eye },
            { label: 'Kraft Harmony', href: '/kraft-harmony', icon: Zap }
          ].map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border hover:border-primary/30 transition-all text-sm text-foreground"
              >
                <Icon className="w-4 h-4 text-primary" />
                {link.label}
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default AIShowcase;
