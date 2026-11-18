(function () {
  window.Components = window.Components || {};

  window.Components.announcement = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-announcement";
      const text = section.text || "It's your birthday!!";
      div.innerHTML = `<p>${text.split("").map((c) => `<span class="tw-char">${c}</span>`).join("")}</p>`;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const chars = el.querySelectorAll(".tw-char");
      tl.to(chars, {
        duration: 0.01, visibility: "visible", stagger: 0.09,
      }, "+=0.3")
      .to(el.querySelector("p"), {
        duration: 0.8, opacity: 0, y: -14, filter: "blur(6px)", ease: "power2.in",
      }, "+=2.4");
    },
  };
})();
