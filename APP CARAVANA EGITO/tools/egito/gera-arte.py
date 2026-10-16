import sys; sys.path.insert(0, ".")
from pinta import *
from PIL import Image, ImageDraw
o = "arte/"
# Sah (Órion, Osíris): homem caminhando com o cetro, pele vermelha, saiote branco, peruca azul e a estrela sobre a cabeça
def sah_extra(img, d):
    W, H = img.size; novo = Image.new("RGBA", (W, H + 110), (0, 0, 0, 0)); novo.paste(img, (0, 110)); estrela(ImageDraw.Draw(novo), W * .64, 62, 52); return novo
pinta(0x1301a, "#B5502A", o + "sah.png", mapa={2: "#1F3570", 3: "#B5502A", 4: "#B5502A", 5: None, 6: None, 7: "#F3EAD3", 9: "#F3EAD3", 8: "#E2B85A", 10: "#8E3B1F", 11: None, 12: "#B5502A"}, extra=sah_extra)
# Sopdet (Sírius): a vaca deitada no barco, com a estrela entre os chifres (como no zodíaco de Dendera)
def barco(img, d):
    W, H = img.size; novo = Image.new("RGBA", (W, H + 170), (0, 0, 0, 0)); novo.paste(img, (0, 0)); d = ImageDraw.Draw(novo)
    y = H - 50; pts = [(-0, y - 70)] + [(W * t, y + 90 * math.sin(math.pi * t)) for t in [i / 30 for i in range(31)]] + [(W, y - 70)]
    casco = [(20, y - 90), (70, y - 10)] + [(W * (.08 + .84 * t), y + 20 + 70 * math.sin(math.pi * t)) for t in [i / 30 for i in range(31)]] + [(W - 70, y - 10), (W - 20, y - 90), (W - 60, y - 20)] + [(W * (.08 + .84 * t), y + 0 + 40 * math.sin(math.pi * t)) for t in [i / 30 for i in range(30, -1, -1)]] + [(60, y - 20)]
    d.polygon(casco, fill=(46, 84, 150, 255)); d.line(casco + [casco[0]], fill=TRACO + (255,), width=14)
    for k in range(6): xx = W * (.18 + .13 * k); d.line([(xx, y + 18 + 30 * math.sin(math.pi * (xx / W))), (xx, y + 40 + 55 * math.sin(math.pi * (xx / W)))], fill=(226, 184, 90, 255), width=8)
    estrela(d, 330, 70, 58); return novo
pinta(0x130dc, "#E8B84A", o + "sopdet.png", estrelas=3, extra=barco)
pinta(0x130d2, "#B8541F", o + "meskhetiu.png", estrelas=7, raio_est=30)   # Meskhetiu: o touro das sete estrelas
pinta(0x130ef, "#3E86B0", o + "reret.png", estrelas=4)                   # Reret: o hipopótamo azul (como os de faiança)
pinta(0x130ec, "#E0A33A", o + "leao.png", estrelas=4)                    # o Leão de Dendera
pinta(0x130d3, "#C9762E", o + "touro.png", estrelas=4)                   # o Touro
pinta(0x130dd, "#D9A35A", o + "carneiro.png", estrelas=4)                # o Carneiro de Amon
