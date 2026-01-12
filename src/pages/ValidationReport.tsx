import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis, Legend } from "recharts";
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Wind, ArrowLeft, Download, FileText, Clock, Crosshair, Activity, ChevronDown, ChevronUp, Zap, ThermometerSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import lavandarLogo from "@/assets/lavandar-logo.png";
interface DriveData {
  drive: number;
  quarter: string;
  predictedCall: string;
  actualCall: string;
  match: boolean;
  weatherCondition: string;
  windSpeed: number;
  notes?: string;
  varianceReason?: "coaching_override" | "wind_shift" | "situational" | null;
}
interface CorrelationPoint {
  x: number;
  y: number;
  z: number;
  label: string;
  category: string;
}

// Drive-by-drive comparison data
const driveData: DriveData[] = [{
  drive: 1,
  quarter: "Q1",
  predictedCall: "Slant/Hitch Mix",
  actualCall: "Slant/Hitch Mix",
  match: true,
  weatherCondition: "Wind NW 12mph",
  windSpeed: 12
}, {
  drive: 2,
  quarter: "Q1",
  predictedCall: "Draw + Screen",
  actualCall: "Draw + Screen",
  match: true,
  weatherCondition: "Wind NW 14mph",
  windSpeed: 14
}, {
  drive: 3,
  quarter: "Q1",
  predictedCall: "Out Routes",
  actualCall: "Out Routes",
  match: true,
  weatherCondition: "Wind NW 15mph",
  windSpeed: 15
}, {
  drive: 4,
  quarter: "Q2",
  predictedCall: "Whip/Slant",
  actualCall: "Whip/Slant",
  match: true,
  weatherCondition: "Wind N 16mph",
  windSpeed: 16
}, {
  drive: 5,
  quarter: "Q2",
  predictedCall: "Screen Heavy",
  actualCall: "Screen + Hitch",
  match: true,
  weatherCondition: "Wind N 18mph",
  windSpeed: 18
}, {
  drive: 6,
  quarter: "Q2",
  predictedCall: "Short Routes Only",
  actualCall: "Deep Post Attempt",
  match: false,
  weatherCondition: "Wind N 21mph",
  windSpeed: 21,
  notes: "Red zone entry—coaching elected for end zone shot despite wind advisory",
  varianceReason: "coaching_override"
}, {
  drive: 7,
  quarter: "Q3",
  predictedCall: "Run + Slant",
  actualCall: "Run + Slant",
  match: true,
  weatherCondition: "Wind NE 19mph",
  windSpeed: 19
}, {
  drive: 8,
  quarter: "Q3",
  predictedCall: "Hitch Routes",
  actualCall: "Seam Attempt",
  match: false,
  weatherCondition: "Wind shift to E 23mph",
  windSpeed: 23,
  notes: "Sudden 45° crosswind rotation—model lag of 4 minutes",
  varianceReason: "wind_shift"
}, {
  drive: 9,
  quarter: "Q3",
  predictedCall: "Quick Out",
  actualCall: "Quick Out",
  match: true,
  weatherCondition: "Wind E 20mph",
  windSpeed: 20
}, {
  drive: 10,
  quarter: "Q4",
  predictedCall: "Slant/Screen",
  actualCall: "Slant/Screen",
  match: true,
  weatherCondition: "Wind E 18mph",
  windSpeed: 18
}, {
  drive: 11,
  quarter: "Q4",
  predictedCall: "Hitch Mix",
  actualCall: "Hitch Mix",
  match: true,
  weatherCondition: "Wind E 16mph",
  windSpeed: 16
}, {
  drive: 12,
  quarter: "Q4",
  predictedCall: "Run Heavy",
  actualCall: "Aggressive Pass",
  match: false,
  weatherCondition: "Wind E 14mph",
  windSpeed: 14,
  notes: "2-minute drill—clock management overrode weather optimization",
  varianceReason: "situational"
}, {
  drive: 13,
  quarter: "Q4",
  predictedCall: "Slant Routes",
  actualCall: "Slant Routes",
  match: true,
  weatherCondition: "Wind E 12mph",
  windSpeed: 12
}];

