class AudioManager {
  private ctx: AudioContext | null = null;
  private musicAudio: HTMLAudioElement | null = null;
  private musicPlaying = false;
  private musicEnabled = true;
  private sfxEnabled = true;
  private musicVolume = 0.5;
  private sfxVolume = 0.8;
  private currentTrack: 'sirocco_velocity' | 'ready_to_play' = 'sirocco_velocity';
  private tensionOsc: OscillatorNode | null = null;
  private tensionGain: GainNode | null = null;
  private synthMusicTimer: number | null = null;
  private synthMusicGain: GainNode | null = null;
  private isSynthMusicPlaying = false;

  constructor() {
    // Load stored audio preferences
    try {
      const storedM = localStorage.getItem('shooser_music_enabled');
      if (storedM !== null) this.musicEnabled = storedM === 'true';
      const storedS = localStorage.getItem('shooser_sfx_enabled');
      if (storedS !== null) this.sfxEnabled = storedS === 'true';
      const storedMVol = localStorage.getItem('shooser_music_volume');
      if (storedMVol) this.musicVolume = parseFloat(storedMVol);
      const storedSVol = localStorage.getItem('shooser_sfx_volume');
      if (storedSVol) this.sfxVolume = parseFloat(storedSVol);
    } catch {
      // LocalStorage access fallback
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --- Sound Effects ---

  // quack_5: Button click sound
  public playQuack() {
    if (!this.sfxEnabled) return;
    this.playSoundWithFallback('/assets/quack_5.mp3', () => this.synthQuack());
  }

  // yyy_ahqVbsA: Delete player sound (funny descending wobble slide)
  public playDeletePlayer() {
    if (!this.sfxEnabled) return;
    this.playSoundWithFallback('/assets/yyy_ahqVbsA.mp3', () => this.synthDeleteSlide());
  }

  // faaah.mp3: Selection start sound ("FAAAAH!")
  public playFaaah() {
    if (!this.sfxEnabled) return;
    this.playSoundWithFallback('/assets/faaah.mp3', () => this.synthFaaah());
  }

  // suuuuui.mp3: Winner reveal sound ("SUUUU-III!")
  public playSiuuu() {
    if (!this.sfxEnabled) return;
    this.playSoundWithFallback('/assets/suuuuui.mp3', () => this.synthSiuuu());
  }

  // dry-fart.mp3: Special dare/truth comical sound
  public playDryFart() {
    if (!this.sfxEnabled) return;
    this.playSoundWithFallback('/assets/dry-fart.mp3', () => this.synthDryFart());
  }

  public playTouchPop(freq = 440) {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Finger tension sound (3 to 6s tension loop)
  public startTensionSound(durationSec = 4.5) {
    if (!this.sfxEnabled) return;
    this.stopTensionSound();
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.tensionOsc = this.ctx.createOscillator();
    this.tensionGain = this.ctx.createGain();

    this.tensionOsc.type = 'sawtooth';
    this.tensionOsc.frequency.setValueAtTime(110, now);
    this.tensionOsc.frequency.exponentialRampToValueAtTime(360, now + durationSec);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + durationSec);

    this.tensionGain.gain.setValueAtTime(0.01, now);
    this.tensionGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.28, now + 1.0);

    this.tensionOsc.connect(filter);
    filter.connect(this.tensionGain);
    this.tensionGain.connect(this.ctx.destination);

    this.tensionOsc.start(now);
  }

  public stopTensionSound() {
    if (this.tensionOsc) {
      try {
        this.tensionOsc.stop();
        this.tensionOsc.disconnect();
      } catch {
        // ignore
      }
      this.tensionOsc = null;
    }
    if (this.tensionGain) {
      try {
        this.tensionGain.disconnect();
      } catch {
        // ignore
      }
      this.tensionGain = null;
    }
  }

  // Sound fallback helper
  private playSoundWithFallback(url: string, synthFallback: () => void) {
    const audio = new Audio(url);
    audio.volume = this.sfxVolume;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to Web Audio synthesis
        synthFallback();
      });
    }
  }

  // Synthesizers using Web Audio API:
  private synthQuack() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.14);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  private synthDeleteSlide() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.28);

    gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  private synthFaaah() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.5);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(360, now);
    osc2.frequency.exponentialRampToValueAtTime(130, now + 0.5);

    gain.gain.setValueAtTime(this.sfxVolume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.55);
    osc2.stop(now + 0.55);
  }

  private synthSiuuu() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // High energy ascending hype celebration
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.8);

    gain.gain.setValueAtTime(this.sfxVolume * 0.85, now);
    gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.9, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  }

  private synthDryFart() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Noise buffer for flutter
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.05);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.38);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.4);
  }

  // --- Background Music ---

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    try {
      localStorage.setItem('shooser_music_enabled', String(this.musicEnabled));
    } catch {}
    if (this.musicEnabled) {
      this.playMusic();
    } else {
      this.pauseMusic();
    }
    return this.musicEnabled;
  }

  public setMusicTrack(track: 'sirocco_velocity' | 'ready_to_play') {
    this.currentTrack = track;
    if (this.musicPlaying) {
      this.pauseMusic();
      this.playMusic();
    }
  }

  public playMusic() {
    if (!this.musicEnabled) return;
    const src = this.currentTrack === 'sirocco_velocity'
      ? '/assets/sirocco_velocity.mp3'
      : '/assets/ready_to_play.mp4';

    if (!this.musicAudio || this.musicAudio.src !== window.location.origin + src) {
      if (this.musicAudio) {
        this.musicAudio.pause();
      }
      this.musicAudio = new Audio(src);
      this.musicAudio.loop = true;
      this.musicAudio.volume = this.musicVolume;
    }

    const promise = this.musicAudio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          this.musicPlaying = true;
          this.stopSynthMusic();
        })
        .catch(() => {
          // File not found or blocked by browser -> fallback to rich procedural party synth!
          this.musicPlaying = true;
          this.startSynthMusic();
        });
    } else {
      this.startSynthMusic();
    }
  }

  public pauseMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    this.stopSynthMusic();
    this.musicPlaying = false;
  }

  // Fallback Procedural Algerian Party Music Generator (Web Audio API)
  private startSynthMusic() {
    if (!this.musicEnabled || this.isSynthMusicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isSynthMusicPlaying = true;
    let step = 0;
    const bpm = this.currentTrack === 'sirocco_velocity' ? 122 : 128;
    const stepTime = (60 / bpm) / 4; // 16th notes

    // Bass notes for Rai groove in D minor: D, F, G, A
    const bassFreqs = [146.83, 146.83, 174.61, 196.00, 146.83, 220.00, 196.00, 174.61];

    const playStep = () => {
      if (!this.isSynthMusicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = this.musicVolume * 0.25;

      // Kick drum on 1, 5, 9, 13
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        kickGain.gain.setValueAtTime(vol * 1.2, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.14);
      }

      // Snare / Clap on 4, 12
      if (step % 8 === 4) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, now);
        snareGain.gain.setValueAtTime(vol * 0.7, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        snareOsc.connect(snareGain);
        snareGain.connect(this.ctx.destination);
        snareOsc.start(now);
        snareOsc.stop(now + 0.1);
      }

      // Shaker / Hi-hat on every 16th
      if (step % 2 === 1) {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = 'highpass' as unknown as OscillatorType;
        hatOsc.frequency.setValueAtTime(8000, now);
        hatGain.gain.setValueAtTime(vol * 0.15, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        hatOsc.connect(hatGain);
        hatGain.connect(this.ctx.destination);
        hatOsc.start(now);
        hatOsc.stop(now + 0.04);
      }

      // Melodic Rai Bassline
      if (step % 2 === 0) {
        const bassNote = bassFreqs[(step / 2) % bassFreqs.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassNote / 2, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.18);

        bassGain.gain.setValueAtTime(vol * 0.6, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        bassOsc.connect(filter);
        filter.connect(bassGain);
        bassGain.connect(this.ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.18);
      }

      step = (step + 1) % 32;
    };

    this.synthMusicTimer = window.setInterval(playStep, stepTime * 1000);
  }

  private stopSynthMusic() {
    this.isSynthMusicPlaying = false;
    if (this.synthMusicTimer !== null) {
      clearInterval(this.synthMusicTimer);
      this.synthMusicTimer = null;
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume;
    }
    try {
      localStorage.setItem('shooser_music_volume', String(this.musicVolume));
    } catch {}
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('shooser_sfx_volume', String(this.sfxVolume));
    } catch {}
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    try {
      localStorage.setItem('shooser_sfx_enabled', String(this.sfxEnabled));
    } catch {}
    return this.sfxEnabled;
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public isSfxOn(): boolean {
    return this.sfxEnabled;
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public getCurrentTrack(): string {
    return this.currentTrack;
  }
}

export const audioManager = new AudioManager();
