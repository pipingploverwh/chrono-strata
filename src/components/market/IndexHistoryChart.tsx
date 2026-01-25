import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Calendar, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface HistoricalDataPoint {
  time: string;
  price: number;
  timestamp: number;
}

interface IndexHistoryChartProps {
  index: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
    region?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const springConfig = {
  smooth: { type: "spring" as const, stiffness: 200, damping: 25 },
};

const CustomTooltip = ({ 
  active, 
  payload, 
  isPositive 
}: { 
  active?: boolean; 
  payload?: any[]; 
  isPositive: boolean;
}) => {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative px-4 py-3 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative space-y-1.5">
        <p className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">
          {data.time}
        </p>
        <p className={`text-lg font-light font-mono tracking-wide ${
          isPositive ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {data.price.toLocaleString('en-US', { 
            minimumFractionDigits: data.price < 100 ? 2 : 0,
            maximumFractionDigits: data.price < 100 ? 2 : 0 
          })}
        </p>
      </div>
    </motion.div>
  );
};

export const IndexHistoryChart = ({ index, isOpen, onClose }: IndexHistoryChartProps) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1D' | '5D' | '1M'>('1D');
  
  const isPositive = index.change >= 0;

  useEffect(() => {
    if (isOpen && index.symbol) {
      fetchHistoricalData();
    }
  }, [isOpen, index.symbol, timeRange]);

  const fetchHistoricalData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { 
          action: 'historical',
          symbol: index.symbol,
          range: timeRange 
        },
      });

      if (error) throw error;
      
      if (data?.historical) {
        setHistoricalData(data.historical);
      } else {
        // Generate mock intraday data based on current price
        const mockData = generateMockData(index.price, index.previousClose, timeRange);
        setHistoricalData(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      const mockData = generateMockData(index.price, index.previousClose, timeRange);
      setHistoricalData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (
    currentPrice: number, 
    previousClose: number, 
    range: '1D' | '5D' | '1M'
  ): HistoricalDataPoint[] => {
    const points: HistoricalDataPoint[] = [];
    const now = Date.now();
    
    let numPoints: number;
    let intervalMs: number;
    let formatTime: (date: Date) => string;
    
    switch (range) {
      case '1D':
        numPoints = 78; // 6.5 hours of trading, 5-min intervals
        intervalMs = 5 * 60 * 1000;
        formatTime = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        break;
      case '5D':
        numPoints = 65; // 5 days, hourly intervals
        intervalMs = 60 * 60 * 1000;
        formatTime = (d) => d.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' });
        break;
      case '1M':
        numPoints = 30; // 30 days
        intervalMs = 24 * 60 * 60 * 1000;
        formatTime = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        break;
    }
    
    // Start from previous close and work toward current price
    const startPrice = range === '1D' ? previousClose : currentPrice * (1 - Math.random() * 0.05);
    const priceChange = currentPrice - startPrice;
    
    for (let i = 0; i < numPoints; i++) {
      const timestamp = now - (numPoints - 1 - i) * intervalMs;
      const progress = i / (numPoints - 1);
      
      // Add some volatility
      const volatility = (Math.random() - 0.5) * 0.003 * currentPrice;
      const trendPrice = startPrice + (priceChange * progress);
      const price = trendPrice + volatility;
      
      points.push({
        time: formatTime(new Date(timestamp)),
        price: Math.round(price * 100) / 100,
        timestamp,
      });
    }
    
    // Ensure last point is exactly current price
    if (points.length > 0) {
      points[points.length - 1].price = currentPrice;
    }
    
    return points;
  };

  const minPrice = Math.min(...historicalData.map(d => d.price)) * 0.999;
  const maxPrice = Math.max(...historicalData.map(d => d.price)) * 1.001;
  const priceRange = maxPrice - minPrice;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={springConfig.smooth}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Glass shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-white/5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-light tracking-wide text-white">{index.name}</h2>
                  <span className="text-xs font-mono text-zinc-500 tracking-wider">{index.symbol}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-light font-mono text-white">
                    {index.price.toLocaleString('en-US', { 
                      minimumFractionDigits: index.price < 100 ? 2 : 0,
                      maximumFractionDigits: index.price < 100 ? 2 : 0 
                    })}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={`text-sm font-mono font-medium ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 mt-4">
              {(['1D', '5D', '1M'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all ${
                    timeRange === range
                      ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'bg-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  {range}
                </button>
              ))}
              <div className="flex-1" />
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] tracking-wider">
                  {timeRange === '1D' ? 'INTRADAY' : timeRange === '5D' ? '5 DAY' : '1 MONTH'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="relative px-6 py-6">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <motion.div
                  className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={historicalData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={`gradient-${index.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop 
                          offset="0%" 
                          stopColor={isPositive ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'} 
                          stopOpacity={0.3} 
                        />
                        <stop 
                          offset="100%" 
                          stopColor={isPositive ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'} 
                          stopOpacity={0} 
                        />
                      </linearGradient>
                    </defs>
                    
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      interval="preserveStartEnd"
                      tickCount={5}
                    />
                    <YAxis 
                      domain={[minPrice, maxPrice]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      tickFormatter={(value) => value.toLocaleString('en-US', { notation: 'compact' })}
                      width={50}
                    />
                    
                    {/* Previous close reference line */}
                    {timeRange === '1D' && (
                      <ReferenceLine 
                        y={index.previousClose} 
                        stroke="#52525b" 
                        strokeDasharray="4 4"
                        strokeWidth={1}
                      />
                    )}
                    
                    <Tooltip 
                      content={<CustomTooltip isPositive={isPositive} />}
                      cursor={{
                        stroke: isPositive ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)',
                        strokeWidth: 1,
                        strokeDasharray: '4 4',
                      }}
                    />
                    
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPositive ? 'rgb(16, 185, 129)' : 'rgb(244, 63, 94)'}
                      strokeWidth={2}
                      fill={`url(#gradient-${index.symbol})`}
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          {/* Footer Stats */}
          <div className="relative px-6 py-4 border-t border-white/5 grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 tracking-wider uppercase">Open</p>
              <p className="text-sm font-mono text-zinc-300">
                {index.previousClose.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 tracking-wider uppercase">Prev Close</p>
              <p className="text-sm font-mono text-zinc-300">
                {index.previousClose.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 tracking-wider uppercase">Change</p>
              <p className={`text-sm font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}{index.change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 tracking-wider uppercase">Region</p>
              <p className="text-sm text-zinc-300 capitalize">{index.region || 'N/A'}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
