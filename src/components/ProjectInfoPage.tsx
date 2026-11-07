import React from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  Users, 
  ShieldCheck, 
  Cpu, 
  Droplets, 
  CheckCircle2, 
  Home, 
  Calendar
} from 'lucide-react';

interface ProjectInfoPageProps {
  onBack: () => void;
}

export const ProjectInfoPage: React.FC<ProjectInfoPageProps> = ({ onBack }) => {
  const teamMembers = [
    { 
      name: "Kiruthik Sabari S", 
      role: "Team Leader", 
      roll: "Team 5 Lead",
      focus: "Firmware Architecture & RTOS",
      detail: "Engineered the core ESP-WROOM-32 FreeRTOS non-blocking task scheduler, 64-sample median ADC1 filtering for optical turbidity, and dual-probe debounce state machines." 
    },
    { 
      name: "Srivardhini", 
      role: "System Designer", 
      roll: "Mechanical & UI/UX",
      focus: "Enclosure Ergonomics & Fluid Dynamics",
      detail: "Designed the 3D transparent water reservoir visualizer, physical manifold pipe layout with 1/2\" threaded connections, and front-panel LED indicators." 
    },
    { 
      name: "Aswatha Priya B", 
      role: "Web Master", 
      roll: "Full-Stack IoT Cloud",
      focus: "Firebase RTDB & Telemetry Historian",
      detail: "Developed the real-time responsive web dashboard, bi-directional Firebase RTDB synchronization, interactive telemetry historian charts, and automated audit logging." 
    },
    { 
      name: "Palanisamy K", 
      role: "Recorder", 
      roll: "Technical Documentation",
      focus: "BOM Costing & Experimental Verification",
      detail: "Maintained engineering records, physical testing logs, component datasheets, and cost optimization ensuring total BOM stays under ₹1,500 – ₹2,000." 
    },
    { 
      name: "Harikumar M", 
      role: "Devil's Advocate", 
      roll: "Quality & Safety Interlocks",
      focus: "Failure-Mode Analysis & Edge Cases",
      detail: "Conducted rigorous edge-case fault injection: simulated sensor open-circuits, municipal riser dry-run stalls, supply voltage spikes, and failsafe spring verification." 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-x-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Institutional</span>
            <span className="text-xs text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs font-bold text-cyan-400">Thiagarajar College of Engineering &bull; Department Project 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-950 text-brand-300 border border-brand-800">
            TEAM 5 OFFICIAL REPOSITORY
          </span>
        </div>
      </header>

      {/* Main Full-Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Institutional Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>Department of Electronics and Communication Engineering</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Thiagarajar College of Engineering
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Madurai &ndash; 625 015, Tamil Nadu, India. Autonomous Institution Affiliated to Anna University. Approved by AICTE, Accredited by NAAC with &lsquo;A+&rsquo; Grade.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Academic Year: 2025&ndash;2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Capstone Prototype Evaluation
                </span>
              </div>
            </div>

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-center p-2">
                <Droplets className="w-8 h-8 text-cyan-400 mb-1" />
                <span className="text-[10px] font-bold text-white tracking-wider">AQUAGUARD</span>
                <span className="text-[8px] font-mono text-cyan-300">TEAM 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview & Engineering Scope */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Project Motivation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In urban and suburban Indian households, municipal piped supply frequently surges with muddy runoff, iron rust, and sewage leakage. AquaGuard provides automated optical screening and fail-safe physical isolation before contaminated water ruins overhead storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Engineering Principles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solid-state conductive immersion probes (HW-038) powered by 5ms anti-galvanic pulsed energization eliminate float valve jamming. Closed-loop 940nm nephelometry drives a normally-closed 12V solenoid valve with &lt; 200ms emergency shutoff.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Lab Budget Viability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered with accessible, high-reliability commercial electronics for domestic viability. Total physical prototype bill of materials costs strictly between <strong className="text-white">₹1,500 – ₹2,000</strong> without requiring proprietary industrial PLCs.
            </p>
          </div>
        </div>

        {/* Academic Faculty Mentors & Guides */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Project Mentorship &amp; Academic Guides</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="text-lg font-black text-white">Dr. Gracia Nirmala Rani, B.E (ECE), M.E (VLSI DESIGN), PH.D</div>
              <div className="text-xs font-semibold text-brand-400">Project Faculty Guide &bull; Associate Professor</div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Department of Electronics and Communication Engineering, Thiagarajar College of Engineering, Madurai. Guidance on hardware architecture, signal conditioning, and fail-safe automation interlocks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="text-lg font-black text-white">Dr. Ananthi, M.E., Ph.D.,</div>
              <div className="text-xs font-semibold text-brand-400">Project Faculty Guide &bull; Assistant Professor</div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Department of Electronics and Communication Engineering, Thiagarajar College of Engineering, Madurai. Guidance on firmware optimization, FreeRTOS task scheduling, and real-time IoT cloud integration.
              </p>
            </div>
          </div>
        </div>

        {/* Project Team 5 Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white">Engineering Project Team 5</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">5 Student Engineers &bull; TCE ECE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-brand-950 text-brand-400 border border-brand-800">
                    {m.roll}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{m.role}</span>
                </div>
                <h4 className="text-base font-black text-white">{m.name}</h4>
                <div className="text-xs font-semibold text-cyan-400">{m.focus}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright, Rights & Institutional Disclaimer */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
          <h4 className="font-bold text-slate-200 text-sm">Intellectual Property &amp; Academic Notice</h4>
          <p className="leading-relaxed">
            &copy; 2026 AquaGuard (Team 5). Built for Thiagarajar College of Engineering, Madurai. All rights reserved. This prototype, firmware source code, circuit schematics, and analytical models were designed for educational and research evaluation under the Department of Electronics and Communication Engineering.
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Live System</span>
          </button>

          <button
            onClick={onBack}
            className="font-bold text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Landing Overview</span>
          </button>
        </div>

      </main>

    </div>
  );
};
