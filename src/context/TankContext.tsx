import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  SensorTelemetry,
  ActuatorState,
  InterlockState,
  AlertLogItem,
  TelemetryHistoryPoint,
  SimulationScenario,
  WaterQualityStatus
} from '../types';

interface TankContextType {
  telemetry: SensorTelemetry;
  actuators: ActuatorState;
  interlocks: InterlockState;
  alerts: AlertLogItem[];
  history: TelemetryHistoryPoint[];
  activeScenario: SimulationScenario;
  waterQuality: WaterQualityStatus;
  soundEnabled: boolean;
  tankCapacityLiters: number;
  
  // Actions
  togglePump: () => void;
  setControlMode: (mode: 'AUTO' | 'MANUAL') => void;
  triggerEmergencyStop: () => void;
  resetEmergencyStop: () => void;
  resetInterlocks: () => void;
  setInletValve: (state: 'OPEN' | 'CLOSED') => void;
  setDrainValve: (state: 'OPEN' | 'CLOSED') => void;
  applyScenario: (scenario: SimulationScenario) => void;
  updateCustomSensor: (key: keyof SensorTelemetry, value: number) => void;
  clearAlerts: () => void;
  acknowledgeAlert: (id: string) => void;
  toggleSound: () => void;
}

const TANK_CAPACITY_LITERS = 1000;

const initialTelemetry: SensorTelemetry = {
  waterLevel: 58,
  volumeLiters: 580,
  sumpLevel: 82,
  turbidity: 1.2, // Clean drinking water < 5 NTU
  opticalTransmittance: 96.5, // > 80% is crystal clear
  tds: 145, // ppm
  ph: 7.2,
  flowRate: 0,
  pumpCurrent: 0,
  temperature: 26.4
};

const initialActuators: ActuatorState = {
  pump: 'OFF',
  mode: 'AUTO',
  inletValve: 'CLOSED',
  drainValve: 'CLOSED',
  bypassMode: false,
  pumpSpeed: 100,
  runtimeMinutes: 142
};

const initialInterlocks: InterlockState = {
  dryRunTrip: false,
  contaminationTrip: false,
  highLevelTrip: false,
  emergencyStop: false,
  sumpLowWarning: false
};

const initialAlerts: AlertLogItem[] = [
  {
    id: 'alt-1',
    timestamp: '12:00:15',
    severity: 'info',
    title: 'AquaGuard Core Initialized',
    message: 'Team 5 TCE IoT Controller online. Optical contamination sensors calibrated.',
    acknowledged: true
  },
  {
    id: 'alt-2',
    timestamp: '12:05:30',
    severity: 'info',
    title: 'Interlocks Verified',
    message: 'Dry-run sensor (sump float) and Solenoid Fail-safe active.',
    acknowledged: true
  }
];

const TankContext = createContext<TankContextType | undefined>(undefined);

// Helper for Web Audio API sound alert
const playBeep = (freq = 880, duration = 0.15, type: OscillatorType = 'sine') => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio context may be restricted by browser until first interaction
  }
};

