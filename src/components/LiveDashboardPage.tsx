import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { LiveDashboard } from './Dashboard/LiveDashboard';
import { TankLiveState, TankHistoryItem, TankEvent, OperationMode } from '../types/tank';

interface LiveDashboardPageProps {
  liveState: TankLiveState;
  history: TankHistoryItem[];
  events: TankEvent[];
  isFirebase: boolean;
  onSetPump: (state: boolean) => Promise<{ success: boolean; reason?: string }>;
  onSetValve: (state: boolean) => Promise<{ success: boolean; reason?: string }>;
  onSetMode: (mode: OperationMode) => Promise<void>;
  onShowToast: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
  onBackToHome: () => void;
}

export const LiveDashboardPage: React.FC<LiveDashboardPageProps> = ({
  liveState,
  history,
  events,
  isFirebase,
  onSetPump,
  onSetValve,
  onSetMode,
  onShowToast,
  onBackToHome
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Page Banner */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-slate-200 dark:border-navy-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* STYLISH PREMIUM "Return to Home" BUTTON */}
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-x-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-navy-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:inline">Pages</span>
            <span className="text-xs text-slate-400 hidden md:inline">/</span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Live Dashboard & Telemetry Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>ESP32 NODE CONNECTED</span>
          </div>
        </div>
      </header>

      {/* Main Dedicated Dashboard View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LiveDashboard
          liveState={liveState}
          history={history}
          events={events}
          isFirebase={isFirebase}
          onSetPump={onSetPump}
          onSetValve={onSetValve}
          onSetMode={onSetMode}
          onShowToast={onShowToast}
        />
      </main>

      {/* Footer Back Bar */}
      <footer className="border-t border-slate-200 dark:border-navy-800 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-navy-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>AquaGuard IoT Hub • TCE Team 5 Microcontroller Testbed</span>
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
          >
            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>Return to Landing Page Overview</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
