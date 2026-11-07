import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Radio, Clock } from 'lucide-react';
import { TankLiveState } from '../../types/tank';

interface IRSensorCardProps {
  liveState: TankLiveState;
}

export const IRSensorCard: React.FC<IRSensorCardProps> = ({ liveState }) => {
  const isBlocked = liveState.objectDetected;
  const [lastTriggerTime, setLastTriggerTime] = useState<string>("No objects recorded");

  useEffect(() => {
    if (isBlocked) {
      const now = new Date();
      setLastTriggerTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    }
  }, [isBlocked]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
        <div>
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            INLET OPTICAL GATE
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            IR Obstacle Sensor (GPIO27)
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
          isBlocked 
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse' 
            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
        }`}>
          {isBlocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{isBlocked ? 'OBJECT DETECTED' : 'INLET CLEAR'}</span>
        </span>
      </div>

      {/* Optical Beam Graphic */}
      <div className="py-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-xs p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden border border-slate-800">
          
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-3">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              IR EMITTER
            </span>
            <span>PHOTO-RECEIVER</span>
          </div>

          {/* Active Beam line */}
          <div className="relative h-10 flex items-center justify-between px-3 bg-slate-950/80 rounded-xl border border-slate-800">
            {/* Emitter diode */}
            <div className="w-4 h-4 rounded-full bg-cyan-500 shadow-glow flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Beam laser line */}
            <div className="flex-1 mx-3 relative flex items-center justify-center">
              <div className={`w-full h-1 rounded-full transition-all duration-300 ${
                isBlocked ? 'bg-rose-500 shadow-glow-red animate-pulse' : 'bg-cyan-400/70 shadow-glow'
              }`} />

              {/* Obstruction indicator block */}
              {isBlocked && (
                <div className="absolute px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-md animate-bounce">
                  OBSTACLE
                </div>
              )}
            </div>

            {/* Receiver diode */}
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isBlocked ? 'bg-rose-500 shadow-glow-red' : 'bg-emerald-500 shadow-glow'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Beam State:</span>
            <span className={`font-mono font-bold ${isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isBlocked ? 'BEAM_BROKEN (LOW)' : 'BEAM_CONTINUOUS (HIGH)'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Obstacle Event:</span>
        </div>
        <span className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
          {lastTriggerTime}
        </span>
      </div>
    </div>
  );
};
