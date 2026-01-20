import { useState } from 'react';
import { Globe, MapPin, Plus, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AALWorldClock from '@/components/strata/AALWorldClock';

interface Location {
  id: string;
  name: string;
  timezone: string;
  lat: number;
  lon: number;
}

const defaultLocations: Location[] = [
  { id: '1', name: 'Tokyo', timezone: 'Asia/Tokyo', lat: 35.6762, lon: 139.6503 },
  { id: '2', name: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.3193, lon: 114.1694 },
  { id: '3', name: 'Dubai', timezone: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
  { id: '4', name: 'London', timezone: 'Europe/London', lat: 51.5074, lon: -0.1278 },
  { id: '5', name: 'New York', timezone: 'America/New_York', lat: 40.7128, lon: -74.0060 },
  { id: '6', name: 'Los Angeles', timezone: 'America/Los_Angeles', lat: 34.0522, lon: -118.2437 },
  { id: '7', name: 'Sydney', timezone: 'Australia/Sydney', lat: -33.8688, lon: 151.2093 }
];

const popularLocations: Location[] = [
  { id: 'paris', name: 'Paris', timezone: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
  { id: 'singapore', name: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lon: 103.8198 },
  { id: 'miami', name: 'Miami', timezone: 'America/New_York', lat: 25.7617, lon: -80.1918 },
  { id: 'berlin', name: 'Berlin', timezone: 'Europe/Berlin', lat: 52.5200, lon: 13.4050 },
  { id: 'seoul', name: 'Seoul', timezone: 'Asia/Seoul', lat: 37.5665, lon: 126.9780 },
  { id: 'mumbai', name: 'Mumbai', timezone: 'Asia/Kolkata', lat: 19.0760, lon: 72.8777 },
  { id: 'shanghai', name: 'Shanghai', timezone: 'Asia/Shanghai', lat: 31.2304, lon: 121.4737 },
  { id: 'toronto', name: 'Toronto', timezone: 'America/Toronto', lat: 43.6532, lon: -79.3832 },
  { id: 'zurich', name: 'Zürich', timezone: 'Europe/Zurich', lat: 47.3769, lon: 8.5417 }
];

const StrataWorldSeven = () => {
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPopular = popularLocations.filter(
    loc => !locations.find(l => l.id === loc.id) &&
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addLocation = (location: Location) => {
    if (locations.length < 7) {
      setLocations([...locations, { ...location, id: crypto.randomUUID() }]);
    }
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/10 to-slate-950">
      {/* AAL-style luxury pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.03),transparent_50%)]" />
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-rose-400/5 to-transparent"
            style={{
              top: `${2.5 + i * 2.5}%`,
              left: 0,
              right: 0,
              transform: `rotate(${-0.3 + i * 0.02}deg)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 mb-6">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-rose-400 tracking-wider">STRATA WORLD · SEPTIMA</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extralight text-white mb-4 tracking-tight">
            Seven Time Zones
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg font-light">
            The ultimate global command center. Every major financial hub at your fingertips.
          </p>
        </div>

        {/* Clock display */}
        <div className="max-w-7xl mx-auto mb-12">
          <AALWorldClock locations={locations} variant="detailed" />
        </div>

        {/* Edit controls */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              {isEditing ? 'Done' : 'Customize Locations'}
            </Button>
          </div>

          {isEditing && (
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Current locations */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Current Locations ({locations.length}/7)</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700"
                    >
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span className="text-sm text-white">{loc.name}</span>
                      {locations.length > 1 && (
                        <button
                          onClick={() => removeLocation(loc.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add locations */}
              {locations.length < 7 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Add Location</h3>
                  <Input
                    placeholder="Search cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {filteredPopular.slice(0, 9).map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => addLocation(loc)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/30 rounded-lg transition-all duration-200"
                      >
                        <Plus className="w-3 h-3 text-rose-400" />
                        <span className="text-sm text-slate-300">{loc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-xs text-slate-600 font-mono tracking-wider">
            STRATA COLLECTION
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrataWorldSeven;
