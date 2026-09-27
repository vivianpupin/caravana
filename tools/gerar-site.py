"""Gera app/index.html (versão do site, fora do Claude) a partir de app/caravana-do-ceu.html.
O shim (tools/site/shim.js) é empacotado em app/shim.js com:
  npx esbuild tools/site/shim.js --bundle --minify --format=iife --loader:.json=json --outfile=app/shim.js
"""
import pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
app = (raiz / "app" / "caravana-do-ceu.html").read_text(encoding="utf-8")
head = """<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2E2116">
<meta name="description" content="O aplicativo da Caravana do Céu · Travessia da Índia Sagrada 2026">
<link rel="icon" href="img/icone-192.png">
<link rel="apple-touch-icon" href="img/icone-192.png">
<link rel="manifest" href="manifest.webmanifest">
<script src="config.js"></script>
<script src="shim.js"></script>
<style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;height:100%}</style>
</head><body>
"""
tail = """
<script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});</script>
</body></html>
"""
(raiz / "app" / "index.html").write_text(head + app + tail, encoding="utf-8")
print("app/index.html gerado")
