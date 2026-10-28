# Conhecimento do app da Índia, para construir o app do Egito

Tudo o que foi aprendido no app da Caravana do Céu · Travessia da Índia Sagrada (set–out/2026, 856 commits), reunido para que o app do Egito nasça com a mesma base, as mesmas regras e as mesmas decisões, sem repetir erros.

A pasta `app/` aqui dentro é uma cópia idêntica do app da Índia em 15/10/2026. O código já carrega todas as funções; o que muda no Egito é o conteúdo (roteiro, lugares, deuses, idioma, moeda, fuso, artes).

---

## 1. Regras de trabalho com a Vivian

- **Publicação no Netlify gasta créditos.** Em 27/09/2026 foram 67 publicações num dia e os créditos acabaram. Só publica quando a mensagem do commit tem `[publicar]`, e só se coloca `[publicar]` quando a Vivian diz "publica" naquele momento. Fluxo: ajustar, commitar e dar push sem `[publicar]`, mostrar por imagem ou vídeo, e publicar tudo de uma vez quando ela pedir.
- **Mudar só o que ela pediu.** Nada de mexer em textos, posições ou tamanhos já aprovados. Se outra coisa precisar mudar, avisar.
- **Não inventar** datas, horários, hotéis, nomes de templos, práticas ou depoimentos. O roteiro do app segue o roteiro oficial da turma, só com os destaques: sem itens opcionais, sem notas de van, guia, tempo livre ou café em piquenique.
- **Textos dela são dela.** Aberturas dos dias, carta final, cabine de fotos, habilidades: quando a Vivian escreve, entra exatamente como ela escreveu. Rascunhos meus vão marcados como rascunho para aprovação.
- **Nada de mencionar o Claude** nos textos do app.
- **Linguagem**: português simples, frases curtas, sem marca de gênero quando possível (ou com escolha Caravaneira/Caravaneiro). Mensagens de commit descrevem o que a pessoa vê, em português ("Passaporte: selo novo de…").
- **Mostrar sempre**: depois de cada rodada, prévia em imagem ou vídeo (Chromium/Playwright no ambiente).
- **Anti-pisca**: a Vivian percebe qualquer piscada de tela. Toda mudança deve redesenhar só a parte que mudou (ver seção 5).

## 2. Como o projeto é montado

| Peça | O que é |
| --- | --- |
| `app/caravana-do-ceu.html` | O app inteiro num arquivo só (HTML + CSS + JS, ~9.500 linhas). É aqui que se edita. |
| `tools/gerar-site.py` | Gera `app/index.html` (versão do site) a partir do arquivo acima, grava `versao.json` e atualiza a lista de arquivos do `sw.js`. Rodar depois de toda edição: `python3 tools/gerar-site.py`. |
| `tools/site/shim.js` → `app/shim.js` | Ponte entre o app e o Firebase (login, Firestore, Storage, presença). Empacotar com `npx esbuild tools/site/shim.js --bundle --minify --format=iife --loader:.json=json --outfile=app/shim.js`. `seed.json` tem as cidades e locais iniciais do banco. |
| `app/config.js` | Configuração pública do Firebase, e-mails das líderes, login pelo próprio endereço do app, aviso para quem abre pelo Instagram/WhatsApp, remoção do selo do Netlify. |
| `app/sw.js` | Service worker: guarda tudo para funcionar sem internet; a lista de arquivos e as marcas são escritas pelo `gerar-site.py`. |
| `app/dados/travessia.json` | Roteiro dia a dia (data, cidade, rota, hotel, agenda, lugares, cerimônia, deuses do dia, cuidados, selos do dia). |
| `app/dados/saberes/*.json` | Saberes extras (título, resumo, texto, fonte, figura). |
| `app/dados/geo.json` | Contornos dos países e rios do mapa em pergaminho. |
| `app/embarque.html`, `app/passagens.html` | Bilhete de embarque personalizado (`/embarque/nome/numero`) e a página da líder que gera as passagens. |
| `app/img`, `app/deuses`, `app/insignias` | Artes: aberturas dos dias por cidade, câmeras, deuses, selos do passaporte. |
| `netlify/functions` | `avisar.mjs` (notificações push), `cartas.mjs` (cartas agendadas), `falar.mjs` (voz do tradutor). `netlify/lib/push.mjs` envia o push. |
| `firestore.rules` | Regras do banco. |
| `netlify.toml` | Publica `app/`, só com `[publicar]`; redireciona `/__/auth` para o Firebase (login no iPhone) e `/embarque/*`. |

**Firebase**: o da Índia é `app-caravana-70c8a`. O Egito precisa de um projeto novo (dados não se misturam), com Authentication (e-mail + palavra-chave; Google só para as líderes), Firestore, Storage e Cloud Messaging. Atenção ao limite grátis: o app já economiza (online a cada 2 min, localização só quando a pessoa anda ~50 m, faixa de aviso quando a cota acaba).

**Netlify**: o da Índia é `caravanaindiaapp.netlify.app`. O Egito terá site novo; trocar o endereço em `config.js` (`LOGIN_PELO_APP`) e cadastrar `https://<novo>/__/auth/handler` nas credenciais OAuth do Google Cloud. Os redirects de `/__/auth` no `netlify.toml` apontam para o `authDomain` do Firebase novo.

## 3. O que o app tem (e foi aprovado)

**Entrada e primeira vez**
- Passagem de embarque personalizada (bilhete antigo, lacre de cera bronze com o símbolo, raspadinha dourada com a palavra-chave, guardião da travessia sorteado pelo número).
- Manual de instalar na Tela de Início (abas iPhone e Android, com videozinho), só para quem ainda não entrou.
- Entrar com e-mail + palavra-chave (a líder troca a palavra no painel; quem entrou com a palavra antiga continua entrando).
- Boas-vindas (uma vez, só para quem não tem passaporte) → emissão do passaporte (foto obrigatória) → tela de permissões (câmera, localização, notificações).
- Véu de abertura: o app fica coberto até as telas de início entrarem, para nada piscar.

**Antes da viagem**: missões de preparação (carimbo Embarque, intenção guardada, guardião da passagem com história, cartas e mantra, mensagem na garrafa "Quem sou eu ao final desta travessia?" que volta no último dia, pistas da Galeria). Somem quando a viagem começa.

**Hoje / Travessia**: contador (Dia N de 13 · cidade), relógios Brasil e destino, frases que giram, abertura do dia (foto da cidade + texto da Vivian sobre o lugar), previsão do tempo da cidade atual, roteiro dia a dia, cópia para ler sem internet.

**Passaporte**: livro 3D com página de dados (MRZ), selos numa trilha dourada em zigue-zague, festa ao carimbar, habilidades na página de cada selo, medalhas de viagens anteriores (Veterana com 3+), vídeo do passaporte para Reels no fim. A líder carimba para todos quando a caravana passa pelo lugar. No último dia o passaporte completa sozinho e todos recebem aviso.

**Habilidades**: a líder libera; a pessoa faz a foto com a caixinha de papel envelhecido e guarda no passaporte. Divertidas e ligadas ao lugar (ex.: Sobrevivente do Trânsito, Mestra da Pechincha, Sommelier de Chai).

**Saberes**: deuses e lugares em cartões, marcados como lidos; Oráculo dos Navagrahas (9 planetas, 27 mansões da Lua, céu escuro, som e vibração).

**Mapa**: pergaminho com a rota; Perto de mim com ruas/satélite, exploradores ao vivo, reações, Me leve ao hotel (tela para o motorista na língua local).

**Tradutor** (português ↔ língua local/inglês, voz, tela cheia, frases prontas sem internet) e **Câmbio** (conversor da moeda local).

