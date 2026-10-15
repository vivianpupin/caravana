"""Primeira troca do app: datas, fuso, cidades, hotéis, carimbos e aberturas da Índia viram os do Egito.
Cada troca confere se o trecho original existe (se o código mudar, o script avisa em vez de estragar).
Rodar de dentro da pasta APP CARAVANA EGITO:  python3 tools/egito/trocar-india-por-egito.py
"""
import json, pathlib, re

raiz = pathlib.Path(__file__).resolve().parents[2]
arq = raiz / "app" / "caravana-do-ceu.html"
t = arq.read_text(encoding="utf-8")
R = json.loads((raiz / "app" / "dados" / "travessia.json").read_text(encoding="utf-8"))["dias"]

def troca(velho, novo, todas=False):
    global t
    n = t.count(velho)
    if n == 0:
        if novo in t: return  # já trocado
        raise SystemExit("não achei: " + velho[:90])
    if n > 1 and not todas: raise SystemExit(f"{n} ocorrências: " + velho[:90])
    t = t.replace(velho, novo)

def troca_bloco(inicio, fim, novo):
    global t
    i = t.find(inicio)
    if i < 0:
        if novo.split("\n")[0] in t: return
        raise SystemExit("não achei bloco: " + inicio[:90])
    j = t.find(fim, i) + len(fim)
    t = t[:i] + novo + t[j:]

# datas e fuso: 08 a 20/10/2027, horário do Cairo (UTC+3 em outubro de 2027)
troca('"2026-11-04"', '"2027-10-08"', True)
troca('"2026-11-16"', '"2027-10-20"', True)
troca("2026-11-04T00:00:00+05:30", "2027-10-08T00:00:00+03:00", True)
troca('T${hr.value || "07:00"}:00+05:30`', 'T${hr.value || "07:00"}:00+03:00`')
troca("2026-11-16T07:00:00+05:30", "2027-10-20T07:00:00+03:00", True)
troca('"Asia/Kolkata"', '"Africa/Cairo"', True)
troca("timezone=Asia%2FKolkata", "timezone=Africa%2FCairo", True)
troca('"Agora na Índia"', '"Agora no Egito"')
troca("// o último selo (Travessia) se completa sozinho no dia do translado, 16/11", "// o último selo (Travessia) se completa sozinho no último dia, 20/10")
troca('<span>Índia Sagrada · 2026</span>', '<span>Travessia do Velho Mundo · 2027</span>')

# carimbos: só fica o Embarque como extra; os do Egito vêm do banco (tools/site/seed.json)
troca_bloco("const EXTRAS = [", "\n];\n", '''const EXTRAS = [
  // o primeiro carimbo: cada pessoa ganha o seu ao completar as missões de preparação, antes de viajar
  { id: "embarque", nome: "Embarque", insignia: "embarque", cidadeId: "", dia: 0, ordem: 0, aberto: false, preparo: true,
    descricao: "O primeiro carimbo do passaporte, de quem se preparou para a Travessia do Velho Mundo: passaporte emitido, explorador montado, intenção guardada e lugar garantido na Caravana.", dica: "Complete as missões de preparação, na tela inicial, para ganhar este carimbo." }
];
''')
troca('const REMOVIDOS = ["galta-ji", "beatles-ashram"];', 'const REMOVIDOS = [];')
troca('const SABERES_REMOVIDOS = ["beatles"];', 'const SABERES_REMOVIDOS = [];')
t = re.sub(r'const SABERES_AJUSTES = \{ "senhor-sentidos".*?\n', 'const SABERES_AJUSTES = {};\n', t, count=1)

