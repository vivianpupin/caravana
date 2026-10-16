# Maleta de câmeras no Egito: nomes dos filtros e câmeras do Egito, a câmera de campo vira a "Burton 1922"
# (Harry Burton fotografou a tumba de Tutankhamon em placas de vidro), cidades do roteiro e etiquetas de viagem
# coladas na tampa da maleta, como as malas de expedição dos anos 1920.
import pathlib, re
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
FIL = {"Aarti": "Luz de Karnak", "Fogueira": "Fogueira no deserto", "Jharokha": "Mashrabiya", "Amanhecer": "Amanhecer no Nilo",
 "Maharaja 1920": "Placa de vidro 1922", "Bollywood 70": "Cairo 70", "Sadhu": "Sacerdote", "Monção": "Khamsin", "Bazar": "Khan el-Khalili",
 "Ouro de Ganga": "Ouro do Nilo", "Hawa Mahal": "Templo de Hathor", "Himalaia": "Deserto Branco", "Algodão": "Linho", "Holi": "Faiança",
 "Musgo": "Papiro", "Rajastão 35 Color": "Cairo 35 Color", "Rajastão 35": "Cairo 35", "Durga": "Luxor", "Agra 1900": "Burton 1922",
 "Agra 1900 vermelha": "Burton 1922 vermelha", "Agra 1900 marrom": "Burton 1922 marrom", "Delhi 1955": "Cairo 1955", "Delhi 1955 quente": "Cairo 1955 quente",
 "Delhi 1955 fria": "Cairo 1955 fria", "Blue Lassi": "Noite de Nut", "Magic Lassi": "Feluca", "Mango Lassi": "Tâmara", "Rose Lassi": "Hibisco",
 "Masala": "Especiarias", "Índigo": "Lápis-lazúli", "Delhi": "Cairo", "Agra": "Gizé", "Jaipur": "Aswan", "Varanasi": "Luxor", "Rishikesh": "Abu Simbel",
 "Kashi": "Hurghada", "Mármore": "Alabastro", "Lassi": "Creme", "Chai": "Karkadé", "Banyan": "Palmeira", "Gulab": "Rosa do deserto",
 "Guirlanda": "Ouro de Tut", "Diwali": "Noite no Cairo", "Bollywood": "Cairo Pop", "Pó do Holi": "Areia colorida"}
a = t.index("const FILTROS = ["); b = t.index("const PATCHES", a)
bloco = re.sub(r'(cat: "[^"]*", nome: ")([^"]*)(")', lambda m: m.group(1) + FIL.get(m.group(2), m.group(2)) + m.group(3), t[a:b])
t = t[:a] + bloco + t[b:]
CAM = [('nome: "Rajastão 35", frase:', 'nome: "Cairo 35", frase:'), ('nome: "Bazar 400", frase:', 'nome: "Khalili 400", frase:'),
 ('nome: "Kashi 600", frase:', 'nome: "Luxor 600", frase:'), ('nome: "Super 8 do Ganges", frase:', 'nome: "Super 8 do Nilo", frase:'),
 ('nome: "Delhi 1955", frase:', 'nome: "Cairo 1955", frase:')]
for x, y in CAM: t = t.replace(x, y)
t = re.sub(r'nome: "Agra 1900", frase: "[^"]*"', 'nome: "Burton 1922", frase: "Câmera de campo de madeira com placas de vidro, como a de Harry Burton, que fotografou a tumba de Tutankhamon em 1922. Sépia, grão e bordas escuras."', t, count=1)
t = t.replace('placeholder: "Legenda (ex.: Amanhecer no Ganges)"', 'placeholder: "Legenda (ex.: Amanhecer no Nilo)"')
t = t.replace('["Delhi", "Agra", "Jaipur", "Varanasi", "Rishikesh"].map(c => h("option"', '["Cairo", "Gizé", "Deserto Branco", "Aswan", "Abu Simbel", "Luxor", "Hurghada"].map(c => h("option"')
t = t.replace('(F.cidade || "india").toLowerCase()', '(F.cidade || "egito").toLowerCase()')
ETQ = '''// etiquetas de viagem coladas na tampa da maleta (estilo das malas de expedição dos anos 1920)
function etiquetasEgito() {
  const e = (cls, svg) => { const s = h("span", { class: "etq " + cls, "aria-hidden": "true" }); s.innerHTML = svg; return s; };
  return h("div", { class: "etiquetas-eg" },
    e("e1", `<svg viewBox="0 0 120 80"><ellipse cx="60" cy="40" rx="58" ry="38" fill="#E9D3A0" stroke="#7A2E1A" stroke-width="3"/><ellipse cx="60" cy="40" rx="50" ry="31" fill="none" stroke="#7A2E1A" stroke-width="1.2"/><path d="M38 52 L52 28 L66 52 Z M56 52 L68 33 L80 52 Z" fill="#B5402A"/><text x="60" y="66" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="13" fill="#3A1A0C" letter-spacing="2">CAIRO</text><text x="60" y="22" text-anchor="middle" font-family="Georgia" font-size="7" fill="#3A1A0C" letter-spacing="1.5">EGYPT · 1922</text></svg>`),
    e("e2", `<svg viewBox="0 0 110 80"><rect x="2" y="2" width="106" height="76" rx="6" fill="#2F4F6E" stroke="#E9C46A" stroke-width="3"/><path d="M14 56 Q55 48 96 56" stroke="#7FB2D0" stroke-width="2" fill="none"/><path d="M48 52 L50 22 L68 50 Z" fill="#F3E9D2"/><path d="M40 52 L72 52 L68 57 L44 57 Z" fill="#6B3A1A"/><text x="55" y="72" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="11" fill="#E9C46A" letter-spacing="2">ASWAN · NILO</text></svg>`),
    e("e3", `<svg viewBox="0 0 110 80"><path d="M6 6 H104 V64 L92 74 H18 L6 64 Z" fill="#C9A24E" stroke="#3A1A0C" stroke-width="3"/><rect x="24" y="16" width="8" height="34" fill="#3A1A0C"/><rect x="40" y="16" width="8" height="34" fill="#3A1A0C"/><rect x="56" y="16" width="8" height="34" fill="#3A1A0C"/><rect x="72" y="16" width="8" height="34" fill="#3A1A0C"/><rect x="18" y="12" width="68" height="5" fill="#3A1A0C"/><text x="55" y="64" text-anchor="middle" font-family="Georgia" font-weight="700" font-size="11" fill="#3A1A0C" letter-spacing="2">LUXOR</text></svg>`));
}
'''
if "function etiquetasEgito" not in t:
    t = t.replace("function vEstante() {", ETQ + "function vEstante() {", 1)
    t = t.replace('}, imgFixa(src, "estantefundo"),', '}, imgFixa(src, "estantefundo"), etiquetasEgito(),', 1)
p.write_text(t); print("maleta do Egito")
