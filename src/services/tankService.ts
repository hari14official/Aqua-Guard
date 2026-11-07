import { ref, onValue, set, push } from 'firebase/database';
import { getFirebaseDB, isFirebaseConfigured } from './firebase';
import { simulationEngine } from './simulationEngine';
import { TankLiveState, TankHistoryItem, TankEvent, OperationMode, SmartAlert } from '../types/tank';

class TankService {
  private useFirebase: boolean = false;
  private subscribers: Array<(state: TankLiveState) => void> = [];
  private currentState: TankLiveState | null = null;
  private prevState: TankLiveState | null = null;
  private offlineCheckInterval: number | null = null;

  // Real-time tracking buffers for live Firebase hardware
  private firebaseHistory: TankHistoryItem[] = [];
  private firebaseEvents: TankEvent[] = [];
  private firebaseAlerts: SmartAlert[] = [];

  constructor() {
    // Check if Firebase is configured via .env AND mode is not explicitly forced to SIMULATION
    const envFirebase = isFirebaseConfigured();
    const forceSim = import.meta.env.VITE_FORCE_SIMULATION === 'true';

    this.useFirebase = envFirebase && !forceSim;

    if (this.useFirebase) {
      this.initFirebaseListeners();
    } else {
      this.initSimulationListeners();
    }

    // Monitor for 10-second data timeout
    this.startOfflineDetector();
  }

  public isFirebaseMode(): boolean {
    return this.useFirebase;
  }

  public setModeType(useFirebase: boolean) {
    if (useFirebase && !isFirebaseConfigured()) {
      throw new Error('Firebase credentials are not configured in .env');
    }
    this.useFirebase = useFirebase;
    if (this.useFirebase) {
      this.initFirebaseListeners();
    } else {
      this.initSimulationListeners();
    }
  }

  private initSimulationListeners() {
    simulationEngine.subscribe((state) => {
      this.currentState = state;
      this.notifySubscribers(state);
    });
  }

