'use strict';
/* ============================================================
   📖 نمط القصة — «سعدون وغيمة بغداد»
   ------------------------------------------------------------
   10 فصول. كل فصل: لوحات كومكس (مقدمة) ← مهمات ← لوحات (ختام).
   اللوحة: { scene, chars: [[شخصية, x (0-1), flip?]], lines: [[منو, عربي, إنكليزي]], cap: [عربي, إنكليزي] }
   منو: مفتاح شخصية موجودة باللوحة، أو 'radio' (كلام بالراديو)، أو 'phone:<شخصية>' (مكالمة)، أو 'cap' (راوي)
   القصة الكاملة للمراجعة: docs/STORY.md
   ============================================================ */

/* ---------- الشخصيات (بكسل آرت) ---------- */
const ST_CHARS = {
  saad:  { ar: 'سعدون', en: 'Saadoun', skin: '#d9a77a', hair: '#2a1e16', top: '#c8323c', bottom: '#2f3a52', hat: 'helmet' },
  abuj:  { ar: 'أبو جاسم', en: 'Abu Jassim', skin: '#c9946a', hair: '#1c1612', top: '#7a5a3a', bottom: '#3a3530', hat: 'bald', mustache: 1, item: 'tea', wide: 1 },
  umr:   { ar: 'أم رزاق', en: 'Umm Razzaq', skin: '#d6a27c', hair: '#111', top: '#141414', bottom: '#141414', hat: 'abaya', glasses: 1, dress: 1, short: 1 },
  abb:   { ar: 'عبّود', en: 'Abboud', skin: '#c8956e', hair: '#eee', top: '#5e6a3a', bottom: '#3c3a2a', hat: 'gold', beard: 1 },
  raad:  { ar: 'المهندس رعد', en: 'Engineer Raad', skin: '#e0b48e', hair: '#151515', top: '#6b6f78', bottom: '#4a4e56', hat: 'slick', shades: 1, tie: '#3a6ee8' },
  nas:   { ar: 'نسيم', en: 'Naseem', skin: '#d8a882', hair: '#111', top: '#2c5aa0', bottom: '#2c5aa0', hat: 'quiff', item: 'phone' },
  sura:  { ar: 'سُرى', en: 'Sura', skin: '#e2b38e', hair: '#3a2416', top: '#b8302e', bottom: '#2a2a2e', hat: 'long', item: 'mic' },
  muh:   { ar: 'العمدة مهند', en: 'Mayor Muhannad', skin: '#d4a07a', hair: '#222', top: '#1f2533', bottom: '#1f2533', hat: 'crown', tie: '#c8323c', wide: 1 },
  ghas:  { ar: 'أبو الغسيل', en: 'Laundry Man', skin: '#c9946a', hair: '#555', top: '#ece6d6', bottom: '#ece6d6', hat: 'bald', dress: 1, vest: '#4a4036' },
  ham:   { ar: 'حميد', en: 'Hamid', skin: '#b98258', hair: '#ddd', top: '#3a3026', bottom: '#3a3026', hat: 'yashmagh', beard: 1, dress: 1 },
  groom: { ar: 'العريس', en: 'The Groom', skin: '#d6a47e', hair: '#111', top: '#151515', bottom: '#151515', hat: 'slick', tie: '#e8e0c8' },
  zat:   { ar: 'زعطوط', en: 'Zaatout', cat: 1 },
  man:   { ar: 'واحد', en: 'A guy', skin: '#d0a07a', hair: '#222', top: '#4a6a4a', bottom: '#33302a', hat: null },
};
function stDrawChar(g, key, cx, by, u, flip, t) {
  const c = ST_CHARS[key]; if (!c) return;
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(cx + (flip ? -(x + w) : x) * u), Math.round(by + y * u), Math.round(w * u), Math.round(h * u)); };
  const bob = Math.round(Math.sin(t * 2.2 + cx * 0.05) * 0.5) * 0;
  by += bob;
  if (c.cat) { // زعطوط
    const k = '#7d7d82', d = '#4a4a50';
    R(-6, -6, 10, 4, k); R(2, -10, 5, 5, k); R(2, -11, 1, 2, d); R(6, -11, 1, 2, d); R(3, -8, 1, 1, '#e8d84a'); R(5, -8, 1, 1, '#e8d84a');
    R(-6, -2, 2, 2, d); R(-1, -2, 2, 2, d); R(2, -2, 2, 2, d); R(-9, -9 + Math.round(Math.sin(t * 3)), 3, 1, k); R(-7, -8, 1, 3, k);
    return;
  }
  const sh = c.short ? 2 : 0, w = c.wide ? 1 : 0;
  // الرجلين / الثوب
  R(-4 - w, -2, 3, 2, '#1a1612'); R(1 + w, -2, 3, 2, '#1a1612');
  if (c.dress) R(-5 - w, -13 + sh, 10 + 2 * w, 11 - sh, c.top);
  else { R(-4 - w, -10 + sh, 3, 8 - sh, c.bottom); R(1 + w, -10 + sh, 3, 8 - sh, c.bottom); }
  // الجسم
  R(-5 - w, -19 + sh, 10 + 2 * w, 9, c.top);
  if (c.vest) { R(-5 - w, -19 + sh, 3, 8, c.vest); R(2 + w, -19 + sh, 3, 8, c.vest); }
  if (c.tie) R(0, -19 + sh, 1, 6, c.tie);
  // الإيدين
  R(-7 - w, -19 + sh, 2, 8, c.top); R(5 + w, -19 + sh, 2, 8, c.top);
  R(-7 - w, -11 + sh, 2, 2, c.skin); R(5 + w, -11 + sh, 2, 2, c.skin);
  // الرقبة والراس
  R(-1, -20 + sh, 2, 1, c.skin); R(-4, -27 + sh, 8, 7, c.skin);
  const hy = sh;
  // الشعر / الغطاء
  if (c.hat === 'abaya') { R(-5, -28 + hy, 10, 3, c.top); R(-5, -25 + hy, 1, 6, c.top); R(4, -25 + hy, 1, 6, c.top); }
  else if (c.hat === 'bald') { R(-4, -25 + hy, 1, 2, c.hair); R(3, -25 + hy, 1, 2, c.hair); }
  else if (c.hat === 'long') { R(-5, -28 + hy, 10, 3, c.hair); R(-5, -25 + hy, 2, 9, c.hair); R(3, -25 + hy, 2, 9, c.hair); }
  else if (c.hat === 'quiff') { R(-4, -30 + hy, 9, 4, c.hair); R(3, -31 + hy, 3, 2, c.hair); }
  else if (c.hat === 'yashmagh') { for (let i = 0; i < 10; i++) R(-5 + i, -29 + hy, 1, 4, i % 2 ? '#c8323c' : '#f2ece0'); R(-5, -25 + hy, 2, 7, '#f2ece0'); R(3, -25 + hy, 2, 7, '#c8323c'); R(-5, -26 + hy, 10, 1, '#111'); }
  else if (c.hat !== 'helmet' && c.hat !== 'gold') R(-4, -28 + hy, 8, 2, c.hair);
  if (c.hat === 'helmet' || c.hat === 'gold') { const hc = c.hat === 'gold' ? '#e2b43c' : '#f2efe6', hd = c.hat === 'gold' ? '#9a7418' : '#bdb8ac'; R(-6, -31 + hy, 12, 5, hc); R(-6, -26 + hy, 2, 2, hd); R(4, -26 + hy, 2, 2, hd); R(-5, -27 + hy, 10, 1, '#3a6ee8'); }
  if (c.hat === 'crown') { R(-3, -31 + hy, 6, 2, '#e2b43c'); R(-3, -32 + hy, 1, 1, '#e2b43c'); R(0, -32 + hy, 1, 1, '#e2b43c'); R(2, -32 + hy, 1, 1, '#e2b43c'); }
  // الوجه
  const blink = (t * 0.7 + cx) % 4 < 0.12;
  if (c.shades) R(-3, -25 + hy, 7, 2, '#111');
  else if (!blink) { R(-2, -24 + hy, 1, 1, '#1a1410'); R(1, -24 + hy, 1, 1, '#1a1410'); }
  if (c.glasses) { R(-3, -25 + hy, 3, 1, '#c9b48a'); R(1, -25 + hy, 3, 1, '#c9b48a'); }
  if (c.mustache) R(-3, -23 + hy, 6, 2, c.hair); else R(-1, -22 + hy, 2, 1, '#8a4a3a');
  if (c.beard) { R(-4, -23 + hy, 8, 4, c.hair === '#ddd' || c.hair === '#eee' ? '#eeeae0' : c.hair); R(-1, -22 + hy, 2, 1, '#8a4a3a'); }
  // الأغراض
  if (c.item === 'tea') { R(7 + w, -14 + sh, 2, 3, '#c0702a'); R(7 + w, -15 + sh, 2, 1, '#f2efe6'); }
  if (c.item === 'mic') { R(7 + w, -16 + sh, 1, 5, '#111'); R(6 + w, -18 + sh, 3, 2, '#e8c832'); }
  if (c.item === 'phone') R(7 + w, -15 + sh, 2, 3, '#222');
}

