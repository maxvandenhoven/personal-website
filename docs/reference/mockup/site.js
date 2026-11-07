(() => {
  // ---------- skills (built first so their glyph canvases join the figure list) ----------
  const SKILLS = [
    { t:"Languages",      items:["Python","SQL","TypeScript"] },
    { t:"Machine learning", items:["Forecasting","Gradient boosting","Time-aware validation","MLflow"] },
    { t:"AI agents",      items:["Claude Code","Codex","Google ADK","Evaluation","Sandboxing","Search"] },
    { t:"Infrastructure", items:["Docker","Google Cloud","Terraform","GitHub Actions","OpenTelemetry","Linux"] }
  ];
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
  const catsEl = document.getElementById("cats");
  if (catsEl) catsEl.innerHTML = SKILLS.map((c, i) => `
    <div class="cat">
      <div class="cat-head"><div class="art glyph"><canvas data-fig="g${i}" aria-hidden="true"></canvas></div><h3>${esc(c.t)}</h3></div>
      <ul class="chips">${c.items.map(s => `<li><button type="button" class="chip" data-skill="${esc(s)}">${esc(s)}</button></li>`).join("")}</ul>
    </div>`).join("");

  // ---------- listing filters: <ul data-filter="listId"> builds chips from items' data-tags="a|b|c" ----------
  document.querySelectorAll("[data-filter]").forEach(bar => {
    const list = document.getElementById(bar.dataset.filter);
    const items = [...list.querySelectorAll("[data-tags]")];
    const count = document.getElementById(bar.dataset.filter + "-count");
    const empty = document.getElementById(bar.dataset.filter + "-empty");
    const noun = count ? count.dataset.noun : "items";
    const tagsOf = el => el.dataset.tags.split("|").filter(Boolean);
    const all = [...new Set(items.flatMap(tagsOf))].sort((a, b) => a.localeCompare(b));
    bar.innerHTML = ["All", ...all].map(t =>
      `<li><button type="button" class="chip" data-t="${esc(t)}" aria-pressed="${t === "All"}">${esc(t)}</button></li>`).join("");
    const apply = t => {
      let n = 0;
      items.forEach(el => { const show = t === "All" || tagsOf(el).includes(t); el.hidden = !show; n += show; });
      if (count) count.textContent = `${n} ${n === 1 ? noun.replace(/s$/, "") : noun}`;
      if (empty) empty.hidden = n > 0;
    };
    bar.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      apply(b.dataset.t);
    });
    apply("All");
  });

  // ---------- settings ----------
  let reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  // final print settings: 0.5 px layer offset, 20% ink grain, 10% paper tint, 30 lpi (96/3.25, on the slider's 0.25 step), knockout
  const DEF = { misreg:0.5, grain:0.2, ground:0.1, pitch:3.25, knock:"knock", regSeed:3 };
  const S = Object.assign({}, DEF, { paused: reduce });
  try { const saved = JSON.parse(localStorage.getItem("mvdh-riso-v2") || "{}"); for (const k in DEF) if (k in saved) S[k] = saved[k]; } catch (e) {}
  const save = () => { try { const o = {}; for (const k in DEF) o[k] = S[k]; localStorage.setItem("mvdh-riso-v2", JSON.stringify(o)); } catch (e) {} };

  // ink set close to the original palette (Orange, Black, Sunflower): drum 0 warm, drum 1 dark, drum 2 light
  const INKS = ["#FF6C2F", "#1E1B1A", "#FFB511"];
  const inks = () => INKS;

  // ---------- palette keys ----------
  // riso: ink coverage per key as [drum, tint]; drum 0 warm, 1 dark, 2 light
  const RISO = { ink:[], deep:[], sand:[], dim:[[1,.12]], red:[[0,1]], orange:[[0,.75],[2,.7]], rose:[[0,.4]], navy:[[1,1]], slate:[[1,.7]], steel:[[1,.45]],
                 berry:[[0,.85],[1,.4]], wine:[[0,.9],[1,.75]], cream:[[2,.3]], taupe:[[1,.35],[2,.45]], ember:[[0,1]], umbra:[[1,1]], night:[[1,1]], paper:[], sumi:[[1,1]], sun:[[2,1]], blue:[[1,.85]] };
  const hash = (a,b,c) => { let h = Math.imul(a|0,374761393) ^ Math.imul(b|0,668265263) ^ Math.imul(c|0,2246822519); h = Math.imul(h^h>>>13,1274126177); h ^= h>>>16; return (h>>>0)/4294967295; };
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const ease = f => f < .5 ? 2*f*f : 1 - Math.pow(-2*f+2, 2)/2;
  const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s>>>15, 1|s); t = t + Math.imul(t ^ t>>>7, 61|t) ^ t; return ((t ^ t>>>14)>>>0)/4294967296; };
  const tile = n => { const c = document.createElement("canvas"); c.width = c.height = n; return c; };

  // ---------- riso painter: every figure is split into three screened ink layers ----------
  function Riso(){
    const L = [0,1,2].map(() => { const c = document.createElement("canvas"); return { c, x:c.getContext("2d") }; });
    let x, W, H, dpr = 1, pats = {}, grain, blotch, fibre;
    const papers = new Map();
    function paper(){
      const key = `${W}x${H}x${dpr}`; let c = papers.get(key);
      if (!c) {
        if (papers.size > 24) papers.clear();
        c = document.createElement("canvas"); c.width = W; c.height = H; const px = c.getContext("2d");
        px.fillStyle = "#F8F6F1"; px.fillRect(0,0,W,H);
        const fs = 420*Math.max(1,dpr*.8);
        for (let ty = 0; ty < H; ty += fs) for (let tx = 0; tx < W; tx += fs) px.drawImage(fibre, tx, ty, fs, fs);
        papers.set(key, c);
      }
      return c;
    }
    (function textures(){
      const r = rnd(911);
      const g = tile(256), gx = g.getContext("2d"), id = gx.createImageData(256,256);
      for (let i = 0; i < id.data.length; i += 4) { const v = r(); id.data[i+3] = v < .55 ? 0 : Math.pow((v-.55)/.45, 2.2)*255; }
      gx.putImageData(id,0,0); grain = L[0].x.createPattern(g,"repeat");
      const s = tile(16), sx = s.getContext("2d"), sd = sx.createImageData(16,16);
      for (let i = 0; i < sd.data.length; i += 4) sd.data[i+3] = Math.pow(r(), 2.5)*200;
      sx.putImageData(sd,0,0);
      const b = tile(360), bx = b.getContext("2d"); bx.imageSmoothingQuality = "high"; bx.drawImage(s,0,0,360,360); blotch = L[0].x.createPattern(b,"repeat");
      fibre = tile(420); const f = fibre.getContext("2d"); f.lineCap = "round";
      for (let i = 0; i < 420; i++) {
        const px = r()*420, py = r()*420, len = 6 + r()*40, a = r()*Math.PI*2, bend = (r()-.5)*len*.6;
        f.strokeStyle = r() < .6 ? `rgba(110,100,85,${.015 + r()*.025})` : `rgba(255,255,250,${.3 + r()*.3})`; f.lineWidth = .4 + r()*.9;
        f.beginPath(); f.moveTo(px,py); f.quadraticCurveTo(px + Math.cos(a)*len/2 - Math.sin(a)*bend, py + Math.sin(a)*len/2 + Math.cos(a)*bend, px + Math.cos(a)*len, py + Math.sin(a)*len); f.stroke();
      }
    })();
    const ANG = [15,75,45];
    function pattern(i, t){
      const q = Math.round(t*20)/20, T = Math.max(3, Math.round(S.pitch*dpr)), key = `${i}|${q}|${T}`;
      if (pats[key]) return pats[key];
      const c = tile(T), cx = c.getContext("2d"); cx.fillStyle = "#000";
      if (q <= .6) { cx.beginPath(); cx.arc(T/2,T/2,T*Math.sqrt(q/Math.PI),0,Math.PI*2); cx.fill(); }
      else { cx.fillRect(0,0,T,T); cx.globalCompositeOperation = "destination-out"; cx.beginPath(); cx.arc(T/2,T/2,T*Math.sqrt((1-q)/Math.PI),0,Math.PI*2); cx.fill(); }
      const p = L[0].x.createPattern(c,"repeat"); p.setTransform(new DOMMatrix().rotate(ANG[i]));
      return (pats[key] = p);
    }
    function cover(k, tone){ const base = RISO[k] || []; return tone ? base.map(([i,t]) => [i, clamp(t*(1 + .18*tone), .05, 1)]) : base; }
    function op(draw, k, o = {}, cp){
      const a = o.alpha ?? 1;
      if (S.knock === "knock" && !o.over) for (const l of L) {
        l.x.save(); if (cp) { l.x.beginPath(); cp(l.x); l.x.clip(); }
        l.x.globalCompositeOperation = "destination-out"; l.x.globalAlpha = a; draw(l.x, "#000"); l.x.restore();
      }
      for (const [i,t] of cover(k, o.tone)) {
        const tt = t*a; if (tt < .03) continue; const lx = L[i].x;
        lx.save(); if (cp) { lx.beginPath(); cp(lx); lx.clip(); }
        draw(lx, tt > .97 ? "#000" : pattern(i, tt)); lx.restore();
      }
    }
    return {
      setDpr(d){ if (d !== dpr) { dpr = d; pats = {}; } },
      begin(c,w,h){
        x = c; W = w; H = h;
        for (const l of L) {
          if (l.c.width < w || l.c.height < h) { l.c.width = Math.max(l.c.width, w); l.c.height = Math.max(l.c.height, h); }
          l.x.setTransform(1,0,0,1,0,0); l.x.globalAlpha = 1; l.x.globalCompositeOperation = "source-over"; l.x.clearRect(0,0,l.c.width,l.c.height);
        }
        if (S.ground > .01) { L[2].x.fillStyle = pattern(2, S.ground); L[2].x.fillRect(0,0,W,H); }
      },
      bg(k){ for (const [i,t] of RISO[k] || []) { L[i].x.fillStyle = t > .97 ? "#000" : pattern(i,t); L[i].x.fillRect(0,0,W,H); } },
      fill(p,k,o){ op((c,st) => { c.fillStyle = st; c.beginPath(); p(c); c.fill(); }, k, o); },
      clipFill(cp,p,k,o){ op((c,st) => { c.fillStyle = st; c.beginPath(); p(c); c.fill(); }, k, o, cp); },
      stroke(p,k,w,cap="round",o){ op((c,st) => { c.lineWidth = w; c.lineCap = cap; c.strokeStyle = st; c.beginPath(); p(c); c.stroke(); }, k, o); },
      end(){
        const ink = inks();
        x.setTransform(1,0,0,1,0,0); x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
        x.drawImage(paper(), 0, 0);
        L.forEach((l,i) => {
          const c = l.x;
          c.globalCompositeOperation = "source-in"; c.fillStyle = ink[i]; c.fillRect(0,0,W,H);
          if (S.grain > 0) {
            c.globalCompositeOperation = "destination-out";
            grain.setTransform(new DOMMatrix().translate(i*71, i*37)); c.globalAlpha = S.grain; c.fillStyle = grain; c.fillRect(0,0,W,H);
            blotch.setTransform(new DOMMatrix().translate(i*131, i*89).scale(dpr)); c.globalAlpha = S.grain*.6; c.fillStyle = blotch; c.fillRect(0,0,W,H);
            c.globalAlpha = 1;
          }
          c.globalCompositeOperation = "source-over";
          let dx = 0, dy = 0, rot = 0;
          if (i) { const a = hash(S.regSeed,i,7)*Math.PI*2, m = S.misreg*dpr*(.6 + .4*hash(S.regSeed,i,9)); dx = Math.cos(a)*m; dy = Math.sin(a)*m; rot = (hash(S.regSeed,i,3) - .5)*S.misreg*.0012; }
          x.globalCompositeOperation = "multiply"; x.globalAlpha = .95;
          x.save(); x.translate(W/2 + dx, H/2 + dy); x.rotate(rot); x.drawImage(l.c, 0,0,W,H, -W/2,-H/2,W,H); x.restore();
        });
        x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
      }
    };
  }

  // ---------- geometry helpers ----------
  const KEYS = ["red","orange","rose","navy","slate","steel","berry","wine","cream","taupe"];
  function clipPoly(Q,nx,ny,c){ const out = []; for (let k = 0; k < Q.length; k++) { const A = Q[k], B = Q[(k+1)%Q.length], da = nx*A[0]+ny*A[1]-c, db = nx*B[0]+ny*B[1]-c; if (da >= 0) out.push(A); if ((da>=0) !== (db>=0)) { const t = da/(da-db); out.push([A[0]+t*(B[0]-A[0]), A[1]+t*(B[1]-A[1])]); } } return out; }
  function area(Q){ let a = 0; for (let k = 0; k < Q.length; k++) { const A = Q[k], B = Q[(k+1)%Q.length]; a += A[0]*B[1] - B[0]*A[1]; } return Math.abs(a)/2; }
  function fitPath(c,Q,R){ const n = Q.length, L0 = Q[n-1], F = Q[0]; c.moveTo((L0[0]+F[0])/2, (L0[1]+F[1])/2);
    for (let k = 0; k < n; k++) { const A = Q[(k-1+n)%n], B = Q[k], C = Q[(k+1)%n], ax = A[0]-B[0], ay = A[1]-B[1], cx = C[0]-B[0], cy = C[1]-B[1], l1 = Math.hypot(ax,ay), l2 = Math.hypot(cx,cy), cs = clamp((ax*cx+ay*cy)/(l1*l2||1),-1,1);
      c.arcTo(B[0],B[1],C[0],C[1], Math.max(0, Math.min(R, Math.sqrt((1-cs)/(1+cs+1e-9))*Math.min(l1,l2)*.5))); }
    c.closePath(); }
  const circ = (cx,cy,r) => c => { c.moveTo(cx+r,cy); c.arc(cx,cy,r,0,Math.PI*2); };
  const rr = (x,y,w,h,r) => c => { r = Math.min(r, w/2, h/2); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); };
  const hexPts = (cx,cy,R) => Array.from({ length:6 }, (_, k) => { const a = Math.PI/180*(60*k - 30); return [cx + R*Math.cos(a), cy + R*Math.sin(a)]; });
  const hex = (cx,cy,R) => c => fitPath(c, hexPts(cx,cy,R), R*.22);

  // Hive: grow a cluster of hexes; before each placement every open neighbour gets a score and the best one is played.
  const HEXDIR = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  function buildHive(N, ep){
    const placed = [{ q:0, r:0 }], set = new Set(["0,0"]), steps = [];
    for (let i = 1; i < N; i++) {
      const cand = [], seen = new Set();
      for (const p of placed) for (const [dq,dr] of HEXDIR) {
        const q = p.q + dq, r = p.r + dr, k = q + "," + r; if (set.has(k) || seen.has(k)) continue; seen.add(k);
        let nb = 0; for (const [a,b] of HEXDIR) if (set.has((q+a) + "," + (r+b))) nb++;
        cand.push({ q, r, sc: .2 + .6*hash(q + 50, r + 50, ep*31 + i) + .12*nb });
      }
      cand.sort((a,b) => Math.atan2(a.r*1.5, (a.q + a.r/2)*1.732) - Math.atan2(b.r*1.5, (b.q + b.r/2)*1.732));
      let best = 0, top = 0; cand.forEach((c,j) => { if (c.sc > cand[best].sc) best = j; top = Math.max(top, c.sc); });
      cand.forEach(c => c.sc /= top);
      placed.push({ q:cand[best].q, r:cand[best].r }); set.add(cand[best].q + "," + cand[best].r);
      steps.push({ cand, best });
    }
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of placed) { const px = 1.732*(p.q + p.r/2), py = 1.5*p.r; x0 = Math.min(x0,px); x1 = Math.max(x1,px); y0 = Math.min(y0,py); y1 = Math.max(y1,py); }
    placed.forEach((p,i) => { p.col = i % 2 ? "slate" : "cream"; p.mark = i === 0 ? 0 : 1 + Math.floor(hash(i, ep, 5)*3); p.mk = i === 0 ? "red" : ["orange","steel","rose","red"][Math.floor(hash(i, ep, 9)*4)]; });
    return { placed, steps, cx:(x0 + x1)/2, cy:(y0 + y1)/2, w:x1 - x0, h:y1 - y0 };
  }

  // every figure keeps the same empty border, so the art never touches the frame
  const padOf = (W, H) => Math.min(W, H)*.09;

  // ---------- motifs ----------
  const M = {
    craticula(P,W,H,t,o){
      P.bg("ink");
      const m = padOf(W, H)*.7, n = o.n, c = (W-2*m)/n, rows = Math.max(1, Math.floor((H-2*m)/c + .01)), y0 = (H - rows*c)/2;
      const th = (o.rot + t*o.spin)*Math.PI/180, co = Math.cos(th), si = Math.sin(th), s = c*o.scale;
      const Ox = W/2 + o.ox*c, Oy = H/2 + o.oy*c, ku = co*Ox + si*Oy, kv = -si*Ox + co*Oy;
      const gap = c*.075, cut = c*.065, R = c*.22, minA = c*c*.008;
      for (let row = 0; row < rows; row++) for (let col = 0; col < n; col++) {
        const x0 = m + col*c + gap/2, y1 = y0 + row*c + gap/2, x1 = x0 + c - gap, y2 = y1 + c - gap;
        let ci = Math.floor(hash(col,row,o.seed)*10); if (col > 0 && Math.floor(hash(col-1,row,o.seed)*10) === ci) ci = (ci+3)%10;
        let umin = 1e9, umax = -1e9, vmin = 1e9, vmax = -1e9;
        for (const [px,py] of [[x0,y1],[x1,y1],[x1,y2],[x0,y2]]) { const u = co*px + si*py - ku, v = -si*px + co*py - kv; umin = Math.min(umin,u); umax = Math.max(umax,u); vmin = Math.min(vmin,v); vmax = Math.max(vmax,v); }
        for (let i = Math.floor(umin/s); i <= Math.floor(umax/s); i++) for (let j = Math.floor(vmin/s); j <= Math.floor(vmax/s); j++) {
          let q = [[x0,y1],[x1,y1],[x1,y2],[x0,y2]]; const e = cut/2;
          q = clipPoly(q, co, si, ku + i*s + e); if (q.length < 3) continue;
          q = clipPoly(q, -co, -si, -(ku + (i+1)*s - e)); if (q.length < 3) continue;
          q = clipPoly(q, -si, co, kv + j*s + e); if (q.length < 3) continue;
          q = clipPoly(q, si, -co, -(kv + (j+1)*s - e)); if (q.length < 3) continue;
          const a = area(q); if (a < minA) continue;
          P.fill(c2 => fitPath(c2,q,R), KEYS[ci], { alpha: a < 2*minA ? (a-minA)/minA : 1, tone: Math.floor(hash(i,j,ci + col*31 + row*97)*3) - 1 });
        }
      }
    },
    trials(P,W,H,t,o){
      P.bg("ink");
      const pad = padOf(W, H), C = o.cols, R = o.rows, c = Math.min((W - 2*pad)/(2*C + 1), (H - 2*pad)/(R + .5)), x0 = (W - (2*C + 1)*c)/2, y0 = (H - R*c)/2, r = c*.4;
      const len = 2*C + 3, s = t*o.speed, ep = Math.floor(s/len), sw = s % len;
      const colX = k => x0 + (k + (k >= C ? 1 : 0) + .5)*c;
      const sk = clamp(sw - .5, 0, 2*C - 1), kf = Math.floor(sk), sx = colX(kf) + (colX(Math.min(kf+1, 2*C-1)) - colX(kf))*(sk - kf);
      P.fill(rr(sx - c*.5, y0 - c*.25, c, R*c + c*.5, c*.5), "dim");
      P.fill(rr(x0 + C*c + c*.46, y0, c*.08, R*c, c*.04), "slate");
      const dirx = .96, diry = -.28;
      for (let row = 0; row < R; row++) for (let k = 0; k < 2*C; k++) {
        const p = (k < C ? .84 : .34) - row*.05, cx = colX(k), cy = y0 + (row + .5)*c;
        const pass = e => hash(row*97 + k, e, 17) < p, off = ok => ok ? 2.1*r : .3*r;
        const pr = ease(clamp(sw - k, 0, 1)), dd = off(pass(ep-1)) + (off(pass(ep)) - off(pass(ep-1)))*pr;
        P.fill(circ(cx,cy,r), "ember");
        if (dd < 2*r) P.clipFill(circ(cx,cy,r), circ(cx + dirx*dd, cy + diry*dd, r), "night");
      }
    },
    hive(P,W,H,t,o){
      P.bg("ink");
      const N = o.n, cyc = N + 1.5, s = t*o.speed, ep = Math.floor(s/cyc), ph = s % cyc;
      if (o._ep !== ep) { o._ep = ep; o.L = buildHive(N, ep); }
      const L = o.L, sz = Math.min(W*.86/(L.w + 2*1.732*1.6), H*.86/(L.h + 2*1.5*1.6), H*.16);
      const at = (q,r) => [W/2 + sz*(1.732*(q + r/2) - L.cx), H/2 + sz*(1.5*r - L.cy)];
      const out = ease(clamp((ph - (cyc - .5))/.5, 0, 1)), k = Math.floor(ph), f = ph - k;
      const lw = Math.max(1, sz*.035);
      // search: outline every open position, then score them one by one with a disc
      if (k < N - 1 && out === 0) {
        const { cand, best } = L.steps[k], scan = clamp(f/.6, 0, 1)*cand.length, placing = f > .68;
        cand.forEach((c, j) => {
          const [x, y] = at(c.q, c.r);
          if (j === Math.floor(scan) && !placing) P.fill(hex(x, y, sz*.9), "dim");
          P.stroke(hex(x, y, sz*.9), "slate", lw);
          if (j < scan) P.fill(circ(x, y, sz*.32*Math.sqrt(c.sc)), placing && j === best ? "orange" : "steel", { alpha: placing && j !== best ? .45 : 1 });
        });
      }
      // placed pieces, with a mark per piece type; the first piece is the queen
      L.placed.forEach((p, i) => {
        let g;
        if (i === 0) g = ease(clamp(ph/.3, 0, 1));
        else if (i - 1 < k) g = 1;
        else if (i - 1 === k) g = ease(clamp((f - .7)/.3, 0, 1));
        else return;
        g *= 1 - out; if (g < .02) return;
        const [x, y] = at(p.q, p.r), R = sz*.92*g;
        P.fill(hex(x, y, R), p.col);
        const mr = R*.32;
        if (p.mark === 0 || p.mark === 1) P.fill(circ(x, y, mr), p.mk);
        else if (p.mark === 2) P.fill(c => { c.moveTo(x, y - mr*1.2); c.lineTo(x + mr*1.1, y + mr*.8); c.lineTo(x - mr*1.1, y + mr*.8); c.closePath(); }, p.mk);
        else P.stroke(c => { c.moveTo(x + mr, y); c.arc(x, y, mr, 0, Math.PI*2); }, p.mk, Math.max(1, R*.12));
      });
    },
    imposter(P,W,H,t,o){
      P.bg("ink");
      const N = o.n, cx = W/2, cy = H/2, rx = W*.36, ry = H*.34, r = Math.min(W, H)*.075;
      const tc = .55, Tc = N*tc, Tv = 2.4, Tr = 1.4, cyc = Tc + Tv + Tr + 1;
      const s = t*o.speed, ep = Math.floor(s/cyc), ph = s % cyc, imp = Math.floor(hash(ep, 5, 11)*N);
      const seat = i => { const a = -Math.PI/2 + i*2*Math.PI/N; return [cx + Math.cos(a)*rx, cy + Math.sin(a)*ry]; };
      const FAM = ["orange","steel","rose","sun"];
      // the table: each clue adds a line to the card in the middle
      const tw = W*.3, th = H*.36, tx = cx - tw/2, ty = cy - th/2;
      P.fill(rr(tx, ty, tw, th, r*.45), "dim");
      const lh = th*.78/N;
      for (let i = 0; i < N; i++) {
        const prog = clamp((ph - i*tc)/(tc*.8), 0, 1); if (prog <= 0) break;
        const bw = (tw*.8)*(.45 + .5*hash(i, ep, 3))*prog;
        P.fill(rr(tx + tw*.1, ty + th*.11 + i*lh + lh*.2, bw, lh*.6, lh*.3), FAM[i % 4], { alpha: i === imp && ph > Tc + Tv ? 1 : .85 });
      }
      // votes: chords from voter to suspect
      const v = ph - Tc, reveal = clamp((ph - Tc - Tv)/.8, 0, 1);
      if (v > 0) for (let i = 0; i < N; i++) {
        let tg = hash(i, ep, 21) < .7 ? imp : Math.floor(hash(i, ep, 23)*N); if (tg === i) tg = (i + 1 + Math.floor(hash(i, ep, 27)*(N - 1))) % N; if (tg === i) tg = (i + 1) % N;
        const e = ease(clamp((v - i*(Tv*.55/N))/.6, 0, 1)); if (e <= 0) continue;
        const [ax, ay] = seat(i), [bx, by] = seat(tg), d = Math.hypot(bx - ax, by - ay), ux = (bx - ax)/d, uy = (by - ay)/d;
        const sx = ax + ux*r*1.15, sy = ay + uy*r*1.15, ex = bx - ux*r*1.35, ey = by - uy*r*1.35, px = sx + (ex - sx)*e, py = sy + (ey - sy)*e;
        const k = reveal > 0 && tg === imp ? "red" : "slate";
        P.stroke(c => { c.moveTo(sx, sy); c.lineTo(px, py); }, k, Math.max(1, r*.1), "round");
        P.fill(circ(px, py, r*.16), k === "red" ? "red" : "cream");
      }
      // seats; the speaker sends out a ring, and at the end the imposter is eclipsed
      for (let i = 0; i < N; i++) {
        const [x, y] = seat(i);
        const sp = (ph - i*tc)/tc;
        if (sp > 0 && sp < 1.4) P.stroke(circ(x, y, r*(1.15 + .6*sp)), "cream", Math.max(1, r*.08), "round", { alpha: clamp(1 - sp/1.4, 0, 1) });
        P.fill(circ(x, y, r), "cream");
        P.fill(circ(x, y, r*.42), FAM[i % 4]);
        if (i === imp && reveal > 0) { const q = reveal - 1, pop = 1 + 2.70158*q*q*q + 1.70158*q*q; P.fill(circ(x, y, r*clamp(pop, 0, 1.12)), "red"); }
      }
    },
    sandboxes(P,W,H,t,o){
      P.bg("ink");
      const pad = padOf(W, H), n = o.n, c0 = (W - 2*pad)/n, rows = Math.max(1, Math.floor((H - 2*pad)/c0)), c = Math.min(c0, (H - 2*pad)/rows);
      // outer edge of the grid stays where it was (an inset of .13c inside the padded area); only the gaps shrink
      const ins = c*.13, g = c*.08, sx = n*c - 2*ins, sy = rows*c - 2*ins, w = Math.min((sx - (n - 1)*g)/n, (sy - (rows - 1)*g)/rows);
      const x0 = (W - (n*w + (n - 1)*g))/2, y0 = (H - (rows*w + (rows - 1)*g))/2, cols = ["cream","orange","steel"];
      for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) {
        const x = x0 + i*(w + g), y = y0 + j*(w + g);
        if (i === o.open) { P.stroke(rr(x, y, w, w, w*.22), "slate", Math.max(1, c*.015)); continue; }
        P.fill(rr(x, y, w, w, w*.22), "navy");
        for (let a = 0; a < 3; a++) {
          const r = c*.07, b = w/2 - r - c*.04, ph = hash(i,j,a)*6.28;
          P.fill(circ(x + w/2 + Math.sin(t*(.6 + a*.23) + ph)*b, y + w/2 + Math.cos(t*(.47 + a*.31) + ph*1.7)*b, r), cols[a]);
        }
      }
      for (let a = 0; a < 5; a++) {
        const ph = hash(a,3,5), r = c*.07, span = rows*w + (rows - 1)*g;
        const yy = y0 + r + (((t*.08 + ph)*(span - 2*r)) % (span - 2*r)), xx = x0 + o.open*(w + g) + w/2 + Math.sin(t*.9 + ph*9)*c*.9;
        P.fill(circ(xx, yy, r), "red");
      }
    },
    forecast(P,W,H,t,o){
      P.bg("ink");
      const pad = padOf(W, H), xa = pad, xb = W - pad, N = o.n, step = (xb - xa)/N, bw = step*.56, base = H - pad, sc = (H - 2*pad)*.8, s = t*o.speed, k0 = Math.floor(s), fr = s - k0, nowX = xa + (xb - xa)*.66;
      const mean = k => .44 + .2*Math.sin(Math.PI*2*k/7) + .12*Math.sin(Math.PI*2*k/31);
      for (let i = -1; i <= N + 1; i++) {
        const k = k0 + i, x = xa + (i - fr + .5)*step, edge = clamp(Math.min(x - xa - bw/2, xb - x - bw/2)/step + 1, 0, 1);
        if (edge <= 0) continue;
        if (x < nowX) {
          const v = clamp(mean(k) + (hash(k,1,5) - .5)*.18, .08, .96);
          P.fill(rr(x - bw/2, base - v*sc, bw, v*sc, bw/2), hash(k,2,5) < .1 ? "red" : "orange", { alpha:edge });
        } else {
          const h = (x - nowX)/(xb - nowX), m = mean(k), band = .05 + .2*h;
          const lo = Math.max(0, m - band);
          P.fill(rr(x - bw/2, base - (m + band)*sc, bw, (m + band - lo)*sc, bw/2), "slate", { alpha:edge });
          P.fill(circ(x, base - m*sc, bw*.3), "cream", { alpha:edge });
        }
      }
      P.fill(rr(nowX - step*.06, pad, step*.12, H - 2*pad, step*.06), "rose");
    },
    // This website: Markdown files are built block by block into a static page, then only the islands come alive.
    site(P,W,H,t,o){
      P.bg("ink");
      const cyc = 11, ph = (t*o.speed) % cyc, u = H/20, lw = Math.max(1, u*.12);
      const fade = 1 - ease(clamp((ph - 10.2)/.8, 0, 1)), hyd = 5.2, hp = clamp((ph - hyd)/.6, 0, 1);
      // source: three Markdown files, frontmatter in orange
      const sx = W*.05, sw = W*.27, fh = H*.24, fg = H*.05, sy0 = (H - (3*fh + 2*fg))/2;
      const fileY = f => sy0 + f*(fh + fg);
      // the page: a browser window
      const px = W*.43, py = H*.08, pw = W*.52, phh = H*.84, ix = px + pw*.07, iw = pw*.86, top = py + u*2.1;
      const cy = top + u*7.4, ch = py + phh - u*1 - cy, cg = iw*.04, cw = (iw - 2*cg)/3;
      const B = [
        { x:ix, y:top, w:iw, h:u*.7, k:"slate", f:0 },
        { x:ix, y:top + u*1.6, w:iw*.5, h:u*1.15, k:"cream", f:0 },
        { x:ix, y:top + u*3.1, w:iw*.36, h:u*1.15, k:"cream", f:0 },
        { x:ix, y:top + u*4.9, w:iw*.46, h:u*.45, k:"steel", f:0 },
        { x:ix, y:top + u*5.7, w:iw*.38, h:u*.45, k:"steel", f:0 },
        { x:ix + iw*.58, y:top + u*1.6, w:iw*.42, h:u*4.6, isl:0, f:1 },
        { x:ix, y:cy, w:cw, h:ch, k:"navy", f:2 },
        { x:ix + cw + cg, y:cy, w:cw, h:ch, isl:1, f:2 },
        { x:ix + 2*(cw + cg), y:cy, w:cw, h:ch, isl:2, f:2 }
      ];
      const t0 = i => .4 + i*.5, active = B.findIndex((b, i) => ph >= t0(i) && ph < t0(i) + .5);
      for (let f = 0; f < 3; f++) {
        const y = fileY(f);
        P.fill(rr(sx, y, sw, fh, u*.6), "navy");
        for (let b = 0; b < 5; b++) P.fill(rr(sx + sw*.1, y + fh*.15 + b*fh*.15, sw*(b === 0 ? .3 : .45 + .35*hash(f, b, 4)), fh*.075, fh*.04), b === 0 ? "orange" : "steel");
        if (active >= 0 && B[active].f === f) P.stroke(rr(sx, y, sw, fh, u*.6), "cream", lw);
      }
      P.fill(rr(px, py, pw, phh, u*.7), "dim");
      ["red","orange","steel"].forEach((k, i) => P.fill(circ(px + u*(1 + i*.9), py + u*.95, u*.27), k));
      // build: each block is sent from its file and lands on the page
      B.forEach((b, i) => {
        const g = ease(clamp((ph - t0(i) - .35)/.3, 0, 1))*fade; if (g <= .02) return;
        const R = rr(b.x, b.y, b.w, b.h, Math.min(u*.4, b.h/2));
        if (b.isl === undefined) { P.fill(rr(b.x, b.y, b.w*g, b.h, Math.min(u*.4, b.h/2)), b.k, { alpha:fade }); return; }
        if (hp <= 0) { P.stroke(R, "slate", lw, "round", { alpha:fade }); return; }
        P.fill(R, "navy", { alpha:fade*hp });
        const cx = b.x + b.w/2, cyy = b.y + b.h/2, m = Math.min(b.w, b.h), tt = t - hyd;
        if (b.isl === 0) { const r = m*.3, dd = r*(1.05 + .95*Math.sin(tt*1.3)); P.fill(circ(cx, cyy, r), "ember", { alpha:fade*hp }); P.clipFill(circ(cx, cyy, r), circ(cx + dd*.96, cyy - dd*.28, r), "night", { alpha:fade*hp }); }
        else if (b.isl === 1) { for (let j = 0; j < 4; j++) { const bw = b.w*.14, h = b.h*.55*(.35 + .65*(.5 + .5*Math.sin(tt*1.6 + j*1.1))); P.fill(rr(b.x + b.w*(.15 + j*.19), b.y + b.h*.8 - h, bw, h, bw/2), j === 3 ? "slate" : "orange", { alpha:fade*hp }); } }
        else { ["cream","orange","steel"].forEach((k, j) => { const r = m*.1, ax = b.w/2 - r*1.6, ay = b.h/2 - r*1.6; P.clipFill(R, circ(cx + Math.sin(tt*(.9 + j*.3) + j*2)*ax, cyy + Math.cos(tt*(.7 + j*.4) + j)*ay, r), k, { alpha:fade*hp }); }); }
        if (hp > 0 && hp < 1) P.stroke(R, "orange", lw*2, "round", { alpha:1 - hp });
      });
      // packets in flight from the active file to its block
      if (active >= 0) {
        const b = B[active], k = clamp((ph - t0(active))/.4, 0, 1), e = ease(k), ax = sx + sw, ay = fileY(b.f) + fh/2, bx = b.x + Math.min(b.w, u*2)/2, by = b.y + b.h/2;
        if (k < 1) P.fill(circ(ax + (bx - ax)*e, ay + (by - ay)*e - Math.sin(e*Math.PI)*u*1.5, u*.3), "orange");
      }
    },
    // small glyphs for the skill categories
    glyph(P,W,H,t,o){
      P.bg("ink");
      const m = W*.16, g = W - 2*m;
      if (o.v === 0) { // languages: a cursor walks a 3x3 grid and retypes each tile
        const c = g/3, ph = t*1.4, cur = Math.floor(ph) % 9, cyc = Math.floor(ph/9);
        for (let i = 0; i < 9; i++) {
          const pass = cyc - (i > cur ? 1 : 0), k = i === cur ? "red" : ["cream","steel","slate","orange"][Math.floor(hash(i, pass, 3)*4)];
          P.fill(rr(m + (i % 3)*c + c*.08, m + Math.floor(i/3)*c + c*.08, c*.84, c*.84, c*.22), k);
        }
      } else if (o.v === 1) { // ML & data: a short series, the last bar is the forecast
        const n = 4, c = g/n;
        for (let i = 0; i < n; i++) {
          const h = g*(.3 + .6*(.5 + .5*Math.sin(t*1.3 + i*1.1)));
          P.fill(rr(m + i*c + c*.14, m + g - h, c*.72, h, c*.36), i === n - 1 ? "slate" : "orange");
        }
      } else if (o.v === 2) { // agents & evals: four runs that pass or fail
        const c = g/2, r = c*.38;
        for (let i = 0; i < 4; i++) {
          const x = m + (i % 2 + .5)*c, y = m + (Math.floor(i/2) + .5)*c, st = t*.7 + i*.37, ep = Math.floor(st), f = ease(clamp((st - ep)*2.5, 0, 1));
          const off = e => hash(i, e, 13) < .65 ? 2.1*r : .3*r, dd = off(ep - 1) + (off(ep) - off(ep - 1))*f;
          P.fill(circ(x, y, r), "ember");
          if (dd < 2*r) P.clipFill(circ(x, y, r), circ(x + dd*.96, y - dd*.28, r), "night");
        }
      } else { // infrastructure: three layers with a packet passing down through them
        const h = g/3;
        ["navy","slate","steel"].forEach((k, i) => P.fill(rr(m, m + i*h + h*.12, g, h*.76, h*.3), k));
        const f = (t*.45) % 1, y = m + f*g, x = m + g*(.2 + .6*(.5 + .5*Math.sin(t*1.7)));
        P.fill(circ(x, y, h*.2), "cream");
      }
    }
  };

  // ---------- figures ----------
  const SPECS = {
    trials:    { m:"trials", o:{ cols:6, rows:4, speed:2.2 } },
    hive:      { m:"hive", o:{ n:13, speed:.9 }, t0:2 },
    imposter:  { m:"imposter", o:{ n:7, speed:1 }, t0:1 },
    site:      { m:"site", o:{ speed:1 } },
    sandboxes: { m:"sandboxes", o:{ n:8, open:5 } },
    forecast:  { m:"forecast", o:{ n:26, speed:1.2 } },
    g0: { m:"glyph", o:{ v:0 } }, g1: { m:"glyph", o:{ v:1 } }, g2: { m:"glyph", o:{ v:2 } }, g3: { m:"glyph", o:{ v:3 } }
  };
  const P = Riso();
  const figs = [...document.querySelectorAll("canvas[data-fig]")].map(el => ({ el, key: el.dataset.fig, spec: SPECS[el.dataset.fig], clock: SPECS[el.dataset.fig].t0 || 0, dirty: true, visible: true, last: 0 }));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { const f = figs.find(f => f.el === e.target); if (f) { f.visible = e.isIntersecting; f.dirty = true; } }), { rootMargin: "100px" });
    figs.forEach(f => io.observe(f.el));
  }

  // ---------- page background: a faint dot grid that warms up near the pointer ----------
  const bg = document.getElementById("bgfx"), bx = bg.getContext("2d");
  const ptr = { x: -999, y: -999 }, ptrT = { x: -999, y: -999 };
  let bgDirty = true;
  addEventListener("pointermove", e => { ptrT.x = e.clientX; ptrT.y = e.clientY; if (ptr.x < -900) { ptr.x = ptrT.x; ptr.y = ptrT.y; } bgDirty = true; }, { passive:true });
  addEventListener("resize", () => { bgDirty = true; });
  addEventListener("scroll", () => { bgDirty = true; }, { passive:true });
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1),16); return `rgba(${n>>16},${n>>8&255},${n&255},${a.toFixed(3)})`; };
  function drawBg(){
    if (Math.abs(ptrT.x - ptr.x) + Math.abs(ptrT.y - ptr.y) > .5) { const k = S.paused ? 1 : .12; ptr.x += (ptrT.x - ptr.x)*k; ptr.y += (ptrT.y - ptr.y)*k; bgDirty = true; }
    const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    if (bg.width !== Math.round(W*dpr) || bg.height !== Math.round(H*dpr)) { bg.width = Math.round(W*dpr); bg.height = Math.round(H*dpr); bgDirty = true; }
    if (!bgDirty) return; bgDirty = false;
    const [litC, dotC] = inks();
    const sp = 28, oy = -(scrollY % sp), R = 170, base = new Path2D(), lit = [new Path2D(), new Path2D(), new Path2D()];
    for (let y = oy + sp/2; y < H + sp; y += sp) for (let x = (W % sp)/2; x < W; x += sp) {
      const d = Math.hypot(x - ptr.x, y - ptr.y)/R;
      if (d < 1) { const b = Math.min(2, Math.floor((1 - d)*3)), r = 1.1 + 1.1*(1 - d); lit[b].moveTo(x + r, y); lit[b].arc(x, y, r, 0, Math.PI*2); }
      else { base.moveTo(x + 1.1, y); base.arc(x, y, 1.1, 0, Math.PI*2); }
    }
    bx.setTransform(dpr,0,0,dpr,0,0); bx.clearRect(0,0,W,H);
    bx.fillStyle = rgba(dotC, .09); bx.fill(base);
    lit.forEach((p, i) => { bx.fillStyle = rgba(litC, .16 + .14*i); bx.fill(p); });
  }

  let last = performance.now();
  const dirtyAll = () => { bgDirty = true; figs.forEach(f => f.dirty = true); };
  function frame(now){
    const dt = Math.min(.05, (now - last)/1000); last = now;
    drawBg();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // 20 fps: the prints move "on twos" like hand-drawn animation, and it keeps the page light
    const frameMs = 1000/20 - 2;
    P.setDpr(dpr);
    for (const f of figs) {
      if (!f.visible) continue;
      const w = Math.round(f.el.clientWidth*dpr), h = Math.round(f.el.clientHeight*dpr);
      if (!w || !h) continue;
      if (f.el.width !== w || f.el.height !== h) { f.el.width = w; f.el.height = h; f.dirty = true; }
      if (!S.paused) f.clock += dt;
      if (S.paused && !f.dirty) continue;
      if (!f.dirty && now - f.last < frameMs) continue;
      P.begin(f.el.getContext("2d"), w, h); M[f.spec.m](P, w, h, f.clock, f.spec.o); P.end();
      f.dirty = false; f.last = now;
    }
    requestAnimationFrame(frame);
  }

  // ---------- icons ----------
  const ICONS = {
    github: '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>',
    linkedin: '<path fill-rule="evenodd" d="M3 0h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zM4.6 3.15a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 1 0 0-2.5zM3.5 6.4h2.2v6.2H3.5zM7.2 6.4h2.1v.9c.4-.7 1.2-1.1 2.1-1.1 1.6 0 2.4 1 2.4 2.8v3.6h-2.2V9.4c0-.8-.3-1.3-1-1.3s-1.2.5-1.2 1.4v3.1H7.2z"/>'
  };
  document.querySelectorAll("[data-icon]").forEach(el => el.insertAdjacentHTML("afterbegin",
    `<svg viewBox="0 0 16 16" aria-hidden="true">${ICONS[el.dataset.icon]}</svg>`));

  // ---------- controls ----------
  const root = document.documentElement;
  const motionBtn = document.getElementById("motionBtn");
  const playIcon = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2.5v9l8-4.5z" fill="currentColor"/></svg>';
  const pauseIcon = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2.5" width="2.6" height="9" rx="1" fill="currentColor"/><rect x="8.4" y="2.5" width="2.6" height="9" rx="1" fill="currentColor"/></svg>';
  function syncMotion(){ motionBtn.innerHTML = S.paused ? playIcon : pauseIcon; motionBtn.title = S.paused ? "Play animations" : "Pause animations"; motionBtn.setAttribute("aria-pressed", String(S.paused)); motionBtn.setAttribute("aria-label", motionBtn.title); }
  motionBtn.addEventListener("click", () => { S.paused = !S.paused; syncMotion(); dirtyAll(); });

  const fmt = { misreg: v => `${v.toFixed(1)} px`, grain: v => `${Math.round(v*100)}%`, ground: v => `${Math.round(v*100)}%`, pitch: v => `${Math.round(96/v)} lpi` };
  const ranges = Object.keys(fmt).map(k => { const inp = document.getElementById(k), out = document.getElementById(k + "V");
    inp.addEventListener("input", () => { S[k] = parseFloat(inp.value); paint(); dirtyAll(); save(); }); return [k, inp, out]; });
  const segs = [...document.querySelectorAll(".seg[data-key]")];
  segs.forEach(sg => sg.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { S[sg.dataset.key] = b.dataset.val; paint(); dirtyAll(); save(); })));
  function paint(){
    ranges.forEach(([k, inp, out]) => { inp.value = S[k]; out.textContent = fmt[k](S[k]); inp.style.setProperty("--p", `${(S[k] - inp.min)/(inp.max - inp.min)*100}%`); });
    segs.forEach(sg => sg.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b.dataset.val === S[sg.dataset.key]))));
    const ink = inks();
    root.style.setProperty("--foot", `color-mix(in srgb, ${ink[1]} 72%, #000)`);
  }
  document.getElementById("reReg").addEventListener("click", () => { S.regSeed = (S.regSeed*17 + 5) % 9973; dirtyAll(); save(); });
  const sheet = document.getElementById("sheet"), open = document.getElementById("openSheet");
  const setOpen = v => { sheet.hidden = !v; open.setAttribute("aria-expanded", String(v)); };
  open.addEventListener("click", () => setOpen(sheet.hidden));
  document.getElementById("closeSheet").addEventListener("click", () => { setOpen(false); open.focus(); });
  sheet.addEventListener("keydown", e => { if (e.key === "Escape") { setOpen(false); open.focus(); } });

  syncMotion(); paint(); requestAnimationFrame(frame);
})();
