// Conteúdo do livro Arhat, de Vivian Pupin, organizado para o app.
// Blocos de texto: { p } parágrafo · { afirm, fonte } afirmação em destaque · { passos } lista numerada
// { lista } lista simples · { sub } subtítulo · { cita, autor } citação · { pergunta } pergunta para a pessoa
window.ARHAT = (function () {
  const OUTRO_COMODO = [
    { p: "Volte para a cama e deite-se confortavelmente." },
    { p: "Feche os olhos e visualize-se caminhando em outro cômodo da sua casa, como a sala, por exemplo. Observe os objetos ao seu redor, o tapete, o cheiro do ambiente, a cor das paredes, as plantas penduradas no teto. Sinta a textura da madeira da mesa de centro, olhe atentamente todos os detalhes." },
    { p: "Essa prática treina nossa atenção para abandonar o foco no corpo físico e perceber outros planos." },
    { p: "Você pode voltar para o mesmo cômodo todas as noites para se aprofundar ainda mais. Com repetição e dedicação, você poderá expandir significativamente sua habilidade de mudar o foco de atenção e explorar diferentes estados de consciência e percepção." }
  ];

  const RESP_DOURADA = {
    k: "resp", ico: "sol", nome: "Respiração Dourada", det: "7 respirações pelo terceiro olho",
    resp: { n: 7, inspire: "Inspire: um filamento dourado desce do sol central, penetra o terceiro olho, ilumina os olhos, o topo da cabeça e a nuca.", expire: "Expire: a energia faz o caminho de volta e libera as impurezas que bloqueiam os centros espirituais.", fim: "Todo o corpo se ilumina. Estimule a vibração das raízes extrafísicas: elas são a porta de entrada para algo totalmente novo." },
    texto: [
      { p: "Há dois grandes sóis centrais que sustentam a vida deste universo." },
      { p: "Ao inspirar profundamente, um filamento dourado desce desse centro de energia, penetra o terceiro olho (a região entre as sobrancelhas), preenche e ilumina os olhos, o topo da cabeça e a nuca." },
      { p: "Ao expirar, a energia segue o caminho de volta, liberando as impurezas que bloqueiam nossos centros espirituais." },
      { p: "Exteriorizamos a energia pelo terceiro olho, ativando as raízes do chakra frontal e promovendo a limpeza e o equilíbrio de nossa energia vital." },
      { sub: "7 respirações" },
      { p: "Após certa prática é comum sentir todo o corpo se iluminando e uma ligeira vibração das raízes extrafísicas. Estimule essas vibrações, elas são a porta de entrada para algo totalmente novo na sua existência!" }
    ]
  };

  const TESTE = { k: "teste", ico: "mao", nome: "Teste de realidade", det: "“Será que estou sonhando?” 7 a 10 vezes" };

  const ATOS = [
    {
      id: 0, nome: "O Início", sub: "Atravessar o véu do sono", gratis: true, capa: "noite",
      frase: "A Terra Prometida é o mundo dos sonhos.", ensina: ["templos", "tradicoes", "desperto", "segredos"],
      momentos: [
        { quando: "Ao acordar", hora: "no dia seguinte", praticas: [
          { k: "diario", ico: "pena", nome: "Diário dos 5 minutos", det: "Sem levantar e sem abrir os olhos", texto: [
            { p: "Ao escrevermos nossos sonhos imediatamente após acordar, mostramos ao cérebro a importância de recordar as experiências do plano extrafísico, incentivando-o a não mais ocultar essa valiosa informação." },
            { sub: "Os primeiros 5 minutos após o despertar são cruciais!" },
            { p: "Não levante e nem abra os olhos. Mantenha o estado de “Corpo relaxado, mente desperta”." },
            { pergunta: "Onde eu estava? O que eu estava sentindo?" },
            { p: "Se ao acordar você ainda tiver uma imagem na mente, preste atenção nela enquanto rememora suas experiências noturnas. Force sua mente a trazer à tona qualquer informação e anote tudo: até pequenas lembranças incoerentes podem desvendar verdadeiras histórias que poderiam ser perdidas para sempre! É importante anotar imediatamente após acordar qualquer experiência que você se lembre. Não deixe para depois, pois poderá perder grandes descobertas!" },
            { p: "Se não houver qualquer lembrança, continue praticando com convicção!" },
            { p: "É nativo do ser humano a vida dual, matéria e espírito. Todos, sem exceção de nenhum, passam por atividades noturnas de desdobramento. Todos possuem um cérebro com memória ativa. Se você tem dificuldades para se recordar de seus sonhos é porque não teve estímulos para isso, portanto, apenas continue treinando!" },
            { p: "Dê importância à dimensão espiritual e receberá os doces frutos da eternidade!" }
          ] } ] },
        { quando: "Dia", hora: "quando quiser", praticas: [
          { k: "raizes", ico: "raiz", nome: "Raízes de Cura", det: "Sentir as raízes ativas e conectadas", texto: [
            { p: "Temos raízes, linhas invisíveis, tentáculos tremeluzentes pouco opacos que saem de nossas mãos, cabeça, garganta, coração, umbigo e centros sexuais." },
            { p: "Esses filamentos sutis, parte importante de nosso corpo invisível, são usados por curandeiros para penetrar em outros corpos, curar e manipular energia." },
            { p: "Quando as raízes estão ativas, sente-se uma leve vibração ou sensação de amortecimento na região: é um sinal de que aquele centro de energia está em funcionamento!" },
            { p: "O meio em que vivemos nos doa energia todo o tempo e preenche buracos e vazios do nosso corpo. Nós absorvemos continuamente a energia luminosa da natureza e do meio." },
            { p: "Saber recarregar-se intencionalmente de energia vital faz com que não precisemos absorver a energia do meio e de pessoas ao nosso redor! É comum tentarmos preencher esse esgotamento com compulsões físicas e mentais, ou apegos emocionais." },
            { sub: "Ative suas raízes agora!" },
            { p: "Aproxime suas mãos, sinta suas raízes dançando entre si como línguas de fogo que se entrelaçam! Brinque e dance com elas, ative o seu poder sutil." }
          ] } ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "Corpo relaxado, mente desperta", det: "Encontre o seu nevoeiro", audio: true, texto: [
            { p: "Ao deitar-se, inicie limpando sua mente e respire profundamente para relaxar todo o corpo. Foque sua atenção na respiração e na planta dos pés. Permita que os pensamentos fluam livremente, sem se prender a eles. Se uma ideia intrusiva surgir, simplesmente comande sua consciência:" },
            { afirm: "Vá além disso… Vá além disso…" },
            { p: "Continue com essa concentração e observe enquanto seu corpo se entrega ao sono gradualmente. Esse estado é conhecido como “Corpo relaxado, mente desperta”, no qual você atravessa o véu do sono conscientemente, mantendo sua consciência ativa e presente durante o processo de adormecimento." },
            { p: "Apenas observe e mantenha-se quieto: ao retirar a atenção dos sentidos físicos, os sentidos espirituais são ativados." },
            { p: "Estamos tão acostumados a nos lançar na inconsciência do sono que é preciso treino para cruzar a ponte entre os mundos!" },
            { p: "Durante o trajeto, é comum sentirmos vibrações inesperadas em nosso corpo, ouvirmos zumbidos, vozes (até chamando nosso nome!), e sentir movimentos involuntários! Todos esses sintomas denunciam que você está prestes a passar para o outro lado, pois já está percebendo os sinais da nova realidade! Nessa hora, o que se move é seu corpo espiritual; o que você ouve vem de seus ouvidos extrafísicos! Tudo a partir daí é uma descoberta!" },
            { p: "À medida que seu corpo se desliga, imagens começam a se formar em sua tela mental: são as Imagens Hipnagógicas, uma mistura de criações da sua mente. Conforme essas imagens surgem, estimule-as concentrando-se nelas para que se tornem mais vívidas e detalhadas." },
            { p: "Nesse estágio, em um mar de cores e formas, esteja atento para reconhecer quando uma esfera de luz começar a surgir e ocupar todo o seu campo visual. Esse é o seu limiar, o sinal de que está prestes a atravessar para o outro lado, como um nevoeiro luminoso que indica a entrada para uma nova realidade." },
            { p: "Concentre toda a sua atenção no nevoeiro e continue respirando profundamente até adormecer." },
            { pergunta: "Qual é a cor do seu nevoeiro?" }
          ] } ] }
      ]
    },
    {
      id: 1, nome: "Primeiro Ato", sub: "Captar energia cósmica e desobstruir os centros de energia", gratis: true, capa: "noite",
      frase: "Eu sou mais do que meu corpo físico.", ensina: ["viagem", "lucido", "senso", "testes"],
      intro: "Para sutilizar nossa vibração vamos reativar as raízes receptoras do corpo! Essa prática não apenas ativa nossa memória, mas também nos aproxima gradualmente de nossos conselheiros espirituais.",
      momentos: [
        { quando: "Ao acordar", hora: "primeiros 5 min", praticas: [
          { k: "diario", ico: "pena", nome: "Diário dos 5 minutos", det: "Onde eu estava? O que eu sentia?", irDiario: true } ] },
        { quando: "Dia", hora: "ao amanhecer e no pôr do sol", praticas: [ RESP_DOURADA, TESTE ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "Preparando o ambiente", det: "A chuva no quarto e a afirmação", audio: true, texto: [
            { afirm: "Eu sou mais do que meu corpo físico.\nE por isso, posso perceber aquilo que é maior que o mundo físico.\nDesejo profundamente expandir, experimentar, conhecer, compreender, controlar e usar energias e sistemas de energia maiores que possam ser benéficos e construtivos para mim e para aqueles que amo.\nDesejo profundamente a ajuda e a cooperação, a assistência e a compreensão de indivíduos cuja sabedoria, desenvolvimento e experiência são iguais ou superiores aos meus.\nPeço sua orientação e proteção contra qualquer influência ou fonte que possa me fornecer menos do que meus desejos declarados.\nEu sou mais do que meu corpo físico.", fonte: "Robert A. Monroe" },
            { passos: [
              "Imagine uma chuva caindo em seu quarto, limpando toda a atmosfera ao seu redor.",
              "Leia a afirmação acima e deite-se na posição supino (barriga para cima).",
              "Concentre-se na cor do seu nevoeiro e deixe-se envolver por ele.",
              "Repita mentalmente “Eu sou mais do que meu corpo físico” enquanto se entrega às marés do sono.",
              "Lembre-se de anotar todas as experiências que recordar."
            ] },
            { p: "A folha em branco a ser preenchida se torna uma janela pela qual se enxergam as infinitas possibilidades do seu Ser." }
          ] } ] }
      ]
    },
    {
      id: 2, nome: "Segundo Ato", sub: "Cair no sono consciente", capa: "fios",
      frase: "Ao cair no sono estou consciente.", ensina: ["maravilhas"],
      momentos: [
        { quando: "04:00", hora: "despertar no meio da noite", praticas: [
          { k: "madrugada", ico: "espiral", nome: "Nirvana Shatakam", det: "Testa no joelho e o outro cômodo", audio: true, texto: [
            { p: "Sente-se na postura de lótus, com as pernas cruzadas, e curve o corpo para a frente, colocando a testa sobre o joelho esquerdo." },
            { p: "Respire profundamente e visualize a raiz do seu terceiro olho brilhando intensamente, enquanto a energia da Terra circula por todo o seu corpo, nutrindo-o e fortalecendo-o." },
            { p: "Repita algumas vezes e sente-se naturalmente." },
            { afirm: "Eu sou desprovido de dualidade\nMinha forma é sem forma\nEu existo em todos os lugares\nImpregnando todos os sentidos\nEu não sou nem apegado, nem livre, nem cativo,\nEu sou a fôrma da consciência\nEu sou o Espírito Livre.", fonte: "Nirvana Shatakam" }
          ].concat(OUTRO_COMODO) } ] },
        { quando: "Dia", hora: "ao longo do dia", praticas: [
          Object.assign({}, RESP_DOURADA, { det: "7 vezes" }), TESTE ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "Estou consciente", det: "Afirmação em voz alta e o nevoeiro", audio: true, texto: [
            { p: "Deitado, afirme em voz alta e em seguida mentalmente:" },
            { afirm: "Ao cair no sono estou consciente." },
            { p: "Encontre o nevoeiro de passagem para o outro lado e estimule para que essa visão se mantenha em sua tela mental." },
            { p: "Quando estiver pegando no sono, não se deixe perder a consciência, e sim, acentue o impacto emocional das afirmações!" },
            { afirm: "Estou consciente." },
            { p: "A intensidade deste comando mostra seu forte comprometimento pessoal, gerando resultados poderosos." },
            { p: "Repita até adormecer." }
          ] } ] }
      ]
    },
    {
      id: 3, nome: "Terceiro Ato", sub: "A chama da vela e o Dragão", capa: "fios",
      frase: "Eu tenho clareza do plano astral.", ensina: ["desperto-terra"],
      momentos: [
        { quando: "04:00", hora: "despertar no meio da noite", praticas: [
          { k: "madrugada", ico: "vela", nome: "Chama da vela", det: "Estou leve e posso flutuar até o teto", audio: true, texto: [
            { passos: [
              "Acenda uma vela e posicione-se confortavelmente.",
              "Concentre sua atenção na chama da vela, olhando-a fixamente.",
              "Ao inspirar, visualize a energia da chama penetrando seu terceiro olho, ativando suas raízes e envolvendo toda a sua coroa, descendo, então, por todo o seu corpo.",
              "Mantenha os olhos abertos, fixos na vela, enquanto traz toda a sua presença ao Agora."
            ] },
            { afirm: "Todo o meu Ser simplesmente está\nno mesmo instante em que se queima a chama desta vela.", fonte: "Afirmação" },
            { p: "Volte para a cama e deite-se normalmente, mentalizando que está caminhando em outro cômodo da casa com o seu corpo sutil." },
            { p: "Afirme:" },
            { afirm: "Estou leve e posso flutuar até o teto." }
          ] } ] },
        { quando: "Dia", hora: "ao longo do dia", praticas: [
          { k: "dragao", ico: "sol", nome: "Respiração do Dragão", det: "O Estado Vibracional",
            resp: { n: 7, segura: true, inspire: "Inspire: a energia do centro da Terra sobe pela coluna, pelo umbigo, coração e garganta, ilumina a pineal, o terceiro olho e a coroa, e sai em direção ao Sol central.", segurar: "Não respire ainda. Sinta o esvaziamento e a liberdade.", expire: "Expire: a energia desce pelo terceiro olho, olhos, coroa e pineal, pela coluna, ativando cada centro, até voltar à Terra.", fim: "Estado vibracional: todos os centros ativos, o corpo astral mais solto." },
            texto: [
              { p: "Ao inspirar, visualize a energia do centro da Terra subindo pela sua coluna vertebral, passando pelo Chakra Umbilical, pelo Chakra Cardíaco e pelo Chakra Laríngeo, iluminando os cristais da glândula Pineal na nuca, o Terceiro Olho e a coroa da cabeça, e saindo para fora do seu corpo em direção ao Sol central." },
              { p: "Não respire ainda. Segure por alguns instantes e sinta a sensação de esvaziamento e liberdade da respiração." },
              { p: "Ao expirar, permita que a energia desça, fazendo o caminho de volta pelo Terceiro Olho, pelos olhos, coroa, glândula Pineal, descendo então pela coluna vertebral e ativando todos os centros de energia ao longo do caminho, até retornar à Terra." },
              { p: "Essa prática é conhecida por criar o Estado Vibracional, ativando todos os centros energéticos do corpo e favorecendo a soltura do corpo astral, o que pode contribuir para experiências mais profundas durante a meditação ou práticas de viagem astral." }
            ] },
          TESTE ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "O outro cômodo", det: "Caminhar com o corpo fluídico", audio: true, texto: [
            { p: "Deitado, afirme em voz alta e em seguida mentalmente:" },
            { afirm: "Eu tenho clareza do plano astral." },
            { p: "Visualize-se caminhando em outro cômodo da sua casa, manipulando objetos e interagindo com o ambiente ao seu redor." },
            { p: "Sinta cada passo que você dá, o toque dos seus pés no chão e o respirar tranquilo e fresco da noite." },
            { p: "Observe os detalhes desse novo ambiente, absorvendo cada aspecto visual e sensorial." },
            { p: "Concentre sua mente inteiramente nesse local e não pense jamais em seu corpo físico." },
            { p: "Permita-se ser transportado para o seu corpo fluídico através da intenção e mantenha essa concentração firmemente até cair no sono." }
          ] } ] }
      ]
    },
    {
      id: 4, nome: "Quarto Ato", sub: "A luz azul e o banho da pineal", capa: "noite",
      frase: "Sou um ser multidimensional.", ensina: ["dentro"],
      momentos: [
        { quando: "04:00", hora: "despertar no meio da noite", praticas: [
          { k: "madrugada", ico: "luz", nome: "Que a paz possa inundar minha alma", det: "O círculo de luz azul", audio: true, texto: [
            { afirm: "Que a paz possa inundar minha alma\nDe dentro, da semente, a claridade se espalhe para as periferias do meu corpo\nQue o silêncio possa acalmar a respiração e a tornar profunda\nComo um túnel a ser seguido rumo à Verdade.\nQue eu ouça meu nome de criador\nQue de uma vez por todas possa entender\nQue aquilo que se apresentar a mim é todo e parte de mim\nQue eu esteja pronto e nada me passe pelas mãos\nQue nesta jornada os dragões não possam me alcançar\nE que as prisões não possam jamais me enclausurar\nQue eu me inunde da certeza de que eu sou a resposta.\nQue eu sinta o vibrante som do éter como lembrete do caminho de volta\nE me preencha com a chave que dele ressoa em meu ser.", fonte: "Afirmação" },
            { p: "Ao voltar para a cama, deite-se em posição supina." },
            { p: "Visualize uma luz azul brilhante sobre o seu chakra coronário. Essa luz desce suavemente pela sua testa, ativando seus olhos e o terceiro olho, iluminando a glândula pineal e descendo pela garganta, coração, estômago, umbigo, órgãos sexuais e espalhando-se por suas pernas e pés." },
            { p: "Conforme a luz alcança seus pés, ela inicia o caminho de volta, subindo novamente pelo seu corpo e repetindo o processo." },
            { p: "Visualize esse círculo de luz até adormecer, procurando prestar atenção ao que aparecer no nevoeiro." }
          ] } ] },
        { quando: "Dia", hora: "ao acordar e no pôr do sol", praticas: [
          { k: "maos", ico: "sol", nome: "Mãos para o céu", det: "Captar a energia solar", texto: [
            { p: "Com as mãos esticadas na direção do céu, concentre-se em ativar as raízes das suas mãos e capte a energia solar com a intenção de preencher todos os seus corpos, tanto o físico quanto os extrafísicos." },
            { p: "Ao inspirar e expirar lentamente, permita-se sentir a sensação de ativação conforme a energia solar flui para dentro de você." },
            { p: "Visualize essa energia fluindo através de cada célula do seu corpo, nutrindo-o e fortalecendo-o em todos os níveis: físico, mental, emocional e espiritual. Essa prática pode trazer uma sensação de revitalização e conexão com a energia vital ao seu redor." }
          ] },
          TESTE,
          { k: "banho", ico: "agua", nome: "Durante o banho", det: "A água entra pela nuca", texto: [
            { passos: [
              "Posicione-se de costas para o chuveiro, permitindo que a água caia suavemente na região da nuca.",
              "Visualize que a água entra pela nuca e sai pelo seu terceiro olho.",
              "Concentre-se na ideia de que essa água está realizando uma limpeza profunda e desobstrução da sua glândula pineal, removendo qualquer bloqueio ou impureza que possa estar presente."
            ] },
            { p: "Essa prática combina a ação física do banho com a visualização e a intenção de limpeza energética, promovendo uma sensação de renovação e clareza mental." }
          ] } ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "Luz dourada", det: "Sou um ser multidimensional", audio: true, texto: [
            { p: "Deite-se na posição supina e respire lentamente, permitindo que o frescor da noite penetre suavemente seus pulmões. Conforme você inspira, visualize uma luz dourada irradiando de dentro de você, preenchendo todo o seu corpo através do ar que entra." },
            { p: "Sinta essa luz dourada nutrindo cada célula, trazendo uma sensação de calor e energia revitalizante. Deixe-se envolver por essa luz, permitindo que ela promova um estado de relaxamento profundo e renovação interior." },
            { p: "Repita mentalmente até dormir:" },
            { afirm: "Sou um ser multidimensional." }
          ] } ] }
      ]
    },
    {
      id: 5, nome: "Quinto Ato", sub: "Sair do corpo", capa: "fios",
      frase: "Agora eu me separo facilmente do meu corpo e estou consciente.", ensina: ["yukteswar"],
      momentos: [
        { quando: "04:00", hora: "despertar no meio da noite", praticas: [
          { k: "madrugada", ico: "espiral", nome: "Hermes Trismegisto", det: "Espiral da coroa e os comandos", audio: true, texto: [
            { afirm: "Sai para fora do corpo,\nAtravessa o tempo,\nTorna-te eternidade;\nReconhece-te por imortal,\nCapaz de tudo conceber\nE tudo fazer;\nSê mais alto do que toda altura,\nMais profundo do que toda profundeza;\nSê ao mesmo tempo\nTodas as partes do mundo;\nReúne num abraço todos os ciclos,\nTodas as medidas e todas\nAs extensões e, então,\nPoderás compreender a verdadeira eternidade: Deus", fonte: "Hermes Trismegisto" },
            { p: "Sente-se em um local confortável e concentre-se no seu chakra coronário, no topo da cabeça. Enquanto expira e inspira suavemente, visualize a energia nesse chakra movimentando-se em espiral, começando a partir do topo da sua cabeça." },
            { p: "A energia da sua coroa segue essa espiral ascendente, subindo em direção ao infinito e se perdendo na vastidão do universo. Conforme você continua a respirar de forma consciente, sinta essa energia expandindo-se e conectando-se com as energias mais elevadas." },
            { sub: "Repita esse movimento em espiral sete vezes." },
            { p: "Essa prática pode promover uma sensação de elevação espiritual e conexão com planos superiores de consciência." },
            { p: "Volte para a cama e deite-se confortavelmente em posição supina. Permita-se relaxar profundamente e visualize todo o seu corpo sendo preenchido por uma luz intensa que vem de dentro para fora." },
            { p: "Concentre-se em afastar-se do seu corpo físico enquanto mantém essa visualização e sensação de luminosidade. Não pense mais no seu corpo físico e evite mover-se." },
            { p: "Com convicção e firmeza, dê o comando mental para se desligar do corpo físico e explorar outras dimensões ou planos de existência. Mantenha uma atitude positiva e experimente vários comandos:" },
            { lista: ["“Agora vou até a porta”", "“Agora flutuo até o teto”", "“Agora estou no meu corpo sutil”", "“Agora eu me separo facilmente do meu corpo e estou consciente”"] },
            { p: "Anote os resultados." }
          ] } ] },
        { quando: "Dia", hora: "ao acordar e no pôr do sol", praticas: [
          { k: "pilar", ico: "luz", nome: "Pilar de luz", det: "Azul claro e pulsante, várias vezes ao dia", texto: [
            { p: "Em pé ao ar livre, visualize um pilar de luz descendo dos céus e penetrando todos os seus corpos, preenchendo-os com uma luz pulsante de cor azul clara. Sinta essa luz fluindo e expandindo-se por todo o seu ser." },
            { p: "Respire profundamente e aguarde a ativação dos seus chakras (sensações de formigamento) enquanto permanece conectado com essa luz pulsante. Permita que a energia circule livremente, ativando e equilibrando cada um dos seus centros energéticos ao longo do corpo. Essa prática pode trazer uma sensação de clareza, harmonia e vitalidade para o seu ser." },
            { p: "(Pode ser feita várias vezes ao dia.)" }
          ] },
          TESTE ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "O som do Om", det: "Até o zumbido do plano astral", audio: true, texto: [
            { passos: [
              "Deite-se com o corpo totalmente relaxado e respire profundamente.",
              "Comece a entoar mentalmente o mantra “Om” em um ritmo confortável para você.",
              "Concentre-se em sutilizar sua percepção, permitindo que o som do mantra se propague e envolva todo o seu ser.",
              "Afunde-se no som, mergulhando profundamente na frequência sonora do “Om”.",
              "À medida que você continua entoando o mantra, permita-se entrar cada vez mais na vibração do som até que você comece a perceber o zumbido característico da vibração do plano astral.",
              "Esqueça completamente o seu corpo físico e concentre-se firmemente em permanecer dentro do som do “Om”, mantendo-se conectado com essa frequência vibracional mais elevada."
            ] },
            { p: "Os Maias tinham práticas espirituais que envolviam o uso de sons e vibrações para acessar estados de consciência expandida e realizar viagens astrais. O cantar das cigarras era um dos elementos naturais que eles consideravam propícios para essa finalidade. Ao se concentrarem no som das cigarras e mergulharem profundamente na vibração desse som, transcendiam a realidade física e exploravam outros planos de existência." },
            { cita: "A alma deve alargar-se sobre abismos cosmogônicos enquanto o corpo executa seus deveres diários!", autor: "Sri Yukteswar" }
          ] } ] }
      ]
    }
  ];

  const ALVOS = [
    { curto: "O Everest", texto: "Quero ir para o Everest, aonde a vista só alcança neve!" },
    { curto: "Me curar", texto: "Quero me curar." },
    { curto: "O Egito antigo", texto: "Quero conhecer o antigo Egito, andar pelas pirâmides na época em que o império era vivo! Descobrir seus segredos! Meus pés caminham pelas areias amareladas do deserto, ao fundo vejo o sol baixo, a civilização em seu auge!" },
    { curto: "A Lua", texto: "Ir para a Lua, caminhar em seu solo, explorar o que tem em sua superfície! Qual é a vista da Lua? Algum ser vive lá? Como é o espaço? Como sinto meu corpo? É frio?" },
    { curto: "Os Sadhus dos Himalaias", texto: "Conhecer os Sadhus que meditam nos Himalaias, trazer um ensinamento deles." },
    { curto: "Sirius", texto: "Viajar pra Sirius, conhecer outra galáxia!" },
    { curto: "O fundo do mar", texto: "Quero nadar com os grandes animais do fundo do mar. Baleias e criaturas marinhas desconhecidas que só vivem lá, bem no fundo negro do oceano!" }
  ];

  // Capítulos de leitura: a abertura e os ensinamentos do livro.
  const LIVRO = [
    { id: "arhat", titulo: "O Arhat", parte: "Abertura", texto: [
      { p: "“Arhat”, em sânscrito, refere-se a alguém que alcançou o estado de iluminação ou despertar espiritual." },
      { afirm: "Aquele que transcende todos os planos,\nque pisou em todos os mundos,\npois passou por todas as iniciações.\nÉ senhor de Si e caminhante do tempo.\nAquele que possui sete corpos,\nE, com a impecabilidade do guerreiro,\ndominou os dragões da dúvida\ne se lançou no mergulho negro do Mistério." },
      { p: "Para além de tudo que pode ser pensado ou imaginado, sê aquele que enfrenta e busca a Verdade. A busca da Verdade se encontra além dos olhos, das ideias e da sobrevivência." },
      { p: "Sê aquele que ousa tomar o caminho do contrário, pois tantas vidas já se passaram e todos os personagens já foram experienciados. Falta-lhe apenas o tesouro mais precioso, algo que nem desconfias existir, pois tal conhecimento foi apagado pela sua nação." },
      { p: "Para além da muralha do esquecimento existe o nevoeiro de outros mundos, aonde aquele que tem convicção encontra sua verdadeira liberdade." },
      { p: "Sou meramente um contador de histórias e o que descrevo aqui é um caminho capaz de auxiliar qualquer pessoa a se iniciar nesta sabedoria!" }
    ] },
    { id: "estrelas", titulo: "Viemos das estrelas", parte: "Abertura", texto: [
      { p: "De olhos abertos, imerso nesta realidade Terra, é praticamente impossível notar as variadas nuances que realmente nos envolvem, das quais somos feitos." },
      { p: "Para além de toda a matéria que nos rodeia existem mundos inimagináveis, ciências e novas leis inconcebíveis para a mente humana moderna." },
      { p: "Nós não somos daqui, viemos de fora, viemos das estrelas, mas, em alguma parte do caminho, nos esquecemos e passamos a viver embriagados em uma realidade limitada que nos prende em uma estreita faixa de vibração que representa apenas uma minúscula parcela do Todo." },
      { p: "Uma pequena bolha vibratória, Samsāra: a isso chamamos vida. Neste curto espaço está contido tudo que vivenciamos, todas as nossas crenças, nosso passado, nossos amores e dores, tudo que formou e forma nosso “personagem”." },
      { p: "Muitos vieram para relembrar a humanidade de sua origem! Civilizações despertas deixaram códigos e manuais na tentativa de libertar-nos dessa cegueira. Monólitos imensos repousam sob a Terra para questionar nossa realidade; templos inteiros com mensagens e pinturas nos traçando o caminho, nos mostrando todas as reais potencialidades do homem!" },
      { p: "Esses povos caminhavam pela linha tênue da Matéria e do Espírito e, independentemente de sua posição geográfica no globo, todos falavam a mesma coisa apesar das roupagens diferentes." },
      { p: "Diziam que de olhos fechados é possível ir além! É possível acessar estados de consciência que possibilitam enxergar novas realidades e ecossistemas, trazer sabedorias, viver com mais clareza, voar como um pássaro por todas as eras, vislumbrar paisagens magníficas e perder o medo da morte, pois não existe limitação para o Desperto." }
    ] },
    { id: "templos", titulo: "Os templos do sonho", parte: "Abertura", novo: true, texto: [
      { p: "Por milhares de anos, a humanidade construiu templos não para rezar acordada, mas para dormir. Era a incubação dos sonhos: a pessoa se purificava, fazia uma oferenda, deitava-se no chão sagrado e esperava que o divino viesse encontrá-la durante a noite." },
      { sub: "Grécia: os templos de Asclépio" },
      { p: "Em Epidauro, Pérgamo e Cós, quem buscava cura ia aos santuários de Asclépio, o deus da medicina. Depois de banhos e oferendas, dormia numa sala sagrada chamada ábaton. O deus aparecia no sonho, às vezes tocando o corpo doente, às vezes indicando o remédio. Pela manhã, os sacerdotes ajudavam a interpretar. Em Epidauro ainda existem as pedras onde foram gravados os relatos das curas, há mais de 2.300 anos." },
      { sub: "Egito: os sonhos que vinham dos deuses" },
      { p: "Para os egípcios, o sonho era um lugar onde os deuses falavam. Há mais de 3.200 anos já escreviam livros de sonhos, como o papiro Chester Beatty III, com dezenas de imagens noturnas e seus significados. Em Saqqara, perto de Mênfis, as pessoas dormiam junto aos santuários para pedir orientação e cura, e Imhotep, o arquiteto da primeira pirâmide, passou a ser venerado como o sábio que aparecia nos sonhos dos doentes." },
      { sub: "Mesopotâmia: o templo pedido em sonho" },
      { p: "Há mais de 4.000 anos, o rei Gudea, de Lagash, registrou em cilindros de argila o sonho em que um deus lhe mostrou como construir um templo. Os sonhos dos reis eram tratados como mensagens a serem obedecidas." },
      { sub: "Japão: dormir aos pés de Kannon" },
      { p: "Na corte japonesa de mil anos atrás, peregrinos passavam noites inteiras em templos como Hasedera, dedicados à deusa da compaixão Kannon, esperando um sonho que respondesse à sua pergunta. Os diários das damas da corte contam essas noites de vigília e os sonhos recebidos." },
      { p: "Em todos esses lugares, o sonho não era fantasia: era uma porta. O Arhat devolve esse templo para dentro do seu quarto." }
    ] },
    { id: "tradicoes", titulo: "Povos que honram os sonhos", parte: "Abertura", novo: true, texto: [
      { sub: "Índia: os quatro estados da consciência" },
      { p: "A Mandukya Upanishad ensina que a consciência atravessa quatro estados: a vigília, o sonho, o sono profundo e Turiya, o quarto, que testemunha os outros três. Quem desperta para Turiya está presente acordado, sonhando e dormindo. É a mesma consciência que canta o Nirvana Shatakam." },
      { sub: "Tibete: a yoga dos sonhos" },
      { p: "No budismo tibetano, a yoga dos sonhos faz parte dos Seis Yogas de Naropa. O praticante aprende a reconhecer o sonho enquanto sonha e, a partir daí, a perceber que a própria vida desperta também tem a natureza de um sonho. Dormir vira meditação, e a noite, um treino para a hora da morte." },
      { sub: "Amazônia: os sonhos contados ao amanhecer" },
      { p: "Entre os Achuar, no Equador e no Peru, a família acorda antes do sol, toma juntos o chá de guayusa e conta os sonhos da noite. É a partir deles que se decide o dia: caçar, viajar ou esperar." },
      { p: "Entre os Yanomami, os xamãs sonham com os espíritos xapiri e viajam para longe durante a noite. Davi Kopenawa, em A queda do céu, conta que os brancos dormem muito, mas sonham só consigo mesmos, enquanto o sonho do xamã alcança a floresta, os ancestrais e o céu." },
      { sub: "América do Norte: o sonho como desejo da alma" },
      { p: "Os povos Haudenosaunee e Wendat acreditavam que os sonhos revelam os desejos ocultos da alma, e que esses desejos precisavam ser atendidos para a pessoa ter saúde. No inverno, faziam festas inteiras em que cada um apresentava seu sonho em forma de enigma, e a comunidade tentava adivinhar e realizar o que a alma pedia." },
      { sub: "As escrituras" },
      { p: "Jacó viu em sonho a escada entre a terra e o céu. José, no Egito, decifrou os sonhos do faraó. Na tradição islâmica, o sonho verdadeiro é considerado uma pequena parte da profecia. Em quase todas as escrituras, o divino escolhe a noite para falar." },
      { cita: "Esses povos caminhavam pela linha tênue da Matéria e do Espírito e, independentemente de sua posição geográfica no globo, todos falavam a mesma coisa apesar das roupagens diferentes." }
    ] },
    { id: "como", titulo: "Como fazer o Arhat", parte: "Abertura", texto: [
      { p: "O livro é estruturado em cinco atos distintos, cada um acompanhado de um roteiro detalhado que delineia técnicas a serem realizadas em momentos específicos do dia." },
      { p: "Você tem a opção de seguir o Arhat de forma contínua, atravessando os cinco atos sequencialmente (ato 1, 2, 3, 4 e 5), ou então dedicar alguns dias a cada ato para aprimorar suas habilidades e desvendar resultados mais profundos." },
      { p: "A abordagem ideal envolve imersão contínua no Arhat ao longo de um período determinado: seja uma semana, um mês ou o tempo desejado." },
      { p: "A transformação de nossa consciência e corpo demanda tempo. Redescobrir a capacidade de transcender para outro plano requer disciplina e prática intensas, portanto, quanto mais tempo fizer o Arhat, mais viverá seus resultados." },
      { sub: "Dedique-se, pois sem dedicação, nada obterá!" },
      { p: "Recomenda-se adotar uma alimentação leve e saudável, evitando carnes e bebidas alcoólicas." },
      { p: "Ao concluir cada ato, anote os experimentos executados. O ato de escrever intensifica o comprometimento com a causa, transformando-o em um poderoso ritual de recordação do oculto, o que contribui significativamente para a melhoria dos resultados alcançados." },
      { p: "O diagrama de vivências (o céu das suas noites) ajuda a medir sua evolução nos graus de lucidez e fenômenos extrafísicos durante o avanço da prática." }
    ] },
    { id: "desperto", titulo: "O Arhat nunca dorme", parte: "Abertura", texto: [
      { sub: "O ponto aonde nossa consciência mais se aproxima da sua real morada é durante o sono!" },
      { p: "O Arhat nunca dorme, mas sim, atua conscientemente em ambas as realidades: o dia (matéria) e a noite (espírito). Apenas atravessa de um limiar a outro em uma dança por seus corpos sutis." },
      { p: "O Desperto, aquele que se libertou da inconsciência e não mais caminha pela escuridão da ignorância, a todo o tempo está consciente." },
      { afirm: "Caminha pela Terra como se deve ser,\nGuiado pelos ventos de si mesmo." }
    ] },
    { id: "segredos", titulo: "Quais os segredos escondidos na noite?", parte: "Ensinamentos", texto: [
      { p: "Todas as noites podemos conhecer a potencialidade que somos! Existem duas maneiras para isso: a Viagem Astral e o Sonho Lúcido." }
    ] },
    { id: "viagem", titulo: "Viagem Astral", parte: "Ensinamentos", texto: [
      { p: "Durante as noites, quando mergulhamos na inconsciência do sono, nosso corpo de vibração sutil se separa do físico e explora diversos planos, desfrutando da liberdade do sono. Nessa dimensão paralela, podemos manter plena consciência e testemunhar o mundo espiritual com a mesma lucidez com que lemos estas palavras agora." },
      { p: "Desafiamos as limitações físicas ao voar pelos céus estrelados, sentindo o frescor da noite e o perfume do orvalho; pois nossos sentidos se tornam ainda mais aguçados do que na chamada “realidade”. Vislumbramos as nuances e cores vivas do astral, atravessamos barreiras físicas, viajamos à velocidade do pensamento e nos conectamos com entes queridos que partiram, além de dialogar com nossos guias espirituais." },
      { p: "Há também quem cultiva a habilidade de auxiliar espíritos no outro plano, oferecendo orientação, esclarecimento e ajuda na transição para uma condição mais equilibrada." },
      { p: "Nesse processo, compreendemos que nossa experiência cotidiana é apenas uma pequena parte do vasto panorama existencial, e o medo da morte se dissipa à medida que vivenciamos, na prática, a multiplicidade de nossos corpos e a continuidade da existência além do plano físico." },
      { cita: "A maior expansão da consciência é o choque de realidade que é causado pela viagem astral." }
    ] },
    { id: "lucido", titulo: "Sonho Lúcido", parte: "Ensinamentos", texto: [
      { p: "Nunca sabemos quando estamos vivenciando um sonho: nossa consciência de sonhador aceita histórias absurdas como reais e perdemos a oportunidade de participar de um milagre todas as noites." },
      { p: "É possível despertar dentro desse universo onírico! Quando essa façanha acontece, o sonhador adquire total domínio sobre o enredo, moldando o tecido dos sonhos conforme desejar e realizando suas mais profundas aspirações com a mesma consciência presente durante a vigília." },
      { p: "É uma jornada onde se pode explorar eras passadas, desvendar os mistérios de civilizações antigas, interagir com sábios e seres fascinantes, viajar por distantes galáxias e extrair ensinamentos valiosos do próprio inconsciente." },
      { p: "As possibilidades são verdadeiramente ilimitadas neste mundo, pois enquanto o verdadeiro “Eu” repousa tranquilamente em seu quarto, o sonhador tem total controle sobre a realidade onírica, explorando um universo de experiências sem limitações ou medos, completamente seguro e imortal!" },
      { sub: "Qual a diferença entre Sonho Lúcido e Viagem Astral?" },
      { p: "No Sonho Lúcido, mergulhamos profundamente em nosso inconsciente, onde a realidade é completamente maleável e temos o poder de transformá-la conforme desejamos." },
      { p: "Na Viagem Astral, vislumbramos uma outra frequência à medida que nossa consciência se desloca do corpo físico para o espiritual. No astral, estamos sujeitos às suas leis e precisamos aprender a navegar por ele, o que não é uma tarefa fácil!" },
      { p: "No início, é como se fôssemos astronautas aprendendo a caminhar na Lua ou mergulhadores explorando as profundezas do mar! É uma jornada de descobertas e desafios que requer paciência e prática para dominar." }
    ] },
    { id: "senso", titulo: "Despertando no Sonho", parte: "Ensinamentos", texto: [
      { p: "Para manter a mesma consciência da vigília durante o sono e despertar no meio dele, é crucial desenvolver a habilidade de permanecer lúcido durante os sonhos. Isso implica estar ciente de que está sonhando enquanto o sonho acontece, o que proporciona um controle maior sobre as experiências oníricas e a capacidade de tomar decisões conscientes dentro do sonho." },
      { p: "É essencial adquirir algo muito importante para esse processo: o Senso Crítico. Esse senso questiona nossa realidade, mesmo que ela pareça incrivelmente real." },
      { p: "Durante um sonho, estamos tão imersos naquela experiência que é inconcebível considerar que seja apenas uma criação de nossa mente." },
      { p: "Nos dias comuns, raramente questionamos se estamos sonhando ou não, mas quem garante que este momento não é um sonho? Desenvolver o Senso Crítico nos ajuda a questionar e a estar mais conscientes de nossos estados de consciência, seja durante o sono ou na vigília." }
    ] },
    { id: "desperto-terra", titulo: "O Desperto", parte: "Ensinamentos", texto: [
      { cita: "O Desperto é aquele que, caminhando pela Terra, entendeu que a vida também é feita do mesmo tecido dos sonhos e despertou neste plano." }
    ] },
    { id: "testes", titulo: "Testes de Realidade", parte: "Ensinamentos", texto: [
      { p: "Pare por um momento sentindo seus pés firmes ao chão. Faça uma inspiração consciente e traga sua atenção para o momento presente. Olhe ao redor e pergunte a si mesmo:" },
      { afirm: "Será que estou sonhando?" },
      { p: "Olhe para suas mãos e conte quantos dedos você vê. Em seguida pegue o dedo indicador e puxe-o." },
      { p: "Se ao puxar seu dedo indicador ele esticar ou se sua mão apresentar mais ou menos de dez dedos, isso é um forte indicativo de que a realidade em que você está não é tão real quanto parece: você está sonhando!" },
      { p: "Os testes de realidade têm o propósito de nos tirar do piloto automático, trazendo nossa atenção e senso crítico para o momento presente ao questionar a realidade." },
      { p: "É recomendável realizar esses testes várias vezes ao longo do dia. Tudo o que fazemos durante nossa vida diária é repetido inconscientemente durante o sono. Portanto, surpreendentemente, em algum momento você fará um teste de realidade e descobrirá que está dentro de um sonho! Essa é a sensação mais incrível que alguém pode vivenciar!" },
      { p: "Sempre é aconselhável fazer mais de um teste, pois à medida que desenvolvemos nossas habilidades oníricas (do grego óneiros: sonho), nosso cérebro pode tentar nos enganar e os testes que antes costumavam funcionar podem falhar. Portanto, realizar diferentes tipos de testes nos permite driblar essa situação: se um não funcionar, é possível que o outro funcione!" },
      { sub: "Respiração" },
      { p: "Pare por um momento e sinta seus pés firmes no chão. Faça uma inspiração consciente e traga sua atenção para o momento presente. Em seguida, tampe suas narinas com as mãos e tente respirar pelo nariz. Se a respiração continuar normalmente, isso é um forte indício de que você está dormindo na sua cama e essa realidade é um sonho!" },
      { sub: "Letras e números" },
      { p: "Pare por um momento e sinta seus pés firmes no chão. Concentre sua atenção por alguns segundos em qualquer número, palavra ou desenho à sua frente. Se estiver sonhando, você notará que esses elementos começarão a mudar de forma, se misturarão ou até mesmo dançarão, pois o tecido dos sonhos é instável. Esses fenômenos indicarão que você está sonhando!" }
    ] },
    { id: "maravilhas", titulo: "As maravilhas de dentro", parte: "Ensinamentos", texto: [
      { cita: "O mundo externo pode ter suas maravilhas. Porém, nunca se esqueça que dentro residem as mais infinitas maravilhas do universo. De dentro da tela negra de seu Ser emergem infinitos mundos." }
    ] },
    { id: "dentro", titulo: "Dentro do sonho", parte: "Ensinamentos", texto: [
      { cita: "Há segredos que só o aprendiz ao trilhar o caminho do conhecimento irá encontrar, mas há outros, que podem ser passados adiante." },
      { sub: "Os pesadelos" },
      { p: "Os pesadelos podem ser uma ferramenta poderosa para despertar dentro de um sonho. Quando confrontado com situações absurdas, o sonhador que desenvolveu um forte Senso Crítico através dos Testes de Realidade pode reconhecer que está sonhando e ganhar lucidez. Esse momento de clareza permite assumir o controle do sonho, transformando um cenário negativo em uma experiência de aprendizado e crescimento dentro do mundo dos sonhos." },
      { sub: "Peça ajuda" },
      { p: "Você pode solicitar auxílio extrafísico para sair do corpo! Nossos guias espirituais estão sempre atentos do outro lado e podemos nos conectar com eles ao pedir sinceramente. Ao estarmos abertos para essa interação, podemos não apenas ver, mas também sentir a presença e o apoio dos nossos conselheiros de jornada durante essas experiências." },
      { sub: "“Clareza, agora!”" },
      { p: "Durante um sonho lúcido, se sentir que a atmosfera está instável e você está prestes a perder a consciência, uma técnica eficaz é afirmar com convicção: “Clareza, agora!” Essa declaração direta e firme ajuda a restaurar a lucidez e o controle sobre o sonho!" },
      { p: "É possível utilizar outros comandos para diferentes situações. Por exemplo, se sentir medo, você pode afirmar: “Estou protegido” ou “Estou seguro”. Esses comandos positivos e firmes têm o poder de influenciar instantaneamente a experiência do sonho (e da vida)." },
      { cita: "Quando se encontrar em um sonho desafiador, em vez de tentar fugir ou acordar imediatamente, treine sua mente para enfrentar e superar a situação. Ao confrontarmos nossos medos e desafios nos sonhos, expandimos nossos horizontes e conquistamos uma maior compreensão de nós mesmos. Isso nos permite abrir horizontes ilimitados e perder o medo de enfrentar desafios não só nos sonhos, mas também na vida real. A coragem e a resiliência cultivadas nesses momentos fortalecem nosso desenvolvimento pessoal e espiritual." },
      { cita: "Quando acordar de manhã e uma imagem de sonho persistir em sua mente, concentre-se nela e tente estabelecer uma conversa. Lembre-se de que tudo que emerge do mistério de nossa própria psique é um ensinamento valioso, uma oportunidade de compreender melhor a nós mesmos e o mundo ao nosso redor." }
    ] },
    { id: "alvos", titulo: "Uma lista de alvos", parte: "Ensinamentos", texto: [
      { p: "Faça uma lista de alvos para direcionar suas viagens. Dê o comando antes de dormir e visualize como se já estivesse lá:" },
      { lista: ALVOS.map(a => a.texto) }
    ] },
    { id: "yukteswar", titulo: "A alma deve alargar-se", parte: "Ensinamentos", texto: [
      { cita: "A alma deve alargar-se sobre abismos cosmogônicos enquanto o corpo executa seus deveres diários!", autor: "Sri Yukteswar" }
    ] },
    { id: "abrir", titulo: "Arhat significa abrir os olhos", parte: "Fechamento", texto: [
      { afirm: "Quem olha para a Magia da Vida resgata um conhecimento\nque preenche uma lacuna mantida por eras,\nQue revela do que somos feitos e o caminho para casa!\nSó aquele que decidiu abrir os olhos\nenxerga as portas da Verdade." },
      { sub: "Arhat significa abrir os olhos." }
    ] },
    { id: "leituras", titulo: "Opções de leitura", parte: "Fechamento", texto: [
      { lista: [
        "Buhlman, William. Aventuras Além do Corpo.",
        "Castaneda, Carlos. Uma Estranha Realidade.",
        "Eby, Carol. Odisséia Astral.",
        "Garfield, Patricia. Creative Dreaming.",
        "LaBerge, Stephen. Sonhos Lúcidos.",
        "Marciniak, Barbara. Mensageiros do Amanhecer.",
        "Monroe, Robert A. Viagens Fora do Corpo."
      ] }
    ] },
    { id: "diagrama", titulo: "Diagrama de vivências astrais", parte: "Fechamento", texto: [
      { p: "A cada manhã registre seus avanços no diagrama:" },
      { lista: [
        "Noite negra, sem lembranças: pontinho preto fraco",
        "Noite com sonhos: pontinho preto forte",
        "Noite com algum grau de lucidez: vários pontinhos",
        "Sonhos lúcidos ou viagem astral: estrelinha"
      ] },
      { p: "No app, o diagrama é o céu das suas noites." }
    ] }
  ];

  return { ATOS, ALVOS, LIVRO };
})();
