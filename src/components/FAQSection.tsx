import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Why does AquaGuard use solid-state water sensors instead of traditional mechanical float switches?",
      a: "Traditional float switches rely on pivoting plastic arms, hollow plastic buoyancy balls, and internal reed contacts. Over time, municipal hard water deposits calcium carbonate and silt inside the pivot hinges, causing them to jam either permanently ON (overflowing the tank) or OFF (leaving the home dry). Solid-state conductive probes have 0 moving parts, will never physically bind, and can be easily wiped clean during annual maintenance."
    },
    {
      q: "How does the system prevent probe corrosion if metal electrodes are submerged in water?",
      a: "Applying continuous DC electrical voltage to metal traces submerged in electrolytic tap water rapidly dissolves the copper traces through galvanic electrolysis. AquaGuard solves this using TRIZ Principle #19 (Periodic Action): the ESP32 powers the probe pins only for 50 milliseconds right before reading an analog sample, and immediately grounds/tri-states the pin afterwards. This reduces the duty cycle to under 2.5%, extending sensor lifespan from weeks to years."
    },
    {
      q: "What does turbidity mean, and how is the 2.50V threshold calibrated?",
      a: "Turbidity measures the optical cloudiness or haziness of water caused by suspended colloidal particles such as clay, silt, algae, and rust. Our optical sensor shines a 940nm infrared light beam into the water cell and measures light received by an adjacent phototransistor. Clean potable water yields high transmittance (~4.1V to 4.5V output). When suspended solids scatter the beam, voltage drops. Through empirical testing with municipal silt surges, we calibrated 2.50V (approx. 250 NTU) as the hard shutoff tripwire."
    },
    {
      q: "What happens during a power cut or blackout? Will the tank overflow or empty out?",
      a: "The system is engineered with fail-safe principles. The inlet solenoid valve is a 'Normally-Closed' (NC) electromagnetic type. When electrical power is lost, internal spring pressure automatically snaps the valve shut in under 30 milliseconds. Dirty municipal water cannot enter, nor can an unattended municipal surge cause an overflow during blackouts. When power returns, the ESP32 performs an instant sensor self-test before resuming."
    },
    {
      q: "Can the domestic pump run dry if the municipal supply pipe is empty?",
      a: "No. AquaGuard includes a firmware-level dry-run timeout interlock. If the pump is turned ON and the lower sensor does not register rising liquid within 6 minutes, the controller detects an empty municipal riser, kills relay power to the pump, sounds the buzzer, and records a 'Dry-Run Fault' to protect the motor impellers from thermal seizure."
    },
    {
      q: "Does the automatic control cycle keep functioning if the home Wi-Fi drops offline?",
      a: "Yes. All automation logic (sensor reading, turbidity threshold comparisons, pump hysteresis, and solenoid cutoff) runs autonomously on the ESP32's dual-core processor without relying on cloud servers. Firebase is used exclusively for remote telemetry, historical logging, and user overrides. If Wi-Fi is lost, the local system continues operating safely and automatically reconnects when the network recovers."
    },
    {
      q: "What is the total hardware cost to build this prototype?",
      a: "The prototype was engineered specifically for college lab viability and domestic affordability, with a total bill of materials between ₹1,500 and ₹2,000. It utilizes accessible components (ESP32 DevKit, HW-038 probes, optical turbidity module, LM393 IR sensor, 5V optocoupled relays, 12V NC solenoid, and DC mini pump) without expensive proprietary industrial PLCs."
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Frequently Answered Inquiries
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
          Engineering &amp; Technical FAQ
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
          Detailed explanations of sensor physics, fail-safe architecture, and operational resilience.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-50/50 dark:hover:bg-navy-900/40"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isOpen 
                      ? 'bg-brand-500 text-white' 
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-500'
                  }`}>
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {faq.q}
                  </span>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-brand-500" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-navy-800/60 bg-white/40 dark:bg-navy-950/20">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
