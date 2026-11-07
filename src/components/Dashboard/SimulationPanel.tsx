import React, { useState } from 'react';
import { 
  FlaskConical, 
  ChevronDown, 
  ChevronUp, 
  Bug, 
  ShieldAlert, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  WifiOff, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { tankService } from '../../services/tankService';

export const SimulationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDirtyForced, setIsDirtyForced] = useState(tankService.isDirtyForced());
  const [isObjectForced, setIsObjectForced] = useState(tankService.isObjectForced());
  const [isOfflineForced, setIsOfflineForced] = useState(tankService.isOfflineForced());

  const handleToggleDirty = () => {
    const next = tankService.toggleSimulationDirty();
    setIsDirtyForced(next);
  };

  const handleToggleObject = () => {
    const next = tankService.toggleSimulationObject();
    setIsObjectForced(next);
  };

  const handleDrain = () => {
    tankService.simulateDrain();
  };

  const handleFill = () => {
    tankService.simulateFill();
  };

  const handleToggleOffline = () => {
    const next = tankService.toggleSimulationOffline();
    setIsOfflineForced(next);
  };

  const handleReset = () => {
    tankService.resetSimulation();
    setIsDirtyForced(false);
    setIsObjectForced(false);
    setIsOfflineForced(false);
  };

  return (
    <div className="rounded-3xl border-2 border-brand-400 dark:border-brand-600 bg-white/95 dark:bg-navy-900/95 shadow-xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Header bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 bg-gradient-to-r from-brand-600/10 via-cyan-500/10 to-teal-500/10 flex items-center justify-between cursor-pointer border-b border-brand-200 dark:border-brand-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md">
            <FlaskConical className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Viva Demonstration Simulator Deck
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Examiner Tools
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inject synthetic environmental anomalies to demonstrate real-time ESP32 failsafe interlocks with no physical plumbing.
            </p>
          </div>
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Body Controls */}
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Button 1: Force Dirty Water */}
            <button
              onClick={handleToggleDirty}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                isDirtyForced
                  ? 'bg-rose-600 text-white border-rose-500 shadow-glow-red'
                  : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 hover:border-rose-300 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldAlert className={`w-5 h-5 ${isDirtyForced ? 'text-white' : 'text-rose-500'}`} />
                <span className={`w-2 h-2 rounded-full ${isDirtyForced ? 'bg-white animate-ping' : 'bg-slate-300'}`} />
              </div>
              <div className="font-bold text-xs leading-tight">
                {isDirtyForced ? 'Clear Water' : 'Force Dirty Water'}
              </div>
              <div className={`text-[10px] mt-1 ${isDirtyForced ? 'text-rose-100' : 'text-slate-400'}`}>
                Drop turbidity &lt; 2.5V
              </div>
            </button>

            {/* Button 2: Force Object at Inlet */}
            <button
              onClick={handleToggleObject}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                isObjectForced
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 hover:border-amber-300 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Bug className={`w-5 h-5 ${isObjectForced ? 'text-white' : 'text-amber-500'}`} />
                <span className={`w-2 h-2 rounded-full ${isObjectForced ? 'bg-white animate-ping' : 'bg-slate-300'}`} />
              </div>
              <div className="font-bold text-xs leading-tight">
                {isObjectForced ? 'Clear Object' : 'Object at Inlet'}
              </div>
              <div className={`text-[10px] mt-1 ${isObjectForced ? 'text-amber-100' : 'text-slate-400'}`}>
                Break IR sensor beam
              </div>
            </button>

            {/* Button 3: Drain Tank */}
            <button
              onClick={handleDrain}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-brand-400 text-slate-800 dark:text-slate-200 text-left flex flex-col justify-between transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <ArrowDownCircle className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-mono text-slate-400">14%</span>
              </div>
              <div className="font-bold text-xs leading-tight">
                Drain to LOW
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Trigger auto-pump ON
              </div>
            </button>

            {/* Button 4: Fill Tank */}
            <button
              onClick={handleFill}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-brand-400 text-slate-800 dark:text-slate-200 text-left flex flex-col justify-between transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <ArrowUpCircle className="w-5 h-5 text-cyan-500" />
                <span className="text-[10px] font-mono text-slate-400">92%</span>
              </div>
              <div className="font-bold text-xs leading-tight">
                Fill to FULL
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Trigger high-level OFF
              </div>
            </button>

            {/* Button 5: Go Offline */}
            <button
              onClick={handleToggleOffline}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                isOfflineForced
                  ? 'bg-rose-700 text-white border-rose-600 shadow-md'
                  : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 hover:border-rose-400 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <WifiOff className={`w-5 h-5 ${isOfflineForced ? 'text-white' : 'text-slate-400'}`} />
                <span className={`w-2 h-2 rounded-full ${isOfflineForced ? 'bg-white animate-ping' : 'bg-slate-300'}`} />
              </div>
              <div className="font-bold text-xs leading-tight">
                {isOfflineForced ? 'Reconnect Wi-Fi' : 'Simulate Offline'}
              </div>
              <div className={`text-[10px] mt-1 ${isOfflineForced ? 'text-rose-100' : 'text-slate-400'}`}>
                10s timeout detector
              </div>
            </button>

            {/* Button 6: Reset Normal */}
            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-600 text-white border border-brand-500 hover:brightness-105 text-left flex flex-col justify-between transition-all shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <RotateCcw className="w-5 h-5 text-white" />
                <span className="text-[10px] font-bold text-cyan-100">RESET</span>
              </div>
              <div className="font-bold text-xs leading-tight">
                Nominal State
              </div>
              <div className="text-[10px] text-cyan-100 mt-1">
                Restore clean 50%
              </div>
            </button>

          </div>
        </div>
      )}
    </div>
  );
};
