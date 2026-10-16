# Fundo do título da página inicial: parede de hieróglifos do Vale dos Reis (foto da Vivian, referencias/fotos-vivian/colunas-cartucho-a.jpg)
# em marrom de uma cor só (tinta → areia), com contraste baixo para não poluir. Gera app/img/fundo-titulo.webp.
# No CSS (tema-gibi.css) ela fica logo abaixo do cabeçalho, com o cartucho dourado no alto, e some num degradê suave antes do mapa.
import pathlib, numpy as np
from PIL import Image
R = pathlib.Path(__file__).resolve().parents[2]
esc, cla = np.array([92, 58, 28.]), np.array([238, 222, 190.])
im = Image.open(R / "referencias/fotos-vivian/colunas-cartucho-a.jpg").convert("L"); im = im.crop((0, 12, im.width, im.height))
a = np.asarray(im).astype(float) / 255
lo, hi = np.percentile(a, 3), np.percentile(a, 97); a = np.clip((a - lo) / (hi - lo), 0, 1)
a = .18 + .82 * a ** .9
out = esc[None, None] * (1 - a[..., None]) + cla[None, None] * a[..., None]
Image.fromarray(out.clip(0, 255).astype("uint8")).resize((1080, int(im.height * 1080 / im.width)), Image.LANCZOS).save(R / "app/img/fundo-titulo.webp", "WEBP", quality=84)
print("ok")
