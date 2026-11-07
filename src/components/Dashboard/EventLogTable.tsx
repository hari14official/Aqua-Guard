import React, { useState } from 'react';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { TankEvent } from '../../types/tank';

interface EventLogTableProps {
  events: TankEvent[];
}

export const EventLogTable: React.FC<EventLogTableProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const filteredEvents = React.useMemo(() => {
    if (filterType === 'ALL') return events;
    return events.filter(e => e.type === filterType);
  }, [events, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const getSeverityBadge = (type: TankEvent['type']) => {
    switch (type) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            WARNING
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            SUCCESS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
            <Info className="w-3 h-3 text-brand-500" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-soft space-y-4">
      {/* Table Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              System Audit &amp; Event Log
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized event stream of sensor readings, interlock shutoffs, and cycle operations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'SUCCESS', 'INFO'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === type
                  ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-navy-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Event Action</th>
              <th className="py-2.5 px-3">Diagnostic Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 font-medium">
            {displayedEvents.length > 0 ? (
              displayedEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-900/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatTime(evt.timestamp)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getSeverityBadge(evt.type)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {evt.title}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {evt.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                  No logged events match the selected severity category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {displayedEvents.length} of {filteredEvents.length} events (Page {currentPage} of {totalPages})
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
