import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudSnow,
  Cloud,
  Wind,
  Droplets,
  AlertTriangle,
  Search,
  Calendar,
  TrendingUp,
  MapPin,
  ChevronRight,
  Snowflake,
  Zap,
  X,
  History,
  Award,
  Loader2
} from 'lucide-react';
import { useWeatherHistory, HistoricalStorm, LocationHistoryData } from '@/hooks/useWeatherHistory';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WeatherHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: string;
}

const stormTypeIcons: Record<HistoricalStorm['type'], React.ReactNode> = {
  blizzard: <CloudSnow className="w-4 h-4" />,
  hurricane: <Wind className="w-4 h-4" />,
  nor_easter: <Cloud className="w-4 h-4" />,
  tropical_storm: <Droplets className="w-4 h-4" />,
  ice_storm: <Snowflake className="w-4 h-4" />,
  thunderstorm: <Zap className="w-4 h-4" />
};

const stormTypeColors: Record<HistoricalStorm['type'], string> = {
  blizzard: 'text-strata-cyan bg-strata-cyan/10 border-strata-cyan/30',
  hurricane: 'text-red-400 bg-red-400/10 border-red-400/30',
  nor_easter: 'text-strata-blue bg-strata-blue/10 border-strata-blue/30',
  tropical_storm: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  ice_storm: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  thunderstorm: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
};

