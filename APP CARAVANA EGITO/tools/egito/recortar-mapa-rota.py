# Recorta o mapa "a rota da Caravana" do print do material (referencias/mapa-game/mapa-rota-caravana-pdf.png)
# mantendo EXATAMENTE as bordas rasgadas originais (em cima e embaixo) e os lados retos do slide.
# Tira o título "a rota da Caravana", o selo do canto e a barra de rolagem do print, cobrindo com papel liso do próprio mapa.
import pathlib
import numpy as np
from PIL import Image
from scipy import ndimage
raiz = pathlib.Path(__file__).resolve().parents[2]
im = Image.open(raiz / "referencias/mapa-game/mapa-rota-caravana-pdf.png").convert("RGB")
a = np.asarray(im, float)[374:1660].copy(); H, W = a.shape[:2]   # 374: primeira linha do slide do mapa
yy, xx = np.mgrid[0:H, 0:W]
pat = a[522:632, 420:530].copy()
lin = np.concatenate([pat, pat[:, ::-1]], axis=1); bloco = np.concatenate([lin, lin[::-1]], axis=0)
camada = np.tile(bloco, (int(np.ceil(H / bloco.shape[0])), int(np.ceil(W / bloco.shape[1])), 1))[:H, :W]
rgb = a; claro = (rgb.mean(2) > 215) & ((rgb.max(2) - rgb.min(2)) < 40) & (xx > 830) & (xx < 1260) & (yy > 80) & (yy < 220)
titulo = ndimage.binary_dilation(claro, iterations=14)
alvo = (((xx - 1258) ** 2 + (yy - 73) ** 2 < 54 ** 2) | ((xx >= W - 30) & (yy < 150)) | titulo).astype(float)
peso = np.clip(ndimage.gaussian_filter(alvo, 7) * 1.7, 0, 1)[..., None]
a = a * (1 - peso) + camada * peso
lum = a.mean(2)
lab, n = ndimage.label(lum < 72)
ids = set(np.unique(np.concatenate([lab[0], lab[-1]]))) - {0}; tam = np.bincount(lab.ravel())
fundo = np.isin(lab, [i for i in ids if tam[i] > 3000])          # só o fundo escuro de cima e de baixo
m = ndimage.binary_opening(~fundo, iterations=1)
lab2, _ = ndimage.label(m); m = ndimage.binary_fill_holes(lab2 == np.argmax(np.bincount(lab2.ravel())[1:]) + 1)
alpha = ndimage.gaussian_filter(m.astype(float), .8) * 255
Image.fromarray(np.dstack([np.clip(a, 0, 255).astype("uint8"), alpha.clip(0, 255).astype("uint8")]), "RGBA").crop((0, 0, 1320, 1242)).save(raiz / "app/img/mapa-rota.webp", "WEBP", quality=92)
print("ok")
