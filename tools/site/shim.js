// Caravana do Céu · versão fora do Claude.
// Imita window.claude.use(...) sobre Firebase (login Google + Firestore),
// para o mesmo app rodar num site comum.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import SEED from "./seed.json";

const CFG = window.CARAVANA_CONFIG || {};
window.__SITE = true;
const pronto = !!(CFG.firebase && CFG.firebase.apiKey && !/COLE/.test(CFG.firebase.apiKey));

// ---------- tela de entrada ----------
const css = `
#portao{position:fixed;inset:0;z-index:99;background:#F5EFE4 url(img/textura.jpg) center/cover;display:grid;place-items:center;padding:24px;font-family:Poppins,system-ui,sans-serif;color:#3B2A1C}
#portao .cx{background:rgba(251,244,228,.94);border:1px solid #D9BE8C;border-radius:22px;box-shadow:0 20px 60px rgba(40,28,15,.25);max-width:380px;width:100%;padding:30px 24px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
#portao img{width:64px}
#portao h1{font-family:Cinzel,Georgia,serif;font-weight:500;font-size:24px;letter-spacing:.05em;margin:0;line-height:1.2}
#portao p{margin:0;font-size:14.5px;line-height:1.5;color:#5A4A38}
#portao .sub{font-size:11.5px;letter-spacing:.24em;text-transform:uppercase;color:#A07C45}
#portao button{border:0;border-radius:999px;padding:13px 22px;font:600 15px Poppins,system-ui,sans-serif;background:#3F4938;color:#F6EDDA;cursor:pointer;display:flex;gap:10px;align-items:center}
#portao button.claro{background:transparent;color:#6B5A43;font-weight:500;font-size:13px;padding:6px}
#portao input{width:100%;border:1px solid #CDB184;border-radius:12px;padding:12px 14px;font:16px Poppins,system-ui,sans-serif;background:#fff;text-align:center}
#portao .err{color:#9B2E22;font-size:13.5px;min-height:1em}
`;
function portao(...kids) {
  let el = document.getElementById("portao");
  if (!el) { const st = document.createElement("style"); st.textContent = css; document.head.append(st); el = document.createElement("div"); el.id = "portao"; document.body.append(el); }
  const cx = document.createElement("div"); cx.className = "cx";
  const topo = document.createElement("div"); topo.innerHTML = `<img src="img/simbolo-marrom.png" alt=""><p class="sub">Caravana do Céu</p><h1>Travessia da<br>Índia Sagrada</h1>`;
  topo.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px";
  cx.append(topo, ...kids); el.replaceChildren(cx);
}
const fecharPortao = () => document.getElementById("portao")?.remove();
const el = (tag, props = {}, ...kids) => { const e = document.createElement(tag); Object.assign(e, props); e.append(...kids); return e; };

// ---------- estado ----------
let resolvePronto; const tudoPronto = new Promise(r => { resolvePronto = r; });
let fs, auth, me = null;

