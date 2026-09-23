/* 极简 i18n：字典 + data-i18n 扫描 + localStorage 记忆。
   默认中文；作品数据的 en 字段与模型英文名映射直接复用。 */

type Dict = Record<string, string>;
export type Lang = "zh" | "en";

const ZH: Dict = {
  doc_title: "造梦机器® — AIGC 视觉实验室 / IMAGE · VIDEO · MOTION",
  lang_aria: "切换到 English",
  menu_open: "打开菜单",
  nav_works: "作品", nav_studio: "关于", nav_contact: "联系",
  hero_kicker: "AIGC VISUAL LAB — 图像 / 影像 / 动态",
  hero_sub: "一间只展出 AI 作品的暗厅。每周上新，<br>每件作品保留它的提示词与生成参数。",
  hero_enter: "进入展厅", hero_featured: "本周精选 ↓",
  hero_open: "暗厅开放中",
  f_kicker: "00 — FEATURED · WK 39",
  f_fig: "▶ 00:15 · 即梦 2.5 图生视频",
  f_meta: "即梦 2.5 · 图生视频 · 15s · 2026.09",
  f_desc: "深夜渡轮驶出港湾，探照灯扫过铅灰色海面。胶片颗粒、冷蓝调、一镜到底 —— 本周唯一一件逐帧打磨了 40 版的作品。",
  f_viewall: "查看全部作品 →",
  w_kicker: "01 — WORKS · 作品墙",
  w_meta: "№ 117–136 · 共 20 件 · 每周五上新",
  f_all: "全部", f_image: "图像", f_video: "视频", f_kling: "可灵", f_jimeng: "即梦", f_wan: "万相", f_mj: "MJ", f_sd: "SD/FLUX",
  s_kicker: "02 — STUDIO · 关于",
  s_display: "我们用模型画画，<br>用提示词导演。",
  s_desc: "造梦机器是一间 AIGC 视觉实验室。我们相信模型是乐器而不是画家：审美由人决定，产能由模型放大。这里展出的是双方合作的结果 —— 以及每一件作品背后的提示词、参数与废掉的版本。",
  stat_works: "展出作品", stat_models: "在用模型", stat_prompts: "打磨过的提示词",
  c_kicker: "03 — CONTACT · 合作",
  c_t1: "有想法？", c_t2: "一起造点新的。",
  foot_made: "本站所有作品由 AI 生成 · 由人筛选",
  lb_aria: "作品详情",
  lb_copy: "复制提示词", lb_download: "下载原图", lb_share: "分享",
  lb_hint: "ESC 关闭 · ←→ 切换",
  filters_aria: "作品筛选", play_aria: "播放精选",
  i2v: "图生视频", still: "静态",
  toast_copied: "提示词已复制到剪贴板 ✓",
  toast_copy_fail: "复制失败 —— 请手动选择提示词复制",
  toast_link_copied: "链接已复制到剪贴板 ✓",
  toast_share_fail: "分享失败",
  sound_aria: "氛围声",
  toast_sound_on: "氛围声已开启 ✓",
  toast_sound_off: "氛围声已关闭",
  lb_sound_aria: "作品原声",
  lb_sound_on: "作品原声已开启 ✓",
  lb_sound_off: "作品已静音",
  card_aria_prefix: "查看作品",
};

const EN: Dict = {
  doc_title: "造梦机器® — AIGC Visual Lab / IMAGE · VIDEO · MOTION",
  lang_aria: "切换到中文",
  menu_open: "Open menu",
  nav_works: "Works", nav_studio: "Studio", nav_contact: "Contact",
  hero_kicker: "AIGC VISUAL LAB — IMAGE / VIDEO / MOTION",
  hero_sub: "A dark gallery exhibiting AI works only. New drops weekly —<br>every piece keeps its prompt and parameters.",
  hero_enter: "Enter the Gallery", hero_featured: "This Week's Pick ↓",
  hero_open: "dark gallery open",
  f_kicker: "00 — FEATURED · WK 39",
  f_fig: "▶ 00:15 · Jimeng 2.5 image-to-video",
  f_meta: "Jimeng 2.5 · image-to-video · 15s · 2026.09",
  f_desc: "A night ferry slips out of the harbor, searchlights sweeping the lead-grey sea. Film grain, cold blues, one continuous take — the only piece this week polished through 40 drafts.",
  f_viewall: "View all works →",
  w_kicker: "01 — WORKS · The Wall",
  w_meta: "№ 117–136 · 20 pieces · New every Friday",
  f_all: "All", f_image: "Image", f_video: "Video", f_kling: "Kling", f_jimeng: "Jimeng", f_wan: "Wan", f_mj: "MJ", f_sd: "SD/FLUX",
  s_kicker: "02 — STUDIO · About",
  s_display: "We paint with models.<br>We direct with prompts.",
  s_desc: "Dream Machine is an AIGC visual lab. We believe models are instruments, not painters: taste stays human, output scales by machine. On show is the result of that collaboration — and every prompt, parameter and discarded version behind it.",
  stat_works: "Works on show", stat_models: "Models in use", stat_prompts: "Prompts crafted",
  c_kicker: "03 — CONTACT · Collaborate",
  c_t1: "Got an idea?", c_t2: "Let's make something new.",
  foot_made: "All works AI-generated · curated by humans",
  lb_aria: "Work details",
  lb_copy: "Copy Prompt", lb_download: "Download", lb_share: "Share",
  lb_hint: "ESC close · ←→ browse",
  filters_aria: "Filter works", play_aria: "Play featured",
  i2v: "image-to-video", still: "still",
  toast_copied: "Prompt copied to clipboard ✓",
  toast_copy_fail: "Copy failed — please select the prompt manually",
  toast_link_copied: "Link copied to clipboard ✓",
  toast_share_fail: "Share failed",
  sound_aria: "Ambient sound",
  toast_sound_on: "Ambient sound on ✓",
  toast_sound_off: "Ambient sound off",
  lb_sound_aria: "Work sound",
  lb_sound_on: "Work sound on ✓",
  lb_sound_off: "Work muted",
  card_aria_prefix: "View work",
};

const MODEL_EN: Record<string, string> = { "可灵 3.0": "Kling 3.0", "即梦 2.5": "Jimeng 2.5", "通义万相 3.0": "Wan 3.0" };

const STRINGS: Record<Lang, Dict> = { zh: ZH, en: EN };

let lang: Lang = "zh";
try {
  const saved = localStorage.getItem("dm-lang");
  if (saved === "en" || saved === "zh") lang = saved;
} catch { /* 隐私模式等场景下静默 */ }

export const getLang = (): Lang => lang;
export const t = (key: string): string => STRINGS[lang][key] ?? STRINGS.zh[key] ?? key;
export const modelName = (m: string): string => (lang === "en" ? MODEL_EN[m] ?? m : m);

/** 扫描静态标记：data-i18n（文本）/ data-i18n-html（含标记文本）/ data-i18n-attr="attr:key"（属性） */
export function applyStatic(): void {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = t("doc_title");
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n!);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml!);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const [attr, key] = (el.dataset.i18nAttr ?? "").split(":");
    if (attr && key) el.setAttribute(attr, t(key));
  });
  const toggle = document.getElementById("langToggle");
  if (toggle) {
    toggle.textContent = lang === "zh" ? "EN" : "中文";
    toggle.setAttribute("aria-label", t("lang_aria"));
  }
}

export function setLang(l: Lang): void {
  if (l === lang) return;
  lang = l;
  try { localStorage.setItem("dm-lang", l); } catch { /* 静默 */ }
  applyStatic();
}
