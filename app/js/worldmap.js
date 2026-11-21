'use strict';
/* ============================================================
   🗺️ خريطة العالم: الطيارة تطير من مدينة لمدينة فوگ أرض ليلية
   (رسم Voxel Space على شاشة صغيرة ومكبّرة بكسلات)
   كل «محطة» = مدينة وياها مهماتها المتتالية.
   ============================================================ */

const WM = {
  W: 180, H: 225, N: 512,          // دقة الرسم الصغيرة + حجم خريطة الارتفاع
  hm: null, lm: null,              // ارتفاعات + إضاءة
  nodes: [], cur: 0, target: 0,
  x: 0, y: 0, a: 0, h: 120, spd: 0, t: 0, bank: 0,
  arrived: false, ready: false, buf: null, img: null, u32: null, art: {},
};

/* ---------- المحطات من قائمة المهمات ---------- */
function wmBuildNodes() {
  const nodes = [];
  MISSIONS.forEach((m, i) => {
    const last = nodes[nodes.length - 1];
    if (last && last.city.en === m.city.en && last.chapter === m.chapter) { last.idx.push(i); return; }
    nodes.push({ city: m.city, style: m.style, chapter: m.chapter, idx: [i] });
  });
  nodes.forEach((n, k) => {
    n.x = 200 + k * 120;
    n.y = 260 * Math.sin(k * 0.55) + 90 * Math.sin(k * 1.7 + 1);
    n.kind = wmKind(n);
  });
  WM.nodes = nodes;
}
function wmKind(n) {
  const e = n.city.en;
  if (e === 'New York') return 'liberty';
  if (e === 'Shanghai') return 'pearl';
  if (e === 'Rio de Janeiro') return 'christ';
  if (e === 'Karbala') return 'shrine';
  if (e === 'Luxor' || e === 'Cairo' || e === 'Alexandria') return 'cairo';
  return n.style;
}
function wmNodeOf(i) { return WM.nodes.findIndex(n => n.idx.includes(i)); }

/* ---------- الأرض ---------- */
function wmNoise(seed) {
  const N = WM.N, g = 32, cells = N / g, r = mulberry(seed), v = new Float32Array(cells * cells);
  for (let i = 0; i < v.length; i++) v[i] = r();
  return (x, y, f) => {
    const s = cells * f; x = x / N * s; y = y / N * s;
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const G = (a, b) => v[(((b % s) + s) % s % cells) * cells + (((a % s) + s) % s % cells)];
    const a0 = G(x0, y0), a1 = G(x0 + 1, y0), b0 = G(x0, y0 + 1), b1 = G(x0 + 1, y0 + 1);
    return a0 + (a1 - a0) * sx + (b0 - a0 + (b1 - b0 - a1 + a0) * sx) * sy;
  };
}
function wmGen() {
  const N = WM.N, hm = new Float32Array(N * N), lm = new Float32Array(N * N);
  const n1 = wmNoise(11), n2 = wmNoise(29), n3 = wmNoise(47), rr = mulberry(77);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let f = 0, amp = 0.55, fr = 0.25;
    for (let o = 0; o < 4; o++) { f += n1(x, y, fr) * amp; amp *= 0.5; fr *= 2; }
    const ridge = 1 - Math.abs(2 * n2(x, y, 1) - 1);
    hm[y * N + x] = f * 0.65 + ridge * ridge * 0.35;
  }
  // تنعيم الارتفاعات (كثبان ناعمة مثل الفيديو)
  for (let pass = 0; pass < 3; pass++) { const t = new Float32Array(hm); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let a = 0; for (let k = -2; k <= 2; k++) a += t[y * N + ((x + k + N) % N)]; hm[y * N + x] = a / 5; } const t2 = new Float32Array(hm); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let a = 0; for (let k = -2; k <= 2; k++) a += t2[((y + k + N) % N) * N + x]; hm[y * N + x] = a / 5; } }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x, hx = hm[y * N + ((x + 1) % N)] - hm[y * N + ((x - 1 + N) % N)], hy = hm[((y + 1) % N) * N + x] - hm[((y - 1 + N) % N) * N + x];
    let l = 0.14 + (hx * -1.2 + hy * -0.9) * 9;               // ضوء من فوگ اليسار
    const riv = Math.abs(n3(x, y, 1.5) - 0.5);
    if (riv < 0.010) l = 0.55 + rr() * 0.25;                     // عروق مضيئة (أنهار)
    else if (riv < 0.018 && rr() < 0.35) l += 0.25;
    if (rr() < 0.004) l = 0.85;                                  // أضواء متفرقة
    lm[i] = clamp(l, 0.03, 0.95);
  }
  WM.hm = hm; WM.lm = lm;
}
function wmIdx(x, y) { const N = WM.N; return ((Math.floor(y) & (N - 1)) * N) + (Math.floor(x) & (N - 1)); }
function wmHeight(x, y) { return WM.hm[wmIdx(x, y)] * WM_HS; }

