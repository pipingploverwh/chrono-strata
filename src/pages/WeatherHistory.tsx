import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CloudSnow,
  Wind,
  Droplets,
  AlertTriangle,
  Search,
  Calendar,
  TrendingUp,
  MapPin,
  ChevronRight,
  History,
  Award,
  Loader2,
  ArrowLeft,
  Cloud,
  Snowflake,
  Zap,
  ThermometerSnowflake
} from 'lucide-react';
import { useWeatherHistory, HistoricalStorm, LocationHistoryData } from '@/hooks/useWeatherHistory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const stormTypeIcons: Record<HistoricalStorm['type'], React.ReactNode> = {
  blizzard: <CloudSnow className="w-5 h-5" />,
  hurricane: <Wind className="w-5 h-5" />,
  nor_easter: <Cloud className="w-5 h-5" />,
  tropical_storm: <Droplets className="w-5 h-5" />,
  ice_storm: <Snowflake className="w-5 h-5" />,
  thunderstorm: <Zap className="w-5 h-5" />
};

const stormTypeLabels: Record<HistoricalStorm['type'], string> = {
  blizzard: 'Blizzard',
  hurricane: 'Hurricane',
  nor_easter: "Nor'easter",
  tropical_storm: 'Tropical Storm',
  ice_storm: 'Ice Storm',
  thunderstorm: 'Thunderstorm'
};

