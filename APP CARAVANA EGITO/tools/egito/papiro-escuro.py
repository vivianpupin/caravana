# Fundo de papiro escuro (página inicial e abas de papel): duas camadas de tiras cruzadas, como o papiro de verdade
# (fibras verticais por cima, horizontais por baixo), miolo pontilhado, manchas de tempo e bordas escurecidas.
import pathlib
import numpy as np
from PIL import Image, ImageFilter
raiz = pathlib.Path(__file__).resolve().parents[2]
rng = np.random.default_rng(12); W, H = 1080, 1440
yy, xx = np.mgrid[0:H, 0:W].astype(float)
def ruido(esc, oct=4, s=0, sx=1, sy=1):
    r = np.random.default_rng(s); out = np.zeros((H, W)); amp = 1; tot = 0
    for o in range(oct):
        kx = max(1, int(esc * sx / 2 ** o)); ky = max(1, int(esc * sy / 2 ** o)); n = r.random((H // ky + 3, W // kx + 3))
        out += amp * np.asarray(Image.fromarray((n * 255).astype("uint8")).resize((W, H), Image.BICUBIC), float) / 255; tot += amp; amp *= .55
    return (out / tot - .5) * 2
def camada(vertical, seed, larg):
    r = np.random.default_rng(seed); onda = ruido(300, 3, seed + 10) * 12
    eixo = (xx + onda) if vertical else (yy + onda); n = W if vertical else H
    cortes = np.concatenate([[0], np.cumsum(r.integers(*larg, size=60))]); cortes = cortes[cortes < n + 300]
    idx = np.clip(np.searchsorted(cortes, eixo) - 1, 0, len(cortes) - 2)
    tom = r.uniform(-.035, .035, size=len(cortes))[idx]; pos = (eixo - cortes[idx]) / (cortes[idx + 1] - cortes[idx])
    borda = np.exp(-((np.minimum(pos, 1 - pos)) / .04) ** 2)
    a, b = (1 / 16, 1) if vertical else (1, 1 / 16)
    return tom, borda, ruido(60, 6, seed + 1, sx=a, sy=b), ruido(10, 3, seed + 2, sx=a * 1.4, sy=b * 1.4)
tv, bv, fv, fv2 = camada(True, 1, (90, 150)); th, bh, fh, fh2 = camada(False, 2, (90, 150))
img = np.ones((H, W, 3)) * np.array([152, 110, 60.])
img *= (1 + tv + .09 * fv + .06 * fv2)[..., None]
img *= (1 + th + .07 * fh + .05 * fh2)[..., None]
img *= (1 - .05 * bv)[..., None] * (1 - .04 * bh)[..., None]
img *= (1 + .07 * ruido(2, 1, 7))[..., None]
man = ruido(300, 6, 3); img *= (1 + .17 * man)[..., None]
for _ in range(30):
    x, y = rng.integers(0, W), rng.integers(0, H); r = rng.uniform(20, 110)
    y0, y1, x0, x1 = max(0, int(y - 2.5 * r)), min(H, int(y + 2.5 * r) + 1), max(0, int(x - 2.5 * r)), min(W, int(x + 2.5 * r) + 1)
    d = np.exp(-((xx[y0:y1, x0:x1] - x) ** 2 + (yy[y0:y1, x0:x1] - y) ** 2) / (2 * r * r)) * rng.uniform(.05, .16)
    img[y0:y1, x0:x1] *= (1 - d[..., None] * np.array([.25, .35, .45]))
dist = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy]) + (man + 1) * 40
q = np.clip(1 - dist / 260, 0, 1) ** 1.4; img *= (1 - q * .55)[..., None]
# fibras soltas: milhares de riscos finos, claros e escuros, ao longo das tiras (o que dá a cara de papiro)
from PIL import ImageDraw
fib = Image.new("L", (W, H), 128); d = ImageDraw.Draw(fib)
for _ in range(9000):
    vert = rng.random() < .62; x, y = rng.uniform(0, W), rng.uniform(0, H); L = rng.uniform(20, 160); g = int(rng.choice([70, 90, 165, 185]))
    curv = rng.uniform(-3, 3)
    pts = [(x + (curv * (k / 4) ** 2 if vert else L * k / 4), y + (L * k / 4 if vert else curv * (k / 4) ** 2)) for k in range(5)]
    d.line(pts, fill=g, width=1)
fib = np.asarray(fib.filter(ImageFilter.GaussianBlur(.6)), float) / 128 - 1
img *= (1 + .16 * fib)[..., None]
Image.fromarray(np.clip(img, 0, 255).astype("uint8")).filter(ImageFilter.GaussianBlur(.35)).save(raiz / "app/img/fundo-papiro-escuro.webp", "WEBP", quality=86)
print("ok")
