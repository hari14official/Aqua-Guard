# 🚰 AquaGuard: Smart Water Tank Automation & Quality Monitoring System

<div align="center">

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-RTDB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![ESP32 FreeRTOS](https://img.shields.io/badge/ESP32-FreeRTOS-E7352C?style=for-the-badge&logo=espressif&logoColor=white)](https://www.espressif.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**An intelligent closed-loop IoT water reservoir management platform featuring real-time telemetry, optical turbidity quality verification, anti-tampering interlocks, fail-safe cloud synchronization, and an interactive 3D digital twin.**

[Architecture](#-system-architecture) • [Hardware BOM](#-hardware-specifications--pinout) • [Local Setup](#-getting-started-locally) • [GitHub Deploy](#-deploying-to-github) • [Team](#-engineering-team--institutional-attribution)

---

</div>

## 📌 Table of Contents

1. [Overview & Problem Statement](#-overview--problem-statement)
2. [Core Features](#-core-features)
3. [System Architecture](#-system-architecture)
4. [Hardware Specifications & Pinout](#-hardware-specifications--pinout)
5. [Getting Started Locally](#-getting-started-locally)
6. [Deploying to GitHub](#-deploying-to-github)
7. [Project Structure](#-project-structure)
8. [Engineering Team & Institutional Attribution](#-engineering-team--institutional-attribution)
9. [License](#-license)

---

## 🌊 Overview & Problem Statement

Domestic and industrial overhead water tanks encounter severe operational vulnerabilities:
- **Catastrophic Overflow & Water Waste**: Mechanical float switches often jam from scale deposits, leading to continuous overflow and motor burnout.
- **Contaminated Municipal Inflow**: Heavy rains and pipeline fractures introduce suspended silt, microbial pathogens, and high-turbidity water directly into clean storage tanks before detection.
- **Dry-Run Pump Failures**: Submersible pumps frequently run dry during municipal supply cuts, causing motor overheating and coil burnout.
- **Lid Tampering & Airborne Ingress**: Unmonitored tank access enables biological contamination (rodents, dust, airborne pollutants) to go unnoticed.

**AquaGuard** resolves these challenges through an autonomous, dual-core **ESP32** microcontroller running **FreeRTOS** alongside an enterprise-grade **React + TypeScript** web dashboard. The system continuously validates water quality before permitting intake, isolates pumps during dry-run or low-level anomalies, streams live metrics via **Google Firebase Realtime Database (RTDB)**, and includes an offline **hardware physics simulation engine** that allows seamless testing without physical hardware.

---

## ⚡ Core Features

### 🔄 1. Dual-Mode Telemetry Engine
- **Hardware Live Mode**: Streams two-way operational telemetry (water level %, turbidity NTU, lid status, actuator states) via Firebase RTDB with sub-100ms latency.
- **Autonomous Simulation Mode**: High-fidelity physics-based software simulation engine reproducing water intake dynamics, residential consumption patterns, turbidity spikes, and sensor faults whenever hardware is offline.

### 🧊 2. 3D Digital Twin Reservoir Visualizer
- Real-time 3D rendered water tank featuring dynamic liquid wave oscillation, volumetric fill calculations, live status badges, and color-coded turbidity states (Clear, Moderate, High, Severe Contamination).

### 🛡️ 3. Multi-Tier Sensor Interlocks
- **Optical Turbidity Sensing**: Samples analog optical attenuation through ADC1 with **64-sample median filtering** to filter out electromagnetic motor noise.
- **Solid-State Dual HW-038 Immersion Probes**: 20% (LOW) and 90% (FULL) liquid level sensing utilizing a **5ms pulsed energization cycle** to eliminate electrolytic galvanic corrosion.
- **IR Obstacle & Intrusion Detection**: Instant non-contact optical lid detection triggering local audible alarms and disabling intake pumps upon tampering.

### ⚙️ 4. Intelligent Actuator Failsafes
- **12V DC Solenoid Inlet Gate Valve**: Automatically clamps shut if incoming water exceeds turbidity thresholds (> 25 NTU / < 2.5V sensor reference).
- **Submersible Booster Pump**: Features software anti-chatter hysteresis, minimum dry-run lockout thresholds (20%), and continuous run-timer watchdogs.
- **Local Alarm System**: 85 dB piezo buzzer and high-contrast status LEDs operate autonomously on Core 1 even if cloud Wi-Fi connectivity drops.

### 📊 5. Telemetry Historian & Event Audit Logging
- Interactive time-series charts (turbidity trends, fill cycles, water usage) powered by Recharts.
- Complete chronological audit log of all system alarms, manual overrides, and valve switching events.
- Modern dark/light theme toggle, mobile mockup view, and responsive design for smartphones, tablets, and desktop workstations.

---

## 🏛️ System Architecture

### Visual Data Flow & Interconnect Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                  PHYSICAL IoT HARDWARE LAYER (Overhead Reservoir)                │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   [HW-038 Dual Probes] ──(GPIO 34 & 35)──┐                                       │
│   (LOW: 20% | FULL: 90%)                 │                                       │
│                                          ▼                                       │
│   [Optical Turbidity] ──> [Divider] ──(GPIO 32 ADC1)─> [ESP32 DevKit V1]         │
│   (Analog NTU Signal)   (5V to 3.3V)                   (Dual-Core 240 MHz        │
│                                                        FreeRTOS Task Loops)      │
│   [IR Lid Tamper] ───────(GPIO 27)───────┘                     │                 │
│   (Intrusion Sensor)                                           │                 │
│                                        ┌───────────────────────┴───────────────┐ │
│                                        ▼                                       ▼ │
│                              [Dual 5V Relay Module]                    [Buzzer &]│
│                              (Galvanic Optocoupler)                    [LED Alarm]
│                                   │          │                         (GPIO 23/ │
│                           (GPIO 25)          (GPIO 26)                  18 & 19) │
│                                   ▼          ▼                                   │
│                             [12V Solenoid] [Submersible]                         │
│                             [Inlet Valve ] [Water Pump ]                         │
└───────────────────────────────────────┬──────────────────────────────────────────┘
                                        │ WPA2 Wi-Fi / TLS Encrypted Stream (Core 0)
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         CLOUD TELEMETRY GATEWAY LAYER                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                 [ Google Firebase Realtime Database (RTDB) ]                     │
│                 • /telemetry (Water Level %, Turbidity NTU, Lid Status)          │
│                 • /controls  (Pump Override, Solenoid Manual Clamp)              │
│                 • /alerts    (Dry-run Lockout, Contamination, Tamper Logs)       │
│                                                                                  │
└───────────────────────────────────────┬──────────────────────────────────────────┘
                                        │ Secure WebSockets / Real-Time JSON Stream
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION & CONTROL DASHBOARD LAYER                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                  [ AquaGuard Web Dashboard (React 18 + TypeScript) ]             │
│                  • Real-Time 3D Reservoir Digital Twin with Wave Physics         │
│                  • Optical Turbidity Gauge & Interlock Status Indicators         │
│                  • Time-Series Telemetry Historian Charts (Recharts)             │
│                  • Built-in Autonomous Hardware Physics Simulation Engine        │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Flowchart Representation

```mermaid
flowchart TD
    subgraph HW ["1. Physical IoT Hardware Layer"]
        PROBES["HW-038 Dual Level Probes<br/>LOW 20% | FULL 90%"]
        TURB["Optical Turbidity Sensor<br/>Water Clarity Analog Signal"]
        DIV["Resistive Voltage Divider<br/>5V to 3.3V ADC Step-down"]
        IR["IR Lid Tamper Sensor<br/>Intrusion Detection"]

        ESP["ESP32 DevKit V1<br/>Dual-Core FreeRTOS Controller"]

        RELAY["Dual Optocoupler Relay<br/>2500V Galvanic Isolation"]
        SOL["12V DC Solenoid Valve<br/>Municipal Inlet Cutoff"]
        PUMP["Submersible Booster Pump<br/>Water Distribution"]
        ALARM["85dB Buzzer & Dual LEDs<br/>Local Alarm Indicators"]

        PROBES -->|GPIO 34 & 35| ESP
        TURB --> DIV
        DIV -->|GPIO 32 ADC1| ESP
        IR -->|GPIO 27| ESP

        ESP -->|GPIO 25| RELAY
        ESP -->|GPIO 26| RELAY
        RELAY --> SOL
        RELAY --> PUMP
        ESP -->|GPIO 23, 18, 19| ALARM
    end

    subgraph CLOUD ["2. Cloud Telemetry Gateway Layer"]
        RTDB[("Firebase Realtime DB<br/>Cloud JSON Telemetry")]
    end

    subgraph APP ["3. Presentation & Dashboard Layer"]
        DASH["AquaGuard Web Application<br/>React 18 + TypeScript + Vite"]
        SIM["Autonomous Simulation Engine<br/>High-Fidelity Physics Fallback"]
    end

    ESP -->|Wi-Fi WPA2 / TLS| RTDB
    RTDB -->|Live WebSockets| DASH
    SIM -.->|Offline Mode Fallback| DASH
```

---

## 🔌 Hardware Specifications & Pinout

### Bill of Materials (BOM)

| Item | Component | Model / Spec | Purpose | Est. Cost |
| :-- | :--- | :--- | :--- | :--- |
| 1 | **Microcontroller** | ESP-WROOM-32 DevKit V1 (30-pin) | Real-time dual-core control & Wi-Fi telemetry | ₹420 |
| 2 | **Water Level Probes** | HW-038 Gold Immersion Plates (x2) | Low (20%) & Full (90%) level detection | ₹110 |
| 3 | **Turbidity Sensor** | Optical Turbidity Sensor Module | Silt / sediment detection & quality validation | ₹380 |
| 4 | **Lid Tamper Sensor** | IR Obstacle Reflection Sensor | Lid removal / unauthorized access alarm | ₹45 |
| 5 | **Relay Module** | 2-Channel 5V Optocoupler Relay | Galvanic high-power switching isolation | ₹95 |
| 6 | **Inlet Valve** | 12V DC 1/2" Solenoid Valve (NC) | Automated shut-off for municipal supply | ₹280 |
| 7 | **Booster Pump** | 12V Mini Submersible Water Pump | Water distribution & aeration | ₹140 |
| 8 | **Audible / Visual** | 5V Piezo Buzzer + Red/Green LEDs | On-site fail-safe audio & visual status indicators | ₹35 |
| 9 | **Protection** | 10kΩ & 20kΩ 1/4W Resistors | Voltage divider (5V sensor to 3.3V ESP32 ADC) | ₹10 |
| **Total** | | | **Complete Hardware Prototype BOM** | **~₹1,515** |

### ESP32 GPIO Pin Mapping

| ESP32 Pin | Direction | Signal Type | Target Peripheral | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GPIO 32** | INPUT | Analog (ADC1_CH4) | Turbidity Sensor Output | Optical attenuation reading (64-sample median filter) |
| **GPIO 34** | INPUT | Digital (Pull-Down) | HW-038 LOW Level Probe | Triggers refill sequence at 20% capacity |
| **GPIO 35** | INPUT | Digital (Pull-Down) | HW-038 FULL Level Probe | Triggers auto cutoff sequence at 90% capacity |
| **GPIO 27** | INPUT | Digital (Active LOW) | IR Obstacle Sensor | Detects lid open / unauthorized intrusion |
| **GPIO 21** | OUTPUT | Digital Pulsed | Probe Power Gate | 5ms pulse drive to mitigate galvanic oxidation |
| **GPIO 25** | OUTPUT | Digital (Active LOW) | Relay CH1 (Solenoid Valve) | Opens/closes 12V municipal water inlet |
| **GPIO 26** | OUTPUT | Digital (Active LOW) | Relay CH2 (Water Pump) | Controls distribution pump with dry-run protection |
| **GPIO 23** | OUTPUT | Digital HIGH | 5V Active Piezo Buzzer | Audible warning for contamination or tampering |
| **GPIO 18** | OUTPUT | Digital HIGH | Green 5mm LED | Steady illumination indicating healthy system state |
| **GPIO 19** | OUTPUT | Digital HIGH | Red 5mm LED | Flashing illumination during active alarms |

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)
- **Git** installed on your system

### Quick Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AquaGuard.git
   cd AquaGuard
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   # Copy the safe template to .env
   cp .env.example .env
   ```
   *Edit `.env` with your Firebase credentials if you are connecting physical ESP32 hardware, or leave them empty to run in realistic simulation mode.*

4. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to explore the dashboard.

5. **Test the Production Build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🚀 Deploying to GitHub

Follow these steps to safely push your project to GitHub:

### Step 1: Verify Git Status
Run the following command to ensure all files are in order:
```bash
git status
```

### Step 2: Stage and Commit the Files
```bash
git add .
git commit -m "feat: complete AquaGuard smart tank platform"
```

### Step 3: Link Remote and Push to GitHub
```bash
# Rename branch to main if not already on main
git branch -M main

# Add your GitHub repository remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/AquaGuard.git

# Push code to GitHub
git push -u origin main
```

---

## 📂 Project Structure

```
Aqua Guard/
├── .github/
│   └── workflows/
│       └── ci-cd.yml            # Automated GitHub Actions CI/CD pipeline
├── .git/                        # Git version control metadata
├── .gitignore                   # Excludes secrets (.env), node_modules, dist
├── .env.example                 # Safe environment variables template
├── render.yaml                  # Render Blueprint Infrastructure-as-Code
├── index.html                   # HTML5 entry template & Google Fonts
├── package.json                 # Project dependencies and build scripts
├── postcss.config.js            # PostCSS configuration for Tailwind
├── tailwind.config.js           # Custom theme colors, gradients, dark mode
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build and plugin configuration
│
├── public/                      # Static assets served as-is
│   ├── _redirects               # SPA rewrite fallback for Render/Netlify
│   └── assets/
│       └── components/          # High-resolution hardware component photos & SVGs
│
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root component, hash router, and global state
    ├── index.css                # Global Tailwind directives & custom utilities
    │
    ├── components/              # Modular UI components
    │   ├── Navbar.tsx           # Navigation bar with connection status & theme toggle
    │   ├── Hero.tsx             # Interactive hero showcase with telemetry pills
    │   ├── LiveDashboardPage.tsx# Dedicated real-time monitoring page
    │   ├── FullCircuitPage.tsx  # Interactive hardware schematic & pin viewer
    │   ├── ProjectInfoPage.tsx  # Institutional credentials & capstone team attribution
    │   ├── HardwareSection.tsx  # Component cards with modal deep-dives
    │   ├── HardwareDetailModal.tsx # Detailed hardware datasheets & wiring diagrams
    │   ├── MobileMockup.tsx     # Smartphone container previewing live mobile UI
    │   ├── FlowDiagram.tsx      # Multi-stage fluid flow and sensor decision chart
    │   ├── FAQSection.tsx       # Technical Q&A on fail-safes & FreeRTOS loops
    │   ├── ContactPage.tsx      # Team feedback form with Firebase sync
    │   ├── PrivacyNoticePage.tsx# Privacy & IoT data compliance documentation
    │   ├── TermsOfUsePage.tsx   # Engineering safety terms and usage protocols
    │   └── Dashboard/           # Telemetry dashboard sub-components
    │       ├── LiveDashboard.tsx    # Master telemetry monitor grid
    │       ├── TankGauge3D.tsx      # 3D fluid tank visualizer with wave physics
    │       ├── TurbidityGauge.tsx   # Analog/digital NTU quality meter
    │       ├── IRSensorCard.tsx     # Anti-tampering lid sensor indicator
    │       ├── ActuatorControls.tsx # Manual pump/solenoid overrides with safety interlocks
    │       ├── ChartsSection.tsx    # Recharts time-series telemetry historian
    │       ├── SimulationPanel.tsx  # Simulation control sandbox for testing edge cases
    │       └── EventLogTable.tsx    # Filterable chronological audit logger
    │
    ├── context/                 # React Context providers
    │   └── TankContext.tsx      # Shared state management for tank telemetry
    │
    ├── data/                    # Static datasets
    │   └── hardwareData.ts      # Hardware specifications, GPIO wiring, and ESP32 code
    │
    ├── services/                # Core business logic & cloud integrations
    │   ├── firebase.ts          # Firebase SDK initialization with fallback safeguards
    │   ├── simulationEngine.ts  # Realistic water physics and fault simulation engine
    │   └── tankService.ts       # Unified telemetry manager (Firebase <-> Simulation)
    │
    └── types/                   # TypeScript interfaces and domain models
        ├── index.ts             # Generic component types
        ├── tank.ts              # Tank state, events, telemetry, and alarm types
        └── three.d.ts           # Type definitions for 3D visualization components
```

---

## 👥 Engineering Team & Institutional Attribution

This project was developed as an undergraduate Capstone Engineering Project at **Thiagarajar College of Engineering (TCE)**:

- **Institution**: [Thiagarajar College of Engineering](https://www.tce.edu/), Madurai – 625 015, Tamil Nadu, India.
  *(Autonomous Institution Affiliated to Anna University, Approved by AICTE, Accredited by NAAC with 'A+' Grade)*
- **Department**: Department of Electronics and Communication Engineering (ECE)
- **Academic Year**: 2025 – 2026
- **Project Designation**: Capstone Prototype Team 5

### Project Team Members

| Name | Role | Primary Engineering Responsibilities |
| :--- | :--- | :--- |
| **Kiruthik Sabari S** | **Team Leader** | ESP-WROOM-32 FreeRTOS firmware architecture, 64-sample median ADC1 filtering, and dual-probe debounce state machines. |
| **Srivardhini** | **System Designer** | Mechanical enclosure design, fluid manifold layout, 3D transparent reservoir visualization, and UI/UX ergonomics. |
| **Aswatha Priya B** | **Web Master** | Full-stack responsive React/TypeScript dashboard, bi-directional Firebase RTDB synchronization, and telemetry historian charts. |
| **Palanisamy K** | **Recorder** | Technical documentation, Bill of Materials (BOM) cost optimization, component datasheets, and experimental test logs. |
| **Harikumar M** | **Devil's Advocate** | Quality assurance, fault-injection testing (dry-run stalls, sensor disconnects, power spikes), and fail-safe safety interlocks. |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
Copyright (c) 2026 Team 5 - Department of Electronics and Communication Engineering,
Thiagarajar College of Engineering, Madurai, India.
```

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

---

<div align="center">
  <b>AquaGuard &bull; Clean Water &bull; Intelligent Automation &bull; Zero Waste</b>
</div>
