// Conteúdo do Oráculo de Amon: cada consulta junta a resposta da barca (sim ou não),
// um neter (deus) que fala com a pessoa e um amuleto para levar na viagem.
// 12 deuses × 12 horas da noite × 10 amuletos × 3 conselhos = 4.320 leituras diferentes (sem sim ou não: a barca escolhe o deus).
window.ORACULO = {
  deuses: [
    { id: "ra", nome: "Rá", titulo: "o sol que atravessa a noite",
      rege: "a força de recomeçar, a vitalidade, a coragem de aparecer",
      mito: "Todas as tardes Rá entra no mundo dos mortos na sua barca da noite e atravessa as doze horas da escuridão. Enfrenta a serpente Apófis e, toda manhã, nasce de novo no horizonte. Para os egípcios, o sol não só nascia: ele vencia.",
      luz: "Clareza, presença, a capacidade de iluminar o que estava escondido.",
      sombra: "Querer brilhar sozinho, cansar-se de tanto carregar a luz para os outros.",
      pergunta: "O que em você já atravessou a noite e está pronto para nascer de novo?",
      hoje: ["Veja o sol nascer ou se pôr hoje em silêncio, como faziam os sacerdotes de Heliópolis.", "Faça uma coisa que você vinha adiando: Rá não espera a noite acabar sozinha.", "Antes de dormir, lembre de uma pequena escuridão que você atravessou hoje."] },
    { id: "thoth", nome: "Thoth", titulo: "o escriba dos deuses",
      rege: "a palavra, a memória, o estudo, a medida justa das coisas",
      mito: "Thoth inventou a escrita e deu os hieróglifos aos homens. Com cabeça de íbis, ele anota o resultado da pesagem do coração. Também é o deus da Lua, que mede o tempo, e foi ele quem curou o olho ferido de Hórus.",
      luz: "Pensamento claro, aprender rápido, dar nome ao que se sente.",
      sombra: "Ficar só na cabeça, explicar tudo e sentir pouco.",
      pergunta: "Que palavra você precisa escrever, dizer ou finalmente aprender?",
      hoje: ["Escreva três linhas no seu diário sobre o que viu hoje, antes que vire só lembrança.", "Pergunte ao guia o significado de um hieróglifo que chamou sua atenção.", "Aprenda uma palavra em árabe e use com alguém."] },
    { id: "isis", nome: "Ísis", titulo: "a grande mágica",
      rege: "o cuidado, a magia, a fidelidade, o poder de reunir o que foi partido",
      mito: "Quando Seth despedaçou Osíris e espalhou o corpo pelo Egito, Ísis procurou cada parte, juntou todas e, com a sua magia, trouxe o marido de volta à vida por tempo suficiente para gerar Hórus. Seu templo em Philae foi o último a fechar no Egito antigo.",
      luz: "Persistência amorosa, intuição, a força de quem cuida.",
      sombra: "Cuidar tanto dos outros que esquece de reunir os próprios pedaços.",
      pergunta: "Que parte de você ficou espalhada pelo caminho e está pedindo para ser reunida?",
      hoje: ["Em Philae ou onde estiver, coloque a mão no coração e agradeça a quem cuidou de você.", "Ofereça ajuda a alguém da caravana sem esperar que peçam.", "Guarde uma pedrinha ou flor de hoje como lembrança de algo que você reuniu."] },
    { id: "osiris", nome: "Osíris", titulo: "o que renasce",
      rege: "o renascimento, a colheita, os ciclos, a paciência do que cresce",
      mito: "Osíris foi rei do Egito e ensinou a plantar. Morto pelo irmão, renasceu como senhor do mundo dos mortos. Os egípcios faziam figuras dele de barro com sementes de cevada: quando as sementes brotavam, era a prova de que a vida volta.",
      luz: "Fé nos ciclos, capacidade de se reerguer, generosidade.",
      sombra: "Ficar preso ao que morreu, com medo de deixar ir.",
      pergunta: "O que precisa terminar para que outra coisa possa brotar?",
      hoje: ["Olhe as margens verdes do Nilo: toda essa vida nasce da cheia que os egípcios chamavam de lágrimas de Ísis.", "Deixe para trás, em silêncio, um hábito ou pensamento que já cumpriu o seu tempo.", "Plante uma intenção para quando voltar para casa."] },
    { id: "horus", nome: "Hórus", titulo: "o falcão que vê longe",
      rege: "a visão, a proteção, a coragem de assumir o próprio lugar",
      mito: "Filho de Ísis e Osíris, Hórus lutou contra Seth para recuperar o trono do pai. Na luta perdeu um olho, que Thoth curou. Esse olho curado, o udjat, virou o amuleto de proteção mais usado do Egito. Todo faraó era chamado de Hórus vivo.",
      luz: "Visão ampla, liderança, proteger quem se ama.",
      sombra: "Viver brigando por um lugar que já é seu.",
      pergunta: "Que lugar na sua vida é seu e você ainda não ocupou?",
      hoje: ["Em Edfu, olhe nos olhos o grande falcão de granito na porta do templo.", "Suba num lugar alto e olhe o horizonte por um minuto, como o falcão.", "Diga em voz alta uma decisão que você vinha evitando."] },
    { id: "anubis", nome: "Anúbis", titulo: "o guardião das passagens",
      rege: "as transições, o cuidado com o que termina, a guia nos caminhos escuros",
      mito: "Com cabeça de chacal, Anúbis preparava os corpos para a eternidade e conduzia as almas até o Salão das Duas Verdades, onde segurava a balança da pesagem do coração. Os chacais rondavam os cemitérios no deserto, e por isso viraram guardiões.",
      luz: "Coragem diante do desconhecido, respeito pelos fins.",
      sombra: "Medo de mudança, ficar parado na porta sem atravessar.",
      pergunta: "Diante de qual porta você está parada, esperando permissão para atravessar?",
      hoje: ["No Vale dos Reis, repare nos chacais pintados que guardam as tumbas.", "Feche um ciclo pequeno hoje: responda uma mensagem, agradeça, se despeça.", "Caminhe alguns minutos no escuro da noite do deserto, sem lanterna, com alguém ao lado."] },
    { id: "hathor", nome: "Hathor", titulo: "a senhora da alegria",
      rege: "o amor, a música, a dança, a beleza, o prazer de estar viva",
      mito: "Hathor, a vaca celeste, era a deusa da música e da embriaguez sagrada. Conta o mito que, para acalmar a fúria da leoa Sekhmet, os deuses tingiram cerveja de vermelho; ela bebeu, dormiu e acordou como a doce Hathor. Suas festas tinham música, dança e o som do sistro.",
      luz: "Alegria, sensualidade, gratidão pelo belo.",
      sombra: "Achar que alegria é luxo e deixar para depois.",
      pergunta: "Quando foi a última vez que você dançou sem motivo?",
      hoje: ["Cante ou dance hoje, nem que seja um minuto, na cabine do barco.", "Olhe-se no espelho com carinho: o espelho era um objeto sagrado de Hathor.", "Prove algo doce e saboreie devagar, sem pressa."] },
    { id: "maat", nome: "Maat", titulo: "a verdade e o equilíbrio",
      rege: "a verdade, a ordem do mundo, a justiça, o equilíbrio entre dar e receber",
      mito: "Maat é a pena que pesa contra o coração. Mais que uma deusa, era o próprio equilíbrio do universo: o sol nascer, o Nilo encher, as pessoas serem justas. O dever do faraó era manter Maat e afastar o caos.",
      luz: "Integridade, justiça, saber o próprio peso.",
      sombra: "Rigidez, cobrar de si uma perfeição que nem os deuses tinham.",
      pergunta: "Em que parte da sua vida você está dando muito mais do que recebe, ou o contrário?",
      hoje: ["Diga hoje uma verdade que você costuma guardar, com gentileza.", "Faça a pesagem do coração no oráculo e escolha uma declaração para levar.", "Divida algo com alguém da caravana em partes iguais."] },
    { id: "ptah", nome: "Ptah", titulo: "o criador pela palavra",
      rege: "a criação, o trabalho das mãos, a ideia que vira forma",
      mito: "Na cidade de Mênfis contavam que Ptah criou o mundo pensando com o coração e falando com a língua: o que ele nomeava passava a existir. Era o patrono dos artesãos e escultores. Em Abu Simbel, sua estátua é a única que o sol não ilumina no dia do alinhamento.",
      luz: "Criatividade, capacidade de realizar, paciência de artesã.",
      sombra: "Planejar demais e nunca colocar no mundo.",
      pergunta: "O que já está pronto no seu coração e só falta você dizer em voz alta?",
      hoje: ["Faça algo com as mãos hoje: um desenho, uma anotação, uma pulseira.", "Compre de um artesão no bazar e pergunte como ele faz.", "Fale em voz alta, como Ptah, o que você quer criar na volta."] },
    { id: "amon", nome: "Amon", titulo: "o oculto",
      rege: "o mistério, o invisível, a força que move tudo sem aparecer",
      mito: "Amon quer dizer o oculto. Era o deus do sopro, do vento, aquilo que não se vê mas move tudo. Em Tebas virou Amon-Rá, rei dos deuses, e para ele foi construído Karnak, o maior templo da Antiguidade. Respondia às perguntas pela barca sagrada, como você acabou de ver.",
      luz: "Confiança no invisível, discrição, poder sem barulho.",
      sombra: "Se esconder tanto que ninguém te encontra.",
      pergunta: "O que está agindo na sua vida de forma invisível, e você ainda não reconheceu?",
      hoje: ["Em Karnak, pare no meio das colunas e sinta o vento passar entre elas.", "Faça um bem a alguém sem contar para ninguém.", "Respire fundo dez vezes: Amon era o sopro da vida."] },
    { id: "sobek", nome: "Sobek", titulo: "a força do Nilo",
      rege: "a força bruta, a fertilidade, a proteção, a coragem de mergulhar",
      mito: "Sobek, o deus crocodilo, era temido e amado: os crocodilos matavam, mas viviam onde a água trazia vida. Em Kom Ombo, os sacerdotes criavam crocodilos sagrados com brincos de ouro, e quando morriam eram mumificados como reis.",
      luz: "Força, instinto, proteção feroz de quem se ama.",
      sombra: "Agir só no impulso, morder antes de entender.",
      pergunta: "Que força em você você tem medo de usar?",
      hoje: ["Em Kom Ombo, veja as múmias de crocodilo e pense no que você protege com unhas e dentes.", "Toque a água do Nilo e entregue a ela um medo.", "Faça hoje algo que exige coragem física."] },
    { id: "imhotep", nome: "Imhotep", titulo: "o sábio que virou deus",
      rege: "a sabedoria prática, a cura, a arquitetura, o estudo que transforma",
      mito: "Imhotep não nasceu deus: foi arquiteto, médico e sacerdote do faraó Djoser, e desenhou em Saqqara a primeira pirâmide da história. Foi tão sábio que, séculos depois, foi adorado como deus da medicina. Os gregos o chamaram de Asclépio.",
      luz: "Inteligência a serviço, cura, construir o que fica.",
      sombra: "Acreditar que só vale o que é grandioso.",
      pergunta: "Que conhecimento seu poderia curar ou ajudar alguém agora?",
      hoje: ["Em Saqqara, lembre que tudo começou com uma pessoa que ousou empilhar a primeira pedra.", "Ensine algo que você sabe a alguém da caravana.", "Cuide do seu corpo hoje: água, sombra e descanso."] }
  ],
  amuletos: [
    { id: "ankh", h: "𓋹", nome: "Ankh", sentido: "a vida", texto: "A chave da vida. Os deuses aparecem segurando o ankh junto ao nariz do faraó, dando a ele o sopro da vida eterna. Leve hoje a lembrança de que você está viva, e isso já é sagrado." },
    { id: "djed", h: "𓊽", nome: "Djed", sentido: "a firmeza", texto: "O pilar djed é a coluna vertebral de Osíris. Era colocado sobre o peito das múmias para que elas pudessem se erguer. Leve a força de ficar de pé, mesmo cansada." },
    { id: "udjat", h: "𓂀", nome: "Udjat", sentido: "a proteção e a cura", texto: "O olho de Hórus que Thoth curou. Cada parte do olho representava uma fração, e somadas dão quase o inteiro: falta um pedacinho, que a magia completa. Leve a proteção de quem já se feriu e se curou." },
    { id: "escaravelho", h: "𓆣", nome: "Escaravelho", sentido: "o renascimento", texto: "Khepri, o escaravelho, rola o sol pelo céu como o besouro rola a sua bola de terra. Escaravelhos eram colocados no lugar do coração das múmias. Leve a certeza de que todo dia você pode recomeçar." },
    { id: "tyet", h: "𓎬", nome: "Nó de Ísis", sentido: "o abraço protetor", texto: "O tyet, o nó de Ísis, era feito de pedra vermelha e protegia quem o usava com o sangue e a magia da deusa. Leve a proteção de quem cuida de você, mesmo de longe." },
    { id: "was", h: "𓌀", nome: "Cetro was", sentido: "o poder", texto: "O cetro was, com cabeça de animal e ponta bifurcada, é o poder e o domínio que os deuses carregam. Leve a lembrança de que você tem poder sobre as suas escolhas." },
    { id: "shen", h: "𓍶", nome: "Shen", sentido: "a eternidade", texto: "Um laço de corda sem começo nem fim. Esticado, ele vira o cartucho que protege o nome dos faraós. Leve a ideia de que o que é verdadeiro em você não acaba." },
    { id: "ib", h: "𓄣", nome: "Ib, o coração", sentido: "a consciência", texto: "Para os egípcios, era no coração, e não no cérebro, que moravam o pensamento, a memória e a verdade. Por isso era o único órgão que ficava no corpo da múmia. Leve a escuta do seu próprio coração." },
    { id: "lotus", h: "𓆸", nome: "Lótus", sentido: "o nascimento da luz", texto: "O lótus azul fecha à noite e abre de manhã. Os egípcios contavam que o sol nasceu de um lótus no começo do mundo. Leve a delicadeza de quem abre devagar, no seu tempo." },
    { id: "nefer", h: "𓄤", nome: "Nefer", sentido: "a beleza e a bondade", texto: "Nefer quer dizer bom e belo ao mesmo tempo: para os egípcios, eram a mesma coisa. Está no nome de Nefertari e de Nefertiti. Leve hoje o olhar que encontra beleza nas coisas simples." }
  ]
};

