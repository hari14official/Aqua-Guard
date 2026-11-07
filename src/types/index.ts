export type WaterQualityStatus = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CONTAMINATED' | 'CRITICAL';

export interface SensorTelemetry {
  waterLevel: number; // 0 - 100 %
  volumeLiters: number; // calculated from capacity e.g. 1000L
  sumpLevel: number; // 0 - 100 %
  turbidity: number; // NTU (0 - 100)
  opticalTransmittance: number; // % (0 - 100)
  tds: number; // ppm (0 - 1000)
  ph: number; // 0 - 14
  flowRate: number; // L/min (0 - 60)
  pumpCurrent: number; // Amperes (0 - 10 A)
  temperature: number; // °C
}

export type PumpStatus = 'OFF' | 'RUNNING' | 'INTERLOCKED' | 'ERROR';
export type ControlMode = 'AUTO' | 'MANUAL';
export type ValveState = 'OPEN' | 'CLOSED';

export interface InterlockState {
  dryRunTrip: boolean; // Tripped if sumpLevel < 15%
  contaminationTrip: boolean; // Tripped if turbidity > 5 NTU or transmittance < 80%
  highLevelTrip: boolean; // Tripped if waterLevel >= 95%
  emergencyStop: boolean; // Manual E-stop button
  sumpLowWarning: boolean;
}

export interface ActuatorState {
  pump: PumpStatus;
  mode: ControlMode;
  inletValve: ValveState; // Solenoid inlet valve (Normally closed)
  drainValve: ValveState; // Contamination diversion/drain valve
  bypassMode: boolean; // Bypasses interlocks if authorized
  pumpSpeed: number; // 0 - 100%
  runtimeMinutes: number;
}

export interface AlertLogItem {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  acknowledged: boolean;
}

export interface TelemetryHistoryPoint {
  time: string;
  waterLevel: number;
  turbidity: number;
  transmittance: number;
  flowRate: number;
  pumpCurrent: number;
}

export type SimulationScenario = 
  | 'NORMAL_OPERATION'
  | 'TURBID_CONTAMINATION'
  | 'LOW_SUMP_DRY_RUN'
  | 'HIGH_OVERFLOW'
  | 'PUMP_OVERLOAD'
  | 'FAILSAFE_TEST';
