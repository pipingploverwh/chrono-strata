import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Wind, 
  CloudRain,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlayTypeData {
  playType: string;
  predicted: number;
  actual: number;
  match: boolean;
  weatherSeverity: "low" | "moderate" | "high";
}

interface MissedVariable {
  factor: string;
  description: string;
  impact: number;
  recommendation: string;
}

// Simulated validation data - Foxborough Factor predictions vs actual
const playComparisonData: PlayTypeData[] = [
  { playType: "Slant Routes", predicted: 35, actual: 34, match: true, weatherSeverity: "moderate" },
  { playType: "Hitch Routes", predicted: 25, actual: 26, match: true, weatherSeverity: "low" },
  { playType: "Out Routes", predicted: 20, actual: 19, match: true, weatherSeverity: "moderate" },
  { playType: "Whip Routes", predicted: 12, actual: 13, match: true, weatherSeverity: "high" },
  { playType: "Seam Routes", predicted: 8, actual: 8, match: true, weatherSeverity: "high" },
  { playType: "Deep Posts", predicted: 4, actual: 6, match: false, weatherSeverity: "high" },
  { playType: "Screen Passes", predicted: 18, actual: 17, match: true, weatherSeverity: "low" },
  { playType: "Draw Plays", predicted: 22, actual: 21, match: true, weatherSeverity: "moderate" },
];

const missedVariables: MissedVariable[] = [
  {
    factor: "Crosswind Shift Q3",
    description: "Wind direction rotated 45° between plays 42-51, affecting seam route timing",
    impact: 2.1,
    recommendation: "Increase crosswind delta weighting from 0.8 to 1.2 for real-time route adjustments"
  },
  {
    factor: "Precipitation Onset Lag",
    description: "Light rain began 4 minutes before system detection threshold",
    impact: 1.8,
    recommendation: "Lower precipitation detection threshold from 0.05 to 0.02 inches/hr"
  },
  {
    factor: "Temperature Drop Rate",
    description: "Rapid 6°F drop in Q4 not factored into grip coefficient model",
    impact: 1.4,
    recommendation: "Add temperature delta velocity as input to ball handling predictions"
  },
  {
    factor: "Field Position Variance",
    description: "Red zone play-calling deviated from weather model in favor of personnel packages",
    impact: 0.7,
    recommendation: "Integrate situational context layer for field position weighting"
  }
];

const weatherSeverityData = [
  { severity: "Low (Wind <10mph)", accuracy: 97, plays: 28 },
  { severity: "Moderate (10-20mph)", accuracy: 94, plays: 34 },
  { severity: "High (>20mph)", accuracy: 89, plays: 18 },
];

