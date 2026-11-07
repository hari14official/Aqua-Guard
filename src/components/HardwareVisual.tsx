import React from 'react';

interface HardwareVisualProps {
  id: string;
  className?: string;
}

export const HardwareVisual: React.FC<HardwareVisualProps> = ({ id, className = "w-full h-full" }) => {
  switch (id) {
    case 'esp32':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_pcb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a"/>
              <stop offset="100%" stopColor="#1e293b"/>
            </linearGradient>
            <linearGradient id="vis_shield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9"/>
              <stop offset="50%" stopColor="#94a3b8"/>
              <stop offset="100%" stopColor="#64748b"/>
            </linearGradient>
            <linearGradient id="vis_gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b"/>
              <stop offset="100%" stopColor="#fbbf24"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          {/* PCB */}
          <rect x="70" y="20" width="180" height="180" rx="8" fill="url(#vis_pcb)" stroke="#38bdf8" strokeWidth="1.5"/>
          {/* Mounting holes */}
          <circle cx="82" cy="32" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
          <circle cx="238" cy="32" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
          <circle cx="82" cy="188" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
          <circle cx="238" cy="188" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
          {/* Antenna */}
          <path d="M 95 32 L 105 32 L 105 24 L 115 24 L 115 32 L 125 32 L 125 24 L 135 24 L 135 32 L 145 32 L 145 24 L 155 24 L 155 32 L 165 32" fill="none" stroke="url(#vis_gold)" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Metal RF Shield */}
          <rect x="100" y="44" width="120" height="75" rx="4" fill="url(#vis_shield)" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="160" y="72" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle" letterSpacing="1">ESPRESSIF</text>
          <text x="160" y="90" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#1e293b" textAnchor="middle">ESP-WROOM-32</text>
          <text x="160" y="104" fontFamily="monospace" fontSize="8" fill="#334155" textAnchor="middle">240MHz Wi-Fi+BLE</text>
          {/* CP2102 & MicroUSB */}
          <rect x="142" y="130" width="36" height="24" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1"/>
          <text x="160" y="146" fontFamily="monospace" fontSize="7" fill="#38bdf8" textAnchor="middle">CP2102</text>
          <rect x="138" y="186" width="44" height="20" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5"/>
          {/* Pin rows Left & Right */}
          <g fill="#fbbf24">
            {[40, 52, 64, 76, 88, 100, 112, 124, 136, 148, 160, 172].map((y, i) => (
              <React.Fragment key={i}>
                <rect x="58" y={y} width="12" height="5" rx="1"/>
                <rect x="250" y={y} width="12" height="5" rx="1"/>
              </React.Fragment>
            ))}
          </g>
          <text x="160" y="212" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">ESP32 DevKit V1 30-Pin MCU</text>
        </svg>
      );

    case 'hw038':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_prbPcb" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a"/>
              <stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
            <linearGradient id="vis_prbGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24"/>
              <stop offset="50%" stopColor="#d97706"/>
              <stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          {/* Probe 1 */}
          <g transform="translate(75, 15)">
            <rect x="0" y="0" width="65" height="175" rx="5" fill="url(#vis_prbPcb)" stroke="#38bdf8" strokeWidth="1.5"/>
            <circle cx="32.5" cy="15" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
            <rect x="18" y="26" width="29" height="12" rx="2" fill="#1e293b" stroke="#64748b"/>
            <text x="32.5" y="50" fontFamily="monospace" fontSize="7" fill="#93c5fd" textAnchor="middle">GPIO34 (20%)</text>
            <g fill="url(#vis_prbGold)">
              <rect x="10" y="60" width="3.5" height="100" rx="1"/>
              <rect x="18" y="70" width="3.5" height="90" rx="1"/>
              <rect x="26" y="60" width="3.5" height="100" rx="1"/>
              <rect x="34" y="70" width="3.5" height="90" rx="1"/>
              <rect x="42" y="60" width="3.5" height="100" rx="1"/>
              <rect x="50" y="70" width="3.5" height="90" rx="1"/>
            </g>
          </g>
          {/* Probe 2 */}
          <g transform="translate(180, 15)">
            <rect x="0" y="0" width="65" height="175" rx="5" fill="url(#vis_prbPcb)" stroke="#06b6d4" strokeWidth="1.5"/>
            <circle cx="32.5" cy="15" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
            <rect x="18" y="26" width="29" height="12" rx="2" fill="#1e293b" stroke="#64748b"/>
            <text x="32.5" y="50" fontFamily="monospace" fontSize="7" fill="#67e8f9" textAnchor="middle">GPIO35 (90%)</text>
            <g fill="url(#vis_prbGold)">
              <rect x="10" y="60" width="3.5" height="100" rx="1"/>
              <rect x="18" y="70" width="3.5" height="90" rx="1"/>
              <rect x="26" y="60" width="3.5" height="100" rx="1"/>
              <rect x="34" y="70" width="3.5" height="90" rx="1"/>
              <rect x="42" y="60" width="3.5" height="100" rx="1"/>
              <rect x="50" y="70" width="3.5" height="90" rx="1"/>
            </g>
          </g>
          <text x="160" y="208" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">HW-038 Dual Immersion Level Probes</text>
        </svg>
      );

    case 'turbidity':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_turbHead" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b"/>
              <stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          {/* U-slot Probe */}
          <g transform="translate(45, 30)">
            <rect x="15" y="10" width="55" height="40" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
            <path d="M 20 50 L 20 120 C 20 135, 30 145, 42.5 145 C 55 145, 65 135, 65 120 L 65 50 Z" fill="url(#vis_turbHead)" stroke="#38bdf8" strokeWidth="1.5"/>
            <path d="M 35 80 L 35 125 C 35 130, 50 130, 50 125 L 50 80 Z" fill="#090d16" stroke="#475569"/>
            <circle cx="31" cy="105" r="3.5" fill="#ef4444"/>
            <circle cx="54" cy="105" r="3.5" fill="#38bdf8"/>
            <line x1="34" y1="105" x2="51" y2="105" stroke="#fbbf24" strokeWidth="2" strokeDasharray="2 2"/>
            <text x="42.5" y="70" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#38bdf8" textAnchor="middle">TS-300B</text>
          </g>
          {/* Conditioning Board */}
          <g transform="translate(160, 30)">
            <rect x="0" y="0" width="115" height="135" rx="6" fill="#047857" stroke="#10b981" strokeWidth="1.5"/>
            <rect x="35" y="35" width="45" height="25" rx="2" fill="#0f172a" stroke="#334155"/>
            <text x="57.5" y="51" fontFamily="monospace" fontSize="8" fill="#6ee7b7" textAnchor="middle">LM393</text>
            <rect x="35" y="70" width="45" height="26" rx="2" fill="#2563eb"/>
            <circle cx="57.5" cy="83" r="7" fill="#cbd5e1"/>
            <text x="57.5" y="115" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#ecfdf5" textAnchor="middle">ANALOG OUT (AO)</text>
          </g>
          <text x="160" y="205" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">TS-300B Optical Turbidity Sensor</text>
        </svg>
      );

    case 'ir-sensor':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_ir" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a"/>
              <stop offset="100%" stopColor="#0f172a"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(70, 40)">
            <rect x="25" y="15" width="150" height="120" rx="6" fill="url(#vis_ir)" stroke="#2563eb" strokeWidth="1.5"/>
            <circle cx="38" cy="28" r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1"/>
            {/* IR Emitter & Receiver */}
            <path d="M 12 50 C 12 42, -5 42, -5 50 C -5 58, 12 58, 12 50 Z" fill="#93c5fd" stroke="#38bdf8" strokeWidth="1"/>
            <path d="M 12 85 C 12 77, -5 77, -5 85 C -5 93, 12 93, 12 85 Z" fill="#0f172a" stroke="#475569" strokeWidth="1"/>
            {/* IC */}
            <rect x="75" y="35" width="40" height="25" rx="2" fill="#0f172a" stroke="#334155"/>
            <text x="95" y="51" fontFamily="monospace" fontSize="8" fill="#60a5fa" textAnchor="middle">LM393</text>
            {/* Potentiometer */}
            <rect x="75" y="75" width="40" height="30" rx="2" fill="#2563eb"/>
            <circle cx="95" cy="90" r="7" fill="#cbd5e1"/>
            {/* Header pins */}
            <rect x="160" y="50" width="14" height="50" rx="2" fill="#1e293b" stroke="#64748b"/>
          </g>
          <text x="160" y="200" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">LM393 IR Inlet Obstacle & Debris Sensor</text>
        </svg>
      );

    case 'relay':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_relayCube" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb"/>
              <stop offset="100%" stopColor="#1e3a8a"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(50, 30)">
            <rect x="0" y="0" width="220" height="145" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5"/>
            {/* Relay 1 */}
            <rect x="30" y="25" width="70" height="85" rx="4" fill="url(#vis_relayCube)" stroke="#60a5fa" strokeWidth="1.5"/>
            <text x="65" y="48" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">SONGLE</text>
            <text x="65" y="62" fontFamily="monospace" fontSize="7" fill="#bfdbfe" textAnchor="middle">5VDC RELAY</text>
            <text x="65" y="95" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#38bdf8" textAnchor="middle">CH1 PUMP</text>
            {/* Relay 2 */}
            <rect x="120" y="25" width="70" height="85" rx="4" fill="url(#vis_relayCube)" stroke="#60a5fa" strokeWidth="1.5"/>
            <text x="155" y="48" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">SONGLE</text>
            <text x="155" y="62" fontFamily="monospace" fontSize="7" fill="#bfdbfe" textAnchor="middle">5VDC RELAY</text>
            <text x="155" y="95" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#38bdf8" textAnchor="middle">CH2 VALVE</text>
            {/* Terminal Blocks Top */}
            <rect x="30" y="-8" width="70" height="22" rx="2" fill="#15803d"/>
            <rect x="120" y="-8" width="70" height="22" rx="2" fill="#15803d"/>
          </g>
          <text x="160" y="205" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">5V Dual-Channel Optocoupler Relay Module</text>
        </svg>
      );

    case 'solenoid':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b"/>
              <stop offset="40%" stopColor="#d97706"/>
              <stop offset="100%" stopColor="#78350f"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(70, 30)">
            {/* Coil Top */}
            <rect x="55" y="10" width="70" height="65" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
            <text x="90" y="35" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#38bdf8" textAnchor="middle">12V DC</text>
            <text x="90" y="50" fontFamily="monospace" fontSize="7" fill="#94a3b8" textAnchor="middle">NORMALLY CLOSED</text>
            <rect x="80" y="75" width="20" height="18" fill="#475569"/>
            {/* Brass Valve Body */}
            <path d="M 20 93 L 160 93 L 160 145 L 125 145 L 125 155 L 55 155 L 55 145 L 20 145 Z" fill="url(#vis_brass)" stroke="#b45309" strokeWidth="1.5"/>
            {/* Threaded Ports */}
            <rect x="5" y="102" width="18" height="34" rx="2" fill="url(#vis_brass)" stroke="#78350f"/>
            <rect x="157" y="102" width="18" height="34" rx="2" fill="url(#vis_brass)" stroke="#78350f"/>
            <text x="90" y="125" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">INLET FLOW &rarr;</text>
          </g>
          <text x="160" y="205" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">12V NC Solenoid Valve (Fail-Safe Sealed)</text>
        </svg>
      );

    case 'pump':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_pumpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b"/>
              <stop offset="100%" stopColor="#020617"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(80, 35)">
            {/* Pump Body */}
            <rect x="25" y="40" width="115" height="100" rx="10" fill="url(#vis_pumpGrad)" stroke="#38bdf8" strokeWidth="1.5"/>
            <circle cx="82.5" cy="90" r="30" fill="#0f172a" stroke="#475569"/>
            <circle cx="82.5" cy="90" r="12" fill="#0284c7"/>
            {/* Outlet Nozzle */}
            <rect x="70" y="12" width="24" height="30" rx="2" fill="#0284c7" stroke="#38bdf8"/>
            <rect x="68" y="18" width="28" height="4" rx="1" fill="#7dd3fc"/>
            <text x="82.5" y="60" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#38bdf8" textAnchor="middle">JT-160A 12V</text>
            <text x="82.5" y="130" fontFamily="monospace" fontSize="7" fill="#94a3b8" textAnchor="middle">240 L/H • IP68</text>
          </g>
          <text x="160" y="205" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">12V Mini DC Submersible Water Pump</text>
        </svg>
      );

    case 'buzzer':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="vis_buzzRad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#334155"/>
              <stop offset="100%" stopColor="#020617"/>
            </radialGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(110, 35)">
            <circle cx="50" cy="60" r="50" fill="url(#vis_buzzRad)" stroke="#475569" strokeWidth="2"/>
            <circle cx="50" cy="60" r="14" fill="#020617" stroke="#1e293b"/>
            <circle cx="50" cy="60" r="6" fill="#000000"/>
            <text x="25" y="40" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#ef4444">+</text>
            <text x="50" y="95" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#94a3b8" textAnchor="middle">5V ACTIVE PIEZO</text>
            <path d="M 95 35 C 110 45, 110 75, 95 85" fill="none" stroke="#ef4444" strokeWidth="2"/>
            <path d="M 105 25 C 125 40, 125 80, 105 95" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          </g>
          <text x="160" y="200" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">5V Active Piezo Buzzer (85dB Sounder)</text>
        </svg>
      );

    case 'leds':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="vis_grnGlow" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#86efac"/>
              <stop offset="50%" stopColor="#22c55e"/>
              <stop offset="100%" stopColor="#14532d"/>
            </radialGradient>
            <radialGradient id="vis_redGlow" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fca5a5"/>
              <stop offset="50%" stopColor="#ef4444"/>
              <stop offset="100%" stopColor="#7f1d1d"/>
            </radialGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(80, 30)">
            {/* Green LED */}
            <g transform="translate(25, 0)">
              <circle cx="25" cy="50" r="35" fill="#22c55e" opacity="0.15"/>
              <path d="M 10 50 C 10 25, 40 25, 40 50 Z" fill="url(#vis_grnGlow)"/>
              <rect x="10" y="50" width="30" height="24" fill="url(#vis_grnGlow)"/>
              <rect x="8" y="74" width="34" height="5" rx="1" fill="#15803d"/>
              <rect x="18" y="79" width="3" height="45" fill="#cbd5e1"/>
              <rect x="30" y="79" width="3" height="35" fill="#cbd5e1"/>
              <text x="25" y="140" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#4ade80" textAnchor="middle">GREEN (GPIO18)</text>
            </g>
            {/* Red LED */}
            <g transform="translate(100, 0)">
              <circle cx="25" cy="50" r="35" fill="#ef4444" opacity="0.15"/>
              <path d="M 10 50 C 10 25, 40 25, 40 50 Z" fill="url(#vis_redGlow)"/>
              <rect x="10" y="50" width="30" height="24" fill="url(#vis_redGlow)"/>
              <rect x="8" y="74" width="34" height="5" rx="1" fill="#b91c1c"/>
              <rect x="18" y="79" width="3" height="45" fill="#cbd5e1"/>
              <rect x="30" y="79" width="3" height="35" fill="#cbd5e1"/>
              <text x="25" y="140" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#f87171" textAnchor="middle">RED (GPIO19)</text>
            </g>
          </g>
          <text x="160" y="200" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">5mm Diffused Visual Status LEDs</text>
        </svg>
      );

    case 'resistor':
      return (
        <svg viewBox="0 0 320 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vis_resBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd"/>
              <stop offset="50%" stopColor="#60a5fa"/>
              <stop offset="100%" stopColor="#2563eb"/>
            </linearGradient>
          </defs>
          <rect width="320" height="220" rx="14" fill="#090d16"/>
          <g transform="translate(50, 35)">
            {/* R1: 10k */}
            <g transform="translate(0, 10)">
              <line x1="10" y1="25" x2="210" y2="25" stroke="#cbd5e1" strokeWidth="3"/>
              <rect x="55" y="16" width="110" height="18" rx="4" fill="url(#vis_resBody)" stroke="#1d4ed8"/>
              {/* Bands: Brown Black Black Red Brown */}
              <rect x="75" y="16" width="6" height="18" fill="#78350f"/>
              <rect x="90" y="16" width="6" height="18" fill="#000000"/>
              <rect x="105" y="16" width="6" height="18" fill="#000000"/>
              <rect x="120" y="16" width="6" height="18" fill="#ef4444"/>
              <rect x="145" y="16" width="6" height="18" fill="#78350f"/>
              <text x="110" y="10" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#bfdbfe" textAnchor="middle">R1 = 10 kΩ (1% Metal Film)</text>
            </g>
            {/* R2: 20k */}
            <g transform="translate(0, 65)">
              <line x1="10" y1="25" x2="210" y2="25" stroke="#cbd5e1" strokeWidth="3"/>
              <rect x="55" y="16" width="110" height="18" rx="4" fill="url(#vis_resBody)" stroke="#1d4ed8"/>
              <rect x="75" y="16" width="6" height="18" fill="#ef4444"/>
              <rect x="90" y="16" width="6" height="18" fill="#000000"/>
              <rect x="105" y="16" width="6" height="18" fill="#000000"/>
              <rect x="120" y="16" width="6" height="18" fill="#ef4444"/>
              <rect x="145" y="16" width="6" height="18" fill="#78350f"/>
              <text x="110" y="10" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#bfdbfe" textAnchor="middle">R2 = 20 kΩ (1% Metal Film)</text>
            </g>
            <text x="110" y="125" fontFamily="monospace" fontSize="8" fill="#38bdf8" textAnchor="middle">5V &rarr; 3.3V ESP32 ADC1 Divider</text>
          </g>
          <text x="160" y="200" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">Precision Resistor Voltage Divider Network</text>
        </svg>
      );

    default:
      return null;
  }
};