/* ---------- المشاهد ---------- */
const ST_W = 480, ST_H = 270;
const stLvlCache = {};
function stLevel(style, pal, weather) {
  const k = style + pal + (weather || '');
  if (!stLvlCache[k]) stLvlCache[k] = buildLevel(Object.assign({}, MISSIONS[0], { id: 'st_' + k, style, pal, people: 0, weather: weather || 'clear', zones: 'pad', worldW: 1100, water: null, wind: { base: 0, gust: 0 }, fire: 0, tornados: 0, lines: null }));
  return stLvlCache[k];
}
function stFunnel(g, x, base, h, t, wdt) {
  for (let i = 0; i < h; i += 2) {
    const k = i / h, wv = (4 + (1 - k) * wdt) * (0.85 + 0.15 * Math.sin(t * 9 + i * 0.3)), off = Math.sin(t * 2.4 + k * 5) * 10 * (1 - k * 0.6);
    g.fillStyle = `rgba(${150 + k * 30},${145 + k * 30},${140 + k * 25},${0.55 + 0.3 * (1 - k)})`;
    g.fillRect(Math.round(x + off - wv / 2), Math.round(base - i), Math.round(wv), 2);
  }
}
function stInterior(g, kind, t) {
  if (kind === 'tower') { // برج المراقبة
    g.fillStyle = '#2b2620'; g.fillRect(0, 0, ST_W, ST_H);
    g.fillStyle = '#8fb6d8'; g.fillRect(40, 30, 400, 120); g.fillStyle = '#c7dbe8'; g.fillRect(40, 110, 400, 40);
    g.fillStyle = '#6a6a6a'; g.fillRect(40, 140, 400, 10); for (let i = 0; i < 8; i++) { g.fillStyle = '#f2efe6'; g.fillRect(60 + i * 50, 144, 24, 2); }
    g.fillStyle = '#1b1814'; for (let i = 0; i < 5; i++) g.fillRect(40 + i * 100, 30, 6, 120);
    g.fillStyle = '#4a3c2e'; g.fillRect(0, 196, ST_W, 74); g.fillStyle = '#5a4a38'; g.fillRect(0, 190, ST_W, 8);
    g.fillStyle = '#20302a'; g.fillRect(300, 172, 70, 20); g.fillStyle = (t * 2 % 1 < 0.5) ? '#4ae86a' : '#2a8a3a'; g.fillRect(306, 176, 6, 4); g.fillStyle = '#e8c832'; g.fillRect(318, 176, 6, 4);
  } else if (kind === 'home') { // بيت أم رزاق
    g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, ST_W, ST_H);
    for (let y = 10; y < 190; y += 24) for (let x = (y / 24 % 2) * 12; x < ST_W; x += 24) { g.fillStyle = '#ddcfae'; g.fillRect(x, y, 10, 10); }
    g.fillStyle = '#6a4a2e'; g.fillRect(320, 40, 110, 80); g.fillStyle = '#9ac2e0'; g.fillRect(326, 46, 98, 68); g.fillStyle = '#6a4a2e'; g.fillRect(374, 46, 3, 68);
    g.fillStyle = '#5a3a24'; g.fillRect(70, 50, 46, 56); g.fillStyle = '#c9a66b'; g.fillRect(74, 54, 38, 48); g.fillStyle = '#e2b43c'; g.fillRect(84, 62, 18, 10); // صورة الجد
    g.fillStyle = '#8a3a2e'; g.fillRect(0, 190, ST_W, 80); for (let x = 0; x < ST_W; x += 16) { g.fillStyle = '#a24a36'; g.fillRect(x, 200, 8, 2); g.fillStyle = '#e2b43c'; g.fillRect(x + 4, 230, 4, 4); }
  } else if (kind === 'hangar') { // مخبأ القصب
    g.fillStyle = '#1e1a12'; g.fillRect(0, 0, ST_W, ST_H);
    for (let i = 0; i < 60; i++) { g.fillStyle = i % 3 ? '#5a4a26' : '#7a6a36'; g.fillRect(i * 8, 0, 3, 200); }
    g.fillStyle = 'rgba(255,220,120,0.12)'; g.beginPath(); g.moveTo(240, 0); g.lineTo(120, 270); g.lineTo(360, 270); g.fill();
    g.fillStyle = '#3a3020'; g.fillRect(0, 200, ST_W, 70);
    if (SPR.golden) { g.imageSmoothingEnabled = false; g.drawImage(SPR.golden, 170, 120, 144, 60); }
  } else if (kind === 'lab') { // المحطة السرية
    g.fillStyle = '#121620'; g.fillRect(0, 0, ST_W, ST_H);
    for (let i = 0; i < 6; i++) { g.fillStyle = '#232a38'; g.fillRect(20 + i * 78, 30, 60, 150); g.fillStyle = i % 2 ? '#3a6ee8' : '#4ae8e0'; g.fillRect(30 + i * 78, 50 + (Math.floor(t * 3 + i) % 4) * 20, 10, 4); }
    const pulse = 0.5 + 0.5 * Math.sin(t * 4); g.fillStyle = `rgba(80,180,255,${0.25 + pulse * 0.3})`; g.beginPath(); g.arc(240, 110, 46 + pulse * 6, 0, 7); g.fill();
    g.fillStyle = '#7ad0ff'; g.beginPath(); g.arc(240, 110, 22, 0, 7); g.fill();
    g.fillStyle = '#1a1e28'; g.fillRect(0, 196, ST_W, 74); g.fillStyle = '#2a3242'; g.fillRect(0, 196, ST_W, 4);
  } else if (kind === 'dark') { g.fillStyle = '#0b0a09'; g.fillRect(0, 0, ST_W, ST_H); }
}
function stDrawScene(g, sc, t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false;
  const fx = sc.fx || [];
  if (sc.room) stInterior(g, sc.room, t);
  else {
    const [style, pal] = sc.lvl || ['baghdad', 'day'], L = stLevel(style, pal, sc.w), P = L.P;
    g.fillStyle = P.sky; g.fillRect(0, 0, ST_W, ST_H);
    g.fillStyle = P.star; for (const s of L.stars) { g.globalAlpha = 0.3 + s.b * 0.6; g.fillRect(Math.round(s.x * ST_W), Math.round(s.y * ST_H), 1, 1); } g.globalAlpha = 1;
    if (pal !== 'day') { const r = 15, mx = 400, my = 44; g.fillStyle = P.moon; for (let yy = -r; yy <= r; yy++) { const hw = Math.round(Math.sqrt(r * r - yy * yy)); g.fillRect(mx - hw, my + yy, hw * 2, 1); } }
    const cam = Math.round((sc.cam || 0) * (L.W - ST_W)) + Math.round(t * (sc.pan || 0)), oy = -24;
    g.drawImage(L.layers.far, -Math.round(cam * 0.3), oy); g.drawImage(L.layers.mid, -Math.round(cam * 0.6), oy); g.drawImage(L.layers.fg, -cam, oy);
  }
  for (const f of fx) {
    const [k, a, b] = Array.isArray(f) ? f : [f];
    if (k === 'runway') { g.fillStyle = '#4a4844'; g.fillRect(0, 236, ST_W, 34); for (let x = 0; x < ST_W; x += 40) { g.fillStyle = '#f2efe6'; g.fillRect(x + 8, 252, 20, 2); } }
    if (k === 'heli' && SPR[a || 'small']) { const s = SPR[a || 'small'], hx = (b ?? 0.6) * ST_W, hy = 70 + Math.sin(t * 1.6) * 5; g.drawImage(s, Math.round(hx - s.width), Math.round(hy), s.width * 2, s.height * 2); const hl = Math.abs(Math.cos(t * 30)) * 42; g.fillStyle = '#121110'; g.fillRect(Math.round(hx - hl), Math.round(hy - 1), Math.round(hl * 2), 2); }
    if (k === 'parked' && SPR[a || 'small']) { const s = SPR[a || 'small']; g.drawImage(s, Math.round((b ?? 0.7) * ST_W), 206, s.width * 2, s.height * 2); }
    if (k === 'flood') { const wy = a || 228; g.fillStyle = 'rgba(40,70,90,0.85)'; g.fillRect(0, wy, ST_W, ST_H - wy); for (let x = 0; x < ST_W; x += 12) { g.fillStyle = 'rgba(200,230,240,0.5)'; g.fillRect(x + Math.round(Math.sin(t * 2 + x) * 3), wy + 2, 6, 1); } }
    if (k === 'rain' || k === 'storm') { g.fillStyle = 'rgba(190,210,230,0.5)'; for (let i = 0; i < 120; i++) { const x = (i * 53 + t * 260) % ST_W, y = (i * 97 + t * 520) % ST_H; g.fillRect(Math.round(x), Math.round(y), 1, 5); } if (k === 'storm' && (t % 3.1) < 0.08) { g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(0, 0, ST_W, ST_H); } }
    if (k === 'sand') { g.fillStyle = 'rgba(210,150,80,0.38)'; g.fillRect(0, 0, ST_W, ST_H); g.fillStyle = 'rgba(240,200,140,0.6)'; for (let i = 0; i < 90; i++) g.fillRect(Math.round((i * 71 + t * 180) % ST_W), Math.round((i * 37) % ST_H), 2, 1); }
    if (k === 'tornado') stFunnel(g, (a ?? 0.7) * ST_W + Math.sin(t * 0.6) * 20, 232, 200, t, 60);
    if (k === 'bigTornado') { g.fillStyle = 'rgba(30,30,40,0.35)'; g.fillRect(0, 0, ST_W, ST_H); stFunnel(g, ST_W / 2 + Math.sin(t * 0.5) * 30, 250, 260, t, 190); }
    if (k === 'steam') { const sx = (a ?? 0.8) * ST_W, sy = b ?? 150; for (let i = 0; i < 6; i++) { const yy = sy - ((t * 18 + i * 12) % 70); g.fillStyle = `rgba(90,170,255,${0.6 - ((t * 18 + i * 12) % 70) / 120})`; g.fillRect(Math.round(sx + Math.sin(t + i) * 6), Math.round(yy), 8, 6); } g.fillStyle = '#3a6ee8'; g.fillRect(sx - 4, sy, 16, 10); }
    if (k === 'tv') { // إطار التلفزيون + شريط عاجل
      g.fillStyle = '#151515'; g.fillRect(0, 0, ST_W, 14); g.fillRect(0, ST_H - 14, ST_W, 14); g.fillRect(0, 0, 14, ST_H); g.fillRect(ST_W - 14, 0, 14, ST_H);
      g.fillStyle = '#b8302e'; g.fillRect(14, ST_H - 44, ST_W - 28, 18); g.fillStyle = '#e8c832'; g.fillRect(ST_W - 90, ST_H - 44, 76, 18);
      g.fillStyle = '#111'; g.font = 'bold 12px Tahoma'; g.textAlign = 'center'; g.fillText('عاجل', ST_W - 52, ST_H - 31);
      g.fillStyle = '#fff'; g.font = '11px Tahoma'; g.textAlign = 'right'; g.fillText(a || '', ST_W - 100, ST_H - 31);
      g.fillStyle = (t % 1 < 0.5) ? '#e83a3a' : '#661010'; g.beginPath(); g.arc(34, 30, 5, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 10px Tahoma'; g.textAlign = 'left'; g.fillText('LIVE', 44, 34);
    }
    if (k === 'lights') { for (let i = 0; i < 24; i++) { const x = i * 21 + 6, y = 30 + Math.sin(i * 0.6) * 8; g.fillStyle = ['#e8c832', '#e83a3a', '#4ae86a', '#3a9ae8'][(i + Math.floor(t * 3)) % 4]; g.fillRect(x, y, 3, 3); } }
    if (k === 'fireworks') { for (let j = 0; j < 3; j++) { const ph = (t * 0.7 + j * 0.33) % 1, cx = 100 + j * 140, cy = 60 + j * 15; for (let i = 0; i < 14; i++) { const an = i / 14 * 6.28, r = ph * 40; g.fillStyle = `rgba(${[240, 120, 255][j]},${[200, 220, 140][j]},${[80, 255, 120][j]},${1 - ph})`; g.fillRect(Math.round(cx + Math.cos(an) * r), Math.round(cy + Math.sin(an) * r), 2, 2); } } }
    if (k === 'pot') { g.fillStyle = '#9a9a9a'; g.fillRect(a * ST_W - 18, 224, 36, 18); g.fillStyle = '#6a6a6a'; g.fillRect(a * ST_W - 20, 222, 40, 4); for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(a * ST_W - 8 + i * 8, 214 - ((t * 10 + i * 5) % 14), 2, 4); } }
    if (k === 'cage') { g.fillStyle = '#5a6272'; for (let i = 0; i < 8; i++) g.fillRect(a * ST_W - 30 + i * 9, 150, 2, 90); g.fillRect(a * ST_W - 30, 150, 66, 3); }
    if (k === 'tape') { g.fillStyle = '#222'; g.fillRect(a * ST_W, 224, 30, 18); g.fillStyle = '#eee'; g.beginPath(); g.arc(a * ST_W + 9, 233, 4, 0, 7); g.arc(a * ST_W + 21, 233, 4, 0, 7); g.fill(); }
  }
}

