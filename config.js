/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 * Customized for 齊銳欣 (QRX) — 繁體詩意版
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "齊銳欣",
  photo: "",                        // No photo by request
  music: "./music/hbd.mpeg",

  // ── Theme Colors — Aurevny mist palette (from 霧中來信) ──────
  colors: {
    primary: "#8fa3b0",           // Mist blue
    accent: "#7d8b96",            // Fog slate
    dark: {
      background: "#101216",
      text: "#e9edeb",
    },
    light: {
      background: "#e9edeb",
      text: "#2e353a",
    },
  },

  defaultMode: "dark",

  // ── Sections ──────────────────────────────────────────────────
  sections: [
    {
      type: "greeting",
      title: "嗨",
      subtitle: "今天，是屬於你的日子。",
    },
    {
      type: "countdown",
      from: 3,
      goText: "🎉",
    },
    {
      type: "announcement",
      text: "今天，是你的生日。",
    },
    {
      type: "chatbox",
      message:
        "生日快樂。\n願新的一歲裡，\n開心像晨光一樣多一點，\n煩惱像薄霧一樣少一點。\n那些你悄悄想要的，\n不必急著追，\n也終會在某個不經意的轉彎處，\n慢慢靠近你。",
      buttonText: "送出",
    },
    {
      type: "ideas",
      lines: [
        "我原本想，",
        "只說一句生日快樂就好。",
        "可是話到了嘴邊，又停住了。",
        "總想著，要給你一點<strong>特別</strong>的。",
        "因為——",
        "你本就是，特別的那一個 <span>✦</span>",
      ],
      bigLetters: "QRX",
    },
    {
      type: "quote",
      text: "願歲月溫柔待你，願你眼裡，永遠有光。",
    },
    {
      type: "stars",
      count: 40,
    },
    {
      type: "balloons",
      count: 25,
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 9,
    },
    {
      type: "closing",
      text: "好了，回去告訴我——這個小驚喜，你喜不喜歡。",
      replayText: "若想再看一遍，點這裡。",
    },
  ],
};
