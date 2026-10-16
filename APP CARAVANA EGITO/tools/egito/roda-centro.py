# Miolo da Roda dos 12 Deuses: o disco do teto de Dendera (foto da Vivian, img/fundo-zodiaco.webp),
# recortado em círculo com o céu azul em volta. Gera app/img/roda-centro.webp (600x600, fundo transparente).
import pathlib, numpy as np
from PIL import Image
R = pathlib.Path(__file__).resolve().parents[2]
im = Image.open(R / "app/img/fundo-zodiaco.webp").convert("RGB")
cx, cy, r = 808, 655, 265
c = im.crop((cx - r, cy - r, cx + r, cy + r)).resize((600, 600), Image.LANCZOS)
a = np.asarray(c).astype(float); yy, xx = np.mgrid[0:600, 0:600]; d = np.hypot(xx - 299.5, yy - 299.5) / 300
a *= np.clip(1.08 - .55 * d ** 3, 0, 1)[..., None]                 # beirada mais escura, como pedra
al = np.clip((1 - d) * 300, 0, 1) * 255
Image.fromarray(np.dstack([a.clip(0, 255), al]).astype("uint8"), "RGBA").save(R / "app/img/roda-centro.webp", "WEBP", quality=90)
print("ok")
