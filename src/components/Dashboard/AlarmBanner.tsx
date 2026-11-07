import React from 'react';
import { AlertOctagon, Volume2, ShieldAlert } from 'lucide-react';
import { TankLiveState } from '../../types/tank';

interface AlarmBannerProps {
  liveState: TankLiveState;
}

export const AlarmBanner: React.FC<AlarmBannerProps> = ({ liveState }) => {
  if (!liveState.alarm) return null;

  const isDirty = liveState.turbidityStatus === 'DIRTY';
  const isObject = liveState.objectDetected;

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-rose-600 text-white shadow-glow-red animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-rose-400">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
              EMERGENCY INTERLOCK ACTIVE
            </span>
            <span className="text-xs font-bold text-rose-200">
              ESP32 GPIO23 Buzzer + Red LED GPIO19 ON
            </span>
          </div>
          <h4 className="text-lg font-black text-white mt-0.5">
            {isDirty && isObject 
              ? 'Severe Contamination & Physical Inlet Blockage Detected!' 
              : isDirty 
              ? 'Contaminated Inflow Detected (Turbidity < 2.50V)!' 
              : 'Physical Object / Insect Detected at Inlet Mesh!'}
          </h4>
          <p className="text-xs text-rose-100">
            Inlet Solenoid Valve de-energized to closed state. Pump motor disabled. Clean water reservoir isolated safely.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 bg-black/20 px-3 py-2 rounded-2xl">
        <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="text-xs font-bold font-mono">PIEZO ALARM ACTIVE</span>
        <ShieldAlert className="w-4 h-4 text-rose-200" />
      </div>
    </div>
  );
};
