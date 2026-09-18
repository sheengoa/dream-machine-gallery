/* 暗厅氛围声 v2：生成式氛围乐（WebAudio 实时合成，零音频素材）。
   Am9 ↔ Fmaj7 两组和声垫缓慢交替，声部独立呼吸 + 立体声展开，
   底噪加空气感，偶发五声音阶「星音」点缀 —— 好听优先于低沉。 */

const PENTATONIC = [440, 493.88, 523.25, 659.25, 783.99];   // A4 B4 C5 E5 G5

export function createAmbient() {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let on = false;
  let sparkleTimer = 0;
  let chordTimer = 0;

  /** 单声部：±4 音分双振荡器（合唱感）→ 呼吸 LFO → 声像 */
  const addVoice = (bus: GainNode, freq: number, gain: number, pan: number, rate: number) => {
    if (!ctx) return;
    for (const cents of [-4, 4]) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = cents;
      const g = ctx.createGain();
      g.gain.value = gain;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = rate;
      const lg = ctx.createGain();
      lg.gain.value = gain * 0.35;
      lfo.connect(lg);
      lg.connect(g.gain);
      lfo.start();
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      osc.connect(g);
      g.connect(p);
      p.connect(bus);
      osc.start();
    }
  };

  /** 偶发星音：五声音阶随机音，1.5s 起、3s 收，随机声像 */
  const scheduleSparkle = () => {
    if (!ctx) return;
    sparkleTimer = window.setTimeout(() => {
      if (!on || !ctx) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
      const g = ctx.createGain();
      const p = ctx.createStereoPanner();
      p.pan.value = Math.random() * 1.2 - 0.6;
      const peak = 0.02 + Math.random() * 0.015;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + 1.5);
      g.gain.linearRampToValueAtTime(0.0001, t + 4.5);
      osc.connect(g);
      g.connect(p);
      p.connect(master!);
      osc.start(t);
      osc.stop(t + 4.6);
      scheduleSparkle();
    }, 5000 + Math.random() * 7000);
  };

  const build = () => {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // 和声垫 A：Am9（A2 E3 A3 B3 C4 E4）
    const busA = ctx.createGain();
    busA.gain.value = 1;
    busA.connect(master);
    // 和声垫 B：Fmaj7（F2 C3 F3 A3 E4）
    const busB = ctx.createGain();
    busB.gain.value = 0;
    busB.connect(master);

    const chordA: Array<[number, number]> = [
      [110, 0.09], [164.81, 0.07], [220, 0.08], [246.94, 0.045], [261.63, 0.035], [329.63, 0.025],
    ];
    const chordB: Array<[number, number]> = [
      [87.31, 0.09], [130.81, 0.07], [174.61, 0.08], [220, 0.045], [329.63, 0.03],
    ];
    chordA.forEach(([f, g], i) => addVoice(busA, f, g, i % 2 ? 0.35 : -0.35, 0.05 + i * 0.017));
    chordB.forEach(([f, g], i) => addVoice(busB, f, g, i % 2 ? -0.3 : 0.3, 0.06 + i * 0.019));

    // 18s 一轮，6s 交叉淡化交替两组和声
    let toA = false;
    chordTimer = window.setInterval(() => {
      if (!ctx) return;
      toA = !toA;
      const t = ctx.currentTime;
      busA.gain.cancelScheduledValues(t);
      busB.gain.cancelScheduledValues(t);
      busA.gain.linearRampToValueAtTime(toA ? 1 : 0, t + 6);
      busB.gain.linearRampToValueAtTime(toA ? 0 : 1, t + 6);
    }, 18000);

    // 空气感：白噪 → 双重低通 → 极低增益（房间底噪）
    const len = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.94 + white * 0.06;
      data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 320;
    const ng = ctx.createGain();
    ng.gain.value = 0.05;
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(master);
    noise.start();

    scheduleSparkle();
  };

  return {
    get isOn() { return on; },
    /** 开/关：淡入淡出，返回切换后的状态 */
    async toggle(): Promise<boolean> {
      if (!ctx) build();
      if (!ctx || !master) return on;
      if (!on) {
        await ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0.45, ctx.currentTime, 0.8);
        on = true;
      } else {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
        on = false;
        clearTimeout(sparkleTimer);
        clearInterval(chordTimer);
        setTimeout(() => { if (!on) ctx?.suspend(); }, 1500);
      }
      return on;
    },
    /** 交互提示音（仅在开声时有效）：短促柔和的叮音 */
    blip(freq = 740): void {
      if (!on || !ctx || !master) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    },
  };
}
