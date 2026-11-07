import React, { useState } from 'react';
import { Droplet, Waves, Box, Layers } from 'lucide-react';
import { TankLiveState } from '../../types/tank';
import { TankGauge3D } from './TankGauge3D';

interface TankGaugeProps {
  liveState: TankLiveState;
}

export const TankGauge: React.FC<TankGaugeProps> = ({ liveState }) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const percent = Math.min(100, Math.max(0, liveState.levelPercent));
  const roundedPercent = Math.round(percent);
  const isLowProbeActive = liveState.lowSensor;
  const isFullProbeActive = liveState.fullSensor;
  const isFilling = liveState.pump;

  // Water level height calculations for 2D smooth tank view
  const tankTotalHeight = 180;
  const waterHeight = (percent / 100) * tankTotalHeight;
  const waterTopY = 270 - waterHeight;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft flex flex-col justify-between relative overflow-hidden bg-white/70 dark:bg-navy-900/70 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
        <div>
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            PRIMARY STORAGE
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Overhead Tank Level
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-navy-800 p-0.5 border border-slate-200 dark:border-navy-700">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === '3d'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Real-Time 3D Physics View"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Tank</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === '2d'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="2D Schematic View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D</span>
            </button>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-full ${
              liveState.levelState === 'FULL'
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                : liveState.levelState === 'LOW'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
            }`}
          >
            {liveState.levelState} LEVEL
          </span>
        </div>
      </div>

      {/* Main Tank View (3D or 2D) */}
      <div className="py-2 flex flex-col items-center justify-center">
        {viewMode === '3d' ? (
          <div className="w-full">
            <TankGauge3D liveState={liveState} />
          </div>
        ) : (
          <div className="relative w-64 h-80 flex items-center justify-center">
            {/* 2D Smooth Cylindrical Tank (NO horizontal lines) */}
            <svg className="w-full h-full drop-shadow-md" viewBox="0 0 240 320">
              <defs>
                <linearGradient id="waterGrad2D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>

                <clipPath id="smoothTankInteriorClip">
                  <rect x="45" y="90" width="150" height="180" rx="10" />
                </clipPath>
              </defs>

              {/* Top Inspection Lid Cap */}
              <rect x="96" y="22" width="48" height="14" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2" />
              <rect x="106" y="16" width="28" height="8" rx="2" fill="#475569" />
              <rect x="90" y="34" width="60" height="12" fill="#1e293b" />

              {/* Conical Sloped Top Dome */}
              <polygon points="90,46 150,46 195,90 45,90" fill="#f8fafc" className="dark:fill-slate-900/60" stroke="#64748b" strokeWidth="2.5" />

              {/* Main Transparent Cylindrical Body (Smooth, NO horizontal lines) */}
              <rect
                x="45"
                y="90"
                width="150"
                height="180"
                rx="6"
                fill="#f8fafc"
                className="dark:fill-slate-900/60"
                stroke="#64748b"
                strokeWidth="2.5"
              />

              {/* Inner Water Body */}
              <g clipPath="url(#smoothTankInteriorClip)">
                <rect x="45" y="90" width="150" height="180" fill="#f1f5f9" className="dark:fill-navy-950" />

                {/* Animated Water Column */}
                <rect
                  x="45"
                  y={waterTopY}
                  width="150"
                  height={waterHeight + 20}
                  fill="url(#waterGrad2D)"
                  opacity="0.88"
                  className="transition-all duration-700 ease-out"
                />

                {/* Real-Time Floating Water Wave Motion */}
                <g className="transition-all duration-700 ease-out" style={{ transform: `translateY(${waterTopY}px)` }}>
                  <path
                    d="M 30 0 Q 80 -8 135 0 T 240 0 L 240 18 L 30 18 Z"
                    fill="#7dd3fc"
                    opacity="0.7"
                    className="animate-wave-1"
                  />
                  <path
                    d="M 30 0 Q 80 6 135 0 T 240 0 L 240 18 L 30 18 Z"
                    fill="#38bdf8"
                    opacity="0.5"
                    className="animate-wave-2"
                  />
                </g>

                {isFilling && (
                  <g fill="#38bdf8" opacity="0.9">
                    <circle cx="120" cy="110" r="3.5" className="animate-bounce" />
                    <circle cx="120" cy="140" r="2.5" className="animate-ping" />
                    <circle cx="116" cy="170" r="2" />
                  </g>
                )}
              </g>

              {/* Base Flange and Bottom Outlet */}
              <rect x="40" y="270" width="160" height="12" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="2" />
              <rect x="108" y="282" width="24" height="24" rx="2" fill="#0284c7" />

              {/* LOW Level Sensor Probe (20% = y: 234) */}
              <line x1="32" y1="234" x2="45" y2="234" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="32" cy="234" r="4.5" fill={isLowProbeActive ? '#10b981' : '#94a3b8'} />
              <text x="26" y="238" textAnchor="end" fontSize="9" fontWeight="bold" fill={isLowProbeActive ? '#10b981' : '#64748b'}>
                LOW 20%
              </text>

              {/* FULL Level Sensor Probe (90% = y: 108) */}
              <line x1="32" y1="108" x2="45" y2="108" stroke="#0ea5e9" strokeWidth="2.5" />
              <circle cx="32" cy="108" r="4.5" fill={isFullProbeActive ? '#0ea5e9' : '#94a3b8'} />
              <text x="26" y="112" textAnchor="end" fontSize="9" fontWeight="bold" fill={isFullProbeActive ? '#0ea5e9' : '#64748b'}>
                FULL 90%
              </text>

              {/* Scale marks on Right Wall */}
              <text x="204" y="111" fontSize="8" fill="#64748b" fontWeight="600">90%</text>
              <text x="204" y="183" fontSize="8" fill="#64748b" fontWeight="600">50%</text>
              <text x="204" y="237" fontSize="8" fill="#64748b" fontWeight="600">20%</text>
            </svg>
          </div>
        )}
      </div>

      {/* VALUES DISPLAYED BELOW THE 3D TANK (As requested by user) */}
      <div className="mt-3 p-4 rounded-2xl bg-slate-100/80 dark:bg-navy-950/80 border border-slate-200 dark:border-navy-800 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
            {roundedPercent}%
          </span>
          <Droplet className={`w-5 h-5 ${liveState.turbidityStatus === 'DIRTY' ? 'text-amber-500' : 'text-cyan-400'} fill-current`} />
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {roundedPercent >= 90 ? 'RESERVOIR FULL (90%)' : roundedPercent <= 20 ? 'RESERVOIR LOW (20%)' : 'OPTIMAL STORAGE LEVEL'}
          </span>
          {isFilling && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <Waves className="w-3.5 h-3.5 animate-spin" />
              <span>REFILLING</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Sensor Health Badges */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-navy-800 text-xs mt-3">
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
            isLowProbeActive
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}
        >
          <div>
            <div className="text-[10px] font-semibold opacity-75">LOW PROBE (GPIO34)</div>
            <div className="font-bold text-xs">{isLowProbeActive ? 'SUBMERGED' : 'EXPOSED (EMPTY)'}</div>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${isLowProbeActive ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
        </div>

        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
            isFullProbeActive
              ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300'
              : 'bg-slate-50 dark:bg-navy-900/60 border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <div>
            <div className="text-[10px] font-semibold opacity-75">FULL PROBE (GPIO35)</div>
            <div className="font-bold text-xs">{isFullProbeActive ? 'TRIGGERED (90%)' : 'CLEAR'}</div>
          </div>
          <span className={`w-2.5 h-2.5 rounded-full ${isFullProbeActive ? 'bg-cyan-500' : 'bg-slate-400'}`} />
        </div>
      </div>
    </div>
  );
};
