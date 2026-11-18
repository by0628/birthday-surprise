(function () {
  window.Components = window.Components || {};

  window.Components.greeting = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-greeting";
      const nameChars = (config.name || "")
        .split("")
        .map((c) => `<span class="g-name-ch">${c}</span>`)
        .join("");
      div.innerHTML = `
        <h1 class="greeting-title">
          ${section.title || "Hi"}
          <span class="greeting-name">${nameChars}</span>
        </h1>
        <p class="greeting-subtitle">${section.subtitle || ""}</p>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      // Kinetic type: the name lands letter by letter, each from a
      // different height and tilt — SplitText-style, hand-split.
      tl.fromTo(el.querySelectorAll(".g-name-ch"),
        { opacity: 0, y: 44, rotation: () => (Math.random() - 0.5) * 26, filter: "blur(8px)" },
        { opacity: 1, y: 0, rotation: 0, filter: "blur(0px)", duration: 0.75, ease: "back.out(1.7)", stagger: 0.09 }
      )
      .fromTo(el.querySelector(".greeting-title"),
        { opacity: 0 },
        { opacity: 1, duration: 0.05, ease: "none" }, 0
      )
      .fromTo(el.querySelector(".greeting-subtitle"),
        { opacity: 0, y: 18, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, "-=0.6"
      )
      .to(el.querySelector(".greeting-title"), {
        duration: 0.9, opacity: 0, y: -18, filter: "blur(8px)", ease: "power2.in",
      }, "+=3.5")
      .to(el.querySelector(".greeting-subtitle"), {
        duration: 0.9, opacity: 0, y: -14, filter: "blur(8px)", ease: "power2.in",
      }, "-=0.65");
    },

  };
})();
