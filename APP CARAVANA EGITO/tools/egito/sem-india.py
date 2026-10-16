# Tira o conteúdo da Índia que ainda sobrava no app e põe o do Egito, seguindo o roteiro oficial (app/dados/travessia.json):
# guardiões, palavras de poder do dia, perguntas do diário, carta final, jogo, conversor, cenários do retrato, mural, cópia sem internet e textos da IA.
# Roda de novo sem estragar nada (cada troca só acontece uma vez).
import json, pathlib, re
R = pathlib.Path(__file__).resolve().parents[2]
p = R / "app" / "caravana-do-ceu.html"; t = p.read_text()
J = lambda s: json.dumps(s, ensure_ascii=False)
falta = []
def troca(a, b, n=1):
    global t
    if b in t and a not in t: return
    if a not in t: falta.append(a[:80]); return
    t = t.replace(a, b) if n == 0 else t.replace(a, b, n)
def bloco(ini, fim, novo):
    global t
    a = t.find(ini); b = t.find(fim, a)
    if a < 0 or b < 0: falta.append(ini[:60]); return
    t = t[:a] + novo + t[b:]

# ---------- guardiões: os 12 deuses do Egito, cada um num lugar do roteiro ----------
G = [
 ("ra", "Rá", "o sol que renasce", "O seu guardião é Rá, o sol! Para os egípcios ele não só nascia: ele atravessava a noite inteira lutando e vencia, todos os dias. É o deus de quem sabe recomeçar.",
  [("☀️", "Uma barca para o dia e outra para a noite", "Rá cruza o céu de dia numa barca e, ao pôr do sol, troca de barca para atravessar as doze horas da noite no mundo de baixo."),
   ("🐍", "A serpente de toda noite", "Toda noite a serpente Apófis tenta engolir a barca do sol. E toda manhã Rá vence e nasce de novo no horizonte."),
   ("🪲", "Três rostos do sol", "De manhã ele é Khepri, o escaravelho que empurra o sol. Ao meio-dia é Rá. No fim da tarde, Atum, o velho sol que se deita.")],
  "No Vale dos Reis, no dia 9. Nas paredes das tumbas, a barca de Rá atravessa as horas da noite, pintada em cores que ainda brilham depois de três mil anos."),
 ("thoth", "Thoth", "a palavra e a sabedoria", "O seu guardião é Thoth, o escriba dos deuses! Foi ele quem deu a escrita aos egípcios. Com cabeça de íbis, ele anota tudo o que acontece no céu e na terra.",
  [("🪶", "O inventor dos hieróglifos", "Os egípcios chamavam a escrita de medu-netjer, as palavras dos deuses, porque ela tinha vindo de Thoth."),
   ("🌙", "O senhor da Lua", "Thoth também é a Lua, que mede o tempo. Os sacerdotes contavam os meses pelas fases dela."),
   ("⚖️", "O que anota a pesagem", "Na pesagem do coração, é Thoth quem escreve o resultado, com o seu junco de escriba.")],
  "No dia 3, no Museu Egípcio, nos papiros da pesagem do coração. E em quase todos os templos da viagem, sempre com o junco e a paleta de escriba."),
 ("isis", "Ísis", "o cuidado e a magia", "A sua guardiã é Ísis, a grande mágica! Ela juntou os pedaços de Osíris pelo Egito inteiro e, com a sua magia, trouxe o amado de volta à vida.",
  [("🧩", "Os pedaços espalhados", "Quando Seth despedaçou Osíris, Ísis procurou cada parte pelo Egito, juntou todas e o fez viver de novo por tempo suficiente para gerar Hórus."),
   ("🪑", "Um trono na cabeça", "O hieróglifo do nome dela é um trono, e é ele que ela leva na cabeça em muitas imagens."),
   ("🏛️", "O último templo", "O templo dela em Philae foi o último do Egito a funcionar, séculos depois dos outros já estarem fechados.")],
  "Em Philae, em Aswan, no dia 6: o templo de Ísis numa ilha no meio do Nilo, onde se chega de barco."),
 ("osiris", "Osíris", "o que renasce", "O seu guardião é Osíris, o deus que morreu e voltou! Ele foi rei do Egito, ensinou a plantar e virou o senhor do mundo dos mortos. É a força de tudo o que brota de novo.",
  [("🌱", "Sementes no corpo", "Os egípcios faziam figuras de Osíris de barro com sementes de cevada. Quando brotavam, era a prova de que a vida volta."),
   ("💚", "A pele verde", "Osíris aparece com a pele verde, a cor das plantas novas, ou preta, a cor da terra fértil que a cheia do Nilo deixava."),
   ("👑", "Todo faraó vira Osíris", "Quando o faraó morria, ele se tornava Osíris. Por isso as estátuas dos reis aparecem com os braços cruzados, como ele.")],
  "Em Philae, no dia 6, ao lado de Ísis, e no Vale dos Reis, no dia 9, onde cada faraó vira Osíris para atravessar a noite."),
 ("horus", "Hórus", "a visão e a coragem", "O seu guardião é Hórus, o falcão que vê longe! Filho de Ísis e Osíris, ele lutou para recuperar o trono do pai. Todo faraó era chamado de Hórus vivo.",
  [("👁️", "O olho curado", "Na luta contra Seth, Hórus perdeu um olho. Thoth o curou, e esse olho, o udjat, virou o amuleto de proteção mais usado do Egito."),
   ("🦅", "O falcão no céu", "O nome dele quer dizer o que está no alto. Um olho é o Sol, o outro é a Lua."),
   ("⚔️", "A luta pelo trono", "A briga de Hórus e Seth durou oitenta anos, segundo o mito, e acabou num tribunal dos deuses.")],
  "Em Edfu, no dia 8: o templo de Hórus, um dos mais inteiros do Egito, com um grande falcão de granito na porta."),
 ("anubis", "Anúbis", "o guardião das passagens", "O seu guardião é Anúbis, o que conduz pelos caminhos escuros! Com cabeça de chacal, ele guiava as almas até o salão da pesagem do coração.",
  [("🐺", "Por que um chacal?", "Os chacais rondavam os cemitérios na beira do deserto. Os egípcios fizeram do bicho temido um protetor dos mortos."),
   ("🏺", "O primeiro embalsamador", "Foi Anúbis quem preparou o corpo de Osíris. Os sacerdotes que faziam múmias usavam uma máscara dele."),
   ("⚖️", "O que segura a balança", "Na pesagem do coração, é Anúbis quem ajusta a balança, com a pena de Maat do outro lado.")],
  "No dia 9, no Vale dos Reis e no templo de Hatshepsut, que tem uma capela só para ele."),
 ("hathor", "Hathor", "a alegria e o amor", "A sua guardiã é Hathor, a senhora da alegria! Deusa da música, da dança e do amor, ela também recebia o sol no fim do dia.",
  [("🐄", "A vaca do céu", "Hathor aparece como uma vaca, como uma mulher com chifres e o disco do sol, ou com orelhas de vaca."),
   ("🎶", "O sistro", "O instrumento dela é o sistro, um chocalho de metal. O som afastava o mal e alegrava os deuses."),
   ("🍺", "A leoa que adormeceu", "Para acalmar a fúria da leoa Sekhmet, os deuses tingiram cerveja de vermelho. Ela bebeu, dormiu e acordou como a doce Hathor.")],
  "Em Abu Simbel, no dia 7: o templo menor, de Nefertari, é dedicado a Hathor. Ela também tem uma capela no templo de Hatshepsut, no dia 9."),
 ("maat", "Maat", "a verdade e o equilíbrio", "A sua guardiã é Maat, o equilíbrio do mundo! Mais que uma deusa, ela era a própria ordem das coisas: o sol nascer, o Nilo encher, as pessoas serem justas.",
  [("🪶", "A pena", "O sinal de Maat é uma pena de avestruz, que ela leva na cabeça. É essa pena que vai na balança contra o coração."),
   ("👑", "O dever do faraó", "O trabalho mais importante do faraó era manter Maat e afastar o caos, que os egípcios chamavam de isfet."),
   ("📜", "As confissões", "Diante da balança, o morto dizia: não menti, não roubei, não fiz ninguém chorar. Eram as confissões de Maat.")],
  "No dia 9, no Vale dos Reis: Maat abre as asas na entrada de muitas tumbas, guardando o caminho do faraó."),
 ("ptah", "Ptah", "a criação pela palavra", "O seu guardião é Ptah, o criador! Ele fez o mundo pensando com o coração e falando com a língua. É o patrono dos artesãos e de tudo o que se faz com as mãos.",
  [("💬", "Criar falando", "Em Mênfis contavam que Ptah pensou o mundo no coração e, ao dizer o nome de cada coisa, ela passava a existir."),
   ("🔨", "O deus dos artesãos", "Escultores, ourives e construtores pediam ajuda a Ptah. O sumo sacerdote dele era chamado de mestre dos artesãos."),
   ("🌑", "A estátua que fica no escuro", "Em Abu Simbel, duas vezes por ano o sol entra até o fundo do templo e ilumina três estátuas. A de Ptah, deus ligado ao mundo de baixo, fica na sombra.")],
  "Em Abu Simbel, no dia 7, sentado no fundo do santuário, ao lado de Amon, Rá e do próprio Ramsés."),
 ("amon", "Amon", "o oculto", "O seu guardião é Amon, o oculto! O nome dele quer dizer o escondido. Ele é o sopro, o vento: o que não se vê mas move tudo.",
  [("🌬️", "O deus do sopro", "Amon era o ar e o vento. Em Tebas, ele se juntou a Rá e virou Amon-Rá, o rei dos deuses."),
   ("🏛️", "O maior templo", "Para ele foi construído Karnak, o maior conjunto de templos da Antiguidade, aumentado por quase dois mil anos."),
   ("⛵", "O deus que respondia", "Nas festas, a estátua de Amon saía numa barca carregada pelos sacerdotes e respondia às perguntas do povo.")],
  "Em Luxor, no dia 8, no templo de Luxor, e no dia 9 em Karnak, a casa de Amon, entre as colunas gigantes."),
 ("sobek", "Sobek", "a força do Nilo", "O seu guardião é Sobek, o deus crocodilo! Temido e amado, ele vivia onde a água do Nilo trazia vida. É a força crua de quem protege.",
  [("🐊", "Crocodilos com brincos", "Em alguns templos, os sacerdotes criavam crocodilos sagrados, enfeitados com joias, e os mumificavam quando morriam."),
   ("🌊", "O senhor das águas", "Sobek era ligado à cheia do Nilo, que tornava a terra fértil."),
   ("🏛️", "Um templo dividido em dois", "Em Kom Ombo, o templo tem duas metades iguais: uma de Sobek e outra de Hórus, o Velho.")],
  "Em Kom Ombo, no dia 7, onde há um templo para ele e um museu de crocodilos mumificados."),
 ("imhotep", "Imhotep", "a sabedoria que constrói", "O seu guardião é Imhotep, o sábio que virou deus! Ele foi uma pessoa de verdade: arquiteto, médico e conselheiro do faraó Djoser. Séculos depois, os egípcios passaram a adorá-lo.",
  [("🏗️", "A primeira pirâmide", "Imhotep desenhou a Pirâmide de Degraus de Djoser, em Saqqara, a primeira grande construção de pedra do mundo."),
   ("⚕️", "O médico", "Ele foi lembrado como grande médico. Os gregos o comparavam ao seu deus da cura, Asclépio."),
   ("📜", "Um escriba como nós", "Os escribas derramavam um pouco de água para Imhotep antes de começar a escrever.")],
  "Em Saqqara, no dia 3, diante da Pirâmide de Djoser, que ele construiu, e no museu que leva o nome dele."),
]
DUA = {"ra": ["Ra-Horakhty", "Rá-Hórus dos dois horizontes"], "thoth": ["Djehuty, neb medu-netjer", "Thoth, senhor das palavras divinas"], "isis": ["Aset, weret hekau", "Ísis, a grande de magia"],
       "osiris": ["Wsir, Khentyamentiu", "Osíris, o primeiro dos ocidentais"], "horus": ["Heru, nedj-it-ef", "Hórus, o que defende o pai"], "anubis": ["Inpu, khenty seh-netjer", "Anúbis, o que preside a tenda divina"],
       "hathor": ["Hut-Heru, nebet Iunet", "Hathor, senhora de Dendera"], "maat": ["Maat, sat Ra", "Maat, a filha de Rá"], "ptah": ["Ptah, nefer-her", "Ptah, o de belo rosto"],
       "amon": ["Imen-Ra, nesu-netjeru", "Amon-Rá, rei dos deuses"], "sobek": ["Sobek-Ra", "Sobek, o crocodilo que é também o sol"], "imhotep": ["Imhotep, sa Ptah", "Imhotep, filho de Ptah"]}
