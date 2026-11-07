import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface FullCircuitPageProps {
  onBack: () => void;
}

export const FullCircuitPage: React.FC<FullCircuitPageProps> = ({ onBack }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeHighlight, setActiveHighlight] = useState<string>('all');

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.0, prev + 0.2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.6, prev - 0.2));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-x-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Complete Engineering Circuit & Interfacing Schematic</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                FULL SCREEN
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              TCE Team 5 AquaGuard Prototype • ESP32 DevKit V1 30-Pin Wiring Architecture
            </p>
          </div>
        </div>

        {/* Zoom & Highlight Controls */}
        <div className="flex items-center gap-2">
          {/* Section filter */}
          <div className="hidden md:flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
            {['all', 'mcu', 'power', 'sensors', 'actuators'].map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveHighlight(sec)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] transition-colors ${
                  activeHighlight === sec
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1.5 text-cyan-400 font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Canvas Area */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-radial from-slate-900 to-slate-950">
        <div 
          className="transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Complete Engineering Schematic Vector SVG */}
          <svg 
            viewBox="0 0 1200 820" 
            className="w-[1150px] h-[780px] bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#1e293b" />
              </pattern>
              <linearGradient id="bus_12v" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f87171" />
              </linearGradient>
              <linearGradient id="bus_5v" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="bus_3v3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Grid Background */}
            <rect width="1200" height="820" rx="20" fill="url(#grid)" />

            {/* ========================================================= */}
            {/* 1. POWER SUPPLY & REGULATION STAGE (Top Left) */}
            {/* ========================================================= */}
            <g transform="translate(40, 40)" opacity={activeHighlight === 'all' || activeHighlight === 'power' ? 1 : 0.2}>
              <rect x="0" y="0" width="260" height="180" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2"/>
              <text x="130" y="24" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#f59e0b" textAnchor="middle">
                POWER REGULATION SUBSYSTEM
              </text>
              {/* 12V 2A DC In */}
              <rect x="20" y="45" width="90" height="40" rx="4" fill="#1e293b" stroke="#ef4444"/>
              <text x="65" y="65" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#ef4444" textAnchor="middle">12V DC 2A</text>
              <text x="65" y="77" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Wall Adapter</text>
              {/* LM2596 Step Down to 5V */}
              <rect x="150" y="45" width="90" height="40" rx="4" fill="#1e293b" stroke="#f59e0b"/>
              <text x="195" y="65" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#f59e0b" textAnchor="middle">LM2596 BUCK</text>
              <text x="195" y="77" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">5.0V 2A Output</text>
              {/* Star Ground Bus */}
              <rect x="20" y="115" width="220" height="45" rx="4" fill="#020617" stroke="#38bdf8"/>
              <text x="130" y="134" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#38bdf8" textAnchor="middle">STAR COMMON GROUND BUS</text>
              <text x="130" y="148" fontFamily="sans-serif" fontSize="8" fill="#94a3b8" textAnchor="middle">Isolates Inductive Motor Back-EMF from ADC</text>
            </g>

            {/* ========================================================= */}
            {/* 2. CENTRAL MICROCONTROLLER: ESP32 DevKit V1 (Center) */}
            {/* ========================================================= */}
            <g transform="translate(420, 60)" opacity={activeHighlight === 'all' || activeHighlight === 'mcu' ? 1 : 0.2}>
              <rect x="0" y="0" width="360" height="660" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5"/>
              {/* Header */}
              <text x="180" y="32" fontFamily="system-ui" fontSize="15" fontWeight="900" fill="#ffffff" textAnchor="middle" letterSpacing="1">
                ESP32 DEVKIT V1 (30-PIN DIP)
              </text>
              <text x="180" y="50" fontFamily="monospace" fontSize="10" fill="#38bdf8" textAnchor="middle">
                240MHz Dual-Core • FreeRTOS Engine • Wi-Fi RTDB
              </text>

              {/* Internal RF Module graphic */}
              <rect x="100" y="70" width="160" height="110" rx="6" fill="#1e293b" stroke="#cbd5e1"/>
              <text x="180" y="125" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#f8fafc" textAnchor="middle">ESP-WROOM-32</text>
              <text x="180" y="145" fontFamily="sans-serif" fontSize="9" fill="#94a3b8" textAnchor="middle">Core 0: Cloud & Wi-Fi | Core 1: Interlocks</text>

              {/* Pin Map Left (Pins 1 to 15) */}
              <g fontFamily="monospace" fontSize="9" fill="#e2e8f0">
                <text x="20" y="220">3V3  [PWR OUT]</text>
                <text x="20" y="250">GND  [COMMON]</text>
                <text x="20" y="280">D15  [SPI CLK]</text>
                <text x="20" y="310">D2   [BOOT / LED]</text>
                <text x="20" y="340">D4   [IO]</text>
                <text x="20" y="370">RX2  [UART]</text>
                <text x="20" y="400">TX2  [UART]</text>
                <text x="20" y="430">D5   [CS]</text>
                <text x="20" y="460">D18  [LED GREEN]</text>
                <text x="20" y="490">D19  [LED RED]</text>
                <text x="20" y="520">D21  [PULSED PROBE]</text>
                <text x="20" y="550">RX0  [LOG]</text>
                <text x="20" y="580">TX0  [LOG]</text>
                <text x="20" y="610">D22  [I2C SCL]</text>
                <text x="20" y="640">D23  [PIEZO BUZZER]</text>
              </g>

              {/* Pin Map Right (Pins 16 to 30) */}
              <g fontFamily="monospace" fontSize="9" fill="#e2e8f0" textAnchor="end">
                <text x="340" y="220">[ADC1_CH4] GPIO32 &bull; TURBIDITY</text>
                <text x="340" y="250">[INPUT ONLY] GPIO34 &bull; LOW PROBE 20%</text>
                <text x="340" y="280">[INPUT ONLY] GPIO35 &bull; FULL PROBE 90%</text>
                <text x="340" y="310">[ADC1_CH3] GPIO39 &bull; VN</text>
                <text x="340" y="340">[ADC1_CH0] GPIO36 &bull; VP</text>
                <text x="340" y="370">[INPUT_PULLUP] GPIO27 &bull; IR INLET</text>
                <text x="340" y="400">[OUT_RELAY1] GPIO26 &bull; PUMP 12V</text>
                <text x="340" y="430">[OUT_RELAY2] GPIO25 &bull; VALVE NC</text>
                <text x="340" y="460">[IO] GPIO33</text>
                <text x="340" y="490">[DAC] GPIO12</text>
                <text x="340" y="520">[DAC] GPIO13</text>
                <text x="340" y="550">[IO] GPIO14</text>
                <text x="340" y="580">[POWER IN] VIN (5.0V BUCK)</text>
                <text x="340" y="610">[COMMON] GND STAR</text>
                <text x="340" y="640">[RESET] EN TACTILE</text>
              </g>
            </g>

            {/* ========================================================= */}
            {/* 3. INPUT SENSORS SUBSYSTEM (Right Column) */}
            {/* ========================================================= */}
            <g transform="translate(860, 40)" opacity={activeHighlight === 'all' || activeHighlight === 'sensors' ? 1 : 0.2}>
              <rect x="0" y="0" width="300" height="420" rx="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="2"/>
              <text x="150" y="24" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#06b6d4" textAnchor="middle">
                ANALOG & DIGITAL SENSING SUITE
              </text>

              {/* Sensor 1: TS-300B & Resistor Divider */}
              <g transform="translate(15, 40)">
                <rect x="0" y="0" width="270" height="110" rx="8" fill="#1e293b" stroke="#38bdf8"/>
                <text x="135" y="20" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                  TS-300B Optical Turbidity & Divider
                </text>
                <text x="135" y="36" fontFamily="monospace" fontSize="8" fill="#93c5fd" textAnchor="middle">
                  0-5V Out &rarr; 10k:20k Divider &rarr; 0-3.3V
                </text>
                <rect x="15" y="45" width="240" height="24" rx="4" fill="#0f172a"/>
                <text x="135" y="61" fontFamily="monospace" fontSize="8" fill="#38bdf8" textAnchor="middle">
                  V_OUT = 5V × (20k / 30k) = 3.3V Max to GPIO32
                </text>
                <text x="135" y="95" fontFamily="sans-serif" fontSize="8" fill="#4ade80" textAnchor="middle">
                  Interlock: Turbidity &lt; 2.5V triggers instant solenoid shutoff
                </text>
              </g>

              {/* Sensor 2: Dual Immersion Probes HW-038 */}
              <g transform="translate(15, 165)">
                <rect x="0" y="0" width="270" height="120" rx="8" fill="#1e293b" stroke="#f59e0b"/>
                <text x="135" y="20" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                  HW-038 Dual Water Level Probes
                </text>
                <text x="135" y="36" fontFamily="monospace" fontSize="8" fill="#fbbf24" textAnchor="middle">
                  Pulsed 5ms Energization via GPIO21
                </text>
                <rect x="15" y="46" width="115" height="58" rx="4" fill="#0f172a" stroke="#10b981"/>
                <text x="72" y="66" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#10b981" textAnchor="middle">LOW PROBE (20%)</text>
                <text x="72" y="80" fontFamily="monospace" fontSize="7" fill="#cbd5e1" textAnchor="middle">&rarr; GPIO34</text>
                <text x="72" y="94" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Start Pump Refill</text>

                <rect x="140" y="46" width="115" height="58" rx="4" fill="#0f172a" stroke="#0ea5e9"/>
                <text x="197" y="66" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">FULL PROBE (90%)</text>
                <text x="197" y="80" fontFamily="monospace" fontSize="7" fill="#cbd5e1" textAnchor="middle">&rarr; GPIO35</text>
                <text x="197" y="94" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Cut Pump Power</text>
              </g>

              {/* Sensor 3: LM393 IR Obstacle Sensor */}
              <g transform="translate(15, 300)">
                <rect x="0" y="0" width="270" height="100" rx="8" fill="#1e293b" stroke="#ec4899"/>
                <text x="135" y="20" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                  LM393 Inlet IR Obstacle & Debris Sensor
                </text>
                <text x="135" y="38" fontFamily="monospace" fontSize="8" fill="#f472b6" textAnchor="middle">
                  Digital Out &rarr; GPIO27 (INPUT_PULLUP)
                </text>
                <text x="135" y="65" fontFamily="sans-serif" fontSize="8" fill="#cbd5e1" textAnchor="middle">
                  Monitors physical mesh blockage from dead leaves & pipe rust
                </text>
                <text x="135" y="85" fontFamily="monospace" fontSize="8" fill="#38bdf8" textAnchor="middle">
                  LOW = Debris Detected | HIGH = Clear Beam
                </text>
              </g>
            </g>

            {/* ========================================================= */}
            {/* 4. ACTUATION & DRIVER STAGE (Bottom Left & Right) */}
            {/* ========================================================= */}
            <g transform="translate(40, 240)" opacity={activeHighlight === 'all' || activeHighlight === 'actuators' ? 1 : 0.2}>
              <rect x="0" y="0" width="340" height="480" rx="14" fill="#0f172a" stroke="#10b981" strokeWidth="2"/>
              <text x="170" y="26" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle">
                ISOLATED ACTUATOR DRIVER STAGE
              </text>

              {/* 5V Dual Relay Module */}
              <g transform="translate(15, 45)">
                <rect x="0" y="0" width="310" height="230" rx="8" fill="#1e293b" stroke="#3b82f6"/>
                <text x="155" y="22" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                  5V Dual Relay Board with EL817 Optocouplers
                </text>
                <text x="155" y="38" fontFamily="monospace" fontSize="8" fill="#93c5fd" textAnchor="middle">
                  2500V Galvanic Isolation • Active LOW Drive
                </text>

                {/* Relay CH1 */}
                <rect x="15" y="50" width="135" height="160" rx="6" fill="#0f172a" stroke="#2563eb"/>
                <text x="82.5" y="72" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">CH1 (GPIO26)</text>
                <text x="82.5" y="88" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">12V SUBMERSIBLE PUMP</text>
                <rect x="25" y="100" width="115" height="40" rx="4" fill="#1e293b"/>
                <text x="82.5" y="118" fontFamily="monospace" fontSize="8" fill="#4ade80" textAnchor="middle">JT-160A 240 L/H</text>
                <text x="82.5" y="132" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Refills tank 20% &rarr; 90%</text>
                <text x="82.5" y="180" fontFamily="sans-serif" fontSize="7" fill="#cbd5e1" textAnchor="middle">1N4007 Snubber Diode</text>

                {/* Relay CH2 */}
                <rect x="160" y="50" width="135" height="160" rx="6" fill="#0f172a" stroke="#2563eb"/>
                <text x="227.5" y="72" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#38bdf8" textAnchor="middle">CH2 (GPIO25)</text>
                <text x="227.5" y="88" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">12V NC SOLENOID</text>
                <rect x="170" y="100" width="115" height="40" rx="4" fill="#1e293b"/>
                <text x="227.5" y="118" fontFamily="monospace" fontSize="8" fill="#f43f5e" textAnchor="middle">FAIL-SAFE SHUTOFF</text>
                <text x="227.5" y="132" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Normally Closed Default</text>
                <text x="227.5" y="180" fontFamily="sans-serif" fontSize="7" fill="#cbd5e1" textAnchor="middle">&lt; 200ms Spring Close</text>
              </g>

              {/* Local Notification Hardware (Buzzer & LEDs) */}
              <g transform="translate(15, 290)">
                <rect x="0" y="0" width="310" height="170" rx="8" fill="#1e293b" stroke="#f59e0b"/>
                <text x="155" y="22" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                  Local Enclosure Human-Machine Interface
                </text>
                
                {/* 5V Buzzer */}
                <rect x="15" y="38" width="135" height="115" rx="6" fill="#0f172a" stroke="#ef4444"/>
                <text x="82.5" y="58" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#f87171" textAnchor="middle">PIEZO BUZZER (GPIO23)</text>
                <text x="82.5" y="74" fontFamily="sans-serif" fontSize="8" fill="#cbd5e1" textAnchor="middle">85 dB Audible Sounder</text>
                <text x="82.5" y="105" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Pulsed 2.3kHz Warning</text>
                <text x="82.5" y="125" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">Driven via 2N2222 NPN</text>

                {/* Status LEDs */}
                <rect x="160" y="38" width="135" height="115" rx="6" fill="#0f172a" stroke="#10b981"/>
                <text x="227.5" y="58" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#4ade80" textAnchor="middle">STATUS LEDS</text>
                <text x="227.5" y="76" fontFamily="sans-serif" fontSize="8" fill="#4ade80" textAnchor="middle">GPIO18: Green (Nominal)</text>
                <text x="227.5" y="94" fontFamily="sans-serif" fontSize="8" fill="#f87171" textAnchor="middle">GPIO19: Red (Alert)</text>
                <text x="227.5" y="125" fontFamily="sans-serif" fontSize="7" fill="#94a3b8" textAnchor="middle">220Ω Current Limiters</text>
              </g>
            </g>

            {/* Bottom Engineering Certification Footer */}
            <g transform="translate(420, 740)">
              <rect x="0" y="0" width="740" height="50" rx="8" fill="#020617" stroke="#334155"/>
              <text x="370" y="22" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#38bdf8" textAnchor="middle">
                AQUAGUARD SYSTEM ARCHITECTURE • THIAGARAJAR COLLEGE OF ENGINEERING • DEPT. PROJECT 2026
              </text>
              <text x="370" y="38" fontFamily="monospace" fontSize="8" fill="#64748b" textAnchor="middle">
                Schematic Revision 2.4 • All logic inputs clamped to 3.3V max • Optically isolated 12V power rails
              </text>
            </g>

          </svg>
        </div>
      </main>

    </div>
  );
};
