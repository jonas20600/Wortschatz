(function () {
  const INTER = [0, 1, 3, 7, 14, 30];
  const PER = 5;
  const AUTHORS = [
    { s: "Goethe", wq: "Johann Wolfgang von Goethe", l: 4 },
    { s: "Schiller", wq: "Friedrich Schiller", l: 4 },
    { s: "Busch", wq: "Wilhelm Busch", l: 3 },
    { s: "Heine", wq: "Heinrich Heine", l: 5 },
    { s: "Lessing", wq: "Gotthold Ephraim Lessing", l: 5 },
    { s: "Fontane", wq: "Theodor Fontane", l: 5 },
    { s: "Tucholsky", wq: "Kurt Tucholsky", l: 5 },
    { s: "Lichtenberg", wq: "Georg Christoph Lichtenberg", l: 6 },
    { s: "Kant", wq: "Immanuel Kant", l: 6 },
    { s: "Nietzsche", wq: "Friedrich Nietzsche", l: 6 }
  ];
  const pages = {};
  let s = null, overlay = null;
  const zt = () => (state.zt && typeof state.zt === "object") ? state.zt : (state.zt = {});
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function hash(t) { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return "z" + (h >>> 0).toString(36); }

  function clean(x) {
    x = x.replace(/<ref[\s\S]*?<\/ref>/g, "").replace(/<[^>]*>/g, "");
    for (let i = 0; i < 3; i++) x = x.replace(/\{\{[^{}]*\}\}/g, "");
    return x.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1").replace(/\[https?:[^\]]*\]/g, "").replace(/'{2,}/g, "").replace(/\s+/g, " ").trim();
  }

  function parse(wt, a) {
    const out = [], seen = new Set();
    for (const line of wt.split("\n")) {
      const h = line.match(/^=+\s*(.+?)\s*=+\s*$/);
      if (h && /(über|Sekundär|Weblinks|Einzelnachweis|Literatur|Siehe auch|Quellen|Nachweise)/i.test(h[1])) break;
      const m = line.match(/^\*(?!\*)\s*(.+)/);
      if (!m) continue;
      let t = clean(m[1]).replace(/^[„“"»«]+|[“"»«]+$/g, "");
      if (t.length < 25 || t.length > 170 || /https?:/.test(t) || t.toLowerCase().includes(a.s.toLowerCase())) continue;
      const k = hash(t);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ k: k, t: t, a: AUTHORS.indexOf(a) });
    }
    return out;
  }

  async function loadAuthor(a) {
    if (pages[a.s]) return pages[a.s];
    const r = await fetch("https://de.wikiquote.org/w/api.php?action=parse&prop=wikitext&format=json&formatversion=2&redirects=1&origin=*&page=" + encodeURIComponent(a.wq));
    const j = await r.json();
    if (!j.parse || !j.parse.wikitext) throw new Error("keine Seite");
    return (pages[a.s] = parse(j.parse.wikitext, a));
  }

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "t-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card t-box">' + html + "</div>";
  }
  function close() { if (overlay) overlay.remove(); overlay = null; s = null; if (typeof renderAll === "function") renderAll(); }

     function hinweise(t) {
    const h = [];
    if (/\b(wie|als ob|gleich)\b/i.test(t)) h.push("Ein Vergleich (wie, als ob): Was wird womit verglichen?");
    if (/\?/.test(t)) h.push("Eine Frage: Wird eine Antwort erwartet oder ist es eine rhetorische Frage?");
    if (/\bsondern\b|\bzwar\b[\s\S]*\baber\b|\bentweder\b/i.test(t)) h.push("Ein Gegensatz (nicht … sondern, zwar … aber): Welche zwei Seiten stehen gegeneinander?");
    if (/\bwer\b[\s\S]*,\s*(der|die|das|dem|den)\b/i.test(t)) h.push("Ein „Wer …, der …“-Satz: Er sagt allgemein, wie jemand handelt und was daraus folgt.");
    const w = t.toLowerCase().match(/[a-zäöüß]{4,}/g) || [], c = {};
    w.forEach(x => { c[x] = (c[x] || 0) + 1; });
    if (Object.values(c).some(n => n >= 2)) h.push("Ein Wort kommt mehrfach vor: Warum wird es wiederholt?");
    if (/\b(nie|immer|alle|jeder|nichts|alles|kein)\b/i.test(t)) h.push("Ein Wort wie „nie“, „immer“, „alles“, „nichts“: Ist das übertrieben gemeint?");
    return h;
  }

  function render() {
    if (s.pos >= s.queue.length) {
      ui('<h3>Geschafft</h3><p class="meaning">' + s.right + " von " + s.done + ' Zitaten gleich richtig. Was noch nicht sitzt, kommt wieder.</p>' +
        '<div class="row"><button class="btn primary" data-zt="close">Fertig</button><button class="btn" data-zt="start">Noch eine Runde</button></div>');
      return;
    }
    const q = s.queue[s.pos], au = AUTHORS[q.a];
    if (!s.opts || s.optsPos !== s.pos) {
      s.opts = shuffle([{ t: au.s, ok: true }].concat(shuffle(AUTHORS.filter(x => x !== au)).slice(0, 3).map(x => ({ t: x.s, ok: false }))));
      s.optsPos = s.pos; s.answered = false;
    }
    const head = '<span class="tag">Zitat ' + (s.pos + 1) + " von " + s.queue.length + "</span>";
    let body;
    if (s.answered) {
      body = '<p class="quiz-sentence">„' + esc(q.t) + '“</p><p class="result ' + (s.ok ? "ok" : "no") + '" role="status">' + (s.ok ? "Richtig." : "Nicht ganz.") + "</p>" +
        '<p class="hint">Das Zitat stammt von <b>' + esc(au.s) + "</b>.</p>" +
        '<div class="hint" style="padding:10px 12px;border-left:3px solid var(--marker)"><b>So verstehst du das Zitat:</b><br>' +
        "1. Wörtlich: Was steht da genau? Schwierige Wörter findest du im Reiter Wörterbuch.<br>" +
        "2. Übertragen: Was ist damit eigentlich gemeint?<br>" +
        "3. Anwenden: In welcher Situation passt der Satz?" +
        (hinweise(q.t).length ? "<br><br><b>Achte auf:</b><br>" + hinweise(q.t).map(esc).join("<br>") : "") + "</div>" +
        '<div class="row"><button class="btn primary" data-zt="next">Weiter</button></div>';
    } else {
      body = '<p class="quiz-sentence">„' + esc(q.t) + '“</p><p class="hint">Von wem stammt dieses Zitat?</p>' +
        s.opts.map((o, n) => '<button class="btn t-opt" data-zt="opt" data-i="' + n + '">' + esc(o.t) + "</button>").join("") +
        '<div class="row"><button class="btn ghost" data-zt="skip">Ich weiß es nicht</button><button class="btn ghost" data-zt="close">Abbrechen</button></div>';
    }
    ui(head + body);
  }

  function grade(q, ok) {
    const e = zt()[q.k] || { ok: 0, due: "" };
    e.t = q.t; e.a = q.a;
    e.ok = ok ? e.ok + 1 : 0;
    e.due = addDays(todayKey(), ok ? INTER[Math.min(e.ok, 5)] : 0);
    zt()[q.k] = e;
    if (typeof touchStreak === "function") touchStreak();
    if (ok && typeof awardSpruch === "function") awardSpruch(AUTHORS[q.a].l, 5 + Math.min(e.ok, 5));
    save();
  }

  function answer(ok) {
    if (!s || s.answered) return;
    const q = s.queue[s.pos];
    s.answered = true; s.ok = ok;
    if (!s.retry.has(q.k)) { s.done++; if (ok) s.right++; grade(q, ok); }
    if (ok) s.retry.delete(q.k);
    else { s.retry.add(q.k); s.queue.splice(Math.min(s.pos + 3, s.queue.length), 0, q); }
    render();
  }

  async function start() {
    const e = zt(), t = todayKey();
    const due = Object.keys(e).filter(k => e[k].due <= t && e[k].t).map(k => ({ k: k, t: e[k].t, a: e[k].a }));
    let list = due.slice(0, PER);
    if (list.length < PER) {
      ui('<p class="hint">Lade Zitate von Wikiquote …</p>');
      let tries = 0;
      for (const a of shuffle(AUTHORS)) {
        if (list.length >= PER || tries >= 3) break;
        tries++;
        try {
          const qs = (await loadAuthor(a)).filter(q => !e[q.k]);
          list = list.concat(shuffle(qs).slice(0, 3));
        } catch (err) { /* nächster Autor */ }
      }
      list = list.slice(0, PER);
    }
    if (!list.length) {
      ui('<p class="result no">Es konnten keine Zitate geladen werden. Prüfe deine Verbindung.</p><div class="row"><button class="btn" data-zt="close">Schließen</button></div>');
      return;
    }
    s = { queue: list, pos: 0, done: 0, right: 0, retry: new Set(), opts: null, optsPos: -1, answered: false, ok: false };
    render();
  }

  function renderZt() {
    const el = document.getElementById("view-spr");
    if (!el || document.getElementById("zt-card")) return;
    const lead = el.querySelector(".lead");
    if (!lead) return;
    const e = zt(), t = todayKey(), n = Object.keys(e).length;
    const due = Object.keys(e).filter(k => e[k].due <= t).length;
    lead.insertAdjacentHTML("afterend", '<article class="card" id="zt-card"><span class="tag">Zitate</span>' +
      '<p class="meaning">Berühmte Sätze von Goethe, Schiller, Heine, Kant und anderen. Du lernst, von wem sie stammen und was sie aussagen, damit du sie in Aufsätzen und Reden treffend einsetzen kannst. <b>' + n + "</b> geübt" + (due ? ", " + due + " zur Wiederholung" : "") + ".</p>" +
      '<div class="row"><button class="btn primary" data-zt="start">Zitate üben</button></div><p class="foot">Quelle: de.wikiquote.org, Lizenz CC BY-SA 4.0</p></article>');
  }

  window.addEventListener("load", () => {
    const RA = window.renderAll;
    window.renderAll = function () { RA(); try { renderZt(); } catch (e) { /* Karte bleibt weg */ } };
    renderZt();
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-zt]");
    if (!b) return;
    const a = b.dataset.zt;
    if (a === "start") { start(); return; }
    if (a === "close") { close(); return; }
    if (!s) return;
    if (a === "opt") answer(!!s.opts[Number(b.dataset.i)].ok);
    else if (a === "skip") answer(false);
    else if (a === "next") { s.pos++; render(); }
  });
})();
