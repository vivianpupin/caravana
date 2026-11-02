// Código comum das notificações (usado pelas funções do Netlify)
import admin from "firebase-admin";
import webpush from "web-push";

export const SITE = "https://caravanaindiaapp.netlify.app";
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
export const DIA_COMPLETO = Date.parse("2026-11-16T08:00:00+05:30");
export async function avisarPassaporteCompleto(d, k) {
  const ref = d.doc("segredos/passaporteCompleto");
  const vai = await d.runTransaction(async t => { const s = await t.get(ref); if (s.exists) return false; t.set(ref, { ts: Date.now() }); return true; });
  if (!vai) return 0;
  return enviarTodos(d, k, { title: "🎬 Seu passaporte está completo!", body: "A travessia se completou. O vídeo do seu passaporte está pronto: abra para assistir e salvar no celular.", tag: "passaporte-completo", url: "./?aba=passaporte" }, null, 24 * 3600);
}
