(function () {
  const NEED = 40;        // sichere Wörter pro Stufe, um die nächste freizuschalten
  const SICHER_BOX = 3;   // ab dieser Lernstufe gilt ein Wort als sicher
  const NAMES = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];

  function sc() {
    if (!state.score || typeof state.score !== "object") state.score = {};
    const s = state.score;
    s.total = s.total || 0; s.today = s.today || 0; s.bestDay = s.bestDay || 0; s.bestStreak = s.bestStreak || 0;
    const d = todayKey();
    if (s.day !== d) { s.day = d; s.today = 0; }
    return s;
  }

  function stufeOf(id) {
    const w = byId.get(id);
    return w && typeof wordStufe === "function" ? wordStufe(w) : 3;
  }

  function award(id, base) {
    const s = sc();
    let pts = Math.round(base * (1 + (stufeOf(id) - 1) * 0.25));
    const d = todayKey();
    if (s.bonusDay !== d && state.streak.count > 1) { s.bonusDay = d; pts += Math.min(state.streak.count, 30) * 2; }
    s.total += pts;
    s.today += pts;
    s.bestDay = Math.max(s.bestDay, s.today);
    s.bestStreak = Math.max(s.bestStreak, state.streak.count);
    save();
  }

    window.awardSpruch = function (level, base) {
    const s = sc();
    let pts = Math.round(base * (1 + ((level || 3) - 1) * 0.25));
    const d = todayKey();
    if (s.bonusDay !== d && state.streak.count > 1) { s.bonusDay = d; pts += Math.min(state.streak.count, 30) * 2; }
    s.total += pts;
    s.today += pts;
    s.bestDay = Math.max(s.bestDay, s.today);
    s.bestStreak = Math.max(s.bestStreak, state.streak.count);
    save();
  };
  function sicher(stufe) {
    return Object.keys(state.learned).filter(k => {
      const w = byId.get(Number(k));
      return w && state.learned[k].box >= SICHER_BOX && wordStufe(w) === stufe;
    }).length;
  }

  function checkUnlock() {
    const cur = state.stufe || 3;
    if (cur >= 7 || sicher(cur) < NEED) return;
    state.stufe = cur + 1;
    const s = sc();
    s.unlock = { stufe: cur + 1, day: todayKey() };
    s.total += 100; s.today += 100;
    s.bestDay = Math.max(s.bestDay, s.today);
    save();
    if (typeof prepareWords === "function") prepareWords().then(renderAll);
  }

  window.scoreHtml = function () {
    const s = sc(), cur = state.stufe || 3, n = sicher(cur);
    const pct = cur >= 7 ? 100 : Math.min(100, Math.round(n / NEED * 100));
    const unlock = s.unlock && s.unlock.day === todayKey()
      ? '<p class="done-note">Neue Stufe freigeschaltet: ' + NAMES[s.unlock.stufe - 1] + ". +100 Punkte!</p>" : "";
    return '<article class="card"><span class="tag">Dein Fortschritt</span>' + unlock +
      '<p class="meaning"><b>' + s.total + "</b> Punkte · heute " + s.today + "</p>" +
      '<p class="hint">Stufe ' + NAMES[cur - 1] + ": " + (cur >= 7 ? "höchste Stufe erreicht." : n + " von " + NEED + " Wörtern sicher (zweimal richtig wiederholt).") + "</p>" +
      '<div style="height:8px;border-radius:4px;background:var(--line)"><div style="height:8px;border-radius:4px;background:var(--accent);width:' + pct + '%"></div></div>' +
      '<p class="hint">Rekord: bester Tag ' + s.bestDay + " Punkte · längste Serie " + s.bestStreak + " Tage</p></article>";
  };

  /* Punkte-Logik vor die vorhandenen Funktionen hängen, erst wenn die Seite komplett geladen ist */
  window.addEventListener("load", () => {
    const L = window.markLearned, G = window.gradeReview, S = window.saveSentence;
    window.markLearned = function (id) {
      const had = !!state.learned[id];
      L(id);
      if (!had && state.learned[id]) award(id, 10);
    };
    window.gradeReview = function (id, ok) {
      const e = state.learned[id], box = e ? e.box : 1;
      G(id, ok);
      if (ok) award(id, 5 + box);
      checkUnlock();
    };
    window.saveSentence = function (id, text) {
      const e = state.learned[id], had = !!(e && e.sentence);
      S(id, text);
      if (e && !had && String(text).trim()) award(id, 20);
      checkUnlock();
    };
  });
})();