(function () {
  const INTER = [0, 1, 3, 7, 14, 30];
  const PER = 5;

  /* Textsorten: Aufbau [Schritt, was hineingehört], Formulierungshilfen, typische Fehler */
  const T = [
    { n: "Erörterung (steigernd)", steps: [
        ["Einleitung", "Hinführung zum Thema, Fragestellung nennen"],
        ["Erstes Argument", "Das schwächste Argument mit These, Begründung und Beispiel"],
        ["Zweites Argument", "Ein mittleres Argument mit These, Begründung und Beispiel"],
        ["Letztes Argument", "Das stärkste Argument zum Schluss, mit Begründung und Beispiel"],
        ["Schluss", "Fazit ziehen, eigene Meinung nennen, Ausblick geben"]],
      phr: ["Häufig wird behauptet, dass …", "Dafür spricht, dass …", "Besonders überzeugend ist, dass …", "Zusammenfassend lässt sich sagen, dass …"],
      err: ["Argumente nur behaupten, ohne Begründung und Beispiel.", "Im Schluss neue Argumente einführen."] },
    { n: "Erörterung (dialektisch)", steps: [
        ["Einleitung", "Hinführung zum Thema, Frage nennen"],
        ["Pro-Argumente", "Argumente, die für die Position sprechen, mit Beispielen"],
        ["Kontra-Argumente", "Argumente, die dagegen sprechen, mit Beispielen"],
        ["Abwägen", "Beide Seiten gewichten und begründen, welche schwerer wiegt"],
        ["Schluss", "Eigene Stellungnahme und Ausblick"]],
      phr: ["Einerseits spricht dafür, dass …", "Andererseits ist zu bedenken, dass …", "Abwägend lässt sich festhalten, dass …", "Meiner Meinung nach überwiegt …"],
      err: ["Nur eine Seite ausführlich behandeln.", "Die eigene Meinung schon in den Hauptteil mischen."] },
    { n: "Textanalyse (Sachtext)", steps: [
        ["Einleitung", "Autor, Titel, Textsorte, Thema, Datum und Kernaussage in einem Satz"],
        ["Inhalt", "Den Text in eigenen Worten und im Präsens nach Sinnabschnitten zusammenfassen"],
        ["Aufbau und Argumentation", "Wie ist der Text gegliedert, wie begründet der Autor?"],
        ["Sprachliche Mittel", "Stilmittel zitieren, benennen und ihre Wirkung erklären"],
        ["Fazit", "Absicht und Wirkung des Textes zusammenfassen, eigene Einschätzung"]],
      phr: ["Der Autor vertritt die These, dass …", "Zur Stützung führt er an, dass …", "Die Metapher „…“ verdeutlicht …", "Insgesamt will der Autor erreichen, dass …"],
      err: ["Nur Stilmittel aufzählen, ohne die Wirkung zu erklären.", "Den Inhalt nacherzählen, statt den Text zu analysieren."] },
    { n: "Gedichtanalyse", steps: [
        ["Einleitung", "Titel, Autor, Epoche, Thema und eine erste Deutungsidee"],
        ["Inhalt", "Strophe für Strophe kurz wiedergeben"],
        ["Form", "Strophen, Verse, Reim und Metrum beschreiben"],
        ["Sprache und Stilmittel", "Stilmittel mit Zitat benennen und ihre Wirkung erklären"],
        ["Deutung und Fazit", "Die Aussage des Gedichts deuten, Bezug zur Epoche, eigene Einschätzung"]],
      phr: ["Das Gedicht thematisiert …", "Das lyrische Ich empfindet …", "Der Kreuzreim verleiht dem Gedicht …", "Zusammenfassend zeigt das Gedicht, dass …"],
      err: ["Statt „der Dichter“ immer das lyrische Ich meinen, wenn es um den Sprecher im Gedicht geht.", "Die Form nennen, aber nicht deuten."] },
    { n: "Inhaltsangabe", steps: [
        ["Basissatz", "Autor, Titel, Textsorte und Thema in einem Satz"],
        ["Kernhandlung", "Die wichtigsten Ereignisse in der richtigen Reihenfolge"],
        ["Abschluss", "Wie die Geschichte endet, optional eine kurze Deutung"]],
      phr: ["In dem Text „…“ von … geht es um …", "Zunächst …, anschließend …", "Am Ende …"],
      err: ["Wörtliche Rede verwenden, statt sie in indirekte Rede zu verwandeln.", "In der Vergangenheit statt im Präsens schreiben."] },
    { n: "Kommentar", steps: [
        ["Einstieg", "Aufhänger und Thema nennen"],
        ["Meinung", "Die eigene These klar formulieren"],
        ["Argumente", "Mit Beispielen begründen, am besten steigernd"],
        ["Gegenargument entkräften", "Einen Einwand nennen und widerlegen"],
        ["Schluss", "Appell oder Ausblick, der in Erinnerung bleibt"]],
      phr: ["Es ist höchste Zeit, dass …", "Wer das bezweifelt, übersieht, dass …", "Deshalb sollte man …"],
      err: ["Neutral bleiben, obwohl ein Kommentar Position beziehen muss.", "Das Gegenargument ignorieren."] }
  ];

  const ITEMS = [];
  T.forEach((t, ti) => { for (let k = 1; k < t.steps.length; k++) ITEMS.push({ key: "A" + ti + "-" + k, ti: ti, k: k }); });

  let cur = 0, s = null, overlay = null;
  const chk = {};
  const au = () => (state.au && typeof state.au === "object") ? state.au : (state.au = {});
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function queue() {
    const e = au(), t = todayKey(), due = [], fresh = [];
    ITEMS.forEach((x, i) => { const r = e[x.key]; if (r) { if (r.due <= t) due.push(i); } else fresh.push(i); });
    due.sort((a, b) => e[ITEMS[a].key].due.localeCompare(e[ITEMS[b].key].due));
    return due.concat(shuffle(fresh)).slice(0, PER);
  }

  function build(i) {
    const x = ITEMS[i], t = T[x.ti], r = au()[x.key], ok = r ? r.ok : 0;
    const kind = ok % 2 === 0 ? "next" : "wo";
    const right = t.steps[x.k][0];
    let wrong = t.steps.map(z => z[0]).filter((z, j) => j !== x.k && !(kind === "next" && j === x.k - 1));
    if (wrong.length < 3) wrong = wrong.concat(shuffle([].concat(...T.map(z => z.steps.map(y => y[0]))).filter(y => y !== right && wrong.indexOf(y) < 0)));
    wrong = shuffle(Array.from(new Set(wrong))).filter(y => y !== right).slice(0, 3);
    return { i: i, kind: kind, opts: shuffle([{ t: right, ok: true }].concat(wrong.map(y => ({ t: y, ok: false })))) };
  }

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "t-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card t-box">' + html + "</div>";
  }
  function close() { if (overlay) overlay.remove(); overlay = null; s = null; if (typeof renderAll === "function") renderAll(); }

  function render() {
    if (s.pos >= s.queue.length) {
      ui('<h3>Geschafft</h3><p class="meaning">' + s.right + " von " + s.done + ' Fragen gleich richtig. Was noch nicht sitzt, kommt wieder.</p>' +
        '<div class="row"><button class="btn primary" data-au="close">Fertig</button><button class="btn" data-au="start">Noch eine Runde</button></div>');
      return;
    }
    const i = s.queue[s.pos], x = ITEMS[i], t = T[x.ti];
    if (!s.q || s.q.i !== i || s.qpos !== s.pos) { s.q = build(i); s.qpos = s.pos; s.answered = false; }
    const q = s.q, head = '<span class="tag">' + esc(t.n) + " · Frage " + (s.pos + 1) + " von " + s.queue.length + "</span>";
    let body;
    if (s.answered) {
      body = '<p class="result ' + (s.ok ? "ok" : "no") + '" role="status">' + (s.ok ? "Richtig." : "Nicht ganz.") + "</p>" +
        '<p class="quiz-sentence"><b>' + esc(t.steps[x.k][0]) + "</b></p><p class=\"hint\">" + esc(t.steps[x.k][1]) + "</p>" +
        '<div class="row"><button class="btn primary" data-au="next">Weiter</button></div>';
    } else {
      const frage = q.kind === "next" ? "Welcher Teil folgt in der " + esc(t.n) + " auf „" + esc(t.steps[x.k - 1][0]) + "“?"
        : "In welchen Teil der " + esc(t.n) + " gehört das: „" + esc(t.steps[x.k][1]) + "“?";
      body = '<p class="quiz-sentence">' + frage + "</p>" + q.opts.map((o, n) => '<button class="btn t-opt" data-au="opt" data-i="' + n + '">' + esc(o.t) + "</button>").join("") +
        '<div class="row"><button class="btn ghost" data-au="skip">Ich weiß es nicht</button><button class="btn ghost" data-au="close">Abbrechen</button></div>';
    }
    ui(head + body);
  }

  function grade(i, ok) {
    const x = ITEMS[i], e = au()[x.key] || { ok: 0, due: "" };
    e.ok = ok ? e.ok + 1 : 0;
    e.due = addDays(todayKey(), ok ? INTER[Math.min(e.ok, 5)] : 0);
    au()[x.key] = e;
    if (typeof touchStreak === "function") touchStreak();
    if (ok && typeof awardSpruch === "function") awardSpruch(4, 5 + Math.min(e.ok, 5));
    save();
  }

  function answer(ok) {
    if (!s || s.answered) return;
    const i = s.q.i;
    s.answered = true; s.ok = ok;
    if (!s.retry.has(i)) { s.done++; if (ok) s.right++; grade(i, ok); }
    if (ok) s.retry.delete(i);
    else { s.retry.add(i); s.queue.splice(Math.min(s.pos + 3, s.queue.length), 0, i); }
    render();
  }

  function paint() {
    const el = document.getElementById("au-card");
    if (!el) return;
    const t = T[cur], e = au(), tt = todayKey();
    const done = ITEMS.filter(x => e[x.key]).length, due = ITEMS.filter(x => e[x.key] && e[x.key].due <= tt).length;
    const got = chk[cur] || (chk[cur] = {});
    el.innerHTML = '<span class="tag">Aufsatz-Werkstatt</span>' +
      '<p class="meaning">So baust du Schularbeits-Texte auf. Wähle eine Textsorte, hake beim Schreiben die Bausteine ab und übe dann die Reihenfolge. <b>' + done + "</b> von " + ITEMS.length + " Aufgaben geübt" + (due ? ", " + due + " zur Wiederholung" : "") + ".</p>" +
      '<div class="row">' + T.map((x, i) => '<button class="btn' + (i === cur ? " primary" : "") + '" data-au="ts" data-i="' + i + '">' + esc(x.n) + "</button>").join("") + "</div>" +
      "<h3>" + esc(t.n) + "</h3>" +
      t.steps.map((st, i) => '<label class="hint" style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" data-au="chk" data-i="' + i + '"' + (got[i] ? " checked" : "") + ' style="margin-top:6px"><span><b>' + (i + 1) + ". " + esc(st[0]) + "</b>: " + esc(st[1]) + "</span></label>").join("") +
      '<p class="hint"><b>Formulierungshilfen:</b></p><div class="example">' + t.phr.map(esc).join("<br>") + "</div>" +
      '<p class="hint"><b>Typische Fehler:</b> ' + t.err.map(esc).join(" ") + "</p>" +
      '<div class="row"><button class="btn primary" data-au="start">Aufbau üben</button></div>';
  }

  function renderAu() {
    const el = document.getElementById("view-rh");
    if (!el || document.getElementById("au-card")) return;
    const anchor = document.getElementById("gd-card") || el.querySelector(".lead");
    if (!anchor) return;
    anchor.insertAdjacentHTML("afterend", '<article class="card" id="au-card"></article>');
    paint();
  }

  window.addEventListener("load", () => {
    const RA = window.renderAll;
    window.renderAll = function () { RA(); try { renderAu(); } catch (e) { /* Karte bleibt weg */ } };
    renderAu();
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-au]");
    if (!b) return;
    const a = b.dataset.au;
    if (a === "ts") { cur = Number(b.dataset.i); paint(); return; }
    if (a === "chk") { (chk[cur] || (chk[cur] = {}))[b.dataset.i] = b.checked; return; }
    if (a === "start") {
      const list = queue();
      if (!list.length) return;
      s = { queue: list, pos: 0, done: 0, right: 0, retry: new Set(), q: null, qpos: -1, answered: false, ok: false };
      render(); return;
    }
    if (a === "close") { close(); return; }
    if (!s) return;
    if (a === "opt") answer(!!s.q.opts[Number(b.dataset.i)].ok);
    else if (a === "skip") answer(false);
    else if (a === "next") { s.pos++; render(); }
  });
})();
