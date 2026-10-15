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
