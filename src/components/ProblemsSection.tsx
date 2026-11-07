import React from 'react';
import { 
  Skull, 
  Bug, 
  Waves, 
  ZapOff, 
  Footprints, 
  Clock, 
  AlertOctagon
} from 'lucide-react';

export const ProblemsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          The Status Quo
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
          The Problem with Manual Tanks
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
          Millions of overhead domestic tanks rely on unmonitored mechanical float valves or manual switchboard toggling, creating severe health and economic hazards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Group A: Contamination */}
        <div className="glass-panel p-8 rounded-3xl border border-rose-200/70 dark:border-rose-950/50 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Hazard Category 1</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Water Contamination</h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Municipal pipeline breaks and open rooftop covers introduce hazardous physical and biological adulterants directly into domestic water tanks unnoticed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <span>Pipe Silt &amp; Dirt</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Post-maintenance muddy surges foul water for weeks, coating tank bottoms with thick anaerobic sludge.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <Bug className="w-4 h-4 text-rose-500" />
                <span>Insects &amp; Mosquitoes</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stagnant dark tank recesses become breeding grounds for dengue vector larvae and roaches entering open air vents.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <Skull className="w-4 h-4 text-rose-500" />
                <span>Decomposed Pests</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frogs, lizards, or birds trapped under tank lids decay undetected, contaminating family drinking water.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <span>Airborne Dust &amp; Rust</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Old galvanized municipal riser pipes slough heavy iron flakes into bathroom taps and washing machines.
              </p>
            </div>
          </div>
        </div>

        {/* Group B: Waste & Effort */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-200/70 dark:border-amber-950/50 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Hazard Category 2</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Water Waste &amp; Effort</h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Manual motor routines lead to overflowing terrace spouts, expensive electricity bills, motor burnout, and dangerous ladder climbs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <Waves className="w-4 h-4 text-amber-500" />
                <span>Overhead Overflow</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hundreds of liters of treated water spill over terrace parapets daily before anyone notices the sound of water falling.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <ZapOff className="w-4 h-4 text-amber-500" />
                <span>Forgotten Motors</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pumps left running for hours waste kilowatt-hours of electrical grid energy and overheat motor windings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <Footprints className="w-4 h-4 text-amber-500" />
                <span>Manual Ladder Checks</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Residents and elderly householders forced to scale wet, slippery steel ladders to bang on tank sides or peer inside.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Dry-Run Pump Burnout</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Motors operated during municipal dry spells run without water lubrication, seizing impellers and burning coils.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
