(function () {
  window.Components = window.Components || {};

  window.Components.gift = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-gift";
      div.innerHTML = `
        <div class="gift-anim"><div class="gift-box"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="14" y="28" width="36" height="26"/><rect x="10" y="18" width="44" height="10"/><line x1="32" y1="18" x2="32" y2="54"/><path d="M32 18c-6 0-9-3-9-6 0-2 2-4 4-4 3 0 5 4 5 10zm0 0c6 0 9-3 9-6 0-2-2-4-4-4-3 0-5 4-5 10z"/></svg></div></div>
        <p class="gift-hint">${section.hint || ""}</p>
        <p class="gift-sub">${section.sub || ""}</p>
        <figure class="gift-card">
          <img class="gift-img" src="./img/gift-love.webp" alt="I Love" />
          <figcaption class="gift-reveal">${section.reveal || ""}</figcaption>
        </figure>
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
        // The gift itself: his hand-drawn card, floating in with a
        // slight polaroid tilt; the old reveal line is now its caption.
        .fromTo(el.querySelector(".gift-card"),
          { opacity: 0, scale: 0.82, rotation: -7, y: 26, filter: "blur(10px)" },
          { opacity: 1, scale: 1, rotation: -2, y: 0, filter: "blur(0px)", duration: 1.15, ease: "back.out(1.4)" }, "-=0.15")
        .fromTo(el.querySelector(".gift-reveal"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.45")
        .to(el.querySelector(".gift-card"), {
          duration: 0.8, opacity: 0, y: -16, filter: "blur(6px)", ease: "power2.in",
        }, "+=3.4");
    },
  };
})();