export const TankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(initialTelemetry);
  const [actuators, setActuators] = useState<ActuatorState>(initialActuators);
  const [interlocks, setInterlocks] = useState<InterlockState>(initialInterlocks);
  const [alerts, setAlerts] = useState<AlertLogItem[]>(initialAlerts);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('NORMAL_OPERATION');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [history, setHistory] = useState<TelemetryHistoryPoint[]>(() => {
    const now = new Date();
    return Array.from({ length: 15 }, (_, i) => {
      const d = new Date(now.getTime() - (15 - i) * 3000);
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        waterLevel: 55 + Math.sin(i / 2) * 2,
        turbidity: 1.1 + Math.random() * 0.2,
        transmittance: 96 + Math.random() * 1,
        flowRate: 0,
        pumpCurrent: 0
      };
    });
  });

  const stateRef = useRef({ telemetry, actuators, interlocks });
  stateRef.current = { telemetry, actuators, interlocks };

  const addAlert = (severity: 'info' | 'warning' | 'critical', title: string, message: string) => {
    const newAlert: AlertLogItem = {
      id: 'alt-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      severity,
      title,
      message,
      acknowledged: false
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]);

    if (soundEnabled) {
      if (severity === 'critical') {
        playBeep(920, 0.25, 'sawtooth');
        setTimeout(() => playBeep(740, 0.35, 'sawtooth'), 150);
      } else if (severity === 'warning') {
        playBeep(640, 0.2, 'triangle');
      }
    }
  };

  // Determine Overall Water Quality Status
  const getWaterQuality = (turbidity: number, transmittance: number): WaterQualityStatus => {
    if (turbidity > 15 || transmittance < 50) return 'CRITICAL';
    if (turbidity > 5 || transmittance < 80) return 'CONTAMINATED';
    if (turbidity > 3 || transmittance < 90) return 'MODERATE';
    if (turbidity > 1.5) return 'GOOD';
    return 'EXCELLENT';
  };

  const waterQuality = getWaterQuality(telemetry.turbidity, telemetry.opticalTransmittance);

  // Main Simulation & Safety Interlock Loop (runs every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const { telemetry: currTel, actuators: currAct, interlocks: currInt } = stateRef.current;

      // 1. Evaluate Safety Interlock Conditions
      const isDryRun = currTel.sumpLevel <= 15;
      const isContaminated = currTel.turbidity > 5.0 || currTel.opticalTransmittance < 80.0;
      const isOverflow = currTel.waterLevel >= 95.0;
      const isEmergency = currInt.emergencyStop;

      const anyInterlockTripped = isDryRun || isContaminated || isOverflow || isEmergency;

      let nextPumpStatus = currAct.pump;
      let nextInletValve = currAct.inletValve;
      let nextDrainValve = currAct.drainValve;

      // Check if newly tripped
      if (!currInt.dryRunTrip && isDryRun) {
        addAlert('critical', 'Dry-Run Protection Tripped', 'Sump water level critically low (<15%). Pump isolated.');
      }
      if (!currInt.contaminationTrip && isContaminated) {
        addAlert('critical', 'Optical Contamination Detected!', `Turbidity: ${currTel.turbidity.toFixed(1)} NTU. Inlet Solenoid Closed & Drain Diverter Engaged.`);
      }
      if (!currInt.highLevelTrip && isOverflow) {
        addAlert('warning', 'High-Level Auto Cutoff', 'Overhead tank reached 95% threshold. Pump shut down.');
      }

      // Interlock actions
      if (anyInterlockTripped) {
        if (currAct.pump === 'RUNNING') {
          nextPumpStatus = 'INTERLOCKED';
        }
        if (isContaminated) {
          nextInletValve = 'CLOSED'; // Fail-safe inlet protection
          nextDrainValve = 'OPEN'; // Divert contaminated water to drain
        } else if (isOverflow || isEmergency) {
          nextInletValve = 'CLOSED';
        }
      } else {
        if (currAct.pump === 'INTERLOCKED') {
          nextPumpStatus = 'OFF';
        }
      }

      // Auto Mode Pumping Logic
      if (currAct.mode === 'AUTO' && !anyInterlockTripped) {
        // Auto Start when water level is low (<= 30%) and sump has water (> 25%)
        if (currTel.waterLevel <= 30 && currTel.sumpLevel > 25 && nextPumpStatus !== 'RUNNING') {
          nextPumpStatus = 'RUNNING';
          nextInletValve = 'OPEN';
          nextDrainValve = 'CLOSED';
          addAlert('info', 'Auto-Fill Initiated', 'Water level below 30%. Pump started automatically.');
        }
        // Auto Stop when tank is full (>= 90%)
        if (currTel.waterLevel >= 90 && nextPumpStatus === 'RUNNING') {
          nextPumpStatus = 'OFF';
          nextInletValve = 'CLOSED';
          addAlert('info', 'Target Level Reached', 'Overhead tank reached 90%. Pump stopped smoothly.');
        }
      }

      // Calculate Physical Flow & Levels
      let newWaterLevel = currTel.waterLevel;
      let newSumpLevel = currTel.sumpLevel;
      let flowRate = 0;
      let pumpCurrent = 0;

      if (nextPumpStatus === 'RUNNING' && nextInletValve === 'OPEN') {
        flowRate = 32.5 * (currAct.pumpSpeed / 100) + (Math.random() * 1.5 - 0.75);
        pumpCurrent = 4.6 * (currAct.pumpSpeed / 100) + (Math.random() * 0.2 - 0.1);

        // Water level increases (+0.4% per sec ~ 4L/sec)
        newWaterLevel = Math.min(100, newWaterLevel + 0.4);
        // Sump level decreases (-0.2% per sec)
        newSumpLevel = Math.max(0, newSumpLevel - 0.25);
      } else {
        // Natural domestic consumption in building
        newWaterLevel = Math.max(5, newWaterLevel - 0.04);
        // Sump slowly refilling from municipal mains
        if (newSumpLevel < 85) {
          newSumpLevel = Math.min(100, newSumpLevel + 0.08);
        }
      }

      // Sump Low Warning
      const sumpLowWarning = newSumpLevel <= 25 && newSumpLevel > 15;

      // Update Telemetry
      const updatedTelemetry: SensorTelemetry = {
        ...currTel,
        waterLevel: Number(newWaterLevel.toFixed(1)),
        volumeLiters: Math.round((newWaterLevel / 100) * TANK_CAPACITY_LITERS),
        sumpLevel: Number(newSumpLevel.toFixed(1)),
        flowRate: Number(Math.max(0, flowRate).toFixed(1)),
        pumpCurrent: Number(Math.max(0, pumpCurrent).toFixed(2))
      };

      setTelemetry(updatedTelemetry);

      // Update Actuators
      setActuators((prev) => ({
        ...prev,
        pump: nextPumpStatus,
        inletValve: nextInletValve,
        drainValve: nextDrainValve,
        runtimeMinutes: nextPumpStatus === 'RUNNING' ? prev.runtimeMinutes + 0.016 : prev.runtimeMinutes
      }));

      // Update Interlocks
      setInterlocks({
        dryRunTrip: isDryRun,
        contaminationTrip: isContaminated,
        highLevelTrip: isOverflow,
        emergencyStop: isEmergency,
        sumpLowWarning
      });

      // Update Graph History
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory((prev) => [
        ...prev.slice(-29),
        {
          time: timeStr,
          waterLevel: updatedTelemetry.waterLevel,
          turbidity: updatedTelemetry.turbidity,
          transmittance: updatedTelemetry.opticalTransmittance,
          flowRate: updatedTelemetry.flowRate,
          pumpCurrent: updatedTelemetry.pumpCurrent
        }
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  // Actions
  const togglePump = () => {
    if (actuators.pump === 'RUNNING') {
      setActuators((prev) => ({ ...prev, pump: 'OFF', inletValve: 'CLOSED' }));
      addAlert('info', 'Pump Stopped', 'Manual shutdown command issued.');
    } else {
      if (interlocks.dryRunTrip || interlocks.contaminationTrip || interlocks.highLevelTrip || interlocks.emergencyStop) {
        addAlert('critical', 'Interlock Blocked Startup', 'Cannot start pump: Safety interlock is engaged! Check sensor readings.');
        return;
      }
      setActuators((prev) => ({ ...prev, pump: 'RUNNING', inletValve: 'OPEN' }));
      addAlert('info', 'Pump Started', 'Manual startup command executed.');
    }
  };

  const setControlMode = (mode: 'AUTO' | 'MANUAL') => {
    setActuators((prev) => ({ ...prev, mode }));
    addAlert('info', `Mode Changed: ${mode}`, mode === 'AUTO' ? 'Automated level and interlock logic active.' : 'Manual operator control enabled.');
  };

  const triggerEmergencyStop = () => {
    setInterlocks((prev) => ({ ...prev, emergencyStop: true }));
    setActuators((prev) => ({ ...prev, pump: 'INTERLOCKED', inletValve: 'CLOSED' }));
    addAlert('critical', 'EMERGENCY STOP ACTIVATED', 'All actuators halted immediately. Inlet valve locked.');
  };

  const resetEmergencyStop = () => {
    setInterlocks((prev) => ({ ...prev, emergencyStop: false }));
    setActuators((prev) => ({ ...prev, pump: 'OFF' }));
    addAlert('info', 'Emergency Stop Cleared', 'System returned to safe idle standby.');
  };

  const resetInterlocks = () => {
    setInterlocks((prev) => ({
      ...prev,
      emergencyStop: false,
      dryRunTrip: false,
      contaminationTrip: false,
      highLevelTrip: false
    }));
    setActuators((prev) => ({
      ...prev,
      pump: 'OFF',
      drainValve: 'CLOSED'
    }));
    addAlert('info', 'Interlocks Reset', 'Safety relays reset. Ready for normal operation.');
  };

  const setInletValve = (state: 'OPEN' | 'CLOSED') => {
    if (state === 'OPEN' && interlocks.contaminationTrip) {
      addAlert('warning', 'Valve Lockout', 'Cannot open inlet valve while contamination is detected.');
      return;
    }
    setActuators((prev) => ({ ...prev, inletValve: state }));
  };

  const setDrainValve = (state: 'OPEN' | 'CLOSED') => {
    setActuators((prev) => ({ ...prev, drainValve: state }));
  };

  const applyScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    switch (scenario) {
      case 'NORMAL_OPERATION':
        setTelemetry((prev) => ({
          ...prev,
          waterLevel: 58,
          sumpLevel: 80,
          turbidity: 1.1,
          opticalTransmittance: 96.5,
          tds: 140,
          ph: 7.2
        }));
        setActuators((prev) => ({ ...prev, pump: 'RUNNING', inletValve: 'OPEN', drainValve: 'CLOSED', mode: 'AUTO' }));
        addAlert('info', 'Scenario: Normal Supply', 'Clean municipal water flowing. Optical transmittance 96.5%.');
        break;

      case 'TURBID_CONTAMINATION':
        setTelemetry((prev) => ({
          ...prev,
          turbidity: 18.4, // Severely turbid!
          opticalTransmittance: 38.2, // Optical beam blocked!
          tds: 580,
          ph: 6.4
        }));
        addAlert('critical', 'Scenario: Contamination Spike', 'Heavy turbidity detected in optical sensor chamber! Interlock triggering.');
        break;

      case 'LOW_SUMP_DRY_RUN':
        setTelemetry((prev) => ({
          ...prev,
          sumpLevel: 10 // Below 15% cutoff!
        }));
        addAlert('critical', 'Scenario: Sump Depleted', 'Water supply reservoir exhausted. Dry run protection active.');
        break;

      case 'HIGH_OVERFLOW':
        setTelemetry((prev) => ({
          ...prev,
          waterLevel: 97 // Overhead tank overflowing
        }));
        addAlert('warning', 'Scenario: High Level', 'Overhead tank at 97%. Overflow limit reached.');
        break;

      case 'FAILSAFE_TEST':
        triggerEmergencyStop();
        break;

      default:
        break;
    }
  };

  const updateCustomSensor = (key: keyof SensorTelemetry, value: number) => {
    setTelemetry((prev) => ({ ...prev, [key]: value }));
  };

  const clearAlerts = () => setAlerts([]);
  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <TankContext.Provider
      value={{
        telemetry,
        actuators,
        interlocks,
        alerts,
        history,
        activeScenario,
        waterQuality,
        soundEnabled,
        tankCapacityLiters: TANK_CAPACITY_LITERS,
        togglePump,
        setControlMode,
        triggerEmergencyStop,
        resetEmergencyStop,
        resetInterlocks,
        setInletValve,
        setDrainValve,
        applyScenario,
        updateCustomSensor,
        clearAlerts,
        acknowledgeAlert,
        toggleSound
      }}
    >
      {children}
    </TankContext.Provider>
  );
};

export const useTank = () => {
  const context = useContext(TankContext);
  if (!context) {
    throw new Error('useTank must be used within a TankProvider');
  }
  return context;
};
