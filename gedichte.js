(function () {
  const INTER = [0, 1, 3, 7, 14, 30];
  const NAMES = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];

  /* Übungsgedichte (eigene Texte). Pro Vers: Stilmittel s und Wirkung w. */
  const P = [
    { id: "g1", t: "Morgengrauen", l: 3, thema: "einen müden Morgen",
      lines: ["Die Nacht ist ein Mantel aus schwarzem Samt,", "der Wecker schreit, und die Welt bleibt still.", "Ich bin so müde wie ein Stein im Fluss,", "und tausendmal sage ich: Ich will nicht!"],
      an: [
        { v: 0, s: "Metapher", w: "Die Nacht wird als weicher, schwerer Mantel gezeigt. Das macht sie dunkel und behaglich." },
        { v: 1, s: "Personifikation", w: "Der Wecker handelt wie ein Mensch. Sein Lärm wirkt dadurch wie ein Angriff auf die Ruhe." },
        { v: 2, s: "Vergleich", w: "Der Stein im Fluss zeigt, wie schwer und unbeweglich sich der Sprecher fühlt." },
        { v: 3, s: "Hyperbel", w: "Die Übertreibung zeigt, wie stark der Widerwillen gegen das Aufstehen ist." }],
      aus: { r: "Der Sprecher quält sich müde aus dem Bett und möchte lieber weiterschlafen.", f: ["Der Sprecher freut sich auf einen aufregenden Tag.", "Der Sprecher beschreibt einen ruhigen Sonnenaufgang am Meer.", "Der Sprecher ärgert sich über einen kaputten Wecker."] } },
    { id: "g2", t: "Hinter der Mauer", l: 4, thema: "eine Stadt, die sich abschottet",
      lines: ["Wir wollen Licht, wir wollen Luft, wir wollen Raum.", "Die einen bauen Mauern, die anderen Brücken.", "Wer will schon ewig im Dunkeln stehen?", "Na wunderbar, die Mauer steht ja noch!"],
      an: [
        { v: 0, s: "Trikolon", w: "Drei Wünsche in Folge steigern den Nachdruck und klingen wie eine Forderung." },
        { v: 1, s: "Antithese", w: "Mauern und Brücken stehen sich gegenüber. So werden zwei Haltungen deutlich." },
        { v: 2, s: "Rhetorische Frage", w: "Die Frage braucht keine Antwort. Sie zieht den Leser auf die Seite des Sprechers." },
        { v: 3, s: "Ironie", w: "Der Sprecher meint das Gegenteil. Der bittere Spott zeigt seine Enttäuschung." }],
      aus: { r: "Der Sprecher wünscht sich Offenheit und beklagt, dass andere sich abschotten.", f: ["Der Sprecher lobt den Bau einer neuen Mauer.", "Der Sprecher erzählt von einem Brückenbau am Fluss.", "Der Sprecher verabschiedet sich von seiner Heimatstadt."] } },
    { id: "g3", t: "Am Meer", l: 5, thema: "das Meer",
      lines: ["Und die Wellen kommen und gehen und kehren und fliehen,", "ein beredtes Schweigen liegt über dem Wasser.", "Ich weiß nur eines: dass ich nichts über dich weiß.", "Ich komme, stehe, staune, schweige."],
      an: [
        { v: 0, s: "Polysyndeton", w: "Die vielen „und“ lassen das Auf und Ab der Wellen endlos und gleichmäßig wirken." },
        { v: 1, s: "Oxymoron", w: "Schweigen, das „redet“: Der Widerspruch zeigt eine Stille, die voller Bedeutung ist." },
        { v: 2, s: "Paradoxon", w: "Der scheinbare Widerspruch drückt aus, dass das Meer sich nicht ganz begreifen lässt." },
        { v: 3, s: "Asyndeton", w: "Die Aufzählung ohne „und“ klingt knapp und atemlos, wie ein sprachloses Staunen." }],
      aus: { r: "Der Sprecher steht staunend vor der Größe des Meeres und fühlt sich klein.", f: ["Der Sprecher beschreibt einen lauten Sturm auf See.", "Der Sprecher erklärt, wie man ein Boot steuert.", "Der Sprecher beklagt, dass das Meer verschmutzt ist."] } },
    { id: "g4", t: "Spät am Abend", l: 6, thema: "einen langen Abend unter Freunden",
      lines: ["Nicht wir haben die Zeit, die Zeit hat uns.", "Er verlor den Hut und die Geduld.", "Wir tranken noch ein Glas, dann noch eins.", "Das war kein schlechter Abend."],
      an: [
        { v: 0, s: "Chiasmus", w: "Die Überkreuzstellung dreht das Verhältnis um und macht den Satz zu einer einprägsamen Einsicht." },
        { v: 1, s: "Zeugma", w: "Ein Verb für zwei verschiedene Dinge wirkt witzig und zeigt den Kontrollverlust." },
        { v: 2, s: "Metonymie", w: "Das Glas steht für das Getränk darin. Das klingt locker und alltäglich." },
        { v: 3, s: "Litotes", w: "Die Untertreibung drückt bescheiden aus, dass der Abend sehr gut war." }],
      aus: { r: "Der Sprecher blickt auf einen langen, geselligen Abend zurück, bei dem die Zeit verflog.", f: ["Der Sprecher klagt über einen verpassten Zug.", "Der Sprecher beschreibt einen einsamen Spaziergang bei Nacht.", "Der Sprecher berichtet von einem Streit mit seinem Chef."] } }
    ,
    { id: "w1", t: "Mondnacht", autor: "Eichendorff", ws: "Mondnacht", n: 12, l: 4, thema: "eine stille Sternennacht", lines: null,
      an: [
        { v: [0, 1], s: "Personifikation", w: "Himmel und Erde handeln wie Liebende. Das verbindet Oben und Unten zärtlich und romantisch." },
        { v: [6, 6], s: "Onomatopoesie", w: "Das Wort ahmt das Rauschen nach. Man hört die nächtliche Stille förmlich." },
        { v: [8, 9], s: "Metapher", w: "Die Seele wird wie ein Vogel mit Flügeln gezeigt. Das steht für Freiheit und Befreiung." },
        { v: [10, 11], s: "Vergleich", w: "Der Vergleich mit dem Heimflug drückt Geborgenheit und Heimweh aus." }],
      aus: { r: "Der Sprecher erlebt eine stille, sternklare Nacht, in der Himmel und Erde verschmelzen, und fühlt sich seelisch frei und geborgen.", f: ["Der Sprecher beschreibt einen Sturm, vor dem er sich fürchtet.", "Der Sprecher plant eine Reise in die Stadt.", "Der Sprecher erinnert sich an einen Streit mit einem Freund."] } }
  ];
  const SM = [...new Set(P.flatMap(p => p.an.map(a => a.s)))];

  let g = null, overlay = null;
  const gd = () => (state.gd && typeof state.gd === "object") ? state.gd : (state.gd = {});
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function pick() {
    const e = gd(), t = todayKey(), want = state.stufe || 3;
    const due = P.filter(p => e[p.id] && e[p.id].due <= t);
    const fresh = P.filter(p => !e[p.id]).sort((a, b) => Math.abs(a.l - want) - Math.abs(b.l - want));
    if (due.length) return due[0];
    if (fresh.length) return fresh[0];
    return P[Math.floor(Math.random() * P.length)];
  }

  function steps(p) {
    const s = [];
    p.an.forEach(a => { s.push({ k: "sm", a: a }); s.push({ k: "wk", a: a }); });
    s.push({ k: "aus" });
    s.push({ k: "anw", a: p.an[Math.floor(Math.random() * p.an.length)] });
    return s;
  }

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "t-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card t-box">' + html + "</div>";
  }
  function close() {
    if (overlay) overlay.remove();
    overlay = null; g = null;
    if (typeof renderAll === "function") renderAll();
  }

  function poemHtml(p, mark) {
    const m = Array.isArray(mark) ? mark : (mark >= 0 ? [mark, mark] : null);
    return '<div class="example">' + p.lines.map((l, i) => (m && i >= m[0] && i <= m[1] ? "<mark>" + esc(l) + "</mark>" : esc(l))).join("<br>") + "</div>" +
      (p.ws ? '<p class="hint">Text: ' + esc(p.autor) + ", Wikisource (gemeinfrei)</p>" : "");
  }
  function vtext(p, v) { return Array.isArray(v) ? p.lines.slice(v[0], v[1] + 1).join(" / ") : p.lines[v]; }

  async function loadPoem(p) {
    const r = await fetch("https://de.wikisource.org/w/api.php?action=parse&prop=text&format=json&formatversion=2&redirects=1&origin=*&page=" + encodeURIComponent(p.ws));
    const j = await r.json();
    if (!j.parse) throw new Error("keine Seite");
    const doc = new DOMParser().parseFromString(j.parse.text, "text/html");
    doc.querySelectorAll("sup, .reference, style, table, .mw-editsection").forEach(e => e.remove());
    if (!doc.body.textContent.includes(p.autor)) throw new Error("falscher Autor");
    const take = el => { el.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n"); return el.textContent.split("\n").map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean); };
    let lines = [];
    const boxes = doc.querySelectorAll(".poem");
    if (boxes.length) boxes.forEach(b => { lines = lines.concat(take(b)); });
    else lines = take(doc.querySelector(".mw-parser-output") || doc.body);
    return lines;
  }

  function award(base) { if (typeof awardSpruch === "function") awardSpruch(g.p.l, base); }

  function render() {
    const p = g.p, st = g.steps[g.pos];
    if (!st) { finish(); return; }
    if (!st.q) {
      if (st.k === "sm") st.q = { opts: shuffle([{ t: st.a.s, ok: true }].concat(shuffle(SM.filter(x => x !== st.a.s)).slice(0, 3).map(x => ({ t: x, ok: false })))) };
      else if (st.k === "wk") st.q = { opts: shuffle([{ t: st.a.w, ok: true }].concat(p.an.filter(a => a !== st.a).map(a => ({ t: a.w, ok: false })))) };
      else if (st.k === "aus") st.q = { opts: shuffle([{ t: p.aus.r, ok: true }].concat(p.aus.f.map(x => ({ t: x, ok: false })))) };
    }
    const head = '<span class="tag">' + esc(p.t) + " · " + NAMES[p.l - 1] + " · Schritt " + (g.pos + 1) + " von " + g.steps.length + "</span>";
    let body;
    if (st.k === "anw") {
      body = poemHtml(p, -1) + '<p class="quiz-sentence">Jetzt du: Schreibe zwei Sätze über ' + esc(p.thema) + " und verwende das Stilmittel „" + esc(st.a.s) + "“.</p>" +
        (st.shown
          ? '<p class="hint">Zum Vergleich steht im Gedicht: „' + esc(vtext(p, st.a.v)) + '“ (' + esc(st.a.s) + "). Hast du das Stilmittel wirklich eingesetzt und nicht nur erwähnt?</p>" +
            '<div class="row"><button class="btn primary" data-gd="self" data-v="1">Ja, geschafft</button><button class="btn" data-gd="self" data-v="0">Noch unsicher</button></div>'
          : '<textarea class="field" id="gd-text" rows="3" placeholder="Deine zwei Sätze …"></textarea><div class="row"><button class="btn primary" data-gd="show">Fertig, Vergleich ansehen</button></div>');
    } else if (st.answered) {
      body = poemHtml(p, st.k === "aus" ? -1 : st.a.v) +
        '<p class="result ' + (st.ok ? "ok" : "no") + '" role="status">' + (st.ok ? "Richtig." : "Nicht ganz.") + "</p>" +
        (st.k === "sm" ? '<p class="hint"><b>' + esc(st.a.s) + "</b>: " + esc(st.a.w) + "</p>" : st.k === "wk" ? '<p class="hint">' + esc(st.a.w) + "</p>" : '<p class="hint">' + esc(p.aus.r) + "</p>") +
        '<div class="row"><button class="btn primary" data-gd="next">Weiter</button></div>';
    } else {
      const frage = st.k === "sm" ? "Welches Stilmittel steckt im markierten Vers?"
        : st.k === "wk" ? "Welche Wirkung hat das Stilmittel „" + esc(st.a.s) + "“ im markierten Vers?"
        : "Worum geht es in dem Gedicht?";
      body = poemHtml(p, st.k === "aus" ? -1 : st.a.v) + '<p class="hint">' + frage + "</p>" +
        st.q.opts.map((o, n) => '<button class="btn t-opt" data-gd="opt" data-i="' + n + '">' + esc(o.t) + "</button>").join("") +
        '<div class="row"><button class="btn ghost" data-gd="close">Abbrechen</button></div>';
    }
    if (st.answered && (st.k === "sm" || st.k === "wk") && window.lektionHtml) body += window.lektionHtml(st.a.s);
    ui(head + body);
  }

  function finish() {
    const p = g.p, e = gd(), r = e[p.id] || { ok: 0, due: "" };
    const pct = g.total ? g.right / g.total : 0;
    const gut = pct >= 0.7;
    r.ok = gut ? r.ok + 1 : 0;
    r.due = addDays(todayKey(), gut ? INTER[Math.min(r.ok, 5)] : 1);
    e[p.id] = r;
    if (typeof touchStreak === "function") touchStreak();
    if (gut) award(10);
    save();
    ui("<h3>Geschafft</h3><p class=\"meaning\">" + g.right + " von " + g.total + " Fragen richtig.</p>" +
      '<p class="hint">' + (gut ? "Das Gedicht kommt später zur Wiederholung." : "Das Gedicht kommt morgen noch einmal.") + "</p>" +
      '<div class="row"><button class="btn primary" data-gd="close">Fertig</button><button class="btn" data-gd="start">Nächstes Gedicht</button></div>');
  }

  async function start() {
    let p = pick();
    if (p.ws && !p.lines) {
      ui('<p class="hint">Lade Gedicht von Wikisource …</p>');
      try {
        const lines = await loadPoem(p);
        if (lines.length !== p.n) {
          ui("<h3>Das Gedicht hat eine unerwartete Form</h3><p class=\"hint\">Erwartet " + p.n + " Zeilen, geladen " + lines.length + ". Bitte schicke Claude ein Foto dieser Liste.</p><div class=\"example\">" +
            lines.slice(0, 40).map((x, i) => i + ": " + esc(x)).join("<br>") + '</div><div class="row"><button class="btn" data-gd="close">Schließen</button></div>');
          return;
        }
        p.lines = lines;
      } catch (e) {
        ui('<p class="result no">Das Gedicht konnte nicht geladen werden. Prüfe deine Verbindung.</p><div class="row"><button class="btn" data-gd="close">Schließen</button></div>');
        return;
      }
    }
    g = { p: p, steps: steps(p), pos: 0, right: 0, total: 0 };
    render();
  }

  function renderGd() {
    const el = document.getElementById("view-rh");
    if (!el || document.getElementById("gd-card")) return;
    const lead = el.querySelector(".lead");
    if (!lead) return;
    const e = gd(), t = todayKey();
    const done = P.filter(p => e[p.id]).length, due = P.filter(p => e[p.id] && e[p.id].due <= t).length;
    const list = P.map(p => '<span class="tag">' + esc(p.t) + " (" + NAMES[p.l - 1] + (e[p.id] ? ", Runde " + e[p.id].ok : "") + ")</span>").join(" · ");
    lead.insertAdjacentHTML("afterend", '<article class="card" id="gd-card"><span class="tag">Gedichtanalyse</span>' +
      '<p class="meaning">Lies ein Gedicht, erkenne die Stilmittel, verstehe die Aussage und wende ein Stilmittel dann selbst an. ' +
      "<b>" + done + "</b> von " + P.length + " Gedichten geübt" + (due ? ", " + due + " zur Wiederholung" : "") + ".</p>" +
      '<p class="hint">' + list + '</p><div class="row"><button class="btn primary" data-gd="start">Gedicht üben</button></div></article>');
  }

  window.addEventListener("load", () => {
    const RA = window.renderAll;
    window.renderAll = function () { RA(); try { renderGd(); } catch (e) { /* Karte bleibt weg */ } };
    renderGd();
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-gd]");
    if (!b) return;
    const a = b.dataset.gd;
    if (a === "start") { start(); return; }
    if (a === "close") { close(); return; }
    if (!g) return;
    const st = g.steps[g.pos];
    if (a === "opt" && st && !st.answered) {
      st.answered = true;
      st.ok = !!st.q.opts[Number(b.dataset.i)].ok;
      g.total++;
      if (st.ok) { g.right++; award(4); }
      save();
      render();
    } else if (a === "next") { g.pos++; render(); }
    else if (a === "show") { st.shown = true; render(); }
    else if (a === "self") {
      g.total++;
      if (b.dataset.v === "1") { g.right++; award(6); }
      g.pos++; render();
    }
  });
})();