linhas = []
for gid, nome, frase, intro, cartas, onde in G:
    c = ", ".join(f"[{J(a)}, {J(b)}, {J(x)}]" for a, b, x in cartas)
    linhas.append(f"  {gid}: {{ nome: {J(nome)}, frase: {J(frase)}, intro: {J(intro)},\n    cartas: [{c}],\n    onde: {J(onde)}, mantra: {J('Dua ' + DUA[gid][0])}, trad: {J('Louvor a ' + DUA[gid][1] + '.')} }}")
bloco("const GUARDIOES = {", "// o link da passagem pode trazer o guardião", "const GUARDIOES = {\n" + ",\n".join(linhas) + "\n};\n")
troca('const G_SORTEIO = ["ganesha", "hanuman", "lakshmi", "shiva", "durga", "saraswati", "krishna", "ganga"];', "const G_SORTEIO = Object.keys(GUARDIOES);")
troca("G_SORTEIO[(+n || 0) % 8]", "G_SORTEIO[(+n || 0) % G_SORTEIO.length]")
troca('onclick: () => abrirGuardiao(3) }, "Aprender o mantra")', 'onclick: () => abrirGuardiao(3) }, "Aprender as palavras de poder")')
troca('text: "O mantra de " + G.nome }),', 'text: "As palavras de poder de " + G.nome }),')

