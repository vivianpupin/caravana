# Fundo de areia do app: a camada "areia" do PSD "cima" da Vivian (referencias/textura-areia-psd-cima.jpg, marrom),
# só a parte visível no PSD, girada em pé e recolorida para o tom de areia mantendo manchas, fibras e arranhões.
# Gera app/img/fundo-areia.webp.
import pathlib, numpy as np
from PIL import Image
R = pathlib.Path(__file__).resolve().parents[2]
im = Image.open(R / "referencias/textura-areia-psd-cima.jpg").convert("RGB").crop((195, 177, 195 + 2362, 177 + 1654)).rotate(90, expand=True)
a = np.asarray(im).astype(float); lum = a.mean(2)
out = np.array([196, 164, 118.])[None, None, :] * ((lum / lum.mean()) ** 1.25)[..., None]
Image.fromarray(out.clip(0, 255).astype("uint8")).resize((1080, 1542), Image.LANCZOS).save(R / "app/img/fundo-areia.webp", "WEBP", quality=86)
print("ok")
