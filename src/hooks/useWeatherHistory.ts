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
  },
  'miami-fl': {
    locationName: 'Miami',
    state: 'Florida',
    coordinates: { lat: 25.7617, lon: -80.1918 },
    recordSnowfall: { amount: 0.2, date: '1977-01-19', storm: 'January 1977 Cold Wave' },
    recordRainfall: { amount: 15.1, date: '1947-10-11', storm: 'October 1947 Flood' },
    recordWind: { speed: 165, date: '1992-08-24', storm: 'Hurricane Andrew' },
    averageAnnualSnow: 0,
    storms: [
      {
        id: 'andrew-1992',
        name: 'Hurricane Andrew',
        date: '1992-08-24',
        type: 'hurricane',
        rainfall: 9.2,
        windSpeed: 165,
        windGusts: 175,
        description: 'Category 5 hurricane that devastated South Florida, one of the costliest US disasters.',
        impact: '$27.3 billion in damages, 65 deaths, 160,000 homeless',
        category: 'Category 5',
        recordBreaking: true
      },
      {
        id: 'irma-2017',
        name: 'Hurricane Irma',
        date: '2017-09-10',
        type: 'hurricane',
        rainfall: 12.5,
        windSpeed: 130,
        windGusts: 142,
        description: 'Massive Category 4 storm that struck Florida Keys and swept up the state.',
        impact: '6.5 million evacuated, widespread power outages, $50 billion damages',
        category: 'Category 4',
        recordBreaking: true
      },
      {
        id: 'wilma-2005',
        name: 'Hurricane Wilma',
        date: '2005-10-24',
        type: 'hurricane',
        rainfall: 5.3,
        windSpeed: 120,
        windGusts: 135,
        description: 'Strongest Atlantic hurricane ever recorded by pressure at the time.',
        impact: 'Severe flooding in Miami, 3.2 million without power',
        category: 'Category 3'
      },
      {
        id: 'king-1950',
        name: 'Hurricane King',
        date: '1950-10-17',
        type: 'hurricane',
        rainfall: 9.0,
        windSpeed: 122,
        description: 'Last major hurricane to make direct hit on downtown Miami.',
        impact: 'Extensive damage to downtown, $28 million in 1950 dollars',
        category: 'Category 4'
      },
      {
        id: 'katrina-2005',
        name: 'Hurricane Katrina',
        date: '2005-08-25',
        type: 'hurricane',
        rainfall: 6.3,
        windSpeed: 80,
        description: 'First landfall of Katrina before devastating Gulf Coast.',
        impact: '11 deaths in Florida, significant flooding',
        category: 'Category 1'
      }
    ]
  },
  'chicago-il': {
    locationName: 'Chicago',
    state: 'Illinois',
    coordinates: { lat: 41.8781, lon: -87.6298 },
    recordSnowfall: { amount: 23.0, date: '1967-01-26', storm: 'Blizzard of 1967' },
    recordRainfall: { amount: 6.64, date: '1987-08-14', storm: 'August 1987 Flood' },
    recordWind: { speed: 87, date: '2011-02-01', storm: 'Groundhog Day Blizzard' },
    averageAnnualSnow: 36.7,
    storms: [
      {
        id: 'blizzard-1967',
        name: 'Blizzard of 1967',
        date: '1967-01-26',
        type: 'blizzard',
        snowfall: 23.0,
        windSpeed: 50,
        windGusts: 60,
        description: 'Legendary Chicago blizzard that paralyzed the city for days.',
        impact: '800 CTA buses stranded, 50,000 abandoned cars, 76 deaths',
        recordBreaking: true
      },
      {
        id: 'groundhog-2011',
        name: 'Groundhog Day Blizzard',
        date: '2011-02-01',
        type: 'blizzard',
        snowfall: 21.2,
        windSpeed: 70,
        windGusts: 87,
        description: 'Third largest Chicago snowstorm with thunder and lightning.',
        impact: 'Lake Shore Drive stranded cars, 36-hour cleanup',
        recordBreaking: true
      },
      {
        id: 'blizzard-1999',
        name: 'New Year Blizzard of 1999',
        date: '1999-01-02',
        type: 'blizzard',
        snowfall: 21.6,
        windSpeed: 40,
        description: 'Second largest Chicago snowstorm, just after New Year.',
        impact: 'Both airports closed, emergency snow removal'
      },
      {
        id: 'heat-wave-1995',
        name: 'July 1995 Heat Wave',
        date: '1995-07-12',
        type: 'thunderstorm',
        windSpeed: 55,
        description: 'Deadly heat wave followed by severe thunderstorms.',
        impact: '739 heat-related deaths, massive power grid failures',
        recordBreaking: true
      },
      {
        id: 'derecho-2011',
        name: 'July 2011 Derecho',
        date: '2011-07-11',
        type: 'thunderstorm',
        rainfall: 3.5,
        windSpeed: 80,
        windGusts: 100,
        description: 'Rare derecho with destructive straight-line winds.',
        impact: '900,000 without power in Illinois, airport evacuated'
      }
    ]
  },
  'denver-co': {
    locationName: 'Denver',
    state: 'Colorado',
    coordinates: { lat: 39.7392, lon: -104.9903 },
    recordSnowfall: { amount: 45.7, date: '1913-12-04', storm: 'December 1913 Blizzard' },
    recordRainfall: { amount: 6.0, date: '2013-09-12', storm: 'September 2013 Flood' },
    recordWind: { speed: 92, date: '2006-12-20', storm: 'December 2006 Blizzard' },
    averageAnnualSnow: 56.5,
    storms: [
      {
        id: 'blizzard-2003',
        name: 'March 2003 Blizzard',
        date: '2003-03-17',
        type: 'blizzard',
        snowfall: 31.8,
        windSpeed: 40,
        windGusts: 55,
        description: "Largest single-storm snowfall in Denver's modern history.",
        impact: 'DIA closed, roofs collapsed, state of emergency',
        recordBreaking: true
      },
      {
        id: 'blizzard-2006',
        name: 'December 2006 Blizzard',
        date: '2006-12-20',
        type: 'blizzard',
        snowfall: 28.6,
        windSpeed: 60,
        windGusts: 92,
        description: 'Back-to-back blizzards crippled Colorado for weeks.',
        impact: 'DIA closed 45 hours, military rescue operations',
        recordBreaking: true
      },
      {
        id: 'flood-2013',
        name: 'September 2013 Flood',
        date: '2013-09-12',
        type: 'thunderstorm',
        rainfall: 17.0,
        windSpeed: 35,
        description: '1000-year flood event with biblical rainfall over 7 days.',
        impact: '8 deaths, 2,000 homes destroyed, $2 billion damages',
        recordBreaking: true
      },
      {
        id: 'blizzard-1913',
        name: 'December 1913 Blizzard',
        date: '1913-12-04',
        type: 'blizzard',
        snowfall: 45.7,
        windSpeed: 45,
        description: 'All-time record snowfall for Denver metro area.',
        impact: 'Historic accumulation, pre-modern era disruption',
        recordBreaking: true
      },
      {
        id: 'bomb-cyclone-2019',
        name: 'Bomb Cyclone 2019',
        date: '2019-03-13',
        type: 'blizzard',
        snowfall: 11.0,
        windSpeed: 80,
        windGusts: 97,
        description: 'Explosive cyclogenesis created hurricane-force winds.',
        impact: 'All flights canceled, 2,300 passengers stranded at DIA'
      }
    ]
  },
  'los-angeles-ca': {
    locationName: 'Los Angeles',
    state: 'California',
    coordinates: { lat: 34.0522, lon: -118.2437 },
    recordSnowfall: { amount: 2.0, date: '1932-01-15', storm: 'January 1932 Snow' },
    recordRainfall: { amount: 5.24, date: '2024-02-04', storm: 'February 2024 Atmospheric River' },
    recordWind: { speed: 102, date: '2011-12-01', storm: 'December 2011 Windstorm' },
    averageAnnualSnow: 0,
    storms: [
      {
        id: 'atmospheric-river-2024',
        name: 'February 2024 Atmospheric River',
        date: '2024-02-04',
        type: 'tropical_storm',
        rainfall: 5.24,
        windSpeed: 70,
        windGusts: 90,
        description: 'Record-breaking atmospheric river brought unprecedented rainfall to SoCal.',
        impact: 'Widespread flooding, mudslides, 9 deaths, Hollywood Hills evacuations',
        recordBreaking: true
      },
      {
        id: 'windstorm-2011',
        name: 'December 2011 Windstorm',
        date: '2011-12-01',
        type: 'thunderstorm',
        windSpeed: 97,
        windGusts: 102,
        description: 'Santa Ana winds reached hurricane force across LA basin.',
        impact: '400,000 without power, massive tree damage, fires sparked',
        recordBreaking: true
      },
      {
        id: 'flood-1938',
        name: 'LA Flood of 1938',
        date: '1938-03-02',
        type: 'tropical_storm',
        rainfall: 12.0,
        windSpeed: 35,
        description: 'Catastrophic flooding that reshaped LA River management.',
        impact: '115 deaths, $78 million damages, led to channelization project',
        recordBreaking: true
      },
      {
        id: 'hilary-2023',
        name: 'Tropical Storm Hilary',
        date: '2023-08-20',
        type: 'tropical_storm',
        rainfall: 3.18,
        windSpeed: 50,
        windGusts: 65,
        description: 'First tropical storm warning in Southern California history.',
        impact: 'Flash flooding, road closures, desert areas devastated',
        recordBreaking: true
      },
      {
        id: 'woolsey-fire-storm-2018',
        name: 'Woolsey Fire Storm',
        date: '2018-11-08',
        type: 'thunderstorm',
        windSpeed: 60,
        windGusts: 92,
        description: 'Extreme Santa Ana winds fueled catastrophic wildfire.',
        impact: '96,949 acres burned, 1,643 structures destroyed, 3 deaths'
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
  'new york city': 'new-york-ny',
  'miami': 'miami-fl',
  'miami beach': 'miami-fl',
  'south beach': 'miami-fl',
  'south florida': 'miami-fl',
  'chicago': 'chicago-il',
  'windy city': 'chicago-il',
  'chi-town': 'chicago-il',
  'denver': 'denver-co',
  'mile high city': 'denver-co',
  'colorado': 'denver-co',
  'los angeles': 'los-angeles-ca',
  'la': 'los-angeles-ca',
  'l.a.': 'los-angeles-ca',
  'hollywood': 'los-angeles-ca',
  'socal': 'los-angeles-ca',
  'southern california': 'los-angeles-ca'
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
