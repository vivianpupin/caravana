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
#portao .inst{font-size:17px;line-height:1.5;color:#3B2A1C;margin:2px 0 0}
#portao .ic{display:inline-grid;place-items:center;vertical-align:-8px;width:32px;height:32px;border-radius:9px;background:#fff;border:1px solid #D9BE8C;margin:0 3px}
#portao .ic svg{width:20px;height:20px}
#portao .seta{position:fixed;left:50%;bottom:6px;z-index:2;margin-left:-20px;width:40px;text-align:center;font-size:44px;line-height:1;color:#8A3F32;animation:setapulo 1.1s ease-in-out infinite,setavis 24s infinite}
@keyframes setavis{0%,22%{opacity:1}25%,100%{opacity:0}}
@keyframes setapulo{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}
#portao .cel{position:relative;width:160px;height:230px;border-radius:28px;background:#1d1b18;padding:8px;box-shadow:0 10px 30px rgba(40,28,15,.3)}
#portao .tela{position:relative;width:100%;height:100%;border-radius:21px;overflow:hidden;background:#F5EFE4}
#portao .pag{position:absolute;inset:0 0 34px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
#portao .pag img{width:40px}
#portao .pag i{display:block;width:90px;height:6px;border-radius:3px;background:#E0D3BA}
#portao .barra{position:absolute;left:0;right:0;bottom:0;height:34px;background:#fff;border-top:1px solid #e6dccb;display:flex;justify-content:space-around;align-items:center}
#portao .barra span{width:18px;height:18px;display:grid;place-items:center}
#portao .barra svg{width:18px;height:18px}
#portao .barra .comp{border-radius:50%;animation:brilho 24s infinite}
@keyframes brilho{0%,3%{box-shadow:0 0 0 0 rgba(47,111,214,0)}6%,9%{box-shadow:0 0 0 7px rgba(47,111,214,.3)}12%,100%{box-shadow:0 0 0 0 rgba(47,111,214,0)}}
#portao .folha{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:14px 14px 0 0;box-shadow:0 -4px 14px rgba(0,0,0,.15);padding:10px 8px 12px;display:flex;flex-direction:column;gap:5px;transform:translateY(105%);animation:folha 24s infinite}
#portao .folha div{font-size:9.5px;white-space:nowrap;text-align:left;padding:7px 8px;border-radius:8px;background:#f3f1ee;color:#333;display:flex;justify-content:space-between;align-items:center}
#portao .folha .alvo{animation:alvo 24s infinite}
#portao .dlg{position:absolute;inset:0;background:#f2f2f4;opacity:0;animation:dlg 24s infinite;font-size:9.5px;color:#222}
#portao .dlg .top{display:flex;justify-content:space-between;align-items:center;padding:12px 10px 10px;background:#fff;border-bottom:1px solid #e3e3e6}
#portao .dlg .top span{color:#2F6FD6}
#portao .dlg .top b{color:#2F6FD6;padding:3px 5px;border-radius:6px;animation:alvoadd 24s infinite}
#portao .dlg .row{display:flex;align-items:center;gap:8px;margin:12px 10px;padding:8px;background:#fff;border-radius:10px}
#portao .dlg .row i{width:30px;height:30px;border-radius:8px;background:#F5EFE4 url(img/simbolo-marrom.png) center/70% no-repeat;border:1px solid #e3d7c0}
#portao .home{position:absolute;inset:0;background:linear-gradient(160deg,#6b7a5e,#3F4938);opacity:0;animation:home 24s infinite;display:grid;grid-template-columns:repeat(3,36px);justify-content:center;align-content:start;gap:12px;padding:26px 8px}
#portao .home b{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.25);justify-self:center}
#portao .home .app{background:#F5EFE4 url(img/simbolo-marrom.png) center/70% no-repeat;animation:pop 24s infinite}
#portao .dedo{position:absolute;width:26px;height:26px;border-radius:50%;background:rgba(138,63,50,.55);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);animation:dedo 24s infinite;left:50%;top:60%;z-index:3}
@keyframes dedo{0%{left:60%;top:50%;opacity:0}4%{opacity:1;left:60%;top:50%}12%{left:calc(50% - 13px);top:calc(100% - 30px);transform:scale(1)}14%{transform:scale(.7)}17%{transform:scale(1)}
 24%{left:calc(50% - 13px);top:calc(100% - 30px)}32%{left:calc(50% - 13px);top:calc(100% - 78px);transform:scale(1)}34%{transform:scale(.7)}37%{transform:scale(1)}
 50%{left:calc(50% - 13px);top:calc(100% - 78px)}58%{left:calc(100% - 36px);top:4px;transform:scale(1)}60%{transform:scale(.7)}63%{transform:scale(1)}
 76%{left:calc(100% - 36px);top:4px}84%{left:calc(50% - 13px);top:61px;transform:scale(1)}86%{transform:scale(.7)}89%{transform:scale(1);opacity:1}95%,100%{opacity:0;left:calc(50% - 13px);top:61px}}
