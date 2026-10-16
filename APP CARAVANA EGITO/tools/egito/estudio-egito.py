# Estúdio da câmera do celular e maleta: tudo da Índia vira Egito e entram as etiquetas de viagem envelhecidas
# (app/img/adesivos/*.webp, feitas por tools/egito/adesivos/*.svg + envelhecer-adesivos.py) como adesivos.
import pathlib, re
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
ETQ = [("cairo", "Cairo 1922"), ("gize", "Gizé"), ("desertobranco", "Deserto Branco"), ("aswan", "Aswan · Nilo"), ("abusimbel", "Abu Simbel"), ("luxor", "Luxor"), ("hurghada", "Hurghada"), ("correio", "Selo do Egito")]
lista = ", ".join(f'["img:img/adesivos/{k}.webp", "{n}"]' for k, n in ETQ)
R = [
 ('["x:balao:Mais um chai?", "Mais um chai?"]', '["x:balao:Mais um karkadé?", "Mais um karkadé?"]'),
 ('["linha", "Caravana do Céu · Índia 2026"]', '["linha", "Caravana do Céu · Egito 2027"]'),
 ('''    ["estrela", "Estrela"], ["flor", "Flor de cravo"], ["guirlanda", "Guirlanda"], ["lungta", "Bandeirinhas de oração"],
    ["x:item:diya", "Lamparina"], ["x:item:chai", "Chai"], ["x:om", "Om"], ["x:lotus", "Lótus"], ["x:tuktuk", "Tuk-tuk"], ["mao:Namastê", "Namastê"], ["mao:Hare Krishna", "Hare Krishna"]],''',
  '''    ["estrela", "Estrela"], ["x:item:diya", "Lamparina"], ["x:lotus", "Lótus"], ["mao:Salam aleikum", "Salam aleikum"], ["mao:Shukran!", "Shukran!"], ["mao:Yalla!", "Yalla!"]],
  // etiquetas de viagem envelhecidas, como as das malas de expedição
  "Etiquetas do Egito": [''' + lista + '''],'''),
 ('["mao:Saudações da Índia", "Saudações da Índia"]', '["mao:Saudações do Egito", "Saudações do Egito"]'),
 ('const texto = F.legenda || ("Saudações da Índia" + (F.cidade ? " · " + F.cidade : ""));', 'const texto = F.legenda || ("Saudações do Egito" + (F.cidade ? " · " + F.cidade : ""));'),
 ('x.fillText("Eu na Índia", 230, 492)', 'x.fillText("Eu no Egito", 230, 492)'),
 ('x.fillText("tomando chai na Índia", 230, 534)', 'x.fillText("tomando karkadé no Egito", 230, 534)'),
 ('c.fillText("Índia · 2026", 0, 0)', 'c.fillText("Egito · 2027", 0, 0)'),
 ('(horário da Índia)', '(horário do Egito)'),
 ('["arco", "Janela de palácio"], ["guirlanda", "Guirlanda de flores"], ["bandeirinhas", "Bandeirinhas de oração"], ', '["arco", "Portal do templo"], '),
 ('adesivos com bichinhos da Índia, firulas, molduras de cartão-postal, ingresso, guirlanda e mais.', 'adesivos com bichinhos e símbolos do Egito, etiquetas de viagem, molduras de cartão-postal, ingresso e mais.'),
 ('// foto de exemplo (Taj Mahal entre os arcos)', '// foto de exemplo (Luxor)'),
 ('im.src = "img/abertura-agra.webp";', 'im.src = "img/abertura-luxor.webp";'),
 ('c.fillText("ÍNDIA", 0, sh / 2 - 58 * u); c.font = `500 ${20 * u}px Poppins, sans-serif`; c.fillText("2026 · ₹ 26"', 'c.fillText("EGITO", 0, sh / 2 - 58 * u); c.font = `500 ${20 * u}px Poppins, sans-serif`; c.fillText("2027 · مصر"'),
 ('x.fillText("ÍNDIA", 190, 392); x.font = \'500 22px Poppins, sans-serif\'; x.fillText("2026 · ₹ 26"', 'x.fillText("EGITO", 190, 392); x.font = \'500 22px Poppins, sans-serif\'; x.fillText("2027 · مصر"'),
 ('x.fillText("ÍNDIA", 0, sh / 2 - 70); x.font = \'500 26px Poppins, sans-serif\'; x.fillText("2026 · ₹ 26"', 'x.fillText("EGITO", 0, sh / 2 - 70); x.font = \'500 26px Poppins, sans-serif\'; x.fillText("2027 · مصر"'),
 ('h("h1", { text: "Seu passaporte da Índia Sagrada" })', 'h("h1", { text: "Seu passaporte do Egito" })'),
 ('", sua passagem para a Índia chegou ✈️\\n"', '", sua passagem para o Egito chegou ✈️\\n"'),
 # carimbos de tinta e redondos da câmera: Egito (cidades do roteiro oficial)
 ('''  { t: ["NAMASTÊ", "नमस्ते"], cor: "#A8281B", f: "ret2", r: 0 },
  { t: ["JAI HO!", "जय हो"], cor: "#2F4F8A", f: "chanfro", r: 0 },
  { t: ["OM SHANTI", "ॐ शान्ति"], cor: "#5B3F7A", f: "ret", r: 0 },
  { t: ["CHAI", "APROVADO", "MASALA"], cor: "#8A4A1C", f: "ret", r: 0 },
  { t: ["MA GANGA", "गंगा", "RISHIKESH"], cor: "#2F4F8A", f: "ret", r: 0 },''',
  '''  { t: ["SALAM", "سلام"], cor: "#A8281B", f: "ret2", r: 0 },
  { t: ["YALLA!", "يلا"], cor: "#2F4F8A", f: "chanfro", r: 0 },
  { t: ["SHUKRAN", "شكرا"], cor: "#5B3F7A", f: "ret", r: 0 },
  { t: ["KARKADÉ", "APROVADO", "HIBISCO"], cor: "#8A4A1C", f: "ret", r: 0 },
  { t: ["ABU SIMBEL", "RAMSÉS II", "NÚBIA"], cor: "#2F4F8A", f: "ret", r: 0 },'''),
 ('{ t: ["DIWALI", "दीवाली", "NOV 2026"], cor: "#A8281B", f: "chanfro", r: 0 },', '{ t: ["MÃE DO MUNDO", "مصر", "OUT 2027"], cor: "#A8281B", f: "chanfro", r: 0 },'),
 ('{ t: ["KASHI", "VARANASI", "CIDADE DA LUZ"], cor: "#3F6B4A", f: "ret", r: 0 },', '{ t: ["RIO NILO", "FELUCA", "ASWAN"], cor: "#3F6B4A", f: "ret", r: 0 },'),
 ('{ t: ["TAJ MAHAL", "AGRA"], cor: "#5B3F7A", f: "ret2", r: 0 },', '{ t: ["KARNAK", "LUXOR"], cor: "#5B3F7A", f: "ret2", r: 0 },'),
 ('{ t: ["CARAVANA DO CÉU", "ÍNDIA · 2026"], cor: "#3F6B4A", simb: 1 },', '{ t: ["CARAVANA DO CÉU", "EGITO · 2027"], cor: "#3F6B4A", simb: 1 },'),
 ('{ t: ["DELHI · AGRA · JAIPUR", "VARANASI · RISHIKESH"], cor: "#2F4F8A", centro: "✦" },', '{ t: ["CAIRO · GIZÉ · ASWAN", "LUXOR · ABU SIMBEL"], cor: "#2F4F8A", centro: "✦" },'),
 ('{ t: ["CORREIOS DA ÍNDIA", "POSTA · 2026"], cor: "#A8281B", centro: "ॐ" },', '{ t: ["CORREIOS DO EGITO", "POSTA · 2027"], cor: "#A8281B", centro: "☥" },'),
 ('x.fillText("CARAVANA DO CÉU · ÍNDIA 2026", 550, 62)', 'x.fillText("CARAVANA DO CÉU · EGITO 2027", 550, 62)'),
 ('x.fillText("ÍNDIA · 2026", 150, 222)', 'x.fillText("EGITO · 2027", 150, 222)'),
 ('c.fillText("CARAVANA DO CÉU · ÍNDIA", W / 2, H - 52)', 'c.fillText("CARAVANA DO CÉU · EGITO", W / 2, H - 52)'),
 ('c.fillStyle = "#FFF1D6"; c.fillText("CARAVANA DO CÉU · ÍNDIA 2026"', 'c.fillStyle = "#FFF1D6"; c.fillText("CARAVANA DO CÉU · EGITO 2027"'),
 ('c.fillStyle = cor; c.fillText("CARAVANA DO CÉU · ÍNDIA 2026"', 'c.fillStyle = cor; c.fillText("CARAVANA DO CÉU · EGITO 2027"'),
 ('27 POSES · ISO 400 · ÍNDIA 2026', '27 POSES · ISO 400 · EGITO 2027'),
 ('CARAVANA DO CÉU · ÍNDIA SAGRADA ·', 'CARAVANA DO CÉU · EGITO ·'),
 ('// Adesivos: logos da Caravana, bichos da Índia (os mesmos do Explorador), coisas da Índia, brilhos e frases', '// Adesivos: logos da Caravana, bichos (os mesmos do Explorador), coisas do Egito, etiquetas, brilhos e frases'),
 # Burton 1922: o corpo novo é a traseira da câmera de placa (tools/egito/camera-burton.py): vidro fosco grande e a pera de borracha
 ('campo: { visor: [.15, .127, .559, .489], botao: [.694, .815, .09], selfie: [.24, .78] },', 'campo: { visor: [.1235, .1042, .8765, .7465], botao: [.70, .865, .085], selfie: [.13, .86] },'),
 ('campo: "Placa de vidro · obturador lento · 1900"', 'campo: "Placa de vidro · obturador lento · 1922"'),
 ('super8: [h("i", { class: "info", text: "● REC  18 fps" })],', 'super8: [h("i", { class: "info", text: "● REC  18 fps" })],\n        campo: [h("i", { class: "grade" })],'),
 ('instantanea: "KASHI"', 'instantanea: "NILO"'),
]
for a, b in R:
    if b in t: continue
    if a in t: t = t.replace(a, b)
    else: print("não achei:", a[:70])
# maleta: a Vivian achou feio com etiquetas na tampa; elas ficam só no estúdio
a = t.index("function etiquetasEgito() {"); b = t.index("function vEstante() {")
t = t[:a] + '''function etiquetasEgito() { return null; }
''' + t[b:]
p.write_text(t); print("estúdio do Egito")

# Shiva sai do "Meu explorador" (feito à parte: o trecho final "]; }," existe em muitos lugares)
t = p.read_text(); t = t.replace(', ["x:deus:shiva", "Shiva · Om Namah Shivaya"]]; },', ']; },'); p.write_text(t)
