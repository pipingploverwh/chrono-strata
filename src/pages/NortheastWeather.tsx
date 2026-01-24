import { useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Snowflake, ThermometerSun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWeatherData } from "@/hooks/useWeatherData";

const NORTHEAST_CITIES = [
  { name: "Boston", lat: 42.3601, lon: -71.0589 },
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Philadelphia", lat: 39.9526, lon: -75.1652 },
  { name: "Portland ME", lat: 43.6591, lon: -70.2568 },
  { name: "Providence", lat: 41.8240, lon: -71.4128 },
];

const getWeatherIcon = (condition: string, temp: number) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("snow") || temp < 32) return <Snowflake className="w-8 h-8 text-blue-300" />;
  if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) return <Cloud className="w-8 h-8 text-gray-400" />;
  if (lowerCondition.includes("wind")) return <Wind className="w-8 h-8 text-cyan-400" />;
  return <Sun className="w-8 h-8 text-yellow-400" />;
};

const CityWeather = ({ city }: { city: typeof NORTHEAST_CITIES[0] }) => {
  const { weather, loading } = useWeatherData(city.lat, city.lon, city.name);

  if (loading) {
    return (
      <Card className="p-4 bg-slate-800/50 border-slate-700 animate-pulse">
        <div className="h-20 bg-slate-700 rounded" />
      </Card>
    );
  }

  if (!weather) return null;

  const { temp, condition, wind } = weather.current;

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{city.name}</h3>
          <p className="text-3xl font-bold text-white">{temp}°F</p>
          <p className="text-sm text-slate-400">{condition}</p>
        </div>
        <div className="text-right">
          {getWeatherIcon(condition, temp)}
          <p className="text-sm text-slate-400 mt-2">{wind} mph</p>
        </div>
      </div>
    </Card>
  );
};

const NortheastWeather = () => {
  const [selectedCity, setSelectedCity] = useState(NORTHEAST_CITIES[0]);
  const { weather } = useWeatherData(selectedCity.lat, selectedCity.lon, selectedCity.name);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ThermometerSun className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Northeast Weather</h1>
          </div>
          <p className="text-slate-400">Real-time conditions</p>
        </div>

        {/* City Grid */}
        <div className="grid gap-4">
          {NORTHEAST_CITIES.map((city) => (
            <CityWeather key={city.name} city={city} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Powered by STRATA Weather Intelligence
        </p>
      </div>
    </div>
  );
};

export default NortheastWeather;