@keyframes folha{0%,15%{transform:translateY(105%)}20%,48%{transform:translateY(0)}50%,100%{transform:translateY(105%)}}
@keyframes alvo{0%,33%{background:#f3f1ee}35%,48%{background:#dfe9fb}100%{background:#f3f1ee}}
@keyframes dlg{0%,48%{opacity:0}51%,74%{opacity:1}77%,100%{opacity:0}}
@keyframes alvoadd{0%,59%{background:transparent}61%,74%{background:#dfe9fb}100%{background:transparent}}
@keyframes home{0%,74%{opacity:0}77%,97%{opacity:1}100%{opacity:0}}
@keyframes pop{0%,77%{transform:scale(0)}81%{transform:scale(1.15)}84%,100%{transform:scale(1)}}
#portao.inst .cx{padding:20px 20px 22px;gap:10px}
#portao.inst .cx>div>img{width:44px}
#portao.inst h1{font-size:21px}
#portao.inst .cel{zoom:.8}
@media (max-height:760px){#portao.inst .cel{zoom:.66}#portao.inst .cx{gap:8px}}
@media (max-height:600px){#portao{padding:12px 14px 40px}#portao.inst .cel{zoom:.5}#portao.inst .cx{padding:14px 16px 16px;gap:6px}#portao.inst .cx>div>img{width:34px}#portao.inst h1{font-size:18px}#portao.inst .como{font-size:15px}#portao .leg{gap:5px}#portao .leg p{font-size:13.5px}#portao .leg p small{font-size:11.5px}}
#portao .como{font:300 17px Poppins,system-ui,sans-serif;letter-spacing:.03em;color:#5A4A38;margin:2px 0 -2px}
#portao .leg{width:100%;display:flex;flex-direction:column;gap:8px;text-align:left}
#portao .leg p{opacity:0;font-size:15px;line-height:1.4;color:#3B2A1C;display:flex;gap:8px;align-items:flex-start}
#portao .leg p small{display:block;font-size:12.5px;color:#7A6650;margin-top:2px}
#portao .leg p b.n{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#3F4938;color:#F6EDDA;font-size:12px;margin-top:1px}
#portao .leg .ic{width:26px;height:26px;vertical-align:-7px}#portao .leg .ic svg{width:16px;height:16px}
#portao .leg p:nth-child(1){animation:leg1 24s infinite}#portao .leg p:nth-child(2){animation:leg2 24s infinite}#portao .leg p:nth-child(3){animation:leg3 24s infinite}#portao .leg p:nth-child(4){animation:leg4 24s infinite}
@keyframes leg1{0%{opacity:0}2%,96%{opacity:1}99%,100%{opacity:0}}
@keyframes leg2{0%,25%{opacity:0}27%,96%{opacity:1}99%,100%{opacity:0}}
@keyframes leg3{0%,50%{opacity:0}52%,96%{opacity:1}99%,100%{opacity:0}}
@keyframes leg4{0%,75%{opacity:0}77%,96%{opacity:1}99%,100%{opacity:0}}
#portao .seta.topo{bottom:auto;top:6px;left:auto;right:22px;margin:0;animation-name:setasobe,setavis}
@keyframes setasobe{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
`;
let tituloPortao = "Travessia da<br>Índia Sagrada";
function portao(...kids) {
  let el = document.getElementById("portao");
  if (!el) { const st = document.createElement("style"); st.textContent = css; document.head.append(st); el = document.createElement("div"); el.id = "portao"; document.body.append(el); }
  const cx = document.createElement("div"); cx.className = "cx";
  const topo = document.createElement("div"); topo.innerHTML = `<img src="img/simbolo-marrom.png" alt=""><p class="sub">Caravana do Céu</p><h1>${tituloPortao}</h1>`;
  topo.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px";
  cx.append(topo, ...kids); el.replaceChildren(cx); el.classList.remove("inst");
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
  // líderes: um ou mais e-mails separados por vírgula no config.js
  const lideres = String(CFG.lider || "").toLowerCase().split(/[\s,;]+/).filter(Boolean);

  // volta do login do Google (celular): se deu erro, mostra na tela de entrar
  auth.getRedirectResult().catch(e => { erroLogin = e && e.code ? "Não consegui entrar (" + e.code.replace("auth/", "") + "). Tente de novo." : "Não consegui entrar. Tente de novo."; if (!auth.currentUser) telaLogin(); });
  auth.onAuthStateChanged(async u => {
    if (!u) return telaLogin();
    const email = String(u.email || "").toLowerCase();
    me = { id: u.uid, name: u.displayName || email.split("@")[0], avatarUrl: u.photoURL || "", email, isOwner: lideres.includes(email) && u.emailVerified };
    // não espera a internet confirmar: com sinal fraco isso segurava a entrada no app
    fs.doc("perfis/" + u.uid).set({ name: me.name, avatarUrl: me.avatarUrl, ts: Date.now() }).catch(() => {});
    if (me.isOwner) {
      semear();
      const ac = await fs.doc("privado/acesso").get().catch(() => null);
      if (!ac || !ac.exists) return telaCriarPalavra();
      return entrar();
    }
    const m = await fs.doc("membros/" + u.uid).get().catch(() => null);
    if (m && m.exists) return entrar();
    // entrou com e-mail + palavra: a mesma palavra já vira a chave de membro, sem pedir de novo
    if (palavraDigitada) {
      const palavra = palavraDigitada; palavraDigitada = "";
      try { await fs.doc("membros/" + u.uid).set({ palavra, nome: me.name, email: me.email, ts: Date.now() }); return entrar(); }
      catch (e) { erroLogin = "Palavra incorreta. Confira com a líder da caravana."; await auth.signOut(); return; }
    }
    telaPalavra();
  });
}
let erroLogin = "";
// no celular o login abre na mesma aba e volta para o app (a janelinha separada se perde entre as abas do Safari)
const celular = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)) || matchMedia("(display-mode: standalone)").matches || navigator.standalone;
// Entrar com qualquer e-mail + a palavra da caravana (a palavra é a senha de todos).
// O Firebase pede senha de 6 letras ou mais, então a senha guardada é a palavra com um prefixo fixo.
let palavraDigitada = "";
const senhaDe = palavra => "caravana-" + palavra;
async function entrarComEmail(email, palavra, erro, bt) {
  email = email.trim().toLowerCase(); palavra = palavra.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { erro.textContent = "Confira o e-mail."; return; }
  if (!palavra) { erro.textContent = "Digite a palavra da caravana."; return; }
  erro.textContent = ""; erroLogin = ""; bt.disabled = true; bt.textContent = "Entrando…"; palavraDigitada = palavra;
  try { await auth.signInWithEmailAndPassword(email, senhaDe(palavra)); return; }
  catch (e) {
    if (/network/.test(e.code || "")) { erro.textContent = "Sem internet. Tente de novo quando tiver sinal."; }
    else {
      // primeira vez deste e-mail: cria a entrada na hora
      try { await auth.createUserWithEmailAndPassword(email, senhaDe(palavra)); return; }
      catch (x) {
        erro.textContent = /email-already-in-use/.test(x.code || "") ? "Palavra incorreta para este e-mail. Confira com a líder da caravana."
          : /operation-not-allowed/.test(x.code || "") ? "A entrada por e-mail ainda não foi ligada. Avise a líder."
          : "Não consegui entrar. Tente de novo.";
      }
    }
  }
  palavraDigitada = ""; bt.disabled = false; bt.textContent = "Entrar";
}
// ---------- instalar no celular: antes de entrar (no iPhone o app instalado tem a sua própria entrada) ----------
const emApp = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const celularDeVerdade = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
const precisaInstalar = () => celularDeVerdade && !emApp() && !window.CARAVANA_NAVEGADOR_INTERNO && location.protocol === "https:";
let pedidoInstalar = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); pedidoInstalar = e; });
window.addEventListener("appinstalled", () => { pedidoInstalar = null; if (document.getElementById("instalar")) telaInstalado(); });
const COMP = '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1"/></svg></span>';
function celAnimado() {
  const d = el("div", { className: "cel" });
  d.innerHTML = '<div class="tela"><div class="pag"><img src="img/simbolo-marrom.png" alt=""><i></i><i style="width:70px"></i></div>' +
    '<div class="barra"><span><svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></span><span class="comp"><svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1"/></svg></span><span><svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2"><rect x="5" y="5" width="14" height="14" rx="2"/></svg></span></div>' +
    '<div class="folha"><div>Copiar</div><div class="alvo">Adicionar à Tela de Início <span>⊞</span></div><div>Adicionar aos Favoritos</div></div>' +
    '<div class="dlg"><div class="top"><span>Cancelar</span><b>Adicionar</b></div><div class="row"><i></i>Caravana</div></div>' +
    '<div class="home"><b></b><b></b><b></b><b></b><b class="app"></b><b></b></div><div class="dedo"></div></div>';
  return d;
}
function telaInstalar() {
  const ua = navigator.userAgent, android = /Android/i.test(ua), ipad = /iPad/i.test(ua) || /Macintosh/.test(ua), noTopo = ipad || /CriOS|FxiOS|EdgiOS/i.test(ua);
  tituloPortao = "Prepare-se para<br>a travessia";
  if (android) {
    const dica = el("p", { className: "inst" });
    const bt = el("button", { id: "instalar", type: "button", onclick: async () => {
      const e = pedidoInstalar;
      if (!e) { dica.innerHTML = "Toque em <b>⋮</b> no alto e depois em <b>Instalar app</b>"; return; }
      pedidoInstalar = null;
      try { await e.prompt(); const r = await e.userChoice; if (r && r.outcome === "accepted") telaInstalado(); } catch (x) {}
    } }, "Instalar o app");
    return portao(el("p", { className: "como", textContent: "Como instalar o aplicativo" }), bt, dica);
  }
  const leg = el("div", { className: "leg" });
  leg.innerHTML = '<p><b class="n">1</b><span>Toque em ' + COMP + (noTopo ? "" : "<small>Não achou? Toque em ••• e depois em Compartilhar</small>") + "</span></p>" +
    '<p><b class="n">2</b><span>Toque em <b>Adicionar à Tela de Início</b></span></p>' +
    '<p><b class="n">3</b><span>Toque em <b>Adicionar</b>, no alto</span></p>' +
    '<p><b class="n">4</b><span>Abra o aplicativo pelo ícone da <b>Caravana</b> na Tela de Início do seu celular</span></p>';
  portao(el("p", { id: "instalar", className: "como", textContent: "Como instalar o aplicativo" }), celAnimado(), leg);
  document.getElementById("portao").classList.add("inst");
  document.getElementById("portao").append(el("div", { className: "seta" + (noTopo ? " topo" : ""), textContent: noTopo ? "↑" : "↓" }));
}
function telaInstalado() {
  tituloPortao = "Prepare-se para<br>a travessia";
  portao(el("p", { className: "inst", innerHTML: "Pronto! Abra o aplicativo pelo ícone da <b>Caravana</b> na Tela de Início do seu celular." }));
}
function telaLogin() {
  if (precisaInstalar()) return telaInstalar();
  tituloPortao = "Travessia da<br>Índia Sagrada";
  const erro = el("p", { className: "err", textContent: erroLogin });
  const em = el("input", { type: "email", placeholder: "Seu e-mail", autocomplete: "email", inputMode: "email", autocapitalize: "none" });
  const pal = el("input", { type: "text", placeholder: "Palavra da caravana", autocomplete: "off", autocapitalize: "none" });
  const entra = el("button", { type: "button", onclick: () => entrarComEmail(em.value, pal.value, erro, entra) }, "Entrar");
  pal.addEventListener("keydown", e => { if (e.key === "Enter") entra.click(); });
  const b = el("button", { type: "button", className: "claro", onclick: async () => {
    erro.textContent = ""; erroLogin = "";
    const prov = new firebase.auth.GoogleAuthProvider(); prov.setCustomParameters({ prompt: "select_account" });
    if (celular) { b.disabled = true; b.textContent = "Abrindo o Google…"; try { await auth.signInWithRedirect(prov); return; } catch (x) { b.disabled = false; b.textContent = "Ou entrar com Google"; } }
    try { await auth.signInWithPopup(prov); }
    catch (e) {
      if (/popup|operation-not-supported|web-storage/.test(e.code || "")) { try { await auth.signInWithRedirect(prov); return; } catch (x) {} }
      erro.textContent = "Não consegui entrar. Tente de novo.";
    }
  } }, "Ou entrar com Google");
  portao(el("p", { textContent: "O aplicativo da Caravana Índia 2026. Digite o seu e-mail e a palavra da caravana, que a líder passou no grupo." }), em, pal, entra, erro, b);
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
    el("button", { type: "button", className: "claro", onclick: () => auth.signOut() }, "Usar outro e-mail ou conta"));
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
  // foto direto da câmera: o <img> já vira para a posição certa
  let bmp; try { const u = URL.createObjectURL(blob), im = new Image(); im.src = u; await im.decode(); bmp = im; setTimeout(() => URL.revokeObjectURL(u), 1000); } catch (e) { bmp = await createImageBitmap(blob); }
  let lado = 1600, q = .85, url = ""; const bw = bmp.naturalWidth || bmp.width, bh = bmp.naturalHeight || bmp.height;
  for (let i = 0; i < 8; i++) {
    const k = Math.min(1, lado / Math.max(bw, bh));
    const c = document.createElement("canvas"); c.width = Math.round(bw * k); c.height = Math.round(bh * k);
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
