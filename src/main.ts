import "./styles/main.css";
import { WORKS, type Work } from "./data/works";
import { modelKey, workVisual } from "./modules/art";

/* ============================================================
   造梦机器® — 入口：渲染 + 全部交互
   与原型逐段对应：加载幕帘 / 导航 / 英雄区 / marquee / 精选 /
   作品墙（筛选）/ 工作室 / 工具链 / 联系 / 灯箱 / 光标 / 回顶
   ============================================================ */

/* ---------- 工具 ---------- */
const $  = (s: string, p: ParentNode = document) => p.querySelector(s) as HTMLElement;
const $$ = (s: string, p: ParentNode = document) => [...p.querySelectorAll(s)] as HTMLElement[];

/* ---------- 渲染作品墙 / 精选 / 工作室 ---------- */
const grid = $("#worksGrid");
grid.innerHTML = WORKS.map((w, i) => {
  const v = w.type === "video";
  return `<article class="card" data-id="${w.id}" data-tags="${w.type} ${modelKey(w.model)}" data-cursor="OPEN" style="--d:${(i % 4) * 0.08}s">
    <div class="card-frame">
      <div class="art art-${w.ratio.replace(":", "")}${v ? " art--video" : ""}">${workVisual(w, { animated: v, grain: false })}</div>
      ${v ? `<span class="v-badge">▶ ${w.dur}</span><span class="card-play"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span>` : ""}
    </div>
    <p class="card-cap"><b>No.${w.id} — ${w.title}</b><span>${v ? w.dur + " · " : ""}${w.model}</span></p>
  </article>`;
}).join("");

$("#featuredArt").innerHTML = workVisual(WORKS[0], { uid: "feat", animated: true });
$("#studioArt").innerHTML =
  `<div class="art art-34">${workVisual(
    { id:0, title:"工作室", en:"STUDIO", model:"", type:"image", ratio:"3:4", year:"", seed:137,
      pal:["#101014","#23232b","#c9c4b4"], accent:"#e8b04b", geo:"ring", prompt:"" },
    { uid: "studio" },
  )}</div>`;

$("#marquee1").innerHTML = ("IMAGE <i>✦</i> VIDEO <i>✦</i> MOTION <i>✦</i> PROMPT CRAFT <i>✦</i> AI FILM <i>✦</i> CONCEPT ART <i>✦</i> ").repeat(4);
$("#marquee2").innerHTML = ("可灵 KLING <i>✦</i> 即梦 SEEDANCE <i>✦</i> MIDJOURNEY <i>✦</i> STABLE DIFFUSION <i>✦</i> FLUX <i>✦</i> RUNWAY <i>✦</i> VEO <i>✦</i> MINIMAX H3 <i>✦</i> ").repeat(3);

/* ---------- 筛选（带数量上标） ---------- */
const FILTERS: [string, string][] = [
  ["全部",""], ["图像","image"], ["视频","video"],
  ["可灵","kling"], ["即梦","jimeng"], ["MJ","mj"], ["SD/FLUX","sd"],
];
const tagCount = (tag: string) =>
  tag ? WORKS.filter((w) => `${w.type} ${modelKey(w.model)}`.includes(tag)).length : WORKS.length;
$("#filters").innerHTML = FILTERS.map(([label, tag], i) =>
  `<button class="chip${i === 0 ? " on" : ""}" data-tag="${tag}">${label}<sup>${String(tagCount(tag)).padStart(2, "0")}</sup></button>`).join("");

let activeTag = "";
$$(".chip", $("#filters")).forEach((chip) => chip.addEventListener("click", () => {
  $$(".chip", $("#filters")).forEach((c) => c.classList.toggle("on", c === chip));
  activeTag = chip.dataset.tag ?? "";
  $$(".card", grid).forEach((card) => {
    const match = !activeTag || (card.dataset.tags ?? "").includes(activeTag);
    if (match) {
      card.style.display = "";
      requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove("hide")));
    } else {
      card.classList.add("hide");
      setTimeout(() => { if (card.classList.contains("hide")) card.style.display = "none"; }, 360);
    }
  });
}));

$("#worksCount").textContent = `共 ${WORKS.length} 件`;

/* ---------- 灯箱 ---------- */
const lb = $("#lb");
let lbList: Work[] = [], lbIdx = 0, lbTimer: number | undefined;

function startLbProgress(w: Work) {
  clearInterval(lbTimer);
  if (w.type !== "video" || !w.dur) return;
  const total = (+w.dur.slice(0, 2)) * 60 + (+w.dur.slice(3));
  const t0 = performance.now();
  lbTimer = window.setInterval(() => {
    const bar = $("#lbBar"), time = $("#lbTime");
    if (!bar) { clearInterval(lbTimer); return; }
    const s = ((performance.now() - t0) / 1000) % total;
    bar.style.width = (s / total) * 100 + "%";
    time.textContent = `${w.dur!.slice(0, 3)}${String(Math.floor(s)).padStart(2, "0")} / ${w.dur}`;
  }, 100);
}

