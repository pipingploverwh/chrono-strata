import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, BarChart3, X, ChevronDown } from "lucide-react";
import { IndexHistoryChart } from "@/components/market/IndexHistoryChart";
import { GlassPanel, springConfig } from "./ArchitecturalElements";

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  updatedAt: string;
  region?: 'americas' | 'europe' | 'asia' | 'volatility';
  alertLevel?: 'normal' | 'warning' | 'critical';
  alertReason?: string;
}

interface MarketAlerts {
  critical: number;
  warning: number;
}

const regionLabels = {
  americas: { label: 'AMERICAS', flag: '🌎' },
  europe: { label: 'EUROPE', flag: '🌍' },
  asia: { label: 'ASIA-PAC', flag: '🌏' },
  volatility: { label: 'VIX', flag: '⚡' },
};

export const MarketAlertBadge = ({
  indices,
  alerts,
  isLoading,
  onRefresh
}: {
  indices: MarketIndex[];
  alerts: MarketAlerts;
  isLoading: boolean;
  onRefresh: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  
  const hasAlerts = alerts.critical > 0 || alerts.warning > 0;
  const topMovers = [...indices]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 4);
  
  // Get overall market sentiment
  const avgChange = indices.length > 0 
    ? indices.reduce((acc, i) => acc + i.changePercent, 0) / indices.length 
    : 0;
  
  return (
    <>
      {/* Minimal Badge - Always visible */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springConfig.gentle}
      >
        <GlassPanel 
          className="px-4 py-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            {/* Market Status Icon */}
            <motion.div 
              className={`p-2 rounded-lg ${
                alerts.critical > 0 
                  ? 'bg-rose-500/20 text-rose-400' 
                  : alerts.warning > 0 
                    ? 'bg-amber-500/20 text-amber-400'
                    : avgChange >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-zinc-500/10 text-zinc-400'
              }`}
              animate={alerts.critical > 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.6, repeat: alerts.critical > 0 ? Infinity : 0 }}
            >
              <Activity className="w-4 h-4" />
            </motion.div>
            
            {/* Market Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Markets</span>
                {hasAlerts && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider ${
                    alerts.critical > 0 
                      ? 'bg-rose-500/30 text-rose-300' 
                      : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    {alerts.critical > 0 ? `${alerts.critical} ALERT` : `${alerts.warning} WARN`}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {isLoading ? (
                  <div className="w-16 h-4 bg-zinc-700/50 rounded animate-pulse" />
                ) : (
                  <>
                    <span className={`text-sm font-mono ${avgChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                    </span>
                    <span className="text-[10px] text-zinc-600">avg</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Top Movers Preview */}
            <div className="hidden sm:flex items-center gap-2">
              {topMovers.slice(0, 2).map((index) => (
                <div 
                  key={index.symbol}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.02]"
                >
                  <span className="text-[9px] text-zinc-500 font-medium">{index.symbol}</span>
                  <span className={`text-[10px] font-mono ${index.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            
            {/* Expand Indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={springConfig.snappy}
              className="text-zinc-600"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </GlassPanel>
        
        {/* Expanded Market View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={springConfig.smooth}
              className="absolute top-full left-0 right-0 z-50 mt-2"
            >
              <GlassPanel className="p-4">
                {/* Header with close */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Full Market View</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    className="p-1 rounded-lg hover:bg-white/[0.05] text-zinc-600 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Market Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {indices.map((index) => {
                    const isPositive = index.change >= 0;
                    const alertLevel = index.alertLevel || 'normal';
                    
                    return (
                      <motion.div
                        key={index.symbol}
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                        className={`px-3 py-2 rounded-xl cursor-pointer transition-all ${
                          alertLevel === 'critical' 
                            ? 'bg-rose-500/10 border border-rose-500/30'
                            : alertLevel === 'warning'
                              ? 'bg-amber-500/10 border border-amber-500/20'
                              : 'bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-zinc-500">{regionLabels[index.region || 'americas'].flag}</span>
                          <BarChart3 className="w-3 h-3 text-zinc-600" />
                        </div>
                        <div className="text-[10px] font-medium text-zinc-300 truncate">{index.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-mono text-white">{index.price.toLocaleString()}</span>
                          <span className={`text-[10px] font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Refresh */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onRefresh(); }}
                  disabled={isLoading}
                  className="mt-3 w-full py-1.5 rounded-lg bg-white/[0.02] text-[10px] text-zinc-500 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors"
                >
                  {isLoading ? 'Refreshing...' : 'Refresh Markets'}
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Chart Modal */}
      {selectedIndex && (
        <IndexHistoryChart
          index={selectedIndex}
          isOpen={!!selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
};
