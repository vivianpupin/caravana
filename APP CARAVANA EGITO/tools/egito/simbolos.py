# Símbolos egípcios (sinais da fonte Noto Sans Egyptian Hieroglyphs, livre) no mural da pedra e espalhados pelo app,
# sem explicação: Anúbis, ankh, djed, olho de Hórus, falcão, naja, escaravelho, lótus, shen, was, tyet, sol, estrela...
import pathlib, re
raiz = pathlib.Path(__file__).resolve().parents[2]
p = raiz / "app" / "caravana-do-ceu.html"
t = p.read_text()
SIMB = "𓃢𓁢𓋹𓊽𓂀𓁹𓅃𓆓𓅓𓄿𓆣𓆸𓈗𓇳𓇼𓍶𓌀𓎬𓋾𓀭𓀠𓂓𓈌𓆫𓆉𓆈𓆙𓃠𓅞𓆊𓄣𓄤𓆄𓏊𓁦𓁟𓁷𓆏𓅱𓃭"
JS = 'const SIMBOLOS_EG = [..."%s"];\n' % SIMB
if "const SIMBOLOS_EG" not in t:
    t = t.replace("const GLIFOS = [", JS + "const GLIFOS = [", 1)
# no mural: cada marca leva dois sinais gravados na pedra, sorteados pela própria marca
velho = re.search(r'h\("svg", \{ class: "glifo", viewBox: "0 0 64 40", "aria-hidden": "true" \}, GLIFOS\[n % GLIFOS\.length\]\.map\(.*?\)\)\),\n', t, re.S)
if velho:
    t = t[:velho.start()] + 'h("span", { class: "glifo eg", "aria-hidden": "true", text: SIMBOLOS_EG[n % SIMBOLOS_EG.length] + SIMBOLOS_EG[(n >>> 5) % SIMBOLOS_EG.length] }),\n' + t[velho.end():]
p.write_text(t)
css = raiz / "tools" / "egito" / "tema-gibi.css"
c = css.read_text()
if "/* símbolos egípcios */" not in c:
    sel = lambda k: f':is(.panel,.day,.sab,details.guide,.missoes,.esccard):nth-child({len(SIMB)}n+{k})::after'
    regras = "\n".join(f':is(.panel,.day,.sab,details.guide,.missoes):nth-of-type(9n+{k+1})::after{{content:"{ch}"}}' for k, ch in enumerate("𓋹𓂀𓆣𓊽𓅃𓆸𓍶𓃢𓇳"))
    c += '''
/* símbolos egípcios: aparecem gravados aqui e ali, sem explicação */
.marca .glifo.eg{width:auto;height:auto;display:block;font:44px/1 "Noto Sans Egyptian Hieroglyphs",serif;letter-spacing:.08em;filter:url(#cravado);
  text-shadow:0 -1px 0 rgba(0,0,0,.85),-1px -1px 1px rgba(0,0,0,.55),0 1px 0 rgba(255,228,190,.38)}
:is(.panel,.day,.sab,details.guide,.missoes){position:relative}
:is(.panel,.day,.sab,details.guide,.missoes)::after{position:absolute;right:8px;bottom:4px;font:22px/1 "Noto Sans Egyptian Hieroglyphs",serif;color:rgba(70,42,16,.16);pointer-events:none}
''' + regras + '''
/* friso de sinais no fim de cada página e embaixo do título da página inicial */
.view::after{content:"𓋹 𓂀 𓆣 𓊽 𓅃 𓆸 𓍶 𓃢 𓇳 𓇼";display:block;text-align:center;margin:26px 0 6px;font:20px/1 "Noto Sans Egyptian Hieroglyphs",serif;letter-spacing:.35em;color:rgba(60,36,14,.32);pointer-events:none}
.mapahero h1::after{content:"𓇼 𓋹 𓇼";display:block;margin-top:6px;font:16px/1 "Noto Sans Egyptian Hieroglyphs",serif;letter-spacing:.5em;color:rgba(60,36,14,.45)}
'''
    css.write_text(c)
h = p.read_text()
p.write_text(re.sub(r'(<style id="tema-gibi">)(.*?)(</style>)', lambda m: m.group(1) + "\n" + css.read_text() + m.group(3), h, count=1, flags=re.S))
print("símbolos")
