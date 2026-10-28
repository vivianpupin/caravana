// marca: 5399f7f8a2
// Guarda o app inteiro no celular para abrir mesmo sem sinal (templo, estrada, wi-fi fraco do hotel).
const CACHE = "caravana-v6", EXTRA = "caravana-ext", MAPA = "caravana-mapa", MARCAS = "caravana-marcas";
// lista de arquivos gerada pelo tools/gerar-site.py
// a marca de cada arquivo: numa atualização o celular só baixa de novo o que mudou (economiza o chip no exterior)
const LISTA = new Set(ARQUIVOS.filter(a => a !== "index.html"));
async function guardaUm(c, m, a, sempre) {
  const mk = MARCA[a];
  if (!sempre && mk) { const [g, ant] = await Promise.all([c.match(a), m.match(a)]); if (g && ant && (await ant.text()) === mk) return; }
  await c.add(new Request(a, { cache: "reload" })); if (mk) await m.put(a, new Response(mk));
}
self.addEventListener("install", e => {
  // guarda um por um: se algum falhar, os outros ficam guardados do mesmo jeito
  e.waitUntil(Promise.all([caches.open(CACHE), caches.open(MARCAS)]).then(([c, m]) => Promise.allSettled(["./", ...ARQUIVOS].map(a => guardaUm(c, m, a, a === "./" || a === "index.html")))));
  self.skipWaiting();
});
// completa o que faltou guardar (se a instalação pegou sinal fraco, algum arquivo ficou de fora e faltava sem internet)
function completa() { return Promise.all([caches.open(CACHE), caches.open(MARCAS)]).then(([c, m]) => Promise.all(["./", ...ARQUIVOS].map(a => c.match(a).then(g => g || guardaUm(c, m, a, true)).catch(() => {})))); }
self.addEventListener("message", e => { if (e.data === "completa") e.waitUntil(completa()); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => ![CACHE, EXTRA, MAPA, MARCAS].includes(k)).map(k => caches.delete(k))))); self.clients.claim(); });
const guarda = (nome, req, r) => { if (r && (r.ok || r.type === "opaque")) { const cp = r.clone(); caches.open(nome).then(c => c.put(req, cp)); } return r; };
// mostra o guardado na hora e atualiza por trás, para a próxima vez
function guardadoPrimeiro(nome, req) {
  return caches.match(req).then(g => { const rede = fetch(req).then(r => guarda(nome, req, r)).catch(() => g); return g || rede; });
}
// internet primeiro, mas se o sinal estiver fraco e demorar, abre o guardado sem esperar
// a página nova termina de baixar e fica guardada mesmo quando o guardado já abriu (antes, com wi-fi lento, o celular recarregava e abria a versão velha de novo)
function redePrimeiro(req, ms, ev) {
  return new Promise(ok => {
    let feito = false; const fim = r => { if (!feito && r) { feito = true; ok(r); } };
    const rede = fetch(req.mode === "navigate" ? new Request(req.url, { cache: "no-store" }) : req, req.mode === "navigate" ? undefined : { cache: "no-store" });
    // resposta estranha (página de login do wi-fi do hotel, erro do servidor): abre o guardado e não guarda por cima
    const salva = rede.then(r => {
      if (!(r && r.ok && !r.redirected && r.type === "basic")) return (req.mode === "navigate" ? caches.match("./") : caches.match(req)).then(g => fim(g || (r && r.redirected ? Response.redirect(r.url, 302) : r)));
      const cp = r.clone(); fim(r); return caches.open(CACHE).then(c => c.put(req.mode === "navigate" ? "./" : req, cp)); });
    if (ev) ev.waitUntil(salva.catch(() => {}));
    salva
      .catch(() => (req.mode === "navigate" ? caches.match("./") : caches.match(req)).then(g => fim(g || Response.error())));
    setTimeout(() => (req.mode === "navigate" ? caches.match("./").then(g => g || caches.match("index.html")) : caches.match(req)).then(fim), ms);
  });
}
async function mapa(req) {
  const g = await caches.match(req); if (g) return g;
  const r = await fetch(req); const c = await caches.open(MAPA); c.put(req, r.clone());
  c.keys().then(ks => { if (ks.length > 400) ks.slice(0, ks.length - 400).forEach(k => c.delete(k)); });
  return r;
}
self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET") return;
  if (u.origin === location.origin) {
    // login do Google (/__/auth/...) e funções do Netlify: sempre direto da internet, nunca do guardado
    if (u.pathname.startsWith("/__/") || u.pathname.includes("/.netlify/")) return;
    if (req.mode === "navigate" && !/^\/(index\.html)?$/.test(u.pathname)) return;
    if (req.mode === "navigate" || u.pathname.endsWith("/index.html")) return e.respondWith(redePrimeiro(req, 3500, e));
    if (u.pathname.endsWith("versao.json")) return e.respondWith(fetch(req).catch(() => caches.match(req).then(g => g || new Response("{}"))));
    // arquivos do app já guardados saem direto do celular, sem consultar a internet (a atualização do app troca só os que mudaram)
    const rel = u.pathname.replace(/^\//, "");
    if (LISTA.has(rel)) return e.respondWith(caches.match(req).then(g => g || guardadoPrimeiro(CACHE, req)));
    return e.respondWith(guardadoPrimeiro(CACHE, req));
  }
  // letras (Google Fonts) e o zip do álbum: guardadas depois da primeira vez
  if (/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(u.hostname)) return e.respondWith(guardadoPrimeiro(EXTRA, req));
  // pedacinhos do mapa já vistos ficam guardados para abrir sem sinal
  if (/(^|\.)tile\.openstreetmap\.org$|server\.arcgisonline\.com$/.test(u.hostname)) return e.respondWith(mapa(req).catch(() => Response.error()));
});
// notificações de mensagem nova no chat
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Caravana do Céu", { body: d.body || "Mensagem nova no chat", icon: "img/icone-192.png", badge: "img/icone-192.png", tag: d.tag || "chat", renotify: true, requireInteraction: !!d.requireInteraction, data: { url: d.url || "./?aba=conversa" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    const aba = (url.match(/aba=([a-z]+)/) || [])[1] || "conversa";
    for (const w of ws) { w.postMessage({ aba }); if ("focus" in w) return w.focus(); }
    return self.clients.openWindow(url);
  }));
});