/* ---------- المهمات (نفس صيغة missions.js) ---------- */
const ST_CITY = {
  baghdad: [33.3, 44.4, 'بغداد', 'Baghdad'], tokyo: [35.7, 139.7, 'طوكيو', 'Tokyo'], dubai: [25.2, 55.3, 'دبي', 'Dubai'], marsh: [31.0, 47.0, 'الأهوار', 'Iraqi Marshes'],
  cairo: [30.0, 31.2, 'القاهرة', 'Cairo'], mountain: [36.6, 44.6, 'جبال كردستان', 'Kurdistan Mountains'], mumbai: [19.1, 72.9, 'مومباي', 'Mumbai'], rotterdam: [51.9, 4.5, 'روتردام', 'Rotterdam'],
};
function sm(id, o) {
  const c = ST_CITY[o.style] || ST_CITY.baghdad;
  const m = Object.assign({ heli: 'small', type: 'rescue', pal: 'day', weather: 'clear', zones: 'pad', worldW: 1300, people: (o.goal || 4) + 2, time: 200, wind: { base: 0, gust: 6 } }, o);
  m.id = 'st_' + id; m.lat = c[0]; m.lon = c[1]; m.city = o.city || { ar: c[2], en: c[3] };
  m.name = { ar: o.name[0], en: o.name[1] }; m.desc = { ar: o.desc[0], en: o.desc[1] };
  if (m.type === 'animals' && !o.people) m.people = m.goal * 2 + 2;
  delete m.after;
  return Object.assign(m, { story: true, after: o.after || null });
}
const W_FLOOD = (y, to, rate) => ({ y, to, rate });

