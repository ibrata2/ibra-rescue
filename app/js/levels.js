'use strict';
/* ============================================================
   بناء المراحل: ألوان، رسم بكسل آرت للمدن، أماكن الناس والمهابط
   ============================================================ */

const VH = 300;            // ارتفاع العالم بالوحدات (بكسل آرت)
const GROUND_Y = 286;

const PALS = {
  night: {
    sky: '#0b0a09', sky2: '#1a1714', star: '#d9d0bb', moon: '#d8cdb0', moonD: '#b3a888', far: '#1c1a17', farD: '#161412',
    mid: '#26231f', midD: '#1f1c19', bld: '#3a3631', bldD: '#2b2824', bldL: '#4b463f', edge: '#5f584f', win: '#eadcb6', winOff: '#1b1916',
    water: 'rgba(12,12,14,0.86)', waterL: '#7a7366', person: '#ebe2ca', ground: '#1f1d1a', groundL: '#34302b', text: '#e9e0c9', haze: null, isDay: false
  },
  day: {
    sky: '#d6d3cb', sky2: '#c3bfb5', star: null, moon: '#f8f6f1', moonD: '#eeebe4', far: '#bcb7ad', farD: '#b2ada2',
    mid: '#a7a296', midD: '#9d988c', bld: '#8e887d', bldD: '#77726a', bldL: '#a29c90', edge: '#3d3934', win: '#3a3732', winOff: '#5d5951',
    water: 'rgba(118,114,106,0.88)', waterL: '#ece9e2', person: '#1a1917', ground: '#6f6a60', groundL: '#837d72', text: '#1a1917', haze: null, isDay: true
  },
  dusk: {
    sky: '#2a211b', sky2: '#5a4434', star: '#e9d6b4', moon: '#efd7a8', moonD: '#d2b585', far: '#3b2e25', farD: '#33281f',
    mid: '#2f251e', midD: '#291f19', bld: '#4a3c31', bldD: '#3a2f26', bldL: '#5c4b3d', edge: '#7a6450', win: '#f0d49c', winOff: '#231b15',
    water: 'rgba(24,19,15,0.86)', waterL: '#a68b68', person: '#f2e4c6', ground: '#2a211b', groundL: '#463a2f', text: '#f2e4c6', haze: null, isDay: false
  }
};

function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; }
function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); }
function dither(g, x, y, w, h, c, step = 2, off = 0) {
  g.fillStyle = c;
  for (let yy = 0; yy < h; yy++) for (let xx = ((yy + off) % step); xx < w; xx += step) g.fillRect((x + xx) | 0, (y + yy) | 0, 1, 1);
}
function speckle(g, x, y, w, h, c, density, rng) {
  g.fillStyle = c; const n = (w * h * density) | 0;
  for (let i = 0; i < n; i++) g.fillRect((x + rng() * w) | 0, (y + rng() * h) | 0, 1, 1);
}

/* ---------------- رسم البنايات ---------------- */
function paintBlock(g, P, b, rng, opts = {}) {
  const { x, y, w, h } = b;
  R(g, x, y, w, h, P.edge);
  R(g, x + 1, y + 1, w - 2, h - 1, P.bld);
  R(g, x + w - 5, y + 1, 4, h - 1, P.bldD);
  R(g, x + 1, y + 1, 1, h - 1, P.bldL);
  const fh = opts.floorH || 10, ww = opts.winW || 4, gap = opts.winGap || 7;
  for (let fy = y + 5; fy < y + h - 6; fy += fh) {
    R(g, x + 1, fy + fh - 3, w - 2, 1, P.bldD);
    for (let fx = x + 4; fx <= x + w - ww - 5; fx += gap) {
      const lit = rng() < (opts.lit || 0.28);
      R(g, fx, fy, ww, 5, lit ? P.win : P.winOff);
      if (lit && rng() < 0.3) R(g, fx + 1, fy + 3, ww - 2, 2, P.bldD); // ستارة
      if (opts.shanasheel && rng() < 0.35) { // شناشيل بغدادية
        R(g, fx - 2, fy - 2, ww + 4, 9, P.edge); R(g, fx - 1, fy - 1, ww + 2, 7, P.bldD);
        for (let k = 0; k < ww + 2; k += 2) R(g, fx - 1 + k, fy - 1, 1, 7, P.edge);
      }
    }
  }
  R(g, x - 1, y, w + 2, 2, P.edge);
  // أغراض السطح (بالأطراف حتى ما تغطي الناس)
  if (!opts.noProps) {
    if (rng() < 0.55) { const tx = x + 2; R(g, tx, y - 6, 7, 6, P.edge); R(g, tx + 1, y - 5, 5, 4, P.bldD); R(g, tx + 1, y - 2, 1, 2, P.edge); R(g, tx + 5, y - 2, 1, 2, P.edge); }
    if (rng() < 0.5) { const ax = x + w - 4; R(g, ax, y - 14, 1, 14, P.edge); R(g, ax - 3, y - 11, 7, 1, P.edge); R(g, ax - 2, y - 8, 5, 1, P.edge); }
  }
}

