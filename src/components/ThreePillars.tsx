import React from 'react';
import { 
  Eye, 
  ShieldCheck, 
  Cpu, 
  Droplet, 
  Binary, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Volume2
} from 'lucide-react';

export const ThreePillars: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Core Operating Paradigm
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
          Detect. Protect. Automate.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
          A three-tier defensive engineering architecture designed to safeguard drinking water quality, prevent motor burnouts, and eliminate water waste.
        </p>
      </div>

      {/* 3 Large Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: DETECT */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-navy-800 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Stage 01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Detect</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Continuous multi-sensor telemetry scanning for fluid level thresholds, particulate suspension, and physical intake obstructions.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Droplet className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span><strong>Dual HW-038 Water Sensors:</strong> Solid-state probes positioned at 20% (LOW) and 90% (FULL) levels.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Binary className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Optical Turbidity Sensor:</strong> Measures suspended sediment via 940nm light scattering (0–5V analog output).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Active IR Obstacle Sensor:</strong> Infrared beam monitoring the municipal inlet mouth for leaves or insects.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
            <span>Non-contact &amp; solid state</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 2: PROTECT */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-navy-800 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Stage 02</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Protect</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Instant physical isolation isolating the clean overhead reservoir before adulterated municipal water can enter the storage tank.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span><strong>Normally-Closed 12V Solenoid:</strong> De-energizes automatically within 50ms upon dirty water detection.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span><strong>Inlet Object Lock:</strong> Shuts inlet when an insect, frog, or pipe rust flake blocks the inspection chamber.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span><strong>Dry-Run Interlock:</strong> Hard timeout shuts down the pump if the LOW probe is not satisfied in 6 minutes.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
            <span>Fail-safe de-energization</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 3: AUTOMATE */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-navy-800 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Stage 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Automate</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Autonomous embedded control loop running directly on ESP32 silicon, with audio-visual alarms and cloud telemetry sync.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Sliders className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Hysteresis Pump Cycle:</strong> Starts automatically at LOW (20%), stops smoothly at FULL (90%). No chatter.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Volume2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Audio-Visual Feedback:</strong> High-decibel piezo buzzer and dual red/green status LEDs signal health immediately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>Offline-Safe Fallback:</strong> If Wi-Fi router powers off, the local automation cycle continues uninterrupted.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <span>Zero manual intervention</span>
            <span>&rarr;</span>
          </div>
        </div>

      </div>
    </section>
  );
};
