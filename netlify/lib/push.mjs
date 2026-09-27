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

