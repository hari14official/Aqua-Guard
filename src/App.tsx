import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WaterQuotes } from './components/WaterQuotes';
import { MobileMockup } from './components/MobileMockup';
import { ThreePillars } from './components/ThreePillars';
import { StatsRow } from './components/StatsRow';
import { FlowDiagram } from './components/FlowDiagram';
import { ProblemsSection } from './components/ProblemsSection';
import { HardwareSection } from './components/HardwareSection';
import { HowItWorksStepper } from './components/HowItWorksStepper';
import { NotificationCenter } from './components/NotificationCenter';
import { UseCasesSection } from './components/UseCasesSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { LiveDashboardPage } from './components/LiveDashboardPage';
import { FullCircuitPage } from './components/FullCircuitPage';
import { ProjectInfoPage } from './components/ProjectInfoPage';
import { PrivacyNoticePage } from './components/PrivacyNoticePage';
import { TermsOfUsePage } from './components/TermsOfUsePage';
import { ContactPage } from './components/ContactPage';

import { tankService } from './services/tankService';
import { TankLiveState, TankHistoryItem, TankEvent, SmartAlert, OperationMode } from './types/tank';
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'circuit' | 'institutional' | 'terms' | 'contact' | 'privacy'>(() => {
    if (window.location.hash === '#dashboard') return 'dashboard';
    if (window.location.hash === '#circuit') return 'circuit';
    if (window.location.hash === '#about' || window.location.hash === '#institutional') return 'institutional';
    if (window.location.hash === '#terms') return 'terms';
    if (window.location.hash === '#privacy') return 'privacy';
    if (window.location.hash === '#contact-page') return 'contact';
    return 'home';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('aquaguard_theme') === 'dark';
  });

  const [liveState, setLiveState] = useState<TankLiveState>(tankService.getState());
  const [history, setHistory] = useState<TankHistoryItem[]>(tankService.getHistory());
  const [events, setEvents] = useState<TankEvent[]>(tankService.getEvents());
  const [alerts, setAlerts] = useState<SmartAlert[]>(tankService.getAlerts());
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aquaguard_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aquaguard_theme', 'light');
    }
  }, [isDarkMode]);

  // Subscribe to tankService
  useEffect(() => {
    const unsubscribe = tankService.subscribe((state) => {
      setLiveState(state);
      setHistory(tankService.getHistory());
      setEvents(tankService.getEvents());
      setAlerts(tankService.getAlerts());
    });

    return () => unsubscribe();
  }, []);

  // Hash-based navigation listener
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#dashboard') {
        setCurrentView('dashboard');
        window.scrollTo(0, 0);
      } else if (window.location.hash === '#circuit') {
        setCurrentView('circuit');
        window.scrollTo(0, 0);
      } else if (window.location.hash === '#about' || window.location.hash === '#institutional') {
        setCurrentView('institutional');
        window.scrollTo(0, 0);
      } else if (window.location.hash === '#privacy') {
        setCurrentView('privacy');
        window.scrollTo(0, 0);
      } else if (window.location.hash === '#terms') {
        setCurrentView('terms');
        window.scrollTo(0, 0);
      } else if (window.location.hash === '#contact-page' || window.location.hash === '#contact-us') {
        setCurrentView('contact');
        window.scrollTo(0, 0);
      } else if (window.location.hash === '' || window.location.hash === '#home' || window.location.hash === '#product') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: 'home' | 'dashboard' | 'circuit' | 'institutional' | 'terms' | 'contact' | 'privacy') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'dashboard') window.location.hash = '#dashboard';
    else if (view === 'circuit') window.location.hash = '#circuit';
    else if (view === 'institutional') window.location.hash = '#about';
    else if (view === 'terms') window.location.hash = '#terms';
    else if (view === 'privacy') window.location.hash = '#privacy';
    else if (view === 'contact') window.location.hash = '#contact-page';
    else window.location.hash = '#home';
  };

  const showToast = (message: string, type: 'info' | 'warning' | 'error' | 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type === 'error' && "Notification" in window && Notification.permission === "granted") {
      new Notification("AquaGuard Alert", { body: message });
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkAlertRead = (id: string) => {
    tankService.markAlertAsRead(id);
    setAlerts(tankService.getAlerts());
  };

  const handleClearAlerts = () => {
    tankService.clearAllAlerts();
    setAlerts([]);
    showToast("All priority alerts cleared.", "info");
  };

  // 1. DEDICATED FULL CIRCUIT DIAGRAM VIEW
  if (currentView === 'circuit') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <FullCircuitPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  // 2. DEDICATED INSTITUTIONAL & PROJECT DETAILS FULL PAGE VIEW
  if (currentView === 'institutional') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <ProjectInfoPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  // 3. DEDICATED PRIVACY NOTICE FULL PAGE VIEW (Matched to uploaded Images 2, 3, 4, 5)
  if (currentView === 'privacy') {
    return (
      <PrivacyNoticePage 
        onBack={() => navigateTo('home')} 
        onOpenDashboard={() => navigateTo('dashboard')}
        onOpenTerms={() => navigateTo('terms')}
        onOpenContact={() => navigateTo('contact')}
      />
    );
  }

  // 4. DEDICATED TERMS OF USE VIEW (Matched to uploaded Images 1 & 2)
  if (currentView === 'terms') {
    return (
      <TermsOfUsePage 
        onBack={() => navigateTo('home')} 
        onOpenDashboard={() => navigateTo('dashboard')}
        onOpenContact={() => navigateTo('contact')}
        onOpenPrivacy={() => navigateTo('privacy')}
      />
    );
  }

  // 5. DEDICATED CONTACT US VIEW WITH TCE MAP (Matched to uploaded Images 3 & 4)
  if (currentView === 'contact') {
    return (
      <ContactPage 
        onBack={() => navigateTo('home')} 
        onOpenDashboard={() => navigateTo('dashboard')}
        onOpenTerms={() => navigateTo('terms')}
        onOpenPrivacy={() => navigateTo('privacy')}
        onShowToast={showToast}
      />
    );
  }

  // 2. DEDICATED LIVE TELEMETRY DASHBOARD PAGE VIEW
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-navy-950 dark:text-slate-100 transition-colors duration-200">
        <LiveDashboardPage
          liveState={liveState}
          history={history}
          events={events}
          isFirebase={tankService.isFirebaseMode()}
          onSetPump={(state) => tankService.setPump(state)}
          onSetValve={(state) => tankService.setValve(state)}
          onSetMode={(mode: OperationMode) => tankService.setMode(mode)}
          onShowToast={showToast}
          onBackToHome={() => navigateTo('home')}
        />

        {/* Floating Toasts */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 backdrop-blur-md animate-fade-in ${
                t.type === 'error'
                  ? 'bg-rose-900/90 text-white border-rose-700'
                  : t.type === 'warning'
                  ? 'bg-amber-900/90 text-white border-amber-700'
                  : t.type === 'success'
                  ? 'bg-emerald-900/90 text-white border-emerald-700'
                  : 'bg-slate-900/90 text-white border-slate-700'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {t.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />}
                <span className="text-xs font-semibold leading-relaxed">{t.message}</span>
              </div>
              <button onClick={() => removeToast(t.id)} className="text-white/60 hover:text-white shrink-0 p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. MAIN LANDING PAGE VIEW (Home)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-navy-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Navbar with Notifications & No TRIZ */}
      <Navbar
        liveState={liveState}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isFirebase={tankService.isFirebaseMode()}
        alerts={alerts}
        onMarkAlertRead={handleMarkAlertRead}
        onClearAllAlerts={handleClearAlerts}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <main className="flex-1 w-full">
        {/* 2. Hero with FULL WIDTH 4 Moving Pages Carousel (Auto-changes every 3 seconds) */}
        <Hero 
          liveState={liveState} 
          onOpenDashboard={() => navigateTo('dashboard')}
          onOpenCircuit={() => navigateTo('circuit')}
        />

        {/* 3. Centered Water Wisdom Quotes (Auto-changes every 3 seconds) */}
        <WaterQuotes />

        {/* 4. Mobile Mockup Phone with 3-Second Rotating Screens (Tank, Turbidity 4.01V, Actuators) */}
        <MobileMockup 
          liveState={liveState}
          onOpenDashboard={() => navigateTo('dashboard')}
        />

        {/* 5. Detect. Protect. Automate Pillars */}
        <ThreePillars />

        {/* 6. Highlight Stats Row */}
        <StatsRow />

        {/* 7. End-to-End System Circuit & Fluid Flow Diagram */}
        <FlowDiagram liveState={liveState} />

        {/* 8. The Problem with Manual Tanks */}
        <ProblemsSection />

        {/* 9. Hardware BOM with Real HD Components & Detail Pages */}
        <HardwareSection onOpenCircuit={() => navigateTo('circuit')} />

        {/* 10. How It Works Flowchart Stepper */}
        <HowItWorksStepper liveState={liveState} />

        {/* 11. Smart Notifications Center */}
        <NotificationCenter
          alerts={alerts}
          onMarkRead={handleMarkAlertRead}
          onClearAll={handleClearAlerts}
        />

        {/* 12. Use Cases */}
        <UseCasesSection />

        {/* 13. FAQ Accordion */}
        <FAQSection />

        {/* 14. Contact the Team Form */}
        <ContactSection onShowToast={showToast} />
      </main>

      {/* 15. Footer - ROSTER SHOWN EXCLUSIVELY ON HOME PAGE */}
      <Footer 
        onOpenPrivacy={() => navigateTo('privacy')}
        onOpenTerms={() => navigateTo('terms')}
        onOpenContact={() => navigateTo('contact')}
        onOpenDashboard={() => navigateTo('dashboard')}
        onOpenCircuit={() => navigateTo('circuit')}
        onOpenProjectInfo={() => navigateTo('privacy')}
        onNavigateHome={(sec) => {
          if (sec) {
            const el = document.getElementById(sec);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        showRoster={true}
      />

      {/* Floating Toast Notification Dispatcher */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 backdrop-blur-md animate-fade-in ${
              t.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-700'
                : t.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700'
                : t.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {t.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />}
              <span className="text-xs font-semibold leading-relaxed">{t.message}</span>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-white/60 hover:text-white shrink-0 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
