"""Monta o conteúdo do app do Egito a partir do roteiro da Vivian (referencias/roteiro-html/).

Gera:
  app/dados/travessia.json       roteiro dia a dia (mesmo formato do app da Índia)
  tools/site/seed.json           cidades, carimbos, saberes e carta final que vão para o banco na 1ª entrada da líder
  app/deuses/*.webp              cartões dos deuses egípcios (papiro)
  app/insignias/*.webp           brasões dos carimbos
  app/img/checks/*.webp          pinos dos "Checks da Travessia"
  app/img/egito-*.webp           passagem, medalhão, mapa da rota e capa do passaporte
  app/img/abertura-*.webp        fundos da abertura de cada dia (fotos do PDF)

Rodar de dentro da pasta APP CARAVANA EGITO:  python3 tools/egito/montar-conteudo.py
"""
import json, re, pathlib, datetime
from PIL import Image

raiz = pathlib.Path(__file__).resolve().parents[2]
ref = raiz / "referencias"
app = raiz / "app"
R = json.loads((ref / "roteiro-html" / "roteiro-egito.json").read_text(encoding="utf-8"))["dias"]
IMG = ref / "roteiro-html" / "imagens"

def webp(origem, destino, larg=None, q=86):
    im = Image.open(origem)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if larg and im.width > larg: im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=q, method=6)

# ---------- artes do roteiro ----------
DEUSES = {"ra": 9, "thoth": 10, "imhotep": 14, "anubis": 15, "osiris": 16, "isis": 22, "hathor": 23, "horus": 25,
          "sobek": 26, "ptah": 27, "amon": 29, "maat": 32, "hatshepsut": 33}
for n, i in DEUSES.items(): webp(IMG / f"img{i:03d}.jpg", app / "deuses" / f"{n}.webp")
INSIGNIAS = {"egito": 36, "cairo": 37, "piramides-gize": 38, "sarcofago-tut": 39, "piramide-khufu": 40, "saqqara": 41,
             "mumias": 42, "sahara": 43, "deserto-branco": 44, "aswan": 45, "rio-nilo": 46, "abu-simbel": 47,
             "luxor": 48, "vale-dos-reis": 49, "mar-vermelho": 50}
for n, i in INSIGNIAS.items(): webp(IMG / f"img{i:03d}.png", app / "insignias" / f"{n}.webp")
CHECKS = {"cairo": 5, "ver-piramides": 6, "sarcofago-tut": 7, "piramide-khufu": 8, "saqqara": 11, "mumias": 12,
          "historias-esquecidas": 13, "deserto-branco": 17, "acampar-sahara": 18, "aswan": 19, "cruzeiro-nilo": 20,
          "abu-simbel": 24, "luxor": 28, "lua-cheia": 30, "rituais": 31, "hurghada": 34, "mar-vermelho": 35}
for n, i in CHECKS.items(): webp(IMG / f"img{i:03d}.jpg", app / "img" / "checks" / f"{n}.webp")
webp(IMG / "img000.png", app / "img" / "egito-passagem.webp", 760)
webp(IMG / "img002.png", app / "img" / "egito-medalhao.webp", 420)
webp(IMG / "img002.png", app / "insignias" / "embarque.webp", 420)  # o carimbo do Embarque é o medalhão da Travessia
webp(IMG / "img003.png", app / "img" / "egito-mapa-rota.webp", 900)
webp(IMG / "img004.jpg", app / "img" / "egito-passaporte.webp", 900)

# fundos da abertura do dia: recortes das fotos do PDF (prints do celular, 1320 px de largura), só onde não há texto
PDF = ref / "pdf-egito-2027"
ABERTURAS = {"cairo": ("pagina-01.png", (0, 1250, 1320, 2550)), "deserto": ("pagina-13.png", (0, 880, 1320, 2195)),
             "aswan": ("pagina-14.png", (0, 1050, 1320, 1780)), "nilo": ("pagina-15.png", (0, 850, 1320, 1240)),
             "luxor": ("pagina-16.png", (0, 1340, 1320, 2030)), "hurghada": ("pagina-17.png", (0, 1390, 1320, 1555)),
             "abusimbel": ("pagina-25.png", (0, 700, 1320, 2790))}
for n, (f, box) in ABERTURAS.items():
    im = Image.open(PDF / f).convert("RGB").crop(box)
    im.save(app / "img" / f"abertura-{n}.webp", "WEBP", quality=84, method=6)