# ---------- palavras de poder do dia (no lugar dos mantras), uma por dia do roteiro ----------
M = {
 1: (["𓅓𓊵𓏏𓊪"], "Em hotep", ["Em hotep"], "Em paz. Era assim que os egípcios davam as boas-vindas e se despediam.", "Para chegar ao Egito."),
 2: (["𓋹𓍑𓋴"], "Ankh, udja, seneb", ["Ankh, udja, seneb"], "Vida, prosperidade, saúde! Os egípcios escreviam isso depois do nome do faraó, como um desejo de bem.", "Diante das pirâmides."),
 3: (["𓇼𓀢𓊹"], "Dua netjer", ["Dua netjer"], "Graças a deus. Era o jeito egípcio de agradecer.", "No dia de Saqqara e do museu."),
 4: (["𓇯"], "Nut, a mãe do céu", ["Ó minha mãe Nut,", "estende-te sobre mim,", "para que eu esteja entre as estrelas que não se apagam."], "Pedido pintado na tampa de muitos sarcófagos: a deusa do céu se abre sobre quem dorme embaixo dela.", "Para a noite no deserto."),
 5: (["𓆣"], "Kheper", ["Kheper-i, kheper kheperu"], "Eu vim a ser, e tudo veio a ser. É a fala do criador no começo do mundo, na forma de Khepri, o escaravelho do sol que nasce.", "Para o nascer do sol no deserto."),
 6: (["𓈗"], "Hino ao Nilo", ["Salve, Hapi,", "que brotas da terra", "e vens fazer o Egito viver!"], "Começo do Hino ao Nilo, cantado pelos egípcios para a cheia que trazia a vida.", "Para o dia no Nilo, em Aswan."),
 7: (["𓄤"], "Nefertari", ["Nefertari, merit-en-Mut"], "Nefertari, a mais bela, amada de Mut. Em Abu Simbel, Ramsés escreveu que fez o templo para ela, aquela por quem o sol brilha.", "Para Abu Simbel."),
 8: (["𓂀"], "Udja", ["Udjat"], "O olho inteiro: o olho de Hórus que Thoth curou. Udja quer dizer estar inteiro, são, a salvo.", "Para Edfu, a casa de Hórus."),
 9: (["𓄣"], "O coração", ["Ó meu coração de minha mãe,", "não te levantes contra mim."], "Do Livro dos Mortos: o pedido ao próprio coração antes da pesagem, para que ele fale a verdade a nosso favor.", "Para o Vale dos Reis."),
 10: (["𓇅𓈗"], "Uadj-ur", ["Uadj-ur"], "O Grande Verde: era assim que os egípcios chamavam o mar.", "Para chegar ao Mar Vermelho."),
 11: (["𓆸"], "Sekhet Iaru", ["Sekhet Iaru"], "O Campo de Juncos: o paraíso egípcio, um lugar de água, juncos e descanso, como a vida boa à beira do Nilo.", "Para o dia no mar."),
 12: (["𓋴𓋹𓂋𓈖"], "Seankh ren", ["Seankh ren"], "Fazer viver o nome. Para os egípcios, dizer o nome de alguém em voz alta era mantê-lo vivo.", "No encerramento da Caravana: diga o nome de quem caminhou com você."),
 13: (["𓋹𓆓𓏏𓎛𓎛"], "Ankh djet neheh", ["Ankh djet neheh"], "Vida para sempre e sempre. O desejo mais bonito que um egípcio podia escrever.", "Para a volta para casa."),
}
ls = [f"  {n}: {{ dev: {J(dev)}, nome: {J(nome)}, linhas: {J(lin)}, trad: {J(tr)}, nota: {J(nota)} }}" for n, (dev, nome, lin, tr, nota) in M.items()]
bloco("const MANTRAS = {", "const PERGUNTAS = {", "const MANTRAS = {\n" + ",\n".join(ls) + "\n};\n")
troca('h("span", { text: "Mantra do dia" }), h("b", { text: m.nome })', 'h("span", { text: "Palavras do dia" }), h("b", { text: m.nome })')
troca('h("p", { class: "eyebrow rule", text: "Mantra do dia" }),', 'h("p", { class: "eyebrow rule", text: "Palavras de poder do dia" }),')
troca('h("p", { class: "mdev", lang: "sa" }', 'h("p", { class: "mdev", lang: "egy" }')
troca('h("p", { class: "mnota", text: m.nota + " · Do livreto da Caravana" }));', 'h("p", { class: "mnota", text: m.nota }));')
troca('.mdev{font-family:"Poppins","Noto Sans Devanagari",sans-serif;font-size:20px;', '.mdev{font-family:"Noto Sans Egyptian Hieroglyphs","Poppins",sans-serif;font-size:30px;')

