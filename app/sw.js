// marca: 1255c102f5
// Guarda o app inteiro no celular para abrir mesmo sem sinal (templo, estrada, wi-fi fraco do hotel).
const CACHE = "caravana-v6", EXTRA = "caravana-ext", MAPA = "caravana-mapa";
// lista de arquivos gerada pelo tools/gerar-site.py
const ARQUIVOS = /*ARQUIVOS*/["index.html", "shim.js", "config.js", "manifest.webmanifest", "dados/geo.json", "dados/saberes/dharma.json", "dados/saberes/ganesha.json", "dados/saberes/kali.json", "dados/saberes/krishna.json", "dados/saberes/lakshmi.json", "dados/saberes/sarasvati.json", "dados/travessia.json", "deuses/brahma.webp", "deuses/durga.webp", "deuses/ganesha.webp", "deuses/ganga.webp", "deuses/hanuman.webp", "deuses/kali.webp", "deuses/krishna.webp", "deuses/lakshmi.webp", "deuses/parvati.webp", "deuses/saraswati.webp", "deuses/shiva.webp", "deuses/surya.webp", "deuses/vishnu.webp", "img/abertura-agra.webp", "img/abertura-delhi.webp", "img/abertura-jaipur.webp", "img/abertura-rishikesh.webp", "img/abertura-varanasi.webp", "img/cameras/campo-corpo.jpg", "img/cameras/campo.png", "img/cameras/carteira.webp", "img/cameras/celular-estante.png", "img/cameras/celular.png", "img/cameras/couro-corpo.jpg", "img/cameras/couro.png", "img/cameras/descartavel-corpo.jpg", "img/cameras/descartavel-estante.png", "img/cameras/descartavel.png", "img/cameras/estante.jpg", "img/cameras/etiqueta1.png", "img/cameras/etiqueta2.png", "img/cameras/etiqueta3.png", "img/cameras/instantanea-corpo.jpg", "img/cameras/instantanea-estante.png", "img/cameras/instantanea.png", "img/cameras/mala-cheia.jpg", "img/cameras/mala-oito.webp", "img/cameras/mala-papel.webp", "img/cameras/mala.jpg", "img/cameras/quatro-corpo.jpg", "img/cameras/quatro-estante.png", "img/cameras/quatro.png", "img/cameras/rajastao-corpo.jpg", "img/cameras/rajastao-estante.png", "img/cameras/rajastao.png", "img/cameras/super8-corpo.jpg", "img/cameras/super8-estante.png", "img/cameras/super8.png", "img/caravana-marrom.png", "img/cristal.jpg", "img/emblema.jpg", "img/fundo.webp", "img/icone-192.png", "img/icone-512.png", "img/lacre.webp", "img/letreiro.png", "img/lockup-claro.png", "img/logo.png", "img/mantra-ganesha.webp", "img/mantra-vasudeva.webp", "img/papiro.webp", "img/passaporte-capa.webp", "img/passaporte.webp", "img/pedra.webp", "img/simbolo-claro.png", "img/simbolo-dourado.png", "img/simbolo-marrom.png", "img/simbolo.png", "img/tenda.webp", "img/textura.jpg", "insignias/batismo.webp", "insignias/beatles-ashram.webp", "insignias/caverna.webp", "insignias/diwali.webp", "insignias/durga-kund.webp", "insignias/galta-ji.webp", "insignias/ganesha.webp", "insignias/ganga-aarti.webp", "insignias/govind-dev-ji.webp", "insignias/india.webp", "insignias/jaipur.webp", "insignias/kunjapuri.webp", "insignias/manikarnika.webp", "insignias/rishikesh.webp", "insignias/sankat-mochan.webp", "insignias/taj-mahal.webp", "insignias/travessia.webp", "insignias/varanasi.webp"]/*FIM*/;
self.addEventListener("install", e => {
  // guarda um por um: se algum falhar, os outros ficam guardados do mesmo jeito
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(["./", ...ARQUIVOS].map(a => c.add(new Request(a, { cache: "reload" }))))));
  self.skipWaiting();
});
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => ![CACHE, EXTRA, MAPA].includes(k)).map(k => caches.delete(k))))); self.clients.claim(); });
const guarda = (nome, req, r) => { if (r && (r.ok || r.type === "opaque")) { const cp = r.clone(); caches.open(nome).then(c => c.put(req, cp)); } return r; };
// mostra o guardado na hora e atualiza por trás, para a próxima vez
function guardadoPrimeiro(nome, req) {
  return caches.match(req).then(g => { const rede = fetch(req).then(r => guarda(nome, req, r)).catch(() => g); return g || rede; });
}
// internet primeiro, mas se o sinal estiver fraco e demorar, abre o guardado sem esperar
function redePrimeiro(req, ms) {
  return new Promise(ok => {
    let feito = false; const fim = r => { if (!feito && r) { feito = true; ok(r); } };
    const rede = fetch(req.mode === "navigate" ? new Request(req.url, { cache: "no-store" }) : req, req.mode === "navigate" ? undefined : { cache: "no-store" });
    rede.then(r => { guarda(CACHE, req.mode === "navigate" ? "./" : req, r); fim(r); })
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
    if (req.mode === "navigate" || u.pathname.endsWith("/index.html")) return e.respondWith(redePrimeiro(req, 3500));
    if (u.pathname.endsWith("versao.json")) return e.respondWith(fetch(req).catch(() => caches.match(req).then(g => g || new Response("{}"))));
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
