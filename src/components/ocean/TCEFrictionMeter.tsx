import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Shield, Zap } from "lucide-react";

interface TCEFrictionMeterProps {
  value: number;
  onChange: (value: number) => void;
}

const TCEFrictionMeter = ({ value, onChange }: TCEFrictionMeterProps) => {
  // Calculate TCE values based on slider position
  const trustworthy = Math.max(0, 100 - value * 1.2);
  const compelling = Math.min(100, value * 1.1);
  const effortless = Math.max(0, 100 - Math.abs(50 - value) * 1.5);

  return (
    <div className="bg-surface-1 border border-border rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
          TCE Friction Analysis
        </h3>
        <p className="text-[10px] text-muted-foreground/60">
          Policy Position: Stewardship ←→ Extraction
        </p>
      </div>

      {/* Main Slider */}
      <div className="relative mb-8">
        <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
          <span className="text-cyan-400">Biological</span>
          <span className="text-amber-400">Extraction</span>
        </div>
        
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={100}
          step={1}
          className="w-full"
        />
        
        <div className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-cyan-500/30 via-surface-3 to-amber-500/30" />
      </div>

      {/* TCE Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Trustworthy */}
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-surface-3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${trustworthy * 1.76} 176`}
                className={`transition-all duration-500 ${
                  trustworthy > 60 ? 'text-status-approved' : 
                  trustworthy > 30 ? 'text-status-pending' : 'text-destructive'
                }`}
              />
            </svg>
            <Shield className="absolute inset-0 m-auto w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-lg font-mono font-bold text-foreground">
            {trustworthy.toFixed(0)}%
          </div>
          <div className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
            Trustworthy
          </div>
        </div>

        {/* Compelling */}
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-surface-3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${compelling * 1.76} 176`}
                className={`transition-all duration-500 ${
                  compelling > 70 ? 'text-status-approved' : 
                  compelling > 40 ? 'text-status-pending' : 'text-muted-foreground'
                }`}
              />
            </svg>
            <TrendingUp className="absolute inset-0 m-auto w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-lg font-mono font-bold text-foreground">
            {compelling.toFixed(0)}%
          </div>
          <div className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
            Compelling
          </div>
        </div>

        {/* Effortless */}
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-surface-3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${effortless * 1.76} 176`}
                className={`transition-all duration-500 ${
                  effortless > 60 ? 'text-status-approved' : 
                  effortless > 30 ? 'text-lavender' : 'text-status-pending'
                }`}
              />
            </svg>
            <Zap className="absolute inset-0 m-auto w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-lg font-mono font-bold text-foreground">
            {effortless.toFixed(0)}%
          </div>
          <div className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground">
            Effortless
          </div>
        </div>
      </div>

      {/* Friction Warning */}
      {value > 70 && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-center">
          <p className="text-[10px] font-mono text-destructive">
            ⚠ HIGH TRUST FRICTION — Environmental safety compromised
          </p>
        </div>
      )}
    </div>
  );
};

export default TCEFrictionMeter;
