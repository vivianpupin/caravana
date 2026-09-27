// Configuração do Firebase (projeto app-caravana-70c8a). Não é senha: é o endereço público do banco de dados.
window.CARAVANA_CONFIG = {
  lider: "vivianpupin@gmail.com",
  firebase: {
    apiKey: "AIzaSyDsbhcih3hK-j7bV6-BV-tJpVnCjnu2_1I",
    authDomain: "app-caravana-70c8a.firebaseapp.com",
    projectId: "app-caravana-70c8a",
    storageBucket: "app-caravana-70c8a.firebasestorage.app",
    messagingSenderId: "670213052301",
    appId: "1:670213052301:web:30ae61abc21a283d914fc4"
  }
};
// Login pelo próprio endereço do app: liga depois que o endereço
// https://caravanaindiaapp.netlify.app/__/auth/handler estiver cadastrado no Google Cloud (credenciais OAuth).
const LOGIN_PELO_APP = true;
if (LOGIN_PELO_APP && location.hostname === "caravanaindiaapp.netlify.app") window.CARAVANA_CONFIG.firebase.authDomain = location.host;

// Link aberto de dentro do Instagram, Facebook, WhatsApp etc.: o Google não deixa entrar por esses navegadores.
// Mostra como abrir no Safari ou no Chrome.
(function () {
  const ua = navigator.userAgent || "";
  if (!/Instagram|FBAN|FBAV|FB_IAB|FBIOS|WhatsApp|Line\/|MicroMessenger|TikTok|musical_ly|Snapchat|LinkedInApp|GSA\//i.test(ua)) return;
  window.CARAVANA_NAVEGADOR_INTERNO = true;
  const ios = /iPhone|iPad|iPod/i.test(ua);
  document.addEventListener("DOMContentLoaded", () => {
    const d = document.createElement("div");
    d.style.cssText = "position:fixed;inset:0;z-index:200;background:#F5EFE4;display:grid;place-items:center;padding:24px;font-family:Poppins,system-ui,sans-serif;color:#3B2A1C;text-align:center";
    d.innerHTML = '<div style="max-width:360px;display:flex;flex-direction:column;gap:14px;align-items:center">' +
      '<img src="img/simbolo-marrom.png" alt="" style="width:60px">' +
      '<h1 style="font-family:Cinzel,Georgia,serif;font-weight:500;font-size:22px;margin:0">Abra no ' + (ios ? "Safari" : "Chrome") + '</h1>' +
      '<p style="margin:0;font-size:15px;line-height:1.55">Este link abriu dentro de outro aplicativo, e por aqui o Google não deixa entrar na conta.</p>' +
      '<p style="margin:0;font-size:15px;line-height:1.55">' + (ios ? "Toque nos três pontinhos ou no ícone de compartilhar e escolha <b>Abrir no Safari</b>." : "Toque nos três pontinhos no canto de cima e escolha <b>Abrir no Chrome</b> (ou no navegador).") + '</p>' +
      '<button type="button" style="border:0;border-radius:999px;padding:13px 22px;font:600 15px Poppins,system-ui,sans-serif;background:#3F4938;color:#F6EDDA">Copiar o link</button>' +
      '<p class="ok" style="margin:0;font-size:13px;color:#3F4938;min-height:1em"></p></div>';
    d.querySelector("button").onclick = () => { const l = location.origin + "/"; (navigator.clipboard ? navigator.clipboard.writeText(l) : Promise.reject()).then(() => { d.querySelector(".ok").textContent = "Link copiado. Cole no " + (ios ? "Safari" : "Chrome") + "."; }, () => { d.querySelector(".ok").textContent = l; }); };
    document.body.append(d);
  });
})();
