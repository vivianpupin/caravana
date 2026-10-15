# Mapa-mundo do Egito no estilo dos mapas de videogame (Donkey Kong Country): terreno pintado com relevo e luz,
# água com profundidade e espuma, o Nilo com o vale verde, e cada parada da rota desenhada como uma pequena cena.
# Gera app/img/mapa-jogo.webp (1200x1500) e app/dados/mapa-jogo.json (paradas e trilha, em % da imagem).
import json, math, pathlib, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

raiz = pathlib.Path(__file__).resolve().parents[2]
W, H = 1200, 1500
rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
X, Y = xx / W, yy / H

def ruido(esc, oit=5, semente=0):
    r = np.random.default_rng(semente); out = np.zeros((H, W)); amp, tot = 1.0, 0.0
    for o in range(oit):
        s = max(2, int(esc / 2 ** o)); n = r.random((H // s + 3, W // s + 3))
        out += amp * np.asarray(Image.fromarray((n * 255).astype("uint8")).resize((W, H), Image.BICUBIC), float) / 255; tot += amp; amp *= .5
    return (out / tot - .5) * 2

def curva(pts, n=400):
    # Catmull-Rom pelos pontos
    pts = [pts[0]] + list(pts) + [pts[-1]]; out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = map(np.array, pts[i - 1:i + 3])
        for t in np.linspace(0, 1, n // (len(pts) - 3), endpoint=False):
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(np.array(pts[-2])); return np.array(out)

def mascara_linha(pts, larg):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    P = [(x * W, y * H) for x, y in pts]
    d.line(P, fill=255, width=int(larg), joint="curve")
    for x, y in P[::3]: d.ellipse((x - larg / 2, y - larg / 2, x + larg / 2, y + larg / 2), fill=255)
    return np.asarray(im, float) / 255

def poligono(pts):
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon([(x * W, y * H) for x, y in pts], fill=255)
    return np.asarray(im, float) / 255

# ---------- geografia (simplificada, mas na posição certa) ----------
warp = ruido(180, 4, 1) * .012
costa_norte = .085 + .012 * np.sin(X * 14) + warp
mar = (Y < costa_norte).astype(float)
# delta do Nilo: um leque verde que avança no mar
delta = (ndimage.gaussian_filter(poligono([(.42, .07), (.52, .2), (.62, .07)]), 22) > .35).astype(float)
mar = np.clip(mar - delta * (Y > .06), 0, 1)
# Mar Vermelho, Golfo de Suez e Golfo de Aqaba
xl = .70 + .19 * np.clip((Y - .16) / .84, 0, 1) + warp * 1.2
golfo = mascara_linha(curva([(.72, .1), (.745, .2), (.79, .35)], 60), 30)
aberto = ((X > xl) & (Y >= .33)).astype(float)
aqaba = mascara_linha(curva([(.97, .1), (.95, .2), (.9, .35)], 60), 24)
mar = np.clip(mar + golfo + aberto + aqaba, 0, 1)
# Nilo e Lago Nasser
NILO = [(.52, .19), (.505, .27), (.515, .36), (.55, .45), (.615, .515), (.635, .565), (.61, .63), (.585, .70), (.6, .755)]
nilo_pts = curva(NILO, 600)
rio = mascara_linha(nilo_pts, 13)
lago = poligono([(.6, .755), (.64, .79), (.62, .84), (.60, .9), (.56, .96), (.52, 1.02), (.46, 1.02), (.5, .95), (.535, .88), (.56, .82), (.575, .78)])
lago = ndimage.gaussian_filter(lago, 6) > .5
agua = np.clip(mar + rio + lago, 0, 1) > .5
# braços do delta
for alvo in [(.46, .09), (.58, .09), (.52, .085)]:
    agua |= mascara_linha(curva([(.52, .19), ((.52 + alvo[0]) / 2 + .01, .14), alvo], 80), 6) > .5
agua = (ndimage.gaussian_filter(agua.astype(float), 14) + ruido(90, 4, 12) * .22) > .5
agua |= (rio + lago) > .5
terra = ~agua

# ---------- relevo ----------
dist_agua = ndimage.distance_transform_edt(terra) / W
dist_nilo = ndimage.distance_transform_edt(1 - (rio + lago > .5)) / W
h = .25 + .18 * ruido(260, 6, 2)
# dunas (cristas ondulando) no deserto ocidental
dir_ = X * 1.0 + Y * .55 + ruido(120, 3, 3) * .05
dunas = (np.abs(np.sin(dir_ * 55)) ** 4) * .05 * np.clip(.5 - X, 0, .5) * 2.4
h += dunas * (X < .5)
# serras do deserto oriental (entre o Nilo e o Mar Vermelho) e do Sinai
serra = np.exp(-((X - (xl - .06)) ** 2) / .0016) * np.clip((Y - .18) * 8, 0, 1) * .55
sinai = ndimage.gaussian_filter(poligono([(.79, .15), (.92, .15), (.87, .33)]), 25) * .7
h += (serra + sinai) * (.6 + .4 * np.abs(ruido(60, 5, 4)))
h *= np.clip(dist_agua * 60, 0, 1)
# planalto do Deserto Branco: chão claro
branco = np.exp(-(((X - .2) / .13) ** 2 + ((Y - .43) / .09) ** 2))
h = ndimage.gaussian_filter(h, 2.2)

# luz vindo do noroeste
gy, gx = np.gradient(h * 260)
n = np.sqrt(gx ** 2 + gy ** 2 + 1); Lx, Ly, Lz = -.5, -.6, .62
luz = (-gx * Lx - gy * Ly + Lz) / n / Lz
luz = np.clip(.72 + .28 * luz, .55, 1.25)

# ---------- cores ----------
areia1, areia2 = np.array([236, 200, 128.]), np.array([210, 158, 88.])
rocha = np.array([158, 104, 66.])
verde1, verde2 = np.array([118, 150, 58.]), np.array([70, 112, 44.])
giz = np.array([240, 236, 222.])
t = np.clip(.5 + .5 * ruido(300, 4, 5), 0, 1)[..., None]
cor = areia1 * (1 - t) + areia2 * t
k_rocha = np.clip((serra + sinai) * 1.2 * (h > .25), 0, 1)[..., None] * .85
cor = cor * (1 - k_rocha) + rocha * k_rocha
k_giz = np.clip(branco * 1.4 - .25, 0, 1)[..., None]
cor = cor * (1 - k_giz) + giz * k_giz
# vale verde do Nilo, delta e oásis
verde = np.clip(1 - dist_nilo / .028, 0, 1) + delta * 1.2 * (Y < .2)
oasis = np.exp(-(((X - .14) / .05) ** 2 + ((Y - .36) / .03) ** 2)) + np.exp(-(((X - .3) / .035) ** 2 + ((Y - .5) / .025) ** 2))
verde = np.clip(verde + oasis * 1.3, 0, 1) * terra
mv = np.clip(.5 + .5 * ruido(40, 4, 6), 0, 1)[..., None]
cv = verde1 * (1 - mv) + verde2 * mv
kv = (verde ** .7)[..., None] * .92
cor = cor * (1 - kv) + cv * kv
cor *= luz[..., None]
# contorno da costa mais escuro e uma faixinha de areia molhada
borda = np.clip(1 - dist_agua / .006, 0, 1)[..., None] * terra[..., None]
cor = cor * (1 - borda * .25) + np.array([246, 226, 170.]) * borda * .25

# água: clara na beira, funda no meio, reflexos
dist_terra = ndimage.distance_transform_edt(agua) / W
prof = np.clip(dist_terra / .06, 0, 1)[..., None]
raso, fundo = np.array([96, 196, 196.]), np.array([24, 92, 138.])
ca = raso * (1 - prof) + fundo * prof
ca = ca * (1 + .07 * ruido(50, 3, 9)[..., None])
espuma = (np.clip(1 - dist_terra / .004, 0, 1) * agua)[..., None]
ca = ca * (1 - espuma * .8) + np.array([250, 250, 240.]) * espuma * .8
img = np.where(agua[..., None], ca, cor)
img = np.clip(img, 0, 255).astype("uint8")
base = Image.fromarray(img).convert("RGBA")
ond = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); do = ImageDraw.Draw(ond)
for _ in range(260):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    if agua[int(y), int(x)] and dist_terra[int(y), int(x)] > .018:
        L = rng.uniform(10, 22); do.arc((x * 2 - L, y * 2 - L * .5, x * 2 + L, y * 2 + L * .5), 200, 340, fill=(230, 250, 250, 150), width=3)
base = Image.alpha_composite(base, ond.resize((W, H), Image.LANCZOS))

# ---------- trilha ----------
PARADAS = [("Cairo", .515, .215), ("Deserto Branco", .2, .44), ("Aswan", .565, .74), ("Abu Simbel", .455, .9),
           ("Luxor", .66, .585), ("Hurghada", .745, .44), ("Cairo · volta para casa", .575, .255)]
CTRL = [[(.36, .26), (.24, .33)], [(.26, .6), (.44, .72)], [(.53, .82)], [(.6, .82), (.67, .7)], [(.72, .52)], [(.69, .33), (.62, .27)]]
trechos = []
for i in range(6):
    a, b = PARADAS[i][1:], PARADAS[i + 1][1:]
    trechos.append(curva([a] + CTRL[i] + [b], 160).tolist())

def sprite_layer():
    return Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0))
