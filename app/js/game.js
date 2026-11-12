'use strict';
/* ============================================================
   IBRA RESCUE — المحرك: الطيارة، الحبل الفيزيائي، الناس، الطقس، الأصوات
   ============================================================ */

const $ = s => document.querySelector(s);
const cv = $('#c'), ctx = cv.getContext('2d');
let DPR = 1, CW = 0, CH = 0, S = 2, VW = 533;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  CW = cv.width = Math.round(innerWidth * DPR); CH = cv.height = Math.round(innerHeight * DPR);
  S = CH / VH; VW = CW / S;
}
addEventListener('resize', resize); resize();

/* ---------------- حفظ ---------------- */
const SAVE_KEY = 'ibraRescue.v1';
const save = { stars: {}, lang: 'ar', sound: true };
try { Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) { }
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { } }
const lang = () => save.lang;
const T = k => (STR[lang()] && STR[lang()][k]) || STR.en[k] || k;
const pick = arr => arr[(Math.random() * arr.length) | 0];
// يجمع التعليقات العامة + التعليقات الخاصة بالمهمة الحالية (إذا موجودة)
const line = cat => {
  const base = (LINES[cat] && LINES[cat][lang()]) || [];
  const extra = (G && G.m.lines && G.m.lines[cat] && G.m.lines[cat][lang()]) || [];
  return pick(base.concat(extra, extra)); // الخاصة لها فرصة أكبر
};
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;

/* ============================================================
   الصوت (WebAudio مولّد بالكامل — بدون ملفات)
   ============================================================ */
const AU = {
  ctx: null, master: null, rotorG: null, rotorF: null, rainG: null, ok: false,
  init() {
    if (this.ctx) return;
    try {
      const A = window.AudioContext || window.webkitAudioContext; this.ctx = new A();
      const c = this.ctx;
      this.master = c.createGain(); this.master.gain.value = save.sound ? 0.7 : 0; this.master.connect(c.destination);
      const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = buf;
      // دوّار الطيارة
      const n = c.createBufferSource(); n.buffer = buf; n.loop = true;
      this.rotorF = c.createBiquadFilter(); this.rotorF.type = 'bandpass'; this.rotorF.frequency.value = 260; this.rotorF.Q.value = 0.8;
      const am = c.createGain(); am.gain.value = 0.5;
      const lfo = c.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 15; this.lfo = lfo;
      const lfoG = c.createGain(); lfoG.gain.value = 0.45; lfo.connect(lfoG); lfoG.connect(am.gain);
      this.rotorG = c.createGain(); this.rotorG.gain.value = 0;
      n.connect(this.rotorF); this.rotorF.connect(am); am.connect(this.rotorG); this.rotorG.connect(this.master);
      n.start(); lfo.start();
      // المطر
      const rn = c.createBufferSource(); rn.buffer = buf; rn.loop = true;
      const rf = c.createBiquadFilter(); rf.type = 'highpass'; rf.frequency.value = 2500;
      this.rainG = c.createGain(); this.rainG.gain.value = 0;
      rn.connect(rf); rf.connect(this.rainG); this.rainG.connect(this.master); rn.start();
      this.ok = true;
    } catch (e) { this.ok = false; }
  },
  setSound(on) { if (this.master) this.master.gain.value = on ? 0.7 : 0; },
  rotor(level, pitch) {
    if (!this.ok) return; const t = this.ctx.currentTime;
    this.rotorG.gain.setTargetAtTime(level * 0.55, t, 0.08);
    this.rotorF.frequency.setTargetAtTime(220 + pitch * 120, t, 0.1);
    this.lfo.frequency.setTargetAtTime(14 + pitch * 4, t, 0.1);
  },
  rain(level) { if (this.ok) this.rainG.gain.setTargetAtTime(level * 0.12, this.ctx.currentTime, 0.3); },
  tone(f, dur, type = 'square', vol = 0.08, slide = 0, delay = 0) {
    if (!this.ok) return; const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  },
  burst(dur, freq, vol = 0.3, type = 'lowpass', delay = 0) {
    if (!this.ok) return; const c = this.ctx, t = c.currentTime + delay;
    const s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.2), t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  },
  blip(pitchBase) { this.tone(pitchBase * (0.8 + Math.random() * 0.5), 0.05, 'square', 0.035); },
  grab() { this.tone(520, 0.08, 'square', 0.06, 300); },
  saved() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.12, 'square', 0.05, 0, i * 0.07)); },
  splash() { this.burst(0.45, 1800, 0.35); },
  thud() { this.burst(0.18, 500, 0.4); this.tone(90, 0.15, 'sine', 0.2, -40); },
  boom() { this.burst(1.6, 1200, 0.9); this.tone(70, 0.9, 'sine', 0.5, -50); },
  thunder(delay) { this.burst(2.2, 400, 0.6, 'lowpass', delay); },
  scream() { this.tone(900, 0.8, 'sawtooth', 0.04, -600); },
  win() { [523, 659, 784, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.16, 'square', 0.06, 0, i * 0.11)); },
  fail() { [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.08, 0, i * 0.18)); },
  click() { this.tone(880, 0.04, 'square', 0.04); }
};

/* ============================================================
   رسم البكسل للشخصيات
   ============================================================ */
