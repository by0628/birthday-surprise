(function () {
  window.Components = window.Components || {};

  window.Components.quote = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-quote";
      const text = section.text || "Every year is a gift.";
      div.innerHTML = `
        <div class="quote-card">
          <span class="quote-mark">"</span>
          <p class="quote-text">${text.split("").map((c) => `<span class="tw-char">${c}</span>`).join("")}</p>
          ${section.author ? `<p class="quote-author">— ${section.author}</p>` : ""}
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const card = el.querySelector(".quote-card");
      const mark = el.querySelector(".quote-mark");
      const chars = el.querySelectorAll(".tw-char");
      const author = el.querySelector(".quote-author");

      tl.fromTo(card,
        { opacity: 0, scale: 0.96, y: 26, filter: "blur(10px)" },
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" })
        .from(mark, { duration: 0.5, opacity: 0, scale: 1.6, rotation: -10, ease: "power2.out" }, "-=0.4")
        .to(chars, { duration: 0.01, visibility: "visible", stagger: 0.06 }, "+=0.2");

      if (author) {
        tl.from(author, { duration: 0.6, opacity: 0, y: 10, ease: "power2.out" }, "+=0.3");
      }

      tl.to(card, {
        duration: 0.8, opacity: 0, y: -18, filter: "blur(8px)", ease: "power2.in",
      }, "+=3.2");
    },
  };
})();
