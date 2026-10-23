/* Einstieg für neue Nutzer: 3 Schritte, nur solange Test noch nicht gemacht und nicht weggeklickt */
(function () {
  const KEY = "wortschatz-intro";
  const gesehen = () => { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
  const merke = () => { try { localStorage.setItem(KEY, "1"); } catch (e) {} };

  function html() {
    const konto = typeof storageMode !== "undefined" && storageMode === "account";
    const test = !!(state && state.stufe);
    const lernt = state && state.learned && Object.keys(state.learned).length > 0;
    const schritt = (ok, n, titel, text) =>
      '<li style="display:flex;gap:10px;margin:8px 0;align-items:flex-start;opacity:' + (ok ? ".55" : "1") + '">' +
      '<span style="min-width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;border:1px solid currentColor;font-size:13px">' + (ok ? "✓" : n) + "</span>" +
      "<span><strong>" + titel + "</strong><br><span class=\"hint\">" + text + "</span></span></li>";
    return '<article class="card" id="einstieg"><span class="tag">Willkommen</span>' +
      '<p class="meaning">So startest du in drei Schritten:</p>' +
      '<ol style="list-style:none;padding:0;margin:0">' +
      schritt(konto, 1, "Konto anlegen", "Oben bei „Konto“ registrieren, dann bleibt dein Fortschritt auf jedem Gerät gespeichert.") +
      schritt(test, 2, "Niveau-Test machen", "16 Fragen, etwa drei Minuten. Danach bekommst du Wörter, die zu dir passen. Du findest ihn weiter unten bei „Dein Niveau“.") +
      schritt(lernt, 3, "Erste Wörter lernen", "Lies die Wörter von heute und prüfe dich. Morgen kommen sie zur Wiederholung zurück.") +
      '</ol><div class="row"><button class="btn ghost" data-einstieg="zu">Hinweis ausblenden</button></div></article>';
  }

  function zeige() {
    const v = document.getElementById("view-today");
    if (!v) return;
    let el = document.getElementById("einstieg");
    const brauche = !gesehen() && !(state && state.stufe && state.learned && Object.keys(state.learned).length > 0);
    if (!brauche) { if (el) el.remove(); return; }
    const neu = document.createElement("div");
    neu.innerHTML = html();
    if (el) el.replaceWith(neu.firstChild); else v.prepend(neu.firstChild);
  }

  document.addEventListener("click", ev => {
    if (ev.target.closest("[data-einstieg]")) { merke(); zeige(); }
  });

  window.addEventListener("load", () => {
    const alt = window.renderAll;
    if (typeof alt === "function") window.renderAll = function () { const r = alt.apply(this, arguments); zeige(); return r; };
    zeige();
  });
})();