const POSE = {
  head: [[0, -11], [-1, -10], [0, -10], [1, -10], [0, -9]],
  stand: [[0, -8], [0, -7], [0, -6], [0, -5], [0, -4], [-1, -7], [-2, -6], [1, -7], [2, -6], [-1, -3], [-1, -2], [-1, -1], [1, -3], [1, -2], [1, -1]],
  waveA: [[0, -8], [0, -7], [0, -6], [0, -5], [0, -4], [-1, -8], [-2, -9], [-2, -10], [1, -8], [2, -9], [3, -10], [-1, -3], [-1, -2], [-1, -1], [1, -3], [1, -2], [1, -1]],
  waveB: [[0, -8], [0, -7], [0, -6], [0, -5], [0, -4], [-1, -8], [-2, -9], [-3, -10], [1, -8], [2, -9], [2, -10], [-1, -3], [-1, -2], [-2, -1], [1, -3], [1, -2], [2, -1]],
  hang: [[0, 0], [-1, 1], [1, 1], [0, 2], [-1, 3], [0, 3], [1, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]],
  fallA: [[0, -8], [0, -7], [0, -6], [0, -5], [-1, -8], [-2, -9], [-3, -10], [1, -8], [2, -9], [3, -10], [-1, -4], [-2, -3], [-3, -2], [1, -4], [2, -3], [3, -2]],
  fallB: [[0, -8], [0, -7], [0, -6], [0, -5], [-1, -7], [-2, -7], [-3, -6], [1, -7], [2, -7], [3, -6], [-1, -4], [-1, -3], [-2, -2], [1, -4], [2, -3], [2, -2]],
  sit: [[0, -8], [-1, -7], [0, -7], [1, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [1, -1], [2, -1], [3, -1], [-1, -4], [1, -4]],
  swimA: [[0, -4], [-1, -3], [0, -3], [1, -3], [0, -2], [-2, -2], [-3, -3], [2, -2], [3, -1]],
  swimB: [[0, -4], [-1, -3], [0, -3], [1, -3], [0, -2], [-2, -2], [-3, -1], [2, -2], [3, -3]],
};
function px(list, x, y, flip = 1) { for (const p of list) ctx.fillRect(Math.round(x + p[0] * flip), Math.round(y + p[1]), 1, 1); }

/* ---------------- رسم الطيارة كسبرايت ---------------- */
const HELI_TYPES = {
  small: { w: 36, h: 15, cx: 18, cy: 8, box: [26, 11], anchor: [1, 6], rotors: [[18, 0, 21]], segs: 14, seg: 6, cap: 5, mass: 1 },
  chinook: { w: 54, h: 19, cx: 27, cy: 10, box: [44, 13], anchor: [0, 8], rotors: [[45, 1, 22], [8, 0, 22]], segs: 18, seg: 6, cap: 8, mass: 1.5 },
};
const SPR = {};
function buildHeliSprites() {
  const C = '#ebe1c8', Cd = '#c4b896', K = '#121110', Rr = '#c8323c', G = '#2c2c30', GH = '#8d939b';
  // صغيرة
  {
    const c = makeCanvas(36, 15), g = c.getContext('2d'); const p = (x, y, col, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    const rows = { 3: [13, 22], 4: [11, 25], 5: [10, 27], 6: [10, 29], 7: [10, 29], 8: [11, 28], 9: [12, 27], 10: [13, 25] };
    // ذيل
    p(1, 4, K, 11, 1); p(1, 7, K, 11, 1); p(1, 5, C, 11, 2); p(1, 6, Cd, 11, 1);
    p(0, 1, K, 4, 1); p(0, 1, K, 1, 6); p(1, 2, Rr, 3, 3); p(0, 6, K, 4, 1); p(3, 2, K, 1, 2);
    p(2, 7, K, 1, 2); p(1, 9, K, 3, 1);
    for (const y in rows) { const [a, b] = rows[y]; p(a, +y, C, b - a + 1, 1); p(a, +y, K, 1, 1); p(b, +y, K, 1, 1); }
    p(13, 2, K, 10, 1); p(13, 11, K, 13, 1);
    for (let y = 3; y <= 10; y++) { const [a, b] = rows[y]; if (y === 3 || y === 10) p(a, y, K, b - a + 1, 1); }
    for (let y = 9; y <= 10; y++) p(rows[y][0] + 1, y, Cd, rows[y][1] - rows[y][0] - 1, 1);
    // زجاج أمامي
    for (let y = 4; y <= 7; y++) { const b = rows[y][1]; p(b - 6 + (y === 4 ? 2 : 0), y, G, 6 - (y === 4 ? 2 : 0), 1); }
    p(25, 5, GH, 2, 1); p(15, 5, G, 4, 2); p(15, 5, GH, 1, 1);
    p(12, 8, Rr, 16, 1);
    // صاري
    p(17, 0, K, 3, 3); p(18, 1, Cd, 1, 1);
    // زلاجات
    p(15, 12, K, 1, 2); p(24, 12, K, 1, 2); p(11, 14, K, 18, 1); p(29, 13, K, 1, 1); p(10, 13, K, 1, 1);
    SPR.small = c;
  }
  // شينوك
  {
    const c = makeCanvas(54, 19), g = c.getContext('2d'); const p = (x, y, col, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    p(4, 5, K, 46, 1); p(3, 6, K, 1, 8); p(50, 6, K, 1, 6); p(4, 14, K, 44, 1); p(48, 12, K, 2, 2);
    p(4, 6, C, 46, 8); p(4, 12, Cd, 44, 2);
    // مقدمة وزجاج
    p(44, 6, G, 6, 3); p(46, 6, GH, 2, 1); p(42, 9, Rr, 8, 2); p(50, 7, K, 2, 4);
    // نوافذ
    for (let x = 10; x < 40; x += 5) { p(x, 7, G, 3, 2); }
    p(4, 10, Rr, 4, 2); p(20, 10, Rr, 14, 1);
    // أبراج الدوّارات
    p(4, 1, K, 9, 4); p(5, 2, C, 7, 3); p(42, 2, K, 7, 3); p(43, 3, C, 5, 2);
    p(8, 0, K, 1, 1); p(45, 1, K, 1, 1);
    // عجلات
    p(10, 15, K, 3, 3); p(11, 16, Cd, 1, 1); p(40, 15, K, 3, 3); p(41, 16, Cd, 1, 1);
    p(3, 13, K, 6, 2);
    SPR.chinook = c;
  }
}
buildHeliSprites();

/* ============================================================
   اللعبة
   ============================================================ */
let G = null;           // اللعبة الحالية
const input = { x: 0, y: 0, keys: {} };

class Game {
  constructor(mi) {
    this.mi = mi; this.m = MISSIONS[mi];
    this.L = buildLevel(this.m);
    const ht = HELI_TYPES[this.m.heli];
    this.ht = ht;
    this.heli = { x: this.L.start.x, y: this.L.start.y, vx: 0, vy: 0, tilt: 0, face: 1, rot: 0, sink: 0 };
    this.initRope();
    this.people = []; this.parts = []; this.bubbles = []; this.drops = [];
    this.t = 0; this.timeLeft = this.m.time; this.saved = 0; this.falls = 0; this.crashes = 0;
    this.state = 'play'; this.endT = 0; this.shake = 0; this.flash = 0;
    this.camX = clamp(this.heli.x - VW / 2, 0, Math.max(0, this.L.W - VW));
    this.radioQ = []; this.flags = {};
    this.nextLightning = 4 + Math.random() * 6; this.nextShout = 1.5;
    this.rain = []; this.dust = [];
    let id = 0;
    for (const sp of this.L.peopleSpots) {
      const x = lerp(sp.x0, sp.x1, Math.random());
      this.people.push({ id: id++, x, y: sp.y, spot: sp, st: 'wait', vx: 0, vy: 0, k: -1, grip: 1, f: Math.random() * 10, face: Math.random() < 0.5 ? -1 : 1, cool: Math.random() * 3, timer: 0, walkT: 0 });
    }
    // إذا الناس أقل من المطلوب (احتياط) — الهدف ما يتجاوز عددهم
    this.goal = Math.min(this.m.goal, this.people.length);
    setTimeout(() => this.radio(pick(RADIO.start[lang()])), 600);
  }
  initRope() {
    const ht = this.ht, n = ht.segs + 1;
    this.rope = { n, seg: ht.seg, x: new Float32Array(n), y: new Float32Array(n), px: new Float32Array(n), py: new Float32Array(n), inv: new Float32Array(n), occ: new Array(n).fill(null), hit: new Float32Array(n) };
    const a = this.anchor();
    for (let i = 0; i < n; i++) { this.rope.x[i] = this.rope.px[i] = a.x; this.rope.y[i] = this.rope.py[i] = a.y + i * ht.seg; this.rope.inv[i] = 1; }
  }
  anchor() {
    const h = this.heli, ht = this.ht; const ax = ht.anchor[0] * h.face, ay = ht.anchor[1];
    const c = Math.cos(h.tilt), s = Math.sin(h.tilt);
    return { x: h.x + ax * c - ay * s, y: h.y + ax * s + ay * c };
  }
  load() { return this.rope.occ.reduce((a, o) => a + (o ? 1 : 0), 0); }
  waterY() { return this.L.water ? this.L.water.y : null; }
  windAt(t) { const w = this.L.wind; return w.base + w.gust * Math.sin(t * 0.7) * Math.sin(t * 0.23 + 1) + w.gust * 0.3 * Math.sin(t * 2.3); }

  radio(text) { showRadio(text); }
  say(ent, text, opts = {}) {
    // حد أقصى للفقاعات حتى ما تزدحم الشاشة
    if (!opts.force) {
      const active = this.bubbles.filter(b => !b.dead).length;
      if (active >= 4) return;
      if (this.bubbles.some(b => b.ent === ent && !b.dead && b.t < b.life - 0.4)) return;
    }
    this.bubbles = this.bubbles.filter(b => b.ent !== ent);
    this.bubbles.push({ ent, text, t: 0, life: opts.life || (1.6 + text.length * 0.06), shown: 0, big: !!opts.big, pitch: opts.pitch || (300 + (ent && ent.id != null ? (ent.id * 53) % 400 : 200)) });
  }

  /* ---------------- خطوة فيزيائية ---------------- */
  step(dt) {
    this.t += dt;
    const h = this.heli, ht = this.ht, L = this.L, rope = this.rope;
    const wind = this.windAt(this.t);
    const load = this.load();
    const alive = this.state === 'play';

    // ارتفاع الماي
    if (L.water && L.water.rate && alive) {
      L.water.y = Math.max(L.water.to, L.water.y - L.water.rate * dt);
      if (!this.flags.flood && this.t > 8) { this.flags.flood = 1; this.radio(pick(RADIO.flood[lang()])); }
    }
    // الإعصار
    const tor = L.tornado;
    if (tor) { tor.x += tor.vx * dt; if (tor.x < tor.min || tor.x > tor.max) tor.vx *= -1; }

    if (alive) {
      // تحكم
      const ix = clamp(input.x, -1, 1), iy = clamp(input.y, -1, 1);
      if (ix) h.face = ix > 0 ? 1 : -1;
      h.tilt = lerp(h.tilt, ix * 0.38 + h.vx * 0.0012, 1 - Math.pow(0.002, dt));
      const massF = 1 / (1 + 0.07 * load / ht.mass);
      let ax = (h.tilt / 0.38) * 200 * massF + wind * 0.9;
      const gEff = 70 * (1 + 0.09 * load / ht.mass);
      // بدون ضغط: تثبت بالجو (والحمولة تنزّلها شوية) — فوگ: تصعد — جوه: تنزل
      let ay = gEff - 70 + (iy < 0 ? -135 * -iy * massF : (iy > 0 ? 95 * iy : 0));
      // سحب الحبل الأفقي
      const dxr = rope.x[1] - rope.x[0], dyr = rope.y[1] - rope.y[0], dl = Math.hypot(dxr, dyr) || 1;
      ax += (dxr / dl) * load * 26;
      // الإعصار يسحب الطيارة ويدوّخها
      if (tor) {
        const d = tor.x - h.x;
        if (Math.abs(d) < 90) {
          const k = 1 - Math.abs(d) / 90; ax += Math.sign(d) * 160 * k + Math.sin(this.t * 9) * 120 * k; ay -= 60 * k;
          h.rot += dt * 8 * k; this.shake = Math.max(this.shake, 2 * k);
          if (!this.flags.tor || this.t - this.flags.tor > 9) { this.flags.tor = this.t; this.radio(pick(RADIO.tornado[lang()])); }
        }
      }
      h.vx += ax * dt; h.vy += ay * dt;
      h.vx *= Math.pow(0.18, dt); h.vy *= Math.pow(0.2, dt);
      h.x += h.vx * dt; h.y += h.vy * dt;
      if (h.x < 14) { h.x = 14; h.vx = Math.abs(h.vx) * 0.3; }
      if (h.x > L.W - 14) { h.x = L.W - 14; h.vx = -Math.abs(h.vx) * 0.3; }
      if (h.y < 14) { h.y = 14; h.vy = Math.max(0, h.vy); }
      if (load >= ht.cap - 1 && !this.flags.heavy) { this.flags.heavy = 1; this.radio(pick(RADIO.heavy[lang()])); }
    } else if (this.state === 'crash') {
      h.vy += 260 * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.tilt += h.rot * dt;
    }

    // ---------------- الحبل (Verlet) ----------------
    const a = this.anchor();
    rope.x[0] = a.x; rope.y[0] = a.y; rope.px[0] = a.x; rope.py[0] = a.y;
    const wY = this.waterY();
    const ropeG = 320;
    for (let i = 1; i < rope.n; i++) {
      const vx = (rope.x[i] - rope.px[i]) * 0.992, vy = (rope.y[i] - rope.py[i]) * 0.992;
      rope.px[i] = rope.x[i]; rope.py[i] = rope.y[i];
      let fx = wind * 0.9, fy = ropeG;
      if (tor && Math.abs(tor.x - rope.x[i]) < 80) { const k = 1 - Math.abs(tor.x - rope.x[i]) / 80; fx += Math.sin(this.t * 7 + i) * 300 * k; fy -= 120 * k; }
      let dampW = 1;
      if (wY !== null && rope.y[i] > wY) { fy -= 260; dampW = 0.9; }
      rope.x[i] += vx * dampW + fx * dt * dt; rope.y[i] += vy * dampW + fy * dt * dt;
    }
    if (this.state === 'crash' && this.flags.cut) { /* الحبل حر */ }
    for (let it = 0; it < 14; it++) {
      for (let i = 0; i < rope.n - 1; i++) {
        const dx = rope.x[i + 1] - rope.x[i], dy = rope.y[i + 1] - rope.y[i], d = Math.hypot(dx, dy);
        if (d <= rope.seg || d === 0) continue;
        const wi = (i === 0 && !this.flags.cut) ? 0 : rope.inv[i], wj = rope.inv[i + 1], ws = wi + wj; if (!ws) continue;
        const diff = (d - rope.seg) / d;
        rope.x[i] += dx * diff * wi / ws; rope.y[i] += dy * diff * wi / ws;
        rope.x[i + 1] -= dx * diff * wj / ws; rope.y[i + 1] -= dy * diff * wj / ws;
      }
      if (it % 3 === 2) for (let i = 1; i < rope.n; i++) this.collidePoint(i);
    }

    // ---------------- الناس ----------------
    for (const p of this.people) this.updatePerson(p, dt, wind);

    // ---------------- اصطدام الطيارة ----------------
    if (alive) {
      const bw = ht.box[0] / 2, bh = ht.box[1] / 2;
      const x0 = h.x - bw, x1 = h.x + bw, y0 = h.y - bh - 3, y1 = h.y + bh + 1;
      let hit = false;
      for (const s of L.solids) if (x1 > s.x && x0 < s.x + s.w && y1 > s.y && y0 < s.y + s.h) { hit = true; break; }
      if (!hit && wY !== null && y1 > wY + 2) hit = 'water';
      if (hit) this.crash(hit === 'water');
    }

    // ---------------- الطقس ----------------
    const wt = this.m.weather;
    if (alive && wt === 'storm') {
      this.nextLightning -= dt;
      if (this.nextLightning <= 0) {
        this.nextLightning = 6 + Math.random() * 9; this.flash = 1; this.shake = Math.max(this.shake, 3);
        const lx = this.camX + Math.random() * VW; this.bolt = { x: lx, t: 0.25, seed: Math.random() * 999 };
        AU.thunder(0.15 + Math.random() * 0.4);
        if (Math.abs(lx - h.x) < 80) this.radio(pick(RADIO.lightning[lang()]));
        // الناس يصرخون
        for (const p of this.people) if (p.st === 'hang' && Math.random() < 0.5) { this.say(p, lang() === 'ar' ? 'يمّه!!' : 'MOMMY!!'); break; }
      }
    }
    this.flash = Math.max(0, this.flash - dt * 3);
    if (this.bolt) { this.bolt.t -= dt; if (this.bolt.t <= 0) this.bolt = null; }

    // ---------------- الجزيئات ----------------
    for (const q of this.parts) {
      q.vx += (q.wind ? wind * 0.6 : 0) * dt; q.vy += (q.g || 0) * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
      if (q.spin) q.a += q.spin * dt;
      if (q.solid && wY !== null && q.y > wY) { q.vy *= -0.2; q.vx *= 0.5; q.y = wY; q.g = 30; }
      if (q.solid && L.groundY && q.y > L.groundY) { q.vy *= -0.3; q.vx *= 0.6; q.y = L.groundY; }
    }
    this.parts = this.parts.filter(q => q.life > 0);

    // ---------------- الوقت والنهاية ----------------
    if (alive) {
      this.timeLeft -= dt;
      if (this.timeLeft < 30 && !this.flags.low) { this.flags.low = 1; this.radio(pick(RADIO.lowTime[lang()])); }
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.end(false, 'timeup'); }
      if (this.saved >= this.goal && this.state === 'play') this.end(true);
      // صياح عشوائي من الناس المنتظرين القريبين
      this.nextShout -= dt;
      if (this.nextShout <= 0) {
        this.nextShout = 1.8 + Math.random() * 2.2;
        const near = this.people.filter(p => (p.st === 'wait' || p.st === 'swim') && Math.abs(p.x - h.x) < VW * 0.6);
        if (near.length) { const p = pick(near); const wy = this.waterY(); const cat = p.st === 'swim' ? 'swim' : (wy !== null && wy - p.y < 12 && L.water.rate ? 'waitWater' : 'wait'); this.say(p, line(cat)); }
        else {
          const hang = this.people.filter(p => p.st === 'hang');
          if (hang.length && Math.random() < 0.6) this.say(pick(hang), line('hang'));
        }
      }
    }
    if (this.state !== 'play') { this.endT += dt; }

    // فقاعات
    for (const b of this.bubbles) {
      b.t += dt; const n = Math.min(b.text.length, Math.floor(b.t * 30));
      if (n > b.shown) { if (n % 2 === 0 && (!b.ent || this.onScreen(b.ent.x))) AU.blip(b.pitch); b.shown = n; }
      if (b.t > b.life) b.dead = true;
    }
    this.bubbles = this.bubbles.filter(b => !b.dead);
    this.shake = Math.max(0, this.shake - dt * 6);
  }
  onScreen(x) { return x > this.camX - 20 && x < this.camX + VW + 20; }

  collidePoint(i) {
    const r = this.rope, x = r.x[i], y = r.y[i];
    for (const s of this.L.solids) {
      if (x > s.x && x < s.x + s.w && y > s.y && y < s.y + s.h) {
        const dl = x - s.x, dr = s.x + s.w - x, dt = y - s.y, db = s.y + s.h - y; const m = Math.min(dl, dr, dt, db);
        const vx = r.x[i] - r.px[i], vy = r.y[i] - r.py[i];
        if (m === dt) { r.y[i] = s.y; r.px[i] = r.x[i] - vx * 0.6; }
        else if (m === dl) { r.x[i] = s.x; r.py[i] = r.y[i] - vy * 0.8; }
        else if (m === dr) { r.x[i] = s.x + s.w; r.py[i] = r.y[i] - vy * 0.8; }
        else { r.y[i] = s.y + s.h; }
        const sp = Math.hypot(vx, vy) * 120;
        if (sp > r.hit[i]) r.hit[i] = sp;
        return;
      }
    }
  }

  /* ---------------- منطق كل شخص ---------------- */
  updatePerson(p, dt, wind) {
    p.f += dt; p.cool -= dt;
    const r = this.rope, h = this.heli, wY = this.waterY();
    if (p.st === 'wait' || p.st === 'swim') {
      // الماي يغطي السطح؟
      if (p.st === 'wait' && wY !== null && wY < p.y - 1) { p.st = 'swim'; AU.splash(); this.splash(p.x, wY, 6); this.say(p, line('swim')); }
      if (p.st === 'swim') { p.y = wY; p.x += Math.sin(this.t * 0.8 + p.id) * 4 * dt + wind * 0.05 * dt; }
      else {
        // يتمشى شوية على السطح
        p.walkT -= dt;
        const near = Math.abs(h.x - p.x) < 140;
        if (!near && p.walkT <= 0) { p.walkT = 1 + Math.random() * 3; p.wdir = Math.random() < 0.4 ? 0 : (Math.random() < 0.5 ? -1 : 1); }
        if (!near && p.wdir) { p.x += p.wdir * 6 * dt; p.face = p.wdir; if (p.x < p.spot.x0 || p.x > p.spot.x1) { p.wdir *= -1; p.x = clamp(p.x, p.spot.x0, p.spot.x1); } }
        if (near) p.face = h.x > p.x ? 1 : -1;
      }
      // مسك الحبل
      const lo = Math.max(1, r.n - 7);
      for (let i = r.n - 1; i >= lo; i--) {
        const d = p.st === 'swim' ? Math.hypot(r.x[i] - p.x, (r.y[i] - (p.y - 2)) * 0.7) : Math.hypot(r.x[i] - p.x, r.y[i] - (p.y - 6));
        if (d < (p.st === 'swim' ? 11 : 8.5)) {
          const slot = this.freeSlot();
          if (slot < 0) { if (p.cool <= 0) { p.cool = 3; this.say(p, line('full')); } break; }
          p.st = 'hang'; p.k = slot; r.occ[slot] = p; r.inv[slot] = 0.28; p.grip = 1; p.cool = 1.5;
          AU.grab(); this.say(p, line('grab'), { force: true });
          if (this.load() >= this.ht.cap - 1) { const bottom = r.occ[r.n - 1]; if (bottom && bottom !== p) setTimeout(() => this.say(bottom, line('heavy'), { force: true }), 700); }
          break;
        }
      }
    }
    else if (p.st === 'hang') {
      const k = p.k; p.x = r.x[k]; p.y = r.y[k];
      const vx = (r.x[k] - r.px[k]) * 120, vy = (r.y[k] - r.py[k]) * 120;
      p.vx = vx; p.vy = vy;
      const rel = Math.hypot(vx - h.vx, vy - h.vy);
      if (rel > 125) p.grip -= (rel - 125) * 0.009 * dt; else p.grip = Math.min(1, p.grip + 0.1 * dt);
      p.hitCool = (p.hitCool || 0) - dt;
      if (r.hit[k] > 85 && p.hitCool <= 0) { // ضربة بالحايط (مرة وحدة كل 1.2 ثانية)
        p.hitCool = 1.2; p.grip -= 0.3; p.cool = 1.2; this.say(p, line('hit'), { force: true }); AU.thud(); this.shake = Math.max(this.shake, 1);
      }
      r.hit[k] = 0;
      if (p.grip < 0.5 && p.cool <= 0) { p.cool = 1.6; this.say(p, line('scared')); }
      if (this.state === 'crash') p.grip = -1;
      if (p.grip <= 0) { this.detach(p); p.st = 'fall'; this.falls++; AU.scream(); this.say(p, line('fall'), { force: true }); if (this.state === 'play') this.radio(pick(RADIO.fell[lang()])); return; }
      // التسليم
      const z = this.zoneAt(p.x, p.y + 10);
      if (z && Math.abs(vx) < 130) {
        this.detach(p); p.st = 'saved'; p.y = z.y; p.zone = z; p.zoneOff = p.x - z.x; p.timer = 0;
        this.onSaved(p);
      }
    }
    else if (p.st === 'fall') {
      p.vy += 300 * dt; p.vx += wind * 0.4 * dt; p.vx *= Math.pow(0.6, dt);
      const ny = p.y + p.vy * dt, nx = p.x + p.vx * dt;
      // هبوط على منطقة إنقاذ
      for (const z of this.zones()) if (nx > z.x && nx < z.x + z.w && p.y <= z.y && ny >= z.y) { p.x = nx; p.y = z.y; p.st = 'saved'; p.zone = z; p.zoneOff = p.x - z.x; p.timer = 0; this.onSaved(p, true); return; }
      for (const s of this.L.solids) {
        if (nx > s.x && nx < s.x + s.w && p.y <= s.y + 1 && ny >= s.y) {
          p.x = nx; p.y = s.y; p.st = 'daze'; p.timer = 2.2; AU.thud(); this.puff(p.x, p.y);
          p.spot = { x0: Math.max(s.x + 3, p.x - 10), x1: Math.min(s.x + s.w - 3, p.x + 10), y: s.y };
          this.say(p, line('landHard'), { force: true }); return;
        }
      }
      if (wY !== null && ny > wY) { p.x = nx; p.y = wY; p.st = 'swim'; AU.splash(); this.splash(p.x, wY, 10); this.say(p, line('landWater'), { force: true }); return; }
      p.x = clamp(nx, 4, this.L.W - 4); p.y = ny;
    }
    else if (p.st === 'daze') {
      p.timer -= dt;
      if (wY !== null && wY < p.y - 1) { p.st = 'swim'; return; }
      if (p.timer <= 0) { p.st = 'wait'; p.cool = 1; }
    }
    else if (p.st === 'saved') {
      p.timer += dt;
      const z = p.zone; if (z.boat) { p.y = z.y; p.x = z.x + clamp(p.zoneOff, 3, z.w - 3); }
      else { p.y = z.y; }
      if (!p.dir) p.dir = Math.random() < 0.5 ? -1 : 1;
      if (p.timer > 2.5 && !z.boat) { p.x += p.dir * 8 * dt; p.face = p.dir; if (p.x < z.x + 3 || p.x > z.x + z.w - 3) p.dir *= -1; }
    }
  }
  freeSlot() {
    const r = this.rope; let used = 0;
    for (let i = r.n - 1; i > 0; i -= 2) { if (!r.occ[i]) { if (used < this.ht.cap) return i; } else used++; if (used >= this.ht.cap) return -1; }
    return -1;
  }
  detach(p) { const r = this.rope; if (p.k >= 0) { r.occ[p.k] = null; r.inv[p.k] = 1; } p.k = -1; }
  zones() {
    const out = [];
    for (const pd of this.L.pads) out.push({ x: pd.x, y: pd.y, w: pd.w, pad: true });
    const wY = this.waterY();
    if (wY !== null) for (const b of this.L.boats) { b.zone = b.zone || { boat: true }; Object.assign(b.zone, { x: b.x, y: wY - 3 + Math.sin(this.t * 1.6 + b.ph) * 1.2, w: b.w }); out.push(b.zone); }
    return out;
  }
  zoneAt(x, y) { for (const z of this.zones()) if (x > z.x + 1 && x < z.x + z.w - 1 && y > z.y - 6 && y < z.y + 14) return z; return null; }
  onSaved(p, fell) {
    this.saved++; AU.saved();
    this.say(p, fell ? line('landZone') : line('saved'), { force: true });
    for (let i = 0; i < 12; i++) this.parts.push({ x: p.x, y: p.y - 8, vx: (Math.random() - 0.5) * 60, vy: -40 - Math.random() * 50, g: 120, life: 0.9, c: i % 2 ? '#c9a84c' : '#ebe1c8', s: 1 });
    if (!this.flags.firstSave) { this.flags.firstSave = 1; this.radio(pick(RADIO.firstSave[lang()])); }
    updateHUD(true);
  }
  splash(x, y, n) { for (let i = 0; i < n; i++) this.parts.push({ x, y, vx: (Math.random() - 0.5) * 50, vy: -30 - Math.random() * 60, g: 220, life: 0.7, c: this.L.P.waterL, s: 1 }); }
  puff(x, y) { for (let i = 0; i < 8; i++) this.parts.push({ x, y, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 15, g: 10, life: 0.6, c: this.L.P.edge, s: 1 }); }

  crash(water) {
    if (this.state !== 'play') return;
    this.state = 'crash'; this.crashes++; this.shake = 6; this.flash = 0.6;
    const h = this.heli; h.rot = (Math.random() < 0.5 ? -1 : 1) * 4; h.vx *= 0.3; h.vy = -60;
    AU.boom(); if (water) AU.splash();
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2, sp = 30 + Math.random() * 140;
      this.parts.push({ x: h.x, y: h.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, g: i % 3 ? 200 : -10, life: 0.6 + Math.random() * 1.6, c: i % 4 === 0 ? '#c8323c' : (i % 3 ? '#ebe1c8' : '#555'), s: i % 5 === 0 ? 3 : 1, solid: true, spin: (Math.random() - 0.5) * 20, a: 0 });
    }
    for (let i = 0; i < 25; i++) this.parts.push({ x: h.x, y: h.y, vx: (Math.random() - 0.5) * 30, vy: -10 - Math.random() * 30, g: -15, life: 2 + Math.random() * 2, c: 'rgba(90,85,78,0.6)', s: 4, smoke: true, wind: true });
    this.flags.cut = true;
    // كل المعلّقين يطيحون (بس بخير — هاي لعبة مضحكة 😄)
    for (const p of this.people) if (p.st === 'hang') { this.detach(p); p.st = 'fall'; p.vy = -60 - Math.random() * 60; p.vx = (Math.random() - 0.5) * 120; }
    this.crashLine = line('crash');
    this.say({ x: h.x, y: h.y - 10, id: 999 }, this.crashLine, { force: true, big: true, life: 4, pitch: 180 });
    setTimeout(() => { if (G === this) this.end(false, 'crashed'); }, 2600);
  }
  end(win, why) {
    if (this.state === 'win' || this.state === 'fail') return;
    const wasCrash = this.state === 'crash';
    this.state = win ? 'win' : 'fail'; this.why = why;
    if (win) {
      AU.win();
      let stars = 1; if (this.falls === 0) stars++; if (this.timeLeft > this.m.time * 0.35) stars++;
      this.stars = stars; save.stars[this.m.id] = Math.max(save.stars[this.m.id] || 0, stars); persist();
      this.radio(pick(RADIO.win[lang()]));
      setTimeout(() => G === this && showResult(this), 1800);
    } else {
      if (!wasCrash) AU.fail();
      setTimeout(() => G === this && showResult(this), wasCrash ? 200 : 1200);
    }
  }

  /* ============================================================
     الرسم
     ============================================================ */
  render() {
    const L = this.L, P = L.P, h = this.heli;
    // الكاميرا
    const target = clamp(h.x - VW / 2 + h.vx * 0.5, 0, Math.max(0, L.W - VW));
    this.camX = lerp(this.camX, target, 0.08);
    const sx = this.shake ? (Math.random() - 0.5) * this.shake : 0, sy = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const cam = Math.round(this.camX + sx);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    // السماء
    const gr = ctx.createLinearGradient(0, 0, 0, CH); gr.addColorStop(0, P.sky); gr.addColorStop(1, P.sky2);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, CW, CH);
    ctx.setTransform(S, 0, 0, S, 0, Math.round(sy * S));
    // النجوم
    if (P.star) {
      ctx.fillStyle = P.star;
      for (const st of L.stars) { if ((st.b + this.t * 0.3) % 1 < 0.08) continue; const x = ((st.x * (VW + 200) - cam * 0.04) % (VW + 200) + VW + 200) % (VW + 200) - 100; ctx.globalAlpha = 0.4 + st.b * 0.6; ctx.fillRect(Math.round(x), Math.round(st.y * VH), 1, 1); }
      ctx.globalAlpha = 1;
    }
    // القمر/الشمس
    this.drawMoon(Math.round(VW * 0.18 - cam * 0.02), 44, P);
    // الطبقات
    ctx.drawImage(L.layers.far, -Math.round(cam * 0.3), 0);
    ctx.drawImage(L.layers.mid, -Math.round(cam * 0.6), 0);
    if (this.m.weather === 'sand') { ctx.fillStyle = 'rgba(150,110,60,0.22)'; ctx.fillRect(0, 0, VW, VH); }
    ctx.drawImage(L.layers.fg, -cam, 0);
    ctx.save(); ctx.translate(-cam, 0);

    // البرق
    if (this.bolt) this.drawBolt(this.bolt);
    // المهابط
    for (const pd of L.pads) this.drawPad(pd, P);
    // الإعصار
    if (L.tornado) this.drawTornado(L.tornado, P);
    // الناس (غير المعلّقين)
    for (const p of this.people) if (p.st !== 'hang' && p.st !== 'swim') this.drawPerson(p, P);
    // الحبل
    this.drawRope(P);
    for (const p of this.people) if (p.st === 'hang') this.drawPerson(p, P);
    // الطيارة
    if (!(this.state === 'crash' && this.endT > 0.05)) this.drawHeli();
    else this.drawWreck();
    // الماي
    if (L.water) this.drawWater(cam, P);
    for (const p of this.people) if (p.st === 'swim') this.drawPerson(p, P);
    // القوارب
    for (const b of L.boats) this.drawBoat(b, P);
    for (const p of this.people) if (p.st === 'saved' && p.zone && p.zone.boat) this.drawPerson(p, P);
    // جزيئات
    for (const q of this.parts) {
      ctx.globalAlpha = q.smoke ? Math.min(1, q.life) * 0.7 : Math.min(1, q.life * 2);
      ctx.fillStyle = q.c; ctx.fillRect(Math.round(q.x), Math.round(q.y), q.s, q.s);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // الطقس فوگ كلشي
    this.drawWeather(cam);
    if (this.flash > 0) { ctx.fillStyle = `rgba(240,235,220,${this.flash * 0.6})`; ctx.fillRect(0, 0, VW, VH); }
    // تظليل الحواف
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const vg = ctx.createRadialGradient(CW / 2, CH / 2, CH * 0.35, CW / 2, CH / 2, CH * 0.95);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, P.isDay ? 'rgba(40,36,30,0.25)' : 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, CW, CH);
    // مؤشرات الناس خارج الشاشة
    this.drawIndicators(cam);
    // الفقاعات (نص واضح بدقة الشاشة)
    this.drawBubbles(cam);
  }
  drawMoon(x, y, P) {
    const r = 17;
    for (let yy = -r; yy <= r; yy++) { const hw = Math.round(Math.sqrt(r * r - yy * yy)); ctx.fillStyle = P.moon; ctx.fillRect(x - hw, y + yy, hw * 2, 1); }
    if (!P.isDay) { ctx.fillStyle = P.moonD; const cr = [[-6, -5, 4], [4, 2, 5], [-3, 7, 3], [7, -7, 2], [-9, 3, 2]]; for (const [cx, cy, rr] of cr) for (let yy = -rr; yy <= rr; yy++) { const hw = Math.round(Math.sqrt(rr * rr - yy * yy)); for (let xx = -hw; xx < hw; xx++) if ((xx + yy) & 1) ctx.fillRect(x + cx + xx, y + cy + yy, 1, 1); } }
  }
  drawPad(pd, P) {
    const c = P.isDay ? '#f4f1ea' : '#ebe1c8';
    ctx.fillStyle = '#c8323c'; ctx.fillRect(Math.round(pd.x), pd.y - 1, pd.w, 1);
    const cx = Math.round(pd.x + pd.w / 2), y = pd.y - 1;
    // علم صغير يرفرف
    ctx.fillStyle = P.edge; ctx.fillRect(Math.round(pd.x) + 1, y - 14, 1, 14);
    ctx.fillStyle = '#c8323c'; const fl = Math.sin(this.t * 6) > 0 ? 5 : 4; ctx.fillRect(Math.round(pd.x) + 2, y - 14, fl, 3);
    // سهم وأضواء
    const blink = Math.sin(this.t * 5) > 0;
    ctx.fillStyle = blink ? '#c9a84c' : c; ctx.fillRect(Math.round(pd.x), y - 2, 2, 1); ctx.fillRect(Math.round(pd.x + pd.w) - 2, y - 2, 2, 1);
    ctx.fillStyle = c; ctx.fillRect(cx - 3, y - 6, 1, 4); ctx.fillRect(cx + 2, y - 6, 1, 4); ctx.fillRect(cx - 2, y - 4, 4, 1);
    // إطار أحمر يدل على الهدف (مثل الفيديو)
    const a = 0.5 + 0.5 * Math.sin(this.t * 4); ctx.globalAlpha = a; ctx.fillStyle = '#c8323c';
    const bx = Math.round(pd.x) - 4, by = y - 26, bw = pd.w + 8, bh = 30;
    ctx.fillRect(bx, by, 5, 1); ctx.fillRect(bx, by, 1, 5); ctx.fillRect(bx + bw - 5, by, 5, 1); ctx.fillRect(bx + bw - 1, by, 1, 5);
    ctx.fillRect(bx, by + bh, 5, 1); ctx.fillRect(bx, by + bh - 4, 1, 5); ctx.fillRect(bx + bw - 5, by + bh, 5, 1); ctx.fillRect(bx + bw - 1, by + bh - 4, 1, 5);
    ctx.globalAlpha = 1;
  }
  drawBoat(b, P) {
    const z = b.zone; if (!z) return;
    const x = Math.round(z.x), y = Math.round(z.y), w = b.w; const K = '#121110', C = '#ebe1c8', Rr = '#c8323c';
    if (b.kind === 'ship') {
      ctx.fillStyle = K; ctx.fillRect(x - 2, y, w + 6, 7); ctx.fillStyle = C; ctx.fillRect(x - 1, y + 1, w + 4, 2); ctx.fillStyle = Rr; ctx.fillRect(x, y + 4, w + 2, 1);
      ctx.fillStyle = K; ctx.fillRect(x + w - 16, y - 10, 14, 10); ctx.fillStyle = C; ctx.fillRect(x + w - 15, y - 9, 12, 3); ctx.fillStyle = K; ctx.fillRect(x + w - 12, y - 16, 4, 6);
    } else if (b.kind === 'felucca') {
      ctx.fillStyle = K; ctx.fillRect(x, y, w, 4); ctx.fillRect(x - 2, y - 1, 3, 2); ctx.fillRect(x + w - 1, y - 2, 3, 2); ctx.fillStyle = C; ctx.fillRect(x + 1, y + 1, w - 2, 1);
      ctx.fillStyle = K; ctx.fillRect(x + w / 2, y - 30, 1, 30);
      ctx.fillStyle = C; for (let i = 0; i < 26; i++) ctx.fillRect(x + w / 2 - i * 0.7, y - 30 + i, Math.max(1, i * 0.7), 1);
    } else {
      ctx.fillStyle = K; ctx.fillRect(x, y, w, 5); ctx.fillRect(x - 2, y - 1, 3, 3); ctx.fillRect(x + w - 1, y - 1, 3, 3);
      ctx.fillStyle = Rr; ctx.fillRect(x + 1, y + 1, w - 2, 2); ctx.fillStyle = C; ctx.fillRect(x + 1, y + 1, w - 2, 1);
      ctx.fillStyle = K; ctx.fillRect(x + 4, y - 6, 9, 6); ctx.fillStyle = C; ctx.fillRect(x + 5, y - 5, 7, 2);
      // ضوء أحمر يرمش
      if (Math.sin(this.t * 4 + b.ph) > 0.3) { ctx.fillStyle = Rr; ctx.fillRect(x + 8, y - 8, 1, 2); }
    }
    // إطار الهدف
    const a = 0.45 + 0.45 * Math.sin(this.t * 4); ctx.globalAlpha = a; ctx.fillStyle = '#c8323c';
    const bx = x - 5, by = y - 22, bw = w + 10, bh = 28;
    ctx.fillRect(bx, by, 5, 1); ctx.fillRect(bx, by, 1, 5); ctx.fillRect(bx + bw - 5, by, 5, 1); ctx.fillRect(bx + bw - 1, by, 1, 5);
    ctx.fillRect(bx, by + bh, 5, 1); ctx.fillRect(bx, by + bh - 4, 1, 5); ctx.fillRect(bx + bw - 5, by + bh, 5, 1); ctx.fillRect(bx + bw - 1, by + bh - 4, 1, 5);
    ctx.globalAlpha = 1;
  }
  drawRope(P) {
    const r = this.rope; ctx.fillStyle = P.isDay ? '#2a2723' : '#e3d8bd';
    for (let i = 0; i < r.n - 1; i++) {
      const x0 = r.x[i], y0 = r.y[i], x1 = r.x[i + 1], y1 = r.y[i + 1]; const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
      for (let k = 0; k < n; k++) ctx.fillRect(Math.round(x0 + (x1 - x0) * k / n), Math.round(y0 + (y1 - y0) * k / n), 1, 1);
    }
    // سلّم صغير بالنهاية
    const e = r.n - 1; ctx.fillRect(Math.round(r.x[e]) - 2, Math.round(r.y[e]), 5, 1);
  }
  drawPerson(p, P) {
    ctx.fillStyle = P.person;
    const fr = Math.floor(p.f * 6) % 2, x = p.x, y = Math.round(p.y);
    if (p.st === 'wait') {
      const near = Math.abs(this.heli.x - p.x) < 140 && this.state === 'play';
      if (near) { const jump = (Math.floor(p.f * 5) % 3 === 0) ? -1 : 0; px(POSE.head, x, y + jump); px(fr ? POSE.waveA : POSE.waveB, x, y + jump, p.face); }
      else { px(POSE.head, x, y); px(POSE.stand, x, y, p.face); if (p.wdir) { ctx.clearRect; } }
    } else if (p.st === 'hang') {
      px(POSE.hang, x, y);
      const sw = clamp(Math.round(-p.vx * 0.02), -2, 2), kick = Math.floor(p.f * (p.grip < 0.5 ? 14 : 4)) % 2;
      ctx.fillRect(Math.round(x - 1 + sw), y + 9, 1, 3); ctx.fillRect(Math.round(x + 1 + sw + (kick ? 1 : 0)), y + 9, 1, 3 - kick);
      if (p.grip < 0.45) { ctx.fillStyle = '#c8323c'; if (fr) ctx.fillRect(Math.round(x + 2), y + 2, 1, 2); ctx.fillStyle = P.person; }
    } else if (p.st === 'fall') {
      px(POSE.head, x, y); px(fr ? POSE.fallA : POSE.fallB, x, y);
    } else if (p.st === 'swim') {
      const by = y + (Math.sin(this.t * 3 + p.id) > 0 ? 0 : 1); px(fr ? POSE.swimA : POSE.swimB, x, by);
      ctx.fillStyle = P.waterL; ctx.fillRect(Math.round(x) - 4, y, 9, 1);
    } else if (p.st === 'daze') {
      px(POSE.sit, x, y);
      ctx.fillStyle = '#c9a84c'; const a = this.t * 6; ctx.fillRect(Math.round(x + Math.cos(a) * 4), Math.round(y - 11 + Math.sin(a) * 1.5), 1, 1); ctx.fillRect(Math.round(x + Math.cos(a + 3.14) * 4), Math.round(y - 11 + Math.sin(a + 3.14) * 1.5), 1, 1);
    } else if (p.st === 'saved') {
      const cheering = p.timer < 2.5 || (p.zone && p.zone.boat);
      if (cheering) { const jump = Math.floor(p.timer * 6) % 2 ? -2 : 0; px(POSE.head, x, y + jump); px(fr ? POSE.waveA : POSE.waveB, x, y + jump, p.face); }
      else { px(POSE.head, x, y); px(fr ? POSE.stand : POSE.waveB, x, y, p.face); }
    }
  }
  drawHeli() {
    const h = this.heli, ht = this.ht, spr = SPR[this.m.heli];
    ctx.save(); ctx.translate(Math.round(h.x), Math.round(h.y)); ctx.rotate(h.tilt); ctx.scale(h.face, 1);
    ctx.drawImage(spr, -ht.cx, -ht.cy);
    // الدوّارات
    for (const [rx, ry, len] of ht.rotors) {
      const ph = this.t * 38 + rx, hl = Math.abs(Math.cos(ph)) * len;
      const X = rx - ht.cx, Y = ry - ht.cy - 1;
      ctx.globalAlpha = 0.25; ctx.fillStyle = '#9a927f'; ctx.fillRect(X - len, Y, len * 2, 1); ctx.globalAlpha = 1;
      ctx.fillStyle = '#121110'; ctx.fillRect(Math.round(X - hl), Y, Math.round(hl * 2), 1);
      ctx.fillStyle = '#ebe1c8'; ctx.fillRect(Math.round(X - hl), Y, 2, 1);
    }
    // ضوء أحمر
    if (Math.sin(this.t * 8) > 0.6) { ctx.fillStyle = '#ff4a4a'; ctx.fillRect(-ht.cx + 1, -ht.cy + 1, 1, 1); }
    ctx.restore();
  }
  drawWreck() {
    const h = this.heli, spr = SPR[this.m.heli], ht = this.ht;
    ctx.save(); ctx.translate(Math.round(h.x), Math.round(h.y)); ctx.rotate(h.tilt); ctx.scale(h.face, 1); ctx.globalAlpha = 0.85;
    ctx.drawImage(spr, 0, 0, ht.w / 2, ht.h, -ht.cx - 4, -ht.cy, ht.w / 2, ht.h);
    ctx.drawImage(spr, ht.w / 2, 0, ht.w / 2, ht.h, 4, -ht.cy + 3, ht.w / 2, ht.h);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  drawWater(cam, P) {
    const wy = Math.round(this.L.water.y);
    ctx.fillStyle = P.water; ctx.fillRect(cam - 2, wy, VW + 4, VH - wy + 10);
    ctx.fillStyle = P.waterL;
    for (let x = Math.floor(cam / 3) * 3; x < cam + VW + 3; x += 3) {
      const yy = wy + Math.round(Math.sin(x * 0.08 + this.t * 2) * 1.2);
      ctx.fillRect(x, yy, 2, 1);
    }
    ctx.globalAlpha = 0.35;
    for (let row = 4; row < VH - wy; row += 5) {
      for (let x = Math.floor(cam / 7) * 7 + (row % 2) * 3; x < cam + VW; x += 7) {
        const o = Math.sin(x * 0.05 + row + this.t * 1.5) * 2; if (((x + row) * 13) % 5 > 1) continue;
        ctx.fillRect(Math.round(x + o), wy + row, 3, 1);
      }
    }
    // انعكاس القمر
    if (!P.isDay) { const mx = Math.round(VW * 0.18 + cam * 0.98); for (let k = 0; k < 10; k++) ctx.fillRect(mx - 6 + Math.sin(k + this.t * 3) * 3, wy + 3 + k * 3, 12 - k, 1); }
    ctx.globalAlpha = 1;
  }
  drawTornado(tor, P) {
    const base = GROUND_Y - 10;
    ctx.fillStyle = P.isDay ? '#3d3934' : '#d9cfb8';
    for (let i = 0; i < 28; i++) {
      const y = base - i * 9, r = 5 + i * 1.6, ph = this.t * 6 + i * 0.5;
      const cx = tor.x + Math.sin(this.t * 1.3 + i * 0.15) * i * 0.6;
      ctx.globalAlpha = 0.35 + (i % 3) * 0.12;
      for (let a = 0; a < 6.28; a += 0.18) { const xx = cx + Math.cos(a + ph) * r, yy = y + Math.sin(a + ph) * r * 0.18; if (Math.sin(a + ph) > -0.2) ctx.fillRect(Math.round(xx), Math.round(yy), 1, 1); }
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 3; i++) { const a = this.t * 4 + i * 2; ctx.fillStyle = '#c8323c'; ctx.fillRect(Math.round(tor.x + Math.cos(a) * 20), Math.round(base - 60 - i * 40 + Math.sin(a) * 3), 2, 1); }
  }
  drawBolt(b) {
    const r = mulberry(b.seed | 0); let x = b.x, y = 0; ctx.fillStyle = '#f4efe0';
    while (y < GROUND_Y) { const nx = x + (r() - 0.5) * 14, ny = y + 6 + r() * 10; const n = Math.ceil(Math.hypot(nx - x, ny - y)); for (let k = 0; k < n; k++) ctx.fillRect(Math.round(x + (nx - x) * k / n), Math.round(y + (ny - y) * k / n), 1, 1); x = nx; y = ny; }
  }
  drawWeather(cam) {
    const wt = this.m.weather, wind = this.windAt(this.t);
    const raining = wt === 'rain' || wt === 'storm' || (this.m.style === 'mountain');
    if (raining) {
      if (this.rain.length < 220) for (let i = 0; i < 220; i++) this.rain.push({ x: Math.random() * VW, y: Math.random() * VH, s: 160 + Math.random() * 120 });
      ctx.fillStyle = this.L.P.isDay ? 'rgba(40,40,40,0.5)' : 'rgba(220,214,196,0.45)';
      const dt = 1 / 60;
      for (const d of this.rain) {
        d.y += d.s * dt; d.x += wind * 2.4 * dt; if (d.y > VH) { d.y = -6; d.x = Math.random() * VW; } if (d.x > VW) d.x -= VW; if (d.x < 0) d.x += VW;
        const len = 5, sl = wind * 0.04;
        for (let k = 0; k < len; k++) ctx.fillRect(Math.round(d.x + sl * k), Math.round(d.y + k), 1, 1);
      }
    }
    if (wt === 'sand' || wt === 'wind') {
      if (this.dust.length < 160) for (let i = 0; i < 160; i++) this.dust.push({ x: Math.random() * VW, y: Math.random() * VH, s: 0.5 + Math.random() });
      ctx.fillStyle = wt === 'sand' ? 'rgba(210,170,110,0.55)' : 'rgba(230,220,200,0.35)';
      for (const d of this.dust) { d.x += (wind * 4 * d.s + 30) / 60; d.y += Math.sin(this.t * 2 + d.x * 0.05) * 0.2; if (d.x > VW) d.x = 0; if (d.x < 0) d.x = VW; ctx.fillRect(Math.round(d.x), Math.round(d.y), wt === 'sand' ? 2 : 3, 1); }
      if (wt === 'sand') { const a = 0.18 + 0.08 * Math.sin(this.t * 0.6); ctx.fillStyle = `rgba(160,120,70,${a})`; ctx.fillRect(0, 0, VW, VH); }
    }
  }
  drawIndicators(cam) {
    if (this.state !== 'play') return;
    let left = 0, right = 0;
    for (const p of this.people) if (p.st === 'wait' || p.st === 'swim' || p.st === 'daze') { if (p.x < cam - 4) left++; else if (p.x > cam + VW + 4) right++; }
    const fs = Math.round(Math.max(13, 6 * S));
    ctx.font = `bold ${fs}px Tahoma, "Segoe UI", Arial`; ctx.textBaseline = 'middle';
    const y = CH * 0.5, pulse = 0.6 + 0.4 * Math.sin(this.t * 5);
    ctx.globalAlpha = pulse;
    if (left) { ctx.fillStyle = '#c8323c'; ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(10 + fs, y - fs * 0.7); ctx.lineTo(10 + fs, y + fs * 0.7); ctx.fill(); ctx.fillStyle = '#ebe1c8'; ctx.textAlign = 'left'; ctx.fillText('×' + left, 14 + fs, y); }
    if (right) { ctx.fillStyle = '#c8323c'; ctx.beginPath(); ctx.moveTo(CW - 10, y); ctx.lineTo(CW - 10 - fs, y - fs * 0.7); ctx.lineTo(CW - 10 - fs, y + fs * 0.7); ctx.fill(); ctx.fillStyle = '#ebe1c8'; ctx.textAlign = 'right'; ctx.fillText('×' + right, CW - 14 - fs, y); }
    ctx.globalAlpha = 1;
    // مؤشر المنطقة إذا مخفية
    const zs = this.zones(); const cz = this.load() > 0 ? zs.reduce((a, z) => !a || Math.abs(z.x - this.heli.x) < Math.abs(a.x - this.heli.x) ? z : a, null) : null;
    if (cz && (cz.x + cz.w < cam || cz.x > cam + VW)) {
      const onL = cz.x < cam; const yy = CH * 0.68; ctx.fillStyle = '#c9a84c';
      ctx.beginPath(); if (onL) { ctx.moveTo(10, yy); ctx.lineTo(10 + fs, yy - fs * 0.7); ctx.lineTo(10 + fs, yy + fs * 0.7); } else { ctx.moveTo(CW - 10, yy); ctx.lineTo(CW - 10 - fs, yy - fs * 0.7); ctx.lineTo(CW - 10 - fs, yy + fs * 0.7); } ctx.fill();
      ctx.textAlign = onL ? 'left' : 'right'; ctx.fillText(cz.boat ? '⛵' : 'H', onL ? 14 + fs : CW - 14 - fs, yy);
    }
  }
  drawBubbles(cam) {
    const isAr = lang() === 'ar';
    for (const b of this.bubbles) {
      const e = b.ent; if (!e) continue;
      const fs = Math.round(Math.max(12, (b.big ? 9 : 6.2) * S));
      ctx.font = `bold ${fs}px Tahoma, "Segoe UI", Arial`;
      ctx.direction = isAr ? 'rtl' : 'ltr';
      const txt = b.text.slice(0, Math.max(1, b.shown));
      const full = ctx.measureText(b.text).width;
      const padX = fs * 0.55, bw = full + padX * 2, bh = fs * 1.6;
      let ex = (e.x - cam) * S, ey = (e.y - (e.st === 'hang' ? -2 : 16)) * S;
      if (e.st === 'swim') ey = (e.y - 8) * S;
      let bx = ex - bw / 2 + (e.st === 'hang' ? bw / 2 + 10 : 0), by = ey - bh - 8;
      if (b.big) { bx = CW / 2 - bw / 2; by = CH * 0.4; }
      bx = clamp(bx, 6, CW - bw - 6); by = clamp(by, 6, CH - bh - 6);
      const alpha = Math.min(1, (b.life - b.t) * 3, b.t * 10);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(10,9,8,0.92)'; ctx.fillRect(bx, by, bw, bh);
      const lw = Math.max(1, Math.round(S * 0.6));
      ctx.fillStyle = b.big ? '#c8323c' : '#ebe1c8';
      ctx.fillRect(bx, by, bw, lw); ctx.fillRect(bx, by + bh - lw, bw, lw); ctx.fillRect(bx, by, lw, bh); ctx.fillRect(bx + bw - lw, by, lw, bh);
      // الذيل
      if (!b.big) { const tx = clamp(ex, bx + 8, bx + bw - 8); ctx.beginPath(); ctx.moveTo(tx - 5, by + bh); ctx.lineTo(tx + 5, by + bh); ctx.lineTo(clamp(ex, tx - 10, tx + 10), by + bh + 8); ctx.fill(); }
      ctx.fillStyle = '#ebe1c8'; ctx.textBaseline = 'middle';
      if (isAr) { ctx.textAlign = 'right'; ctx.fillText(txt, bx + bw - padX, by + bh / 2 + 1); }
      else { ctx.textAlign = 'left'; ctx.fillText(txt, bx + padX, by + bh / 2 + 1); }
      // نقطة الكلام ♦ مثل الفيديو
      ctx.globalAlpha = 1;
    }
    ctx.direction = 'ltr';
  }
}

/* ============================================================
   الراديو و HUD
   ============================================================ */
let radioTimer = 0;
function showRadio(text) {
  const el = $('#radio'); el.textContent = ''; el.classList.add('show');
  let i = 0; clearInterval(showRadio.iv);
  showRadio.iv = setInterval(() => { i++; el.textContent = '📻 ' + text.slice(0, i); if (i % 3 === 0) AU.blip(180); if (i >= text.length) clearInterval(showRadio.iv); }, 32);
  clearTimeout(radioTimer); radioTimer = setTimeout(() => el.classList.remove('show'), 3200 + text.length * 40);
}
function fmtTime(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
let hudLast = '';
function updateHUD(pop) {
  if (!G) return;
  const m = G.m;
  $('#hudCity').textContent = m.city[lang()] + ' — ' + m.name[lang()];
  $('#hudSaved').textContent = G.saved + ' / ' + G.goal;
  $('#hudRope').textContent = G.load() + ' / ' + G.ht.cap;
  const tl = $('#hudTime'); tl.textContent = fmtTime(G.timeLeft); tl.classList.toggle('low', G.timeLeft < 30);
  if (pop) { const e = $('#hudSavedBox'); e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); }
}

/* ============================================================
   الحلقة الرئيسية
   ============================================================ */
let lastT = performance.now(), acc = 0, paused = false;
const FIXED = 1 / 120;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  pollGamepad();
  if (G && !paused) {
    acc += dt;
    while (acc >= FIXED) { G.step(FIXED); acc -= FIXED; }
    G.render();
    updateHUD();
    const h = G.heli; const sp = Math.min(1, Math.hypot(h.vx, h.vy) / 120);
    AU.rotor(G.state === 'play' ? 0.55 + sp * 0.3 : (G.state === 'win' ? 0.4 : 0), sp + (input.y < 0 ? 0.6 : 0));
    AU.rain(['rain', 'storm'].includes(G.m.weather) || G.m.style === 'mountain' ? 1 : 0);
  } else if (G && paused) { G.render(); }
  else { AU.rotor(0, 0); AU.rain(0); }
  if (!G) drawMenuBg(dt);
}
requestAnimationFrame(frame);

