// Caravana do Céu · versão fora do Claude.
// Imita window.claude.use(...) sobre Firebase (login Google + Firestore),
// para o mesmo app rodar num site comum.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import SEED from "./seed.json";

const CFG = window.CARAVANA_CONFIG || {};
window.__SITE = true;
// líderes: um ou mais e-mails separados por vírgula no config.js
const lideres = String(CFG.lider || "").toLowerCase().split(/[\s,;]+/).filter(Boolean);
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
#portao .seta{position:fixed;left:50%;bottom:6px;z-index:2;margin-left:-20px;width:40px;text-align:center;font-size:44px;line-height:1;color:#8A3F32;animation:setapulo 1.1s ease-in-out infinite,setavis 18s infinite}
@keyframes setavis{0.0%,20.0%{opacity:1}22.2%,100.0%{opacity:0}}
@keyframes setapulo{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}
#portao .cel{position:relative;width:160px;height:230px;border-radius:28px;background:#1d1b18;padding:8px;box-shadow:0 10px 30px rgba(40,28,15,.3)}
#portao .tela{position:relative;width:100%;height:100%;border-radius:21px;overflow:hidden;background:#F5EFE4}
#portao .pag{position:absolute;inset:0 0 34px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
#portao .pag img{width:40px}
#portao .pag i{display:block;width:90px;height:6px;border-radius:3px;background:#E0D3BA}
#portao .barra{position:absolute;left:0;right:0;bottom:0;height:34px;background:#fff;border-top:1px solid #e6dccb;display:flex;justify-content:space-around;align-items:center}
#portao .barra span{width:18px;height:18px;display:grid;place-items:center}
#portao .barra svg{width:18px;height:18px}
#portao .barra .comp{border-radius:50%;animation:brilho 18s infinite}
@keyframes brilho{0.0%,3.3%{box-shadow:0 0 0 0 rgba(47,111,214,0)}6.7%,14.4%{box-shadow:0 0 0 7px rgba(47,111,214,.3)}17.8%,100.0%{box-shadow:0 0 0 0 rgba(47,111,214,0)}}
#portao .folha{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:14px 14px 0 0;box-shadow:0 -4px 14px rgba(0,0,0,.15);padding:10px 8px 12px;display:flex;flex-direction:column;gap:5px;transform:translateY(105%);animation:folha 18s infinite}
#portao .folha div{font-size:9.5px;white-space:nowrap;text-align:left;padding:7px 8px;border-radius:8px;background:#f3f1ee;color:#333;display:flex;justify-content:space-between;align-items:center}
#portao .folha .alvo{animation:alvo 18s infinite}
#portao .dlg{position:absolute;inset:0;background:#f2f2f4;opacity:0;animation:dlg 18s infinite;font-size:9.5px;color:#222}
#portao .dlg .top{display:flex;justify-content:space-between;align-items:center;padding:12px 10px 10px;background:#fff;border-bottom:1px solid #e3e3e6}
#portao .dlg .top span{color:#2F6FD6}
#portao .dlg .top b{color:#2F6FD6;padding:3px 5px;border-radius:6px;animation:alvoadd 18s infinite}
#portao .dlg .row{display:flex;align-items:center;gap:8px;margin:12px 10px;padding:8px;background:#fff;border-radius:10px}
#portao .dlg .row i{width:30px;height:30px;border-radius:8px;background:#F5EFE4 url(img/simbolo-marrom.png) center/70% no-repeat;border:1px solid #e3d7c0}
#portao .home{position:absolute;inset:0;background:linear-gradient(160deg,#6b7a5e,#3F4938);opacity:0;animation:home 18s infinite;display:grid;grid-template-columns:repeat(3,36px);justify-content:center;align-content:start;gap:12px;padding:26px 8px}
#portao .home b{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.25);justify-self:center}
#portao .home .app{background:#F5EFE4 url(img/simbolo-marrom.png) center/70% no-repeat;animation:pop 18s infinite}
#portao .dedo{position:absolute;width:26px;height:26px;border-radius:50%;background:rgba(138,63,50,.55);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);animation:dedo 18s infinite;left:50%;top:60%;z-index:3}
@keyframes dedo{0.0%{left:60%;top:45%;opacity:0}2.2%,8.3%{left:60%;top:45%;opacity:1;transform:scale(1)}14.4%{left:calc(100% - 40px);top:calc(100% - 30px);transform:scale(1)}16.1%{transform:scale(.7)}17.8%,25.6%{left:calc(100% - 40px);top:calc(100% - 30px);transform:scale(1)}32.2%{left:calc(50% - 13px);top:calc(100% - 78px);transform:scale(1)}33.9%{transform:scale(.7)}35.6%,48.9%{left:calc(50% - 13px);top:calc(100% - 78px);transform:scale(1)}55.6%{left:calc(100% - 36px);top:4px;transform:scale(1)}57.2%{transform:scale(.7)}58.9%,72.2%{left:calc(100% - 36px);top:4px;transform:scale(1)}78.9%{left:calc(50% - 13px);top:61px;transform:scale(1)}80.6%{transform:scale(.7)}82.2%{left:calc(50% - 13px);top:61px;transform:scale(1);opacity:1}87.8%,100.0%{left:calc(50% - 13px);top:61px;opacity:0}}
@keyframes folha{0.0%,18.3%{transform:translateY(105%)}21.7%,46.1%{transform:translateY(0)}47.8%,100.0%{transform:translateY(105%)}}
@keyframes alvo{0.0%,33.3%{background:#f3f1ee}33.9%,46.1%{background:#dfe9fb}47.8%,100.0%{background:#f3f1ee}}
@keyframes dlg{0.0%,46.7%{opacity:0}48.9%,68.3%{opacity:1}70.6%,100.0%{opacity:0}}
@keyframes alvoadd{0.0%,56.7%{background:transparent}57.2%,68.3%{background:#dfe9fb}70.6%,100.0%{background:transparent}}
@keyframes home{0.0%,68.3%{opacity:0}70.6%,96.7%{opacity:1}100.0%{opacity:0}}
@keyframes pop{0.0%,71.1%{transform:scale(0)}73.9%{transform:scale(1.15)}75.6%,100.0%{transform:scale(1)}}
#portao.inst .cx{padding:20px 20px 22px;gap:10px}
#portao.inst .cx>div>img{width:44px}
#portao.inst h1{font-size:min(19px,4.7vw);white-space:nowrap;text-transform:uppercase;letter-spacing:.04em}
#portao.inst .cel{zoom:.8}
@media (max-height:760px){#portao.inst .cel{zoom:.66}#portao.inst .cx{gap:8px}}
@media (max-height:600px){#portao{padding:12px 14px 40px}#portao.inst .cel{zoom:.5}#portao.inst .cx{padding:14px 16px 16px;gap:6px}#portao.inst .cx>div>img{width:34px}#portao.inst h1{font-size:min(17px,4.6vw)}#portao.inst .como{font-size:9.5px}#portao .leg{gap:5px}#portao .leg p{font-size:13.5px}#portao .leg p small{font-size:11.5px}}
#portao .andr{width:100%;display:flex;flex-direction:column;gap:7px;text-align:left}#portao .andr p{font-size:14.5px;line-height:1.4;color:#3B2A1C;display:flex;gap:8px;align-items:flex-start}#portao .andr p.t{font:600 11px Poppins,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#A07C45;margin-top:4px}#portao .andr b.n{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#3F4938;color:#F6EDDA;font-size:12px}#portao .leg[hidden],#portao .andr[hidden]{display:none}
#portao .cel.and .barra{top:0;bottom:auto;border-top:0;border-bottom:1px solid #e6dccb;padding:0 4px}
#portao .cel.and .pag{inset:34px 0 0}
#portao .cel.and .folha{top:30px;bottom:auto;left:auto;right:3px;width:94%;border-radius:10px;transform-origin:top right;transform:scale(0);animation-name:folhaA}
#portao .cel.and .dedo{animation-name:dedoA}
#portao .cel.and .dlg .top b{color:#1a73e8}
@keyframes folhaA{0.0%,18.3%{transform:scale(0)}21.7%,46.1%{transform:scale(1)}47.8%,100.0%{transform:scale(0)}}
@keyframes dedoA{0.0%{left:50%;top:55%;opacity:0}2.2%,8.3%{left:50%;top:55%;opacity:1;transform:scale(1)}14.4%{left:calc(100% - 34px);top:4px;transform:scale(1)}16.1%{transform:scale(.7)}17.8%,25.6%{left:calc(100% - 34px);top:4px;transform:scale(1)}32.2%{left:48%;top:70px;transform:scale(1)}33.9%{transform:scale(.7)}35.6%,48.9%{left:48%;top:70px;transform:scale(1)}55.6%{left:calc(100% - 36px);top:4px;transform:scale(1)}57.2%{transform:scale(.7)}58.9%,72.2%{left:calc(100% - 36px);top:4px;transform:scale(1)}78.9%{left:calc(50% - 13px);top:61px;transform:scale(1)}80.6%{transform:scale(.7)}82.2%{left:calc(50% - 13px);top:61px;transform:scale(1);opacity:1}87.8%,100.0%{left:calc(50% - 13px);top:61px;opacity:0}}
#portao [hidden]{display:none!important}
#portao.inst{overflow-y:auto;-webkit-overflow-scrolling:touch;place-items:start center}
#portao .rolar{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:999px;background:#3F4938;color:#F6EDDA;font:600 13px Poppins,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.35);cursor:pointer;animation:rolpulo 1.4s ease-in-out infinite;transition:opacity .3s}
#portao .rolar.some{opacity:0;pointer-events:none}
@keyframes rolpulo{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,5px)}}
#portao .abas{display:flex;gap:6px;background:#E9DEC8;border-radius:999px;padding:4px;width:100%}
#portao .abas .aba{flex:1;justify-content:center;padding:9px 10px;background:transparent;color:#6B5A43;font-size:14px}
#portao .abas .aba.on{background:#3F4938;color:#F6EDDA}
#portao .man{list-style:none;margin:2px 0 0;padding:0;width:100%;display:flex;flex-direction:column;gap:12px;text-align:left}
#portao .man[hidden],#portao .cel[hidden]{display:none}
#portao .man li{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.4;color:#3B2A1C}
#portao .man b.n{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#3F4938;color:#F6EDDA;font-size:12.5px;margin-top:1px}
#portao .man .ilus{margin-top:6px}
#portao .man .chip{display:inline-flex;align-items:center;gap:6px;font:500 13px -apple-system,system-ui,sans-serif;font-style:normal;color:#1d1d1f;background:#fff;border:1px solid #E2D6C0;border-radius:10px;padding:7px 12px;box-shadow:0 1px 2px rgba(0,0,0,.08)}
#portao .man .chip svg{width:16px;height:16px}
#portao .man .chip.redondo{border-radius:999px;padding:6px 14px;font-weight:700;letter-spacing:.08em}
#portao .man .chip.azul{color:#2F6FD6;font-weight:600}
#portao .man .icone{display:inline-block;width:44px;height:44px;border-radius:11px;background:#F5EFE4 url(img/simbolo-marrom.png) center/68% no-repeat;border:1px solid #E2D6C0;box-shadow:0 2px 5px rgba(0,0,0,.12)}
#portao .man li.obs{font-size:13px;color:#6B5A43;background:#F1E8D6;border-radius:12px;padding:10px 12px}
#portao .como{font:300 10px Poppins,system-ui,sans-serif;letter-spacing:.03em;color:#5A4A38;margin:2px 0 -2px}
#portao .leg{width:100%;display:flex;flex-direction:column;gap:8px;text-align:left}
#portao .leg p{opacity:1!important;animation:none!important;font-size:15px;line-height:1.4;color:#3B2A1C;display:flex;gap:8px;align-items:flex-start}
#portao .leg p small{display:block;font-size:12.5px;color:#7A6650;margin-top:2px}
#portao .leg p b.n{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#3F4938;color:#F6EDDA;font-size:12px;margin-top:1px}
#portao .leg .ic{width:26px;height:26px;vertical-align:-7px}#portao .leg .ic svg{width:16px;height:16px}
#portao .leg p:nth-child(1){animation:leg1 18s infinite}#portao .leg p:nth-child(2){animation:leg2 18s infinite}#portao .leg p:nth-child(3){animation:leg3 18s infinite}#portao .leg p:nth-child(4){animation:leg4 18s infinite}
@keyframes leg1{0.0%,0.1%{opacity:0}2.3%,96.1%{opacity:1}98.9%,100.0%{opacity:0}}
@keyframes leg2{0.0%,24.4%{opacity:0}26.7%,96.1%{opacity:1}98.9%,100.0%{opacity:0}}
@keyframes leg3{0.0%,47.8%{opacity:0}50.0%,96.1%{opacity:1}98.9%,100.0%{opacity:0}}
@keyframes leg4{0.0%,70.0%{opacity:0}72.2%,96.1%{opacity:1}98.9%,100.0%{opacity:0}}
#portao .seta.topo{bottom:auto;top:6px;left:auto;right:22px;margin:0;animation-name:setasobe,setavis}
@keyframes setasobe{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
`;
let tituloPortao = "Travessia da<br>Índia Sagrada";
function portao(...kids) {
  let el = document.getElementById("portao");
  if (!el) { const st = document.createElement("style"); st.textContent = css; document.head.append(st); el = document.createElement("div"); el.id = "portao"; document.body.append(el); }
  const cx = document.createElement("div"); cx.className = "cx";
  const topo = document.createElement("div"); topo.innerHTML = `<img src="img/simbolo-marrom.png" alt=""><p class="sub">Caravana do Céu</p>${tituloPortao ? "<h1>" + tituloPortao + "</h1>" : ""}`;
  topo.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px";
  cx.append(topo, ...kids); el.replaceChildren(cx); el.classList.remove("inst");
}
// até saber se a pessoa já entrou, o app fica escondido (antes ele aparecia inteiro por um instante e depois vinha a tela de entrar)
if (pronto) {
  const st = document.createElement("style");
  st.textContent = "html.espera,html.espera body{background:#1d1a16 url(img/textura.jpg) center/cover}html.espera body>*:not(#portao):not(#fora):not(#boasvindas){visibility:hidden}";
  document.head.append(st);
  // quem já entrou neste celular vê o app na hora (como antes); só quem ainda não entrou espera a tela certa
  let jaEntrou = false; try { jaEntrou = localStorage.getItem("cdi-entrou") === "1"; } catch (e) {}
  if (!jaEntrou) document.documentElement.classList.add("espera");
  // primeira vez no celular, fora do app instalado: a boas-vindas aparece na hora, sem esperar o login carregar (antes ficava um fundo vazio e piscava)
  const celular0 = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  const instalado0 = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (!jaEntrou && celular0 && !instalado0 && !window.CARAVANA_NAVEGADOR_INTERNO && location.protocol === "https:")
    document.addEventListener("DOMContentLoaded", () => { try { telaInstalar(); } catch (e) {} });
  // segurança: nunca deixa a tela escura presa (sem internet a conferência pode demorar)
  setTimeout(() => { if (!document.getElementById("portao")) document.documentElement.classList.remove("espera"); }, 5000);
}
// o próprio app tira o "espera" quando já sabe o que mostrar (boas-vindas ou a página certa); 8 s é só segurança
const fecharPortao = () => { document.getElementById("portao")?.remove(); setTimeout(() => document.documentElement.classList.remove("espera"), 4000); };
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

  // volta do login do Google (celular): se deu erro, mostra na tela de entrar
  let voltouDoGoogle = false; try { voltouDoGoogle = sessionStorage.getItem("cdi-google") === "1"; sessionStorage.removeItem("cdi-google"); } catch (e) {}
  if (voltouDoGoogle) auth.getRedirectResult().catch(e => { erroLogin = e && e.code ? "Não consegui entrar (" + e.code.replace("auth/", "") + "). Tente de novo." : "Não consegui entrar. Tente de novo."; if (!auth.currentUser) telaLogin(); });
  // lê primeiro o que já está guardado no celular; se não tiver, pergunta à internet (no máximo 6 s)
  const leDoc = async caminho => {
    const ref = fs.doc(caminho);
    try { const c = await ref.get({ source: "cache" }); if (c.exists) return c; } catch (e) {}
    return Promise.race([ref.get(), new Promise(r => setTimeout(() => r("demorou"), 6000))]).catch(() => null);
  };
  auth.onAuthStateChanged(async u => {
    if (!u) return telaLogin();
    const email = String(u.email || "").toLowerCase();
    me = { id: u.uid, name: u.displayName || email.split("@")[0], avatarUrl: u.photoURL || "", email, isOwner: lideres.includes(email) && u.emailVerified };
    // não espera a internet confirmar: com sinal fraco isso segurava a entrada no app
    fs.doc("perfis/" + u.uid).set({ name: me.name, avatarUrl: me.avatarUrl, ts: Date.now() }).catch(() => {});
    if (me.isOwner) {
      semear();
      const ac = await leDoc("privado/acesso");
      if (ac === "demorou") return entrar();
      if (!ac || !ac.exists) return telaCriarPalavra();
      return entrar();
    }
    // entrou com a palavra antiga: a senha vira a palavra nova só depois de confirmar que é membro
    const novaSenha = () => { if (trocarSenha) { const nova = trocarSenha; trocarSenha = ""; u.updatePassword(senhaDe(nova)).catch(() => {}); } };
    const m = await leDoc("membros/" + u.uid);
    let entrouAntes = false; try { entrouAntes = localStorage.getItem("cdi-entrou") === "1"; } catch (e) {}
    if (m === "demorou" && entrouAntes) return entrar();
    if (m && m !== "demorou" && m.exists) { novaSenha(); return entrar(); }
    // entrou com e-mail + palavra: a mesma palavra já vira a chave de membro, sem pedir de novo
    if (palavraDigitada) {
      const palavra = palavraDigitada; palavraDigitada = "";
      try { await fs.doc("membros/" + u.uid).set({ palavra, nome: me.name, email: me.email, ts: Date.now() }); novaSenha(); return entrar(); }
      catch (e) { trocarSenha = ""; erroLogin = "Palavra incorreta. Confira com a líder da caravana."; await auth.signOut(); return; }
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
// palavras que já valeram antes (a conta de quem entrou naquela época tem a senha com a palavra antiga)
const PALAVRAS_ANTIGAS = ["caravana", "ganga"];
let trocarSenha = "";
const senhaDe = palavra => "caravana-" + palavra;
async function entrarComEmail(email, palavra, erro, bt) {
  email = email.trim().toLowerCase(); palavra = palavra.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { erro.textContent = "Confira o e-mail."; return; }
  if (!palavra) { erro.textContent = "Digite a palavra da caravana."; return; }
  // a líder entra pela conta Google (é o que confirma que o e-mail é dela)
  if (lideres.includes(email)) {
    bt.disabled = true; bt.textContent = "Abrindo o Google…";
    const prov = new firebase.auth.GoogleAuthProvider(); prov.setCustomParameters({ prompt: "select_account", login_hint: email });
    const vai = () => { try { sessionStorage.setItem("cdi-google", "1"); } catch (x) {} return auth.signInWithRedirect(prov); };
    try { if (celular) await vai(); else await auth.signInWithPopup(prov); return; }
    catch (e) { try { await vai(); return; } catch (x) {} erro.textContent = "Não consegui entrar. Tente de novo."; bt.disabled = false; bt.textContent = "Entrar"; return; }
  }
  erro.textContent = ""; erroLogin = ""; bt.disabled = true; bt.textContent = "Entrando…"; palavraDigitada = palavra;
  try { await auth.signInWithEmailAndPassword(email, senhaDe(palavra)); return; }
  catch (e) {
    if (/network/.test(e.code || "")) { erro.textContent = "Sem internet. Tente de novo quando tiver sinal."; }
    else {
      // quem criou a conta quando a palavra era outra: entra com a palavra antiga e a senha passa a ser a nova
      for (const antiga of PALAVRAS_ANTIGAS) {
        if (antiga === palavra) continue;
        try { await auth.signInWithEmailAndPassword(email, senhaDe(antiga)); trocarSenha = palavra; return; } catch (x) {}
      }
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
function celAnimado(andr) {
  const d = el("div", { className: "cel" + (andr ? " and" : "") });
  if (andr) { d.innerHTML = '<div class="tela"><div class="pag"><img src="img/simbolo-marrom.png" alt=""><i></i><i style="width:70px"></i></div>' +
    '<div class="barra"><span style="flex:1;margin:0 6px;height:14px;border-radius:7px;background:#eee"></span><span class="comp"><svg viewBox="0 0 24 24" fill="#444"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></span></div>' +
    '<div class="folha"><div>Nova guia</div><div class="alvo">Adicionar à tela inicial</div><div>Configurações</div></div>' +
    '<div class="dlg"><div class="top"><span>Cancelar</span><b>Instalar</b></div><div class="row"><i></i>Caravana</div></div>' +
    '<div class="home"><b></b><b></b><b></b><b></b><b class="app"></b><b></b></div><div class="dedo"></div></div>'; return d; }
  d.innerHTML = '<div class="tela"><div class="pag"><img src="img/simbolo-marrom.png" alt=""><i></i><i style="width:70px"></i></div>' +
    '<div class="barra"><span><svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></span><span><svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2"><rect x="5" y="5" width="14" height="14" rx="2"/></svg></span><span class="comp"><svg viewBox="0 0 24 24" fill="#2F6FD6"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span></div>' +
    '<div class="folha"><div>Compartilhar</div><div class="alvo">Adicionar à Tela de Início <span>⊞</span></div><div>Ver mais</div></div>' +
    '<div class="dlg"><div class="top"><span>Cancelar</span><b>Adicionar</b></div><div class="row"><i></i>Caravana</div></div>' +
    '<div class="home"><b></b><b></b><b></b><b></b><b class="app"></b><b></b></div><div class="dedo"></div></div>';
  return d;
}
// primeira vez no celular: antes do passo a passo de instalar, uma tela de boas-vindas animada com o lacre de embarcar
function telaInstalar() {
  let viu = false; try { viu = sessionStorage.getItem("cdi-bv-inst") === "1"; } catch (e) {}
  if (document.getElementById("bvinst")) return;
  if (viu) return passosInstalar();
  const st = document.createElement("style");
  st.textContent = `#bvinst{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px 24px;text-align:center;color:#E2C08A;
    background:linear-gradient(180deg,rgba(14,11,8,.35),rgba(14,11,8,.75)),url(img/bilhete-textura.jpg) center/cover,#0E0B08;font-family:Poppins,system-ui,sans-serif;transition:opacity .6s}
  #bvinst.sai{opacity:0}
  #bvinst::after{content:"";position:absolute;inset:14px;border:1px solid rgba(201,160,98,.5);pointer-events:none}
  #bvinst .s{width:64px;opacity:0;animation:bvsobe 1.2s .2s ease forwards}
  #bvinst small{font:600 11px Cinzel,Georgia,serif;letter-spacing:.42em;color:#C9A062;opacity:0;animation:bvsobe 1s .8s ease forwards}
  #bvinst h1{margin:0;font:700 26px/1.25 Cinzel,Georgia,serif;letter-spacing:.06em;color:#F0D7A6;opacity:0;animation:bvsobe 1.2s 1.2s ease forwards}
  #bvinst p{margin:0;max-width:300px;font:400 italic 19px/1.5 Georgia,serif;color:#E8D2A4;opacity:0;animation:bvsobe 1.4s 2s ease forwards}
  #bvinst .fio{width:120px;height:1px;background:linear-gradient(90deg,transparent,#C9A062,transparent);opacity:0;animation:bvsobe 1s 1.7s ease forwards}
  #bvinst button{margin-top:14px;width:86px;height:86px;border:0;padding:0;border-radius:50%;background:url(img/lacre-escuro.webp) center/contain no-repeat;cursor:pointer;opacity:0;-webkit-tap-highlight-color:transparent;
    animation:bvsobe 1s 2.9s ease forwards,bvbrilha 2.6s 3.9s ease-in-out infinite;filter:drop-shadow(0 8px 14px rgba(0,0,0,.75))}
  #bvinst button:active{transform:scale(.94)}
  #bvinst b.r{font:700 13px/1.6 Cinzel,serif;letter-spacing:.32em;padding-left:.32em;color:#E2C08A;opacity:0;animation:bvsobe 1s 3.1s ease forwards}
  @keyframes bvsobe{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  @keyframes bvbrilha{0%,100%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.75))}50%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.75)) drop-shadow(0 0 16px rgba(226,192,138,.45))}}
  @media (prefers-reduced-motion:reduce){#bvinst *{animation-duration:.01s!important;animation-delay:0s!important}}`;
  document.head.append(st);
  const d = document.createElement("div"); d.id = "bvinst";
  d.innerHTML = '<img class="s" src="img/simbolo-dourado.png" alt=""><small>Caravana do Céu</small><h1>Bem-vindo ao aplicativo<br>da Caravana do Céu</h1><div class="fio"></div><p>Aqui inicia a sua travessia.</p><button type="button" aria-label="Embarcar"></button><b class="r">EMBARCAR</b>';
  document.body.append(d); document.documentElement.classList.remove("espera");
  d.querySelector("button").onclick = () => {
    try { sessionStorage.setItem("cdi-bv-inst", "1"); } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(25);
    passosInstalar(); d.classList.add("sai"); setTimeout(() => d.remove(), 650);
  };
}
function passosInstalar() {
  // manual de instalar: só o passo a passo, com uma aba para iPhone e outra para Android (abre na do celular da pessoa)
  const ua = navigator.userAgent, android = /Android/i.test(ua);
  tituloPortao = "";
  const chip = (txt, cls) => '<i class="chip' + (cls ? " " + cls : "") + '">' + txt + "</i>";
  const passo = (n, txt, ilus) => '<li><b class="n">' + n + '</b><div><span>' + txt + "</span>" + (ilus ? '<div class="ilus">' + ilus + "</div>" : "") + "</div></li>";
  const SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="#2F6FD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1"/></svg>';
  const ios = el("ol", { className: "man" });
  ios.innerHTML =
    passo(1, "No Safari, toque nos <b>três pontinhos</b> no canto de baixo, à direita", chip("•••", "redondo")) +
    passo(2, "Toque em <b>Compartilhar</b>", chip(SHARE + " Compartilhar")) +
    passo(3, "Role e toque em <b>Ver mais</b>", chip("Ver mais ›")) +
    passo(4, "Toque em <b>Adicionar à Tela de Início</b>", chip("Adicionar à Tela de Início ⊞")) +
    passo(5, "Toque em <b>Adicionar</b>, no alto da tela", chip("Adicionar", "azul")) +
    passo(6, "Pronto! Abra o aplicativo pelo ícone da <b>Caravana</b> na Tela de Início", '<i class="icone"></i>');
  const and = el("ol", { className: "man" });
  and.innerHTML =
    passo(1, "No Chrome, toque nos <b>três pontinhos</b> no alto, à direita", chip("⋮", "redondo")) +
    passo(2, "Toque em <b>Adicionar à tela inicial</b> ou <b>Instalar app</b>", chip("Adicionar à tela inicial")) +
    passo(3, "Toque em <b>Instalar</b>", chip("Instalar", "azul")) +
    passo(4, "Pronto! Abra o aplicativo pelo ícone da <b>Caravana</b> na tela do celular", '<i class="icone"></i>') +
    '<li class="obs"><span><b>No navegador da Samsung:</b> toque nas três linhas <b>≡</b> embaixo, à direita, depois em <b>Adicionar página a</b> e em <b>Tela inicial</b>.</span></li>';
  const ja = el("button", { type: "button", hidden: true, onclick: async () => { const e = pedidoInstalar; if (!e) return; pedidoInstalar = null;
    try { await e.prompt(); const r = await e.userChoice; if (r && r.outcome === "accepted") telaInstalado(); } catch (x) {} } }, "Instalar agora");
  if (android && pedidoInstalar) ja.hidden = false;
  const abaI = el("button", { type: "button", className: "aba" }, "iPhone"), abaA = el("button", { type: "button", className: "aba" }, "Android");
  const celI = celAnimado(false), celA = celAnimado(true);
  const mostra = qual => { ios.hidden = qual !== "ios"; and.hidden = qual !== "and"; celI.hidden = qual !== "ios"; celA.hidden = qual !== "and"; abaI.classList.toggle("on", qual === "ios"); abaA.classList.toggle("on", qual === "and"); ja.hidden = !(qual === "and" && pedidoInstalar); };
  abaI.onclick = () => mostra("ios"); abaA.onclick = () => mostra("and");
  portao(el("p", { id: "instalar", className: "como", textContent: "Como instalar o aplicativo" }), el("div", { className: "abas" }, abaI, abaA), celI, celA, ios, and, ja);
  mostra(android ? "and" : "ios");
  const pt = document.getElementById("portao"); pt.classList.add("inst");
  // a página é maior que a tela: um botão "role para baixo" até a pessoa chegar no fim
  const rol = el("button", { type: "button", className: "rolar", onclick: () => pt.scrollBy({ top: pt.clientHeight * .7, behavior: "smooth" }) }, "Role para ver tudo ↓");
  pt.append(rol);
  const confere = () => rol.classList.toggle("some", pt.scrollTop + pt.clientHeight >= pt.scrollHeight - 30);
  pt.addEventListener("scroll", confere, { passive: true }); [abaI, abaA].forEach(b => b.addEventListener("click", () => setTimeout(confere, 50))); setTimeout(confere, 60);
}
function telaInstalado() {
  tituloPortao = "";
  portao(el("p", { className: "inst", innerHTML: "Pronto! Abra o aplicativo pelo ícone da <b>Caravana</b> na Tela de Início do seu celular." }));
}
function telaLogin() {
  if (precisaInstalar()) return telaInstalar();
  tituloPortao = "Travessia da<br>Índia Sagrada";
  const erro = el("p", { className: "err", textContent: erroLogin });
  const em = el("input", { type: "email", placeholder: "Seu e-mail", autocomplete: "email", inputMode: "email", autocapitalize: "none" });
  const pal = el("input", { type: "text", placeholder: "Palavra chave", autocomplete: "off", autocapitalize: "none" });
  const entra = el("button", { type: "button", onclick: () => entrarComEmail(em.value, pal.value, erro, entra) }, "Entrar");
  pal.addEventListener("keydown", e => { if (e.key === "Enter") entra.click(); });
  portao(el("p", { textContent: "Digite seu e-mail e a palavra chave" }), em, pal, entra, erro);
}
function telaPalavra() {
  const inp = el("input", { type: "text", placeholder: "Palavra chave", autocomplete: "off" });
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
function entrar() { try { localStorage.setItem("cdi-entrou", "1"); } catch (e) {} fecharPortao(); resolvePronto(true); iniciarPresenca(); }

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
// cota do Firebase: quando o limite grátis do dia acaba, o banco recusa com "resource-exhausted".
// Avisa o app (faixa para a líder e para os viajantes) e tenta de novo a cada 2 min até o banco voltar.
let cotaEsgotada = false;
const ehCota = e => !!e && (e.code === "resource-exhausted" || /resource.exhausted|quota/i.test(e.message || ""));
function marcaCota(v) { if (cotaEsgotada === v) return; cotaEsgotada = v; window.__cotaEsgotada = v; window.dispatchEvent(new CustomEvent("caravana-cota", { detail: v })); }
const vigia = p => p.catch(e => { if (ehCota(e)) marcaCota(true); throw e; });
// escuta que se refaz sozinha depois de uma recusa por cota (o Firestore encerra a escuta quando dá erro)
function ouve(q, conv, cb, err) {
  let off = null, parou = false, t = null;
  const liga = () => { off = q.onSnapshot(s => { if (!s.metadata.fromCache) marcaCota(false); cb(conv(s)); }, e => {
    if (ehCota(e)) { marcaCota(true); if (!parou) t = setTimeout(liga, 120000); }
    (err || (() => {}))(e);
  }); };
  liga();
  return () => { parou = true; clearTimeout(t); off && off(); };
}
function refDoc(r) {
  return {
    id: r.id,
    get: async () => snapDoc(await vigia(r.get())),
    set: d => vigia(r.set(d)),
    update: d => vigia(r.update(achata(d))),
    delete: () => vigia(r.delete()),
    onSnapshot: (cb, err) => ouve(r, snapDoc, cb, err),
  };
}
function refCol(q, base) {
  base = base || q;
  return {
    orderBy: (f, d) => refCol(q.orderBy(f, d || "asc"), base),
    limit: n => refCol(q.limit(n), base),
    where: (a, op, b) => refCol(q.where(a, op === "eq" ? "==" : op, b), base),
    onSnapshot: (cb, err) => ouve(q, qs => ({ docs: qs.docs.map(snapDoc), size: qs.size, empty: qs.empty }), cb, err),
    get: async () => { const qs = await vigia(q.get()); return { docs: qs.docs.map(snapDoc), size: qs.size, empty: qs.empty }; },
    add: async d => { const r = await vigia(base.add(d)); return { id: r.id }; },
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
const VIVO = 5 * 60 * 1000; // quem não avisou há 5 min sai do "online"
let minhaPresenca = {}, batida = null;
function iniciarPresenca() {
  const bate = () => fs.doc("presenca/" + me.id).set({ by: me.id, presence: minhaPresenca, ts: Date.now() }).then(() => marcaCota(false), e => { if (ehCota(e)) marcaCota(true); });
  bate(); clearInterval(batida); batida = setInterval(bate, 120000); // avisa que está online a cada 2 min (economiza a cota do Firebase)
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
    // se a escuta cair (sem internet, ou antes de a pessoa virar membro), volta a escutar sozinha
    let desde = Date.now() - 5000, off = () => {}, parado = false;
    const vistos = new Set();
    const liga = () => {
      off = fs.collection("reacoes").where("ts", ">", desde).onSnapshot(qs => {
        qs.docChanges().forEach(c => { if (c.type !== "added" || vistos.has(c.doc.id)) return; vistos.add(c.doc.id); const d = c.doc.data(); if (d.topic === topic) fn({ data: d.data, by: d.by, isMe: d.by === me.id }); });
      }, () => { off(); if (!parado) setTimeout(() => { if (parado) return; desde = Math.max(desde, Date.now() - 60000); if (vistos.size > 500) vistos.clear(); liga(); }, 5000); });
    };
    liga();
    return () => { parado = true; off(); };
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
window.caravanaSair = () => { try { localStorage.removeItem("cdi-entrou"); } catch (e) {} return auth && auth.signOut().then(() => location.reload()); };
