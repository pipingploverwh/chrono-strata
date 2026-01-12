import { useState } from "react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Layers, 
  Database, 
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Cpu,
  Target,
  TrendingUp,
  Users,
  Rocket,
  Award,
  GraduationCap,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Phone,
  BarChart3,
  Brain,
  Compass,
  Heart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  type: "leadership" | "founder" | "growth";
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  metrics?: string;
}

const Portfolio = () => {
  const [expandedExp, setExpandedExp] = useState<number | null>(0);

  const experiences: Experience[] = [
    {
      title: "Startup Growth Lead (Tiger Team / Product Owner)",
      company: "Mechanism Ventures",
      period: "2025–Present",
      description: "Own 0→1 product feasibility for new ventures under aggressive timelines.",
      highlights: [
        "Translate ambiguous market questions into experiments with clear success thresholds",
        "Lead rapid iteration cycles, implementing user and stakeholder feedback within hours",
        "Define MVP scope, prioritize backlogs, and ship learnings aligned to launch velocity",
        "Document and codify transferable learnings to compound future team execution"
      ],
      type: "leadership"
    },
    {
      title: "Interim VP, E-Commerce (Product Owner)",
      company: "Uncle Arnie's",
      period: "2024–2025",
      description: "Owned end-to-end e-commerce product roadmap across acquisition, checkout, fulfillment, and CX.",
      highlights: [
        "Scaled platform from $0→$250K revenue and 0→70K users through rapid experimentation",
        "Built AI-powered customer support system reducing manual tickets while improving response time",
        "Implemented real-time dashboards to guide prioritization across conversion, retention, and ops"
      ],
      type: "leadership"
    },
    {
      title: "Co-Founder & CEO (Product Owner)",
      company: "paar.ai",
      period: "2021–2022",
      description: "Defined product vision and MVP for AI marketing platform integrated with Shopify, Google, and Meta.",
      highlights: [
        "Led customer discovery to identify automation pain points and validate willingness to pay",
        "Owned backlog, sprint planning, and scope tradeoffs for a 4-person eng/design team",
        "Raised $1M pre-seed/seed and shipped v1 to 6 paying customers"
      ],
      type: "founder"
    },
    {
      title: "Head of Marketing Optimization (Product)",
      company: "quip",
      period: "2019–2020",
      description: "Owned experimentation roadmap supporting $100M+ DTC revenue business.",
      highlights: [
        "Reduced cost-per-lead by 50% through data-driven prioritization and CRO initiatives",
        "Balanced speed with rigor by testing, learning, and iterating on customer-facing experiences"
      ],
      type: "growth"
    },
    {
      title: "Senior Growth Product Manager",
      company: "Resident Home",
      period: "2018–2019",
      description: "Owned roadmap across 10+ e-commerce properties with revenue and margin accountability.",
      highlights: [
        "Shipped pricing, warranty, and lead-capture features increasing AOV and contribution margin",
        "Partnered with engineering and data to prioritize based on customer behavior and funnel drop-offs"
      ],
      type: "growth"
    },
    {
      title: "Optimization Team Lead",
      company: "Wunderkind (formerly BounceX)",
      period: "2013–2018",
      description: "Early employee; helped define core product and experimentation playbook.",
      highlights: [
        "Co-authored patent for exit-intent detection technology (US10082945B2)",
        "Owned experimentation roadmap delivering 20% CPA reduction and 50% conversion lift",
        "Worked directly with enterprise customers to translate needs into shipped product features"
      ],
      type: "growth"
    },
    {
      title: "Director of Growth",
      company: "Plated",
      period: "2013",
      description: "One of first 10 hires; built growth analytics and acquisition systems from scratch.",
      highlights: [
        "Drove collection of 500K+ emails and established repeatable growth processes"
      ],
      type: "growth"
    }
  ];

  const projects: Project[] = [
    {
      title: "STRATA Weather Intelligence",
      description: "Real-time atmospheric monitoring platform with predictive analytics, serving aviation, marine, construction, and events industries.",
      tags: ["React", "TypeScript", "Supabase", "Weather API", "Real-time"],
      liveUrl: "/strata",
      featured: true,
      metrics: "94% prediction accuracy"
    },
    {
      title: "AI Security Test Suite",
      description: "Comprehensive network security dashboard with penetration testing results, compliance certifications, and real-time threat monitoring.",
      tags: ["Security", "React", "TypeScript", "Edge Functions"],
      liveUrl: "/security",
      featured: true,
      metrics: "SOC 2 Type II compliant"
    },
    {
      title: "Technical Recruiter Outreach",
      description: "Email generation tool with 5-minute notification reminders, helping job seekers connect authentically with recruiters.",
      tags: ["React", "Resend", "Edge Functions", "Email"],
      liveUrl: "/recruiter-outreach",
      metrics: "Automated follow-ups"
    },
    {
      title: "Game Intelligence Platform",
      description: "Sports analytics dashboard with live predictions, clock management strategy, and performance metrics visualization.",
      tags: ["React", "Data Viz", "Real-time", "Analytics"],
      liveUrl: "/patriots-evaluation",
      metrics: "Live game tracking"
    },
  ];

  const skillCategories = [
    {
      title: "Product & Strategy",
      icon: Target,
      skills: ["Product Discovery & Feasibility Testing", "Backlog Ownership & Roadmap Prioritization", "Rapid Experimentation & Data-Driven Decision Making"]
    },
    {
      title: "E-Commerce",
      icon: TrendingUp,
      skills: ["DTC Revenue Optimization", "Checkout & Fulfillment", "Pricing & AOV Strategy", "CRO & Conversion Funnels", "Customer Acquisition & Retention"]
    },
    {
      title: "Technical",
      icon: Code2,
      skills: ["Analytics, SQL, Python", "Experimentation Platforms", "AI-Enabled Product Development", "Deep Learning Agentic Building"]
    },
    {
      title: "Research",
      icon: Users,
      skills: ["User Research (Qualitative & Quantitative)", "Customer Discovery", "Market Validation"]
    },
    {
      title: "Range",
      icon: Compass,
      skills: ["Paramedic", "Paratrooper", "Camouflage", "Outdoor Wilderness Survival", "Celestial Navigation", "Astrophysics"]
    }
  ];

  const education = [
    { degree: "MBA", school: "Columbia Business School", year: "2022" },
    { degree: "BA", school: "University of Wisconsin–Madison", year: "2009" }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "leadership": return "strata-orange";
      case "founder": return "purple-400";
      case "growth": return "strata-cyan";
      default: return "strata-silver";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "leadership": return Briefcase;
      case "founder": return Rocket;
      case "growth": return TrendingUp;
      default: return Briefcase;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-strata-orange/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-strata-orange/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-strata-charcoal/80 border border-strata-steel/30 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-strata-silver">
              Product Leader & Growth Strategist
            </span>
          </div>
          
          <h1 className="font-instrument text-5xl md:text-7xl font-bold text-strata-white mb-6 leading-tight">
            Bentzi Rubin
            <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-purple-400 via-strata-orange to-strata-lume bg-clip-text text-transparent">
              Building 0→1 Products at Velocity
            </span>
          </h1>
          
          <p className="text-xl text-strata-silver/80 max-w-2xl mb-10 leading-relaxed">
            Product owner and growth leader with a track record of scaling startups from zero to millions in revenue. 
            I translate ambiguous market questions into experiments with clear success thresholds.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white font-instrument tracking-wider group"
              onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Experience
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="border-strata-steel/30 text-strata-white hover:bg-strata-steel/20"
              asChild
            >
              <a href="mailto:bentzirubin@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </a>
            </Button>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-6 mt-12">
            <a 
              href="mailto:bentzirubin@gmail.com"
              className="flex items-center gap-2 text-strata-silver hover:text-strata-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">bentzirubin@gmail.com</span>
            </a>
            <a 
              href="tel:530-207-9045"
              className="flex items-center gap-2 text-strata-silver hover:text-strata-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">530-207-9045</span>
            </a>
            <a 
              href="https://linkedin.com/in/bentzig" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-strata-silver hover:text-strata-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span className="text-sm">linkedin.com/in/bentzig</span>
            </a>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 px-4 bg-strata-charcoal/50 border-y border-strata-steel/20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "$250K+", label: "Revenue Scaled", icon: TrendingUp },
            { value: "70K+", label: "Users Acquired", icon: Users },
            { value: "$1M", label: "Funding Raised", icon: Rocket },
            { value: "50%", label: "Cost Reduction", icon: BarChart3 }
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 mb-3">
                <metric.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-strata-white mb-1">{metric.value}</div>
              <div className="text-xs font-mono uppercase text-strata-silver/60 tracking-wider">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-instrument text-3xl text-strata-white mb-4">Experience</h2>
            <p className="text-strata-silver/70">A decade of building and scaling products</p>
          </div>

          {/* Timeline Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { type: "leadership", label: "Leadership", icon: Briefcase },
              { type: "founder", label: "Founder", icon: Rocket },
              { type: "growth", label: "Growth", icon: TrendingUp }
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${getTypeColor(item.type)}`} />
                <span className="text-sm text-strata-silver">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-strata-orange to-strata-cyan" />
            
            <div className="space-y-6">
              {experiences.map((exp, index) => {
                const TypeIcon = getTypeIcon(exp.type);
                const isExpanded = expandedExp === index;
                const colorClass = getTypeColor(exp.type);
                
                return (
                  <div key={index} className="relative pl-16 md:pl-20">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 md:left-6 w-4 h-4 rounded-full bg-${colorClass} border-4 border-background`} />
                    
                    <Card 
                      className={`bg-strata-charcoal/50 border-strata-steel/20 hover:border-${colorClass}/30 transition-all cursor-pointer`}
                      onClick={() => setExpandedExp(isExpanded ? null : index)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                className={`bg-${colorClass}/20 text-${colorClass} border-0 text-[10px]`}
                              >
                                <TypeIcon className="w-3 h-3 mr-1" />
                                {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                              </Badge>
                              <span className="text-xs font-mono text-strata-silver/50 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {exp.period}
                              </span>
                            </div>
                            <CardTitle className="text-strata-white text-lg leading-snug">
                              {exp.title}
                            </CardTitle>
                            <p className={`text-${colorClass} font-medium text-sm mt-1`}>{exp.company}</p>
                          </div>
                          <button 
                            className="p-2 hover:bg-strata-steel/20 rounded-lg transition-colors"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-strata-silver" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-strata-silver" />
                            )}
                          </button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-strata-silver/80 text-sm mb-3">{exp.description}</p>
                        
                        {isExpanded && (
                          <ul className="space-y-2 mt-4 pt-4 border-t border-strata-steel/20">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-strata-silver/70">
                                <Zap className={`w-4 h-4 text-${colorClass} mt-0.5 shrink-0`} />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-strata-charcoal/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-instrument text-3xl text-strata-white mb-4">Skills & Expertise</h2>
            <p className="text-strata-silver/70">Capabilities honed across product, growth, and technical domains</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((category) => (
              <Card 
                key={category.title} 
                className="bg-strata-black/50 border-strata-steel/20 hover:border-purple-500/30 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <category.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-strata-white text-base">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.skills.map((skill, i) => (
                      <li key={i} className="text-sm text-strata-silver/70 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-instrument text-2xl text-strata-white mb-2">Education</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {education.map((edu) => (
              <div 
                key={edu.school}
                className="flex items-center gap-4 p-5 rounded-xl bg-strata-charcoal/30 border border-strata-steel/20"
              >
                <div className="p-3 rounded-xl bg-strata-orange/10">
                  <GraduationCap className="w-6 h-6 text-strata-orange" />
                </div>
                <div>
                  <div className="font-semibold text-strata-white">{edu.degree}</div>
                  <div className="text-sm text-strata-silver/70">{edu.school}</div>
                  <div className="text-xs font-mono text-strata-silver/50">{edu.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-instrument text-3xl text-strata-white mb-4">Recent Projects</h2>
            <p className="text-strata-silver/70">Building with modern tools</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.title}
                className="bg-strata-charcoal/50 border-strata-steel/20 hover:border-purple-500/30 transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      {project.featured && (
                        <Badge className="bg-strata-orange/20 text-strata-orange border-0 text-[10px] mb-2">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <CardTitle className="text-strata-white group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-strata-steel/20 hover:bg-strata-steel/40 text-strata-silver hover:text-strata-white transition-all"
                          aria-label={`${project.title} GitHub repository`}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          className="p-2 rounded-lg bg-strata-steel/20 hover:bg-strata-steel/40 text-strata-silver hover:text-strata-white transition-all"
                          aria-label={`${project.title} live demo`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-strata-silver/80 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {project.metrics && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Zap className="w-4 h-4 text-strata-lume" />
                      <span className="text-strata-lume font-medium">{project.metrics}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="bg-strata-steel/20 text-strata-silver border-0 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Highlight */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-xl bg-gradient-to-r from-strata-orange/10 to-purple-500/10 border border-strata-orange/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-strata-orange/20">
                <Award className="w-6 h-6 text-strata-orange" />
              </div>
              <div>
                <h3 className="font-instrument text-lg text-strata-white mb-1">Patent Holder</h3>
                <p className="text-strata-silver/70 text-sm mb-2">
                  Co-authored patent for exit-intent detection technology
                </p>
                <code className="text-xs font-mono text-strata-orange/80">US10082945B2</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-instrument text-3xl text-strata-white mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-strata-silver/70 mb-8">
            I'm always interested in hearing about new opportunities, interesting ventures, 
            or connecting with fellow builders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white font-instrument tracking-wider"
              asChild
            >
              <a href="mailto:bentzirubin@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Send an Email
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="border-strata-steel/30 text-strata-white hover:bg-strata-steel/20"
              asChild
            >
              <a href="/recruiter-outreach">
                <Sparkles className="w-4 h-4 mr-2" />
                Use Outreach Tool
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-strata-steel/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-strata-silver/30 uppercase tracking-wider">
            Built in Woods Hole by Piping Plover
          </p>
          <div className="flex gap-4">
            <a 
              href="https://linkedin.com/in/bentzig" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-strata-silver/50 hover:text-strata-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="mailto:bentzirubin@gmail.com"
              className="text-strata-silver/50 hover:text-strata-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