/* ---------- رسم المعالم (بكسل آرت) ---------- */
function wmArt(kind) {
  if (WM.art[kind]) return WM.art[kind];
  const c = document.createElement('canvas'); c.width = 48; c.height = 64; const g = c.getContext('2d');
  const L = '#ebe1c8', M = '#a59c88', D = '#5b5548', R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const box = (x, y, w, h) => { R(x, y, w, h, M); R(x, y, 1, h, L); for (let yy = y + 2; yy < y + h - 1; yy += 3) for (let xx = x + 2; xx < x + w - 1; xx += 3) R(xx, yy, 1, 1, (xx * 7 + yy) % 5 ? D : L); };
  const dome = (cx, by, r) => { g.fillStyle = L; g.beginPath(); g.arc(cx, by, r, Math.PI, 0); g.fill(); R(cx, by - r - 3, 1, 3, L); };
  const base = () => { R(2, 58, 44, 6, D); R(4, 56, 40, 2, M); for (let i = 0; i < 9; i++) R(4 + i * 4.5, 59 + (i % 2), 2, 1, L); };
  base();
  switch (kind) {
    case 'baghdad': case 'shrine':
      box(6, 40, 10, 16); box(32, 42, 10, 14);
      R(16, 36, 16, 20, M); dome(24, 36, kind === 'shrine' ? 8 : 7);
      if (kind === 'shrine') { g.fillStyle = '#c9a84c'; g.beginPath(); g.arc(24, 36, 8, Math.PI, 0); g.fill(); }
      R(13, 18, 3, 38, L); R(12, 16, 5, 3, L); R(32, 18, 3, 38, L); R(31, 16, 5, 3, L); R(14, 12, 1, 4, L); R(33, 12, 1, 4, L); break;
    case 'tokyo':
      box(4, 38, 10, 18); box(34, 34, 10, 22);
      for (let i = 0; i < 6; i++) { const w = 16 - i * 2.4; R(24 - w / 2, 52 - i * 7, w, 2, L); R(24 - w / 2 + 1, 50 - i * 7, w - 2, 2, D); }
      R(23.5, 6, 1, 6, L); break;
    case 'marsh':
      g.fillStyle = M; g.beginPath(); g.ellipse(24, 56, 16, 18, 0, Math.PI, 0); g.fill();
      for (let i = 0; i < 7; i++) R(11 + i * 4, 40, 1, 16, L);
      R(18, 48, 12, 8, D);
      R(40, 30, 1, 26, M); for (let i = 0; i < 5; i++) { g.strokeStyle = L; g.beginPath(); g.moveTo(40, 30); g.lineTo(32 + i * 4, 34 + (i % 2) * 3); g.stroke(); } break;
    case 'dubai':
      box(4, 34, 9, 22); box(36, 30, 9, 26); box(14, 42, 7, 14);
      R(21, 20, 7, 36, M); R(22, 10, 5, 12, M); R(23, 2, 3, 10, L); R(24, 0, 1, 4, L); R(21, 20, 1, 36, L); break;
    case 'rotterdam':
      R(20, 28, 9, 28, M); R(19, 26, 11, 3, L); R(23, 48, 3, 8, D);
      g.strokeStyle = L; g.lineWidth = 1.5; for (let k = 0; k < 4; k++) { const an = k * Math.PI / 2 + 0.4; g.beginPath(); g.moveTo(24.5, 24); g.lineTo(24.5 + Math.cos(an) * 14, 24 + Math.sin(an) * 14); g.stroke(); }
      R(36, 16, 2, 40, M); R(30, 16, 16, 2, M); R(44, 18, 1, 12, L); box(4, 44, 12, 12); break;
    case 'cairo':
      for (const [cx, s] of [[16, 18], [32, 14], [42, 8]]) { g.fillStyle = M; g.beginPath(); g.moveTo(cx - s, 56); g.lineTo(cx, 56 - s * 1.2); g.lineTo(cx + s, 56); g.fill(); g.fillStyle = L; g.beginPath(); g.moveTo(cx - s, 56); g.lineTo(cx, 56 - s * 1.2); g.lineTo(cx - s * 0.2, 56); g.fill(); } break;
    case 'mountain':
      g.fillStyle = M; g.beginPath(); g.moveTo(2, 56); g.lineTo(20, 14); g.lineTo(30, 30); g.lineTo(36, 22); g.lineTo(46, 56); g.fill();
      g.fillStyle = L; g.beginPath(); g.moveTo(14, 28); g.lineTo(20, 14); g.lineTo(26, 26); g.lineTo(22, 24); g.lineTo(18, 30); g.fill(); break;
    case 'mumbai':
      box(2, 36, 9, 20); box(38, 34, 8, 22);
      R(12, 30, 24, 26, M); R(18, 40, 12, 16, D); g.fillStyle = D; g.beginPath(); g.arc(24, 40, 6, Math.PI, 0); g.fill();
      dome(24, 30, 5); R(12, 26, 3, 4, L); R(33, 26, 3, 4, L); R(12, 30, 24, 1, L); break;
    case 'liberty':
      box(4, 40, 10, 16); box(36, 36, 9, 20);
      R(19, 46, 12, 10, M); R(21, 40, 8, 6, L); R(22, 18, 6, 22, L); R(23, 14, 4, 4, L); for (let i = 0; i < 5; i++) R(21 + i * 2, 12, 1, 2, L);
      R(28, 6, 2, 14, L); R(27, 3, 4, 3, '#f0c040'); break;
    case 'pearl':
      box(4, 38, 9, 18); box(36, 30, 9, 26);
      R(19, 44, 2, 12, M); R(27, 44, 2, 12, M); g.fillStyle = L; g.beginPath(); g.arc(24, 42, 5, 0, 7); g.fill();
      R(23, 18, 2, 22, M); g.beginPath(); g.arc(24, 18, 3.5, 0, 7); g.fill(); R(23.5, 4, 1, 12, L); break;
    case 'christ':
      g.fillStyle = M; g.beginPath(); g.moveTo(2, 56); g.lineTo(24, 30); g.lineTo(46, 56); g.fill();
      R(22, 14, 4, 18, L); R(12, 18, 24, 3, L); R(22.5, 10, 3, 4, L); break;
  }
  WM.art[kind] = c; return c;
}