  private initFirebaseListeners() {
    const db = getFirebaseDB();
    if (!db) {
      this.useFirebase = false;
      this.initSimulationListeners();
      return;
    }

    const liveRef = ref(db, 'tank/live');
    onValue(liveRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const liveState: TankLiveState = {
          levelState: data.levelState || 'MID',
          levelPercent: data.levelPercent ?? (data.levelState === 'LOW' ? 15 : data.levelState === 'FULL' ? 95 : 50),
          lowSensor: Boolean(data.lowSensor),
          fullSensor: Boolean(data.fullSensor),
          turbidityVoltage: Number(data.turbidityVoltage || 4.1),
          turbidityNTU: Number(data.turbidityNTU || 5),
          turbidityStatus: data.turbidityStatus || (Number(data.turbidityVoltage || 4.1) < 2.5 ? 'DIRTY' : Number(data.turbidityVoltage || 4.1) < 3.5 ? 'CLOUDY' : 'CLEAR'),
          objectDetected: Boolean(data.objectDetected),
          pump: Boolean(data.pump),
          valve: Boolean(data.valve),
          alarm: Boolean(data.alarm),
          mode: data.mode || 'AUTO',
          systemState: data.systemState || 'IDLE_NORMAL',
          systemStateLabel: data.systemStateLabel || 'Live ESP32 Connected',
          pumpRunSeconds: Number(data.pumpRunSeconds || 0),
          fillCycles: Number(data.fillCycles || 0),
          contaminationEvents: Number(data.contaminationEvents || 0),
          wifiRssi: Number(data.wifiRssi || -65),
          isOnline: true,
          lastSeen: Number(data.lastSeen || Date.now())
        };

        // Append historical time point
        const timeNow = Date.now();
        const historyPoint: TankHistoryItem = {
          timestamp: timeNow,
          timeLabel: new Date(timeNow).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          levelPercent: liveState.levelPercent,
          turbidityVoltage: liveState.turbidityVoltage,
          pumpState: liveState.pump,
          valveState: liveState.valve
        };
        this.firebaseHistory.push(historyPoint);
        if (this.firebaseHistory.length > 25) this.firebaseHistory.shift();

        // Process state transitions for live alerts & events
        if (this.prevState) {
          const prev = this.prevState;

          // 1. Turbidity Contamination Spike
          if (liveState.turbidityStatus === 'DIRTY' && prev.turbidityStatus !== 'DIRTY') {
            this.addFirebaseAlert('HIGH', 'Turbidity Contamination Alert', `Inflowing water quality degraded (${liveState.turbidityNTU} NTU). Inlet valve automatically clamped shut.`);
            this.addFirebaseEvent('CRITICAL', 'Contamination Detected', `Turbidity sensor triggered: ${liveState.turbidityVoltage.toFixed(2)}V (${liveState.turbidityNTU} NTU).`);
          }

          // 2. IR Lid Tampering / Intrusion
          if (liveState.objectDetected && !prev.objectDetected) {
            this.addFirebaseAlert('HIGH', 'Lid Tampering / Intrusion Alert', 'Top access hatch opened or unauthorized object detected. Hardware buzzer sounding.');
            this.addFirebaseEvent('CRITICAL', 'Lid Opened', 'IR proximity sensor triggered at tank cover.');
          }

          // 3. Low Water Threshold reached
          if (liveState.levelPercent <= 20 && prev.levelPercent > 20) {
            this.addFirebaseAlert('MEDIUM', 'Low Water Level', 'Tank depleted to 20%. Refill sequence initiated.');
            this.addFirebaseEvent('WARNING', 'Low Level (20%)', 'LOW probe un-submerged.');
          }

          // 4. Full Water Threshold reached
          if (liveState.levelPercent >= 90 && prev.levelPercent < 90) {
            this.addFirebaseAlert('LOW', 'Tank Full', 'Tank reached 90% capacity. Inlet valve closed.');
            this.addFirebaseEvent('INFO', 'Tank Full (90%)', 'FULL probe submerged. Auto cutoff asserted.');
          }

          // 5. Pump State Change
          if (liveState.pump !== prev.pump) {
            this.addFirebaseEvent(liveState.pump ? 'INFO' : 'WARNING', liveState.pump ? 'Pump Started' : 'Pump Stopped', liveState.pump ? 'Distribution pump started.' : 'Pump deactivated.');
          }
        }

        this.prevState = liveState;
        this.currentState = liveState;
        this.notifySubscribers(liveState);
      }
    }, (error: any) => {
      console.warn("Firebase live stream read error:", error);
    });
  }

  private startOfflineDetector() {
    if (this.offlineCheckInterval) clearInterval(this.offlineCheckInterval);
    
    this.offlineCheckInterval = window.setInterval(() => {
      if (!this.currentState) return;

      const elapsed = Date.now() - this.currentState.lastSeen;
      const isNowOffline = elapsed > 10000; // 10 seconds timeout

      if (isNowOffline && this.currentState.isOnline) {
        this.currentState = {
          ...this.currentState,
          isOnline: false,
          systemStateLabel: 'Gateway / Sensor Offline'
        };
        this.notifySubscribers(this.currentState);
      } else if (!isNowOffline && !this.currentState.isOnline) {
        this.currentState = {
          ...this.currentState,
          isOnline: true
        };
        this.notifySubscribers(this.currentState);
      }
    }, 1000);
  }

  public subscribe(callback: (state: TankLiveState) => void): () => void {
    this.subscribers.push(callback);
    if (this.currentState) {
      callback(this.currentState);
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(state: TankLiveState) {
    this.subscribers.forEach(cb => cb(state));
  }

  public getState(): TankLiveState {
    if (this.currentState) return this.currentState;
    return simulationEngine.getState();
  }

  private addFirebaseAlert(severity: 'HIGH' | 'MEDIUM' | 'LOW', title: string, message: string) {
    const alert: SmartAlert = {
      id: `live-alt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: Date.now(),
      severity,
      title,
      message,
      read: false
    };
    this.firebaseAlerts.unshift(alert);
    if (this.firebaseAlerts.length > 30) this.firebaseAlerts.pop();
  }

  private addFirebaseEvent(type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS', title: string, description: string) {
    const evt: TankEvent = {
      id: `live-evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: Date.now(),
      type,
      title,
      description
    };
    this.firebaseEvents.unshift(evt);
    if (this.firebaseEvents.length > 50) this.firebaseEvents.pop();
  }

  public getHistory(): TankHistoryItem[] {
    if (this.useFirebase && this.firebaseHistory.length > 0) {
      return [...this.firebaseHistory];
    }
    return simulationEngine.getHistory();
  }

  public getEvents(): TankEvent[] {
    if (this.useFirebase) {
      return [...this.firebaseEvents];
    }
    return simulationEngine.getEvents();
  }

  public getAlerts(): SmartAlert[] {
    if (this.useFirebase) {
      return [...this.firebaseAlerts];
    }
    return simulationEngine.getAlerts();
  }

  public markAlertAsRead(id: string) {
    if (this.useFirebase) {
      this.firebaseAlerts = this.firebaseAlerts.map(a => a.id === id ? { ...a, read: true } : a);
      return;
    }
    simulationEngine.markAlertAsRead(id);
  }

  public clearAllAlerts() {
    if (this.useFirebase) {
      this.firebaseAlerts = [];
      return;
    }
    simulationEngine.clearAllAlerts();
  }

  // Actuator Commands
  public async setPump(targetState: boolean): Promise<{ success: boolean; reason?: string }> {
    // Interlock Safety check
    const current = this.getState();
    if (targetState) {
      if (current.turbidityStatus === 'DIRTY') {
        return { success: false, reason: 'Safety Interlock: Cannot start pump with DIRTY water detected!' };
      }
      if (current.levelState === 'FULL' || current.levelPercent >= 90) {
        return { success: false, reason: 'Safety Interlock: Tank is already FULL!' };
      }
    }

    if (this.useFirebase) {
      const db = getFirebaseDB();
      if (db) {
        const cmdRef = push(ref(db, 'tank/commands'));
        await set(cmdRef, {
          command: 'SET_PUMP',
          value: targetState,
          requestedAt: Date.now()
        });
      }
      return { success: true };
    }

    return simulationEngine.setPump(targetState);
  }

  public async setValve(targetState: boolean): Promise<{ success: boolean; reason?: string }> {
    const current = this.getState();
    if (targetState) {
      if (current.turbidityStatus === 'DIRTY') {
        return { success: false, reason: 'Safety Interlock: Inlet solenoid valve locked CLOSED due to DIRTY water!' };
      }
      if (current.objectDetected) {
        return { success: false, reason: 'Safety Interlock: Inlet solenoid valve locked CLOSED due to object at inlet!' };
      }
    }

    if (this.useFirebase) {
      const db = getFirebaseDB();
      if (db) {
        const cmdRef = push(ref(db, 'tank/commands'));
        await set(cmdRef, {
          command: 'SET_VALVE',
          value: targetState,
          requestedAt: Date.now()
        });
      }
      return { success: true };
    }

    return simulationEngine.setValve(targetState);
  }

  public async setMode(mode: OperationMode): Promise<void> {
    if (this.useFirebase) {
      const db = getFirebaseDB();
      if (db) {
        const cmdRef = push(ref(db, 'tank/commands'));
        await set(cmdRef, {
          command: 'SET_MODE',
          value: mode,
          requestedAt: Date.now()
        });
      }
      return;
    }

    simulationEngine.setMode(mode);
  }

  // Viva demonstration triggers
  public toggleSimulationDirty(): boolean {
    return simulationEngine.toggleDirtyWater();
  }

  public toggleSimulationObject(): boolean {
    return simulationEngine.toggleObjectDetected();
  }

  public simulateDrain() {
    simulationEngine.drainTank();
  }

  public simulateFill() {
    simulationEngine.fillTank();
  }

  public toggleSimulationOffline(): boolean {
    return simulationEngine.toggleOffline();
  }

  public resetSimulation() {
    simulationEngine.resetSimulation();
  }

  public isDirtyForced(): boolean {
    return simulationEngine.isDirtyForced();
  }

  public isObjectForced(): boolean {
    return simulationEngine.isObjectForced();
  }

  public isOfflineForced(): boolean {
    return simulationEngine.isOfflineForced();
  }

  public async submitContactMessage(name: string, email: string, message: string): Promise<boolean> {
    if (this.useFirebase) {
      const db = getFirebaseDB();
      if (db) {
        const msgRef = push(ref(db, 'messages'));
        await set(msgRef, {
          name,
          email,
          message,
          timestamp: Date.now()
        });
        return true;
      }
    }
    // Simulation mode: pretend success and log
    console.log(`[Contact Form - Simulated Dispatch] From: ${name} (${email}): ${message}`);
    return true;
  }
}

export const tankService = new TankService();
