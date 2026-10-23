(function () {
  const OLD = { 1: 3, 2: 5, 3: 6 };
  const cache = {};

  window.STUFEN = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];
  window.MODI = { standard: "Standard", schule: "Schularbeit", sprechen: "Sprechen", alle: "Alle Wörter" };
  const INFO = {
    standard: "Gute Wörter passend zu deinem Niveau.",
    schule: "Gehobener, bildungssprachlicher Wortschatz für Aufsatz, Erörterung und Analyse.",
    sprechen: "Alltags- und Umgangssprache, die du im Gespräch brauchst.",
    alle: "Wirklich alle Wörter, auch seltene und Fachwörter."
  };
  /* Handverlesene Wortlisten: Schularbeit und Sprechen (unabhängig von den Wortdateien) */
  const LISTE_SCHULE = new Set("Abendrot Abscheu Absicht Allegorie Alliteration Ambivalenz Anapher Anerkennung Angst Anlass Anmut Annahme Anonymität Anpassung Ansatz Anspruch Anstand Antithese Argument Argwohn Arroganz Aspekt Atmosphäre Aufbegehren Augenblick Ausgeglichenheit Aussage Auswirkung Bedeutungslosigkeit Begeisterung Begierde Behauptung Beklemmung Beleg Bemühung Besonnenheit Bestreben Bestürzung Betrachtungsweise Beweggrund Beweis Bewunderung Blickwinkel Botschaft Charakter Chiasmus Demut Denkanstoß Dialog Dilemma Dunkelheit Dunst Dynamik Dystopie Dämmerung Ehrfurcht Eifersucht Eindeutigkeit Einfluss Einsamkeit Einstellung Eitelkeit Ekel Ellipse Endlichkeit Entfremdung Entsetzen Entwicklung Entzücken Epoche Ergriffenheit Erhabenheit Erschütterung Erstaunen Erzähler Ethik Euphemismus Euphorie Ewigkeit Fassungslosigkeit Fazit Figur Finsternis Flüstern Folge Folgerung Freiheit Frühling Furcht Geborgenheit Gegenargument Gegensatz Geiz Gelassenheit Gemeinschaft Gemeinwohl Genügsamkeit Gerechtigkeit Gesang Gesellschaft Gesichtspunkt Gewissen Gewitter Glanz Gleichheit Gleichmut Glückseligkeit Gram Grauen Groll Habgier Haltung Handlung Hass Herbst Hilflosigkeit Hingabe Hintergrund Hochmut Hoffnungslosigkeit Hyperbel Höhepunkt Ideal Identität Idylle Illusion Individuum Innigkeit Intention Ironie Isolation Kadenz Kernaussage Klage Klang Klimax Klischee Komplexität Konflikt Konformität Konsequenz Kontext Kummer Landschaft Laster Leid Leidenschaft Leitmotiv Litotes Lösungsansatz Machtlosigkeit Mehrdeutigkeit Melancholie Metapher Metrum Missgunst Misstrauen Moment Monolog Moral Morgenröte Motiv Motivation Murmeln Natur Nebel Neid Oberflächlichkeit Ohnmacht Optimismus Oxymoron Paradox Paradoxon Parallelismus Pathos Pauschalisierung Pein Personifikation Perspektive Pessimismus Pflicht Phänomen Pointe Position Pracht Prämisse Qual Rahmenhandlung Rastlosigkeit Raunen Rauschen Rebellion Refrain Reim Reizüberflutung Resignation Respekt Resümee Rhetorik Rhythmus Ruhelosigkeit Rückblende Rührung Satzbau Schatten Schimmer Schlussfolgerung Schmerz Schnelllebigkeit Schrecken Schweigen Schwermut Schönheit Sehnsucht Seufzer Sichtweise Sinnhaftigkeit Skepsis Solidarität Spannung Spannungsbogen Sprachbild Standpunkt Staunen Stereotyp Stille Stilmittel Stimmung Stolz Streben Strophe Strömung Sturm Symbol Syntax Synthese Takt Tendenz Thema These Toleranz Ton Tragweite Trauer Triebfeder Tugend Umbruch Unbehagen Unendlichkeit Ungewissheit Unruhe Unsicherheit Ursache Utopie Verachtung Verallgemeinerung Verantwortung Vereinsamung Verfall Vergleich Vergänglichkeit Verlangen Verlassenheit Verlust Verpflichtung Vers Verunsicherung Verwesung Verwunderung Verzweiflung Vielschichtigkeit Vision Vorausdeutung Vorurteil Wandel Wandlung Wehmut Wendepunkt Werte Wertschätzung Widerspruch Widerstand Wirkung Wollust Wonne Wortwahl Wut Würde Zeilensprung Zeitgeist Zeugma Zorn Zufriedenheit Zuneigung Zusammenhang Zuversicht Zweifel Zwielicht Zärtlichkeit Zäsur ableiten abschließend abwägen akribisch allerdings ambivalent analysieren anderenteils andererseits andeuten anflehen anführen angeblich anmerken annähernd ansatzweise anschaulich anspruchsvoll anzweifeln argumentieren aufrichtig aufwühlen aufzeigen augenscheinlich ausdrucksvoll ausdrücken ausführlich ausharren auskosten auslösen ausschlaggebend außerdem bannen beargwöhnen bedauerlicherweise bedeutsam bedingen bedrücken bedächtig begehren begünstigen beharren beherrschen behindern behutsam beinahe beispielhaft bejammern beklagen bekräftigen belanglos belasten belegen beleuchten beredt berühren beschwichtigen beschwören besonnen besänftigen beteuern betonen betrauern beträchtlich betören beunruhigen beurteilen bevorstehen bewegen beweinen bewerten bewirken bewältigen bezaubern bezeugen bezweifeln bezwingen beängstigen bildhaft charakterisieren daher darben darlegen demgegenüber demnach dennoch deshalb differenzieren differenziert diffus distanziert dürsten eindeutig eindringlich einerseits einesteils eingehend einräumen einschätzen elementar eloquent emotional entbehren entkräften entscheidend entsinnen entzücken erblicken ereilen ergreifen ergötzen erheblich ermahnen erschüttern ersehnen ersinnen ersuchen erwidern erwähnen erörtern essenziell evozieren facettenreich ferner fesseln flüchtig folgerichtig folgern folglich fragwürdig frohlocken gegenüberstellen geistreich gelingen genießen geradezu geringfügig gewissenhaft gewissermaßen glaubwürdig gleichwohl glücken glücklicherweise gravierend grundlegend größtenteils grübeln gründlich hadern hauptsächlich heimsuchen hemmen herbeiführen herbeisehnen herleiten hervorheben hervorrufen hingegen hinterfragen hintergründig immerhin implizieren indessen infolgedessen insbesondere integer interpretieren ironisch irrelevant jubilieren keinesfalls keineswegs komplex kontrovers kritisieren kurzsichtig kämpfen laben lechzen leichtfertig letztendlich letztlich loben lobpreisen mahnen makellos marginal maßgeblich meistern misslingen mithin mustergültig nachdrücklich nachvollziehbar nahezu nebensächlich nennenswert nichtsdestotrotz nuancieren nuanciert nüchtern obendrein oberflächlich offenkundig offensichtlich paradox pathetisch peinigen pflichtbewusst plagen plausibel pointieren polemisch preisen problematisieren prägnant präzise quälen redegewandt redlich reflektieren regelrecht relativieren repräsentieren resümieren ringen rücksichtslos rühmen sachlich sarkastisch satirisch scharfsinnig scheinbar scheitern schlagfertig schließlich schlussendlich schlussfolgern schlüssig schmachten schmähen schwanken schwelgen sinnen sinnieren skrupellos somit sorgfältig sozusagen spöttisch streben stringent strittig suggerieren symbolisieren tadellos teilweise thematisieren tiefsinnig trachten treffend trösten umfassend umgarnen umsichtig umstritten unbedacht unerheblich unleugbar unstrittig untermauern unterstreichen unterwerfen unverkennbar unzweifelhaft vage verabscheuen veranschaulichen verantwortungsvoll verdeutlichen vereiteln verführen vergegenwärtigen vergleichen verharren verhöhnen verkörpern verlocken vermeintlich vermitteln verschmähen versichern verspotten verweilen verzaubern vieldeutig vielschichtig vorausschauend voraussetzen vorbildlich voreilig vornehmlich wanken warnen weitsichtig wesentlich widerfahren widerlegen widerspiegeln widersprüchlich wiedergeben wohlgemerkt wortgewandt würdigen zaudern zentral zudem zuletzt zunächst zusammenfassen zuspitzen zustoßen zweifelhaft zweifellos zweifelsfrei zweifelsohne zwiespältig zynisch zögern Überforderung Überheblichkeit Überschwang Überzeugung überdies überwiegend überwinden überzeugend".toLowerCase().split(" "));
  const LISTE_SPRECHEN = new Set("quatschen labern tratschen plaudern ratschen schwatzen klönen plappern nerven stressen chillen abhängen zocken pennen knipsen kapieren checken peilen schnallen mogeln schummeln pfuschen angeben protzen aufschneiden meckern motzen nörgeln jammern zoffen lästern anmachen verduften abhauen türmen flitzen sausen rasen schlendern bummeln trödeln schuften malochen ackern büffeln pauken schwänzen blamieren vermasseln verbocken verpatzen vergeigen hinkriegen hinbekommen aufmöbeln cool krass mies fies lässig spießig kitschig peinlich öde nervig bescheuert verrückt schräg schrullig bekloppt knülle platt happy sauer genervt gestresst Kumpel Kollege Typ Tussi Macker Angeber Besserwisser Spielverderber Quatsch Blödsinn Unsinn Mist Zoff Stress Krach Knatsch Ärger Zirkus Theater Chaos Durcheinander Gedränge Gewusel Schnäppchen Kram Krempel Zeug Kohle Knete Moos Penunze eigentlich übrigens jedenfalls schließlich sowieso ohnehin eben halt ja doch mal bloß nämlich quasi sozusagen irgendwie irgendwo irgendwann ziemlich ganz richtig echt wirklich tatsächlich natürlich selbstverständlich zumindest wenigstens immerhin ausgerechnet ausnahmsweise unbedingt keinesfalls bestimmt vermutlich wahrscheinlich eventuell gegebenenfalls".toLowerCase().split(" "));
  const lemma = w => w._l || (w._l = String(w.w).replace(/^(der|die|das) /, "").toLowerCase());
  const modus = () => (typeof state !== "undefined" && state && state.modus && MODI[state.modus]) ? state.modus : "standard";

  window.wordStufe = function (w) {
    if (w.id >= 2000000) return w.level;
    if (w.id < 1000) return OLD[w.level || 1] || 3;
    return state.stufe || 3;
  };

  /* Passt das Wort zum gewählten Lernmodus? */
  window.modusPasst = function (w) {
    const m = modus();
    if (w.id < 2000000) return m === "standard" || m === "alle";
    if (m === "alle") return true;
    if (w.x && m === "standard") return false; /* Archiv-Wörter gibt es nur in „Alle Wörter“ */
    if (m === "schule") return w.m === "s" || LISTE_SCHULE.has(lemma(w));
    if (m === "sprechen") return w.m === "g" || LISTE_SPRECHEN.has(lemma(w));
    return true;
  };

  async function getJson(url) {
    if (cache[url]) return cache[url];
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + " " + r.status);
    return (cache[url] = await r.json());
  }

  function register(list, archiv) {
    list.forEach(w => {
      if (byId.has(w.id)) return;
      if (archiv) w.x = 1;
      WORDS.push(w); byId.set(w.id, w);
    });
  }

  window.prepareWords = async function () {
    try {
      const idx = await getJson("woerter/index.json");
      const want = state.stufe || 3;
      const genug = () => WORDS.filter(w => !state.learned[w.id] && modusPasst(w)).length >= 40;
      if (modus() === "alle" && WORDS.filter(w => w.x).length < 2000) {
        const xs = (idx.archiv || []).slice().sort(() => Math.random() - 0.5).slice(0, 3);
        for (const n of xs) register(await getJson("woerter/" + n), true);
      }
      const order = [want];
      for (let d = 1; d < 7; d++) order.push(want + d, want - d);
      for (const l of order.filter(x => x >= 1 && x <= 7)) {
        const names = (idx.stufen[l] || []).slice();
        if (l === 7) names.sort(() => Math.random() - 0.5);
        for (const name of names) {
          register(await getJson("woerter/" + name));
          if (genug()) return;
        }
      }
    } catch (e) { /* ohne Wortdateien läuft die Seite mit den vorhandenen Wörtern */ }
  };

  window.rememberWord = function (id) {
    const w = byId.get(id);
    if (!w || w.id < 2000000) return;
    if (!Array.isArray(state.custom)) state.custom = [];
    if (!state.custom.some(c => c.id === id)) state.custom.push(w);
  };

  window.modusHtml = function () {
    const m = modus();
    return '<article class="card"><span class="tag">Lernmodus</span><div class="row">' +
      Object.keys(MODI).map(k => '<button class="btn ' + (k === m ? "primary" : "") + '" data-modus="' + k + '">' + MODI[k] + "</button>").join("") +
      '</div><p class="hint">' + INFO[m] + "</p></article>";
  };

  let laeuft = false;
  document.addEventListener("click", async ev => {
    const b = ev.target.closest("[data-modus]");
    if (!b || laeuft) return;
    laeuft = true;
    try {
      state.modus = b.dataset.modus;
      const h = b.closest("article") && b.closest("article").querySelector(".hint");
      if (h) h.textContent = "Lade Wörter …";
      state.daily.ids = state.daily.ids.filter(id => state.learned[id]); /* noch ungeübte Wörter von heute werden ersetzt */
      save();
      await prepareWords();
      addNewWords(NEW_PER_DAY);
    } catch (e) { /* trotzdem neu zeichnen */ }
    laeuft = false;
    renderAll();
  });
})();