S2 = lambda x, y: (x * W * 2, y * H * 2)
cam = sprite_layer(); d = ImageDraw.Draw(cam)
for tr in trechos:
    P = [S2(x, y) for x, y in tr]
    d.line(P, fill=(96, 60, 28, 255), width=26, joint="curve")
for tr in trechos:
    P = [S2(x, y) for x, y in tr]
    d.line(P, fill=(232, 205, 150, 255), width=17, joint="curve")
    d.line(P, fill=(246, 226, 180, 255), width=7, joint="curve")
cam = cam.resize((W, H), Image.LANCZOS)
sombra_c = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sombra_c.paste((40, 25, 10, 110), (0, 0), cam.split()[3])
base = Image.alpha_composite(base, sombra_c.filter(ImageFilter.GaussianBlur(3)).transform((W, H), Image.AFFINE, (1, 0, -3, 0, 1, -4)))
base = Image.alpha_composite(base, cam)

# ---------- cenas de cada lugar (desenhadas em 2x e reduzidas) ----------
cen = sprite_layer(); d = ImageDraw.Draw(cen)
def poly(pts, fill, out=(70, 42, 20, 255), w=3): d.polygon(pts, fill=fill, outline=out, width=w)
def piramide(cx, cy, s):
    poly([(cx - s, cy), (cx, cy - s * 1.05), (cx + s * .25, cy)], (246, 214, 140, 255))
    poly([(cx + s * .25, cy), (cx, cy - s * 1.05), (cx + s * .9, cy - s * .12)], (196, 146, 82, 255))