const PerformanceAnalytics = () => {
  const [severityFilter, setSeverityFilter] = useState<"all" | "low" | "moderate" | "high">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredData = severityFilter === "all" 
    ? playComparisonData 
    : playComparisonData.filter(d => d.weatherSeverity === severityFilter);

  const totalPredicted = playComparisonData.reduce((sum, d) => sum + d.predicted, 0);
  const totalActual = playComparisonData.reduce((sum, d) => sum + d.actual, 0);
  const matchCount = playComparisonData.filter(d => Math.abs(d.predicted - d.actual) <= 2).length;
  const overallAccuracy = 94; // The 94% match rate

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-strata-lume to-strata-cyan flex items-center justify-center">
            <Target className="w-6 h-6 text-strata-black" />
          </div>
          <div>
            <h2 className="font-instrument text-2xl font-bold text-strata-white">
              Foxborough Factor Validation
            </h2>
            <p className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-[0.2em] mt-0.5">
              Chrono-Strata Prediction Accuracy Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 rounded bg-strata-steel/30 border border-strata-steel/20 hover:border-strata-steel/40 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-strata-silver/70 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs font-mono text-strata-silver/70">Sync Live</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded bg-strata-lume/10 border border-strata-lume/30 hover:bg-strata-lume/20 transition-colors">
            <Download className="w-4 h-4 text-strata-lume" />
            <span className="text-xs font-mono text-strata-lume">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Accuracy Hero */}
      <Card className="bg-gradient-to-br from-strata-lume/10 to-strata-charcoal/50 border-strata-lume/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-instrument font-bold text-strata-lume">
                  {overallAccuracy}%
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-strata-silver/50 mt-1">
                  Prediction Accuracy
                </div>
              </div>
              <div className="h-16 w-px bg-strata-steel/30" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-strata-lume" />
                  <span className="text-sm text-strata-silver/80">{matchCount}/8 play types within ±2% threshold</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-strata-orange" />
                  <span className="text-sm text-strata-silver/80">Weather-adjusted model outperformed baseline by 23%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-strata-lume/20 text-strata-lume border-strata-lume/30">
                VALIDATED
              </Badge>
              <div className="text-[9px] font-mono text-strata-silver/40 mt-2">
                Last game: Jan 11, 2026
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="bg-strata-charcoal/50 border border-strata-steel/20 p-1">
          <TabsTrigger 
            value="comparison"
            className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
          >
            Predicted vs Actual
          </TabsTrigger>
          <TabsTrigger 
            value="weather"
            className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
          >
            Weather Severity
          </TabsTrigger>
          <TabsTrigger 
            value="variance"
            className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
          >
            Missed Variables (6%)
          </TabsTrigger>
        </TabsList>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-strata-silver/50" />
              <span className="text-xs font-mono text-strata-silver/50">Weather Severity:</span>
            </div>
            <div className="flex gap-2">
              {["all", "low", "moderate", "high"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev as typeof severityFilter)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    severityFilter === sev 
                      ? "bg-strata-lume/20 text-strata-lume border border-strata-lume/30"
                      : "bg-strata-steel/20 text-strata-silver/60 border border-strata-steel/20 hover:border-strata-steel/40"
                  }`}
                >
                  {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card className="bg-strata-charcoal/30 border-strata-steel/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-strata-silver/50">
                  Play Distribution Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData} layout="vertical" barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" horizontal={true} vertical={false} />
                      <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis 
                        dataKey="playType" 
                        type="category" 
                        tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                        axisLine={false} 
                        tickLine={false} 
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid rgba(107, 114, 128, 0.3)',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="predicted" name="Predicted %" fill="hsl(var(--strata-cyan))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="actual" name="Actual %" radius={[0, 4, 4, 0]}>
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.match ? "hsl(var(--strata-lume))" : "hsl(var(--strata-red))"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="bg-strata-charcoal/30 border-strata-steel/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-strata-silver/50">
                  Accuracy Delta by Play Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-strata-steel/20">
                        <th className="text-left py-2 text-[10px] font-mono uppercase text-strata-silver/50">Play Type</th>
                        <th className="text-center py-2 text-[10px] font-mono uppercase text-strata-silver/50">Predicted</th>
                        <th className="text-center py-2 text-[10px] font-mono uppercase text-strata-silver/50">Actual</th>
                        <th className="text-center py-2 text-[10px] font-mono uppercase text-strata-silver/50">Delta</th>
                        <th className="text-center py-2 text-[10px] font-mono uppercase text-strata-silver/50">Weather</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-strata-steel/10">
                      {filteredData.map((row, idx) => {
                        const delta = row.actual - row.predicted;
                        return (
                          <tr key={idx} className="hover:bg-strata-steel/10 transition-colors">
                            <td className="py-2.5 text-sm text-strata-white">{row.playType}</td>
                            <td className="py-2.5 text-center text-sm font-mono text-strata-cyan">{row.predicted}%</td>
                            <td className="py-2.5 text-center text-sm font-mono text-strata-lume">{row.actual}%</td>
                            <td className="py-2.5 text-center">
                              <span className={`text-sm font-mono ${
                                Math.abs(delta) <= 1 ? 'text-strata-lume' : 
                                Math.abs(delta) <= 2 ? 'text-strata-orange' : 'text-strata-red'
                              }`}>
                                {delta > 0 ? '+' : ''}{delta}%
                              </span>
                            </td>
                            <td className="py-2.5 text-center">
                              <Badge 
                                variant="outline" 
                                className={`text-[9px] ${
                                  row.weatherSeverity === 'low' ? 'border-strata-lume/30 text-strata-lume' :
                                  row.weatherSeverity === 'moderate' ? 'border-strata-orange/30 text-strata-orange' :
                                  'border-strata-red/30 text-strata-red'
                                }`}
                              >
                                {row.weatherSeverity}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weather Severity Tab */}
        <TabsContent value="weather" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {weatherSeverityData.map((data, idx) => (
              <Card key={idx} className="bg-strata-charcoal/30 border-strata-steel/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wind className={`w-5 h-5 ${
                      idx === 0 ? 'text-strata-lume' : idx === 1 ? 'text-strata-orange' : 'text-strata-red'
                    }`} />
                    <span className="text-sm font-mono text-strata-silver/70">{data.severity}</span>
                  </div>
                  <div className="text-4xl font-instrument font-bold text-strata-white mb-2">
                    {data.accuracy}%
                  </div>
                  <Progress 
                    value={data.accuracy} 
                    className="h-2 mb-3"
                  />
                  <div className="text-[10px] font-mono text-strata-silver/50">
                    {data.plays} plays analyzed
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-strata-charcoal/30 border-strata-steel/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-strata-cyan/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-strata-cyan" />
                </div>
                <div>
                  <h4 className="font-semibold text-strata-white mb-1">Key Insight</h4>
                  <p className="text-sm text-strata-silver/70">
                    Model accuracy remains above 89% even in high-severity conditions (wind &gt;20mph). 
                    The Foxborough Factor's proprietary weather-weighting demonstrates strongest performance 
                    on short-to-intermediate routes, with diminishing accuracy on deep seam patterns during 
                    gusty conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Missed Variables Tab */}
        <TabsContent value="variance" className="space-y-6">
          <div className="p-4 rounded-lg border border-strata-orange/30 bg-strata-orange/5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-strata-orange" />
              <div>
                <span className="font-semibold text-strata-orange">6% Variance Analysis</span>
                <span className="text-sm text-strata-silver/60 ml-2">
                  Identifying factors for Chrono-Strata algorithm refinement
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {missedVariables.map((variable, idx) => (
              <Card key={idx} className="bg-strata-charcoal/30 border-strata-steel/20">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-strata-orange/10 flex items-center justify-center">
                        <span className="text-sm font-mono text-strata-orange">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-strata-white">{variable.factor}</h4>
                        <Badge variant="outline" className="text-[9px] border-strata-red/30 text-strata-red mt-1">
                          {variable.impact}% impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-strata-silver/60 mb-4">
                    {variable.description}
                  </p>
                  <div className="p-3 rounded bg-strata-steel/20 border border-strata-steel/30">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-strata-lume" />
                      <span className="text-[10px] font-mono uppercase text-strata-lume">Recommendation</span>
                    </div>
                    <p className="text-xs text-strata-silver/80">{variable.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-strata-lume/10 to-transparent border-strata-lume/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-strata-lume/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-strata-lume" />
                </div>
                <div>
                  <h4 className="font-semibold text-strata-white mb-1">Algorithm Refinement Path</h4>
                  <p className="text-sm text-strata-silver/70">
                    Implementing the 4 recommendations above is projected to increase model accuracy from 94% → 97.5% 
                    by addressing real-time environmental delta detection and situational context weighting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
