// Código comum das notificações (usado pelas funções do Netlify)
import admin from "firebase-admin";
import webpush from "web-push";

export const SITE = "https://caravanaindiaturma2.netlify.app";
let banco = null;
export function db() {
  if (!banco) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA)) });
    banco = admin.firestore();
  }
  return banco;
}
// o par de chaves das notificações é criado uma vez e fica guardado num documento que o app não consegue ler
export async function chaves(d) {
  const ref = d.doc("segredos/vapid"), s = await ref.get();
  if (s.exists) return s.data();
  const k = webpush.generateVAPIDKeys();
  await ref.set(k);
  return k;
}
// manda para todos os celulares inscritos (menos quem causou o aviso) e limpa inscrições vencidas
export async function enviarTodos(d, k, carga, exceto, ttl) {
  webpush.setVapidDetails(SITE, k.publicKey, k.privateKey);
  const subs = await d.collection("push").get(), txt = JSON.stringify(carga);
  let enviados = 0;
  await Promise.all(subs.docs.filter(s => s.id !== exceto && s.data().sub).map(async s => {
    try { await webpush.sendNotification(s.data().sub, txt, { TTL: ttl || 6 * 3600 }); enviados++; }
    catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await s.ref.delete().catch(() => {}); }
  }));
  return enviados;
}


// manda só para uma pessoa (carta pessoal)
export async function enviarPara(d, k, uid, carga, ttl) {
  webpush.setVapidDetails(SITE, k.publicKey, k.privateKey);
  const s = await d.doc("push/" + uid).get();
  if (!s.exists || !s.data().sub) return 0;
  try { await webpush.sendNotification(s.data().sub, JSON.stringify(carga), { TTL: ttl || 24 * 3600 }); return 1; }
  catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await s.ref.delete().catch(() => {}); return 0; }
}

// último dia (translado): o passaporte fica completo e o vídeo é liberado. Avisa todo mundo uma vez só,
// seja pelo horário marcado, seja quando a líder abre o último selo antes disso.
export const DIA_COMPLETO = Date.parse("2026-11-30T08:00:00+05:30");
export async function avisarPassaporteCompleto(d, k) {
  const ref = d.doc("segredos/passaporteCompleto");
  const vai = await d.runTransaction(async t => { const s = await t.get(ref); if (s.exists) return false; t.set(ref, { ts: Date.now() }); return true; });
  if (!vai) return 0;
  return enviarTodos(d, k, { title: "🎬 Seu passaporte está completo!", body: "A travessia se completou. O vídeo do seu passaporte está pronto: abra para assistir e salvar no celular.", tag: "passaporte-completo", url: "./?aba=passaporte" }, null, 24 * 3600);
}

// Saudações do Oriente: quem chegou na Índia (o app marca chegouIndia quando o GPS mostra a pessoa lá).
// Junta quem chegou junto num aviso só: espera 10 minutos depois da primeira chegada para os outros do mesmo voo entrarem.
export async function avisaChegadas(d, pegaChaves, agoraMesmo) {
  const snap = await d.collection("viajantes").where("chegouIndia", ">", 0).get();
  const agora = Date.now(), novos = snap.docs.filter(s => !s.data().chegadaAvisada);
  if (!novos.length) return 0;
  // chegada antiga (mais de 12 horas): só marca, sem aviso atrasado
  const velhos = novos.filter(s => agora - s.data().chegouIndia > 12 * 3600 * 1000), frescos = novos.filter(s => !velhos.includes(s));
  for (const s of velhos) await s.ref.update({ chegadaAvisada: true });
  // agoraMesmo: a líder mandou avisar já (sem esperar os 10 minutos)
  if (!frescos.length || (!agoraMesmo && agora - Math.min(...frescos.map(s => s.data().chegouIndia)) < 10 * 60 * 1000)) return 0;
  for (const s of frescos) await s.ref.update({ chegadaAvisada: true });
  const nomes = frescos.map(s => String(s.data().nome || "").trim().split(/\s+/)[0]).filter(Boolean);
  if (!nomes.length) return 0;
  const lista = nomes.length === 1 ? nomes[0] : nomes.length <= 4 ? nomes.slice(0, -1).join(", ") + " e " + nomes.at(-1) : nomes.slice(0, 3).join(", ") + " e mais " + (nomes.length - 3);
  const body = lista + (nomes.length === 1 ? " chegou" : " chegaram") + " na Índia!";
  return enviarTodos(d, await pegaChaves(), { title: "Saudações do Oriente 🇮🇳", body, tag: "chegada-" + agora, url: "./?aba=mapa" }, null, 6 * 3600);
}

// teste da líder: manda um aviso só para o celular dela e devolve o que aconteceu (para achar onde as notificações travam)
export async function testaPush(d, k, uid) {
  webpush.setVapidDetails(SITE, k.publicKey, k.privateKey);
  const todos = await d.collection("push").get(), s = await d.doc("push/" + uid).get();
  const base = { celularesComAvisos: todos.docs.filter(x => x.data().sub).length };
  if (!s.exists || !s.data().sub) return { ...base, ok: false, erro: "Este celular não está inscrito para receber avisos (toque em Ativar avisos no Chat, com o app instalado na tela de início)." };
  try { await webpush.sendNotification(s.data().sub, JSON.stringify({ title: "🔔 Teste da Caravana", body: "Se você está lendo isto, as notificações estão funcionando.", tag: "teste", url: "./?aba=conversa" }), { TTL: 600 }); return { ...base, ok: true }; }
  catch (e) { return { ...base, ok: false, erro: "O serviço de notificações recusou: " + (e.statusCode || "") + " " + String(e.body || e.message || "").slice(0, 200) }; }
}
