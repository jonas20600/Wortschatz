(function () {
  const MEILENSTEINE = [3, 7, 14, 30, 100, 365];
  const TAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const st = document.createElement("style");
  st.textContent =
    ".streak{display:flex;flex-direction:column;gap:10px}" +
    ".streak-top{display:flex;align-items:center;gap:12px}" +
    ".streak-flame{font-size:34px;line-height:1}" +
    ".streak-n{font-family:var(--font-display);font-size:28px;font-weight:700;line-height:1}" +
    ".streak-week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center}" +
    ".streak-day{border-radius:10px;padding:6px 0;background:var(--surface-2);color:var(--muted);font-size:13px}" +
    ".streak-day.on{background:var(--marker);color:var(--marker-fg);font-weight:700}" +
    ".streak-day.now{outline:2px solid var(--accent)}";
  document.head.appendChild(st);

    const BONUS = { 3: 30, 7: 70, 14: 150, 30: 300, 100: 1000, 365: 3000 };

  function meilenstein() {
    const st = state.streak, n = st.count, heute = todayKey();
    if (st.last !== heute || !BONUS[n]) return;
    if (!state.score || typeof state.score !== "object") state.score = {};
    const s = state.score, key = heute + ":" + n;
    if (s.msKey === key) return;
    s.msKey = key;
    s.total = (s.total || 0) + BONUS[n];
    s.today = (s.day === heute ? (s.today || 0) : 0) + BONUS[n];
    s.day = heute;
    s.bestDay = Math.max(s.bestDay || 0, s.today);
    save();
  }
  function aktiveTage() {
    const s = state.streak, set = new Set();
    if (!s.last || !s.count || diffDays(s.last, todayKey()) > 1) return set;
    for (let i = 0; i < s.count; i++) set.add(addDays(s.last, -i));
    return set;
  }

  function streakHtml() {
    const n = currentStreak();
    const on = aktiveTage();
    const heute = todayKey();
    const wd = (new Date().getDay() + 6) % 7;
    let wochen = "";
    for (let i = 0; i < 7; i++) {
      const k = addDays(heute, i - wd);
      wochen += '<div class="streak-day' + (on.has(k) ? " on" : "") + (i === wd ? " now" : "") + '">' + TAGE[i] + "<br>" + (on.has(k) ? "✔" : "·") + "</div>";
    }
    const next = MEILENSTEINE.find(m => m > n);
    let text;
    if (n === 0) text = "Lerne heute ein Wort und starte deine Serie.";
    else if (state.streak.last !== heute) text = "Lerne heute etwas, damit deine Serie nicht reißt.";
    else text = "Heute erledigt.";
        const sc = state.score;
    if (sc && sc.msKey && sc.msKey.indexOf(heute + ":") === 0) text = "🎉 Meilenstein! +" + BONUS[sc.msKey.split(":")[1]] + " Punkte. " + text;
    if (next) text += " Noch " + (next - n) + (next - n === 1 ? " Tag" : " Tage") + " bis " + next + " Tage in Folge.";
    return '<article class="card streak"><div class="streak-top"><span class="streak-flame">' + (n ? "🔥" : "💤") +
      '</span><div><div class="streak-n">' + n + (n === 1 ? " Tag" : " Tage") + ' in Folge</div><div class="hint">' + text + "</div></div></div>" +
      '<div class="streak-week">' + wochen + "</div></article>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const rt = renderToday;
    renderToday = function () {
      meilenstein();
      rt();
      $("view-today").insertAdjacentHTML("afterbegin", streakHtml());
    };
    const rs = renderStats;
    renderStats = function () {
      rs();
      const n = currentStreak();
      $("st-streak").textContent = (n ? "🔥 " : "") + n;
    };
  });
})();