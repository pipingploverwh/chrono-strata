import { Cloud, CloudRain, Sun, CloudSun, Snowflake } from "lucide-react";

interface ForecastDay {
  day: string;
  icon: "sunny" | "cloudy" | "rain" | "partly-cloudy" | "snow";
  chance: number;
  high?: number;
  low?: number;
}

const forecastData: ForecastDay[] = [
  { day: "TODAY", icon: "cloudy", chance: 100 },
  { day: "SUN", icon: "partly-cloudy", chance: 5, high: 38, low: 32 },
  { day: "MON", icon: "sunny", chance: 1, high: 38, low: 32 },
  { day: "TUE", icon: "sunny", chance: 0, high: 42, low: 36 },
  { day: "WED", icon: "cloudy", chance: 15, high: 46, low: 38 },
  { day: "THU", icon: "partly-cloudy", chance: 10, high: 44, low: 35 },
  { day: "FRI", icon: "rain", chance: 45, high: 40, low: 34 },
];

const iconMap = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  "partly-cloudy": CloudSun,
  snow: Snowflake,
};

const ForecastStrip = () => {
  return (
    <div className="bg-strata-charcoal/40 rounded border border-strata-steel/20 p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-strata-silver/60">
          7-Day Forecast
        </span>
        <span className="text-[8px] font-mono text-strata-orange">
          Falmouth, MA
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {forecastData.map((day, index) => {
          const Icon = iconMap[day.icon];
          const isToday = index === 0;
          
          return (
            <div 
              key={day.day}
              className={`flex flex-col items-center p-2 rounded transition-colors ${
                isToday 
                  ? 'bg-strata-orange/10 border border-strata-orange/30' 
                  : 'hover:bg-strata-steel/20'
              }`}
            >
              <span className={`text-[8px] font-mono font-semibold mb-1 ${
                isToday ? 'text-strata-orange' : 'text-strata-silver'
              }`}>
                {day.day}
              </span>
              
              <Icon className={`w-5 h-5 mb-1 ${
                day.icon === 'sunny' 
                  ? 'text-strata-orange' 
                  : day.icon === 'rain' 
                  ? 'text-strata-blue' 
                  : 'text-strata-silver'
              }`} />
              
              <span className={`text-[9px] font-mono ${
                day.chance > 30 
                  ? 'text-strata-blue' 
                  : 'text-strata-silver/60'
              }`}>
                {day.chance}%
              </span>
              
              {day.high && (
                <div className="flex gap-1 mt-1">
                  <span className="text-[8px] font-mono text-strata-white">{day.high}°</span>
                  <span className="text-[8px] font-mono text-strata-silver/50">{day.low}°</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastStrip;
