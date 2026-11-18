/**
 * ✨ Birthday config — customized for 齐锐欣 (QRX) ✨
 * 繁體詩意版 · Aurevny mist palette
 */

const CONFIG = {
  name: "齐锐欣",
  photo: "",
  music: "./music/hbd.mpeg",

  colors: {
    primary: "#8fa3b0",
    accent: "#7d8b96",
    dark: { background: "#101216", text: "#e9edeb" },
    light: { background: "#e9edeb", text: "#2e353a" },
  },

  defaultMode: "dark",

  sections: [
    { type: "greeting", title: "嗨", subtitle: "今天，是屬於你的日子。" },
    { type: "countdown", from: 3, goText: "🎉" },
    { type: "announcement", text: "今天，是你的生日。" },
    {
      type: "chatbox",
      message: "生日快樂。\n願新的一歲裡，\n開心像晨光一樣多一點，\n煩惱像薄霧一樣少一點。\n那些你悄悄想要的，\n不必急著追，\n也終會在某個不經意的轉彎處，\n慢慢靠近你。",
      buttonText: "送出",
      hint: "點一下「送出」",
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
    { type: "stars", count: 40 },
    { type: "balloons", count: 25 },
    {
      type: "gift",
      hint: "這裡還有一份禮物",
      sub: "點一點，打開它",
      reveal: "禮物不大——只是一整年的好運，都給你。",
    },
    { type: "quote", text: "願歲月溫柔待你，願你眼裡，永遠有光。" },
    {
      type: "cake",
      hint: "許個願吧",
      sub: "點一點蠟燭，吹熄它",
      wish: "願望收好了。它會在新的一歲裡，悄悄實現。",
    },
    { type: "fireworks", count: 24 },
    {
      type: "ideas",
      lines: [
        "有人說，生日不過是普通的一天。",
        "可是因為你，",
        "它變得<strong>不普通</strong>了。",
        "往後的日子，也請多多指教 <span>✦</span>",
      ],
    },
    { type: "confetti", count: 9 },
    {
      type: "closing",
      text: "好了，回去告訴我——這個小驚喜，你喜不喜歡。",
      replayText: "若想再看一遍，點這裡。",
    },
  ],
};