/* ---------- القصة ---------- */
const STORY = [
  { // ───────── الفصل 1
    id: 'ch1', title: ['أول يوم… آخر يوم؟', 'First Day… Last Day?'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { lvl: ['baghdad', 'day'], cam: 0.1, pan: 6, fx: ['runway'] }, chars: [['saad', 0.3]], cap: ['بغداد. سعدون، عامل توصيل على بايسكل، جايب طلبية كباب للمطار…', 'Baghdad. Saadoun, a bike delivery guy, brings a kebab order to the airport…'], lines: [['saad', 'طلبية كباب لـ… «قسم الطيارين الجدد»؟', 'Kebab order for… "New Pilots Department"?']] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.62, 1], ['saad', 0.3]], lines: [['abuj', 'إنت سعدون؟ اسمك أول واحد بالقائمة. اصعد!', "You're Saadoun? You're first on the list. Get in!"], ['saad', 'عمي آني جايب كباب…', "Sir, I'm just delivering kebab…"], ['abuj', 'زين، اكله بالطيارة. اليوم بلا حوادث رجاءً!', 'Fine, eat it in the heli. No accidents today, please!']] },
      { scene: { lvl: ['baghdad', 'day'], cam: 0.3, fx: ['runway', ['parked', 'small', 0.55]] }, chars: [['saad', 0.35], ['zat', 0.48]], lines: [['saad', 'هاي… الطيارة؟ وين الدواسات؟', 'This… is the heli? Where are the pedals?'], ['radio', 'أبو جاسم: الأسهم للطيران، والحبل ينزل وحده. يلا!', 'Abu Jassim: Arrows to fly, the rope lowers itself. Go!']], note: ['ما انتبه أحد لشي رمادي صغير دخل للطيارة…', 'Nobody noticed something small and grey sneaking into the heli…'] },
    ],
    missions: [
      sm('1_1', { style: 'baghdad', name: ['التدريب', 'Training'], desc: ['أول طيران إلك. نزّل الحبل جنب الناس، يقفزون ويمسكون. وصّل 2 للمهبط.', 'Your first flight. Lower the rope near people — they jump on. Bring 2 to the helipad.'], goal: 2, people: 3, time: 220, worldW: 1100, lines: { wait: { ar: ['إنت الطيار الجديد؟ يمّه!', 'جبت الكباب؟'], en: ['You\'re the new pilot? Oh no!', 'Did you bring the kebab?'] } } }),
      sm('1_2', { style: 'baghdad', pal: 'dusk', name: ['سطح الكرادة', 'Karrada Rooftop'], desc: ['3 ناس فوگ سطح بالكرادة. خلي الحبل يرفرف بهدوء.', '3 people on a Karrada rooftop. Keep the rope steady.'], goal: 3, people: 4, time: 210 }),
      sm('1_3', { style: 'baghdad', name: ['حبل الغسيل', 'The Clothesline'], desc: ['انتبه لحبال الغسيل! أبو الغسيل ما يسامح.', 'Mind the clotheslines! The laundry man never forgives.'], goal: 4, people: 5, time: 220, wind: { base: 4, gust: 10 }, lines: { laundry: { ar: ['أبو الغسيل: هاي دشداشة أبوي!!'], en: ['Laundry man: My father\'s dishdasha!!'] } } }),
      sm('1_4', { style: 'baghdad', pal: 'night', name: ['السلسلة', 'The Chain'], desc: ['الناس يمسكون رجول بعض. 5 واحد مرة وحدة؟ جرّب!', 'People hold each other\'s feet. 5 at once? Try it!'], goal: 5, people: 6, time: 230 }),
      sm('1_5', { style: 'baghdad', pal: 'dusk', name: ['المنارة', 'The Minaret'], desc: ['آخر مهمة باليوم الأول. وصّل 5… وحاول ما تضرب المنارة.', 'Last mission of day one. Bring 5… and try not to hit the minaret.'], goal: 5, people: 7, time: 240, wind: { base: -4, gust: 12 } }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'dusk'], cam: 0.5, fx: [['tv', 'طيار جديد يهدم نص بغداد بأول يوم!']] }, chars: [['sura', 0.3]], lines: [['sura', 'نحن على الهواء مباشرة! طيار جديد ضرب منارة بأول يوم!', 'We\'re live! A new pilot hit a minaret on his first day!']] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.6, 1], ['saad', 0.32]], lines: [['abuj', 'ذاك كان أثر تاريخي!!', 'That was a historic landmark!!'], ['saad', 'هسه صار أثرين…', 'Now it\'s two landmarks…'], ['abuj', 'روح للبيت… وتعال باچر. ماكو غيرك.', 'Go home… and come back tomorrow. There\'s nobody else.']] },
      { scene: { room: 'home' }, chars: [['umr', 0.4], ['saad', 0.62, 1]], lines: [['umr', 'ابني شفتك بالتلفزيون! ليش الطيارة بيها دخان؟', 'Son, I saw you on TV! Why was the heli smoking?'], ['saad', 'يمّه… أول يوم بالشغل.', 'Grandma… first day on the job.'], ['umr', 'زين… تغديت؟', 'Fine… did you eat?']] },
    ],
  },
  { // ───────── الفصل 2
    id: 'ch2', title: ['فيضان بلا غيم', 'A Flood Without Clouds'], city: ['دجلة', 'The Tigris'],
    intro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.4, fx: [['flood', 226]] }, cap: ['نص الليل. السما صافية والقمر بايّن… ودجلة تفيض فجأة.', 'Midnight. Clear sky, full moon… and the Tigris suddenly floods.'] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.6, 1], ['saad', 0.3]], lines: [['abuj', 'ما شايف غيمة وحدة! منين هالماي؟', 'Not a single cloud! Where is all this water from?'], ['saad', 'يمكن أحد نسى الحنفية مفتوحة؟', 'Maybe someone left the tap on?'], ['abuj', 'روح! والقوارب تنتظر تحت.', 'Go! The boats are waiting below.']] },
    ],
    missions: [
      sm('2_1', { style: 'baghdad', pal: 'night', name: ['فيضان بلا غيم', 'Cloudless Flood'], desc: ['الماي يصعد. وصّل الناس للقوارب.', 'The water is rising. Get people to the boats.'], goal: 4, weather: 'flood', zones: 'boat', water: W_FLOOD(262, 238, 0.14), time: 220 }),
      sm('2_2', { style: 'baghdad', pal: 'night', name: ['السبّاحين', 'The Swimmers'], desc: ['ناس طاحوا بالماي ويسبحون. نزّل الحبل عليهم.', 'People fell in and are swimming. Lower the rope to them.'], goal: 5, weather: 'flood', zones: 'boat', water: W_FLOOD(256, 236, 0.12), time: 230 }),
      sm('2_3', { style: 'baghdad', pal: 'night', name: ['قارب النجاة', 'The Lifeboat'], desc: ['جرّب تهبط على القارب بهدوء، الناس ينزلون وحدهم.', 'Try landing gently on the boat — people climb down by themselves.'], goal: 6, people: 8, weather: 'flood', zones: 'boat', water: W_FLOOD(262, 232, 0.16), time: 240, heli: 'medic' }),
      sm('2_4', { style: 'baghdad', pal: 'night', type: 'animals', name: ['الخروف', 'The Sheep'], desc: ['خرفان عالقة! الحيوان ما يمسك الحبل، لازم واحد معلّق يشيله بإيده.', 'Stranded sheep! Animals can\'t hold the rope — a hanging person must carry them.'], goal: 3, weather: 'flood', zones: 'boat', water: W_FLOOD(262, 240, 0.1), time: 240 }),
      sm('2_5', { style: 'baghdad', pal: 'night', name: ['البخار الأزرق', 'The Blue Steam'], desc: ['المطر بدا فجأة… من وين؟ آخر الناس بالحي.', 'Rain started from nowhere… Last people in the district.'], goal: 6, people: 8, weather: 'rain', zones: 'boat', water: W_FLOOD(260, 230, 0.18), time: 250 }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.7, fx: [['flood', 230], ['steam', 0.8, 120], ['heli', 'small', 0.35]] }, lines: [['radio', 'سعدون: أبو جاسم… اكو جهاز فوگ السطح يطلع بخار أزرق!', 'Saadoun: Abu Jassim… there\'s a machine on that roof puffing blue steam!'], ['radio', 'سعدون: …اختفى! صوّرته، بس الصورة طلعت مهزوزة.', 'Saadoun: …it vanished! I took a photo, but it\'s blurry.']] },
      { scene: { lvl: ['baghdad', 'night'], cam: 0.2, fx: [['parked', 'small', 0.45]] }, chars: [['saad', 0.3], ['zat', 0.55]], lines: [['zat', 'مياو.', 'Meow.'], ['saad', 'زعطوط؟! شلون صعدتي للطيارة؟!', 'Zaatout?! How did you get in the heli?!'], ['zat', '(نظرة احتقار)', '(look of contempt)']] },
    ],
  },
  { // ───────── الفصل 3
    id: 'ch3', title: ['حچي الجدّة', "Grandma's Secret"], city: ['الحي', 'The Neighborhood'],
    intro: [
      { scene: { room: 'home' }, chars: [['saad', 0.62, 1], ['umr', 0.38]], lines: [['saad', 'يمّه شوفي هالصورة… جهاز يطلع بخار أزرق.', 'Grandma, look at this photo… a machine with blue steam.'], ['umr', '……', '……'], ['saad', 'يمّه؟ ليش سكتي؟ أول مرة بحياتج تسكتين!', 'Grandma? Why so quiet? First time in your life!']] },
      { scene: { room: 'home' }, chars: [['umr', 0.38], ['saad', 0.62, 1]], lines: [['umr', 'جدّك عبّود شاف نفس الشي قبل 30 سنة… وبعدها اختفى.', 'Your grandpa Abboud saw the same thing 30 years ago… then he vanished.'], ['saad', 'يعني مو مات بحادث؟', 'So he didn\'t die in an accident?'], ['umr', 'خذ هالمفتاح. عليه صقر… مثل طيارته.', 'Take this key. It has a falcon on it… like his heli.']] },
      { scene: { room: 'home' }, chars: [['saad', 0.5], ['zat', 0.66, 1]], lines: [['zat', '(تخطف المفتاح… وتبلعه)', '(snatches the key… and swallows it)'], ['saad', 'زعطوووط!!', 'ZAATOUUUT!!']] },
    ],
    missions: [
      sm('3_1', { style: 'baghdad', name: ['الجيران', 'The Neighbors'], desc: ['زعطوط هربت فوگ السطوح، والجيران عالقين بسبب حريق صغير. ساعدهم.', 'Zaatout fled over the rooftops, and neighbors are stuck by a small fire. Help them.'], goal: 4, type: 'fire', fire: 2, time: 220 }),
      sm('3_2', { style: 'baghdad', pal: 'day', name: ['أبو الغسيل', 'The Laundry Man'], desc: ['حبال غسيل بكل مكان والريح قوية. أبو الغسيل يراقبك…', 'Clotheslines everywhere and strong wind. The laundry man is watching…'], goal: 5, wind: { base: 8, gust: 18 }, weather: 'wind', time: 230 }),
      sm('3_3', { style: 'baghdad', pal: 'dusk', type: 'cargo', cargo: 'flour', name: ['صواني أم رزاق', "Grandma's Trays"], desc: ['أم رزاق تطبخ سمچ حتى ترجّع زعطوط المفتاح! وصّل الطحين والصواني.', 'Grandma is cooking fish to lure Zaatout! Deliver flour and trays.'], goal: 4, time: 220 }),
      sm('3_4', { style: 'baghdad', pal: 'night', type: 'animals', name: ['ملاحقة زعطوط', 'Chasing Zaatout'], desc: ['بزازين الحي كلها فوگ السطوح! واحدة منهن زعطوط.', 'All the neighborhood cats are on the roofs! One of them is Zaatout.'], goal: 3, time: 240 }),
    ],
    outro: [
      { scene: { room: 'home' }, chars: [['umr', 0.3], ['zat', 0.5], ['saad', 0.7, 1]], lines: [['umr', 'تعالي حبيبتي… سمچة مسگوف إلج. بس رجّعي المفتاح.', 'Come, sweetie… a grilled fish for you. Just give back the key.'], ['zat', '(تفكر… ثم تطلع المفتاح)', '(thinks… then coughs up the key)'], ['saad', 'يع… بس شكراً.', 'Ew… but thanks.']] },
      { scene: { room: 'home' }, chars: [['saad', 0.5]], lines: [['saad', 'المفتاح مكتوب عليه: «الأهوار – المضيف الكبير».', 'The key says: "The Marshes – the Great Mudhif".']], note: ['الطريق للسر بدا…', 'The road to the secret begins…'] },
    ],
  },
  { // ───────── الفصل 4
    id: 'ch4', title: ['المنافس', 'The Rival'], city: ['طوكيو', 'Tokyo'],
    intro: [
      { scene: { room: 'tower' }, chars: [['abuj', 0.6, 1], ['saad', 0.3]], lines: [['abuj', 'مسابقة إنقاذ دولية بطوكيو… وسجّلت اسمك بدل اسمي بالغلط.', 'International rescue contest in Tokyo… and I accidentally entered your name instead of mine.'], ['saad', 'بالغلط؟', 'Accidentally?'], ['abuj', '…لا تسأل. روح مثّل العراق!', '…Don\'t ask. Go represent Iraq!']] },
      { scene: { lvl: ['tokyo', 'night'], cam: 0.3, fx: [['parked', 'news', 0.62]] }, chars: [['nas', 0.65, 1], ['saad', 0.3]], lines: [['nas', 'شوفوا المحترفين شلون يسوونها. (يصوّر سيلفي)', 'Watch how the pros do it. (takes a selfie)'], ['saad', 'شنو هذا الشعار على طيارتك؟ «غيمة»؟', 'What\'s that logo on your heli? "Ghayma"?'], ['nas', 'أكبر شركة طقس بالعالم، حبيبي.', 'The biggest weather company in the world, buddy.']] },
    ],
    missions: [
      sm('4_1', { style: 'tokyo', pal: 'night', name: ['المسابقة', 'The Contest'], desc: ['الجولة الأولى: أنقذ 6 قبل نسيم!', 'Round one: rescue 6 before Naseem!'], goal: 6, people: 8, time: 220 }),
      sm('4_2', { style: 'tokyo', pal: 'night', heli: 'police', name: ['ضد الوقت', 'Against the Clock'], desc: ['وقت قليل وطيارة سريعة. لا تضرب الباگودا!', 'Little time and a fast heli. Don\'t hit the pagoda!'], goal: 6, time: 170 }),
      sm('4_3', { style: 'tokyo', pal: 'night', name: ['العاصفة', 'The Storm'], desc: ['مطر وبرق والشوارع غرگت. وصّل للقوارب.', 'Rain, lightning, flooded streets. Get them to the boats.'], goal: 7, people: 9, weather: 'storm', zones: 'boat', water: W_FLOOD(272, 240, 0.15), wind: { base: 6, gust: 20 }, time: 250 }),
      sm('4_4', { style: 'tokyo', pal: 'dusk', name: ['الإعصار الأول', 'The First Twister'], desc: ['إعصار من العدم بنص المسابقة! يشيل الناس من السطوح.', 'A twister out of nowhere mid-contest! It lifts people off roofs.'], goal: 5, weather: 'tornado', tornados: 1, time: 240 }),
      sm('4_5', { style: 'tokyo', pal: 'night', type: 'vip', vipName: { ar: 'الكابتن نسيم', en: 'Captain Naseem' }, name: ['إنقاذ نسيم', 'Saving Naseem'], desc: ['طيارة نسيم تعطلت وهو معلّق بحبل غسيل! لازم يكون وياهم.', 'Naseem\'s heli broke down and he\'s hanging on a clothesline! He must be rescued.'], goal: 4, time: 220 }),
    ],
    outro: [
      { scene: { lvl: ['tokyo', 'night'], cam: 0.5 }, chars: [['nas', 0.4], ['saad', 0.62, 1]], lines: [['nas', 'هاي… ما صارت. محد يگول لأحد.', 'This… never happened. Tell no one.'], ['saad', 'ولا يهمك.', 'Sure thing.']] },
      { scene: { lvl: ['tokyo', 'night'], cam: 0.6, fx: [['tv', 'طيار عراقي ينقذ منافسه المعلّق بحبل غسيل!']] }, chars: [['sura', 0.3]], lines: [['sura', 'نحن على الهواء مباشرة! العراقي فاز… والمنافس معلّق بالغسيل!', "We're live! The Iraqi won… and his rival is hanging on laundry!"]] },
    ],
  },
  { // ───────── الفصل 5
    id: 'ch5', title: ['العمدة والبرج', 'The Mayor and the Tower'], city: ['دبي', 'Dubai'],
    intro: [
      { scene: { lvl: ['dubai', 'dusk'], cam: 0.3, fx: ['sand'] }, cap: ['عاصفة ترابية تغطّي الأبراج… وبالأعلى، شخص مهم يلوّح.', 'A sandstorm covers the towers… and at the top, an important man waves.'] },
      { scene: { lvl: ['dubai', 'dusk'], cam: 0.5, fx: ['sand'] }, chars: [['muh', 0.6, 1]], lines: [['muh', 'My name is مهند! قبل لا تنقذوني أريد مؤتمر صحفي!', 'My name is Muhannad! Before you rescue me I want a press conference!'], ['radio', 'سعدون: عمي التراب غطّى الكاميرات!', 'Saadoun: Sir, the sand covered the cameras!']] },
    ],
    missions: [
      sm('5_1', { style: 'dubai', pal: 'dusk', name: ['عاصفة الرمل', 'Sandstorm'], desc: ['الرؤية قليلة والريح تدفع. وصّل 6 للمهبط.', 'Low visibility and pushing wind. Bring 6 to the helipad.'], goal: 6, weather: 'sand', wind: { base: 10, gust: 26 }, time: 240 }),
      sm('5_2', { style: 'dubai', pal: 'dusk', heli: 'medic', name: ['الأبراج', 'The Towers'], desc: ['أبراج عالية… الحبل لازم يكون مرفوع (Q/E).', 'Tall towers… keep the rope raised (Q/E).'], goal: 6, people: 8, weather: 'sand', wind: { base: -8, gust: 22 }, time: 240 }),
      sm('5_3', { style: 'dubai', pal: 'day', type: 'cargo', cargo: 'medicine', heli: 'police', name: ['الدوا', 'The Medicine'], desc: ['المستشفى محتاج دوا. وصّل الصناديق.', 'The hospital needs medicine. Deliver the crates.'], goal: 5, time: 220 }),
      sm('5_4', { style: 'dubai', pal: 'dusk', type: 'vip', vipName: { ar: 'العمدة مهند', en: 'Mayor Muhannad' }, name: ['العمدة مهند', 'Mayor Muhannad'], desc: ['العمدة يرفض يمسك رجول أحد! خلّيه أول واحد بالحبل.', 'The mayor refuses to hold anyone\'s feet! Make him first on the rope.'], goal: 5, weather: 'sand', time: 240, lines: { wait: { ar: ['آني ما أمسك رجول أحد!'], en: ["I don't hold anyone's feet!"] } } }),
      sm('5_5', { style: 'dubai', pal: 'night', type: 'fire', fire: 4, name: ['حريق البرج', 'Tower Fire'], desc: ['حريق بالأبراج بعد العاصفة. لا تطير فوگ النار.', 'Fires in the towers after the storm. Don\'t fly over the flames.'], goal: 6, time: 240 }),
    ],
    outro: [
      { scene: { lvl: ['dubai', 'night'], cam: 0.4, fx: [['tv', 'شركة غيمة: اشترك بتأمين الكوارث اليوم!']] }, chars: [['raad', 0.35]], lines: [['raad', 'الطقس مو قدر، الطقس خدمة. اشترك اليوم بسعر مميز!', "Weather isn't fate, weather is a service. Subscribe today!"]] },
      { scene: { lvl: ['dubai', 'night'], cam: 0.6 }, chars: [['sura', 0.38], ['saad', 0.62, 1]], lines: [['sura', 'لاحظت؟ العاصفة بدت قبل إعلانه بنص ساعة بالضبط.', 'Did you notice? The storm started exactly half an hour before his ad.'], ['saad', 'يعني… كان يعرف؟', 'So… he knew?'], ['sura', 'شلون عرف بالعاصفة قبل لا تصير؟', 'How did he know about the storm before it happened?']] },
    ],
  },
  { // ───────── الفصل 6
    id: 'ch6', title: ['الصقر الذهبي', 'The Golden Falcon'], city: ['الأهوار', 'The Marshes'],
    intro: [
      { scene: { lvl: ['marsh', 'dusk'], cam: 0.3 }, chars: [['ham', 0.62, 1], ['saad', 0.32]], lines: [['saad', 'عمي، تعرف هالمفتاح؟', 'Uncle, do you know this key?'], ['ham', 'هذا مفتاح عبّود… صارلي 30 سنة أنتظر أحد يجيبه.', "That's Abboud's key… I've waited 30 years for someone to bring it."]] },
      { scene: { lvl: ['marsh', 'dusk'], cam: 0.5 }, chars: [['ham', 0.5]], lines: [['ham', 'بس أول… الهوا هنا ما يرحم. لازم تتعلم تقرا الهوا مثل ما تقرا الماي.', 'But first… the wind here is merciless. Learn to read the wind like you read water.']] },
    ],
    missions: [
      sm('6_1', { style: 'marsh', pal: 'dusk', name: ['المضيف', 'The Mudhif'], desc: ['صيادين فوگ المضايف والريح قوية.', 'Fishermen on the mudhifs, and strong wind.'], goal: 5, weather: 'wind', zones: 'boat', water: W_FLOOD(258, 258, 0), wind: { base: -10, gust: 24 }, time: 230 }),
      sm('6_2', { style: 'marsh', pal: 'day', name: ['الصيادين', 'The Fishermen'], desc: ['الهبّات تزيد. «الحبل مثل الشبچة، ارخي وشدّ» (Q/E).', 'Gusts get stronger. "The rope is like a net — slack and pull" (Q/E).'], goal: 6, weather: 'wind', zones: 'boat', water: W_FLOOD(258, 258, 0), wind: { base: 8, gust: 30 }, time: 240 }),
      sm('6_3', { style: 'marsh', pal: 'dusk', type: 'animals', name: ['الجاموس… قصدي الخرفان', 'Buffalo… I mean Sheep'], desc: ['الجاموس ثقيل هواية، فخلّينا بالخرفان.', 'Buffalo are way too heavy, so let\'s stick to sheep.'], goal: 3, zones: 'boat', water: W_FLOOD(258, 258, 0), wind: { base: 0, gust: 16 }, time: 240 }),
      sm('6_4', { style: 'marsh', pal: 'night', name: ['ليل الأهوار', 'Marsh Night'], desc: ['ظلام ومطر. حميد يأشّر بالفانوس على الناس.', 'Dark and rainy. Hamid points his lantern at the people.'], goal: 6, people: 8, weather: 'storm', zones: 'boat', water: W_FLOOD(258, 250, 0.05), wind: { base: -6, gust: 22 }, time: 250 }),
    ],
    outro: [
      { scene: { room: 'hangar' }, chars: [['ham', 0.2], ['saad', 0.82, 1]], cap: ['تحت القصب، باب مخفي. وجوّه…', 'Beneath the reeds, a hidden door. And inside…'], lines: [['saad', 'الصقر الذهبي… طيارة جدّي!', 'The Golden Falcon… my grandpa\'s heli!']] },
      { scene: { room: 'hangar' }, chars: [['saad', 0.82, 1]], fx: [['tape', 0.6]], lines: [['saad', 'اكو شريط… خلي أشغّله.', "There's a tape… let me play it."], ['phone:abb', '(صوت مشوّش) إذا دتسمع هذا… فالغيمة رجعت.', '(static) If you\'re hearing this… the Cloud has returned.']], note: ['🏆 انفتحت طيارة «الصقر الذهبي» بكل اللعبة!', '🏆 The "Golden Falcon" heli is now unlocked everywhere!'] },
    ],
    unlockGolden: true,
  },
  { // ───────── الفصل 7
    id: 'ch7', title: ['الخيانة', 'The Betrayal'], city: ['القاهرة', 'Cairo'],
    intro: [
      { scene: { lvl: ['cairo', 'day'], cam: 0.3, fx: ['lights'] }, chars: [['groom', 0.6, 1]], cap: ['عرس على سطح يطل على النيل… والعريس رفض يشتري «تأمين غيمة».', 'A wedding on a rooftop by the Nile… and the groom refused to buy "Ghayma insurance".'], lines: [['groom', 'تأمين؟ على عرسي؟ لا شكراً!', 'Insurance? For my wedding? No thanks!']] },
      { scene: { lvl: ['cairo', 'day'], cam: 0.5, fx: [['flood', 232]] }, cap: ['بعد ساعة… النيل طاف على العرس.', 'An hour later… the Nile floods the wedding.'] },
    ],
    missions: [
      sm('7_1', { style: 'cairo', pal: 'day', name: ['العرس', 'The Wedding'], desc: ['المعازيم فوگ السطوح والماي يصعد.', 'Guests on the roofs and the water is rising.'], goal: 5, weather: 'flood', zones: 'boat', water: W_FLOOD(268, 238, 0.13), time: 230, lines: { wait: { ar: ['خلّصوني قبل لا يخلص الكيك!'], en: ['Save me before the cake runs out!'] } } }),
      sm('7_2', { style: 'cairo', pal: 'day', type: 'cargo', cargo: 'melon', name: ['البطيخ', 'The Watermelons'], desc: ['بطيخ العرس! إذا طاح من عالي يتفلّش.', 'The wedding watermelons! Drop one from high up and it splatters.'], goal: 4, time: 220 }),
      sm('7_3', { style: 'cairo', pal: 'dusk', heli: 'chinook', name: ['المعازيم', 'The Guests'], desc: ['كل العائلة عالقة! جبتلك شينوك.', 'The whole family is stuck! Here\'s a Chinook.'], goal: 8, people: 10, weather: 'flood', zones: 'boat', water: W_FLOOD(270, 234, 0.15), time: 270 }),
      sm('7_4', { style: 'cairo', pal: 'dusk', type: 'vip', vipName: { ar: 'العريس', en: 'the groom' }, name: ['العريس', 'The Groom'], desc: ['العريس لازم يوصل… العروسة تنتظر!', 'The groom must make it… the bride is waiting!'], goal: 5, weather: 'flood', zones: 'boat', water: W_FLOOD(266, 240, 0.12), time: 240 }),
      sm('7_5', { style: 'cairo', pal: 'night', name: ['الحقيقة', 'The Truth'], desc: ['عاصفة «مصنوعة» على القاهرة. نسيم يطير وياك هالمرة.', 'A "manufactured" storm over Cairo. Naseem flies with you this time.'], goal: 7, people: 9, weather: 'storm', zones: 'boat', water: W_FLOOD(270, 236, 0.16), wind: { base: 6, gust: 22 }, time: 260 }),
    ],
    outro: [
      { scene: { lvl: ['cairo', 'night'], cam: 0.4 }, chars: [['nas', 0.38], ['saad', 0.65, 1]], lines: [['nas', 'سمعت رعد بالتلفون… هو اللي يصنع العواصف حتى يبيع التأمين!', 'I heard Raad on the phone… he makes the storms to sell insurance!'], ['nas', 'رفضت أكمل… فطردني وسرق طيارتي. ليش الغش… ليش الخيانة!', 'I refused… so he fired me and stole my heli. Why the cheating… why the BETRAYAL!']] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.5]], cap: ['ولأول مرة بحياته…', 'And for the first time in his life…'], lines: [['abuj', '(يحط استكان الچاي) لا… هاي صارت جدية.', '(puts down his tea glass) No… this just got serious.']] },
    ],
  },
  { // ───────── الفصل 8
    id: 'ch8', title: ['عين الإعصار', 'Eye of the Twister'], city: ['جبال كردستان', 'Kurdistan Mountains'],
    intro: [
      { scene: { lvl: ['mountain', 'night'], cam: 0.4, fx: [['tornado', 0.7]] }, cap: ['بين الجبال، محطة سرية… يحرسها إعصار ما يوقف.', 'Among the mountains, a secret station… guarded by a twister that never stops.'] },
      { scene: { lvl: ['mountain', 'night'], cam: 0.3, fx: [['parked', 'golden', 0.4]] }, chars: [['saad', 0.3], ['nas', 0.75, 1]], lines: [['nas', 'إذا دخلنا هناك… ما اكو رجعة.', "If we go in there… there's no turning back."], ['saad', 'جدّي هناك. أحس بيها.', "My grandpa is there. I can feel it."]] },
    ],
    missions: [
      sm('8_1', { style: 'mountain', pal: 'day', type: 'animals', heli: 'golden', name: ['الرعاة', 'The Shepherds'], desc: ['رعاة وغنم عالقين، والإعصار يتمشى بالوادي.', 'Shepherds and sheep stranded, a twister roaming the valley.'], goal: 3, weather: 'tornado', tornados: 1, time: 250 }),
      sm('8_2', { style: 'mountain', pal: 'dusk', heli: 'golden', name: ['زعطوط بالهوا', 'Zaatout Airborne'], desc: ['الإعصار طيّر زعطوط! أنقذ الناس قبل ما يشيلهم هم.', 'The twister blew Zaatout away! Save people before it takes them too.'], goal: 5, weather: 'tornado', tornados: 1, wind: { base: 0, gust: 18 }, time: 250 }),
      sm('8_3', { style: 'mountain', pal: 'night', heli: 'golden', name: ['المحطة', 'The Station'], desc: ['حراس «غيمة» هربوا وتركوا العمال فوگ الجبل. إعصارين!', 'Ghayma guards fled, leaving workers on the peak. Two twisters!'], goal: 6, people: 8, weather: 'tornado', tornados: 2, time: 260 }),
      sm('8_4', { style: 'mountain', pal: 'night', type: 'vip', careful: true, heli: 'golden', vipName: { ar: 'الجد عبّود', en: 'Grandpa Abboud' }, name: ['الهروب ويه الجد', 'Escape with Grandpa'], desc: ['الجد عبّود حي! طلّعه هو والباقين… وبهدوء، محد يطيح!', 'Grandpa Abboud is alive! Get him and the others out… gently, nobody falls!'], goal: 4, weather: 'storm', wind: { base: 4, gust: 18 }, time: 260 }),
    ],
    outro: [
      { scene: { room: 'lab' }, chars: [['abb', 0.62, 1], ['saad', 0.32]], fx: [['cage', 0.62]], lines: [['abb', 'إنت سعدون؟… كبرت!', "You're Saadoun?… You've grown!"], ['saad', 'جدّي؟! الجدّة تگول الغدا برد!', 'Grandpa?! Grandma says lunch is getting cold!']] },
      { scene: { room: 'lab' }, chars: [['abb', 0.5]], lines: [['abb', 'هذا الجهاز آني اخترعته… حتى يجيب المطر للزرع. رعد سرقه وخلّاني 30 سنة أصلّحله.', 'I invented this machine… to bring rain to the farms. Raad stole it and kept me 30 years to fix it.'], ['abb', 'وهسه يريد يشغّله بكل قوته… على بغداد.', 'And now he wants to run it at full power… on Baghdad.']] },
      { scene: { lvl: ['mountain', 'night'], cam: 0.7, fx: [['heli', 'golden', 0.5], ['tornado', 0.85]] }, chars: [['zat', 0.4]], lines: [['zat', '(تنزل من الهوا وتگعد على راس سعدون)', '(lands from the sky right on Saadoun\'s head)'], ['radio', 'سعدون: زعطوط! رجعتي!', 'Saadoun: Zaatout! You\'re back!']] },
    ],
  },
  { // ───────── الفصل 9
    id: 'ch9', title: ['موسم الأعاصير', 'Twister Season'], city: ['مدن العالم', 'World Cities'],
    intro: [
      { scene: { lvl: ['dubai', 'night'], cam: 0.4, fx: [['tv', 'أعاصير بكل مدن العالم بنفس اللحظة!'], ['tornado', 0.3], ['tornado', 0.75]] }, chars: [['raad', 0.5]], lines: [['raad', 'الطقس مو قدر… الطقس خدمة. ومن اليوم، الكل يشترك.', "Weather isn't fate… weather is a service. From today, everyone subscribes."]] },
      { scene: { room: 'home' }, chars: [['umr', 0.4]], fx: [['tv', 'الطيار عبّود يظهر بعد 30 سنة!']], lines: [['umr', 'عبّود؟!… وين جنت؟! الغدا برد!', 'Abboud?!… Where have you been?! Lunch is cold!'], ['phone:abb', 'آسف حجية… انحبست شوية.', 'Sorry dear… I got a bit locked up.']] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.25], ['nas', 0.5], ['sura', 0.75, 1]], lines: [['abuj', 'الكل يطير! نسيم، خذ طيارة الإسعاف. سُرى، بثّي أماكن العالقين.', 'Everyone flies! Naseem, take the ambulance heli. Sura, broadcast where people are stuck.'], ['sura', 'نحن على الهواء… ونحن وياكم!', "We're live… and we're with you!"]] },
    ],
    missions: [
      sm('9_1', { style: 'baghdad', pal: 'dusk', heli: 'golden', name: ['بغداد تدور', 'Baghdad Spins'], desc: ['إعصارين ببغداد! سُرى تبث مكان الناس.', 'Two twisters in Baghdad! Sura broadcasts where people are.'], goal: 6, weather: 'tornado', tornados: 2, time: 260 }),
      sm('9_2', { style: 'dubai', pal: 'night', heli: 'golden', name: ['دبي تدوخ', 'Dizzy Dubai'], desc: ['رمل وإعصار. الأبراج عالية والحبل لازم يرتفع.', 'Sand and twisters. Tall towers — keep the rope up.'], goal: 6, weather: 'tornado', tornados: 2, time: 260 }),
      sm('9_3', { style: 'cairo', pal: 'dusk', heli: 'golden', name: ['النيل يلف', 'The Nile Spins'], desc: ['إعصار فوگ النيل والماي يصعد.', 'A twister over the Nile, and the water rises.'], goal: 6, weather: 'tornado', tornados: 1, zones: 'boat', water: W_FLOOD(266, 240, 0.12), time: 260 }),
      sm('9_4', { style: 'tokyo', pal: 'night', heli: 'chinook', name: ['طوكيو', 'Tokyo'], desc: ['نسيم يساعدك من بعيد. 8 لازم يوصلون.', 'Naseem helps from afar. 8 must make it.'], goal: 8, people: 10, weather: 'tornado', tornados: 2, time: 280 }),
      sm('9_5', { style: 'mumbai', pal: 'night', heli: 'chinook', name: ['مومباي', 'Mumbai'], desc: ['مطر وإعصار وفيضان مرة وحدة. حميد بالقارب ينتظر.', 'Rain, twister and flood at once. Hamid waits in the boat.'], goal: 8, people: 10, weather: 'tornado', tornados: 1, zones: 'boat', water: W_FLOOD(266, 230, 0.16), time: 290 }),
    ],
    outro: [
      { scene: { room: 'tower' }, chars: [['abb', 0.3], ['saad', 0.6, 1]], lines: [['abb', 'رعد نقل الجهاز فوگ أعلى برج ببغداد. هناك المعركة الأخيرة.', 'Raad moved the machine to the tallest tower in Baghdad. The final battle is there.'], ['saad', 'جدّي… تطير وياي؟', 'Grandpa… will you fly with me?'], ['abb', 'اقرا الهوا مثل ما تقرا الماي. يلا.', 'Read the wind like you read water. Let\'s go.']] },
    ],
  },
  { // ───────── الفصل 10
    id: 'ch10', title: ['غيمة بغداد', 'The Cloud over Baghdad'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.5, fx: ['bigTornado', 'storm'] }, cap: ['إعصار عملاق فوگ بغداد كلها.', 'A giant twister over all of Baghdad.'], lines: [['radio', 'رعد: اشتركوا… أو خلّوا الغيمة تقرر!', 'Raad: Subscribe… or let the Cloud decide!']] },
      { scene: { lvl: ['baghdad', 'night'], cam: 0.3, fx: [['heli', 'golden', 0.55], 'storm'] }, chars: [], lines: [['radio', 'عبّود: الصقر الذهبي جاهز. بسم الله.', 'Abboud: The Golden Falcon is ready. In God\'s name.'], ['radio', 'سعدون: أول يوم بالشغل… وآخر إعصار.', 'Saadoun: First day on the job… last twister.']] },
    ],
    missions: [
      sm('10_1', { style: 'baghdad', pal: 'night', heli: 'golden', name: ['الأحياء', 'The Neighborhoods'], desc: ['الناس بطريق الإعصار. طلّعهم قبل لا يوصلهم.', 'People in the twister\'s path. Get them out before it reaches them.'], goal: 7, people: 9, weather: 'tornado', tornados: 2, time: 280 }),
      sm('10_2', { style: 'baghdad', pal: 'night', type: 'vip', careful: true, heli: 'golden', vipName: { ar: 'أبو جاسم', en: 'Abu Jassim' }, name: ['أبو جاسم والچاي', 'Abu Jassim and the Tea'], desc: ['البرج دا ينهار وأبو جاسم ماسك استكان الچاي! بهدوء… ولا قطرة تطيح.', 'The tower is collapsing and Abu Jassim holds his tea! Gently… not a drop spilled.'], goal: 5, weather: 'storm', wind: { base: -6, gust: 22 }, time: 260, lines: { wait: { ar: ['أبو جاسم: الچاي! لا يطيح الچاي!'], en: ['Abu Jassim: The tea! Don\'t spill the tea!'] } } }),
      sm('10_3', { style: 'baghdad', pal: 'night', heli: 'chinook', name: ['الجهاز', 'The Machine'], desc: ['إعصارين حول البرج. نسيم يشتت الحراس وإنت تنقذ.', 'Two twisters around the tower. Naseem distracts the guards while you rescue.'], goal: 8, people: 10, weather: 'tornado', tornados: 2, zones: 'boat', water: W_FLOOD(266, 236, 0.14), time: 290 }),
      sm('10_4', { style: 'baghdad', pal: 'night', heli: 'giant', name: ['⭐ غيمة بغداد', '⭐ The Cloud over Baghdad'], desc: ['المعركة الأخيرة! 10 أشخاص، إعصارين، وفيضان. زعطوط جاهزة تقطع السلك.', 'The final battle! 10 people, two twisters and a flood. Zaatout is ready to cut the wire.'], goal: 10, people: 12, weather: 'tornado', tornados: 2, zones: 'boat', water: W_FLOOD(266, 226, 0.18), wind: { base: 0, gust: 24 }, time: 330 }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.5, fx: [['tornado', 0.5], 'storm'] }, chars: [['zat', 0.5]], cap: ['فوگ البرج، الحبل ينزل على الجهاز…', 'Above the tower, the rope descends onto the machine…'], lines: [['zat', '(تقفز… وتگطع السلك بسنونها!)', '(leaps… and bites through the wire!)']] },
      { scene: { lvl: ['baghdad', 'night'], cam: 0.6 }, chars: [['raad', 0.55], ['ghas', 0.25]], cap: ['الإعصار اختفى. ورعد…', 'The twister is gone. And Raad…'], lines: [['raad', 'نزّلوني!! هاي مو بالعقد!', 'Get me down!! This isn\'t in the contract!'], ['ghas', 'هاي دشداشة أبوي!! بس هالمرة… حلال عليك.', "That's my father's dishdasha!! But this time… you can keep it."]] },
      { scene: { lvl: ['baghdad', 'night'], cam: 0.4, fx: ['lights', 'fireworks', ['pot', 0.5]] }, chars: [['umr', 0.38], ['abb', 0.62, 1]], cap: ['احتفال بالكرادة.', 'A celebration in Karrada.'], lines: [['umr', 'تعالوا كلكم! جبت قدر دولمة!', 'Come everyone! I brought a pot of dolma!'], ['abb', 'الحمد لله… بعد 30 سنة، دولمة حجية.', 'Thank God… after 30 years, her dolma.']] },
      { scene: { lvl: ['baghdad', 'night'], cam: 0.45, fx: ['lights', ['tv', 'الطيار اللي هدم نص بغداد… أنقذ بغداد كلها!']] }, chars: [['sura', 0.3], ['saad', 0.65, 1]], lines: [['sura', 'نحن على الهواء! وسام «أكثر طيار ضرب بنايات وما تأذى أحد» يروح لـ… سعدون!', "We're live! The medal for \"Most Buildings Hit Without Hurting Anyone\" goes to… Saadoun!"], ['saad', 'شكراً… آسف على المنارة.', 'Thank you… sorry about the minaret.']] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.4], ['saad', 0.66, 1]], lines: [['abuj', 'باچر نفس الوقت…', 'Tomorrow, same time…'], ['abuj', '…وبلا حوادث!', '…and NO accidents!']] },
    ],
    ending: true,
  },
];
// مشهد بعد النهاية (بعد الشكر)
const STORY_POST = [
  { scene: { lvl: ['baghdad', 'night'], cam: 0.8, pan: 4, fx: [['heli', 'golden', 0.5]] }, chars: [['zat', 0.5]], cap: ['بعد منتصف الليل…', 'After midnight…'], lines: [['zat', '(زعطوط تسوق الصقر الذهبي… وتطير)', '(Zaatout flies the Golden Falcon… away)']] },
  { scene: { lvl: ['baghdad', 'night'], cam: 0.9, fx: [['steam', 0.85, 140]] }, cap: ['وعلى سطح بعيد… ضوء أزرق صغير يرجع يشتعل.', 'And on a distant roof… a small blue light flickers back on.'], note: ['يتبع… الجزء الثاني 😼', 'To be continued… Part Two 😼'] },
];

