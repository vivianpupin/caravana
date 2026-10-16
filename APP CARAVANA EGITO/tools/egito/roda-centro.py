# Miolo da Roda dos 12 Deuses: a barca do sol na noite (foto da Vivian no Vale dos Reis, referencias/fotos-vivian/barca-de-ra-noite.jpg).
# O deus com cabeça de carneiro sob a serpente Mehen fica no centro do círculo; as bordas somem no escuro, como numa tumba
# iluminada só no meio. Gera app/img/roda-centro.webp (720x720). O movimento e a luz dourada são feitos no CSS do oráculo.
import pathlib, numpy as np
from PIL import Image, ImageEnhance
R = pathlib.Path(__file__).resolve().parents[2]
im = Image.open(R / "referencias/fotos-vivian/barca-de-ra-noite.jpg").convert("RGB")
cx, cy, r = 800, 1010, 520
c = im.crop((cx - r, cy - r, cx + r, cy + r)).resize((720, 720), Image.LANCZOS)
c = ImageEnhance.Contrast(c).enhance(1.12)
a = np.asarray(c).astype(float); yy, xx = np.mgrid[0:720, 0:720]
d = np.hypot(xx - 359.5, yy - 350) / 360
a *= np.clip(1.12 - .95 * d ** 2.2, 0.05, 1.1)[..., None]          # meio aceso, bordas no escuro
a = a * np.array([1.0, .93, .82])                                    # luz de tocha, mais quente
dc = np.hypot(xx - 359.5, yy - 359.5) / 360
al = np.clip((1 - dc) * 360, 0, 1) * 255
Image.fromarray(np.dstack([a.clip(0, 255), al]).astype("uint8"), "RGBA").save(R / "app/img/roda-centro.webp", "WEBP", quality=90)
print("ok")
