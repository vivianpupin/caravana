// Guarda o app no celular para abrir mesmo sem sinal.
const CACHE = "caravana-v4";
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "index.html", "shim.js", "config.js", "dados/travessia.json", "dados/geo.json", "img/simbolo-marrom.png"]).catch(() => {}))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // a página em si vem sempre fresca da internet (sem cache do navegador); o guardado só serve sem sinal
  const pega = e.request.mode === "navigate" ? fetch(e.request.url, { cache: "no-store" }) : fetch(e.request);
  e.respondWith(pega.then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