/* ---------- نصوص الواجهة ---------- */
const STT = {
  ar: { title: '📖 نمط القصة', sub: 'سعدون وغيمة بغداد', chapter: 'الفصل', skip: 'تخطّي ⏭', next: 'التالي ◀', start: '▶ ابدأ المهمة', locked: '🔒 خلّص الفصل اللي قبله', done: '✓ خلص', back: 'رجوع', replay: 'إعادة القصة', cont: 'كمّل القصة', mission: 'المهمة', of: 'من', credits: 'شكراً لأنك لعبت!', creditsBy: 'برمجة وتطوير ابراهيم الخزرجي', end: 'النهاية', radio: '📻 راديو', tap: 'اضغط للمتابعة' },
  en: { title: '📖 Story Mode', sub: 'Saadoun and the Cloud over Baghdad', chapter: 'Chapter', skip: 'Skip ⏭', next: 'Next ▶', start: '▶ Start mission', locked: '🔒 Finish the previous chapter', done: '✓ Done', back: 'Back', replay: 'Replay story', cont: 'Continue story', mission: 'Mission', of: 'of', credits: 'Thanks for playing!', creditsBy: 'Developed by Ibrahim Al-Khazraji', end: 'The End', radio: '📻 Radio', tap: 'Tap to continue' },
};
const stT = k => (STT[lang()] || STT.ar)[k];
const L2 = a => (a ? (lang() === 'ar' ? a[0] : a[1]) : '');

