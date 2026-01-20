import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HistoricalStorm {
  id: string;
  name: string;
  date: string;
  type: 'blizzard' | 'hurricane' | 'nor_easter' | 'tropical_storm' | 'ice_storm' | 'thunderstorm';
  snowfall?: number; // inches
  rainfall?: number; // inches
  windSpeed?: number; // mph
  windGusts?: number; // mph
  description: string;
  impact: string;
  category?: string; // For hurricanes
  recordBreaking?: boolean;
}

export interface LocationHistoryData {
  locationName: string;
  state: string;
  coordinates: { lat: number; lon: number };
  recordSnowfall?: { amount: number; date: string; storm: string };
  recordRainfall?: { amount: number; date: string; storm: string };
  recordWind?: { speed: number; date: string; storm: string };
  averageAnnualSnow?: number;
  storms: HistoricalStorm[];
}

// Curated historical storm data for major locations
const HISTORICAL_DATA: Record<string, LocationHistoryData> = {
  'rockaway-park-ny': {
    locationName: 'Rockaway Park',
    state: 'New York',
    coordinates: { lat: 40.5795, lon: -73.8420 },
    recordSnowfall: { amount: 30.5, date: '2016-01-23', storm: 'Blizzard of 2016 (Snowzilla)' },
    recordRainfall: { amount: 8.5, date: '2011-08-28', storm: 'Hurricane Irene' },
    recordWind: { speed: 90, date: '2012-10-29', storm: 'Hurricane Sandy' },
    averageAnnualSnow: 25.3,
    storms: [
      {
        id: 'snowzilla-2016',
        name: 'Blizzard of 2016 (Snowzilla)',
        date: '2016-01-22',
        type: 'blizzard',
        snowfall: 30.5,
        windSpeed: 45,
        windGusts: 60,
        description: 'Historic blizzard that paralyzed the East Coast. JFK Airport recorded 30.5 inches.',
        impact: 'Travel ban enacted, 13,000 flights canceled, over $1 billion in damages',
        recordBreaking: true
      },
      {
        id: 'sandy-2012',
        name: 'Hurricane Sandy',
        date: '2012-10-29',
        type: 'hurricane',
        rainfall: 4.8,
        windSpeed: 80,
        windGusts: 90,
        description: 'Superstorm that devastated the Rockaway Peninsula with historic storm surge.',
        impact: 'Catastrophic flooding, 100+ homes destroyed, months-long recovery',
        category: 'Post-Tropical',
        recordBreaking: true
      },
      {
        id: 'irene-2011',
        name: 'Hurricane Irene',
        date: '2011-08-28',
        type: 'hurricane',
        rainfall: 8.5,
        windSpeed: 65,
        description: 'Major hurricane that brought record rainfall to the NYC metro area.',
        impact: 'Widespread flooding, power outages for over 1 million',
        category: 'Category 1'
      },
      {
        id: 'noreaster-feb-2010',
        name: "Nor'easter (Snowmageddon)",
        date: '2010-02-10',
        type: 'nor_easter',
        snowfall: 20.9,
        windSpeed: 35,
        description: "Back-to-back nor'easters brought heavy snow to the Northeast.",
        impact: 'School closures, flight cancellations'
      },
      {
        id: 'blizzard-1888',
        name: 'Great Blizzard of 1888',
        date: '1888-03-12',
        type: 'blizzard',
        snowfall: 40,
        windSpeed: 50,
        windGusts: 80,
        description: 'Historic blizzard that shut down NYC for days with 40-50 foot snow drifts.',
        impact: 'Over 400 deaths, led to development of underground utilities',
        recordBreaking: true
      }
    ]
  },
  'falmouth-ma': {
    locationName: 'Falmouth',
    state: 'Massachusetts',
    coordinates: { lat: 41.5515, lon: -70.6148 },
    recordSnowfall: { amount: 27.6, date: '2013-02-09', storm: 'Blizzard Nemo' },
    recordRainfall: { amount: 6.2, date: '1991-08-19', storm: 'Hurricane Bob' },
    recordWind: { speed: 100, date: '1991-08-19', storm: 'Hurricane Bob' },
    averageAnnualSnow: 30.1,
    storms: [
      {
        id: 'nemo-2013',
        name: 'Blizzard Nemo',
        date: '2013-02-08',
        type: 'blizzard',
        snowfall: 27.6,
        windSpeed: 50,
        windGusts: 75,
        description: 'Powerful blizzard that struck New England with hurricane-force gusts.',
        impact: 'State of emergency, 650,000 without power in Massachusetts',
        recordBreaking: true
      },
      {
        id: 'bob-1991',
        name: 'Hurricane Bob',
        date: '1991-08-19',
        type: 'hurricane',
        rainfall: 6.2,
        windSpeed: 100,
        windGusts: 120,
        description: 'Category 2 hurricane that made direct impact on Cape Cod.',
        impact: 'Major coastal damage, record storm surge',
        category: 'Category 2',
        recordBreaking: true
      },
      {
        id: 'perfect-storm-1991',
        name: "The Perfect Storm (Halloween Nor'easter)",
        date: '1991-10-28',
        type: 'nor_easter',
        rainfall: 4.5,
        windSpeed: 65,
        windGusts: 90,
        description: "Rare hybrid storm formed from Hurricane Grace and a nor'easter.",
        impact: 'Significant coastal erosion, fishing vessel Andrea Gail lost'
      },
      {
        id: 'blizzard-1978',
        name: 'Blizzard of 1978',
        date: '1978-02-06',
        type: 'blizzard',
        snowfall: 27.1,
        windSpeed: 55,
        windGusts: 100,
        description: "One of New England's worst blizzards with paralyzing snow and wind.",
        impact: 'State of emergency, hundreds stranded on highways',
        recordBreaking: true
      }
    ]
  },
  'boston-ma': {
    locationName: 'Boston',
    state: 'Massachusetts',
    coordinates: { lat: 42.3601, lon: -71.0589 },
    recordSnowfall: { amount: 27.6, date: '2003-02-17', storm: "Presidents' Day Blizzard" },
    recordRainfall: { amount: 5.0, date: '1955-08-19', storm: 'Hurricane Diane' },
    averageAnnualSnow: 49.2,
    storms: [
      {
        id: 'juno-2015',
        name: 'Winter Storm Juno',
        date: '2015-01-26',
        type: 'blizzard',
        snowfall: 24.6,
        windSpeed: 45,
        windGusts: 60,
        description: 'Major blizzard that hit Boston during record-breaking snow season.',
        impact: 'Travel ban, 36,000 lightning strikes (thundersnow)'
      },
      {
        id: 'presidents-day-2003',
        name: "Presidents' Day Blizzard",
        date: '2003-02-17',
        type: 'blizzard',
        snowfall: 27.6,
        windSpeed: 35,
        description: 'Record-setting storm for Boston with heavy, wet snow.',
        impact: 'Structural collapses from snow weight',
        recordBreaking: true
      },
      {
        id: 'nemo-boston-2013',
        name: 'Blizzard Nemo',
        date: '2013-02-08',
        type: 'blizzard',
        snowfall: 24.9,
        windSpeed: 55,
        windGusts: 83,
        description: "Powerful nor'easter with heavy snow and wind.",
        impact: 'Governor declared state of emergency, driving ban'
      }
    ]
  },
  'new-york-ny': {
    locationName: 'New York City',
    state: 'New York',
    coordinates: { lat: 40.7128, lon: -74.0060 },
    recordSnowfall: { amount: 26.9, date: '2006-02-12', storm: 'February 2006 Blizzard' },
    recordRainfall: { amount: 7.19, date: '2021-09-01', storm: 'Hurricane Ida Remnants' },
    averageAnnualSnow: 29.8,
    storms: [
      {
        id: 'ida-2021',
        name: 'Hurricane Ida Remnants',
        date: '2021-09-01',
        type: 'tropical_storm',
        rainfall: 7.19,
        windSpeed: 55,
        description: 'Record-breaking rainfall in Central Park in a single hour (3.15 inches).',
        impact: 'Catastrophic flash flooding, subway inundation, 13 deaths in NYC',
        recordBreaking: true
      },
      {
        id: 'snowzilla-nyc-2016',
        name: 'Blizzard of 2016 (Snowzilla)',
        date: '2016-01-23',
        type: 'blizzard',
        snowfall: 26.8,
        windSpeed: 40,
        windGusts: 55,
        description: 'Second largest snowfall in NYC history.',
        impact: 'Broadway shows canceled, travel ban, Central Park sledding',
        recordBreaking: true
      },
      {
        id: 'feb-2006-blizzard',
        name: 'February 2006 Blizzard',
        date: '2006-02-12',
        type: 'blizzard',
        snowfall: 26.9,
        windSpeed: 35,
        description: 'Record snowfall for NYC with rapid accumulation.',
        impact: 'Largest snowfall in Central Park recorded history',
        recordBreaking: true
      }
    ]
  }
};

