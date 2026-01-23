import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Wind,
  Droplets,
  Plane,
  Anchor,
  ThermometerSun,
  Eye,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Minimize2,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useOperationsData, CityData } from "@/hooks/useOperationsData";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";

type Layout = "2x4" | "4x2" | "scroll";
type DataView = "all" | "weather" | "marine" | "aviation";

export function OperationsDashboard() {
  const { citiesData, isRefreshing, refreshAll } = useOperationsData();
  const { formatTemp } = useTemperatureUnit();
  const [layout, setLayout] = useState<Layout>("2x4");
  const [dataView, setDataView] = useState<DataView>("all");
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const getFlightRulesColor = (rules: string) => {
    switch (rules) {
      case "VFR": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "MVFR": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "IFR": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "LIFR": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case "2x4": return "grid grid-cols-2 lg:grid-cols-4 gap-3";
      case "4x2": return "grid grid-cols-1 md:grid-cols-2 gap-3";
      case "scroll": return "flex overflow-x-auto gap-3 pb-4";
    }
  };

  const getCardClasses = () => {
    switch (layout) {
      case "scroll": return "min-w-[320px] flex-shrink-0";
      default: return "";
    }
  };

  const getLocalTime = (timezone: string) => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="bg-[hsl(220,30%,6%)] border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-[hsl(220,30%,8%)]">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-foreground">Operations Dashboard</h2>
          <Badge variant="outline" className="text-xs">
            {citiesData.filter(c => !c.loading).length}/8 Active
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Data View Tabs */}
          <Tabs value={dataView} onValueChange={(v) => setDataView(v as DataView)} className="hidden md:block">
            <TabsList className="h-8 bg-background/50">
              <TabsTrigger value="all" className="text-xs px-2 h-6">All</TabsTrigger>
              <TabsTrigger value="weather" className="text-xs px-2 h-6">Weather</TabsTrigger>
              <TabsTrigger value="marine" className="text-xs px-2 h-6">Marine</TabsTrigger>
              <TabsTrigger value="aviation" className="text-xs px-2 h-6">Aviation</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Layout Toggle */}
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={layout === "2x4" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setLayout("2x4")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={layout === "4x2" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setLayout("4x2")}
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={refreshAll}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* City Grid */}
      <div className="p-3">
        <div className={getLayoutClasses()}>
          {citiesData.map((city, index) => (
            <motion.div
              key={city.location.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={getCardClasses()}
            >
              <CityCard
                city={city}
                dataView={dataView}
                isExpanded={expandedCity === city.location.id}
                onToggleExpand={() =>
                  setExpandedCity(
                    expandedCity === city.location.id ? null : city.location.id
                  )
                }
                formatTemp={formatTemp}
                getFlightRulesColor={getFlightRulesColor}
                getLocalTime={getLocalTime}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CityCardProps {
  city: CityData;
  dataView: DataView;
  isExpanded: boolean;
  onToggleExpand: () => void;
  formatTemp: (tempF: number) => string;
  getFlightRulesColor: (rules: string) => string;
  getLocalTime: (timezone: string) => string;
}

function CityCard({
  city,
  dataView,
  isExpanded,
  onToggleExpand,
  formatTemp,
  getFlightRulesColor,
  getLocalTime,
}: CityCardProps) {
  const { location, weather, marine, aviation, loading, error } = city;

  if (loading) {
    return (
      <Card className="bg-background/50 border-border/30">
        <CardHeader className="p-3 pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive/30">
        <CardContent className="p-3 text-center">
          <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-destructive" />
          <p className="text-xs text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/50 border-border/30 hover:border-primary/30 transition-colors group">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <h3 className="font-medium text-sm">{location.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">
            {getLocalTime(location.timezone)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onToggleExpand}
        >
          {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Weather Section */}
        {(dataView === "all" || dataView === "weather") && weather && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <ThermometerSun className="h-4 w-4 text-primary" />
                <span className="text-lg font-semibold">
                  {formatTemp(weather.temp)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {weather.condition}
              </Badge>
            </div>
            {isExpanded && (
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {weather.wind} mph {weather.windDirection}
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {weather.humidity}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Aviation Section */}
        {(dataView === "all" || dataView === "aviation") && aviation && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-accent-foreground" />
                <span className="text-xs font-mono">{location.icao}</span>
              </div>
              <Badge className={`text-xs ${getFlightRulesColor(aviation.flightRules)}`}>
                {aviation.flightRules}
              </Badge>
            </div>
            {isExpanded && (
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {aviation.visibility}
                </div>
                <div className="flex items-center gap-1">
                  <Cloud className="h-3 w-3" />
                  {aviation.ceiling}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marine Section */}
        {(dataView === "all" || dataView === "marine") && marine && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Anchor className="h-4 w-4 text-accent-foreground" />
                <span className="text-xs">{marine.seas}</span>
              </div>
              {marine.warnings.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {marine.warnings[0]}
                </Badge>
              )}
            </div>
            {isExpanded && (
              <div className="text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {marine.wind}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No marine data indicator for non-coastal cities */}
        {(dataView === "marine") && !marine && (
          <div className="text-xs text-muted-foreground text-center py-2">
            Inland location
          </div>
        )}
      </CardContent>
    </Card>
  );
}