/* ---------- التقدم ---------- */
function stSave() { if (!save.story) save.story = { ch: {} }; return save.story; }
function stChapterDone(ci) { return !!stSave().ch[STORY[ci].id]; }
function stChapterUnlocked(ci) { return ci === 0 || stChapterDone(ci - 1); }
function stFirstOpen(ci) { const ms = STORY[ci].missions; for (let i = 0; i < ms.length; i++) if (!save.stars[ms[i].id]) return i; return ms.length; }
function goldenUnlocked() { return !!(save.story && save.story.golden); }

/* ---------- مشغّل اللوحات ---------- */
const ST = { queue: [], idx: 0, line: -1, t: 0, t0: 0, done: null, raf: 0, panel: null };
function stEl(id) { return document.getElementById(id); }
function stPlay(panels, done) {
  ST.queue = panels.slice(); ST.idx = 0; ST.done = done; stEl('stSkip').textContent = stT('skip');
  stEl('stMenu').hidden = true; stEl('stPlayer').hidden = false; stEl('storyOv').classList.add('on', 'playing');
  stShowPanel();
  if (!ST.raf) { ST.t0 = performance.now(); const loop = now => { ST.t = (now - ST.t0) / 1000; if (stEl('storyOv').classList.contains('playing')) { stRender(); ST.raf = requestAnimationFrame(loop); } else ST.raf = 0; }; ST.raf = requestAnimationFrame(loop); }
}
function stShowPanel() {
  const p = ST.queue[ST.idx]; ST.panel = p; ST.line = -1; ST.revealT = ST.t;
  stEl('stBubbles').innerHTML = ''; stEl('stCap').hidden = !p.cap; stEl('stCap').textContent = L2(p.cap);
  stEl('stNote').hidden = true;
  stEl('stProg').textContent = (ST.idx + 1) + ' / ' + ST.queue.length;
  stEl('stNextBtn').textContent = p.startBtn ? stT('start') : stT('next');
  if ((p.lines || []).length) setTimeout(() => { if (ST.panel === p && ST.line < 0) stAdvance(); }, 650); // أول فقاعة تطلع وحدها
}
function stAdvance() {
  const p = ST.panel; if (!p) return;
  if (ST.t - ST.revealT < 0.55) { ST.revealT = ST.t - 0.7; if (ST.line >= 0) return; }
  const lines = p.lines || [];
  if (ST.line + 1 < lines.length) { ST.line++; stBubble(lines[ST.line]); return; }
  if (p.note && stEl('stNote').hidden) { stEl('stNote').hidden = false; stEl('stNote').textContent = L2(p.note); return; }
  if (ST.idx + 1 < ST.queue.length) { ST.idx++; stShowPanel(); return; }
  stFinish();
}
function stFinish() { const d = ST.done; ST.done = null; stEl('storyOv').classList.remove('playing'); stEl('stPlayer').hidden = true; if (d) d(); }
function stBubble(ln) {
  const [who, ar, en] = ln, box = stEl('stBubbles');
  const old = box.querySelectorAll('.stb'); if (old.length >= 2) old[0].remove();
  box.querySelectorAll('.stb').forEach(b => b.classList.add('old'));
  const b = document.createElement('div'); b.className = 'stb';
  const p = ST.panel, ch = (p.chars || []).find(c => c[0] === who);
  let name = '';
  if (who === 'radio') { b.classList.add('radio'); name = stT('radio'); SND.play('radio', 0.5); }
  else if (who.startsWith('phone:')) { b.classList.add('phone'); const k = who.slice(6); name = '📞 ' + L2([ST_CHARS[k].ar, ST_CHARS[k].en]); }
  else if (who === 'cap') b.classList.add('narr');
  else name = ST_CHARS[who] ? L2([ST_CHARS[who].ar, ST_CHARS[who].en]) : '';
  if (ch) { const x = ch[1] * 100; b.style.left = Math.max(4, Math.min(66, x - 15)) + '%'; b.classList.add('at'); b.style.setProperty('--tail', Math.max(8, Math.min(92, (x - Math.max(4, Math.min(66, x - 15))) / 30 * 100)) + '%'); }
  b.innerHTML = (name ? `<b>${name}</b>` : '') + `<span></span>`; b.querySelector('span').textContent = lang() === 'ar' ? ar : en;
  box.appendChild(b);
}
function stRender() {
  const cv = stEl('stCanvas'); if (!cv || !ST.panel) return; const g = cv.getContext('2d'), p = ST.panel, t = ST.t;
  const sc = p.scene || { room: 'dark' };
  stDrawScene(g, p.fx ? Object.assign({}, sc, { fx: [...(sc.fx || []), ...p.fx] }) : sc, t);
  const chars = p.chars || [];
  chars.forEach(([k, x, flip], i) => { const u = ST_CHARS[k] && ST_CHARS[k].cat ? 3 : 3.2; stDrawChar(g, k, x * ST_W, 262, u, !!flip, t + i); });
  if (p.fade) { g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(0, 0, ST_W, ST_H); }
  // كشف اللوحة بالقلم (من اليمين لليسار)
  const r = Math.min(1, (t - ST.revealT) / 0.6);
  if (r < 1) {
    const edge = Math.round(ST_W * (1 - r));
    g.fillStyle = '#f1e7d0'; g.fillRect(0, 0, edge, ST_H);
    g.strokeStyle = 'rgba(60,50,40,0.35)'; g.lineWidth = 1; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(edge - 2, 20 + i * 28); g.lineTo(edge - 30 - (i * 7) % 20, 30 + i * 28); g.stroke(); }
    g.fillStyle = '#e2b43c'; g.fillRect(edge - 3, ST_H * 0.45, 6, 26); g.fillStyle = '#3a2a1a'; g.fillRect(edge - 3, ST_H * 0.45 + 26, 6, 5); g.fillStyle = '#f2b0a0'; g.fillRect(edge - 3, ST_H * 0.45 - 5, 6, 5);
  }
}

