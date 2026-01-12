import { useState } from "react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Layers, 
  Database, 
  Cloud,
  Sparkles,
  ArrowRight,
  Star,
  GitBranch,
  Terminal,
  Zap,
  Shield,
  Cpu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  metrics?: string;
}

interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

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

  const skills: Skill[] = [
    { name: "React / TypeScript", level: 95, icon: Code2, category: "frontend" },
    { name: "Node.js / Deno", level: 88, icon: Terminal, category: "backend" },
    { name: "PostgreSQL / Supabase", level: 85, icon: Database, category: "backend" },
    { name: "Cloud Architecture", level: 82, icon: Cloud, category: "infrastructure" },
    { name: "System Design", level: 80, icon: Layers, category: "architecture" },
    { name: "Security & Auth", level: 78, icon: Shield, category: "security" },
    { name: "AI/ML Integration", level: 75, icon: Cpu, category: "ai" },
    { name: "CI/CD & DevOps", level: 72, icon: GitBranch, category: "infrastructure" },
  ];

  const categories = ["all", "frontend", "backend", "infrastructure", "architecture", "security", "ai"];

  const filteredSkills = activeCategory === "all" 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

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
              Full-Stack Engineer
            </span>
          </div>
          
          <h1 className="font-instrument text-5xl md:text-7xl font-bold text-strata-white mb-6 leading-tight">
            Building intelligent
            <span className="block bg-gradient-to-r from-purple-400 via-strata-orange to-strata-lume bg-clip-text text-transparent">
              digital experiences
            </span>
          </h1>
          
          <p className="text-xl text-strata-silver/80 max-w-2xl mb-10 leading-relaxed">
            I craft performant, accessible web applications with modern technologies. 
            Passionate about developer experience, clean architecture, and solving complex problems elegantly.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white font-instrument tracking-wider group"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="border-strata-steel/30 text-strata-white hover:bg-strata-steel/20"
              asChild
            >
              <a href="mailto:hello@example.com">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </a>
            </Button>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-12">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-strata-steel/20 hover:bg-strata-steel/40 text-strata-silver hover:text-strata-white transition-all"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-strata-steel/20 hover:bg-strata-steel/40 text-strata-silver hover:text-strata-white transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-strata-charcoal/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-instrument text-3xl text-strata-white mb-4">Technical Skills</h2>
            <p className="text-strata-silver/70">Technologies and tools I work with</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-strata-steel/20 text-strata-silver hover:bg-strata-steel/40 hover:text-strata-white"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <Card 
                key={skill.name} 
                className="bg-strata-black/50 border-strata-steel/20 hover:border-purple-500/30 transition-all group"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <skill.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="font-semibold text-strata-white">{skill.name}</span>
                  </div>
                  <div className="relative h-2 bg-strata-steel/20 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-strata-orange rounded-full transition-all duration-700"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-mono uppercase text-strata-silver/50">
                      {skill.category}
                    </span>
                    <span className="text-xs font-mono text-purple-400">{skill.level}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-instrument text-3xl text-strata-white mb-4">Featured Projects</h2>
            <p className="text-strata-silver/70">A selection of work I'm proud of</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.title}
                className={`bg-strata-charcoal/50 border-strata-steel/20 hover:border-purple-500/30 transition-all group ${
                  project.featured ? "md:col-span-1" : ""
                }`}
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

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-instrument text-3xl text-strata-white mb-4">How I Work</h2>
            <p className="text-strata-silver/70">Principles that guide my engineering decisions</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Performance First",
                description: "Every millisecond matters. I optimize for speed, efficiency, and seamless user experiences."
              },
              {
                icon: Shield,
                title: "Security Minded",
                description: "Building secure systems from the ground up, not as an afterthought. Defense in depth."
              },
              {
                icon: Layers,
                title: "Clean Architecture",
                description: "Maintainable, testable code that scales. SOLID principles and pragmatic abstractions."
              },
            ].map((value) => (
              <div 
                key={value.title}
                className="p-6 rounded-xl bg-strata-charcoal/30 border border-strata-steel/20 hover:border-purple-500/30 transition-all text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <value.icon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="font-instrument text-lg text-strata-white mb-2">{value.title}</h3>
                <p className="text-sm text-strata-silver/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
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
            I'm always interested in hearing about new opportunities, interesting projects, 
            or just connecting with fellow engineers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white font-instrument tracking-wider"
              asChild
            >
              <a href="mailto:hello@example.com">
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
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-strata-silver/50 hover:text-strata-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-strata-silver/50 hover:text-strata-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
