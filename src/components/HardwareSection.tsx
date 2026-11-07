import React, { useState } from 'react';
import { Cpu, ArrowUpRight, Eye, Sparkles } from 'lucide-react';
import { HARDWARE_COMPONENTS } from '../data/hardwareData';
import { HardwareDetailModal, HardwareItem } from './HardwareDetailModal';

interface HardwareSectionProps {
  onOpenCircuit?: () => void;
}

export const HardwareSection: React.FC<HardwareSectionProps> = ({ onOpenCircuit }) => {
  const [selectedComponent, setSelectedComponent] = useState<HardwareItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleOpenModal = (comp: HardwareItem, idx: number) => {
    setSelectedComponent(comp);
    setSelectedIndex(idx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % HARDWARE_COMPONENTS.length;
    setSelectedIndex(nextIdx);
    setSelectedComponent(HARDWARE_COMPONENTS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (selectedIndex - 1 + HARDWARE_COMPONENTS.length) % HARDWARE_COMPONENTS.length;
    setSelectedIndex(prevIdx);
    setSelectedComponent(HARDWARE_COMPONENTS[prevIdx]);
  };

  return (
    <section id="hardware" className="py-16 lg:py-24 bg-slate-50 dark:bg-navy-950/40 border-y border-slate-200/60 dark:border-navy-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Interactive Hardware Breakdown</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered Hardware BOM & Mechanics
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
            Click any physical component card below to inspect its operating physics, internal signal conditioning, ESP32 GPIO wiring, and fail-safe automation logic.
          </p>
        </div>

        {/* 10 Component Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {HARDWARE_COMPONENTS.map((comp, idx) => (
            <div
              key={comp.id}
              onClick={() => handleOpenModal(comp, idx)}
              className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-navy-800 shadow-sm hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1.5 hover:border-brand-400 dark:hover:border-brand-500 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle hover gradient indicator */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Real HD Photo Frame */}
                <div className="w-full h-36 rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden mb-3.5 border border-slate-800 relative group-hover:border-brand-500/60 transition-colors shadow-inner">
                  <img
                    src={comp.image}
                    alt={comp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-slate-300 border border-slate-700">
                    SLOT #{idx + 1}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-brand-950/85 backdrop-blur-md text-[9px] font-mono font-semibold text-brand-300 flex items-center gap-1 border border-brand-800/60">
                    <Eye className="w-2.5 h-2.5" />
                    <span>Click for specs</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {comp.category}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {comp.name}
                </h4>

                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2">
                  {comp.role}
                </p>
              </div>

              {/* Pin specs footer & click cue */}
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[130px]">{comp.model}</span>
                <span className="text-brand-600 dark:text-brand-400 font-bold group-hover:underline">
                  Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout box for physical testbed summary */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-brand-50 via-cyan-50/40 to-slate-50 dark:from-brand-950/40 dark:via-cyan-950/20 dark:to-navy-900/60 border border-brand-200 dark:border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                TCE Team 5 Prototype Hardware Architecture
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Each component is mapped to isolated FreeRTOS tasks and protected by optocoupler galvanic barriers, fail-safe spring returns, and overvoltage divider networks.
              </p>
            </div>
          </div>
          
          <button
            onClick={onOpenCircuit}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-white dark:bg-navy-900 border border-brand-200 dark:border-brand-700 shrink-0 shadow-sm hover:bg-brand-50 dark:hover:bg-navy-800 transition-colors flex items-center gap-1.5"
          >
            <span>[Review Full Circuit Diagram]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Hardware Detail Modal Dialog */}
      <HardwareDetailModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        onOpenCircuit={onOpenCircuit}
      />
    </section>
  );
};
