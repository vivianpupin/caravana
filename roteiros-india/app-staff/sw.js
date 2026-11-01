// Roteiro Índia Staff: guarda o app no celular para abrir sem internet.
// Com internet, busca sempre a versão nova do roteiro; sem internet, abre a última versão guardada.
const CACHE = "roteiro-staff-v1";
const FOTOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Dahi_bhalla_or_dahi_wada_or_dahi_bada.PNG/330px-Dahi_bhalla_or_dahi_wada_or_dahi_bada.PNG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Thandai_%28Spiced_Indian_Milk_Drink%29.JPG/330px-Thandai_%28Spiced_Indian_Milk_Drink%29.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Malaiyo_Pehalwaan_lassi_in_front_of_ravidas_gate_LANKA._Varanasi_Uttar_Pradesh.jpg/330px-Malaiyo_Pehalwaan_lassi_in_front_of_ravidas_gate_LANKA._Varanasi_Uttar_Pradesh.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Meetha_paan.jpg/330px-Meetha_paan.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Rajasthani_Raj_Kachori.jpg/330px-Rajasthani_Raj_Kachori.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Dahi_puri%2C_Doi_phuchka.jpg/330px-Dahi_puri%2C_Doi_phuchka.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Litti_Chokha_2.jpg/330px-Litti_Chokha_2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Homemade_Rabri.jpg/330px-Homemade_Rabri.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Gulab-jamun-wallpaper-1.jpg/330px-Gulab-jamun-wallpaper-1.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Samosas%2C_snack_food_at_Wikipedia%27s_16th_Birthday_celebration_in_Chittagong_%2801%29.jpg/330px-Samosas%2C_snack_food_at_Wikipedia%27s_16th_Birthday_celebration_in_Chittagong_%2801%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Aloo_Tikki_served_with_chutneys.jpg/330px-Aloo_Tikki_served_with_chutneys.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/JalebiIndia.jpg/330px-JalebiIndia.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Pani_Puri1.JPG/330px-Pani_Puri1.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/330px-Salt_lassi.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(["./", "./index.html"]);
    // fotos das comidas (de outro site): guarda o que conseguir, sem travar a instalação
    await Promise.all(FOTOS.map(u => fetch(new Request(u, { mode: "no-cors" })).then(r => c.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // a página do roteiro: tenta a versão nova; sem sinal, usa a guardada
  if (req.mode === "navigate" || (url.origin === location.origin && url.pathname.endsWith(".html"))) {
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        const c = await caches.open(CACHE);
        c.put("./index.html", r.clone());
        return r;
      } catch (_) {
        return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }
  // fotos e demais arquivos: usa o guardado e, se não tiver, busca e guarda
  if (url.origin === location.origin || url.hostname === "upload.wikimedia.org") {
    e.respondWith((async () => {
      const hit = await caches.match(req.url);
      if (hit) return hit;
      try {
        const r = await fetch(url.hostname === "upload.wikimedia.org" ? new Request(req.url, { mode: "no-cors" }) : req);
        (await caches.open(CACHE)).put(req.url, r.clone());
        return r;
      } catch (_) { return Response.error(); }
    })());
  }
});
