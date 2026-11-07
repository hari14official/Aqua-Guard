import React from 'react';
import { 
  Waves, 
  ShieldCheck, 
  Sliders, 
  Clock, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Power
} from 'lucide-react';
import { TankLiveState, OperationMode } from '../../types/tank';

interface ActuatorControlsProps {
  liveState: TankLiveState;
  onSetPump: (state: boolean) => void;
  onSetValve: (state: boolean) => void;
  onSetMode: (mode: OperationMode) => void;
}

export const ActuatorControls: React.FC<ActuatorControlsProps> = ({
  liveState,
  onSetPump,
  onSetValve,
  onSetMode,
}) => {
  const isAuto = liveState.mode === 'AUTO';
  const isDirty = liveState.turbidityStatus === 'DIRTY';
  const isObject = liveState.objectDetected;
  const isTankFull = liveState.levelState === 'FULL' || liveState.levelPercent >= 90;

  // Interlock conditions for UI disabling
  const isPumpDisabled = isAuto || (!liveState.pump && (isDirty || isTankFull));
  const pumpDisabledReason = isAuto 
    ? 'Switch to MANUAL mode to control the pump manually' 
    : isDirty 
    ? 'Safety Interlock: Cannot start pump with DIRTY water detected!' 
    : isTankFull 
    ? 'Safety Interlock: Cannot start pump while tank is FULL (>=90%)!' 
    : undefined;

  const isValveDisabled = isAuto || (!liveState.valve && (isDirty || isObject));
  const valveDisabledReason = isAuto
    ? 'Switch to MANUAL mode to control the solenoid valve manually'
    : isDirty
    ? 'Safety Interlock: Solenoid locked CLOSED due to DIRTY water!'
    : isObject
    ? 'Safety Interlock: Solenoid locked CLOSED due to object at inlet mesh!'
    : undefined;

  // Format pump run timer (hours:minutes:seconds)
  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Mode Switch Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-500" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              System Control Mode
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
            {isAuto 
              ? 'AUTO Mode: ESP32 runs autonomous hysteresis logic based on level probes and purity thresholds.' 
              : 'MANUAL Mode: User can toggle pump and valve, subject to hardware-enforced safety interlocks.'}
          </p>
        </div>

        {/* Dual Mode Switch Buttons */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
          <button
            onClick={() => onSetMode('AUTO')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAuto
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ToggleLeft className="w-4 h-4" />
            <span>AUTO (Autonomous)</span>
          </button>

          <button
            onClick={() => onSetMode('MANUAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isAuto
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ToggleRight className="w-4 h-4" />
            <span>MANUAL (Override)</span>
          </button>
        </div>
      </div>

      {/* Actuator Cards Grid: Pump + Solenoid Valve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Submersible Pump */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  liveState.pump ? 'bg-brand-500 text-white animate-spin' : 'bg-slate-100 dark:bg-navy-900 text-slate-500'
                }`} style={{ animationDuration: '8s' }}>
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Mini Submersible Pump
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">GPIO26 &bull; 5V Relay Channel 1</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                liveState.pump 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-slate-100 text-slate-600 dark:bg-navy-900 dark:text-slate-400'
              }`}>
                {liveState.pump ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>

            {/* Runtime Timer Display */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>Active Runtime Today:</span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                {formatTimer(liveState.pumpRunSeconds)}
              </span>
            </div>
          </div>

          {/* Toggle Action & Tooltip */}
          <div className="space-y-2">
            <button
              onClick={() => onSetPump(!liveState.pump)}
              disabled={isPumpDisabled}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isPumpDisabled
                  ? 'bg-slate-200 dark:bg-navy-900 text-slate-400 cursor-not-allowed border border-dashed border-slate-300 dark:border-navy-700'
                  : liveState.pump
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{liveState.pump ? 'Stop Pump Motor' : 'Start Pump Motor'}</span>
            </button>

            {pumpDisabledReason && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 p-1">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pumpDisabledReason}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Normally-Closed Solenoid Valve */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  liveState.valve ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-navy-900 text-slate-500'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    12V Solenoid Inlet Valve
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">GPIO25 &bull; 5V Relay Channel 2</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                liveState.valve 
                  ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' 
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {liveState.valve ? 'VALVE OPEN' : 'VALVE SHUT'}
              </span>
            </div>

            {/* Spec info box */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>Fail-Safe Configuration:</span>
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Normally Closed (NC)
              </span>
            </div>
          </div>

          {/* Toggle Action & Tooltip */}
          <div className="space-y-2">
            <button
              onClick={() => onSetValve(!liveState.valve)}
              disabled={isValveDisabled}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isValveDisabled
                  ? 'bg-slate-200 dark:bg-navy-900 text-slate-400 cursor-not-allowed border border-dashed border-slate-300 dark:border-navy-700'
                  : liveState.valve
                  ? 'bg-slate-700 hover:bg-slate-800 text-white shadow-md'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{liveState.valve ? 'Close Inlet Solenoid' : 'Open Inlet Solenoid'}</span>
            </button>

            {valveDisabledReason && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 p-1">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{valveDisabledReason}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
