# Corpo da câmera "Burton 1922": a traseira de uma câmera de campo de placa de vidro, como a de Harry Burton na tumba de Tutankhamon.
# Vista de frente: moldura de mogno com cantoneiras de latão, vidro fosco grande (o visor), molas de latão segurando o vidro,
# o pano preto de focar caído por cima e a pera de borracha do obturador embaixo (o botão de foto).
# Madeira, cantoneiras e parafusos são recortes da foto real antiga (referencias/cameras/campo-corpo-armario.jpg).
# Gera app/img/cameras/campo-corpo.jpg (810x1440).
import pathlib, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

R = pathlib.Path(__file__).resolve().parents[2]
SRC = Image.open(R / "referencias/cameras/campo-corpo-armario.jpg").convert("RGB")
W, H = 810, 1440
rng = np.random.default_rng(1922)
VX0, VY0, VX1, VY1 = 100, 150, 710, 1075  # vidro fosco (o visor)

def madeira(w, h, giro=False):
    # tábua de mogno a partir do painel liso da foto real; giro=True deixa o veio na horizontal
    pan = SRC.crop((112, 745, 660, 1075))  # sem o botão de latão (que fica mais embaixo na foto)
    if giro: pan = pan.rotate(90, expand=True)
    pw, ph = pan.size; out = Image.new("RGB", (w, h))
    for y in range(0, h, ph):
        for x in range(0, w, pw):
            t = pan if (x // pw + y // ph) % 2 == 0 else pan.transpose(Image.FLIP_TOP_BOTTOM if not giro else Image.FLIP_LEFT_RIGHT)
            out.paste(t, (x, y))
    return out

img = madeira(W, H)
top = madeira(W, VY0 + 40, True); img.paste(top, (0, 0))
base = madeira(W, H - VY1 + 40, True).transpose(Image.FLIP_TOP_BOTTOM); img.paste(base, (0, VY1 - 40))

a = np.asarray(img).astype(np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# chanfro das réguas: luz de cima/esquerda, sombra de baixo/direita, e as emendas em meia-esquadria
def faixa(d, larg): return np.clip(1 - d / larg, 0, 1)
luz = np.zeros((H, W), np.float32)
# borda interna da moldura (descendo para o vidro): o chanfro
dl, dr, dt, db = xx - VX0, VX1 - xx, yy - VY0, VY1 - yy
dentro = (dl > 0) & (dr > 0) & (dt > 0) & (db > 0)
fora = ~dentro
ch = 26
luz += np.where(fora & (xx > VX1 - 1) & (xx < VX1 + ch) & (yy > VY0 - ch) & (yy < VY1 + ch), .32 * faixa(xx - VX1, ch), 0)  # chanfro direito pega luz
luz -= np.where(fora & (xx < VX0 + 1) & (xx > VX0 - ch) & (yy > VY0 - ch) & (yy < VY1 + ch), .42 * faixa(VX0 - xx, ch), 0)
luz -= np.where(fora & (yy < VY0 + 1) & (yy > VY0 - ch) & (xx > VX0 - ch) & (xx < VX1 + ch), .5 * faixa(VY0 - yy, ch), 0)
luz += np.where(fora & (yy > VY1 - 1) & (yy < VY1 + ch) & (xx > VX0 - ch) & (xx < VX1 + ch), .22 * faixa(yy - VY1, ch), 0)
# borda externa: arredondada
for d, s in ((xx, .35), (W - 1 - xx, -.45), (yy, .2), (H - 1 - yy, -.5)): luz += s * faixa(d, 18) ** 2
a *= (1 + luz)[..., None]
# emendas: linhas escuras finas de meia-esquadria nos 4 cantos do vidro e nos cantos de fora
lin = Image.new("L", (W, H), 0); d = ImageDraw.Draw(lin)
for (x0, y0, sx, sy) in ((VX0, VY0, -1, -1), (VX1, VY0, 1, -1), (VX0, VY1, -1, 1), (VX1, VY1, 1, 1)):
    ex = 0 if sx < 0 else W; ey = 0 if sy < 0 else H; k = min(abs(ex - x0), abs(ey - y0))
    d.line([(x0, y0), (x0 + sx * k, y0 + sy * k)], fill=170, width=2)
d.line([(0, VY0 - 40), (W, VY0 - 40)], fill=60, width=1)
lin = np.asarray(lin.filter(ImageFilter.GaussianBlur(.8))).astype(np.float32) / 255
a *= (1 - .55 * lin)[..., None]

# vidro fosco: cinza esverdeado, granulado, com as linhas gravadas
g = rng.normal(0, 1, (H, W)).astype(np.float32)
g = np.asarray(Image.fromarray(((g * 18) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7))).astype(np.float32) - 128
cx, cy = (VX0 + VX1) / 2, (VY0 + VY1) / 2
rad = np.sqrt(((xx - cx) / (VX1 - VX0)) ** 2 + ((yy - cy) / (VY1 - VY0)) ** 2)
vid = np.stack([62 + g * .5, 66 + g * .5, 62 + g * .5], -1) * (1.15 - .9 * rad)[..., None]
a = np.where(dentro[..., None], vid, a)
# sombra que a moldura joga no vidro
som = np.minimum.reduce([dl, dr, dt * .8, db * 1.4])
a *= np.where(dentro, 1 - .55 * np.clip(1 - som / 22, 0, 1), 1)[..., None]
img = Image.fromarray(a.clip(0, 255).astype(np.uint8))

dr_ = ImageDraw.Draw(img, "RGBA")
# grade gravada no vidro (terços) e cruz do centro
for k in (1, 2):
    x = VX0 + (VX1 - VX0) * k / 3; y = VY0 + (VY1 - VY0) * k / 3
    dr_.line([(x, VY0 + 6), (x, VY1 - 6)], fill=(200, 200, 190, 38), width=1)
    dr_.line([(VX0 + 6, y), (VX1 - 6, y)], fill=(200, 200, 190, 38), width=1)
dr_.line([(cx - 14, cy), (cx + 14, cy)], fill=(220, 220, 210, 60)); dr_.line([(cx, cy - 14), (cx, cy + 14)], fill=(220, 220, 210, 60))

def latao(w, h):
    # tira de latão escovado: recorte do friso de latão da foto real
    t = SRC.crop((104, 152, 470, 166)).resize((max(w, 1), max(h, 1)), Image.LANCZOS) if w > h else SRC.crop((100, 160, 116, 720)).resize((max(w, 1), max(h, 1)), Image.LANCZOS)
    return t
parafuso = SRC.crop((24, 28, 50, 54))  # cabeça de parafuso de latão (foto)
masc_p = Image.new("L", (26, 26), 0); ImageDraw.Draw(masc_p).ellipse((1, 1, 25, 25), fill=255); masc_p = masc_p.filter(ImageFilter.GaussianBlur(.6))
def poe_parafuso(x, y, s=1.0):
    p = parafuso.resize((int(26 * s), int(26 * s)), Image.LANCZOS); m = masc_p.resize(p.size, Image.LANCZOS)
    img.paste(p, (int(x - p.width / 2), int(y - p.height / 2)), m)

def sombra(caixa, raio=8, alfa=150, desl=(5, 7), forma="ret"):
    m = Image.new("L", (W, H), 0); dm = ImageDraw.Draw(m)
    x0, y0, x1, y1 = caixa; x0 += desl[0]; x1 += desl[0]; y0 += desl[1]; y1 += desl[1]
    (dm.ellipse if forma == "eli" else dm.rectangle)((x0, y0, x1, y1), fill=alfa)
    m = m.filter(ImageFilter.GaussianBlur(raio))
    img.paste(Image.new("RGB", (W, H), (12, 6, 3)), (0, 0), m)

# molas de latão segurando o vidro (duas de cada lado), parafusadas na moldura
for y in (330, 880):
    for lado in (-1, 1):
        x0 = VX0 - 46 if lado < 0 else VX1 - 18
        sombra((x0, y - 20, x0 + 64, y + 20), 5, 160, (4, 6))
        tira = latao(64, 40)
        ta = np.asarray(tira).astype(np.float32)
        perfil = np.linspace(-1, 1, 40)[:, None]
        ta *= (1.12 - .38 * perfil ** 2 - .12 * perfil)[..., None]  # curvatura da mola
        tira = Image.fromarray(ta.clip(0, 255).astype(np.uint8))
        mm = Image.new("L", (64, 40), 0); ImageDraw.Draw(mm).rounded_rectangle((0, 0, 63, 39), 10, fill=255)
        img.paste(tira, (x0, y - 20), mm)
        poe_parafuso(x0 + (16 if lado < 0 else 48), y, .8)

# cantoneiras de latão em L nos 4 cantos (latão maciço da dobradiça da foto real), com parafusos
latao_dob = SRC.crop((684, 200, 724, 352))
def cantoneira(fx, fy):
    L, e = 120, 34
    t = latao_dob.resize((L, L), Image.LANCZOS)
    ta = np.asarray(t).astype(np.float32); g_ = np.linspace(1.12, .82, L)
    ta *= (g_[:, None] * g_[None, :] ** .5)[..., None] * 1.05
    t = Image.fromarray(ta.clip(0, 255).astype(np.uint8))
    m = Image.new("L", (L, L), 0); dm = ImageDraw.Draw(m)
    dm.rounded_rectangle((0, 0, L - 1, e), 6, fill=255); dm.rounded_rectangle((0, 0, e, L - 1), 6, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(.7))
    if fx: t, m = t.transpose(Image.FLIP_LEFT_RIGHT), m.transpose(Image.FLIP_LEFT_RIGHT)
    if fy: t, m = t.transpose(Image.FLIP_TOP_BOTTOM), m.transpose(Image.FLIP_TOP_BOTTOM)
    px, py = (W - L - 6 if fx else 6), (H - L - 6 if fy else 6)
    sm = Image.new("L", (W, H), 0); sm.paste(m, (px + 4, py + 5)); sm = sm.filter(ImageFilter.GaussianBlur(4))
    img.paste(Image.new("RGB", (W, H), (12, 6, 3)), (0, 0), sm.point(lambda v: v * .7))
    img.paste(t, (px, py), m)
    for (u, v) in ((17, 17), (17, 75), (75, 17)):
        poe_parafuso(px + (L - u if fx else u), py + (L - v if fy else v), .62)
for fx in (0, 1):
    for fy in (0, 1): cantoneira(fx, fy)

# (sem plaqueta gravada: os controles de tom, Cinematic e Foto/Filme ocupam o canto de baixo à esquerda)
# pera de borracha do obturador, com o tubo subindo para a lente (que fica do outro lado)
BX, BY, BR = int(.70 * W), int(.865 * H), 70
S4 = 3
cam = Image.new("RGBA", (W * S4, H * S4), (0, 0, 0, 0)); dc = ImageDraw.Draw(cam)
pts = []
for t in np.linspace(0, 1, 60):
    p0, p1, p2, p3 = np.array([BX + 8, BY - BR + 6]), np.array([BX + 20, BY - 190]), np.array([W - 30, BY - 120]), np.array([W + 20, BY - 300])
    pts.append(tuple(((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3) * S4))
sombra((BX - BR, BY - BR + 20, BX + BR + 40, BY + BR + 10), 14, 190, (12, 14), "eli")
for larg, cor in ((15, (14, 8, 6, 255)), (11, (44, 26, 20, 255)), (5, (82, 52, 40, 255)), (2, (130, 92, 74, 200))):
    dc.line([(x - (15 - larg) * .25 * S4, y - (15 - larg) * .25 * S4) for x, y in pts], fill=cor, width=larg * S4, joint="curve")
# gargalo
dc.rounded_rectangle(((BX - 14) * S4, (BY - BR - 16) * S4, (BX + 22) * S4, (BY - BR + 22) * S4), 10 * S4, fill=(40, 22, 16, 255))
cam = cam.resize((W, H), Image.LANCZOS); img.paste(cam, (0, 0), cam)
# a pera: borracha vermelho-escura envelhecida, com brilho e granulado
by0 = BY - BR; ry = int(BR * 1.08)
pe = np.zeros((2 * ry, 2 * BR + 1, 4), np.float32)
py_, px_ = np.mgrid[-ry:ry, -BR:BR + 1].astype(np.float32)
r = np.sqrt((px_ / BR) ** 2 + (py_ / ry) ** 2)
nz = np.sqrt(np.clip(1 - r ** 2, 0, 1)); nx, ny = px_ / BR, py_ / ry
lam = np.clip(-.55 * nx - .6 * ny + .6 * nz, 0, 1)
spec = np.clip(-.45 * nx - .55 * ny + .7 * nz, 0, 1) ** 28
base_c = np.array([92, 34, 22], np.float32)
gr = rng.normal(0, 1, r.shape).astype(np.float32) * 5
col = base_c * (.22 + .95 * lam)[..., None] + gr[..., None] + (spec * 120)[..., None]
col += (np.clip(.15 + .1 * nx, 0, 1) * 18)[..., None] * (r > .8)[..., None]  # luz rebatida na borda
pe[..., :3] = col; pe[..., 3] = np.clip((1 - r) * BR * 1.2, 0, 1) * 255
pera = Image.fromarray(pe.clip(0, 255).astype(np.uint8), "RGBA")
img.paste(pera, (BX - BR, BY - ry + 6), pera)
# aro de latão no gargalo
dr_ = ImageDraw.Draw(img, "RGBA")
dr_.rounded_rectangle((BX - 17, by0 - 22, BX + 25, by0 - 6), 5, fill=(150, 112, 52, 255), outline=(70, 48, 20, 255))
dr_.line([(BX - 13, by0 - 18), (BX + 21, by0 - 18)], fill=(232, 200, 130, 160), width=2)

# pano preto de focar, caído por cima da câmera: veludo com dobras fundas e brilho nas cristas
fx = np.arange(W, dtype=np.float32)
ond = np.sin(fx / 38 + .4) * .55 + np.sin(fx / 17 + 1.3) * .22 + np.sin(fx / 97 + 2.1) * .7 + np.sin(fx / 7.3) * .06
borda = 142 + 26 * ond + 14 * np.abs(np.sin(fx / 55 + .9))
borda[:60] -= np.linspace(60, 0, 60) ** 1.2 * .9; borda[-60:] -= np.linspace(0, 70, 60) ** 1.1 * .8
cl = int(borda.max()) + 30
yv = np.arange(cl, dtype=np.float32)[:, None]
# as dobras vão abrindo de cima para baixo: perto do topo o pano está mais liso
prof = np.clip(yv / borda[None, :], 0, 1)
dob = ond[None, :] * (.35 + .65 * prof)
incl = np.gradient(ond)[None, :] * (.35 + .65 * prof)
den = rng.normal(0, 1, (cl, W)).astype(np.float32)
den = np.asarray(Image.fromarray((den * 30 + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.5))).astype(np.float32) - 128
lumv = 9 + 24 * np.clip(dob * .7 + .55, 0, 1.3) + 170 * np.clip(-incl, 0, .09) - 120 * np.clip(incl, 0, .06)
crista = np.exp(-((dob - .62) / .14) ** 2) * 9  # brilho do veludo nas cristas
lumv = lumv + crista + den * .1
lumv *= np.clip(1.05 - (np.maximum(borda[None, :] - yv, 0) < 10) * .25, .6, 1.1)  # bainha mais escura
alfa = np.clip((borda[None, :] - yv) * 1.2, 0, 1)
pano = np.stack([lumv * 1.03, lumv * .98, lumv * .92, alfa * 255], -1)
pano = Image.fromarray(pano.clip(0, 255).astype(np.uint8), "RGBA")
som_p = Image.fromarray((np.clip((borda[None, :] + 22 - yv) / 22, 0, 1) * 200).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10))
img.paste(Image.new("RGB", som_p.size, (6, 4, 2)), (0, 8), som_p)
img.paste(pano, (0, 0), pano)

# luz da cena: vinda de cima à esquerda, cantos mais escuros, grão leve
a = np.asarray(img).astype(np.float32)
v = np.sqrt(((xx - W * .4) / W) ** 2 + ((yy - H * .35) / H) ** 2)
a *= (1.08 - .62 * v ** 1.6)[..., None]
a += rng.normal(0, 3.2, a.shape[:2])[..., None]
img = Image.fromarray(a.clip(0, 255).astype(np.uint8))
img.save(R / "app/img/cameras/campo-corpo.jpg", quality=88)
print("campo-corpo.jpg", img.size, "visor", [round(VX0 / W, 4), round(VY0 / H, 4), round(VX1 / W, 4), round(VY1 / H, 4)], "botão", [.70, .865])