# ---------- perguntas do diário, uma por dia do roteiro ----------
Q = {1: "Qual é a intenção que você traz para esta travessia?", 2: "O que você sentiu diante das pirâmides?", 3: "Que rosto, objeto ou múmia do museu ficou com você?",
     4: "Como foi a noite sob o céu do deserto?", 5: "O que o silêncio do deserto te contou?", 6: "O que você entregou ao Nilo hoje?",
     7: "O que você sentiu diante de Ramsés em Abu Simbel?", 8: "Qual templo de hoje falou mais alto com você?", 9: "Se o seu coração fosse pesado hoje, o que pesaria nele?",
     10: "O que você quer deixar no mar?", 11: "O que o Mar Vermelho te ensinou sobre leveza?", 12: "O que você leva desta caravana para a sua vida?", 13: "Uma palavra para esta travessia."}
bloco("const PERGUNTAS = {", "const HINDI = [", "const PERGUNTAS = {\n" + ",\n".join(f"  {n}: {J(q)}" for n, q in Q.items()) + "\n};\n")

# ---------- carta final, diário e mensagem ----------
troca('const CARTA_RASCUNHO = "Treze dias atrás, a caravana chegou a Delhi com as malas cheias e o coração aberto. Hoje ela volta com o passaporte carimbado e com a Índia viva dentro de cada um!\\n\\nDezessete carimbos, cinco cidades, um rio sagrado.. e uma roda que foi se formando pelo caminho, dia após dia.',
      'const CARTA_RASCUNHO = "Treze dias atrás, a caravana chegou ao Cairo com as malas cheias e o coração aberto. Hoje ela volta com o passaporte carimbado e com o Egito vivo dentro de cada um!\\n\\nAs pirâmides, o deserto, o Nilo, os templos e o mar.. e uma roda que foi se formando pelo caminho, dia após dia.')
troca('"Diário de bordo · Delhi, 16 de novembro de 2026"', '"Diário de bordo · Egito, 20 de outubro de 2027"')
troca('local: "Delhi", envio: Date.now()', 'local: "Egito", envio: Date.now()')
ROTA = "Cairo e as pirâmides de Gizé, Saqqara e o Museu Egípcio, o Deserto Branco, Aswan e Philae, Abu Simbel, Kom Ombo, Edfu, Luxor, o Vale dos Reis e Karnak, e o Mar Vermelho em Hurghada"
troca("acaba de atravessar a Índia Sagrada (4 a 16 de novembro de 2026: Delhi, Agra e o Taj Mahal, Jaipur e o templo de Galta Ji, Varanasi e o Ganges, Rishikesh e o Himalaia).",
      f"acaba de fazer a Travessia do Velho Mundo pelo Egito (8 a 20 de outubro de 2027: {ROTA}).")