/* ---------- الحركة ---------- */
function wmSelect(i) {
  if (!WM.nodes.length) wmBuildNodes();
  const k = wmNodeOf(i); if (k < 0) return;
  if (!WM.ready) { const n = WM.nodes[k]; WM.cur = WM.target = k; WM.x = n.x - 70; WM.y = n.y; WM.a = Math.PI / 2; return; }
  if (k !== WM.target) { WM.target = k; WM.arrived = false; if (typeof SND !== 'undefined' && SND.play) { try { AU.click(); } catch (e) {} } }
}
function wmStep(d) {
  const k = clamp(WM.target + d, 0, WM.nodes.length - 1); if (k === WM.target) return;
  const n = WM.nodes[k], pick = n.idx.find(i => unlocked(i) && !save.stars[MISSIONS[i].id]);
  AU.init(); selectMission(pick != null ? pick : n.idx[0]);
}
function wmUpdate(dt) {
  const n = WM.nodes[WM.target];
  // الوقفة: قبل المدينة بمسافة، والطيارة وجهها عليها
  let dx = n.x - WM.x, dy = n.y - WM.y; const dist = Math.hypot(dx, dy);
  const want = Math.atan2(-dx, -dy);                       // اتجاه النظر (-sin,-cos)
  let da = want - WM.a; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
  const stop = 78, far = dist - stop;
  if (far > 2) {
    WM.a += da * Math.min(1, dt * (far > 200 ? 2.2 : 3.2));
    const vmax = clamp(far * 1.6, 25, 520);
    WM.spd += (vmax - WM.spd) * Math.min(1, dt * 2.5);
    const facing = Math.max(0.15, Math.cos(da));
    WM.x += -Math.sin(WM.a) * WM.spd * facing * dt; WM.y += -Math.cos(WM.a) * WM.spd * facing * dt;
    WM.bank += (clamp(da * 1.4, -0.5, 0.5) - WM.bank) * Math.min(1, dt * 4);
  } else {
    WM.spd *= Math.max(0, 1 - dt * 4); WM.a += da * Math.min(1, dt * 3); WM.bank *= Math.max(0, 1 - dt * 4);
    if (!WM.arrived) { WM.arrived = true; WM.cur = WM.target; }
  }
  // ارتفاع الكاميرا فوگ الأرض
  let gmax = 0; for (let s = 0; s < 6; s++) gmax = Math.max(gmax, wmHeight(WM.x - Math.sin(WM.a) * s * 25, WM.y - Math.cos(WM.a) * s * 25));
  const want_h = Math.max(gmax + 30, wmHeight(n.x, n.y) + 58) + (far > 100 ? 18 : 0);
  WM.h += (want_h - WM.h) * Math.min(1, dt * 2);
}

