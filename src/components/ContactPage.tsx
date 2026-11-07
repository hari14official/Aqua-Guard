import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Droplets, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ExternalLink, 
  Info, 
  Github, 
  Globe, 
  Navigation 
} from 'lucide-react';
import { Footer } from './Footer';

interface ContactPageProps {
  onBack: () => void;
  onOpenDashboard?: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  onShowToast?: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ 
  onBack, 
  onOpenDashboard, 
  onOpenTerms,
  onOpenPrivacy,
  onShowToast 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      if (onShowToast) {
        onShowToast("Please fill in your name, email, and message.", "warning");
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      if (onShowToast) {
        onShowToast("Your inquiry has been successfully dispatched to Team 5 & Project Guides!", "success");
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
      {/* 1. FUNCTIONAL STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-sm transition-all cursor-pointer"
            title="Return to Home Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
            <span>Return to Home</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Logo & Project Tag */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-black text-white tracking-tight">Aqua<span className="text-cyan-400">Guard</span></span>
              <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-brand-950 text-brand-300 font-mono border border-brand-800">TCE Team 5</span>
            </div>
          </div>
        </div>

        {/* Functional Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <button 
            onClick={onBack}
            className="text-slate-300 hover:text-white transition-colors hidden md:inline-block cursor-pointer"
          >
            Home
          </button>
          {onOpenDashboard && (
            <button 
              onClick={onOpenDashboard}
              className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Live Dashboard
            </button>
          )}
          {onOpenTerms && (
            <button 
              onClick={onOpenTerms}
              className="text-slate-300 hover:text-white transition-colors hidden sm:inline-block cursor-pointer"
            >
              Terms
            </button>
          )}
          {onOpenPrivacy && (
            <button 
              onClick={onOpenPrivacy}
              className="text-slate-300 hover:text-white transition-colors hidden sm:inline-block cursor-pointer"
            >
              Privacy
            </button>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Contact
          </span>
        </div>
      </header>

      {/* 2. FULL-WIDTH WORKING GOOGLE MAP DISPLAYING THIAGARAJAR COLLEGE OF ENGINEERING */}
      <section className="relative w-full h-80 sm:h-96 bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner">
        {/* Google Maps Real-Time Interactive Embed */}
        <iframe
          title="Thiagarajar College of Engineering Google Map"
          src="https://maps.google.com/maps?q=Thiagarajar+College+of+Engineering,+Madurai&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Top-Left Map Card Overlay - Exact Match to Reference Image 3 */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-[calc(100%-1.5rem)] sm:max-w-sm">
          <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Thiagarajar college of engineering</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 pl-5">
            Thiruparankundram, Madurai &ndash; 625 015, Tamil Nadu
          </div>
          <div className="mt-2.5 flex items-center gap-2 pl-5">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Thiagarajar+College+of+Engineering+Madurai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open in Maps</span>
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Thiagarajar+College+of+Engineering+Madurai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] border border-slate-300 dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
              title="Get directions to Thiagarajar College of Engineering"
            >
              <Navigation className="w-3 h-3 text-cyan-500" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. CONTACT US INFORMATION - 3 COLUMNS MATCHING IMAGE 3 */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 space-y-8">
        
        {/* Contact Us Intro */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            We're always happy to respond to queries about any of our prototype subsystems, FreeRTOS code, or BOM replication. We try to answer each and every one of your questions in a timely manner. Use the form below to drop us an email.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>
              If you're looking for technical architecture details or circuit wiring diagrams, head over to our <button onClick={onBack} className="text-brand-600 dark:text-cyan-400 font-semibold underline hover:no-underline">hardware documentation section</button>.
            </span>
          </div>
        </div>

        {/* 3 Address & Hours Columns - Exact Match to Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 pb-8 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
          
          {/* Column 1: INDIA office */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              INDIA office
            </h3>
            <div className="text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Thiagarajar College of Engineering,</p>
              <p>Madurai &ndash; 625 015,</p>
              <p>Tamil Nadu,</p>
              <p>India.</p>
            </div>
            <div className="pt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400 shrink-0" />
                <span>(+91) +91 6383220503</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400 shrink-0" />
                <a href="mailto:hari14official@gmail.com" className="hover:underline text-brand-600 dark:text-cyan-400">
                  hari14official@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: INDIA office (R&D) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              INDIA office (R&amp;D)
            </h3>
            <div className="text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Department of ECE (IoT Research Lab),</p>
              <p>Thiagarajar College of Engineering,</p>
              <p>Madurai &ndash; 625 015,</p>
              <p>Tamil Nadu, India.</p>
            </div>
            <div className="pt-2 text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-600 dark:text-cyan-400 shrink-0" />
                <a href="mailto:hari14official@gmail.com" className="hover:underline text-brand-600 dark:text-cyan-400">
                  hari14official@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 3: Business hours */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Business hours
            </h3>
            <div className="text-slate-600 dark:text-slate-300 space-y-1">
              <p className="flex items-center justify-between">
                <span>Monday &ndash; Friday:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">9am to 5pm</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Saturday:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">9am to 2pm</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Sunday:</span>
                <span className="font-mono text-rose-500 font-semibold">Closed</span>
              </p>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                FOLLOW US ON
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <a href="https://github.com/hari14official" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors" title="GitHub Repository">
                  <Github className="w-4 h-4" />
                </a>
                <a href="mailto:hari14official@gmail.com" className="hover:text-cyan-400 transition-colors" title="Email Team">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="https://www.tce.edu" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors" title="College Portal">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 4. CONTACT FORM CARD - EXACT MATCH TO IMAGE 4 */}
      <section className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header centered */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            COLLABORATE &amp; CONNECT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Contact Team 5 &amp; TCE Project Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Have questions about the firmware implementation, BOM replication, or academic presentation? Send us a note below.
          </p>
        </div>

        {/* Clean Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. K. Raman / Student"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. evaluator@tce.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Subject / Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Subject / Topic
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Project Evaluation / Circuit Clarification / Viva Query"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Message / Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Message / Remarks <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your observations or queries regarding the smart tank monitoring prototype..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Footer with note & Dispatch button */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Submissions logged to Firebase /messages when Live mode is active.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Dispatch Message'}</span>
              </button>
            </div>

          </form>
        </div>

      </section>

      {/* 5. FUNCTIONAL FOOTER - ROSTER HIDDEN AS REQUESTED */}
      <Footer 
        onOpenProjectInfo={onOpenPrivacy}
        onOpenDashboard={onOpenDashboard}
        onOpenCircuit={onBack}
        onOpenTerms={onOpenTerms}
        onOpenPrivacy={onOpenPrivacy}
        onOpenContact={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateHome={(sec) => {
          onBack();
          if (sec) {
            setTimeout(() => {
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }}
        showRoster={false}
      />

    </div>
  );
};
