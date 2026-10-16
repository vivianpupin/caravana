# Pombo-correio vira Mensageiro do Nilo: os egípcios mandavam cartas em rolos de papiro lacrados com selo de argila,
# levadas por mensageiros a pé ou de barco pelo Nilo. A felucca leva o rolo até a pessoa.
# (Os pombos-correio no Egito vieram depois, na Idade Média; isso aparece como curiosidade na tela.)
import pathlib, re
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
FELUCCA = '''function pomboSvg(cls) {
  // felucca com vela latina levando um rolo de papiro lacrado (o nome da função ficou do pombo-correio da Índia)
  return h("svg", { class: cls + " felucca", viewBox: "0 0 64 48", "aria-hidden": "true" },
    h("path", { d: "M4 38 Q16 41 32 41 Q48 41 60 37", fill: "none", stroke: "#4F8FA8", "stroke-width": 1.6, "stroke-linecap": "round", opacity: .7 }),
    h("path", { d: "M8 33 L56 33 Q52 40 40 40 L22 40 Q11 40 8 33 Z", fill: "#7A4A26", stroke: "#3A2412", "stroke-width": .8 }),
    h("path", { d: "M10 33 L54 33", stroke: "#B5402A", "stroke-width": 1.2 }),
    h("path", { d: "M30 33 L31 6", stroke: "#3A2412", "stroke-width": 1.4 }),
    h("path", { class: "asa", d: "M31 5 L54 30 L18 30 Q28 18 31 5 Z", fill: "#F3E9D2", stroke: "#8A6A3F", "stroke-width": .8 }),
    h("path", { d: "M24 22 L44 22 M21 26 L49 26", stroke: "#D9C79F", "stroke-width": .6 }),
    h("rect", { x: 36, y: 34, width: 12, height: 4.6, rx: 2.3, fill: "#E9D6A8", stroke: "#8A6A3F", "stroke-width": .7 }),
    h("circle", { cx: 42, cy: 36.3, r: 1.7, fill: "#9C4A2A" }));
}
'''
a = t.index("function pomboSvg(cls) {"); b = t.index("function pergaminhoCarta(c)")
if "felucca com vela latina" not in t: t = t[:a] + FELUCCA + t[b:]
R = [
 ('"Mandar um pombo-correio", "Uma cartinha para alguém da turma."', '"Mandar um mensageiro do Nilo", "Uma cartinha em papiro para alguém da turma."'),
 ('`Pombo-correio, ${n} ${n > 1 ? "cartinhas novas" : "cartinha nova"}` : "Pombo-correio"', '`Mensageiro do Nilo, ${n} ${n > 1 ? "cartinhas novas" : "cartinha nova"}` : "Mensageiro do Nilo"'),
 ('"Escolha para quem o pombo vai voar."', '"Escolha para quem o mensageiro vai levar."'),
 ('`Seu pombo levantou voo até ${nomeDe(quem).split(" ")[0]}!`', '`O barco partiu pelo Nilo levando o seu papiro até ${nomeDe(quem).split(" ")[0]}!`'),
 ('"O pombo não conseguiu sair agora. Tente de novo em instantes."', '"O barco não conseguiu sair agora. Tente de novo em instantes."'),
 ('h("p", { class: "eyebrow", text: "Pombo-correio" }), h("h2", { text: "Uma cartinha para alguém da caravana" })', 'h("p", { class: "eyebrow", text: "Mensageiro do Nilo" }), h("h2", { text: "Um papiro para alguém da caravana" })'),
 ('"🕊️ Soltar o pombo"', '"Lacrar e enviar pelo Nilo"'),
 ('h("p", { class: "eyebrow", text: "Correio da caravana" }), h("h1", { text: "Pombo-correio" })', 'h("p", { class: "eyebrow", text: "Correio da caravana" }), h("h1", { text: "Mensageiro do Nilo" })'),
 ('"Escreva uma cartinha, escolha um presente ou uma oferenda e solte o pombo. Ele voa até a pessoa da caravana e pousa no celular dela."',
  '"No Egito antigo, as cartas eram escritas em papiro, enroladas e lacradas com um selo de argila, e viajavam pelo Nilo com um mensageiro. Escreva a sua, escolha um presente ou uma oferenda, e o barco leva até a pessoa da caravana."'),
 ('"Nenhum pombo pousou aqui ainda. Quando alguém te mandar uma cartinha, ela aparece nesta caixa."', '"Nenhum barco chegou aqui ainda. Quando alguém te mandar um papiro, ele aparece nesta caixa."'),
 ('`${de} te mandou um pombo-correio!`', '`Chegou um papiro de ${de} pelo Nilo!`'),
 ('"Chegou uma carta por pombo-correio!"', '"Chegou uma carta pelo mensageiro do Nilo!"'),
 ('"Quando a líder mandar uma carta, o pombo-correio traz até aqui."', '"Quando a líder mandar uma carta, o mensageiro do Nilo traz até aqui."'),
 ('"Mensagem enviada! Ela chega agora para toda a caravana pelo pombo-correio."', '"Mensagem enviada! Ela chega agora para toda a caravana pelo mensageiro do Nilo."'),
 ('"Enviar para todos pelo pombo-correio"', '"Enviar para todos pelo mensageiro do Nilo"'),
 ('placeholder: "Título (ex.: Uma carta do Ganges)"', 'placeholder: "Título (ex.: Uma carta do Nilo)"'),
 ('placeholder: "De onde (ex.: Varanasi)"', 'placeholder: "De onde (ex.: Luxor)"'),
 ('text: "Hora na Índia"', 'text: "Hora no Egito"'),
 ('(c.local || "Índia")', '(c.local || "Egito")'),
 ('"Só para uma pessoa, a carta chega lacrada com selo de cera e só ela lê."', '"Só para uma pessoa, a carta chega lacrada com selo de argila e só ela lê."'),
]
for a1, b1 in R:
    if b1 in t: continue
    if a1 in t: t = t.replace(a1, b1)
    else: print("não achei:", a1[:60])
