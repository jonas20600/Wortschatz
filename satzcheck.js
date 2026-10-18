(function () {
  const API = "https://api.languagetool.org/v2/check";
  const IGNORE = ["style", "register"];
    const VERWECHSLUNGEN = [
    { re: /\b(klinkt)\s+(?:sich\s+)?(?:ein\s+(?:wenig|bisschen)|gut|schlecht|etwas|so|wie|nach|komisch|seltsam|merkwürdig|interessant|logisch|falsch|richtig|plausibel|paradox|vernünftig|verrückt)(?![\p{L}])/iu,
      msg: "Meinst du „klingt“? „klingt“ (von klingen) beschreibt, wie etwas wirkt. „klinkt“ gehört zu „klinken“, zum Beispiel bei einer Tür.", fix: () => "klingt" },
    { re: /\b(seid)\s+(?:einem|einer|langem|kurzem|Jahren|Monaten|Wochen|Tagen|Stunden|Minuten|Jahr|Monat|Woche|Tag)(?![\p{L}])/iu,
      msg: "Meinst du „seit“ (ab einem Zeitpunkt)? „seid“ ist die Form von „sein“ für „ihr“.", fix: () => "seit" },
    { re: /\b(währe)(?![\p{L}])/iu,
      msg: "Meinst du „wäre“? „währen“ bedeutet „dauern“.", fix: () => "wäre" },
    { re: /\b(wieder(?:spruch|spricht|sprechen|sprüche|spiegel\w*|stand|standen|legen|legt|legung|rufen|ruft|ruf|streben))(?![\p{L}])/iu,
      msg: "Hier schreibt man „wider“ (gegen), nicht „wieder“ (noch einmal).", fix: w => w.replace(/^wieder/i, m => (m[0] === "W" ? "Wider" : "wider")) }
  ];

  function mark(text, ms) {
    let out = "", pos = 0;
    ms.slice().sort((a, b) => a.offset - b.offset).forEach(m => {
      if (m.offset < pos) return;
      out += esc(text.slice(pos, m.offset)) + "<mark>" + esc(text.slice(m.offset, m.offset + m.length)) + "</mark>";
      pos = m.offset + m.length;
    });
    return out + esc(text.slice(pos));
  }

    function kommaFehler(text) {
    const out = [];
    const SUB = ["dass", "daß", "weil", "obwohl", "obgleich", "obschon", "falls", "sodass", "sofern", "solange", "sooft", "indem", "nachdem", "bevor", "sobald", "ob", "wenn"];
    const PRON = ["ich", "du", "er", "sie", "es", "wir", "ihr", "man"];
    const PART = ["auch", "selbst", "gerade", "nur", "besonders", "sogar", "erst", "schon", "nicht", "insbesondere", "allem", "so", "als", "wie"];
    const EXCL = ["den", "dem", "einen", "seinen", "ihren", "meinen", "deinen", "unseren", "euren", "diesen", "jenen", "denen", "allen", "vielen", "beiden", "anderen", "neuen", "guten", "alten", "großen", "kleinen", "ersten", "letzten", "jeden"];
    const commaBefore = pos => text.slice(0, pos).trimEnd().slice(-1) === ",";
    const add = (t, message, rep) => out.push({ offset: t.i, length: t.w.length, message: message, replacements: rep ? [{ value: rep }] : [] });
    const sre = /[^.!?…]+[.!?…]*/g;
    let sm;
    while ((sm = sre.exec(text))) {
      const toks = [], wre = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;
      let wm;
      while ((wm = wre.exec(sm[0]))) toks.push({ w: wm[0], l: wm[0].toLowerCase(), i: sm.index + wm.index });
      if (!toks.length) continue;
      const first = toks[0];
      if (SUB.includes(first.l) && toks.length >= 6 && !sm[0].includes(",") && !/\?\s*$/.test(sm[0]))
        add(first, "Nach dem Nebensatz mit „" + first.w + "“ fehlt vermutlich ein Beistrich vor dem Hauptsatz.");
      if (["ja", "nein", "oh", "ach"].includes(first.l) && toks.length >= 3 && PRON.includes(toks[1].l) && text[first.i + first.w.length] !== ",")
        add(first, "Nach „" + first.w + "“ am Satzanfang steht ein Beistrich.", first.w + ",");
      for (let k = 1; k < toks.length; k++) {
        const t = toks[k], p = toks[k - 1], n = toks[k + 1];
        const afterAnd = p.l === "und" || p.l === "oder";
        const sub = SUB.includes(t.l) || ((t.l === "damit" || t.l === "während") && n && PRON.includes(n.l));
        if (sub && !afterAnd) {
          let at = k;
          if (PART.includes(p.l)) { at = k - 1; if (p.l === "allem" && k >= 2 && toks[k - 2].l === "vor") at = k - 2; }
          if (at > 0 && !commaBefore(t.i) && !commaBefore(toks[at].i))
            add(t, "Vor „" + t.w + "“ fehlt ein Beistrich: Nebensätze werden vom Hauptsatz durch Beistriche getrennt.", ", " + t.w);
        }
        if (t.l === "sondern" && !afterAnd && !commaBefore(t.i)) add(t, "Vor „sondern“ steht immer ein Beistrich.", ", sondern");
        if (t.l === "aber" && n && PRON.includes(n.l) && !commaBefore(t.i)) add(t, "Vor „aber“ steht hier ein Beistrich, weil ein neuer Satz beginnt.", ", aber");
        if (["um", "ohne", "anstatt", "statt"].includes(t.l) && !afterAnd && !commaBefore(t.i)) {
          for (let j = k + 1; j < Math.min(toks.length - 1, k + 9); j++) {
            if (toks[j].l !== "zu") continue;
            const inf = toks[j + 1];
            const okInf = /^\p{Ll}/u.test(inf.w) && (/(en|ern|eln)$/.test(inf.l) || inf.l === "sein" || inf.l === "tun") && !EXCL.includes(inf.l);
            if (okInf && !text.slice(t.i, inf.i).includes(",") && /^\s*([.!?,;:]|$|(und|oder|aber|sondern)\b)/i.test(text.slice(inf.i + inf.w.length)))
              add(t, "Vor „" + t.w + " … zu“ fehlt ein Beistrich: Infinitivgruppen mit „um“, „ohne“ und „statt“ werden abgetrennt.", ", " + t.w);
            break;
          }
        }
      }
    }
    return out;
  }
  document.addEventListener("click", async ev => {
    const btn = ev.target.closest("[data-action='save-sentence']");
    if (!btn) return;
    ev.stopPropagation();
    const id = Number(btn.dataset.id), w = byId.get(id), field = document.getElementById("sent-" + id);
    if (!w || !field) return;
    let fb = document.getElementById("chk-" + id);
    if (!fb) {
      fb = document.createElement("div");
      fb.id = "chk-" + id;
      fb.setAttribute("role", "status");
      btn.closest(".row").after(fb);
    }
    const say = (cls, msg, extra) => { fb.innerHTML = '<p class="result ' + cls + '">' + esc(msg) + "</p>" + (extra || ""); };
    const text = field.value.trim();
    const core = w.w.replace(/^(der|die|das|sich)\s+/i, "");
    const stem = core.length > 6 ? core.slice(0, -2) : core;

    if (text.split(/\s+/).filter(Boolean).length < 3) return say("no", "Schreibe einen ganzen Satz mit mindestens drei Wörtern.");
    if (!text.toLowerCase().includes(stem.toLowerCase())) return say("no", "Verwende das Wort „" + core + "“ in deinem Satz.");

    btn.disabled = true;
    say("", "Ich prüfe deinen Satz …");
    try {
      const own = [];
            kommaFehler(text).forEach(k => own.push(k));
      if (w.t === "Nomen") {
        const nm = new RegExp("(^|[^\\p{L}])(" + stem + "\\p{L}*)", "iu").exec(text);
        if (nm && /^\p{Ll}/u.test(nm[2])) own.push({ offset: nm.index + nm[1].length, length: nm[2].length, message: "Nomen werden großgeschrieben.", replacements: [{ value: nm[2].charAt(0).toUpperCase() + nm[2].slice(1) }] });
      }
      const fw = text.match(/^\S+/)[0], lw = text.match(/\S+$/)[0];
      if (/^\p{Ll}/u.test(text)) own.push({ offset: 0, length: fw.length, message: "Das erste Wort im Satz wird großgeschrieben.", replacements: [{ value: fw.charAt(0).toUpperCase() + fw.slice(1) }] });
      if (!/[.!?…]["“”»«)]*$/.test(text)) own.push({ offset: text.length - lw.length, length: lw.length, message: "Nach dem letzten Wort fehlt ein Satzzeichen. Setze einen Punkt, ein Ausrufezeichen oder ein Fragezeichen.", replacements: [] });
            VERWECHSLUNGEN.forEach(v => {
        const m = v.re.exec(text);
        if (m) own.push({ offset: m.index + m[0].indexOf(m[1]), length: m[1].length, message: v.msg, replacements: [{ value: v.fix(m[1]) }] });
      });

      let lt = null, hinweis = "Die Prüfung ist gerade nicht erreichbar. Versuche es gleich noch einmal.";
      try {
        const r = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ text: text, language: "de-DE", level: "picky" })
        });
        if (r.status === 429) hinweis = "Zu viele Prüfungen in kurzer Zeit. Warte eine Minute und versuche es noch einmal.";
        else if (r.ok) lt = (await r.json()).matches.filter(m => !IGNORE.includes(m.rule.issueType));
      } catch (e) { /* lt bleibt null */ }

      if (lt === null && !own.length) { say("no", hinweis); return; }
      const ms = (lt || []).concat(own.filter(o => !(lt || []).some(m => m.offset < o.offset + o.length && o.offset < m.offset + m.length))).sort((a, b) => a.offset - b.offset);
      if (!ms.length) {
        saveSentence(id, text);
        renderStats();
        renderMine();
        say("ok", "Richtig. Dein Satz ist gespeichert.");
        return;
      }
      const items = ms.map(m => {
        const bad = text.substr(m.offset, m.length);
        const rep = m.replacements.slice(0, 3).map(x => x.value).filter(Boolean);
        return '<p class="hint"><b>' + esc(bad || "…") + "</b>: " + esc(m.message) + (rep.length ? " Vorschlag: " + esc(rep.join(" / ")) : "") + "</p>";
      }).join("");
      say("no", (ms.length === 1 ? "1 Fehler gefunden." : ms.length + " Fehler gefunden.") + " Schreibe den Satz jetzt neu und ohne Fehler.",
        '<p class="example">' + mark(text, ms) + "</p>" + items);
      field.value = "";
      field.focus();
    } finally {
      btn.disabled = false;
    }
  }, true);
})();