function paintJpHouse(g, P, b, rng) {
  const { x, y, w, h } = b; // y = أعلى السقف
  const roofH = 12, bodyY = y + roofH;
  R(g, x + 3, bodyY, w - 6, h - roofH, P.edge);
  R(g, x + 4, bodyY + 1, w - 8, h - roofH - 1, P.bld);
  R(g, x + w - 9, bodyY + 1, 5, h - roofH - 1, P.bldD);
  for (let fy = bodyY + 5; fy < y + h - 8; fy += 13) {
    for (let fx = x + 7; fx < x + w - 14; fx += 12) {
      const lit = rng() < 0.35;
      R(g, fx, fy, 8, 6, P.edge); R(g, fx + 1, fy + 1, 6, 4, lit ? P.win : P.winOff);
      R(g, fx + 4, fy + 1, 1, 4, P.edge); R(g, fx + 1, fy + 3, 6, 1, P.edge);
    }
  }
  // سقف ياباني مقوّس
  for (let r = 0; r < roofH; r++) {
    const inset = Math.round((roofH - r) * 0.9) - 2;
    const xx = x + inset, ww = w - inset * 2;
    R(g, xx, y + r, ww, 1, r % 2 ? P.bldD : P.edge);
  }
  R(g, x - 2, y + roofH - 1, w + 4, 2, P.edge);
  R(g, x - 3, y + roofH - 3, 2, 2, P.edge); R(g, x + w + 1, y + roofH - 3, 2, 2, P.edge);
  R(g, x + 6, y - 1, w - 12, 2, P.edge);
}

function paintPagoda(g, P, b) {
  const { x, y, w, h } = b; const cx = x + w / 2;
  R(g, cx - 1, y - 16, 2, 16, P.edge);
  for (let i = 0; i < 5; i++) R(g, cx - 2, y - 14 + i * 3, 4, 1, P.edge);
  const tiers = 5, th = (h - 6) / tiers;
  for (let t = 0; t < tiers; t++) {
    const ty = y + t * th, tw = 18 + t * 5, bw = tw - 8;
    R(g, cx - bw / 2, ty + 4, bw, th - 4, P.bld);
    R(g, cx - bw / 2, ty + 4, 1, th - 4, P.edge); R(g, cx + bw / 2 - 1, ty + 4, 1, th - 4, P.edge);
    R(g, cx - 3, ty + 6, 6, 5, P.win);
    R(g, cx - 1, ty + 6, 1, 5, P.edge);
    R(g, cx - tw / 2, ty + 2, tw, 3, P.edge);
    R(g, cx - tw / 2 - 2, ty + 1, 3, 2, P.edge); R(g, cx + tw / 2 - 1, ty + 1, 3, 2, P.edge);
  }
}

function paintMinaret(g, P, b) {
  const { x, y, w, h } = b;
  R(g, x, y + 10, w, h - 10, P.edge); R(g, x + 1, y + 10, w - 2, h - 10, P.bldL);
  for (let yy = y + 20; yy < y + h; yy += 6) R(g, x + 1, yy, w - 2, 1, P.bldD);
  const by = y + Math.round(h * 0.32);
  R(g, x - 3, by, w + 6, 3, P.edge); R(g, x - 2, by + 3, w + 4, 1, P.bldD);
  R(g, x - 2, y + 12, w + 4, 2, P.edge);
  for (let i = 0; i < 10; i++) R(g, x + w / 2 - (10 - i) / 3, y + i, (10 - i) * 2 / 3 + 1, 1, P.edge);
  R(g, x + w / 2 - 0.5, y - 4, 1, 4, P.edge);
}

function paintDome(g, P, cx, by, r) {
  for (let yy = 0; yy <= r; yy++) {
    const hw = Math.round(Math.sqrt(r * r - (r - yy) * (r - yy)));
    R(g, cx - hw, by - r + yy, hw * 2, 1, yy === 0 ? P.edge : P.bldL);
    R(g, cx - hw, by - r + yy, 1, 1, P.edge); R(g, cx + hw - 1, by - r + yy, 1, 1, P.edge);
  }
  dither(g, cx, by - r + 2, r - 1, r - 2, P.bld, 2);
  R(g, cx - 0.5, by - r - 6, 1, 6, P.edge); R(g, cx - 2, by - r - 5, 4, 1, P.edge);
}

function paintPalm(g, P, x, baseY, h, rng) {
  let cx = x;
  for (let i = 0; i < h; i++) { cx += (i % 7 === 0) ? (rng() < 0.5 ? 0 : 1) : 0; R(g, cx, baseY - i, 2, 1, i % 3 === 0 ? P.edge : P.bldD); }
  const tx = cx + 1, ty = baseY - h;
  const fronds = [[-1, 0.15], [1, 0.15], [-1, 0.6], [1, 0.6], [-0.4, -0.5], [0.4, -0.5]];
  for (const [dx, dy] of fronds) for (let k = 0; k < 11; k++) R(g, tx + dx * k, ty + dy * k + k * k * 0.06, 2, 1, P.edge);
}

