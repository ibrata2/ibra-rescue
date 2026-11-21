'use strict';
/* ============================================================
   📖 نمط القصة — قصتين:
   1) «الطوفان الأخير»: يونس آخر طيار، يسابق الماي حتى يوصل لبنته ليلى. (10 فصول)
   2) «لوح أوروك»: علي ونوال يرجّعون ألواح كلكامش المسروقة للمتحف. (6 فصول)
   كل فصل: لوحات (مقدمة) ← مهمات ← لوحات (ختام).
   اللوحة: { scene, chars: [[شخصية, x (0-1), flip?]], lines: [[منو, عربي, إنكليزي]], cap: [عربي, إنكليزي] }
   منو: شخصية باللوحة، أو 'radio'، أو 'wt:<شخصية>' (لاسلكي)، أو 'phone:<شخصية>'، أو 'cap'
   ============================================================ */

/* ---------- الشخصيات (بكسل آرت) ---------- */
const ST_CHARS = {
  // الطوفان الأخير
  younis: { ar: 'يونس', en: 'Younis', skin: '#c99670', hair: '#1c1612', top: '#4d5a3c', bottom: '#3c4630', hat: 'helmet', beard: 1 },
  laila:  { ar: 'ليلى', en: 'Laila', skin: '#e0ae86', hair: '#2a1a10', top: '#e2b43c', bottom: '#2f3a52', hat: 'long', kid: 1, item: 'walkie' },
  saad:   { ar: 'الحجية سعدية', en: 'Hajjiya Saadiya', skin: '#d2a07a', hair: '#111', top: '#141414', bottom: '#141414', hat: 'abaya', glasses: 1, dress: 1, short: 1 },
  salma:  { ar: 'سلمى', en: 'Salma', skin: '#dcae88', hair: '#2a1a10', top: '#2a3a5a', bottom: '#2a3a5a', hat: 'hijab', scarf: '#6b2f3a', item: 'headset' },
  murad:  { ar: 'الكابتن مراد', en: 'Captain Murad', skin: '#c08a62', hair: '#bdb8ac', top: '#5a5040', bottom: '#4a4234', hat: 'helmet', mustache: 1 },
  asim:   { ar: 'عاصم', en: 'Asim', skin: '#d8a882', hair: '#111', top: '#a8853a', bottom: '#222', hat: 'slick', shades: 1 },
  abuali: { ar: 'أبو علي', en: 'Abu Ali', skin: '#b98258', hair: '#ddd', top: '#3a3026', bottom: '#3a3026', hat: 'yashmagh', beard: 1, dress: 1 },
  // لوح أوروك
  ali:    { ar: 'علي', en: 'Ali', skin: '#c48f68', hair: '#161210', top: '#2f3a44', bottom: '#2a2620', hat: 'cap', mustache: 1 },
  nawal:  { ar: 'د. نوال', en: 'Dr. Nawal', skin: '#dcae88', hair: '#2a1a10', top: '#6a4a2e', bottom: '#3a3026', hat: 'hijab', scarf: '#c9a84c', glasses: 1 },
  jabbar: { ar: 'جبّار', en: 'Jabbar', skin: '#c9946a', hair: '#1c1612', top: '#3a3a3a', bottom: '#2a2a2a', hat: 'slick', mustache: 1, wide: 1, item: 'phone' },
  dijk:   { ar: 'فان دايك', en: 'Van Dijk', skin: '#ecc8a8', hair: '#d9c27a', top: '#1f2533', bottom: '#1f2533', hat: 'slick', tie: '#7a1a2a' },
  kenji:  { ar: 'كينجي', en: 'Kenji', skin: '#e6c09a', hair: '#cfcac0', top: '#6a6f60', bottom: '#3a3a36', hat: 'bald', glasses: 1 },
  guard:  { ar: 'حارس', en: 'Guard', skin: '#d0a07a', hair: '#222', top: '#1a1a1a', bottom: '#1a1a1a', hat: 'slick', shades: 1 },
  man:    { ar: 'واحد', en: 'A man', skin: '#d0a07a', hair: '#222', top: '#4a6a4a', bottom: '#33302a', hat: null },
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
  if (c.hat === 'hijab') { R(-5, -28 + hy, 10, 3, c.scarf); R(-5, -25 + hy, 1, 7, c.scarf); R(4, -25 + hy, 1, 7, c.scarf); R(-4, -20 + hy, 8, 2, c.scarf); }
  else if (c.hat === 'cap') { R(-4, -29 + hy, 8, 3, '#2a3a2a'); R(c.flipCap ? -7 : 3, -27 + hy, 4, 1, '#2a3a2a'); }
  else if (c.hat === 'abaya') { R(-5, -28 + hy, 10, 3, c.top); R(-5, -25 + hy, 1, 6, c.top); R(4, -25 + hy, 1, 6, c.top); }
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
  if (c.item === 'walkie') { R(6 + w, -15 + sh, 3, 5, '#d8323c'); R(7 + w, -18 + sh, 1, 3, '#222'); R(7 + w, -14 + sh, 1, 1, (t % 1 < 0.5) ? '#4ae86a' : '#1a4a2a'); }
  if (c.item === 'headset') { R(-5, -27 + sh, 1, 4, '#222'); R(-5, -23 + sh, 4, 1, '#222'); }
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
  else if (kind === 'cockpit') { // داخل الطيارة بالليل والمطر على الزجاج
    g.fillStyle = '#0d0f12'; g.fillRect(0, 0, ST_W, ST_H);
    g.fillStyle = '#1a2a38'; g.beginPath(); g.moveTo(30, 20); g.lineTo(450, 20); g.lineTo(470, 170); g.lineTo(10, 170); g.fill();
    g.fillStyle = 'rgba(180,200,220,0.35)'; for (let i = 0; i < 70; i++) { const x = (i * 67) % 440 + 20, y = ((i * 41 + t * 60) % 150) + 20; g.fillRect(x, y, 1, 3 + (i % 3)); }
    g.fillStyle = '#1b1814'; g.fillRect(236, 20, 8, 150); g.fillStyle = '#26221c'; g.fillRect(0, 170, ST_W, 100);
    for (let i = 0; i < 9; i++) { g.fillStyle = '#0f0d0a'; g.beginPath(); g.arc(60 + i * 45, 205, 13, 0, 7); g.fill(); g.fillStyle = i === 3 && (t % 1 < 0.5) ? '#e83a3a' : '#4ae86a'; g.fillRect(58 + i * 45, 200, 4, 2); }
  } else if (kind === 'stairs') { // درج بيت ليلى والماي
    g.fillStyle = '#16140f'; g.fillRect(0, 0, ST_W, ST_H);
    g.fillStyle = '#2a251d'; g.fillRect(0, 0, 150, ST_H);
    for (let i = 0; i < 10; i++) { const y = 250 - i * 20, x = 140 + i * 24; g.fillStyle = '#4a4236'; g.fillRect(x, y, 240 - i * 4, 20); g.fillStyle = '#6a5e4a'; g.fillRect(x, y, 240 - i * 4, 2); g.fillStyle = '#c9a84c'; g.font = 'bold 10px monospace'; g.textAlign = 'left'; g.fillText(String(i + 1), x + 4, y + 14); }
    g.fillStyle = 'rgba(255,220,140,0.10)'; g.beginPath(); g.moveTo(400, 0); g.lineTo(300, 270); g.lineTo(480, 270); g.lineTo(480, 0); g.fill();
  } else if (kind === 'deck') { // سطح السفينة الأخيرة
    g.fillStyle = '#0c0d10'; g.fillRect(0, 0, ST_W, ST_H);
    g.fillStyle = '#2a3036'; g.fillRect(0, 180, ST_W, 90); g.fillStyle = '#3a4046'; g.fillRect(0, 176, ST_W, 6);
    for (let i = 0; i < 40; i++) { g.fillStyle = '#1a1e22'; const x = i * 13 + (i % 3) * 3, h = 14 + (i * 7) % 10; g.fillRect(x, 176 - h, 4, h); g.fillRect(x - 1, 176 - h - 4, 6, 4); }
    g.fillStyle = '#3a4046'; g.fillRect(360, 60, 80, 116); g.fillStyle = '#e8d8a8'; for (let i = 0; i < 4; i++) g.fillRect(370 + i * 17, 80, 8, 6);
  } else if (kind === 'museum') { // المتحف العراقي
    g.fillStyle = '#e4d8bc'; g.fillRect(0, 0, ST_W, ST_H);
    for (let x = 30; x < ST_W; x += 90) { g.fillStyle = '#cdbf9c'; g.fillRect(x, 20, 26, 170); g.fillStyle = '#b8aa86'; g.fillRect(x - 4, 16, 34, 8); g.fillRect(x - 4, 186, 34, 8); }
    g.fillStyle = '#8a6a44'; g.fillRect(0, 196, ST_W, 74);
    g.fillStyle = '#c4b28a'; g.fillRect(190, 120, 100, 80); g.fillStyle = 'rgba(200,230,255,0.35)'; g.fillRect(196, 70, 88, 52); g.fillStyle = '#9a8a6a'; g.fillRect(196, 70, 88, 2);
  } else if (kind === 'warehouse') { // مستودع المزاد
    g.fillStyle = '#121214'; g.fillRect(0, 0, ST_W, ST_H);
    for (let i = 0; i < 6; i++) { g.fillStyle = '#1e1e22'; g.fillRect(i * 84, 0, 4, 200); }
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { g.fillStyle = ['#5a2a22', '#2a3a4a', '#4a4a2a'][(i + j) % 3]; g.fillRect(10 + i * 96, 110 + j * 30, 80, 28); g.fillStyle = 'rgba(0,0,0,0.3)'; for (let k = 0; k < 8; k++) g.fillRect(14 + i * 96 + k * 10, 112 + j * 30, 2, 24); }
    g.fillStyle = 'rgba(255,240,200,0.15)'; g.beginPath(); g.moveTo(240, 0); g.lineTo(170, 200); g.lineTo(310, 200); g.fill();
    g.fillStyle = '#1a1a1c'; g.fillRect(0, 200, ST_W, 70);
  }
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
    if (k === 'steps') { // الماي واصل للدرجة a
      const n = a || 1, wy = 270 - n * 20; g.fillStyle = 'rgba(30,60,80,0.85)'; g.fillRect(0, wy, ST_W, ST_H - wy);
      for (let x = 0; x < ST_W; x += 10) { g.fillStyle = 'rgba(200,230,240,0.45)'; g.fillRect(x + Math.round(Math.sin(t * 2 + x) * 3), wy + 1, 5, 1); }
    }
    if (k === 'chalk') { // كتابة بالطباشير على السطح
      g.save(); g.translate(240, 228); g.rotate(-0.03); g.fillStyle = 'rgba(245,240,225,0.92)'; g.font = 'bold 15px Tahoma'; g.textAlign = 'center'; g.fillText(a || '', 0, 0); g.font = '12px Tahoma'; g.fillText(b || '', 0, 22); g.restore();
    }
    if (k === 'sun') { const r = 34, cx = 380, cy = 120 - Math.min(40, t * 6); g.fillStyle = 'rgba(255,200,120,0.18)'; g.beginPath(); g.arc(cx, cy, r * 2.2, 0, 7); g.fill(); g.fillStyle = '#f6c86a'; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.fillStyle = 'rgba(255,190,110,0.25)'; g.fillRect(0, 0, ST_W, ST_H); }
    if (k === 'ark') { const x = (a ?? 0.5) * ST_W, y = b ?? 214, tl = Math.sin(t * 0.8) * 0.04; g.save(); g.translate(x, y); g.rotate(tl + (k === 'ark' && a === -1 ? 0.2 : 0)); g.fillStyle = '#20252b'; g.beginPath(); g.moveTo(-150, -10); g.lineTo(150, -10); g.lineTo(120, 22); g.lineTo(-120, 22); g.fill(); g.fillStyle = '#2e353c'; g.fillRect(40, -46, 70, 36); g.fillStyle = '#e8d8a8'; for (let i = 0; i < 4; i++) g.fillRect(48 + i * 16, -36, 7, 5); for (let i = 0; i < 60; i++) { g.fillStyle = '#c9c0a8'; g.fillRect(-140 + i * 3.2, -14 - (i % 3), 1, 4); } g.restore(); }
    if (k === 'tablet') { const x = (a ?? 0.5) * ST_W, y = b ?? 180; g.fillStyle = `rgba(232,200,110,${0.2 + 0.1 * Math.sin(t * 3)})`; g.beginPath(); g.arc(x, y, 34, 0, 7); g.fill(); g.fillStyle = '#9a7a52'; g.fillRect(x - 16, y - 20, 32, 40); g.fillStyle = '#7a5a3a'; for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) if ((r * 7 + c * 3) % 4) g.fillRect(x - 13 + c * 5, y - 16 + r * 5, 3, 1); }
    if (k === 'crate') { const x = (a ?? 0.5) * ST_W; g.fillStyle = '#6a4a2a'; g.fillRect(x - 22, 214, 44, 30); g.fillStyle = '#8a6a3a'; g.fillRect(x - 22, 214, 44, 3); g.fillRect(x - 22, 228, 44, 2); g.fillStyle = '#c8323c'; g.font = 'bold 8px monospace'; g.textAlign = 'center'; g.fillText('FRAGILE', x, 225); }
    if (k === 'tape') { g.fillStyle = '#222'; g.fillRect(a * ST_W, 224, 30, 18); g.fillStyle = '#eee'; g.beginPath(); g.arc(a * ST_W + 9, 233, 4, 0, 7); g.arc(a * ST_W + 21, 233, 4, 0, 7); g.fill(); }
  }
}