// ---------- narrativa da consulta (como o Oráculo dos Planetas da Índia, que tinha planeta + mansão da Lua + mantra) ----------
// imagem: como o deus aparece nas paredes; sim/nao: a resposta dele; nome: o nome sagrado em egípcio antigo (transliterado) com o epíteto real
Object.assign(window.ORACULO, {
  falas: {
    ra: { imagem: "Um homem com cabeça de falcão e o disco do sol sobre a cabeça, cercado por uma serpente. De noite, nas tumbas do Vale dos Reis, ele aparece com cabeça de carneiro, de pé na barca.", sim: "Rá diz sim como o sol diz sim toda manhã: sem pedir licença. O que você perguntou tem luz suficiente para acontecer, desde que você apareça para isso.", nao: "Rá diz não como o sol que se põe: não é o fim, é a travessia. Há uma noite a cruzar antes. O que você quer pode nascer, mas não agora e não desse jeito.", nome: ["Ra-Horakhty", "Rá-Hórus dos dois horizontes"] },
    thoth: { imagem: "Um homem com cabeça de íbis, a ave de bico curvo do Nilo, segurando a paleta e o junco de escriba. Às vezes aparece como babuíno, sentado, com a Lua sobre a cabeça.", sim: "Thoth anota sim no seu papiro. Mas ele é o deus da medida: o sim vem para quem estuda o caminho, faz as contas e escreve o plano.", nao: "Thoth anota não, e explica: falta informação. Antes de decidir, pergunte, leia, escute. A resposta muda quando você souber mais.", nome: ["Djehuty, neb medu-netjer", "Thoth, senhor das palavras divinas"] },
    isis: { imagem: "Uma mulher com o trono na cabeça, o próprio hieróglifo do nome dela, ou com os chifres de vaca e o disco solar. Nas tumbas, abre as asas para proteger.", sim: "Ísis diz sim, e um sim que junta. O que você perguntou é feito de pedaços que se reúnem: pessoas, tempos, partes suas. Cuide de cada pedaço.", nao: "Ísis diz não por enquanto. Ela também esperou, escondida nos pântanos do Delta, até Hórus crescer. Proteja o que você quer em silêncio antes de mostrar ao mundo.", nome: ["Aset, weret hekau", "Ísis, a grande de magia"] },
    osiris: { imagem: "Um rei envolto em faixas brancas de múmia, de pele verde ou preta, a cor da terra fértil, segurando o cajado e o mangual cruzados no peito.", sim: "Osíris diz sim, mas um sim que passa por uma morte. Algo precisa terminar para isto começar. Como o trigo, que só brota depois de enterrado.", nao: "Osíris diz não: esta parte da sua vida pede descanso, não ação. Deixe a cheia do Nilo vir e baixar. O que se planta depois cresce melhor.", nome: ["Wsir, Khentyamentiu", "Osíris, o primeiro dos ocidentais"] },
    horus: { imagem: "Um falcão com a coroa dupla do Alto e do Baixo Egito, ou um homem com cabeça de falcão. Em Edfu, há uma estátua dele de granito, em tamanho real, guardando a porta.", sim: "Hórus diz sim com o olho aberto. Vá, e vá inteiro, sem pedir desculpas por querer. É hora de tomar o lugar que é seu.", nao: "Hórus diz não: ainda não é a batalha certa. Ele lutou com Seth por oitenta anos. Guarde a força para a hora em que ela decidir.", nome: ["Heru, nedj-it-ef", "Hórus, o que defende o pai"] },
    anubis: { imagem: "Um homem com cabeça de chacal preto, debruçado sobre a múmia ou ajustando o prumo da balança. O preto não é luto: é a cor do lodo fértil do Nilo, a cor do renascimento.", sim: "Anúbis diz sim e pega você pela mão. Você não vai sozinha nessa passagem. Confie em quem está guiando.", nao: "Anúbis diz não e aponta outra porta. Ele conhece os caminhos do escuro: esse não leva aonde você quer. Procure o guia antes do atalho.", nome: ["Inpu, khenty seh-netjer", "Anúbis, o que preside a tenda divina"] },
    hathor: { imagem: "Uma mulher com orelhas de vaca, ou com chifres e o disco do sol. Nas colunas de Dendera, o rosto dela olha para os quatro lados, sorrindo.", sim: "Hathor diz sim com música. O que você perguntou tem a ver com alegria, e alegria também é sagrada. Diga sim com o corpo, não só com a cabeça.", nao: "Hathor diz não: isso não te traz alegria de verdade. Ela pergunta onde está o prazer nessa escolha. Se não tem, ainda não é o seu caminho.", nome: ["Hut-Heru, nebet Iunet", "Hathor, a casa de Hórus, senhora de Dendera"] },
    maat: { imagem: "Uma mulher sentada com uma pena de avestruz na cabeça. Às vezes só a pena aparece, sozinha, no prato da balança.", sim: "Maat diz sim porque está em equilíbrio. O que você perguntou é justo para você e para os outros. Siga sem pesar a mais nenhum lado.", nao: "Maat diz não: algo está fora do prumo. Alguém sai perdendo, talvez você mesma. Ajuste a medida antes de seguir.", nome: ["Maat, sat Ra", "Maat, a filha de Rá"] },
    ptah: { imagem: "Um homem de pele verde, envolto num manto justo, com uma touca azul colada à cabeça, segurando um cetro que junta três símbolos: a vida, a estabilidade e o poder.", sim: "Ptah diz sim, mas pede as mãos. Ele criou o mundo pensando e falando, e depois trabalhou como artesão. O sim está no que você vai construir.", nao: "Ptah diz não: ainda é ideia, não é obra. Desenhe, teste, faça um pequeno modelo primeiro. Monumentos começam em esboços.", nome: ["Ptah, nefer-her", "Ptah, o de belo rosto"] },
    amon: { imagem: "Um homem com uma coroa de duas plumas altas, de pele azul, a cor do céu e do invisível. Também aparece como carneiro, de chifres curvos, como nas esfinges de Karnak.", sim: "Amon diz sim, e é ele mesmo quem responde, o deus desta barca. O que você não vê já está se movendo a seu favor. Confie no vento.", nao: "Amon diz não, e o motivo está escondido, como ele. Não é para entender agora. Um dia você vai olhar para trás e ver o desvio que te protegeu.", nome: ["Imen-Ra, nesu-netjeru", "Amon-Rá, rei dos deuses"] },
    sobek: { imagem: "Um homem com cabeça de crocodilo e o disco do sol entre plumas. Em Kom Ombo, crocodilos mumificados dele ficam num museu ao lado do templo.", sim: "Sobek diz sim com força. É hora de agir com coragem e um pouco de ferocidade. Quem espera demais na margem perde a cheia.", nao: "Sobek diz não: há perigo debaixo d'água. Observe mais um pouco, como o crocodilo parado ao sol. A paciência também é força.", nome: ["Sobek-Ra", "Sobek, o crocodilo que é também o sol"] },
    imhotep: { imagem: "Um homem sentado, de cabeça raspada, com um rolo de papiro aberto no colo. Foi o único arquiteto do Egito a virar deus.", sim: "Imhotep diz sim como engenheiro: dá para fazer, e dá para fazer bem feito. Planeje cada degrau, como ele planejou a primeira pirâmide.", nao: "Imhotep diz não como médico: não está na hora, falta cuidar de algo antes. Primeiro o corpo, o descanso e a base. Depois a obra.", nome: ["Imhotep, sa Ptah", "Imhotep, filho de Ptah"] }
  },
  // as doze horas da noite do Amduat ("o que há no mundo de baixo"), pintado nas tumbas do Vale dos Reis:
  // a barca do sol atravessa uma hora por vez e renasce ao amanhecer. A hora sorteada é o momento da sua travessia.
  horas: [
    { n: 1, nome: "A entrada no horizonte", txt: "O sol acaba de se pôr. A barca entra no mundo de baixo, e babuínos cantam para abrir os portões.", tema: "um começo que ainda está no escuro" },
    { n: 2, nome: "As águas de Rá", txt: "A barca chega a campos férteis e cheios de água. Os deuses do grão recebem a luz que passa.", tema: "abundância depois da entrada" },
    { n: 3, nome: "As águas de Osíris", txt: "A barca encontra Osíris, o deus que morreu e voltou. É a hora da renovação silenciosa.", tema: "algo que se renova sem ninguém ver" },
    { n: 4, nome: "O deserto de Sokar", txt: "Não há mais água. A barca vira serpente e é puxada por cordas por caminhos em zigue-zague no escuro.", tema: "travessia difícil, em que se avança devagar" },
    { n: 5, nome: "A caverna de Sokar", txt: "No centro da noite, uma colina guarda um segredo e um lago de fogo queima os que não têm o coração leve.", tema: "um segredo que pede coragem para ser visto" },
    { n: 6, nome: "O encontro", txt: "A hora mais funda: a alma do sol se une ao corpo de Osíris. Da escuridão completa nasce a força para voltar.", tema: "o ponto mais fundo, de onde só se pode subir" },
    { n: 7, nome: "A serpente contida", txt: "A serpente Apófis tenta beber o rio e parar a barca. Ísis e a serpente Mehen a contêm com palavras de poder.", tema: "um obstáculo vencido pela palavra certa" },
    { n: 8, nome: "As vozes das cavernas", txt: "Os mortos recebem roupas novas e respondem ao sol com vozes de animais, de abelhas e de água.", tema: "receber o que faltava e responder" },
    { n: 9, nome: "Os remadores", txt: "Doze remadores levam a barca adiante e distribuem água fresca e alimento a quem está nas margens.", tema: "seguir com a ajuda de muitas mãos" },
    { n: 10, nome: "As águas de cura", txt: "Os afogados são salvos e o escaravelho aparece, anunciando que a forma nova do sol já está se formando.", tema: "cura e o primeiro sinal do novo" },
    { n: 11, nome: "Os olhos de luz", txt: "Uma serpente leva luz à frente da barca. Tudo o que impedia o amanhecer é deixado para trás.", tema: "deixar para trás o que impede a manhã" },
    { n: 12, nome: "O renascimento", txt: "A barca entra pela cauda de uma serpente imensa e sai pela boca. O sol renasce como escaravelho, Khepri, no horizonte do leste.", tema: "renascer de outro jeito" }
  ]
});

