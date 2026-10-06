// Notificações no celular: quando alguém manda mensagem no chat, avisa todo mundo que ativou as notificações.
// Precisa da variável FIREBASE_SA no Netlify (a chave da conta de serviço do Firebase, colada lá, nunca no código).
import { avisarPassaporteCompleto, db, chaves, enviarTodos, enviarPara } from "../lib/push.mjs";

const resumo = m => m.tipo === "foto" ? "📷 Mandou uma foto" + (m.texto ? ": " + m.texto : "")
  : m.tipo === "local" ? "📍 Ponto de encontro: " + (m.nome || "local marcado")
  : m.tipo === "aovivo" ? "📍 Está compartilhando a localização ao vivo"
  : String(m.texto || "").replace(/:(surya|ganesha|shiva|krishna|hanuman|lakshmi|durga|kali|parvati|saraswati|vishnu|ganga):/g, (_, d) => "[" + d[0].toUpperCase() + d.slice(1) + "]")
    .replace(/:(amor|preocupada|emocionada|susto|revira|beijo|triste|desdem|sorrisolagrima|rindo|decepcionada|oculos|brava|explodiu|vergonha):/g, (_, e) => EMOJI[e])
    .replace(/:(diya|chai|vaca|macaco|simbolo):/g, (_, e) => ({ diya: "🪔", chai: "☕", vaca: "🐄", macaco: "🐒", simbolo: "✦" })[e]);
const EMOJI = { amor: "🥰", preocupada: "😟", emocionada: "🥹", susto: "😱", revira: "🙄", beijo: "😙", triste: "🙁", desdem: "😒", sorrisolagrima: "🥲", rindo: "😂", decepcionada: "😞", oculos: "😎", brava: "😡", explodiu: "🤯", vergonha: "😳" };

export default async req => {
  if (!process.env.FIREBASE_SA) return Response.json({ ok: false, erro: "sem FIREBASE_SA" }, { status: 503 });
  const d = db(), k = await chaves(d);
  if (req.method === "GET") return Response.json({ publicKey: k.publicKey });
  const corpo = await req.json().catch(() => ({}));
  if (corpo.selo) return avisarSelo(d, k, corpo.selo);
  if (corpo.habilidade) return avisarHabilidade(d, k, corpo.habilidade, corpo.para);
  if (corpo.pombo) return avisarPombo(d, k, corpo.pombo);
  if (corpo.reacao) return avisarReacao(d, k, corpo.reacao);
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
  // o último selo completa o passaporte e libera o vídeo (mesmo aviso do dia do translado, uma vez só)
  const enviados = selo === "travessia" ? await avisarPassaporteCompleto(d, k)
    : await enviarTodos(d, k, { title: "🏅 Selo novo no seu passaporte!", body: (l.nome || "Selo novo") + ". Abra o passaporte para ver.", tag: "selo-" + selo, url: "./?aba=passaporte" }, null, 24 * 3600);
  return Response.json({ ok: true, enviados });
}

// a líder deu uma habilidade: avisa cada pessoa que acabou de ganhar (uma vez só por habilidade; o nome fica em segredo até ela abrir)
async function avisarHabilidade(d, k, id, para) {
  if (typeof id !== "string" || id.includes("/") || !Array.isArray(para)) return Response.json({ ok: false }, { status: 400 });
  let enviados = 0;
  for (const uid of para.slice(0, 200)) {
    if (typeof uid !== "string" || uid.includes("/")) continue;
    const ref = d.doc("viajantes/" + uid);
    const vai = await d.runTransaction(async t => {
      const s = await t.get(ref); if (!s.exists) return false;
      const v = s.data(), ts = (v.habilidades || {})[id];
      if (!ts || Date.now() - ts > 10 * 60 * 1000 || (v.habAvisadas || {})[id]) return false;
      t.update(ref, { ["habAvisadas." + id]: true }); return true;
    });
    if (vai) enviados += await enviarPara(d, k, uid, { title: "✨ Nova habilidade desbloqueada!", body: "Abra o app da Caravana para ver qual é e fazer a sua foto.", tag: "hab-" + id, url: "./?aba=passaporte" }, 24 * 3600);
  }
  return Response.json({ ok: true, enviados });
}

// pombo-correio: avisa só quem recebeu a cartinha (uma vez, e só se ela acabou de ser enviada)
async function avisarPombo(d, k, id) {
  if (typeof id !== "string" || id.includes("/")) return Response.json({ ok: false }, { status: 400 });
  const ref = d.doc("pombos/" + id);
  const m = await d.runTransaction(async t => {
    const s = await t.get(ref); if (!s.exists) return null;
    const x = s.data(); if (x.avisado || Date.now() - (x.ts || 0) > 5 * 60 * 1000) return null;
    t.update(ref, { avisado: true }); return x;
  });
  if (!m || typeof m.para !== "string") return Response.json({ ok: false });
  const v = await d.doc("viajantes/" + m.autor).get();
  const nome = String((v.exists && v.data().nome) || "Alguém da caravana").trim().split(/\s+/)[0];
  const enviados = await enviarPara(d, k, m.para, { title: "🕊️ Chegou um pombo-correio!", body: nome + (m.presente ? " te mandou uma cartinha e um presente." : " te mandou uma cartinha."), tag: "pombo-" + id, url: "./?aba=pombo" }, 24 * 3600);
  return Response.json({ ok: true, enviados });
}

// reação mandada pelo mapa: avisa só a pessoa que recebeu (uma vez, e só se acabou de ser enviada)
const REACOES = { oi: "👋 Oi!", namaste: "🙏 Namaste", amor: "❤️ Amor", chai: "☕ Bora um chai?", vem: "📍 Vem cá!", uau: "✨ Uau!", risada: "😂 Haha", espera: "⏳ Me espera!" };
async function avisarReacao(d, k, id) {
  if (typeof id !== "string" || id.includes("/")) return Response.json({ ok: false }, { status: 400 });
  const ref = d.doc("reacoes/" + id);
  const m = await d.runTransaction(async t => {
    const s = await t.get(ref); if (!s.exists) return null;
    const x = s.data(); if (x.avisado || Date.now() - (x.ts || 0) > 5 * 60 * 1000) return null;
    t.update(ref, { avisado: true }); return x;
  });
  const r = m && m.data;
  if (!r || typeof r.para !== "string" || r.para.includes("/") || r.para === m.by) return Response.json({ ok: false });
  const v = await d.doc("viajantes/" + m.by).get();
  const nome = String((v.exists && v.data().nome) || "Alguém da caravana").trim().split(/\s+/)[0];
  const texto = r.r === "fala" ? String(r.texto || "").slice(0, 80) : REACOES[r.r] || "👋";
  const enviados = await enviarPara(d, k, r.para, { title: nome + " · Caravana do Céu", body: texto, tag: "reacao-" + id, url: "./?aba=mapa" }, 3600);
  return Response.json({ ok: true, enviados });
}
