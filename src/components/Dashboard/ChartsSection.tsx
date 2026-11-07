import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Activity, Droplet, Waves, Calendar } from 'lucide-react';
import { TankHistoryItem } from '../../types/tank';

interface ChartsSectionProps {
  history: TankHistoryItem[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ history }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  // Filter or sample data according to selected range
  const displayData = React.useMemo(() => {
    if (history.length === 0) return [];
    if (timeRange === '1h') {
      return history.slice(-8);
    }
    if (timeRange === '7d') {
      // Create multi-day view points
      return history.map((item, idx) => ({
        ...item,
        timeLabel: `Day ${(idx % 7) + 1} ${item.timeLabel}`
      }));
    }
    return history;
  }, [history, timeRange]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft space-y-6">
      
      {/* Chart Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Telemetry Analytics &amp; Historian
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous analog turbidity tracking, water level storage trends, and pump duty cycles.
          </p>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
          <Calendar className="w-3.5 h-3.5 ml-2 text-slate-400" />
          {(['1h', '24h', '7d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 2 Primary Charts: Level and Turbidity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Water Level History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-brand-500" />
              <span>Tank Water Level Trend (%)</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              Full: 90% | Low: 20%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                  formatter={(val: number) => [`${val}%`, 'Level']}
                />
                <Area 
                  type="monotone" 
                  dataKey="levelPercent" 
                  stroke="#0284c7" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#levelGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Turbidity Voltage History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-500" />
              <span>Turbidity Signal (0–5V Output)</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              Safe Threshold &gt; 2.50V
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: number) => [`${Number(val).toFixed(2)} V`, 'Voltage']}
                />
                <Line 
                  type="monotone" 
                  dataKey="turbidityVoltage" 
                  stroke="#14b8a6" 
                  strokeWidth={2.5} 
                  dot={{ r: 2.5, fill: '#0d9488' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Pump Duty Cycle Timeline Bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-navy-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-brand-500" />
            <span>Pump Motor Duty Timeline (ON vs STANDBY)</span>
          </span>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ON (Active)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-navy-800" /> STANDBY
            </span>
          </div>
        </div>

        {/* Timeline segmented bars */}
        <div className="h-6 w-full rounded-xl bg-slate-100 dark:bg-navy-900 overflow-hidden flex p-0.5 gap-0.5">
          {displayData.map((item, idx) => (
            <div
              key={idx}
              title={`${item.timeLabel} - Pump: ${item.pumpState ? 'ON' : 'OFF'}`}
              className={`h-full flex-1 rounded-sm transition-all duration-200 ${
                item.pumpState ? 'bg-emerald-500 hover:brightness-110' : 'bg-slate-300 dark:bg-navy-800'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
