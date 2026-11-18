(function () {
  window.Components = window.Components || {};

  window.Components.gift = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-gift";
      div.innerHTML = `
        <div class="gift-anim"><div class="gift-box">🎁</div></div>
        <p class="gift-hint">${section.hint || ""}</p>
        <p class="gift-sub">${section.sub || ""}</p>
        <p class="gift-reveal">${section.reveal || ""}</p>
      `;
      const box = div.querySelector(".gift-box");
      box.addEventListener("click", () => {
        if (div._tl && div._tl.paused()) div._tl.play();
      });
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      el._tl = tl;
      const wrap = el.querySelector(".gift-anim");
      tl.from(wrap, { duration: 0.9, opacity: 0, y: 30, scale: 0.7, ease: "power2.out" })
        .from(el.querySelector(".gift-hint"), { duration: 0.6, opacity: 0, y: 12 }, "-=0.3")
        .from(el.querySelector(".gift-sub"), { duration: 0.6, opacity: 0, y: 12 }, "-=0.35")
        .addPause()
        .to([el.querySelector(".gift-hint"), el.querySelector(".gift-sub")], { duration: 0.3, opacity: 0 })
        .to(wrap, { duration: 0.09, rotation: 7, repeat: 5, yoyo: true, ease: "power1.inOut" })
        .to(wrap, { duration: 0.55, scale: 2.4, opacity: 0, ease: "power2.out" })
        .fromTo(el.querySelector(".gift-reveal"),
          { opacity: 0, scale: 0.85, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, "-=0.15")
        .to(el.querySelector(".gift-reveal"), {
          duration: 0.8, opacity: 0, y: -16, filter: "blur(6px)", ease: "power2.in",
        }, "+=2.6");
    },
  };
})();
