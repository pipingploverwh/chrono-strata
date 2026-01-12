import { useState, useEffect } from "react";
import { CloudSun, MapPin, Loader2, Thermometer, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherGateProps {
  onGranted: () => void;
  children: React.ReactNode;
}

interface WeatherData {
  temp: number;
  conditions: string;
  humidity: number;
  wind: number;
  location: string;
}

const WeatherGate = ({ onGranted, children }: WeatherGateProps) => {
  const [permissionState, setPermissionState] = useState<"pending" | "requesting" | "granted" | "denied">("pending");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if permission was already granted this session
  useEffect(() => {
    const granted = sessionStorage.getItem("weather_access_granted");
    if (granted === "true") {
      setPermissionState("granted");
      onGranted();
    }
  }, [onGranted]);

  const requestWeatherAccess = async () => {
    setPermissionState("requesting");
    setLoading(true);

    try {
      // Request geolocation permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;

      // Fetch weather data using Open-Meteo (free, no API key needed)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`
      );

      if (response.ok) {
        const data = await response.json();
        
        // Get location name via reverse geocoding
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoResponse.json();
        
        const weatherCodes: Record<number, string> = {
          0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
          45: "Foggy", 48: "Fog", 51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
          61: "Light Rain", 63: "Rain", 65: "Heavy Rain", 71: "Light Snow", 73: "Snow", 75: "Heavy Snow",
          80: "Light Showers", 81: "Showers", 82: "Heavy Showers", 95: "Thunderstorm"
        };

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          conditions: weatherCodes[data.current.weather_code] || "Unknown",
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          location: geoData.address?.city || geoData.address?.town || geoData.address?.village || "Your Location"
        });
      }

      // Grant access
      sessionStorage.setItem("weather_access_granted", "true");
      setPermissionState("granted");
      
      // Small delay to show weather before transitioning
      setTimeout(() => {
        onGranted();
      }, 2000);

    } catch (error) {
      console.error("Weather access error:", error);
      // Still grant access on error - just won't have weather data
      sessionStorage.setItem("weather_access_granted", "true");
      setPermissionState("granted");
      setTimeout(() => {
        onGranted();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  if (permissionState === "granted" && !weather) {
    return <>{children}</>;
  }

  if (permissionState === "granted" && weather) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-1000">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
            <Thermometer className="w-8 h-8 text-purple-400" />
            <div className="text-left">
              <div className="text-4xl font-light text-white">{weather.temp}°F</div>
              <div className="text-sm text-purple-300">{weather.conditions}</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-neutral-400 text-sm mb-4">
            <span className="flex items-center gap-2">
              <Wind className="w-4 h-4" /> {weather.wind} mph
            </span>
            <span className="flex items-center gap-2">
              <Droplets className="w-4 h-4" /> {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs">
            <MapPin className="w-3 h-3" />
            {weather.location}
          </div>
          <p className="text-neutral-600 text-xs mt-6 animate-pulse">Entering site...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          {/* Mini STRATA widget */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-pulse" />
              <div className="absolute inset-2 rounded-full border border-purple-400/20" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600/20 to-transparent flex items-center justify-center">
                <CloudSun className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">STRATA</span>
            </div>
          </div>

          <h2 className="text-2xl font-light text-white mb-3">
            Weather Intelligence Required
          </h2>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Lavandar uses your location to provide personalized weather intelligence 
            and optimize your experience across the platform.
          </p>

          <Button
            onClick={requestWeatherAccess}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm tracking-wider uppercase px-8 py-6 rounded-none w-full group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Accessing Weather...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Grant Weather Access
              </>
            )}
          </Button>

          <p className="text-neutral-600 text-xs mt-6">
            Your location data is used only for weather services and is never stored.
          </p>
        </div>
      </div>

      {/* Dimmed content behind */}
      <div className="opacity-10 pointer-events-none">
        {children}
      </div>
    </>
  );
};

export default WeatherGate;