def palmeira(cx, cy, s):
    d.line([(cx, cy), (cx + s * .1, cy - s * .55), (cx + s * .05, cy - s)], fill=(110, 72, 36, 255), width=max(3, int(s * .09)))
    for a in range(0, 360, 50):
        r = math.radians(a); d.chord((cx + s * .05 - s * .45 + math.cos(r) * s * .25, cy - s - s * .18 + math.sin(r) * s * .12, cx + s * .05 + s * .45 + math.cos(r) * s * .25, cy - s + s * .3 + math.sin(r) * s * .12), 180, 360, fill=(70, 128, 52, 255), outline=(36, 76, 30, 255), width=2)
def casa(cx, cy, s, cor=(232, 210, 170, 255)):
    poly([(cx - s, cy), (cx - s, cy - s * 1.1), (cx + s, cy - s * 1.1), (cx + s, cy)], cor)
    poly([(cx + s, cy), (cx + s, cy - s * 1.1), (cx + s * 1.5, cy - s * 1.3), (cx + s * 1.5, cy - s * .2)], (196, 168, 120, 255))
    d.rectangle((cx - s * .3, cy - s * .55, cx + s * .1, cy), fill=(90, 60, 30, 255))
def minarete(cx, cy, s):
    poly([(cx - s * .18, cy), (cx - s * .18, cy - s * 1.8), (cx + s * .18, cy - s * 1.8), (cx + s * .18, cy)], (240, 226, 196, 255))
    d.ellipse((cx - s * .32, cy - s * 2.15, cx + s * .32, cy - s * 1.7), fill=(240, 226, 196, 255), outline=(70, 42, 20, 255), width=3)
    d.line([(cx, cy - s * 2.15), (cx, cy - s * 2.45)], fill=(70, 42, 20, 255), width=3)