troca("atravessou a Índia Sagrada de 4 a 16 de novembro de 2026: Delhi, Agra e o Taj Mahal, Jaipur e o templo de Galta Ji, Varanasi e o Ganges no Diwali, Rishikesh e o Himalaia.",
      f"fez a Travessia do Velho Mundo pelo Egito de 8 a 20 de outubro de 2027: {ROTA}.")
troca("(por exemplo: no dia 6, em Varanasi, você escreveu *...*)", "(por exemplo: no dia 6, em Aswan, você escreveu *...*)")
troca("ligado ao que ${nome} viveu na Índia.", "ligado ao que ${nome} viveu no Egito.")
troca("(rio, fogo, semente, montanha, lamparina)", "(rio, deserto, sol, semente, lamparina)", 0)

# ---------- cópia para ler sem internet ----------
troca("<title>Caravana do Céu · Índia 2026</title>", "<title>Caravana do Céu · Egito 2027</title>")
troca('<p class="e">Caravana do Céu · Índia Sagrada · 4 a 16 nov 2026</p><h1>Travessia da Índia Sagrada</h1>', '<p class="e">Caravana do Céu · Egito · 8 a 20 out 2027</p><h1>Travessia do Velho Mundo</h1>')

# ---------- mural, mapas e cenários do retrato ----------
troca('const CIDADES_MURAL = ["Delhi", "Agra", "Jaipur", "Varanasi", "Rishikesh"];', 'const CIDADES_MURAL = ["Cairo", "Deserto Branco", "Aswan", "Abu Simbel", "Luxor", "Hurghada"];')
troca('svg.setAttribute("aria-label", "Mapa da expedição pela Índia");', 'svg.setAttribute("aria-label", "Mapa da expedição pelo Egito");')
troca('"EXPEDIÇÃO", "Índia Sagrada · 2026")', '"EXPEDIÇÃO", "Egito · 2027")')
troca(' : "Índia Sagrada"); marcarClick(svg, c.id);', ' : "Egito · 2027"); marcarClick(svg, c.id);')
troca('const SELO_CENARIO = { agra: "taj-mahal", varanasi: "varanasi", rishikesh: "rishikesh", jaipur: "jaipur", delhi: "india" };',
      'const SELO_CENARIO = { cairo: "piramides-gize", deserto: "deserto-branco", aswan: "aswan", abusimbel: "abu-simbel", luxor: "luxor", hurghada: "mar-vermelho" };')
troca('const POSES = { embarque: "turma", agra: "turma", varanasi: "pulando", jaipur: "abraco", rishikesh: "fogueira", delhi: "fila" };',
      'const POSES = { embarque: "turma", cairo: "turma", deserto: "fogueira", aswan: "abraco", abusimbel: "fila", luxor: "turma", hurghada: "abraco" };')
troca('const CENARIOS = [["embarque", "Embarque"], ["agra", "Taj Mahal"], ["varanasi", "Varanasi"], ["rishikesh", "Rishikesh"], ["jaipur", "Jaipur"], ["delhi", "Delhi"]];',
      'const CENARIOS = [["embarque", "Embarque"], ["cairo", "Pirâmides"], ["deserto", "Deserto Branco"], ["aswan", "Aswan"], ["abusimbel", "Abu Simbel"], ["luxor", "Luxor"], ["hurghada", "Mar Vermelho"]];')

# ---------- jogo: as cobras e escadas viram as Escadas de Maat (Apófis no lugar das cobras); o Chaupar sai da lista ----------
troca('const MP_ESCADAS = { 4: [14, "Fé", "Shraddha", "Quem confia no caminho dá o primeiro passo sem ver o fim da estrada."], 9: [31, "Generosidade", "Dana", "O que se dá sem esperar volta abre espaço para subir."],\n  21: [42, "Devoção", "Bhakti", "O coração entregue encurta qualquer distância."], 28: [84, "Conhecimento", "Jnana", "Quem enxerga a verdade pula muitas casas de uma vez."],\n  51: [67, "Compaixão", "Karuna", "Sentir a dor do outro como sua eleva os dois."], 72: [91, "Gratidão", "Kritajnata", "Agradecer pelo que já se tem leva mais longe."] };',
      'const MP_ESCADAS = { 4: [14, "Verdade", "Maat", "Quem fala a verdade anda leve: o coração não pesa na balança."], 9: [31, "Generosidade", "Dei pão ao faminto", "Dei pão ao faminto, água ao sedento e roupa a quem estava nu, diziam os egípcios nas tumbas. O que se dá eleva."],\n  21: [42, "Gratidão", "Dua", "Agradecer pelo que já se tem leva mais longe."], 28: [84, "Sabedoria", "Sia", "Sia era o entendimento que os deuses tinham no coração. Quem enxerga, pula muitas casas de uma vez."],\n  51: [67, "Compaixão", "Não fiz ninguém chorar", "Uma das confissões diante da balança. Cuidar do outro eleva os dois."], 72: [91, "Paz", "Hotep", "Em paz se atravessa o que, com pressa, derruba."] };')
