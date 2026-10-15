# Explorador do Egito: vira arqueólogo. Tira as peças só da Índia do menu (o desenho delas continua no código,
# para quem já salvou não quebrar) e acrescenta peças egípcias: nemes, colar usekh, pingente ankh, ankh, escaravelho,
# pincel de arqueólogo e bússola; o gato de Bastet como companheiro.
import pathlib, re
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
def troca(a, b):
    global t
    if b in t: return
    assert a in t, a[:70]
    t = t.replace(a, b, 1)
troca('''  chapeu: [["fedora", "Chapéu de viajante"], ["safari", "Safári"], ["lenco", "Lenço"], ["turbante", "Turbante"], ["flores", "Coroa de flores"], ["sem", "Sem chapéu"]],''',
      '''  chapeu: [["fedora", "Chapéu de explorador"], ["safari", "Capacete de safári"], ["lenco", "Lenço do deserto"], ["nemes", "Nemes de faraó"], ["sem", "Sem chapéu"]],''')
troca('''  roupa: [["basico", "Sem roupa"], ["jaqueta", "Jaqueta"], ["colete", "Colete"], ["kurta", "Kurta"], ["sari", "Sari"], ["sari2", "Sari de bolinhas"], ["cigana", "Cigana"], ["monge", "Monge"], ["yogi", "Yogi de branco"], ["terno", "Terno"], ["academia", "Academia"], ["vestido", "Vestido"]],''',
      '''  roupa: [["basico", "Sem roupa"], ["jaqueta", "Jaqueta de campo"], ["colete", "Colete de explorador"], ["kurta", "Túnica"], ["yogi", "Linho branco"], ["vestido", "Vestido"], ["terno", "Terno de 1922"], ["academia", "Academia"]],''')
troca('''  acessorio: [["japamala", "Japamala"], ["incenso", "Incenso"], ["violao", "Violão"], ["tambor", "Djembê"], ["ghungroo", "Ghungroo"], ["flautim", "Flauta"], ["sitar", "Sitar"], ["harmonium", "Harmonium"], ["chai", "Chai"], ["diya", "Lamparina"], ["lotus", "Lótus"], ["sino", "Sino"], ["bolsa", "Bolsa"], ["mapa", "Mapa"], ["camera", "Câmera"], ["lanterna", "Lanterna"], ["nenhum", "Nada"]],''',
      '''  acessorio: [["violao", "Violão"], ["tambor", "Tambor"], ["flautim", "Flauta"], ["sino", "Sino"], ["ankh", "Ankh"], ["escaravelho", "Escaravelho"], ["pincel", "Pincel de arqueólogo"], ["bussola", "Bússola"], ["lotus", "Lótus"], ["diya", "Lamparina"], ["bolsa", "Bolsa"], ["mapa", "Mapa"], ["camera", "Câmera"], ["lanterna", "Lanterna"], ["nenhum", "Nada"]],''')
troca('''  colar: [["nenhum", "Nenhum"], ["guirlanda", "Guirlanda de flores"], ["rudraksha", "Rudraksha"], ["tulsi", "Contas de tulsi"], ["contas", "Contas coloridas"], ["ouro", "Colar de ouro"], ["moedas", "Colar de moedas"], ["om", "Pingente Om"]],''',
      '''  colar: [["nenhum", "Nenhum"], ["usekh", "Colar usekh"], ["ankhcolar", "Pingente ankh"], ["contas", "Contas coloridas"], ["ouro", "Colar de ouro"], ["moedas", "Colar de moedas"]],''')
troca('''["camelo", "Camelo"], ["elefante", "Elefantinho"], ["vaca", "Vaquinha sagrada"], ["macaco", "Macaco"], ["pavao", "Pavão"], ["cabra", "Cabrinha"]]''',
      '''["camelo", "Camelo"]]''')
troca('''["gato", "Gato"]''', '''["gato", "Gato de Bastet"]''')
# sorteio sem peças da Índia
troca('''colar: r() > .6 ? "guirlanda" : "nenhum", testa: r() > .6 ? v(BONECO.testa) : "nada",''', '''colar: r() > .6 ? "usekh" : "nenhum", testa: "nada",''')
# menu: sai testa, pássaro no ombro e a fantasia dos deuses hindus
troca('''        h("p", { class: "lab", text: "Na testa" }), chips("testa", BONECO.testa),\n''', '')
troca('''        h("p", { class: "lab", text: "Pássaro no ombro" }), chips("ombro", BONECO.ombro),\n''', '')
troca('''        h("p", { class: "lab", text: "Fantasia dos deuses" }), chips("deus", BONECO.deus),\n''', '')
# (o editor aparece em mais de um lugar: tira de todos)
for lab in ("Na testa", "Pássaro no ombro", "Fantasia dos deuses", "Piercing no nariz", "Nos pés"):
    t = re.sub(r'        h\("p", \{ class: "lab", text: "' + lab + r'" \}\), chips\("\w+", BONECO\.\w+\),\n', '', t)
