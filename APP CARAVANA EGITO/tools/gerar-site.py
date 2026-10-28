"""Gera app/index.html (versão do site, fora do Claude) a partir de app/caravana-do-ceu.html.
O shim (tools/site/shim.js) é empacotado em app/shim.js com:
  npx esbuild tools/site/shim.js --bundle --minify --format=iife --loader:.json=json --outfile=app/shim.js
"""
import pathlib, datetime
raiz = pathlib.Path(__file__).resolve().parent.parent
app = (raiz / "app" / "caravana-do-ceu.html").read_text(encoding="utf-8")
head = """<!doctype html>
<html lang="pt-BR" class="abrindo"><head>
<meta charset="utf-8">
<!-- a tela já nasce escura, da cor da abertura: antes ficava branca enquanto o app baixava e depois escurecia (piscava ao tocar no ícone) -->
<style>html.abrindo,html.abrindo body{background:#1E140C}</style>
<link rel="preload" as="image" href="img/veu-cafe.jpg">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#24180F">
<meta name="description" content="O aplicativo da Caravana do Céu · Travessia do Velho Mundo · Egito 2027">
<link rel="icon" href="img/icone-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/img/icone-180.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<script>window.__VERSAO = "%s";</script>
<script src="config.js"></script>
<script src="shim.js"></script>
<style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;height:100%}
/* véu de abertura: cobre o app nos primeiros instantes, enquanto ele decide o que mostrar (boas-vindas, abertura do dia, permissões, cartas);
   assim nenhuma tela aparece "por cima" do app já aberto, nada pisca */
#veu{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:#1E140C url(img/veu-cafe.jpg) center/cover;transition:opacity .45s ease}
#veu img{width:58px;opacity:.9}
#veu.sai{opacity:0;pointer-events:none}
</style>
</head><body>
<div id="veu" aria-hidden="true"><img src="img/simbolo-dourado.png" alt=""></div>
<script>
// tira o véu quando o app já abriu e as telas de início (boas-vindas, abertura, avisos) já tiveram tempo de entrar; nunca fica mais de 6 s
(function () {
  let foi = false; const t0 = Date.now();
  window.__tiraVeu = function () { if (foi) return; foi = true; document.documentElement.classList.remove("abrindo"); const v = document.getElementById("veu"); if (!v) return; v.classList.add("sai"); setTimeout(function () { v.remove(); }, 500); };
  window.__veuPronto = function () { setTimeout(window.__tiraVeu, Math.max(1300, 2000 - (Date.now() - t0))); };
  setTimeout(window.__tiraVeu, 6000);
})();
</script>
"""
tail = """
<script>
// recarrega para a versão nova sem perder o que a pessoa está fazendo: espera terminar de escrever, de filmar ou de enviar,
// e no máximo uma vez por versão (com wi-fi fraco a página nova pode não chegar a tempo, e ficava recarregando sem parar)
window.__recarrega = function (v) {
  try { if (v && sessionStorage.getItem("cdi-recarregou") === v) return; } catch (e) {}
  // com o app na tela, a versão nova entra quando a pessoa sair do app (antes recarregava no meio do uso, a tela piscava e voltava para o começo)
  if (!document.hidden) {
    if (!window.__recarrega.esperando) {
      window.__recarrega.esperando = true;
      document.addEventListener("visibilitychange", function sai() { if (!document.hidden) return; document.removeEventListener("visibilitychange", sai); window.__recarrega.esperando = false; window.__recarrega(v); });
    }
    return;
  }
  const ocupado = () => {
    // escolhendo foto na galeria, filmando ou enviando: espera mesmo com a tela escondida (no iPhone a galeria esconde o app)
    if (window.__ocupado && window.__ocupado()) return true;
    // texto começado (chat, pombo, carta) ou uma janela aberta: não perde nada, espera a pessoa terminar
    const a = document.activeElement;
    if (a && (a.isContentEditable ? (a.textContent || "").trim() : /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.type !== "file" && String(a.value || "").trim())) return true;
    if (document.querySelector(".sheet")) return true;
    if (document.hidden) return false;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return true;
    return !!(window.__ocupado && window.__ocupado());
  };
  if (ocupado()) { clearTimeout(window.__recarrega.t); window.__recarrega.t = setTimeout(function () { window.__recarrega(v); }, 4000); return; }
  try { if (v) sessionStorage.setItem("cdi-recarregou", v); } catch (e) {}
  location.reload();
};
if ("serviceWorker" in navigator) {
  // procura versão nova sempre que o app abre ou volta para a tela, e recarrega sozinho quando chega
  const tinha = !!navigator.serviceWorker.controller; let recarregou = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (tinha && !recarregou) { recarregou = true; window.__recarrega(""); } });
  navigator.serviceWorker.register("sw.js").then(r => { r.update(); navigator.serviceWorker.ready.then(g => g.active && g.active.postMessage("completa")).catch(() => {}); document.addEventListener("visibilitychange", () => { if (!document.hidden) r.update().catch(() => {}); }); }).catch(() => {});
}
// o iPhone às vezes volta para o app sem recarregar: confere a versão publicada e recarrega se mudou
(function () {
  let checando = false;
  const confere = () => {
    if (checando || document.hidden) return; checando = true;
    fetch("versao.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null)
      .then(j => { if (j && j.v && j.v !== window.__VERSAO) window.__recarrega(j.v); })
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
_arqs = ["index.html", "shim.js", "config.js", "manifest.webmanifest", "oraculo.html", "oraculo-dados.js", "hieroglifos.html", "gibi.html", "ceu.html", "ceu-dados.js"] + sorted(
    str(f.relative_to(_app)) for pasta in ("img", "dados", "deuses", "insignias") for f in (_app / pasta).rglob("*")
    if f.is_file() and "-antiga" not in f.name and not f.name.startswith("."))
_marca = hashlib.sha1(b"".join((_app / a).read_bytes() for a in _arqs if a != "index.html")).hexdigest()[:10]
_sw = (_app / "sw.js").read_text(encoding="utf-8")
_sw = _re.sub(r"/\*ARQUIVOS\*/.*?/\*FIM\*/", lambda m: "/*ARQUIVOS*/" + _json.dumps(_arqs) + "/*FIM*/", _sw, flags=_re.S)
_marcas = {a: hashlib.sha1((_app / a).read_bytes()).hexdigest()[:10] for a in _arqs if a != "index.html"}
_sw = _re.sub(r"/\*MARCAS\*/.*?/\*FIMM\*/", lambda m: "/*MARCAS*/" + _json.dumps(_marcas) + "/*FIMM*/", _sw, flags=_re.S)
_sw = _re.sub(r"^// marca: .*\n", "", _sw, flags=_re.M)
(_app / "sw.js").write_text("// marca: " + _marca + "\n" + _sw, encoding="utf-8")
print("app/index.html gerado")
