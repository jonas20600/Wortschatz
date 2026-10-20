(function () {
  /* [Name, So erkennst du es, Wirkung, So schreibst du es in der Analyse, Nicht verwechseln mit] */
  const D = [
    ["Metapher", "Ein Bild ohne „wie“: Etwas wird einfach gleichgesetzt oder im übertragenen Sinn benannt.", "Macht Abstraktes anschaulich und weckt Bilder im Kopf.", "Der Autor verwendet die Metapher „…“, um … zu veranschaulichen.", "Vergleich: Der hat „wie“ oder „als ob“."],
    ["Vergleich", "Zwei Dinge werden mit „wie“ oder „als ob“ verbunden.", "Erklärt eine Eigenschaft über ein bekanntes Bild.", "Durch den Vergleich „…“ wird … betont.", "Metapher: Die kommt ohne „wie“ aus."],
    ["Personifikation", "Dinge, Tiere oder Natur tun etwas, das nur Menschen können (lachen, schreien, küssen).", "Macht Dinge lebendig, nah oder bedrohlich.", "Die Personifikation „…“ lässt … wie einen Menschen erscheinen.", "Metapher: Bei der Personifikation steckt immer menschliches Verhalten dahinter."],
    ["Alliteration", "Wörter in der Nähe beginnen mit demselben Laut.", "Gibt Rhythmus, prägt sich ein und kann Stimmung erzeugen (zischend, weich).", "Die Alliteration „…“ verstärkt den Klang und hebt … hervor.", "Assonanz: Dort gleicht der Vokal im Wort, nicht der Anfangslaut."],
    ["Hyperbel", "Eine so starke Übertreibung, dass sie wörtlich nicht stimmen kann.", "Hebt Gefühle oder Größe hervor und kann witzig wirken.", "Die Hyperbel „…“ unterstreicht, wie … ist.", "Euphemismus: Der schwächt ab, die Hyperbel steigert."],
    ["Onomatopoesie", "Ein Wort klingt wie das Geräusch, das es meint (rauschen, zischen, knacken).", "Man hört die Szene, sie wirkt lebendig.", "Die Lautmalerei „…“ lässt den Leser … hören.", "Alliteration: Dort zählt der gleiche Anfangslaut, nicht das Nachahmen."],
    ["These", "Eine Behauptung, die im Text gestellt und danach begründet wird, meist am Anfang.", "Gibt dem Text eine klare Richtung.", "Der Autor vertritt die These, dass …", "Argument: Das ist die Begründung, nicht die Behauptung."],
    ["Argument", "Ein Grund, der mit „denn“, „weil“ oder „deshalb“ an die These anschließt.", "Macht die These glaubwürdig.", "Zur Stützung seiner These führt er an, dass …", "Beispiel: Das zeigt nur einen Einzelfall."],
    ["Anapher", "Mehrere Sätze oder Verse beginnen mit demselben Wort oder derselben Wortgruppe.", "Betont den Gedanken, wirkt eindringlich und rhythmisch.", "Durch die Anapher „…“ wird … nachdrücklich betont.", "Parallelismus: Der gleicht den ganzen Satzbau, die Anapher nur den Anfang."],
    ["Antithese", "Zwei gegensätzliche Begriffe oder Gedanken stehen einander gegenüber.", "Macht Gegensätze deutlich und regt zum Nachdenken an.", "Die Antithese „…“ stellt … und … gegenüber.", "Oxymoron: Dort sind die Gegensätze in einer Wortgruppe verschmolzen."],
    ["Euphemismus", "Etwas Unangenehmes wird mild umschrieben (sterben → entschlafen).", "Mildert, schont Gefühle oder verschleiert.", "Der Euphemismus „…“ verharmlost …", "Litotes: Die verneint das Gegenteil, der Euphemismus ersetzt das Wort."],
    ["Ironie", "Das Gesagte meint das Gegenteil, der Zusammenhang verrät es.", "Spott, Kritik oder Abstand, oft mit Witz.", "Die Ironie in „…“ zeigt, dass der Autor … kritisiert.", "Sarkasmus: Das ist die bittere, verletzende Steigerung."],
    ["Rhetorische Frage", "Eine Frage, auf die keine Antwort erwartet wird, weil sie schon klar ist.", "Bindet den Leser ein und legt eine Antwort nahe.", "Mit der rhetorischen Frage „…“ will der Autor … nahelegen.", "Echte Frage: Sie erwartet eine Antwort."],
    ["Gegenargument", "Ein Einwand gegen die eigene These (allerdings, man könnte einwenden …).", "Zeigt Fairness und kann widerlegt werden.", "Gegen seine These könnte man einwenden, dass … Das entkräftet er, indem …", "Konzession: Die gibt dem Gegner nur teilweise recht."],
    ["Beispiel", "Ein konkreter Einzelfall (zum Beispiel, etwa, eine kleine Geschichte).", "Macht das Argument anschaulich.", "Als Beispiel nennt der Autor …", "Argument: Das allgemeine Begründen."],
    ["Konzession", "Zugeständnis mit „zwar … aber“ oder „natürlich … dennoch“.", "Wirkt fair und nimmt Kritik vorweg.", "Der Autor räumt zwar ein, dass …, hält aber dagegen, dass …", "Gegenargument: Das kommt von außen, die Konzession gibt man selbst zu."],
    ["Klimax", "Mehrere Glieder werden Schritt für Schritt stärker.", "Steigert Spannung oder Dringlichkeit.", "Die Klimax „…“ steigert die Intensität bis …", "Akkumulation: reine Häufung ohne Steigerung."],
    ["Parallelismus", "Aufeinanderfolgende Sätze haben denselben Aufbau.", "Wirkt geordnet und einprägsam, oft gegensätzlich.", "Der Parallelismus „…“ verleiht dem Satz Rhythmus.", "Anapher: Hier gleicht nur der Anfang."],
    ["Trikolon", "Genau drei Glieder in einer Aufzählung.", "Wirkt vollständig und feierlich.", "Das Trikolon „…“ rundet die Aussage ab.", "Akkumulation: viele Glieder, das Trikolon genau drei."],
    ["Asyndeton", "Aufzählung ohne „und“, nur mit Komma.", "Schnell, hektisch oder knapp.", "Das Asyndeton „…“ erzeugt Tempo.", "Polysyndeton: Dort steht vor jedem Glied „und“."],
    ["Polysyndeton", "Aufzählung mit „und“ vor jedem Glied.", "Langsam, ruhig oder endlos.", "Das Polysyndeton „…“ betont das Fortdauernde.", "Asyndeton: Das kommt ohne Bindewort aus."],
    ["Oxymoron", "Zwei sich widersprechende Wörter in einer Wortgruppe (bittersüß, beredtes Schweigen).", "Zeigt Zerrissenheit oder Spannung.", "Das Oxymoron „…“ drückt den Widerspruch aus, dass …", "Paradoxon: Das ist ein ganzer Satz, nicht nur zwei Wörter."],
    ["Paradoxon", "Ein Satz, der unlogisch klingt, aber tiefer wahr ist.", "Regt zum Nachdenken an.", "Das Paradoxon „…“ weist darauf hin, dass …", "Oxymoron: Das sind nur zwei Wörter."],
    ["Ellipse", "Ein Satz ohne wichtige Teile, meist ohne Verb.", "Knapp, prägnant, spricht schnell.", "Die Ellipse „…“ wirkt knapp und einprägsam.", "Anakoluth: Dort bricht der Satz mitten ab."],
    ["Pleonasmus", "Eine überflüssige Doppelung in einer Wortgruppe (weißer Schimmel, runder Kreis).", "Betont oder wirkt unfreiwillig komisch.", "Der Pleonasmus „…“ hebt … besonders hervor.", "Tautologie: Die wiederholt ganze Aussagen."],
    ["Tautologie", "Dasselbe wird zweimal gesagt, ohne neue Information (Kinder sind Kinder).", "Betont Selbstverständliches oder Resignation.", "Die Tautologie „…“ zeigt, dass …", "Pleonasmus: Das ist nur ein überflüssiger Zusatz."],
    ["Akkumulation", "Viele Begriffe werden gehäuft.", "Bildet Fülle oder Chaos ab.", "Die Akkumulation „…“ erzeugt den Eindruck von …", "Klimax: Die steigert."],
    ["Chiasmus", "Satzglieder stehen überkreuzt (A-B-B-A).", "Hebt Gegensätze hervor und prägt sich ein.", "Der Chiasmus „…“ kehrt … um.", "Parallelismus: Der hat die gleiche Reihenfolge (A-B-A-B)."],
    ["Inversion", "Ungewöhnliche Wortstellung, etwa das Prädikat oder ein Adjektiv am Anfang.", "Betont das nach vorn gestellte Wort.", "Die Inversion „…“ hebt … hervor.", "Ellipse: Dort fehlen Teile."],
    ["Anakoluth", "Der Satz bricht ab oder wechselt mitten drin die Konstruktion.", "Wirkt wie gesprochene Sprache, aufgeregt oder unsicher.", "Der Anakoluth „…“ zeigt die Aufregung des Sprechers.", "Ellipse: Die ist gewollt kurz, aber verständlich."],
    ["Zeugma", "Ein Verb bezieht sich auf zwei Dinge in verschiedener Bedeutung (Hut und Fassung verlieren).", "Witzig und überraschend.", "Das Zeugma „…“ verbindet … und … ungewöhnlich.", "Metapher: Dort wird nur ein Wort übertragen."],
    ["Metonymie", "Ein Begriff steht für etwas Verwandtes (Glas für Getränk, Goethe lesen).", "Kurz und bildhaft.", "Die Metonymie „…“ steht für …", "Synekdoche: Die ersetzt Teil durch Ganzes."],
    ["Synekdoche", "Ein Teil steht für das Ganze oder umgekehrt (Dach über dem Kopf).", "Konzentriert auf das Wesentliche.", "Die Synekdoche „…“ steht für …", "Metonymie: Dort besteht Verwandtschaft, kein Teil-Ganzes."],
    ["Litotes", "Untertreibung durch Verneinung des Gegenteils (nicht schlecht = gut).", "Zurückhaltend, höflich oder ironisch.", "Die Litotes „…“ meint eigentlich …", "Euphemismus: Der beschönigt Negatives."],
    ["Apostrophe", "Direkte Anrede an Abwesende, Dinge oder Gott (O Nacht!).", "Pathetisch und persönlich.", "Die Apostrophe „…“ spricht … direkt an.", "Rhetorische Frage: Die fragt, die Apostrophe spricht an."]
  ];
  const M = {};
  D.forEach(x => { M[x[0]] = x; });

  window.lektionHtml = function (name) {
    const x = M[name];
    if (!x) return "";
    return '<div class="hint" style="margin-top:10px;padding:10px 12px;border-left:3px solid var(--marker)"><b>Merke dir: ' + esc(x[0]) + "</b><br>" +
      "<b>So erkennst du es:</b> " + esc(x[1]) + "<br><b>Wirkung:</b> " + esc(x[2]) + "<br>" +
      "<b>So schreibst du es in der Analyse:</b> " + esc(x[3]) + "<br><b>Nicht verwechseln:</b> " + esc(x[4]) + "</div>";
  };

  function decorate() {
    document.querySelectorAll("#view-rh .item").forEach(it => {
      const w = it.querySelector(".word");
      if (!w || it.querySelector("details")) return;
      const h = window.lektionHtml(w.textContent.trim());
      if (h) it.insertAdjacentHTML("beforeend", '<details class="sub"><summary>Lektion öffnen</summary>' + h + "</details>");
    });
  }

  window.addEventListener("load", () => {
    const RA = window.renderAll;
    window.renderAll = function () { RA(); try { decorate(); } catch (e) { /* ohne Lektionen weiter */ } };
    decorate();
  });
})();
