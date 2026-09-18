import type { Work } from "../data/works";

/* ---------- 工具 ---------- */
/** HTML 转义：作品数据拼进 innerHTML / 属性前统一过一道 */
export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export const mulberry32 = (a: number) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const RATIO_DIMS: Record<string, [number, number]> = {
  "16:9": [800, 450], "3:4": [600, 800], "1:1": [640, 640], "9:16": [450, 800],
};

export const modelKey = (m: string) => m.includes("可灵") ? "kling"
  : m.includes("即梦") ? "jimeng"
  : m.includes("Midjourney") ? "mj"
  : "sd";

export interface ArtOptions {
  uid?: string;
  animated?: boolean;
  /** 灯箱内自动播放；卡片/精选位一律由 IntersectionObserver 接管播放 */
  autoplay?: boolean;
  /** 大图默认带颗粒滤镜；小卡片交给全局颗粒层，省 12 个 feTurbulence */
  grain?: boolean;
}

/* 程序化「作品」占位视觉：渐变 + 光斑 + 几何 + 颗粒 + 暗角。
   真实素材就位后整个 .art 容器可直接替换为 <img>/<video>。 */
export function artSVG(w: Work, { uid = String(w.id), animated = false, grain = true }: ArtOptions = {}): string {
  const [W, H] = RATIO_DIMS[w.ratio] || RATIO_DIMS["16:9"];
  const rnd = mulberry32(w.seed);
  const [c0, c1, c2] = w.pal;
  const blobs: string[] = [];
  for (let i = 0; i < 3; i++) {
    const cx = 12 + rnd() * 76, cy = 10 + rnd() * 80;
    const r = (i === 0 ? 42 : i === 1 ? 30 : 20) + rnd() * 12;
    const op = i === 2 ? .62 : .68 - i * .14;
    blobs.push(`<circle class="bl bl${i + 1}" cx="${cx}%" cy="${cy}%" r="${r}%" fill="url(#bl${uid}${i})" opacity="${op}"/>`);
  }
  let geo = "";
  if (w.geo === "ring") {
    geo = `<circle cx="${(25 + rnd() * 50).toFixed(1)}%" cy="${(22 + rnd() * 50).toFixed(1)}%" r="${(14 + rnd() * 10).toFixed(1)}%" fill="none" stroke="${w.accent}" stroke-width="1.1" opacity=".55"/>`;
  } else if (w.geo === "line") {
    const y = (30 + rnd() * 40).toFixed(1);
    geo = `<rect x="0" y="${y}%" width="100%" height="1.5" fill="${w.accent}" opacity=".4"/>
           <rect x="0" y="${y}%" width="${(20 + rnd() * 30).toFixed(0)}%" height="3" fill="${w.accent}" opacity=".8"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(w.title)} 占位视觉">
    <defs>
      <linearGradient id="base${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
      </linearGradient>
      <radialGradient id="bl${uid}0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></radialGradient>
      <radialGradient id="bl${uid}1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>
      <radialGradient id="bl${uid}2"><stop offset="0" stop-color="${w.accent}"/><stop offset="1" stop-color="${w.accent}" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#base${uid})"/>
    <g${animated ? ' class="animated"' : ""}>${blobs.join("")}</g>
    ${geo}
    ${grain ? `<rect width="${W}" height="${H}" filter="url(#grainF)" opacity=".17"/>` : ""}
    <rect width="${W}" height="${H}" fill="url(#vigG)"/>
  </svg>`;
}

/** 作品统一视觉入口：有 media 用真实素材，否则用程序化占位视觉 */
export function workVisual(w: Work, opts: ArtOptions = {}): string {
  if (!w.media) return artSVG(w, opts);
  if (w.media.kind === "video") {
    const poster = w.media.poster ? ` poster="${esc(w.media.poster)}"` : "";
    const auto = opts.autoplay ? " autoplay" : "";
    return `<video src="${esc(w.media.src)}"${poster} muted loop playsinline preload="metadata"${auto} data-artvideo></video>`;
  }
  return `<img src="${esc(w.media.src)}" alt="${esc(w.title)}" loading="lazy">`;
}
