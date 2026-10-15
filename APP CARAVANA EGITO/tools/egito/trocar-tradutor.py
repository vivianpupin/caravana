"""Tradutor e frases prontas: hindi vira árabe egípcio (o que se fala na rua no Egito)."""
import pathlib, json
raiz = pathlib.Path(__file__).resolve().parents[2]
arq = raiz / "app" / "caravana-do-ceu.html"; t = arq.read_text(encoding="utf-8")
def troca(v, n, todas=False):
    global t
    c = t.count(v)
    if c == 0:
        if n in t: return
        raise SystemExit("não achei: " + v[:80])
    if c > 1 and not todas: raise SystemExit(f"{c}x: " + v[:80])
    t = t.replace(v, n)

# frases prontas em árabe egípcio: [português, como se escreve com letras nossas, em árabe, como se fala]
FRASES = [
    ["Olá (a saudação de todo dia)", "Salam aleikum", "السلام عليكم", "sa-LÁM a-LÊI-kum"],
    ["Resposta à saudação", "Aleikum salam", "وعليكم السلام", "a-LÊI-kum sa-LÁM"],
    ["Obrigado(a)", "Shukran", "شكرًا", "CHÚ-kran"],
    ["Por favor", "Min fadlak / Min fadlik", "من فضلك", "min FÁD-lak (a um homem), min FÁD-lik (a uma mulher)"],
    ["Sim / Não", "Aiwa / La'", "أيوه / لا", "ÁI-ua / lá"],
    ["Não, obrigado(a)", "La', shukran", "لا، شكرًا", "lá, CHÚ-kran"],
    ["Chega / já basta (para vendedor insistente)", "Khalas", "خلاص", "rra-LÁS"],
    ["Quanto custa?", "Bikam?", "بكام؟", "bi-KÁM"],
    ["Está muito caro", "Ghali awi", "غالي أوي", "RRÁ-li Á-ui"],
    ["Água", "Mayya", "ميّة", "MÁI-ia"],
    ["Sem pimenta, por favor", "Min ghir shatta", "من غير شطة", "min rrêr CHÁ-ta"],
    ["Onde fica o banheiro?", "Fein el-hammam?", "فين الحمام؟", "fêin el-ra-MÁM"],
    ["Tudo bem / ok", "Tamam", "تمام", "ta-MÁM"],
    ["Muito bonito!", "Gamil awi!", "جميل أوي", "ga-MÍL Á-ui"],
    ["Vamos!", "Yalla!", "يلا", "IÁ-la"],
    ["Se Deus quiser", "Inshallah", "إن شاء الله", "in-CHA-lá"],
    ["Socorro / ajuda!", "Ilha'uni!", "الحقوني", "il-RA-u-ni"],
]
i = t.index("const HINDI = ["); j = t.index("];\n", i) + 3
t = t[:i] + "const HINDI = [\n" + ",\n".join("  " + json.dumps(f, ensure_ascii=False) for f in FRASES) + "\n];\n" + t[j:]

troca('function falar(txt) { falarEm(txt, "hi-IN", .85); }', 'function falar(txt) { falarEm(txt, "ar-EG", .85); }')
troca('// ---------- Tradutor: português ↔ hindi / inglês, para conversar na rua ----------', '// ---------- Tradutor: português ↔ árabe / inglês, para conversar na rua ----------')
troca('const LINGUAS = { pt: ["Português", "pt-BR"], hi: ["Hindi", "hi-IN"], en: ["Inglês", "en-IN"] };', 'const LINGUAS = { pt: ["Português", "pt-BR"], ar: ["Árabe", "ar-EG"], en: ["Inglês", "en-US"] };')
troca('S.trad = { modo: "eu", outra: "hi",', 'S.trad = { modo: "eu", outra: "ar",')
troca('// 1º Google (melhor para hindi, e já dá a pronúncia em letras latinas); 2º MyMemory', '// 1º Google (já dá a pronúncia do árabe em letras latinas); 2º MyMemory')
troca('rom: para === "hi" && rm ? rm[2] : "", origRom: de === "hi" && rm ? rm[3] || "" : ""', 'rom: para === "ar" && rm ? rm[2] : "", origRom: de === "ar" && rm ? rm[3] || "" : ""')
troca('(T.outra === "hi" ? "Peça para a pessoa falar em hindi, ou digite…"', '(T.outra === "ar" ? "Peça para a pessoa falar em árabe, ou digite…"')
troca('(T.outra === "hi" ? " em hindi. Se o teclado não tiver hindi, toque no globo 🌐 para trocar."', '(T.outra === "ar" ? " em árabe. Se o teclado não tiver árabe, toque no globo 🌐 para trocar."')
troca('h("div", { class: "opts" }, ["hi", "en"].map(', 'h("div", { class: "opts" }, ["ar", "en"].map(')
troca('h("p", { class: "eyebrow", text: "Fale com a Índia" })', 'h("p", { class: "eyebrow", text: "Fale com o Egito" })')
troca('h("p", { class: "tradtxt", lang: R.para, text: R.trad })', 'h("p", { class: "tradtxt", lang: R.para, dir: R.para === "ar" ? "rtl" : "auto", text: R.trad })')
troca('h("b", { text: "Frases úteis em hindi" }), h("span", { text: "Namaste, obrigado, quanto custa e outras, com a pronúncia." })', 'h("b", { text: "Frases úteis em árabe" }), h("span", { text: "Salam aleikum, obrigado, quanto custa e outras, com a pronúncia." })')
troca('"A sílaba em maiúsculas é a mais forte. O h soa como no inglês house."', '"A sílaba em maiúsculas é a mais forte. O rr soa como o r carioca, raspado na garganta."')
troca('h("span", { class: "hdev", lang: "hi", text: dev })', 'h("span", { class: "hdev", lang: "ar", dir: "rtl", text: dev })')
troca('<a href="#hindi">Hindi</a>', '<a href="#hindi">Árabe</a>')
troca('<h2 id="hindi">Frases úteis em hindi</h2>', '<h2 id="hindi">Frases úteis em árabe</h2>')
troca('"Aprenda uma palavra em hindi e use com alguém hoje. Comece por dhanyavaad, que quer dizer obrigado."', '"Aprenda uma palavra em árabe e use com alguém hoje. Comece por shukran, que quer dizer obrigado."')
arq.write_text(t, encoding="utf-8")

f = raiz / "netlify" / "functions" / "falar.mjs"; s = f.read_text(encoding="utf-8")
s = s.replace('const LINGUAS = { hi: "hi", en: "en", pt: "pt-BR" };', 'const LINGUAS = { ar: "ar", hi: "hi", en: "en", pt: "pt-BR" };').replace('|| "hi";', '|| "ar";')
s = s.replace("busca a fala em hindi, inglês ou português", "busca a fala em árabe, inglês ou português")
s = s.replace('resto.lastIndexOf("।", max)', 'resto.lastIndexOf("،", max)')
f.write_text(s, encoding="utf-8")
print("ok")