// Correlation matrix data for 6% variance
const correlationData: CorrelationPoint[] = [{
  x: 1,
  y: 85,
  z: 200,
  label: "Red Zone Entry",
  category: "Game State"
}, {
  x: 2,
  y: 72,
  z: 180,
  label: "2-Min Warning",
  category: "Clock"
}, {
  x: 3,
  y: 68,
  z: 150,
  label: "Wind Direction Shift",
  category: "Weather"
}, {
  x: 4,
  y: 45,
  z: 120,
  label: "Score Differential",
  category: "Game State"
}, {
  x: 5,
  y: 38,
  z: 100,
  label: "Down & Distance",
  category: "Situational"
}, {
  x: 6,
  y: 25,
  z: 80,
  label: "Personnel Package",
  category: "Tactical"
}];
const varianceReasonLabels = {
  coaching_override: {
    label: "Coaching Override",
    color: "text-strata-orange",
    bg: "bg-strata-orange/20"
  },
  wind_shift: {
    label: "Wind Shift (Model Lag)",
    color: "text-strata-cyan",
    bg: "bg-strata-cyan/20"
  },
  situational: {
    label: "Game Situation",
    color: "text-patriots-silver",
    bg: "bg-patriots-silver/20"
  }
};
const ValidationReport = () => {
  const navigate = useNavigate();
  const [expandedDrives, setExpandedDrives] = useState<number[]>([]);
  const toggleDrive = (drive: number) => {
    setExpandedDrives(prev => prev.includes(drive) ? prev.filter(d => d !== drive) : [...prev, drive]);
  };
  const matchedDrives = driveData.filter(d => d.match).length;
  const missedDrives = driveData.filter(d => !d.match);
  const accuracy = Math.round(matchedDrives / driveData.length * 100);
  const handleExportPDF = () => {
    // Placeholder for PDF generation
    console.log("Generating Executive Summary PDF...");
  };
  return <div className="min-h-screen bg-gradient-to-b from-patriots-navy via-strata-black to-patriots-navy">
      {/* War Room Header */}
      <header className="border-b border-patriots-silver/20 bg-patriots-navy/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="p-2 rounded hover:bg-patriots-silver/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-patriots-silver" />
              </button>
              <div className="h-8 w-px bg-patriots-silver/20" />
              <img src={lavandarLogo} alt="" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="font-instrument text-xl text-strata-white tracking-wide">
                  Chrono-Strata Validation Report
                </h1>
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-patriots-silver/60">
                  Patriots vs Bills • January 11, 2026 • Gillette Stadium
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-strata-lume/10 border border-strata-lume/30">
                <Activity className="w-4 h-4 text-strata-lume" />
                <span className="text-xs font-mono text-strata-lume">VALIDATED</span>
              </div>
              <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded bg-patriots-red hover:bg-patriots-red-bright transition-colors">
                <Download className="w-4 h-4 text-strata-white" />
                <span className="text-sm font-medium text-strata-white">Generate Executive Summary PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Primary Accuracy Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-patriots-navy/60 to-strata-charcoal/40 border-patriots-silver/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-strata-lume/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-strata-lume/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-strata-lume" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-patriots-silver/60">
                        Prediction Accuracy
                      </span>
                      <h2 className="font-instrument text-lg text-strata-white">
                        Weather-Adjusted Model Performance
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-instrument font-bold text-strata-lume">
                      {accuracy}%
                    </span>
                    <span className="text-2xl font-mono text-strata-lume/60">
                      correlation
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-strata-lume" />
                      <span className="text-sm text-strata-silver/80">{matchedDrives}/{driveData.length} drives matched</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-strata-orange" />
                      <span className="text-sm text-strata-silver/80">{missedDrives.length} variance events</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-patriots-red/20 text-patriots-red-bright border-patriots-red/30 mb-2">
                    FOXBOROUGH FACTOR
                  </Badge>
                  <div className="text-[9px] font-mono text-patriots-silver/40 mt-2">
                    Model v2.4.1 • Live Sync
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="space-y-4">
            <Card className="bg-patriots-navy/40 border-patriots-silver/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="w-5 h-5 text-strata-cyan" />
                  <span className="text-[10px] font-mono uppercase text-patriots-silver/60">Wind Range</span>
                </div>
                <div className="text-3xl font-instrument font-bold text-strata-white">12-23 mph</div>
                <div className="text-xs text-strata-silver/50 mt-1">Peak gusts during Q3</div>
              </CardContent>
            </Card>
            <Card className="bg-patriots-navy/40 border-patriots-silver/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-strata-red" />
                  <span className="text-[10px] font-mono uppercase text-patriots-silver/60">Seam Route Efficiency</span>
                </div>
                <div className="text-3xl font-instrument font-bold text-strata-red">-14%</div>
                <div className="text-xs text-strata-silver/50 mt-1">vs. calm conditions baseline</div>
              </CardContent>
            </Card>
            <Card className="bg-patriots-navy/40 border-patriots-silver/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-strata-orange" />
                  <span className="text-[10px] font-mono uppercase text-patriots-silver/60">Short Route Boost</span>
                </div>
                <div className="text-3xl font-instrument font-bold text-strata-lume">+12%</div>
                <div className="text-xs text-strata-silver/50 mt-1">Slant/Hitch efficiency gain</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Drive-by-Drive Comparison */}
        <Card className="bg-patriots-navy/40 border-patriots-silver/20">
          <CardHeader className="border-b border-patriots-silver/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crosshair className="w-5 h-5 text-patriots-red" />
                <CardTitle className="font-instrument text-xl text-strata-white">
                  Drive-by-Drive Analysis
                </CardTitle>
              </div>
              <Badge variant="outline" className="border-patriots-silver/30 text-patriots-silver">
                {driveData.length} drives analyzed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-patriots-silver/10">
              {driveData.map(drive => <Collapsible key={drive.drive} open={expandedDrives.includes(drive.drive)}>
                  <CollapsibleTrigger onClick={() => toggleDrive(drive.drive)} className="w-full p-4 hover:bg-patriots-silver/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${drive.match ? 'bg-strata-lume/20' : 'bg-strata-orange/20'}`}>
                          <span className={`font-mono font-bold ${drive.match ? 'text-strata-lume' : 'text-strata-orange'}`}>
                            {drive.drive}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-strata-white">
                              Drive {drive.drive}
                            </span>
                            <Badge variant="outline" className="text-[9px] border-patriots-silver/30 text-patriots-silver/60">
                              {drive.quarter}
                            </Badge>
                            {!drive.match && drive.varianceReason && <Badge className={`text-[9px] ${varianceReasonLabels[drive.varianceReason].bg} ${varianceReasonLabels[drive.varianceReason].color} border-0`}>
                                {varianceReasonLabels[drive.varianceReason].label}
                              </Badge>}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-strata-silver/50">
                              {drive.weatherCondition}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[10px] font-mono uppercase text-strata-cyan/60 mb-1">Predicted</div>
                          <div className="text-sm font-mono text-strata-cyan">{drive.predictedCall}</div>
                        </div>
                        <div className="w-8 flex justify-center">
                          {drive.match ? <CheckCircle2 className="w-5 h-5 text-strata-lume" /> : <AlertTriangle className="w-5 h-5 text-strata-orange" />}
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-mono uppercase text-strata-lume/60 mb-1">Actual</div>
                          <div className={`text-sm font-mono ${drive.match ? 'text-strata-lume' : 'text-strata-orange'}`}>
                            {drive.actualCall}
                          </div>
                        </div>
                        {expandedDrives.includes(drive.drive) ? <ChevronUp className="w-4 h-4 text-patriots-silver/40" /> : <ChevronDown className="w-4 h-4 text-patriots-silver/40" />}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  {drive.notes && <CollapsibleContent>
                      <div className="px-4 pb-4 pl-18">
                        <div className="ml-14 p-4 rounded bg-strata-orange/10 border border-strata-orange/20">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-strata-orange mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono uppercase text-strata-orange mb-1 block">
                                Variance Analysis
                              </span>
                              <p className="text-sm text-strata-silver/80">{drive.notes}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>}
                </Collapsible>)}
            </div>
          </CardContent>
        </Card>

        {/* 6% Variance Deep Dive */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Correlation Matrix */}
          <Card className="bg-patriots-navy/40 border-patriots-silver/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-strata-orange" />
                <CardTitle className="font-instrument text-lg text-strata-white">
                  6% Variance Correlation Matrix
                </CardTitle>
              </div>
              <p className="text-xs text-strata-silver/50 mt-1">
                Cross-referencing missed predictions against game-state variables
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                    <XAxis type="number" dataKey="x" name="Factor" tick={{
                    fill: '#6B7280',
                    fontSize: 10
                  }} axisLine={false} tickLine={false} hide />
                    <YAxis type="number" dataKey="y" name="Correlation %" tick={{
                    fill: '#9CA3AF',
                    fontSize: 10
                  }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <ZAxis type="number" dataKey="z" range={[50, 300]} />
                    <Tooltip cursor={{
                    strokeDasharray: '3 3'
                  }} content={({
                    active,
                    payload
                  }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return <div className="bg-strata-charcoal border border-strata-steel/30 rounded-lg p-3">
                              <div className="text-sm font-semibold text-strata-white">{data.label}</div>
                              <div className="text-xs text-strata-silver/60">{data.category}</div>
                              <div className="text-lg font-mono text-strata-orange mt-1">{data.y}% correlation</div>
                            </div>;
                    }
                    return null;
                  }} />
                    <Scatter name="Factors" data={correlationData}>
                      {correlationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.y > 70 ? "hsl(var(--strata-orange))" : entry.y > 40 ? "hsl(var(--strata-cyan))" : "hsl(var(--patriots-silver))"} />)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {correlationData.slice(0, 4).map((item, idx) => <div key={idx} className="flex items-center justify-between p-2 rounded bg-patriots-silver/5">
                    <span className="text-xs text-strata-silver/70">{item.label}</span>
                    <span className={`text-xs font-mono ${item.y > 70 ? 'text-strata-orange' : 'text-strata-cyan'}`}>
                      {item.y}%
                    </span>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Variance Breakdown */}
          <Card className="bg-patriots-navy/40 border-patriots-silver/20">
            <CardHeader>
              <CardTitle className="font-instrument text-lg text-strata-white">
                Variance Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Red Zone Override */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-strata-orange" />
                    <span className="text-sm text-strata-white">Red Zone Coaching Override</span>
                  </div>
                  <span className="text-sm font-mono text-strata-orange">33%</span>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-xs text-strata-silver/50">
                  High-value scoring opportunities where coaches elected aggressive plays despite weather advisory
                </p>
              </div>

              {/* Wind Shift */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-strata-cyan" />
                    <span className="text-sm text-strata-white">Wind Direction Shift (Model Lag)</span>
                  </div>
                  <span className="text-sm font-mono text-strata-cyan">33%</span>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-xs text-strata-silver/50">
                  Sudden 45° crosswind rotation with 4-minute detection delay
                </p>
              </div>

              {/* Clock Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-patriots-silver" />
                    <span className="text-sm text-strata-white">Clock Management Override</span>
                  </div>
                  <span className="text-sm font-mono text-patriots-silver">34%</span>
                </div>
                <Progress value={34} className="h-2" />
                <p className="text-xs text-strata-silver/50">
                  2-minute drill situations where game-state urgency superseded weather optimization
                </p>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-lg bg-strata-lume/10 border border-strata-lume/20 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-strata-lume mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-strata-lume block mb-1">Key Finding</span>
                    <p className="text-xs text-strata-silver/80">
                      100% of variance events were attributable to valid coaching decisions or environmental lag—not model error. 
                      Integrating a "situational context layer" for game-state overrides could reduce false variance to under 2%.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executive Summary Preview */}
        <Card className="bg-gradient-to-r from-patriots-red/10 to-patriots-navy/40 border-patriots-red/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={lavandarLogo} alt="" className="w-12 h-12 rounded-lg" />
                <div>
                  <h3 className="font-instrument text-xl text-strata-white mb-1">GEOLOGICAL IT</h3>
                  
                </div>
              </div>
              <button onClick={handleExportPDF} className="flex items-center gap-3 px-6 py-3 rounded-lg bg-patriots-red hover:bg-patriots-red-bright transition-colors">
                <Download className="w-5 h-5 text-strata-white" />
                <span className="font-medium text-strata-white">Generate PDF Report</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-patriots-silver/10 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lavandarLogo} alt="" className="w-6 h-6 rounded" />
            <span className="text-[10px] font-mono text-patriots-silver/30 uppercase tracking-wider">
              Chrono-Strata Validation Engine • Lavandar AI
            </span>
          </div>
          <span className="text-[9px] font-mono text-patriots-silver/20">
            Report Generated: Jan 11, 2026 23:47 EST
          </span>
        </div>
      </footer>
    </div>;
};
export default ValidationReport;