import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, User } from 'lucide-react';
import { tankService } from '../services/tankService';

interface ContactSectionProps {
  onShowToast: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onShowToast("Please enter your name.", "warning");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onShowToast("Please enter a valid email address.", "warning");
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      onShowToast("Please enter a detailed message (at least 5 characters).", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullMsg = subject ? `[${subject}] ${message}` : message;
      await tankService.submitContactMessage(name, email, fullMsg);
      setSubmitted(true);
      onShowToast("Thank you! Your inquiry was recorded successfully.", "success");
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      onShowToast("Failed to dispatch message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-navy-900/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Collaborate &amp; Connect
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
            Contact Team 5 &amp; TCE Project Guides
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
            Have questions about the firmware implementation, BOM replication, or academic presentation? Send us a note below.
          </p>
        </div>

        {/* Contact Form Container */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-navy-800 shadow-soft">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Message Dispatched to Team 5
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Your message has been stored in the project database. Our web master and team leader will respond to your registered email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. K. Raman / Student"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="e.g. evaluator@tce.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Evaluation / Circuit Clarification / Viva Query"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message / Remarks *
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Enter your observations or queries regarding the smart tank monitoring prototype..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Submissions logged to Firebase <code>/messages</code> when Live mode is active.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-cyan-500 hover:brightness-105 shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
