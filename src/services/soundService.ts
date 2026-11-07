// ==============================================================================
// AquaGuard - Web Audio API Real-Time Sound & Alert Dispatcher
// Generates synthesised audio alerts without external audio file dependencies.
// Default configuration: 5 repetitions with 2-second (2000ms) interval gap.
// ==============================================================================

class SoundService {
  private audioCtx: AudioContext | null = null;
  private muted: boolean = false;
  private activeTimers: number[] = [];

  constructor() {
    // Check if user previously muted
    const stored = localStorage.getItem('aquaguard_sound_muted');
    if (stored !== null) {
      this.muted = stored === 'true';
    }
    this.attachUnlockListeners();
  }

  /**
   * Resumes suspended AudioContext on the first user interaction (browser autoplay compliance)
   */
  private attachUnlockListeners() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    };
    window.addEventListener('click', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
  }

  private getAudioContext(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Helper to play an audio synthesizer sound multiple times with a fixed gap.
   * By default: 5 times with a 2-second gap (2000ms).
   */
  private playSequence(soundFn: () => void, count: number = 5, gapMs: number = 2000) {
    if (this.muted || count <= 0) return;

    // Silence any currently scheduled repetitions so sequences don't pile up
    this.stopAll();

    // Play first iteration immediately
    soundFn();

    // Schedule remaining repetitions (count - 1) with gapMs interval
    for (let i = 1; i < count; i++) {
      const timerId = window.setTimeout(() => {
        this.activeTimers = this.activeTimers.filter((id) => id !== timerId);
        if (!this.muted) {
          soundFn();
        }
      }, i * gapMs);
      this.activeTimers.push(timerId);
    }
  }

  /**
   * Single burst of high-priority pulsating alarm:
   * 3 urgent alternating frequency pulses (880Hz -> 698Hz -> 880Hz).
   */
  public playAlarmSingle() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pulses = [
        { freq: 880, delay: 0.00, dur: 0.16 },
        { freq: 698, delay: 0.20, dur: 0.16 },
        { freq: 880, delay: 0.40, dur: 0.22 },
      ];

      pulses.forEach(({ freq, delay, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + delay);

        // Attack and decay
        gain.gain.setValueAtTime(0.18, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + dur);
      });
    } catch (err) {
      console.warn('Audio Context playback error:', err);
    }
  }

  /**
   * Single gentle affirmative notification chime:
   * Smooth sine sweep (523.25Hz -> 1046.50Hz).
   */
  public playNotificationSingle() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.14); // C6

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (err) {
      console.warn('Audio Notification error:', err);
    }
  }

  /**
   * Single warning chime:
   * Two distinct tones (D5 -> A5).
   */
  public playWarningSingle() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const beeps = [
        { freq: 587.33, delay: 0.0, dur: 0.14 }, // D5
        { freq: 880.0, delay: 0.16, dur: 0.18 }, // A5
      ];

      beeps.forEach(({ freq, delay, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.14, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + dur);
      });
    } catch (err) {
      console.warn('Audio Warning playback error:', err);
    }
  }

  /**
   * High-priority pulsating alarm for critical safety hazards:
   * Turbidity contamination, lid intrusion / tampering, or emergency stops.
   * Plays 5 times with a 2-second gap (2000ms) by default.
   */
  public playAlarm(count: number = 5, gapMs: number = 2000) {
    this.playSequence(() => this.playAlarmSingle(), count, gapMs);
  }

  /**
   * General alert sound - alias for playAlarm.
   * Plays 5 times with a 2-second gap (2000ms) by default.
   */
  public playAlert(count: number = 5, gapMs: number = 2000) {
    this.playAlarm(count, gapMs);
  }

  /**
   * Warning chime for low water level, dry-run lockout, or gateway disconnect.
   * Plays 5 times with a 2-second gap (2000ms) by default.
   */
  public playWarning(count: number = 5, gapMs: number = 2000) {
    this.playSequence(() => this.playWarningSingle(), count, gapMs);
  }

  /**
   * Affirmative notification chime for tank full, valve opened, or gateway reconnect.
   * Plays 5 times with a 2-second gap (2000ms) by default.
   */
  public playNotification(count: number = 5, gapMs: number = 2000) {
    this.playSequence(() => this.playNotificationSingle(), count, gapMs);
  }

  /**
   * Cancels all scheduled audio timers immediately.
   */
  public stopAll() {
    this.activeTimers.forEach((timerId) => window.clearTimeout(timerId));
    this.activeTimers = [];
  }

  /**
   * Returns whether a sound sequence is currently active.
   */
  public isPlaying(): boolean {
    return this.activeTimers.length > 0;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('aquaguard_sound_muted', String(this.muted));
    if (this.muted) {
      this.stopAll();
    } else {
      this.playNotificationSingle(); // 1 single gentle chime for audible un-mute confirmation
    }
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('aquaguard_sound_muted', String(muted));
    if (muted) {
      this.stopAll();
    }
  }
}

export const soundService = new SoundService();
