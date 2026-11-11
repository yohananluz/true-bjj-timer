/**
 * Motor de Áudio para Tatame de Jiu-Jitsu via Web Audio API.
 * 
 * Totalmente autônomo e offline (sem arquivos de áudio externos para falharem).
 * Baixíssima latência e alta fidelidade acústica.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private voiceEnabled: boolean = (() => {
    try {
      const saved = localStorage.getItem('bjj_timer_voice_enabled');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true; // Voz ativada por padrão
  })();
  private masterCompressor: DynamicsCompressorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Compressor mestre para maximizar a presença e volume dos sons
   * sem distorção ou estalos em caixas de som de TV e celulares.
   */
  private getMasterOutput(): AudioNode {
    this.initContext();
    if (!this.masterCompressor && this.ctx) {
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterCompressor.connect(this.ctx.destination);
    }
    return this.masterCompressor || this.ctx!.destination;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    try {
      localStorage.setItem('bjj_timer_voice_enabled', JSON.stringify(enabled));
    } catch {}
  }

  public getVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  /**
   * Comando de Voz de Arbitragem em Português (Web Speech API)
   */
  public speak(text: string) {
    if (this.isMuted || !this.voiceEnabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;
        utterance.pitch = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Dispositivo sem suporte
      }
    }
  }

  public vibrate(pattern: number | number[] = 200) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Dispositivo sem suporte
      }
    }
  }

  /**
   * Toca o Alerta Sonoro de Início de Rola / Combate.
   * Triplo toque de ringue (DING! DING! DIIING!) combinado com gongo pesado de dojo.
   * Ultra evidente, penetrante e inconfundível para ser ouvido no tatame inteiro.
   */
  public playStartGong() {
    this.vibrate([150, 100, 150, 100, 500]);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();
    const now = this.ctx.currentTime;

    const playStrike = (timeOffset: number, isFinalLong: boolean = false) => {
      const strikeTime = now + timeOffset;

      // 1. Harmônicos de sino de bronze metálico brilhante (para cortar barulho alto de conversa)
      const brightPartials = [
        { freq: 880, gain: 0.9, decay: isFinalLong ? 3.0 : 0.35 },
        { freq: 1760, gain: 0.75, decay: isFinalLong ? 2.4 : 0.28 },
        { freq: 2640, gain: 0.5, decay: isFinalLong ? 1.8 : 0.2 },
        { freq: 3520, gain: 0.35, decay: isFinalLong ? 1.2 : 0.15 },
        { freq: 5280, gain: 0.2, decay: isFinalLong ? 0.8 : 0.1 },
      ];

      brightPartials.forEach(({ freq, gain, decay }) => {
        const osc = this.ctx!.createOscillator();
        const gainNode = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, strikeTime);

        gainNode.gain.setValueAtTime(gain, strikeTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, strikeTime + decay);

        osc.connect(gainNode);
        gainNode.connect(output);

        osc.start(strikeTime);
        osc.stop(strikeTime + decay);
      });

      // 2. Impacto percussivo metálico (martelo no sino)
      const strikeAttack = this.ctx!.createOscillator();
      const strikeGain = this.ctx!.createGain();
      strikeAttack.type = 'triangle';
      strikeAttack.frequency.setValueAtTime(1400, strikeTime);
      strikeAttack.frequency.exponentialRampToValueAtTime(250, strikeTime + 0.04);
      strikeGain.gain.setValueAtTime(0.85, strikeTime);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.05);

      strikeAttack.connect(strikeGain);
      strikeGain.connect(output);
      strikeAttack.start(strikeTime);
      strikeAttack.stop(strikeTime + 0.05);

      // 3. No último toque: som de Gongo de Dojo com sub-graves profundos e reverberantes
      if (isFinalLong) {
        const subHarmonics = [
          { freq: 110, gain: 1.0, decay: 3.5 },
          { freq: 220, gain: 0.9, decay: 3.2 },
          { freq: 330, gain: 0.7, decay: 2.8 },
          { freq: 440, gain: 0.6, decay: 2.2 },
        ];

        subHarmonics.forEach(({ freq, gain, decay }) => {
          const subOsc = this.ctx!.createOscillator();
          const subGain = this.ctx!.createGain();

          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(freq, strikeTime);

          subGain.gain.setValueAtTime(gain, strikeTime);
          subGain.gain.exponentialRampToValueAtTime(0.0001, strikeTime + decay);

          subOsc.connect(subGain);
          subGain.connect(output);

          subOsc.start(strikeTime);
          subOsc.stop(strikeTime + decay);
        });
      }
    };

    // Sequência de 3 toques nítidos de ringue de combate:
    // Toque 1: Ding!
    playStrike(0, false);
    // Toque 2: Ding! (280ms depois)
    playStrike(0.28, false);
    // Toque 3: DIIIIINGGGG! (560ms depois, com gongo de dojo longo sustentado)
    playStrike(0.56, true);

    // Voz do árbitro oficial: "Exercício!"
    setTimeout(() => {
      this.speak('Exercício!');
    }, 700);
  }

  /**
   * Toca o Clapper de 10 Segundos (Batedor de Madeira Tradicional de BJJ)
   * Dois estalos secos de madeira ritmados (Clap - Clap)
   */
  public playClapper() {
    this.vibrate([70, 90, 70]);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();

    const playSingleClap = (timeOffset: number) => {
      const now = this.ctx!.currentTime + timeOffset;

      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gainNode.gain.setValueAtTime(1.0, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1050, now);
      filter.Q.setValueAtTime(4.5, now);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(output);

      osc.start(now);
      osc.stop(now + 0.08);

      // Clique de impacto de madeira
      const clickOsc = this.ctx!.createOscillator();
      const clickGain = this.ctx!.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(2000, now);
      clickGain.gain.setValueAtTime(0.6, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      clickOsc.connect(clickGain);
      clickGain.connect(output);
      clickOsc.start(now);
      clickOsc.stop(now + 0.03);
    };

    playSingleClap(0);
    playSingleClap(0.16);

    setTimeout(() => {
      this.speak('Dez segundos!');
    }, 350);
  }

  /**
   * Toca a Buzina de Fim de Round (Buzina estridente clássica de arena)
   */
  public playEndHorn() {
    this.vibrate([400, 100, 400]);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();
    const now = this.ctx.currentTime;
    const duration = 1.7;

    const freqA = 220;
    const freqB = 224;

    [freqA, freqB].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.85, now + 0.03);
      gainNode.gain.setValueAtTime(0.85, now + duration - 0.2);
      gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(output);

      osc.start(now);
      osc.stop(now + duration);
    });

    // Voz de arbitragem ao terminar o round: "Descansar!"
    setTimeout(() => {
      this.speak('Descansar!');
    }, 600);
  }

  /**
   * Bip penetrante para contagem regressiva de preparação (3, 2, 1)
   */
  public playCountdownBeep(isFinal: boolean = false) {
    this.vibrate(80);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();
    const now = this.ctx.currentTime;

    const mainFreq = isFinal ? 1320 : 980;
    const overtoneFreq = isFinal ? 2640 : 1960;
    const duration = isFinal ? 0.4 : 0.18;

    [mainFreq, overtoneFreq].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const gain = idx === 0 ? 0.8 : 0.4;
      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(output);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * Apito de Alerta Esportivo (estilo árbitro / timer)
   * Dispara um apito nítido e penetrante para contagem regressiva de segundos
   */
  public playWhistleAlert(isFinal: boolean = false) {
    this.vibrate(isFinal ? 120 : 60);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();
    const now = this.ctx.currentTime;
    const duration = isFinal ? 0.28 : 0.16;

    // Frequências penetrantes características de apito esportivo
    const baseFreq = isFinal ? 2800 : 2550;
    const secondFreq = isFinal ? 3100 : 2820;

    [baseFreq, secondFreq].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Tremolo / modulação rápida simulando o ar do apito (36Hz)
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(36, now);
      lfoGain.gain.setValueAtTime(0.2, now);
      lfo.connect(lfoGain.gain);

      // Envelope percussivo de apito
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.75, now + 0.015);
      gainNode.gain.setValueAtTime(0.75, now + duration - 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime((baseFreq + secondFreq) / 2, now);
      filter.Q.setValueAtTime(3.5, now);

      osc.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(output);

      osc.start(now);
      lfo.start(now);
      osc.stop(now + duration);
      lfo.stop(now + duration);
    });
  }

  /**
   * Som de Descanso Concluído (Três notas em ascensão avisando retorno ao tatame)
   */
  public playRestEndChime() {
    this.vibrate([150, 80, 150]);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();
    const now = this.ctx.currentTime;
    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.16 }, // E5
      { freq: 783.99, time: 0.32 }, // G5
    ];

    notes.forEach(({ freq, time }) => {
      const noteTime = now + time;
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gainNode.gain.setValueAtTime(0.65, noteTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gainNode);
      gainNode.connect(output);

      osc.start(noteTime);
      osc.stop(noteTime + 0.65);
    });
  }

  /**
   * Fanfarra final ao encerrar todos os rounds do treino
   */
  public playWorkoutComplete() {
    this.vibrate([200, 100, 200, 100, 500]);
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const output = this.getMasterOutput();
    const now = this.ctx.currentTime;
    const notes = [
      { freq: 440.00, time: 0, dur: 0.2 },
      { freq: 554.37, time: 0.2, dur: 0.2 },
      { freq: 659.25, time: 0.4, dur: 0.2 },
      { freq: 880.00, time: 0.6, dur: 1.2 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const noteTime = now + time;
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gainNode.gain.setValueAtTime(0.75, noteTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

      osc.connect(gainNode);
      gainNode.connect(output);

      osc.start(noteTime);
      osc.stop(noteTime + dur);
    });
  }
}

export const soundService = new SoundService();
