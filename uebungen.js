(function () {
  const css = document.createElement("style");
  css.textContent = ".ex-list{display:flex;flex-direction:column;gap:8px}.ex-opt{text-align:left;width:100%}";
  document.head.appendChild(css);

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function pickKind(w) {
    const e = state.learned[w.id], box = e ? e.box : 1, r = Math.random();
    if (rv.retry && rv.retry.has(w.id)) return "tippen";
    if (box <= 1) return r < 0.5 ? "bedeutung" : "wahl";
    if (box === 2) return r < 0.5 ? "wahl" : "tippen";
    return "tippen";
  }

  function build(w) {
    const kind = pickKind(w);
    const pool = WORDS.filter(x => x.id !== w.id && x.t === w.t && x.d !== w.d && x.w !== w.w);
    if (kind === "tippen" || pool.length < 3) return { idx: rv.idx, kind: "tippen" };
    const key = kind === "bedeutung" ? "d" : "w";
    const opts = shuffle([{ t: w[key], ok: true }].concat(shuffle(pool).slice(0, 3).map(x => ({ t: x[key], ok: false }))));
    return { idx: rv.idx, kind: kind, opts: opts };
  }

  function decorate() {
    if (typeof rv === "undefined" || rv.answered || rv.idx >= rv.queue.length) return;
    const w = byId.get(rv.queue[rv.idx]);
    const card = document.querySelector("#view-review .card");
    if (!w || !card || !card.querySelector("#answer")) return;
    if (!rv.ex || rv.ex.idx !== rv.idx) rv.ex = build(w);
    const ex = rv.ex;
    if (ex.kind === "tippen") return;

    const row = card.querySelector(".row");
    const input = card.querySelector("#answer");
    const label = card.querySelector("label[for='answer']");
    const check = row && row.querySelector("[data-action='check']");
    if (!row || !input) return;
    input.style.display = "none";
    if (label) label.remove();
    if (check) check.remove();

    if (ex.kind === "bedeutung") {
      const s = card.querySelector(".quiz-sentence");
      if (s) s.innerHTML = 'Was bedeutet <span class="gap">' + esc(w.w) + "</span>?";
      const h = card.querySelector(".hint");
      if (h) h.remove();
      const lead = document.querySelector("#view-review .lead");
      if (lead) lead.textContent = "Wort " + (rv.idx + 1) + " von " + rv.queue.length + ". Wähle die richtige Bedeutung.";
    }
    row.insertAdjacentHTML("beforebegin", '<div class="ex-list">' +
      ex.opts.map((o, i) => '<button class="btn ex-opt" data-ex="' + i + '">' + esc(o.t) + "</button>").join("") + "</div>");
  }

  window.addEventListener("load", () => {
    const R = window.renderReview;
    window.renderReview = function () {
      R();
      try { decorate(); } catch (e) { /* Standard-Ansicht bleibt */ }
    };
  });

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-ex]");
    if (!b || typeof rv === "undefined" || !rv.ex || !rv.ex.opts) return;
    const ok = !!rv.ex.opts[Number(b.dataset.ex)].ok;
    const w = byId.get(rv.queue[rv.idx]);
    const input = document.getElementById("answer");
    if (input && w) input.value = ok ? blankText(w) : "";
    checkAnswer(!ok);
  });
})();