troca('const MP_COBRAS = { 17: [7, "Raiva", "Krodha", "Um instante de raiva desfaz o que levou tempo para construir."], 54: [34, "Ganância", "Lobha", "Querer sempre mais faz perder o que já se tinha."],\n  62: [19, "Orgulho", "Ahamkara", "O ego se acha alto demais e cai de mais alto ainda."], 64: [60, "Inveja", "Irshya", "Olhar a casa do outro tira os olhos do próprio caminho."],\n  87: [24, "Ilusão", "Moha", "Confundir o passageiro com o eterno é a queda mais longa."], 93: [73, "Preguiça", "Tamas", "Quem adia o caminho volta para trás sem perceber."],\n  95: [75, "Vaidade", "Mada", "Admirar o próprio reflexo é parar de caminhar."], 98: [79, "Apego", "Raga", "Tão perto de Moksha, quem segura demais escorrega."] };',
      'const MP_COBRAS = { 17: [7, "Raiva", "Apófis", "Um instante de raiva desfaz o que levou tempo para construir."], 54: [34, "Ganância", "Apófis", "Querer sempre mais faz perder o que já se tinha."],\n  62: [19, "Orgulho", "Apófis", "Quem se acha alto demais cai de mais alto ainda."], 64: [60, "Inveja", "Apófis", "Olhar a casa do outro tira os olhos do próprio caminho."],\n  87: [24, "Mentira", "Isfet", "A mentira é o caos que os egípcios chamavam de isfet: a queda mais longa."], 93: [73, "Preguiça", "Apófis", "Quem adia o caminho volta para trás sem perceber."],\n  95: [75, "Vaidade", "Apófis", "Admirar o próprio reflexo é parar de caminhar."], 98: [79, "Apego", "Apófis", "Tão perto do Campo de Juncos, quem segura demais escorrega."] };')
LEDE = "As escadas são as virtudes de Maat, que elevam; as serpentes são Apófis, o caos que toda noite tenta engolir a barca do sol e derruba quem cai na boca dele. A casa 100 é o Campo de Juncos, o paraíso egípcio."
troca('h("h1", { text: "Moksha Patam" }),\n    h("p", { class: "lede", text: "O jogo de cobras e escadas nasceu na Índia para ensinar o caminho: as escadas são virtudes que elevam, as cobras são vícios que derrubam, e a casa 100 é Moksha, a libertação. Funciona sem internet: é só passar o celular." }));',
      f'h("h1", {{ text: "Escadas de Maat" }}),\n    h("p", {{ class: "lede", text: {J(LEDE + " Funciona sem internet: é só passar o celular.")} }}));')
troca('h("h1", { text: "Moksha Patam" }),\n        h("p", { class: "lede", text: "O jogo de cobras e escadas nasceu na Índia para ensinar o caminho: as escadas são virtudes que elevam, as cobras são vícios que derrubam, e a casa 100 é Moksha, a libertação." }));',
      f'h("h1", {{ text: "Escadas de Maat" }}),\n        h("p", {{ class: "lede", text: {J(LEDE)} }}));')
troca("precisa do número exato para chegar a Moksha.`", "precisa do número exato para chegar ao Campo de Juncos.`")
troca('h("h2", { text: nomeJ(st.fim) + " alcançou Moksha!" }), h("p", { text: "A libertação: o fim da roda, a casa onde não se cai mais." }),',
      'h("h2", { text: nomeJ(st.fim) + " chegou ao Campo de Juncos!" }), h("p", { text: "O paraíso egípcio: campos de juncos à beira d\'água, onde quem tem o coração leve vive em paz para sempre." }),')
troca('"font-weight": 700, "letter-spacing": 1 }, "MOKSHA"));', '"font-weight": 700, "letter-spacing": 1 }, "JUNCOS"));')
troca('carta.tipo === "escada" ? "Escada · virtude" : "Cobra · vício"', 'carta.tipo === "escada" ? "Escada de Maat · virtude" : "Apófis · a serpente do caos"')
troca('const qual = S.jogoSel || lsGet("cdi-jogo") || "chaupar";', 'const qual = "moksha"; // o Chaupar era um jogo da Índia: no Egito fica só o das Escadas de Maat')
troca('h("div", { class: "fcats", role: "tablist", style: "justify-content:center" }, [["chaupar", "Chaupar"], ["moksha", "Moksha Patam"]].map(',
      'h("div", { class: "fcats", role: "tablist", style: "justify-content:center", hidden: "" }, [["moksha", "Escadas de Maat"]].map(')

# ---------- conversor: libra egípcia ----------
troca("// ---------- Conversor de rúpias ----------", "// ---------- Conversor de libras egípcias ----------")
troca('try { S.cambio = JSON.parse(localStorage.getItem("cdi-cambio") || "null"); } catch (e) {}', 'try { S.cambio = JSON.parse(localStorage.getItem("cdi-cambio-egp") || "null"); } catch (e) {}')
troca('fetch("https://open.er-api.com/v6/latest/INR")', 'fetch("https://open.er-api.com/v6/latest/EGP")')
troca('try { localStorage.setItem("cdi-cambio", JSON.stringify(S.cambio)); } catch (e) {}', 'try { localStorage.setItem("cdi-cambio-egp", JSON.stringify(S.cambio)); } catch (e) {}')
troca('h("p", { class: "eyebrow", text: "Dinheiro na Índia" }), h("h1", { text: "Conversor de rúpias" })', 'h("p", { class: "eyebrow", text: "Dinheiro no Egito" }), h("h1", { text: "Conversor de libras" })')
troca("Dica para os mercados: na Índia, negociar o preço faz parte da compra.", "Dica para os mercados, como o Khan el-Khalili: no Egito, negociar o preço faz parte da compra.")
troca('h("span", { text: "₹ Rúpias" })', 'h("span", { text: "£E Libras egípcias" })')
troca('}, "₹ " + v))),', '}, "£E " + v))),')
troca("`₹ 100 ≈ R$ ${(100 * taxa)", "`£E 100 ≈ R$ ${(100 * taxa)")

