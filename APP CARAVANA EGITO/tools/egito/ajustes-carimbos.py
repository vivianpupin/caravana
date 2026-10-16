# O medalhão da Travessia (selo "Embarque") não é um carimbo: sai das listas de carimbos do passaporte e da página inicial.
import pathlib
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
t = t.replace("const insigniaLocais = () => S.locais.filter(l => l.insignia).sort(byOrdem);", "const insigniaLocais = () => S.locais.filter(l => l.insignia && l.id !== \"embarque\").sort(byOrdem);")
t = t.replace('text: "Os carimbos da Índia Sagrada"', 'text: "Os carimbos do Egito"')
p.write_text(t); print("ok")
