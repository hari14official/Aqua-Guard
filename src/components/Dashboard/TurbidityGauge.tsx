import React from 'react';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { TankLiveState } from '../../types/tank';

interface TurbidityGaugeProps {
  liveState: TankLiveState;
}

export const TurbidityGauge: React.FC<TurbidityGaugeProps> = ({ liveState }) => {
  const voltage = Math.max(0, Math.min(5, liveState.turbidityVoltage));
  const status = liveState.turbidityStatus;

  // Semicircle needle angle: 0V -> -90 deg, 5V -> +90 deg
  // In normal module, 4.5V = Clear, 2.0V = Dirty
  const angle = ((voltage / 5) * 180) - 90;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
        <div>
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            OPTICAL PURITY SENSOR
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Water Turbidity Gauge
          </h3>
        </div>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
          status === 'CLEAR'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            : status === 'CLOUDY'
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
        }`}>
          {status === 'CLEAR' && <CheckCircle className="w-3.5 h-3.5" />}
          {status === 'CLOUDY' && <AlertTriangle className="w-3.5 h-3.5" />}
          {status === 'DIRTY' && <ShieldAlert className="w-3.5 h-3.5" />}
          <span>{status} WATER</span>
        </span>
      </div>

      {/* Semicircle Gauge Visual */}
      <div className="py-6 flex flex-col items-center justify-center">
        <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
          <svg className="w-64 h-64 absolute -top-1" viewBox="0 0 200 200">
            {/* Background Arc Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e2e8f0"
              className="dark:stroke-navy-800"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Red Zone: 0V - 2.5V (Dirty water - 180° to 90°) */}
            <path
              d="M 20 100 A 80 80 0 0 1 100 20"
              fill="none"
              stroke="#ef4444"
              strokeWidth="16"
              strokeLinecap="butt"
              opacity="0.95"
            />
            {/* Left Round End Cap for Red Zone */}
            <circle cx="20" cy="100" r="8" fill="#ef4444" />

            {/* Amber Zone: 2.5V - 3.5V (Cloudy water - 90° to 54°) - Mathematically Flush on R=80 */}
            <path
              d="M 100 20 A 80 80 0 0 1 147.02 35.28"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="16"
              strokeLinecap="butt"
              opacity="0.95"
            />

            {/* Green Zone: 3.5V - 5.0V (Clear water - 54° to 0°) - Mathematically Flush on R=80 */}
            <path
              d="M 147.02 35.28 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#10b981"
              strokeWidth="16"
              strokeLinecap="butt"
              opacity="0.95"
            />
            {/* Right Round End Cap for Green Zone */}
            <circle cx="180" cy="100" r="8" fill="#10b981" />

            {/* Zone Dividers: Crisp 2px separation markers */}
            {/* 2.50V Threshold Divider (Top Center - 90°) */}
            <line x1="100" y1="11" x2="100" y2="29" stroke="#ffffff" className="dark:stroke-navy-900" strokeWidth="2.5" />
            
            {/* 3.50V Threshold Divider (54° Mark) */}
            <line x1="141.73" y1="42.56" x2="152.31" y2="27.99" stroke="#ffffff" className="dark:stroke-navy-900" strokeWidth="2.5" />

            {/* Needle Pivot Center */}
            <circle cx="100" cy="100" r="8" fill="#0f172a" className="dark:fill-slate-100" />
            <circle cx="100" cy="100" r="4" fill="#38bdf8" />

            {/* Rotating Needle */}
            <g transform={`rotate(${angle} 100 100)`} className="transition-transform duration-700 ease-out">
              <polygon points="98,100 102,100 100,28" fill="#0f172a" className="dark:fill-slate-100" />
              <circle cx="100" cy="28" r="3" fill="#0284c7" />
            </g>
          </svg>

          {/* Value Readout in Semicircle Base */}
          <div className="text-center z-10 -mb-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {voltage.toFixed(2)} <span className="text-base font-bold text-slate-500">V</span>
            </span>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              ADC1 Channel (GPIO32)
            </p>
          </div>
        </div>

        {/* Zone Labels */}
        <div className="w-full max-w-xs flex justify-between text-[11px] font-bold mt-2 px-4">
          <span className="text-rose-600 dark:text-rose-400">DIRTY &lt;2.5V</span>
          <span className="text-amber-600 dark:text-amber-400">CLOUDY 2.5–3.5V</span>
          <span className="text-emerald-600 dark:text-emerald-400">CLEAR &gt;3.5V</span>
        </div>
      </div>

      {/* Bottom Specification Details */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-500 shrink-0" />
          <span>Interlock: Solenoid auto-shuts if reading drops &lt; 2.50V</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">940nm LED</span>
      </div>
    </div>
  );
};