// a mensagem de cada deus quando a barca para diante dele (sem sim ou não: como no I Ching, o que sai é um tema para olhar)
window.ORACULO.mensagens = {
  ra: "Rá fala de um ciclo que está terminando para que outro comece. A sua pergunta pede luz: tirar do escuro o que você vem guardando e deixar que os outros vejam. O sol não pede desculpas por nascer. Este é um tempo de aparecer, de assumir, de ocupar o seu lugar no céu, e também de lembrar que até o sol descansa toda noite.",
  thoth: "Thoth fala do conhecimento e da palavra. A sua pergunta ainda não tem resposta porque ainda não foi bem escrita: falta nomear, medir, entender. Estude o assunto, converse, anote. O que hoje parece confuso vai se ordenar quando você der nome a cada parte. A sabedoria aqui não é saber tudo, é saber o que perguntar.",
  isis: "Ísis fala de reunir o que se espalhou. A sua pergunta toca em algo que se quebrou ou se dividiu: uma relação, um projeto, uma parte de você. Não é tempo de pressa, é tempo de cuidado paciente, pedaço por pedaço. A magia de Ísis é a fidelidade: o que você protege com amor volta a ter vida.",
  osiris: "Osíris fala de morte e renascimento. A sua pergunta envolve algo que precisa ser enterrado para brotar de novo. Não lute contra o fim de uma fase: ele é a terra fértil do que vem. Como o Nilo, que inundava e recuava todo ano, a sua vida tem estações. Esta é a da semente.",
  horus: "Hórus fala de coragem e de visão. A sua pergunta pede que você enxergue longe e decida, como o falcão que vê do alto. Há uma batalha justa a travar, e ela é sua. O olho de Hórus foi ferido e curado: o que te machucou também pode virar força e proteção.",
  anubis: "Anúbis fala das passagens. A sua pergunta está numa porta, entre o que foi e o que vai ser. Não tenha medo do escuro do meio do caminho: ele é guiado. Cuide bem do que está terminando, com respeito, e deixe-se conduzir. Toda travessia tem um guardião.",
  hathor: "Hathor fala de alegria, beleza e amor. A sua pergunta pede que você consulte o prazer, não só a obrigação. O que te faz dançar? O que te deixa leve? Hathor lembra que o sagrado também mora na música, na festa, no toque e no riso. Escolha o caminho que tem alegria dentro.",
  maat: "Maat fala do equilíbrio. A sua pergunta envolve algo fora do prumo: você está dando mais do que recebe, ou recebendo sem retribuir, ou dizendo uma coisa e fazendo outra. Não é sobre culpa, é sobre medida. Quando a balança se ajusta, o caminho aparece sozinho.",
  ptah: "Ptah fala da criação. A sua pergunta tem a ver com algo que você quer construir. Ptah criou o mundo pensando com o coração e falando com a língua, e depois trabalhou com as mãos. Primeiro imagine com clareza, depois diga em voz alta, depois faça. É tempo de artesão.",
  amon: "Amon, o oculto, fala do que você ainda não vê. A sua pergunta tem uma parte escondida, e ela está trabalhando a seu favor. Não force a resposta agora. Confie no vento que não se vê mas move as velas. Amon pede fé no invisível e atenção aos sinais pequenos.",
  sobek: "Sobek fala da força e do instinto. A sua pergunta pede coragem crua, aquela que não espera estar pronta. Mas o crocodilo também sabe esperar imóvel ao sol até a hora certa. Use a força, sim, mas com o tempo do rio: nem paralisada, nem afobada.",
  imhotep: "Imhotep fala da sabedoria prática. A sua pergunta se resolve com método: um degrau de cada vez, como a primeira pirâmide, que era uma escada para o céu. Cuide do corpo, organize os passos, peça ajuda a quem sabe. O que parece impossível vira obra quando é bem planejado."
};