# cidades, siglas e hotéis do Egito
troca_bloco("const COORD_CIDADE = {", "};\n", 'const COORD_CIDADE = { cairo: [30.0444, 31.2357, "Cairo"], deserto: [27.35, 28.16, "Deserto Branco"], aswan: [24.0889, 32.8998, "Aswan"], nilo: [24.4521, 32.9284, "Rio Nilo"], luxor: [25.6872, 32.6396, "Luxor"], hurghada: [27.2579, 33.8116, "Hurghada"] };\n')
troca_bloco("const SIGLA = {", "};\n", 'const SIGLA = { cairo: "CAI", deserto: "WDS", aswan: "ASW", nilo: "NIL", luxor: "LXR", hurghada: "HRG" };\n')
troca_bloco("const HOTEIS = {", "\n};\n", '''const HOTEIS = {
  // nomes e endereços a confirmar com a operadora (o roteiro só cita o Malkata House e o The Makadi Spa)
  "Hotel em frente às Pirâmides": { en: "Hotel facing the Giza Pyramids", end: "Giza, Cairo", ar: "", cid: "cairo" },
  "Hotel próximo ao aeroporto do Cairo": { en: "Hotel near Cairo International Airport", end: "Cairo", ar: "", cid: "cairo" },
  "Malkata House, Luxor": { en: "Malkata House", end: "West Bank, Luxor", ar: "", cid: "luxor" },
  "The Makadi Spa · All Inclusive": { en: "The Makadi Spa Hotel", end: "Makadi Bay, Hurghada", ar: "", cid: "hurghada" }
};
''')
troca('return d && HOTEIS[d.hotel] ? d.hotel : "The Lalit New Delhi";', 'return d && HOTEIS[d.hotel] ? d.hotel : "Hotel em frente às Pirâmides";')
troca('h("p", { class: "mhi", lang: "hi", text: "कृपया मुझे यहाँ ले चलिए" }),', 'h("p", { class: "mhi", lang: "ar", dir: "rtl", text: "من فضلك خذني إلى هنا" }),')
troca('h("p", { class: "mhi2", lang: "hi", text: H.hi })', 'H.ar ? h("p", { class: "mhi2", lang: "ar", dir: "rtl", text: H.ar }) : null')
troca('text: "Vire a tela para o motorista. Em hindi: “Por favor, me leve até aqui”." }', 'text: "Vire a tela para o motorista. Em árabe: “Por favor, me leve até aqui”." }')

# carimbos do fundo do passaporte
troca_bloco("const CARIMBOS_FUNDO = [", "\n];\n", '''const CARIMBOS_FUNDO = [
  { t: ["ENTRADA · ARRIVAL", "CAIRO", "08 OUT 2027"], cor: "#2F4F8A", f: "ret", r: -12 },
  { t: ["IMMIGRATION", "EGYPT", "VISTO · VISA"], cor: "#A8281B", f: "chanfro", r: 8 },
  { t: ["GIZÉ", "PIRÂMIDES"], cor: "#5B3F7A", f: "ret2", r: -4 },
  { t: ["WHITE DESERT", "SAHARA", "11 OUT"], cor: "#A8281B", f: "chanfro", r: 14 },
  { t: ["ASWAN", "RIO NILO", "13 OUT 2027"], cor: "#2F4F8A", f: "ret", r: -9 },
  { t: ["CARAVANA DO CÉU", "✦ VISTO ✦"], cor: "#3F6B4A", f: "ret2", r: 5, simb: 1 },
  { t: ["LUXOR", "TEBAS", "VALE DOS REIS"], cor: "#5B3F7A", f: "chanfro", r: -15 },
  { t: ["SAÍDA · DEPARTURE", "CAIRO", "20 OUT 2027"], cor: "#A8281B", f: "ret", r: 10 }
];
''')

# passaporte
troca('"CDC26IN"', '"CDC27EG"')
troca('"<<INDIA<SAGRADA"', '"<<VELHO<MUNDO"')
troca('"P<CDC<INDIA<<"', '"P<CDC<EGITO<<"')

# selos nas fotos e nos adesivos
troca_bloco("const SELOS_COLECAO = [", "];\n", 'const SELOS_COLECAO = ["embarque", "egito", "cairo", "piramides-gize", "sarcofago-tut", "piramide-khufu", "saqqara", "mumias", "sahara", "deserto-branco", "aswan", "rio-nilo", "abu-simbel", "luxor", "vale-dos-reis", "mar-vermelho"];\n')
troca_bloco("const PATCH_CIDADE = {", "};\n", 'const PATCH_CIDADE = { Cairo: "cairo", "Deserto Branco": "deserto-branco", Aswan: "aswan", "Abu Simbel": "abu-simbel", Luxor: "luxor", Hurghada: "mar-vermelho" };\n')
t = re.sub(r'"Selos": \[\["india", "Índia"\].*?\]\]\.map', '"Selos": [["egito", "Egito"], ["cairo", "Cairo"], ["piramides-gize", "Pirâmides de Gizé"], ["sarcofago-tut", "Sarcófago de Tutankhamon"], ["piramide-khufu", "Pirâmide de Khufu"], ["saqqara", "Saqqara"], ["mumias", "Múmias Reais"], ["sahara", "Deserto do Sahara"], ["deserto-branco", "Deserto Branco"], ["aswan", "Aswan"], ["rio-nilo", "Rio Nilo"], ["abu-simbel", "Abu Simbel"], ["luxor", "Luxor"], ["vale-dos-reis", "Vale dos Reis"], ["mar-vermelho", "Mar Vermelho"]].map', t, count=1, flags=re.S)

