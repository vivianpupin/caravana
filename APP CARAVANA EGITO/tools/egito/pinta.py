# pinta um hieróglifo como figura de teto de tumba: contorno marrom escuro, corpo colorido, pernas de trás mais escuras,
# chifres em marfim, cascos escuros e estrelas amarelas de cinco pontas no corpo. Sai em PNG transparente.
import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
TRACO = (59, 26, 10); MARFIM = (241, 226, 188); ESTRELA = (255, 224, 138)
def hexrgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def escurece(c, k=.72): return tuple(int(v * k) for v in c)
def glifo(cp):
    f = ImageFont.truetype("fonte/ttf.ttf", 900); im = Image.new("L", (1800, 1700), 255); ImageDraw.Draw(im).text((250, 250), chr(cp), font=f, fill=0)
    a = np.array(im) < 128; bb = np.argwhere(a); (y0, x0), (y1, x1) = bb.min(0), bb.max(0)
    return a[y0 - 60:y1 + 61, x0 - 60:x1 + 61]
def estrela(d, cx, cy, r):
    pts = [(cx + math.cos(-math.pi / 2 + k * math.pi / 5) * (r if k % 2 == 0 else r * .42), cy + math.sin(-math.pi / 2 + k * math.pi / 5) * (r if k % 2 == 0 else r * .42)) for k in range(10)]
    d.polygon(pts, fill=ESTRELA + (255,), outline=TRACO + (255,)); d.line(pts + [pts[0]], fill=TRACO + (255,), width=max(3, int(r / 7)))
def pinta(cp, cor, saida, mapa=None, estrelas=0, extra=None, raio_est=34):
    a = glifo(cp); lab, n = ndimage.label(~a); fundo = lab[0, 0]
    areas = ndimage.sum(np.ones_like(lab), lab, range(n + 1)); corpo = max((k for k in range(1, n + 1) if k != fundo), key=lambda k: areas[k])
    H, W = a.shape; ys = np.argwhere(a)[:, 0]; topo, base = ys.min(), ys.max()
    px = np.zeros((H, W, 4), np.uint8); cor = hexrgb(cor)
    for k in range(1, n + 1):
        if k == fundo: continue
        m = lab == k; yc = np.argwhere(m)[:, 0].mean(); rel = (yc - topo) / (base - topo)
        if mapa and k in mapa: c = mapa[k]
        elif k == corpo: c = cor
        elif areas[k] < areas[corpo] * .03: c = TRACO if rel > .88 else cor
        elif rel < .38: c = MARFIM
        else: c = escurece(cor)
        if c is None: continue
        px[m] = (hexrgb(c) if isinstance(c, str) else c) + (255,)
    px[a] = TRACO + (255,)
    img = Image.fromarray(px, "RGBA"); d = ImageDraw.Draw(img)
    if estrelas:  # estrelas espalhadas no corpo, longe das bordas
        dist = ndimage.distance_transform_edt(lab == corpo); pos = []
        cand = np.argwhere(dist > raio_est * 1.25); rng = np.random.default_rng(cp)
        rng.shuffle(cand)
        for y, x in cand:
            if all((y - q[0]) ** 2 + (x - q[1]) ** 2 > (raio_est * 3.4) ** 2 for q in pos): pos.append((y, x))
            if len(pos) >= estrelas: break
        for y, x in pos: estrela(d, x, y, raio_est)
    if extra: img = extra(img, d)
    img = img.resize((img.width // 2, img.height // 2), Image.LANCZOS)
    img.save(saida); return img