/* ---------- الرسم ---------- */
const WM_HS = 80;
const WM_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
function wmRender() {
  const { W, H } = WM, u32 = WM.u32, hz = Math.round(H * 0.30), SC = 150, F = 0.62, MAXZ = 700;
  const s = Math.sin(WM.a), c = Math.cos(WM.a), camX = WM.x + s * 46, camY = WM.y + c * 46;   // الكاميرا ورا الطيارة
  const yb = new Int16Array(W).fill(H);
  const lev = 7;
  const put = (x, y, l) => { const q = Math.min(lev, Math.floor(l * lev + WM_BAYER[(y & 3) * 4 + (x & 3)])) / lev; const r = q * 235 | 0, gg = q * 225 | 0, b = q * 200 | 0; u32[y * W + x] = 0xff000000 | (b << 16) | (gg << 8) | r; };
  // السما: سودة + نجوم ثابتة تدور ويه الاتجاه
  u32.fill(0xff0d0c0b);
  const off = Math.round(WM.a / (2 * Math.PI) * W * 4);
  for (let i = 0; i < 260; i++) { const sx = ((i * 97 + off) % (W * 4) + W * 4) % (W * 4), sy = (i * 53) % hz; if (sx < W) put(sx, sy, (i % 7 === 0) ? 0.9 : 0.35 + (i % 3) * 0.1); }
  for (let y = hz - 14; y < hz + 8; y++) for (let x = 0; x < W; x++) if (WM_BAYER[(y & 3) * 4 + (x & 3)] < (y - hz + 14) / 40) put(x, y, 0.18);
  // الأرض (من الگدام للورا)
  let z = 1, dz = 0.6;
  while (z < MAXZ) {
    let plx = -c * z * F - s * z, ply = s * z * F - c * z, prx = c * z * F - s * z, pry = -s * z * F - c * z;
    plx += camX; ply += camY; prx += camX; pry += camY;
    const ddx = (prx - plx) / W, ddy = (pry - ply) / W, fog = 1 - Math.pow(z / MAXZ, 1.6), inv = SC / z;
    for (let i = 0; i < W; i++) {
      const idx = wmIdx(plx, ply), hs = Math.round((WM.h - WM.hm[idx] * WM_HS) * inv + hz);
      if (hs < yb[i]) { const l = WM.lm[idx] * fog, ld = l > 0.4 ? Math.min(l, 0.22 * fog) : l, y0 = Math.max(0, hs); for (let y = y0; y < yb[i]; y++) put(i, y, y - y0 < 2 ? l : ld); yb[i] = y0; }
      plx += ddx; ply += ddy;
    }
    z += dz; dz *= 1.012;
  }
  return { s, c, camX, camY, hz, SC, F };
}
function wmProject(v, wx, wy, wh) {
  const dx = wx - v.camX, dy = wy - v.camY, z = dx * -v.s + dy * -v.c, lat = dx * v.c + dy * -v.s;
  if (z < 4) return null;
  return { x: WM.W / 2 + lat / (z * v.F) * (WM.W / 2), y: (WM.h - wh) * v.SC / z + v.hz, k: v.SC / z, z };
}
function wmDrawHeli(g, t) {
  const W = WM.W, cx = W / 2, cy = WM.H * 0.66 + Math.sin(t * 2.2) * 2;
  g.save(); g.translate(cx, cy); g.rotate(-WM.bank * 0.6);
  const L = '#ebe1c8', M = '#a59c88', D = '#3a3630';
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-9, 16, 18, 2);
  g.fillStyle = M; g.fillRect(-1, 4, 2, 12); g.fillRect(-4, 14, 8, 2);           // الذيل (يبتعد)
  g.fillStyle = L; g.fillRect(-7, -4, 14, 10); g.fillRect(-6, -6, 12, 2); g.fillRect(-5, 6, 10, 2);
  g.fillStyle = D; g.fillRect(-5, -3, 10, 4);                                     // الشباك
  g.fillStyle = M; g.fillRect(-9, 9, 18, 1); g.fillRect(-7, 7, 1, 2); g.fillRect(6, 7, 1, 2);   // الزلاجات
  g.fillStyle = L; g.fillRect(-1, -9, 2, 3);
  const rl = 22 * Math.abs(Math.cos(t * 31)) + 4; g.fillRect(-rl, -10, rl * 2, 1);   // المروحة
  g.fillStyle = '#c8323c'; g.fillRect(-1, -7, 2, 1);
  g.restore();
}

