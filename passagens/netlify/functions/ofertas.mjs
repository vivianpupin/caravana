// Busca as passagens mais baratas no Travelpayouts (dados da Aviasales).
// Precisa da variável TRAVELPAYOUTS_TOKEN no Netlify (a chave da conta, colada lá, nunca no código).
// Sem a chave, devolve preços de exemplo para dar para ver o app funcionando.
// ?tipo=destinos&origem=SAO&ida=2026-11[&volta=2026-11][&soida=1][&direto=1] → destinos mais baratos
// ?tipo=calendario&origem=SAO&destino=LIS&ida=2026-11[&soida=1][&direto=1] → preço mais baixo de cada dia do mês
import { CIDADES } from "../../app/cidades.js";

const API = "https://api.travelpayouts.com/aviasales/v3/";
const DATA = /^\d{4}-\d{2}(-\d{2})?$/, IATA = /^[A-Z]{3}$/;

export default async req => {
  const p = new URL(req.url).searchParams;
  const tipo = p.get("tipo"), origem = (p.get("origem") || "").toUpperCase(), destino = (p.get("destino") || "").toUpperCase();
  const ida = p.get("ida") || "", volta = p.get("volta") || "", soIda = p.get("soida") === "1", direto = p.get("direto") === "1";
  if (!IATA.test(origem) || !DATA.test(ida) || (volta && !DATA.test(volta)) || (tipo === "calendario" && !IATA.test(destino)))
    return Response.json({ ok: false, erro: "Pedido incompleto" }, { status: 400 });
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  try {
    const voos = tipo === "calendario"
      ? (token ? await calendario(token, origem, destino, ida, soIda, direto) : exemploCalendario(origem, destino, ida, soIda, direto))
      : (token ? await destinos(token, origem, ida, volta, soIda, direto) : exemploDestinos(origem, ida, volta, soIda, direto));
    return Response.json({ ok: true, exemplo: !token, voos: voos.map(v => ({ ...v, link: comprar(v.link) })) },
      { headers: { "Cache-Control": "public, max-age=600" } });
  } catch (e) {
    return Response.json({ ok: false, erro: "Não consegui buscar os preços agora. Tente de novo em instantes." }, { status: 502 });
  }
};

async function pedir(token, caminho, q) {
  const r = await fetch(API + caminho + "?" + new URLSearchParams({ currency: "brl", market: "br", ...q }), {
    headers: { "X-Access-Token": token, "Accept-Encoding": "gzip, deflate" }
  });
  const j = await r.json();
  if (!r.ok || j.success === false) throw new Error(j.error || r.status);
  return j.data;
}

// um voo por destino, do mais barato para o mais caro
async function destinos(token, origem, ida, volta, soIda, direto) {
  const q = { origin: origem, departure_at: ida, unique: "true", sorting: "price", limit: "100", one_way: String(soIda), direct: String(direto) };
  if (volta && !soIda) q.return_at = volta;
  return (await pedir(token, "prices_for_dates", q)).map(voo);
}

// o voo mais barato de cada dia de ida no mês
async function calendario(token, origem, destino, ida, soIda, direto) {
  const q = { origin: origem, destination: destino, departure_at: ida.slice(0, 7), group_by: "departure_at", direct: String(direto) };
  if (soIda) q.one_way = "true";
  const d = await pedir(token, "grouped_prices", q);
  return Object.values(d || {}).map(voo).sort((a, b) => a.ida.localeCompare(b.ida));
}

const voo = v => ({
  origem: v.origin, destino: v.destination, preco: Math.round(v.price), cia: v.airline || "",
  ida: v.departure_at || "", volta: v.return_at || "", paradas: v.transfers ?? 0, paradasVolta: v.return_transfers ?? 0,
  minutos: v.duration_to || v.duration || 0, link: v.link || ""
});

function comprar(link) {
  if (!link) return "";
  const u = new URL(link, "https://www.aviasales.com");
  if (process.env.TRAVELPAYOUTS_MARKER) u.searchParams.set("marker", process.env.TRAVELPAYOUTS_MARKER);
  return u.href;
}

// ---------- preços de exemplo (só enquanto não houver a chave) ----------
const CIAS = ["LA", "G3", "AD", "TP", "AF", "KL", "IB", "AA", "CM", "AR", "EK", "TK"];
function sorte(texto) { let h = 2166136261; for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296); }
const dia = (mes, d) => mes.length > 7 ? mes : mes + "-" + String(d).padStart(2, "0");
const somaDias = (data, n) => { const d = new Date(data + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

function exemploVoo(origem, destino, data, soIda, direto, r, volta) {
  const c = CIDADES[destino], longe = c.pais === "BR" ? 1 : ["AR", "UY", "CL", "PY", "BO", "PE", "CO"].includes(c.pais) ? 2.4 : 5.5;
  const paradas = direto ? 0 : Math.floor(r() * (longe > 3 ? 3 : 2));
  const preco = Math.round((longe * 380 + r() * longe * 520) * (soIda ? .62 : 1) * (direto ? 1.25 : 1) / 10) * 10 - 1;
  const ida = data + "T" + String(6 + Math.floor(r() * 16)).padStart(2, "0") + ":" + ["05", "20", "40", "55"][Math.floor(r() * 4)] + ":00-03:00";
  const v = soIda ? "" : (volta || somaDias(data, 4 + Math.floor(r() * 10))) + "T18:30:00-03:00";
  return { origem, destino, preco, cia: c.pais === "BR" ? CIAS[Math.floor(r() * 3)] : CIAS[3 + Math.floor(r() * 9)], ida, volta: v,
    paradas, paradasVolta: paradas, minutos: Math.round(longe * 110 + paradas * 150 + r() * 90),
    link: `/search/${origem}${data.slice(8, 10)}${data.slice(5, 7)}${destino}${v ? v.slice(8, 10) + v.slice(5, 7) : ""}1` };
}

// o dia mais barato do calendário de exemplo, para a lista e o calendário mostrarem o mesmo preço
function exemploDestinos(origem, ida, volta, soIda, direto) {
  return Object.keys(CIDADES).filter(d => d !== origem).map(d => {
    if (ida.length > 7) return exemploVoo(origem, d, ida, soIda, direto, sorte(origem + d + ida + volta), volta);
    return exemploCalendario(origem, d, ida, soIda, direto).sort((a, b) => a.preco - b.preco)[0];
  }).sort((a, b) => a.preco - b.preco);
}

function exemploCalendario(origem, destino, ida, soIda, direto) {
  const mes = ida.slice(0, 7), dias = new Date(+mes.slice(0, 4), +mes.slice(5, 7), 0).getDate();
  return Array.from({ length: dias }, (_, i) => exemploVoo(origem, destino, dia(mes, i + 1), soIda, direto, sorte(origem + destino + mes + i)));
}
