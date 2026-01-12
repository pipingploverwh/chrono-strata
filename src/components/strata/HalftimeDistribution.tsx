import { Target, TrendingUp, Crosshair, Shuffle, ArrowUpRight } from "lucide-react";

interface RouteConceptProps {
  letter: string;
  name: string;
  description: string;
  efficiency?: number;
  weatherImpact?: "optimal" | "moderate" | "limited";
}

const routeConcepts: RouteConceptProps[] = [
  {
    letter: "S",
    name: "Slant",
    description: "Quick inside break exploiting soft zone coverage",
    efficiency: 72,
    weatherImpact: "optimal",
  },
  {
    letter: "H",
    name: "Hitch",
    description: "Rhythm route against press coverage",
    efficiency: 68,
    weatherImpact: "optimal",
  },
  {
    letter: "O",
    name: "Out",
    description: "Sideline attack versus inside leverage",
    efficiency: 61,
    weatherImpact: "moderate",
  },
  {
    letter: "W",
    name: "Whip",
    description: "Misdirection route against aggressive corners",
    efficiency: 74,
    weatherImpact: "moderate",
  },
  {
    letter: "S",
    name: "Seam",
    description: "Vertical stretch through zone windows",
    efficiency: 58,
    weatherImpact: "limited",
  },
];

const weatherImpactColors = {
  optimal: "text-strata-lume",
  moderate: "text-strata-orange",
  limited: "text-strata-red",
};

const HalftimeDistribution = () => {
  return (
    <div className="mt-8 bg-gradient-to-b from-strata-charcoal to-strata-black rounded border border-strata-steel/30 p-5">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-patriots-red flex items-center justify-center">
          <Target className="w-6 h-6 text-strata-white" />
        </div>
        <div>
          <h2 className="font-instrument text-xl font-bold text-strata-white tracking-wide">
            The S.H.O.W.S. Protocol
          </h2>
          <p className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-[0.2em] mt-0.5">
            Systematic Route Concept Framework
          </p>
        </div>
      </div>

      {/* Route concepts list */}
      <div className="space-y-2">
        {routeConcepts.map((route, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-strata-steel/30 rounded border border-strata-steel/20 p-4 hover:bg-strata-steel/40 transition-colors"
          >
            {/* Letter badge */}
            <div className="w-10 h-10 rounded-lg bg-patriots-red flex items-center justify-center shrink-0">
              <span className="font-instrument text-lg font-bold text-strata-white">
                {route.letter}
              </span>
            </div>

            {/* Route info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-strata-white">
                  {route.name}
                </h3>
                {route.efficiency && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    route.efficiency >= 70 
                      ? 'bg-strata-lume/20 text-strata-lume' 
                      : route.efficiency >= 60 
                        ? 'bg-strata-orange/20 text-strata-orange'
                        : 'bg-strata-red/20 text-strata-red'
                  }`}>
                    {route.efficiency}% EFF
                  </span>
                )}
              </div>
              <p className="text-sm text-strata-silver/70 mt-0.5">
                {route.description}
              </p>
            </div>

            {/* Weather impact indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-2 h-2 rounded-full ${
                route.weatherImpact === "optimal" 
                  ? "bg-strata-lume" 
                  : route.weatherImpact === "moderate"
                    ? "bg-strata-orange"
                    : "bg-strata-red"
              }`} />
              <span className={`text-[9px] font-mono uppercase tracking-wider ${
                weatherImpactColors[route.weatherImpact || "optimal"]
              }`}>
                {route.weatherImpact === "optimal" && "Wind OK"}
                {route.weatherImpact === "moderate" && "Wind Factor"}
                {route.weatherImpact === "limited" && "Wind Limit"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic purpose footer */}
      <div className="mt-4 p-4 rounded border border-patriots-red/30 bg-gradient-to-r from-patriots-red/10 to-transparent">
        <p className="text-sm">
          <span className="text-patriots-red-bright font-semibold">Strategic Purpose:</span>
          <span className="text-strata-silver/80 ml-2">
            An integrated offensive concept module designed to systematically break down aggressive zone defenses through rhythmic route concepts, exploiting defensive aggression and optimizing QB timing.
          </span>
        </p>
      </div>

      {/* Halftime Weather Link */}
      <div className="mt-4 pt-4 border-t border-strata-steel/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crosshair className="w-4 h-4 text-strata-orange" />
            <span className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wider">
              Halftime Weather Adjustment
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-strata-lume" />
              <span className="text-[11px] font-mono text-strata-lume">
                Short Routes +12%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shuffle className="w-3.5 h-3.5 text-strata-orange" />
              <span className="text-[11px] font-mono text-strata-orange">
                Deep Routes −8%
              </span>
            </div>
          </div>
        </div>

        {/* Distribution bar */}
        <div className="mt-3 h-2 rounded-full bg-strata-steel/30 overflow-hidden flex">
          <div className="h-full bg-strata-lume" style={{ width: "35%" }} title="Slant" />
          <div className="h-full bg-strata-cyan" style={{ width: "25%" }} title="Hitch" />
          <div className="h-full bg-strata-orange" style={{ width: "20%" }} title="Out" />
          <div className="h-full bg-patriots-red" style={{ width: "12%" }} title="Whip" />
          <div className="h-full bg-strata-silver/40" style={{ width: "8%" }} title="Seam" />
        </div>

        <div className="mt-2 flex justify-between text-[8px] font-mono text-strata-silver/50 uppercase">
          <span>Slant 35%</span>
          <span>Hitch 25%</span>
          <span>Out 20%</span>
          <span>Whip 12%</span>
          <span>Seam 8%</span>
        </div>
      </div>
    </div>
  );
};

export default HalftimeDistribution;
