(function () {
  window.Components = window.Components || {};

  const ENTER = { opacity: 0, y: 26, filter: "blur(8px)" };
  const ENTERED = { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" };
  const LEAVE = { opacity: 0, y: -18, filter: "blur(6px)", duration: 0.7, ease: "power2.in" };

  window.Components.ideas = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-ideas";

      const lines = section.lines || [];
      lines.forEach((line, i) => {
        const isLast = i === lines.length - 1;
        const p = document.createElement("p");
        p.className = isLast ? "idea-line idea-special" : "idea-line";
        p.innerHTML = line;
        div.appendChild(p);
      });

      // Big letters (e.g. "SO")
      if (section.bigLetters) {
        const p = document.createElement("p");
        p.className = "idea-big-letters";
        p.innerHTML = section.bigLetters
          .split("")
          .map((ch) => `<span>${ch}</span>`)
          .join("");
        div.appendChild(p);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const regularLines = el.querySelectorAll(".idea-line:not(.idea-special)");
      const specialLine = el.querySelector(".idea-special");
      const bigLetters = el.querySelectorAll(".idea-big-letters span");

      // Regular lines: enter → wait → leave
      regularLines.forEach((line) => {
        tl.fromTo(line, { ...ENTER }, { ...ENTERED });

        const strong = line.querySelector("strong");
        if (strong) {
          tl.to(strong, {
            duration: 0.5, scale: 1.12, x: 6,
            backgroundColor: "var(--accent)", color: "#fff",
          });
        }

        tl.to(line, { ...LEAVE }, "+=2.5");
      });

      // Special last line: dramatic entrance
      if (specialLine) {
        tl.fromTo(specialLine,
          { opacity: 0, scale: 0.92, y: 24, filter: "blur(10px)" },
          { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" },
          "+=1.2"
        );

        const span = specialLine.querySelector("span");
        if (span) {
          tl.to(span, { duration: 0.7, rotation: 90, x: 8 }, "+=1.4");
        }

        tl.to(specialLine, {
          duration: 0.7, scale: 0.94, opacity: 0, filter: "blur(6px)", ease: "power2.in",
        }, "+=2");
      }

      // Big letters: fly in scattered from different depths/angles
      // and assemble — the HUMAN.md letters-engine move.
      if (bigLetters.length) {
        tl.fromTo(bigLetters,
          {
            scale: 2.6, opacity: 0, rotation: () => (Math.random() - 0.5) * 50,
            x: () => (Math.random() - 0.5) * 320, y: () => (Math.random() - 0.5) * 220,
            filter: "blur(10px)",
          },
          {
            scale: 1, opacity: 1, rotation: 0, x: 0, y: 0,
            filter: "blur(0px)", duration: 0.85, ease: "expo.out", stagger: 0.16,
          }
        )
        .to(bigLetters, {
          duration: 0.8, scale: 3, opacity: 0, rotation: -15,
          ease: "expo.out", stagger: 0.2,
        }, "+=1.5");
      }
    },
  };
})();