**Câmera / Maleta**: maleta de couro com 8 câmeras (celular com estúdio completo, Rajastão 35 + Color, Descartável do Bazar, Instantânea Kashi, Quatro Tempos, Super 8 do Ganges com os Lassi, Agra 1900, Delhi 1955), fotos 1080×1920, filmes, carteira de Registros, Galeria da Caravana, filtros ao vivo em WebGL, chave da líder para tirar o logo.

**Explorador**: bonequinho montável (roupas, chapéus, instrumentos, pets, fantasia de deus), retrato da Caravana com uma pose por cidade (cada cenário abre com o selo da cidade), figurinhas e expressões no chat.

**Conversa** (Roda de Chai), **Pombo-correio** (cartas e presentes entre viajantes, cartas da líder), **Pedra** (mural rupestre de pensamentos).

**Painel da líder**: quem entrou, palavra-chave, guardiões, habilidades, carimbos, cartas, avisos e quantos celulares receberam.

## 4. Mapa de conversão Índia → Egito

Onde cada coisa da Índia mora no código (procurar pelo nome; números de linha mudam). Itens marcados **(roteiro)** dependem do roteiro oficial do Egito; **(Vivian)** são escolhas dela; **(arte)** precisam de imagem nova.

| O quê | Onde | Índia | Egito |
| --- | --- | --- | --- |
| Datas da viagem | `INICIO_VIAGEM`, `INICIO`/`FIM`, `ABRE_INTENCAO`, `faltam`, aba inicial, `aberto` (selo travessia), carta final, `CARIMBOS_FUNDO` | 04–16/11/2026 | **(roteiro)** set/2027, grupo 1 e grupo 2 |
| Fuso | `Asia/Kolkata` (≈10 lugares), `+05:30` | Índia | `Africa/Cairo` (no horário de verão do Egito, set/2027, UTC+3) |
| Roteiro | `dados/travessia.json` | 13 dias | **(roteiro)** |
| Cidades e locais | `tools/site/seed.json`, `EXTRAS`, `COORD_CIDADE`, `SIGLA`, `HOTEIS` | Delhi, Agra, Jaipur, Varanasi, Rishikesh | **(roteiro)** Cairo/Gizé, Assuã, Luxor e o que mais estiver no contrato |
| Mapa em pergaminho | `mapaIndia`, `camadasGeo`, `dados/geo.json`, CSS `.terra.india` | Índia, Ganges e Yamuna | Egito e o Nilo (geo novo) |
| Selos do passaporte | `insignias/*.webp`, `SELOS_COLECAO`, `PATCH_CIDADE`, `SELO_CENARIO`, adesivos "Selos" | 17 selos | **(roteiro + arte)** |
| Aberturas dos dias | `img/abertura-*.webp`, textos nos dias | por cidade | **(arte + Vivian)** |
| Deuses e saberes | `deuses/*.webp`, `GUARDIOES`, `G_SORTEIO`, `DEUS` (fantasias), `dados/saberes`, `SABERES_AJUSTES`, `FIGURINHAS` | panteão hindu | panteão egípcio (Ísis, Osíris, Hórus, Rá, Hathor, Anúbis, Thoth, Maat, Sekhmet, Bastet…) **(arte)** |
| Oráculo | `GRAHAS`, `NAKSHATRAS`, `GRAHA_MAIS`, `img/planetas` | Navagrahas | **(Vivian)** manter, ou trocar por um oráculo egípcio |
| Idioma local | `HINDI`, `vHindi`, `LINGUAS`, `falar`, `netlify/functions/falar.mjs`, Me leve ao hotel | hindi | árabe egípcio (`ar-EG`) |
| Moeda | `vRupias`, `INR`, aba Câmbio, habilidade "Milionária em Rúpias" | rúpia | libra egípcia (`EGP`) |
| Passaporte | `numPassaporte` (`CDC26IN`), MRZ `INDIA<SAGRADA`, medalha `india` ("IN") | | `CDC27EG`, `EGITO<SAGRADO` (nome da travessia: **Vivian**) |
| Habilidades | `HABILIDADES` | Trânsito Indiano, Rúpias, Bollywood, Chai, Ganges… | **(Vivian)** novas, ligadas aos lugares do Egito |
| Câmeras e filtros | `CAMERAS_C`, `FILTROS`, `CINE_BOTOES`, `FILME_CAM`, textos gravados | Rajastão 35, Agra 1900, Delhi 1955, Super 8 do Ganges, Kashi, Bazar, Lassi | **(Vivian)** nomes egípcios; as imagens das câmeras servem |
| Explorador | `BONECO`, `DEUS`, pets, sari, periquito | indiano | **(Vivian)** roupas e bichos do Egito |
| Retrato da Caravana | `CENARIOS`, `POSES` | por cidade | **(roteiro + arte)** |
| Chat | `REACOES` (Namaste, chai), `ITENS_FIG` (lamparina, vaca, macaco), "Roda de Chai" | | **(Vivian)** |
| Oráculo "para hoje" e frases | `GRAHAS[].hoje`, `FRASES` | dicas da Índia | adaptar ao Egito |
| Nome e textos gerais | `manifest.webmanifest`, `gerar-site.py` (description), `embarque.html`, `passagens.html`, carta final, boas-vindas | "Travessia da Índia Sagrada · 2026" | **(Vivian)** nome da travessia do Egito |
| Fundos de telas | permissões (`abertura-agra`), boas-vindas (Varanasi), amostra de filtro (Taj) | | **(arte)** |
| Firebase e Netlify | `config.js`, `netlify.toml` | projeto da Índia | projeto e site novos |

## 5. Lições técnicas (para não repetir)

- **iPhone**: login do Google só funciona pelo próprio endereço do app (`/__/auth` redirecionado); navegador do Instagram/WhatsApp não deixa entrar (aviso em `config.js`); som só depois de um toque (destravar áudio); vibração tem jeito próprio; toque longo seleciona texto e abre Copiar/Pesquisar (bloquear nos botões); pouca memória derruba a câmera (não guardar fotos grandes abertas); às vezes volta ao app sem recarregar (conferir `versao.json`).
- **Anti-pisca**: redesenhar só a aba que usa o dado; GPS só redesenha o mapa; trocar câmera só depois da foto do corpo estar pronta; textos abertos e faixas roladas sobrevivem ao redesenho; imagens das abas pré-carregadas.
- **Câmera**: filtros ao vivo pela placa de vídeo (WebGL, LUT 33), fotos e filmes em 1080×1920, selfie sem espelhar, capa (1º quadro) guardada ao filmar, funciona sem internet.
- **Sem internet**: service worker guarda tudo; roteiro, frases e saberes também saem num arquivo para ler sem sinal.
- **Firebase grátis**: economizar escutas, presença e localização; avisar quando a cota acaba.
- **Notificações**: aviso do celular para carimbos, cartas, reações, pombo e chat; a líder vê para quantos celulares saiu.

## 6. Ordem sugerida para o Egito

1. Roteiro oficial (dias, cidades, hotéis, horários) → `travessia.json`, `seed.json`, datas, fuso, hotéis, mapa.
2. Nome da travessia do Egito → manifest, passaporte, passagem, textos gerais.
3. Idioma e moeda (árabe egípcio, libra egípcia).
4. Deuses egípcios: saberes, guardiões, figurinhas, fantasias (com as artes).
5. Selos, aberturas dos dias e cenários do retrato (com as artes).
6. Habilidades, nomes das câmeras e filtros, explorador e chat (escolhas da Vivian).
7. Firebase e Netlify novos, repositório próprio.

## 7. O que já se sabe do Egito (PDF "EGYTP 2027 _ CARAVANA", páginas 1 a 20 e 24 a 26 de 26; faltam 21 a 23)

Fonte: prints que a Vivian mandou em 15/10/2026, guardados em `referencias/pdf-egito-2027/`.

