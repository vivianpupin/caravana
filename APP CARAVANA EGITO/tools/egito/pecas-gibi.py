"""Recorta peças das artes do gibi (selos, bússola, etiqueta do Cairo, asas, polaroides, citação)
para usar como botões e enfeites no app. Bordas suaves em vez de recorte quadrado."""
import pathlib
from PIL import Image, ImageDraw, ImageFilter
raiz = pathlib.Path(__file__).resolve().parents[2]
C = raiz / "referencias" / "comics"; OUT = raiz / "app" / "img" / "pecas"; OUT.mkdir(parents=True, exist_ok=True)

def peca(arq, box, nome, forma="ret", raio=18, borda=8, rot=0, larg=None):
    im = Image.open(C / arq).convert("RGBA").crop(box)
    m = Image.new("L", im.size, 0); d = ImageDraw.Draw(m); b = borda
    if forma == "elipse": d.ellipse((b, b, im.width - b, im.height - b), fill=255)
    else: d.rounded_rectangle((b, b, im.width - b, im.height - b), raio, fill=255)
    im.putalpha(m.filter(ImageFilter.GaussianBlur(borda / 2.5)))
    if rot: im = im.rotate(rot, expand=True, resample=Image.BICUBIC)
    if larg: im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    im.save(OUT / f"{nome}.webp", "WEBP", quality=90, method=6)

peca("comic-05.png", (22, 934, 286, 1182), "selo-caravaneer", raio=14, borda=6, larg=360)
peca("comic-05.png", (30, 1200, 228, 1400), "bussola", forma="elipse", borda=6, larg=260)
peca("comic-05.png", (612, 1350, 806, 1494), "etiqueta-cairo", raio=10, borda=5, larg=280)
peca("comic-05.png", (280, 236, 680, 306), "asas-sol", raio=30, borda=10, larg=560)
peca("comic-05.png", (400, 1425, 590, 1505), "asas-escaravelho", raio=26, borda=10, larg=300)
peca("comic-05.png", (196, 296, 828, 386), "faixa-cairo", raio=6, borda=4, larg=700)
peca("comic-05.png", (486, 1040, 808, 1468), "polaroid-esfinge", raio=8, borda=5, larg=380)
peca("comic-05.png", (764, 1096, 1016, 1508), "polaroid-cairo", raio=8, borda=5, larg=320)
peca("comic-05.png", (190, 1172, 520, 1430), "citacao", raio=30, borda=14, larg=440)
peca("comic-03.png", (850, 400, 990, 540), "bussola-2", forma="elipse", borda=5, larg=220)
for k, y in enumerate([150, 230, 310, 390, 470, 550, 630], 1):
    peca("comic-03.png", (34, y, 96, y + 64), f"icone-{k}", forma="elipse", borda=3, larg=128)
peca("comic-03.png", (90, 92, 290, 132), "asas-roteiro", raio=20, borda=8, larg=400)
print("ok")
