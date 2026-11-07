import React, { useState, useRef, useEffect } from 'react';
import { 
  Droplets, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Activity, 
  Wifi, 
  Radio, 
  LogIn,
  Bell,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Home,
  Volume2,
  VolumeX
} from 'lucide-react';
import { TankLiveState, SmartAlert } from '../types/tank';
import { soundService } from '../services/soundService';

interface NavbarProps {
  liveState: TankLiveState;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isFirebase: boolean;
  alerts?: SmartAlert[];
  onMarkAlertRead?: (id: string) => void;
  onClearAllAlerts?: () => void;
  currentView?: 'home' | 'dashboard' | 'circuit' | 'institutional' | 'terms' | 'contact' | 'privacy';
  onNavigate?: (view: 'home' | 'dashboard' | 'circuit' | 'institutional' | 'terms' | 'contact' | 'privacy') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  liveState,
  isDarkMode,
  onToggleDarkMode,
  isFirebase,
  alerts = [],
  onMarkAlertRead,
  onClearAllAlerts,
  currentView = 'home',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const notifRef = useRef<HTMLDivElement>(null);

  const handleToggleSound = () => {
    const nextMuted = soundService.toggleMute();
    setIsMuted(nextMuted);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  const navLinks = [
    { name: 'Product', id: 'product', href: '#product' },
    { name: 'Live Dashboard', id: 'dashboard', href: '#dashboard' },
    { name: 'Architecture', id: 'architecture', href: '#flowchart' },
    { name: 'Hardware', id: 'hardware', href: '#hardware' },
    { name: 'Team', id: 'team', href: '#team' },
  ];

  const handleLinkClick = (id: string, href: string) => {
    setMobileMenuOpen(false);
    if (id === 'dashboard') {
      if (onNavigate) onNavigate('dashboard');
    } else {
      if (onNavigate) onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const formatTimeAgo = (ts: number) => {
    const diff = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-b border-slate-200 dark:border-navy-800 transition-colors duration-200">
        {/* Full-width container with left and right edge pinning */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* 1. LEFT CORNER: Logo + TCE Team 5 + Subtitle */}
            <div 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-3 group shrink-0 cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Droplets className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Aqua<span className="text-brand-500">Guard</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shrink-0">
                    TCE Team 5
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block whitespace-nowrap">
                  Smart Water Monitoring &amp; Automation
                </p>
              </div>
            </div>

            {/* 2. CENTER: Navigation Links (Centered between left and right) */}
            <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.id, link.href)}
                  className={`text-sm font-semibold transition-colors whitespace-nowrap py-1 ${
                    currentView === 'dashboard' && link.id === 'dashboard'
                      ? 'text-brand-600 dark:text-brand-400 font-bold border-b-2 border-brand-500'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* 3. RIGHT CORNER: Actions with Open Dashboard pinned to the right edge */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Telemetry Status Pill */}
              <div 
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
                  isFirebase 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                }`}
                title={isFirebase ? 'Connected to Firebase Realtime Database' : 'Running in local realistic Simulation mode'}
              >
                {isFirebase ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                ) : (
                  <Radio className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="hidden xl:inline">{isFirebase ? 'Firebase Live' : 'Simulated'}</span>
                <span className={`w-2 h-2 rounded-full ${
                  liveState.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'
                }`} />
              </div>

              {/* Notification Center Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="View System Notifications"
                  className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900 border border-slate-200 dark:border-navy-700 transition-colors relative"
                  title="System Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Floating Notification Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl glass-panel bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border border-slate-200 dark:border-navy-700 shadow-2xl z-50 overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/50">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Active System Alerts
                        </span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>

                      {alerts.length > 0 && onClearAllAlerts && (
                        <button
                          onClick={onClearAllAlerts}
                          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear All</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800">
                      {alerts.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                          <p className="font-semibold text-slate-600 dark:text-slate-300">All systems operational</p>
                          <p className="text-[11px] mt-0.5">No active alerts or sensor anomalies reported.</p>
                        </div>
                      ) : (
                        alerts.map((alert) => (
                          <div
                            key={alert.id}
                            onClick={() => onMarkAlertRead && onMarkAlertRead(alert.id)}
                            className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800/60 ${
                              !alert.read ? 'bg-brand-50/40 dark:bg-brand-950/30' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                {alert.severity === 'HIGH' ? (
                                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                ) : alert.severity === 'MEDIUM' ? (
                                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-slate-100 leading-snug">
                                    {alert.title}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                    {alert.message}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                {formatTimeAgo(alert.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-navy-950/60 border-t border-slate-100 dark:border-navy-800 text-center">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          if (onNavigate) onNavigate('dashboard');
                        }}
                        className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1 w-full"
                      >
                        <span>Open Telemetry Audit Log &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sound Alert Toggle */}
              <button
                onClick={handleToggleSound}
                aria-label={isMuted ? "Enable Audio Alerts" : "Mute Audio Alerts"}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isMuted
                    ? 'text-slate-400 dark:text-slate-500 border-slate-200 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-900'
                    : 'text-brand-600 dark:text-cyan-400 border-brand-300 dark:border-cyan-700/60 bg-brand-50/50 dark:bg-cyan-950/30 hover:bg-brand-100/50'
                }`}
                title={isMuted ? "Sound Alerts Muted (Click to Enable)" : "Real-Time Sound Alerts Active (Click to Mute)"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onToggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900 border border-slate-200 dark:border-navy-700 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Portal Login */}
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900 border border-slate-200 dark:border-navy-700 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Portal</span>
              </button>

              {/* FAR RIGHT CORNER: "Open Dashboard" button */}
              {currentView === 'home' ? (
                <button
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center gap-1.5 whitespace-nowrap ml-1"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Open Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 border border-slate-200 dark:border-navy-700 transition-all flex items-center gap-1.5 whitespace-nowrap ml-1"
                >
                  <Home className="w-3.5 h-3.5 text-brand-500" />
                  <span>Home</span>
                </button>
              )}

              {/* Mobile Drawer Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900 border border-slate-200 dark:border-navy-700 transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 px-4 pt-3 pb-6 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.id, link.href)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-navy-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('dashboard');
                }}
                className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-500 shadow-md"
              >
                Open Live Dashboard
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Portal Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin Operator Portal</h3>
              </div>
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Operator Email / ID
                </label>
                <input 
                  type="text" 
                  defaultValue="tce.team5@thiagarajar.edu"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  PIN Passcode
                </label>
                <input 
                  type="password" 
                  defaultValue="2026"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-[10px] text-brand-800 dark:text-brand-300">
                Department Demo credentials pre-filled for project evaluation.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setLoginModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setLoginModalOpen(false);
                  if (onNavigate) onNavigate('dashboard');
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm"
              >
                Authenticate & Open
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