function paintTower(g, P, b, rng, kind) {
  const { x, y, w, h } = b;
  R(g, x, y, w, h, P.edge); R(g, x + 1, y + 1, w - 2, h - 1, P.bldD);
  for (let xx = x + 2; xx < x + w - 2; xx += 3) R(g, xx, y + 2, 1, h - 2, P.bld);
  for (let yy = y + 4; yy < y + h; yy += 5) { R(g, x + 1, yy, w - 2, 1, P.edge); if (rng() < 0.25) R(g, x + 2 + ((rng() * (w - 6)) | 0), yy + 1, 3, 3, P.win); }
  R(g, x + 1, y + 1, 2, h - 1, P.bldL);
  if (kind === 'spike') { for (let i = 0; i < 26; i++) R(g, x + w / 2 - (26 - i) / 8, y - 26 + i, (26 - i) / 4 + 1, 1, P.edge); R(g, x + w / 2 - 0.5, y - 40, 1, 14, P.edge); }
}

function paintContainers(g, P, b, rng) {
  const { x, y, w, h } = b; const rows = Math.round(h / 10);
  for (let r = 0; r < rows; r++) {
    const yy = y + r * 10, shade = [P.bld, P.bldL, P.bldD][(rng() * 3) | 0];
    R(g, x, yy, w, 10, P.edge); R(g, x + 1, yy + 1, w - 2, 8, shade);
    for (let xx = x + 2; xx < x + w - 1; xx += 2) R(g, xx, yy + 2, 1, 6, P.bldD);
    R(g, x + w / 2, yy + 1, 1, 8, P.edge);
  }
}

function paintCrane(g, P, mast, arm) {
  // برج الرافعة شبكي
  R(g, mast.x, mast.y, 1, mast.h, P.edge); R(g, mast.x + mast.w - 1, mast.y, 1, mast.h, P.edge);
  for (let yy = mast.y; yy < mast.y + mast.h; yy += 6) { for (let k = 0; k < 6; k++) R(g, mast.x + (k / 6) * mast.w, yy + k, 1, 1, P.edge); R(g, mast.x, yy, mast.w, 1, P.edge); }
  R(g, arm.x, arm.y, arm.w, 1, P.edge); R(g, arm.x, arm.y + arm.h - 1, arm.w, 1, P.edge);
  for (let xx = arm.x; xx < arm.x + arm.w; xx += 5) { for (let k = 0; k < arm.h; k++) R(g, xx + k, arm.y + k, 1, 1, P.edge); }
  R(g, mast.x - 3, arm.y - 2, mast.w + 6, arm.h + 4, P.bld); R(g, mast.x - 3, arm.y - 2, mast.w + 6, 1, P.edge);
  // حبل الرافعة والخطاف
  const hx = arm.x + arm.w - 8; R(g, hx, arm.y + arm.h, 1, 30, P.edge); R(g, hx - 2, arm.y + arm.h + 30, 5, 3, P.edge);
}

function paintMudhif(g, P, b, rng) {
  const { x, y, w, h } = b; const cx = x + w / 2;
  for (let yy = 0; yy < h; yy++) {
    const t = yy / h, hw = Math.round((w / 2) * Math.sqrt(Math.min(1, 0.15 + t * 1.6)));
    R(g, cx - hw, y + yy, hw * 2, 1, P.bld);
    R(g, cx - hw, y + yy, 1, 1, P.edge); R(g, cx + hw - 1, y + yy, 1, 1, P.edge);
  }
  for (let xx = x + 3; xx < x + w - 2; xx += 4) for (let yy = y + 3; yy < y + h; yy++) if ((xx + yy) % 2) R(g, xx, yy, 1, 1, P.bldD);
  R(g, cx - 3, y + h - 7, 6, 7, P.winOff); R(g, cx - 3, y + h - 7, 6, 1, P.edge);
  for (let i = 0; i < 6; i++) R(g, x + 2 + i * (w - 4) / 5, y + h * 0.4, 1, h * 0.6, P.edge);
}

function paintReeds(g, P, x, baseY, n, rng) {
  for (let i = 0; i < n; i++) {
    const rx = x + rng() * 30, rh = 8 + rng() * 14;
    for (let k = 0; k < rh; k++) R(g, rx + Math.sin(k * 0.2) * (k / rh) * 2, baseY - k, 1, 1, P.edge);
    R(g, rx + 1, baseY - rh, 1, 3, P.bldL);
  }
}

function paintPole(g, P, x, baseY, h) {
  R(g, x, baseY - h, 2, h, P.edge);
  R(g, x - 6, baseY - h + 3, 14, 1, P.edge); R(g, x - 4, baseY - h + 7, 10, 1, P.edge);
  R(g, x - 6, baseY - h + 2, 1, 1, P.edge); R(g, x + 7, baseY - h + 2, 1, 1, P.edge);
}

