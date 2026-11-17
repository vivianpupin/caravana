// A cada 15 minutos: se chegou a hora de uma carta da líder, avisa a caravana no celular (uma vez por carta).
// No dia do translado, avisa também que o passaporte está completo.
import { db, chaves, enviarTodos, enviarPara, DIA_COMPLETO, avisarPassaporteCompleto } from "../lib/push.mjs";

export const config = { schedule: "*/15 * * * *" };

export default async () => {
  if (!process.env.FIREBASE_SA) return new Response("sem FIREBASE_SA", { status: 503 });
  const d = db(), agora = Date.now();
  const pronta = s => { const c = s.data(); return !c.rascunho && c.envio && c.envio <= agora && !c.avisada; };
  let k = null, enviados = 0;
  // dia do translado: passaporte completo (uma vez só, até dois dias depois do horário)
  if (agora >= DIA_COMPLETO && agora - DIA_COMPLETO < 2 * 24 * 3600 * 1000) { k = await chaves(d); enviados += await avisarPassaporteCompleto(d, k); }
  enviados += await avisaChegadas(d, async () => k || (k = await chaves(d))).catch(() => 0);
  enviados += await avisaPomboFinal(d, agora, async () => k || (k = await chaves(d))).catch(() => 0);
  const cs = [...(await d.collection("cartas").get()).docs.filter(pronta), ...(await d.collection("cartasPessoais").get()).docs.filter(pronta)];
  if (!cs.length) return new Response(enviados ? "enviados: " + enviados : "nada");
  for (const s of cs) {
    const c = s.data();
    await s.ref.update({ avisada: true });
    // carta antiga (mais de 2 horas) só é marcada, sem aviso atrasado
    if (agora - c.envio > 2 * 3600 * 1000) continue;
    k = k || await chaves(d);
    enviados += c.para
      ? await enviarPara(d, k, c.para, { title: c.audio && c.audio.partes ? "🕊️ Um pombo-correio chegou do Oriente só para você" : "💌 Chegou uma carta só para você", body: c.titulo || (c.audio && c.audio.partes ? "Toque para ouvir." : "Abra o app para ler."), tag: "carta-" + s.id, url: "./?aba=travessia&carta=" + s.id }, 24 * 3600)
      : await enviarTodos(d, k, { title: c.audio && c.audio.partes ? "🕊️ Um pombo-correio chegou do Oriente" : "💌 Chegou uma carta da líder", body: c.titulo || (c.audio && c.audio.partes ? "Toque para ouvir." : "Abra o app para ler."), tag: "carta-" + s.id, url: "./?aba=travessia&carta=" + s.id }, null, 24 * 3600);
  }
  return new Response("enviados: " + enviados);
};

// Saudações do Oriente: quem chegou na Índia (o app marca chegouIndia quando o GPS mostra a pessoa lá).
// Junta quem chegou junto num aviso só: espera 10 minutos depois da primeira chegada para os outros do mesmo voo entrarem.
async function avisaChegadas(d, pegaChaves) {
  const snap = await d.collection("viajantes").where("chegouIndia", ">", 0).get();
  const agora = Date.now(), novos = snap.docs.filter(s => !s.data().chegadaAvisada);
  if (!novos.length) return 0;
  // chegada antiga (mais de 12 horas): só marca, sem aviso atrasado
  const velhos = novos.filter(s => agora - s.data().chegouIndia > 12 * 3600 * 1000), frescos = novos.filter(s => !velhos.includes(s));
  for (const s of velhos) await s.ref.update({ chegadaAvisada: true });
  if (!frescos.length || agora - Math.min(...frescos.map(s => s.data().chegouIndia)) < 10 * 60 * 1000) return 0;
  for (const s of frescos) await s.ref.update({ chegadaAvisada: true });
  const nomes = frescos.map(s => String(s.data().nome || "").trim().split(/\s+/)[0]).filter(Boolean);
  if (!nomes.length) return 0;
  const lista = nomes.length === 1 ? nomes[0] : nomes.length <= 4 ? nomes.slice(0, -1).join(", ") + " e " + nomes.at(-1) : nomes.slice(0, 3).join(", ") + " e mais " + (nomes.length - 3);
  const body = lista + (nomes.length === 1 ? " chegou" : " chegaram") + " na Índia!";
  return enviarTodos(d, await pegaChaves(), { title: "Saudações do Oriente 🇮🇳", body, tag: "chegada-" + agora, url: "./?aba=mapa" }, null, 6 * 3600);
}

// O último pombo-correio da travessia (a avaliação): no dia seguinte ao fim da viagem, um aviso no celular de cada viajante
// que ainda não respondeu; três dias depois, um lembrete só para quem ainda não respondeu. Cada aviso vai uma vez só
// (fica marcado em cartas/_avaliacao, o mesmo documento do link do Google).
const POMBO_FINAL = DIA_COMPLETO + 30 * 3600 * 1000, LEMBRETE = POMBO_FINAL + 3 * 24 * 3600 * 1000;
async function avisaPomboFinal(d, agora, pegaChaves) {
  if (agora < POMBO_FINAL || agora - POMBO_FINAL > 10 * 24 * 3600 * 1000) return 0;
  const ref = d.doc("cartas/_avaliacao"), cfg = (await ref.get()).data() || {};
  const qual = !cfg.pomboAvisado ? "chegou" : agora >= LEMBRETE && !cfg.pomboLembrete ? "lembrete" : null;
  if (!qual) return 0;
  await ref.set(qual === "chegou" ? { pomboAvisado: agora, rascunho: true } : { pomboLembrete: agora, rascunho: true }, { merge: true });
  const [vs, ds] = await Promise.all([d.collection("viajantes").get(), d.collection("diarios").get()]);
  const responderam = new Set(ds.docs.filter(x => (x.data().avaliacao || {}).estrelas).map(x => x.id));
  const k = await pegaChaves(); let n = 0;
  const carga = qual === "chegou"
    ? { title: "🕊️ O último pombo-correio da travessia chegou", body: "Uma carta de volta para a Caravana está esperando por você.", tag: "pombo-final", url: "./?aba=travessia&aval=1" }
    : { title: "🕊️ O último pombo-correio ainda está esperando", body: "Conte como foi a sua travessia. Leva poucos minutos.", tag: "pombo-final", url: "./?aba=travessia&aval=1" };
  // guarda para quem o aviso chegou a ir (a líder vê no cartão "Avaliações da travessia")
  const foi = {};
  for (const v of vs.docs) { if (v.data().lider || responderam.has(v.id)) continue; const m = await enviarPara(d, k, v.id, carga, 3 * 24 * 3600).catch(() => 0); if (m) foi[v.id] = agora; n += m; }
  if (Object.keys(foi).length) await ref.set({ avisados: foi }, { merge: true });
  return n;
}
