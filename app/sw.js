// marca: 903a35600a
// Guarda o app inteiro no celular para abrir mesmo sem sinal (templo, estrada, wi-fi fraco do hotel).
const CACHE = "caravana-v6", EXTRA = "caravana-ext", MAPA = "caravana-mapa", MARCAS = "caravana-marcas";
// lista de arquivos gerada pelo tools/gerar-site.py
const ARQUIVOS = /*ARQUIVOS*/["index.html", "shim.js", "config.js", "manifest.webmanifest", "jogo.html", "jogo.webmanifest", "dados/geo.json", "dados/saberes/dharma.json", "dados/saberes/ganesha.json", "dados/saberes/kali.json", "dados/saberes/krishna.json", "dados/saberes/lakshmi.json", "dados/saberes/sarasvati.json", "dados/travessia.json", "deuses/brahma.webp", "deuses/durga.webp", "deuses/ganesha.webp", "deuses/ganga.webp", "deuses/hanuman.webp", "deuses/kali.webp", "deuses/krishna.webp", "deuses/lakshmi.webp", "deuses/parvati.webp", "deuses/saraswati.webp", "deuses/shiva.webp", "deuses/surya.webp", "deuses/vishnu.webp", "img/abertura-agra.webp", "img/abertura-delhi.webp", "img/abertura-embarque.webp", "img/abertura-jaipur.webp", "img/abertura-rishikesh.webp", "img/abertura-varanasi.webp", "img/bilhete-og.jpg", "img/bilhete-textura.jpg", "img/cameras/botao-latao.webp", "img/cameras/campo-corpo.jpg", "img/cameras/campo.png", "img/cameras/carteira-foto.jpg", "img/cameras/carteira.webp", "img/cameras/celular-estante.png", "img/cameras/celular.png", "img/cameras/couro-caramelo.webp", "img/cameras/couro-corpo.jpg", "img/cameras/couro-delhi.webp", "img/cameras/couro.png", "img/cameras/descartavel-corpo.jpg", "img/cameras/descartavel-estante.png", "img/cameras/descartavel.png", "img/cameras/estante.jpg", "img/cameras/etiqueta1.png", "img/cameras/etiqueta2.png", "img/cameras/etiqueta3.png", "img/cameras/instantanea-corpo.jpg", "img/cameras/instantanea-estante.png", "img/cameras/instantanea.png", "img/cameras/mala-cheia.jpg", "img/cameras/mala-oito.webp", "img/cameras/mala-papel.webp", "img/cameras/mala.jpg", "img/cameras/maleta-foto.jpg", "img/cameras/quatro-corpo.jpg", "img/cameras/quatro-estante.png", "img/cameras/quatro.png", "img/cameras/rajastao-corpo.jpg", "img/cameras/rajastao-estante.png", "img/cameras/rajastao.png", "img/cameras/super8-corpo.jpg", "img/cameras/super8-estante.png", "img/cameras/super8.png", "img/caravana-marrom.png", "img/cristal.jpg", "img/emblema.jpg", "img/fundo.webp", "img/icone-180.png", "img/icone-192.png", "img/icone-512.png", "img/icone-jogo-180.png", "img/icone-jogo-192.png", "img/icone-jogo-512.png", "img/lacre-escuro.webp", "img/lacre.webp", "img/letreiro.png", "img/lockup-claro.png", "img/logo.png", "img/mantra-ganesha.webp", "img/mantra-vasudeva.webp", "img/papiro.webp", "img/passaporte-capa.webp", "img/passaporte.webp", "img/pedra.webp", "img/planetas/budha.webp", "img/planetas/chandra.webp", "img/planetas/guru.webp", "img/planetas/ketu.webp", "img/planetas/mangala.webp", "img/planetas/rahu.webp", "img/planetas/shani.webp", "img/planetas/shukra.webp", "img/planetas/surya.webp", "img/simbolo-claro.png", "img/simbolo-dourado.png", "img/simbolo-marrom.png", "img/simbolo.png", "img/tenda.webp", "img/textura.jpg", "insignias/batismo.webp", "insignias/beatles-ashram.webp", "insignias/caverna.webp", "insignias/diwali.webp", "insignias/durga-kund.webp", "insignias/embarque.webp", "insignias/galta-ji.webp", "insignias/ganesha.webp", "insignias/ganga-aarti.webp", "insignias/govind-dev-ji.webp", "insignias/india.webp", "insignias/jaipur.webp", "insignias/kunjapuri.webp", "insignias/manikarnika.webp", "insignias/rishikesh.webp", "insignias/sankat-mochan.webp", "insignias/taj-mahal.webp", "insignias/travessia.webp", "insignias/varanasi.webp"]/*FIM*/;
// a marca de cada arquivo: numa atualização o celular só baixa de novo o que mudou (economiza o chip no exterior)
const MARCA = /*MARCAS*/{"shim.js": "9ac90dcb64", "config.js": "431d3dc4e4", "manifest.webmanifest": "dcac99ae9c", "jogo.html": "44a6f93849", "jogo.webmanifest": "dbc535eeb9", "dados/geo.json": "f261282848", "dados/saberes/dharma.json": "78a51cb407", "dados/saberes/ganesha.json": "9f55ad4be4", "dados/saberes/kali.json": "b86d7ac459", "dados/saberes/krishna.json": "aabd863896", "dados/saberes/lakshmi.json": "bc4299d791", "dados/saberes/sarasvati.json": "20ae87e44b", "dados/travessia.json": "3d22af33a4", "deuses/brahma.webp": "19992fcb0b", "deuses/durga.webp": "8d31fb940a", "deuses/ganesha.webp": "17bade2b8f", "deuses/ganga.webp": "149e4dd452", "deuses/hanuman.webp": "060814231e", "deuses/kali.webp": "58775391b0", "deuses/krishna.webp": "6ae658d645", "deuses/lakshmi.webp": "8ae7cb1e38", "deuses/parvati.webp": "7deb4969b4", "deuses/saraswati.webp": "231d5dddb2", "deuses/shiva.webp": "fce88360c5", "deuses/surya.webp": "df567b134b", "deuses/vishnu.webp": "67851a3c0b", "img/abertura-agra.webp": "96c5035722", "img/abertura-delhi.webp": "5356c14bf4", "img/abertura-embarque.webp": "9e320b1e29", "img/abertura-jaipur.webp": "965ec260db", "img/abertura-rishikesh.webp": "ce4c1a96f6", "img/abertura-varanasi.webp": "018d81939a", "img/bilhete-og.jpg": "01526b34f3", "img/bilhete-textura.jpg": "27c6916490", "img/cameras/botao-latao.webp": "2666f49629", "img/cameras/campo-corpo.jpg": "63f1e7fa9b", "img/cameras/campo.png": "c18a7e8454", "img/cameras/carteira-foto.jpg": "a7fedf6036", "img/cameras/carteira.webp": "3b77bfd17e", "img/cameras/celular-estante.png": "da6451baf7", "img/cameras/celular.png": "b10bb112cb", "img/cameras/couro-caramelo.webp": "57fa500869", "img/cameras/couro-corpo.jpg": "bf49b75fa3", "img/cameras/couro-delhi.webp": "4a78ba9b77", "img/cameras/couro.png": "e4ff450f79", "img/cameras/descartavel-corpo.jpg": "ac07cb28f5", "img/cameras/descartavel-estante.png": "f1d69c668a", "img/cameras/descartavel.png": "876e87ab30", "img/cameras/estante.jpg": "0cb7b649a8", "img/cameras/etiqueta1.png": "4aeea10cc0", "img/cameras/etiqueta2.png": "67dc1501a5", "img/cameras/etiqueta3.png": "0ad50425a9", "img/cameras/instantanea-corpo.jpg": "856089fe2a", "img/cameras/instantanea-estante.png": "f9885341c1", "img/cameras/instantanea.png": "beb836f2bc", "img/cameras/mala-cheia.jpg": "3c2218ae98", "img/cameras/mala-oito.webp": "aef48e85db", "img/cameras/mala-papel.webp": "29fc8486ca", "img/cameras/mala.jpg": "f79a46d2d3", "img/cameras/maleta-foto.jpg": "a8fd724b58", "img/cameras/quatro-corpo.jpg": "6c6747f615", "img/cameras/quatro-estante.png": "b2082a40e1", "img/cameras/quatro.png": "bbe4f0f2a4", "img/cameras/rajastao-corpo.jpg": "2b36624ac6", "img/cameras/rajastao-estante.png": "76fe9802df", "img/cameras/rajastao.png": "b480e2d873", "img/cameras/super8-corpo.jpg": "4b5235d146", "img/cameras/super8-estante.png": "2a07cbf97a", "img/cameras/super8.png": "e12eb1f958", "img/caravana-marrom.png": "784b71c5db", "img/cristal.jpg": "4adff18968", "img/emblema.jpg": "a211a86451", "img/fundo.webp": "aa9c10bcae", "img/icone-180.png": "0df37adf84", "img/icone-192.png": "11a5c845bc", "img/icone-512.png": "7745e9675a", "img/icone-jogo-180.png": "478a32078c", "img/icone-jogo-192.png": "4761844734", "img/icone-jogo-512.png": "600d600ec5", "img/lacre-escuro.webp": "d459f488fc", "img/lacre.webp": "635ae8e394", "img/letreiro.png": "6defdd3553", "img/lockup-claro.png": "8d663db03a", "img/logo.png": "7a72b39c60", "img/mantra-ganesha.webp": "a7daafb44d", "img/mantra-vasudeva.webp": "6827763e6f", "img/papiro.webp": "7e11ae5ce6", "img/passaporte-capa.webp": "3c3ed6db3a", "img/passaporte.webp": "c5a0d63fd3", "img/pedra.webp": "3440e853b6", "img/planetas/budha.webp": "4c0a1ac24f", "img/planetas/chandra.webp": "56de1fa225", "img/planetas/guru.webp": "579c3697e6", "img/planetas/ketu.webp": "a96da73a0a", "img/planetas/mangala.webp": "fd4333e899", "img/planetas/rahu.webp": "2d54c13192", "img/planetas/shani.webp": "b270872959", "img/planetas/shukra.webp": "22c1b384af", "img/planetas/surya.webp": "af1ab537fa", "img/simbolo-claro.png": "8fa2d5ebf1", "img/simbolo-dourado.png": "fefceb26fb", "img/simbolo-marrom.png": "54f22364f2", "img/simbolo.png": "cf73e5581e", "img/tenda.webp": "306f2ba051", "img/textura.jpg": "2dd579ec54", "insignias/batismo.webp": "5372da595f", "insignias/beatles-ashram.webp": "753270b7d0", "insignias/caverna.webp": "804c730450", "insignias/diwali.webp": "56d57efb26", "insignias/durga-kund.webp": "54db1886b6", "insignias/embarque.webp": "8f3b0b6dfb", "insignias/galta-ji.webp": "8aed7ab707", "insignias/ganesha.webp": "b866c0bba1", "insignias/ganga-aarti.webp": "0f3405a8b0", "insignias/govind-dev-ji.webp": "2e6c1891c5", "insignias/india.webp": "0507deebf0", "insignias/jaipur.webp": "b5a70853d8", "insignias/kunjapuri.webp": "a887052d5c", "insignias/manikarnika.webp": "e7a872925e", "insignias/rishikesh.webp": "98d094103a", "insignias/sankat-mochan.webp": "38c74ad7d0", "insignias/taj-mahal.webp": "2d4bb63d47", "insignias/travessia.webp": "44e46c3480", "insignias/varanasi.webp": "fcd5b20cfc"}/*FIMM*/;
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
    // o jogo da estrada abre do guardado, sem precisar de sinal (a atualização do app troca o arquivo quando ele muda)
    if (req.mode === "navigate" && /^\/jogo(\.html)?$/.test(u.pathname)) return e.respondWith(caches.match("jogo.html").then(g => g || guardadoPrimeiro(CACHE, req)));
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
