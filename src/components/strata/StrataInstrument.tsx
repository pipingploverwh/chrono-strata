import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gauge, Droplets, Wind, CloudRain, Sun, Eye, Cloud, Activity, ScrollText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WatchDial from "./WatchDial";
import MetricPod from "./MetricPod";
import LayersSidebar from "./LayersSidebar";
import ForecastStrip from "./ForecastStrip";
import ControlToggles from "./ControlToggles";
import HalftimeDistribution from "./HalftimeDistribution";

// Falmouth, MA data for January 11, 2026, 6:41 PM
const weatherData = {
  USA: {
    pressure: { value: "29.64", unit: "inHg" },
    humidity: { value: "84", unit: "%" },
    wind: { value: "25", unit: "mph" },
    precip: { value: "0.00", unit: "in" },
    uvIndex: { value: "0", status: "Low" },
    visibility: { value: "10", unit: "mi" },
    cloudCover: { value: "34", unit: "%" },
    airQuality: { value: "31", status: "Good" },
  },
  ISR: {
    pressure: { value: "1003.7", unit: "hPa" },
    humidity: { value: "84", unit: "%" },
    wind: { value: "40", unit: "km/h" },
    precip: { value: "0", unit: "mm" },
    uvIndex: { value: "0", status: "Low" },
    visibility: { value: "16.1", unit: "km" },
    cloudCover: { value: "34", unit: "%" },
    airQuality: { value: "31", status: "Good" },
  },
};

const StrataInstrument = () => {
  const navigate = useNavigate();
  const [activeLayer, setActiveLayer] = useState("surface");
  const [bezelActive, setBezelActive] = useState(false);
  const [lumeMode, setLumeMode] = useState(false);
  const [mode, setMode] = useState<"USA" | "ISR">("USA");

  const data = weatherData[mode];

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 sm:p-8 transition-all duration-700 ${lumeMode ? 'lume-mode' : ''}`}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`font-instrument text-2xl sm:text-3xl font-bold tracking-wide transition-all duration-500 ${lumeMode ? 'lume-text' : 'text-strata-white'}`}>
              STRATA
            </h1>
            <p className={`text-[10px] font-mono uppercase tracking-[0.25em] mt-1 transition-all duration-500 ${lumeMode ? 'text-strata-lume/40' : 'text-strata-silver/60'}`}>
              Geological Weather Instrument
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/logs" 
              className={`flex items-center gap-2 px-3 py-2 rounded border transition-all duration-300 ${
                lumeMode 
                  ? 'bg-strata-charcoal/50 border-strata-lume/20 text-strata-lume hover:bg-strata-lume/10 lume-glow-box' 
                  : 'bg-strata-charcoal/50 border-strata-steel/20 text-strata-silver hover:bg-strata-steel/50'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono uppercase tracking-wider">Logs</span>
            </Link>
            <ControlToggles
              bezelActive={bezelActive}
              onBezelToggle={setBezelActive}
              lumeMode={lumeMode}
              onLumeModeToggle={setLumeMode}
              mode={mode}
              onModeChange={setMode}
            />
          </div>
        </div>

        {/* Main instrument panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-6 items-start">
          {/* Left: Layers sidebar */}
          <LayersSidebar activeLayer={activeLayer} onLayerChange={setActiveLayer} />

          {/* Center: Watch dial */}
          <div className="flex justify-center items-center">
            <WatchDial bezelActive={bezelActive} lumeMode={lumeMode} />
          </div>

          {/* Right: Metric pods */}
          <div className="grid grid-cols-2 gap-2">
            <MetricPod
              label="Pressure"
              value={data.pressure.value}
              unit={data.pressure.unit}
              Icon={Gauge}
              highlighted={activeLayer === "surface"}
            />
            <MetricPod
              label="Humidity"
              value={data.humidity.value}
              unit={data.humidity.unit}
              Icon={Droplets}
            />
            <MetricPod
              label="Wind"
              value={data.wind.value}
              unit={data.wind.unit}
              Icon={Wind}
              highlighted
            />
            <MetricPod
              label="Precip"
              value={data.precip.value}
              unit={data.precip.unit}
              Icon={CloudRain}
            />
            <MetricPod
              label="UV Index"
              value={data.uvIndex.value}
              status={data.uvIndex.status}
              Icon={Sun}
              highlighted={activeLayer === "stratosphere"}
            />
            <MetricPod
              label="Visibility"
              value={data.visibility.value}
              unit={data.visibility.unit}
              Icon={Eye}
            />
            <MetricPod
              label="Cloud Cover"
              value={data.cloudCover.value}
              unit={data.cloudCover.unit}
              Icon={Cloud}
              highlighted={activeLayer === "troposphere"}
            />
            <MetricPod
              label="Air Quality"
              value={data.airQuality.value}
              status={data.airQuality.status}
              Icon={Activity}
            />
          </div>
        </div>

        {/* Bottom: Forecast strip */}
        <div className="mt-6">
          <ForecastStrip />
        </div>

        {/* Halftime Distribution Analysis */}
        <HalftimeDistribution />

        {/* Kraft Group CTA */}
        <div className="mt-8 relative overflow-hidden rounded-lg border border-red-600/30 bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.1),transparent_50%)]" />
          <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-red-500 mb-2">
                The Kraft Group
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-white mb-2">
                Build custom STRATA for your team
              </h3>
              <p className="text-sm text-neutral-400 max-w-md">
                Purpose-built weather intelligence dashboards tailored to your venues, 
                events, and operational requirements.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/recruiter-outreach")}
              className="bg-red-600 hover:bg-red-700 text-white text-xs tracking-[0.2em] uppercase px-8 py-6 rounded-none group whitespace-nowrap"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-strata-silver/40 uppercase tracking-wider">
          <span>Falmouth, MA • 41.65°N, 70.52°W</span>
          <span>Jan 11, 2026 • 6:41 PM EST</span>
          <span>WNW @ 25 mph • Gusts 40 mph</span>
        </div>
      </div>
    </div>
  );
};

export default StrataInstrument;
