import { useState } from "react";
import { Gauge, Droplets, Wind, CloudRain, Sun, Eye, Cloud, Activity } from "lucide-react";
import WatchDial from "./WatchDial";
import MetricPod from "./MetricPod";
import LayersSidebar from "./LayersSidebar";
import ForecastStrip from "./ForecastStrip";
import ControlToggles from "./ControlToggles";

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
  const [activeLayer, setActiveLayer] = useState("surface");
  const [bezelActive, setBezelActive] = useState(false);
  const [mode, setMode] = useState<"USA" | "ISR">("USA");

  const data = weatherData[mode];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-instrument text-2xl sm:text-3xl font-bold text-strata-white tracking-wide">
              STRATA
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-strata-silver/60 mt-1">
              Geological Weather Instrument
            </p>
          </div>
          <ControlToggles
            bezelActive={bezelActive}
            onBezelToggle={setBezelActive}
            mode={mode}
            onModeChange={setMode}
          />
        </div>

        {/* Main instrument panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr] gap-6 items-start">
          {/* Left: Layers sidebar */}
          <LayersSidebar activeLayer={activeLayer} onLayerChange={setActiveLayer} />

          {/* Center: Watch dial */}
          <div className="flex justify-center items-center">
            <WatchDial bezelActive={bezelActive} />
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