/* ---------- المهمات (نفس صيغة missions.js) ---------- */
const ST_CITY = {
  baghdad: [33.3, 44.4, 'بغداد', 'Baghdad'], basra: [30.5, 47.8, 'البصرة', 'Basra'], tokyo: [35.7, 139.7, 'طوكيو', 'Tokyo'], dubai: [25.2, 55.3, 'دبي', 'Dubai'], marsh: [31.0, 47.0, 'الأهوار', 'Iraqi Marshes'],
  cairo: [30.0, 31.2, 'القاهرة', 'Cairo'], mountain: [36.6, 44.6, 'الجبل', 'The Mountain'], mumbai: [19.1, 72.9, 'مومباي', 'Mumbai'], rotterdam: [51.9, 4.5, 'روتردام', 'Rotterdam'],
};
function sm(id, o) {
  const c = ST_CITY[o.at || o.style] || ST_CITY.baghdad;
  const m = Object.assign({ heli: 'small', type: 'rescue', pal: 'night', weather: 'clear', zones: 'pad', worldW: 1400, people: (o.goal || 4) + 2, time: 220, wind: { base: 0, gust: 6 } }, o);
  m.id = 'st_' + id; m.lat = c[0]; m.lon = c[1]; m.city = o.city || { ar: c[2], en: c[3] };
  m.name = { ar: o.name[0], en: o.name[1] }; m.desc = { ar: o.desc[0], en: o.desc[1] };
  if (m.type === 'animals' && !o.people) m.people = m.goal * 2 + 2;
  delete m.at;
  return Object.assign(m, { story: true, after: o.after || null });
}
const W_FLOOD = (y, to, rate) => ({ y, to, rate });
const WT = (who, n, ar, en) => ({ scene: { room: 'stairs', fx: [['steps', n]] }, chars: [['laila', 0.78, 1]], lines: [[who, ar, en]] });
const LL = (ar, en) => ({ ar: [].concat(ar), en: [].concat(en) });

/* ============================================================
   القصة 1: الطوفان الأخير
   ============================================================ */