function drawWorldMap(dt) {
  const c = $('#globe'); if (!c || !$('#map').classList.contains('on')) return;
  if (!WM.ready) {
    if (!WM.nodes.length) wmBuildNodes();
    wmGen(); WM.buf = document.createElement('canvas'); WM.buf.width = WM.W; WM.buf.height = WM.H;
    WM.img = WM.buf.getContext('2d').createImageData(WM.W, WM.H); WM.u32 = new Uint32Array(WM.img.data.buffer);
    WM.ready = true; wmSelect(selMission); const n = WM.nodes[WM.target]; WM.x = n.x - 280; WM.y = n.y + 60; WM.a = Math.atan2(-(n.x - WM.x), -(n.y - WM.y)); WM.h = 160;
  }
  const cw = Math.round(c.clientWidth * Math.min(2, devicePixelRatio || 1)), ch = Math.round(cw * WM.H / WM.W);
  if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
  WM.t += dt; wmUpdate(dt);
  const v = wmRender(), bg = WM.buf.getContext('2d');
  bg.putImageData(WM.img, 0, 0); bg.imageSmoothingEnabled = false;
  // المدن (البعيدة أول)
  const vis = [];
  WM.nodes.forEach((n, k) => { const p = wmProject(v, n.x, n.y, wmHeight(n.x, n.y)); if (p && p.z < 650 && p.x > -60 && p.x < WM.W + 60) vis.push([p, n, k]); });
  vis.sort((a, b) => b[0].z - a[0].z);
  let selBox = null;
  for (const [p, n, k] of vis) {
    const art = wmArt(n.kind), sc = p.k * 0.6, w = art.width * sc, h = art.height * sc;
    const open = unlocked(n.idx[0]);
    bg.globalAlpha = (open ? 1 : 0.4) * clamp((650 - p.z) / 150, 0, 1);
    bg.drawImage(art, Math.round(p.x - w / 2), Math.round(p.y - h * 0.92), Math.round(w), Math.round(h));
    bg.globalAlpha = 1;
    if (k === WM.target) selBox = { x: p.x - w / 2, y: p.y - h * 0.92, w, h };
  }
  wmDrawHeli(bg, WM.t);
  // تكبير بكسلي
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(WM.buf, 0, 0, c.width, c.height);
  const S = c.width / WM.W;
  // أقواس حمرة حول المدينة المختارة
  if (selBox && WM.arrived) {
    const pad = 4 + Math.sin(WM.t * 4) * 1.2, x0 = (selBox.x - pad) * S, y0 = (selBox.y - pad) * S, x1 = (selBox.x + selBox.w + pad) * S, y1 = (selBox.y + selBox.h + pad) * S;
    const k = Math.min(x1 - x0, y1 - y0) * 0.22, lw = Math.max(2, S * 0.9); g.fillStyle = '#c8323c';
    for (const [x, y, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) { g.fillRect(sx > 0 ? x : x - k, sy > 0 ? y : y - lw, k, lw); g.fillRect(sx > 0 ? x : x - lw, sy > 0 ? y : y - k, lw, k); }
  }
  // بطاقة المدينة تحت
  const n = WM.nodes[WM.target], ar = lang() === 'ar';
  const st = n.idx.reduce((a, i) => a + (save.stars[MISSIONS[i].id] || 0), 0), open = unlocked(n.idx[0]);
  const cwid = c.width * 0.62, chh = c.height * 0.1, cx0 = (c.width - cwid) / 2, cy0 = c.height - chh - c.height * 0.025;
  const al = WM.arrived ? 1 : 0.55;
  g.globalAlpha = al; g.fillStyle = 'rgba(10,9,8,.88)'; g.fillRect(cx0, cy0, cwid, chh); g.strokeStyle = 'rgba(235,225,200,.35)'; g.lineWidth = Math.max(1, S * 0.4); g.strokeRect(cx0, cy0, cwid, chh);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ebe1c8';
  g.font = `bold ${Math.round(chh * 0.36)}px "Courier New", Tahoma, monospace`;
  g.fillText((open ? '' : '🔒 ') + (ar ? n.city.ar : n.city.en.toUpperCase()), c.width / 2, cy0 + chh * 0.36);
  g.font = `${Math.round(chh * 0.22)}px Tahoma, Arial`; g.fillStyle = '#a59c88';
  const cnt = n.idx.length, line2 = (ar ? `${cnt} ${cnt > 1 ? 'مهمات' : 'مهمة'}` : `${cnt} MISSION${cnt > 1 ? 'S' : ''}`) + '   ' + '★'.repeat(Math.round(st / cnt)) + '☆'.repeat(3 - Math.round(st / cnt)) + `  ${st}/${cnt * 3}`;
  g.fillText(line2, c.width / 2, cy0 + chh * 0.74); g.globalAlpha = 1;
  // رقم المحطة
  g.textAlign = ar ? 'right' : 'left'; g.font = `${Math.round(c.width * 0.028)}px "Courier New", monospace`; g.fillStyle = 'rgba(235,225,200,.5)';
  g.fillText(`${WM.target + 1} / ${WM.nodes.length}`, ar ? c.width - c.width * 0.04 : c.width * 0.04, c.height * 0.04);
}
(function wmLoop() { let last = performance.now(); function f(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; try { drawWorldMap(dt); } catch (e) { console.warn('worldmap', e); } requestAnimationFrame(f); } requestAnimationFrame(f); })();

/* الأزرار: المدينة السابقة / التالية + سحب بالإصبع */
(function wmBind() {
  const p = $('#wmPrev'), n = $('#wmNext'), c = $('#globe');
  if (p) p.onclick = () => wmStep(-1);
  if (n) n.onclick = () => wmStep(1);
  let sx = null;
  c.addEventListener('pointerdown', e => { sx = e.clientX; });
  c.addEventListener('pointerup', e => { if (sx == null) return; const d = e.clientX - sx; sx = null; if (Math.abs(d) > 40) wmStep((d < 0 ? 1 : -1) * (lang() === 'ar' ? -1 : 1)); });
  addEventListener('keydown', e => { if (!$('#map').classList.contains('on')) return; if (e.key === 'PageDown') wmStep(1); if (e.key === 'PageUp') wmStep(-1); });
})();