# ---------- roteiro ----------
INICIO = datetime.date(2027, 10, 8)
SEM = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
CIDADE = {1: "Cairo", 2: "Cairo", 3: "Cairo", 4: "Deserto Branco", 5: "Deserto Branco", 6: "Aswan", 7: "Abu Simbel",
          8: "Luxor", 9: "Luxor", 10: "Hurghada", 11: "Hurghada", 12: "Hurghada", 13: "Hurghada"}
ROTA = {1: "Chegada ao Egito", 2: "Gizé", 3: "Saqqara e Cairo", 4: "Cairo → Deserto Branco · 4x4 off-road",
        5: "Deserto Branco → Cairo", 6: "Voo Cairo → Aswan · embarque no cruzeiro", 7: "Abu Simbel e navegação pelo Nilo",
        8: "Navegação pelo Nilo até Luxor", 9: "Luxor · margem oeste e Karnak", 10: "Luxor → Hurghada",
        11: "Mar Vermelho", 12: "Hurghada", 13: "Hurghada → Cairo → Brasil"}
HOTEL = {1: "Hotel em frente às Pirâmides", 2: "Hotel em frente às Pirâmides", 3: "Hotel em frente às Pirâmides",
         4: "Acampamento beduíno no deserto", 5: "Hotel próximo ao aeroporto do Cairo", 6: "Cruzeiro pelo Nilo",
         7: "Cruzeiro pelo Nilo", 8: "Cruzeiro pelo Nilo", 9: "Malkata House, Luxor", 10: "The Makadi Spa · All Inclusive",
         11: "The Makadi Spa · All Inclusive", 12: "The Makadi Spa · All Inclusive", 13: "Voo de volta ao Brasil"}
PINS = {1: ["egito", "cairo"], 2: ["piramides-gize", "sarcofago-tut", "piramide-khufu"], 3: ["saqqara", "mumias"],
        4: ["sahara", "deserto-branco"], 5: [], 6: ["aswan", "rio-nilo"], 7: ["abu-simbel"], 8: ["luxor"],
        9: ["vale-dos-reis"], 10: ["mar-vermelho"], 11: [], 12: [], 13: []}
# o roteiro do app traz só o que acontece para todos: sai o que é opcional ou pago à parte
OPCIONAL = re.compile(r"opcional|pago extra|entrada extra", re.I)
# o fenômeno solar de Abu Simbel é em 21/10, e a caravana passa por lá em 14/10 (confirmar com a Vivian)
TIRAR = [" 21 de outubro de 2027 — você vai estar lá quando isso acontecer."]

def limpo(t):
    for x in TIRAR: t = t.replace(x, "")
    return t.strip()

def separa(nome):
    a, _, b = nome.partition(" · ")
    return a.strip(), b.strip()

dias = []
for d in R:
    n = d["n"]; dt = INICIO + datetime.timedelta(n - 1)
    lugares = []
    for l in d["lugares"]:
        nome, sub = separa(l["nome"])
        lugares.append({"nome": nome, "sub": sub, "texto": limpo(l["texto"]), "dados": l["dados"]})
    D = {"n": n, "iso": dt.isoformat(), "data": f"{SEM[dt.weekday()]} · {dt.day} {MES[dt.month - 1]}",
         "cidade": CIDADE[n], "rota": ROTA[n], "hotel": HOTEL[n], "titulo": d["titulo"], "frase": d["frase"],
         "agenda": [{"periodo": "Programa", "itens": [{"texto": t} for t in d["logistica"] if not OPCIONAL.search(t)]}],
         "lugares": lugares, "cuidados": d["checklist"], "pins": PINS[n]}
    if d.get("cerimonia"):
        c = d["cerimonia"]; D["cerimonia"] = {"titulo": c["titulo"], "quando": c["quando"], "texto": c["texto"]}
    if d.get("deuses"):
        g = d["deuses"]; D["deuses"] = {"intro": g["intro"], "cards": g["cards"], "titulo": g["titulo"], "texto": g["texto"]}
    dias.append(D)
