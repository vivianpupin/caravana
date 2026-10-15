# Troca o Oráculo dos Planetas (Índia) pelo Oráculo de Amon dentro do app do Egito.
# O oráculo vive em app/oraculo.html e abre numa janela de tela cheia; a última leitura aparece no cartão dos Saberes.
import pathlib, re
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
NOVO_CARD = '''function vOraculoCard() {
  let L = null; try { L = JSON.parse(localStorage.getItem("cdi-oraculo-egito") || "null"); } catch (e) {}
  const NOMES = { ra: "Rá", thoth: "Thoth", isis: "Ísis", osiris: "Osíris", horus: "Hórus", anubis: "Anúbis", hathor: "Hathor", maat: "Maat", ptah: "Ptah", amon: "Amon", sobek: "Sobek", imhotep: "Imhotep" };
  const d = L && (L.titulo || NOMES[L.deus]);
  return h("button", { type: "button", class: "oraculocard amon", onclick: () => abrirOraculo() },
    h("img", { class: "orcdeus", src: "deuses/" + (L && L.deus ? L.deus : "amon") + ".webp", alt: "" }),
    h("span", { class: "orctx" }, h("small", { text: "Templo de Amon" }), h("b", { text: "Oráculo de Amon" }),
      h("span", { text: d ? `Sua última jogada parou na ${L.titulo || d}. Toque para jogar de novo.` : "Acenda a tocha, pense na sua pergunta e jogue o Senet, o jogo da passagem." })));
}
'''
NOVO_ABRIR = '''function abrirOraculo() {
  closeSheets();
  const fr = h("iframe", { src: "oraculo.html", title: "Oráculo de Amon", class: "orframe", allow: "autoplay" });
  const caixa = h("div", { class: "orsheet", role: "dialog", "aria-label": "Oráculo de Amon" }, fr);
  const fecha = e => { if (e.data !== "fecha-oraculo") return; removeEventListener("message", fecha); caixa.remove(); render(); };
  addEventListener("message", fecha);
  document.body.append(caixa);
}
'''
if "oraculocard amon" not in t:
    a = t.index("function vOraculoCard() {"); b = t.index("function leituraOraculo(")
    t = t[:a] + NOVO_CARD + t[b:]
    a = t.index("function abrirOraculo() {"); b = t.index("function vSaberes() {")
    t = t[:a] + NOVO_ABRIR + t[b:]
    p.write_text(t); print("oráculo de Amon no app")
else:
    print("já estava")
