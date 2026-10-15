// Voz do tradutor: busca a fala em hindi, inglês ou português e devolve o áudio (mp3) para o app tocar.
// Passa pelo servidor porque o celular não consegue buscar essa voz direto (o Google recusa pedidos vindos de outro site).
const LINGUAS = { hi: "hi", en: "en", pt: "pt-BR" };

// a voz aceita até ~200 letras por vez: divide o texto em pedaços pelas pausas naturais
function pedacos(t, max = 180) {
  const out = []; let resto = t.trim();
  while (resto.length > max) {
    let corte = Math.max(resto.lastIndexOf("।", max), resto.lastIndexOf(".", max), resto.lastIndexOf(",", max), resto.lastIndexOf("?", max), resto.lastIndexOf("!", max));
    if (corte < max * .4) corte = resto.lastIndexOf(" ", max);
    if (corte <= 0) corte = max;
    out.push(resto.slice(0, corte + 1).trim()); resto = resto.slice(corte + 1).trim();
  }
  if (resto) out.push(resto);
  return out;
}

export default async req => {
  const u = new URL(req.url), t = String(u.searchParams.get("t") || "").slice(0, 600), l = LINGUAS[u.searchParams.get("l")] || "hi";
  const lento = u.searchParams.get("v") === "lento";
  if (!t.trim()) return new Response("sem texto", { status: 400 });
  try {
    const partes = [];
    for (const [i, p] of pedacos(t).entries()) {
      const r = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${l}&ttsspeed=${lento ? .7 : 1}&total=1&idx=${i}&textlen=${p.length}&q=${encodeURIComponent(p)}`,
        { headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" } });
      if (!r.ok) return new Response("voz indisponível", { status: 502 });
      partes.push(new Uint8Array(await r.arrayBuffer()));
    }
    const total = partes.reduce((n, p) => n + p.length, 0), mp3 = new Uint8Array(total); let o = 0;
    for (const p of partes) { mp3.set(p, o); o += p.length; }
    return new Response(mp3, { headers: { "content-type": "audio/mpeg", "cache-control": "public, max-age=2592000" } });
  } catch (e) { return new Response("erro", { status: 502 }); }
};
