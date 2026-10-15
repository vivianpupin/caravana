"""Capa do gibi: a arte original da Vivian (a menina com a tocha, referencias/comics/comic-02.png) com o
título "AS AVENTURAS DA / CARAVANA DO CÉU" no lugar do nome antigo, letrado no mesmo estilo (amarelo com
contorno escuro e sombra 3D). Fonte: Bangers (npm @fontsource/bangers), caminho no 1º argumento."""
import pathlib, sys, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

raiz = pathlib.Path(__file__).resolve().parents[2]
FONTE = sys.argv[1]
im = Image.open(raiz / "referencias" / "comics" / "comic-02.png").convert("RGB")
W, H = im.size
# 1) apaga o título antigo: céu refeito com o próprio céu borrado + textura de papel
box = (40, 168, W - 40, 442)
reg = im.crop(box)
ceu = reg.filter(ImageFilter.MedianFilter(61)).filter(ImageFilter.GaussianBlur(18))
rng = np.random.default_rng(3)
ruido = (rng.normal(0, 9, (ceu.height, ceu.width, 1)).repeat(3, 2))
ceu = Image.fromarray(np.clip(np.asarray(ceu).astype(float) + ruido, 0, 255).astype("uint8"))
mask = Image.new("L", reg.size, 0); ImageDraw.Draw(mask).rounded_rectangle((14, 6, reg.width - 14, reg.height - 6), 30, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(10))
im.paste(ceu, box[:2], mask)

# 2) letreiro: cada linha com degradê amarelo, contorno escuro e sombra 3D, inclinado
def letreiro(texto, tam, cy, inclina=-6, escala_x=1.0):
    f = ImageFont.truetype(FONTE, tam)
    bb = f.getbbox(texto); tw, th = bb[2] - bb[0], bb[3] - bb[1]
    pad = 40; L = Image.new("L", (tw + pad * 2, th + pad * 2), 0)
    ImageDraw.Draw(L).text((pad - bb[0], pad - bb[1]), texto, font=f, fill=255)
    if escala_x != 1: L = L.resize((int(L.width * escala_x), L.height), Image.LANCZOS)
    cont = L.filter(ImageFilter.MaxFilter(9))
    grad = Image.new("RGB", L.size)
    g = np.zeros((L.height, L.width, 3))
    for y in range(L.height):
        t = (y - pad) / max(1, th)
        t = min(1, max(0, t))
        a, b = np.array([252, 228, 138]), np.array([214, 140, 34])
        g[y] = a * (1 - t) + b * t
    grad = Image.fromarray(g.astype("uint8"))
    camada = Image.new("RGBA", L.size, (0, 0, 0, 0))
    for k in range(10, 0, -1):  # sombra 3D descendo para a direita
        sh = Image.new("RGBA", L.size, (24, 16, 8, 255)); camada.paste(sh, (k, k), cont)
    camada.paste(Image.new("RGBA", L.size, (24, 16, 8, 255)), (0, 0), cont)
    camada.paste(grad, (0, 0), L)
    # brilho fino em cima de cada letra
    camada = camada.transform(camada.size, Image.AFFINE, (1, -inclina / 60, 0, 0, 1, 0), Image.BICUBIC)
    camada = camada.rotate(-inclina / 3, expand=True, resample=Image.BICUBIC)
    x = (W - camada.width) // 2; y = int(cy - camada.height / 2)
    im.paste(camada, (x, y), camada)

letreiro("AS AVENTURAS DA", 74, 222)
letreiro("CARAVANA DO CÉU", 150, 328, escala_x=.86)

# 3) textura de papel envelhecido por cima do letreiro, para não parecer colado
papel = Image.open(raiz / "referencias" / "comics" / "comic-02.png").convert("RGB").crop(box).convert("L").filter(ImageFilter.GaussianBlur(1))
reg2 = im.crop(box); reg2 = ImageChops.multiply(reg2, Image.merge("RGB", [papel.point(lambda v: 200 + v * 55 // 255)] * 3))
im.paste(reg2, box[:2], mask)
out = raiz / "app" / "img" / "gibi" / "p01-capa.webp"
im = im.crop((22, 26, 1002, 1514)); im = im.resize((1100, round(im.height * 1100 / im.width)), Image.LANCZOS)
im.save(out, "WEBP", quality=88, method=6); print("ok", out)