p.write_text(t)
print("ok" if not falta else "não achei:\n  " + "\n  ".join(falta))

# ---------- a passagem (embarque.html) e a lista de passagens da líder ----------
def arquivo(nome, trocas):
    f = R / "app" / nome; s = f.read_text(); ruins = []
    for a, b in trocas:
        if b in s and a not in s: continue
        if a not in s: ruins.append(a[:70]); continue
        s = s.replace(a, b)
    f.write_text(s); print(nome, "ok" if not ruins else "não achei: " + " | ".join(ruins))
GL = [("ra", "Rá"), ("thoth", "Thoth"), ("isis", "Ísis"), ("osiris", "Osíris"), ("horus", "Hórus"), ("anubis", "Anúbis"), ("hathor", "Hathor"), ("maat", "Maat"), ("ptah", "Ptah"), ("amon", "Amon"), ("sobek", "Sobek"), ("imhotep", "Imhotep")]
FR = {g[0]: g[2] for g in G}
lista_js = "[" + ", ".join(f'["{i}", {J(n)}, {J(FR[i])}]' for i, n in GL) + "]"
arquivo("embarque.html", [
 ("<title>Passagem para a Índia · Caravana do Céu</title>", "<title>Passagem para o Egito · Caravana do Céu</title>"),
 ('content="Sua passagem para a Travessia da Índia Sagrada · Brasil → Delhi"', 'content="Sua passagem para a Travessia do Velho Mundo · Brasil → Cairo"'),
 ('content="Sua passagem para a Índia chegou ✦"', 'content="Sua passagem para o Egito chegou ✦"'),
 ('content="Caravana do Céu · Travessia da Índia Sagrada · Brasil → Delhi"', 'content="Caravana do Céu · Travessia do Velho Mundo · Brasil → Cairo"'),
 ('aria-label="Passagem para a Índia"', 'aria-label="Passagem para o Egito"'),
 ("<b>TRAVESSIA DA ÍNDIA SAGRADA</b>", "<b>TRAVESSIA DO VELHO MUNDO · EGITO</b>"),
 ("<div><b>BRASIL</b><small>ब्राज़ील</small></div>", "<div><b>BRASIL</b><small>البرازيل</small></div>"),
 ("<div><b>DELHI</b><small>दिल्ली</small></div>", "<div><b>CAIRO</b><small>القاهرة</small></div>"),
 ('<img id="gimg" src="/deuses/ganesha.webp" alt="">', '<img id="gimg" src="/deuses/amon.webp" alt="">'),
 (">Nº 2026</text>", ">Nº 2027</text>"),
 ('<div class="carimbo c3">ॐ SHANTI</div>', '<div class="carimbo c3">☥ EM HOTEP</div>'),
 (t_ := 'const G = [["ganesha", "Ganesha", "abre os caminhos"], ["hanuman", "Hanuman", "a coragem e a devoção"], ["lakshmi", "Lakshmi", "a abundância e a graça"], ["shiva", "Shiva", "a transformação"],\n    ["durga", "Durga", "a força que protege"], ["saraswati", "Saraswati", "a sabedoria e as artes"], ["krishna", "Krishna", "o amor e a alegria"], ["ganga", "Ganga", "a purificação"],\n    ["parvati", "Parvati", "a devoção e o amor"], ["vishnu", "Vishnu", "a preservação e o equilíbrio"], ["surya", "Surya", "a luz e a vitalidade"], ["kali", "Kali", "o tempo que liberta"], ["brahma", "Brahma", "a criação"]];',
  "const G = " + lista_js + ";"),
 ("|| G[(+num || 0) % 8];", "|| G[(+num || 0) % G.length];"),
])
arquivo("passagens.html", [
 ("(Ganesha, Hanuman, Lakshmi, Shiva, Durga, Saraswati, Krishna, Ganga, Parvati, Vishnu, Surya, Kali, Brahma)", "(" + ", ".join(n for _, n in GL) + ")"),
 ('placeholder="Ana Paula, 7&#10;João Pedro, 3, Hanuman&#10;Mariana, 12"', 'placeholder="Ana Paula, 7&#10;João Pedro, 3, Hórus&#10;Mariana, 12"'),
 ("Exemplo: “João Pedro, 3, Hanuman” gera a passagem Nº 03 com Hanuman de guardião.", "Exemplo: “João Pedro, 3, Hórus” gera a passagem Nº 03 com Hórus de guardião."),
 ('", sua passagem para a Índia chegou ✈️\\n"', '", sua passagem para o Egito chegou ✈️\\n"'),
])

# ---------- figurinhas do chat: o bonequinho vestido de deus do Egito (no lugar dos deuses hindus) ----------
t = p.read_text(); falta = []
troca('''const FIGURINHAS = [["surya", "Surya", "Bom dia!"], ["ganesha", "Ganesha", "Caminho aberto!"], ["shiva", "Shiva", "Om Namah Shivaya"], ["krishna", "Krishna", "Bora dançar!"],
  ["hanuman", "Hanuman", "Força!"], ["lakshmi", "Lakshmi", "Tô rica!"], ["durga", "Durga", "Poderosa!"], ["kali", "Kali", "Sai da frente!"],
  ["parvati", "Parvati", "Te amo!"], ["saraswati", "Saraswati", "Aprendi!"], ["vishnu", "Vishnu", "Tudo sob controle"], ["ganga", "Ganga", "Gratidão"]];''',
'''const FIGURINHAS = [["eg-ra", "Rá", "Bom dia!"], ["eg-farao", "Faraó", "Aqui quem manda sou eu"], ["eg-isis", "Ísis", "Te cuido!"], ["eg-hathor", "Hathor", "Bora dançar!"],
  ["eg-osiris", "Osíris", "Renasci!"], ["eg-amon", "Amon", "É segredo…"], ["eg-maat", "Maat", "Justo!"], ["eg-ptah", "Ptah", "Mãos à obra!"],
  ["eg-imhotep", "Imhotep", "Tive uma ideia!"], ["eg-nefertari", "Nefertari", "Linda!"]];''')
