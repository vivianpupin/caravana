# Oráculo vira a Roda dos 12 Deuses (no lugar do Senet): textos do cartão que abre o oráculo no app.
import pathlib
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"; t = p.read_text()
R = [('h("span", { text: d ? `Sua última jogada parou na ${L.titulo || d}. Toque para jogar de novo.` : "Acenda a tocha, pense na sua pergunta e jogue o Senet, o jogo da passagem." })',
      'h("span", { text: d ? `Na última consulta, a roda parou em ${L.titulo || d}. Toque para girar de novo.` : "Acenda a tocha, pense na sua pergunta e gire a Roda dos 12 Deuses." })'),
     ('h("b", { text: "Oráculo de Amon" })', 'h("b", { text: "Roda dos 12 Deuses" })')]
for a, b in R:
    if b in t: continue
    if a in t: t = t.replace(a, b)
    else: print("não achei:", a[:60])
p.write_text(t); print("ok")