# abertura do dia: foto do lugar e a frase de cada dia do roteiro
troca('const cid = ["Delhi", "Agra", "Jaipur", "Varanasi", "Rishikesh"].find(k => String(d.cidade || "").includes(k));',
      'const cid = ({ "Cairo": "Cairo", "Deserto Branco": "Deserto", "Aswan": "Aswan", "Abu Simbel": "AbuSimbel", "Luxor": "Luxor", "Hurghada": "Hurghada" })[d.cidade];')
frases = ",\n".join(f"  {d['n']}: {json.dumps(d['frase'], ensure_ascii=False)}" for d in R)
troca_bloco("const FRASES_DIA = {", "\n};\n", "const FRASES_DIA = {\n" + frases + "\n};\n")
troca('--abimg:url(img/abertura-varanasi.webp)', '--abimg:url(img/abertura-cairo.webp)')
troca('background:url(img/abertura-agra.webp) 50% 35%/cover', 'background:url(img/abertura-cairo.webp) 50% 35%/cover')

# cidade do dia → cidade do mapa e do tempo (Abu Simbel fica perto de Aswan); sem dia: Cairo
troca('const id = d ? norm(d.cidade.split(" ")[0]) : "delhi", c = COORD_CIDADE[id] || COORD_CIDADE.delhi;',
      'const c = cidadeDoDia(d || { cidade: "Cairo" });')
troca('const cidadeDoDia = d => COORD_CIDADE[norm(String(d.cidade).split(/[ ·→]/)[0])] || COORD_CIDADE.delhi;',
      'const CIDADE_DO_DIA = { "cairo": "cairo", "deserto branco": "deserto", "aswan": "aswan", "abu simbel": "aswan", "luxor": "luxor", "hurghada": "hurghada" };\nfunction cidadeDoDia(d) { return COORD_CIDADE[CIDADE_DO_DIA[norm(d && d.cidade)]] || COORD_CIDADE.cairo; }')
troca('|| COORD_CIDADE.delhi; return { lat: c[0], lng: c[1] }; }', '|| COORD_CIDADE.cairo; return { lat: c[0], lng: c[1] }; }')
# patch de selo nas fotos: Egito + Caravana
troca('["india", "Índia + Caravana"]', '["india", "Egito + Caravana"]')
troca('const lugar = PATCH_CIDADE[F.cidade] || "india";', 'const lugar = PATCH_CIDADE[F.cidade] || "egito";')
troca('const lista = tipo === "india" && seloLiberado("india") ? ["india", "caravana"] : ["caravana"];', 'const lista = tipo === "india" && seloLiberado("egito") ? ["egito", "caravana"] : ["caravana"];')