/* ---------------- خلفيات بعيدة ---------------- */
function paintFarSkyline(g, P, W, rng, opt) {
  const base = opt.base || 260;
  let x = 0;
  while (x < W) {
    const w = 14 + rng() * 34, h = (opt.minH || 30) + rng() * (opt.maxH || 90);
    R(g, x, base - h, w, h + 60, P.far);
    if (opt.lit) for (let yy = base - h + 4; yy < base; yy += 6) for (let xx = x + 3; xx < x + w - 3; xx += 5) if (rng() < 0.07) R(g, xx, yy, 2, 2, P.farD === P.far ? P.win : P.moonD);
    if (rng() < 0.2) R(g, x + w / 2, base - h - 12, 1, 12, P.far);
    x += w + (rng() < 0.3 ? rng() * 12 : 0);
  }
}
function paintMountainRange(g, P, W, rng, base, amp, col, snow) {
  let hgt = amp * 0.5;
  for (let x = 0; x < W; x++) {
    hgt += (rng() - 0.5) * 3; hgt = Math.max(amp * 0.1, Math.min(amp, hgt));
    const top = base - hgt - Math.sin(x * 0.01) * amp * 0.3;
    R(g, x, top, 1, VH - top, col);
    if (snow && rng() < 0.5) R(g, x, top, 1, 1 + rng() * 2, snow);
  }
}
function paintFuji(g, P, cx, base) {
  const H = 130, W = 210;
  for (let yy = 0; yy < H; yy++) {
    const t = yy / H, hw = 8 + Math.pow(t, 1.25) * W / 2;
    R(g, cx - hw, base - H + yy, hw * 2, 1, P.far);
    if (yy < 26) for (let xx = -hw; xx < hw; xx += 2) if (((xx + yy) & 3) === 0 || yy < 10 || Math.sin(xx * 0.5) * 6 + 18 > yy) R(g, cx + xx, base - H + yy, 1, 1, P.moonD);
  }
  dither(g, cx - 40, base - 90, 80, 60, P.farD, 3);
}
function paintPyramid(g, P, cx, base, h) {
  for (let yy = 0; yy < h; yy++) { const hw = yy * 1.05; R(g, cx - hw, base - h + yy, hw * 2, 1, yy % 4 === 0 ? P.farD : P.far); R(g, cx, base - h + yy, hw, 1, P.farD); }
}
function paintBridge(g, P, x, base) {
  for (let i = 0; i < 150; i++) R(g, x + i * 0.18, base - i, 3, 1, P.isDay ? P.farD : '#3d3830');
  for (let k = 0; k < 14; k++) { const top = base - 140 + k * 8; for (let t = 0; t < 1; t += 0.008) R(g, x + 25 - k + t * (90 + k * 9), top + t * (140 - k * 8) * 0.98, 1, 1, P.farD); }
  R(g, x - 120, base - 4, 360, 3, P.far);
}
function paintText(g, txt, x, y, col, size) {
  g.save(); g.font = `bold ${size || 8}px monospace`; g.fillStyle = col; g.textBaseline = 'top'; g.fillText(txt, x, y); g.restore();
}

/* ============================================================
   المولّد الرئيسي
   ============================================================ */
