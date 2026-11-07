import React from 'react';
import { Lightbulb, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export const TRIZSection: React.FC = () => {
  const trizPrinciples = [
    {
      num: "#23",
      name: "Feedback Principle",
      icon: RefreshCw,
      color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70",
      description: "Introduce feedback to improve an action or process.",
      application: "Replaced open-loop manual timers with continuous multi-sensor closed-loop feedback. Solenoid and pump states react dynamically in real-time to measured water quality and volume."
    },
    {
      num: "#28",
      name: "Mechanics Substitution",
      icon: Zap,
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70",
      description: "Replace a mechanical means with an optical, electrical, or sensory field.",
      application: "Substituted stuck mechanical float balls and pivoting levers with solid-state conductive immersion probes (HW-038). Completely eliminated mechanical jamming and mineral calcification."
    },
    {
      num: "#19",
      name: "Periodic Action",
      icon: ShieldCheck,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70",
      description: "Instead of continuous action, use periodic or pulsing actions.",
      application: "Rather than applying continuous DC voltage to water probes (which accelerates galvanic electrolysis and dissolves copper traces), probes are powered for only 50ms during read cycles, extending lifespan by over 20x."
    }
  ];

  return (
    <section id="triz" className="py-16 lg:py-24 bg-slate-50 dark:bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Systematic Innovation Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            TRIZ Engineering Principles
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
            How the Theory of Inventive Problem Solving (TRIZ) guided Team 5 to overcome classical engineering contradictions, eliminate mechanical jamming, and prevent sensor electrode corrosion.
          </p>
        </div>

        {/* 3 TRIZ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trizPrinciples.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft hover:shadow-soft-hover transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                      {item.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {item.name}
                  </h3>

                  <p className="text-xs italic text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-navy-900 p-2.5 rounded-xl">
                    "{item.description}"
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Implementation:</strong> {item.application}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center gap-1.5 text-[11px] font-bold text-brand-600 dark:text-brand-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Inventive Resolution Applied</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