# aba do menu: ícone de barco e nome
t = re.sub(r'(<button data-tab="pombo"><span class="ic">)<svg.*?</svg>(</span>)Pombo',
  r'\1<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16.5h18l-2.2 3H5.2z"/><path d="M11.5 16.5V3.5"/><path d="M11.8 3.5L19.5 14.5H6.5c2.4-3 4.5-7 5.3-11z"/><path d="M2.5 21.5c1.5.7 3 .7 4.5 0s3-.7 4.5 0 3 .7 4.5 0 3-.7 4.5 0"/></svg>\2Nilo', t, count=1, flags=re.S)
# curiosidade no fim da página
t = t.replace('''      chegaram.length ? h("div", { class: "envlista" }, chegaram.map(envelope))''', '''      chegaram.length ? h("div", { class: "envlista" }, chegaram.map(envelope))''')
if "pombais de barro" not in t:
    t = t.replace('    S.isOwner ? vCorrespondencia() : null,\n    h("div", { class: "panel caixacorreio" },',
      '    S.isOwner ? vCorrespondencia() : null,\n    h("p", { class: "small nilonota", text: "Os pombos-correio só chegaram ao Egito séculos depois, na Idade Média. Repare nos pombais de barro, cheios de furinhos, pelo campo: eles ainda estão lá." }),\n    h("div", { class: "panel caixacorreio" },', 1)
p.write_text(t); print("mensageiro do Nilo")

# presentes do Egito (os da Índia continuam desenhados para cartas antigas, mas saem da lista)
t = p.read_text()
velho = '''const PRESENTES = [["lotus", "Flor de lótus"], ["guirlanda", "Guirlanda de cravos"], ["diya", "Lamparina"], ["chai", "Um chai"], ["ladoo", "Doce ladoo"], ["incenso", "Incenso"],
  ["pena", "Pena de pavão"], ["sino", "Sino do templo"], ["coco", "Coco de oferenda"], ["rakhi", "Fio de proteção"], ["abraco", "Um abraço"], ["coracao", "Meu coração"]];'''
