(function () {
  const INTER = [0, 1, 3, 7, 14, 30];
  const PER = 5;
  let s = null, overlay = null, idx = null, L = [];
  const loaded = {}, cache = {};

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  async function getJson(url) {
    if (cache[url]) return cache[url];
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + " " + r.status);
    return (cache[url] = await r.json());
  }
  const sp = () => (state.sp && typeof state.sp === "object") ? state.sp : (state.sp = {});
  const clean = w => w.replace(/[.,;:!?„“"]/g, "");
  const words = p => p.split(/\s+/).map(clean);
  function gapWord(p) { const t = words(p).filter(w => w.length >= 4).sort((a, b) => b.length - a.length); return t[0] || null; }
  function pool() { const set = new Set(); L.forEach(x => words(x.p).forEach(w => { if (w.length >= 4) set.add(w); })); return [...set]; }

  async function ensure() {
    if (!idx) idx = await getJson("woerter/index.json");
    const want = state.stufe || 3;
    for (const l of [want, want - 1, want + 1]) {
      if (l < 1 || l > 7 || loaded[l] || !idx.sprueche || !idx.sprueche[l]) continue;
      loaded[l] = await getJson("woerter/" + idx.sprueche[l]);
    }
  }

  function rebuild() {
    L = [];
    const seen = new Set();
    SPRUECHE.forEach((x, i) => { const k = String(i); seen.add(k); L.push({ k: k, p: x.p, b: x.b, level: 2 }); });
    const e = sp();
    Object.keys(e).forEach(k => { if (!seen.has(k) && e[k].p) { seen.add(k); L.push({ k: k, p: e[k].p, b: e[k].b, level: e[k].level || 3 }); } });
    Object.keys(loaded).forEach(l => loaded[l].forEach(x => {
      const k = String(x.id);
      if (!seen.has(k)) { seen.add(k); L.push({ k: k, p: x.p, b: x.b, level: x.level }); }
    }));
  }

  function dueAll() {
    const e = sp(), t = todayKey(), want = state.stufe || 3;
    const due = [], fresh = [];
    L.forEach((x, i) => { const r = e[x.k]; if (r) { if (r.due <= t) due.push(i); } else fresh.push(i); });
    due.sort((a, b) => e[L[a].k].due.localeCompare(e[L[b].k].due));
    const key = new Map(fresh.map(i => [i, Math.abs(L[i].level - want) + Math.random() * 0.9]));
    fresh.sort((a, b) => key.get(a) - key.get(b));
    return due.concat(fresh);
  }

  function build(i) {
    const x = L[i], e = sp()[x.k], ok = e ? e.ok : 0, gap = gapWord(x.p);
    let kind = ok === 0 ? "bedeutung" : ok === 1 ? "luecke" : "tippen";
    if (kind !== "bedeutung" && !gap) kind = "bedeutung";
    const q = { i: i, kind: kind };
    if (kind === "bedeutung") {
      const others = shuffle(L.filter((y, j) => j !== i && y.b !== x.b)).slice(0, 3).map(y => ({ t: y.b, ok: false }));
      q.opts = shuffle([{ t: x.b, ok: true }].concat(others));
      return q;
    }
    const at = x.p.indexOf(gap);
    q.gap = gap;
    q.html = esc(x.p.slice(0, at)) + '<span class="gap">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + esc(x.p.slice(at + gap.length));
    if (kind === "luecke") {
      const near = shuffle(pool().filter(w => w.toLowerCase() !== gap.toLowerCase() && Math.abs(w.length - gap.length) <= 2)).slice(0, 3).map(w => ({ t: w, ok: false }));
      q.opts = shuffle([{ t: gap, ok: true }].concat(near));
    }
    return q;
  }

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "t-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card t-box">' + html + "</div>";
  }
  function close() {
    if (overlay) overlay.remove();
    overlay = null; s = null;
    if (typeof renderAll === "function") renderAll();
  }

  function render() {
    if (s.pos >= s.queue.length) {
      ui("<h3>Geschafft</h3><p class=\"meaning\">" + s.right + " von " + s.done + " Sprichwörtern gleich richtig. Was noch nicht sitzt, kommt wieder.</p>" +
        '<div class="row"><button class="btn primary" data-sp="close">Fertig</button><button class="btn" data-sp="start">Noch eine Runde</button></div>');
      return;
    }
    const i = s.queue[s.pos], x = L[i];
    if (!s.q || s.q.i !== i || s.qpos !== s.pos) { s.q = build(i); s.qpos = s.pos; s.answered = false; }
    const q = s.q;
    const head = '<span class="tag">Sprichwort ' + (s.pos + 1) + " von " + s.queue.length + "</span>";
    let body;
    if (s.answered) {
      body = '<p class="quiz-sentence">' + esc(x.p) + '</p><p class="result ' + (s.ok ? "ok" : "no") + '" role="status">' +
        (s.ok ? "Richtig." : "Nicht ganz." + (q.gap ? " Das Wort ist: " + esc(q.gap) : "")) + '</p><p class="hint">' + esc(x.b) + "</p>" +
        '<div class="row"><button class="btn primary" data-sp="next">Weiter</button></div>';
    } else {
      const opts = q.opts ? q.opts.map((o, n) => '<button class="btn t-opt" data-sp="opt" data-i="' + n + '">' + esc(o.t) + "</button>").join("") : "";
      const tail = '<div class="row">' + (q.kind === "tippen" ? '<button class="btn primary" data-sp="check">Prüfen</button>' : "") +
        '<button class="btn ghost" data-sp="skip">Ich weiß es nicht</button><button class="btn ghost" data-sp="close">Abbrechen</button></div>';
      if (q.kind === "bedeutung") body = '<p class="quiz-sentence">„' + esc(x.p) + '“</p><p class="hint">Was bedeutet dieses Sprichwort?</p>' + opts + tail;
      else if (q.kind === "luecke") body = '<p class="quiz-sentence">' + q.html + '</p><p class="hint">Bedeutung: ' + esc(x.b) + "</p>" + opts + tail;
      else body = '<p class="quiz-sentence">' + q.html + '</p><p class="hint">Bedeutung: ' + esc(x.b) + '</p><input class="field" id="sp-in" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Fehlendes Wort">' + tail;
    }
    ui(head + body);
    const inp = document.getElementById("sp-in");
    if (inp) inp.focus();
  }

  function grade(i, ok) {
    const x = L[i], e = sp()[x.k] || { ok: 0, due: "" };
    e.ok = ok ? e.ok + 1 : 0;
    e.due = addDays(todayKey(), ok ? INTER[Math.min(e.ok, 5)] : 0);
    if (Number(x.k) >= 3000000) { e.p = x.p; e.b = x.b; e.level = x.level; }
    sp()[x.k] = e;
    if (typeof touchStreak === "function") touchStreak();
     if (ok && typeof awardSpruch === "function") awardSpruch(x.level, 5 + Math.min(e.ok, 5));
    save();
  }

  function answer(ok) {
    if (!s || s.answered) return;
    const i = s.q.i;
    s.answered = true;
    s.ok = ok;
    if (!s.retry.has(i)) { s.done++; if (ok) s.right++; grade(i, ok); }
    if (ok) s.retry.delete(i);
    else { s.retry.add(i); s.queue.splice(Math.min(s.pos + 4, s.queue.length), 0, i); }
    render();
  }

  async function start() {
    ui('<p class="hint">Lade Sprichwörter …</p>');
    try { await ensure(); } catch (e) { /* dann gibt es nur die eingebauten */ }
    rebuild();
    const list = dueAll().slice(0, PER);
    if (!list.length) {
      ui('<h3>Keine Sprichwörter gefunden</h3><div class="row"><button class="btn primary" data-sp="close">Schließen</button></div>');
      return;
    }
    s = { queue: list, pos: 0, done: 0, right: 0, retry: new Set(), q: null, qpos: -1, answered: false, ok: false };
    render();
  }

  function card() {
    if (typeof SPRUECHE === "undefined" || !SPRUECHE.length) return "";
    const e = sp(), keys = Object.keys(e), t = todayKey();
    const total = SPRUECHE.length + (idx && idx.spAnzahl ? Object.values(idx.spAnzahl).reduce((a, b) => a + b, 0) : 0);
    const sits = keys.filter(k => e[k].ok >= 3).length, due = keys.filter(k => e[k].due <= t).length;
    return '<article class="card"><span class="tag">Sprichwörter üben</span><p class="meaning">' + keys.length + " gelernt, davon " + sits + " sicher (von " + total + " insgesamt). " +
      (due ? "Zu wiederholen: " + due + "." : "") + '</p><div class="row"><button class="btn primary" data-sp="start">Üben</button></div></article>';
  }

  window.addEventListener("load", () => {
    const P = window.proverbHtml;
    window.proverbHtml = function () { return (typeof P === "function" ? P() : "") + card(); };
    getJson("woerter/index.json").then(j => { idx = j; if (typeof renderToday === "function") renderToday(); }).catch(() => {});
    if (typeof renderToday === "function") renderToday();
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-sp]");
    if (!b) return;
    const a = b.dataset.sp;
    if (a === "start") { start(); return; }
    if (a === "close") { close(); return; }
    if (!s) return;
    if (a === "opt") answer(!!s.q.opts[Number(b.dataset.i)].ok);
    else if (a === "check") { const v = document.getElementById("sp-in"); if (v && v.value.trim()) answer(norm(v.value) === norm(s.q.gap)); }
    else if (a === "skip") answer(false);
    else if (a === "next") { s.pos++; render(); }
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Enter" && ev.target && ev.target.id === "sp-in") { ev.preventDefault(); const v = ev.target; if (s && v.value.trim()) answer(norm(v.value) === norm(s.q.gap)); }
  });
})();