"""Recorta os 15 patches do passaporte da folha da Vivian (referencias/passaporte/patches-egito.png),
com o fundo preto de fora do contorno transparente, e grava em app/insignias/*.webp."""
import pathlib
from collections import deque
import numpy as np
from PIL import Image

raiz = pathlib.Path(__file__).resolve().parents[2]
NOMES = ["egito", "cairo", "piramides-gize", "sarcofago-tut", "piramide-khufu", "saqqara", "mumias", "sahara",
         "deserto-branco", "aswan", "rio-nilo", "abu-simbel", "luxor", "vale-dos-reis", "mar-vermelho"]

def faixas(v, minimo):
    out, s = [], None
    for i, x in enumerate(list(v) + [False]):
        if x and s is None: s = i
        if not x and s is not None:
            if i - s >= minimo: out.append((s, i))
            s = None
    return out

def sem_fundo(p):
    arr = np.asarray(p.convert("RGBA")).copy(); escuro = arr[:, :, :3].sum(2) < 45
    h, w = escuro.shape; vis = np.zeros((h, w), bool); q = deque()
    for y in range(h):
        for x in range(w):
            if (y in (0, h - 1) or x in (0, w - 1)) and escuro[y, x]: vis[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and escuro[ny, nx] and not vis[ny, nx]: vis[ny, nx] = True; q.append((ny, nx))
    arr[vis, 3] = 0
    im = Image.fromarray(arr); return im.crop(im.getbbox())

im = Image.open(raiz / "referencias" / "passaporte" / "patches-egito.png").convert("RGB")
m = np.asarray(im).astype(int).sum(2) > 60
k = 0
for y0, y1 in faixas(m.any(1), 150):
    for x0, x1 in faixas(m[y0:y1].any(0), 150):
        sem_fundo(im.crop((x0, y0, x1, y1))).save(raiz / "app" / "insignias" / f"{NOMES[k]}.webp", "WEBP", quality=90, method=6); k += 1
assert k == 15, k