- **Nome**: Travessia do Velho Mundo · Caravana do Céu · Egito 2027.
- **Datas**: 13 dias e 12 noites, de 08/10 a 20/10 (2027). Atenção: os contratos da Egito Tours falam em "Setembro27, Grupo 1 e Grupo 2"; confirmar com a Vivian as datas de cada grupo.
- **Rota** ("uma travessia que corta o Egito de norte a sul"): Cairo, White Desert (Deserto Branco), Hurghada, Luxor, Aswan, Abu Simbel, com mais duas paradas de templo no caminho entre Hurghada e Luxor e uma entre Aswan e Luxor (nomes a confirmar nas páginas seguintes).
- **Identidade visual do PDF**:
  - Fotos reais escuras e granuladas, céu dramático, tons de pedra e areia.
  - Títulos em letra fina, geométrica, toda em maiúsculas e bem espaçada ("EGITO", "TRAVESSIA / DO VELHO MUNDO").
  - Citações em letra bold condensada em maiúsculas, com palavra de destaque em amarelo.
  - Texto corrido em sans arredondada sobre fundo de pedra escura, com palavras-chave em negrito; olho de Hórus como ícone.
  - Mapa "a rota da Caravana": pergaminho rasgado com desenhos a tinta azul (pirâmides, templos, escaravelho, hieróglifos, jipe, barco), linha tracejada da rota.
  - Símbolo da Caravana pequeno no alto de cada página.
- **Direção pedida pela Vivian para o app**: estética toda nova, mais interativa, sem cara de IA; céu de Nut, papiro, tumbas pintadas coloridas e Indiana Jones. Página principal com mapa-mundo estilo videogame (referência: mapa do Donkey Kong Country 3 refeito em HD, em `referencias/mapa-game/`), com as cidades da rota e o viajante avançando pelo mundo.

### Itinerário (PDF, páginas 8 e 9)

Ordem real da viagem: Cairo → Deserto (Bahariya) → Cairo → voo para Aswan → cruzeiro pelo Nilo (Abu Simbel, Kom Ombo, Edfu) → Luxor → Hurghada → voo para o Cairo → Brasil. Os destaques em amarelo no PDF estão em **negrito**.

| Dia | Programa |
| --- | --- |
| 01 | Chegada ao Cairo · Check-in em hotel **em frente às Pirâmides** · Cerimônia de Abertura da Caravana · Entardecer com Show de Luzes e vista para as Pirâmides de Gizé |
| 02 | **Desvendando as Pirâmides de Gizé** · Esfinge · Grande Museu Egípcio |
| 03 | **Saqqara – A origem de tudo!** · Antigo (e lendário) Museu Egípcio · Museu das Múmias |
| 04 | **Travessia para o Deserto do Sahara** · Saída de 4x4 off-road com guia local beduíno · Oásis Bahariya · **Noite de acampamento no deserto: estrelas, fogueira e raposas!** |
| 05 | **Nascer do sol no deserto** · Deserto Negro · Crystal Mountain · Vale de Agabat · Retorno ao Cairo |
| 06 | Voo para Aswan · **Pisando na terra dos Faraós** · Templo de Philae · Check-in Cruzeiro pelo Nilo Sagrado · **Exploração na Antiga Vila Núbia** |
| 07 | **O lendário templo de Abu Simbel** · Navegação pelo Nilo · Templo de Kom Ombo |
| 08 | Templo de Edfu · **Chegada em Luxor – A Antiga Tebas** · Templo de Luxor |
| 09 | **Vale dos Reis** · Templo de Hatshepsut · Templo de Karnak |
| 10 | **Transfer para Hurghada** · Check-in em resort All Inclusive |
| 11 | **Navegação pelo Mar Vermelho** |
| 12 | **Dia livre em Hurghada** |
| 13 | Voo para Cairo · **Retorno ao Brasil** |

Sem horários nem hotéis por enquanto: pedir à Vivian o roteiro operacional (como na Índia, o app segue o roteiro da turma só com os destaques).

### "Zerando a vida · Os checks da travessia" (PDF, página 6)

Dez conquistas com ícones de traço fino em círculo. Encaixam como as conquistas do mapa game:
1. Ver as Pirâmides de Gizé (maior enigma da Terra)
2. Acampar no Deserto do Sahara no estilo beduíno, cercado de raposas fofinhas
3. Fazer um cruzeiro no Rio Nilo
4. Ver o sarcófago de Tutankhamon
5. Assistir a lua cheia nascer em um cruzeiro pelo Rio Nilo, rumo a Luxor, antiga capital dos faraós
6. Se banhar no icônico Mar Vermelho e descobrir que ele é o azul mais claro que você já viu
7. Ouvir histórias esquecidas de um Egito pouco falado
8. Entrar dentro do maior mistério da humanidade: a Pirâmide de Khufu
9. Ver múmias ao vivo!
10. Conhecer e reviver antigos rituais egípcios

### Frases e textos do PDF
- "Ver que viemos daquilo tudo faz um download diferente na sua cabeça"
- "De pirâmides, templos, desertos... e o icônico Mar Vermelho... ao nascer da lua cheia refletido pelas águas do Rio Nilo"
- "Da mítica Atlântida às escolas iniciáticas do Antigo Egito"
- Cairo: "O poder dos primeiros homens e figuras misteriosas como o arquiteto das estrelas: Imhotep – Hermes Trimegistro!" e o texto "O Cairo é o ponto de entrada para tudo aquilo que desafia o tempo!…" (página 10).
- Página 5: "Os mistérios que envolvem o Egito atravessam o tempo como um enigma ainda vivo…" até "É para esse território que a Caravana segue!"
- Identidade extra: títulos "ZERANDŌ A VIDA" em letra condensada de traço irregular; itinerário em fundo preto com faixa de pintura de tumba no alto, destaques em amarelo-ouro e linha laranja ondulada com ponto e X (como mapa de tesouro); Cairo em fundo azul granulado com texto de máquina de escrever e trilha pontilhada laranja.

### Textos das páginas 11 a 15

- **Página 11** (relevo de sacerdote com pele de leopardo): "Vamos nos aprofundar nos deuses, símbolos e histórias do Egito Antigo."
- **Página 12 · SAHARA**: "Partimos do Cairo em direção ao Deserto do Sahara, em veículos 4x4 conduzidos por beduínos locais. Atravessamos o Oásis Bahariya, seguimos pelo Deserto Negro, passamos pela Crystal Mountain e pelo Vale de Agabat, até chegar ao Deserto Branco! Montamos nosso acampamento e erguemos as tendas no meio do deserto. Apreciamos o pôr do sol na imensidão do Sahara, e um jantar típico beduíno preparado na areia, ao redor da fogueira, em um dos céus mais estrelados do planeta!"
- **Página 13 · ACAMPAMENTO BEDUÍNO NO DESERTO DO SAHARA** (título amarelo e branco em bold): rochas-cogumelo do Deserto Branco; três fotos embaixo (fogueira com barracas, tenda beduína estampada por dentro, marcas de pneu na areia).
- **Página 14 · ASWAN**: "Ensinamentos que perpetuaram nas paredes milenares do Egito. Mostrando o ser humano como canal ENTRE A TERRA E O MUNDO DOS DEUSES!" · "Aswan marca a entrada no sul do Egito, uma região estratégica que, durante o império, controlava rotas comerciais e a conexão com o restante da África. É aqui que temos o primeiro contato real com o Nilo, entendendo na prática o eixo que sustentou toda a civilização egípcia. Visitamos o Templo de Philae, dedicado à deusa Ísis, um dos templos mais preservados do Egito, construído em uma ilha no meio do rio. Embarcamos no cruzeiro pelo Nilo e passamos a nos deslocar pelo próprio curso do rio, entre cidades, templos e paisagens que atravessaram milênios."
- **Página 15 · NILE CRUIZE** (assim no PDF): "QUEM NUNCA SONHOU EM CONHECER O RIO NILO?" · "Presente no imaginário de tanta gente.. ..das aulas de história na infância? Pois é, navegaremos por ele, do sul ao norte do Egito, acompanhando suas águas repletas de jacarés (hoje nem tantos assim...) Faremos um Cruzeiro no Nilo, bem no estilo de "Morte no Nilo", sucesso de Agatha Christie, e veremos uma bela LUA CHEIA nascendo, diretamente das águas de Luxor, A Terra dos Faraós! Visitaremos a Vila Núbia, uma comunidade viva à beira do rio que, até hoje, preserva costumes, arquitetura e modo de vida como seus ancestrais!"
- Detalhe visual recorrente: em cada cidade, uma trilha pontilhada com um ponto grande (o caminho da caravana chegando ao lugar), ao lado do nome da cidade em letra fina espaçada; o subtítulo vem em letra de máquina de escrever.

