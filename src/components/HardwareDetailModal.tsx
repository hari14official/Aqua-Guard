import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface HardwareItem {
  id: string;
  name: string;
  model: string;
  category: string;
  role: string;
  image: string;
  price: string;
  statusTag: string;
  summary: string;
  howItWorks: {
    physicalPrinciple: string;
    signalProcessing: string;
    esp32Interaction: string;
    failSafeMechanism: string;
  };
  specs: { label: string; value: string }[];
  wiring: {
    pinName: string;
    esp32Pin: string;
    signalType: string;
    voltage: string;
    notes: string;
  }[];
  codeSnippet: string;
  whyChosenByTCE: string;
}

interface HardwareDetailModalProps {
  component: HardwareItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onOpenCircuit?: () => void;
}

export const HardwareDetailModal: React.FC<HardwareDetailModalProps> = ({
  component,
  onClose,
  onNext,
  onPrev,
  onOpenCircuit
}) => {
  const [activeTab, setActiveTab] = useState<'how-it-works' | 'specs' | 'wiring' | 'code'>('how-it-works');

  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-navy-800 bg-slate-50/75 dark:bg-navy-950/75 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {component.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Model: {component.model}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
                title="Previous Component"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
                title="Next Component"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 ml-2 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Close Page"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header Row: HD Photo Preview & Key Specs Callout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Real HD Image Studio Frame */}
            <div className="md:col-span-5 relative group">
              <div className="w-full h-56 sm:h-64 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
                <img
                  src={component.image}
                  alt={component.name}
                  className="w-full h-full object-cover relative z-10 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/30 z-20">
                  REAL HD COMPONENT
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-700 z-20">
                  Est. {component.price}
                </div>
              </div>
            </div>

            {/* Title & Core Role */}
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{component.statusTag}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {component.name}
              </h2>

              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {component.role}
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {component.summary}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-mono">
                  TCE Team 5 Verified
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-mono">
                  Solid-State Architecture
                </span>
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-navy-800 gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'how-it-works'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>How It Works & Physics</span>
            </button>

            <button
              onClick={() => setActiveTab('wiring')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'wiring'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>ESP32 Pinout & Wiring</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Datasheet Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'code'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Driver Code</span>
            </button>
          </div>

          {/* TAB 1: How It Works & Physics */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-4 text-sm animate-fade-in">
              <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                <h4 className="font-bold text-brand-900 dark:text-brand-200 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-500" />
                  1. Physical Operating Principle
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {component.howItWorks.physicalPrinciple}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
                <h4 className="font-bold text-cyan-900 dark:text-cyan-200 mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  2. Signal Conditioning & Transduction
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {component.howItWorks.signalProcessing}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-500" />
                  3. ESP32 Logic & FreeRTOS Interaction
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {component.howItWorks.esp32Interaction}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  4. Fail-Safe Interlock Behavior
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {component.howItWorks.failSafeMechanism}
                </p>
              </div>

              {/* Rationale Callout */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-800/80 border border-slate-200 dark:border-navy-700 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Why Team 5 Engineered This:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {component.whyChosenByTCE}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ESP32 Pinout & Wiring */}
          {activeTab === 'wiring' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pin-to-pin wiring connection map between {component.name} and the ESP32 DevKit V1 30-pin board:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-navy-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Component Pin</th>
                      <th className="p-3">ESP32 Pin</th>
                      <th className="p-3">Signal Type</th>
                      <th className="p-3">Voltage</th>
                      <th className="p-3">Notes & Protection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-navy-800">
                    {component.wiring.map((w, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-navy-800/50">
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{w.pinName}</td>
                        <td className="p-3 font-mono font-semibold text-brand-600 dark:text-brand-400">{w.esp32Pin}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{w.signalType}</td>
                        <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400">{w.voltage}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{w.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>
                  Notice: ESP32 GPIO inputs are strictly 3.3V tolerant. Signals originating from 5V conditioning modules must utilize voltage divider attenuation or optocoupler isolation.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: Datasheet Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {component.specs.map((spec, i) => (
                  <div 
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {spec.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Firmware Code Snippet */}
          {activeTab === 'code' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>ESP32 Firmware Driver (C++ / Arduino IDE)</span>
                <span className="font-mono text-brand-500">FreeRTOS Compatible</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <pre>{component.codeSnippet}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-navy-800 bg-slate-50/75 dark:bg-navy-950/75 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            AquaGuard Prototype • TCE Team 5 Hardware Architecture
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 hover:bg-slate-100 transition-colors"
            >
              Close Page
            </button>
            <button
              onClick={() => {
                onClose();
                if (onOpenCircuit) onOpenCircuit();
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5"
            >
              <span>[Review Full Circuit Diagram]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
