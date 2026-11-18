(function () {
  window.Components = window.Components || {};

  window.Components.closing = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-closing";
      div.innerHTML = `
        <p class="closing-text">${
          section.text || "Okay, now come back and tell me if you liked it."
        }</p>
        <p class="replay-btn" id="replay">${
          section.replayText || "Or click, if you want to watch it again."
        }</p>
        <p class="last-smile">:)</p>
        <p class="closing-sign">——Aurevny · 2026.11.19</p>
        <button type="button" class="closing-stars-btn">還有一片星空，點一點 ✦</button>
        <a class="closing-music" href="https://by0628.github.io/Music/" target="_blank" rel="noopener">歌還在放 · 去霧中來信繼續聽 →</a>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      tl.fromTo(el.querySelectorAll("p:not(.closing-sign)"),
        { opacity: 0, y: 24, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out", stagger: 1.2 }
      )
      // Enable replay button only after it becomes visible
      .set(el.querySelector("#replay"), { pointerEvents: "auto" })
      .to(el.querySelector(".last-smile"), {
        duration: 0.5, rotation: 90,
      }, "+=1")
      // Signature and the star-egg door fade in with the smile.
      .fromTo(el.querySelector(".closing-sign"),
        { opacity: 0, y: 8 },
        { opacity: 0.5, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.3")
      .set(el.querySelector(".closing-stars-btn"), { pointerEvents: "auto" })
      .fromTo(el.querySelector(".closing-stars-btn"),
        { opacity: 0, y: 8 },
        { opacity: 0.6, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.6")
      // Last of all, barely there: the door to the music site.
      .set(el.querySelector(".closing-music"), { pointerEvents: "auto" })
      .fromTo(el.querySelector(".closing-music"),
        { opacity: 0, y: 10 },
        { opacity: 0.55, y: 0, duration: 1.4, ease: "power2.out" }, "-=0.2");
    },
  };
})();
