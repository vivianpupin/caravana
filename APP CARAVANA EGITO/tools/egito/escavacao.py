# Explorador do Egito, parte 2: títulos egípcios (no lugar das habilidades da Índia) e o Diário de escavação:
# cada lugar carimbado no passaporte libera um achado para desenterrar com o dedo e um enigma que se responde olhando o lugar.
import pathlib
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
a = t.index("const HABILIDADES = ["); b = t.index("];", a) + 2
HAB = '''const HABILIDADES = [
  ["escriba", "Escriba Real", "Escriba Real", "Escrevi meu nome em hieróglifos dentro de um cartucho.", "Escrevi meu nome em hieróglifos dentro de um cartucho.", "cairo"],
  ["piramides", "Guardiã das Pirâmides", "Guardião das Pirâmides", "Fiquei aos pés da única maravilha antiga que ainda está de pé.", "Fiquei aos pés da única maravilha antiga que ainda está de pé.", "piramides-gize"],
  ["camelo", "Cameleira do Saara", "Cameleiro do Saara", "Subi no camelo e ele levantou primeiro de trás. Sobrevivi!", "Subi no camelo e ele levantou primeiro de trás. Sobrevivi!", "piramides-gize"],
  ["pechincha", "Mestra do Khan el-Khalili", "Mestre do Khan el-Khalili", "Pago metade, tomo um chá com o vendedor e saio amiga.", "Pago metade, tomo um chá com o vendedor e saio amigo.", "cairo"],
  ["libras", "Milionária em Libras Egípcias", "Milionário em Libras Egípcias", "Troquei uns dólares e saí com um maço de libras.", "Troquei uns dólares e saí com um maço de libras.", "egito"],
  ["mumias", "Amiga das Múmias", "Amigo das Múmias", "Olhei nos olhos de Ramsés II e ele não piscou.", "Olhei nos olhos de Ramsés II e ele não piscou.", "mumias"],
  ["deserto", "Filha do Deserto Branco", "Filho do Deserto Branco", "Dormi sob as estrelas entre rochas de giz.", "Dormi sob as estrelas entre rochas de giz.", "deserto-branco"],
  ["felucca", "Navegadora do Nilo", "Navegador do Nilo", "Velejei de felucca no rio mais longo da África.", "Velejei de felucca no rio mais longo da África.", "rio-nilo"],
  ["sol", "Testemunha do Sol", "Testemunha do Sol", "Vi o sol nascer no deserto, como faziam os sacerdotes de Rá.", "Vi o sol nascer no deserto, como faziam os sacerdotes de Rá.", "sahara"],
  ["ramses", "Convidada de Ramsés", "Convidado de Ramsés", "Entrei no templo que Ramsés esculpiu na montanha.", "Entrei no templo que Ramsés esculpiu na montanha.", "abu-simbel"],
  ["oraculo", "Sacerdotisa de Amon", "Sacerdote de Amon", "Consultei o oráculo e a barca do deus parou para mim.", "Consultei o oráculo e a barca do deus parou para mim.", "luxor"],
  ["tumbas", "Exploradora de Tumbas", "Explorador de Tumbas", "Desci no Vale dos Reis e vi o céu pintado no teto.", "Desci no Vale dos Reis e vi o céu pintado no teto.", "vale-dos-reis"],
  ["balao", "Voadora de Luxor", "Voador de Luxor", "Vi o Vale dos Reis do alto, de balão, ao amanhecer.", "Vi o Vale dos Reis do alto, de balão, ao amanhecer.", "luxor"],
  ["mergulho", "Sereia do Mar Vermelho", "Tritão do Mar Vermelho", "Nadei entre os corais do Mar Vermelho.", "Nadei entre os corais do Mar Vermelho.", "mar-vermelho"],
  ["coracao", "Coração de Caravana", "Coração de Caravana", "Atravessei o Egito e voltei com uma família.", "Atravessei o Egito e voltei com uma família.", "travessia"]
];'''
if '"escriba", "Escriba Real"' not in t:
    t = t[:a] + HAB + t[b:]
