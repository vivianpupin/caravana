# Frases curtas que giram embaixo do título da página inicial (cabem numa linha só no celular; sem ponto final, pedido da Vivian).
import pathlib, re
p = pathlib.Path(__file__).resolve().parents[2] / "app" / "caravana-do-ceu.html"
t = p.read_text()
LISTA = """const FRASES = [
  "Treze dias atravessando o Egito de norte a sul",
  "Uma caravana é feita de quem caminha junto",
  "Caminhos abertos e chuva de bênçãos",
  "Cada manhã, uma nova partida",
  "Eu vim pra Terra pra me vestir de quem eu sou",
  "Explorando a origem, nos sabemos infinitos",
  "Das escolas iniciáticas do Antigo Egito",
  "Pirâmides, templos, desertos e o Mar Vermelho",
  "Siga a rota, ganhe os carimbos",
  "Um enigma ainda vivo, inscrito nas pedras",
  "Partimos quando as estrelas orientam a rota",
  "O Nilo leva, o deserto ensina",
  "Eu trarei do silêncio a minha paz",
  "Você chega em casa diferente",
  "O Egito te ensina que o tempo é outra coisa",
  "Eu vim de longe, lá das estrelas",
  "A Luz de todas as Luzes é você",
  "Eu toco o céu e a terra. Sou início e fim",
  "O meu caminho eu vou trilhar",
  "Que o coração fique leve como a pena de Maat",
  "Sob o céu de Nut, a caravana descansa",
  "Todo amanhecer é Rá nascendo de novo"
];"""
t = re.sub(r'const FRASES = \[\n.*?\n\];', lambda m: LISTA, t, count=1, flags=re.S)
p.write_text(t); print("frases")