troca('''h("p", { class: "eyebrow", text: "Mapa da Expedição" }), h("h1", { text: "Monte seu explorador" })''', '''h("p", { class: "eyebrow", text: "Expedição ao Velho Mundo" }), h("h1", { text: "Monte seu arqueólogo" })''')
# desenho: nemes (pano listrado dos faraós)
troca('''  if (b.chapeu === "flores") for''', '''  if (b.chapeu === "nemes") g.append(P("M19.5 23 Q19 9 30 8.5 Q41 9 40.5 23 L43 37 L38.5 36 Q39.5 24 37 20 Q30 18 23 20 Q20.5 24 21.5 36 L17 37 Z", "#D4A84F"),
    ...[11.5, 14.5, 17.5].map(y => P(`M${20.2 + (y - 11) * .1} ${y} Q30 ${y - 2.6} ${39.8 - (y - 11) * .1} ${y}`, "none", { stroke: "#2F4F8A", "stroke-width": 1.3 })),
    ...[[18.6, 26], [41.4, 26], [18.2, 30], [41.8, 30], [17.8, 34], [42.2, 34]].map(([x, y]) => h("line", { x1: x - 1.6, y1: y, x2: x + 1.6, y2: y, stroke: "#2F4F8A", "stroke-width": 1.2 })),
    h("rect", { x: 21, y: 18.6, width: 18, height: 2, fill: "#2F4F8A" }), P("M30 9.5 q1.6 1.8 0 4 q-1.6 -2.2 0 -4", "#B5402A"));
  if (b.chapeu === "flores") for''')
# colares egípcios
troca('''  if (b.colar === "moedas") {''', '''  if (b.colar === "usekh") ["#2F4F8A", "#D4A84F", "#3E8F86", "#A3231A", "#D4A84F"].forEach((c, i) => g.append(h("path", { d: `M${22.6 - i * .9} ${34 + i * .3} Q30 ${40 + i * 1.5} ${37.4 + i * .9} ${34 + i * .3}`, fill: "none", stroke: c, "stroke-width": 1.3 })));
  if (b.colar === "ankhcolar") g.append(h("path", { d: "M23.5 34 Q30 40 36.5 34", fill: "none", stroke: "#B8862A", "stroke-width": .7 }), h("ellipse", { cx: 30, cy: 39.4, rx: 1.3, ry: 1.6, fill: "none", stroke: "#D4A84F", "stroke-width": .9 }),
    h("line", { x1: 28, y1: 41.3, x2: 32, y2: 41.3, stroke: "#D4A84F", "stroke-width": .9 }), h("line", { x1: 30, y1: 41, x2: 30, y2: 44.5, stroke: "#D4A84F", "stroke-width": .9 }));
  if (b.colar === "moedas") {''')
# objetos na mão (mesma posição da lanterna e do mapa: mão em torno de 48,60)
troca('''    if (A === "lanterna") T.append(''', '''    if (A === "ankh") T.append(h("ellipse", { cx: 48, cy: 53.5, rx: 2.4, ry: 3.2, fill: "none", stroke: "#D4A84F", "stroke-width": 1.6 }), h("line", { x1: 44.4, y1: 57.4, x2: 51.6, y2: 57.4, stroke: "#D4A84F", "stroke-width": 1.6, "stroke-linecap": "round" }), h("line", { x1: 48, y1: 56.8, x2: 48, y2: 65, stroke: "#D4A84F", "stroke-width": 1.6, "stroke-linecap": "round" }));
    if (A === "escaravelho") T.append(h("ellipse", { cx: 48, cy: 60, rx: 4, ry: 5, fill: "#2F6F6A" }), h("line", { x1: 48, y1: 56, x2: 48, y2: 65, stroke: "#173E3B", "stroke-width": .7 }), h("ellipse", { cx: 48, cy: 55, rx: 2.4, ry: 1.6, fill: "#245955" }),
      ...[[-1, 58], [-1, 61], [-1, 64], [1, 58], [1, 61], [1, 64]].map(([s, y]) => h("line", { x1: 48 + s * 4, y1: y, x2: 48 + s * 6, y2: y + 1, stroke: "#173E3B", "stroke-width": .7 })));
    if (A === "pincel") T.append(h("line", { x1: 46, y1: 66, x2: 50.5, y2: 54, stroke: "#8A5A2B", "stroke-width": 1.6, "stroke-linecap": "round" }), h("path", { d: "M50 55.5 L52.6 49.5 Q54 50 53.8 51.6 L51.6 56.4 Z", fill: "#E8D3A2" }), h("line", { x1: 49.6, y1: 55.6, x2: 51.8, y2: 56.4, stroke: "#B8862A", "stroke-width": 1.2 }));
    if (A === "bussola") T.append(h("circle", { cx: 48, cy: 60, r: 5, fill: "#C9A063", stroke: "#7A5431", "stroke-width": 1 }), h("circle", { cx: 48, cy: 60, r: 3.8, fill: "#F3E6C4" }), h("path", { d: "M48 56.6 L49 60 L48 63.4 L47 60 Z", fill: "#B5402A" }), h("circle", { cx: 48, cy: 60, r: .6, fill: "#3A2A1C" }));
    if (A === "lanterna") T.append(''')
p.write_text(t); print("explorador egípcio")