### Textos das páginas 16 a 20

- **Página 16 · LUXOR · Terra dos Faraós e da Vida após a Morte**: "Luxor é o ponto central do poder faraônico no Antigo Egito. Conhecida como a antiga Tebas, foi a capital do império durante seu período mais grandioso e concentra alguns dos complexos mais importantes já construídos. Vale dos Reis, onde estão as tumbas dos faraós, escavadas diretamente na rocha e protegidas por séculos. Templo de Hatshepsut, uma das construções mais impressionantes do Egito, construído para UMA FARAÓ. Exploramos o gigante complexo de Karnak, um dos maiores conjuntos religiosos do mundo, construído ao longo de diferentes reinados."
- **Página 17 · HURGHADA · MAR VERMELHO** (foto aérea turquesa com barcos; trilha pontilhada branca): "Depois de cruzar templos e desertos, chegamos ao Mar Vermelho! Uma das principais rotas do mundo antigo, conectando o Egito a outros territórios e civilizações. Conhecido pela transparência das águas e pela vida subaquática intensa, tem um dos ambientes marinhos mais preservados do planeta! Os recifes de coral do Mar Vermelho estão entre os mais antigos e bem conservados do mundo, com formações que criam cores e contrastes difíceis de encontrar em outros lugares e a visibilidade da água é impressionante!"
- **Página 18 · Investimento**: 3.700 USD (à vista ou parcelado no Pix; cartão com juros; câmbio turismo do dia do pagamento). Informação de venda: não vai para o app.
- **Página 19 · O que está incluso**: acomodação em quarto duplo 4/5 estrelas; café da manhã; guias locais em português ou espanhol; todos os ingressos do roteiro (museus e templos); acampamento no deserto com alimentação beduína; cruzeiro de 4 dias pelo Nilo (com alimentação, sem bebida); 2 voos domésticos (Cairo → Aswan / Hurghada → Cairo); transporte privado terrestre durante toda a viagem (com transfer para aeroporto); Barco da Caravana no Mar Vermelho; Kit de viagem Caravaner; auxílio pré-viagem (visto e bagagem); suporte 24 horas.
- **Página 20 · O que não está incluso**: passagem aérea até o Cairo; seguro viagem (obrigatório); despesas extras e compras; alimentação e bebidas não mencionadas; visto para o Egito (30 USD); gorjetas.
- Úteis para o app: o "Antes de embarcar" pode ter missões de visto (30 USD), seguro viagem e bagagem; quem viaja se chama **Caravaner** (kit de viagem Caravaner).

### Textos das páginas 24 a 26 (21 a 23 ainda não chegaram; a 23 mostra o navio do cruzeiro e o salão interno)

- **Página 24 · QUEM CONDUZ A TRAVESSIA? · VANESSA DELEU + VIVIAN PUPIN** (título em bold grosso branco; foto à luz de vela, com violão): "Há 6 anos elas conduzem experiências que unem viagens, percepção e estados de presença; tendo o projeto Cerim0nia como base, onde trabalham com música, medicina do som e práticas de interiorização. Suas formações passam por diferentes caminhos: Hinduísmo, Xamanismo, Kriya Yoga, Thetahealing, Hipnose, Terapia Floral, Tarot, Magia, Umbanda, trabalho com ervas, práticas energéticas, estudos simbólicos e condução de cerimônias; utilizam desses estudos não como técnicas isoladas, mas como partes de uma mesma busca: recordar o sagrado, relembrar quem somos e despertar o ato de poder que cada um carrega dentro de si. O chamado da dupla não é apenas para buscar para si, e sim criar grupos de força, como faziam as caravanas antigas, e conduzir essas pessoas a lugares de poder onde a natureza reorganiza, limpa, transforma e toca! Cada roteiro é construído a partir de pesquisa, vivência direta e uma curadoria que busca ir além do turismo, criando experiências que conectam o viajante ao lugar de forma profunda! Na Caravana, elas conduzem o ritmo, o olhar e a forma de atravessar cada território, aprofundando-se na história e na magia do mistério que esses locais exalam!"
- **Página 25** (Abu Simbel, Vivian em frente aos colossos): "EXPLORANDO NOSSA ORIGEM NOS DAMOS CONTA DE QUE SOMOS INFINITOS" (bold em maiúsculas cor areia, com INFINITOS em branco).
- **Página 26** (colunas de Hathor de Dendera, teto pintado): assinatura "caravana" em letra de máquina de escrever gasta, sobre o símbolo da Caravana grande em branco. Bom candidato para a tela de abertura ou o véu do app.

## 8. Direção aprovada para o app do Egito (15/10/2026)

- **Estética de gibi de aventura** (Tintim + Indiana Jones): papel envelhecido, quadros com contorno de tinta, letreiro amarelo "As Aventuras de CARAVANEGITA", caixas de legenda em maiúsculas, carimbo redondo "CARAVANEER · Jornadas que transformam". Artes da Vivian em `referencias/comics/` (capa, roteiro em tríptico, "Capítulo 1: O chamado da areia", "Capítulo 2: Entre tumbas e templos", página do Dia 1 com os três enigmas, e "As Aventuras da Caravana do Céu: Um dia no coração do Cairo").
- **Ao entrar no app**: a pessoa lê uma história em quadrinhos cheia de mistério sobre a Caravana, a viagem e o próprio app, quadro a quadro, com enigmas que precisa decifrar.
- **Página principal**: mapa-mundo estilo videogame (Donkey Kong Country 3 em HD) com os lugares da viagem e o viajante avançando.
- Prova feita: https://claude.ai/artifact/62PmnbMEFxFTAkTe4e2Umm (gibi do Dia 1 em quadros, 3 enigmas que acendem o símbolo da Caravana). Respostas que usei, a confirmar com a Vivian: enigma 1 = o Sol; enigma 2 = o ankh (a chave da vida); enigma 3 = os passos.

## 9. Conteúdo do Egito já dentro do app (15/10/2026)

Fonte: `referencias/roteiro-html/egito_2027_roteiro_4.html` (roteiro interativo da Vivian, com 51 artes). Tudo é gerado por dois scripts, que podem ser rodados de novo quando o roteiro mudar:
- `tools/egito/montar-conteudo.py`: roteiro dos 13 dias (`app/dados/travessia.json`), 6 cidades, 15 carimbos, 64 saberes e a carta final (`tools/site/seed.json`), artes dos 13 deuses, 15 brasões, 17 pinos dos checks, passagem, medalhão, mapa da rota e os fundos das aberturas (fotos do PDF).
- `tools/egito/trocar-india-por-egito.py`: no código do app, datas (08 a 20/10/2027), fuso do Cairo, cidades, hotéis, carimbos, passaporte (CDC27EG), aberturas dos dias, título "Travessia do Velho Mundo", rota e frases da tela inicial.
- Depois: empacotar o shim (precisa do firebase@10.14.1) e `python3 tools/gerar-site.py`.

