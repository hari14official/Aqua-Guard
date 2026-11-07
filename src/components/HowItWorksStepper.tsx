import React from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  RotateCw,
  Droplets,
  Activity
} from 'lucide-react';
import { TankLiveState } from '../types/tank';

interface HowItWorksStepperProps {
  liveState: TankLiveState;
}

export const HowItWorksStepper: React.FC<HowItWorksStepperProps> = ({ liveState }) => {
  const isAlarm = liveState.alarm;
  const isFilling = liveState.pump;
  const isFull = liveState.levelState === 'FULL';
  const isLow = liveState.levelState === 'LOW';

  // Determine which step is currently active in live execution
  let activeStepId = 4; // default steady state
  if (isAlarm) {
    activeStepId = 2; // Hazard branch
  } else if (isFilling || isLow) {
    activeStepId = 3; // Filling branch
  } else if (isFull) {
    activeStepId = 3; // Full state reached
  }

  const steps = [
    {
      id: 1,
      title: "Step 1: Read All Sensors Concurrently",
      type: "ACTION",
      icon: Activity,
      badge: "Periodic Pulse (50ms)",
      description: "ESP32 pulses power to HW-038 level probes (saving electrodes from corrosion), performs 10-sample median filter on ADC1 turbidity (GPIO32), and reads debounced IR beam (GPIO27).",
      outcome: `Live Readings: Turbidity = ${liveState.turbidityVoltage.toFixed(2)}V (${liveState.turbidityStatus}), IR Inlet = ${liveState.objectDetected ? 'BLOCKED' : 'CLEAR'}, Level = ${Math.round(liveState.levelPercent)}% (${liveState.levelState})`,
      isActive: true, // Always running in loop
    },
    {
      id: 2,
      title: "Step 2: Contamination & Obstruction Check",
      type: "DECISION",
      icon: HelpCircle,
      badge: "Safety Interlock",
      description: "Is Turbidity < 2.50V (Dirty Water) OR is IR Inlet Beam broken (Obstacle/Insect detected)?",
      branches: [
        {
          label: "YES (Hazard Detected)",
          action: "Immediately de-energize 12V Solenoid (valve shut), sound Piezo Buzzer (GPIO23), activate Red LED (GPIO19), keep Pump OFF.",
          isMatchingLive: isAlarm,
          color: "border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200"
        },
        {
          label: "NO (Inlet Clear & Clean)",
          action: "Turbidity verified safe (>2.5V) and zero inlet obstructions. Proceed to reservoir level assessment.",
          isMatchingLive: !isAlarm,
          color: "border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200"
        }
      ],
      isActive: activeStepId === 2,
    },
    {
      id: 3,
      title: "Step 3: Reservoir Level Evaluation & Hysteresis",
      type: "DECISION",
      icon: Droplets,
      badge: "Hysteresis Logic",
      description: "Is water level at or below LOW probe (20%)?",
      branches: [
        {
          label: "YES (Level LOW <= 20%)",
          action: "Open inlet solenoid valve and switch Relay 1 ON (Pump running). Pump continues pumping continuously until the FULL probe (90%) is satisfied, then switches OFF.",
          isMatchingLive: isFilling || isLow,
          color: "border-cyan-400 bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200"
        },
        {
          label: "NO (Level in MID or FULL)",
          action: "If level >= 90%, ensure pump is OFF and valve closed. If in MID zone, maintain current state without motor chatter.",
          isMatchingLive: !isFilling && !isLow && !isAlarm,
          color: "border-brand-400 bg-brand-50/80 dark:bg-brand-950/40 text-brand-800 dark:text-brand-200"
        }
      ],
      isActive: activeStepId === 3,
    },
    {
      id: 4,
      title: "Step 4: Telemetry Streaming & Loop Delay",
      type: "ACTION",
      icon: RotateCw,
      badge: "2-Second Loop Interval",
      description: "Push updated JSON telemetry to `/tank/live`, append to history ring, check `/tank/commands` for remote override requests, and repeat the loop.",
      outcome: `Next tick in < 2s • Current system state: "${liveState.systemStateLabel}"`,
      isActive: activeStepId === 4,
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Firmware Algorithm
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
          How AquaGuard Works: Execution Stepper
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
          An interactive walkthrough of the exact embedded C++ state machine running on the ESP32. Notice the real-time node highlighting as simulated water flows.
        </p>
      </div>

      {/* Stepper Container */}
      <div className="max-w-4xl mx-auto relative space-y-8 before:absolute before:inset-0 before:left-8 before:w-1 before:bg-slate-200 dark:before:bg-navy-800 before:hidden md:before:block">
        {steps.map((st) => {
          const Icon = st.icon;
          const isNodeActive = st.isActive;

          return (
            <div 
              key={st.id}
              className={`relative flex flex-col md:flex-row items-start gap-6 p-6 rounded-3xl transition-all duration-300 ${
                isNodeActive 
                  ? 'glass-panel ring-2 ring-brand-500 shadow-glow' 
                  : 'bg-white/60 dark:bg-navy-900/40 border border-slate-200 dark:border-navy-800'
              }`}
            >
              {/* Step Icon Badge */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md z-10 transition-transform ${
                isNodeActive
                  ? 'bg-brand-600 text-white scale-110 animate-pulse'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400'
              }`}>
                <Icon className="w-7 h-7" />
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {st.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                      {st.badge}
                    </span>
                  </div>

                  {isNodeActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      ACTIVE SYSTEM STATE
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {st.description}
                </p>

                {/* Sub-branches if decision node */}
                {st.branches && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {st.branches.map((br, bIdx) => (
                      <div 
                        key={bIdx}
                        className={`p-3.5 rounded-2xl border transition-all ${br.color} ${
                          br.isMatchingLive ? 'ring-2 ring-current shadow-md scale-[1.02]' : 'opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{br.label}</span>
                          {br.isMatchingLive && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20">
                              Current Path
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-normal">
                          {br.action}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dynamic Outcome for Actions */}
                {st.outcome && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-navy-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>{st.outcome}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
