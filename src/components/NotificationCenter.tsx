import React from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  WifiOff, 
  Trash2, 
  Check
} from 'lucide-react';
import { SmartAlert } from '../types/tank';

interface NotificationCenterProps {
  alerts: SmartAlert[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  alerts,
  onMarkRead,
  onClearAll,
}) => {
  const formatTime = (ts: number) => {
    const diff = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getAlertIcon = (title: string, severity: SmartAlert['severity']) => {
    if (title.toLowerCase().includes('offline')) {
      return <WifiOff className="w-5 h-5 text-rose-500" />;
    }
    if (severity === 'HIGH') {
      return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    }
    if (severity === 'MEDIUM') {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
    return <CheckCircle2 className="w-5 h-5 text-brand-500" />;
  };

  return (
    <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Context & Overview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <BellRing className="w-3.5 h-3.5 text-brand-500" />
            <span>Multi-Channel Push System</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Priority <br />
            <span className="text-brand-500">Alert Dispatcher</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            AquaGuard categorizes events into critical safety interventions, operational notices, and hardware health alarms. Receive real-time alerts before any overflow or bad water consumption can happen.
          </p>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white">Supported Alert Triggers:</div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Tank Full:</strong> High probe contacted, pump safely de-energized.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span><strong>Dirty Water Detected:</strong> Turbidity &lt; 2.50V, solenoid shut instantly.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span><strong>Object at Inlet:</strong> IR proximity beam blocked by foreign matter.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span><strong>Sensor Offline:</strong> Telemetry loss exceeding 10 seconds.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Phone-Style Notification Feed */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-soft">
            
            {/* Header of Feed */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Real-Time Notification Feed
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  {alerts.length} Active
                </span>
              </div>

              {alerts.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* List of Alerts */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {alerts.length > 0 ? (
                alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      alt.read 
                        ? 'bg-slate-50/50 dark:bg-navy-900/30 border-slate-200/60 dark:border-navy-800/60 opacity-80' 
                        : alt.severity === 'HIGH'
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                        : alt.severity === 'MEDIUM'
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                        : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-navy-800 shadow-sm shrink-0">
                        {getAlertIcon(alt.title, alt.severity)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {alt.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatTime(alt.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                          {alt.message}
                        </p>
                      </div>
                    </div>

                    {!alt.read && (
                      <button
                        onClick={() => onMarkRead(alt.id)}
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-navy-800 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  All alerts acknowledged. System functioning within normal parameters.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
