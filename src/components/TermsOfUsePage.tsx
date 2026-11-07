import React from 'react';
import { 
  ArrowLeft, 
  Droplets, 
  Mail
} from 'lucide-react';
import { Footer } from './Footer';

interface TermsOfUsePageProps {
  onBack: () => void;
  onOpenDashboard?: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
}

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ 
  onBack, 
  onOpenDashboard,
  onOpenContact,
  onOpenPrivacy
}) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      
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
          {onOpenPrivacy && (
            <button 
              onClick={onOpenPrivacy}
              className="text-slate-300 hover:text-white transition-colors hidden sm:inline-block cursor-pointer"
            >
              Privacy
            </button>
          )}
          {onOpenContact && (
            <button 
              onClick={onOpenContact}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. DARK TITLE BANNER - EXACT MATCH TO IMAGE 1 */}
      <section className="bg-slate-950 text-white py-14 sm:py-16 px-4 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Terms of use
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Last update: October 20, 2026
          </p>
        </div>
      </section>

      {/* 3. CLEAN DOCUMENT CONTENT WRAPPER - EXACT TYPOGRAPHY & SECTIONS AS IN IMAGE 1 & 2 */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-12 lg:p-16 shadow-lg space-y-10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* General Information */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              General Information
            </h2>
            <p>
              We collect the email addresses of those who communicate with us via e-mail, aggregate information on what pages consumers access or visit, and information volunteered by the consumer (such as survey information and/or site registrations). The information we collect is used to improve the content of our Web pages and the quality of our service, and is not shared with or sold to other organizations for commercial purposes, except to provide products or services you've requested, when we have your permission, or under the following circumstances:
            </p>
            <ul className="space-y-2.5 pl-5 list-disc text-slate-600 dark:text-slate-300">
              <li>
                It is necessary to share information in order to investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, domestic water contamination events, violations of Terms of Service, or as otherwise required by law.
              </li>
              <li>
                We transfer information about you if AquaGuard is acquired by or merged with another institution or utility company. In this event, Team 5 and Thiagarajar College of Engineering will notify you before information about you is transferred and becomes subject to a different privacy policy.
              </li>
            </ul>
          </section>

          {/* Information Gathering and Usage */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Information Gathering and Usage
            </h2>
            <ul className="space-y-2.5 pl-5 list-disc text-slate-600 dark:text-slate-300">
              <li>
                When you connect to AquaGuard or request project firmware details we ask for information such as your name, email address, institutional affiliation, and inquiry details. Evaluators and students who test the demonstration simulator or web dashboard are not required to enter a credit card.
              </li>
              <li>
                AquaGuard uses collected information for the following general purposes: products and services provision, telemetry streaming, automated pump and solenoid control interlocks, identification and authentication, services improvement, contact, and academic engineering research at Thiagarajar College of Engineering.
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Cookies
            </h2>
            <ul className="space-y-2.5 pl-5 list-disc text-slate-600 dark:text-slate-300">
              <li>
                A cookie is a small amount of data, which often includes an anonymous unique identifier, that is sent to your browser from a web site's computers and stored on your computer's hard drive.
              </li>
              <li>
                Cookies and local storage tokens are required to use the AquaGuard telemetry service.
              </li>
              <li>
                We use cookies to record current session information, theme states (dark/light mode), and simulation parameters, but do not use permanent tracking cookies. You are required to re-authenticate or re-verify before exercising manual actuator overrides after a certain period of time has elapsed to protect against accidental pump dry-runs or valve manipulation.
              </li>
            </ul>
          </section>

          {/* Data Storage */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Data Storage
            </h2>
            <p>
              AquaGuard uses third party vendors and hosting partners (including Google Firebase Realtime Database and cloud servers) to provide the necessary hardware, software, networking, storage, and related technology required to run AquaGuard. Although Team 5 and Thiagarajar College of Engineering own the code, databases, circuit schematics, and all rights to the AquaGuard application, you retain all rights to your water consumption and telemetry data.
            </p>
          </section>

          {/* Disclosure */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Disclosure
            </h2>
            <p>
              AquaGuard may disclose personally identifiable information under special circumstances, such as to comply with college academic evaluation requirements, health safety subpoenas, or when your actions violate the Terms of Service.
            </p>
          </section>

          {/* Changes */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Changes
            </h2>
            <p>
              AquaGuard may periodically update this policy. We will notify you about significant changes in the way we treat personal information or automated safety interlocks (such as turbidity threshold revisions or fail-safe timeout changes) by placing a prominent notice on our site. Such notice will be given at least 3 days in advance of the date the new policy will be applied.
            </p>
          </section>

          {/* Question */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Question
            </h2>
            <p>
              Any questions about this Privacy Policy and Terms of Use should be addressed to <a href="mailto:aquaguard.tce@gmail.com" className="text-brand-600 dark:text-cyan-400 font-semibold hover:underline">aquaguard.tce@gmail.com</a> or submitted via our Contact page.
            </p>
          </section>

        </div>
      </main>

      {/* 4. FUNCTIONAL FOOTER - ROSTER HIDDEN AS REQUESTED */}
      <Footer 
        onOpenProjectInfo={onOpenPrivacy}
        onOpenDashboard={onOpenDashboard}
        onOpenCircuit={onBack}
        onOpenTerms={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenPrivacy={onOpenPrivacy}
        onOpenContact={onOpenContact}
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