function buildLevel(m) {
  const rng = mulberry(hashStr(m.id) + 7);
  const P = PALS[m.pal];
  const W = m.worldW;
  const L = {
    m, P, W, solids: [], spots: [], pads: [], boats: [], decor: [], tornado: null,
    water: m.water ? { y: m.water.y, to: m.water.to, rate: m.water.rate } : null,
    groundY: m.water ? null : GROUND_Y,
    wind: m.wind || { base: 0, gust: 0 },
    stars: [], start: { x: 70, y: 70 }
  };
  const fg = makeCanvas(W, VH), g = fg.getContext('2d');
  const farW = Math.ceil(W * 0.3 + 1400), midW = Math.ceil(W * 0.6 + 1400);
  const far = makeCanvas(farW, VH), gf = far.getContext('2d');
  const mid = makeCanvas(midW, VH), gm = mid.getContext('2d');
  gf.imageSmoothingEnabled = gm.imageSmoothingEnabled = g.imageSmoothingEnabled = false;

  for (let i = 0; i < 220; i++) L.stars.push({ x: rng(), y: rng() * 0.6, b: rng() });

  const solid = (x, y, w, h, extra) => { const s = Object.assign({ x, y, w, h }, extra || {}); L.solids.push(s); return s; };
  const spot = (x0, x1, y, extra) => { L.spots.push(Object.assign({ x0, x1, y }, extra || {})); };
  const waterY = L.water ? L.water.y : GROUND_Y;
  const bottom = VH + 20;

  // ---------- الخلفية البعيدة والمتوسطة حسب المدينة ----------
  const style = m.style;
  if (style === 'tokyo') {
    paintFuji(gf, P, 420, 250); paintFuji(gf, P, farW - 300, 250);
    paintFarSkyline(gm, P, midW, rng, { base: 270, minH: 20, maxH: 70, lit: true });
  } else if (style === 'baghdad') {
    paintFarSkyline(gf, P, farW, rng, { base: 268, minH: 10, maxH: 40 });
    for (let x = 60; x < midW; x += 120 + rng() * 140) {
      const cx = x; R(gm, cx - 30, 220, 60, 80, P.mid); paintDomeFlat(gm, P, cx, 220, 22);
      if (rng() < 0.7) { R(gm, cx + 36, 140, 5, 160, P.mid); R(gm, cx + 33, 170, 11, 3, P.mid); for (let i = 0; i < 8; i++) R(gm, cx + 38.5 - (8 - i) / 3, 132 + i, (8 - i) * 2 / 3 + 1, 1, P.mid); }
      if (rng() < 0.6) paintPalmSil(gm, P.mid, cx - 60 + rng() * 40, 290, 40 + rng() * 20);
    }
  } else if (style === 'marsh') {
    paintMountainRange(gf, P, farW, rng, 262, 18, P.far, null);
    for (let x = 0; x < midW; x += 14 + rng() * 30) { const rh = 10 + rng() * 22; for (let k = 0; k < rh; k++) R(gm, x + Math.sin(k * 0.2) * 2, 262 - k, 1, 1, P.mid); }
    for (let x = 90; x < midW; x += 260 + rng() * 200) paintMudhifSil(gm, P.mid, x, 262, 46, 22);
  } else if (style === 'rotterdam') {
    paintFarSkyline(gf, P, farW, rng, { base: 262, minH: 40, maxH: 110, lit: true });
    paintBridge(gm, P, 260, 262); paintBridge(gm, P, midW - 600, 262);
    paintText(gm, 'ROTTERDAM', 420, 236, P.moonD, 9);
  } else if (style === 'dubai') {
    paintFarSkyline(gf, P, farW, rng, { base: 280, minH: 60, maxH: 150 });
    for (let x = 200; x < midW; x += 500 + rng() * 300) { // برج طويل بالخلفية
      for (let yy = 0; yy < 240; yy++) { const hw = 3 + (yy / 240) * 18; R(gm, x - hw, 40 + yy, hw * 2, 1, P.mid); }
      R(gm, x - 0.5, 10, 1, 30, P.mid);
    }
  } else if (style === 'cairo') {
    paintPyramid(gf, P, 300, 268, 110); paintPyramid(gf, P, 440, 268, 80); paintPyramid(gf, P, farW - 400, 268, 120);
    paintFarSkyline(gm, P, midW, rng, { base: 272, minH: 10, maxH: 36 });
    for (let x = 100; x < midW; x += 300 + rng() * 200) { R(gm, x, 180, 4, 100, P.mid); R(gm, x - 2, 205, 8, 2, P.mid); for (let i = 0; i < 8; i++) R(gm, x + 2 - (8 - i) / 3, 172 + i, (8 - i) * 2 / 3 + 1, 1, P.mid); }
  } else if (style === 'mountain') {
    paintMountainRange(gf, P, farW, rng, 220, 120, P.far, P.moonD);
    paintMountainRange(gm, P, midW, rng, 250, 70, P.mid, P.bldL);
  } else if (style === 'mumbai') {
    paintFarSkyline(gf, P, farW, rng, { base: 268, minH: 50, maxH: 140, lit: true });
    paintFarSkyline(gm, P, midW, rng, { base: 272, minH: 20, maxH: 80 });
  }
  if (P.isDay) { dither(gf, 0, 0, farW, VH, 'rgba(255,255,255,0.05)', 2); }

  // ---------- الأرض ----------
  if (!L.water) {
    solid(-50, GROUND_Y, W + 100, 60, { ground: true });
    R(g, 0, GROUND_Y, W, VH - GROUND_Y, P.ground); R(g, 0, GROUND_Y, W, 1, P.groundL);
    speckle(g, 0, GROUND_Y + 2, W, VH - GROUND_Y, P.groundL, 0.08, rng);
  }

  // ---------- مساحات ماي فاضية محجوزة للقوارب ----------
  const boatLvl = m.zones === 'boat' && !!L.water;
  L.reserve = boatLvl ? (style === 'rotterdam' ? [[40, 175], [W * 0.5 - 10, W * 0.5 + 95]] : [[40, 175], [W * 0.48 - 10, W * 0.48 + 60]].concat(W > 1700 ? [[W * 0.84 - 10, W * 0.84 + 60]] : [])) : [];
  const skipRes = x => { for (const [a, b] of L.reserve) if (x + 90 > a && x < b) return b + 8; return x; };

  // ---------- مُساعد: بناية عادية ----------
  const baseLine = L.water ? bottom : GROUND_Y;
  function block(x, w, top, opts) {
    const b = solid(x, top, w, baseLine - top + (L.water ? 40 : 0), { kind: 'block' });
    paintBlock(g, P, { x, y: top, w, h: baseLine - top + 40 }, rng, opts || {});
    return b;
  }
  function addPadOn(b, label) {
    const pw = Math.min(34, b.w - 6);
    L.pads.push({ x: b.x + (b.w - pw) / 2, y: b.y, w: pw, label: label || 'H' });
    // علامة الصليب الأحمر على البناية
    R(g, b.x + b.w / 2 - 4, b.y + 8, 8, 8, P.isDay ? '#f2efe8' : '#d8cdb0');
    R(g, b.x + b.w / 2 - 1, b.y + 9, 2, 6, '#c8323c'); R(g, b.x + b.w / 2 - 3, b.y + 11, 6, 2, '#c8323c');
  }

  // ---------- بناء المدينة حسب النوع ----------
  if (style === 'baghdad') {
    let x = 30;
    if (m.zones === 'pad') { const hosp = block(118, 64, 206, { shanasheel: false, noProps: true }); addPadOn(hosp); }
    x = 200;
    while (x < W - 60) {
      if (skipRes(x) !== x) { x = skipRes(x); continue; }
      const r = rng();
      if (r < 0.16 && x > 300) { // منارة
        const mh = 150 + rng() * 40; const mb = { x: x + 4, y: baseLine - mh, w: 7, h: mh + 40 };
        solid(mb.x, mb.y + 4, mb.w, mb.h, { kind: 'minaret' }); paintMinaret(g, P, mb); x += 22; continue;
      }
      if (r < 0.32) { // مسجد بقبة
        const w = 56 + rng() * 20, top = (L.water ? 236 : 246) - rng() * 10;
        const b = block(x, w, top, { noProps: true, lit: 0.1 });
        const dr = Math.min(18, w / 2 - 6); paintDome(g, P, x + w / 2, top, dr);
        solid(x + w / 2 - dr * 0.7, top - dr * 0.8, dr * 1.4, dr * 0.8, { kind: 'dome' });
        spot(x + 3, x + 10, top); spot(x + w - 10, x + w - 3, top);
        x += w + 10 + rng() * 14; continue;
      }
      const w = 40 + rng() * 34, top = (L.water ? 190 : 196) + rng() * 58;
      const b = block(x, w, top, { shanasheel: true, lit: P.isDay ? 0.1 : 0.3 });
      spot(x + 12, x + w - 8, top);
      if (rng() < 0.6) L.decor.push(() => 0), paintPalm(g, P, x + w + 6, L.water ? waterY : GROUND_Y, 34 + rng() * 22, rng);
      x += w + 14 + rng() * 26;
    }
  }
  else if (style === 'tokyo') {
    if (m.zones === 'pad') { const hosp = block(110, 70, 196, { noProps: true }); addPadOn(hosp); }
    let x = 200;
    while (x < W - 60) {
      if (skipRes(x) !== x) { x = skipRes(x); continue; }
      const r = rng();
      if (r < 0.1 && x > 400) { // باگودا
        const ph = 150 + rng() * 30, b = { x, y: baseLine - ph, w: 44, h: ph };
        paintPagoda(g, P, b); solid(x + 10, b.y - 14, 24, ph + 50, { kind: 'pagoda' }); x += 54; continue;
      }
      if (r < 0.48) { // بيت ياباني
        const w = 54 + rng() * 26, top = (L.water ? 222 : 228) - rng() * 30;
        paintJpHouse(g, P, { x, y: top, w, h: baseLine - top + 40 }, rng);
        solid(x + 4, top + 1, w - 8, 10, { kind: 'roof' }); solid(x + 3, top + 10, w - 6, baseLine - top + 30, { kind: 'house' });
        spot(x + 14, x + w - 14, top + 1);
        if (rng() < 0.5) paintPole(g, P, x + w + 6, L.water ? waterY + 10 : GROUND_Y, 50 + rng() * 20);
        x += w + 10 + rng() * 16; continue;
      }
      const w = 36 + rng() * 30, top = 150 + rng() * 80;
      block(x, w, top, { lit: 0.35 }); spot(x + 10, x + w - 8, top);
      x += w + 8 + rng() * 22;
    }
  }
  else if (style === 'marsh') {
    let x = 40;
    while (x < W - 60) {
      if (skipRes(x) !== x) { x = skipRes(x); continue; }
      const w = 60 + rng() * 30, iy = waterY - 4;
      R(g, x - 10, iy, w + 20, 10, P.groundL); R(g, x - 6, iy - 2, w + 12, 3, P.ground);
      paintReeds(g, P, x - 14, iy, 10, rng); paintReeds(g, P, x + w - 10, iy, 10, rng);
      if (x > 150) {
        const mh = 22 + rng() * 12, top = iy - mh;
        paintMudhif(g, P, { x, y: top, w, h: mh }, rng);
        solid(x + 6, top, w - 12, mh + 20, { kind: 'mudhif' });
        spot(x + w * 0.3, x + w * 0.7, top);
      }
      x += w + 80 + rng() * 80;
    }
  }
  else if (style === 'rotterdam') {
    let x = 180;
    while (x < W - 80) {
      if (skipRes(x) !== x) { x = skipRes(x); continue; }
      const r = rng();
      if (r < 0.22) { // رافعة
        const mh = 170 + rng() * 30, mx = x + 10;
        const mast = { x: mx, y: baseLine - mh, w: 8, h: mh + 30 }, arm = { x: mx - 50, y: baseLine - mh, w: 90, h: 5 };
        paintCrane(g, P, mast, arm); solid(mast.x, mast.y, mast.w, mast.h); solid(arm.x, arm.y - 2, arm.w, arm.h + 4, { kind: 'crane' });
        spot(arm.x + 4, arm.x + 30, arm.y - 2); spot(arm.x + 62, arm.x + 84, arm.y - 2);
        x += 70; continue;
      }
      const stacks = 1 + ((rng() * 3) | 0);
      // رصيف
      const pw = stacks * 28 + 10; R(g, x - 5, waterY - 6, pw, 60, P.bldD); R(g, x - 5, waterY - 6, pw, 1, P.edge);
      solid(x - 5, waterY - 6, pw, 60, { kind: 'pier' });
      for (let s = 0; s < stacks; s++) {
        const h = (2 + ((rng() * 5) | 0)) * 10, sx = x + s * 28;
        paintContainers(g, P, { x: sx, y: waterY - 6 - h, w: 26, h }, rng);
        solid(sx, waterY - 6 - h, 26, h, { kind: 'cont' }); spot(sx + 4, sx + 22, waterY - 6 - h);
      }
      x += pw + 40 + rng() * 60;
    }
    paintText(g, 'EC1', 260, 120, P.edge, 9);
  }
  else if (style === 'dubai') {
    const hosp = { x: 120, w: 60, y: 170 };
    paintTower(g, P, { x: hosp.x, y: hosp.y, w: hosp.w, h: GROUND_Y - hosp.y }, rng); const hb = solid(hosp.x, hosp.y, hosp.w, GROUND_Y - hosp.y); addPadOn(hb);
    let x = 220;
    while (x < W - 60) {
      const w = 34 + rng() * 30, top = 60 + rng() * 130, kind = rng() < 0.25 ? 'spike' : '';
      paintTower(g, P, { x, y: top, w, h: GROUND_Y - top }, rng, kind);
      solid(x, top, w, GROUND_Y - top, { kind: 'tower' });
      if (kind === 'spike') solid(x + w / 2 - 3, top - 26, 6, 26);
      if (kind === 'spike') { spot(x + 2, x + w / 2 - 6, top); } else spot(x + 6, x + w - 6, top);
      // شرفة جانبية
      if (rng() < 0.5 && w > 40) { const ly = top + 50 + rng() * 60; R(g, x + w, ly, 16, 3, P.edge); solid(x + w, ly, 16, 3); spot(x + w + 2, x + w + 13, ly); }
      x += w + 26 + rng() * 34;
    }
  }
  else if (style === 'cairo') {
    let x = 160;
    while (x < W - 60) {
      if (skipRes(x) !== x) { x = skipRes(x); continue; }
      const w = 40 + rng() * 36, top = 196 + rng() * 56;
      block(x, w, top, { lit: 0.12, noProps: rng() < 0.5 });
      spot(x + 8, x + w - 8, top);
      if (rng() < 0.35) paintPalm(g, P, x - 10, waterY + 4, 30 + rng() * 20, rng);
      x += w + 30 + rng() * 40;
    }
  }
  else if (style === 'mountain') {
    // تضاريس من أعمدة
    const colW = 4; let h = 40;
    const heights = [];
    for (let x = 0; x < W; x += colW) {
      const t = x / W;
      h = 60 + Math.sin(x * 0.011) * 50 + Math.sin(x * 0.027 + 1) * 28 + Math.sin(x * 0.005 + 2) * 40;
      if (x < 200) h = 24; // القاعدة
      heights.push(Math.max(16, h));
    }
    for (let i = 0; i < heights.length; i++) {
      const x = i * colW, top = GROUND_Y - heights[i];
      solid(x, top, colW, heights[i] + 10, { kind: 'hill' });
      R(g, x, top, colW, VH - top, P.bldD);
      dither(g, x, top + 1, colW, Math.min(40, VH - top), P.bldL, 2, i);
      dither(g, x, top + 1, colW, Math.min(12, VH - top), P.edge, 2, i + 1);
      R(g, x, top, colW, 1, P.win);
      if (heights[i] > 120) { R(g, x, top, colW, 2 + (i % 3), P.moonD); }
    }
    // قمم للناس
    for (let i = 3; i < heights.length - 3; i++) {
      if (i * colW < 320) continue;
      if (heights[i] >= heights[i - 1] && heights[i] >= heights[i + 1] && heights[i] >= heights[i - 3] && heights[i] >= heights[i + 3] && heights[i] > 70) {
        const top = GROUND_Y - heights[i]; spot(i * colW - 2, i * colW + colW + 2, top);
        // علم
        R(g, i * colW + 1, top - 12, 1, 12, P.edge); R(g, i * colW + 2, top - 12, 6, 4, '#c8323c');
      }
    }
    // المخيم
    L.pads.push({ x: 90, y: GROUND_Y - 24, w: 40, label: 'H' });
    R(g, 60, GROUND_Y - 34, 18, 10, P.bld); for (let i = 0; i < 9; i++) R(g, 60 + 9 - i, GROUND_Y - 34 - (9 - i) * 0.0 + i - 9 + 9, i * 2, 1, P.edge);
    L.tornado = { x: W * 0.55, vx: 22, min: 400, max: W - 150 };
  }
  else if (style === 'mumbai') {
    let x = 150;
    while (x < W - 60) {
      if (skipRes(x) !== x) { x = skipRes(x); continue; }
      const w = 34 + rng() * 40, top = 120 + rng() * 120;
      block(x, w, top, { lit: 0.25 });
      spot(x + 8, x + w - 8, top);
      if (rng() < 0.3 && skipRes(x + w) === x + w) { // سطح أوطى ملاصق
        const w2 = 24 + rng() * 16, t2 = Math.max(top + 30, 220 + rng() * 20);
        block(x + w, w2, t2, { lit: 0.2, noProps: true }); spot(x + w + 4, x + w + w2 - 4, t2); x += w2;
      }
      x += w + 12 + rng() * 26;
    }
  }

  // ---------- القوارب ----------
  if (m.zones === 'boat' && L.water) {
    L.reserve.forEach(([a, b], i) => {
      const big = style === 'rotterdam' && i === 0;
      const w = big ? 70 : (style === 'cairo' ? 40 : 36);
      L.boats.push({ x: a + ((b - a) - w) / 2, w, ph: i * 1.7, kind: style === 'cairo' ? 'felucca' : (big ? 'ship' : 'boat') });
    });
  }
  if (m.zones === 'pad' && L.pads.length === 0) L.pads.push({ x: 60, y: GROUND_Y, w: 40, label: 'H' });

  // ---------- مكان البداية ----------
  if (L.pads.length) { L.start = { x: L.pads[0].x + L.pads[0].w / 2, y: Math.min(90, L.pads[0].y - 40) }; }
  else if (L.boats.length) { L.start = { x: L.boats[0].x + L.boats[0].w / 2, y: 80 }; }

  // ---------- توزيع الناس على السطوح ----------
  const zx = L.pads.length ? L.pads[0].x : (L.boats.length ? L.boats[0].x : 0);
  let spots = L.spots.filter(s => Math.abs((s.x0 + s.x1) / 2 - zx) > 90 && s.y > 30);
  // خلط
  for (let i = spots.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [spots[i], spots[j]] = [spots[j], spots[i]]; }
  // فضّل التوزيع على طول المرحلة
  spots.sort((a, b) => a.x0 - b.x0);
  const chosen = [];
  const need = m.people;
  if (spots.length) {
    const step = spots.length / need;
    for (let i = 0; i < need; i++) chosen.push(spots[Math.min(spots.length - 1, Math.floor(i * step + rng() * step * 0.6))]);
  }
  L.peopleSpots = chosen;

  // ---------- حبال الغسيل على السطوح (الحبل يقطعها 😄) ----------
  L.laundry = [];
  if (['baghdad', 'cairo', 'mumbai', 'tokyo', 'marsh'].includes(style)) {
    const cols = ['#e9e3d4', '#c8323c', '#8c95a3', '#d9b968', '#6f7d68', '#b7a68a', '#f4f1ea', '#3a3f4a'];
    for (const sp of L.spots) {
      if (rng() > 0.5 || sp.x1 - sp.x0 < 14 || sp.y < 60) continue;
      const x1 = sp.x0 - 2, x2 = sp.x1 + 2, ln = { x1, x2, y: sp.y - 10, base: sp.y, clothes: [], broken: false };
      for (let x = x1 + 2; x < x2 - 3; x += 4 + rng() * 3) { const dish = rng() < 0.25; ln.clothes.push({ x, c: cols[(rng() * cols.length) | 0], w: dish ? 4 : 3, h: dish ? 6 : 3 + ((rng() * 3) | 0) }); }
      L.laundry.push(ln);
    }
  }

  // ---------- النار (مهمات الحريق) ----------
  L.fires = [];
  if (m.fire) {
    const padXs = L.pads.map(p => p.x);
    let cands = L.solids.filter(sd => ['block', 'house', 'tower', 'cont', 'mudhif'].includes(sd.kind) && sd.x > 230 && sd.w >= 20 && sd.y > 40
      && !chosen.some(c => c.y === sd.y && c.x0 >= sd.x - 2 && c.x1 <= sd.x + sd.w + 2) && !padXs.some(px => px >= sd.x - 4 && px <= sd.x + sd.w));
    for (let i = cands.length - 1; i > 0; i--) { const j = (rng() * (i + 1)) | 0; [cands[i], cands[j]] = [cands[j], cands[i]]; }
    for (const sd of cands.slice(0, m.fire)) { const w = Math.min(sd.w - 6, 28); L.fires.push({ x: sd.x + (sd.w - w) / 2, y: sd.y, w, h: 34 }); }
    // سواد الحريق على البناية
    for (const fr of L.fires) dither(g, fr.x - 2, fr.y, fr.w + 4, 30, 'rgba(10,8,6,0.7)', 2);
  }

  L.layers = { far, mid, fg, farW, midW };
  return L;
}

function paintDomeFlat(g, P, cx, by, r) {
  for (let yy = 0; yy <= r; yy++) { const hw = Math.round(Math.sqrt(r * r - (r - yy) * (r - yy))); R(g, cx - hw, by - r + yy, hw * 2, 1, P.mid); }
  R(g, cx - 0.5, by - r - 8, 1, 8, P.mid);
}
function paintPalmSil(g, col, x, baseY, h) {
  for (let i = 0; i < h; i++) R(g, x + i * 0.08, baseY - i, 2, 1, col);
  const tx = x + h * 0.08, ty = baseY - h;
  for (const [dx, dy] of [[-1, 0.2], [1, 0.2], [-1, 0.6], [1, 0.6], [-0.4, -0.4], [0.4, -0.4]]) for (let k = 0; k < 12; k++) R(g, tx + dx * k, ty + dy * k + k * k * 0.06, 2, 1, col);
}
function paintMudhifSil(g, col, x, base, w, h) {
  const cx = x + w / 2;
  for (let yy = 0; yy < h; yy++) { const t = yy / h, hw = Math.round((w / 2) * Math.sqrt(Math.min(1, 0.15 + t * 1.6))); R(g, cx - hw, base - h + yy, hw * 2, 1, col); }
}
