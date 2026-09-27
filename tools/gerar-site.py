"""Gera app/index.html (versão do site, fora do Claude) a partir de app/caravana-do-ceu.html.
O shim (tools/site/shim.js) é empacotado em app/shim.js com:
  npx esbuild tools/site/shim.js --bundle --minify --format=iife --loader:.json=json --outfile=app/shim.js
"""
import pathlib, datetime
raiz = pathlib.Path(__file__).resolve().parent.parent
app = (raiz / "app" / "caravana-do-ceu.html").read_text(encoding="utf-8")
head = """<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#2E2116">
<meta name="description" content="O aplicativo da Caravana do Céu · Travessia da Índia Sagrada 2026">
<link rel="icon" href="img/icone-192.png">
<link rel="apple-touch-icon" href="img/icone-192.png">
<link rel="manifest" href="manifest.webmanifest">
<script>window.__VERSAO = "%s";</script>
<script src="config.js"></script>
<script src="shim.js"></script>
<style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;height:100%}</style>
</head><body>
"""
tail = """
<script>
if ("serviceWorker" in navigator) {
  // procura versão nova sempre que o app abre ou volta para a tela, e recarrega sozinho quando chega
  const tinha = !!navigator.serviceWorker.controller; let recarregou = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (tinha && !recarregou) { recarregou = true; location.reload(); } });
  navigator.serviceWorker.register("sw.js").then(r => { r.update(); document.addEventListener("visibilitychange", () => { if (!document.hidden) r.update().catch(() => {}); }); }).catch(() => {});
}
// o iPhone às vezes volta para o app sem recarregar: confere a versão publicada e recarrega se mudou
(function () {
  let checando = false;
  const confere = () => {
    if (checando || document.hidden) return; checando = true;
    fetch("versao.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null)
      .then(j => { if (j && j.v && j.v !== window.__VERSAO) location.reload(); })
      .catch(() => {}).finally(() => { checando = false; });
  };
  document.addEventListener("visibilitychange", confere);
  window.addEventListener("pageshow", confere);
  window.addEventListener("focus", confere);
  setInterval(confere, 5 * 60 * 1000);
})();
</script>
</body></html>
"""
versao = (datetime.datetime.utcnow() - datetime.timedelta(hours=3)).strftime("%d/%m · %H:%M")
(raiz / "app" / "index.html").write_text(head.replace("%s", versao) + app + tail, encoding="utf-8")
(raiz / "app" / "versao.json").write_text('{"v": "%s"}\n' % versao, encoding="utf-8")
# lista de tudo que o celular guarda para abrir sem internet (sw.js); a marca muda quando alguma imagem ou dado muda
import hashlib, json as _json, re as _re
_app = raiz / "app"
_arqs = ["index.html", "shim.js", "config.js", "manifest.webmanifest"] + sorted(
    str(f.relative_to(_app)) for pasta in ("img", "dados", "deuses", "insignias") for f in (_app / pasta).rglob("*")
    if f.is_file() and "-antiga" not in f.name and not f.name.startswith("."))
_marca = hashlib.sha1(b"".join((_app / a).read_bytes() for a in _arqs if a != "index.html")).hexdigest()[:10]
_sw = (_app / "sw.js").read_text(encoding="utf-8")
_sw = _re.sub(r"/\*ARQUIVOS\*/.*?/\*FIM\*/", lambda m: "/*ARQUIVOS*/" + _json.dumps(_arqs) + "/*FIM*/", _sw, flags=_re.S)
_sw = _re.sub(r"^// marca: .*\n", "", _sw, flags=_re.M)
(_app / "sw.js").write_text("// marca: " + _marca + "\n" + _sw, encoding="utf-8")
print("app/index.html gerado")