/* خلفية القوائم: طيارة تطير فوگ مدينة */
let menuT = 0, menuLvl = null;
function drawMenuBg(dt) {
  menuT += dt;
  if (!menuLvl) { menuLvl = buildLevel(Object.assign({}, MISSIONS[3], { id: 'menu', people: 0 })); }
  const L = menuLvl, P = L.P;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = P.sky; ctx.fillRect(0, 0, CW, CH);
  ctx.setTransform(S, 0, 0, S, 0, 0);
  const cam = Math.round((menuT * 14) % Math.max(1, L.W - VW));
  ctx.fillStyle = P.star; for (const st of L.stars) { ctx.globalAlpha = 0.3 + st.b * 0.6; ctx.fillRect(Math.round(st.x * VW), Math.round(st.y * VH), 1, 1); } ctx.globalAlpha = 1;
  const r = 17, mx = Math.round(VW * 0.78), my = 50; for (let yy = -r; yy <= r; yy++) { const hw = Math.round(Math.sqrt(r * r - yy * yy)); ctx.fillStyle = P.moon; ctx.fillRect(mx - hw, my + yy, hw * 2, 1); }
  ctx.drawImage(L.layers.far, -Math.round(cam * 0.3), 0); ctx.drawImage(L.layers.mid, -Math.round(cam * 0.6), 0); ctx.drawImage(L.layers.fg, -cam, 0);
  // طيارة القائمة
  const hx = VW * 0.5 + Math.sin(menuT * 0.5) * VW * 0.2, hy = 70 + Math.sin(menuT * 1.3) * 8, ht = HELI_TYPES.small;
  ctx.save(); ctx.translate(Math.round(hx), Math.round(hy)); ctx.rotate(Math.cos(menuT * 0.5) * 0.15); ctx.drawImage(SPR.small, -ht.cx, -ht.cy);
  const hl = Math.abs(Math.cos(menuT * 38)) * 21; ctx.fillStyle = '#121110'; ctx.fillRect(Math.round(-hl), -ht.cy - 1, Math.round(hl * 2), 1); ctx.restore();
  ctx.fillStyle = '#e3d8bd'; for (let i = 0; i < 40; i++) ctx.fillRect(Math.round(hx + 1 + Math.sin(menuT * 2 + i * 0.1) * i * 0.15), Math.round(hy + 6 + i), 1, 1);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = document.querySelector('#map.on') ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, CW, CH);
}

