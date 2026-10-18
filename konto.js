const SUPABASE_URL = "https://lcemjxfvjmliwjjtwxxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_lXYVIN64xhm8f9lej0gUww_txoRx-Pb";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Adapter: die vorhandene Speicherlogik in index.html läuft unverändert weiter */
async function kontoSession() { const r = await sb.auth.getSession(); return r.data.session; }
if (!window.claude) {
  window.claude = {
    use: async (name) => {
      if (name === "user") return { id: async () => { const s = await kontoSession(); return s ? s.user.id : null; } };
      if (name === "db") return { doc: () => ({
        get: async () => {
          const r = await sb.from("progress").select("state").maybeSingle();
          if (r.error) throw r.error;
          return { exists: !!r.data, data: () => ({ state: r.data && r.data.state }) };
        },
        set: async (obj) => {
          const s = await kontoSession();
          const r = await sb.from("progress").upsert({ user_id: s.user.id, state: obj.state, updated_at: new Date().toISOString() });
          if (r.error) throw r.error;
        }
      }) };
    }
  };
}

/* Anmelde-Oberfläche */
function k2(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function kontoFehler(e) {
  const m = String(e.message || "").toLowerCase();
  if (m.includes("invalid login")) return "E-Mail oder Passwort stimmt nicht.";
  if (m.includes("already registered")) return "Mit dieser E-Mail gibt es schon ein Konto. Melde dich an.";
  if (m.includes("at least")) return "Das Passwort ist zu kurz. Nimm mindestens 6 Zeichen.";
  if (m.includes("not confirmed")) return "Bitte bestätige zuerst deine E-Mail über den Link, den wir dir geschickt haben.";
  if (m.includes("valid email") || m.includes("invalid format") || m.includes("validate email")) return "Diese E-Mail-Adresse sieht nicht richtig aus.";
  if (m.includes("rate limit") || m.includes("too many") || e.status === 429) return "Zu viele Versuche. Warte ein paar Minuten und versuche es noch einmal.";
  if (m.includes("fetch") || m.includes("network")) return "Keine Verbindung. Prüfe dein Internet.";
  return "Das hat nicht geklappt. Versuche es noch einmal.";
}
function kontoBox() {
  let box = document.getElementById("konto");
  if (!box) { box = document.createElement("div"); box.id = "konto"; document.querySelector(".top").after(box); }
  return box;
}
function kontoUi(session) {
  const box = kontoBox();
  if (session) {
    box.innerHTML = '<p class="hint">Angemeldet als ' + k2(session.user.email) + ' · <button class="btn ghost" id="k-out">Abmelden</button></p>';
    document.getElementById("k-out").onclick = async () => {
      try { await flush(); } catch (e) {}
      await sb.auth.signOut();
      try { localStorage.removeItem("wortschatz-v1"); } catch (e) {}
      location.reload();
    };
    return;
  }
  box.innerHTML = '<div class="card"><h3>Konto</h3><p class="hint">Melde dich an, damit dein Fortschritt auf jedem Gerät gespeichert bleibt.</p>' +
    '<input class="field" id="k-mail" type="email" autocomplete="email" placeholder="E-Mail">' +
    '<input class="field" id="k-pw" type="password" autocomplete="current-password" placeholder="Passwort (mindestens 6 Zeichen)">' +
    '<div class="row"><button class="btn primary" id="k-in">Anmelden</button><button class="btn" id="k-up">Registrieren</button></div>' +
    '<p class="hint" id="k-msg" role="status"></p></div>';
  const msg = document.getElementById("k-msg");
  async function go(signup) {
    const email = document.getElementById("k-mail").value.trim(), password = document.getElementById("k-pw").value;
        if (!email || !password) { msg.textContent = "Bitte E-Mail und Passwort eingeben."; return; }
    msg.textContent = "Einen Moment …";
    const res = signup ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password });
    if (res.error) { msg.textContent = kontoFehler(res.error); return; }
    if (!res.data.session) { msg.textContent = "Bitte bestätige deine E-Mail über den Link, den wir dir geschickt haben."; return; }
    kontoUi(res.data.session);
    connectStorage();
  }
  document.getElementById("k-in").onclick = () => go(false);
  document.getElementById("k-up").onclick = () => go(true);
}
window.addEventListener("load", async () => kontoUi(await kontoSession()));