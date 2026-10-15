// ---------- Mapa-mundo da travessia, estilo mapa de videogame ----------
// Sobre o mapa antigo da rota: uma trilha de pontinhos que acendem conforme a viagem avança, cada parada é uma "fase"
// com o selo do lugar, e o explorador da pessoa anda pela trilha da última parada vista até a de hoje.
// gerado por tools/egito/mapa-jogo.py (a mesma trilha pintada em img/mapa-jogo.webp)
const MAPA_W = 1200, MAPA_H = 1500;
const PARADAS = [
  { n: 1, c: "Cairo", x: 618, y: 322, dias: [1, 2, 3], selo: "cairo" },
  { n: 2, c: "Deserto Branco", x: 240, y: 660, dias: [4, 5], selo: "deserto-branco" },
  { n: 3, c: "Aswan", x: 678, y: 1110, dias: [6], selo: "aswan" },
  { n: 4, c: "Abu Simbel", x: 546, y: 1350, dias: [7], selo: "abu-simbel" },
  { n: 5, c: "Luxor", x: 792, y: 878, dias: [8, 9], selo: "luxor" },
  { n: 6, c: "Hurghada", x: 894, y: 660, dias: [10, 11, 12], selo: "mar-vermelho" },
  { n: 7, c: "Cairo · volta para casa", x: 690, y: 382, dias: [13], selo: "piramides-gize" }];
const TRECHOS = [[[618,322],[610,325],[600,329],[588,332],[574,337],[560,341],[544,346],[528,352],[511,357],[495,363],[479,369],[463,376],[449,382],[435,388],[423,395],[410,402],[398,408],[385,415],[373,422],[361,430],[350,437],[339,445],[328,453],[318,462],[309,471],[300,480],[292,490],[285,500],[278,512],[272,525],[267,538],[263,553],[259,568],[255,582],[252,597],[250,610],[247,624],[245,636],[243,646],[241,655],[240,660]],[[240,660],[243,670],[246,684],[249,699],[252,717],[255,736],[260,756],[264,777],[270,798],[276,819],[283,840],[291,860],[299,879],[309,896],[321,912],[334,928],[349,944],[365,960],[381,975],[399,990],[417,1005],[436,1019],[454,1032],[472,1045],[489,1056],[506,1067],[521,1076],[535,1084],[549,1090],[563,1095],[576,1099],[590,1102],[603,1105],[615,1106],[627,1107],[638,1108],[648,1108],[658,1108],[666,1109],[673,1109],[678,1110]],[[678,1110],[677,1113],[676,1117],[674,1122],[673,1126],[672,1132],[670,1137],[668,1143],[666,1149],[665,1156],[663,1162],[660,1169],[658,1176],[656,1183],[653,1190],[651,1197],[648,1204],[645,1211],[642,1217],[639,1224],[636,1230],[633,1236],[629,1243],[624,1249],[620,1256],[615,1263],[610,1270],[604,1277],[599,1284],[594,1291],[588,1298],[583,1304],[578,1311],[573,1317],[568,1323],[563,1328],[559,1334],[555,1338],[552,1343],[549,1347],[546,1350],[546,1350]],[[546,1350],[554,1345],[564,1339],[575,1332],[589,1324],[603,1316],[618,1307],[634,1298],[649,1288],[665,1277],[680,1266],[694,1255],[706,1244],[717,1233],[727,1221],[736,1209],[745,1196],[753,1183],[761,1170],[768,1156],[774,1142],[780,1127],[786,1113],[791,1099],[795,1084],[799,1070],[803,1057],[805,1043],[807,1029],[807,1014],[807,999],[807,984],[805,969],[804,954],[801,940],[799,926],[797,914],[795,902],[794,892],[792,883],[792,878]],[[792,878],[794,875],[796,872],[799,868],[802,865],[806,861],[810,856],[814,852],[818,847],[822,842],[826,836],[830,831],[835,825],[839,820],[843,814],[847,808],[851,802],[855,797],[858,791],[861,786],[864,780],[867,774],[869,768],[871,762],[873,756],[875,749],[877,742],[879,735],[880,728],[882,721],[884,714],[885,707],[886,700],[887,694],[888,688],[890,682],[891,677],[891,672],[892,667],[893,663],[894,660],[894,660]],[[894,660],[891,653],[888,643],[884,632],[879,620],[875,606],[870,592],[864,578],[859,563],[853,548],[847,534],[841,521],[835,508],[829,497],[824,488],[818,479],[811,470],[805,462],[798,454],[791,447],[784,440],[778,434],[771,428],[765,422],[758,417],[752,412],[747,407],[741,403],[736,399],[731,396],[726,394],[721,392],[717,390],[712,388],[708,387],[704,386],[700,385],[697,385],[694,384],[692,383],[690,382]]];
function vMapaMundo(dias, hoje, f, abrir) {
  const W = MAPA_W, H = MAPA_H, dHoje = dias.find(d => d.iso === hoje), fim = hoje > dias[dias.length - 1].iso;
  const atual = fim ? 6 : dHoje ? Math.max(0, PARADAS.findIndex(q => q.dias.includes(dHoje.n))) : 0;
  const antes = S.mapaPos == null ? atual : Math.min(S.mapaPos, atual);
  S.mapaPos = atual;
  const NS = "http://www.w3.org/2000/svg", svg = h("svg", { class: "mmtrilha", viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" });
  const segs = TRECHOS.map(tr => h("path", { d: "M" + tr.map(p => p.join(" ")).join(" L"), fill: "none", stroke: "none" }));
  svg.append(...segs);
  const pct = (x, y) => `left:${x / W * 100}%;top:${y / H * 100}%`;
  const meu = S.uid ? bonecoDe(S.uid) : bonecoPadrao("caravana");
  const fala = f > 0 ? (f === 1 ? "Partida amanhã!" : `Partida em ${f} dias`) : fim ? "Travessia concluída!" : "Você está aqui";
  const ex = h("div", { class: "mmexp", style: pct(PARADAS[antes].x, PARADAS[antes].y) },
    h("span", { class: "mmfala", text: fala }), bonecoCentrado({ ...meu, bicho: "nenhum", pet: "nenhum" }, "bonecosvg"), h("i", { class: "mmsombra" }));
  const box = h("div", { class: "mmundo" },
    h("img", { src: "img/mapa-jogo.webp", alt: "Mapa da rota: Cairo, Deserto Branco, Aswan, Abu Simbel, Luxor, Hurghada e volta ao Cairo" }), svg,
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
