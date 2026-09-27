// Notificações no celular: quando alguém manda mensagem no chat, avisa todo mundo que ativou as notificações.
// Precisa da variável FIREBASE_SA no Netlify (a chave da conta de serviço do Firebase, colada lá, nunca no código).
import admin from "firebase-admin";
import webpush from "web-push";

const SITE = "https://caravanaindiaapp.netlify.app";
let banco = null;
function db() {
  if (!banco) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA)) });
    banco = admin.firestore();
  }
  return banco;
}
// o par de chaves das notificações é criado uma vez e fica guardado num documento que o app não consegue ler
async function chaves(d) {
  const ref = d.doc("segredos/vapid"), s = await ref.get();
  if (s.exists) return s.data();
  const k = webpush.generateVAPIDKeys();
  await ref.set(k);
  return k;
}
const resumo = m => m.tipo === "foto" ? "📷 Mandou uma foto" + (m.texto ? ": " + m.texto : "")
  : m.tipo === "local" ? "📍 Ponto de encontro: " + (m.nome || "local marcado")
  : m.tipo === "aovivo" ? "📍 Está compartilhando a localização ao vivo"
  : String(m.texto || "");

export default async req => {
  if (!process.env.FIREBASE_SA) return Response.json({ ok: false, erro: "sem FIREBASE_SA" }, { status: 503 });
  const d = db(), k = await chaves(d);
  if (req.method === "GET") return Response.json({ publicKey: k.publicKey });
  const { id } = await req.json().catch(() => ({}));
  if (!id || typeof id !== "string" || id.includes("/")) return Response.json({ ok: false }, { status: 400 });
  // só avisa uma vez por mensagem, e só se ela acabou de ser enviada
  const ref = d.doc("chat/" + id);
  const m = await d.runTransaction(async t => {
    const s = await t.get(ref);
    if (!s.exists) return null;
    const x = s.data();
    if (x.avisado || Date.now() - (x.ts || 0) > 5 * 60 * 1000) return null;
    t.update(ref, { avisado: true });
    return x;
  });
  if (!m) return Response.json({ ok: false });
  const v = await d.doc("viajantes/" + m.autor).get();
  const nome = String((v.exists && v.data().nome) || "Caravana").trim().split(/\s+/)[0];
  const texto = resumo(m);
  const carga = JSON.stringify({ title: nome + " · Caravana do Céu", body: texto.length > 140 ? texto.slice(0, 137) + "…" : texto, tag: "chat", url: "./?aba=conversa" });
  webpush.setVapidDetails(SITE, k.publicKey, k.privateKey);
  const subs = await d.collection("push").get();
  let enviados = 0;
  await Promise.all(subs.docs.filter(s => s.id !== m.autor && s.data().sub).map(async s => {
    try { await webpush.sendNotification(s.data().sub, carga, { TTL: 6 * 3600 }); enviados++; }
    catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await s.ref.delete().catch(() => {}); }
  }));
  return Response.json({ ok: true, enviados });
};
