import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, ExternalLink, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BiologicalStewardshipPanel from "@/components/ocean/BiologicalStewardshipPanel";
import StrategicExtractionPanel from "@/components/ocean/StrategicExtractionPanel";
import TCEFrictionMeter from "@/components/ocean/TCEFrictionMeter";

const OceanReallocation = () => {
  const [policyPosition, setPolicyPosition] = useState(65); // Default towards extraction

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-lavender" />
              <div>
                <h1 className="text-sm font-medium tracking-wide">Ocean Asset Reallocation 2026</h1>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                  NOAA Strategic Pivot Analysis
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] font-mono border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-3 h-3 mr-1" />
              SCENARIO PLANNING
            </Badge>
          </div>
        </div>
      </header>

      {/* Executive Brief */}
      <div className="bg-surface-1 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-lavender mb-2">
                Executive Summary
              </div>
              <h2 className="text-xl font-medium mb-3">
                The Pivot from Stewardship to Extraction
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                This dashboard models the strategic shift of US maritime assets from biological 
                observation (Shark Autonomy) to resource extraction (Deep Sea Mining). 
                Use the TCE Framework slider to visualize policy trade-offs.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                Source Documents
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.federalregister.gov/d/2017-28156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-surface-2 border border-border rounded text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  EO 13817
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href="https://2025.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-surface-2 border border-border rounded text-[9px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  Project 2025
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Biological Stewardship (Legacy) */}
          <BiologicalStewardshipPanel />

          {/* Center: TCE Friction Meter */}
          <div className="flex flex-col gap-6">
            <TCEFrictionMeter 
              value={policyPosition} 
              onChange={setPolicyPosition} 
            />
            
            {/* Policy Narrative */}
            <div className="bg-surface-1 border border-border rounded-lg p-4">
              <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Current Policy Narrative
              </div>
              <div className="space-y-3">
                {policyPosition < 30 && (
                  <p className="text-sm text-cyan-400 leading-relaxed">
                    "Protecting marine ecosystems is essential for long-term national security 
                    and biodiversity. International cooperation strengthens our position."
                  </p>
                )}
                {policyPosition >= 30 && policyPosition < 70 && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "Balance between environmental monitoring and strategic resource 
                    development. Dual-use capabilities for autonomous systems."
                  </p>
                )}
                {policyPosition >= 70 && (
                  <p className="text-sm text-amber-400 leading-relaxed">
                    "America First supply chain for critical minerals. Sharks vs. batteries — 
                    the choice is clear. Activate the 'Ocean Gold' initiative."
                  </p>
                )}
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-surface-1 border border-border rounded-lg p-4">
              <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Risk Assessment
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Ecosystem Collapse</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[8px] ${policyPosition > 60 ? 'border-destructive text-destructive' : 'border-border'}`}
                  >
                    {policyPosition > 80 ? 'CRITICAL' : policyPosition > 60 ? 'HIGH' : policyPosition > 40 ? 'MEDIUM' : 'LOW'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Allied Isolation</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[8px] ${policyPosition > 70 ? 'border-amber-500 text-amber-400' : 'border-border'}`}
                  >
                    {policyPosition > 80 ? 'HIGH' : policyPosition > 50 ? 'MEDIUM' : 'LOW'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Revenue Potential</span>
                  <Badge 
                    variant="outline" 
                    className={`text-[8px] ${policyPosition > 50 ? 'border-status-approved text-status-approved' : 'border-border'}`}
                  >
                    {policyPosition > 70 ? 'HIGH' : policyPosition > 40 ? 'MEDIUM' : 'LOW'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Strategic Extraction (New) */}
          <StrategicExtractionPanel />
        </div>

        {/* Bottom Context Bar */}
        <div className="mt-8 p-4 bg-surface-1 border border-border rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-[9px] font-mono text-muted-foreground">
              <span className="text-foreground">Tiger Team Lead:</span> Bentzi • 
              <span className="text-foreground ml-2">Date:</span> January 23, 2026 • 
              <span className="text-foreground ml-2">Classification:</span> SCENARIO PLANNING
            </div>
            <div className="flex items-center gap-2">
              <Link to="/strata">
                <Button variant="outline" size="sm" className="text-[10px] font-mono">
                  Weather Intelligence
                </Button>
              </Link>
              <Link to="/meetingflow">
                <Button variant="outline" size="sm" className="text-[10px] font-mono">
                  Operations Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OceanReallocation;