// Location aliases for flexible searching
const LOCATION_ALIASES: Record<string, string> = {
  'rockaway': 'rockaway-park-ny',
  'rockaway park': 'rockaway-park-ny',
  'rockaway beach': 'rockaway-park-ny',
  'far rockaway': 'rockaway-park-ny',
  'queens ny': 'rockaway-park-ny',
  'falmouth': 'falmouth-ma',
  'cape cod': 'falmouth-ma',
  'woods hole': 'falmouth-ma',
  'boston': 'boston-ma',
  'new york': 'new-york-ny',
  'nyc': 'new-york-ny',
  'manhattan': 'new-york-ny',
  'new york city': 'new-york-ny'
};

export const useWeatherHistory = () => {
  const [historyData, setHistoryData] = useState<LocationHistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = useCallback((query: string): LocationHistoryData | null => {
    const normalized = query.toLowerCase().trim();
    
    // Direct key match
    if (HISTORICAL_DATA[normalized]) {
      return HISTORICAL_DATA[normalized];
    }
    
    // Alias match
    for (const [alias, key] of Object.entries(LOCATION_ALIASES)) {
      if (normalized.includes(alias) || alias.includes(normalized)) {
        return HISTORICAL_DATA[key];
      }
    }
    
    // Partial match on location names
    for (const [key, data] of Object.entries(HISTORICAL_DATA)) {
      if (data.locationName.toLowerCase().includes(normalized) ||
          normalized.includes(data.locationName.toLowerCase())) {
        return data;
      }
    }
    
    return null;
  }, []);

  const fetchHistoryForLocation = useCallback(async (locationQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = searchLocation(locationQuery);
      
      if (data) {
        setHistoryData(data);
      } else {
        setError(`No historical storm data available for "${locationQuery}". Try searching for major cities like Boston, New York, or Falmouth.`);
        setHistoryData(null);
      }
    } catch (err) {
      setError('Failed to fetch historical data');
      console.error('Weather history error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchLocation]);

  const getAvailableLocations = useCallback(() => {
    return Object.values(HISTORICAL_DATA).map(data => ({
      name: data.locationName,
      state: data.state,
      key: `${data.locationName.toLowerCase().replace(/\s+/g, '-')}-${data.state.toLowerCase().substring(0, 2)}`
    }));
  }, []);

  const getStormsByType = useCallback((type: HistoricalStorm['type']) => {
    if (!historyData) return [];
    return historyData.storms.filter(storm => storm.type === type);
  }, [historyData]);

  const getRecordBreakingStorms = useCallback(() => {
    if (!historyData) return [];
    return historyData.storms.filter(storm => storm.recordBreaking);
  }, [historyData]);

  return {
    historyData,
    loading,
    error,
    fetchHistoryForLocation,
    getAvailableLocations,
    getStormsByType,
    getRecordBreakingStorms,
    searchLocation
  };
};

export default useWeatherHistory;
