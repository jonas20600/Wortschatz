(function () {
  const INTER = [0, 1, 3, 7, 14, 30];
  const PER = 5;
  const NAMES = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];

  /* [Name, Erklärung, Beispiel, Stufe 1-7] */
  const D = [
    ["Metapher", "Ein bildhafter Ausdruck ohne „wie“: Eine Sache wird mit einer anderen gleichgesetzt.", "Die Zeit ist ein Dieb.", 3],
    ["Vergleich", "Zwei Dinge werden mit „wie“ oder „als ob“ verglichen.", "Sie ist stark wie ein Bär.", 3],
    ["Personifikation", "Dinge, Tiere oder Ideen handeln oder fühlen wie Menschen.", "Die Sonne lacht vom Himmel.", 3],
    ["Alliteration", "Mehrere nahe Wörter beginnen mit demselben Laut.", "Milch macht müde Männer munter.", 3],
    ["Hyperbel", "Eine starke Übertreibung, die Eindruck machen soll.", "Ich habe dir das tausendmal gesagt.", 3],
    ["Onomatopoesie", "Ein Wort ahmt ein Geräusch nach (Lautmalerei).", "Der Wasserhahn tropfte, es plätscherte und zischte.", 3],
    ["These", "Eine Behauptung, die man im Text begründen will.", "Handys sollten in der Schule erlaubt sein.", 3],
    ["Argument", "Ein Grund, der eine These stützt.", "Denn mit dem Handy kann man schnell etwas nachschlagen.", 3],
    ["Anapher", "Mehrere Sätze oder Satzteile beginnen mit demselben Wort.", "Wir wollen Frieden. Wir wollen Freiheit. Wir wollen Zukunft.", 4],
    ["Antithese", "Gegensätze werden einander gegenübergestellt.", "Der eine lacht, der andere weint.", 4],
    ["Euphemismus", "Eine beschönigende Umschreibung für etwas Unangenehmes.", "Er ist von uns gegangen.", 4],
    ["Ironie", "Man sagt das Gegenteil dessen, was man meint.", "Na, das hast du ja wieder großartig hingekriegt!", 4],
    ["Rhetorische Frage", "Eine Frage, auf die keine Antwort erwartet wird, weil sie schon klar ist.", "Wer will schon im Stau stehen?", 4],
    ["Gegenargument", "Ein Grund, der gegen die eigene These spricht und im Text behandelt wird.", "Allerdings könnten Handys im Unterricht ablenken.", 4],
    ["Beispiel", "Ein konkreter Fall, der ein Argument anschaulich macht.", "In meiner Klasse hat ein Handy letzte Woche bei einer Rechercheaufgabe geholfen.", 4],
    ["Konzession", "Ein Zugeständnis an die Gegenseite, bevor man die eigene Meinung stärkt.", "Zwar kann ein Handy ablenken, dennoch überwiegt der Nutzen.", 5],
    ["Klimax", "Eine Steigerung in mehreren Stufen.", "Ich bat, ich flehte, ich schrie.", 5],
    ["Parallelismus", "Aufeinanderfolgende Sätze haben den gleichen Bau.", "Wer wagt, gewinnt. Wer zögert, verliert.", 5],
    ["Trikolon", "Eine Aufzählung aus genau drei Gliedern.", "Blut, Schweiß und Tränen.", 5],
    ["Asyndeton", "Eine Aufzählung ohne Bindewörter wie „und“.", "Er rannte, sprang, kletterte, fiel.", 5],
    ["Polysyndeton", "Eine Aufzählung, in der viele „und“ stehen.", "Und sie lachten und sangen und tanzten und tranken.", 5],
    ["Oxymoron", "Zwei Begriffe, die sich widersprechen, werden verbunden.", "Ein beredtes Schweigen lag im Raum.", 5],
    ["Paradoxon", "Ein scheinbarer Widerspruch, der trotzdem einen Sinn ergibt.", "Ich weiß, dass ich nichts weiß.", 5],
    ["Ellipse", "Ein Satz ist unvollständig, weil Teile weggelassen werden.", "Ende gut, alles gut.", 5],
    ["Pleonasmus", "Eine überflüssige Häufung gleichbedeutender Wörter.", "Der weiße Schimmel stand auf der Wiese.", 5],
    ["Tautologie", "Dasselbe wird doppelt gesagt, ohne neue Information.", "Kinder sind eben Kinder.", 5],
    ["Akkumulation", "Mehrere Begriffe werden gehäuft, um ein Bild zu füllen.", "Hunde, Katzen, Hamster, Vögel: Das Haus war voller Tiere.", 5],
    ["Chiasmus", "Satzglieder werden über Kreuz gestellt (A-B-B-A).", "Ich esse, um zu leben, und lebe nicht, um zu essen.", 6],
    ["Inversion", "Die Wortstellung ist ungewöhnlich, um etwas zu betonen.", "Gewaltig ist die Macht der Sprache.", 6],
    ["Anakoluth", "Ein Satzbruch: Der Satz endet anders, als er begonnen hat.", "Wenn man das früher gewusst hätte, dann wäre ich, na ja, egal.", 6],
    ["Zeugma", "Ein Wort bezieht sich auf mehrere Satzteile mit verschiedener Bedeutung.", "Er verlor den Hut und die Fassung.", 6],
    ["Metonymie", "Ein Begriff wird durch einen verwandten ersetzt.", "Wir trinken noch ein Glas.", 6],
    ["Synekdoche", "Ein Teil steht für das Ganze oder umgekehrt.", "Er hat kein Dach über dem Kopf.", 6],
    ["Litotes", "Eine Untertreibung durch Verneinung des Gegenteils.", "Das war nicht schlecht.", 6],
    ["Apostrophe", "Eine Anrede an Abwesende, Tote oder Dinge.", "O Nacht, wie lang bist du!", 6]
  ];
  const L = D.map(x => ({ n: x[0], d: x[1], b: x[2], l: x[3] }));

  /* Textanalyse: [Stufe, Text, [[Textstelle, Stilmittel], ...]] */
  const TX = [
    [3, "Die Zeit ist ein Dieb, der uns jeden Tag ein Stück Leben stiehlt. Der Wecker schreit schon um sechs. Ich bin so müde wie ein Bär im Winter.",
      [["Die Zeit ist ein Dieb", "Metapher"], ["Der Wecker schreit", "Personifikation"], ["so müde wie ein Bär im Winter", "Vergleich"]]],
    [3, "Ich habe es dir schon tausendmal gesagt: Milch macht müde Männer munter, aber du hörst nie zu! Aus der Küche plätscherte, rauschte und zischte es.",
      [["tausendmal", "Hyperbel"], ["Milch macht müde Männer munter", "Alliteration"], ["plätscherte, rauschte und zischte", "Onomatopoesie"]]],
    [4, "Wir wollen Frieden. Wir wollen Freiheit. Wir wollen Zukunft. Wer will schon in einer Welt ohne Hoffnung leben? Die einen jubeln, die anderen weinen.",
      [["Wir wollen Frieden. Wir wollen Freiheit. Wir wollen Zukunft.", "Anapher"], ["Wer will schon in einer Welt ohne Hoffnung leben?", "Rhetorische Frage"], ["Die einen jubeln, die anderen weinen", "Antithese"]]],
    [4, "Er ist von uns gegangen, hieß es leise im Saal. „Na, das war ja wieder eine großartige Idee von dir!“, murmelte sie, als der Regen begann.",
      [["Er ist von uns gegangen", "Euphemismus"], ["Na, das war ja wieder eine großartige Idee von dir!", "Ironie"]]],
    [4, "Handys sollten in der Schule erlaubt sein. Denn mit ihnen kann man schnell etwas nachschlagen. Zwar können sie ablenken, dennoch überwiegt der Nutzen. In meiner Klasse half ein Handy bei einer Recherche.",
      [["Handys sollten in der Schule erlaubt sein.", "These"], ["Denn mit ihnen kann man schnell etwas nachschlagen.", "Argument"], ["Zwar können sie ablenken, dennoch überwiegt der Nutzen.", "Konzession"], ["In meiner Klasse half ein Handy bei einer Recherche.", "Beispiel"]]],
    [5, "Ich bat, ich flehte, ich schrie. Und sie lachten und sangen und tanzten bis spät. Er rannte, sprang, kletterte, fiel. Ein beredtes Schweigen lag im Raum.",
      [["Ich bat, ich flehte, ich schrie", "Klimax"], ["Und sie lachten und sangen und tanzten", "Polysyndeton"], ["Er rannte, sprang, kletterte, fiel", "Asyndeton"], ["beredtes Schweigen", "Oxymoron"]]],
    [5, "Wer wagt, gewinnt. Wer zögert, verliert. Blut, Schweiß und Tränen: Das ist der Preis. Ich weiß, dass ich nichts weiß.",
      [["Wer wagt, gewinnt. Wer zögert, verliert.", "Parallelismus"], ["Blut, Schweiß und Tränen", "Trikolon"], ["Ich weiß, dass ich nichts weiß", "Paradoxon"]]],
    [5, "Kinder sind eben Kinder. Der weiße Schimmel stand auf der Wiese. Ende gut, alles gut.",
      [["Kinder sind eben Kinder", "Tautologie"], ["weiße Schimmel", "Pleonasmus"], ["Ende gut, alles gut", "Ellipse"]]],
    [6, "Ich esse, um zu leben, und lebe nicht, um zu essen. Gewaltig ist die Macht der Sprache. Er verlor den Hut und die Fassung. Das war nicht schlecht.",
      [["Ich esse, um zu leben, und lebe nicht, um zu essen", "Chiasmus"], ["Gewaltig ist die Macht der Sprache", "Inversion"], ["Er verlor den Hut und die Fassung", "Zeugma"], ["Das war nicht schlecht", "Litotes"]]],
    [6, "Wir trinken noch ein Glas. Er hat kein Dach über dem Kopf. O Nacht, wie lang bist du!",
      [["Wir trinken noch ein Glas", "Metonymie"], ["Er hat kein Dach über dem Kopf", "Synekdoche"], ["O Nacht, wie lang bist du!", "Apostrophe"]]]
  ];
  const byName = {};
  L.forEach(x => { byName[x.n] = x; });
  const ALL = L.map(x => ({ key: x.n, n: x.n, d: x.d, b: x.b, l: x.l, text: null }));
  TX.forEach((t, ti) => t[2].forEach((p, pi) => {
    const k = t[1].indexOf(p[0]);
    if (k < 0 || !byName[p[1]]) return;
    ALL.push({ key: "T" + ti + "-" + pi, n: p[1], d: byName[p[1]].d, b: p[0], l: t[0], text: { a: t[1].slice(0, k), m: p[0], z: t[1].slice(k + p[0].length) } });
  }));
  let s = null, overlay = null;

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const rh = () => (state.rh && typeof state.rh === "object") ? state.rh : (state.rh = {});

  function queue() {
    const e = rh(), t = todayKey(), want = state.stufe || 3;
    const due = [], fresh = [];
    ALL.forEach((x, i) => { const r = e[x.key]; if (r) { if (r.due <= t) due.push(i); } else fresh.push(i); });
    due.sort((a, b) => e[ALL[a].key].due.localeCompare(e[ALL[b].key].due));
    const key = new Map(fresh.map(i => [i, Math.abs(ALL[i].l - want) + Math.random() * 0.9]));
    fresh.sort((a, b) => key.get(a) - key.get(b));
    return due.concat(fresh).slice(0, PER);
  }

  function build(i) {
    const x = ALL[i], r = rh()[x.key], ok = r ? r.ok : 0;
    const kind = x.text ? "text" : ok === 0 ? "def" : ok === 1 ? "bsp" : "name";
    const others = shuffle(L.filter(y => y.n !== x.n)).slice(0, 3);
    const key = kind === "name" ? "b" : "n";
    const right = kind === "name" ? x.b : x.n;
    return { i: i, kind: kind, opts: shuffle([{ t: right, ok: true }].concat(others.map(y => ({ t: y[key], ok: false })))) };
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
      ui('<h3>Geschafft</h3><p class="meaning">' + s.right + " von " + s.done + ' Fragen gleich richtig. Was noch nicht sitzt, kommt wieder.</p>' +
        '<div class="row"><button class="btn primary" data-rh="close">Fertig</button><button class="btn" data-rh="start">Noch eine Runde</button></div>');
      return;
    }
    const i = s.queue[s.pos], x = ALL[i];
    if (!s.q || s.q.i !== i || s.qpos !== s.pos) { s.q = build(i); s.qpos = s.pos; s.answered = false; }
    const q = s.q;
    const head = '<span class="tag">Frage ' + (s.pos + 1) + " von " + s.queue.length + " · " + NAMES[x.l - 1] + "</span>";
    let body;
    if (s.answered) {
      body = '<p class="result ' + (s.ok ? "ok" : "no") + '" role="status">' + (s.ok ? "Richtig." : "Nicht ganz.") + "</p>" +
        (x.text ? '<p class="example">' + esc(x.text.a) + "<mark>" + esc(x.text.m) + "</mark>" + esc(x.text.z) + "</p>" : "") +
        '<p class="quiz-sentence"><b>' + esc(x.n) + "</b></p><p class=\"hint\">" + esc(x.d) + "</p>" + (x.text ? "" : '<p class="example">' + esc(x.b) + "</p>") +
        '<div class="row"><button class="btn primary" data-rh="next">Weiter</button></div>';
    } else {
      const opts = q.opts.map((o, n) => '<button class="btn t-opt" data-rh="opt" data-i="' + n + '">' + esc(o.t) + "</button>").join("");
      const tail = '<div class="row"><button class="btn ghost" data-rh="skip">Ich weiß es nicht</button><button class="btn ghost" data-rh="close">Abbrechen</button></div>';
      const frage = q.kind === "text" ? '<p class="quiz-sentence">' + esc(x.text.a) + "<mark>" + esc(x.text.m) + "</mark>" + esc(x.text.z) + '</p><p class="hint">Welches Stilmittel oder welcher Baustein steckt in der markierten Stelle?</p>'
        : q.kind === "def" ? '<p class="quiz-sentence">' + esc(x.d) + '</p><p class="hint">Wie heißt dieses Stilmittel oder dieser Baustein?</p>'
        : q.kind === "bsp" ? '<p class="quiz-sentence">„' + esc(x.b) + '“</p><p class="hint">Was steckt in diesem Satz?</p>'
        : '<p class="quiz-sentence">' + esc(x.n) + '</p><p class="hint">Welcher Satz ist ein Beispiel dafür?</p>';
      body = frage + opts + tail;
    }
    if (s.answered && window.lektionHtml) body += window.lektionHtml(x.n);
    ui(head + body);
  }

  function grade(i, ok) {
    const x = ALL[i], e = rh()[x.key] || { ok: 0, due: "" };
    e.ok = ok ? e.ok + 1 : 0;
    e.due = addDays(todayKey(), ok ? INTER[Math.min(e.ok, 5)] : 0);
    rh()[x.key] = e;
    if (typeof touchStreak === "function") touchStreak();
    if (ok && typeof awardSpruch === "function") awardSpruch(x.l, 5 + Math.min(e.ok, 5));
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

  function start() {
    const list = queue();
    if (!list.length) return;
    s = { queue: list, pos: 0, done: 0, right: 0, retry: new Set(), q: null, qpos: -1, answered: false, ok: false };
    render();
  }

  function renderRh() {
    const el = document.getElementById("view-rh");
    if (!el) return;
    const e = rh(), t = todayKey();
    const started = ALL.filter(x => e[x.key]).length;
    const due = ALL.filter(x => e[x.key] && e[x.key].due <= t).length;
    const sits = ALL.filter(x => e[x.key] && e[x.key].ok >= 3).length;
    const badge = document.getElementById("badge-rh");
    if (badge) { badge.textContent = due; badge.hidden = due === 0; }

    const items = L.slice().sort((a, b) => a.l - b.l).map(x => {
      const r = e[x.n];
      return '<div class="item"><span class="word" style="font-size:19px">' + esc(x.n) + '</span><span class="tag">' + NAMES[x.l - 1] + (r ? " · " + esc(dueText({ due: r.due || t })) : "") + "</span>" +
        '<p class="sub">' + esc(x.d) + '</p><p class="mine"><b>Beispiel</b>' + esc(x.b) + "</p></div>";
    }).join("");

    el.innerHTML = '<p class="lead">Stilmittel und Bausteine der Argumentation, die du in Schularbeiten und Texten brauchst. Übe in kleinen Runden: Erst erkennst du die Erklärung, dann das Beispiel, dann den passenden Satz. Dazu kommt die Textanalyse: In kurzen Texten findest du markierte Stellen und benennst das Stilmittel.</p>' +
      '<article class="card"><span class="tag">Dein Fortschritt</span><p class="meaning"><b>' + started + "</b> von " + L.length + " geübt, davon " + sits + " sicher. " +
      (due ? "Zu wiederholen: " + due + "." : started ? "Heute ist nichts fällig. Du kannst trotzdem Neues üben." : "Starte mit deiner ersten Runde.") + "</p>" +
      '<div class="row"><button class="btn primary" data-rh="start">Üben</button></div></article>' +
      '<h3>Nachschlagen</h3><div class="list">' + items + "</div>";
  }

  window.addEventListener("load", () => {
    const RA = window.renderAll;
    window.renderAll = function () { RA(); try { renderRh(); } catch (e) { /* Reiter bleibt leer */ } };
    renderRh();
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-rh]");
    if (!b) return;
    const a = b.dataset.rh;
    if (a === "start") { start(); return; }
    if (a === "close") { close(); return; }
    if (!s) return;
    if (a === "opt") answer(!!s.q.opts[Number(b.dataset.i)].ok);
    else if (a === "skip") answer(false);
    else if (a === "next") { s.pos++; render(); }
  });
})();
