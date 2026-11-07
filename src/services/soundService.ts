// ==============================================================================
// AquaGuard - Web Audio API Real-Time Sound & Alert Dispatcher
// Generates synthesised audio alerts without external audio file dependencies.
// ==============================================================================

class SoundService {
  private audioCtx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check if user previously muted
    const stored = localStorage.getItem('aquaguard_sound_muted');
    if (stored !== null) {
      this.muted = stored === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (this.muted) return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * High-priority pulsating alarm for critical safety hazards:
   * Turbidity contamination, lid intrusion / tampering, or emergency stops.
   */
  public playAlarm() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 3 urgent alternating frequency pulses (880Hz -> 698Hz -> 880Hz)
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
      console.warn("Audio Context playback error:", err);
    }
  }

  /**
   * Warning chime for low water level, dry-run lockout, or gateway disconnect.
   */
  public playWarning() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const beeps = [
        { freq: 587.33, delay: 0.00, dur: 0.14 }, // D5
        { freq: 880.00, delay: 0.16, dur: 0.18 }, // A5
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
      console.warn("Audio Warning playback error:", err);
    }
  }

  /**
   * Gentle affirmative chime for tank full, valve opened, or gateway reconnect.
   */
  public playNotification() {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.14); // C6

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (err) {
      console.warn("Audio Notification error:", err);
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('aquaguard_sound_muted', String(this.muted));
    if (!this.muted) {
      this.playNotification(); // Audible confirmation of un-mute
    }
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('aquaguard_sound_muted', String(muted));
  }
}

export const soundService = new SoundService();