ESC = '''// ---------- Diário de escavação: cada carimbo libera um achado (raspar a areia com o dedo) e um enigma do lugar ----------
const ACHADOS = {
  cairo: { g: "𓏛", nome: "Rolo de papiro", txt: "O papiro era feito do caule de uma planta que crescia nas margens do Nilo: fatiado, cruzado em camadas, prensado e seco ao sol. Foi o papel do mundo antigo por mais de três mil anos.", p: "Qual rio atravessa o Cairo?", o: ["Nilo", "Eufrates", "Jordão"], c: 0 },
  "piramides-gize": { g: "𓍑", nome: "Cinzel de cobre", txt: "Os construtores das pirâmides cortavam o calcário com cinzéis de cobre, martelos de pedra e cunhas. Eram trabalhadores pagos, que moravam numa vila ao lado do canteiro, não escravos.", p: "Quantas pirâmides grandes de faraós há no planalto de Gizé?", o: ["Duas", "Três", "Sete"], c: 1 },
  "piramide-khufu": { g: "𓉴", nome: "Bloco de calcário de Tura", txt: "A Grande Pirâmide era revestida de calcário branco e polido, trazido das pedreiras de Tura, do outro lado do Nilo. Ao sol, ela brilhava. Quase todo o revestimento foi retirado séculos depois para construir o Cairo.", p: "Por quanto tempo a Grande Pirâmide foi a construção mais alta feita pelo ser humano?", o: ["Cerca de 380 anos", "Cerca de 1.000 anos", "Cerca de 3.800 anos"], c: 2 },
  "sarcofago-tut": { g: "𓆣", nome: "Escaravelho de faiança", txt: "O escaravelho rola uma bola de esterco como o sol rola pelo céu. Por isso virou o símbolo de Khepri, o sol que renasce. Era o amuleto mais comum do Egito, feito de faiança azul-esverdeada.", p: "Quantos caixões, um dentro do outro, guardavam a múmia de Tutankhamon?", o: ["Um", "Três", "Cinco"], c: 1 },
  saqqara: { g: "𓊍", nome: "Óstraco de calcário", txt: "Óstraco é um caco de cerâmica ou de pedra usado como rascunho. Papiro era caro, então escribas e operários escreviam listas, contas, cartas e até desenhos em cacos.", p: "Quem projetou a Pirâmide de Degraus de Djoser, em Saqqara?", o: ["Imhotep", "Ramsés II", "Cleópatra"], c: 0 },
  mumias: { g: "𓄣", nome: "Escaravelho do coração", txt: "Sobre o peito da múmia ia um escaravelho de pedra com um capítulo do Livro dos Mortos, pedindo ao coração que não testemunhasse contra o morto na pesagem diante de Osíris.", p: "Segundo Heródoto, quantos dias durava a mumificação?", o: ["7 dias", "40 dias", "70 dias"], c: 2 },
  sahara: { g: "𓇳", nome: "Cristal de quartzo", txt: "A Crystal Mountain, no caminho do Deserto Branco, é uma crista de rocha cheia de cristais de quartzo que brilham ao sol. O Egito antigo usava cristal de rocha em olhos de estátuas e amuletos.", p: "Por que o Deserto Negro tem esse nome?", o: ["Por causa das tempestades", "Por causa das pedras vulcânicas escuras nas colinas", "Porque é visitado à noite"], c: 1 },
  "deserto-branco": { g: "𓆟", nome: "Fóssil marinho", txt: "Onde hoje é deserto já foi fundo de mar. As formações brancas são de giz, feito de restos de seres marinhos, e é possível encontrar conchas fósseis no chão.", p: "Do que são feitas as rochas brancas do Deserto Branco?", o: ["Sal", "Giz (calcário)", "Mármore"], c: 1 },
  aswan: { g: "𓌪", nome: "Lasca de granito rosa", txt: "Aswan era a pedreira do granito vermelho, a pedra mais dura usada pelos egípcios. De lá saíram obeliscos e estátuas que desceram o Nilo em barcaças até Tebas e Gizé.", p: "De que pedra é o Obelisco Inacabado de Aswan?", o: ["Granito", "Arenito", "Calcário"], c: 0 },
  "rio-nilo": { g: "𓊛", nome: "Barca de madeira em miniatura", txt: "As tumbas tinham barquinhos de madeira para o morto navegar na outra vida. No Egito, viajar era navegar: até o sol cruzava o céu de barca.", p: "Para onde corre o Nilo?", o: ["Para o sul", "Para o norte", "Para o leste"], c: 1 },
  "abu-simbel": { g: "𓍹", nome: "Cartucho de Ramsés II", txt: "Ramsés II reinou 66 anos e espalhou o próprio nome por todo o Egito. Em Abu Simbel, duas vezes por ano, o sol entra pelo templo e ilumina as estátuas no fundo do santuário.", p: "Quantas estátuas colossais de Ramsés II estão na fachada do Grande Templo?", o: ["Duas", "Quatro", "Seis"], c: 1 },
  luxor: { g: "𓃬", nome: "Esfinge da avenida", txt: "Uma avenida de quase três quilômetros, ladeada de esfinges, ligava o templo de Luxor ao de Karnak. Por ela passava a procissão da barca de Amon na festa de Opet.", p: "Onde está hoje o segundo obelisco da entrada do Templo de Luxor?", o: ["Em Roma", "Em Londres", "Em Paris"], c: 2 },
  "vale-dos-reis": { g: "𓉐", nome: "Óstraco de um operário", txt: "Os artistas das tumbas moravam na vila de Deir el-Medina e deixaram milhares de óstracos: listas de faltas ao trabalho, receitas, cartas e desenhos de treino.", p: "Qual é o número da tumba de Tutankhamon no Vale dos Reis?", o: ["KV5", "KV17", "KV62"], c: 2 },
  "mar-vermelho": { g: "𓇋", nome: "Resina de incenso de Punt", txt: "A rainha Hatshepsut mandou barcos pelo Mar Vermelho até a terra de Punt, de onde voltaram com árvores de incenso e mirra. A viagem está esculpida no templo dela, em Luxor.", p: "Por que o Mar Vermelho é tão salgado?", o: ["Muita evaporação e quase nenhum rio deságua nele", "Por causa dos corais", "Porque é muito fundo"], c: 0 }
};
const lerEsc = () => { try { return JSON.parse(localStorage.getItem("cdi-escavacao") || "{}"); } catch (e) { return {}; } };
const gravaEsc = o => { try { localStorage.setItem("cdi-escavacao", JSON.stringify(o)); } catch (e) {} };
function vEscavacao() {
  const E = lerEsc(), ls = Object.keys(ACHADOS).map(localDe).filter(Boolean), achados = ls.filter(l => E[l.id]).length;
  return h("div", { class: "escav" },
    h("p", { class: "eyebrow rule", text: "Diário de escavação" }),
    h("button", { type: "button", class: "oraculocard amon escriba", onclick: () => abrirPagina("hieroglifos.html", "Seu nome em hieróglifos") },
      h("span", { class: "escglifo", text: "𓍹" }), h("span", { class: "orctx" }, h("small", { text: "Oficina do escriba" }), h("b", { text: "Seu nome em hieróglifos" }), h("span", { text: "Grave o seu nome num cartucho, como os faraós." }))),
    h("p", { class: "small", text: `Cada carimbo do passaporte libera um achado para desenterrar e um enigma do lugar. ${achados} de ${ls.length} achados.` }),
    h("div", { class: "escgrid" }, ls.map(l => {
      const A = ACHADOS[l.id], ok = aberto(l), e = E[l.id];
      return h("button", { type: "button", class: "esccard" + (ok ? "" : " fechado") + (e ? " achado" : ""), onclick: () => ok ? abrirEscavacao(l) : abrirSelo(l) },
        e ? h("span", { class: "escglifo", text: A.g }) : h("img", { src: badgeSrc(l), alt: "" }),
        h("b", { text: e ? A.nome : l.nome }), h("small", { text: e ? (e.enigma === true ? "Enigma resolvido" : "Toque para o enigma") : ok ? "Escavar" : "Abre com o carimbo" }));
    })));
}
function abrirPagina(src, titulo) {
  closeSheets();
  const caixa = h("div", { class: "orsheet", role: "dialog", "aria-label": titulo }, h("iframe", { src, title: titulo, class: "orframe", allow: "autoplay" }));
  const fecha = e => { if (e.data !== "fecha-oraculo") return; removeEventListener("message", fecha); caixa.remove(); render(); };
  addEventListener("message", fecha); document.body.append(caixa);
}
function abrirEscavacao(l) {
  closeSheets();
  const A = ACHADOS[l.id], E = lerEsc(), corpo = h("div", { class: "escbox" });
  const fechar = () => { closeSheets(); render(); };
  const mostra = () => {
    const e = lerEsc()[l.id] || {};
    const ops = h("div", { class: "escops" }, A.o.map((op, i) => h("button", { type: "button", class: "btn" + (e.enigma === true && i === A.c ? " gold" : ""), disabled: e.enigma === true, onclick: ev => {
      const X = lerEsc(); X[l.id] = { ...(X[l.id] || {}), enigma: i === A.c }; gravaEsc(X);
      if (i === A.c) { vibrar([30, 40, 80]); mostra(); } else { vibrar(120); ev.currentTarget.classList.add("errou"); ev.currentTarget.disabled = true; } } }, op)));
    corpo.replaceChildren(
      h("span", { class: "escglifo grande", text: A.g }), h("p", { class: "eyebrow", text: l.nome }), h("h2", { text: A.nome }), h("p", { text: A.txt }),
      h("div", { class: "escenigma" }, h("p", { class: "eyebrow rule", text: "Enigma do lugar" }), h("p", { class: "escperg", text: A.p }), ops,
        e.enigma === true ? h("p", { class: "msg ok", text: "Isso! Você decifrou o enigma deste lugar." }) : h("p", { class: "small", text: "Olhe ao redor, pergunte ao guia ou leia os Saberes deste lugar." })),
      h("div", { class: "foot2" }, h("span"), h("button", { class: "btn", type: "button", onclick: fechar }, "Fechar")));
  };
  if (E[l.id]) mostra();
  else {
    // a areia cobre o achado; a pessoa raspa com o dedo
    const cv = h("canvas", { class: "escareia", "aria-label": "Raspe a areia com o dedo" }), fundo = h("div", { class: "escachado" }, h("span", { class: "escglifo grande", text: A.g }), h("b", { text: A.nome }));
    const palco = h("div", { class: "escpalco" }, fundo, cv), dica = h("p", { class: "small", style: "text-align:center", text: "Raspe a areia com o dedo." });
    corpo.replaceChildren(h("p", { class: "eyebrow", text: l.nome }), h("h2", { text: "Escavação" }), palco, dica, h("div", { class: "foot2" }, h("span"), h("button", { class: "btn ghost", type: "button", onclick: fechar }, "Depois")));
    requestAnimationFrame(() => {
      const r = { width: palco.clientWidth, height: palco.clientHeight }, d = Math.min(2, devicePixelRatio || 1), x = cv.getContext("2d"); cv.width = r.width * d; cv.height = r.height * d; x.scale(d, d);
      const g = x.createLinearGradient(0, 0, 0, r.height); g.addColorStop(0, "#E2C27E"); g.addColorStop(1, "#C9A15C"); x.fillStyle = g; x.fillRect(0, 0, r.width, r.height);
      for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? "120,85,40" : "255,240,200"},${Math.random() * .35})`; x.fillRect(Math.random() * r.width, Math.random() * r.height, 1.5, 1.5); }
      let fim = false, n = 0;
      const raspa = ev => { if (fim) return; const b = cv.getBoundingClientRect(), px = (ev.clientX - b.left) * r.width / b.width, py = (ev.clientY - b.top) * r.height / b.height; x.globalCompositeOperation = "destination-out"; x.fillStyle = "#000";
        x.beginPath(); x.arc(px, py, 22, 0, 7); x.fill(); if (++n % 6 === 0) vibrar(5);
        if (n % 10 === 0) { const dd = x.getImageData(0, 0, cv.width, cv.height).data; let v = 0; for (let k = 3; k < dd.length; k += 64) if (dd[k] < 40) v++; if (v / (dd.length / 64) > .55) {
          fim = true; cv.style.transition = "opacity .8s"; cv.style.opacity = "0"; vibrar([40, 60, 120]); const X = lerEsc(); X[l.id] = { achou: Date.now() }; gravaEsc(X); setTimeout(mostra, 1100); } } };
      cv.addEventListener("pointerdown", ev => { cv.setPointerCapture(ev.pointerId); raspa(ev); });
      cv.addEventListener("pointermove", ev => { if (ev.buttons || ev.pointerType === "touch") raspa(ev); });
    });
  }
  const sheet = h("div", { class: "sheet", onclick: e => { if (e.target === sheet) fechar(); } }, h("div", { role: "dialog", "aria-label": "Escavação em " + l.nome, class: "escsheet" }, corpo));
  document.body.append(sheet);
}
'''
if "const ACHADOS" not in t:
    t = t.replace("function vExplorador() {", ESC + "function vExplorador() {", 1)
    t = t.replace("    vSalvaExplorador(), vCaravanaBonecos(), vRetrato());", "    vEscavacao(), vSalvaExplorador(), vCaravanaBonecos(), vRetrato());", 1)
p.write_text(t); print("escavação e títulos")

# fonte dos hieróglifos (achados e cartucho do escriba)
t = p.read_text()
velho = 'family=Special+Elite&display=swap">'
if "Noto+Sans+Egyptian+Hieroglyphs" not in t and velho in t:
    p.write_text(t.replace(velho, 'family=Special+Elite&family=Noto+Sans+Egyptian+Hieroglyphs&display=swap">', 1))
