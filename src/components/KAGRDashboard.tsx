import { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Ticket,
  ShoppingCart,
  Car,
  Utensils,
  Building2,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyMetrics {
  id: string;
  name: string;
  shortName: string;
  color: string;
  borderColor: string;
  metrics: {
    attendance: number;
    attendanceTrend: number;
    revenue: number;
    revenueTrend: number;
    perCap: number;
    perCapTrend: number;
    loyalty: number;
    crossProperty: number;
  };
}

interface UnifiedFanProfile {
  segment: string;
  count: number;
  avgValue: number;
  crossVisit: number;
  color: string;
}

const properties: PropertyMetrics[] = [
  {
    id: "patriots",
    name: "New England Patriots",
    shortName: "Patriots",
    color: "bg-patriots-navy",
    borderColor: "border-patriots-red/40",
    metrics: {
      attendance: 65878,
      attendanceTrend: 2.3,
      revenue: 12.4,
      revenueTrend: 8.7,
      perCap: 189,
      perCapTrend: 6.2,
      loyalty: 94,
      crossProperty: 34
    }
  },
  {
    id: "revolution",
    name: "New England Revolution",
    shortName: "Revolution",
    color: "bg-blue-900",
    borderColor: "border-blue-400/40",
    metrics: {
      attendance: 21847,
      attendanceTrend: -1.2,
      revenue: 2.8,
      revenueTrend: 4.1,
      perCap: 128,
      perCapTrend: 5.4,
      loyalty: 78,
      crossProperty: 52
    }
  },
  {
    id: "patriot-place",
    name: "Patriot Place",
    shortName: "Patriot Place",
    color: "bg-strata-charcoal",
    borderColor: "border-strata-silver/40",
    metrics: {
      attendance: 184000,
      attendanceTrend: 3.8,
      revenue: 8.2,
      revenueTrend: 5.9,
      perCap: 44,
      perCapTrend: 2.1,
      loyalty: 67,
      crossProperty: 71
    }
  }
];

const fanSegments: UnifiedFanProfile[] = [
  { segment: "Season Ticket Holders", count: 48500, avgValue: 2840, crossVisit: 89, color: "bg-strata-lume" },
  { segment: "Premium Members", count: 12200, avgValue: 8450, crossVisit: 94, color: "bg-strata-orange" },
  { segment: "Regular Attendees", count: 156000, avgValue: 420, crossVisit: 45, color: "bg-strata-cyan" },
  { segment: "Occasional Visitors", count: 892000, avgValue: 85, crossVisit: 23, color: "bg-strata-silver" }
];

const TrendIndicator = ({ value }: { value: number }) => {
  if (value > 0) {
    return (
      <div className="flex items-center gap-0.5 text-strata-lume">
        <ArrowUpRight className="w-3 h-3" />
        <span className="text-[10px] font-mono">+{value.toFixed(1)}%</span>
      </div>
    );
  } else if (value < 0) {
    return (
      <div className="flex items-center gap-0.5 text-strata-red">
        <ArrowDownRight className="w-3 h-3" />
        <span className="text-[10px] font-mono">{value.toFixed(1)}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-0.5 text-strata-silver/50">
      <Minus className="w-3 h-3" />
      <span className="text-[10px] font-mono">0.0%</span>
    </div>
  );
};

const MiniSparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-px h-8">
      {data.map((value, idx) => (
        <div
          key={idx}
          className={`w-1.5 rounded-t ${color} opacity-60`}
          style={{ height: `${((value - min) / range) * 100}%`, minHeight: "4px" }}
        />
      ))}
    </div>
  );
};

