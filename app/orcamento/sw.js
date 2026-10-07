// Deixa o app de orçamento abrir mesmo sem internet. Só cuida da pasta /orcamento/ (o app da Caravana tem o dele).
const CACHE = "orcamento-v2";
const ARQUIVOS = ["./", "manifest.webmanifest", "icone-192.png", "icone-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ARQUIVOS.map(a => c.add(new Request(a, { cache: "reload" }))))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("orcamento-") && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
const guarda = (req, r) => { if (r && (r.ok || r.type === "opaque")) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; };
self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET") return;
  // a página: internet primeiro (pega a versão nova), guardada se estiver sem sinal
  if (req.mode === "navigate") return e.respondWith(fetch(req, { cache: "no-store" }).then(r => guarda("./", r)).catch(() => caches.match("./")));
  // ícones e letras (Google Fonts): guardados depois da primeira vez
  if (u.origin === location.origin || /^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))
    e.respondWith(caches.match(req).then(g => g || fetch(req).then(r => guarda(req, r))));
});
