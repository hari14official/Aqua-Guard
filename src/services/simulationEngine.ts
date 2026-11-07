import { TankLiveState, TankHistoryItem, TankEvent, OperationMode, SmartAlert } from '../types/tank';

class SimulationEngine {
  private state: TankLiveState;
  private history: TankHistoryItem[] = [];
  private events: TankEvent[] = [];
  private alerts: SmartAlert[] = [];
  private subscribers: Array<(state: TankLiveState) => void> = [];
  private timer: number | null = null;
  private isForcedOffline: boolean = false;
  private isUserForcedDirty: boolean = false;
  private isUserForcedObject: boolean = false;

  constructor() {
    const now = Date.now();
    this.state = {
      levelState: 'MID',
      levelPercent: 48,
      lowSensor: true,
      fullSensor: false,
      turbidityVoltage: 4.12,
      turbidityNTU: 4.5,
      turbidityStatus: 'CLEAR',
      objectDetected: false,
      pump: false,
      valve: true,
      alarm: false,
      mode: 'AUTO',
      systemState: 'IDLE_NORMAL',
      systemStateLabel: 'Normal Operation',
      pumpRunSeconds: 340,
      fillCycles: 14,
      contaminationEvents: 1,
      wifiRssi: -62,
      isOnline: true,
      lastSeen: now
    };

    // Populate initial 24h history for rich charts on first load
    this.seedHistory();
    this.seedEvents();
    this.seedAlerts();
    this.startSimulationLoop();
  }

  private seedHistory() {
    const now = Date.now();
    const points = 24; // 24 hours
    for (let i = points; i >= 0; i--) {
      const time = now - i * 3600 * 1000;
      const d = new Date(time);
      const timeLabel = `${d.getHours().toString().padStart(2, '0')}:00`;
      
      // Realistic diurnal variation
      const baseLevel = 40 + Math.sin(i / 3) * 35;
      const cleanVoltage = 3.9 + Math.sin(i / 4) * 0.25;
      
      this.history.push({
        timestamp: time,
        timeLabel,
        levelPercent: Math.min(100, Math.max(15, Math.round(baseLevel))),
        turbidityVoltage: Number(cleanVoltage.toFixed(2)),
        pumpState: baseLevel < 25 || (baseLevel > 50 && baseLevel < 65),
        valveState: true
      });
    }
  }

  private seedEvents() {
    const now = Date.now();
    this.events = [
      {
        id: 'evt-1',
        timestamp: now - 1800000,
        type: 'INFO',
        title: 'System Startup',
        description: 'AquaGuard controller online. Self-test passed on all sensors.'
      },
      {
        id: 'evt-2',
        timestamp: now - 900000,
        type: 'SUCCESS',
        title: 'Tank Filled',
        description: 'Level reached FULL (90%). Pump stopped safely.'
      },
      {
        id: 'evt-3',
        timestamp: now - 300000,
        type: 'INFO',
        title: 'Water Level Check',
        description: 'Periodic pulsed probe reading completed. Level at 48% (MID).'
      }
    ];
  }

  private seedAlerts() {
    const now = Date.now();
    this.alerts = [
      {
        id: 'alt-1',
        timestamp: now - 900000,
        severity: 'LOW',
        title: 'Tank Full',
        message: 'Water tank reached full capacity. Pump shut down automatically.',
        read: false
      },
      {
        id: 'alt-2',
        timestamp: now - 3600000,
        severity: 'HIGH',
        title: 'Turbidity Spike Detected',
        message: 'Suspended silt detected at inlet inspection chamber. Valve closed for 4 mins.',
        read: true
      }
    ];
  }

  public subscribe(callback: (state: TankLiveState) => void): () => void {
    this.subscribers.push(callback);
    callback(this.getState());
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notify() {
    const current = this.getState();
    this.subscribers.forEach(cb => cb(current));
  }

  public getState(): TankLiveState {
    return { ...this.state };
  }

  public getHistory(): TankHistoryItem[] {
    return [...this.history];
  }

  public getEvents(): TankEvent[] {
    return [...this.events];
  }

  public getAlerts(): SmartAlert[] {
    return [...this.alerts];
  }

  public markAlertAsRead(id: string) {
    this.alerts = this.alerts.map(a => a.id === id ? { ...a, read: true } : a);
  }

  public clearAllAlerts() {
    this.alerts = [];
  }

  private logEvent(type: TankEvent['type'], title: string, description: string) {
    const evt: TankEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type,
      title,
      description
    };
    this.events.unshift(evt);
    if (this.events.length > 50) this.events.pop();

    if (type === 'CRITICAL' || type === 'WARNING') {
      const alert: SmartAlert = {
        id: `alt-${Date.now()}`,
        timestamp: Date.now(),
        severity: type === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
        title,
        message: description,
        read: false
      };
      this.alerts.unshift(alert);
      if (this.alerts.length > 30) this.alerts.pop();
    }
  }

