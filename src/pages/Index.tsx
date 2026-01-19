import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Shield, Lock, FileCheck, 
  CheckCircle, Clock, Package, Fingerprint,
  BarChart3, Users, ShieldCheck, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AllocationProtocol from "@/components/allocation/AllocationProtocol";

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

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="font-medium text-sm tracking-[0.3em] uppercase text-foreground">
            Lavandar
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">Process</a>
            <a href="#features" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">Features</a>
            <a href="#protocol" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-lavender transition-colors">Protocol</a>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender/10 border border-lavender/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
              <span className="text-xs tracking-widest uppercase text-lavender">Secure Allocation Gateway</span>
            </div>
            
            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1.05] tracking-tight">
              High-Value
              <br />
              <span className="text-lavender">Allocation</span>
              <br />
              <span className="text-muted-foreground font-normal">Reimagined</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              LAVANDAR replaces "Buy Now" commerce with an Application-to-Purchase protocol. 
              Verified buyers. Serialized inventory. 
              <span className="text-foreground"> Enterprise-grade trust.</span>
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/investor-hub")}
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-medium text-sm tracking-[0.3em] uppercase text-foreground">
              Lavandar
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Secure Allocation Gateway for High-Value Transactions
            </p>
            <div className="text-xs text-muted-foreground">
              © 2026 Lavandar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