def coluna(cx, cy, s):
    poly([(cx - s * .22, cy), (cx - s * .22, cy - s * 1.6), (cx + s * .22, cy - s * 1.6), (cx + s * .22, cy)], (226, 184, 120, 255))
    d.chord((cx - s * .45, cy - s * 2.0, cx + s * .45, cy - s * 1.35), 180, 360, fill=(120, 160, 110, 255), outline=(70, 42, 20, 255), width=3)
    for k in (.5, .9, 1.2): d.line([(cx - s * .2, cy - s * k), (cx + s * .2, cy - s * k)], fill=(170, 64, 40, 255), width=2)
def rocha_cogumelo(cx, cy, s):
    poly([(cx - s * .25, cy), (cx - s * .2, cy - s * .7), (cx + s * .2, cy - s * .7), (cx + s * .3, cy)], (232, 228, 214, 255), (120, 110, 96, 255))
    d.ellipse((cx - s * .7, cy - s * 1.2, cx + s * .7, cy - s * .55), fill=(250, 248, 240, 255), outline=(120, 110, 96, 255), width=3)
    d.chord((cx - s * .7, cy - s * 1.2, cx + s * .7, cy - s * .55), 0, 180, fill=(214, 208, 192, 255))
def felucca(cx, cy, s):
    poly([(cx - s, cy), (cx + s, cy), (cx + s * .7, cy + s * .3), (cx - s * .7, cy + s * .3)], (120, 72, 36, 255))
    poly([(cx - s * .1, cy - s * 1.8), (cx + s * .9, cy - s * .1), (cx - s * .1, cy - s * .1)], (250, 246, 232, 255), (110, 96, 80, 255))
def colosso(cx, cy, s):
    poly([(cx - s * .4, cy), (cx - s * .4, cy - s * .9), (cx - s * .3, cy - s * 1.3), (cx + s * .3, cy - s * 1.3), (cx + s * .4, cy - s * .9), (cx + s * .4, cy)], (214, 150, 96, 255), (90, 50, 24, 255))
    poly([(cx - s * .28, cy - s * 1.3), (cx - s * .2, cy - s * 1.75), (cx + s * .2, cy - s * 1.75), (cx + s * .28, cy - s * 1.3)], (196, 160, 80, 255), (90, 50, 24, 255))
    d.ellipse((cx - s * .17, cy - s * 1.65, cx + s * .17, cy - s * 1.33), fill=(200, 130, 80, 255), outline=(90, 50, 24, 255), width=2)
def guarda_sol(cx, cy, s, c):
    d.line([(cx, cy), (cx, cy - s)], fill=(90, 60, 30, 255), width=3)
    d.chord((cx - s * .6, cy - s * 1.3, cx + s * .6, cy - s * .7), 180, 360, fill=c, outline=(90, 60, 30, 255), width=2)