/* ---------- قائمة الفصول ---------- */
function stOpenMenu() {
  stEl('stTitle').textContent = stT('title'); stEl('stSub').textContent = stT('sub');
  const box = stEl('stList'); box.innerHTML = '';
  STORY.forEach((c, ci) => {
    const ok = stChapterUnlocked(ci), done = stChapterDone(ci), n = c.missions.length, k = Math.min(n, stFirstOpen(ci));
    const b = document.createElement('button'); b.className = 'stch' + (ok ? '' : ' locked') + (done ? ' done' : '');
    b.innerHTML = `<span class="num">${ci + 1}</span><span class="tt"><b></b><small></small></span><span class="pr"></span>`;
    b.querySelector('b').textContent = L2(c.title); b.querySelector('small').textContent = L2(c.city);
    b.querySelector('.pr').textContent = !ok ? '🔒' : done ? stT('done') : `${k}/${n}`;
    b.onclick = () => { AU.init(); AU.click(); if (!ok) { stEl('stHint').textContent = stT('locked'); return; } stPlayChapter(ci); };
    box.appendChild(b);
  });
  stEl('stHint').textContent = '';
  stEl('stMenu').hidden = false; stEl('stPlayer').hidden = true; stEl('storyOv').classList.remove('playing'); stEl('storyOv').classList.add('on');
}
function stMissionCard(ci, mi) {
  const m = STORY[ci].missions[mi];
  return { scene: { lvl: [m.style, m.pal], cam: 0.35, pan: 3, fx: [m.weather === 'rain' || m.weather === 'storm' ? m.weather : null, m.weather === 'sand' ? 'sand' : null, m.weather === 'tornado' ? ['tornado', 0.75] : null, m.water ? ['flood', 236] : null, ['heli', m.heli, 0.5]].filter(Boolean) }, fade: true,
    cap: [`${stT('chapter')} ${ci + 1} · ${stT('mission')} ${mi + 1} ${stT('of')} ${STORY[ci].missions.length}\n${m.name.ar}\n${m.desc.ar}`, `${stT('chapter')} ${ci + 1} · ${stT('mission')} ${mi + 1} ${stT('of')} ${STORY[ci].missions.length}\n${m.name.en}\n${m.desc.en}`], startBtn: true };
}
function stPlayChapter(ci) {
  const c = STORY[ci], k = stFirstOpen(ci);
  if (k >= c.missions.length) { stPlay([...c.intro, ...c.outro], () => stOpenMenu()); return; } // خلص: إعادة القصة
  const lead = k === 0 ? [...c.intro] : [];
  stPlay([...lead, stMissionCard(ci, k)], () => stStartMission(ci, k));
}
function stStartMission(ci, mi) {
  const m = STORY[ci].missions[mi];
  stEl('storyOv').classList.remove('on', 'playing');
  startStoryGame(m, { ci, mi });
}
// بعد ما تخلص المهمة (فوز)
function stAfterWin(ref) {
  const c = STORY[ref.ci], m = c.missions[ref.mi];
  const nextStep = () => {
    if (ref.mi + 1 < c.missions.length) { stPlay([stMissionCard(ref.ci, ref.mi + 1)], () => stStartMission(ref.ci, ref.mi + 1)); return; }
    stPlay(c.outro, () => {
      const s = stSave(); s.ch[c.id] = true; if (c.unlockGolden) s.golden = true; persist();
      if (c.ending) { stPlay([...stCredits(), ...STORY_POST], () => stOpenMenu()); return; }
      if (ref.ci + 1 < STORY.length) stPlayChapter(ref.ci + 1); else stOpenMenu();
    });
  };
  if (m.after) stPlay(m.after, nextStep); else nextStep();
}
function stCredits() {
  return [{ scene: { room: 'dark', fx: ['fireworks'] }, cap: [`${STT.ar.end}\n\n${STT.ar.credits}\n${STT.ar.creditsBy}\nibraprogram.netlify.app · t.me/ibraprogram · TikTok: ibraprogram`, `${STT.en.end}\n\n${STT.en.credits}\n${STT.en.creditsBy}\nibraprogram.netlify.app · t.me/ibraprogram · TikTok: ibraprogram`], credits: true }];
}