export const KAGRDashboard = () => {
  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const [liveTimestamp, setLiveTimestamp] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTimestamp(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulated live data streams
  const sparklineData = useMemo(() => ({
    patriots: Array.from({ length: 12 }, () => 60 + Math.random() * 40),
    revolution: Array.from({ length: 12 }, () => 40 + Math.random() * 30),
    "patriot-place": Array.from({ length: 12 }, () => 70 + Math.random() * 25)
  }), []);

  const totalUnifiedProfiles = fanSegments.reduce((acc, s) => acc + s.count, 0);
  const avgCrossVisit = fanSegments.reduce((acc, s) => acc + s.crossVisit * s.count, 0) / totalUnifiedProfiles;

  return (
    <div className="space-y-6">
      {/* Minimal header - system feels operational, not promotional */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-strata-silver/40">
            Kraft Analytics Group
          </span>
          <h3 className="text-lg font-instrument text-strata-white">
            Unified Portfolio Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
          <span className="text-[9px] font-mono text-strata-silver/50">
            Last sync: {liveTimestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Property Cards - Grid layout, honest data */}
      <div className="grid md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card
            key={property.id}
            className={`bg-strata-charcoal/40 border transition-all duration-300 cursor-pointer ${
              activeProperty === property.id 
                ? `${property.borderColor} shadow-lg` 
                : "border-strata-steel/20 hover:border-strata-steel/40"
            }`}
            onClick={() => setActiveProperty(activeProperty === property.id ? null : property.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${property.color}`} />
                  <CardTitle className="text-sm font-instrument text-strata-white">
                    {property.shortName}
                  </CardTitle>
                </div>
                <MiniSparkline 
                  data={sparklineData[property.id as keyof typeof sparklineData]} 
                  color={property.color} 
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Attendance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-strata-silver/50" />
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">Avg Attend</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-strata-white">
                    {property.metrics.attendance.toLocaleString()}
                  </span>
                  <TrendIndicator value={property.metrics.attendanceTrend} />
                </div>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3 text-strata-silver/50" />
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">Revenue (M)</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-strata-white">
                    ${property.metrics.revenue}M
                  </span>
                  <TrendIndicator value={property.metrics.revenueTrend} />
                </div>
              </div>

              {/* Per-Cap */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="w-3 h-3 text-strata-silver/50" />
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">Per-Cap</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-strata-white">
                    ${property.metrics.perCap}
                  </span>
                  <TrendIndicator value={property.metrics.perCapTrend} />
                </div>
              </div>

              {/* Cross-Property Insight - the value unlock */}
              <div className={`mt-2 pt-2 border-t border-strata-steel/20 transition-all duration-300 ${
                activeProperty === property.id ? "opacity-100" : "opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase text-strata-silver/40">
                    Cross-Property Rate
                  </span>
                  <span className="text-xs font-mono text-strata-cyan">
                    {property.metrics.crossProperty}%
                  </span>
                </div>
                <div className="mt-1 h-1 bg-strata-steel/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-strata-cyan/60 rounded-full transition-all duration-500"
                    style={{ width: `${property.metrics.crossProperty}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Unified Fan Segments - The real insight */}
      <Card className="bg-strata-charcoal/30 border-strata-steel/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-strata-silver/50" />
              <CardTitle className="text-sm font-instrument text-strata-white">
                Unified Fan Profiles
              </CardTitle>
            </div>
            <span className="text-xs font-mono text-strata-silver/50">
              {(totalUnifiedProfiles / 1000000).toFixed(2)}M total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            {fanSegments.map((segment) => (
              <div
                key={segment.segment}
                className="p-3 rounded border border-strata-steel/20 bg-strata-steel/5 hover:bg-strata-steel/10 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${segment.color}`} />
                  <span className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wide">
                    {segment.segment}
                  </span>
                </div>
                <div className="text-lg font-mono text-strata-white">
                  {segment.count >= 1000000 
                    ? `${(segment.count / 1000000).toFixed(1)}M`
                    : `${(segment.count / 1000).toFixed(0)}K`
                  }
                </div>
                <div className="flex items-center justify-between mt-2 text-[9px] font-mono">
                  <span className="text-strata-silver/40">Avg LTV</span>
                  <span className="text-strata-orange">${segment.avgValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-strata-silver/40">Cross-Visit</span>
                  <span className="text-strata-cyan">{segment.crossVisit}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio-wide insight bar */}
          <div className="mt-4 p-3 rounded bg-strata-steel/10 border border-strata-steel/20">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-strata-silver/50 uppercase tracking-wide">
                Portfolio Cross-Pollination Rate
              </span>
              <span className="text-strata-lume">{avgCrossVisit.toFixed(1)}%</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Activity className="w-3 h-3 text-strata-silver/40" />
              <span className="text-[9px] text-strata-silver/40">
                Opportunity: +12.4% revenue lift with unified personalization
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Opportunity Matrix - subtle, discoverable */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-4 rounded border border-strata-steel/20 bg-strata-charcoal/20">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-4 h-4 text-strata-orange/60" />
            <span className="text-[10px] font-mono uppercase text-strata-silver/50">
              Ticketing Synergy
            </span>
          </div>
          <div className="text-2xl font-mono text-strata-white">$4.2M</div>
          <span className="text-[9px] text-strata-silver/40">
            Projected annual lift from cross-property bundling
          </span>
        </div>
        
        <div className="p-4 rounded border border-strata-steel/20 bg-strata-charcoal/20">
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="w-4 h-4 text-strata-cyan/60" />
            <span className="text-[10px] font-mono uppercase text-strata-silver/50">
              F&B Optimization
            </span>
          </div>
          <div className="text-2xl font-mono text-strata-white">$2.8M</div>
          <span className="text-[9px] text-strata-silver/40">
            AI-driven inventory and staffing efficiency
          </span>
        </div>
        
        <div className="p-4 rounded border border-strata-steel/20 bg-strata-charcoal/20">
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-4 h-4 text-strata-lume/60" />
            <span className="text-[10px] font-mono uppercase text-strata-silver/50">
              Parking & Transit
            </span>
          </div>
          <div className="text-2xl font-mono text-strata-white">$1.1M</div>
          <span className="text-[9px] text-strata-silver/40">
            Dynamic pricing and flow optimization
          </span>
        </div>
      </div>
    </div>
  );
};

export default KAGRDashboard;
