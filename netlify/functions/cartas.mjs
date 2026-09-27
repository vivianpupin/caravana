// A cada 15 minutos: se chegou a hora de uma carta da líder, avisa a caravana no celular (uma vez por carta).
import { db, chaves, enviarTodos } from "../lib/push.mjs";

export const config = { schedule: "*/15 * * * *" };

export default async () => {
  if (!process.env.FIREBASE_SA) return new Response("sem FIREBASE_SA", { status: 503 });
  const d = db(), agora = Date.now();
  const cs = (await d.collection("cartas").get()).docs.filter(s => {
    const c = s.data();
    return !c.rascunho && c.envio && c.envio <= agora && !c.avisada;
  });
  if (!cs.length) return new Response("nada");
  let k = null, enviados = 0;
  for (const s of cs) {
    const c = s.data();
    await s.ref.update({ avisada: true });
    // carta antiga (mais de 2 horas) só é marcada, sem aviso atrasado
    if (agora - c.envio > 2 * 3600 * 1000) continue;
    k = k || await chaves(d);
    enviados += await enviarTodos(d, k, { title: "💌 Chegou uma carta da líder", body: c.titulo || "Abra o app para ler.", tag: "carta-" + s.id, url: "./?aba=travessia" }, null, 24 * 3600);
  }
  return new Response("enviados: " + enviados);
};
