import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "./styles/main.css";
import { WORKS, type Work } from "./data/works";
import { esc, modelKey, workVisual } from "./modules/art";
import { createAmbient } from "./modules/ambient";
import { applyStatic, getLang, modelName, setLang, t } from "./i18n";

/* ============================================================
   造梦机器® — 入口：渲染 + 全部交互
   与原型逐段对应：加载幕帘 / 导航 / 英雄区 / marquee / 精选 /
   作品墙（筛选）/ 工作室 / 工具链 / 联系 / 灯箱 / 光标 / 回顶
   ============================================================ */

/* ---------- 工具 ---------- */
const $  = (s: string, p: ParentNode = document) => p.querySelector(s) as HTMLElement;
const $$ = (s: string, p: ParentNode = document) => [...p.querySelectorAll(s)] as HTMLElement[];
const REDUCED = matchMedia("(prefers-reduced-motion:reduce)").matches;
applyStatic();   // 按 localStorage 记忆的语言刷新静态文案（需在渲染前执行）

const workTitle = (w: Work) => (getLang() === "en" ? w.en : w.title);
const cardAria  = (w: Work) => `${t("card_aria_prefix")} No.${w.id} ${workTitle(w)}`;
const ambient = createAmbient();   // 必须先于灯箱实例化：深链 lbOpen 初始化时会调用 ambient.blip()

/* ---------- 渲染作品墙 / 精选 / 工作室 ---------- */
const grid = $("#worksGrid");
grid.innerHTML = WORKS.map((w, i) => {
  const v = w.type === "video";
  return `<article class="card" tabindex="0" role="button" aria-label="${esc(cardAria(w))}" data-id="${w.id}" data-tags="${w.type} ${modelKey(w.model)}" data-cursor="OPEN" style="--d:${(i % 4) * 0.08}s">
    <div class="card-frame">
      <div class="art art-${w.ratio.replace(":", "")}${v ? " art--video" : ""}">${workVisual(w, { animated: v, grain: false })}</div>
      ${v ? `<span class="v-badge">▶ ${esc(w.dur ?? "")}</span><span class="card-play"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>` : ""}
    </div>
    <p class="card-cap"><b>No.${w.id} — ${esc(workTitle(w))}</b><span>${v ? esc(w.dur ?? "") + " · " : ""}${esc(modelName(w.model))}</span></p>
  </article>`;
}).join("");

$("#featuredArt").innerHTML = workVisual(WORKS.find((w) => w.id === 128)!, { uid: "feat", animated: true });
$("#studioArt").innerHTML =
  `<div class="art art-34">${workVisual(
    { id:0, title:"工作室", en:"STUDIO", model:"", type:"image", ratio:"3:4", year:"", seed:137,
      pal:["#101014","#23232b","#c9c4b4"], accent:"#e8b04b", geo:"ring", prompt:"" },
    { uid: "studio" },
  )}</div>`;

$("#marquee1").innerHTML = ("IMAGE <i>✦</i> VIDEO <i>✦</i> MOTION <i>✦</i> PROMPT CRAFT <i>✦</i> AI FILM <i>✦</i> CONCEPT ART <i>✦</i> ").repeat(4);
$("#marquee2").innerHTML = ("可灵 KLING <i>✦</i> 即梦 SEEDANCE <i>✦</i> 万相 WAN <i>✦</i> MIDJOURNEY <i>✦</i> STABLE DIFFUSION <i>✦</i> FLUX <i>✦</i> RUNWAY <i>✦</i> VEO <i>✦</i> MINIMAX H3 <i>✦</i> ").repeat(3);

/* ---------- 视频素材：进视口才播、离开暂停（灯箱内的自动播放不受此控） ---------- */
const videoIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    const v = en.target as HTMLVideoElement;
    if (en.isIntersecting) v.play().catch(() => { /* 自动播放被策略拦截时静默 */ });
    else v.pause();
  });
}, { threshold: 0.25 });
$$("video[data-artvideo]").forEach((v) => videoIO.observe(v));