novo = '''const PRESENTES = [["lotus", "Flor de lótus"], ["diya", "Lamparina"], ["karkade", "Chá de hibisco"], ["tamaras", "Tâmaras"], ["incenso", "Incenso"],
  ["penamaat", "Pena de Maat"], ["sistro", "Sistro"], ["ankh", "Ankh da vida"], ["escaravelho", "Escaravelho"], ["olho", "Olho de Hórus"], ["gatinho", "Gatinho de Bastet"], ["patinho", "Patinho do Nilo"]];
const PRESENTES_ANTIGOS = [["abraco", "Um abraço"], ["coracao", "Meu coração"], ["guirlanda", "Guirlanda de cravos"], ["chai", "Um chai"], ["ladoo", "Doce ladoo"], ["pena", "Pena de pavão"], ["sino", "Sino do templo"], ["coco", "Coco de oferenda"], ["rakhi", "Fio de proteção"]];'''
if velho in t:
    t = t.replace(velho, novo)
    t = t.replace("const presenteDe = id => PRESENTES.find(x => x[0] === id);", "const presenteDe = id => PRESENTES.find(x => x[0] === id) || PRESENTES_ANTIGOS.find(x => x[0] === id);")
    t = t.replace('''  if (id === "diya" || id === "chai") return desenhaItem(id);''', '''  if (id === "diya" || id === "chai") return desenhaItem(id);
  const O = "#D4A84F", L = (d, c, w) => P(d, "none", { stroke: c, "stroke-width": w || 2, "stroke-linecap": "round", "stroke-linejoin": "round" });
  if (id === "karkade") return [P("M10 16 L30 16 L28 33 Q20 36 12 33 Z", "#F3E9D2", { stroke: "#8A6A3F", "stroke-width": 1 }), P("M11.5 19 L28.5 19 L27 31 Q20 33.5 13 31 Z", "#A3122A"), L("M30 20 Q36 21 34 27 Q33 30 28.5 29", "#8A6A3F", 1.4), P("M15 10 q2 -4 0 -7 M20 10 q2 -4 0 -7 M25 10 q2 -4 0 -7", "none", { stroke: "#B9A88A", "stroke-width": 1, opacity: .7 })];
  if (id === "tamaras") return [h("ellipse", { cx: 20, cy: 31, rx: 15, ry: 4.5, fill: "#C9A063" }), ...[[13, 25, -20], [20, 23, 0], [27, 25, 20], [16, 19, -10], [24, 19, 10]].map(([x, y, r]) => h("ellipse", { cx: x, cy: y, rx: 3.4, ry: 5.6, fill: "#6E2E16", stroke: "#3E1608", "stroke-width": .7, transform: `rotate(${r} ${x} ${y})` })), C(19, 17.5, 1, "#C27A4A")];
  if (id === "penamaat") return [L("M20 36 L20 6", "#8A6A3F", 1.4), P("M20 6 Q30 12 27 24 Q24 33 20 36 Q16 33 13 24 Q10 12 20 6 Z", "#F3EAD4", { stroke: "#9C8458", "stroke-width": 1 }), L("M20 12 L25 15 M20 18 L26 21 M20 24 L25 27 M20 12 L15 15 M20 18 L14 21 M20 24 L15 27", "#C9B48C", .8)];
  if (id === "sistro") return [L("M20 25 L20 37", "#8A6420", 2.4), P("M13 25 Q12 5 20 5 Q28 5 27 25 L24 25 Q24.5 9 20 9 Q15.5 9 16 25 Z", O, { stroke: "#8A6420", "stroke-width": .8 }), L("M12 13 L28 13 M12 19 L28 19", "#8A6420", 1.2), ...[13, 19].flatMap(y => [C(11, y, 1.3, O), C(29, y, 1.3, O)])];
  if (id === "ankh") return [h("ellipse", { cx: 20, cy: 11, rx: 5, ry: 6.4, fill: "none", stroke: O, "stroke-width": 3.2 }), L("M10 19.5 L30 19.5", O, 3.4), L("M20 18 L20 36", O, 3.4)];
  if (id === "escaravelho") return [h("ellipse", { cx: 20, cy: 23, rx: 10, ry: 12, fill: "#2659A8", stroke: "#0E2756", "stroke-width": 1.2 }), h("ellipse", { cx: 20, cy: 11, rx: 5, ry: 3.4, fill: "#2659A8", stroke: "#0E2756", "stroke-width": 1.2 }), L("M20 14 L20 35 M10.5 17 Q20 14 29.5 17", "#0E2756", 1.2), L("M10 20 L5 17 M10 26 L4 27 M11 31 L6 35 M30 20 L35 17 M30 26 L36 27 M29 31 L34 35", "#0E2756", 1.3), P("M15 19 Q14 25 16 29", "none", { stroke: "#9FC3EE", "stroke-width": 1.4, opacity: .7 })];
  if (id === "gatinho") return [P("M12 36 Q8 26 13 19 L12 9 L16.5 13.5 Q20 12.5 23.5 13.5 L28 9 L27 19 Q32 26 28 36 Z", "#2B2420", { stroke: "#120E0C", "stroke-width": .8 }), P("M28 34 Q36 33 34 24", "none", { stroke: "#2B2420", "stroke-width": 2.6, "stroke-linecap": "round" }), h("ellipse", { cx: 16.6, cy: 19.5, rx: 1.6, ry: 2, fill: "#E9C46A" }), h("ellipse", { cx: 23.4, cy: 19.5, rx: 1.6, ry: 2, fill: "#E9C46A" }), P("M18.8 23 L21.2 23 L20 24.4 Z", "#C27A7A"), P("M14 27.5 Q20 31 26 27.5", "none", { stroke: "#D4A84F", "stroke-width": 1.6 }), C(20, 30.4, 1.5, "#D4A84F")];
  if (id === "patinho") return [P("M5 31 Q20 36 35 31", "none", { stroke: "#5E9AB8", "stroke-width": 1.6, "stroke-linecap": "round" }), P("M9 27 Q8 19 17 19 Q22 19 25 23 L32 21 Q31 30 22 31 Q12 32 9 27 Z", "#F2E6C8", { stroke: "#7A5A2E", "stroke-width": .9 }), C(14, 16, 5, "#3F7A5A", { stroke: "#2A5A3E", "stroke-width": .8 }), P("M9.5 16.5 L5 18 L9.5 19 Z", "#E2913A"), C(13, 15, .9, "#1E140B"), P("M17 24 Q22 22 26 25", "none", { stroke: "#B58A4A", "stroke-width": 1 })];
  if (id === "olho") return [P("M5 18 Q20 7 35 18 Q20 24 5 18 Z", "#F3EAD4", { stroke: "#1E2A4A", "stroke-width": 2 }), C(20, 17, 4, "#1E2A4A"), L("M35 18 L38 18", "#1E2A4A", 2), L("M17 22 L15 33 M24 22 Q27 30 33 30 Q35 27 32 25", "#1E2A4A", 2), L("M8 11 Q20 3 33 10", "#1E2A4A", 2)];''')
    p.write_text(t); print("presentes do Egito")
