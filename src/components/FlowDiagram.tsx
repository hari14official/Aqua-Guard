import React from 'react';
import { 
  Filter, 
  Activity, 
  ShieldCheck, 
  Database, 
  Waves, 
  Home, 
  ArrowRight
} from 'lucide-react';
import { TankLiveState } from '../types/tank';

interface FlowDiagramProps {
  liveState: TankLiveState;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ liveState }) => {
  const isValveOpen = liveState.valve;
  const isPumpOn = liveState.pump;
  const isDirty = liveState.turbidityStatus === 'DIRTY';
  const isObject = liveState.objectDetected;
  const isWaterFlowingIn = isValveOpen && !isDirty && !isObject;

  const stages = [
    {
      step: "01",
      name: "Inlet Mesh",
      sub: "Coarse Physical Filter",
      icon: Filter,
      status: isObject ? "OBJECT BLOCKED" : "CLEAR & PASSING",
      statusColor: isObject ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      detail: "IR obstacle sensor scans municipal entrance for leaves & insects"
    },
    {
      step: "02",
      name: "Inspection Chamber",
      sub: "Turbidity Optical Cell",
      icon: Activity,
      status: `${liveState.turbidityStatus} (${liveState.turbidityVoltage.toFixed(2)}V)`,
      statusColor: isDirty ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      detail: "Analog turbidity module measures light scattering before tank entry"
    },
    {
      step: "03",
      name: "Solenoid Valve",
      sub: "Normally-Closed 12V",
      icon: ShieldCheck,
      status: isValveOpen ? "VALVE OPEN" : "VALVE SHUT",
      statusColor: isValveOpen ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300" : "bg-slate-200 text-slate-800 dark:bg-navy-800 dark:text-slate-300",
      detail: "Hardware fail-safe: cuts flow instantaneously on dirty water"
    },
    {
      step: "04",
      name: "Storage Tank",
      sub: "Dual HW-038 Probes",
      icon: Database,
      status: `${Math.round(liveState.levelPercent)}% (${liveState.levelState})`,
      statusColor: "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300",
      detail: "Pulsed conductive sensing at LOW (20%) and FULL (90%) marks"
    },
    {
      step: "05",
      name: "Mini Submersible Pump",
      sub: "5V Relay Actuator",
      icon: Waves,
      status: isPumpOn ? "PUMP ACTIVE" : "PUMP STANDBY",
      statusColor: isPumpOn ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-200 text-slate-800 dark:bg-navy-800 dark:text-slate-300",
      detail: "Hysteresis automation fills tank smoothly without motor chatter"
    },
    {
      step: "06",
      name: "Consumer Outlet",
      sub: "Potable Clean Water",
      icon: Home,
      status: isDirty ? "SUPPLY ISOLATED" : "PURIFIED FLOW",
      statusColor: isDirty ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
      detail: "Guaranteed uncontaminated water supply for domestic taps"
    }
  ];

  return (
    <section id="flowchart" className="py-16 lg:py-24 bg-slate-50 dark:bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Physical Hydraulic Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            End-to-End System Diagram
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
            Watch live status chips update in real-time along the water treatment and distribution pipeline.
          </p>
        </div>

        {/* Animated Pipe Flowline Display */}
        <div className="hidden lg:block relative mb-12">
          <div className="absolute top-1/2 left-4 right-4 h-3 -translate-y-1/2 bg-slate-200 dark:bg-navy-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isWaterFlowingIn 
                  ? 'bg-gradient-to-r from-brand-400 via-cyan-400 to-teal-400 animate-pulse' 
                  : 'bg-rose-300/40 dark:bg-rose-900/40'
              }`}
            />
          </div>
        </div>

        {/* 6 Stage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
          {stages.map((st, i) => {
            const Icon = st.icon;
            return (
              <div 
                key={i}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between hover:shadow-soft transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      STEP {st.step}
                    </span>
                    {i < stages.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden lg:block group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {st.name}
                  </h4>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2">
                    {st.sub}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {st.detail}
                  </p>
                </div>

                {/* Live Status Chip */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${st.statusColor}`}>
                    {st.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Optimal State / Passing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>Active Pumping / Filling</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Hazard Interlock Triggered</span>
          </div>
        </div>

      </div>
    </section>
  );
};
