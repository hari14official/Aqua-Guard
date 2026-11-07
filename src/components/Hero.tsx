import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Droplet, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import { TankLiveState } from '../types/tank';

interface HeroProps {
  liveState: TankLiveState;
  onOpenDashboard?: () => void;
  onOpenCircuit?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ liveState, onOpenDashboard, onOpenCircuit }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const isFilling = liveState.pump;

  const pages = [
    {
      id: 'level',
      tag: 'PAGE 01 / 04 • LEVEL MONITORING',
      headline: 'Dual-Probe Solid-State Sensing',
      subheadline: 'Zero Jamming • Pulse Anti-Galvanic Probes',
      description: 'Replaces failure-prone mechanical ballcock float switches with solid-state immersion-gold traces at 20% (LOW) and 90% (FULL). Pulse-energized 5ms readings completely prevent electrolytic corrosion.',
      badge: 'HW-038 Solid-State Probes',
      statLabel: 'Reservoir Level',
      statValue: `${Math.round(liveState.levelPercent)}%`,
      statDetail: liveState.levelState === 'FULL' ? 'RESERVOIR FULL (90%)' : liveState.levelState === 'LOW' ? 'RESERVOIR LOW (20%)' : 'OPTIMAL STORAGE LEVEL',
      indicator1: { label: 'LOW PROBE (GPIO34)', active: liveState.lowSensor, text: liveState.lowSensor ? 'SUBMERGED' : 'EXPOSED' },
      indicator2: { label: 'FULL PROBE (GPIO35)', active: liveState.fullSensor, text: liveState.fullSensor ? 'TRIGGERED' : 'CLEAR' },
      ctaText: 'Inspect 3D Tank Level',
      action: onOpenDashboard
    },
    {
      id: 'quality',
      tag: 'PAGE 02 / 04 • OPTICAL SCREENING',
      headline: 'Optical Turbidity Contamination Intercept',
      subheadline: '940nm Nephelometric Tyndall Scattering',
      description: 'Continuously scans incoming municipal water for sewage, clay, silt, and iron rust particulates. Analyzes light attenuation before dirty water can contaminate your primary drinking reservoir.',
      badge: 'TS-300B Nephelometer',
      statLabel: 'Water Quality',
      statValue: `${liveState.turbidityStatus}`,
      statDetail: `${liveState.turbidityVoltage.toFixed(2)}V ADC (${Math.round(liveState.turbidityNTU)} NTU)`,
      indicator1: { label: 'CONTAMINATION', active: liveState.turbidityStatus !== 'CLEAR', text: liveState.turbidityStatus === 'CLEAR' ? 'POTABLE WATER' : 'CONTAMINATED' },
      indicator2: { label: 'ADC1 ATTENUATION', active: true, text: '3.3V OVERVOLTAGE SAFE' },
      ctaText: 'Test Contamination Trigger',
      action: onOpenDashboard
    },
    {
      id: 'valve',
      tag: 'PAGE 03 / 04 • FAIL-SAFE ACTUATION',
      headline: 'Normally-Closed Solenoid & Pump Automation',
      subheadline: '< 200ms Instant Shutoff • 2500V Galvanic Isolation',
      description: 'Normally-Closed 12V Brass Solenoid Valve stays physically sealed without power, guaranteeing dirty water cannot enter during power cuts. Submersible pump activates automatically via 20%-90% hysteresis loop.',
      badge: 'Fail-Safe NC Solenoid',
      statLabel: 'Inlet Valve State',
      statValue: liveState.valve ? 'VALVE OPEN' : 'VALVE SEALED',
      statDetail: liveState.valve ? 'CLEAN INFLOW PERMITTED' : 'INTERLOCK ENGAGED',
      indicator1: { label: 'PUMP MOTOR (GPIO26)', active: liveState.pump, text: liveState.pump ? 'RUNNING (12V)' : 'STANDBY' },
      indicator2: { label: 'SOLENOID VALVE (GPIO25)', active: liveState.valve, text: liveState.valve ? 'ENERGIZED (NC)' : 'SEALED SHUT' },
      ctaText: 'Review Actuator Circuits',
      action: onOpenCircuit
    },
    {
      id: 'iot',
      tag: 'PAGE 04 / 04 • CLOUD IOT & FIRMWARE',
      headline: 'ESP32 FreeRTOS Telemetry & Audio Alarm',
      subheadline: 'Dual-Core 240MHz • Sub-Second Realtime Cloud Sync',
      description: 'Core 1 executes non-blocking 50ms safety interlocks and 64-sample median ADC filtering. Core 0 handles WPA2 Wi-Fi encryption and Firebase RTDB streaming, with local 85 dB buzzer alarms.',
      badge: 'ESP-WROOM-32 240MHz',
      statLabel: 'System Status',
      statValue: liveState.systemStateLabel,
      statDetail: liveState.isOnline ? 'LIVE FIREBASE HARDWARE' : 'LOCAL SIMULATION ENGINE',
      indicator1: { label: 'FREE RTOS LOOP', active: true, text: '< 2ms TASK LATENCY' },
      indicator2: { label: '85dB PIEZO ALARM', active: liveState.alarm, text: liveState.alarm ? 'BUZZING ACTIVE' : 'MUTED / STANDBY' },
      ctaText: 'Open Live Dashboard',
      action: onOpenDashboard
    }
  ];

  // Auto-advance one by one automatically every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [pages.length]);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const activePage = pages[currentPage];

  return (
    <section 
      id="product" 
      className="relative overflow-hidden pt-6 pb-12 w-full"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-400/10 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* FULL WIDTH SLIDE WRAPPER - MERGED WITH PAGE (NO HEAVY CARD BLOCK) */}
      <div className="w-full px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Top Institutional Badge */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50/80 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Thiagarajar College of Engineering • Team 5 Engineering Prototype</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            AquaGuard: Smart Water Tank <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-cyan-500 to-teal-500">
              Monitoring & Fail-Safe Automation
            </span>
          </h1>
        </div>

        {/* 4 MOVING PAGES CAROUSEL - MERGED SEAMLESSLY WITH PAGE */}
        <div className="w-full relative mt-4">
          
          {/* Main Slide Content - NO BORDER, NO HEAVY BOX, MERGED WITH PAGE */}
          <div className="w-full py-4 transition-all duration-500 min-h-[460px] flex flex-col justify-between">
            
            {/* Slide Header: Clean navigation arrows (Removed auto-advance text and tag as requested) */}
            <div className="flex items-center justify-end pb-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200/80 dark:border-navy-700 transition-colors shadow-xs"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200/80 dark:border-navy-700 transition-colors shadow-xs"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Body: Full Width 2 Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 w-full">
              
              {/* Left Column: Descriptive info & CTAs */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{activePage.badge}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activePage.headline}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {activePage.description}
                </p>

                {/* Sub-indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                    activePage.indicator1.active
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100/70 dark:bg-navy-900/60 border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    <div>
                      <div className="text-[10px] font-semibold opacity-75">{activePage.indicator1.label}</div>
                      <div className="font-bold text-xs">{activePage.indicator1.text}</div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${activePage.indicator1.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                    activePage.indicator2.active
                      ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300'
                      : 'bg-slate-100/70 dark:bg-navy-900/60 border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    <div>
                      <div className="text-[10px] font-semibold opacity-75">{activePage.indicator2.label}</div>
                      <div className="font-bold text-xs">{activePage.indicator2.text}</div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${activePage.indicator2.active ? 'bg-cyan-500' : 'bg-slate-400'}`} />
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={activePage.action}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-lg shadow-brand-500/25 transition-all text-sm hover:-translate-y-0.5"
                  >
                    <span>{activePage.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#hardware"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors text-sm border border-slate-200 dark:border-navy-700 shadow-xs"
                  >
                    <span>Hardware BOM</span>
                  </a>
                </div>

              </div>

              {/* Right Column: Visual Telemetry Meter Display */}
              <div className="lg:col-span-5 flex items-center justify-center w-full">
                <div className="w-full max-w-md rounded-3xl p-6 bg-slate-900/95 dark:bg-navy-950/95 border border-slate-800 shadow-xl relative overflow-hidden text-center text-white">
                  
                  {/* Subtle top light bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-brand-500 to-emerald-400" />
                  
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-4 pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE TELEMETRY
                    </span>
                    <span>TCE LAB TESTBED</span>
                  </div>

                  {/* Centered Graphic Metric based on slide */}
                  {currentPage === 0 && (
                    <div className="py-4 space-y-3">
                      <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
                          <circle
                            cx="50" cy="50" r="40"
                            className="stroke-cyan-400 transition-all duration-700"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - liveState.levelPercent / 100)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Droplet className={`w-6 h-6 mb-1 ${isFilling ? 'text-cyan-400 animate-bounce' : 'text-slate-400'}`} />
                          <span className="text-3xl font-black font-mono text-white">{Math.round(liveState.levelPercent)}%</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{activePage.statDetail}</div>
                    </div>
                  )}

                  {currentPage === 1 && (
                    <div className="py-4 space-y-3">
                      <div className={`w-28 h-28 mx-auto rounded-full flex flex-col items-center justify-center border-4 ${
                        liveState.turbidityStatus === 'CLEAR' 
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400' 
                          : 'border-rose-500 bg-rose-950/40 text-rose-400'
                      }`}>
                        <Activity className="w-8 h-8 mb-1 animate-pulse" />
                        <span className="text-xl font-black font-mono">{liveState.turbidityVoltage.toFixed(2)}V</span>
                      </div>
                      <div className="text-xs font-bold text-slate-300">{activePage.statDetail}</div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="py-4 space-y-3">
                      <div className={`w-28 h-28 mx-auto rounded-2xl flex flex-col items-center justify-center border-2 ${
                        liveState.valve ? 'border-emerald-500 bg-emerald-950/30' : 'border-rose-500 bg-rose-950/30'
                      }`}>
                        <ShieldCheck className={`w-10 h-10 mb-1 ${liveState.valve ? 'text-emerald-400' : 'text-rose-400'}`} />
                        <span className="text-xs font-bold font-mono uppercase">{liveState.valve ? 'VALVE OPEN' : 'VALVE CLOSED'}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-300">{activePage.statDetail}</div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="py-4 space-y-3">
                      <div className="w-28 h-28 mx-auto rounded-2xl flex flex-col items-center justify-center border-2 border-brand-500 bg-brand-950/40 text-brand-300">
                        <Cpu className="w-10 h-10 mb-1 text-brand-400 animate-spin" style={{ animationDuration: '10s' }} />
                        <span className="text-xs font-bold font-mono">240 MHz MCU</span>
                      </div>
                      <div className="text-xs font-bold text-slate-300">{activePage.statDetail}</div>
                    </div>
                  )}

                  {/* Bottom live stats footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-around text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="block text-slate-500">PUMP MOTOR</span>
                      <span className={`font-bold ${liveState.pump ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {liveState.pump ? 'RUNNING' : 'STANDBY'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">SOLENOID</span>
                      <span className={`font-bold ${liveState.valve ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {liveState.valve ? 'OPEN (NC)' : 'SEALED'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">ALARM</span>
                      <span className={`font-bold ${liveState.alarm ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                        {liveState.alarm ? 'ACTIVE' : 'QUIET'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Slide Navigation Pagination Tabs */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-navy-800/80 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {pages.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPage(idx)}
                    className={`text-left p-3 rounded-xl transition-all relative overflow-hidden border ${
                      currentPage === idx
                        ? 'bg-brand-50 dark:bg-brand-950/70 border-brand-300 dark:border-brand-700 shadow-xs'
                        : 'bg-white/60 dark:bg-navy-900/40 border-slate-200/60 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800'
                    }`}
                  >
                    {currentPage === idx && (
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-brand-500" />
                    )}
                    <div className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 uppercase">
                      0{idx + 1}
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {p.headline.split(' ')[0]} {p.headline.split(' ')[1]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