Decisões tomadas sem a Vivian (conferir):
- Ficaram fora do roteiro do app os opcionais (entrada na Pirâmide de Khufu, túmulo de Tutankhamon, balão).
- Tirei a frase "21 de outubro de 2027, você vai estar lá": a Caravana passa por Abu Simbel em 14/10 e o fenômeno solar é em 21/10.
- Hotéis do Cairo e do deserto sem nome (o roteiro não diz qual); "Me leve ao hotel" está em árabe, mas sem o endereço em árabe.
- Carta final ficou como rascunho para a Vivian escrever.

Ainda com cara de Índia (próximas rodadas): tradutor e frases em hindi, câmbio em rúpias, oráculo dos planetas, guardiões das passagens (deuses hindus), habilidades, explorador (sari, fantasias de deuses hindus), nomes das câmeras e filtros, mapa em pergaminho (contorno da Índia), retrato da Caravana, figurinhas do chat, gibi de abertura e mapa estilo videogame.

## 10. Roteiro operacional da Egito Tours (`referencias/egito-tours/`)

O roteiro contratado, dia a dia (sem os valores). Complementa o roteiro da Vivian com detalhes que ainda não estão no app:
- Dia 2: também o Templo do Vale (onde Quéfren foi mumificado); almoço no 9 Pyramids.
- Dia 3: em Saqqara, Pirâmide de Djoser, Túmulo de Kagemny e Pirâmide de Titi; Museu do Cairo e Museu da Civilização.
- Dia 4: 5 h de estrada até o Oásis de Bahariyah; safári pelo Deserto Preto, Montanhas de Cristal, Agabat e Deserto Branco no mesmo dia; chá preto na fogueira.
- Dia 5: nascer do sol, café beduíno, 6 h de volta ao Cairo.
- Dia 6: voo de 1h30 para Aswan, Philae, feluca, banho no Nilo, camelo na orla e Vila Núbia (casa típica, escola núbia).
- Dia 7: saída às 4h30 para Abu Simbel (templos de Ramsés II e de Nefertari), Kom Ombo (templo da medicina).
- Dia 8: Edfu de charrete, eclusa de Esna, Templo de Luxor ao pôr do sol.
- Dia 9: Vale dos Reis, Hatshepsut, Colossos de Mêmnon, Karnak.
- Dia 10: 4 h de carro até Hurghada. Dias 11 e 12 livres (passeio de barco no Mar Vermelho é opcional da Egito Tours). Dia 13: voo de 1 h para o Cairo.
- Guia egiptólogo em português; no deserto, guias beduínos em inglês. Gorjeta obrigatória de US$ 50 por pessoa aos guias e motoristas. Entradas no interior das pirâmides e nas tumbas de Tutankhamon, Sety I e Ramsés VI são à parte, pagas só com cartão.
- Atenção: o roteiro da Vivian diz "Barco da Caravana no Mar Vermelho" incluso; na Egito Tours o barco é opcional. Confirmar.

## 11. O gibi (responsável: Claude)

- `app/gibi.html`: gibi de papel para folhear com o dedo (a página acompanha o dedo e vira pela lombada, com som de papel). A página do Dia 1 tem os três enigmas por cima dos quadros; cada acerto carimba DECIFRADO e acende uma parte do símbolo; a contracapa libera "Abrir o mapa da jornada".
- Páginas em `app/img/gibi/`, montadas por `tools/egito/gibi-paginas.py` a partir das artes da Vivian (referencias/comics). O nome antigo "Caravanegita" saiu: capa provisória é a página "As Aventuras da Caravana do Céu"; o cabeçalho do Dia 1 foi cortado; as duas legendas com o nome foram reletradas ("DA CARAVANA...", "A VIAJANTE ENCONTRA UM MAPA ANTIGO.") com PT Sans Narrow Bold (via npm @fontsource/pt-sans-narrow; caminho da fonte é o 1º argumento do script).
- Artes novas geradas no Canva (15/10/2026), esperando liberar o download (a rede da sessão bloqueia media.canva.com e www.canva.com): capa com o título "O SEGREDO DO VELHO MUNDO" (MAHYHXTc7tc), capa sem texto (MAHYHeFAdQ8), página da chegada ao Cairo (MAHYHT59mQE), página de Gizé (MAHYHe_rP2I).
- Prova publicada: https://claude.ai/artifact/GNTPTDfC7LajguksZ9pgB3