def P2(x, y): return (x * W * 2, y * H * 2)
K = 2.1
# Cairo: casas, minaretes e a cidadela
cx, cy = P2(.56, .19)
for dx, dy, s in [(-40, 0, 16), (0, 14, 18), (44, 4, 15), (80, 18, 16), (20, 40, 15), (-20, 36, 14)]: casa(cx + dx * K, cy + dy * K, s * K)
minarete(cx - 60 * K, cy + 10 * K, 22 * K); minarete(cx + 110 * K, cy + 24 * K, 20 * K)
# Gizé: as três pirâmides e a esfinge
gx, gy = P2(.42, .22)
piramide(gx + 70 * K, gy + 30 * K, 34 * K); piramide(gx, gy + 20 * K, 62 * K); piramide(gx - 80 * K, gy + 30 * K, 48 * K)
poly([(gx + 110 * K, gy + 60 * K), (gx + 110 * K, gy + 40 * K), (gx + 150 * K, gy + 36 * K), (gx + 160 * K, gy + 26 * K), (gx + 172 * K, gy + 30 * K), (gx + 172 * K, gy + 60 * K)], (214, 170, 100, 255))
for x, y in [(.4, .26), (.47, .25)]: palmeira(*P2(x, y), 28 * K)
# Deserto Branco: rochas de giz em cogumelo e a tenda
wx, wy = P2(.2, .42)
for dx, dy, s in [(-80, 20, 34), (60, -10, 42), (-10, -40, 28), (100, 40, 30), (-120, -30, 24)]: rocha_cogumelo(wx + dx * K, wy + dy * K, s * K)
poly([(wx + 10 * K, wy + 70 * K), (wx + 45 * K, wy + 30 * K), (wx + 80 * K, wy + 70 * K)], (176, 70, 46, 255))
for x, y in [(.14, .36), (.155, .37), (.3, .5)]: palmeira(*P2(x, y), 26 * K)
# Aswan: feluccas no rio e o templo de Philae
ax, ay = P2(.6, .735)
felucca(ax + 40 * K, ay - 10 * K, 18 * K); felucca(ax - 10 * K, ay + 30 * K, 15 * K)
for k in range(4): coluna(ax + 120 * K + k * 22, ay + 30 * K, 20 * K)
poly([(ax + 108 * K, ay + 34 * K), (ax + 205 * K, ay + 34 * K), (ax + 205 * K, ay + 42 * K), (ax + 108 * K, ay + 42 * K)], (196, 160, 110, 255))
for x, y in [(.53, .72), (.66, .76)]: palmeira(*P2(x, y), 26 * K)
# Abu Simbel: a fachada na montanha com os quatro colossos
bx, by = P2(.435, .9)
poly([(bx - 120 * K * .7, by + 40 * K * .7), (bx - 100 * K * .7, by - 70 * K * .7), (bx - 30 * K * .7, by - 100 * K * .7), (bx + 60 * K * .7, by - 96 * K * .7), (bx + 120 * K * .7, by - 60 * K * .7), (bx + 130 * K * .7, by + 40 * K * .7)], (178, 112, 66, 255))
poly([(bx - 82 * K * .7, by + 40 * K * .7), (bx - 82 * K * .7, by - 60 * K * .7), (bx + 92 * K * .7, by - 60 * K * .7), (bx + 92 * K * .7, by + 40 * K * .7)], (226, 164, 104, 255))
for k in range(4): colosso(bx - 58 * K * .7 + k * 44, by + 40 * K * .7, 34 * K * .7)
d.rectangle((bx - 2 * K * .7, by + 6 * K * .7, bx + 14 * K * .7, by + 40 * K * .7), fill=(60, 34, 16, 255))
# Luxor: pilono, obelisco e colunas de Karnak
lx, ly = P2(.69, .57)
poly([(lx - 60 * K, ly + 30 * K), (lx - 54 * K, ly - 40 * K), (lx - 10 * K, ly - 40 * K), (lx - 4 * K, ly + 30 * K)], (226, 184, 120, 255))
poly([(lx + 4 * K, ly + 30 * K), (lx + 10 * K, ly - 40 * K), (lx + 54 * K, ly - 40 * K), (lx + 60 * K, ly + 30 * K)], (226, 184, 120, 255))
d.rectangle((lx - 6 * K, ly - 10 * K, lx + 6 * K, ly + 30 * K), fill=(90, 60, 30, 255))
poly([(lx - 80 * K, ly + 30 * K), (lx - 74 * K, ly - 60 * K), (lx - 68 * K, ly - 70 * K), (lx - 62 * K, ly - 60 * K), (lx - 56 * K, ly + 30 * K)], (236, 200, 140, 255))
for k in range(4): coluna(lx + 80 * K + k * 22, ly + 34 * K, 20 * K)
for x, y in [(.64, .55), (.73, .6)]: palmeira(*P2(x, y), 28 * K)
# Hurghada: palmeiras, guarda-sóis e um barco no Mar Vermelho
hx, hy = P2(.74, .43)
for dx in (-40, -10, 20): palmeira(hx + dx * K, hy + 30 * K, 30 * K)
for dx, c in [(-60, (200, 70, 50, 255)), (40, (240, 200, 90, 255)), (70, (60, 140, 160, 255))]: guarda_sol(hx + dx, hy + 50 * K, 22, c)
felucca(*P2(.84, .47), 18 * K)
# palmeiras espalhadas pelo vale e no delta
for i in range(46):
    k = rng.integers(0, len(nilo_pts)); x, y = nilo_pts[k]; lado = rng.choice([-1, 1])
    x += lado * rng.uniform(.012, .03); y += rng.uniform(-.01, .01)
    if not agua[min(H - 1, int(y * H)), min(W - 1, int(x * W))]: palmeira(*P2(x, y), rng.uniform(16, 24))
for i in range(14):
    x, y = .44 + rng.uniform(0, .16), .11 + rng.uniform(0, .07)
    if not agua[int(y * H), int(x * W)]: palmeira(*P2(x, y), rng.uniform(14, 20))
