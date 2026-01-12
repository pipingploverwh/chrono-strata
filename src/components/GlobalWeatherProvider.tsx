import { useState, createContext, useContext, ReactNode } from "react";
import WeatherOverlay from "./WeatherOverlay";
import WeatherToggle from "./WeatherToggle";

interface WeatherContextType {
  isWeatherOpen: boolean;
  toggleWeather: () => void;
  openWeather: () => void;
  closeWeather: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a GlobalWeatherProvider");
  }
  return context;
};

interface GlobalWeatherProviderProps {
  children: ReactNode;
}

const GlobalWeatherProvider = ({ children }: GlobalWeatherProviderProps) => {
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  const toggleWeather = () => setIsWeatherOpen((prev) => !prev);
  const openWeather = () => setIsWeatherOpen(true);
  const closeWeather = () => setIsWeatherOpen(false);

  return (
    <WeatherContext.Provider
      value={{ isWeatherOpen, toggleWeather, openWeather, closeWeather }}
    >
      {children}
      <WeatherToggle isActive={isWeatherOpen} onToggle={toggleWeather} />
      <WeatherOverlay isOpen={isWeatherOpen} onClose={closeWeather} />
    </WeatherContext.Provider>
  );
};

export default GlobalWeatherProvider;