## 12. Banco de fotos da Vivian (Vale dos Reis e Abu Simbel)
- Originais em `referencias/fotos-vivian/` (nomes descritivos); versões webp em `app/img/fundo-*.webp` e `app/img/textura-estrelas.webp`.
- Em uso: céu de Nut (fundo do app), teto de estrelas (barra do topo e menu), teto dourado (entrada do oráculo), teto astronômico (pergunta ao oráculo), Nut com a barca (barca de Amon), procissão de Anúbis (pesagem do coração), cartucho do rei e colunas de hieróglifos (escriba), Livro das Portas (gibi).
- Guardadas para usar: Nut com o sol, Ápis sob o céu, barca de Rá com a serpente Mehen, sacerdote com pele de leopardo, serpente entre hieróglifos, asas de Nut com serpente, e a foto da Vivian olhando a parede (referência para o explorador em segunda pessoa; não usar como fundo).
- Fotos com gente não viram fundo.
- Paleta tirada das fotos (out/2026): azul-lápis #1C2230 dos tetos, ouro #D4A84F das estrelas, vermelho-ocre #8E3B24, azul-cinza de Dendera #5E7A8A, calcário #E8D9BA. Regra da Vivian: nenhum fundo chapado ou "de celular"; quadros, botões e etiquetas usam `textura-calcario*.webp` (relevo real de Dendera) e o selecionado usa `textura-lapis.webp`.
- Cada aba tem sua parede (`html[data-tab]` no tema): Roteiro céu de Nut, Passaporte janela de Abu Simbel, Saberes zodíaco de Dendera, Explorador colunas de Hathor, Maleta serpente vermelha, Mapa Nut de Dendera, Chat colar de Hathor, Câmbio Ísis entronizada, Tradutor "lâmpada" de Dendera.
- Out/2026 (pedido da Vivian): tudo realista, estilo Indiana Jones/Tomb Raider, priorizando fotos tiradas de frente (não em perspectiva).
  - Cartucho do escriba: foto real dos dois cartuchos vazios de Dendera (`img/parede-cartuchos.webp`); o nome é entalhado em canvas (relevo afundado: figura preenchida, sombra em cima, luz embaixo, traços internos), com lascas e cinzel. Nome longo continua no segundo cartucho (nome de trono e de nascimento).
  - Oráculo de Amon refeito: entrada no escuro total com a parede rachada de Abu Simbel revelada pela tocha (o dedo); quando metade foi iluminada a parede cede e a câmera entra pela fenda. Pergunta sob o teto astronômico, barca do deus de cabeça de carneiro (foto do Vale dos Reis) que avança (sim) ou recua (não), balança de ouro com os sinais do coração e da pena. Sem caixas amarelas nem sombras de quadrinho.
  - Cabeçalho e menu do app: marrom escuro fixo (#24180F) com filete dourado. Moeda sem sombra.
  - Passaporte, tradutor e câmbio: papel de gibi envelhecido (`img/fundo-papel-gibi.webp`, gerado com manchas, fibra, oxidação e borda queimada).
  - Gibi: página ocupa o livro todo, sem margem clara nem pilha de folhas.
- Página inicial (out/2026): estética de cartografia antiga, CLARA (pergaminho `img/fundo-pergaminho.webp`, nada escuro), menos poluída. O mapa da rota da Vivian (`img/mapa-mundo.webp`, original em `referencias/mapa-game/mapa-antigo-rota.png`) é o mapa-mundo estilo videogame: o boneco do explorador da pessoa fica na parada do dia (PARADAS em `tools/egito/mapa-mundo.py`), caminha da última parada vista até a de hoje, e as paradas já visitadas ganham anel vermelho. Antes de embarcar ele espera no Cairo com o balão "Partida em N dias". Tocar numa parada abre o primeiro dia dela.
- Out/2026, decisões da Vivian:
  - Fundos aprovados (fotos dela): 1 Abu Simbel fenda, 2 Vale dos Reis livro, 3 estrelas amarelas, 4 procissão com porta dourada, 5 cobras e colunas vermelhas, 8 teto azul de Dendera, 10 canto de Dendera com Nut. Em uso: Explorador 4, Maleta 5, Mapa 8, Chat 2, gibi 3, oráculo (entrada 1, pergunta 10). Saberes: papel limpo (o zodíaco era poluído).
  - Tela de carregar: cópia fiel da textura da Índia (`img/bilhete-textura.jpg`), só com os tons trocados para marrom (`img/veu-*.jpg`, 4 opções; em uso provisório `veu-cafe.jpg`).
  - Abertura de cada dia: a foto escurecida e borrada saiu; fica a mesma pedra marrom da tela de carregar até ela escolher uma imagem realista.
  - Oráculo: SEM sim ou não. Como os planetas e o I Ching, a barca sorteia um deus e a leitura é uma mensagem (ORACULO.mensagens) + hora da noite + amuleto + palavras de poder.
  - Explorador egípcio (`tools/egito/explorador-egito.py`): nemes, colar usekh, pingente ankh, ankh, escaravelho, pincel, bússola, gato de Bastet; saíram do menu as peças só da Índia. Títulos egípcios e Diário de escavação com achados e enigmas por lugar (`tools/egito/escavacao.py`); cartucho do escriba abre pelo Explorador.
- Out/2026: tela de carregar só com o símbolo da caravana (`img/simbolo-dourado.png`); a moeda do Egito fica só na página inicial. Botões limpos (areia lisa, fio marrom), sem textura de papiro. Explorador claro (procissão dourada bem suave). Explorador desenhado como figura de papiro (`tools/egito/js/boneco-papiro.js`): cabeça de perfil com olho de kohl, coroas (nemes, khepresh, dupla, Hathor), perucas, trajes, animais sagrados, cenários e personagens prontos (Cleópatra, Ramsés, Tutankhamon, sacerdote, sacerdotisa de Hathor, escriba). Mapa-mundo estilo videogame (`tools/egito/js/mapa-mundo.js`): trilha de pontinhos que acendem, fases com o selo do lugar e bandeira quando feitas, placa "Fase N de 7", explorador andando pela trilha.
- Cuidado ao editar o tema por regex: uma troca cortou uma regra @media e desligou todo o CSS depois dela. Conferir as chaves depois de mexer.
- Mapa-mundo pintado por código (out/2026), porque o download do Canva está bloqueado: `tools/egito/mapa-jogo.py` gera `img/mapa-jogo.webp` (relevo com luz, água com espuma, vale verde do Nilo, nuvens nas bordas, Cairo, Gizé, Deserto Branco, Aswan/Philae, Abu Simbel, Luxor/Karnak, Hurghada) e `dados/mapa-jogo.json` com paradas e trilha, que viram as constantes de `tools/egito/js/mapa-mundo.js`.
- Oráculo (out/2026, escolha da Vivian: opções 1 e 3): entrada com a tocha + pergunta + SENET (tabuleiro de 30 casas, começa na casa 15, 4 lançamentos dos 4 bastões; casa 27 devolve à 15; casas 15 e 26–30 com textos próprios, 16–25 com um deus guardião) + amuleto da casa + bolsa de linho com 3 amuletos (o que veio, o que é, o que vem). Sem data, sem sim/não, pode jogar quando quiser.
- Mapa da página inicial (out/2026, pedido da Vivian: 'exatamente igual'): a arte 'a rota da Caravana' do material da viagem, recortada do print (`img/mapa-rota.webp`, original em `referencias/mapa-game/mapa-rota-caravana-pdf.png`). Por cima só anéis nos pontos já desenhados, pontinhos dourados no caminho feito, bandeiras, placa da fase e o explorador. O mapa pintado por código (`mapa-jogo.webp`) ficou guardado sem uso.
- Símbolos egípcios (out/2026): sinais da fonte livre Noto Sans Egyptian Hieroglyphs (lista SIMBOLOS_EG em `tools/egito/simbolos.py`). No mural da pedra cada mensagem leva dois sinais gravados; no resto do app aparecem sem explicação no canto dos quadros e num friso no fim de cada página. Não copiar os desenhos das referências do Etsy/Shutterstock (são de terceiros).
- Mensageiro do Nilo (out/2026): o pombo-correio virou papiro lacrado levado por felucca (`tools/egito/mensageiro-nilo.py`), aba 'Nilo' no menu, presentes egípcios (lótus, lamparina, chá de hibisco, tâmaras, incenso, pena de Maat, sistro, ankh, escaravelho, olho de Hórus, abraço, coração). Nota: pombos-correio só chegaram ao Egito na Idade Média.
- Maleta (out/2026, `tools/egito/maleta-egito.py`): filtros e câmeras com nomes do Egito (Cairo 35, Khalili 400, Luxor 600, Super 8 do Nilo, Burton 1922 = câmera de placa de vidro de Harry Burton, Cairo 1955; filtro 'Placa de vidro 1922'), cidades do roteiro na legenda, etiquetas de viagem (Cairo, Aswan · Nilo, Luxor) na tampa, fundo de papiro. Etiquetas genéricas de cidade, sem marca de hotel real.

## Etiquetas de viagem e câmera do celular (out/2026)
- 8 etiquetas envelhecidas (Cairo, Gizé, Deserto Branco, Aswan, Abu Simbel, Luxor, Hurghada, selo do correio): SVGs em `tools/egito/adesivos/`, envelhecidas por `tools/egito/envelhecer-adesivos.py` em `app/img/adesivos/*.webp`. Desenhos genéricos, sem copiar etiquetas de terceiros nem marcas de hotel.
- Elas ficam coladas na tampa da maleta (perspectiva + luz da foto) e viram a categoria "Etiquetas do Egito" no estúdio.
- `tools/egito/estudio-egito.py` troca a Índia pelo Egito no estúdio e na câmera: carimbos de tinta e redondos, selos "EGITO · 2027", textos, foto de exemplo dos filtros (Luxor). O Shiva saiu do "Meu explorador".
- Ainda falta trocar o conteúdo grande da Índia: deuses-guardiões, ensinamentos, cobras e escadas, conversor de rúpias, carta final e textos da IA.
- A maleta ficou SEM etiquetas na tampa (a Vivian achou feio); as etiquetas ficam só no estúdio.
- Burton 1922 (out/2026): o corpo virou a traseira de uma câmera de campo de placa de vidro, gerada por `tools/egito/camera-burton.py`. Ela tem moldura de mogno (madeira da foto real antiga, guardada em `referencias/cameras/campo-corpo-armario.jpg`), vidro fosco grande com as linhas dos terços, molas e cantoneiras de latão, o pano preto de focar caído por cima e a pera de borracha do obturador como botão de foto.
- Etiqueta do Deserto Branco refeita (as rochas-cogumelo pareciam outra coisa): noite azul com lua, dunas brancas, tenda e fogueira.
- Mapa da página inicial: a borda de cima agora tem o mesmo rasgo fino e a mesma queimadura marrom da borda de baixo (`recortar-mapa-rota.py`). Saiu também o símbolo branco solto no rio.
- Fundo do app (out/2026): a textura da camada "areia" do PSD "cima" da Vivian, em pé e no tom de areia (`tools/egito/fundo-areia.py` → `img/fundo-areia.webp`). Ela entra no lugar do papiro escuro em todas as abas que usavam o papiro e na bolsa do oráculo.
- Oráculo (out/2026): o Senet saiu e entrou a Roda dos 12 Deuses, na estrutura do Oráculo dos Planetas do app da Índia.
  - Os 12 deuses ficam em medalhões num anel de bronze, em volta do disco do teto de Dendera (foto da Vivian, `tools/egito/roda-centro.py` → `img/roda-centro.webp`).
  - A roda gira devagar. A pessoa segura o botão, a roda acelera e a luz pula de deus em deus com vibração e um "tim". Ao soltar, a roda freia, para num deus e ele sobe para o alto.
  - Depois vêm a leitura do deus, o amuleto dele e a bolsa de três amuletos.
  - A tela da roda também fica sobre o fundo de areia, com os textos escuros.

## Limpeza da Índia (out/2026, `tools/egito/sem-india.py`)
Tudo seguindo o roteiro oficial (`app/dados/travessia.json`, 8 a 20/10/2027). Pode rodar de novo.
- **Guardiões**: os 12 deuses do Egito (Rá, Thoth, Ísis, Osíris, Hórus, Anúbis, Hathor, Maat, Ptah, Amon, Sobek, Imhotep).
  - Cada um tem 3 cartas e o lugar do roteiro onde a pessoa vai encontrá-lo.
  - No lugar do mantra, cada um tem as palavras de poder "Dua …" (louvor), as mesmas do oráculo.
  - O sorteio usa os 12 deuses. A passagem (`embarque.html`) e a lista de passagens também foram trocadas.
- **Palavras de poder do dia**: entram no lugar dos mantras hindus do livreto. São frases egípcias de verdade, uma por dia (Em hotep, Ankh udja seneb, Dua netjer, Nut, Kheper, Hino ao Nilo, Nefertari, Udjat, coração do Livro dos Mortos, Uadj-ur, Sekhet Iaru, Seankh ren, Ankh djet neheh), com hieróglifos.
  - **A confirmar com a Vivian**: se ela tiver um livreto do Egito, os textos dele substituem estes.
- **Perguntas do diário**: uma por dia do roteiro.
- **Carta final**: rascunho novo. "Diário de bordo · Egito, 20 de outubro de 2027". Os textos que a IA escreve ganharam a rota do Egito.
- **Cópia sem internet**: "Travessia do Velho Mundo · 8 a 20 out 2027".
- **Mural da caravana**: Cairo, Deserto Branco, Aswan, Abu Simbel, Luxor e Hurghada.
- **Retrato da caravana**: os cenários são as aberturas do Egito, cada um liberado pelo selo da cidade.
- **Jogo**: "Escadas de Maat", em que as virtudes de Maat sobem e Apófis derruba. A casa 100 é o Campo de Juncos. O Chaupar (jogo da Índia) saiu da lista, mas o código continua.
- **Conversor**: libra egípcia (EGP), com a dica de negociar no Khan el-Khalili.
- **Figurinhas do chat**: o bonequinho vestido de Rá, Faraó, Ísis, Hathor, Osíris, Amon, Maat, Ptah, Imhotep e Nefertari. Mudaram os nomes de "Chai" (agora Karkadé) e de "Namaste" (agora Shukran).
- **O que ainda fala da Índia de propósito ou é código parado**:
  - A medalha "Índia Sagrada 2026" (de quem foi na viagem da Índia) é de propósito.
  - O Oráculo dos Planetas (GRAHAS) é código parado.
  - Sobram ainda comentários de código.
  - O endereço do site em `passagens.html` (BASE) ainda é o da Índia: trocar quando houver o site do Egito.

## App dentro do Claude (out/2026)
- Página privada da Vivian: https://claude.ai/artifact/ET3RYJJd67HwEF7MTDiNHu
  - Página: `app/caravana-do-ceu.html`, mais as imagens, deuses, selos, dados, oráculo, gibi e hieróglifos como arquivos de apoio (256 arquivos, publicados em duas levas).
  - Capacidades: db, user (com nome), assets (viajantes podem subir fotos), room, downloads e sample (cartas da IA).
- O banco foi preenchido com `tools/site/seed.json` (6 cidades, 15 locais, 64 saberes e o rascunho da carta final).
- Para atualizar, publicar o mesmo arquivo de novo. Isso não gasta créditos da Netlify.
- Fundo único: o fundo de areia do passaporte vale para todas as abas (não muda ao trocar de aba).
- Fundo de areia mais claro e com menos contraste; folha de dados do passaporte com relevo suave e rótulos escuros (pedido da Vivian: difícil de ler).
- Tom do fundo escolhido: opção 2 (areia bem clara, cor 236/220/188, contraste .5).
- Centro da Roda dos 12 Deuses: agora é a porta da tumba do Vale dos Reis (foto da Vivian, `fundo-porta-dourada`), de frente. O disco de Dendera saiu porque ficava deitado. Quando a pessoa chega, a parede sai do escuro e avança devagar para a porta, com tocha tremulando, luz dourada saindo da passagem e som de pedra. Enquanto a roda gira rápido, a pedra treme.
- Templo do oráculo (roda, leitura e bolsa): fundo preto com veios de ouro (`img/bilhete-textura.jpg`, o mesmo que cobria a abertura do app da Índia), com os textos claros. O resto do app continua no fundo de areia.
- Centro da roda (atualizado): a barca do sol na noite, foto da Vivian (`referencias/fotos-vivian/barca-de-ra-noite.jpg`). O deus com cabeça de carneiro sob a serpente fica no centro, com as bordas no escuro e luz dourada atrás dele (`tools/egito/roda-centro.py`). A porta da tumba saiu.
- Mapa da página inicial: parado numa cidade, o explorador fica do lado oposto ao nome desenhado no mapa (campo `lado` em PARADAS, e = esquerda, d = direita); enquanto anda pela trilha, fica centrado.
- Página inicial: sem os símbolos (estrelas e ankh) embaixo do título e sem o balão 'Você está aqui'. Embaixo do título, um cartucho com o nome da pessoa em hieróglifos (`vCartuchoNome`). Ele mostra o que ela gravou na oficina do escriba (`cdi-cartucho`) ou, se ainda não gravou, o primeiro nome dela. Ao tocar, abre `hieroglifos.html?nome=...` já com o nome escrito.
- Anel das cidades no mapa menor e mais fino (2,9% da largura), para não cobrir a primeira letra do nome.
- Cartucho do nome (atualizado): em pé, como nas paredes, no canto de cima à esquerda da página inicial, no estilo do antigo balão (creme com contorno marrom). Sem a frase 'Grave o seu nome'. O mapa subiu para perto do título.
- Página inicial reorganizada como a da Índia: moeda de 92px, título grande, frase que gira logo abaixo do título em dourado itálico, depois o mapa com respiro; cartucho em pé no canto esquerdo.
- A frase que muda voltou para baixo do mapa, no estilo de antes. Marcas d'água atrás do título: testadas 4 opções e a Vivian não quis nenhuma.
- Fundo do título da página inicial: foto 2 da Vivian (parede com cartucho e colunas de hieróglifos, `colunas-cartucho-a.jpg`) em marrom de uma cor só (`tools/egito/fundo-titulo.py` → `img/fundo-titulo.webp`). Começa colada no cabeçalho com o cartucho inteiro e vai sumindo devagar até o mapa (degradê escolhido pela Vivian: cheio em cima, 85% a 22%, 40% a 50%, some a 92%).
- Oficina do escriba (`hieroglifos.html`): não é mais pedra. Agora é papiro pintado nas cores do Egito: moldura listrada azul, vermelha e amarela, cartucho com corda azul e filete vermelho, e cada sinal na sua tinta (`COR`), como nos quadros pintados de alfabeto. O alfabeto ganhou KH (placenta) e TH (corda). O cartucho da página inicial usa as mesmas cores e só aparece depois que a pessoa emite o passaporte.
- Cartucho no formato dos faraós: oval alongado em pé, corda dupla (azul com filete vermelho) e a barra do nó embaixo, colada e mais larga que o cartucho. Na página inicial ele tem 52px de largura.
- Cartucho (atualizado) nas cores da referência da Vivian: terracota com contorno ocre, sinais em marrom escuro, branco, ocre e verde, e a barra do nó ocre com amarração vermelha e verde. Vale para a oficina e para a página inicial.
- Cartucho: a Vivian voltou para a versão clara (papiro creme, corda azul com filete vermelho, sinais coloridos). A versão terracota e as texturas de parede foram descartadas.
- Cartucho da página inicial: pequeno (32px de largura), no canto de cima à direita.
- Oficina do escriba: ganhou 'A leitura do seu nome'. Ela junta o que cada sinal evocava para os egípcios (`SENT`: imagem e qualidade de cada sinal), qual sinal abre e qual fecha o cartucho, e explica o ren. Há uma nota avisando que é uma leitura poética, não uma previsão antiga. A lista dos sinais também mostra a qualidade de cada um.

## O Céu de Nut (out/2026, `app/ceu.html`)
- Observatório do céu de agora, no lugar onde a pessoa está (pela localização do celular; sem localização, o céu do Cairo). Funciona como os apps de céu noturno.
- **Como se usa:**
  - "Apontar para o céu" liga a bússola e o giroscópio, e o mapa acompanha o celular (no iPhone pede permissão).
  - Sem sensores, arrasta-se com o dedo.
  - "Câmera" mostra a câmera de trás por baixo do céu desenhado.
- **O que aparece (céu inteiro, como o Sky Tonight; a Vivian não queria "gato pingado"):**
  - As 5.044 estrelas até magnitude 6 (catálogo Hipparcos/HYG), com a cor e o tamanho de cada uma; as mais fortes ganham nome e a estrela egípcia de cinco pontas.
  - As linhas das 88 constelações, com nome em português. As egípcias e as do zodíaco de Dendera ficam em ouro e ganham **figuras pintadas no mesmo estilo da Nut** (`app/img/ceu/*.webp`), cada uma sobre as suas estrelas e girando com o céu: Sah (homem com cetro, pele vermelha, saiote branco, estrela sobre a cabeça), Sopdet (vaca deitada no barco com a estrela, como em Dendera), Meskhetiu (o touro com sete estrelas), Reret (hipopótamo azul de faiança), Leão, Serket (escorpião), Touro e Carneiro. As figuras saem dos próprios hieróglifos da fonte Noto (licença OFL), pintados por `tools/egito/gera-arte.py` e `pinta.py`; o escorpião foi desenhado à mão porque o hieróglifo dele não parece um escorpião.
  - A Via Láctea de verdade (cinco níveis de brilho), difusa.
  - **Nut é uma ilustração no estilo das pinturas egípcias** (`app/img/nut-ceu.svg`; a Vivian rejeitou a versão de barras retas: "quero um desenho"). Corpo laranja em arco com contorno escuro e estrelas, braços e pernas até o chão, rosto de perfil com olho de kohl e peruca azul, Rá entrando pela boca no oeste e renascendo com raios no leste. O desenho fica deitado no ponto mais alto da Via Láctea, gira com o céu, cobre cerca de 95° e é meio transparente. O nome dela em hieróglifos (𓏌𓏏𓇯). Botão "Desenhos de Nut" liga e desliga os desenhos.
  - Nomes em hieróglifos pelo céu: Rá 𓂋𓂝𓇳, Iah 𓇋𓂝𓎛𓇹, Sah 𓋴𓄿𓎛𓇼, Sopdet 𓋴𓊪𓂧𓏏𓇼.
  - O horizonte e os pontos cardeais com frases egípcias; abaixo do horizonte, o chão escuro.
  - Rá (Sol), Iah (Lua, com a fase) e os planetas com nomes egípcios. As posições vêm das fórmulas de Paul Schlyter.
  - Quando o Sol ou a Lua estão fora da tela, uma seta mostra onde estão.
  - A faixa do alto é o teto estrelado das tumbas (`img/fundo-ceu-nut-estrelas.webp`).
- Pinçar com dois dedos aproxima. Tocar num astro, numa constelação, numa estrela ou na Nut abre uma ficha em papiro (a da Nut com a foto do teto).
- **Dados:** `app/ceu-dados.js`, gerado por `tools/egito/ceu-dados.py` a partir do d3-celestial (licença BSD, Olaf Frohn). Para regerar: `npm pack d3-celestial` e rodar o script com a pasta `package/data`.
- **Onde abrir:** só na **Maleta**, no cartão do merkhet (o prumo de fio com que os sacerdotes observavam as estrelas), depois da mala de câmeras. Saiu da página inicial e dos Saberes. A janela do app libera câmera, localização e sensores para essa página.
- A Vivian não quis o botão do céu da noite no Deserto Branco: só o céu de agora.

- **Página inicial (16/10/2026):** moeda, título, grade (dias para embarcar, hora no Egito, hora de Brasília), frase que troca e mapa. A Vivian testou a grade depois do mapa e voltou para esta ordem, com estes espaçamentos (aprovado por print). A Vivian pediu para tirar o cartucho do nome da página inicial (a função `vCartuchoNome` continua no código, sem uso).
- **Página inicial menos poluída (16/10/2026):** a Vivian achou o Egito espremido perto da Índia. A parede de hieróglifos ficou mais clara e só atrás da moeda e do título; a grade virou cartões claros arredondados, sem borda, com a legenda em Poppins (como na Índia); e há mais espaço entre título, grade, frase e mapa.
- **App sambando ao rolar (18/10/2026):** corrigido com `html,body{margin:0}` (a margem padrão deixava o app 8px mais largo que a tela), sem o grão de tela inteira com mix-blend (`main::after`) e com os fundos fixos em camada própria. Não voltar a pôr efeitos de mistura ou filtros em camadas fixas de tela inteira.

## Melhorias da Índia trazidas para o Egito (28/10/2026)
- Tudo o que mudou no app da Índia de 15/10 a 28/10 (ramo `claude/great-mayer-tdew0z`) entrou no Egito por mesclagem de três vias (base = a cópia de 15/10), sem mudar o tema: o funcionamento veio da Índia e os textos do Egito ficaram.
- Câmeras: botões de cromo gasto, filmes novos na descartável (Khalili 400: Khalili, Fuji QuickSnap, Kodak FunSaver, Fuji X100V), Alien World na Quatro Tempos (4 fotos ou 1 foto), foto final pela placa de vídeo (não trava), Super 8 com foto nova, Registros com seleção de várias fotos para apagar.
- Mapa: globo do mundo (MapLibre, em `app/vendor/`), Mundo e Perto de mim com Mapa/Satélite, bonequinho que não some, botão Ligar à noite (fuso do Cairo). Perto de mim abre sozinho quando todos estão dentro do Egito.
- Missão nova "A trilha da travessia" e a vitrola da Caravana na Maleta, abaixo dos Registros. **A playlist ainda é a da Índia** (`PLAYLIST_EMBED`): trocar quando a Vivian mandar a do Egito.
- Pombo/carta com aviso de voz e envio sem sinal (guarda e manda depois), com as palavras do Egito (mensageiro do Nilo, barco, papiro; horário +03:00).
- Entrada: a palavra-chave é conferida no servidor antes de criar a conta (`netlify/functions/entrada.mjs`, precisa da FIREBASE_SA) e destrava quem ficou preso; cartões da líder que abrem e fecham; passagens refeitas com a palavra nova.
- Galeria só com álbuns (Prelúdio e cidades), curtidas e comentários (regras novas em `firestore.rules`), chat que abre na primeira não lida, saber MAEE como primeiro saber, abertura sem piscar e atualização do app que espera a pessoa terminar o que está fazendo.
- `MSG_GUARDIAO` (a mensagem de cada guardião no passo 3) ficou vazia no Egito: as da Índia eram dos deuses indianos. Sem mensagem aparece onde encontrar o guardião.
- Não entrou: o jogo da estrada (`jogo.html`, com deuses indianos) e tudo da Turma 2.
