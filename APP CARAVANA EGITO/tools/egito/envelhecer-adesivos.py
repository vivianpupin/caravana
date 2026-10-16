# Envelhece as etiquetas de viagem: papel amarelado, grão, manchas, arranhões, cantos gastos e um pouco desbotadas.
import pathlib, numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage
raiz = pathlib.Path(__file__).resolve().parents[2]; src = raiz / "tools/egito/adesivos"; dst = raiz / "app/img/adesivos"; dst.mkdir(exist_ok=True)
for i, f in enumerate(sorted(src.glob("*.png"))):
    rng = np.random.default_rng(i + 3)
    im = Image.open(f).convert("RGBA"); a = np.asarray(im, float); H, W = a.shape[:2]
    rgb, al = a[..., :3], a[..., 3]
    def ruido(esc):
        n = rng.random((H // esc + 2, W // esc + 2)); return np.asarray(Image.fromarray((n * 255).astype("uint8")).resize((W, H), Image.BICUBIC), float) / 255 - .5
    rgb = rgb * .82 + np.array([214, 190, 140.]) * .18                      # desbota para o amarelado do papel
    rgb *= (1 + .22 * ruido(60) + .1 * ruido(8))[..., None]                 # manchas e grão
    yy, xx = np.mgrid[0:H, 0:W]
    for _ in range(14):                                                        # arranhões finos e claros
        x0, y0 = rng.uniform(0, W), rng.uniform(0, H); L = rng.uniform(30, 160); ang = rng.uniform(0, np.pi)
        d = np.abs((xx - x0) * np.sin(ang) - (yy - y0) * np.cos(ang)); t = (xx - x0) * np.cos(ang) + (yy - y0) * np.sin(ang)
        k = (d < 1.2) & (np.abs(t) < L / 2); rgb[k] = rgb[k] * .5 + 235 * .5
    # bordas gastas: a máscara perde pedacinhos e fica mais escura perto da beira
    m = al > 128; dist = ndimage.distance_transform_edt(m)
    come = (ruido(14) + .5) * 9; m &= dist > come * (rng.random() < 2)
    for _ in range(0):                                                         # (sem furos)
        x0, y0 = rng.choice([rng.uniform(0, W * .25), rng.uniform(W * .75, W)]), rng.choice([rng.uniform(0, H * .25), rng.uniform(H * .75, H)])
        m &= ((xx - x0) ** 2 + (yy - y0) ** 2) > (rng.uniform(6, 16)) ** 2
    dist = ndimage.distance_transform_edt(m); rgb *= (1 - np.clip(1 - dist / 18, 0, 1) * .35)[..., None]
    al = ndimage.gaussian_filter(m.astype(float), .9) * 255
    out = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), al]).astype("uint8"), "RGBA")
    out.thumbnail((360, 360), Image.LANCZOS); out.save(dst / (f.stem + ".webp"), "WEBP", quality=88)
print("ok")
