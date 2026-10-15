# Página inicial do Egito: mapa antigo da rota (arte da Vivian) com o explorador da pessoa andando de parada em parada,
# como o mapa-mundo de videogame. A posição segue o dia da viagem (antes de embarcar, ele espera no Cairo).
import pathlib
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
FUNC = '''// ---------- Mapa-mundo da travessia ----------
// paradas desenhadas no mapa (em % da imagem img/mapa-mundo.webp) e os dias do roteiro em cada uma
const PARADAS = [
  { n: 1, c: "Cairo", x: 55.4, y: 18.8, dias: [1, 2, 3] }, { n: 2, c: "Deserto Branco", x: 31.3, y: 39.7, dias: [4, 5] },
  { n: 3, c: "Aswan", x: 48.6, y: 70.3, dias: [6] }, { n: 4, c: "Abu Simbel", x: 53.9, y: 86.6, dias: [7] },
  { n: 5, c: "Luxor", x: 62.2, y: 58.4, dias: [8, 9] }, { n: 6, c: "Hurghada", x: 69.4, y: 43.6, dias: [10, 11, 12] },
  { n: 7, c: "Cairo · volta para casa", x: 58.9, y: 23.5, dias: [13] }];
function vMapaMundo(dias, hoje, f, abrir) {
  const dHoje = dias.find(d => d.iso === hoje), fim = hoje > dias[dias.length - 1].iso;
  const atual = fim ? 6 : dHoje ? Math.max(0, PARADAS.findIndex(q => q.dias.includes(dHoje.n))) : 0;
  const antes = S.mapaPos == null ? atual : S.mapaPos;
  const meu = S.uid ? bonecoDe(S.uid) : bonecoPadrao("caravana");
  const fala = f > 0 ? (f === 1 ? "Partida amanhã!" : `Partida em ${f} dias`) : fim ? "Travessia concluída" : "Você está aqui";
  const ex = h("div", { class: "mmexp", style: `left:${PARADAS[antes].x}%;top:${PARADAS[antes].y}%` },
    h("span", { class: "mmfala", text: fala }), bonecoCentrado({ ...meu, pet: "nenhum" }, "bonecosvg"), h("i", { class: "mmsombra" }));
  // o explorador caminha da última parada vista até a de hoje
  if (antes !== atual) requestAnimationFrame(() => requestAnimationFrame(() => { ex.style.left = PARADAS[atual].x + "%"; ex.style.top = PARADAS[atual].y + "%"; }));
  S.mapaPos = atual;
  return h("div", { class: "mmundo" },
    h("img", { src: "img/mapa-mundo.webp", alt: "Mapa da rota: Cairo, Deserto Branco, Aswan, Abu Simbel, Luxor, Hurghada e volta ao Cairo" }),
    PARADAS.map((q, i) => h("button", { type: "button", class: "mmparada" + (i < atual || (i === atual && (dHoje || fim)) ? " foi" : "") + (i === atual ? " aqui" : ""),
      style: `left:${q.x}%;top:${q.y}%`, "aria-label": q.c + " · dia " + q.dias.join(", "), onclick: () => { S.diaAberto = 0; abrir(q.dias[0]); } })),
    ex);
}
'''
JS = (pathlib.Path(__file__).resolve().parent / "js" / "mapa-mundo.js").read_text()
if "function vMapaMundo" in t and "TRECHOS" not in t:
    a = t.index("// ---------- Mapa-mundo da travessia ----------"); b = t.index("// ---------- Travessia ----------\nfunction vTravessia() {")
    t = t[:a] + JS + "\n" + t[b:]; p.write_text(t); print("mapa estilo videogame")
if "function vMapaMundo" not in t:
    t = t.replace("// ---------- Travessia ----------\nfunction vTravessia() {", JS + "\n" + "\n// ---------- Travessia ----------\nfunction vTravessia() {", 1)
    velho = '''    h("div", { class: "hero" },
      h("img", { class: "logo moeda", src: "img/logo-egito-240.png", alt: "Caravana do Céu · Travessia do Velho Mundo" }),
      h("h1", null, "Travessia do", h("br"), "Velho Mundo"),
      h("span", { class: "line" }),
      h("p", { class: "intro", id: "frase-giro", "aria-live": "polite", text: FRASES[S.fraseIdx % FRASES.length] })),'''
    novo = '''    h("div", { class: "hero mapahero" },
      h("img", { class: "logo moeda", src: "img/logo-egito-240.png", alt: "Caravana do Céu · Travessia do Velho Mundo" }),
      h("h1", null, "Travessia do Velho Mundo"),
      vMapaMundo(dias, hoje, f, abrir),
      h("p", { class: "intro", id: "frase-giro", "aria-live": "polite", text: FRASES[S.fraseIdx % FRASES.length] })),'''
    assert velho in t
    t = t.replace(velho, novo, 1)
    p.write_text(t); print("mapa-mundo na página inicial")
else: print("já estava")
