# APP CARAVANA ÍNDIA · TURMA 2

Cópia do app da Caravana do Céu · Travessia da Índia Sagrada (Turma 1), feita em 20/10/2026 para a Turma 2 (18 a 30 de novembro de 2026).

O app é o mesmo. O que mudou para a Turma 2:

- Datas: 18 a 30 de novembro (contagem regressiva, abertura de cada dia, carimbos do passaporte, carta final, mensagem do diário).
- Ordem da viagem: Delhi → Agra → **Varanasi → Jaipur** → Rishikesh → Delhi (na Turma 1, Jaipur vinha antes de Varanasi).
  - Dia 3: trem Vande Bharat de Agra para Varanasi. Dias 3 a 5 em Varanasi.
  - Dia 6: voo de Varanasi para Jaipur. Dias 6 e 7 em Jaipur, no hotel Narain Niwas.
  - Dia 8: voo de Jaipur para Dehradun (Rishikesh).
- Selos, guardiões e frases de abertura passaram para os dias novos.
- O Diwali (8/11) fica fora: a Turma 2 chega depois. O selo do Diwali saiu (agora são 16 carimbos) e os textos que falavam dele foram ajustados.
- O roteiro do app (`app/dados/travessia.json`) segue o roteiro da staff da Turma 2, na versão para os viajantes.

## Separado da Turma 1

- **Banco de dados próprio**: um projeto novo no Firebase. Nada da Turma 1 (viajantes, chat, mural, fotos) aparece aqui, e nada daqui vai para lá.
- **Site próprio**: um site novo no Netlify, `caravanaindiaturma2.netlify.app`.
- **Publicação própria**: este site só publica quando a mensagem do commit tiver `[publicar-turma2]`. O `[publicar]` continua publicando só o site da Turma 1.

## O que falta fazer (só a Vivian consegue, com a conta dela)

1. **Firebase (banco de dados)**
   - console.firebase.google.com → Adicionar projeto (ex.: `app-caravana-turma2`).
   - Authentication → Começar → ativar o login com **Google**.
   - Firestore Database → Criar banco de dados → Regras → colar o arquivo `firestore.rules` desta pasta → Publicar.
   - Configurações do projeto → Seus apps → adicionar um app **Web** → copiar o bloco `firebaseConfig` e mandar para o Claude (ele cola no `app/config.js` e troca o `COLE_AQUI` do `netlify.toml`).
   - Authentication → Configurações → Domínios autorizados → adicionar `caravanaindiaturma2.netlify.app`.
   - Para as notificações e a carta final: Configurações do projeto → Contas de serviço → Gerar nova chave privada (um arquivo .json).
2. **Netlify (site)**
   - Add new site → Import an existing project → GitHub → `vivianpupin/caravana`.
   - Site name: `caravanaindiaturma2`.
   - **Base directory: `india-turma2`** (o resto o `netlify.toml` desta pasta já preenche).
   - Site configuration → Environment variables → `FIREBASE_SA` = o conteúdo inteiro do .json da conta de serviço.
3. **Login pelo endereço do app (iPhone)**: no Google Cloud do projeto novo, em APIs e serviços → Credenciais → cliente OAuth da Web, adicionar `https://caravanaindiaturma2.netlify.app/__/auth/handler` em "URIs de redirecionamento autorizados".
4. Abrir o app com a conta da líder e **criar a palavra da caravana**. Na primeira entrada da líder, o app copia sozinho as cidades, os selos, os saberes e a carta final para o banco novo.
5. Gerar as passagens da Turma 2 em `caravanaindiaturma2.netlify.app/passagens.html`.

Enquanto o passo 1 não estiver feito, o app mostra "O aplicativo está sendo configurado".

## Como atualizar

- O app é editado em `app/caravana-do-ceu.html`; depois roda `python3 tools/gerar-site.py` (dentro desta pasta) para gerar o `app/index.html`.
- Os dados que entram no banco na primeira vez estão em `tools/site/seed.json` (e embutidos no `app/shim.js`).