function lbRender() {
  const w = lbList[lbIdx];
  const media = $("#lbMedia");
  media.classList.add("swapping");
  setTimeout(() => {
    media.innerHTML = `<div class="swap-wrap">${workVisual(w, { uid: "lb", animated: w.type === "video" })}${
      w.type === "video" ? `<div class="lb-progress mono"><span class="track"><i id="lbBar"></i></span><span id="lbTime">00:00 / ${w.dur}</span></div>` : ""
    }</div>`;
    media.classList.remove("swapping");
  }, 240);
  $("#lbKicker").textContent = `No.${w.id} — ${w.type.toUpperCase()}`;
  $("#lbTitle").innerHTML = `${w.title}<span class="en">${w.en}</span>`;
  $("#lbMeta").textContent = `${w.model} · ${w.type === "video" ? "图生视频 · " : ""}${w.dur ?? "静态"} · ${w.year}`;
  $("#lbPrompt").textContent = `「${w.prompt}」`;
  $("#lbParams").innerHTML = [w.ratio, w.type === "video" ? "24fps" : "3072×4096", `seed ${w.seed * 617}`, "ed. 1/1"]
    .map((p) => `<span>${p}</span>`).join("");
  const prev = lbList[(lbIdx - 1 + lbList.length) % lbList.length];
  const next = lbList[(lbIdx + 1) % lbList.length];
  $("#lbPrev").textContent = `← ${prev.title}`;
  $("#lbNext").textContent = `${next.title} →`;
  $("#lbPos").textContent = `${lbIdx + 1} / ${lbList.length}`;
  startLbProgress(w);
}
function lbOpen(id: number) {
  const visible = $$(".card", grid).filter((c) => c.style.display !== "none");
  lbList = visible.map((c) => WORKS.find((w) => w.id === +c.dataset.id!)!) ;
  lbIdx = Math.max(0, lbList.findIndex((w) => w.id === id));
  lbRender();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  history.replaceState(null, "", `#w${id}`);
}
function lbClose() {
  clearInterval(lbTimer);
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  history.replaceState(null, "", location.pathname);
}
function lbStep(d: number) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbRender(); }

grid.addEventListener("click", (e) => {
  const card = (e.target as HTMLElement).closest(".card") as HTMLElement | null;
  if (card) lbOpen(+card.dataset.id!);
});
$$("[data-lb-close]", lb).forEach((el) => el.addEventListener("click", lbClose));
$("[data-lb-prev]", lb).addEventListener("click", () => lbStep(-1));
$("[data-lb-next]", lb).addEventListener("click", () => lbStep(1));
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") lbClose();
  if (e.key === "ArrowLeft") lbStep(-1);
  if (e.key === "ArrowRight") lbStep(1);
});
$("#lbCopy").addEventListener("click", async () => {
  const w = lbList[lbIdx];
  try { await navigator.clipboard.writeText(`${w.prompt}\n--model ${w.model}`); }
  catch { /* 剪贴板不可用时静默 */ }
  toast("提示词已复制到剪贴板 ✓");
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

toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- 滚轮阻尼（平滑滚动）：只接管滚轮，其余滚动来源自动同步 ---------- */
if (matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const EASE = 0.09;            // 阻尼系数：越小越「跟手粘稠」
  const SNAP = 0.5;             // 距目标小于该值时贴合收尾
  let target = scrollY, current = scrollY, animating = false;

  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const loop = () => {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < SNAP) {
      current = target;
      scrollTo(0, current);
      animating = false;
      return;
    }
    scrollTo(0, current);
    requestAnimationFrame(loop);
  };
  addEventListener("wheel", (e) => {
    if (e.ctrlKey) return;                              // 保留缩放
    if ($("#lb").classList.contains("open")) return;    // 灯箱打开时不接管
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
    if (!animating) { current = scrollY; target = scrollY; }
    target = Math.max(0, Math.min(target + dy, maxScroll()));
    if (!animating) { animating = true; requestAnimationFrame(loop); }
  }, { passive: false });

  // 锚点平滑滚动 / 键盘 / 拖动滚动条等外部滚动：即时同步目标
  addEventListener("scroll", () => {
    if (!animating) { target = scrollY; current = scrollY; }
  }, { passive: true });
}

$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const target = $(a.getAttribute("href")!);
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
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

/* ---------- 自定义光标 ---------- */
if (matchMedia("(pointer:fine)").matches) {
  const cursor = $(".cursor"), dot = $(".cursor-dot"), ring = $(".cursor-ring"), label = $(".cursor-label");
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();
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

/* ---------- 占位按钮 ---------- */
const soundBtn = $(".sound-toggle");
soundBtn.addEventListener("click", () => {
  const on = soundBtn.classList.toggle("on");
  toast(on ? "声音已开启（原型占位）" : "声音已关闭");
});
$("#loadMore").addEventListener("click", () => toast("已全部 12 件 —— 原型仅内置演示数据"));

/* ---------- 开场幕帘 ---------- */
if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
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
