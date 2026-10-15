// ---------- Mapa-mundo da travessia, estilo mapa de videogame ----------
// Sobre o mapa antigo da rota: uma trilha de pontinhos que acendem conforme a viagem avança, cada parada é uma "fase"
// com o selo do lugar, e o explorador da pessoa anda pela trilha da última parada vista até a de hoje.
const PARADAS = [
  { n: 1, c: "Cairo", x: 851, y: 192, dias: [1, 2, 3], selo: "cairo" }, { n: 2, c: "Deserto Branco", x: 480, y: 407, dias: [4, 5], selo: "deserto-branco" },
  { n: 3, c: "Aswan", x: 746, y: 720, dias: [6], selo: "aswan" }, { n: 4, c: "Abu Simbel", x: 828, y: 887, dias: [7], selo: "abu-simbel" },
  { n: 5, c: "Luxor", x: 955, y: 598, dias: [8, 9], selo: "luxor" }, { n: 6, c: "Hurghada", x: 1066, y: 446, dias: [10, 11, 12], selo: "mar-vermelho" },
  { n: 7, c: "Cairo · volta para casa", x: 905, y: 241, dias: [13], selo: "piramides-gize" }];
// curvas que seguem a rota tracejada desenhada no mapa (ponto de controle de cada trecho)
const TRECHOS = [[640, 260], [560, 600], [790, 820], [915, 760], [965, 470], [1000, 330]];
function vMapaMundo(dias, hoje, f, abrir) {
  const W = 1536, H = 1024, dHoje = dias.find(d => d.iso === hoje), fim = hoje > dias[dias.length - 1].iso;
  const atual = fim ? 6 : dHoje ? Math.max(0, PARADAS.findIndex(q => q.dias.includes(dHoje.n))) : 0;
  const antes = S.mapaPos == null ? atual : Math.min(S.mapaPos, atual);
  S.mapaPos = atual;
  const NS = "http://www.w3.org/2000/svg", svg = h("svg", { class: "mmtrilha", viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" });
  const segs = TRECHOS.map(([cx, cy], i) => { const a = PARADAS[i], b = PARADAS[i + 1]; return h("path", { d: `M${a.x} ${a.y} Q${cx} ${cy} ${b.x} ${b.y}`, fill: "none", stroke: "none" }); });
  svg.append(...segs);
  const pct = (x, y) => `left:${x / W * 100}%;top:${y / H * 100}%`;
  const meu = S.uid ? bonecoDe(S.uid) : bonecoPadrao("caravana");
  const fala = f > 0 ? (f === 1 ? "Partida amanhã!" : `Partida em ${f} dias`) : fim ? "Travessia concluída!" : "Você está aqui";
  const ex = h("div", { class: "mmexp", style: pct(PARADAS[antes].x, PARADAS[antes].y) },
    h("span", { class: "mmfala", text: fala }), bonecoCentrado({ ...meu, bicho: "nenhum", pet: "nenhum" }, "bonecosvg"), h("i", { class: "mmsombra" }));
  const box = h("div", { class: "mmundo" },
    h("img", { src: "img/mapa-mundo.webp", alt: "Mapa da rota: Cairo, Deserto Branco, Aswan, Abu Simbel, Luxor, Hurghada e volta ao Cairo" }), svg,
    PARADAS.map((q, i) => {
      const feito = i < atual || (i === atual && (dHoje || fim)), l = localDe(q.selo);
      return h("button", { type: "button", class: "mmfase" + (feito ? " feita" : "") + (i === atual ? " aqui" : "") + (i > atual ? " futura" : ""), style: pct(q.x, q.y),
        "aria-label": `Fase ${q.n}: ${q.c}, dia ${q.dias.join(", ")}`, onclick: () => { S.diaAberto = 0; abrir(q.dias[0]); } },
        l && badgeSrc(l) ? h("img", { src: badgeSrc(l), alt: "" }) : h("b", { text: q.n }),
        feito && i !== atual ? h("i", { class: "mmbandeira", "aria-hidden": "true" }) : null);
    }), ex,
    h("div", { class: "mmplaca" }, h("small", { text: f > 0 ? "Ponto de partida" : `Fase ${PARADAS[atual].n} de 7` }), h("b", { text: PARADAS[atual].c })));
  // pontinhos da trilha: acesos até a parada de hoje, apagados dali em diante
  requestAnimationFrame(() => {
    if (!svg.isConnected) return;
    segs.forEach((s, i) => { const len = s.getTotalLength(), n = Math.max(3, Math.round(len / 34));
      for (let k = 1; k < n; k++) { const pt = s.getPointAtLength(len * k / n), aceso = i < atual;
        const c = document.createElementNS(NS, "circle"); c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.setAttribute("r", aceso ? 7 : 5.5);
        c.setAttribute("class", aceso ? "mmponto aceso" : "mmponto"); c.style.animationDelay = (k * 60) + "ms"; svg.append(c); } });
    // o explorador caminha pela trilha, trecho por trecho
    if (antes === atual || matchMedia("(prefers-reduced-motion: reduce)").matches) { ex.setAttribute("style", pct(PARADAS[atual].x, PARADAS[atual].y)); return; }
    ex.classList.add("andando"); let i = antes, t0 = performance.now();
    const passo = t => { if (!ex.isConnected) return; const s = segs[i], len = s.getTotalLength(), k = Math.min(1, (t - t0) / Math.max(900, len * 2.2)), pt = s.getPointAtLength(len * k);
      ex.style.left = pt.x / W * 100 + "%"; ex.style.top = pt.y / H * 100 + "%";
      if (k < 1) return requestAnimationFrame(passo);
      i++; t0 = t; if (i < atual) return requestAnimationFrame(passo); ex.classList.remove("andando"); vibrar(15); };
    requestAnimationFrame(passo);
  });
  return box;
}
