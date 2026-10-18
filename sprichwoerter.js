(function () {
  const INTER = [0, 1, 3, 7, 14, 30];
  const PER = 5;
  const NAMES = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];
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

  /* lädt zuerst die Dateien der eigenen Stufe, dann die Nachbarstufen, bis genug neue Sprichwörter da sind */
  async function ensure() {
    if (!idx) idx = await getJson("woerter/index.json");
    const want = state.stufe || 3, e = sp();
    const order = [want];
    for (let d = 1; d < 7; d++) order.push(want - d, want + d);
    let fresh = 0;
    for (const l of order) {
      if (l < 1 || l > 7 || !idx.sprueche || !idx.sprueche[l]) continue;
      if (!loaded[l]) loaded[l] = await getJson("woerter/" + idx.sprueche[l]);
      fresh += loaded[l].filter(x => !e[String(x.id)]).length;
      if (fresh >= 40) break;
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
    const head = '<span class="tag">Sprichwort ' + (s.pos + 1) + " von " + s.queue.length + " · " + NAMES[Math.max(0, Math.min(6, x.level - 1))] + "</span>";
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

  /* Eintrag für die Liste "Meine Sprichwörter" */
  function entries() {
    const e = sp(), out = [];
    Object.keys(e).forEach(k => {
      const r = e[k], n = Number(k);
      let p = r.p, b = r.b, level = r.level;
      if (!p && n < SPRUECHE.length && SPRUECHE[n]) { p = SPRUECHE[n].p; b = SPRUECHE[n].b; level = 2; }
      if (p) out.push({ k: k, p: p, b: b, level: level || 3, ok: r.ok || 0, due: r.due || "" });
    });
    return out;
  }

  function renderSpr() {
    const el = document.getElementById("view-spr");
    if (!el || typeof SPRUECHE === "undefined") return;
    const list = entries(), t = todayKey();
    const due = list.filter(x => x.due <= t).length;
    const sits = list.filter(x => x.ok >= 3).length;
    const totals = {}, got = {};
    for (let l = 1; l <= 7; l++) { totals[l] = (idx && idx.spAnzahl && idx.spAnzahl[l]) || 0; got[l] = 0; }
    totals[2] += SPRUECHE.length;
    list.forEach(x => { got[x.level] = (got[x.level] || 0) + 1; });
    const total = Object.values(totals).reduce((a, b) => a + b, 0);

    const badge = document.getElementById("badge-spr");
    if (badge) { badge.textContent = due; badge.hidden = due === 0; }

    const bars = NAMES.map((n, i) => {
      const l = i + 1;
      if (!totals[l]) return "";
      const pct = Math.min(100, Math.round(got[l] / totals[l] * 100));
      return '<div><p class="hint">' + n + ": " + got[l] + " von " + totals[l] + '</p><div style="height:6px;border-radius:3px;background:var(--line)"><div style="height:6px;border-radius:3px;background:var(--accent);width:' + pct + '%"></div></div></div>';
    }).join("");

    list.sort((a, b) => (a.due || t).localeCompare(b.due || t) || a.p.localeCompare(b.p));
    const items = list.slice(0, 60).map(x =>
      '<div class="item"><span class="word" style="font-size:18px">' + esc(x.p) + '</span><span class="tag">' + esc(NAMES[Math.max(0, Math.min(6, x.level - 1))]) + " · " + esc(dueText({ due: x.due || t })) + "</span>" +
      '<p class="sub">' + esc(x.b) + "</p>" + progressHtml(Math.min(5, Math.max(1, x.ok))) + "</div>").join("");

    el.innerHTML = '<p class="lead">Lerne Sprichwörter in kleinen Runden, passend zu deinem Niveau. Was du kannst, kommt seltener wieder, was nicht sitzt, öfter.</p>' +
      '<article class="card"><span class="tag">Dein Fortschritt</span><p class="meaning"><b>' + list.length + "</b> gelernt, davon " + sits + " sicher (von " + total + " insgesamt). " +
      (due ? "Zu wiederholen: " + due + "." : list.length ? "Heute ist nichts fällig. Du kannst trotzdem neue üben." : "Starte mit deiner ersten Runde.") + "</p>" +
      '<div class="row"><button class="btn primary" data-sp="start">Üben</button></div>' + bars + "</article>" +
      (list.length ? '<h3>Meine Sprichwörter</h3><div class="list">' + items + "</div>" + (list.length > 60 ? '<p class="hint">Die ersten 60 werden angezeigt.</p>' : "") : "");
  }

  window.addEventListener("load", () => {
    const RA = window.renderAll;
    window.renderAll = function () { RA(); try { renderSpr(); } catch (e) { /* Reiter bleibt leer */ } };
    getJson("woerter/index.json").then(j => { idx = j; renderSpr(); }).catch(() => {});
    renderSpr();
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