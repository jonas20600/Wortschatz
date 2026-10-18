(function () {
  const OLD = { 1: 3, 2: 5, 3: 6 };
  const cache = {};

  window.STUFEN = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];

  window.wordStufe = function (w) {
    if (w.id >= 2000000) return w.level;
    if (w.id < 1000) return OLD[w.level || 1] || 3;
    return state.stufe || 3;
  };

  async function getJson(url) {
    if (cache[url]) return cache[url];
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + " " + r.status);
    return (cache[url] = await r.json());
  }

  function register(list) {
    list.forEach(w => { if (!byId.has(w.id)) { WORDS.push(w); byId.set(w.id, w); } });
  }

  window.prepareWords = async function () {
    try {
      const idx = await getJson("woerter/index.json");
              const want = state.stufe || 3;
      const order = [want];
      for (let d = 1; d < 7; d++) order.push(want + d, want - d);
      for (const l of order.filter(x => x >= 1 && x <= 7)) {
        const names = (idx.stufen[l] || []).slice();
        if (l === 7) names.sort(() => Math.random() - 0.5);
        for (const name of names) {
          const list = await getJson("woerter/" + name);
          register(list);
          if (list.some(w => !state.learned[w.id])) return;
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
})();