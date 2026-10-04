// Guarda o app no celular para abrir mesmo sem internet.
// Ao mudar algum número, troque a versão abaixo para todo mundo receber a atualização.
const CACHE = "emergencia-v2";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icone-180.png", "icone-192.png", "icone-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS.map(a => new Request(a, { cache: "reload" })))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// internet primeiro (para pegar números atualizados); sem sinal ou demorando, abre o guardado
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(new Promise(ok => {
    let feito = false;
    const fim = r => { if (!feito && r) { feito = true; ok(r); } };
    const chave = req.mode === "navigate" ? "./" : req;
    fetch(req).then(r => {
      if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(chave, cp)); }
      fim(r);
    }).catch(() => caches.match(chave).then(g => fim(g || Response.error())));
    setTimeout(() => caches.match(chave).then(fim), 2500);
  }));
});
