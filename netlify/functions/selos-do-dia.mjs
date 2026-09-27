// Todo dia às 6h da Índia: se hoje tem selo novo no roteiro, avisa a caravana no celular.
import { SITE, db, chaves, enviarTodos } from "../lib/push.mjs";
export const config = { schedule: "30 0 * * *" }; // 00:30 UTC = 06:00 na Índia

export default async () => {
  if (!process.env.FIREBASE_SA) return new Response("sem FIREBASE_SA", { status: 503 });
  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [rot, lista] = await Promise.all([fetch(SITE + "/dados/travessia.json").then(r => r.json()), fetch(SITE + "/dados/selos.json").then(r => r.json())]);
  const dia = (rot.dias || []).find(x => x.iso === hoje);
  if (!dia) return new Response("hoje não é dia de viagem");
  const d = db();
  // o que a líder mudou no banco (nome, dia) vale mais que a lista do site
  const banco = {};
  (await d.collection("locais").get()).docs.forEach(s => { banco[s.id] = s.data(); });
  const selos = lista.selos.filter(x => !lista.removidos.includes(x.id)).map(x => ({ ...x, ...(banco[x.id] || {}) })).filter(x => x.dia === dia.n);
  if (!selos.length) return new Response("sem selo hoje");
  const marca = d.doc("segredos/selos-" + hoje);
  if ((await marca.get()).exists) return new Response("já avisado");
  await marca.set({ ts: Date.now() });
  const nomes = selos.map(x => x.nome);
  const k = await chaves(d);
  const enviados = await enviarTodos(d, k, {
    title: selos.length > 1 ? "🏅 Selos novos hoje" : "🏅 Selo novo hoje",
    body: nomes.join(" · ") + ". A líder dá a palavra no lugar para você carimbar o passaporte.",
    tag: "selos-" + hoje, url: "./?aba=passaporte"
  }, null, 12 * 3600);
  return new Response("enviados: " + enviados);
};
