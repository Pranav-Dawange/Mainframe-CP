// Realistic Cat Vocalization Engine supporting Neutral, Sad, and Excited states
class RealisticCatAudio {
  constructor() {
    this.audioCache = {};
    this.lastPlayTime = 0;
    this.ctx = null;
  }

  init() {
    if (typeof window === 'undefined') return;
    const sounds = {
      neutral: '/audio/c_purr.wav',
      sad: '/audio/c_exited.wav',
      excited: '/audio/cat_excited.wav',
      meow: '/audio/cat_neutral.wav',
      chirp: '/audio/curious_chirp.wav',
      purr: '/audio/cat_purr.ogg'
    };

    Object.entries(sounds).forEach(([key, path]) => {
      if (!this.audioCache[key]) {
        try {
          const a = new Audio(path);
          a.preload = 'auto';
          this.audioCache[key] = a;
        } catch (e) {}
      }
    });

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && !this.ctx) {
      this.ctx = new AudioCtx();
    }
  }

  play(type = 'neutral', volume = 0.6) {
    const now = Date.now();
    // Prevent overlapping rapid click spam
    if (now - this.lastPlayTime < 240) return;
    this.lastPlayTime = now;

    this.init();
    const sound = this.audioCache[type] || this.audioCache['neutral'];
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.volume = volume;
        sound.play().catch(() => {
          this.synthesizeFallback(type);
        });
        return;
      } catch (e) {}
    }
    this.synthesizeFallback(type);
  }

  // Realistic synthesized fallback using Web Audio API
  synthesizeFallback(type) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'sad') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.55);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'excited' || type === 'happy') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(920, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.38);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      } else {
        // neutral meow
        osc.type = 'sine';
        osc.frequency.setValueAtTime(390, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.45);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {}
  }
}

export const catAudio = new RealisticCatAudio();
