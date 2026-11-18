(function () {
  window.Components = window.Components || {};

  window.Components.chatbox = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-chatbox";
      div.innerHTML = `
        <div class="text-box">
          <p class="hbd-chatbox"></p>
          <p class="fake-btn">${section.buttonText || "Send"}</p>
        </div>
        <p class="chatbox-hint">${section.hint || ""}</p>
      `;
      const chatbox = div.querySelector(".hbd-chatbox");
      const msg = section.message || "Happy Birthday!";
      chatbox.innerHTML = msg
        .split("")
        .map((ch) => (ch === "\n" ? "<br>" : `<span>${ch}</span>`))
        .join("");
      const btn = div.querySelector(".fake-btn");
      btn.addEventListener("click", () => {
        const tl = div._tl;
        if (!tl) return;
        if (tl.paused()) { tl.play(); return; }
        // Tapped while the poem is still typing: finish the typing
        // instantly and wait at the pause for a second tap to send.
        if (div._pauseAt != null && tl.time() < div._pauseAt - 0.05) {
          tl.seek(div._pauseAt);
          tl.pause();
        }
      });
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      el._tl = tl;
      const spans = el.querySelectorAll(".hbd-chatbox span");
      tl.from(el.querySelector(".text-box"), {
        duration: 0.9, opacity: 0, y: 24, scale: 0.96, ease: "power2.out",
      })
      .from(el.querySelector(".fake-btn"), {
        duration: 0.5, opacity: 0, scale: 0.6, ease: "power2.out",
      })
      .from(el.querySelector(".chatbox-hint"), {
        duration: 0.5, opacity: 0, y: 8,
      }, "-=0.2")
      .to(spans, {
        duration: 0.01, visibility: "visible", stagger: 0.05,
      }, "+=0.3")
      .addPause();

      el._pauseAt = tl.duration();

      tl.to(el.querySelector(".chatbox-hint"), { duration: 0.3, opacity: 0 })
      .to(el.querySelector(".fake-btn"), {
        duration: 0.15, backgroundColor: "rgb(127, 206, 248)", scale: 0.94,
      })
      .to(el.querySelector(".text-box"), {
        duration: 0.7, scale: 0.2, opacity: 0, y: -150, ease: "power2.in",
      }, "+=0.35");
    },
  };
})();
