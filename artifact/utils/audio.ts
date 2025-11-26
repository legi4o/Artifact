export class AudioEngine {
  private static instance: AudioEngine;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceOscillators: OscillatorNode[] = [];
  private ambienceGain: GainNode | null = null;
  public isMuted: boolean = true;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.4; // Master volume
    this.masterGain.connect(this.ctx.destination);

    // Create a separate gain for ambience to control it independently
    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.value = 0; // Start silent
    this.ambienceGain.connect(this.masterGain);
  }

  public async toggleMute(): Promise<boolean> {
    if (!this.ctx) this.init();
    
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbience();
    } else {
      this.stopAmbience();
    }

    return this.isMuted;
  }

  private startAmbience() {
    if (!this.ctx || !this.ambienceGain) return;
    
    // Fade in
    const now = this.ctx.currentTime;
    this.ambienceGain.gain.cancelScheduledValues(now);
    this.ambienceGain.gain.linearRampToValueAtTime(0.15, now + 2);

    if (this.ambienceOscillators.length > 0) return;

    // Create a deep, ethereal drone using multiple low-frequency oscillators
    const freqs = [55, 110, 165]; // Harmonic series (A1, A2, E3 approx)
    
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.ambienceGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      
      // Slight detuning for richness
      osc.detune.value = Math.random() * 10 - 5;

      // Add simple LFO for movement
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (Math.random() * 0.05);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 2; // Detune amount
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start();

      oscGain.gain.value = 0.1 / (i + 1);
      
      osc.connect(oscGain);
      oscGain.connect(this.ambienceGain);
      osc.start();
      this.ambienceOscillators.push(osc);
    });
  }

  private stopAmbience() {
    if (!this.ctx || !this.ambienceGain) return;
    const now = this.ctx.currentTime;
    // Fade out
    this.ambienceGain.gain.cancelScheduledValues(now);
    this.ambienceGain.gain.linearRampToValueAtTime(0, now + 1);
    
    // Clean up oscillators after fade
    setTimeout(() => {
      this.ambienceOscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      this.ambienceOscillators = [];
    }, 1000);
  }

  public playHover() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High, airy sine wave
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(now + 0.15);
  }

  public playClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Softer, lower click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(now + 0.1);
  }

  public playInteraction() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    // Subtle "swish" or shimmer
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.3);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(now + 0.3);
  }
}
