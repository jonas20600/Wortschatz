(function () {
  let overlay = null;

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "t-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card t-box">' + html + "</div>";
  }
  function close() { if (overlay) overlay.remove(); overlay = null; }

  function ask() {
    ui("<h3>Konto endgültig löschen?</h3>" +
      '<p class="hint">Gelöscht werden dein Konto, dein gesamter Lernfortschritt, deine Punkte, dein Nickname und dein Platz in der Bestenliste. Das kann nicht rückgängig gemacht werden.</p>' +
      '<label for="kd-in" class="hint">Tippe zur Bestätigung das Wort LÖSCHEN:</label>' +
      '<input class="field" id="kd-in" type="text" autocomplete="off" spellcheck="false">' +
      '<p class="result no" id="kd-msg" role="status"></p>' +
      '<div class="row"><button class="btn" style="background:var(--bad);border-color:var(--bad);color:#fff" data-kd="go">Endgültig löschen</button><button class="btn" data-kd="close">Abbrechen</button></div>');
    document.getElementById("kd-in").focus();
  }

  function wipeLocal() {
    try {
      localStorage.removeItem("wortschatz-v1");
      Object.keys(localStorage).filter(k => k.indexOf("sb-") === 0).forEach(k => localStorage.removeItem(k));
    } catch (e) { /* egal */ }
  }

  async function go() {
    const msg = document.getElementById("kd-msg"), v = document.getElementById("kd-in").value.trim().toUpperCase();
    if (v !== "LÖSCHEN" && v !== "LOESCHEN") { msg.textContent = "Bitte tippe LÖSCHEN, um zu bestätigen."; return; }
    msg.textContent = "Einen Moment …";
    const r = await sb.rpc("delete_my_account");
    if (r.error) { msg.textContent = "Das hat nicht geklappt. Versuche es später noch einmal."; return; }
    try { ref = null; dirty = false; clearTimeout(saveTimer); } catch (e) { /* egal */ }
    try { await sb.auth.signOut(); } catch (e) { /* Konto ist ohnehin weg */ }
    wipeLocal();
    ui('<h3>Dein Konto wurde gelöscht</h3><p class="hint">Alle deine Daten sind entfernt. Danke fürs Lernen!</p><div class="row"><button class="btn primary" data-kd="reload">Zur Startseite</button></div>');
  }

  /* Knopf neben "Abmelden" einhängen */
  const K = window.kontoUi;
  if (typeof K === "function") {
    window.kontoUi = function (session) {
      K(session);
      if (!session) return;
      const p = document.querySelector("#konto > p");
      if (p && !document.getElementById("k-del")) p.insertAdjacentHTML("beforeend", ' <button class="btn ghost" id="k-del" data-kd="ask">Konto löschen</button>');
    };
  }

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-kd]");
    if (!b) return;
    const a = b.dataset.kd;
    if (a === "ask") ask();
    else if (a === "go") go();
    else if (a === "close") close();
    else if (a === "reload") { wipeLocal(); location.reload(); }
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Enter" && ev.target && ev.target.id === "kd-in") { ev.preventDefault(); go(); }
  });
})();