/**
 * scrollstory — a HUMAN.md-style scrollytelling chapter.
 *
 * The main film pauses on this scene. The scene itself is driven by a
 * smoothed (lerped) scroll progress — wheel / touch swipe / keys feed a
 * target, a rAF loop eases the real progress toward it and scrubs an
 * internal GSAP timeline: words light up one by one, the moon crosses
 * parallax layers, and a big word settles in with tightening spacing.
 * When the progress completes, "繼續" appears; tapping it (or "跳過"
 * at any time) hands control back to the main film. If nobody interacts
 * for a while, the scene slowly plays itself so the film never stalls.
 */
(function () {
  window.Components = window.Components || {};

  const splitChars = (text) =>
    (text || "")
      .split("")
      .map((c) => `<span class="ss-w">${c === " " ? "&nbsp;" : c}</span>`)
      .join("");

  window.Components.scrollstory = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-scrollstory";

      const stars = Array.from({ length: 26 }, () => {
        const x = (Math.random() * 100).toFixed(1);
        const y = (Math.random() * 55).toFixed(1);
        const s = (Math.random() * 2.4 + 1.2).toFixed(1);
        const d = (Math.random() * 3).toFixed(2);
        return `<i class="ss-star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-delay:${d}s"></i>`;
      }).join("");

      div.innerHTML = `
        <div class="ss-layer ss-far">${stars}<span class="ss-moon">🌙</span></div>
        <div class="ss-layer ss-near"><span class="ss-hill ss-hill--l"></span><span class="ss-hill ss-hill--r"></span></div>
        <div class="ss-stage">
          ${(section.lines || []).map((l) => `<p class="ss-line">${splitChars(l)}</p>`).join("")}
          <p class="ss-big">${splitChars(section.bigWord || "")}</p>
        </div>
        <div class="ss-ui">
          <p class="ss-hint">${section.hint || ""}</p>
          <div class="ss-bar"><i class="ss-bar-fill"></i></div>
          <button class="ss-continue" type="button">${section.continueText || "繼續 ✦"}</button>
          <button class="ss-skip" type="button">${section.skipText || "跳過這一幕"}</button>
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      el._tl = tl;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" });

      if (reduced) {
        // Quiet version: everything simply appears, no scrub, no pause.
        tl.fromTo(el.querySelectorAll(".ss-line, .ss-big"),
          { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.5 }, "+=0.2")
          .to(el, { opacity: 0, duration: 0.6 }, "+=2.5");
        el.querySelectorAll(".ss-w").forEach((w) => (w.style.opacity = 1));
        return;
      }

      tl.addPause();
      const pauseAt = tl.duration();

      // Exit sequence — runs when the scene hands control back.
      tl.to(el.querySelector(".ss-stage"), {
          opacity: 0, y: -22, filter: "blur(8px)", duration: 0.7, ease: "power2.in",
        }, "+=0.25")
        .to(el.querySelector(".ss-ui"), { opacity: 0, duration: 0.35 }, "<")
        .to(el, { opacity: 0, duration: 0.45, ease: "power1.in" }, "-=0.15");

      // ── Scrub engine ──────────────────────────────────────────────
      const words = el.querySelectorAll(".ss-line .ss-w");
      const bigChars = el.querySelectorAll(".ss-big .ss-w");
      const moon = el.querySelector(".ss-moon");
      const near = el.querySelector(".ss-near");
      const fill = el.querySelector(".ss-bar-fill");
      const hint = el.querySelector(".ss-hint");
      const btnContinue = el.querySelector(".ss-continue");
      const btnSkip = el.querySelector(".ss-skip");

      const inner = gsap.timeline({ paused: true });
      inner
        .to(words, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.35, ease: "power2.out", stagger: 0.045,
        }, 0)
        .fromTo(moon, { x: "-12vw", y: "4vh", opacity: 0.35 },
          { x: "10vw", y: "-3vh", opacity: 1, duration: 1, ease: "none" }, 0)
        .fromTo(near, { y: 26 }, { y: 0, duration: 1, ease: "none" }, 0)
        .fromTo(bigChars, {
            opacity: 0, scale: 1.7, y: 26, rotation: () => (Math.random() - 0.5) * 24,
            filter: "blur(10px)",
          }, {
            opacity: 1, scale: 1, y: 0, rotation: 0,
            filter: "blur(0px)",
            duration: 0.3, ease: "expo.out", stagger: 0.05,
          }, 0.55)
        .fromTo(el.querySelector(".ss-big"),
          { letterSpacing: "0.32em" }, { letterSpacing: "0.05em", duration: 0.4, ease: "expo.out" }, 0.55);

      const state = { target: 0, current: 0 };
      let rafId = null, finished = false, activatedAt = 0, autoTimer = null;

      const isActive = () =>
        !finished && tl.paused() && Math.abs(tl.time() - pauseAt) < 0.08 &&
        !document.body.classList.contains("reading") &&
        !document.body.classList.contains("index-open");

      const loop = () => {
        if (finished) { rafId = null; return; }
        state.current += (state.target - state.current) * 0.085;
        if (Math.abs(state.target - state.current) < 0.0005) state.current = state.target;
        inner.progress(state.current);
        if (fill) fill.style.transform = `scaleX(${state.current})`;
        if (state.current > 0.985 && !finished) showContinue();
        rafId = requestAnimationFrame(loop);
      };

      const startLoop = () => { if (rafId == null) rafId = requestAnimationFrame(loop); };

      function showContinue() {
        hint.style.opacity = 0;
        btnContinue.classList.add("is-on");
      }

      function finish() {
        if (finished) return;
        finished = true;
        if (autoTimer) clearTimeout(autoTimer);
        if (tl.paused()) tl.play();
      }

      function onWheel(e) {
        if (!isActive()) return;
        e.preventDefault();
        state.target = Math.min(1, Math.max(0, state.target + e.deltaY * 0.00085));
        startLoop();
      }
      function onKey(e) {
        if (!isActive()) return;
        if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
          e.preventDefault();
          state.target = Math.min(1, state.target + 0.09);
          startLoop();
        }
      }
      let lastY = null;
      function onTouchStart(e) { lastY = e.touches[0].clientY; }
      function onTouchMove(e) {
        if (!isActive() || lastY == null) return;
        e.preventDefault();
        const y = e.touches[0].clientY;
        state.target = Math.min(1, Math.max(0, state.target + (lastY - y) * 0.0021));
        lastY = y;
        startLoop();
      }

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      btnContinue.addEventListener("click", () => { if (state.current > 0.9) finish(); });
      btnSkip.addEventListener("click", finish);

      // Watch-mode fallback: if she just watches, the scene drifts
      // forward by itself after a few idle seconds. The same watcher
      // re-arms the scene when the film is replayed from the top.
      setInterval(() => {
        if (finished) {
          if (tl.time() < pauseAt - 0.3) {
            finished = false;
            activatedAt = 0;
            state.target = 0;
            state.current = 0;
            inner.progress(0);
            if (fill) fill.style.transform = "scaleX(0)";
            btnContinue.classList.remove("is-on");
            hint.style.opacity = "";
          }
          return;
        }
        if (!isActive()) return;
        if (!activatedAt) {
          activatedAt = Date.now();
          autoTimer = setTimeout(() => {
            if (finished || !isActive() || state.target > 0.12) return;
            gsap.to(state, {
              target: 1, duration: 7, ease: "power1.inOut",
              onStart: startLoop,
            });
          }, 6500);
        }
      }, 400);
    },
  };
})();