  private startSimulationLoop() {
    if (this.timer) clearInterval(this.timer);

    this.timer = window.setInterval(() => {
      this.stepSimulation();
    }, 2000);
  }

  private stepSimulation() {
    const now = Date.now();

    if (this.isForcedOffline) {
      // Offline mode: do not update lastSeen so the 10-second timer will trip
      this.state.isOnline = false;
      this.notify();
      return;
    }

    this.state.isOnline = true;
    this.state.lastSeen = now;

    // Simulate Wi-Fi RSSI jitter
    this.state.wifiRssi = Math.round(-60 + Math.random() * 8 - 4);

    // Turbidity reading calculation
    if (this.isUserForcedDirty) {
      this.state.turbidityVoltage = Number((1.85 + Math.random() * 0.1).toFixed(2));
      this.state.turbidityStatus = 'DIRTY';
      this.state.turbidityNTU = 245;
    } else {
      // Natural clean water with slight noise
      const cleanV = 4.10 + Math.sin(now / 20000) * 0.15 + (Math.random() * 0.05 - 0.025);
      this.state.turbidityVoltage = Number(cleanV.toFixed(2));
      this.state.turbidityNTU = 4.2;
      this.state.turbidityStatus = cleanV < 2.5 ? 'DIRTY' : cleanV < 3.5 ? 'CLOUDY' : 'CLEAR';
    }

    // IR Obstacle state
    this.state.objectDetected = this.isUserForcedObject;

    // Evaluate Contamination & Safety Hazards
    const isContaminated = this.state.turbidityStatus === 'DIRTY';
    const isObjectBlocked = this.state.objectDetected;
    const isHazard = isContaminated || isObjectBlocked;

    if (isHazard) {
      this.state.alarm = true;
      this.state.valve = false; // Always cut inlet immediately
      this.state.pump = false;  // Interlock shutoff
      if (isContaminated) {
        this.state.systemState = 'CONTAMINATION_ALERT';
        this.state.systemStateLabel = 'Contamination – Inlet Closed';
      } else {
        this.state.systemState = 'OBJECT_DETECTED';
        this.state.systemStateLabel = 'Object at Inlet – Valve Closed';
      }
    } else {
      this.state.alarm = false;

      // AUTOMATIC MODE LOGIC
      if (this.state.mode === 'AUTO') {
        // Hysteresis level logic
        if (this.state.levelPercent <= 20) {
          // Level is LOW -> Trigger Pump ON and Open Valve
          if (!this.state.pump) {
            this.state.pump = true;
            this.state.valve = true;
            this.state.systemState = 'FILLING';
            this.state.systemStateLabel = 'Tank Low – Filling Active';
            this.state.fillCycles += 1;
            this.logEvent('INFO', 'Pump Started', 'Water level reached LOW threshold (20%). Inflow active.');
          }
        } else if (this.state.levelPercent >= 90) {
          // Level is FULL -> Shut off Pump
          if (this.state.pump) {
            this.state.pump = false;
            this.state.systemState = 'TANK_FULL';
            this.state.systemStateLabel = 'Tank Full – Pump Standby';
            this.logEvent('SUCCESS', 'Tank Full Reached', 'Level probe triggered at 90%. Pump turned OFF.');
          }
        } else {
          // In MID region: maintain filling or idle
          if (this.state.pump) {
            this.state.systemState = 'FILLING';
            this.state.systemStateLabel = 'Filling in Progress';
          } else {
            this.state.systemState = 'IDLE_NORMAL';
            this.state.systemStateLabel = 'Normal Operation (Idle)';
          }
        }
      } else {
        this.state.systemState = 'MANUAL_OVERRIDE';
        this.state.systemStateLabel = 'Manual Override Active';
      }
    }

    // Physics: Level increase / drainage
    if (this.state.pump && !isHazard) {
      // Filling
      this.state.levelPercent = Math.min(95, this.state.levelPercent + 1.8);
      this.state.pumpRunSeconds += 2;
    } else {
      // Natural consumption/draining
      this.state.levelPercent = Math.max(8, this.state.levelPercent - 0.35);
    }

    // Derive discrete probe sensor states from level percent
    this.state.lowSensor = this.state.levelPercent >= 20;
    this.state.fullSensor = this.state.levelPercent >= 88;

    if (this.state.levelPercent < 20) {
      this.state.levelState = 'LOW';
    } else if (this.state.levelPercent >= 88) {
      this.state.levelState = 'FULL';
    } else {
      this.state.levelState = 'MID';
    }

    // Append to live history ring every 10 updates
    if (Math.random() < 0.2) {
      const d = new Date(now);
      const timeLabel = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      this.history.push({
        timestamp: now,
        timeLabel,
        levelPercent: Math.round(this.state.levelPercent),
        turbidityVoltage: this.state.turbidityVoltage,
        pumpState: this.state.pump,
        valveState: this.state.valve
      });
      if (this.history.length > 50) this.history.shift();
    }

    this.notify();
  }