/* ---------- 筛选（带数量上标）：委托监听，语言切换后可整块重绘 ---------- */
const FILTERS: [string, string][] = [
  ["f_all",""], ["f_image","image"], ["f_video","video"],
  ["f_kling","kling"], ["f_jimeng","jimeng"], ["f_wan","wan"], ["f_mj","mj"], ["f_sd","sd"],
];
const tagCount = (tag: string) =>
  tag ? WORKS.filter((w) => `${w.type} ${modelKey(w.model)}`.includes(tag)).length : WORKS.length;

let activeTag = "";
const renderChips = () => {
  $("#filters").innerHTML = FILTERS.map(([key, tag]) =>
    `<button class="chip${tag === activeTag ? " on" : ""}" data-tag="${tag}">${t(key)}<sup>${String(tagCount(tag)).padStart(2, "0")}</sup></button>`).join("");
};
renderChips();

$("#filters").addEventListener("click", (e) => {
  const chip = (e.target as HTMLElement).closest(".chip") as HTMLElement | null;
  if (!chip) return;
  $$(".chip", $("#filters")).forEach((c) => c.classList.toggle("on", c === chip));
  activeTag = chip.dataset.tag ?? "";
  $$(".card", grid).forEach((card) => {
    const match = !activeTag || (card.dataset.tags ?? "").split(" ").includes(activeTag);
    if (match) {
      card.style.display = "";
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove("hide")));
    } else {
      card.classList.add("hide");
      setTimeout(() => { if (card.classList.contains("hide")) card.style.display = "none"; }, 360);
    }
  });
});

/* 语言切换后，仅更新卡片文案（不重建 DOM，保留显影状态） */
const updateCardCaptions = () => {
  $$(".card", grid).forEach((card) => {
    const w = WORKS.find((x) => x.id === +card.dataset.id!);
    if (!w) return;
    const v = w.type === "video";
    card.setAttribute("aria-label", cardAria(w));
    const cap = card.querySelector(".card-cap b") as HTMLElement;
    const meta = card.querySelector(".card-cap span") as HTMLElement;
    if (cap) cap.textContent = `No.${w.id} — ${workTitle(w)}`;
    if (meta) meta.textContent = `${v ? (w.dur ?? "") + " · " : ""}${modelName(w.model)}`;
  });
};

/* ---------- 灯箱 ---------- */
const lb = $("#lb");
let lbList: Work[] = [], lbIdx = 0, lbTimer: number | undefined, lbSwap: number | undefined;
let lbReturnFocus: HTMLElement | null = null;

function startLbProgress(w: Work) {
  clearInterval(lbTimer);
  if (w.type !== "video" || !w.dur) return;
  const total = (+w.dur.slice(0, 2)) * 60 + (+w.dur.slice(3));
  const t0 = performance.now();
  lbTimer = window.setInterval(() => {
    // 优先取媒体区叠加条，否则取信息栏条；切换过渡 240ms 内未就位时下个 tick 再写
    const bar = document.querySelector("#lbMedia .lb-progress i, #lbProgress i") as HTMLElement | null;
    const time = document.querySelector("#lbMedia .lb-time, #lbProgress .lb-time");
    if (!bar || !time) return;
    const s = ((performance.now() - t0) / 1000) % total;
    bar.style.width = (s / total) * 100 + "%";
    // 时码 = 已播 mm:ss（分钟取自已播时长，而非总时长前缀——长视频此前会误标成 07:03）
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(Math.floor(s % 60)).padStart(2, "0");
    time.textContent = `${mm}:${ss} / ${w.dur}`;
  }, 100);
}

