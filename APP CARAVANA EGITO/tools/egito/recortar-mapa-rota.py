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
alvo = (((xx - 1258) ** 2 + (yy - 73) ** 2 < 54 ** 2) | ((xx - 643) ** 2 + (yy - 131) ** 2 < 30 ** 2) |  # selo do canto e o símbolo branco solto no rio
         ((xx >= W - 30) & (yy < 150)) | titulo).astype(float)
peso = np.clip(ndimage.gaussian_filter(alvo, 7) * 1.7, 0, 1)[..., None]
a = a * (1 - peso) + camada * peso
lum = a.mean(2)
lab, n = ndimage.label(lum < 72)
ids = set(np.unique(np.concatenate([lab[0], lab[-1]]))) - {0}; tam = np.bincount(lab.ravel())
fundo = np.isin(lab, [i for i in ids if tam[i] > 3000])          # só o fundo escuro de cima e de baixo
m = ndimage.binary_opening(~fundo, iterations=1)
lab2, _ = ndimage.label(m); m = ndimage.binary_fill_holes(lab2 == np.argmax(np.bincount(lab2.ravel())[1:]) + 1)
# onde o papel encostava no topo do slide (canto de cima à direita), a borda era reta: rasga ali também,
# com a mesma cara das bordas rasgadas originais (recortes irregulares e beirada queimada)
toca = m[:4].any(0)
if toca.any():
    r = np.random.default_rng(9); xs = np.arange(W)
    serra = np.zeros(W)
    for esc, amp in ((140, 46), (40, 22), (10, 9), (4, 4)):
        k = r.random(W // esc + 3); serra += amp * np.interp(xs / esc, np.arange(len(k)), k)
    rampa = ndimage.gaussian_filter1d(toca.astype(float), 25)        # entra suave a partir do rasgo que já existia
    borda = (10 + serra) * np.clip(rampa * 1.4, 0, 1)
    m &= ~(yy < borda[None, :])
    dist = ndimage.distance_transform_edt(m)
    perto = (yy < borda[None, :] + 40) & m
    queima = np.clip(1 - dist / 22, 0, 1) * perto
    a = a * (1 - queima[..., None] * .55) + np.array([70, 40, 18.]) * queima[..., None] * .55
# borda de cima igual à de baixo (a Vivian quer "finalizado igual embaixo, meio queimadinho"):
# o rasgo fino da borda de baixo é copiado (espelhado) para cima, e a beirada ganha a mesma queimadura marrom-escura
cols = np.arange(W)
top0 = np.array([np.argmax(m[:, x]) for x in cols]).astype(float)
bot0 = np.array([H - 1 - np.argmax(m[::-1, x]) for x in cols]).astype(float)
fino = bot0 - ndimage.gaussian_filter1d(bot0, 30)                 # só os recortes miúdos do rasgo de baixo
novo = np.maximum(ndimage.gaussian_filter1d(top0, 30) + 10 - fino[::-1], 2)
m &= yy >= novo[None, :]
r2 = np.random.default_rng(31)
def mancha(esc):
    k = r2.random((H // esc + 2, W // esc + 2)); return np.asarray(Image.fromarray((k * 255).astype("uint8")).resize((W, H), Image.BICUBIC), float) / 255
dt = yy - novo[None, :]
borrao = .55 + .7 * mancha(9) * mancha(30) * 1.6
k = np.clip(np.exp(-dt / 13) * .62 * borrao + np.clip(1 - dt / 160, 0, 1) * .2 + (dt < 3) * .25, 0, .85) * (dt >= 0) * (dt < 220)
a = a * (1 - k[..., None]) + np.array([52, 28, 12.]) * k[..., None]
alpha = ndimage.gaussian_filter(m.astype(float), .8) * 255
Image.fromarray(np.dstack([np.clip(a, 0, 255).astype("uint8"), alpha.clip(0, 255).astype("uint8")]), "RGBA").crop((0, 0, 1320, 1242)).save(raiz / "app/img/mapa-rota.webp", "WEBP", quality=92)
print("ok")
