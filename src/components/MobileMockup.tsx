import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  BellRing, 
  SlidersHorizontal, 
  ShieldAlert, 
  Wifi, 
  BatteryMedium, 
  Droplets,
  Activity,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { TankLiveState } from '../types/tank';

interface MobileMockupProps {
  liveState: TankLiveState;
  onOpenDashboard?: () => void;
}

export const MobileMockup: React.FC<MobileMockupProps> = ({ liveState, onOpenDashboard }) => {
  const [activeScreen, setActiveScreen] = useState<number>(0);

  // Auto-advance screen every 3 seconds as requested
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const percent = Math.round(liveState.levelPercent);
  const turbV = liveState.turbidityVoltage > 0 ? liveState.turbidityVoltage.toFixed(2) : "4.01";

  return (
    <section className="py-16 lg:py-24 bg-slate-100/60 dark:bg-navy-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Phone Frame Mockup */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[285px] sm:max-w-[325px] rounded-[44px] sm:rounded-[50px] p-3 sm:p-3.5 bg-slate-900 shadow-2xl ring-2 ring-slate-800">
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
                <div className="w-2 h-2 rounded-full bg-cyan-900/60" />
              </div>

              {/* Phone Screen Canvas */}
              <div className="relative w-full h-[580px] sm:h-[620px] bg-slate-950 rounded-[36px] sm:rounded-[40px] overflow-hidden pt-7 px-3.5 sm:px-4 pb-4 flex flex-col justify-between text-white select-none border border-slate-800">
                
                {/* Top Status Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1">
                  <span className="font-semibold">9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-slate-200" />
                    <BatteryMedium className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* App Header inside Mockup */}
                <div className="flex items-center justify-between mt-2.5 px-1 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-sm">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-none">AquaGuard Mobile</h4>
                      <p className="text-[10px] text-slate-400">Thiagarajar CE</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    CONNECTED
                  </span>
                </div>

                {/* ROTATING CONTENT SCREENS (Change every 3 seconds) */}
                <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden">
                  
                  {/* SCREEN 1: Water Level Tank Image & Probes */}
                  {activeScreen === 0 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center relative overflow-hidden">
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
                          <span className="font-mono text-cyan-400 font-semibold">OVERHEAD TANK LEVEL</span>
                          <span className="text-brand-400 font-semibold">AUTO MODE</span>
                        </div>

                        {/* Exact Ribbed Transparent Tank Graphic Silhouette */}
                        <div className="relative w-32 h-36 mx-auto my-1 flex items-center justify-center">
                          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
                            {/* Lid */}
                            <rect x="40" y="8" width="20" height="6" rx="1.5" fill="#475569" />
                            {/* Conical Dome */}
                            <polygon points="36,14 64,14 80,30 20,30" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" opacity="0.6"/>
                            {/* Ribbed Cylinder Body */}
                            <rect x="20" y="30" width="60" height="75" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4"/>
                            
                            {/* Water level fill */}
                            <rect 
                              x="22" 
                              y={105 - (percent / 100) * 70} 
                              width="56" 
                              height={(percent / 100) * 70} 
                              fill="#0284c7" 
                              opacity="0.8" 
                              rx="2"
                              className="transition-all duration-700"
                            />

                            {/* Base */}
                            <rect x="18" y="105" width="64" height="6" rx="1" fill="#334155" />
                          </svg>

                          {/* Floating Center Percentage */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black font-mono text-white drop-shadow-md">{percent}%</span>
                            <span className="text-[9px] font-bold text-cyan-300 uppercase tracking-wider">{liveState.levelState}</span>
                          </div>
                        </div>

                        {/* Probes readout */}
                        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[9px] font-mono">
                          <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                            <span className="text-slate-400">LOW PROBE</span>
                            <span className={liveState.lowSensor ? "text-emerald-400 font-bold" : "text-amber-400"}>
                              {liveState.lowSensor ? "ON (20%)" : "EXPOSED"}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                            <span className="text-slate-400">FULL PROBE</span>
                            <span className={liveState.fullSensor ? "text-cyan-400 font-bold" : "text-slate-400"}>
                              {liveState.fullSensor ? "ON (90%)" : "CLEAR"}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: OPTICAL PURITY SENSOR & Turbidity Gauge (Exact user prompt text) */}
                  {activeScreen === 1 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                          <span className="font-mono text-cyan-400 font-semibold">OPTICAL PURITY SENSOR</span>
                          <span className="text-emerald-400 font-semibold">940nm LED</span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-200">Water Turbidity Gauge</h5>

                        {/* Central Voltage Readout */}
                        <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mb-1">
                            CLEAR WATER
                          </span>
                          <div className="text-3xl font-black font-mono text-white tracking-tight">
                            {turbV} V
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ADC1 Channel (GPIO32)
                          </span>
                        </div>

                        {/* Purity Range Indicator Pills (Exact prompt request) */}
                        <div className="space-y-1.5 text-[9px] font-mono">
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300">
                            <span>DIRTY</span>
                            <span className="font-bold">&lt; 2.5V</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-teal-950/30 border border-teal-900/40 text-teal-300">
                            <span>CLOUDY</span>
                            <span className="font-bold">2.5 &ndash; 3.5V</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold shadow-xs">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              CLEAR
                            </span>
                            <span>&gt; 3.5V (CURRENT)</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SCREEN 3: Actuator Status & Closed-Loop Controls */}
                  {activeScreen === 2 && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 relative">
                        
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
                          <span className="font-mono text-cyan-400 font-semibold">ACTUATOR TELEMETRY</span>
                          <span className="text-emerald-400 font-semibold">2500V ISOLATION</span>
                        </div>

                        {/* Pump and Valve Tiles */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 font-mono">PUMP (GPIO26)</span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-bold text-xs">{liveState.pump ? 'RUNNING' : 'OFF'}</span>
                              <span className={`w-2.5 h-2.5 rounded-full ${liveState.pump ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                            </div>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 font-mono">VALVE (GPIO25)</span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-bold text-xs">{liveState.valve ? 'OPEN (NC)' : 'SEALED'}</span>
                              <span className={`w-2.5 h-2.5 rounded-full ${liveState.valve ? 'bg-cyan-400' : 'bg-rose-500'}`} />
                            </div>
                          </div>
                        </div>

                        {/* IR Sensor & Safety Interlock */}
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>INLET IR GATE (GPIO27):</span>
                            <span className="text-emerald-400 font-bold">BEAM CLEAR</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400 mt-1">
                            <span>FAIL-SAFE LOGIC:</span>
                            <span className="text-cyan-400 font-mono">Normally Closed</span>
                          </div>
                        </div>

                        {/* Automated Safety Active Pill */}
                        <div className="mt-2.5 bg-brand-950/80 border border-brand-800/70 rounded-xl p-2.5 flex items-start gap-2">
                          <div className="p-1 rounded-lg bg-brand-500/20 text-brand-400 mt-0.5">
                            <BellRing className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white">Automated Safety Active</p>
                            <p className="text-[9px] text-slate-300 leading-tight">
                              Normal cycle: Monitoring probes
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Screen Indicator Tabs (3 screens) */}
                <div className="bg-slate-900/90 rounded-2xl p-1.5 border border-slate-800 flex justify-around items-center text-slate-400 text-xs">
                  <button
                    onClick={() => setActiveScreen(0)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                      activeScreen === 0 ? 'bg-brand-600 text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Tank</span>
                  </button>

                  <button
                    onClick={() => setActiveScreen(1)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                      activeScreen === 1 ? 'bg-brand-600 text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Turbidity</span>
                  </button>

                  <button
                    onClick={() => setActiveScreen(2)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                      activeScreen === 2 ? 'bg-brand-600 text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Controls</span>
                  </button>
                </div>

                {/* Home Indicator */}
                <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
              </div>

            </div>
          </div>

          {/* Right Column: Feature Copy */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
              <span>Mobile-First Engineering • Auto-Rotating Live Telemetry</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Smart Water Management <br />
              <span className="text-brand-500">In Your Pocket</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Designed so building supervisors, hostel wardens, and homeowners never have to climb dangerous ladders onto rooftops in the dark to check water availability or verify incoming water cleanliness.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Instant Contamination Alerts</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Real-time push notifications the moment turbidity crosses safe thresholds or debris blocks the municipal inlet mesh.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Remote Manual Actuator Override</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Switch from AUTO to MANUAL control from anywhere in the world, backed by hardware-enforced local interlocks that prevent accidental dry-runs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Ultra-Low Telemetry Footprint</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Efficient JSON payloads over Firebase Realtime Database consuming under 200 KB per hour, ideal for spotty 2.4 GHz Wi-Fi conditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group"
              >
                <span>Open Dedicated Live Dashboard Page</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