const StormDetailCard = ({ storm }: { storm: HistoricalStorm }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-strata-charcoal/60 border border-strata-steel/30 rounded-xl overflow-hidden hover:border-strata-steel/50 transition-colors"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              storm.type === 'hurricane' ? 'bg-red-500/10 text-red-400' :
              storm.type === 'blizzard' ? 'bg-strata-cyan/10 text-strata-cyan' :
              'bg-strata-blue/10 text-strata-blue'
            }`}>
              {stormTypeIcons[storm.type]}
            </div>
            <div>
              <h3 className="font-instrument text-xl text-strata-white mb-1">
                {storm.name}
              </h3>
              <div className="flex items-center gap-3 text-sm font-mono text-strata-silver/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(storm.date)}
                </span>
                <Badge variant="outline" className="text-xs border-strata-steel/40">
                  {stormTypeLabels[storm.type]}
                </Badge>
                {storm.category && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {storm.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {storm.recordBreaking && (
            <Badge className="bg-strata-orange/20 text-strata-orange border-strata-orange/30">
              <Award className="w-3 h-3 mr-1" />
              RECORD BREAKING
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-strata-silver/80 mb-4 leading-relaxed">
          {storm.description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {storm.snowfall && (
            <div className="bg-strata-cyan/5 border border-strata-cyan/20 rounded-lg p-3 text-center">
              <CloudSnow className="w-5 h-5 text-strata-cyan mx-auto mb-2" />
              <div className="font-mono text-2xl text-strata-white font-bold">{storm.snowfall}"</div>
              <div className="text-[10px] text-strata-silver/50 uppercase">Snowfall</div>
            </div>
          )}
          {storm.rainfall && (
            <div className="bg-strata-blue/5 border border-strata-blue/20 rounded-lg p-3 text-center">
              <Droplets className="w-5 h-5 text-strata-blue mx-auto mb-2" />
              <div className="font-mono text-2xl text-strata-white font-bold">{storm.rainfall}"</div>
              <div className="text-[10px] text-strata-silver/50 uppercase">Rainfall</div>
            </div>
          )}
          {storm.windSpeed && (
            <div className="bg-strata-orange/5 border border-strata-orange/20 rounded-lg p-3 text-center">
              <Wind className="w-5 h-5 text-strata-orange mx-auto mb-2" />
              <div className="font-mono text-2xl text-strata-white font-bold">{storm.windSpeed}</div>
              <div className="text-[10px] text-strata-silver/50 uppercase">MPH Wind</div>
            </div>
          )}
          {storm.windGusts && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-center">
              <Wind className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="font-mono text-2xl text-strata-white font-bold">{storm.windGusts}</div>
              <div className="text-[10px] text-strata-silver/50 uppercase">MPH Gusts</div>
            </div>
          )}
        </div>

        {/* Impact */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase mb-1">Impact</div>
            <div className="text-sm text-amber-200/80">{storm.impact}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function WeatherHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const { historyData, loading, error, fetchHistoryForLocation, getAvailableLocations } = useWeatherHistory();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchHistoryForLocation(searchQuery);
    }
  };

  const availableLocations = getAvailableLocations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-strata-black via-strata-charcoal to-strata-black">
      {/* Header */}
      <div className="border-b border-strata-steel/30 bg-strata-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="p-2 hover:bg-strata-steel/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-strata-silver" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-strata-cyan/10 border border-strata-cyan/30 flex items-center justify-center">
                  <History className="w-5 h-5 text-strata-cyan" />
                </div>
                <div>
                  <h1 className="font-instrument text-xl text-strata-white">Storm History</h1>
                  <p className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-wider">
                    Historical Weather Intelligence
                  </p>
                </div>
              </div>
            </div>
            <Badge className="bg-strata-cyan/10 text-strata-cyan border-strata-cyan/30 font-mono">
              <ThermometerSnowflake className="w-3 h-3 mr-1" />
              STRATA ARCHIVE
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-strata-silver/40" />
              <Input
                type="text"
                placeholder="Search location (e.g., Rockaway Park, Boston, NYC, Falmouth)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-strata-charcoal/60 border-strata-steel/30 text-strata-white placeholder:text-strata-silver/40 text-lg"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 px-8 bg-strata-cyan/20 border border-strata-cyan/40 text-strata-cyan hover:bg-strata-cyan/30 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </Button>
          </form>
          
          {/* Quick location chips */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-mono text-strata-silver/40 uppercase mr-2 self-center">Quick Access:</span>
            {availableLocations.map((loc) => (
              <button
                key={loc.key}
                onClick={() => {
                  setSearchQuery(loc.name);
                  fetchHistoryForLocation(loc.name);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-mono bg-strata-steel/10 border border-strata-steel/30 rounded-full text-strata-silver hover:bg-strata-steel/20 hover:text-strata-white hover:border-strata-steel/50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {loc.name}, {loc.state}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-strata-cyan animate-spin" />
            <span className="text-lg font-mono text-strata-silver/60">Loading historical data...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-strata-charcoal/40 border border-strata-steel/20 rounded-xl">
            <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <p className="text-lg text-strata-silver/80 mb-2">{error}</p>
            <p className="text-sm text-strata-silver/50">Try one of the quick access locations above</p>
          </div>
        ) : historyData ? (
          <div>
            {/* Location Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-strata-orange/10 border border-strata-orange/30 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-strata-orange" />
              </div>
              <div>
                <h2 className="font-instrument text-3xl text-strata-white">
                  {historyData.locationName}, {historyData.state}
                </h2>
                <div className="flex items-center gap-4 text-sm font-mono text-strata-silver/50">
                  <span>{historyData.coordinates.lat.toFixed(4)}°N, {Math.abs(historyData.coordinates.lon).toFixed(4)}°W</span>
                  {historyData.averageAnnualSnow && (
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      Avg: {historyData.averageAnnualSnow}" snow/year
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Records Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {historyData.recordSnowfall && (
                <div className="bg-gradient-to-br from-strata-cyan/10 to-transparent border border-strata-cyan/30 rounded-xl p-6 text-center">
                  <CloudSnow className="w-8 h-8 text-strata-cyan mx-auto mb-3" />
                  <div className="font-mono text-4xl text-strata-white font-bold mb-1">{historyData.recordSnowfall.amount}"</div>
                  <div className="text-xs text-strata-silver/50 uppercase mb-2">Record Snowfall</div>
                  <div className="text-sm text-strata-cyan/80">{historyData.recordSnowfall.storm}</div>
                  <div className="text-xs text-strata-silver/40 mt-1">{historyData.recordSnowfall.date}</div>
                </div>
              )}
              {historyData.recordRainfall && (
                <div className="bg-gradient-to-br from-strata-blue/10 to-transparent border border-strata-blue/30 rounded-xl p-6 text-center">
                  <Droplets className="w-8 h-8 text-strata-blue mx-auto mb-3" />
                  <div className="font-mono text-4xl text-strata-white font-bold mb-1">{historyData.recordRainfall.amount}"</div>
                  <div className="text-xs text-strata-silver/50 uppercase mb-2">Record Rainfall</div>
                  <div className="text-sm text-strata-blue/80">{historyData.recordRainfall.storm}</div>
                  <div className="text-xs text-strata-silver/40 mt-1">{historyData.recordRainfall.date}</div>
                </div>
              )}
              {historyData.recordWind && (
                <div className="bg-gradient-to-br from-strata-orange/10 to-transparent border border-strata-orange/30 rounded-xl p-6 text-center">
                  <Wind className="w-8 h-8 text-strata-orange mx-auto mb-3" />
                  <div className="font-mono text-4xl text-strata-white font-bold mb-1">{historyData.recordWind.speed} mph</div>
                  <div className="text-xs text-strata-silver/50 uppercase mb-2">Record Wind</div>
                  <div className="text-sm text-strata-orange/80">{historyData.recordWind.storm}</div>
                  <div className="text-xs text-strata-silver/40 mt-1">{historyData.recordWind.date}</div>
                </div>
              )}
            </div>

            {/* Storm List */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-instrument text-xl text-strata-white">Notable Storms</h3>
                <Badge variant="outline" className="border-strata-steel/40 text-strata-silver">
                  {historyData.storms.length} events
                </Badge>
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full max-w-md bg-strata-steel/10 mb-6">
                  <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-strata-cyan/20 data-[state=active]:text-strata-cyan">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="blizzards" className="flex-1 data-[state=active]:bg-strata-cyan/20 data-[state=active]:text-strata-cyan">
                    <CloudSnow className="w-4 h-4 mr-1.5" />
                    Blizzards
                  </TabsTrigger>
                  <TabsTrigger value="hurricanes" className="flex-1 data-[state=active]:bg-red-400/20 data-[state=active]:text-red-400">
                    <Wind className="w-4 h-4 mr-1.5" />
                    Hurricanes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {historyData.storms.map((storm) => (
                    <StormDetailCard key={storm.id} storm={storm} />
                  ))}
                </TabsContent>

                <TabsContent value="blizzards" className="space-y-4">
                  {historyData.storms
                    .filter((s) => s.type === 'blizzard' || s.type === 'nor_easter' || s.type === 'ice_storm')
                    .map((storm) => (
                      <StormDetailCard key={storm.id} storm={storm} />
                    ))}
                </TabsContent>

                <TabsContent value="hurricanes" className="space-y-4">
                  {historyData.storms
                    .filter((s) => s.type === 'hurricane' || s.type === 'tropical_storm')
                    .map((storm) => (
                      <StormDetailCard key={storm.id} storm={storm} />
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center bg-strata-charcoal/30 border border-strata-steel/20 rounded-xl">
            <History className="w-20 h-20 text-strata-silver/10 mx-auto mb-6" />
            <h3 className="font-instrument text-2xl text-strata-white mb-2">Explore Storm History</h3>
            <p className="text-strata-silver/60 mb-4 max-w-md mx-auto">
              Search for a location to discover historical storm data, record-breaking events, and climate patterns.
            </p>
            <p className="text-sm text-strata-silver/40">
              Click a quick access location above or enter a city name
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-strata-steel/20 mt-12 py-6 text-center">
        <span className="text-xs font-mono text-strata-silver/40 uppercase tracking-wider">
          STRATA Weather Intelligence • Historical Storm Archive • Data from NOAA & NWS
        </span>
      </div>
    </div>
  );
}