const StormCard = ({ storm }: { storm: HistoricalStorm }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      className="bg-strata-black/40 border border-strata-steel/20 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-strata-steel/10 transition-colors"
      >
        <div className={`p-2 rounded-lg border ${stormTypeColors[storm.type]}`}>
          {stormTypeIcons[storm.type]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-instrument text-strata-white text-sm truncate">
              {storm.name}
            </h4>
            {storm.recordBreaking && (
              <Badge className="bg-strata-orange/20 text-strata-orange border-strata-orange/30 text-[9px]">
                <Award className="w-2.5 h-2.5 mr-1" />
                RECORD
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-strata-silver/60">
            <Calendar className="w-3 h-3" />
            {formatDate(storm.date)}
            {storm.category && (
              <Badge variant="outline" className="text-[8px] h-4 border-strata-steel/40">
                {storm.category}
              </Badge>
            )}
          </div>
        </div>
        
        <ChevronRight className={`w-4 h-4 text-strata-silver/40 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-strata-steel/20"
          >
            <div className="p-4 space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                {storm.snowfall && (
                  <div className="bg-strata-cyan/5 border border-strata-cyan/20 rounded p-2 text-center">
                    <CloudSnow className="w-4 h-4 text-strata-cyan mx-auto mb-1" />
                    <div className="font-mono text-lg text-strata-white">{storm.snowfall}"</div>
                    <div className="text-[8px] text-strata-silver/50 uppercase">Snowfall</div>
                  </div>
                )}
                {storm.rainfall && (
                  <div className="bg-strata-blue/5 border border-strata-blue/20 rounded p-2 text-center">
                    <Droplets className="w-4 h-4 text-strata-blue mx-auto mb-1" />
                    <div className="font-mono text-lg text-strata-white">{storm.rainfall}"</div>
                    <div className="text-[8px] text-strata-silver/50 uppercase">Rainfall</div>
                  </div>
                )}
                {storm.windSpeed && (
                  <div className="bg-strata-orange/5 border border-strata-orange/20 rounded p-2 text-center">
                    <Wind className="w-4 h-4 text-strata-orange mx-auto mb-1" />
                    <div className="font-mono text-lg text-strata-white">{storm.windSpeed}</div>
                    <div className="text-[8px] text-strata-silver/50 uppercase">MPH Wind</div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <p className="text-xs text-strata-silver/80 leading-relaxed">
                {storm.description}
              </p>
              
              {/* Impact */}
              <div className="flex items-start gap-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/80">{storm.impact}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RecordsOverview = ({ data }: { data: LocationHistoryData }) => (
  <div className="grid grid-cols-3 gap-2 mb-4">
    {data.recordSnowfall && (
      <div className="bg-gradient-to-br from-strata-cyan/10 to-transparent border border-strata-cyan/20 rounded-lg p-3 text-center">
        <CloudSnow className="w-5 h-5 text-strata-cyan mx-auto mb-2" />
        <div className="font-mono text-xl text-strata-white font-bold">{data.recordSnowfall.amount}"</div>
        <div className="text-[9px] text-strata-silver/50 uppercase mb-1">Record Snow</div>
        <div className="text-[8px] text-strata-cyan/70 truncate">{data.recordSnowfall.storm}</div>
      </div>
    )}
    {data.recordRainfall && (
      <div className="bg-gradient-to-br from-strata-blue/10 to-transparent border border-strata-blue/20 rounded-lg p-3 text-center">
        <Droplets className="w-5 h-5 text-strata-blue mx-auto mb-2" />
        <div className="font-mono text-xl text-strata-white font-bold">{data.recordRainfall.amount}"</div>
        <div className="text-[9px] text-strata-silver/50 uppercase mb-1">Record Rain</div>
        <div className="text-[8px] text-strata-blue/70 truncate">{data.recordRainfall.storm}</div>
      </div>
    )}
    {data.recordWind && (
      <div className="bg-gradient-to-br from-strata-orange/10 to-transparent border border-strata-orange/20 rounded-lg p-3 text-center">
        <Wind className="w-5 h-5 text-strata-orange mx-auto mb-2" />
        <div className="font-mono text-xl text-strata-white font-bold">{data.recordWind.speed}</div>
        <div className="text-[9px] text-strata-silver/50 uppercase mb-1">MPH Wind</div>
        <div className="text-[8px] text-strata-orange/70 truncate">{data.recordWind.storm}</div>
      </div>
    )}
  </div>
);

const WeatherHistoryPanel = ({ isOpen, onClose, initialLocation }: WeatherHistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState(initialLocation || '');
  const { historyData, loading, error, fetchHistoryForLocation, getAvailableLocations } = useWeatherHistory();
  
  useEffect(() => {
    if (initialLocation) {
      fetchHistoryForLocation(initialLocation);
    }
  }, [initialLocation, fetchHistoryForLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchHistoryForLocation(searchQuery);
    }
  };

  const availableLocations = getAvailableLocations();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-strata-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl max-h-[85vh] bg-strata-charcoal/95 backdrop-blur-xl border border-strata-steel/30 rounded-xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between px-5 py-4 bg-strata-black/50 border-b border-strata-steel/20">
            <div className="absolute top-0 left-0 w-4 h-4">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-strata-cyan/60 to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-strata-cyan/60 to-transparent" />
            </div>
            
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-strata-cyan" />
              <div>
                <h2 className="font-instrument text-strata-white text-lg">Storm History</h2>
                <p className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-wider">
                  Historical Weather Intelligence
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-strata-steel/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-strata-silver" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-4 border-b border-strata-steel/20">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-strata-silver/40" />
                <Input
                  type="text"
                  placeholder="Search location (e.g., Rockaway Park, Boston, NYC)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-strata-black/50 border-strata-steel/30 text-strata-white placeholder:text-strata-silver/40"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-strata-cyan/20 border border-strata-cyan/40 text-strata-cyan hover:bg-strata-cyan/30"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </form>
            
            {/* Quick location chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {availableLocations.map((loc) => (
                <button
                  key={loc.key}
                  onClick={() => {
                    setSearchQuery(loc.name);
                    fetchHistoryForLocation(loc.name);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono bg-strata-steel/10 border border-strata-steel/30 rounded-full text-strata-silver hover:bg-strata-steel/20 hover:text-strata-white transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {loc.name}, {loc.state}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-200px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-strata-cyan animate-spin" />
                <span className="text-sm font-mono text-strata-silver/60">Loading historical data...</span>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <p className="text-sm text-strata-silver/80">{error}</p>
              </div>
            ) : historyData ? (
              <div className="p-5">
                {/* Location header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-strata-orange/10 border border-strata-orange/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-strata-orange" />
                  </div>
                  <div>
                    <h3 className="font-instrument text-lg text-strata-white">
                      {historyData.locationName}, {historyData.state}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-strata-silver/50">
                      <span>{historyData.coordinates.lat.toFixed(4)}°N, {Math.abs(historyData.coordinates.lon).toFixed(4)}°W</span>
                      {historyData.averageAnnualSnow && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Avg: {historyData.averageAnnualSnow}" snow/year
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Records overview */}
                <RecordsOverview data={historyData} />

                {/* Storm tabs */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full bg-strata-steel/10 mb-4">
                    <TabsTrigger value="all" className="flex-1 text-xs data-[state=active]:bg-strata-cyan/20 data-[state=active]:text-strata-cyan">
                      All Storms
                    </TabsTrigger>
                    <TabsTrigger value="blizzards" className="flex-1 text-xs data-[state=active]:bg-strata-cyan/20 data-[state=active]:text-strata-cyan">
                      <CloudSnow className="w-3 h-3 mr-1" />
                      Blizzards
                    </TabsTrigger>
                    <TabsTrigger value="hurricanes" className="flex-1 text-xs data-[state=active]:bg-red-400/20 data-[state=active]:text-red-400">
                      <Wind className="w-3 h-3 mr-1" />
                      Hurricanes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3">
                    {historyData.storms.map((storm) => (
                      <StormCard key={storm.id} storm={storm} />
                    ))}
                  </TabsContent>

                  <TabsContent value="blizzards" className="space-y-3">
                    {historyData.storms
                      .filter((s) => s.type === 'blizzard' || s.type === 'nor_easter')
                      .map((storm) => (
                        <StormCard key={storm.id} storm={storm} />
                      ))}
                  </TabsContent>

                  <TabsContent value="hurricanes" className="space-y-3">
                    {historyData.storms
                      .filter((s) => s.type === 'hurricane' || s.type === 'tropical_storm')
                      .map((storm) => (
                        <StormCard key={storm.id} storm={storm} />
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="p-8 text-center">
                <History className="w-12 h-12 text-strata-silver/20 mx-auto mb-4" />
                <p className="text-sm text-strata-silver/60 mb-2">Search for a location to view historical storm data</p>
                <p className="text-xs text-strata-silver/40">Click on a quick location above or type in the search box</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-strata-black/30 border-t border-strata-steel/20 text-center">
            <span className="text-[9px] font-mono text-strata-silver/40 uppercase tracking-wider">
              STRATA Weather Intelligence • Historical Archive
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherHistoryPanel;
