import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  RotateCw, 
  Activity, 
  AlertOctagon, 
  Layers
} from 'lucide-react';
import { TankLiveState, TankHistoryItem, TankEvent, OperationMode } from '../../types/tank';
import { TankGauge } from './TankGauge';
import { TurbidityGauge } from './TurbidityGauge';
import { IRSensorCard } from './IRSensorCard';
import { ActuatorControls } from './ActuatorControls';
import { AlarmBanner } from './AlarmBanner';
import { ChartsSection } from './ChartsSection';
import { EventLogTable } from './EventLogTable';
import { SimulationPanel } from './SimulationPanel';

interface LiveDashboardProps {
  liveState: TankLiveState;
  history: TankHistoryItem[];
  events: TankEvent[];
  isFirebase: boolean;
  onSetPump: (state: boolean) => Promise<{ success: boolean; reason?: string }>;
  onSetValve: (state: boolean) => Promise<{ success: boolean; reason?: string }>;
  onSetMode: (mode: OperationMode) => Promise<void>;
  onShowToast: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  liveState,
  history,
  events,
  isFirebase,
  onSetPump,
  onSetValve,
  onSetMode,
  onShowToast,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Trigger manual refresh / sync feedback
  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      onShowToast("Telemetry refreshed from gateway buffer.", "info");
    }, 400);
  };

  const handlePumpToggle = async (targetState: boolean) => {
    const res = await onSetPump(targetState);
    if (!res.success && res.reason) {
      onShowToast(res.reason, "error");
    } else {
      onShowToast(`Pump motor turned ${targetState ? 'ON' : 'OFF'}.`, "success");
    }
  };

  const handleValveToggle = async (targetState: boolean) => {
    const res = await onSetValve(targetState);
    if (!res.success && res.reason) {
      onShowToast(res.reason, "error");
    } else {
      onShowToast(`Inlet solenoid valve ${targetState ? 'OPENED' : 'CLOSED'}.`, "success");
    }
  };

  const handleModeChange = async (mode: OperationMode) => {
    await onSetMode(mode);
    onShowToast(`System operating mode switched to ${mode}.`, "info");
  };

  // Format last seen timestamp
  const formatLastSeen = (ts: number) => {
    const secondsAgo = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (secondsAgo < 2) return "Just now";
    return `${secondsAgo}s ago`;
  };

  return (
    <section id="dashboard" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
      
      {/* Dashboard Top Header & Telemetry Health Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 dark:border-navy-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">
              REAL-TIME IOT TELEMETRY
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Live Monitoring &amp; Automation Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Connected to ESP32 node running closed-loop sensor sampling and failsafe actuator drivers.
          </p>
        </div>

        {/* Telemetry Status Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Online/Offline Status Pill */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-bold transition-all ${
            liveState.isOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 animate-pulse'
          }`}>
            {liveState.isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span>GATEWAY ONLINE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-rose-500" />
                <span>SENSOR OFFLINE (&gt;10s)</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </>
            )}
          </div>

          {/* Wi-Fi RSSI pill */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <span>RSSI:</span>
            <span className="font-bold text-slate-900 dark:text-white">{liveState.wifiRssi} dBm</span>
          </div>

          {/* Last Seen Pill */}
          <div className="px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Sync: {formatLastSeen(liveState.lastSeen)}</span>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh stream buffer"
            className="p-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Emergency Alarm Banner if contamination or obstacle */}
      <AlarmBanner liveState={liveState} />

      {/* Stats Cards Row: runtime, fill cycles, contamination events, system state */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: System State Chip */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              OPERATING REGIME
            </span>
            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 truncate max-w-[180px]">
              {liveState.systemStateLabel}
            </div>
            <div className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
              Flowchart Node Tracked
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Pump Runtime */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PUMP RUNTIME TODAY
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {Math.floor(liveState.pumpRunSeconds / 60)}m {liveState.pumpRunSeconds % 60}s
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Thermal dry-run safe
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Fill Cycles */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL FILL CYCLES
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {liveState.fillCycles} <span className="text-xs font-normal text-slate-500">Cycles</span>
            </div>
            <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">
              Hysteresis automated
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 4: Contamination Events */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CONTAMINATION INTERCEPTS
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {liveState.contaminationEvents} <span className="text-xs font-normal text-slate-500">Inlets Blocked</span>
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
              Zero tank fouls
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Primary Dashboard 3-Column Core Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animated Water Tank Graphic */}
        <div className="lg:col-span-5">
          <TankGauge liveState={liveState} />
        </div>

        {/* Right side: Turbidity Semicircle & IR Sensor */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TurbidityGauge liveState={liveState} />
          <IRSensorCard liveState={liveState} />
        </div>
      </div>

      {/* Actuator Cards & Interlock Safety Controls */}
      <ActuatorControls
        liveState={liveState}
        onSetPump={handlePumpToggle}
        onSetValve={handleValveToggle}
        onSetMode={handleModeChange}
      />

      {/* Historical Analytics Charts */}
      <ChartsSection history={history} />

      {/* Event Log Table */}
      <EventLogTable events={events} />

      {/* Collapsible Simulation Control Deck for Viva examiners */}
      {!isFirebase && (
        <SimulationPanel />
      )}

    </section>
  );
};
