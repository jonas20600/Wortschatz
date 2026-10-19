(function () {
  const NAMES = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];
  const NICK = /^[A-Za-zÄÖÜäöüß0-9_-]{3,20}$/;
  let uid = null, me = null, busy = false, asked = false, overlay = null, bar = null, timer = null;

  const css = document.createElement("style");
  css.textContent = ".lb-overlay{position:fixed;inset:0;background:rgba(10,20,50,.6);display:flex;align-items:center;justify-content:center;padding:16px;z-index:60;overflow:auto}.lb-box{max-width:520px;width:100%;max-height:88vh;overflow:auto}";
  document.head.appendChild(css);

  function ui(html) {
    if (!overlay) { overlay = document.createElement("div"); overlay.className = "lb-overlay"; document.body.appendChild(overlay); }
    overlay.innerHTML = '<div class="card lb-box">' + html + "</div>";
  }
  function close() { if (overlay) overlay.remove(); overlay = null; }

  function renderBar() {
    if (!bar) return;
    let html = '<button class="btn" data-lb="open">Bestenliste</button>';
    if (uid && me) html += '<span class="hint">Nickname: <b>' + esc(me.nickname) + '</b></span><button class="btn ghost" data-lb="nick">Ändern</button>';
    else if (uid) html += '<button class="btn primary" data-lb="nick">Nickname wählen</button>';
    bar.innerHTML = html;
  }

  async function loadMe(session) {
    const id = session ? session.user.id : null;
    if (id === uid && (me || busy || !id)) return;
    uid = id;
    me = null;
    renderBar();
    if (!uid) return;
    busy = true;
    const r = await sb.from("profiles").select("nickname,points").eq("user_id", uid).maybeSingle();
    busy = false;
    if (r.error) return;
    me = r.data;
    renderBar();
    if (!me && !asked) { asked = true; askNick(); }
  }

  function askNick() {
    ui("<h3>" + (me ? "Nickname ändern" : "Wähle deinen Nickname") + "</h3>" +
      '<p class="hint">So erscheinst du in der Bestenliste. Alle Nutzer sehen ihn, schreibe also nicht deinen echten Namen oder deine E-Mail hinein. 3 bis 20 Zeichen: Buchstaben, Zahlen, _ und -.</p>' +
      '<input class="field" id="lb-nick" type="text" maxlength="20" autocomplete="off" placeholder="Nickname" value="' + esc(me ? me.nickname : "") + '">' +
      '<p class="result no" id="lb-msg" role="status"></p>' +
      '<div class="row"><button class="btn primary" data-lb="save">Speichern</button><button class="btn ghost" data-lb="close">' + (me ? "Abbrechen" : "Später") + "</button></div>");
    const f = document.getElementById("lb-nick");
    if (f) f.focus();
  }

  async function saveNick() {
    const msg = document.getElementById("lb-msg");
    const name = document.getElementById("lb-nick").value.trim();
    if (!NICK.test(name)) { msg.textContent = "Erlaubt sind 3 bis 20 Zeichen: Buchstaben, Zahlen, _ und -."; return; }
    msg.textContent = "Einen Moment …";
    const pts = (state.score && state.score.total) || 0;
    const r = me
      ? await sb.from("profiles").update({ nickname: name }).eq("user_id", uid)
      : await sb.from("profiles").insert({ user_id: uid, nickname: name, points: pts, stufe: state.stufe || 3, streak: state.streak.count || 0 });
    if (r.error) {
      msg.textContent = r.error.code === "23505" ? "Dieser Nickname ist schon vergeben."
        : r.error.code === "23514" ? "Erlaubt sind 3 bis 20 Zeichen: Buchstaben, Zahlen, _ und -."
        : "Das hat nicht geklappt. Versuche es noch einmal.";
      return;
    }
    me = { nickname: name, points: me ? me.points : pts };
    close();
    renderBar();
  }

  async function showList() {
    ui('<p class="hint">Lade Bestenliste …</p>');
    const r = await sb.from("profiles").select("nickname,points,stufe,streak").order("points", { ascending: false }).order("updated_at", { ascending: true }).limit(50);
    if (r.error) { ui('<p class="result no">Die Bestenliste konnte nicht geladen werden.</p><div class="row"><button class="btn" data-lb="close">Schließen</button></div>'); return; }
    const rows = r.data || [];
    let extra = "";
    if (uid && me && !rows.some(x => x.nickname === me.nickname)) {
      const c = await sb.from("profiles").select("user_id", { count: "exact", head: true }).gt("points", me.points);
      if (!c.error) extra = '<p class="hint">Dein Platz: ' + ((c.count || 0) + 1) + " mit " + me.points + " Punkten.</p>";
    }
    const list = rows.length ? rows.map((x, i) => {
      const own = me && x.nickname === me.nickname;
      return '<div class="item"' + (own ? ' style="border-color:var(--accent)"' : "") + '><span class="word">' + (i + 1) + ". " + esc(x.nickname) + '</span><span class="tag">' + x.points + " Punkte</span>" +
        '<p class="sub">Stufe ' + esc(NAMES[(x.stufe || 3) - 1]) + (x.streak > 0 ? " · 🔥 " + x.streak + " Tage" : "") + "</p></div>";
    }).join("") : '<p class="hint">Noch niemand in der Liste.</p>';
    const hint = !uid ? '<p class="hint">Melde dich an und wähle einen Nickname, um in der Liste zu erscheinen.</p>'
      : !me ? '<p class="hint">Wähle einen Nickname, damit du in der Liste erscheinst.</p>' : "";
    ui("<h3>Bestenliste</h3>" + hint + extra + '<div class="list">' + list + "</div>" +
      '<div class="row">' + (uid && !me ? '<button class="btn primary" data-lb="nick">Nickname wählen</button>' : "") + '<button class="btn" data-lb="close">Schließen</button></div>');
  }

  async function push() {
    if (!uid || !me || !state.score) return;
    const total = state.score.total || 0;
    if (total <= me.points) return;
    const r = await sb.from("profiles").update({ points: total, stufe: state.stufe || 3, streak: state.streak.count || 0, updated_at: new Date().toISOString() }).eq("user_id", uid);
    if (!r.error) me.points = total;
  }

  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-lb]");
    if (!b) return;
    const a = b.dataset.lb;
    if (a === "open") showList();
    else if (a === "nick") askNick();
    else if (a === "save") saveNick();
    else if (a === "close") close();
  });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Enter" && ev.target && ev.target.id === "lb-nick") { ev.preventDefault(); saveNick(); }
  });

  window.addEventListener("load", () => {
    const nav = document.querySelector(".tabs");
    if (!nav) return;
    bar = document.createElement("div");
    bar.className = "row";
    nav.before(bar);
    renderBar();
    const S = window.save;
    window.save = function () { S(); clearTimeout(timer); timer = setTimeout(push, 3000); };
    sb.auth.onAuthStateChange((ev, session) => setTimeout(() => loadMe(session), 0));
    sb.auth.getSession().then(r => loadMe(r.data.session));
  });
})();