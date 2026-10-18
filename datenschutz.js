(function () {
  const ABSCHNITTE = [
    ["Verantwortlich", "[Jonas Schaffner, maxundjonny3@gmail.com]. Bei Fragen schreibe an diese Adresse."],
    ["Welche Daten gespeichert werden", "Deine E-Mail-Adresse und dein Passwort (das Passwort wird nur verschlüsselt gespeichert), dein Lernfortschritt (gelernte Wörter, Punkte, Stufe, Serie, eigene Sätze) und dein Nickname. Der Nickname, deine Punkte und deine Stufe sind für alle Nutzer in der Bestenliste sichtbar. Deine E-Mail-Adresse wird nie angezeigt. Dein Fortschritt liegt zusätzlich im lokalen Speicher deines Browsers."],
    ["Wofür", "Für die Anmeldung, das Speichern deines Fortschritts auf allen Geräten und für die Bestenliste."],
    ["Dienste, die dabei genutzt werden", "Supabase (Datenbank und Anmeldung), Netlify (Hosting der Seite), Google Fonts (die Schriftarten werden von Google geladen, dabei wird deine IP-Adresse übertragen). Wenn du ein Wort im Wörterbuch nachschlägst, wird das Suchwort an de.wiktionary.org gesendet. Wenn du einen eigenen Satz prüfen lässt, wird nur der Satz an languagetool.org gesendet, ohne deine E-Mail-Adresse oder deinen Nickname."],
    ["Deine Rechte", "Du kannst dein Konto jederzeit selbst löschen: oben neben „Abmelden“ auf „Konto löschen“. Dabei werden deine E-Mail-Adresse, dein Fortschritt, deine Punkte und dein Nickname endgültig entfernt. Für Auskunft und Berichtigung schreibe an die oben genannte Adresse. In Österreich kannst du dich außerdem bei der Datenschutzbehörde (dsb.gv.at) beschweren."]
  ];
  let overlay = null;

  const css = document.createElement("style");
  css.textContent = ".dsg-overlay{position:fixed;inset:0;background:rgba(10,20,50,.6);display:flex;align-items:center;justify-content:center;padding:16px;z-index:70;overflow:auto}.dsg-box{max-width:560px;width:100%;max-height:88vh;overflow:auto}";
  document.head.appendChild(css);

  function open() {
    overlay = document.createElement("div");
    overlay.className = "dsg-overlay";
    overlay.innerHTML = '<div class="card dsg-box"><h3>Datenschutz</h3>' +
      ABSCHNITTE.map(a => '<h3 style="font-size:18px">' + a[0] + '</h3><p class="hint">' + a[1] + "</p>").join("") +
      '<div class="row"><button class="btn primary" data-dsg="close">Schließen</button></div></div>';
    document.body.appendChild(overlay);
  }
  function close() { if (overlay) overlay.remove(); overlay = null; }

  window.addEventListener("load", () => {
    const foot = document.getElementById("foot");
    if (!foot) return;
    const p = document.createElement("p");
    p.className = "foot";
    p.innerHTML = '<button class="btn ghost" data-dsg="open">Datenschutz</button>';
    foot.after(p);
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-dsg]");
    if (!b) return;
    if (b.dataset.dsg === "open") open(); else close();
  });
})();