"""Monta as páginas do gibi (app/img/gibi/) a partir das artes da Vivian em referencias/comics/,
sem o nome antigo "Caravanegita": recorta as páginas e reletra só as legendas que tinham o nome,
com uma letra de gibi parecida (PT Sans Narrow Bold), sobre o próprio papel da legenda."""
import pathlib, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

raiz = pathlib.Path(__file__).resolve().parents[2]
C = raiz / "referencias" / "comics"; OUT = raiz / "app" / "img" / "gibi"; OUT.mkdir(parents=True, exist_ok=True)
FONTE = sys.argv[1] if len(sys.argv) > 1 else "pt-sans-narrow-latin-700-normal.woff"
TINTA = (30, 22, 12)

def grande(im, larg=1100):
    k = larg / im.width
    return im.resize((larg, round(im.height * k)), Image.LANCZOS), k

def reletra(im, caixa, linha, texto, tam, k=1):
    caixa = tuple(round(v * k) for v in caixa); linha = tuple(round(v * k) for v in linha); tam = round(tam * k)
    """caixa: interior da legenda (para tirar o papel de fundo); linha: faixa do texto a trocar."""
    papel = im.crop(caixa).filter(ImageFilter.MedianFilter(31)).filter(ImageFilter.GaussianBlur(4))
    x0, y0, x1, y1 = linha
    im.paste(papel.crop((x0 - caixa[0], y0 - caixa[1], x1 - caixa[0], y1 - caixa[1])), (x0, y0))
    camada = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(camada)
    f = ImageFont.truetype(FONTE, tam, layout_engine=ImageFont.Layout.BASIC); bb = d.textbbox((0, 0), texto, font=f)
    d.text((x0, (y0 + y1) / 2 - (bb[1] + bb[3]) / 2), texto, font=f, fill=TINTA + (255,))
    im.alpha_composite(camada.filter(ImageFilter.GaussianBlur(.5)))

def sem_margem(im):
    # corta a borda lisa de papel em volta dos quadros (no app a página ocupa o livro todo, sem folga)
    import numpy as np
    a = np.asarray(im.convert("L"), float); cs, rs = a.std(0), a.std(1)
    pri = lambda v: next((i for i, x in enumerate(v) if x > 18), 0)
    l, r, t, b = pri(cs), pri(cs[::-1]), pri(rs), pri(rs[::-1])
    return im.crop((l + 4 if l else 0, t + 4 if t else 0, im.width - (r + 4 if r else 0), im.height - (b + 4 if b else 0)))

def salva(im, nome, larg=1100):
    im = sem_margem(im.convert("RGB"))
    if im.width < larg: im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    im.save(OUT / nome, "WEBP", quality=88, method=6)

# capa provisória: "As Aventuras da Caravana do Céu · Um dia no coração do Cairo" (não tem o nome antigo)
salva(Image.open(C / "comic-05.png").convert("RGBA"), "p01-capa.webp")
# Capítulo 1 e Capítulo 2 (da folha com o tríptico), sem a faixa de baixo de venda
folha = Image.open(C / "comic-03.png").convert("RGBA")
cap1, k = grande(folha.crop((8, 795, 507, 1480)))
reletra(cap1, (26, 470, 166, 556), (28, 486, 166, 501), "DA CARAVANA...", 14, k)
salva(cap1, "p02-capitulo-1.webp")
salva(folha.crop((514, 795, 1016, 1480)), "p03-capitulo-2.webp")
# Dia 1 no Cairo: sem o cabeçalho com o nome antigo; legenda da hospedaria reletrada
dia1, k = grande(Image.open(C / "comic-04.png").convert("RGBA").crop((30, 212, 994, 1515)))
reletra(dia1, (493, 18, 815, 90), (505, 51, 800, 67), "A VIAJANTE ENCONTRA UM MAPA ANTIGO.", 17, k)
salva(dia1, "p04-dia-1.webp")
print("ok")