if (!pronto) {
  document.addEventListener("DOMContentLoaded", () => portao(el("p", { textContent: "O aplicativo está sendo configurado. Volte em instantes." })));
} else {
  firebase.initializeApp(CFG.firebase);
  auth = firebase.auth();
  fs = firebase.firestore();
  fs.settings({ ignoreUndefinedProperties: true, merge: true });
  fs.enablePersistence({ synchronizeTabs: true }).catch(() => {});
  const lider = String(CFG.lider || "").toLowerCase();

  // volta do login do Google (celular): se deu erro, mostra na tela de entrar
  auth.getRedirectResult().catch(e => { erroLogin = e && e.code ? "Não consegui entrar (" + e.code.replace("auth/", "") + "). Tente de novo." : "Não consegui entrar. Tente de novo."; if (!auth.currentUser) telaLogin(); });
  auth.onAuthStateChanged(async u => {
    if (!u) return telaLogin();
    const email = String(u.email || "").toLowerCase();
    me = { id: u.uid, name: u.displayName || email.split("@")[0], avatarUrl: u.photoURL || "", email, isOwner: !!lider && email === lider && u.emailVerified };
    try { await fs.doc("perfis/" + u.uid).set({ name: me.name, avatarUrl: me.avatarUrl, ts: Date.now() }); } catch (e) {}
    if (me.isOwner) {
      await semear();
      const ac = await fs.doc("privado/acesso").get().catch(() => null);
      if (!ac || !ac.exists) return telaCriarPalavra();
      return entrar();
    }
    const m = await fs.doc("membros/" + u.uid).get().catch(() => null);
    if (m && m.exists) return entrar();
    telaPalavra();
  });
}
let erroLogin = "";
// no celular o login abre na mesma aba e volta para o app (a janelinha separada se perde entre as abas do Safari)
const celular = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)) || matchMedia("(display-mode: standalone)").matches || navigator.standalone;
function telaLogin() {
  const erro = el("p", { className: "err", textContent: erroLogin });
  const b = el("button", { type: "button", onclick: async () => {
    erro.textContent = ""; erroLogin = "";
    const prov = new firebase.auth.GoogleAuthProvider(); prov.setCustomParameters({ prompt: "select_account" });
    if (celular) { b.disabled = true; b.textContent = "Abrindo o Google…"; try { await auth.signInWithRedirect(prov); return; } catch (x) { b.disabled = false; b.textContent = "Entrar com Google"; } }
    try { await auth.signInWithPopup(prov); }
    catch (e) {
      if (/popup|operation-not-supported|web-storage/.test(e.code || "")) { try { await auth.signInWithRedirect(prov); return; } catch (x) {} }
      erro.textContent = "Não consegui entrar. Tente de novo.";
    }
  } }, "Entrar com Google");
  portao(el("p", { textContent: "O aplicativo da Caravana Índia 2026. Entre com a sua conta Google para começar." }), b, erro);
}
function telaPalavra() {
  const inp = el("input", { type: "text", placeholder: "Palavra da caravana", autocomplete: "off" });
  const erro = el("p", { className: "err" });
  const ok = async () => {
    const palavra = inp.value.trim().toLowerCase(); if (!palavra) return;
    erro.textContent = "";
    try { await fs.doc("membros/" + me.id).set({ palavra, nome: me.name, email: me.email, ts: Date.now() }); entrar(); }
    catch (e) { erro.textContent = "Palavra incorreta. Confira com a líder da caravana."; }
  };
  inp.addEventListener("keydown", e => { if (e.key === "Enter") ok(); });
  portao(el("p", { textContent: `Olá, ${me.name.split(" ")[0]}! Digite a palavra da caravana, que a líder passou no grupo.` }), inp,
    el("button", { type: "button", onclick: ok }, "Entrar na caravana"), erro,
    el("button", { type: "button", className: "claro", onclick: () => auth.signOut() }, "Usar outra conta Google"));
}
function telaCriarPalavra() {
  const inp = el("input", { type: "text", placeholder: "Ex.: namaste2026", autocomplete: "off" });
  const erro = el("p", { className: "err" });
  const ok = async () => {
    const palavra = inp.value.trim().toLowerCase(); if (palavra.length < 4) { erro.textContent = "Use pelo menos 4 letras."; return; }
    try { await fs.doc("privado/acesso").set({ palavra, ts: Date.now() }); entrar(); }
    catch (e) { erro.textContent = "Não consegui salvar. Confira se colou as regras do Firestore."; }
  };
  portao(el("p", { textContent: "Bem-vinda, líder! Crie a palavra da caravana. Só quem souber essa palavra consegue entrar no app." }), inp,
    el("button", { type: "button", onclick: ok }, "Criar a palavra"), erro);
}
function entrar() { fecharPortao(); resolvePronto(true); iniciarPresenca(); }

// Na primeira entrada da líder, copia o conteúdo do app (cidades, lugares, saberes, carta final).
async function semear() {
  try {
    const t = await fs.collection("locais").limit(1).get();
    if (!t.empty) return;
    let lote = fs.batch(), n = 0;
    for (const [col, docs] of Object.entries(SEED)) for (const [id, data] of Object.entries(docs)) {
      lote.set(fs.doc(col + "/" + id), data); n++;
      if (n % 400 === 0) { await lote.commit(); lote = fs.batch(); }
    }
    await lote.commit();
  } catch (e) { console.warn("semear", e); }
}

// ---------- db ----------
const ehObj = v => v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Blob);
function achata(obj, pre = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = pre ? pre + "." + k : k;
    if (ehObj(v) && v.__delete__ === true) out[key] = firebase.firestore.FieldValue.delete();
    else if (ehObj(v) && Object.keys(v).length) achata(v, key, out);
    else out[key] = v;
  }
  return out;
}
const snapDoc = s => ({ id: s.id, exists: s.exists, data: () => s.data() || {} });
function refDoc(r) {
  return {
    id: r.id,
    get: async () => snapDoc(await r.get()),
    set: d => r.set(d),
    update: d => r.update(achata(d)),
    delete: () => r.delete(),
    onSnapshot: (cb, err) => r.onSnapshot(s => cb(snapDoc(s)), err || (() => {})),
  };
}
function refCol(q, base) {
  base = base || q;
  return {
    orderBy: (f, d) => refCol(q.orderBy(f, d || "asc"), base),
    limit: n => refCol(q.limit(n), base),
    where: (a, op, b) => refCol(q.where(a, op === "eq" ? "==" : op, b), base),
    onSnapshot: (cb, err) => q.onSnapshot(qs => cb({ docs: qs.docs.map(snapDoc), size: qs.size, empty: qs.empty }), err || (() => {})),
    get: async () => { const qs = await q.get(); return { docs: qs.docs.map(snapDoc), size: qs.size, empty: qs.empty }; },
    add: async d => { const r = await base.add(d); return { id: r.id }; },
    doc: id => refDoc(id ? base.doc(id) : base.doc()),
  };
}
const db = { collection: p => refCol(fs.collection(p)), doc: p => refDoc(fs.doc(p)) };

