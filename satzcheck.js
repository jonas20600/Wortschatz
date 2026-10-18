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
      const ms = (lt || []).concat(own.filter(o => !(lt || []).some(m => m.offset === o.offset))).sort((a, b) => a.offset - b.offset);
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