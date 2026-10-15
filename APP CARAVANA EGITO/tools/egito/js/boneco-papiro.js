// ---------- Explorador do Egito em estilo de papiro ----------
// A figura segue o cânone das pinturas egípcias: cabeça de perfil com o olho de frente (e o traço de kohl),
// ombros de frente, pernas de perfil em passo. Cores chapadas com contorno castanho, como nas paredes das tumbas.
const PAPIRO = {
  pele: ["#F1D3AC", "#E2B07C", "#C98A55", "#B5653A", "#8E4B2A", "#5E3220"],
  cabeca: [["peruca", "Peruca curta"], ["cleopatra", "Peruca longa trançada"], ["nemes", "Nemes de faraó"], ["khepresh", "Coroa azul de guerra"], ["dupla", "Coroa dupla"], ["hathor", "Chifres e disco de Hathor"], ["careca", "Cabeça raspada (sacerdote)"], ["fedora", "Chapéu de explorador"], ["safari", "Capacete de safári"]],
  traje: [["saiote", "Saiote de linho"], ["real", "Saiote real dourado"], ["vestido", "Vestido de linho"], ["sacerdote", "Pele de leopardo (sacerdote)"], ["explorador", "Roupa de explorador"]],
  colar: [["usekh", "Colar usekh"], ["ankh", "Pingente ankh"], ["ouro", "Colar de ouro"], ["nenhum", "Nenhum"]],
  item: [["ankh", "Ankh"], ["was", "Cetro was"], ["cajado", "Cajado e mangual"], ["papiro", "Rolo de papiro"], ["paleta", "Paleta de escriba"], ["sistro", "Sistro"], ["lotus", "Lótus"], ["incenso", "Incensário"], ["lanterna", "Lanterna"], ["nenhum", "Nada"]],
  barbaFalsa: [["nao", "Sem barba"], ["sim", "Barba de faraó"]],
  bicho: [["nenhum", "Nenhum"], ["gato", "Gato de Bastet"], ["ibis", "Íbis de Thoth"], ["falcao", "Falcão de Hórus"], ["crocodilo", "Crocodilo de Sobek"], ["naja", "Naja (uraeus)"], ["chacal", "Chacal de Anúbis"], ["escaravelho", "Escaravelho de Khepri"], ["camelo", "Camelo"]],
  cenario: [["piramides", "Pirâmides"], ["nilo", "Nilo e palmeiras"], ["templo", "Templo"], ["sol", "Sol alado"], ["nenhum", "Papiro liso"]],
  personagens: [
    ["cleopatra", "Cleópatra", { cabeca: "cleopatra", traje: "vestido", colar: "usekh", item: "ankh", bicho: "naja", cenario: "nilo", barbaFalsa: "nao" }],
    ["ramses", "Ramsés", { cabeca: "khepresh", traje: "real", colar: "usekh", item: "cajado", bicho: "falcao", cenario: "templo", barbaFalsa: "sim" }],
    ["tutankhamon", "Tutankhamon", { cabeca: "nemes", traje: "real", colar: "usekh", item: "cajado", bicho: "chacal", cenario: "piramides", barbaFalsa: "sim" }],
    ["sacerdote", "Sacerdote de Amon", { cabeca: "careca", traje: "sacerdote", colar: "ouro", item: "incenso", bicho: "naja", cenario: "templo", barbaFalsa: "nao" }],
    ["hathor", "Sacerdotisa de Hathor", { cabeca: "hathor", traje: "vestido", colar: "usekh", item: "sistro", bicho: "gato", cenario: "templo", barbaFalsa: "nao" }],
    ["escriba", "Escriba", { cabeca: "peruca", traje: "saiote", colar: "nenhum", item: "paleta", bicho: "ibis", cenario: "nilo", barbaFalsa: "nao" }],
    ["unificador", "Faraó das Duas Terras", { cabeca: "dupla", traje: "real", colar: "usekh", item: "was", bicho: "crocodilo", cenario: "sol", barbaFalsa: "sim" }],
    ["explorador", "Explorador", { cabeca: "fedora", traje: "explorador", colar: "nenhum", item: "lanterna", bicho: "escaravelho", cenario: "piramides", barbaFalsa: "nao" }]]
};
let _papiroId = 0;
// o que já estava salvo do explorador antigo vira o equivalente egípcio
function bonecoEgito(b) {
  const c = { ...b };
  if (!c.cabeca) c.cabeca = ({ fedora: "fedora", safari: "safari", nemes: "nemes", lenco: "peruca", turbante: "peruca", flores: "cleopatra", sem: "peruca" })[b.chapeu] || "peruca";
  if (!c.traje) c.traje = ({ jaqueta: "explorador", colete: "explorador", terno: "explorador", academia: "explorador", vestido: "vestido", sari: "vestido", sari2: "vestido", cigana: "vestido", kurta: "saiote", yogi: "saiote", monge: "sacerdote" })[b.roupa] || "saiote";
  if (!c.item) c.item = ({ ankh: "ankh", lotus: "lotus", lanterna: "lanterna", mapa: "papiro", diya: "incenso", sino: "sistro" })[b.acessorio2] || ({ sino: "sistro" })[b.acessorio] || "nenhum";
  if (!c.bicho) c.bicho = ({ gato: "gato", camelo: "camelo", cachorro: "chacal" })[b.pet] || "nenhum";
  if (!["usekh", "ankh", "ouro", "nenhum"].includes(c.colar)) c.colar = c.colar === "ankhcolar" ? "ankh" : "nenhum";
  if (!c.barbaFalsa) c.barbaFalsa = "nao";
  if (!c.cenario) c.cenario = "piramides";
  if (!c.pele || !PAPIRO.pele.includes(c.pele)) c.pele = c.pele || PAPIRO.pele[3];
  return c;
}
function desenhaBoneco(b0, comCenario) {
  const b = bonecoEgito(b0), id = "pp" + (++_papiroId);
  const g = h("g", { class: "boneco papiro" });
  const LN = "#5A2E1A", pele = b.pele, peleS = escurece(pele, .8), linho = "#F6F0DE", ouro = "#D9A53A", lapis = "#2F4F8A", verm = "#A3231A", turq = "#3E8F86", preto = "#1E1612";
  const P = (d, fill, extra) => h("path", { d, fill, stroke: LN, "stroke-width": .45, "stroke-linejoin": "round", ...(extra || {}) });
  const L = (d, stroke, w) => h("path", { d, fill: "none", stroke, "stroke-width": w || .5, "stroke-linecap": "round" });
  const mulher = b.traje === "vestido" || ["cleopatra", "hathor"].includes(b.cabeca) && b.traje !== "real";
  // cenário (só na prévia grande): o fundo pintado da parede, em tons de ocre
  if (comCenario && b.cenario && b.cenario !== "nenhum") {
    const c = h("g", { opacity: .55 });
    if (b.cenario === "piramides") c.append(P("M-2 86 L22 50 L46 86 Z", "#E2B66F"), P("M22 50 L46 86 L30 86 Z", "#C99550"), P("M38 86 L58 58 L78 86 Z", "#E2B66F"), P("M58 58 L78 86 L64 86 Z", "#C99550"), P("M72 86 L86 66 L100 86 Z", "#E8C07E"), h("circle", { cx: 84, cy: 22, r: 7, fill: "#E9A03B", stroke: LN, "stroke-width": .4 }));
    if (b.cenario === "nilo") { c.append(P("M-2 76 Q25 72 50 76 Q75 80 101 75 L101 90 L-2 90 Z", "#5E8FA6")); [8, 70, 88].forEach(x => c.append(L(`M${x} 76 Q${x + 1} 60 ${x - 1} 46`, "#7A5431", 1.4), ...[-1, 1].flatMap(s => [P(`M${x - 1} 46 Q${x + s * 7} 42 ${x + s * 10} 47 Q${x + s * 5} 44 ${x - 1} 46 Z`, "#5F7A3A"), P(`M${x - 1} 46 Q${x + s * 6} 48 ${x + s * 8} 53 Q${x + s * 4} 49 ${x - 1} 46 Z`, "#4E6A30")]))); c.append(L("M10 82 q3 -1.4 6 0 t6 0 M60 84 q3 -1.4 6 0 t6 0", "#D8E6EA", .6)); }
    if (b.cenario === "templo") { c.append(P("M-2 30 L101 30 L101 34 L-2 34 Z", "#C99550")); [4, 22, 64, 82].forEach(x => c.append(P(`M${x} 34 L${x + 10} 34 L${x + 9} 86 L${x + 1} 86 Z`, "#E2B66F"), P(`M${x - 1.5} 34 Q${x + 5} 27 ${x + 11.5} 34 Z`, "#7EA36A"), ...[44, 56, 68].map(y => L(`M${x + 1} ${y} L${x + 9} ${y}`, "#B5402A", .5)))); }
    if (b.cenario === "sol") c.append(h("circle", { cx: 50, cy: 18, r: 6.5, fill: "#D94B2B", stroke: LN, "stroke-width": .4 }), ...[-1, 1].map(s => P(`M${50 + s * 6} 18 Q${50 + s * 26} 8 ${50 + s * 46} 14 Q${50 + s * 30} 16 ${50 + s * 40} 20 Q${50 + s * 24} 20 ${50 + s * 6} 21 Z`, lapis)), ...[-1, 1].map(s => P(`M${50 + s * 4} 23 q${s * 2} 3 0 6 q${-s * 2} -2 0 -6`, ouro)));
    g.append(c);
  }
  if (!b.semSombra) g.append(h("ellipse", { cx: 30, cy: 85.6, rx: 13, ry: 2.4, fill: "rgba(60,35,15,.25)" }));
  // bicho sagrado ao lado (área à direita, de x 56 a 92)
  if (b.bicho && b.bicho !== "nenhum") g.append(desenhaBicho(b.bicho, P, L));
  // braço de trás, pernas e pés
  g.append(P("M21.6 35.5 Q18.6 45 19.6 56.5 L22 56.5 Q21.8 46 23.8 38 Z", peleS));
  const calca = b.traje === "explorador";
  g.append(P("M25.4 56 L22.8 82 L25.4 82 L28.8 58 Z", calca ? "#8A6B43" : peleS), P("M30.6 56 L35.6 82 L38.2 82 L34 56 Z", calca ? "#9C7B4F" : pele));
  if (calca) g.append(P("M21 81 L26.4 81 Q28.8 82 29 84.8 L20.8 84.8 Z", "#3A2A1C"), P("M34.2 81 L39 81 Q41.6 82 41.8 84.8 L34 84.8 Z", "#3A2A1C"));
  else g.append(P("M21.6 82 L25.6 82 Q27.8 83 28 84.6 L21.6 84.6 Z", peleS), P("M34.8 82 L38.8 82 Q41.2 83 41.4 84.6 L34.8 84.6 Z", pele), L("M21.4 84.9 L28.2 84.9 M34.6 84.9 L41.6 84.9", "#8A5A2B", .7));
  // tronco: ombros de frente
  g.append(P("M21 34.6 Q30 32.6 39 34.6 L36.6 52.5 L24 52.5 Z", calca ? "#C2A878" : pele));
  if (!calca && !mulher) g.append(L("M26 40 Q28 41.5 30 40.6 M30 40.6 Q32 41.5 34 40", peleS, .5));
  // trajes
  if (b.traje === "vestido") g.append(P("M23.2 36.5 Q30 35 36.9 36.5 L37.2 55 L39.6 83 L21.4 83 L23.6 55 Z", "rgba(250,246,232,.86)"), L("M25 37 L27.5 33.6 M35 37 L32.6 33.6", linho, .9), L("M27 58 L25 82 M30.5 58 L30.5 82 M34 58 L36 82", "rgba(150,120,80,.35)", .4), P("M23.4 54 L37.2 54 L37.3 56 L23.3 56 Z", verm));
  else if (b.traje === "explorador") g.append(P("M23.6 51.5 L36.8 51.5 L37.6 58 L22.8 58 Z", "#8A6B43"), P("M23.6 51.4 L36.8 51.4 L36.9 53.2 L23.5 53.2 Z", "#3A2A1C"), L("M30 35 L30 51", "#9C8358", .5), P("M27 34.4 L30 38 L33 34.4 Z", "#E8DCC0"));
  else {
    const longo = b.traje === "sacerdote", fim = longo ? 72 : 64;
    g.append(P(`M23.6 51.5 L36.8 51.5 L38.8 ${fim} L21.8 ${fim} Z`, linho));
    if (b.traje === "real") g.append(P(`M27.6 52.5 L33 52.5 L35 ${fim + 2} L25.6 ${fim + 2} Z`, ouro), ...[0, 1, 2, 3].map(i => L(`M${27 + i * 1.6} ${55 + i * .2} L${26.2 + i * 2.2} ${fim}`, lapis, .5)), P(`M31.6 ${fim - 1} l2.2 0 l-.2 4 l-1.8 0 Z`, verm));
    else g.append(P(`M30 52 L37.8 ${fim - .5} L31 ${fim - .5} Z`, "#EDE4CC"), ...[0, 1, 2].map(i => L(`M${31 + i * 1.6} ${55 + i * 1.5} L${32 + i * 1.9} ${fim - 1}`, "rgba(150,120,80,.4)", .35)));
    g.append(P("M23.5 51.2 L36.9 51.2 L37 53.6 L23.4 53.6 Z", b.traje === "real" ? ouro : "#E6D7B0"));
    if (longo) g.append(P("M21.5 35.5 Q29 38 37 50 Q35 58 31 64 Q26 56 22.5 50 Z", "#D9A24A"), ...[[25, 40], [28, 45], [31, 50], [27, 52], [33, 56], [24, 46], [30, 59]].map(([x, y]) => h("circle", { cx: x, cy: y, r: .9, fill: "#3A2412" })), P("M21 34.5 Q19 33 20 31 Q22 32 23 34 Z", "#D9A24A"));
  }
  if (b.traje === "explorador") g.append(P("M37 35 Q41 37 41.8 45 L43 46 L41.4 48.6 L39.8 47 Q38.6 41 36 38.4 Z", "#C2A878"));
  // braço da frente segurando o objeto
  g.append(P("M37 35.4 Q41 37.2 41.8 45 L46.6 48.8 L45.2 51.2 L40 47.4 Q38.6 41.4 36 38.4 Z", pele), h("circle", { cx: 46.3, cy: 50.3, r: 1.5, fill: pele, stroke: LN, "stroke-width": .45 }));
  if (b.traje === "explorador") g.append(P("M37 35 Q41 37 41.8 45 L42.6 45.6 L41.1 47.9 L39.8 47 Q38.6 41 36 38.4 Z", "#C2A878"));
  // pescoço e cabeça de perfil, olhando para a direita
  g.append(P("M28 27.6 L33.4 27.6 L33.6 34 L27.6 34 Z", pele));
  g.append(P("M24 22 Q23 13 30.5 13 Q37 13 37.6 19 L38.7 22.2 Q39.5 23.3 38 23.7 L37.7 25.2 Q38 26 37.3 26.3 L37.3 27.4 Q36.6 29.2 33.5 29.2 L30 29.6 Q25 28.6 24 22 Z", pele));
  g.append(h("ellipse", { cx: 28.4, cy: 22, rx: 1.3, ry: 2, fill: peleS, stroke: LN, "stroke-width": .35 }));
  // o olho egípcio: de frente, contornado de kohl, com o traço que se alonga para trás
  g.append(P("M32.6 20.7 Q34.4 19.2 36.1 20.7 Q34.4 21.9 32.6 20.7 Z", "#FBF7EC", { "stroke-width": .3 }), h("circle", { cx: 34.6, cy: 20.65, r: .65, fill: preto }),
    L("M32.5 20.7 Q34.4 19 36.2 20.6 M32.6 20.8 L29.6 21.3", preto, .55), L("M32.3 18.6 Q34.4 17.6 36.4 18.7", preto, .5), L("M38 25 Q37.2 25.3 36.4 25.1", "#8A3A2A", .5));
  // barba de faraó (postiça, trançada)
  if (b.barbaFalsa === "sim") g.append(P("M35.9 28.4 L37.4 28.4 L37.8 33.4 Q36.9 34.4 36.1 33.4 Z", lapis), L("M36 30 L37.5 30 M36 31.6 L37.6 31.6", ouro, .4));
  // colar
  if (b.colar === "usekh") [lapis, ouro, turq, verm, ouro].forEach((c, i) => g.append(L(`M${23.2 - i * .7} ${34.2 + i * .2} Q30 ${38.6 + i * 1.3} ${36.8 + i * .7} ${34.2 + i * .2}`, c, 1.2)));
  if (b.colar === "ouro") g.append(L("M23.4 34.4 Q30 39.5 36.6 34.4", ouro, 1.6), h("circle", { cx: 30, cy: 38.6, r: 1.4, fill: verm, stroke: LN, "stroke-width": .3 }));
  if (b.colar === "ankh") g.append(L("M23.8 34.4 Q30 39 36.2 34.4", "#B8862A", .6), h("ellipse", { cx: 30, cy: 38.6, rx: 1.1, ry: 1.4, fill: "none", stroke: ouro, "stroke-width": .8 }), L("M28.3 40.3 L31.7 40.3 M30 40 L30 43.2", ouro, .8));
  // cabeça: perucas, coroas e chapéus
  const uraeus = () => g.append(P("M36.6 15.6 Q38.6 13.2 37.6 11.6 Q36.6 11 36.3 12.6 Q37.2 13.4 36 15.4 Z", ouro), h("circle", { cx: 37.2, cy: 11.9, r: .5, fill: verm }));
  const listras = (d, cor, fundo, linhas) => { const cid = id + "c" + cor.slice(1); g.append(h("clipPath", { id: cid }, h("path", { d })), P(d, fundo), h("g", { "clip-path": `url(#${cid})` }, ...linhas.map(y => L(`M14 ${y} L46 ${y + 1.2}`, cor, 1.2)))); };
  const peruca = "M23 24.5 Q21.4 12 30 11.6 Q37.4 11.6 37 18 L33 18.6 Q31.2 19.2 31.2 22.4 L31.2 27.2 L24.6 28.6 Q22.5 27.4 23 24.5 Z";
  if (b.cabeca === "peruca" || b.cabeca === "dupla") { g.append(P(peruca, preto)); for (let x = 24.5; x < 31; x += 1.6) g.append(L(`M${x} 14 L${x - .3} 27.6`, "#3A3028", .35)); }
  if (b.cabeca === "cleopatra" || b.cabeca === "hathor") {
    g.append(P("M22 31 Q19.4 12 30 11 Q38.6 11 37.6 18 L33.6 18.6 Q31.6 19.2 31.7 23 L32.2 41 L26 42 L21 39 Z", preto));
    for (let x = 22.6; x < 32; x += 1.5) g.append(L(`M${x} 15 L${x + .2} 40`, "#3A3028", .35));
    for (let y = 30; y < 41; y += 2.4) g.append(L(`M21.6 ${y} L32 ${y + .3}`, ouro, .35));
    g.append(L("M22.6 16.4 Q30 12.6 37.2 15.8", ouro, 1)); uraeus();
    if (b.cabeca === "hathor") g.append(P("M24 12.4 Q20 6 23.4 1.6 Q22.8 6.4 26 11.6 Z", "#2B2420"), P("M35.6 12.4 Q39.6 6 36.2 1.6 Q36.8 6.4 33.6 11.6 Z", "#2B2420"), h("circle", { cx: 29.8, cy: 5.2, r: 5, fill: "#D94B2B", stroke: LN, "stroke-width": .4 }));
  }
  if (b.cabeca === "nemes") { listras("M23 30 L22 18 Q23 11.4 30.4 11.2 Q37.6 11.3 37.6 17 L33.6 18 Q31.9 19.4 32 24 L31 37 L25.6 38.4 Z", lapis, ouro, [13, 15.6, 18.2, 20.8, 23.4, 26, 28.6, 31.2, 33.8, 36.4]); g.append(L("M23.2 16.6 Q30 13.4 37.4 16.4", lapis, 1.2)); uraeus(); }
  if (b.cabeca === "khepresh") { g.append(P("M23.4 23 Q22 10 28 6.4 Q35.2 4.6 37.8 16.6 L33.2 18.6 Q31.2 19.4 31.4 23 L25 26.4 Z", "#2E58A8")); [[27, 10], [30, 9], [33, 10.4], [26, 14], [29, 13], [32, 13.6], [35, 14.6], [25.4, 18], [28.4, 17]].forEach(([x, y]) => g.append(h("circle", { cx: x, cy: y, r: .55, fill: "#E9C46A" }))); g.append(L("M23.6 20.6 Q30 18.6 32 19.2", ouro, .8)); uraeus(); }
  if (b.cabeca === "dupla") g.append(P("M26.4 13.8 Q25.4 4 29.6 -1.6 Q33.6 4 33.4 13.8 Z", "#F4EFE3"), P("M23.4 16.6 L23.4 7.6 L26.6 7.6 L26.6 12.2 L37.2 12.2 L37.8 16.6 Z", "#C0392B"), L("M25.6 7.6 Q23.6 3.4 27.6 3", ouro, .7));
  if (b.cabeca === "fedora") g.append(h("ellipse", { cx: 30.6, cy: 14.6, rx: 11, ry: 2.4, fill: "#6B4F33", stroke: LN, "stroke-width": .45 }), P("M23.8 14.4 Q23.4 5.4 30.6 6 Q37.8 5.4 37.4 14.4 Z", "#7A5B3B"), P("M23.9 11.8 L37.3 11.8 L37.3 13.8 L23.9 13.8 Z", "#3A2A1C"));
  if (b.cabeca === "safari") g.append(h("ellipse", { cx: 30.6, cy: 15, rx: 10.6, ry: 2.2, fill: "#CDBB8F", stroke: LN, "stroke-width": .45 }), P("M23.4 15 Q23.2 5 30.6 5.4 Q38 5 37.8 15 Z", "#D8C8A0"), P("M23.5 12.6 L37.7 12.6 L37.7 14.4 L23.5 14.4 Z", "#8A6B43"));
  if (b.cabeca === "careca") g.append(L("M25.4 15.6 Q30 12.6 35.2 14.6", "rgba(255,255,255,.35)", .8));
  if (["fedora", "safari"].includes(b.cabeca)) g.append(P("M24 15.6 Q23 22 25.6 27.6 L27.6 27.4 Q26 21 27.4 15.6 Z", "#2B1D14"));
  // objeto na mão (a mão fica perto de 46,50)
  const I = b.item;
  if (I === "ankh") g.append(h("ellipse", { cx: 46.4, cy: 42.6, rx: 2.1, ry: 2.8, fill: "none", stroke: ouro, "stroke-width": 1.5 }), L("M43.2 46 L49.6 46 M46.4 45.4 L46.4 55", ouro, 1.5));
  if (I === "was") g.append(L("M46.4 30 L46.4 84", "#B8862A", 1.3), P("M46.4 30 L50 28.4 L50.6 30 L47 31.6 Z", "#B8862A"), L("M45.2 84 L46.4 81.6 L47.6 84", "#B8862A", 1));
  if (I === "cajado") g.append(L("M46 38 Q46.2 34.2 49 34.4 Q51 34.8 50.2 37", lapis, 1.4), L("M46 38 L46.6 58", lapis, 1.4), ...[0, 1, 2].map(i => L(`M46.4 47 L${50 + i * 1.5} ${40 + i * .5}`, ouro, .9)), L("M45.4 47 L50.6 39.4", lapis, 1));
  if (I === "papiro") g.append(P("M41.6 47.8 L51 47.8 L51 52.6 L41.6 52.6 Z", "#EAD6A8"), h("ellipse", { cx: 41.6, cy: 50.2, rx: 1.2, ry: 2.4, fill: "#D9C08E", stroke: LN, "stroke-width": .4 }), h("ellipse", { cx: 51, cy: 50.2, rx: 1.2, ry: 2.4, fill: "#D9C08E", stroke: LN, "stroke-width": .4 }), L("M43.4 49.4 L49.2 49.4 M43.4 51 L48 51", "#7A5431", .35));
  if (I === "paleta") g.append(P("M45 41 L48.4 41 L48 58 L45.4 58 Z", "#E2C998"), h("circle", { cx: 46.6, cy: 43.2, r: .8, fill: preto }), h("circle", { cx: 46.6, cy: 45.4, r: .8, fill: verm }), L("M47.4 47 L47.4 56", "#8A5A2B", .6));
  if (I === "sistro") g.append(L("M46.4 50 L46.4 56", "#B8862A", 1.3), P("M43.8 49.6 Q43.4 40 46.4 40 Q49.4 40 49 49.6 L47.8 49.6 Q48 42 46.4 42 Q44.8 42 45 49.6 Z", ouro), L("M44 44.6 L48.8 44.6 M44.2 47 L48.6 47", "#B8862A", .5), ...[44.6, 47].flatMap(y => [h("circle", { cx: 43.6, cy: y, r: .5, fill: ouro }), h("circle", { cx: 49.2, cy: y, r: .5, fill: ouro })]));
  if (I === "lotus") g.append(L("M46.4 50 Q47 54 46 58", "#5F8A4A", .8), P("M46.4 42 Q44 45 46.4 49 Q48.8 45 46.4 42 Z", "#F2F0E6"), P("M46.4 49 Q42 47.4 42.6 43.8 Q45 46.6 46.4 49 Z", "#E7849E"), P("M46.4 49 Q50.8 47.4 50.2 43.8 Q47.8 46.6 46.4 49 Z", "#E7849E"));
  if (I === "incenso") g.append(L("M44 50.4 L53 50.4", "#B8862A", 1.2), P("M51.6 48.4 Q53 47.2 54.6 48.4 L54.2 50.4 L52 50.4 Z", ouro), L("M53 47 Q51.8 44 53.6 41.6 Q55 39.4 53.6 36.6", "rgba(120,110,100,.6)", .6), L("M54.2 46.6 Q55.6 44 54.6 41", "rgba(120,110,100,.45)", .5));
  if (I === "lanterna") g.append(h("circle", { cx: 46.6, cy: 56, r: 6, fill: "rgba(255,196,90,.3)" }), L("M46.6 51 L46.6 52.6", "#3A2A1C", .8), P("M44.4 52.6 L48.8 52.6 L48.8 59.6 L44.4 59.6 Z", "#C9A063"), P("M45.3 53.8 L47.9 53.8 L47.9 58.4 L45.3 58.4 Z", "#FFD27A", { "stroke-width": .2 }));
  return g;
}
// bichos sagrados em perfil, como nos relevos (olhando para a direita)
function desenhaBicho(tipo, P, L) {
  const g = h("g", null), LN = "#5A2E1A", ouro = "#D9A53A", preto = "#1E1612";
  if (tipo === "camelo") return desenhaPet("camelo");
  if (tipo === "gato") g.append(P("M64 85 Q60 72 66 62 L66 54 L68.4 57 L71 54 L71.4 60 Q75 70 74 85 Z", "#2B2420"), P("M64 85 Q58 84 60 80", "none", { stroke: "#2B2420", "stroke-width": 1.6 }), h("circle", { cx: 69.6, cy: 58.6, r: .55, fill: "#E9C46A" }), h("circle", { cx: 70.6, cy: 63.4, r: 1, fill: "none", stroke: ouro, "stroke-width": .5 }), L("M66.6 67 Q70 69.6 73.4 67", ouro, .9));
  if (tipo === "ibis") g.append(P("M60 66 Q62 58 72 60 Q78 62 76 68 Q70 72 60 66 Z", "#F4EFE3"), P("M60 66 Q64 70 70 69 L66 72 Q61 71 60 66 Z", preto), L("M71 60 Q73 53 76 52", "#1E1612", 1.6), L("M76 52 Q82 54 84.6 62", "#1E1612", 1), L("M66 70 L65 85 M70 70 L71 85", "#1E1612", .7), h("circle", { cx: 76.2, cy: 52.6, r: .4, fill: "#fff" }));
  if (tipo === "falcao") g.append(P("M64 84 L66 66 Q66 56 72 54 Q77 53 77.6 58 L79.8 59.4 L77.4 60 Q76 64 74 66 L76 84 Z", "#8A5A2B"), P("M66 66 Q72 72 74 84 L66 84 Z", "#5A3A22"), P("M72.4 56.6 Q74 56 75 57.4 Q74.6 60 73 61.6 Q72.6 59 72.4 56.6 Z", "#F4EFE3"), h("circle", { cx: 74.6, cy: 57.4, r: .55, fill: preto }), L("M74.8 58.4 L73.6 61.6", preto, .5), L("M68 84 L68 86 M72 84 L72 86", "#B8862A", .7));
  if (tipo === "crocodilo") g.append(P("M58 82 Q66 76 78 77 L90 78.6 Q93 79.6 90 80.6 L80 81 Q72 85 58 84 Q52 85 49 83.6 Q54 82.6 58 82 Z", "#5F7A3A"), ...[60, 64, 68, 72, 76].map(x => P(`M${x} 77.4 l1.4 -1.8 l1.4 1.8 Z`, "#4E6A30")), L("M62 83.4 L61 86 M72 82.6 L73 86", "#4E6A30", 1.2), h("circle", { cx: 85, cy: 78.2, r: .5, fill: "#E9C46A" }), L("M82 80 L90.6 79.8", "#2F3F20", .4));
  if (tipo === "naja") g.append(P("M60 85 Q58 80 64 79 Q72 78 70 72 Q68 66 70 60 Q72 56 74.6 57 Q77 58.6 75.4 62 Q73.4 66 74.6 72 Q76 80 66 84 Q62 86 60 85 Z", "#C99550"), P("M70 60 Q67 62 68 68 Q70.6 64 72 60 Z", "#E9C46A"), h("circle", { cx: 74.4, cy: 58.6, r: .5, fill: preto }), L("M76 59.6 L77.6 59.8", "#A3231A", .4));
  if (tipo === "chacal") g.append(P("M58 86 L90 86 L90 76 L58 76 Z", "#E2B66F"), L("M58 79 L90 79", ouro, .8), P("M61 76 Q62 70 70 70 L80 69.6 Q82 64 82.6 60 L84 63 L85 60 L85.6 64.6 Q88.6 66 89 68 L85.6 69 L84.4 72 L82 76 Z", preto), L("M62 76 Q58 76 59 73", preto, 1.4), L("M80 70 Q83 72.6 84 71", ouro, .6), h("circle", { cx: 85.4, cy: 66.2, r: .45, fill: ouro }));
  if (tipo === "escaravelho") g.append(h("circle", { cx: 82, cy: 66, r: 5.4, fill: "#D94B2B", stroke: LN, "stroke-width": .45 }), P("M62 80 Q60 70 68 68 Q76 67 77 74 Q77 80 70 82 Q64 83 62 80 Z", "#2F6F6A"), L("M68.6 68 L69.6 81.6", "#173E3B", .6), P("M75.6 71 Q78.4 69.6 78.6 72.6 Q77.6 74 75.8 73.6 Z", "#245955"), ...[[64, 81, 61, 86], [69, 82, 69, 86], [74, 80, 77, 86], [76.6, 72, 78.6, 68]].map(([a, b2, c, d]) => L(`M${a} ${b2} L${c} ${d}`, "#173E3B", .7)));
  return g;
}