// ---------- user ----------
const cachePerfis = {};
const user = {
  id: () => me && me.id,
  me: async () => ({ id: me.id, name: me.name, avatarUrl: me.avatarUrl, isOwner: me.isOwner }),
  isOwner: () => !!(me && me.isOwner),
  canEdit: () => !!(me && me.isOwner),
  can: () => true,
  profiles: async ids => {
    const out = {};
    await Promise.all(ids.map(async id => {
      if (!cachePerfis[id]) { try { const s = await fs.doc("perfis/" + id).get(); cachePerfis[id] = s.exists ? s.data() : { name: "" }; } catch (e) { cachePerfis[id] = { name: "" }; } }
      out[id] = { id, name: cachePerfis[id].name || "", avatarUrl: cachePerfis[id].avatarUrl || "" };
    }));
    return out;
  },
};

// ---------- fotos (guardadas no Firestore, comprimidas) ----------
const fotos = {}, pedindo = new Set();
const VAZIO = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
let avisoTimer = null;
window.__blobUrl = id => {
  if (!id) return VAZIO;
  if (fotos[id]) return fotos[id];
  if (!pedindo.has(id) && fs) {
    pedindo.add(id);
    fs.doc("fotos/" + id).get().then(s => {
      if (s.exists) { fotos[id] = s.data().data; clearTimeout(avisoTimer); avisoTimer = setTimeout(() => window.dispatchEvent(new Event("caravana-foto")), 60); }
    }).catch(() => pedindo.delete(id));
  }
  return VAZIO;
};
async function comprime(blob) {
  const bmp = await createImageBitmap(blob);
  let lado = 1600, q = .85, url = "";
  for (let i = 0; i < 8; i++) {
    const k = Math.min(1, lado / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    url = c.toDataURL("image/jpeg", q);
    if (url.length < 900000) break;
    q = Math.max(.55, q - .1); lado = Math.round(lado * .82);
  }
  return url;
}
const assets = {
  upload: async blob => {
    const data = await comprime(blob);
    const r = await fs.collection("fotos").add({ data, autor: me.id, ts: Date.now() });
    fotos[r.id] = data;
    return { id: r.id, url: data, sizeBytes: data.length, contentType: "image/jpeg" };
  },
  list: async () => ({ assets: [], usage: {} }),
  delete: async id => fs.doc("fotos/" + id).delete(),
};

// ---------- sala ao vivo (presença e reações) ----------
const VIVO = 3 * 60 * 1000;
let minhaPresenca = {}, batida = null;
function iniciarPresenca() {
  const bate = () => fs.doc("presenca/" + me.id).set({ by: me.id, presence: minhaPresenca, ts: Date.now() }).catch(() => {});
  bate(); clearInterval(batida); batida = setInterval(bate, 45000);
  window.addEventListener("pagehide", () => fs.doc("presenca/" + me.id).delete().catch(() => {}));
}
const room = {
  presence: async patch => { minhaPresenca = { ...minhaPresenca, ...patch }; await fs.doc("presenca/" + me.id).set({ by: me.id, presence: minhaPresenca, ts: Date.now() }); },
  onPeers: fn => {
    let antes = new Set(), ultimo = [];
    const emite = () => {
      const agora = Date.now(), peers = ultimo.filter(p => agora - p.ts < VIVO).map(p => ({ by: p.by, isMe: p.by === me.id, presence: p.presence || {} }));
      const ids = new Set(peers.map(p => p.by)), left = [...antes].filter(id => !ids.has(id)).map(by => ({ by }));
      antes = ids; fn({ peers, left });
    };
    const off = fs.collection("presenca").onSnapshot(qs => { ultimo = qs.docs.map(d => d.data()); emite(); }, () => {});
    const t = setInterval(emite, 60000);
    return () => { off(); clearInterval(t); };
  },
  emit: (topic, data) => fs.collection("reacoes").add({ topic, data, by: me.id, ts: Date.now() }),
  on: (topic, fn) => {
    const desde = Date.now() - 5000;
    return fs.collection("reacoes").where("ts", ">", desde).onSnapshot(qs => {
      qs.docChanges().forEach(c => { if (c.type !== "added") return; const d = c.doc.data(); if (d.topic === topic) fn({ data: d.data, by: d.by, isMe: d.by === me.id }); });
    }, () => {});
  },
  join: () => room,
  leave: () => {},
};

// ---------- downloads ----------
const downloads = {
  save: async ({ filename, data }) => {
    const b = data instanceof Blob ? data : new Blob([data]);
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = filename || "arquivo";
    document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  },
};

const tabela = { db, user, assets, room, downloads };
window.claude = {
  use: async nome => {
    if (!pronto) return null;
    await tudoPronto;
    return tabela[nome] || null;
  },
};
window.caravanaSair = () => auth && auth.signOut().then(() => location.reload());