# camelos de caravana no deserto e um sol alado no céu do mar? (fica só a caravana)
def camelo(cx, cy, s):
    c, o = (176, 120, 66, 255), (80, 50, 24, 255)
    d.ellipse((cx - s, cy - s * .9, cx + s * .7, cy), fill=c, outline=o, width=2)
    d.ellipse((cx - s * .5, cy - s * 1.25, cx + s * .1, cy - s * .6), fill=c, outline=o, width=2)
    d.line([(cx + s * .55, cy - s * .5), (cx + s * .9, cy - s * 1.3)], fill=c, width=int(s * .3))
    d.ellipse((cx + s * .75, cy - s * 1.5, cx + s * 1.2, cy - s * 1.2), fill=c, outline=o, width=2)
    for dx in (-.7, -.4, .2, .5): d.line([(cx + s * dx, cy - s * .1), (cx + s * dx, cy + s * .6)], fill=o, width=3)
for k, (x, y) in enumerate([(.3, .62), (.33, .625), (.36, .63)]): camelo(*P2(x, y), 14)
cen = cen.resize((W, H), Image.LANCZOS)
sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sombra.paste((40, 25, 10, 120), (0, 0), cen.split()[3])
base = Image.alpha_composite(base, sombra.filter(ImageFilter.GaussianBlur(4)).transform((W, H), Image.AFFINE, (1, 0, 5, 0, 1, -3)))
base = Image.alpha_composite(base, cen)


# nuvens nas bordas, como nos mapas de videogame (o mundo continua além delas)
nv = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dn = ImageDraw.Draw(nv)
def nuvem(cx, cy, r):
    for _ in range(9):
        a, k = rng.uniform(0, 6.28), rng.uniform(.2, .9)
        x, y, rr = cx + math.cos(a) * r * k * 1.4, cy + math.sin(a) * r * k * .5, r * rng.uniform(.45, .8)
        dn.ellipse((x - rr, y - rr * .8 + rr * .12, x + rr, y + rr * .8 + rr * .12), fill=(150, 160, 175, 150))
        dn.ellipse((x - rr, y - rr * .8, x + rr, y + rr * .8), fill=(250, 250, 248, 235))
for cx, cy, r in [(40, 60, 90), (190, 20, 80), (1150, 40, 95), (1180, 220, 70), (30, 640, 70), (1190, 900, 80), (60, 1440, 100), (330, 1490, 80), (1120, 1460, 110)]:
    nuvem(cx, cy, r)
base = Image.alpha_composite(base, nv.filter(ImageFilter.GaussianBlur(2.5)))

# acabamento pintado: leve granulado, borda escurecida, rosa dos ventos
fim = np.asarray(base.convert("RGB"), float)
fim *= (1 + .035 * ruido(3, 1, 11))[..., None]
v = np.clip(((X - .5) ** 2 + (Y - .5) ** 2) * 1.1, 0, .35)
fim *= (1 - v)[..., None]
out = Image.fromarray(np.clip(fim, 0, 255).astype("uint8"))
d = ImageDraw.Draw(out)
rx, ry, R = W * .1, H * .9, 46
for a in range(0, 360, 45):
    r = math.radians(a - 90); L = R if a % 90 == 0 else R * .55
    p1 = (rx + math.cos(r) * L, ry + math.sin(r) * L); pe = (rx + math.cos(r + 1.57) * 7, ry + math.sin(r + 1.57) * 7); pd = (rx + math.cos(r - 1.57) * 7, ry + math.sin(r - 1.57) * 7)
    d.polygon([p1, pe, (rx, ry)], fill=(240, 220, 170)); d.polygon([p1, pd, (rx, ry)], fill=(120, 80, 40))
d.text((rx - 4, ry - R - 18), "N", fill=(70, 42, 20))
out.save(raiz / "app" / "img" / "mapa-jogo.webp", "WEBP", quality=86)
json.dump({"w": W, "h": H, "paradas": [{"c": c, "x": x, "y": y} for c, x, y in PARADAS],
           "trechos": [[[round(x, 4), round(y, 4)] for x, y in tr[::4]] + [[round(tr[-1][0], 4), round(tr[-1][1], 4)]] for tr in trechos]},
          open(raiz / "app" / "dados" / "mapa-jogo.json", "w"), ensure_ascii=False)
print("ok")