function lbRender() {
  const w = lbList[lbIdx];
  const media = $("#lbMedia");
  const [rw, rh] = w.ratio.split(":").map(Number);
  media.style.setProperty("--lbar", (rw / rh).toFixed(4));   // 媒体框随作品比例伸缩
  const isVideo = w.type === "video" && !!w.dur;
  const overlay = isVideo && w.ratio === "16:9";   // 横屏保持原有底部叠加；竖屏等高画面改放信息栏避免压住画面
  const overlayBar = overlay
    ? `<div class="lb-progress lb-progress--overlay mono"><span class="track"><i></i></span><span class="lb-time">00:00 / ${esc(w.dur!)}</span></div>`
    : "";
  media.classList.add("swapping");
  clearTimeout(lbSwap);                       // 快速连按方向键：丢弃上一次未完成的交换
  lbSwap = window.setTimeout(() => {
    media.innerHTML = `<div class="swap-wrap">${workVisual(w, { uid: "lb", animated: w.type === "video", autoplay: true })}${overlayBar}</div>`;
    media.classList.remove("swapping");
  }, 240);
  $("#lbKicker").textContent = `No.${w.id} — ${w.type.toUpperCase()}`;
  $("#lbTitle").innerHTML = getLang() === "en"
    ? `${esc(w.en)}<span class="en">${esc(w.title)}</span>`
    : `${esc(w.title)}<span class="en">${esc(w.en)}</span>`;
  $("#lbMeta").textContent = `${modelName(w.model)} · ${w.type === "video" ? t("i2v") + " · " : ""}${w.dur ?? t("still")} · ${w.year}`;
  $("#lbPrompt").textContent = `「${w.prompt}」`;
  $("#lbParams").innerHTML = [w.ratio, w.type === "video" ? `${w.fps ?? 24}fps` : "3072×4096", `seed ${w.seed * 617}`, "ed. 1/1"]
    .map((p) => `<span>${esc(p)}</span>`).join("");
  const prev = lbList[(lbIdx - 1 + lbList.length) % lbList.length];
  const next = lbList[(lbIdx + 1) % lbList.length];
  $("#lbPrev").textContent = `← ${workTitle(prev)}`;
  $("#lbNext").textContent = `${workTitle(next)} →`;
  $("#lbPos").textContent = `${lbIdx + 1} / ${lbList.length}`;
  // 竖屏等高画面的进度条放信息栏导航行下方；横屏的叠加在媒体底部（原有设计）
  const progress = $("#lbProgress");
  progress.hidden = !isVideo || overlay;
  if (isVideo && !overlay) {
    progress.querySelector("i")!.style.width = "0%";
    progress.querySelector(".lb-time")!.textContent = `00:00 / ${w.dur}`;
  }
  history.replaceState(null, "", location.search + `#w${w.id}`);   // 步进时同步深链，分享拿到的就是当前作品
  startLbProgress(w);
}
function lbOpen(id: number) {
  const visible = $$(".card", grid).filter((c) => c.style.display !== "none");
  lbList = visible.map((c) => WORKS.find((w) => w.id === +c.dataset.id!)!) ;
  lbIdx = Math.max(0, lbList.findIndex((w) => w.id === id));
  lbReturnFocus = document.activeElement as HTMLElement | null;
  lbRender();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".lb-close", lb).focus();
  ambient.blip();   // 开声时给一声轻提示音
}
function lbClose() {
  clearInterval(lbTimer);
  clearTimeout(lbSwap);                    // 收尾时丢弃未完成的切换，避免关闭后仍改写媒体区
  if (lbReturnFocus && lbReturnFocus !== document.body) {
    lbReturnFocus.focus();                 // 正常路径：归还到打开灯箱的元素
  } else {
    $$(".card", grid).find(c => c.style.display !== "none")?.focus();  // 深链直开：落到第一件可见作品
  }
  lbReturnFocus = null;
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  history.replaceState(null, "", location.pathname + location.search);
}
function lbStep(d: number) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbRender(); }

