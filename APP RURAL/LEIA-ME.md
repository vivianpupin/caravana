# Sobrevoo Rural (rascunho)

App separado da Caravana, no estilo do Inteligência Rural: mostra o imóvel rural em 3D com imagem de satélite, a divisa em vermelho e o que tem em volta.

O que já faz:
- Abre num imóvel de exemplo em Carrancas (MG).
- Busca por cidade/endereço ou coordenadas (ex.: -21.50, -44.62).
- Desenhar a divisa tocando nos cantos, ou importar um .kml (Google Earth) ou .geojson.
- Calcula área (ha), perímetro, altitude média e desnível.
- Mostra curso d'água, estrada e rede elétrica mais próximos (OpenStreetMap).
- Sobrevoo 3D automático e gravação de vídeo vertical (1080×1920) para Reels.

Fontes (gratuitas, sem chave): imagem Esri World Imagery, relevo AWS Terrain Tiles, mapa OpenStreetMap (Nominatim e Overpass).

Esta pasta NÃO é publicada pelo Netlify da Caravana (ele só publica a pasta `app` da raiz).
Para testar no computador: `cd "APP RURAL/app" && python3 -m http.server` e abrir http://localhost:8000.
