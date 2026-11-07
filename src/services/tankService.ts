import { ref, onValue, set, push } from 'firebase/database';
import { getFirebaseDB, isFirebaseConfigured } from './firebase';
import { simulationEngine } from './simulationEngine';
import { TankLiveState, TankHistoryItem, TankEvent, OperationMode, SmartAlert } from '../types/tank';

class TankService {
  private useFirebase: boolean = false;
  private subscribers: Array<(state: TankLiveState) => void> = [];
  private currentState: TankLiveState | null = null;
  private offlineCheckInterval: number | null = null;

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
          turbidityStatus: data.turbidityStatus || 'CLEAR',
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

  public getHistory(): TankHistoryItem[] {
    return simulationEngine.getHistory();
  }

  public getEvents(): TankEvent[] {
    return simulationEngine.getEvents();
  }

  public getAlerts(): SmartAlert[] {
    return simulationEngine.getAlerts();
  }

  public markAlertAsRead(id: string) {
    simulationEngine.markAlertAsRead(id);
  }

  public clearAllAlerts() {
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
