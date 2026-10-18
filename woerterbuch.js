(function () {
  const API = "https://de.wiktionary.org/w/api.php?action=parse&prop=wikitext&format=json&formatversion=2&redirects=1&origin=*&page=";
  const ART = { f: "die", m: "der", n: "das" };
  const rx = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let last = null;

  const css = document.createElement("style");
  css.textContent = "#dict-q{flex:1;min-width:180px;width:auto}@media(max-width:440px){.tab{font-size:15px;padding:10px 4px}}";
  document.head.appendChild(css);

  /* eigene Wörter beim Start in die Wortliste eintragen */
  window.registerCustom = function () {
    if (!Array.isArray(state.custom)) state.custom = [];
    state.custom.forEach(c => { if (!byId.has(c.id)) { WORDS.push(c); byId.set(c.id, c); } });
  };

  function clean(s) {
    s = s.replace(/<ref[\s\S]*?<\/ref>/g, "").replace(/<[^>]*>/g, "");
    for (let i = 0; i < 3; i++) s = s.replace(/\{\{[^{}]*\}\}/g, "");
    return s.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1").replace(/'{2,}/g, "").replace(/\s+/g, " ").replace(/^[\s,;:.]+/, "").trim();
  }

  function block(sec, name) {
    const m = sec.match(new RegExp("\\{\\{" + name + "\\}\\}[^\\n]*\\n([\\s\\S]*?)(?=\\n\\{\\{|\\n==|$)"));
    if (!m) return [];
    return m[1].split("\n").filter(l => l.startsWith(":"))
      .map(l => clean(l.replace(/^:+\s*(\[\d[^\]]*\])?/, ""))).filter(Boolean);
  }

  function sentence(title, exs) {
    const res = [new RegExp("(^|[^\\p{L}])(" + rx(title) + ")(?![\\p{L}])", "iu")];
    if (title.length > 6) res.push(new RegExp("(^|[^\\p{L}])(" + rx(title.slice(0, -2)) + "\\p{L}*)", "iu"));
    for (const re of res) for (const e of exs) {
      const x = e.replace(/^[„“"»«]+|[“"»«]+$/g, "").replace(/[\[\]]/g, "");
      if (x.length < 15 || x.length > 160 || !re.test(x)) continue;
      return x.replace(re, (m, a, b) => a + "[" + b + "]");
    }
    return "Gesucht ist das Wort: [" + title + "].";
  }

  function parseEntry(title, wt) {
    const m = wt.match(/==\s*[^=\n]*\{\{Sprache\|Deutsch\}\}[^\n]*==([\s\S]*?)(?=\n==[^=]|$)/);
    if (!m) return null;
    const wa = m[1].match(/\{\{Wortart\|([^|}]+)\|Deutsch\}\}([^\n]*)/);
    if (!wa) return null;
    const sec = m[1].slice(m[1].indexOf(wa[0]));
    const defs = block(sec, "Bedeutungen");
    if (!defs.length) return null;
    const g = wa[2].match(/\{\{([fmn])\}\}/);
    const isNoun = wa[1] === "Substantiv";
    const d = defs[0].length > 180 ? defs[0].slice(0, 177) + "…" : defs[0];
    return {
      w: isNoun && g ? ART[g[1]] + " " + title : title,
      t: isNoun ? "Nomen" : wa[1],
      d: d,
      s: sentence(title, block(sec, "Beispiele"))
    };
  }

  async function lookup(q) {
    const variants = [...new Set([q, q.charAt(0).toUpperCase() + q.slice(1), q.toLowerCase()])];
    for (const v of variants) {
      const r = await fetch(API + encodeURIComponent(v));
      const j = await r.json();
      if (j.parse && j.parse.wikitext) {
        const e = parseEntry(j.parse.title, j.parse.wikitext);
        if (e) return e;
      }
    }
    return null;
  }

  async function search() {
    const q = document.getElementById("dict-q").value.trim();
    const out = document.getElementById("dict-out");
    if (!q) return;
    out.innerHTML = '<p class="hint">Suche …</p>';
    try { last = await lookup(q); }
    catch (e) { last = null; out.innerHTML = '<p class="hint">Keine Verbindung zum Wörterbuch. Versuche es später noch einmal.</p>'; return; }
    if (!last) { out.innerHTML = '<p class="hint">Dazu habe ich keinen deutschen Eintrag gefunden. Probiere die Grundform, bei Verben zum Beispiel „gehen“ statt „ging“.</p>'; return; }
    const e = last;
    out.innerHTML = '<article class="card"><div class="word-row"><h2 class="word"><mark>' + esc(e.w) + '</mark></h2><span class="tag">' + esc(e.t) + "</span></div>" +
      '<p class="meaning">' + esc(e.d) + '</p><p class="example">' + sentenceHtml(e) + "</p>" +
      '<div class="row"><button class="btn primary" data-dict="add">Zu meinen Wörtern</button></div>' +
      '<p class="done-note" id="dict-msg" role="status"></p></article>';
  }

  function addToPlan(e) {
    const have = WORDS.find(x => norm(x.w) === norm(e.w));
    if (have) {
      if (state.learned[have.id]) return "Dieses Wort lernst du schon.";
      if (!state.daily.ids.includes(have.id)) state.daily.ids.push(have.id);
      save(); renderAll();
      return "Steht jetzt bei „Heute neu“.";
    }
    if (!Array.isArray(state.custom)) state.custom = [];
    const id = Math.max(100000, ...state.custom.map(c => c.id)) + 1;
    state.custom.push({ id: id, w: e.w, t: e.t, d: e.d, s: e.s });
    registerCustom();
    state.daily.ids.push(id);
    save(); renderAll();
    return "Steht jetzt bei „Heute neu“.";
  }

  window.addEventListener("load", () => {
    const el = document.getElementById("view-dict");
    if (!el) return;
    el.innerHTML = '<p class="lead">Suche ein beliebiges deutsches Wort. Was dir begegnet und du nicht sicher kennst, kannst du direkt in deinen Lernplan aufnehmen.</p>' +
      '<div class="row"><input class="field" id="dict-q" type="text" aria-label="Wort suchen" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Wort eintippen">' +
      '<button class="btn primary" id="dict-go">Nachschlagen</button></div><div id="dict-out"></div>' +
      '<p class="foot">Quelle: <a href="https://de.wiktionary.org" target="_blank" rel="noopener">de.wiktionary.org</a>, Lizenz CC BY-SA 4.0</p>';
  });

  document.addEventListener("click", ev => {
    if (ev.target.closest("#dict-go")) search();
    const b = ev.target.closest("[data-dict='add']");
    if (b && last) { const msg = addToPlan(last); const n = document.getElementById("dict-msg"); if (n) n.textContent = msg; }
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Enter" && ev.target && ev.target.id === "dict-q") { ev.preventDefault(); search(); }
  });
})();