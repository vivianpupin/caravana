# Gera app/ceu-dados.js para o Céu de Nut a partir dos dados do d3-celestial (Olaf Frohn, licença BSD,
# estrelas do catálogo HYG/Hipparcos). Uso: python3 -I ceu-dados.py <pasta data do d3-celestial> <saida.js>
import json, sys
src, out = sys.argv[1], sys.argv[2]
ld = lambda n: json.load(open(f"{src}/{n}", encoding="utf-8"))
ra = lambda lon: round(lon % 360, 2)

# estrelas até magnitude 6 (o que se vê a olho nu num céu escuro como o do deserto): ra, dec, mag, cor (B-V)
est = []
for f in ld("stars.6.json")["features"]:
    lon, dec = f["geometry"]["coordinates"]; p = f["properties"]
    try: bv = float(p.get("bv") or 0.6)
    except ValueError: bv = 0.6
    est.append((f["id"], ra(lon), round(dec, 2), round(p["mag"], 2), round(bv, 2)))
est.sort(key=lambda s: s[3])

# nomes próprios das estrelas mais brilhantes (em português quando há costume)
PT = {"Sirius": "Sírius", "Arcturus": "Arcturo", "Capella": "Capela", "Procyon": "Prócion", "Achernar": "Achernar", "Aldebaran": "Aldebarã",
      "Spica": "Espiga", "Pollux": "Pólux", "Regulus": "Régulo", "Polaris": "Polar", "Alcyone": "Plêiades", "Hadar": "Hadar", "Acrux": "Ácrux"}
nomes = ld("starnames.json"); nm = {}
for sid, ra_, dec, mag, bv in est:
    n = nomes.get(str(sid), {}).get("name", "")
    if n and (mag < 2.6 or n in PT or n in ("Thuban", "Algol", "Mizar", "Albireo", "Alcor")): nm[sid] = PT.get(n, n)

# linhas das 88 constelações
lin = {}
for f in ld("constellations.lines.json")["features"]:
    lin[f["id"]] = [[[ra(a), round(b, 2)] for a, b in seg] for seg in f["geometry"]["coordinates"]]
cen = {f["id"]: [ra(f["geometry"]["coordinates"][0]), round(f["geometry"]["coordinates"][1], 1), int(f["properties"]["rank"])] for f in ld("constellations.json")["features"]}

# Via Láctea: os cinco níveis de brilho viram uma grade de 1° em coordenadas galácticas (faixa de b -35° a +35°), suavizada.
# A borda externa (nível 1) dá a volta no céu inteiro: cada borda fecha no polo galáctico do lado dela e a faixa é o que sobra.
import math
from PIL import Image, ImageDraw, ImageChops, ImageFilter
RR = math.radians
def gal(a, d):
    a, d = RR(a), RR(d); ap, dp, ln = RR(192.85948), RR(27.12825), RR(122.93192)
    b = math.asin(math.sin(d) * math.sin(dp) + math.cos(d) * math.cos(dp) * math.cos(a - ap))
    l = ln - math.atan2(math.cos(d) * math.sin(a - ap), math.sin(d) * math.cos(dp) - math.cos(d) * math.sin(dp) * math.cos(a - ap))
    return math.degrees(l) % 360, math.degrees(b)
K, B0 = 4, 35  # 4 px por grau na hora de desenhar
def px(l, b): return (l * K, (B0 - b) * K)
WD, HT = 360 * K, 2 * B0 * K
import numpy as np
total = np.zeros((HT, WD), np.float32)
for f in ld("milkyway.json")["features"]:
    m = np.zeros((HT, WD), bool)
    for anel in f["geometry"]["coordinates"]:
        g = [gal(*q) for q in anel]; u = [list(g[0])]
        for l, b in g[1:]:
            dl = (l - u[-1][0] + 180) % 360 - 180; u.append([u[-1][0] + dl, b])
        r = Image.new("1", (WD, HT), 0); dr = ImageDraw.Draw(r)
        for sh in (-360, 0, 360):
            pts = [px(l + sh, b) for l, b in u]
            if abs(u[-1][0] - u[0][0]) > 300:  # borda que dá a volta no céu: fecha no polo galáctico do lado dela
                polo = 90 if max(q[1] for q in u) > 10 else -90
                pts += [px(u[-1][0] + sh, polo), px(u[0][0] + sh, polo)]
            dr.polygon(pts, fill=1)
        m ^= np.array(r, bool)
    if f["id"] == "ol1": m = ~m  # as duas calotas fora da faixa -> a faixa
    total += m
img = Image.fromarray((total * 50).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(K * 1.2)).resize((360, 2 * B0), Image.BOX)
DIG = "0123456789abcdefghijklmnopqrstuvwxyz"
via = ["".join(DIG[min(35, round(img.getpixel((x, y)) / 250 * 35))] for x in range(360)) for y in range(2 * B0)]

js = ("// gerado por tools/egito/ceu-dados.py: estrelas (HYG/Hipparcos), linhas das constelações e Via Láctea do d3-celestial (c) Olaf Frohn, licença BSD\n"
      "window.CEU = " + json.dumps({"e": [x for s in est for x in s[1:]], "id": [s[0] for s in est], "n": {str(k): v for k, v in nm.items()}, "l": lin, "c": cen, "v": via},
                                   ensure_ascii=False, separators=(",", ":")) + ";\n")
open(out, "w", encoding="utf-8").write(js)
print(len(est), "estrelas,", len(nm), "nomes,", len(lin), "constelações,", round(len(js) / 1024), "KB")
