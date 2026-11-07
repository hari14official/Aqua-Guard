export type LevelState = 'LOW' | 'MID' | 'FULL';
export type TurbidityStatus = 'CLEAR' | 'CLOUDY' | 'DIRTY';
export type OperationMode = 'AUTO' | 'MANUAL';
export type SystemState = 
  | 'IDLE_NORMAL'
  | 'FILLING'
  | 'TANK_FULL'
  | 'CONTAMINATION_ALERT'
  | 'OBJECT_DETECTED'
  | 'DRAINING'
  | 'MANUAL_OVERRIDE';

export interface TankLiveState {
  levelState: LevelState;
  levelPercent: number; // 0 - 100% for smooth animation
  lowSensor: boolean;   // true = water detected at low probe
  fullSensor: boolean;  // true = water detected at full probe
  turbidityVoltage: number; // 0.00 - 5.00 V
  turbidityNTU: number;     // calculated NTU
  turbidityStatus: TurbidityStatus;
  objectDetected: boolean;
  pump: boolean;
  valve: boolean;
  alarm: boolean;
  mode: OperationMode;
  systemState: SystemState;
  systemStateLabel: string;
  pumpRunSeconds: number;
  fillCycles: number;
  contaminationEvents: number;
  wifiRssi: number; // dBm e.g. -65
  isOnline: boolean;
  lastSeen: number; // timestamp
}

export interface TankHistoryItem {
  timestamp: number;
  timeLabel: string;
  levelPercent: number;
  turbidityVoltage: number;
  pumpState: boolean;
  valveState: boolean;
}

export interface TankEvent {
  id: string;
  timestamp: number;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  title: string;
  description: string;
}

export interface TankCommand {
  command: 'SET_PUMP' | 'SET_VALVE' | 'SET_MODE' | 'RESET_ALARM';
  value: boolean | OperationMode;
  requestedAt: number;
  status: 'PENDING' | 'EXECUTED' | 'REJECTED';
  rejectionReason?: string;
}

export interface SmartAlert {
  id: string;
  timestamp: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  read: boolean;
}