(app / "dados" / "travessia.json").write_text(json.dumps({"dias": dias}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

# ---------- banco: cidades, carimbos, saberes ----------
cidades = {
    "cairo": {"nome": "Cairo", "frase": "O ponto de entrada para tudo aquilo que desafia o tempo", "lat": 30.0444, "lng": 31.2357, "ordem": 1},
    "deserto": {"nome": "Deserto Branco", "frase": "O fundo de um oceano esculpido pelo vento", "lat": 27.3500, "lng": 28.1600, "ordem": 2},
    "aswan": {"nome": "Aswan", "frase": "Onde o Egito encontra a África profunda", "lat": 24.0889, "lng": 32.8998, "ordem": 3},
    "nilo": {"nome": "Rio Nilo", "frase": "O cruzeiro pelo Nilo Sagrado", "lat": 24.4521, "lng": 32.9284, "ordem": 4},
    "luxor": {"nome": "Luxor", "frase": "Terra dos Faraós e da Vida após a Morte", "lat": 25.6872, "lng": 32.6396, "ordem": 5},
    "hurghada": {"nome": "Hurghada", "frase": "O Mar Vermelho, rota do mundo antigo", "lat": 27.2579, "lng": 33.8116, "ordem": 6},
}
L = lambda nome, cid, dia, ordem, lat, lng, busca, desc, dica, cod: {"nome": nome, "cidadeId": cid, "dia": dia, "ordem": ordem,
    "lat": lat, "lng": lng, "busca": busca, "descricao": desc, "dica": dica, "codigo": cod, "aberto": False}
locais = {
    "egito": L("Egito", "cairo", 1, 1, 29.9773, 31.1325, "Giza Pyramids", "Terra dos Faraós. Aqui começa a Travessia do Velho Mundo.", "O primeiro carimbo chega na abertura da caravana.", "ankh"),
    "cairo": L("Cairo", "cairo", 1, 1.5, 30.0444, 31.2357, "Cairo", "Onde o antigo encontra o eterno: 5.000 anos de história do lado de fora.", "A cidade que nunca dorme.", "cairo"),
    "piramides-gize": L("Pirâmides de Gizé", "cairo", 2, 2, 29.9792, 31.1342, "Pyramids of Giza", "A única das Sete Maravilhas do Mundo Antigo que ainda existe.", "O maior enigma da Terra.", "khufu"),
    "sarcofago-tut": L("Sarcófago de Tutankhamon", "cairo", 2, 2.3, 29.9946, 31.1189, "Grand Egyptian Museum", "A coleção completa de Tutankhamon, reunida pela primeira vez no Grande Museu Egípcio.", "O tesouro do faraó menino.", "tut"),
    "piramide-khufu": L("Pirâmide de Khufu", "cairo", 2, 2.6, 29.9792, 31.1342, "Great Pyramid of Giza", "Entrar dentro do maior mistério da humanidade.", "Por dentro da Grande Pirâmide.", "queops"),
    "saqqara": L("Saqqara", "cairo", 3, 3, 29.8713, 31.2165, "Pyramid of Djoser Saqqara", "A primeira pirâmide da humanidade, obra de Imhotep.", "Onde tudo começou.", "imhotep"),
    "mumias": L("Múmias Reais", "cairo", 3, 3.5, 30.0083, 31.2481, "National Museum of Egyptian Civilization", "Os faraós face a face, no Museu Nacional da Civilização Egípcia.", "Ver múmias reais diante dos olhos.", "ramses"),
    "sahara": L("Deserto do Sahara", "deserto", 4, 4, 28.3500, 28.8600, "Bahariya Oasis", "Mar de areia e silêncio: a noite mais estrelada da sua vida.", "Acampar no estilo beduíno.", "beduino"),
    "deserto-branco": L("Deserto Branco", "deserto", 4, 4.5, 27.3500, 28.1600, "White Desert National Park", "Natureza esculpida pelo tempo: o fundo de um oceano que secou.", "Os cogumelos de pedra branca.", "fennec"),
    "aswan": L("Aswan", "aswan", 6, 6, 24.0254, 32.8843, "Philae Temple", "Porta do Nilo e do tempo, no território de Ísis.", "A ilha de Philae.", "isis"),
    "rio-nilo": L("Rio Nilo", "nilo", 6, 6.5, 24.4521, 32.9284, "Kom Ombo Temple", "Cruzeiro pelo Rio Sagrado, entre templos e milênios.", "Navegar como os faraós.", "nilo"),
    "abu-simbel": L("Abu Simbel", "aswan", 7, 7, 22.3372, 31.6258, "Abu Simbel Temples", "Esculpido na pedra há milênios pelos colossos de Ramsés II.", "Quatro gigantes guardam a fronteira sul.", "ramses2"),
    "luxor": L("Luxor", "luxor", 8, 8, 25.6995, 32.6391, "Luxor Temple", "Terra dos Faraós: a antiga Tebas.", "O templo iluminado à noite.", "tebas"),
    "vale-dos-reis": L("Vale dos Reis", "luxor", 9, 9, 25.7402, 32.6014, "Valley of the Kings", "Onde os faraós descansam para a eternidade.", "Tumbas escavadas na montanha.", "faraos"),
    "mar-vermelho": L("Mar Vermelho", "hurghada", 10, 10, 26.9900, 33.9000, "Makadi Bay Hurghada", "O mar sagrado do Oriente e o azul mais claro que você já viu.", "Depois de templos e desertos, o mar.", "punt"),
}
# saber de cada "Por que esse lugar é único": vai para o carimbo do dia, ou para o carimbo do assunto
SABER_LOCAL = {1: "cairo", 2: "piramides-gize", 3: "saqqara", 4: "deserto-branco", 5: "deserto-branco", 6: "aswan", 7: "abu-simbel",
               8: "luxor", 9: "vale-dos-reis", 10: "mar-vermelho", 11: "mar-vermelho", 12: "mar-vermelho", 13: "egito"}
ASSUNTO = [(r"Tutankhamon|Tut ", "sarcofago-tut"), (r"Livro dos Mortos|mumifica", "mumias"), (r"Khan|cheiro do Khan", "cairo"),
           (r"Feluca|feluca|Nilo e o calend", "rio-nilo"), (r"Kom Ombo|crocodilos|2\.000 divindades", "rio-nilo"),
           (r"Edfu|charrete", "rio-nilo"), (r"Hatshepsut|Punt|Deir el-Bahari|apagamento", "luxor"), (r"raposa|beduínos", "sahara")]
def slug(t):
    import unicodedata
    t = unicodedata.normalize("NFD", t).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:48]
def resumo(t):
    p = re.split(r"(?<=[.!?])\s", t, maxsplit=1)[0]
    return p if len(p) <= 140 else p[:137].rsplit(" ", 1)[0] + "…"
FONTE = "Roteiro da Travessia do Velho Mundo · Caravana do Céu, 2027."
ens = {}
for d in R:
    for i, u in enumerate(d["unicos"]):
        loc = SABER_LOCAL[d["n"]]
        for pad, alvo in ASSUNTO:
            if re.search(pad, u["titulo"]): loc = alvo; break
        texto = limpo(u["texto"])
        ens[slug(u["titulo"])] = {"titulo": u["titulo"], "resumo": resumo(texto), "texto": texto, "localId": loc,
                                  "ordem": d["n"] + i / 10, "categoria": "Saberes da travessia", "fonte": FONTE}
    if d.get("deuses"):
        g = d["deuses"]; primeiro = slug(g["cards"][0]["nome"])
        ens["deuses-" + slug(g["titulo"])] = {"titulo": g["titulo"], "resumo": g["intro"], "texto": g["texto"], "ordem": 20 + d["n"],
            "categoria": "Mapa dos Deuses", "fonte": FONTE, "figura": f"deuses/{primeiro}.webp"}
cartas = {"final": {"titulo": "A última página da travessia", "local": "Hurghada", "assinatura": "Caravana do Céu", "rascunho": True,
    "envio": int(datetime.datetime(2027, 10, 20, 7, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=3))).timestamp() * 1000),
    "ts": int(datetime.datetime(2026, 10, 15).timestamp() * 1000),
    "texto": "RASCUNHO PARA A VIVIAN ESCREVER.\n\nA Caravana do Céu não é apenas uma viagem. É um chamado. E você ouviu.\n\n\"Explorando nossa origem nos damos conta de que somos infinitos.\""}}
seed = {"cidades": cidades, "locais": locais, "ensinamentos": ens, "cartas": cartas}
(raiz / "tools" / "site" / "seed.json").write_text(json.dumps(seed, ensure_ascii=False), encoding="utf-8")
print(len(dias), "dias ·", len(locais), "carimbos ·", len(ens), "saberes ·", len(DEUSES), "deuses")