const STORY_FLOOD = [
  { // ───────── 1
    id: 'f1', title: ['الليلة اللي ما طلع بيها الفجر', 'The Night Without Dawn'], city: ['البصرة', 'Basra'],
    intro: [
      { scene: { lvl: ['baghdad', 'night', 'rain'], cam: 0.2, pan: 4, fx: ['rain', ['flood', 238]] }, cap: ['اليوم الثالث من المطر. شط العرب يصعد… بلا سبب.', 'The third day of rain. The Shatt al-Arab is rising… for no reason.'] },
      { scene: { room: 'tower' }, chars: [['younis', 0.32], ['salma', 0.66, 1]], lines: [['salma', 'يونس، العشّار كله فوگ السطوح. إنت الوحيد اللي طيارته شغالة.', 'Younis, all of Ashar is up on the rooftops. Yours is the only heli that works.'], ['younis', 'وباقي الطيارين؟', 'And the other pilots?'], ['salma', 'راحوا لأهلهم. ما ألومهم.', "They went to their families. I don't blame them."]] },
      { scene: { room: 'cockpit' }, chars: [], lines: [['wt:laila', 'بابا؟ جدو تگول لا تخافين. آني مو خايفة. شوكت ترجع؟', "Dad? Grandma says don't be scared. I'm not scared. When are you coming back?"], ['radio', 'يونس: قبل لا يوصل الماي للسطح. وعد.', 'Younis: Before the water reaches the roof. I promise.']] },
    ],
    missions: [
      sm('f1_1', { at: 'basra', style: 'baghdad', name: ['العشّار', 'Ashar'], desc: ['أول نداء. 3 ناس فوگ سطح والمطر ما يوقف. نزّل الحبل جنبهم ووصّلهم للمهبط.', 'First call. 3 people on a roof, endless rain. Lower the rope beside them and take them to the pad.'], goal: 3, people: 4, weather: 'rain', time: 230, lines: { wait: LL(['هنا! هنا!', 'الحمد لله… طيارة!'], ['Here! Over here!', 'Thank God… a helicopter!']) } }),
      sm('f1_2', { at: 'basra', style: 'baghdad', name: ['الكورنيش', 'The Corniche'], desc: ['الماي غطّى الكورنيش. الناس يسبحون… نزّل الحبل للماي.', 'Water has covered the Corniche. People are swimming… lower the rope into the water.'], goal: 4, weather: 'rain', zones: 'boat', water: W_FLOOD(260, 246, 0.08), time: 230 }),
      sm('f1_3', { at: 'basra', style: 'baghdad', type: 'cargo', cargo: 'medicine', heli: 'medic', name: ['دوا المستشفى', 'Hospital Medicine'], desc: ['المستشفى التعليمي باقي بيه مرضى. انقل صناديق الدوا للسطح.', 'The teaching hospital still has patients. Carry the medicine crates to its roof.'], goal: 4, weather: 'rain', time: 230 }),
      sm('f1_4', { at: 'basra', style: 'baghdad', name: ['الماي يصعد', 'The Water Rises'], desc: ['الماي يصعد بسرعة. 5 ناس، والوقت قليل.', 'The water is rising fast. 5 people, and little time.'], goal: 5, people: 7, weather: 'storm', zones: 'boat', water: W_FLOOD(264, 232, 0.2), time: 240 }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.6, fx: ['rain', ['flood', 210], ['heli', 'small', 0.5]] }, cap: ['من فوگ، يونس شاف الحقيقة: البحر مو بمكانه. البحر دخل للمدينة.', 'From above, Younis saw the truth: the sea was not where it belonged. The sea had come into the city.'] },
      WT('wt:laila', 1, 'بابا، الماي دخل للحوش. جدو گالت نصعد للدرج. آني بالدرجة الأولى.', "Dad, the water is in the yard. Grandma said go up the stairs. I'm on the first step."),
    ],
  },
  { // ───────── 2
    id: 'f2', title: ['دجلة يطلع من مكانه', 'The Tigris Leaves Its Bed'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { room: 'cockpit' }, chars: [], lines: [['radio', 'سلمى: يونس، مستشفى الكرادة يغرق. 40 مريض فوگ السطح. إنت أقرب طيارة.', 'Salma: Younis, the Karrada hospital is flooding. 40 patients on the roof. You are the closest heli.'], ['radio', 'يونس: بيتي بعد شارعين…', 'Younis: My house is two streets away…'], ['radio', 'سلمى: أدري. …آسفة.', 'Salma: I know. …I\'m sorry.']] },
    ],
    missions: [
      sm('f2_1', { style: 'baghdad', type: 'careful', careful: true, heli: 'medic', name: ['المستشفى', 'The Hospital'], desc: ['مرضى كبار بالعمر. بهدوء… إذا واحد طاح من الحبل تفشل المهمة.', 'Elderly patients. Gently… if anyone falls off the rope, you fail.'], goal: 4, time: 260, lines: { wait: LL(['ابني بشويش… عظامي ما تتحمل'], ['Easy, son… my bones can\'t take it']) } }),
      sm('f2_2', { style: 'baghdad', name: ['سطوح الكرادة', 'Karrada Rooftops'], desc: ['الحي كله فوگ السطوح. وصّلهم للقوارب.', 'The whole district is on the roofs. Get them to the boats.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(262, 240, 0.1), weather: 'rain', time: 250 }),
      sm('f2_3', { style: 'baghdad', type: 'fire', fire: 3, name: ['الكهرباء والماي', 'Power and Water'], desc: ['الأسلاك تتماس ويه الماي وبدت الحرائق. لا تطير فوگ النار.', 'Wires short out in the water and fires break out. Don\'t fly over the flames.'], goal: 5, time: 240 }),
      sm('f2_4', { style: 'baghdad', name: ['برج بغداد', 'Baghdad Tower'], desc: ['ناس صعدوا لشرفة برج بغداد لأنه أعلى مكان. انتبه للحبل.', 'People climbed to Baghdad Tower\'s deck — the highest place around. Mind the rope.'], goal: 5, people: 6, worldW: 1700, wind: { base: -4, gust: 16 }, time: 250 }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.35, fx: ['rain', ['flood', 222]] }, cap: ['من بعيد، شاف بيته. ضوا الشباك بعده شغّال.', 'From afar, he saw his house. The window light was still on.'], lines: [['radio', 'سلمى: يونس… الأهوار ما بيها ولا طيارة.', 'Salma: Younis… there isn\'t a single heli over the marshes.']] },
      { scene: { room: 'cockpit' }, chars: [], cap: ['ثلاث ثواني سكوت.', 'Three seconds of silence.'], lines: [['radio', 'يونس: …رايح للأهوار.', 'Younis: …Heading to the marshes.']] },
      WT('wt:laila', 3, 'بابا شفت طيارة تلف فوگ الحي… هاي إنت؟ …مو مشكلة. الماي بالدرجة الثالثة بس.', 'Dad, I saw a heli circling our street… was that you? …It\'s okay. The water\'s only on the third step.'),
    ],
  },
  { // ───────── 3
    id: 'f3', title: ['الماي الغريب', 'The Strange Water'], city: ['الأهوار', 'The Marshes'],
    intro: [
      { scene: { lvl: ['marsh', 'dusk'], cam: 0.4, fx: [['flood', 230]] }, chars: [['abuali', 0.4], ['younis', 0.66, 1]], lines: [['abuali', 'ما أصعد بدون جاموسي.', 'I\'m not going without my buffalo.'], ['younis', 'حجي، الجاموس ما يدخل الطيارة!', 'Hajji, a buffalo won\'t fit in a helicopter!'], ['abuali', '(يذوق الماي ويسكت)… مالح. هذا مو ماينا يا ابني. هذا ماي بحر.', '(tastes the water, falls silent)… Salty. This isn\'t our water, son. This is sea water.']] },
    ],
    missions: [
      sm('f3_1', { style: 'marsh', type: 'animals', name: ['الحلال', 'The Herd'], desc: ['الحيوانات ما تمسك الحبل. خلّي المعلّق يشيلها بإيده.', 'Animals can\'t hold the rope. Let a hanging person carry them.'], goal: 3, zones: 'boat', water: W_FLOOD(258, 258, 0), pal: 'dusk', time: 250 }),
      sm('f3_2', { style: 'marsh', name: ['المضايف', 'The Mudhifs'], desc: ['عوائل فوگ المضايف والريح قوية.', 'Families on the mudhifs and strong wind.'], goal: 5, zones: 'boat', water: W_FLOOD(258, 250, 0.04), weather: 'wind', wind: { base: -8, gust: 22 }, time: 240 }),
      sm('f3_3', { style: 'marsh', type: 'cargo', cargo: 'flour', name: ['الطحين', 'Flour'], desc: ['القرى المعزولة ما عندها أكل. انقل صناديق الطحين.', 'The cut-off villages have no food. Carry the flour crates.'], goal: 4, zones: 'boat', water: W_FLOOD(258, 258, 0), time: 230 }),
      sm('f3_4', { style: 'marsh', name: ['ليل القصب', 'Night in the Reeds'], desc: ['ظلام ومطر. آخر عوائل الهور.', 'Darkness and rain. The last families of the marsh.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(258, 244, 0.06), weather: 'storm', time: 260 }),
    ],
    outro: [
      { scene: { lvl: ['marsh', 'night'], cam: 0.5, fx: [['flood', 214], ['heli', 'small', 0.6]] }, chars: [['abuali', 0.3]], lines: [['abuali', 'ألف سنة هذا المضيف واگف… وراح بليلة.', 'A thousand years this mudhif stood… and it\'s gone in one night.']], note: ['أول مرة يشوف يونس نفسه يمسح عيونه.', 'For the first time, Younis catches himself wiping his eyes.'] },
      WT('wt:laila', 5, 'بابا، الماي بالدرجة الخامسة. جدو طلّعت الفراش للسطح. صار بيتنا بالسطح 🙂', 'Dad, the water\'s on the fifth step. Grandma took the mattresses to the roof. Our house is on the roof now 🙂'),
    ],
  },
  { // ───────── 4
    id: 'f4', title: ['المقعد بألف', 'A Seat for a Thousand'], city: ['دبي', 'Dubai'],
    intro: [
      { scene: { lvl: ['dubai', 'dusk'], cam: 0.4, fx: ['sand'] }, cap: ['العالم كله يغرق، مو بس العراق. سلمى تحوّله لدبي.', 'The whole world is drowning, not just Iraq. Salma sends him to Dubai.'] },
      { scene: { lvl: ['dubai', 'dusk'], cam: 0.7 }, chars: [['asim', 0.35], ['younis', 0.65, 1]], lines: [['asim', 'المقعد بألف دولار. الماي ما ينتظر.', 'A seat costs a thousand dollars. The water won\'t wait.'], ['younis', 'والعمّال بالطوابق الواطية؟', 'And the workers on the lower floors?'], ['asim', 'يدفعون… أو يسبحون.', 'They pay… or they swim.']] },
    ],
    missions: [
      sm('f4_1', { style: 'dubai', pal: 'dusk', name: ['العمّال أولاً', 'Workers First'], desc: ['عاصم ياخذ اللي يدفع من فوگ. إنت خذ العمّال من الشرفات الواطية.', 'Asim takes whoever pays from the top. You take the workers from the low balconies.'], goal: 5, weather: 'sand', wind: { base: 8, gust: 22 }, time: 240, lines: { wait: LL(['ما عندي فلوس… بس عندي عيال'], ['I have no money… but I have kids']) } }),
      sm('f4_2', { style: 'dubai', pal: 'night', type: 'vip', vipName: { ar: 'الطفل الضايع', en: 'the lost boy' }, name: ['الشخص المهم', 'The Important Person'], desc: ['الشخص المهم مو مليونير… طفل ضايع يدوّر على أمه. لازم يوصل.', 'The important person isn\'t a millionaire… it\'s a lost boy looking for his mother. He must make it.'], goal: 5, time: 250 }),
      sm('f4_3', { style: 'dubai', pal: 'dusk', type: 'cargo', cargo: 'medicine', name: ['ماي الشرب', 'Drinking Water'], desc: ['الماي بكل مكان… وماكو ماي للشرب. انقل الصناديق.', 'Water everywhere… and none to drink. Carry the crates.'], goal: 5, weather: 'sand', time: 230 }),
      sm('f4_4', { style: 'dubai', pal: 'night', type: 'fire', fire: 4, name: ['البرج يحترگ', 'The Tower Burns'], desc: ['حريق بالأبراج. لا تطير فوگ النار.', 'Fire in the towers. Don\'t fly over the flames.'], goal: 6, time: 250 }),
    ],
    outro: [
      { scene: { room: 'cockpit' }, chars: [], lines: [['radio', 'عاصم: إنت غبي يونس. بالآخر الكل يغرق… خلّينا نغرق أغنياء.', 'Asim: You\'re a fool, Younis. In the end everyone drowns… let\'s drown rich.'], ['cap', '(يونس يسكّر الموجة)', '(Younis switches off the channel)', '']] },
      WT('wt:laila', 6, 'بابا، الإذاعة تگول أكو سفينة كبيرة تلمّ الناس. جدو تگول ننتظرك إنت.', 'Dad, the radio says a huge ship is gathering people. Grandma says we\'re waiting for you.'),
    ],
  },
  { // ───────── 5
    id: 'f5', title: ['السفينة الأخيرة', 'The Last Ship'], city: ['القاهرة', 'Cairo'],
    intro: [
      { scene: { room: 'tower' }, chars: [['salma', 0.5]], lines: [['salma', 'لكل الطيارين: «السفينة الأخيرة» تلمّ الناس من الموانئ وتروح للجبل. آخر أرض يابسة.', 'To all pilots: "The Last Ship" is gathering people from the ports and heading to the Mountain. The last dry land.'], ['salma', 'المشكلة… الوقود دا يخلص.', 'The problem… fuel is running out.']] },
      { scene: { lvl: ['cairo', 'dusk'], cam: 0.5, fx: [['parked', 'chinook', 0.55]] }, chars: [['murad', 0.3], ['younis', 0.75, 1]], lines: [['murad', 'يونس! كبرت يا ابني. آخر مرة شفتك جنت تخاف من الهبوط.', 'Younis! You grew up, son. Last time I saw you, you were scared of landing.'], ['younis', 'بعدني أخاف، كابتن.', 'I still am, Captain.'], ['murad', 'زين. اللي ما يخاف يموت أول واحد.', 'Good. The ones who aren\'t scared die first.']] },
    ],
    missions: [
      sm('f5_1', { style: 'cairo', pal: 'dusk', type: 'cargo', cargo: 'flour', name: ['براميل الوقود', 'Fuel Drums'], desc: ['بدون وقود ماكو إنقاذ. انقل الصناديق للمهبط.', 'No fuel, no rescues. Carry the crates to the pad.'], goal: 5, time: 230 }),
      sm('f5_2', { style: 'cairo', pal: 'night', name: ['النيل يرجع لورا', 'The Nile Flows Back'], desc: ['البحر يدفع النيل لورا. الناس بالفلايك والسطوح.', 'The sea pushes the Nile backwards. People on feluccas and rooftops.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(262, 242, 0.1), time: 250 }),
      sm('f5_3', { style: 'cairo', pal: 'dusk', type: 'careful', careful: true, heli: 'medic', name: ['دار المسنين', 'The Care Home'], desc: ['بهدوء… ولا واحد يطيح.', 'Gently… not a single one falls.'], goal: 4, time: 260 }),
      sm('f5_4', { style: 'cairo', pal: 'night', name: ['برج القاهرة', 'Cairo Tower'], desc: ['ناس على شرفة برج القاهرة. الريح قوية فوگ.', 'People on Cairo Tower\'s deck. Strong wind up there.'], goal: 5, worldW: 1700, wind: { base: 6, gust: 20 }, time: 250 }),
    ],
    outro: [
      { scene: { lvl: ['cairo', 'night'], cam: 0.3 }, chars: [['murad', 0.4], ['younis', 0.62, 1]], cap: ['فوگ سطح، خبز يابس وچاي بارد.', 'On a rooftop: stale bread and cold tea.'], lines: [['murad', 'تعرف ليش إحنا باقين؟ لأن ما نعرف نوگف.', 'You know why we\'re still alive? Because we don\'t know how to stop.'], ['murad', 'الطيار ما يبچي بالجو. يبچي بعدين.', 'A pilot doesn\'t cry in the air. He cries later.']] },
      WT('wt:laila', 8, 'بابا… الماي بالدرجة الثامنة. (سكوت) …بس باقي بعد درجتين على السطح.', 'Dad… the water\'s on the eighth step. (silence) …But there are still two more steps to the roof.'),
    ],
  },
  { // ───────── 6
    id: 'f6', title: ['المدينة اللي حاربت البحر', 'The City That Fought the Sea'], city: ['روتردام', 'Rotterdam'],
    intro: [
      { scene: { lvl: ['rotterdam', 'night'], cam: 0.3, fx: ['storm', ['flood', 226]] }, cap: ['السدود اللي حمتها مية سنة… انكسرت بليلة.', 'The dikes that protected it for a hundred years… broke in one night.'] },
      { scene: { lvl: ['rotterdam', 'night'], cam: 0.5, fx: [['heli', 'chinook', 0.5]] }, chars: [], lines: [['radio', 'مراد: يونس، اسمع. الشينوك ما يحتاج يهبط. نزّل السلّم وهم يصعدون للباب.', 'Murad: Younis, listen. A Chinook doesn\'t need to land. Drop the ladder and they climb to the door.'], ['radio', 'مراد: وفوگ القارب، ينزلون بنفس السلّم.', 'Murad: And over the boat, they climb down the same ladder.']] },
    ],
    missions: [
      sm('f6_1', { style: 'rotterdam', heli: 'chinook', name: ['السلّم', 'The Ladder'], desc: ['الشينوك عنده سلّم من الباب. قرّب السلّم من الناس، يصعدون. فوگ القارب ينزلون.', 'The Chinook has a ladder at its door. Bring it close — people climb up. Over the boat, they climb down.'], goal: 5, zones: 'boat', water: W_FLOOD(262, 250, 0.05), time: 260 }),
      sm('f6_2', { style: 'rotterdam', heli: 'chinook', name: ['الميناء', 'The Harbour'], desc: ['الحاويات صارت جزر. القارب إله حد… إذا امتلى يطلع ويرجع.', 'The containers became islands. The boat has a limit… when full, it sails off and returns.'], goal: 8, people: 10, zones: 'boat', water: W_FLOOD(262, 246, 0.08), weather: 'rain', time: 280 }),
      sm('f6_3', { style: 'rotterdam', heli: 'chinook', name: ['هوتيل نيويورك', 'Hotel New York'], desc: ['ناس على سطح الفندق القديم والعاصفة تشتد.', 'People on the old hotel roof as the storm worsens.'], goal: 7, people: 9, zones: 'boat', water: W_FLOOD(262, 244, 0.1), weather: 'storm', wind: { base: -6, gust: 20 }, time: 280 }),
      sm('f6_4', { style: 'rotterdam', heli: 'chinook', name: ['آخر طلعة لمراد', "Murad's Last Run"], desc: ['مراد يحتاجك. 10 ناس على الرافعات والعاصفة بأقواها.', 'Murad needs you. 10 people on the cranes and the storm at its worst.'], goal: 10, people: 12, zones: 'boat', water: W_FLOOD(262, 238, 0.12), weather: 'storm', wind: { base: 8, gust: 26 }, time: 320 }),
    ],
    outro: [
      { scene: { lvl: ['rotterdam', 'night'], cam: 0.6, fx: ['storm', ['flood', 226]] }, cap: ['مراد بآخر طلعة. السلّم مليان. الريح تضربه بالرافعة.', 'Murad on his last run. The ladder full. The wind slams him into a crane.'], lines: [['radio', 'مراد: يونس… الناس وصلوا؟', 'Murad: Younis… did the people make it?'], ['radio', 'يونس: وصلوا كلهم، كابتن.', 'Younis: All of them, Captain.'], ['radio', 'مراد: زين. لا توگف. الناس تنتظر…', 'Murad: Good. Don\'t stop. People are waiting…']] },
      { scene: { room: 'dark' }, cap: ['…وانقطع الصوت.', '…and the voice was gone.'] },
      { scene: { room: 'stairs', fx: [['steps', 8]] }, chars: [['laila', 0.78, 1]], lines: [['wt:laila', 'بابا؟ بابا إنت هنا؟', 'Dad? Dad, are you there?'], ['radio', 'يونس: …هنا حبيبتي. هنا.', 'Younis: …I\'m here, sweetheart. I\'m here.']] },
    ],
    unlockGolden: true,
  },
  { // ───────── 7
    id: 'f7', title: ['البرج', 'The Tower'], city: ['طوكيو', 'Tokyo'],
    intro: [
      { scene: { lvl: ['tokyo', 'night'], cam: 0.5, fx: [['tornado', 0.7], 'storm'] }, cap: ['أعاصير ما شافها أحد. مئات الناس صعدوا لشرفات البرج لأنه أعلى شي.', 'Twisters nobody had ever seen. Hundreds climbed the tower\'s decks — the highest thing around.'], lines: [['radio', 'سلمى: …بقينا 3 طيارين بالعالم.', 'Salma: …There are 3 pilots left in the world.']] },
    ],
    missions: [
      sm('f7_1', { style: 'tokyo', name: ['شرفات البرج', 'The Tower Decks'], desc: ['الناس على شرفات البرج. الحبل الطويل يضرب الحديد… طير أعلى.', 'People on the tower decks. A long rope hits the steel… fly higher.'], goal: 6, people: 8, worldW: 1800, wind: { base: 0, gust: 14 }, time: 270 }),
      sm('f7_2', { style: 'tokyo', name: ['الإعصار', 'The Twister'], desc: ['الإعصار يشيل الناس من السطوح. طلّعهم قبله.', 'The twister lifts people off the roofs. Get them out first.'], goal: 6, weather: 'tornado', tornados: 1, time: 270 }),
      sm('f7_3', { style: 'tokyo', type: 'animals', name: ['البزازين', 'The Cats'], desc: ['حي كامل يرفض يطلع بدون بزازينه.', 'A whole street refuses to leave without their cats.'], goal: 4, weather: 'rain', time: 250 }),
      sm('f7_4', { style: 'tokyo', name: ['ليلة بلا ضوا', 'A Night Without Light'], desc: ['الكهرباء انقطعت بالمدينة كلها. آخر الناس.', 'Power is out across the whole city. The last people.'], goal: 7, people: 9, weather: 'storm', zones: 'boat', water: W_FLOOD(264, 240, 0.1), time: 290 }),
    ],
    outro: [
      { scene: { room: 'cockpit' }, chars: [], lines: [['radio', 'يونس: ليلى؟ … ليلى، تسمعيني؟', 'Younis: Laila? … Laila, can you hear me?'], ['cap', '(تشويش)', '(static)', '']] },
      { scene: { room: 'stairs', fx: [['steps', 9]] }, chars: [], cap: ['…صمت.', '…silence.'], lines: [['radio', 'يونس: إذا تسمعيني… لا تنزلين من السطح.', 'Younis: If you can hear me… don\'t come down from the roof.']] },
    ],
  },
  { // ───────── 8
    id: 'f8', title: ['عاصم', 'Asim'], city: ['مومباي', 'Mumbai'],
    intro: [
      { scene: { lvl: ['mumbai', 'night'], cam: 0.4, fx: ['storm', ['flood', 228]] }, cap: ['طيارة عاصم طاحت بنص المدينة. هو والأغنياء اللي وياه فوگ سطح يغرق.', 'Asim\'s heli went down in the middle of the city. He and his rich passengers are on a sinking roof.'], lines: [['radio', 'عاصم: يونس… أدري شنو راح تگول.', 'Asim: Younis… I know what you\'re going to say.'], ['radio', 'يونس: ما راح أگول شي. ثبّت رجلك.', 'Younis: I\'m not saying anything. Brace yourself.']] },
    ],
    missions: [
      sm('f8_1', { style: 'mumbai', name: ['موسم الأمطار', 'Monsoon'], desc: ['مطر ما يوقف والماي يصعد.', 'Endless rain and rising water.'], goal: 6, people: 8, weather: 'storm', zones: 'boat', water: W_FLOOD(264, 238, 0.14), time: 270 }),
      sm('f8_2', { style: 'mumbai', name: ['بوابة الهند', 'Gateway of India'], desc: ['الناس فوگ البوابة القديمة. البحر يضربها.', 'People atop the old gateway. The sea pounds it.'], goal: 5, zones: 'boat', water: W_FLOOD(262, 246, 0.08), wind: { base: -6, gust: 18 }, time: 250 }),
      sm('f8_3', { style: 'mumbai', type: 'vip', vipName: { ar: 'عاصم', en: 'Asim' }, name: ['عاصم', 'Asim'], desc: ['عاصم والأغنياء فوگ السطح. اللي باعك… هسه يحتاجك. عاصم لازم يوصل.', 'Asim and the rich on the roof. The man who sold seats… now needs you. Asim must make it.'], goal: 6, zones: 'boat', water: W_FLOOD(262, 236, 0.14), weather: 'rain', time: 260, lines: { vip_wait: LL(['يونس! آني هنا… آسف!'], ['Younis! I\'m here… I\'m sorry!']) } }),
      sm('f8_4', { style: 'mumbai', heli: 'chinook', name: ['آخر قارب', 'The Last Boat'], desc: ['قارب واحد باقي. حدّه قليل… استغل كل طلعة.', 'Only one boat left. It holds few… make every run count.'], goal: 8, people: 10, zones: 'boat', water: W_FLOOD(264, 236, 0.12), weather: 'storm', time: 300 }),
    ],
    outro: [
      { scene: { lvl: ['mumbai', 'night'], cam: 0.5, fx: ['rain'] }, chars: [['asim', 0.35], ['younis', 0.65, 1]], lines: [['asim', '(يمد خزان وقود) آخر وقود عندي. خبّيته لنفسي.', '(hands over a fuel drum) My last fuel. I hid it for myself.'], ['asim', 'ليش أنقذتني؟', 'Why did you save me?'], ['younis', 'لأن مراد جان ينقذك.', 'Because Murad would have.']] },
      { scene: { room: 'tower' }, chars: [['salma', 0.5]], lines: [['salma', 'يونس… بغداد ما ترد من يومين.', 'Younis… Baghdad hasn\'t answered in two days.'], ['salma', 'روح. هاي مو أمر… هاي رجاء.', 'Go. This isn\'t an order… it\'s a plea.']] },
    ],
  },
  { // ───────── 9
    id: 'f9', title: ['السطح', 'The Roof'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.5, fx: ['rain', ['flood', 214]] }, cap: ['بغداد نصها تحت الماي. يونس يوصل لبيته…', 'Half of Baghdad is underwater. Younis reaches his house…'] },
      { scene: { lvl: ['baghdad', 'night'], cam: 0.45, fx: ['rain', ['chalk', 'بابا رحنا للسفينة. لا تزعل.', 'الماي وصل للسطح… وإنت بعدك ما وصلت 🙂 — ليلى']] }, cap: ['السطح فارغ. بس كتابة بالطباشير بنصه.', 'The roof is empty. Just chalk writing in the middle.'] },
    ],
    missions: [
      sm('f9_1', { style: 'baghdad', name: ['الجيران', 'The Neighbours'], desc: ['نفس الوجوه اللي فاتهم أول مرة. هالمرة ما يبقى أحد.', 'The same faces he passed the first time. This time, no one is left behind.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(262, 236, 0.12), weather: 'rain', time: 270, lines: { wait: LL(['يونس؟! رجعت!', 'بنتك راحت للسفينة يا ابني!'], ['Younis?! You came back!', 'Your daughter went to the ship, son!']) } }),
      sm('f9_2', { style: 'baghdad', name: ['برج بغداد', 'Baghdad Tower'], desc: ['آخر ناس على شرفة البرج. الماي وصل لنصه.', 'The last people on the tower deck. The water is halfway up.'], goal: 5, worldW: 1700, zones: 'boat', water: W_FLOOD(262, 240, 0.1), wind: { base: -6, gust: 18 }, time: 260 }),
      sm('f9_3', { style: 'baghdad', type: 'careful', careful: true, heli: 'medic', name: ['بيت العجزة', 'The Old Folks\' Home'], desc: ['بهدوء. هذول ما يتحملون طيحة.', 'Gently. They can\'t survive a fall.'], goal: 4, zones: 'boat', water: W_FLOOD(262, 248, 0.06), time: 270 }),
      sm('f9_4', { style: 'baghdad', name: ['آخر بيت', 'The Last House'], desc: ['آخر شارع ببغداد. بعدها… الجبل.', 'The last street in Baghdad. After this… the Mountain.'], goal: 7, people: 9, zones: 'boat', water: W_FLOOD(264, 232, 0.16), weather: 'storm', time: 290 }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.3, fx: ['rain'] }, chars: [['man', 0.4]], lines: [['man', 'السفينة مرّت قبل ثلاث أيام… البنية ضلّت تلوّح للسما لحد ما غابت.', 'The ship passed three days ago… the little girl kept waving at the sky until it was gone.']] },
      { scene: { room: 'cockpit' }, chars: [], cap: ['فجأة… صوت مقطّع.', 'Suddenly… a broken voice.'], lines: [['wt:laila', 'بابا… البطارية… السفينة دتغرق… الجبل…', 'Dad… the battery… the ship is sinking… the mountain…'], ['cap', '(وينقطع)', '(and it cuts out)', '']] },
    ],
  },
  { // ───────── 10
    id: 'f10', title: ['الليلة الأربعين', 'The Fortieth Night'], city: ['الجبل', 'The Mountain'],
    intro: [
      { scene: { room: 'deck', fx: ['storm', ['bigTornado']] }, cap: ['السفينة الأخيرة ضربت بصخر قرب الجبل ودتميل. ألف شخص على سطحها، وأكبر إعصار بالقصة.', 'The Last Ship struck rocks near the Mountain and is listing. A thousand people on deck — and the biggest twister of all.'] },
      { scene: { room: 'tower' }, chars: [['salma', 0.5]], lines: [['salma', 'لأول مرة… آني هم طالعة بطيارة. إحنا آخر 3: يونس، عاصم، وآني.', 'For the first time… I\'m flying too. We\'re the last 3: Younis, Asim, and me.'], ['salma', 'لكل الطيارين… يلا.', 'To all pilots… let\'s go.']] },
    ],
    missions: [
      sm('f10_1', { at: 'mountain', style: 'rotterdam', heli: 'chinook', name: ['السفينة تغرق', 'The Ship Is Sinking'], desc: ['السفينة دتميل. القوارب حدّها قليل وترجع. استعمل السلّم.', 'The ship is listing. Boats hold few and return. Use the ladder.'], goal: 8, people: 10, zones: 'boat', water: W_FLOOD(262, 236, 0.12), weather: 'storm', time: 300 }),
      sm('f10_2', { at: 'mountain', style: 'mountain', name: ['العاصفة الكبرى', 'The Great Storm'], desc: ['إعصارين حول الجبل. وصّل الناس للمخيم فوگ.', 'Two twisters around the Mountain. Get people to the camp above.'], goal: 7, weather: 'tornado', tornados: 2, time: 300 }),
      sm('f10_3', { at: 'mountain', style: 'mountain', type: 'careful', careful: true, heli: 'medic', name: ['الجدّات للجبل', 'Grandmothers to the Mountain'], desc: ['بهدوء. الريح تدفع والحبل يتمرجح.', 'Gently. The wind pushes and the rope swings.'], goal: 4, wind: { base: 8, gust: 22 }, time: 280 }),
      sm('f10_4', { at: 'mountain', style: 'rotterdam', heli: 'chinook', type: 'vip', careful: true, vipName: { ar: 'ليلى', en: 'Laila' }, name: ['⭐ ليلى', '⭐ Laila'], desc: ['آخر اثنين على السفينة: ليلى وجدتها. «جدو أول، هي أكبر». ولا واحد يطيح.', 'The last two on the ship: Laila and her grandmother. "Grandma first, she\'s older." Nobody falls.'], goal: 5, people: 6, zones: 'boat', water: W_FLOOD(262, 240, 0.1), weather: 'storm', time: 320, lines: { vip_wait: LL(['بابا!! أدري إنت!', 'گلتلك ترجع!'], ['DAD!! I know it\'s you!', 'I told you to come back!']) } }),
    ],
    outro: [
      { scene: { lvl: ['mountain', 'night'], cam: 0.4, fx: [['heli', 'chinook', 0.5]] }, cap: ['الطيارة تنزل فوگ الجبل، وليلى بآخر السلّم. المروحة توگف شوية شوية.', 'The heli settles on the Mountain, Laila at the end of the ladder. The rotor slows… and stops.'], note: ['لأول مرة باللعبة… ماكو صوت مطر.', 'For the first time in the game… no sound of rain.'] },
      { scene: { lvl: ['mountain', 'dusk'], cam: 0.5 }, chars: [['laila', 0.4], ['younis', 0.6, 1], ['saad', 0.2]], lines: [['laila', 'بابا، گلتلك ترجع قبل لا يوصل الماي للسطح… وصل.', 'Dad, I told you to come back before the water reached the roof… it did.'], ['younis', 'أدري… بس آني ما وگفت. ولا ليلة.', 'I know… but I never stopped. Not one night.'], ['saad', '(لأول مرة تبچي) الله يرحم أمها… لو شافتك.', '(crying for the first time) God rest her mother… if only she could see you.']] },
      { scene: { lvl: ['mountain', 'dusk'], cam: 0.7, fx: ['sun'] }, chars: [['abuali', 0.3]], cap: ['الشمس تطلع بعد أربعين ليلة. آلاف الناس فوگ الجبل… وبينهم أبو علي وجاموسه.', 'The sun rises after forty nights. Thousands on the Mountain… among them, Abu Ali and his buffalo.'], lines: [['radio', 'سلمى: لكل الطيارين… الماي دا ينزل.', 'Salma: To all pilots… the water is going down.']] },
    ],
    ending: true,
  },
];
const STORY_FLOOD_POST = [
  { scene: { lvl: ['mountain', 'dusk'], cam: 0.6, fx: ['sun', ['parked', 'chinook', 0.4]] }, cap: ['جوه الطيارة، ليلى نايمة بحضن أبوها.', 'Inside the heli, Laila sleeps in her father\'s arms.'], lines: [['cap', 'وعلى باب الطيارة، أحد كتب بالطباشير: «مراد — الطيار ما يبچي بالجو».', 'And on the heli\'s door, someone chalked: "Murad — a pilot doesn\'t cry in the air."', '']] },
];

/* ============================================================
   القصة 2: لوح أوروك
   ============================================================ */
const STORY_URUK = [
  { // ───────── 1
    id: 'u1', title: ['الطلبية', 'The Job'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { lvl: ['baghdad', 'dusk'], cam: 0.3, fx: [['parked', 'police', 0.55]] }, chars: [['ali', 0.3]], cap: ['علي، طيار شحن من الموصل. ديونه أكثر من ساعات طيرانه.', 'Ali, a cargo pilot from Mosul. More debts than flight hours.'] },
      { scene: { lvl: ['baghdad', 'dusk'], cam: 0.5 }, chars: [['jabbar', 0.35], ['ali', 0.65, 1]], lines: [['jabbar', 'صندوق واحد من بغداد لدبي. عشرة آلاف. ولا تفتحه.', 'One crate from Baghdad to Dubai. Ten thousand. And don\'t open it.'], ['ali', 'شبيه؟', 'What\'s in it?'], ['jabbar', 'إنت طيار مو مفتش. بعدين، إحنا أصدقاء من الإعدادية لو لا؟', 'You\'re a pilot, not a customs officer. Besides, we\'ve been friends since high school, right?']] },
    ],
    missions: [
      sm('u1_1', { style: 'baghdad', pal: 'day', type: 'cargo', cargo: 'flour', heli: 'police', name: ['شغل يومي', 'Day Job'], desc: ['قبل الطلبية الكبيرة: نقل طحين للسوق. الصناديق ما تحچي… بس لا توگعها.', 'Before the big job: flour to the market. Crates don\'t talk… but don\'t drop them.'], goal: 4, time: 220 }),
      sm('u1_2', { style: 'baghdad', pal: 'dusk', type: 'cargo', cargo: 'medicine', heli: 'police', name: ['الدوا', 'Medicine'], desc: ['صيدلية بالكرادة تنتظر. السطح ضيق.', 'A pharmacy in Karrada is waiting. The roof is tight.'], goal: 5, wind: { base: 4, gust: 12 }, time: 230 }),
      sm('u1_3', { style: 'baghdad', type: 'fire', fire: 3, name: ['الحريق', 'The Fire'], desc: ['بطريقك للمطار، حريق بعمارة. ما تگدر تفوتهم.', 'On your way to the airport, a building is on fire. You can\'t just fly past.'], goal: 5, time: 240 }),
      sm('u1_4', { style: 'baghdad', type: 'cargo', cargo: 'medicine', careful: true, name: ['الصندوق', 'The Crate'], desc: ['الطلبية بالليل. صندوق جبّار مكتوب عليه «قابل للكسر». إذا طاح… تفشل.', 'The night pickup. Jabbar\'s crate says "FRAGILE". If it falls… you fail.'], goal: 1, people: 1, time: 200 }),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.4, fx: [['crate', 0.5]] }, chars: [['nawal', 0.25], ['ali', 0.75, 1]], lines: [['nawal', 'نزّل الصندوق. هذا مسروق من المتحف العراقي.', 'Put the crate down. This was stolen from the Iraq Museum.'], ['ali', 'ومنو إنتي؟', 'And who are you?'], ['nawal', 'د. نوال. آثارية. وهذا الصندوق بيه أقدم قصيدة كتبها إنسان.', 'Dr. Nawal. Archaeologist. And that crate holds the oldest poem a human ever wrote.']] },
      { scene: { room: 'dark', fx: [['tablet', 0.5, 140]] }, cap: ['لوح طين، عمره 4000 سنة. سطور من ملحمة كلكامش.', 'A clay tablet, 4,000 years old. Lines from the Epic of Gilgamesh.'], lines: [['nawal', '«الذي رأى كل شيء…» هذا أول سطر.', '"He who saw everything…" That\'s the first line.'], ['ali', '…جبّار باعني.', '…Jabbar sold me out.']] },
    ],
  },
  { // ───────── 2
    id: 'u2', title: ['الطريق القديم', 'The Old Road'], city: ['الأهوار', 'The Marshes'],
    intro: [
      { scene: { lvl: ['marsh', 'dusk'], cam: 0.4 }, chars: [['nawal', 0.35], ['ali', 0.65, 1]], lines: [['ali', 'رجال جبّار وره ظهرنا. نختفي بالأهوار.', 'Jabbar\'s men are behind us. We disappear into the marshes.'], ['nawal', 'هنا، قبل 5000 سنة، كانت أوروك. اللوح راجع لبيته.', 'Here, 5,000 years ago, stood Uruk. The tablet is coming home.']] },
    ],
    missions: [
      sm('u2_1', { style: 'marsh', pal: 'dusk', name: ['الضيافة', 'Hospitality'], desc: ['أهل الهور خبّوكم. بس العاصفة جاية على قريتهم. ساعدهم.', 'The marsh folk hid you. But a storm is coming for their village. Help them.'], goal: 5, zones: 'boat', water: W_FLOOD(258, 252, 0.03), weather: 'wind', wind: { base: -8, gust: 22 }, time: 240 }),
      sm('u2_2', { style: 'marsh', type: 'animals', name: ['الحلال', 'The Herd'], desc: ['العاصفة شتّتت الحيوانات. رجّعها.', 'The storm scattered the animals. Bring them back.'], goal: 3, zones: 'boat', water: W_FLOOD(258, 258, 0), time: 240 }),
      sm('u2_3', { style: 'marsh', pal: 'night', name: ['الفانوس', 'The Lantern'], desc: ['بالليل، رجال جبّار يدوّرون. أنقذ الصيادين قبل لا يوصلون.', 'At night, Jabbar\'s men search the reeds. Get the fishermen out before they arrive.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(258, 250, 0.04), weather: 'storm', time: 260 }),
    ],
    outro: [
      { scene: { room: 'dark', fx: [['tablet', 0.5, 140]] }, chars: [['nawal', 0.25]], lines: [['nawal', 'شوف… الحافة مكسورة. هذا لوح من ثلاثة.', 'Look… the edge is broken. This is one tablet of three.'], ['nawal', 'الثاني بيع بمزاد بروتردام… والثالث عند واحد بطوكيو.', 'The second was sold at an auction in Rotterdam… the third is with someone in Tokyo.'], ['ali', 'وجبّار؟', 'And Jabbar?'], ['nawal', 'جبّار هو اللي يعرف الطريق.', 'Jabbar is the one who knows the way.']] },
    ],
  },
  { // ───────── 3
    id: 'u3', title: ['الوسيط', 'The Broker'], city: ['دبي', 'Dubai'],
    intro: [
      { scene: { lvl: ['dubai', 'dusk'], cam: 0.6, fx: ['sand'] }, chars: [['jabbar', 0.35], ['ali', 0.65, 1]], lines: [['jabbar', 'علي! تعرف شگد خسرت بسببك؟', 'Ali! Do you know how much you cost me?'], ['ali', 'تعرف شگد خسر العراق بسببك؟', 'Do you know how much Iraq lost because of you?'], ['jabbar', '…المزاد بعد أسبوع. فان دايك يدفع أكثر من الكل.', '…The auction is in a week. Van Dijk outbids everyone.']] },
    ],
    missions: [
      sm('u3_1', { style: 'dubai', pal: 'dusk', name: ['عاصفة الرمل', 'Sandstorm'], desc: ['العاصفة سكّرت المطار. ناس عالقين على الأبراج.', 'The storm closed the airport. People are stuck on the towers.'], goal: 6, weather: 'sand', wind: { base: 10, gust: 24 }, time: 250 }),
      sm('u3_2', { style: 'dubai', pal: 'night', type: 'fire', fire: 4, name: ['الصفقة احترگت', 'The Deal Burns'], desc: ['زبائن جبّار حرگوا مكتبه. الناس فوگ البرج.', 'Jabbar\'s clients set his office on fire. People are on the tower.'], goal: 6, time: 250 }),
      sm('u3_3', { style: 'dubai', pal: 'night', type: 'vip', vipName: { ar: 'جبّار', en: 'Jabbar' }, name: ['جبّار', 'Jabbar'], desc: ['اللي باعك عالق فوگ برج يحترگ. جبّار لازم يوصل.', 'The man who sold you out is trapped on a burning tower. Jabbar must make it.'], goal: 5, fire: 2, time: 250, lines: { vip_wait: LL(['علي! والله ما جنت أعرف شبيه!', 'علي… آسف!'], ['Ali! I swear I didn\'t know what was in it!', 'Ali… I\'m sorry!']) } }),
    ],
    outro: [
      { scene: { lvl: ['dubai', 'night'], cam: 0.4 }, chars: [['jabbar', 0.35], ['ali', 0.65, 1]], lines: [['jabbar', 'ليش أنقذتني؟', 'Why did you save me?'], ['ali', 'لأنك صديقي من الإعدادية. هسه گلّي: وين المزاد؟', 'Because you\'re my friend since high school. Now tell me: where is the auction?'], ['jabbar', '(يطلع ورقة) مستودع بالميناء. الليلة الجاية.', '(pulls out a note) A warehouse at the port. Tomorrow night.']] },
    ],
  },
  { // ───────── 4
    id: 'u4', title: ['المزاد', 'The Auction'], city: ['روتردام', 'Rotterdam'],
    intro: [
      { scene: { room: 'warehouse' }, chars: [['dijk', 0.5], ['guard', 0.2], ['guard', 0.8, 1]], lines: [['dijk', 'التاريخ لمن يدفع، سيداتي سادتي. القطعة رقم 7: لوح سومري.', 'History belongs to those who pay, ladies and gentlemen. Lot number 7: a Sumerian tablet.']] },
      { scene: { lvl: ['rotterdam', 'night'], cam: 0.5, fx: [['heli', 'chinook', 0.5], 'rain'] }, lines: [['radio', 'نوال: صندوق اللوح بحاوية حمراء فوگ الرصيف. نشيله بالحبل ونطير.', 'Nawal: The tablet\'s crate is in a red container on the pier. We lift it and fly.'], ['radio', 'علي: وإذا طاح؟', 'Ali: And if it falls?'], ['radio', 'نوال: لا يطيح.', 'Nawal: It doesn\'t fall.']] },
    ],
    missions: [
      sm('u4_1', { style: 'rotterdam', heli: 'chinook', name: ['الإلهاء', 'The Distraction'], desc: ['جبّار حرّك إنذار الحريق بالميناء. العمّال طلعوا للسطوح… خذهم للقارب.', 'Jabbar set off the port\'s fire alarm. Workers fled to the roofs… take them to the boat.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(262, 262, 0), weather: 'rain', time: 260 }),
      sm('u4_2', { style: 'rotterdam', type: 'cargo', cargo: 'medicine', careful: true, heli: 'chinook', name: ['القطعة رقم 7', 'Lot Number 7'], desc: ['صندوق اللوح فوگ الحاويات. شيله بهدوء… إذا طاح تفشل.', 'The tablet\'s crate sits on the containers. Lift it gently… if it falls, you fail.'], goal: 1, people: 1, zones: 'boat', water: W_FLOOD(262, 262, 0), weather: 'rain', time: 220 }),
      sm('u4_3', { style: 'rotterdam', type: 'fire', fire: 3, heli: 'chinook', name: ['الأدلة', 'The Evidence'], desc: ['فان دايك يحرگ المستودع حتى يخفي الأدلة. بس بيه حراس محبوسين.', 'Van Dijk torches the warehouse to hide the evidence. But guards are trapped inside.'], goal: 5, zones: 'boat', water: W_FLOOD(262, 262, 0), time: 250 }),
      sm('u4_4', { style: 'rotterdam', heli: 'chinook', name: ['هوتيل نيويورك', 'Hotel New York'], desc: ['العاصفة وصلت. ناس على سطح الفندق القديم.', 'The storm has arrived. People on the old hotel roof.'], goal: 7, people: 9, zones: 'boat', water: W_FLOOD(262, 248, 0.06), weather: 'storm', time: 280 }),
    ],
    outro: [
      { scene: { room: 'warehouse' }, chars: [['dijk', 0.5]], lines: [['dijk', '(بالتلفون) خلّوهم يوصلون طوكيو… هناك ناخذ الثلاثة مرة وحدة.', '(on the phone) Let them reach Tokyo… we\'ll take all three there at once.']] },
    ],
  },
  { // ───────── 5
    id: 'u5', title: ['المرمّم', 'The Restorer'], city: ['طوكيو', 'Tokyo'],
    intro: [
      { scene: { lvl: ['tokyo', 'night'], cam: 0.45, fx: [['tornado', 0.75]] }, chars: [['kenji', 0.35], ['nawal', 0.62, 1]], lines: [['kenji', 'اللوح الثالث انكسر بالزلزال. صلّحته قطعة قطعة، 30 سنة.', 'The third tablet broke in an earthquake. I restored it piece by piece, for 30 years.'], ['nawal', 'نريد نرجّعه لبيته.', 'We want to take it home.'], ['kenji', 'أنطيكم إياه… إذا ساعدتوا حيّي. الإعصار جاي.', 'I\'ll give it to you… if you help my neighbourhood. The typhoon is coming.']] },
    ],
    missions: [
      sm('u5_1', { style: 'tokyo', name: ['حي كينجي', "Kenji's Street"], desc: ['الإعصار يقترب. طلّع الناس من السطوح.', 'The typhoon approaches. Get people off the roofs.'], goal: 6, weather: 'tornado', tornados: 1, time: 270 }),
      sm('u5_2', { style: 'tokyo', name: ['البرج', 'The Tower'], desc: ['سياح عالقين على شرفات برج طوكيو.', 'Tourists stranded on the Tokyo Tower decks.'], goal: 6, people: 8, worldW: 1800, wind: { base: 0, gust: 16 }, time: 270 }),
      sm('u5_3', { style: 'tokyo', type: 'careful', careful: true, heli: 'medic', name: ['بيت المسنين', 'The Elders'], desc: ['جيران كينجي الكبار. بهدوء.', 'Kenji\'s elderly neighbours. Gently.'], goal: 4, weather: 'rain', time: 270 }),
      sm('u5_4', { style: 'tokyo', type: 'cargo', cargo: 'medicine', careful: true, name: ['اللوح الثالث', 'The Third Tablet'], desc: ['كينجي سلّمكم الصندوق. وصّله للمهبط بهدوء… رجال فان دايك يراقبون.', 'Kenji hands over the crate. Bring it to the pad gently… Van Dijk\'s men are watching.'], goal: 1, people: 1, weather: 'rain', wind: { base: 4, gust: 14 }, time: 220 }),
    ],
    outro: [
      { scene: { lvl: ['tokyo', 'night'], cam: 0.5 }, chars: [['guard', 0.25], ['dijk', 0.45], ['ali', 0.75, 1]], lines: [['dijk', 'شكراً لأنك لمّيتها كلها بمكان واحد.', 'Thank you for gathering them all in one place.'], ['ali', '…', '…']] },
      { scene: { lvl: ['tokyo', 'night'], cam: 0.6 }, chars: [['jabbar', 0.3], ['dijk', 0.55], ['guard', 0.8, 1]], lines: [['jabbar', '(يطلع من الظلام) فان دايك! صورتك وإنت تبيع بالمزاد… هسه عند الشرطة الدولية.', '(stepping out of the dark) Van Dijk! The photos of you at the auction… Interpol has them now.'], ['jabbar', 'علي… روح. هالمرة آني اللي أدفع.', 'Ali… go. This time, I\'m the one who pays.']] },
    ],
  },
  { // ───────── 6
    id: 'u6', title: ['الرجوع', 'The Return'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { room: 'cockpit' }, chars: [], lines: [['radio', 'نوال: ثلاث ألواح بثلاث صناديق. المتحف ينتظر على السطح.', 'Nawal: Three tablets in three crates. The museum is waiting on the roof.'], ['radio', 'علي: وفوگنا أكبر عاصفة بالسنة.', 'Ali: And above us, the biggest storm of the year.'], ['radio', 'نوال: 4000 سنة ينتظرون. يتحملون ساعة بعد.', 'Nawal: They\'ve waited 4,000 years. They can wait one more hour.']] },
    ],
    missions: [
      sm('u6_1', { style: 'baghdad', name: ['المدينة بالعاصفة', 'The City in the Storm'], desc: ['قبل المتحف… الناس بطريق العاصفة.', 'Before the museum… people in the storm\'s path.'], goal: 6, people: 8, weather: 'storm', zones: 'boat', water: W_FLOOD(262, 246, 0.08), time: 270 }),
      sm('u6_2', { style: 'baghdad', name: ['برج بغداد', 'Baghdad Tower'], desc: ['ناس على شرفة البرج والريح قوية.', 'People on the tower deck and a strong wind.'], goal: 5, worldW: 1700, wind: { base: -8, gust: 20 }, time: 260 }),
      sm('u6_3', { style: 'baghdad', type: 'cargo', cargo: 'medicine', careful: true, heli: 'chinook', name: ['⭐ لوح أوروك', '⭐ The Uruk Tablet'], desc: ['ثلاث صناديق، ثلاث ألواح، وعاصفة. ولا واحد يطيح. وصّلها للمتحف.', 'Three crates, three tablets, one storm. Not one falls. Deliver them to the museum.'], goal: 3, people: 3, weather: 'storm', wind: { base: 6, gust: 22 }, time: 300 }),
    ],
    outro: [
      { scene: { room: 'museum', fx: [['tablet', 0.5, 96]] }, chars: [['nawal', 0.3], ['ali', 0.7, 1]], cap: ['المتحف العراقي. ثلاث ألواح رجعت تحت نفس الزجاج.', 'The Iraq Museum. Three tablets, back under the same glass.'], lines: [['nawal', 'شنو أجرتك؟', 'What\'s your fee?'], ['ali', 'ورقة صغيرة جنب اللوح. مكتوب بيها: «نقله علي».', 'A little card beside the tablet. It says: "Carried by Ali."']] },
      { scene: { room: 'museum', fx: [['tablet', 0.5, 96]] }, chars: [['man', 0.4]], cap: ['بعد شهر. طفل يقرا بصوت عالي من اللوح:', 'A month later. A child reads aloud from the tablet:'], lines: [['cap', '«الذي رأى كل شيء… عرف الأسرار، وجاب لنا خبر ما قبل الطوفان».', '"He who saw everything… knew the secrets, and brought us news from before the flood."', '']] },
    ],
    ending: true,
  },
];
const STORY_URUK_POST = [
  { scene: { lvl: ['baghdad', 'day'], cam: 0.3, fx: [['parked', 'police', 0.55]] }, chars: [['jabbar', 0.3], ['ali', 0.65, 1]], cap: ['بعد شهرين.', 'Two months later.'], lines: [['jabbar', 'علي… عندي طلبية. صندوق من بغداد لـ…', 'Ali… I\'ve got a job. One crate from Baghdad to…'], ['ali', 'جبّار.', 'Jabbar.'], ['jabbar', 'طحين! والله طحين!', 'Flour! I swear, flour!']] },
];

const STORIES = [
  { id: 'flood', title: ['الطوفان الأخير', 'The Last Flood'], sub: ['يونس، آخر طيار، يسابق الماي حتى يوصل لبنته', 'Younis, the last pilot, races the water to reach his daughter'], chapters: STORY_FLOOD, post: STORY_FLOOD_POST, icon: '🌊' },
  { id: 'uruk', title: ['لوح أوروك', 'The Uruk Tablet'], sub: ['علي ونوال يرجّعون ألواح كلكامش المسروقة', 'Ali and Nawal bring the stolen Gilgamesh tablets home'], chapters: STORY_URUK, post: STORY_URUK_POST, icon: '🏺' },
];
let CUR = STORIES[0], STORY = CUR.chapters, STORY_POST = CUR.post;
function stSelect(si) { CUR = STORIES[si]; STORY = CUR.chapters; STORY_POST = CUR.post; }

/* ---------- نصوص الواجهة ---------- */
const STT = {
  ar: { title: '📖 نمط القصة', sub: 'اختار القصة', pick: 'القصص', chapters: 'فصل', chapter: 'الفصل', skip: 'تخطّي ⏭', next: 'التالي ◀', start: '▶ ابدأ المهمة', locked: '🔒 خلّص الفصل اللي قبله', done: '✓ خلص', back: 'رجوع', replay: 'إعادة القصة', cont: 'كمّل القصة', mission: 'المهمة', of: 'من', credits: 'شكراً لأنك لعبت!', creditsBy: 'برمجة وتطوير ابراهيم الخزرجي', end: 'النهاية', radio: '📻 راديو', tap: 'اضغط للمتابعة' },
  en: { title: '📖 Story Mode', sub: 'Choose a story', pick: 'Stories', chapters: 'chapters', chapter: 'Chapter', skip: 'Skip ⏭', next: 'Next ▶', start: '▶ Start mission', locked: '🔒 Finish the previous chapter', done: '✓ Done', back: 'Back', replay: 'Replay story', cont: 'Continue story', mission: 'Mission', of: 'of', credits: 'Thanks for playing!', creditsBy: 'Developed by Ibrahim Al-Khazraji', end: 'The End', radio: '📻 Radio', tap: 'Tap to continue' },
};
const stT = k => (STT[lang()] || STT.ar)[k];
const L2 = a => (a ? (lang() === 'ar' ? a[0] : a[1]) : '');

/* ---------- التقدم ---------- */
function stSave() { if (!save.story) save.story = { ch: {} }; const s = save.story; if (!s.c) s.c = {}; if (!s.c[CUR.id]) s.c[CUR.id] = { ch: {} }; return s.c[CUR.id]; }
function stChapterDone(ci) { return !!stSave().ch[STORY[ci].id]; }
function stChapterUnlocked(ci) { return ci === 0 || stChapterDone(ci - 1); }
function stFirstOpen(ci) { const ms = STORY[ci].missions; for (let i = 0; i < ms.length; i++) if (!save.stars[ms[i].id]) return i; return ms.length; }
function goldenUnlocked() { return !!(save.story && save.story.golden); }
function stSetGolden() { if (!save.story) save.story = { ch: {} }; save.story.golden = true; }

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
  else if (who.startsWith('wt:')) { b.classList.add('radio'); const k = who.slice(3); name = '📻 ' + L2([ST_CHARS[k].ar, ST_CHARS[k].en]); SND.play('radio', 0.4); }
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
  chars.forEach(([k, x, flip], i) => { const u = ST_CHARS[k] && ST_CHARS[k].kid ? 2.3 : 3.2; stDrawChar(g, k, x * ST_W, 262, u, !!flip, t + i); });
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
function stOpenMenu(pickFirst) {
  if (pickFirst || ST.view !== 'chapters') return stOpenPicker();
  stEl('stTitle').textContent = CUR.icon + ' ' + L2(CUR.title); stEl('stSub').textContent = L2(CUR.sub);
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
function stOpenPicker() {
  ST.view = 'picker';
  stEl('stTitle').textContent = stT('title'); stEl('stSub').textContent = stT('sub');
  const box = stEl('stList'); box.innerHTML = '';
  STORIES.forEach((st, si) => {
    const prev = CUR; stSelect(si); const n = STORY.length, d = STORY.filter((c, ci) => stChapterDone(ci)).length; CUR = prev; STORY = CUR.chapters; STORY_POST = CUR.post;
    const b = document.createElement('button'); b.className = 'stch stbig' + (d === n ? ' done' : '');
    b.innerHTML = `<span class="num">${st.icon}</span><span class="tt"><b></b><small></small></span><span class="pr"></span>`;
    b.querySelector('b').textContent = L2(st.title); b.querySelector('small').textContent = L2(st.sub);
    b.querySelector('.pr').textContent = `${d}/${n}`;
    b.onclick = () => { AU.init(); AU.click(); stSelect(si); ST.view = 'chapters'; stOpenMenu(); };
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
      const s = stSave(); s.ch[c.id] = true; if (c.unlockGolden) stSetGolden(); persist();
      if (c.ending) { stPlay([...stCredits(), ...STORY_POST], () => stOpenMenu()); return; }
      if (ref.ci + 1 < STORY.length) stPlayChapter(ref.ci + 1); else stOpenMenu();
    });
  };
  if (m.after) stPlay(m.after, nextStep); else nextStep();
}
function stCredits() {
  return [{ scene: { room: 'dark', fx: ['fireworks'] }, cap: [`${STT.ar.end}\n\n${STT.ar.credits}\n${STT.ar.creditsBy}\nibraprogram.netlify.app · t.me/ibraprogram · TikTok: ibraprogram`, `${STT.en.end}\n\n${STT.en.credits}\n${STT.en.creditsBy}\nibraprogram.netlify.app · t.me/ibraprogram · TikTok: ibraprogram`], credits: true }];
}
