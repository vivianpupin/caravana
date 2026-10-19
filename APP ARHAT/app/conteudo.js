// Conteúdo do livro Arhat, de Vivian Pupin, organizado para o app.
// Blocos de texto: { p } parágrafo · { afirm, fonte } afirmação em destaque · { passos } lista numerada
// { lista } lista simples · { sub } subtítulo · { cita, autor } citação · { pergunta } pergunta para a pessoa
// Os ensinamentos do livro estão nas cápsulas diárias (capsulas.js).
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
      frase: "A Terra Prometida é o mundo dos sonhos.",
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
      frase: "Eu sou consciência além deste corpo.",
      intro: "Para sutilizar nossa vibração vamos reativar as raízes receptoras do corpo! Essa prática não apenas ativa nossa memória, mas também nos aproxima gradualmente de nossos conselheiros espirituais.",
      momentos: [
        { quando: "Ao acordar", hora: "primeiros 5 min", praticas: [
          { k: "diario", ico: "pena", nome: "Diário dos 5 minutos", det: "Onde eu estava? O que eu sentia?", irDiario: true } ] },
        { quando: "Dia", hora: "ao amanhecer e no pôr do sol", praticas: [ RESP_DOURADA, TESTE ] },
        { quando: "Noite", hora: "ao deitar", praticas: [
          { k: "noite", ico: "lua", nome: "Preparando o ambiente", det: "A chuva no quarto e a afirmação", audio: true, texto: [
            { afirm: "Eu sou consciência além deste corpo.\nPor isso, posso perceber o que existe além do mundo dos sentidos.\nAbro-me para expandir, explorar e compreender as forças sutis que me atravessam,\ne para usá-las com sabedoria, para o meu bem e o de quem eu amo.\nChamo para perto de mim os guias e conselheiros de jornada\ncuja luz e sabedoria me conduzem com amor.\nQue nada menor do que a minha verdade me alcance nesta noite.\nEu sou consciência além deste corpo.", fonte: "Afirmação do Arhat" },
            { passos: [
              "Imagine uma chuva caindo em seu quarto, limpando toda a atmosfera ao seu redor.",
              "Leia a afirmação acima e deite-se na posição supino (barriga para cima).",
              "Concentre-se na cor do seu nevoeiro e deixe-se envolver por ele.",
              "Repita mentalmente “Eu sou consciência além deste corpo” enquanto se entrega às marés do sono.",
              "Lembre-se de anotar todas as experiências que recordar."
            ] },
            { p: "A folha em branco a ser preenchida se torna uma janela pela qual se enxergam as infinitas possibilidades do seu Ser." }
          ] } ] }
      ]
    },
    {
      id: 2, nome: "Segundo Ato", sub: "Cair no sono consciente", capa: "fios",
      frase: "Ao cair no sono estou consciente.",
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
      frase: "Eu tenho clareza do plano astral.",
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
      frase: "Sou um ser multidimensional.",
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
      frase: "Agora eu me separo facilmente do meu corpo e estou consciente.",
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

  return { ATOS, ALVOS };
})();
