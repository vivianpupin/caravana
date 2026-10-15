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
