import { Link } from "react-router-dom";
import { ArrowRight, Cloud, Zap, Users, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    icon: Cloud,
    title: "Weather Intelligence Platform",
    description: "Real-time environmental data processing for operational decision-making across industries."
  },
  {
    icon: Zap,
    title: "Predictive Analytics",
    description: "AI-powered forecasting with proven accuracy in high-stakes operational environments."
  },
  {
    icon: Users,
    title: "Enterprise Integration",
    description: "Seamless deployment with existing infrastructure and data systems."
  },
  {
    icon: TrendingUp,
    title: "Proven ROI",
    description: "Demonstrated revenue impact and operational efficiency gains with enterprise clients."
  }
];

const industries = [
  { name: "Sports & Entertainment", status: "Active" },
  { name: "Aviation", status: "Active" },
  { name: "Marine Operations", status: "Active" },
  { name: "Construction", status: "Active" },
  { name: "Events Management", status: "Active" }
];

const VCSummary = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-strata-charcoal via-strata-void to-strata-charcoal">
      {/* Hero */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-strata-cyan/50 text-strata-cyan">
            Investment Opportunity
          </Badge>
          <h1 className="text-4xl md:text-5xl font-light text-strata-white mb-6">
            LAVANDAR
            <span className="block text-strata-cyan font-semibold">Weather Intelligence</span>
          </h1>
          <p className="text-lg text-strata-silver/80 max-w-2xl mx-auto mb-8">
            Enterprise-grade weather intelligence platform transforming operational 
            decision-making across sports, aviation, marine, and events industries.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/auth" 
              className="px-6 py-3 bg-strata-cyan text-strata-void font-medium rounded-lg hover:bg-strata-cyan/90 transition-colors flex items-center gap-2"
            >
              Request Full Deck
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/launch" 
              className="px-6 py-3 border border-strata-steel/50 text-strata-white rounded-lg hover:bg-strata-steel/10 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-light text-strata-white text-center mb-12">
            Platform <span className="text-strata-cyan">Capabilities</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <Card key={idx} className="bg-strata-charcoal/50 border-strata-steel/30 hover:border-strata-cyan/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-strata-cyan/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-strata-cyan" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-strata-white mb-2">{item.title}</h3>
                      <p className="text-sm text-strata-silver/70">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 px-6 bg-strata-void/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-light text-strata-white text-center mb-8">
            Target <span className="text-strata-cyan">Markets</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 rounded-full border border-strata-steel/40 bg-strata-charcoal/30 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
                <span className="text-sm text-strata-silver">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traction */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-strata-cyan/10 to-transparent border-strata-cyan/30">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <BarChart3 className="w-8 h-8 text-strata-cyan" />
                <h2 className="text-2xl font-light text-strata-white">Traction</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-semibold text-strata-cyan mb-1">Enterprise</div>
                  <div className="text-sm text-strata-silver/70">Client Segment</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-semibold text-strata-lume mb-1">Proven</div>
                  <div className="text-sm text-strata-silver/70">ROI Model</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-semibold text-strata-orange mb-1">Scalable</div>
                  <div className="text-sm text-strata-silver/70">Architecture</div>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-lg bg-strata-charcoal/50 border border-strata-steel/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-strata-silver/60" />
                  <span className="text-xs text-strata-silver/60 uppercase tracking-wider">Due Diligence</span>
                </div>
                <p className="text-sm text-strata-silver/80">
                  Detailed metrics, case studies, and technical documentation available 
                  upon request to qualified investors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-light text-strata-white mb-4">
            Interested in Learning More?
          </h2>
          <p className="text-strata-silver/70 mb-8">
            Schedule a call to discuss partnership opportunities and access our full investment materials.
          </p>
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-strata-cyan text-strata-void font-medium rounded-lg hover:bg-strata-cyan/90 transition-colors"
          >
            Request Access
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VCSummary;
