// Entrada no app: confere a palavra da caravana antes de criar a conta e destrava quem ficou preso.
// A senha de cada conta é "caravana-" + a palavra; se a pessoa entrou a primeira vez com a palavra errada
// (erro de digitação, corretor, acento, palavra antiga), a conta ficava presa. Com a palavra certa, a senha é refeita.
// Precisa da variável FIREBASE_SA no Netlify (a mesma das notificações).
import admin from "firebase-admin";
import { db } from "../lib/push.mjs";

const norm = s => String(s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default async req => {
  if (!process.env.FIREBASE_SA) return Response.json({ ok: false, erro: "sem FIREBASE_SA" }, { status: 503 });
  if (req.method !== "POST") return Response.json({ ok: false }, { status: 405 });
  const { email, palavra } = await req.json().catch(() => ({}));
  const em = String(email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em) || !palavra) return Response.json({ ok: false }, { status: 400 });
  const d = db(), ac = await d.doc("privado/acesso").get(), certa = ac.exists ? String(ac.data().palavra || "") : "";
  // palavra errada: não cria nem mexe em conta nenhuma
  if (!certa || norm(palavra) !== norm(certa)) return Response.json({ ok: false, errada: true });
  let u = null;
  try { u = await admin.auth().getUserByEmail(em); } catch (e) { if (e.code !== "auth/user-not-found") throw e; }
  if (!u) return Response.json({ ok: true, nova: true, palavra: certa });
  // conta da líder (entra pelo Google): não mexe
  if (!u.providerData.some(p => p.providerId === "password")) return Response.json({ ok: false, google: true });
  await admin.auth().updateUser(u.uid, { password: "caravana-" + certa });
  return Response.json({ ok: true, palavra: certa });
};