troca('''  ganga: { roupa: "sari", roupaCor: "#8FB8C9", acessorio: "kalash", chapeu: "coroa", colar: "ouro", testa: "bindi", bracos: 4 },
};''', '''  ganga: { roupa: "sari", roupaCor: "#8FB8C9", acessorio: "kalash", chapeu: "coroa", colar: "ouro", testa: "bindi", bracos: 4 },
  // fantasias do Egito (figurinhas do chat), montadas com as peças que o bonequinho já tem
  "eg-ra": { roupa: "dhoti", roupaCor: "#E8B321", acessorio: "ankh", chapeu: "sol", colar: "usekh", testa: "nada", barba: "nao" },
  "eg-farao": { roupa: "dhoti", roupaCor: "#E8E0CF", acessorio: "ankh", chapeu: "nemes", colar: "usekh", testa: "nada" },
  "eg-isis": { roupa: "vestido", roupaCor: "#E8E0CF", acessorio: "ankh", chapeu: "coroa", colar: "usekh", testa: "nada" },
  "eg-hathor": { roupa: "vestido", roupaCor: "#B0301F", acessorio: "sino", chapeu: "sol", colar: "usekh", testa: "nada" },
  "eg-osiris": { pele: "#5E8A4E", roupa: "yogi", roupaCor: "#E8E0CF", acessorio: "ankh", chapeu: "coroaalta", colar: "usekh", testa: "nada" },
  "eg-amon": { pele: "#4F74A8", roupa: "dhoti", roupaCor: "#E8B321", acessorio: "ankh", chapeu: "pena", colar: "usekh", testa: "nada" },
  "eg-maat": { roupa: "vestido", roupaCor: "#2F5D7C", acessorio: "ankh", chapeu: "pena", colar: "usekh", testa: "nada" },
  "eg-ptah": { pele: "#5E8A4E", roupa: "yogi", roupaCor: "#E8E0CF", acessorio: "ankh", chapeu: "sem", cabelo: "careca", colar: "usekh", testa: "nada", barba: "sim" },
  "eg-imhotep": { roupa: "yogi", roupaCor: "#E8E0CF", acessorio: "mapa", chapeu: "sem", cabelo: "careca", colar: "nenhum", testa: "nada", barba: "nao" },
  "eg-nefertari": { roupa: "vestido", roupaCor: "#E8E0CF", acessorio: "lotus", chapeu: "coroa", colar: "usekh", testa: "nada" },
};''')
troca('`Programada · ${dataCarta(c.envio)}, ${horaCarta(c.envio)} na Índia`', '`Programada · ${dataCarta(c.envio)}, ${horaCarta(c.envio)} no Egito`')
p.write_text(t); print("figurinhas", "ok" if not falta else falta)

# ---------- reações do mapa e figurinhas de coisas: nomes do Egito (os desenhos continuam) ----------
t = p.read_text(); falta = []
troca('["namaste", "🙏", "Namaste"]', '["namaste", "🙏", "Shukran!"]')
troca('["chai", "☕", "Bora um chai?"]', '["chai", "☕", "Bora um karkadé?"]')
troca('const ITENS_FIG = [["diya", "Lamparina"], ["chai", "Chai"], ["vaca", "Vaquinha"], ["macaco", "Macaco"], ["simbolo", "Caravana do Céu"]];',
      'const ITENS_FIG = [["diya", "Lamparina"], ["chai", "Karkadé"], ["vaca", "Vaquinha de Hathor"], ["macaco", "Babuíno de Thoth"], ["simbolo", "Caravana do Céu"]];')
p.write_text(t); print("reações", "ok" if not falta else falta)

# ---------- restos achados nos prints: ícone da aba Câmbio (₹ → £), tuk-tuk e chai do chat ----------
t = p.read_text(); falta = []
troca('<circle cx="12" cy="12" r="8.5"/><path d="M9 8h6M9 10.8h6M10.5 8c2.2 0 3.2 1.2 3.2 2.8S12.7 13.6 10.5 13.6H9.5l4.2 3.4"/></svg>',
      '<circle cx="12" cy="12" r="8.5"/><path d="M14.6 8.6c-.5-.9-1.4-1.4-2.4-1.4-1.6 0-2.6 1.1-2.6 2.7v6.6M8.4 12.3h4.8M8 16.5h7.2"/></svg>')
troca("Guarde notas pequenas para gorjetas e tuk-tuks.", "Guarde notas pequenas para as gorjetas, que no Egito se chamam bakshish.")
troca('text: "Conversa entre um chai e outro" }', 'text: "Conversa entre um karkadé e outro" }')
p.write_text(t); print("restos", "ok" if not falta else falta)
t = p.read_text(); falta = []
troca("onde vocês se encontram na viagem e o mantra dele.", "onde vocês se encontram na viagem e as palavras de poder dele.")
p.write_text(t); print("missão", "ok" if not falta else falta)