# tela inicial: título, linha da rota, diferença de horário e frases que giram
troca('h("h1", null, "Travessia da", h("br"), "Índia Sagrada"),', 'h("h1", null, "Travessia do", h("br"), "Velho Mundo"),')
troca('h("p", { class: "route sa", lang: "sa", text: "लोकाः समस्ताः सुखिनो भवन्तु" }),', 'h("p", { class: "route", text: "Cairo · Deserto Branco · Aswan · Luxor · Hurghada" }),')
troca('h("span", { text: "Brasília · +8h30" })', 'h("span", { text: "Brasília · +6h" })')
troca('x.fillText("Travessia da", CX, 330); x.fillText("Índia Sagrada", CX, 408);', 'x.fillText("Travessia do", CX, 330); x.fillText("Velho Mundo", CX, 408);')
troca('x.fillText("लोकाः समस्ताः सुखिनो भवन्तु", CX, 470);', 'x.fillText("Egito · 2027", CX, 470);')
for velho, novo in [
    ('"Treze dias no coração espiritual da humanidade."', '"Treze dias atravessando o Egito de norte a sul."'),
    ('"Leva-me da escuridão para a luz."', '"Explorando nossa origem nos damos conta de que somos infinitos."'),
    ('"Um país que nunca parou de rezar."', '"Da mítica Atlântida às escolas iniciáticas do Antigo Egito."'),
    ('"Que todos os seres de todos os mundos sejam felizes.",\n  "Siga a rota', '"De pirâmides, templos, desertos e o icônico Mar Vermelho.",\n  "Siga a rota'),
    ('"Onde o sagrado está vivo nas ruas, nos rios e nos gestos."', '"Um enigma ainda vivo, inscrito nas pedras, nos templos e nos símbolos."'),
    ('"Ninguém volta da Índia do mesmo jeito que foi."', '"Você não volta da Caravana. Você chega em casa diferente."'),
    ('"Quando você se move em direção a si mesmo, está indo em direção a Krishna."', '"O Egito te ensina que o tempo é outra coisa."')]:
    troca(velho, novo)
troca('"Salve o roteiro, as frases em hindi e os saberes abertos num arquivo', '"Salve o roteiro, as frases úteis e os saberes abertos num arquivo')

# rota escrita no passaporte
troca('"DEL · AGR · JAI · VNS · RSK · DEL"', '"CAI · WDS · ASW · NIL · LXR · HRG"', True)
troca('(SIGLA[l.cidadeId] || "IND")', '(SIGLA[l.cidadeId] || "EGY")')

# marcas d'água e textos gravados nas artes (passaporte, retrato, ingresso, adesivos)
troca("ÍNDIA SAGRADA · TRAVESSIA 2026", "VELHO MUNDO · TRAVESSIA 2027", True)
troca('"TRAVESSIA DA ÍNDIA SAGRADA · 2026"', '"TRAVESSIA DO VELHO MUNDO · 2027"')
troca('"CARAVANA DO CÉU · TRAVESSIA DA ÍNDIA SAGRADA · 2026"', '"CARAVANA DO CÉU · TRAVESSIA DO VELHO MUNDO · 2027"')
troca('"ADMIT ONE · ÍNDIA SAGRADA 2026"', '"ADMIT ONE · VELHO MUNDO 2027"')
troca('x.fillText("ÍNDIA SAGRADA"', 'x.fillText("DO VELHO MUNDO"')
troca('"04 — 16 NOV 2026"', '"08 — 20 OUT 2027"')

# logo da Travessia do Velho Mundo (moeda de bronze): tela inicial e abertura de cada dia
troca('h("img", { class: "logo", src: "img/simbolo-marrom.png", alt: "" }),', 'h("img", { class: "logo moeda", src: "img/logo-egito-240.png", alt: "Caravana do Céu · Travessia do Velho Mundo" }),')
troca('.hero .logo{width:56px;height:auto}', '.hero .logo{width:56px;height:auto}\n.hero .logo.moeda{width:112px;border-radius:50%;box-shadow:0 10px 26px rgba(40,25,10,.35)}')
troca('.absimb{width:74px;height:auto;', '.absimb.moeda{width:110px;border-radius:50%}\n.absimb{width:74px;height:auto;')
troca('h("img", { class: "absimb", src: "img/simbolo-dourado.png", alt: "" }),', 'h("img", { class: "absimb moeda", src: "img/logo-egito-240.png", alt: "" }),', True)

# tema gibi: entra depois do visual da Índia (tools/egito/tema-gibi.css) e carrega as letras de gibi
css = (raiz / "tools" / "egito" / "tema-gibi.css").read_text(encoding="utf-8")
if "<style id=\"tema-gibi\">" in t:
    i = t.index("<style id=\"tema-gibi\">"); j = t.index("</style>", i) + len("</style>")
    t = t[:i] + "<style id=\"tema-gibi\">\n" + css + "</style>" + t[j:]
else:
    i = t.index("</style>") + len("</style>")
    t = t[:i] + "\n<style id=\"tema-gibi\">\n" + css + "</style>" + t[i:]
if "family=Bangers" not in t:
    troca('<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&family=Special+Elite&display=swap">')

arq.write_text(t, encoding="utf-8")
print("ok")
