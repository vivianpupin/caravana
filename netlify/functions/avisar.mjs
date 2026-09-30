// Notificações no celular: quando alguém manda mensagem no chat, avisa todo mundo que ativou as notificações.
// Precisa da variável FIREBASE_SA no Netlify (a chave da conta de serviço do Firebase, colada lá, nunca no código).
import { db, chaves, enviarTodos } from "../lib/push.mjs";

const resumo = m => m.tipo === "foto" ? "📷 Mandou uma foto" + (m.texto ? ": " + m.texto : "")
  : m.tipo === "local" ? "📍 Ponto de encontro: " + (m.nome || "local marcado")
  : m.tipo === "aovivo" ? "📍 Está compartilhando a localização ao vivo"
  : String(m.texto || "");

export default async req => {
  if (!process.env.FIREBASE_SA) return Response.json({ ok: false, erro: "sem FIREBASE_SA" }, { status: 503 });
  const d = db(), k = await chaves(d);
  if (req.method === "GET") return Response.json({ publicKey: k.publicKey });
  const corpo = await req.json().catch(() => ({}));
  if (corpo.selo) return avisarSelo(d, k, corpo.selo);
  const { id } = corpo;
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
  const texto = resumo(m), curto = texto.length > 140 ? texto.slice(0, 137) + "…" : texto;
  // aviso da líder: só vale se quem mandou é mesmo a líder
  const aviso = m.tipo === "aviso" && v.exists && v.data().lider === true;
  const carga = aviso
    ? { title: "📢 Aviso da líder", body: String(m.texto || "").slice(0, 300), tag: "aviso-" + id, url: "./?aba=conversa", requireInteraction: true }
    : { title: nome + " · Caravana do Céu", body: curto, tag: "chat", url: "./?aba=conversa" };
  const enviados = await enviarTodos(d, k, carga, m.autor, aviso ? 24 * 3600 : 6 * 3600);
  return Response.json({ ok: true, enviados });
};

// a líder liberou um selo para todos: avisa uma vez só
async function avisarSelo(d, k, selo) {
  if (typeof selo !== "string" || selo.includes("/")) return Response.json({ ok: false }, { status: 400 });
  const ref = d.doc("locais/" + selo);
  const l = await d.runTransaction(async t => {
    const s = await t.get(ref);
    if (!s.exists) return null;
    const x = s.data();
    if (!x.aberto || x.avisadoAberto) return null;
    t.update(ref, { avisadoAberto: true });
    return x;
  });
  if (!l) return Response.json({ ok: false });
  // o último selo completa o passaporte e libera o vídeo
  const msg = selo === "travessia"
    ? { title: "🎬 Seu passaporte está completo!", body: "O vídeo do seu passaporte da travessia está pronto. Abra para assistir e salvar no celular.", tag: "selo-" + selo, url: "./?aba=passaporte" }
    : { title: "🏅 Selo novo no seu passaporte!", body: (l.nome || "Selo novo") + ". Abra o passaporte para ver.", tag: "selo-" + selo, url: "./?aba=passaporte" };
  const enviados = await enviarTodos(d, k, msg, null, 24 * 3600);
  return Response.json({ ok: true, enviados });
}
