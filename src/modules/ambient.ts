/* 暗厅氛围声：WebAudio 实时合成，零音频素材、零网络请求。
   A1 双三角波微失谐铺底 + 纯五度/高八度泛音，低通滤波 + 慢 LFO 缓慢呼吸。 */

export function createAmbient() {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let on = false;

  const build = () => {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    filter.Q.value = 0.8;
    filter.connect(master);

    // 滤波频率缓慢呼吸（约 24s 一轮）
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / 24;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 140;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // A1 微失谐双三角波铺底 + A2/E2 泛音染色
    const layers: Array<[number, OscillatorType, number]> = [
      [55, "triangle", 0.16], [55.35, "triangle", 0.14], [110.2, "sine", 0.06], [164.8, "sine", 0.035],
    ];
    for (const [freq, type, gain] of layers) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = gain;
      osc.connect(g);
      g.connect(filter);
      osc.start();
    }
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
        master.gain.setTargetAtTime(0.42, ctx.currentTime, 0.6);
        on = true;
      } else {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
        on = false;
        setTimeout(() => { if (!on) ctx?.suspend(); }, 1200);
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
