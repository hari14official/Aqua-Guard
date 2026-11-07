import React from 'react';
import { Droplets, Award, GraduationCap, Users, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenProjectInfo?: () => void;
  onOpenDashboard?: () => void;
  onOpenCircuit?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onNavigateHome?: (sectionId?: string) => void;
  showRoster?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenProjectInfo, 
  onOpenDashboard, 
  onOpenCircuit: _onOpenCircuit,
  onOpenTerms,
  onOpenContact,
  onOpenPrivacy,
  onNavigateHome,
  showRoster = true
}) => {
  const teamMembers = [
    { name: "Kiruthik Sabari S", role: "Team Leader", task: "Firmware architecture, sensor integration, ESP32 RTOS control loop" },
    { name: "Srivardhini", role: "Designer", task: "Physical housing layout, pipe assembly, UI/UX aesthetics & ergonomics" },
    { name: "Aswatha Priya B", role: "Web Master", task: "Full-stack dashboard development, Firebase RTDB sync, state management" },
    { name: "Palanisamy K", role: "Recorder", task: "Documentation, BOM tracking, experimental trials, data logging" },
    { name: "Harikumar M", role: "Devil's Advocate", task: "Stress testing, failure-mode validation, edge cases & safety interlocks" },
  ];

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenContact) {
      onOpenContact();
      return;
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNav = (sectionId: string) => {
    if (onNavigateHome) {
      onNavigateHome(sectionId);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = `#${sectionId}`;
      }
    }
  };

  return (
    <footer id="team" className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 space-y-12">
        
        {/* Top Header of Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand & College info */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  Aqua<span className="text-brand-400">Guard</span>
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  Smart Water Tank Monitoring &amp; Automatic Control System
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An academic IoT engineering project designed, prototyped, and validated by Team 5 at Thiagarajar College of Engineering. Focused on solid-state reliability, contamination prevention, and fail-safe automation.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <GraduationCap className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Thiagarajar College of Engineering, Madurai</span>
            </div>
          </div>

          {/* Academic Project Guides */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
              <Award className="w-4 h-4" />
              <span>Project Mentorship &amp; Academic Guides</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-sm font-bold text-white">
                  Dr. Gracia Nirmala Rani, B.E (ECE), M.E (VLSI DESIGN), PH.D
                </div>
                <div className="text-xs text-brand-300 font-medium mt-0.5">Project Faculty Guide</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Thiagarajar College of Engineering, Madurai
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-sm font-bold text-white">
                  Dr. Ananthi, M.E., Ph.D.,
                </div>
                <div className="text-xs text-brand-300 font-medium mt-0.5">Project Faculty Guide</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Thiagarajar College of Engineering, Madurai
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Team 5 Official Roster Table - SHOWN ONLY ON HOME PAGE AS REQUESTED */}
        {showRoster && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Users className="w-4 h-4 text-brand-400" />
                <span>Project Team 5 Roster</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Academic Year 2025–2026
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-800/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/60 bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Team Member</th>
                    <th className="py-3 px-4 font-bold text-brand-300">Designated Role</th>
                    <th className="py-3 px-4 font-bold">Core Engineering Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                  {teamMembers.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                        <span>{member.name}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-300">
                        {member.role}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">
                        {member.task}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Credits & Navigation Links - ALIGNED CLEANLY */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* LEFT SIDE: Clickable Copyright that opens Privacy Notice */}
          <div className="text-left max-w-xl">
            <button
              onClick={onOpenPrivacy || onOpenProjectInfo}
              className="group text-left text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Click to view full Privacy Notice"
            >
              <span>&copy; 2026 AquaGuard (Team 5). Built for Thiagarajar College of Engineering. All rights reserved.</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </button>
          </div>

          {/* RIGHT SIDE: Navigation Links (TRIZ removed, Terms and Conditions added, Contact functional) */}
          <div className="flex flex-wrap items-center gap-5 shrink-0 font-semibold text-xs">
            <button 
              onClick={() => handleNav('product')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Product
            </button>
            <button 
              onClick={onOpenDashboard}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Live Dashboard
            </button>
            <button 
              onClick={() => handleNav('flowchart')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button 
              onClick={() => handleNav('hardware')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hardware
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms and Conditions
            </button>
            {/* Functional Contact Option */}
            <button 
              onClick={handleContactClick} 
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
