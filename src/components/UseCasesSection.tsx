import React from 'react';
import { Home, Building2, School, Trees, SunMedium, Compass } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const cases = [
    {
      title: "Individual Homes",
      icon: Home,
      color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70",
      description: "Protects family health from silt surges and prevents motor dry-burnouts while saving electricity in residential overhead tanks."
    },
    {
      title: "Hostels & Student Dorms",
      icon: Building2,
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70",
      description: "Eliminates morning water shortages and dry taps through automated hysteresis refilling without requiring hostel staff to climb roofs."
    },
    {
      title: "Multi-Storey Apartments",
      icon: Compass,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70",
      description: "Centralized telemetry for facility managers tracking overhead tanks and ground sumps across multiple apartment blocks."
    },
    {
      title: "Schools & Educational Campuses",
      icon: School,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70",
      description: "Ensures pure RO intake and clean municipal drinking water across academic buildings, preventing water-borne disease outbreaks."
    },
    {
      title: "Outdoor & Farm Storage Tanks",
      icon: Trees,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70",
      description: "Automated livestock and drip irrigation reservoir management with solid-state probes that resist agricultural mineral deposits."
    },
    {
      title: "Rooftop Rainwater Harvesters",
      icon: SunMedium,
      color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/70",
      description: "Inlet turbidity detection instantly diverts the 'first-flush' sediment and dirty roof wash-off away from the clean storage cistern."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Versatile Applications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            Engineered for Every Water Infrastructure
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
            From single domestic overhead tanks to large institutional campuses and rainwater harvesting cisterns.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((cs, idx) => {
            const Icon = cs.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm hover:shadow-soft-hover transition-all group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cs.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {cs.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cs.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