grid.addEventListener("click", (e) => {
  const card = (e.target as HTMLElement).closest(".card") as HTMLElement | null;
  if (card) lbOpen(+card.dataset.id!);
});
grid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = (e.target as HTMLElement).closest(".card") as HTMLElement | null;
  if (card) { e.preventDefault(); lbOpen(+card.dataset.id!); }
});
$$("[data-lb-close]", lb).forEach((el) => el.addEventListener("click", lbClose));
$("[data-lb-prev]", lb).addEventListener("click", () => lbStep(-1));
$("[data-lb-next]", lb).addEventListener("click", () => lbStep(1));
/* 焦点圈禁：Tab 在灯箱内循环，不出背景页 */
lb.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusables = $$("button, [href]", lb);
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") lbClose();
  if (e.key === "ArrowLeft") lbStep(-1);
  if (e.key === "ArrowRight") lbStep(1);
});
$("#lbCopy").addEventListener("click", async () => {
  const w = lbList[lbIdx];
  try {
    await navigator.clipboard.writeText(`${w.prompt}\n--model ${w.model}`);
    toast(t("toast_copied"));
  } catch {
    toast(t("toast_copy_fail"));
  }
});
$("#lbShare").addEventListener("click", async () => {
  const w = lbList[lbIdx];
  if (navigator.share) {
    try { await navigator.share({ title: `${w.title} — 造梦机器®`, url: location.href }); } catch { /* 用户取消 */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(location.href);
    toast(t("toast_link_copied"));
  } catch {
    toast(t("toast_share_fail"));
  }
});
if (location.hash.startsWith("#w")) {
  const id = +location.hash.slice(2);
  if (WORKS.some((w) => w.id === id)) lbOpen(id);
}

/* ---------- Toast ---------- */
let toastTimer: number | undefined;
function toast(msg: string) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- 移动端菜单 ---------- */
const navToggle = $("#navToggle"), mobileMenu = $("#mobileMenu");
function closeMobileMenu() {
  const menuHadFocus = mobileMenu.contains(document.activeElement);
  navToggle.classList.remove("open");
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  if (menuHadFocus) navToggle.focus();   // 焦点归还触发按钮，不滞留在隐藏链接上
}
navToggle.addEventListener("click", () => {
  const open = !mobileMenu.classList.contains("open");
  navToggle.classList.toggle("open", open);
  mobileMenu.classList.toggle("open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});
$$(".mobile-links a", mobileMenu).forEach((a) => a.addEventListener("click", closeMobileMenu));
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMobileMenu();
});

/* ---------- 导航 / 滚动 / 进度 / 回顶 ---------- */
const nav = $("#nav");
const heroBg = $("#heroBg");
const scrollProgress = $("#scrollProgress");
const toTop = $("#toTop");
const RING = 2 * Math.PI * 21;
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    if (y < innerHeight) heroBg.style.transform = `translateY(${y * 0.22}px)`;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;
    scrollProgress.style.width = p * 100 + "%";
    toTop.classList.toggle("show", y > innerHeight * 0.9);
    $("#ttBar").style.strokeDashoffset = String(RING * (1 - p));
    ticking = false;
  });
}, { passive: true });

toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));

/* ---------- 滚轮阻尼（Lenis 风格 duration 模式）：输入 ×0.92 减速，1.15s 缓动到位 ----------
   参数对齐 sheengo-labs 的 Lenis 配置：duration 1.15 · easeOutExpo · wheelMultiplier 0.92 */
const FINE_POINTER = matchMedia("(pointer:fine)").matches;
if (FINE_POINTER && !REDUCED) {
  const DURATION = 1.15;         // 每次滚轮输入的缓动时长（秒）
  const WHEEL_MULTIPLIER = 0.92; // 输入阻尼：<1 → 比原生滚动更慢更稳
  const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)); // easeOutExpo
  let from = scrollY, to = scrollY, t0 = 0, raf = 0, lastY = scrollY;

  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const loop = (now: number) => {
    const p = Math.min(Math.max((now - t0) / (DURATION * 1000), 0), 1);   // 夹到 [0,1]：rAF 时间戳可能早于事件时刻
    const y = from + (to - from) * easing(p);
    // 与「我们上一帧写入的位置」比对：偏离超出取整/量化误差 → 用户在拖滚动条/键盘/锚点滚动，立即让位
    // （不能拿 scrollY 和 y 比：easeOutExpo 起步快，第一帧就会领先当前位置十几 px，会误判成外部滚动导致动画秒死）
    if (Math.abs(scrollY - lastY) > 2) {
      from = to = scrollY;
      lastY = scrollY;
      raf = 0;
      return;
    }
    scrollTo(0, y);
    lastY = y;
    if (p < 1) raf = requestAnimationFrame(loop);
    else raf = 0;
  };
  addEventListener("wheel", (e) => {
    if (e.ctrlKey) return;                              // 保留缩放
    if ($("#lb").classList.contains("open")) return;    // 灯箱打开时不接管
    e.preventDefault();
    const dy = (e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY) * WHEEL_MULTIPLIER;
    from = scrollY;                                     // 每次输入都从当前位置重新出发（Lenis 行为）
    to = Math.max(0, Math.min(to + dy, maxScroll()));
    t0 = performance.now();
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: false });

  // 拖动滚动条 / 键盘等外部滚动：动画外即时同步起点与目标
  addEventListener("scroll", () => {
    if (!raf) { from = scrollY; to = scrollY; }
  }, { passive: true });
}

