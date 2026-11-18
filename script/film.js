/**
 * film.js — the HUMAN.md-style film layer around the birthday show:
 * HUD (file pill + chapter crumb + restart), progress hairline, chapter
 * index with seek, multi-layer parallax fog, film grain, a plain-text
 * reading version, and one hidden easter egg.
 *
 * It talks to the main timeline only through window.__tl, which
 * main.js publishes in buildTimeline(), plus the onUpdate hook below.
 */
(function () {
  const CHAPTER_NAMES = {
    greeting: "開場", countdown: "倒數", announcement: "揭曉",
    chatbox: "一封信", ideas: "心裡話", stars: "星星", balloons: "氣球",
    gift: "禮物", quote: "引言", cake: "蛋糕", fireworks: "煙花",
    scrollstory: "慢鏡頭", confetti: "彩帶", closing: "尾聲",
    profile: "主角",
  };

  const crumb = document.getElementById("hud-crumb");
  const bar = document.getElementById("hud-bar");
  const indexOverlay = document.getElementById("index-overlay");
  const indexList = document.getElementById("index-list");

  let chapterTimes = []; // [{time, name, idx}]

  function buildIndex(tl) {
    if (!indexList || typeof CONFIG === "undefined") return; // CONFIG is a top-level const in config.js: bare name works, window.CONFIG does not
    indexList.innerHTML = "";
    chapterTimes = [];
    CONFIG.sections.forEach((s, i) => {
      const t = tl.labels && tl.labels["ch" + i];
      if (t == null) return;
      const name = CHAPTER_NAMES[s.type] || s.type;
      chapterTimes.push({ time: t, name, idx: i });
      const b = document.createElement("button");
      b.type = "button";
      b.className = "index-item";
      b.innerHTML = `<span class="index-num">${String(i + 1).padStart(2, "0")}</span>${name}`;
      b.addEventListener("click", () => {
        closeIndex();
        tl.seek(t + 0.05);
        tl.play();
      });
      indexList.appendChild(b);
    });
    chapterTimes.sort((a, b) => a.time - b.time);
  }

  function onProgress(tl) {
    if (bar) bar.style.transform = `scaleX(${tl.progress()})`;
    if (!crumb || !chapterTimes.length) return;
    const now = tl.time();
    let cur = chapterTimes[0];
    for (const c of chapterTimes) if (c.time <= now + 0.02) cur = c;
    if (cur) crumb.textContent = `第 ${cur.idx + 1} 幕 · ${cur.name}`;
  }

  window.FilmHUD = {
    bind(tl) { buildIndex(tl); onProgress(tl); },
    onProgress,
  };

  // ── Index open/close ──────────────────────────────────────────────
  function openIndex() {
    document.body.classList.add("index-open");
    if (indexOverlay) indexOverlay.hidden = false;
    if (window.__tl && !window.__tl.paused()) { window.__tl.pause(); window.__tl._wasPlaying = true; }
    else if (window.__tl) window.__tl._wasPlaying = false;
  }
  function closeIndex() {
    document.body.classList.remove("index-open");
    if (indexOverlay) indexOverlay.hidden = true;
    if (window.__tl && window.__tl._wasPlaying) window.__tl.play();
  }
  const idxBtn = document.getElementById("hud-index-btn");
  const idxClose = document.getElementById("index-close");
  if (idxBtn) idxBtn.addEventListener("click", openIndex);
  if (idxClose) idxClose.addEventListener("click", closeIndex);
  if (indexOverlay) indexOverlay.addEventListener("click", (e) => { if (e.target === indexOverlay) closeIndex(); });


  // ── Star egg: after the film, a sky she can light up ───────────
  const EGG_WORDS = ["平安", "歡喜", "好運", "順遂", "明亮", "如願", "安康", "被愛"];
  let eggLayer = null, eggLit = 0, eggDone = false;
  function buildEgg() {
    if (eggLayer) return eggLayer;
    eggLayer = document.createElement("div");
    eggLayer.id = "egg-stars";
    eggLayer.hidden = true;
    eggLayer.innerHTML = `
      <p class="egg-hint">還有一片星空，點一點</p>
      <button type="button" class="egg-close">← 回去</button>
      <p class="egg-final">每一顆，都是給你的。</p>`;
    // Deterministic scatter (same sky every visit)
    let seed = 20261119;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < 26; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "egg-star";
      const size = 3 + rnd() * 3.5;
      b.style.width = b.style.height = size.toFixed(1) + "px";
      b.style.left = (5 + rnd() * 90).toFixed(1) + "%";
      b.style.top = (10 + rnd() * 78).toFixed(1) + "%";
      b.addEventListener("click", (ev) => { ev.stopPropagation(); lightStar(b); });
      eggLayer.appendChild(b);
    }
    eggLayer.addEventListener("click", (e) => { if (e.target === eggLayer) closeEgg(); });
    eggLayer.querySelector(".egg-close").addEventListener("click", closeEgg);
    document.body.appendChild(eggLayer);
    return eggLayer;
  }
  function lightStar(b) {
    if (b.classList.contains("is-lit") || eggDone) return;
    b.classList.add("is-lit");
    const word = EGG_WORDS[Math.min(eggLit, EGG_WORDS.length - 1)];
    eggLit++;
    const w = document.createElement("span");
    w.className = "egg-word";
    w.textContent = word;
    w.style.left = b.style.left;
    w.style.top = b.style.top;
    eggLayer.appendChild(w);
    if (window.gsap) {
      gsap.fromTo(b, { scale: 0.4 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      gsap.fromTo(w, { opacity: 0, y: 6, scale: 0.8 },
        { opacity: 1, y: -26, scale: 1, duration: 0.9, ease: "power2.out" });
      gsap.to(w, { opacity: 0, y: -44, duration: 0.8, delay: 1.5, onComplete: () => w.remove() });
    } else { setTimeout(() => w.remove(), 2200); }
    if (eggLit >= EGG_WORDS.length && !eggDone) {
      eggDone = true;
      const fin = eggLayer.querySelector(".egg-final");
      if (window.gsap) gsap.fromTo(fin, { opacity: 0, y: 14 }, { opacity: 0.9, y: 0, duration: 1.4, delay: 0.9, ease: "power2.out" });
      else fin.style.opacity = 0.9;
    }
  }
  function openEgg() {
    buildEgg();
    eggLayer.hidden = false;
    if (window.gsap) gsap.fromTo(eggLayer, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" });
    else eggLayer.style.opacity = 1;
  }
  function closeEgg() {
    if (!eggLayer) return;
    if (window.gsap) gsap.to(eggLayer, { opacity: 0, duration: 0.4, onComplete: () => { eggLayer.hidden = true; } });
    else eggLayer.hidden = true;
  }
  document.addEventListener("click", (e) => {
    if (e.target && e.target.closest && e.target.closest(".closing-stars-btn")) openEgg();
  });

  // ── Restart (the HUD cake, like HUMAN.md's mug) ───────────────────
  const home = document.getElementById("hud-home");
  if (home) home.addEventListener("click", () => {
    if (window.__tl) { window.__tl.restart(); }
  });

  // ── Reading version ───────────────────────────────────────────────
  const readBtn = document.getElementById("hud-read");
  if (readBtn) readBtn.addEventListener("click", () => {
    const on = document.body.classList.toggle("reading");
    if (window.__tl) { if (on) window.__tl.pause(); else window.__tl.play(); }
    if (!on && window.__musicOn) {
      const a = document.querySelector(".song");
      if (a && a.paused) a.play().catch(() => {});
    }
    readBtn.textContent = on ? "看影片" : "文字版";
  });

  // ── Parallax fog: three depths, lerped toward the pointer ────────
  const layers = document.querySelectorAll(".bg-layer");
  if (layers.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const setTarget = (x, y) => {
      tx = (x / window.innerWidth - 0.5) * 2;
      ty = (y / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", (e) => setTarget(e.clientX, e.clientY), { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches[0]) setTarget(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    (function drift() {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth || "10");
        l.style.transform = `translate3d(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px, 0)`;
      });
      requestAnimationFrame(drift);
    })();
  }

  // ── Easter egg: tap the file pill five times ──────────────────────
  const pill = document.getElementById("hud-file");
  const toast = document.getElementById("egg-toast");
  if (pill && toast) {
    let taps = 0, last = 0;
    pill.addEventListener("click", () => {
      const now = Date.now();
      taps = now - last < 1200 ? taps + 1 : 1;
      last = now;
      if (taps < 5) return;
      taps = 0;
      toast.hidden = false;
      if (window.gsap) {
        gsap.fromTo(toast, { opacity: 0, y: 16, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
        gsap.to(toast, { opacity: 0, duration: 0.5, delay: 3.2, onComplete: () => (toast.hidden = true) });
        for (let i = 0; i < 14; i++) {
          const s = document.createElement("span");
          s.className = "egg-spark";
          s.textContent = "✦";
          document.body.appendChild(s);
          gsap.fromTo(s, { x: window.innerWidth / 2, y: 60, scale: 0, opacity: 1 }, {
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 320,
            y: 60 + (Math.random() - 0.4) * 260,
            scale: 0.8 + Math.random(), opacity: 0,
            duration: 1 + Math.random() * 0.6, ease: "power2.out",
            onComplete: () => s.remove(),
          });
        }
      } else {
        setTimeout(() => (toast.hidden = true), 3600);
      }
    });
  }
})();
