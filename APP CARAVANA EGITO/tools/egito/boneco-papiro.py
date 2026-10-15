# Troca o desenho do explorador pelo estilo dos papiros (tools/egito/js/boneco-papiro.js) e o editor do Explorador.
# O desenho antigo continua no arquivo como desenhaBonecoIndia, sem uso.
import pathlib, re
raiz = pathlib.Path(__file__).resolve().parents[2]
p = raiz / "app" / "caravana-do-ceu.html"
t = p.read_text()
JS = (raiz / "tools" / "egito" / "js" / "boneco-papiro.js").read_text()
INI, FIM = "// ===== boneco-papiro (gerado) =====\n", "// ===== fim boneco-papiro =====\n"
if INI in t:
    a = t.index(INI); b = t.index(FIM) + len(FIM); t = t[:a] + INI + JS + FIM + t[b:]
else:
    t = t.replace("function desenhaBoneco(b) {", INI + JS + FIM + "function desenhaBonecoIndia(b) {", 1)
t = t.replace('const bonecoSvg = (b, cls) => h("svg", { viewBox: b.pet && b.pet !== "nenhum" ? "0 0 99 90" : "0 0 60 90", class: cls || "bonecosvg", role: "img", "aria-label": "Explorador", style: "overflow:visible" }, desenhaBoneco(b));',
              'const bonecoSvg = (b, cls) => { const grande = /\\bbig\\b/.test(cls || ""), e = bonecoEgito(b); return h("svg", { viewBox: grande || e.bicho !== "nenhum" ? "0 0 99 90" : "0 0 60 90", class: cls || "bonecosvg", role: "img", "aria-label": "Explorador", style: "overflow:visible" }, desenhaBoneco(b, grande)); };')
NOVO = '''      h("div", { class: "controls" },
        h("p", { class: "lab", text: "Inspirar-se em" }), h("div", { class: "opts" }, PAPIRO.personagens.map(([k, nome, o]) => h("button", { type: "button", class: "opt", onclick: () => { S.bonecoRasc = { ...S.bonecoRasc, ...o }; render(); } }, nome))),
        h("p", { class: "lab", text: "Cabeça" }), chips("cabeca", PAPIRO.cabeca),
        h("p", { class: "lab", text: "Pele" }), cores("pele", PAPIRO.pele, "Tom de pele"),
        h("p", { class: "lab", text: "Traje" }), chips("traje", PAPIRO.traje),
        h("p", { class: "lab", text: "Colar" }), chips("colar", PAPIRO.colar),
        h("p", { class: "lab", text: "Na mão" }), chips("item", PAPIRO.item),
        h("p", { class: "lab", text: "Barba" }), chips("barbaFalsa", PAPIRO.barbaFalsa),
        h("p", { class: "lab", text: "Animal sagrado" }), chips("bicho", PAPIRO.bicho),
        h("p", { class: "lab", text: "Cenário" }), chips("cenario", PAPIRO.cenario),
        null)),'''
a = t.index('      h("div", { class: "controls" },\n        h("p", { class: "lab", text: "Chapéu" })') if 'text: "Chapéu" })' in t else None
if a is not None:
    b = t.index("        null)),", a) + len("        null)),"); t = t[:a] + NOVO + t[b:]
# o boneco do editor já começa com os campos egípcios (bonecoEgito completa o que faltar)
t = t.replace('S.bonecoRasc = salvo ? maosSeparadas(bonecoDe(S.uid)) :', 'S.bonecoRasc = salvo ? bonecoEgito(maosSeparadas(bonecoDe(S.uid))) :')
t = t.replace('onclick: () => { S.bonecoRasc = bonecoPadrao(Math.random().toString(36)); render(); } }, "Sortear")',
              'onclick: () => { const s = a => a[Math.floor(Math.random() * a.length)]; S.bonecoRasc = { ...S.bonecoRasc, pele: s(PAPIRO.pele), ...s(PAPIRO.personagens)[2], item: s(PAPIRO.item)[0], bicho: s(PAPIRO.bicho)[0] }; render(); } }, "Sortear")')
# a fantasia dos deuses hindus embrulhava o desenho; sem deus escolhido, o desenho de papiro passa direto (com o cenário)
velho = "desenhaBoneco = function (b0) {\n  b0 = maosSeparadas(b0);"
if velho in t: t = t.replace(velho, "desenhaBoneco = function (b0, comCenario) {\n  if (!(b0.deus && DEUS[b0.deus])) return _desenhaBase(b0, comCenario);\n  b0 = maosSeparadas(b0);", 1)
p.write_text(t); print("boneco de papiro")