// ---------- Senet: o jogo da passagem ----------
// O tabuleiro de 30 casas, em 3 fileiras, percorrido em zigue-zague. As casas 15 e 26 a 30 têm sinais pintados nos
// tabuleiros que sobreviveram (o ankh, o nefer, a água, o três, o dois e a figura de Hórus ou de Rá). As outras casas
// não têm nome conhecido: aqui cada uma ganha um deus guardião, que fala com a pessoa (isso é escolha nossa).
// A consulta começa na Casa do Renascimento (15) e são 4 lançamentos dos 4 bastões.
window.ORACULO.senet = {
  casas: {
    15: { nome: "Casa do Renascimento", h: "𓋹", amuleto: "ankh", tema: "recomeço",
      txt: "Toda consulta começa aqui. Nos tabuleiros, esta casa leva o ankh, a vida. Era onde a peça renascia depois de cair na água.",
      msg: "Você voltou ao ponto de partida, mas não é a mesma pessoa que saiu. O que parecia andar para trás é o caminho dando a você uma segunda chance de começar com o que já aprendeu. Renascer não é apagar: é começar de novo carregando a experiência.",
      pergunta: "Se você pudesse começar isso de novo hoje, o que faria diferente?" },
    26: { nome: "Casa da Beleza", h: "𓄤", amuleto: "nefer", tema: "o que é bom e belo",
      txt: "A casa do nefer, a palavra que quer dizer bom e belo ao mesmo tempo. Chegar aqui era sinal de sorte: a peça podia seguir protegida.",
      msg: "O caminho está abençoado. O que você perguntou tem beleza dentro, e para os egípcios beleza e bondade eram a mesma coisa. Siga, mas siga com cuidado com o que vem: a casa seguinte é a da água. Aproveite este momento sem pressa de passar por ele.",
      pergunta: "Que beleza na sua vida você ainda não parou para agradecer?" },
    27: { nome: "Casa da Água", h: "𓈗", amuleto: "djed", tema: "a queda que ensina",
      txt: "A casa das águas do caos. Quem caía aqui se afogava e voltava para a Casa do Renascimento. É a única casa que manda a peça para trás.",
      msg: "Você caiu na água. Não é castigo: é o Nilo te puxando para o fundo para mostrar o que ainda não foi visto. Algo na sua pergunta precisa ser revisto antes de seguir. Respire, volte ao começo e atravesse de novo, mais leve. Muitas vezes a resposta está no que a gente tentou pular.",
      pergunta: "O que você está tentando atravessar rápido demais?" },
    28: { nome: "Casa das Três Verdades", h: "𓏼", amuleto: "ib", tema: "o que precisa ser visto por três lados",
      txt: "Nos tabuleiros, esta casa tem três traços. Muitos estudiosos ligam essa casa aos juízes do outro mundo.",
      msg: "A sua pergunta tem três lados, e você está olhando só um. Pense no que você sente, no que é justo para os outros e no que é melhor para o seu futuro. Quando as três verdades concordam, a peça sai daqui sozinha. Se uma delas discorda, escute essa primeiro.",
      pergunta: "Qual das três verdades você tem evitado ouvir?" },
    29: { nome: "Casa das Duas Verdades", h: "𓏻", amuleto: "udjat", tema: "o equilíbrio entre dois caminhos",
      txt: "A casa com dois traços. Ligada às duas Maats, a verdade e a justiça, e ao sol que se põe, Atum.",
      msg: "Você está entre dois caminhos, e os dois têm verdade. Não é escolher o certo contra o errado: é encontrar o equilíbrio entre duas coisas boas. Maat não pede que você abra mão de um lado, pede que você não pese demais nenhum. A resposta está no meio, onde a balança fica parada.",
      pergunta: "O que acontece se você não precisar escolher só um lado?" },
    30: { nome: "Casa de Hórus", h: "𓅃", amuleto: "escaravelho", tema: "a chegada",
      txt: "A última casa, a saída do tabuleiro. Em alguns tabuleiros ela tem a figura de Hórus ou de Rá nascendo. Quem chegava aqui atravessava para a luz.",
      msg: "Você chegou. A peça sai do tabuleiro e nasce como o sol. O que você perguntou está maduro, pronto para acontecer. Este é o momento de agir com a coragem de Hórus, que viu longe e tomou o seu lugar. Não espere mais um sinal: este é o sinal.",
      pergunta: "O que você faria hoje se soubesse que já está pronta?" }
  },
  // casas sem nome conhecido: um deus guardião para cada uma (16 a 25)
  guardioes: { 16: "thoth", 17: "isis", 18: "osiris", 19: "anubis", 20: "hathor", 21: "maat", 22: "ptah", 23: "amon", 24: "sobek", 25: "imhotep" },
  amuletoGuardiao: { thoth: "ib", isis: "tyet", osiris: "djed", anubis: "udjat", hathor: "nefer", maat: "shen", ptah: "was", amon: "shen", sobek: "was", imhotep: "lotus" },
  bolsa: [["O que veio", "Isto te trouxe até aqui."], ["O que é", "Isto pede a sua atenção agora."], ["O que vem", "Isto te espera no caminho."]]
};
