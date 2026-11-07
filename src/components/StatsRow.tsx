import React, { useEffect, useState } from 'react';
import { Layers, ShieldAlert, IndianRupee, Cpu } from 'lucide-react';

export const StatsRow: React.FC = () => {
  const [stages, setStages] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStages(3);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: Layers,
      value: `${stages}`,
      suffix: " Stages",
      label: "Multi-Sensor Detection",
      subtext: "Turbidity, IR beam, and dual level probes",
      color: "text-brand-600 dark:text-brand-400"
    },
    {
      icon: Cpu,
      value: "0",
      suffix: "",
      label: "Moving Parts in Level Sensing",
      subtext: "Conductive solid-state probes eliminate stuck floats",
      color: "text-cyan-600 dark:text-cyan-400"
    },
    {
      icon: ShieldAlert,
      value: "NC",
      suffix: " Valve",
      label: "Fail-Safe Normally-Closed",
      subtext: "Spring-loaded shutoff locks automatically upon power cut",
      color: "text-teal-600 dark:text-teal-400"
    },
    {
      icon: IndianRupee,
      value: "₹1,500 – ₹2,000",
      suffix: "",
      label: "Total Prototype Hardware Cost",
      subtext: "Affordable components tailored for domestic deployment",
      color: "text-amber-600 dark:text-amber-400"
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-navy-950 border-y border-slate-200/80 dark:border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/70 dark:bg-navy-900/40 border border-slate-100 dark:border-navy-800 hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-navy-800 shadow-sm flex items-center justify-center mb-4 text-slate-700 dark:text-slate-200">
                  <Icon className="w-6 h-6 text-brand-500" />
                </div>
                <div className={`text-3xl font-black tracking-tight ${stat.color} mb-1`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
