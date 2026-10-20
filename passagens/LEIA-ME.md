# Achado de Passagens

App para achar as passagens mais baratas: você escolhe a cidade de saída e o mês (ou as datas exatas), e ele mostra os destinos mais baratos. Ao tocar num destino, abre o calendário do mês com o menor preço de cada dia e os botões para comprar ou comparar no Google Voos, na Decolar e no Skyscanner.

Os preços vêm do Travelpayouts (dados da Aviasales): são as menores tarifas que os viajantes encontraram nos últimos dias. Por isso podem mudar até a hora da compra, e o valor final sempre se confere no site antes de pagar.

Enquanto a chave não estiver no Netlify, o app mostra **preços de exemplo** (com um aviso amarelo no topo).

## Separado dos apps da Caravana

- Site próprio no Netlify, com a pasta `passagens` como "Base directory".
- Só publica quando a mensagem do commit tiver `[publicar-passagens]` (e só quando a Vivian disser "publica"). O `[publicar]` e o `[publicar-turma2]` não publicam este site.

## O que falta fazer (só a Vivian consegue, com a conta dela)

1. **Travelpayouts**: no painel, ir em Perfil → **API token** e copiar o código (32 letras e números).
2. **Netlify (site novo)**
   - Add new site → Import an existing project → GitHub → `vivianpupin/caravana`.
   - **Base directory: `passagens`** (o resto o `netlify.toml` desta pasta já preenche).
   - Site configuration → Environment variables → `TRAVELPAYOUTS_TOKEN` = o API token.
   - (Opcional) `TRAVELPAYOUTS_MARKER` = o número de parceiro do Travelpayouts, para as compras pelo botão "Ver esta tarifa e comprar" renderem comissão.
3. Pedir para publicar com `[publicar-passagens]`.
