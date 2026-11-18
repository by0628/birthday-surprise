(function () {
  window.Components = window.Components || {};

  window.Components.greeting = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-greeting";
      div.innerHTML = `
        <h1 class="greeting-title">
          ${section.title || "Hi"}
          <span class="greeting-name">${config.name}</span>
        </h1>
        <p class="greeting-subtitle">${section.subtitle || ""}</p>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      tl.fromTo(el.querySelector(".greeting-title"),
        { opacity: 0, y: 26, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" }
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
