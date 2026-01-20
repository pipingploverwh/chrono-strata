import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TemperatureUnit = 'F' | 'C';

interface TemperatureContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  setUnit: (unit: TemperatureUnit) => void;
  formatTemp: (tempF: number) => string;
  convertTemp: (tempF: number) => number;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

const STORAGE_KEY = 'temperature_unit';

export const TemperatureProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'C' || stored === 'F') return stored;
    }
    return 'F';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnitState(prev => prev === 'F' ? 'C' : 'F');
  };

  const setUnit = (newUnit: TemperatureUnit) => {
    setUnitState(newUnit);
  };

  // Convert Fahrenheit to Celsius
  const convertTemp = (tempF: number): number => {
    if (unit === 'F') return tempF;
    return Math.round((tempF - 32) * 5 / 9);
  };

  // Format temperature with unit symbol
  const formatTemp = (tempF: number): string => {
    const converted = convertTemp(tempF);
    return `${converted}°${unit}`;
  };

  return (
    <TemperatureContext.Provider value={{ unit, toggleUnit, setUnit, formatTemp, convertTemp }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperatureUnit = () => {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error('useTemperatureUnit must be used within a TemperatureProvider');
  }
  return context;
};

export default useTemperatureUnit;