/* ============================================================
   التحكم: كيبورد، لمس، يد تحكم
   ============================================================ */
function recomputeKeys() {
  const k = input.keys;
  if (touch.active) return;
  input.x = (k.ArrowRight || k.KeyD ? 1 : 0) - (k.ArrowLeft || k.KeyA ? 1 : 0);
  input.y = (k.ArrowDown || k.KeyS ? 1 : 0) - (k.ArrowUp || k.KeyW || k.Space ? 1 : 0);
}
addEventListener('keydown', e => {
  AU.init();
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  input.keys[e.code] = true; recomputeKeys();
  if (G && (e.code === 'KeyP' || e.code === 'Escape')) togglePause();
  if (G && e.code === 'KeyR' && !e.repeat) restartMission();
  if (e.code === 'F11' && window.ibra && window.ibra.toggleFullscreen) { e.preventDefault(); window.ibra.toggleFullscreen(); }
});
addEventListener('keyup', e => { input.keys[e.code] = false; recomputeKeys(); });
addEventListener('blur', () => { input.keys = {}; recomputeKeys(); if (G && G.state === 'play' && !paused) togglePause(); });

const touch = { active: false, id: null, ox: 0, oy: 0 };
const stick = $('#stick'), knob = $('#knob');
cv.addEventListener('pointerdown', e => {
  AU.init();
  if (!G || e.pointerType === 'mouse') return;
  touch.active = true; touch.id = e.pointerId; touch.ox = e.clientX; touch.oy = e.clientY;
  stick.style.left = (e.clientX - 60) + 'px'; stick.style.top = (e.clientY - 60) + 'px'; stick.classList.add('show'); knob.style.transform = 'translate(0,0)';
  cv.setPointerCapture(e.pointerId);
});
cv.addEventListener('pointermove', e => {
  if (!touch.active || e.pointerId !== touch.id) return;
  let dx = e.clientX - touch.ox, dy = e.clientY - touch.oy; const d = Math.hypot(dx, dy), max = 50;
  if (d > max) { dx *= max / d; dy *= max / d; }
  knob.style.transform = `translate(${dx}px,${dy}px)`;
  input.x = Math.abs(dx) > 8 ? dx / max : 0; input.y = Math.abs(dy) > 8 ? dy / max : 0;
});
const endTouch = e => { if (e.pointerId !== touch.id) return; touch.active = false; input.x = input.y = 0; stick.classList.remove('show'); };
cv.addEventListener('pointerup', endTouch); cv.addEventListener('pointercancel', endTouch);

function pollGamepad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : []; const gp = pads && pads[0];
  if (!gp || touch.active) return;
  const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
  if (Math.abs(ax) > 0.2 || Math.abs(ay) > 0.2) { input.x = Math.abs(ax) > 0.2 ? ax : 0; input.y = Math.abs(ay) > 0.2 ? ay : 0; input.gp = true; }
  else if (input.gp) { input.gp = false; recomputeKeys(); }
  if (gp.buttons[0] && gp.buttons[0].pressed) input.y = -1;
  const st = gp.buttons[9] && gp.buttons[9].pressed; if (st && !pollGamepad.st && G) togglePause(); pollGamepad.st = st;
}
