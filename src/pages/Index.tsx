import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, Shield, Lock, FileCheck, 
  CheckCircle, Clock, Package, Fingerprint,
  BarChart3, Users, ShieldCheck, Sparkles,
  Linkedin, Building2, Zap, Brain, ExternalLink,
  Timer, DollarSign, Cpu, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AllocationProtocol from "@/components/allocation/AllocationProtocol";
import lavandarLogo from "@/assets/lavandar-logo.png";

// AI Model Benchmarking Data
interface ModelBenchmark {
  id: string;
  name: string;
  provider: string;
  responseTime: string;
  tokensPerSecond: number;
  inputCost: string;
  outputCost: string;
  tier: 'economy' | 'balanced' | 'premium';
  bestFor: string[];
}

const AI_MODELS: ModelBenchmark[] = [
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash Preview',
    provider: 'Google',
    responseTime: '~180ms',
    tokensPerSecond: 320,
    inputCost: '$0.10/1M',
    outputCost: '$0.40/1M',
    tier: 'balanced',
    bestFor: ['Chat', 'Fast inference', 'General tasks']
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    responseTime: '~220ms',
    tokensPerSecond: 280,
    inputCost: '$0.075/1M',
    outputCost: '$0.30/1M',
    tier: 'economy',
    bestFor: ['OCR', 'Image analysis', 'Multimodal']
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    responseTime: '~120ms',
    tokensPerSecond: 450,
    inputCost: '$0.02/1M',
    outputCost: '$0.08/1M',
    tier: 'economy',
    bestFor: ['Classification', 'High-volume', 'Simple tasks']
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    responseTime: '~450ms',
    tokensPerSecond: 150,
    inputCost: '$1.25/1M',
    outputCost: '$5.00/1M',
    tier: 'premium',
    bestFor: ['Complex reasoning', 'Large context', 'Analysis']
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    responseTime: '~380ms',
    tokensPerSecond: 180,
    inputCost: '$2.00/1M',
    outputCost: '$8.00/1M',
    tier: 'premium',
    bestFor: ['Advanced reasoning', 'Code generation', 'Long context']
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    responseTime: '~200ms',
    tokensPerSecond: 260,
    inputCost: '$0.40/1M',
    outputCost: '$1.60/1M',
    tier: 'balanced',
    bestFor: ['Strong performance', 'Cost-effective', 'Multimodal']
  },
  {
    id: 'gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    responseTime: '~100ms',
    tokensPerSecond: 500,
    inputCost: '$0.10/1M',
    outputCost: '$0.40/1M',
    tier: 'economy',
    bestFor: ['Speed', 'High-volume', 'Efficient tasks']
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const howItWorks = [
    { 
      step: "01", 
      icon: FileCheck, 
      title: "Apply", 
      desc: "Submit your allocation request with required verification documents" 
    },
    { 
      step: "02", 
      icon: Fingerprint, 
      title: "Verify", 
      desc: "Identity and compliance checks ensure qualified buyers only" 
    },
    { 
      step: "03", 
      icon: ShieldCheck, 
      title: "Approve", 
      desc: "Receive allocation confirmation with serialized unit assignment" 
    },
    { 
      step: "04", 
      icon: Package, 
      title: "Secure", 
      desc: "Complete payment and receive your authenticated allocation" 
    },
  ];

  const features = [
    { icon: Shield, title: "Verified Buyers", desc: "Multi-layer identity verification ensures only qualified applicants" },
    { icon: Lock, title: "Serialized Tracking", desc: "Every unit monitored from allocation through fulfillment" },
    { icon: BarChart3, title: "Audit-Ready", desc: "Complete transaction trail for compliance and accountability" },
    { icon: Users, title: "Controlled Access", desc: "Invitation-only allocation protects brand exclusivity" },
  ];

  const trustStats = [
    { value: "$2.4M", label: "Allocated This Quarter" },
    { value: "94.2%", label: "Approval Rate" },
    { value: "36h", label: "Avg. Processing" },
    { value: "100%", label: "Audit Compliance" },
  ];

  const getTierColor = (tier: ModelBenchmark['tier']) => {
    switch (tier) {
      case 'economy': return 'bg-status-approved/20 text-status-approved border-status-approved/30';
      case 'balanced': return 'bg-lavender/20 text-lavender border-lavender/30';
      case 'premium': return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lavandarLogo} alt="LAVANDAR" className="w-8 h-8 rounded-lg" />
            <div>
              <span className="font-medium text-sm tracking-[0.2em] uppercase text-foreground">LAVANDAR</span>
              <span className="hidden md:block text-[9px] font-mono uppercase tracking-[0.15em] text-lavender/60">Enterprise AI Platform</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">Process</a>
            <a href="#features" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">Features</a>
            <a href="#ai-models" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">AI Models</a>
            <a href="#protocol" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">Protocol</a>
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <Link
                to="/linkedin-company"
                className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                title="Company Page"
              >
                <Building2 className="w-4 h-4" />
              </Link>
              <Link
                to="/linkedin-ceo"
                className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                title="CEO Profile"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
            <Button 
              onClick={() => navigate("/investor-hub")}
              className="bg-lavender hover:bg-lavender-glow text-primary-foreground text-xs tracking-widest uppercase px-6 py-2 rounded-none"
            >
              Request Access
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-lavender/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-surface-2 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender/10 border border-lavender/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
                <span className="text-xs tracking-widest uppercase text-lavender">Enterprise AI Platform</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-status-approved/10 border border-status-approved/20 rounded-full">
                <Zap className="w-3 h-3 text-status-approved" />
                <span className="text-[10px] tracking-widest uppercase text-status-approved">7 AI Models</span>
              </div>
            </div>
            
            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1.05] tracking-tight">
              High-Value
              <br />
              <span className="text-lavender">Allocation</span>
              <br />
              <span className="text-muted-foreground font-normal">Reimagined</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              <span className="text-foreground font-medium">LAVANDAR</span> replaces "Buy Now" commerce with an Application-to-Purchase protocol. 
              AI-powered verification. Serialized inventory. 
              <span className="text-foreground"> Enterprise-grade trust.</span>
            </p>

            {/* Company Introduction */}
            <div className="p-4 bg-surface-1/50 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-lavender font-medium">LAVANDAR Technology</span> is an enterprise AI platform 
                providing secure allocation protocols, weather intelligence, and operational automation. 
                Our multi-model AI gateway powers mission-critical decisions across industries.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate("/allocation-checkout")}
              className="bg-lavender hover:bg-lavender-glow text-primary-foreground text-xs tracking-widest uppercase px-8 py-6 rounded-none group"
            >
              Request Allocation
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground text-xs tracking-widest uppercase px-8 py-6 rounded-none"
              >
                View Process
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-border">
              {trustStats.slice(0, 3).map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-medium text-lavender">{stat.value}</div>
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-8 bg-gradient-to-br from-lavender/5 to-surface-1 rounded-lg" />
            <div className="relative bg-surface-1 border border-border rounded-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-lavender" />
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Allocation Status</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-2 rounded-md p-4">
                  <div className="text-3xl font-medium text-foreground">47</div>
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Applications</div>
                </div>
                <div className="bg-surface-2 rounded-md p-4">
                  <div className="text-3xl font-medium text-foreground">12</div>
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Units Available</div>
                </div>
                <div className="bg-surface-2 rounded-md p-4">
                  <div className="text-3xl font-medium text-status-approved">94%</div>
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Verified</div>
                </div>
                <div className="bg-surface-2 rounded-md p-4">
                  <div className="text-3xl font-medium text-lavender">Secure</div>
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Status</div>
                </div>
              </div>
              
              <div className="h-16 bg-gradient-to-r from-lavender/10 via-lavender/20 to-lavender/10 rounded-md flex items-center justify-center">
                <span className="text-xs tracking-widest uppercase text-lavender">Pipeline Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-1 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-medium text-foreground">{stat.value}</div>
                <div className="text-xs tracking-widest uppercase text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-20">
            <div className="text-xs tracking-widest uppercase text-lavender mb-4">Application-to-Purchase</div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
              Four steps to
              <br />
              <span className="text-lavender">secure allocation</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Every transaction follows a controlled protocol. 
              From application to fulfillment, each stage is verified, tracked, and auditable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div 
                key={i} 
                className="group relative p-8 bg-surface-1 border border-border hover:border-lavender/30 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-4xl font-medium text-surface-3 group-hover:text-lavender/20 transition-colors">
                  {item.step}
                </div>
                <item.icon className="w-10 h-10 text-lavender mb-6" />
                <h3 className="text-xl font-medium mb-3 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-surface-1 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs tracking-widest uppercase text-lavender mb-4">Enterprise Trust</div>
              <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
                Built for
                <br />
                <span className="text-lavender">high-stakes</span> transactions
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Traditional e-commerce lacks the verification and allocation controls 
                needed for tens-of-thousands-dollar transactions. LAVANDAR provides 
                the protocol luxury and limited-run products demand.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-lavender/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-lavender" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-surface-2 border border-border rounded-md p-8">
              <div className="text-center mb-8">
                <div className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Problem Solved</div>
                <h3 className="text-2xl font-medium text-foreground">Why This Exists</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-background rounded-md border border-border">
                  <div className="text-xs tracking-widest uppercase text-status-rejected mb-2">Problem</div>
                  <p className="text-sm text-muted-foreground">
                    Luxury and high-ticket limited-run products face fraud, overselling, and chargebacks. 
                    Traditional e-commerce lacks verification and allocation controls.
                  </p>
                </div>
                
                <div className="p-4 bg-background rounded-md border border-lavender/30">
                  <div className="text-xs tracking-widest uppercase text-lavender mb-2">Solution</div>
                  <p className="text-sm text-muted-foreground">
                    Application-to-Purchase protocol with built-in verification, allocation tracking, 
                    and post-approval payment sequencing. Sellers maintain exclusivity; buyers gain access only when vetted.
                  </p>
                </div>
                
                <div className="p-4 bg-background rounded-md border border-status-approved/30">
                  <div className="text-xs tracking-widest uppercase text-status-approved mb-2">Outcome</div>
                  <p className="text-sm text-muted-foreground">
                    Controlled allocation ensures inventory integrity, reduces financial risk, and reinforces brand prestige. 
                    Every transaction traceable, every unit accounted for, every buyer verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Section */}
      <section id="protocol" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs tracking-widest uppercase text-lavender mb-4">The Protocol</div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
              S.H.O.W.S. Workflow
            </h2>
            <p className="text-lg text-muted-foreground">
              Secure High-value Order Workflow System. A five-stage protocol 
              ensuring verified allocation from application to fulfillment.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AllocationProtocol />
          </div>
        </div>
      </section>

      {/* AI Model Benchmarking Section */}
      <section id="ai-models" className="py-32 bg-surface-1 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-lavender" />
              <span className="text-xs tracking-widest uppercase text-lavender">AI Infrastructure</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
              Model
              <br />
              <span className="text-lavender">Benchmarks</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              LAVANDAR's AI Gateway provides unified access to industry-leading models 
              with automatic rate limiting, usage tracking, and cost optimization.
            </p>
          </div>

          {/* Model Tier Legend */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-approved/50" />
              <span className="text-xs text-muted-foreground">Economy — High-volume, cost-effective</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-lavender/50" />
              <span className="text-xs text-muted-foreground">Balanced — Best price/performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/50" />
              <span className="text-xs text-muted-foreground">Premium — Maximum capability</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {AI_MODELS.map((model) => (
              <Card 
                key={model.id}
                className="p-5 bg-card/50 backdrop-blur border-border hover:border-lavender/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getTierColor(model.tier)}>
                    {model.tier.charAt(0).toUpperCase() + model.tier.slice(1)}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{model.provider}</span>
                </div>
                
                <h3 className="font-medium text-foreground text-sm mb-3">{model.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Timer className="w-3 h-3" />
                      Response
                    </span>
                    <span className="text-foreground font-mono">{model.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      Tokens/sec
                    </span>
                    <span className="text-foreground font-mono">{model.tokensPerSecond}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      Input
                    </span>
                    <span className="text-foreground font-mono">{model.inputCost}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      Output
                    </span>
                    <span className="text-foreground font-mono">{model.outputCost}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-1">
                    {model.bestFor.map((use) => (
                      <span key={use} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-2 text-muted-foreground">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/ai")}
              variant="outline"
              className="border-lavender/30 text-lavender hover:bg-lavender/10 text-xs tracking-widest uppercase"
            >
              <Cpu className="w-4 h-4 mr-2" />
              View AI Showcase
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-surface-1 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender/10 border border-lavender/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-lavender" />
            <span className="text-xs tracking-widest uppercase text-lavender">Invitation Only</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
            Ready for
            <br />
            <span className="text-lavender">controlled allocation?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            LAVANDAR transforms high-value, limited-supply sales into a fully auditable, 
            secure, and exclusive allocation experience.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => navigate("/investor-hub")}
              className="bg-lavender hover:bg-lavender-glow text-primary-foreground text-xs tracking-widest uppercase px-10 py-6 rounded-none group"
            >
              Request Access
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/portfolio")}
              className="border-border text-muted-foreground hover:bg-surface-2 hover:text-foreground text-xs tracking-widest uppercase px-10 py-6 rounded-none"
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={lavandarLogo} alt="LAVANDAR" className="w-8 h-8 rounded-lg" />
                <div>
                  <span className="font-medium text-sm tracking-[0.2em] uppercase text-foreground">LAVANDAR</span>
                  <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-lavender/60">Technology</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Enterprise AI platform for secure allocation protocols, weather intelligence, 
                and operational automation. Powering mission-critical decisions.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs tracking-widest uppercase text-foreground mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/strata" className="block text-sm text-muted-foreground hover:text-lavender transition-colors">STRATA Command</Link>
                <Link to="/ai" className="block text-sm text-muted-foreground hover:text-lavender transition-colors">AI Showcase</Link>
                <Link to="/lavandar-home" className="block text-sm text-muted-foreground hover:text-lavender transition-colors">Weather Intelligence</Link>
                <Link to="/portfolio" className="block text-sm text-muted-foreground hover:text-lavender transition-colors">Portfolio</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs tracking-widest uppercase text-foreground mb-4">Connect</h4>
              <div className="space-y-2">
                <Link to="/linkedin-company" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0A66C2] transition-colors">
                  <Building2 className="w-4 h-4" />
                  Company Page
                </Link>
                <Link to="/linkedin-ceo" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0A66C2] transition-colors">
                  <Linkedin className="w-4 h-4" />
                  CEO Profile
                </Link>
                <Link to="/investor-hub" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lavender transition-colors">
                  <Users className="w-4 h-4" />
                  Investor Hub
                </Link>
                <Link to="/shareable-links" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lavender transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  All Links
                </Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Secure Allocation Gateway for High-Value Transactions
            </p>
            <div className="text-xs text-muted-foreground">
              © 2026 LAVANDAR Technology. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