$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const target = $(a.getAttribute("href")!);
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }); }
}));

/* ---------- 滚动显影 ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
$$("[data-reveal]").forEach((el) => io.observe(el));
const ioCard = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); ioCard.unobserve(en.target); } });
}, { threshold: 0.08 });
$$(".card").forEach((el) => ioCard.observe(el));

/* ---------- 数字滚动 ---------- */
const ioNum = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    ioNum.unobserve(en.target);
    const el = en.target as HTMLElement, end = +el.dataset.count!, suffix = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1600;
    requestAnimationFrame(function tick(t: number) {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    });
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach((el) => ioNum.observe(el));

/* ---------- 磁性按钮 / 卡片 3D 倾斜 ---------- */
if (matchMedia("(pointer:fine)").matches) {
  $$("[data-magnet]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.18;
      const dy = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
  $$(".card-frame").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(px * 3).toFixed(2)}deg)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* ---------- 自定义光标：dot 即时跟随，ring 缓动；收敛后暂停 rAF 省电 ---------- */
if (matchMedia("(pointer:fine)").matches) {
  const cursor = $(".cursor"), dot = $(".cursor-dot"), ring = $(".cursor-ring"), label = $(".cursor-label");
  let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
  dot.style.transform = "translate(-100px,-100px) translate(-50%,-50%)";
  ring.style.translate = "-100px -100px";
  const loop = () => {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.translate = `${rx}px ${ry}px`;
    raf = (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) ? requestAnimationFrame(loop) : 0;
  };
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener("mouseover", (e) => {
    const t = e.target as HTMLElement;
    const labelled = t.closest("[data-cursor]") as HTMLElement | null;
    const hot = t.closest("a,button,.chip");
    cursor.classList.toggle("is-label", !!labelled);
    cursor.classList.toggle("is-hover", !labelled && !!hot);
    label.textContent = labelled?.dataset.cursor || "";
  });
}

/* ---------- 导航当前区高亮 ---------- */
const secIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const link = $(`.nav-links a[href="#${en.target.id}"]`);
    if (!link) return;
    $$(".nav-links a").forEach((a) => a.classList.remove("cur"));
    link.classList.add("cur");
  });
}, { rootMargin: "-38% 0px -55% 0px" });
["works", "studio", "contact"].forEach((id) => { const el = document.getElementById(id); if (el) secIO.observe(el); });

/* ---------- 语言切换：静态文案 + 动态渲染区同步刷新 ---------- */
$("#langToggle").addEventListener("click", () => {
  setLang(getLang() === "zh" ? "en" : "zh");
  renderChips();
  updateCardCaptions();
  if (lb.classList.contains("open")) lbRender();
});

/* ---------- 声音开关：WebAudio 合成氛围声（暗厅环境音 + 交互叮音） ---------- */
$("#soundToggle").addEventListener("click", async () => {
  const on = await ambient.toggle();
  $("#soundToggle").classList.toggle("on", on);
  $("#soundToggle").setAttribute("aria-pressed", String(on));
  toast(t(on ? "toast_sound_on" : "toast_sound_off"));
});

/* ---------- 开场幕帘 ---------- */
if (REDUCED) {
  $("#loader").remove();
  document.body.classList.add("ready");
} else {
  const DUR = 1050;
  const finish = () => {
    const loader = $("#loader");
    if (!loader) return;
    $("#loadNum").textContent = "100";
    $("#loadBar").style.width = "100%";
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.add("ready");
      setTimeout(() => loader.remove(), 1000);
    }, 200);
  };
  setTimeout(finish, DUR + 200);
  const num = $("#loadNum"), bar = $("#loadBar"), t0 = performance.now();
  requestAnimationFrame(function tick(t: number) {
    const p = Math.min((t - t0) / DUR, 1), e = 1 - Math.pow(1 - p, 2);
    num.textContent = String(Math.round(e * 100)).padStart(2, "0");
    bar.style.width = e * 100 + "%";
    if (p < 1 && $("#loader")) requestAnimationFrame(tick);
  });
}

/* ---------- 英雄区铭牌：真实日期 ---------- */
{
  const d = new Date();
  const wk = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d.getDay()];
  const pad = (n: number) => String(n).padStart(2, "0");
  $("#heroDate").textContent = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${wk}`;
}