  // Examiner / Viva simulation triggers
  public toggleDirtyWater(): boolean {
    this.isUserForcedDirty = !this.isUserForcedDirty;
    if (this.isUserForcedDirty) {
      this.state.contaminationEvents += 1;
      this.logEvent('CRITICAL', 'Dirty Water Inflow Detected', 'Optical turbidity module tripped (<2.0V). Emergency inlet shutdown.');
    } else {
      this.logEvent('SUCCESS', 'Water Cleared', 'Inspection chamber turbidity returned to nominal level (>4.0V).');
    }
    this.stepSimulation();
    return this.isUserForcedDirty;
  }

  public toggleObjectDetected(): boolean {
    this.isUserForcedObject = !this.isUserForcedObject;
    if (this.isUserForcedObject) {
      this.logEvent('WARNING', 'Object at Inlet Mesh', 'IR Proximity sensor blocked. Inlet valve closed to protect pump intake.');
    } else {
      this.logEvent('INFO', 'Inlet Clear', 'Obstruction cleared from inlet inspection mesh.');
    }
    this.stepSimulation();
    return this.isUserForcedObject;
  }

  public drainTank() {
    this.state.levelPercent = 14;
    this.state.levelState = 'LOW';
    this.state.lowSensor = false;
    this.state.fullSensor = false;
    this.logEvent('INFO', 'Tank Level Low', 'Water level drained to 14%. Low level sensor tripped.');
    this.stepSimulation();
  }

  public fillTank() {
    this.state.levelPercent = 92;
    this.state.levelState = 'FULL';
    this.state.lowSensor = true;
    this.state.fullSensor = true;
    this.logEvent('SUCCESS', 'Tank Level Full', 'Water level reached 92%. Full probe contacted.');
    this.stepSimulation();
  }

  public toggleOffline(): boolean {
    this.isForcedOffline = !this.isForcedOffline;
    if (this.isForcedOffline) {
      // Force last seen to 15 seconds ago to immediately test offline detector
      this.state.lastSeen = Date.now() - 15000;
      this.state.isOnline = false;
      this.logEvent('WARNING', 'Gateway Disconnected', 'Telemetry feed timed out. Demonstrating 10s offline failsafe.');
    } else {
      this.state.lastSeen = Date.now();
      this.state.isOnline = true;
      this.logEvent('INFO', 'Gateway Reconnected', 'Wi-Fi connection restored. Telemetry streaming active.');
    }
    this.notify();
    return this.isForcedOffline;
  }

  public resetSimulation() {
    this.isForcedOffline = false;
    this.isUserForcedDirty = false;
    this.isUserForcedObject = false;
    this.state.mode = 'AUTO';
    this.state.levelPercent = 50;
    this.state.pump = false;
    this.state.valve = true;
    this.state.alarm = false;
    this.logEvent('INFO', 'System Reset', 'All simulated sensors restored to nominal initial conditions.');
    this.stepSimulation();
  }

  // Actuator control commands with safety interlocks
  public setPump(targetState: boolean): { success: boolean; reason?: string } {
    if (targetState) {
      // Safety interlock check
      if (this.state.turbidityStatus === 'DIRTY') {
        return { success: false, reason: 'Interlock active: Cannot start pump with DIRTY water detected!' };
      }
      if (this.state.levelState === 'FULL' || this.state.levelPercent >= 90) {
        return { success: false, reason: 'Interlock active: Tank is already FULL!' };
      }
    }

    this.state.pump = targetState;
    this.logEvent(
      'INFO', 
      targetState ? 'Pump Started (Manual)' : 'Pump Stopped (Manual)', 
      `User initiated pump ${targetState ? 'activation' : 'shutdown'}.`
    );
    this.notify();
    return { success: true };
  }

  public setValve(targetState: boolean): { success: boolean; reason?: string } {
    if (targetState) {
      if (this.state.turbidityStatus === 'DIRTY') {
        return { success: false, reason: 'Interlock active: Solenoid valve locked CLOSED due to DIRTY water!' };
      }
      if (this.state.objectDetected) {
        return { success: false, reason: 'Interlock active: Solenoid valve locked CLOSED due to object at inlet!' };
      }
    }

    this.state.valve = targetState;
    this.logEvent(
      'INFO', 
      targetState ? 'Valve Opened (Manual)' : 'Valve Closed (Manual)', 
      `Inlet solenoid valve ${targetState ? 'opened' : 'closed'} by user.`
    );
    this.notify();
    return { success: true };
  }

  public setMode(mode: OperationMode) {
    this.state.mode = mode;
    this.logEvent(
      'INFO', 
      `Mode Changed to ${mode}`, 
      `Operation control switched to ${mode} mode.`
    );
    this.notify();
  }

  public isDirtyForced(): boolean {
    return this.isUserForcedDirty;
  }

  public isObjectForced(): boolean {
    return this.isUserForcedObject;
  }

  public isOfflineForced(): boolean {
    return this.isForcedOffline;
  }
}

export const simulationEngine = new SimulationEngine();
