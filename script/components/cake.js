(function () {
  window.Components = window.Components || {};

  window.Components.cake = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-cake";
      let sparks = "";
      for (let i = 0; i < 10; i++) sparks += `<span class="cake-spark">✦</span>`;
      div.innerHTML = `
        <div class="cake-wrap">
          <div class="cake-box">🎂</div>
          ${sparks}
        </div>
        <p class="cake-hint">${section.hint || ""}</p>
        <p class="cake-sub">${section.sub || ""}</p>
        <p class="cake-wish">${section.wish || ""}</p>
      `;
      const box = div.querySelector(".cake-box");
      box.addEventListener("click", () => {
        if (div._tl && div._tl.paused()) div._tl.play();
      });
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      el._tl = tl;
      const wrap = el.querySelector(".cake-wrap");
      const box = el.querySelector(".cake-box");
      const sparks = el.querySelectorAll(".cake-spark");
      tl.from(wrap, { duration: 0.9, opacity: 0, y: 30, scale: 0.7, ease: "power2.out" })
        .from(el.querySelector(".cake-hint"), { duration: 0.6, opacity: 0, y: 12 }, "-=0.3")
        .from(el.querySelector(".cake-sub"), { duration: 0.6, opacity: 0, y: 12 }, "-=0.35")
        .addPause()
        .to([el.querySelector(".cake-hint"), el.querySelector(".cake-sub")], { duration: 0.3, opacity: 0 })
        .to(box, { duration: 0.16, filter: "brightness(1.9)", scale: 1.06, ease: "power1.out" })
        .to(box, { duration: 0.5, filter: "brightness(1)", scale: 1, ease: "power2.out" })
        .fromTo(sparks,
          { scale: 0, opacity: 1, x: 0, y: 0 },
          {
            scale: 1.3, opacity: 0, duration: 0.9, ease: "power2.out",
            x: () => (Math.random() - 0.5) * 260,
            y: () => (Math.random() - 0.75) * 240,
            stagger: 0.03,
          }, "-=0.45")
        .fromTo(el.querySelector(".cake-wish"),
          { opacity: 0, y: 14, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, "-=0.5")
        .to([wrap, el.querySelector(".cake-wish")], {
          duration: 0.8, opacity: 0, y: -16, filter: "blur(6px)", ease: "power2.in",
        }, "+=2.6");
    },
  };
})();
