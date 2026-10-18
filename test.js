(function () {
  const TOTAL = 16;
  const NAMES = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];
  const clamp = n => Math.max(1, Math.min(7, n));
  let t = null, overlay = null, idx = null;
  const files = {};

  const css = document.createElement("style");
  css.textContent = ".t-overlay{position:fixed;inset:0;background:rgba(10,20,50,.6);display:flex;align-items:center;justify-content:center;padding:16px;z-index:50;overflow:auto}.t-box{max-width:560px;width:100%}.t-opt{text-align:left;width:100%}";
  document.head.appendChild(css);

  const rnd = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  async function jsonOf(url) {
    if (files[url]) return files[url];
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + " " + r.status);
    return (files[url] = await r.json());
  }

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "t-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card t-box">' + html + "</div>";
  }
  function close() { if (overlay) overlay.remove(); overlay = null; t = null; }
  function fail() {
    ui('<p class="result no">Die Wortdateien konnten nicht geladen werden. Der Test läuft nur auf der veröffentlichten Seite.</p><div class="row"><button class="btn" data-test="close">Schließen</button></div>');
  }

  async function question() {
    const names = idx.stufen[t.lvl] || [];
    if (!names.length) throw new Error("keine Wörter");
    const list = await jsonOf("woerter/" + rnd(names));
    let cand = list.filter(w => !t.used.has(w.id) && w.d.length >= 12);
    if (!cand.length) cand = list;
    const w = rnd(cand);
    t.used.add(w.id);
    let others = shuffle(list.filter(x => x.id !== w.id && x.t === w.t && x.d !== w.d)).slice(0, 3);
    if (others.length < 3) others = others.concat(shuffle(list.filter(x => x.id !== w.id && x.d !== w.d && !others.includes(x))).slice(0, 3 - others.length));
    t.cur = { w: w, opts: shuffle([w].concat(others)) };
  }

  async function next() {
    try { await question(); } catch (e) { fail(); return; }
    const c = t.cur;
    ui('<span class="tag">Frage ' + (t.hist.length + 1) + " von " + TOTAL + "</span>" +
      '<p class="quiz-sentence">Was bedeutet <span class="gap">' + esc(c.w.w) + "</span>?</p>" +
      c.opts.map((o, i) => '<button class="btn t-opt" data-test="' + i + '">' + esc(o.d) + "</button>").join("") +
      '<div class="row"><button class="btn ghost" data-test="skip">Kenne ich nicht</button><button class="btn ghost" data-test="close">Abbrechen</button></div>');
  }

  async function finish() {
    const last = t.hist.slice(-8).map(h => h.lvl);
    const r = clamp(Math.round((last.reduce((a, b) => a + b, 0) + t.lvl) / (last.length + 1)));
    const right = t.right;
    state.stufe = r;
    state.daily.ids = state.daily.ids.filter(id => state.learned[id]);
    ui('<p class="hint">Ich werte aus …</p>');
    if (typeof prepareWords === "function") await prepareWords();
    addNewWords(NEW_PER_DAY);
    renderAll();
    let dots = "";
    for (let i = 1; i <= 7; i++) dots += '<i class="' + (i <= r ? "on" : "") + '"></i>';
    ui("<h3>Dein Niveau: ungefähr " + NAMES[r - 1] + "</h3>" +
      '<div class="progress" role="img" aria-label="Stufe ' + r + ' von 7">' + dots + "<span>Stufe " + r + " von 7</span></div>" +
      '<p class="meaning">' + right + " von " + TOTAL + " richtig. Das ist eine grobe Schätzung.</p>" +
      '<p class="hint">Neue Wörter kommen jetzt aus dieser Stufe. Du kannst den Test jederzeit wiederholen.</p>' +
      '<div class="row"><button class="btn primary" data-test="close">Weiter lernen</button></div>');
  }

  function answer(i) {
    const c = t.cur, ok = i >= 0 && c.opts[i].id === c.w.id;
    t.hist.push({ lvl: t.lvl, ok: ok });
    if (ok) t.right++;
    const step = t.hist.length <= 2 ? 2 : 1;
    t.lvl = clamp(t.lvl + (ok ? step : -step));
    if (t.hist.length >= TOTAL) finish(); else next();
  }

  async function start() {
    t = { lvl: 4, right: 0, used: new Set(), hist: [], cur: null };
    ui('<p class="hint">Lade Fragen …</p>');
    try { if (!idx) idx = await jsonOf("woerter/index.json"); } catch (e) { fail(); return; }
    next();
  }

  window.testHtml = function () {
    const l = state.stufe;
    return '<article class="card"><span class="tag">Dein Niveau</span>' +
      '<p class="meaning">' + (l ? "Ungefähr " + NAMES[l - 1] + " (Stufe " + l + " von 7)." : "Noch nicht bestimmt. 16 Fragen, etwa drei Minuten.") + "</p>" +
      '<div class="row"><button class="btn ' + (l ? "" : "primary") + '" data-test="start">' + (l ? "Test wiederholen" : "Niveau-Test starten") + "</button></div></article>";
  };

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-test]");
    if (!b) return;
    const a = b.dataset.test;
    if (a === "start") start();
    else if (a === "close") close();
    else if (t && a === "skip") answer(-1);
    else if (t) answer(Number(a));
  });
})();