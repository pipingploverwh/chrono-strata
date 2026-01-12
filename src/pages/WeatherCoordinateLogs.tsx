import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, RefreshCw, MapPin, Clock, User, Globe, Filter, 
  Calendar, Search, Download, ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface CoordinateLog {
  id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  location_name: string | null;
  page_source: string | null;
  user_agent: string | null;
  created_at: string;
}

const WeatherCoordinateLogs = () => {
  const [logs, setLogs] = useState<CoordinateLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<CoordinateLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  // Filters
  const [sessionFilter, setSessionFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [uniqueSessions, setUniqueSessions] = useState<string[]>([]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('weather_coordinate_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      const typedData = (data || []) as CoordinateLog[];
      setLogs(typedData);
      setFilteredLogs(typedData);
      
      // Extract unique sessions
      const sessions = [...new Set(typedData.map(log => log.session_id))];
      setUniqueSessions(sessions);
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...logs];

    if (sessionFilter && sessionFilter !== "all") {
      filtered = filtered.filter(log => log.session_id === sessionFilter);
    }

    if (locationFilter) {
      const search = locationFilter.toLowerCase();
      filtered = filtered.filter(log => 
        log.location_name?.toLowerCase().includes(search) ||
        `${log.latitude},${log.longitude}`.includes(search)
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(log => new Date(log.created_at) >= dateFrom);
    }

    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => new Date(log.created_at) <= endOfDay);
    }

    setFilteredLogs(filtered);
  }, [logs, sessionFilter, locationFilter, dateFrom, dateTo]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const truncateSession = (session: string) => {
    return session.slice(0, 8) + '...';
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Session ID', 'Latitude', 'Longitude', 'Location', 'Page', 'User Agent'];
    const rows = filteredLogs.map(log => [
      log.created_at,
      log.session_id,
      log.latitude,
      log.longitude,
      log.location_name || '',
      log.page_source || '',
      log.user_agent || ''
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setSessionFilter("");
    setLocationFilter("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/strata">
              <Button variant="ghost" size="sm" className="text-strata-silver hover:text-strata-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-instrument text-2xl sm:text-3xl font-bold text-strata-white tracking-wide">
                COORDINATE LOGS
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-strata-silver/60 mt-1">
                Anonymous Weather Tracking • Real-time Data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-strata-silver/60">
              Last update: {formatTime(lastUpdate.toISOString())}
            </span>
            <Button 
              onClick={fetchLogs}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="bg-strata-charcoal/50 border-strata-steel/30 text-strata-silver hover:bg-strata-steel/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3 text-strata-lume" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Total Logs</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">{logs.length}</span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3 h-3 text-strata-orange" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Unique Sessions</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">{uniqueSessions.length}</span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3 h-3 text-strata-cyan" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Filtered</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">{filteredLogs.length}</span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-strata-blue" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Latest</span>
            </div>
            <span className="text-sm font-mono text-strata-white">
              {logs[0] ? formatTime(logs[0].created_at) : '--'}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="strata-pod rounded p-4 border border-strata-steel/30 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-strata-silver" />
            <span className="text-xs font-mono uppercase text-strata-silver">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Session Filter */}
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="bg-strata-charcoal/50 border-strata-steel/30 text-strata-white">
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {uniqueSessions.map(session => (
                  <SelectItem key={session} value={session}>
                    {truncateSession(session)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-strata-silver/50" />
              <Input
                placeholder="Search location/coords..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 bg-strata-charcoal/50 border-strata-steel/30 text-strata-white placeholder:text-strata-silver/50"
              />
            </div>

            {/* Date From */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-strata-charcoal/50 border-strata-steel/30 text-strata-white justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateFrom ? format(dateFrom, 'MMM d, yyyy') : 'From Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Date To */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-strata-charcoal/50 border-strata-steel/30 text-strata-white justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateTo ? format(dateTo, 'MMM d, yyyy') : 'To Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-strata-silver hover:text-strata-white"
              >
                Clear
              </Button>
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="bg-strata-charcoal/50 border-strata-steel/30 text-strata-silver hover:bg-strata-steel/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Log Table */}
        <div className="strata-pod rounded border border-strata-steel/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-strata-steel/20 border-b border-strata-steel/30">
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Timestamp
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Session
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Coordinates
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    Page
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-strata-silver">
                      Loading...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-strata-silver">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <tr 
                      key={log.id} 
                      className={`border-b border-strata-steel/20 hover:bg-strata-steel/10 transition-colors ${
                        index === 0 ? 'bg-strata-lume/5' : ''
                      }`}
                    >
                      <td className="px-4 py-2">
                        <span className={`text-xs font-mono ${index === 0 ? 'text-strata-lume' : 'text-strata-white'}`}>
                          {formatTime(log.created_at)}
                        </span>
                        {index === 0 && (
                          <span className="ml-2 text-[8px] font-mono uppercase text-strata-lume animate-lume-pulse">
                            LATEST
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs font-mono text-strata-cyan" title={log.session_id}>
                          {truncateSession(log.session_id)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs font-mono text-strata-white">
                          {Number(log.latitude).toFixed(4)}°, {Number(log.longitude).toFixed(4)}°
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs text-strata-silver">
                          {log.location_name || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs font-mono text-strata-orange">
                          {log.page_source || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[10px] text-strata-silver/60 truncate max-w-[150px] block" title={log.user_agent || ''}>
                          {log.user_agent ? (
                            log.user_agent.includes('Mobile') ? 'Mobile' : 
                            log.user_agent.includes('Windows') ? 'Windows' :
                            log.user_agent.includes('Mac') ? 'Mac' : 'Other'
                          ) : '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-strata-silver/40 uppercase tracking-wider">
          <span>Anonymous Coordinate Tracking</span>
          <span>Data stored securely • No PII collected</span>
          <span>Real-time updates</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCoordinateLogs;
