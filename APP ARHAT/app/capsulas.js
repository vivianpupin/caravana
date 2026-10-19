// Cápsulas diárias do Arhat: uma por dia, em cartas curtas e interativas.
// Temas: "livro" (do livro Arhat), "ciencia" (ciência do sono), "tradicoes" (povos e templos).
// Cartas: abre · fala · revela · quiz · faca · leva · alvo
window.CAPSULAS = [
  { dia: 1, tema: "livro", titulo: "O que é um Arhat", minutos: 2, cartas: [
    { t: "abre", titulo: "O que é um Arhat", sub: "O começo da jornada" },
    { t: "fala", texto: "“Arhat”, em sânscrito, refere-se a alguém que alcançou o estado de iluminação ou despertar espiritual." },
    { t: "fala", texto: "Aquele que transcende todos os planos, que pisou em todos os mundos, pois passou por todas as iniciações. É senhor de Si e caminhante do tempo.", de: "Arhat" },
    { t: "fala", texto: "O livro tem cinco atos. Você pode atravessá-los em sequência ou ficar alguns dias em cada um. A transformação da consciência demanda tempo: quanto mais tempo fizer o Arhat, mais viverá seus resultados." },
    { t: "revela", pergunta: "O que o livro recomenda para o corpo durante a jornada?", resposta: "Uma alimentação leve e saudável, evitando carnes e bebidas alcoólicas." },
    { t: "leva", texto: "Dedique-se, pois sem dedicação, nada obterá!", de: "Arhat" }
  ] },
  { dia: 2, tema: "livro", titulo: "Por que a noite", minutos: 2, cartas: [
    { t: "abre", titulo: "Por que a noite", sub: "A real morada da consciência" },
    { t: "quiz", pergunta: "Quanto da vida passamos dormindo?", opcoes: ["Um décimo", "Um quarto", "Um terço"], certa: 2, explica: "Cerca de um terço. Numa vida de 75 anos, são uns 25 anos de noites." },
    { t: "fala", texto: "O ponto onde nossa consciência mais se aproxima da sua real morada é durante o sono!", de: "Arhat" },
    { t: "fala", texto: "O Arhat nunca dorme, mas atua conscientemente em ambas as realidades: o dia, que é matéria, e a noite, que é espírito. Apenas atravessa de um limiar a outro." },
    { t: "faca", titulo: "Hoje à noite", texto: "Tente perceber o exato momento em que você adormece. Não precisa conseguir. Só a intenção já começa a acordar algo." },
    { t: "leva", texto: "Nós não somos daqui, viemos das estrelas, mas em alguma parte do caminho nos esquecemos.", de: "Arhat" }
  ] },
  { dia: 3, tema: "ciencia", titulo: "Os ciclos do sono", minutos: 3, cartas: [
    { t: "abre", titulo: "Os ciclos do sono", sub: "O mapa do território" },
    { t: "fala", texto: "Ninguém dorme de um jeito só. A noite é feita de ciclos de mais ou menos 90 minutos: sono leve, sono profundo e sono REM. Em uma noite, você passa por quatro a seis ciclos." },
    { t: "revela", pergunta: "O que acontece no sono REM?", resposta: "Os olhos se movem rápido sob as pálpebras, o cérebro fica quase tão ativo quanto acordado e o corpo fica paralisado, para você não encenar o sonho. É no REM que acontecem os sonhos mais vívidos." },
    { t: "quiz", pergunta: "Em que parte da noite os períodos de REM são mais longos?", opcoes: ["Logo depois de deitar", "No meio da noite", "Na madrugada, perto de acordar"], certa: 2, explica: "A cada ciclo o REM cresce. Os últimos, de madrugada, são os mais longos e cheios de sonhos." },
    { t: "fala", texto: "É por isso que o Arhat te desperta às 4 da manhã: você volta a dormir bem na janela dos sonhos mais longos, com a mente um pouco mais acordada." },
    { t: "leva", texto: "A madrugada é a hora do sonho." }
  ] },
  { dia: 4, tema: "livro", titulo: "Lembrar é um treino", minutos: 2, cartas: [
    { t: "abre", titulo: "Lembrar é um treino", sub: "Os primeiros 5 minutos" },
    { t: "fala", texto: "Todos sonham, todas as noites. Em laboratório, a maioria das pessoas acordadas durante o REM conta um sonho, até quem jura que não sonha." },
    { t: "quiz", pergunta: "Você acordou e não lembra de nada. O que fazer?", opcoes: ["Levantar logo e desistir", "Abrir os olhos e pegar o celular", "Ficar imóvel, de olhos fechados, e perguntar onde estava"], certa: 2, explica: "Mexer o corpo e abrir os olhos apaga o sonho em segundos. Quieto, o fio costuma voltar." },
    { t: "faca", titulo: "Amanhã cedo", texto: "Não levante e nem abra os olhos. Pergunte: Onde eu estava? O que eu estava sentindo? Depois anote tudo, até as lembranças pequenas e sem sentido." },
    { t: "fala", texto: "Se você tem dificuldades para se recordar de seus sonhos é porque não teve estímulos para isso. Portanto, apenas continue treinando!", de: "Arhat" },
    { t: "leva", texto: "Dê importância à dimensão espiritual e receberá os doces frutos da eternidade!", de: "Arhat" }
  ] },
  { dia: 5, tema: "tradicoes", titulo: "Os templos do sonho", minutos: 3, cartas: [
    { t: "abre", titulo: "Os templos do sonho", sub: "Quando se ia ao templo para dormir" },
    { t: "fala", texto: "Por milhares de anos, a humanidade construiu templos não para rezar acordada, mas para dormir. Era a incubação dos sonhos." },
    { t: "revela", pergunta: "O que acontecia nos templos de Asclépio, na Grécia?", resposta: "Em Epidauro, Pérgamo e Cós, quem buscava cura se purificava, fazia oferendas e dormia numa sala sagrada chamada ábaton. O deus aparecia no sonho, tocando o corpo doente ou indicando o remédio. Em Epidauro ainda existem as pedras com os relatos das curas, com mais de 2.300 anos." },
    { t: "fala", texto: "No Egito, havia livros de sonhos há mais de 3.200 anos, como o papiro Chester Beatty III. Em Saqqara, as pessoas dormiam junto aos santuários pedindo orientação e cura." },
    { t: "fala", texto: "No Japão de mil anos atrás, peregrinos passavam a noite em templos de Kannon, como Hasedera, esperando um sonho que respondesse à sua pergunta." },
    { t: "faca", titulo: "Hoje", texto: "Prepare o seu quarto como um templo: arrume, limpe, desligue as telas antes de deitar. Imagine a chuva caindo e limpando o ambiente." },
    { t: "leva", texto: "O Arhat devolve esse templo para dentro do seu quarto." }
  ] },
  { dia: 6, tema: "livro", titulo: "As raízes de cura", minutos: 2, cartas: [
    { t: "abre", titulo: "As raízes de cura", sub: "O corpo invisível" },
    { t: "fala", texto: "Temos raízes: linhas invisíveis, tentáculos tremeluzentes que saem de nossas mãos, cabeça, garganta, coração, umbigo e centros sexuais.", de: "Arhat" },
    { t: "revela", pergunta: "Como saber que uma raiz está ativa?", resposta: "Sente-se uma leve vibração ou um amortecimento na região. É o sinal de que aquele centro de energia está funcionando." },
    { t: "faca", titulo: "Agora", texto: "Aproxime as mãos, sem encostar. Sinta as raízes dançando entre si como línguas de fogo que se entrelaçam.", segundos: 30 },
    { t: "fala", texto: "Saber recarregar-se de energia vital faz com que não precisemos absorver a energia do meio e das pessoas ao redor. É comum tentar preencher esse vazio com compulsões ou apegos." },
    { t: "leva", texto: "Ative o seu poder sutil.", de: "Arhat" }
  ] },
  { dia: 7, tema: "ciencia", titulo: "A porta entre os mundos", minutos: 3, cartas: [
    { t: "abre", titulo: "A porta entre os mundos", sub: "O estado hipnagógico" },
    { t: "fala", texto: "Entre a vigília e o sono existe um estado de passagem que a ciência chama de hipnagógico: imagens surgindo sozinhas, sons, vozes, a sensação de cair." },
    { t: "quiz", pergunta: "Aquele tranco de “cair” bem na hora de adormecer se chama…", opcoes: ["Espasmo hípnico", "Sonambulismo", "Apneia"], certa: 0, explica: "É um espasmo hípnico, muito comum e inofensivo. Sinal de que você está bem no limiar." },
    { t: "fala", texto: "Vibrações, zumbidos, vozes chamando seu nome, movimentos involuntários: todos esses sintomas denunciam que você está prestes a passar para o outro lado.", de: "Arhat" },
    { t: "revela", pergunta: "E o nevoeiro?", resposta: "Num mar de cores e formas, uma esfera de luz começa a surgir e ocupar todo o campo visual. É o seu limiar. Concentre toda a atenção nele e continue respirando até adormecer." },
    { t: "leva", texto: "Corpo relaxado, mente desperta.", de: "Arhat" }
  ] },
  { dia: 8, tema: "ciencia", titulo: "Mensagens de dentro do sonho", minutos: 3, cartas: [
    { t: "abre", titulo: "Mensagens de dentro do sonho", sub: "Como a ciência provou o sonho lúcido" },
    { t: "fala", texto: "Por muito tempo, cientistas duvidaram que alguém pudesse estar consciente dentro de um sonho. Como provar, se a pessoa está dormindo?" },
    { t: "quiz", pergunta: "Como os sonhadores lúcidos “falaram” com os cientistas?", opcoes: ["Falando dormindo", "Movendo os olhos num sinal combinado", "Apertando um botão"], certa: 1, explica: "No REM o corpo fica paralisado, mas os olhos não. Os sonhadores moviam os olhos para a esquerda e para a direita, e o sinal aparecia nos aparelhos." },
    { t: "fala", texto: "Os primeiros registros vieram nos anos 1970 e 1980, com Keith Hearne, na Inglaterra, e Stephen LaBerge, na Universidade Stanford. Pela primeira vez, alguém mandou uma mensagem de dentro de um sonho." },
    { t: "revela", pergunta: "E hoje?", resposta: "Em 2021, equipes de quatro países fizeram contas simples para sonhadores lúcidos durante o sono, e eles responderam com os olhos. Uma conversa de mão dupla entre os dois mundos." },
    { t: "leva", texto: "É possível despertar dentro do universo onírico.", de: "Arhat" }
  ] },
  { dia: 9, tema: "livro", titulo: "Sonho lúcido ou viagem astral?", minutos: 2, cartas: [
    { t: "abre", titulo: "Sonho lúcido ou viagem astral?", sub: "Os dois segredos da noite" },
    { t: "quiz", pergunta: "Onde a realidade é completamente maleável e você pode transformá-la?", opcoes: ["No sonho lúcido", "Na viagem astral"], certa: 0, explica: "No sonho lúcido mergulhamos no nosso inconsciente, e tudo pode mudar com a intenção." },
    { t: "quiz", pergunta: "E onde você está sujeito às leis do lugar e precisa aprender a navegar?", opcoes: ["No sonho lúcido", "Na viagem astral"], certa: 1, explica: "Na viagem astral a consciência se desloca do corpo físico para o espiritual, numa outra frequência." },
    { t: "fala", texto: "No início, é como se fôssemos astronautas aprendendo a caminhar na Lua, ou mergulhadores explorando as profundezas do mar.", de: "Arhat" },
    { t: "leva", texto: "A maior expansão da consciência é o choque de realidade causado pela viagem astral.", de: "Arhat" }
  ] },
  { dia: 10, tema: "livro", titulo: "O senso crítico", minutos: 2, cartas: [
    { t: "abre", titulo: "O senso crítico", sub: "Quem garante que agora não é um sonho?" },
    { t: "fala", texto: "No sonho aceitamos histórias absurdas como reais. O senso crítico é o que questiona a realidade, mesmo quando ela parece incrivelmente real." },
    { t: "faca", titulo: "Agora", texto: "Sinta os pés no chão. Olhe as mãos e conte os dedos. Puxe o indicador. Tampe o nariz e tente respirar. Pergunte: será que estou sonhando?" },
    { t: "revela", pergunta: "Por que fazer mais de um teste?", resposta: "Conforme a prática avança, o cérebro pode tentar enganar você e um teste que funcionava pode falhar. Se um não funcionar, o outro funciona." },
    { t: "fala", texto: "Tudo o que fazemos de dia se repete inconscientemente à noite. Um dia, você fará o teste dentro de um sonho e descobrirá que está sonhando." },
    { t: "leva", texto: "O Desperto é aquele que, caminhando pela Terra, entendeu que a vida também é feita do tecido dos sonhos.", de: "Arhat" }
  ] },
  { dia: 11, tema: "ciencia", titulo: "Fora do corpo", minutos: 3, cartas: [
    { t: "abre", titulo: "Fora do corpo", sub: "O que a ciência observa" },
    { t: "fala", texto: "Pesquisas em vários países estimam que perto de uma em cada dez pessoas já teve ao menos uma experiência de se ver fora do próprio corpo." },
    { t: "revela", pergunta: "O que os neurologistas descobriram em 2002?", resposta: "Na Suíça, ao estimular uma pequena região do cérebro chamada junção temporoparietal, médicos provocaram numa paciente a sensação de flutuar e se ver de cima." },
    { t: "fala", texto: "Para a ciência, isso mostra onde o cérebro constrói a sensação de estar dentro do corpo. Para as tradições, mostra onde fica a porta. O Arhat convida você a experimentar e tirar as suas conclusões." },
    { t: "fala", texto: "Vislumbramos as cores vivas do astral, atravessamos barreiras físicas e viajamos à velocidade do pensamento.", de: "Arhat" },
    { t: "leva", texto: "O medo da morte se dissipa quando vivenciamos, na prática, a multiplicidade de nossos corpos.", de: "Arhat" }
  ] },
  { dia: 12, tema: "ciencia", titulo: "Paralisia do sono sem medo", minutos: 2, cartas: [
    { t: "abre", titulo: "Paralisia do sono sem medo", sub: "Quando o corpo ainda dorme" },
    { t: "fala", texto: "Às vezes você acorda e não consegue se mexer, às vezes com zumbidos, pressão no peito ou a sensação de uma presença. É a paralisia natural do REM, que continua por alguns instantes depois que a mente acordou." },
    { t: "quiz", pergunta: "A paralisia do sono é perigosa?", opcoes: ["Sim, pode parar a respiração", "Não, é passageira e inofensiva"], certa: 1, explica: "Ela assusta, mas passa sozinha e não faz mal. A respiração continua normalmente." },
    { t: "faca", titulo: "Se acontecer", texto: "Respire devagar. Afirme: “Estou protegido”. Para sair, mova um dedo bem devagar. Para atravessar, relaxe e deixe as vibrações crescerem: é o limiar." },
    { t: "leva", texto: "Estou protegido. Estou seguro.", de: "Arhat" }
  ] },
  { dia: 13, tema: "tradicoes", titulo: "Os sonhos contados ao amanhecer", minutos: 2, cartas: [
    { t: "abre", titulo: "Os sonhos contados ao amanhecer", sub: "Os Achuar da Amazônia" },
    { t: "fala", texto: "Entre os Achuar, no Equador e no Peru, a família acorda antes do sol, toma junta o chá de guayusa e conta os sonhos da noite." },
    { t: "revela", pergunta: "Para que servem esses sonhos?", resposta: "É a partir deles que se decide o dia: caçar, viajar ou esperar. O sonho é tratado como parte da vida, e não como algo que se esquece ao acordar." },
    { t: "faca", titulo: "Hoje", texto: "Conte um sonho seu para alguém. Dizer em voz alta fixa a memória e ensina a mente que os sonhos importam." },
    { t: "leva", texto: "O sonho também é a vida." }
  ] },
  { dia: 14, tema: "tradicoes", titulo: "A yoga dos sonhos", minutos: 3, cartas: [
    { t: "abre", titulo: "A yoga dos sonhos", sub: "Tibete" },
    { t: "fala", texto: "No budismo tibetano, a yoga dos sonhos faz parte dos Seis Yogas de Naropa. O praticante aprende a reconhecer o sonho enquanto sonha." },
    { t: "revela", pergunta: "E depois de reconhecer o sonho?", resposta: "Vem o passo mais profundo: perceber que a própria vida desperta também tem a natureza de um sonho. Dormir vira meditação, e a noite, um treino para a hora da morte." },
    { t: "faca", titulo: "Hoje, três vezes", texto: "Pare onde estiver, olhe ao redor e pense com calma: “Isto também é um sonho.” Repare no que muda dentro de você." },
    { t: "leva", texto: "A vida também é feita do mesmo tecido dos sonhos.", de: "Arhat" }
  ] },
  { dia: 15, tema: "tradicoes", titulo: "Os quatro estados", minutos: 2, cartas: [
    { t: "abre", titulo: "Os quatro estados", sub: "Índia" },
    { t: "fala", texto: "A Mandukya Upanishad ensina que a consciência atravessa estados: a vigília, o sonho e o sono profundo." },
    { t: "revela", pergunta: "E o quarto estado?", resposta: "É Turiya, o quarto: a consciência que testemunha os outros três. Quem desperta para Turiya está presente acordado, sonhando e dormindo." },
    { t: "fala", texto: "Eu sou desprovido de dualidade. Minha forma é sem forma. Eu existo em todos os lugares.", de: "Nirvana Shatakam" },
    { t: "leva", texto: "Eu sou o Espírito Livre.", de: "Nirvana Shatakam" }
  ] },
  { dia: 16, tema: "ciencia", titulo: "A janela das 4 da manhã", minutos: 3, cartas: [
    { t: "abre", titulo: "A janela das 4 da manhã", sub: "Acordar para sonhar" },
    { t: "fala", texto: "Os pesquisadores chamam de “acordar e voltar para a cama”: dormir umas cinco horas, despertar por alguns minutos e voltar a dormir com uma intenção clara." },
    { t: "revela", pergunta: "Por que funciona?", resposta: "Você volta a dormir bem quando o REM fica mais longo, e com a mente um pouco mais desperta. Um estudo australiano de 2017 mostrou que essa técnica, somada à intenção de lembrar que está sonhando, aumentou bastante os sonhos lúcidos." },
    { t: "quiz", pergunta: "É bom fazer isso todas as noites?", opcoes: ["Sim, quanto mais melhor", "Não, o sono picado cansa"], certa: 1, explica: "Faça em algumas noites da semana, de preferência quando puder dormir mais na manhã seguinte." },
    { t: "faca", titulo: "Nesta madrugada", texto: "Ao voltar para a cama, repita com sentimento: “Ao cair no sono estou consciente.”" },
    { t: "leva", texto: "Ao cair no sono estou consciente.", de: "Arhat" }
  ] },
  { dia: 17, tema: "tradicoes", titulo: "Sonhar longe", minutos: 2, cartas: [
    { t: "abre", titulo: "Sonhar longe", sub: "Os Yanomami" },
    { t: "fala", texto: "Entre os Yanomami, os xamãs sonham com os espíritos xapiri e viajam para muito longe durante a noite." },
    { t: "revela", pergunta: "O que Davi Kopenawa diz sobre o sonho dos brancos?", resposta: "Em A queda do céu, ele conta que os brancos dormem muito, mas sonham só consigo mesmos. O sonho do xamã alcança a floresta, os ancestrais e o céu." },
    { t: "faca", titulo: "Hoje à noite", texto: "Antes de dormir, peça para sonhar com algo maior do que você: um lugar, a natureza, os ancestrais." },
    { t: "leva", texto: "Sonhar além de si mesmo." }
  ] },
  { dia: 18, tema: "livro", titulo: "Quando o sonho fica instável", minutos: 2, cartas: [
    { t: "abre", titulo: "Quando o sonho fica instável", sub: "Comandos dentro do sonho" },
    { t: "quiz", pergunta: "Você está lúcido e o sonho começa a se desfazer. O que dizer?", opcoes: ["“Acordar!”", "“Clareza, agora!”", "Nada, só esperar"], certa: 1, explica: "Uma declaração direta e firme ajuda a restaurar a lucidez e o controle." },
    { t: "fala", texto: "Stephen LaBerge também estudou gestos para segurar o sonho: girar o corpo ou esfregar as mãos dentro dele." },
    { t: "revela", pergunta: "E se vier o medo?", resposta: "Afirme: “Estou protegido” ou “Estou seguro”. Em vez de fugir de um pesadelo, enfrente. O pesadelo pode ser a porta para a lucidez." },
    { t: "leva", texto: "Esses comandos influenciam a experiência do sonho, e da vida.", de: "Arhat" }
  ] },
  { dia: 19, tema: "tradicoes", titulo: "O sonho partilhado", minutos: 2, cartas: [
    { t: "abre", titulo: "O sonho partilhado", sub: "América do Norte e as escrituras" },
    { t: "fala", texto: "Os povos Haudenosaunee e Wendat viam nos sonhos os desejos da alma. No inverno, faziam festas em que cada um apresentava seu sonho, e a comunidade inteira se envolvia." },
    { t: "fala", texto: "Jacó viu em sonho a escada entre a terra e o céu. Na tradição islâmica, o sonho verdadeiro é considerado uma pequena parte da profecia." },
    { t: "revela", pergunta: "O que une todos esses povos?", resposta: "Independentemente do lugar no globo, todos falavam a mesma coisa, apesar das roupagens diferentes: de olhos fechados é possível ir além." },
    { t: "leva", texto: "Em quase todas as escrituras, o divino escolhe a noite para falar." }
  ] },
  { dia: 20, tema: "livro", titulo: "Os guias e os alvos", minutos: 2, cartas: [
    { t: "abre", titulo: "Os guias e os alvos", sub: "Para onde você vai esta noite?" },
    { t: "fala", texto: "Você pode pedir auxílio para sair do corpo. Os guias estão atentos do outro lado, e podemos nos conectar com eles ao pedir sinceramente.", de: "Arhat" },
    { t: "fala", texto: "Faça uma lista de alvos para direcionar suas viagens. Dê o comando antes de dormir e visualize como se já estivesse lá." },
    { t: "alvo" },
    { t: "leva", texto: "Quero conhecer o antigo Egito, andar pelas pirâmides na época em que o império era vivo!", de: "Arhat" }
  ] },
  { dia: 21, tema: "livro", titulo: "Abrir os olhos", minutos: 2, cartas: [
    { t: "abre", titulo: "Abrir os olhos", sub: "O fechamento" },
    { t: "fala", texto: "Quem olha para a Magia da Vida resgata um conhecimento que preenche uma lacuna mantida por eras, que revela do que somos feitos e o caminho para casa!", de: "Arhat" },
    { t: "revela", pergunta: "O que significa Arhat?", resposta: "Arhat significa abrir os olhos." },
    { t: "faca", titulo: "Hoje", texto: "Abra o céu das suas noites e olhe a constelação que você formou. Cada ponto foi uma noite em que você se lembrou." },
    { t: "leva", texto: "Só aquele que decidiu abrir os olhos enxerga as portas da Verdade.", de: "Arhat" }
  ] }
];
