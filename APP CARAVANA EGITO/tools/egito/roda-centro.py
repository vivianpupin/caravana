# Miolo da Roda dos 12 Deuses: a porta da tumba do Vale dos Reis (foto da Vivian, img/fundo-porta-dourada.webp),
# de frente e em pé, recortada em círculo com a passagem escura no meio. Gera app/img/roda-centro.webp (720x720).
# (Antes era o disco do teto de Dendera, mas a foto ficava deitada.) O movimento da parede é feito no CSS do oráculo.
import pathlib, numpy as np
from PIL import Image
R = pathlib.Path(__file__).resolve().parents[2]
im = Image.open(R / "app/img/fundo-porta-dourada.webp").convert("RGB")
c = im.crop((0, 380, 1200, 1580)).resize((720, 720), Image.LANCZOS)
a = np.asarray(c).astype(float); yy, xx = np.mgrid[0:720, 0:720]; d = np.hypot(xx - 359.5, yy - 359.5) / 360
a *= np.clip(1.06 - .5 * d ** 3, 0, 1)[..., None]
al = np.clip((1 - d) * 360, 0, 1) * 255
Image.fromarray(np.dstack([a.clip(0, 255), al]).astype("uint8"), "RGBA").save(R / "app/img/roda-centro.webp", "WEBP", quality=90)
print("ok")
