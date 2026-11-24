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
  saadiya: { ar: 'الحجية سعدية', en: 'Hajjiya Saadiya', skin: '#d2a07a', hair: '#111', top: '#141414', bottom: '#141414', hat: 'abaya', glasses: 1, dress: 1, short: 1 },
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
  // قصة الرعب
  haider: { ar: 'حيدر', en: 'Haider', skin: '#c48f68', hair: '#161210', top: '#3a4450', bottom: '#2a3038', hat: 'helmet' },
  nadia:  { ar: 'نادية', en: 'Nadia', skin: '#dcae88', hair: '#2a1a10', top: '#3a2a3a', bottom: '#2a2030', hat: 'hijab', scarf: '#2a2a2e', item: 'headset' },
  kadhim: { ar: 'الحجي كاظم', en: 'Hajji Kadhim', skin: '#a87650', hair: '#e8e4da', top: '#2a2620', bottom: '#2a2620', hat: 'yashmagh', beard: 1, dress: 1 },
  zainab: { ar: 'زينب', en: 'Zainab', skin: '#e0ae86', hair: '#1a120c', top: '#f0ece0', bottom: '#f0ece0', hat: 'long', kid: 1, dress: 1 },
  father: { ar: 'أبو زينب', en: "Zainab's father", skin: '#c08a62', hair: '#222', top: '#4a3a2a', bottom: '#4a3a2a', hat: null, mustache: 1, dress: 1 },
  // القصة المضحكة: سعدون
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
    if (k === 'static') { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(230,225,210,${Math.random() * 0.25})`; g.fillRect((Math.random() * ST_W) | 0, (Math.random() * ST_H) | 0, 2, 1); } if (Math.random() < 0.08) { g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(0, (Math.random() * ST_H) | 0, ST_W, 6); } }
    if (k === 'fog') { for (let i = 0; i < 5; i++) { const y = 150 + i * 22, x = ((t * (8 + i * 3) + i * 90) % (ST_W + 300)) - 300; g.fillStyle = 'rgba(170,175,180,0.10)'; g.fillRect(x, y, 300, 26); g.fillRect(x + 200, y + 8, 260, 18); } g.fillStyle = 'rgba(10,12,14,0.35)'; g.fillRect(0, 0, ST_W, ST_H); }
    if (k === 'eyes') { const x = (a ?? 0.7) * ST_W, y = b ?? 200, open = (t + x) % 3.5 > 0.15; if (open) { g.fillStyle = '#e8d84a'; g.fillRect(x - 6, y, 3, 2); g.fillRect(x + 4, y, 3, 2); g.fillStyle = 'rgba(232,216,74,0.25)'; g.fillRect(x - 8, y - 1, 17, 4); } }
    if (k === 'tantal') { const x = (a ?? 0.7) * ST_W + Math.sin(t * 0.4) * 4, base = 236, hgt = 170; g.fillStyle = 'rgba(6,6,8,0.92)';
      g.beginPath(); g.moveTo(x - 10, base); g.lineTo(x - 7, base - hgt * 0.55); g.lineTo(x - 18, base - hgt * 0.5); g.lineTo(x - 26, base - hgt * 0.2); g.lineTo(x - 22, base - hgt * 0.18); g.lineTo(x - 12, base - hgt * 0.6); g.lineTo(x - 8, base - hgt * 0.82); g.lineTo(x, base - hgt); g.lineTo(x + 8, base - hgt * 0.82); g.lineTo(x + 12, base - hgt * 0.6); g.lineTo(x + 22, base - hgt * 0.18); g.lineTo(x + 26, base - hgt * 0.2); g.lineTo(x + 18, base - hgt * 0.5); g.lineTo(x + 7, base - hgt * 0.55); g.lineTo(x + 10, base); g.fill();
      if ((t % 4) > 0.12) { g.fillStyle = '#d8c84a'; g.fillRect(x - 5, base - hgt * 0.88, 3, 2); g.fillRect(x + 3, base - hgt * 0.88, 3, 2); } }
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
      { scene: { lvl: ['mountain', 'dusk'], cam: 0.5 }, chars: [['laila', 0.4], ['younis', 0.6, 1], ['saadiya', 0.2]], lines: [['laila', 'بابا، گلتلك ترجع قبل لا يوصل الماي للسطح… وصل.', 'Dad, I told you to come back before the water reached the roof… it did.'], ['younis', 'أدري… بس آني ما وگفت. ولا ليلة.', 'I know… but I never stopped. Not one night.'], ['saadiya', '(لأول مرة تبچي) الله يرحم أمها… لو شافتك.', '(crying for the first time) God rest her mother… if only she could see you.']] },
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

/* ============================================================
   القصة المضحكة: سعدون وغيمة بغداد
   ============================================================ */
function smF(id, o) { return sm(id, Object.assign({ pal: 'day', worldW: 1300, time: 200 }, o.style === 'mountain' && !o.city ? { city: { ar: 'جبال كردستان', en: 'Kurdistan Mountains' } } : {}, o)); }
const STORY_FUNNY = [
  { // ───────── الفصل 1
    id: 'ch1', title: ['أول يوم… آخر يوم؟', 'First Day… Last Day?'], city: ['بغداد', 'Baghdad'],
    intro: [
      { scene: { lvl: ['baghdad', 'day'], cam: 0.1, pan: 6, fx: ['runway'] }, chars: [['saad', 0.3]], cap: ['بغداد. سعدون، عامل توصيل على بايسكل، جايب طلبية كباب للمطار…', 'Baghdad. Saadoun, a bike delivery guy, brings a kebab order to the airport…'], lines: [['saad', 'طلبية كباب لـ… «قسم الطيارين الجدد»؟', 'Kebab order for… "New Pilots Department"?']] },
      { scene: { room: 'tower' }, chars: [['abuj', 0.62, 1], ['saad', 0.3]], lines: [['abuj', 'إنت سعدون؟ اسمك أول واحد بالقائمة. اصعد!', "You're Saadoun? You're first on the list. Get in!"], ['saad', 'عمي آني جايب كباب…', "Sir, I'm just delivering kebab…"], ['abuj', 'زين، اكله بالطيارة. اليوم بلا حوادث رجاءً!', 'Fine, eat it in the heli. No accidents today, please!']] },
      { scene: { lvl: ['baghdad', 'day'], cam: 0.3, fx: ['runway', ['parked', 'small', 0.55]] }, chars: [['saad', 0.35], ['zat', 0.48]], lines: [['saad', 'هاي… الطيارة؟ وين الدواسات؟', 'This… is the heli? Where are the pedals?'], ['radio', 'أبو جاسم: الأسهم للطيران، والحبل ينزل وحده. يلا!', 'Abu Jassim: Arrows to fly, the rope lowers itself. Go!']], note: ['ما انتبه أحد لشي رمادي صغير دخل للطيارة…', 'Nobody noticed something small and grey sneaking into the heli…'] },
    ],
    missions: [
      smF('1_1', { style: 'baghdad', name: ['التدريب', 'Training'], desc: ['أول طيران إلك. نزّل الحبل جنب الناس، يقفزون ويمسكون. وصّل 2 للمهبط.', 'Your first flight. Lower the rope near people — they jump on. Bring 2 to the helipad.'], goal: 2, people: 3, time: 220, worldW: 1100, lines: { wait: { ar: ['إنت الطيار الجديد؟ يمّه!', 'جبت الكباب؟'], en: ['You\'re the new pilot? Oh no!', 'Did you bring the kebab?'] } } }),
      smF('1_2', { style: 'baghdad', pal: 'dusk', name: ['سطح الكرادة', 'Karrada Rooftop'], desc: ['3 ناس فوگ سطح بالكرادة. خلي الحبل يرفرف بهدوء.', '3 people on a Karrada rooftop. Keep the rope steady.'], goal: 3, people: 4, time: 210 }),
      smF('1_3', { style: 'baghdad', name: ['حبل الغسيل', 'The Clothesline'], desc: ['انتبه لحبال الغسيل! أبو الغسيل ما يسامح.', 'Mind the clotheslines! The laundry man never forgives.'], goal: 4, people: 5, time: 220, wind: { base: 4, gust: 10 }, lines: { laundry: { ar: ['أبو الغسيل: هاي دشداشة أبوي!!'], en: ['Laundry man: My father\'s dishdasha!!'] } } }),
      smF('1_4', { style: 'baghdad', pal: 'night', name: ['السلسلة', 'The Chain'], desc: ['الناس يمسكون رجول بعض. 5 واحد مرة وحدة؟ جرّب!', 'People hold each other\'s feet. 5 at once? Try it!'], goal: 5, people: 6, time: 230 }),
      smF('1_5', { style: 'baghdad', pal: 'dusk', name: ['المنارة', 'The Minaret'], desc: ['آخر مهمة باليوم الأول. وصّل 5… وحاول ما تضرب المنارة.', 'Last mission of day one. Bring 5… and try not to hit the minaret.'], goal: 5, people: 7, time: 240, wind: { base: -4, gust: 12 } }),
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
      smF('2_1', { style: 'baghdad', pal: 'night', name: ['فيضان بلا غيم', 'Cloudless Flood'], desc: ['الماي يصعد. وصّل الناس للقوارب.', 'The water is rising. Get people to the boats.'], goal: 4, weather: 'flood', zones: 'boat', water: W_FLOOD(262, 238, 0.14), time: 220 }),
      smF('2_2', { style: 'baghdad', pal: 'night', name: ['السبّاحين', 'The Swimmers'], desc: ['ناس طاحوا بالماي ويسبحون. نزّل الحبل عليهم.', 'People fell in and are swimming. Lower the rope to them.'], goal: 5, weather: 'flood', zones: 'boat', water: W_FLOOD(256, 236, 0.12), time: 230 }),
      smF('2_3', { style: 'baghdad', pal: 'night', name: ['قارب النجاة', 'The Lifeboat'], desc: ['جرّب تهبط على القارب بهدوء، الناس ينزلون وحدهم.', 'Try landing gently on the boat — people climb down by themselves.'], goal: 6, people: 8, weather: 'flood', zones: 'boat', water: W_FLOOD(262, 232, 0.16), time: 240, heli: 'medic' }),
      smF('2_4', { style: 'baghdad', pal: 'night', type: 'animals', name: ['الخروف', 'The Sheep'], desc: ['خرفان عالقة! الحيوان ما يمسك الحبل، لازم واحد معلّق يشيله بإيده.', 'Stranded sheep! Animals can\'t hold the rope — a hanging person must carry them.'], goal: 3, weather: 'flood', zones: 'boat', water: W_FLOOD(262, 240, 0.1), time: 240 }),
      smF('2_5', { style: 'baghdad', pal: 'night', name: ['البخار الأزرق', 'The Blue Steam'], desc: ['المطر بدا فجأة… من وين؟ آخر الناس بالحي.', 'Rain started from nowhere… Last people in the district.'], goal: 6, people: 8, weather: 'rain', zones: 'boat', water: W_FLOOD(260, 230, 0.18), time: 250 }),
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
      smF('3_1', { style: 'baghdad', name: ['الجيران', 'The Neighbors'], desc: ['زعطوط هربت فوگ السطوح، والجيران عالقين بسبب حريق صغير. ساعدهم.', 'Zaatout fled over the rooftops, and neighbors are stuck by a small fire. Help them.'], goal: 4, type: 'fire', fire: 2, time: 220 }),
      smF('3_2', { style: 'baghdad', pal: 'day', name: ['أبو الغسيل', 'The Laundry Man'], desc: ['حبال غسيل بكل مكان والريح قوية. أبو الغسيل يراقبك…', 'Clotheslines everywhere and strong wind. The laundry man is watching…'], goal: 5, wind: { base: 8, gust: 18 }, weather: 'wind', time: 230 }),
      smF('3_3', { style: 'baghdad', pal: 'dusk', type: 'cargo', cargo: 'flour', name: ['صواني أم رزاق', "Grandma's Trays"], desc: ['أم رزاق تطبخ سمچ حتى ترجّع زعطوط المفتاح! وصّل الطحين والصواني.', 'Grandma is cooking fish to lure Zaatout! Deliver flour and trays.'], goal: 4, time: 220 }),
      smF('3_4', { style: 'baghdad', pal: 'night', type: 'animals', name: ['ملاحقة زعطوط', 'Chasing Zaatout'], desc: ['بزازين الحي كلها فوگ السطوح! واحدة منهن زعطوط.', 'All the neighborhood cats are on the roofs! One of them is Zaatout.'], goal: 3, time: 240 }),
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
      smF('4_1', { style: 'tokyo', pal: 'night', name: ['المسابقة', 'The Contest'], desc: ['الجولة الأولى: أنقذ 6 قبل نسيم!', 'Round one: rescue 6 before Naseem!'], goal: 6, people: 8, time: 220 }),
      smF('4_2', { style: 'tokyo', pal: 'night', heli: 'police', name: ['ضد الوقت', 'Against the Clock'], desc: ['وقت قليل وطيارة سريعة. لا تضرب الباگودا!', 'Little time and a fast heli. Don\'t hit the pagoda!'], goal: 6, time: 170 }),
      smF('4_3', { style: 'tokyo', pal: 'night', name: ['العاصفة', 'The Storm'], desc: ['مطر وبرق والشوارع غرگت. وصّل للقوارب.', 'Rain, lightning, flooded streets. Get them to the boats.'], goal: 7, people: 9, weather: 'storm', zones: 'boat', water: W_FLOOD(272, 240, 0.15), wind: { base: 6, gust: 20 }, time: 250 }),
      smF('4_4', { style: 'tokyo', pal: 'dusk', name: ['الإعصار الأول', 'The First Twister'], desc: ['إعصار من العدم بنص المسابقة! يشيل الناس من السطوح.', 'A twister out of nowhere mid-contest! It lifts people off roofs.'], goal: 5, weather: 'tornado', tornados: 1, time: 240 }),
      smF('4_5', { style: 'tokyo', pal: 'night', type: 'vip', vipName: { ar: 'الكابتن نسيم', en: 'Captain Naseem' }, name: ['إنقاذ نسيم', 'Saving Naseem'], desc: ['طيارة نسيم تعطلت وهو معلّق بحبل غسيل! لازم يكون وياهم.', 'Naseem\'s heli broke down and he\'s hanging on a clothesline! He must be rescued.'], goal: 4, time: 220 }),
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
      smF('5_1', { style: 'dubai', pal: 'dusk', name: ['عاصفة الرمل', 'Sandstorm'], desc: ['الرؤية قليلة والريح تدفع. وصّل 6 للمهبط.', 'Low visibility and pushing wind. Bring 6 to the helipad.'], goal: 6, weather: 'sand', wind: { base: 10, gust: 26 }, time: 240 }),
      smF('5_2', { style: 'dubai', pal: 'dusk', heli: 'medic', name: ['الأبراج', 'The Towers'], desc: ['أبراج عالية… الحبل لازم يكون مرفوع (Q/E).', 'Tall towers… keep the rope raised (Q/E).'], goal: 6, people: 8, weather: 'sand', wind: { base: -8, gust: 22 }, time: 240 }),
      smF('5_3', { style: 'dubai', pal: 'day', type: 'cargo', cargo: 'medicine', heli: 'police', name: ['الدوا', 'The Medicine'], desc: ['المستشفى محتاج دوا. وصّل الصناديق.', 'The hospital needs medicine. Deliver the crates.'], goal: 5, time: 220 }),
      smF('5_4', { style: 'dubai', pal: 'dusk', type: 'vip', vipName: { ar: 'العمدة مهند', en: 'Mayor Muhannad' }, name: ['العمدة مهند', 'Mayor Muhannad'], desc: ['العمدة يرفض يمسك رجول أحد! خلّيه أول واحد بالحبل.', 'The mayor refuses to hold anyone\'s feet! Make him first on the rope.'], goal: 5, weather: 'sand', time: 240, lines: { wait: { ar: ['آني ما أمسك رجول أحد!'], en: ["I don't hold anyone's feet!"] } } }),
      smF('5_5', { style: 'dubai', pal: 'night', type: 'fire', fire: 4, name: ['حريق البرج', 'Tower Fire'], desc: ['حريق بالأبراج بعد العاصفة. لا تطير فوگ النار.', 'Fires in the towers after the storm. Don\'t fly over the flames.'], goal: 6, time: 240 }),
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
      smF('6_1', { style: 'marsh', pal: 'dusk', name: ['المضيف', 'The Mudhif'], desc: ['صيادين فوگ المضايف والريح قوية.', 'Fishermen on the mudhifs, and strong wind.'], goal: 5, weather: 'wind', zones: 'boat', water: W_FLOOD(258, 258, 0), wind: { base: -10, gust: 24 }, time: 230 }),
      smF('6_2', { style: 'marsh', pal: 'day', name: ['الصيادين', 'The Fishermen'], desc: ['الهبّات تزيد. «الحبل مثل الشبچة، ارخي وشدّ» (Q/E).', 'Gusts get stronger. "The rope is like a net — slack and pull" (Q/E).'], goal: 6, weather: 'wind', zones: 'boat', water: W_FLOOD(258, 258, 0), wind: { base: 8, gust: 30 }, time: 240 }),
      smF('6_3', { style: 'marsh', pal: 'dusk', type: 'animals', name: ['الجاموس… قصدي الخرفان', 'Buffalo… I mean Sheep'], desc: ['الجاموس ثقيل هواية، فخلّينا بالخرفان.', 'Buffalo are way too heavy, so let\'s stick to sheep.'], goal: 3, zones: 'boat', water: W_FLOOD(258, 258, 0), wind: { base: 0, gust: 16 }, time: 240 }),
      smF('6_4', { style: 'marsh', pal: 'night', name: ['ليل الأهوار', 'Marsh Night'], desc: ['ظلام ومطر. حميد يأشّر بالفانوس على الناس.', 'Dark and rainy. Hamid points his lantern at the people.'], goal: 6, people: 8, weather: 'storm', zones: 'boat', water: W_FLOOD(258, 250, 0.05), wind: { base: -6, gust: 22 }, time: 250 }),
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
      smF('7_1', { style: 'cairo', pal: 'day', name: ['العرس', 'The Wedding'], desc: ['المعازيم فوگ السطوح والماي يصعد.', 'Guests on the roofs and the water is rising.'], goal: 5, weather: 'flood', zones: 'boat', water: W_FLOOD(268, 238, 0.13), time: 230, lines: { wait: { ar: ['خلّصوني قبل لا يخلص الكيك!'], en: ['Save me before the cake runs out!'] } } }),
      smF('7_2', { style: 'cairo', pal: 'day', type: 'cargo', cargo: 'melon', name: ['البطيخ', 'The Watermelons'], desc: ['بطيخ العرس! إذا طاح من عالي يتفلّش.', 'The wedding watermelons! Drop one from high up and it splatters.'], goal: 4, time: 220 }),
      smF('7_3', { style: 'cairo', pal: 'dusk', heli: 'chinook', name: ['المعازيم', 'The Guests'], desc: ['كل العائلة عالقة! جبتلك شينوك.', 'The whole family is stuck! Here\'s a Chinook.'], goal: 8, people: 10, weather: 'flood', zones: 'boat', water: W_FLOOD(270, 234, 0.15), time: 270 }),
      smF('7_4', { style: 'cairo', pal: 'dusk', type: 'vip', vipName: { ar: 'العريس', en: 'the groom' }, name: ['العريس', 'The Groom'], desc: ['العريس لازم يوصل… العروسة تنتظر!', 'The groom must make it… the bride is waiting!'], goal: 5, weather: 'flood', zones: 'boat', water: W_FLOOD(266, 240, 0.12), time: 240 }),
      smF('7_5', { style: 'cairo', pal: 'night', name: ['الحقيقة', 'The Truth'], desc: ['عاصفة «مصنوعة» على القاهرة. نسيم يطير وياك هالمرة.', 'A "manufactured" storm over Cairo. Naseem flies with you this time.'], goal: 7, people: 9, weather: 'storm', zones: 'boat', water: W_FLOOD(270, 236, 0.16), wind: { base: 6, gust: 22 }, time: 260 }),
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
      smF('8_1', { style: 'mountain', pal: 'day', type: 'animals', heli: 'golden', name: ['الرعاة', 'The Shepherds'], desc: ['رعاة وغنم عالقين، والإعصار يتمشى بالوادي.', 'Shepherds and sheep stranded, a twister roaming the valley.'], goal: 3, weather: 'tornado', tornados: 1, time: 250 }),
      smF('8_2', { style: 'mountain', pal: 'dusk', heli: 'golden', name: ['زعطوط بالهوا', 'Zaatout Airborne'], desc: ['الإعصار طيّر زعطوط! أنقذ الناس قبل ما يشيلهم هم.', 'The twister blew Zaatout away! Save people before it takes them too.'], goal: 5, weather: 'tornado', tornados: 1, wind: { base: 0, gust: 18 }, time: 250 }),
      smF('8_3', { style: 'mountain', pal: 'night', heli: 'golden', name: ['المحطة', 'The Station'], desc: ['حراس «غيمة» هربوا وتركوا العمال فوگ الجبل. إعصارين!', 'Ghayma guards fled, leaving workers on the peak. Two twisters!'], goal: 6, people: 8, weather: 'tornado', tornados: 2, time: 260 }),
      smF('8_4', { style: 'mountain', pal: 'night', type: 'vip', careful: true, heli: 'golden', vipName: { ar: 'الجد عبّود', en: 'Grandpa Abboud' }, name: ['الهروب ويه الجد', 'Escape with Grandpa'], desc: ['الجد عبّود حي! طلّعه هو والباقين… وبهدوء، محد يطيح!', 'Grandpa Abboud is alive! Get him and the others out… gently, nobody falls!'], goal: 4, weather: 'storm', wind: { base: 4, gust: 18 }, time: 260 }),
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
      smF('9_1', { style: 'baghdad', pal: 'dusk', heli: 'golden', name: ['بغداد تدور', 'Baghdad Spins'], desc: ['إعصارين ببغداد! سُرى تبث مكان الناس.', 'Two twisters in Baghdad! Sura broadcasts where people are.'], goal: 6, weather: 'tornado', tornados: 2, time: 260 }),
      smF('9_2', { style: 'dubai', pal: 'night', heli: 'golden', name: ['دبي تدوخ', 'Dizzy Dubai'], desc: ['رمل وإعصار. الأبراج عالية والحبل لازم يرتفع.', 'Sand and twisters. Tall towers — keep the rope up.'], goal: 6, weather: 'tornado', tornados: 2, time: 260 }),
      smF('9_3', { style: 'cairo', pal: 'dusk', heli: 'golden', name: ['النيل يلف', 'The Nile Spins'], desc: ['إعصار فوگ النيل والماي يصعد.', 'A twister over the Nile, and the water rises.'], goal: 6, weather: 'tornado', tornados: 1, zones: 'boat', water: W_FLOOD(266, 240, 0.12), time: 260 }),
      smF('9_4', { style: 'tokyo', pal: 'night', heli: 'chinook', name: ['طوكيو', 'Tokyo'], desc: ['نسيم يساعدك من بعيد. 8 لازم يوصلون.', 'Naseem helps from afar. 8 must make it.'], goal: 8, people: 10, weather: 'tornado', tornados: 2, time: 280 }),
      smF('9_5', { style: 'mumbai', pal: 'night', heli: 'chinook', name: ['مومباي', 'Mumbai'], desc: ['مطر وإعصار وفيضان مرة وحدة. حميد بالقارب ينتظر.', 'Rain, twister and flood at once. Hamid waits in the boat.'], goal: 8, people: 10, weather: 'tornado', tornados: 1, zones: 'boat', water: W_FLOOD(266, 230, 0.16), time: 290 }),
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
      smF('10_1', { style: 'baghdad', pal: 'night', heli: 'golden', name: ['الأحياء', 'The Neighborhoods'], desc: ['الناس بطريق الإعصار. طلّعهم قبل لا يوصلهم.', 'People in the twister\'s path. Get them out before it reaches them.'], goal: 7, people: 9, weather: 'tornado', tornados: 2, time: 280 }),
      smF('10_2', { style: 'baghdad', pal: 'night', type: 'vip', careful: true, heli: 'golden', vipName: { ar: 'أبو جاسم', en: 'Abu Jassim' }, name: ['أبو جاسم والچاي', 'Abu Jassim and the Tea'], desc: ['البرج دا ينهار وأبو جاسم ماسك استكان الچاي! بهدوء… ولا قطرة تطيح.', 'The tower is collapsing and Abu Jassim holds his tea! Gently… not a drop spilled.'], goal: 5, weather: 'storm', wind: { base: -6, gust: 22 }, time: 260, lines: { wait: { ar: ['أبو جاسم: الچاي! لا يطيح الچاي!'], en: ['Abu Jassim: The tea! Don\'t spill the tea!'] } } }),
      smF('10_3', { style: 'baghdad', pal: 'night', heli: 'chinook', name: ['الجهاز', 'The Machine'], desc: ['إعصارين حول البرج. نسيم يشتت الحراس وإنت تنقذ.', 'Two twisters around the tower. Naseem distracts the guards while you rescue.'], goal: 8, people: 10, weather: 'tornado', tornados: 2, zones: 'boat', water: W_FLOOD(266, 236, 0.14), time: 290 }),
      smF('10_4', { style: 'baghdad', pal: 'night', heli: 'giant', name: ['⭐ غيمة بغداد', '⭐ The Cloud over Baghdad'], desc: ['المعركة الأخيرة! 10 أشخاص، إعصارين، وفيضان. زعطوط جاهزة تقطع السلك.', 'The final battle! 10 people, two twisters and a flood. Zaatout is ready to cut the wire.'], goal: 10, people: 12, weather: 'tornado', tornados: 2, zones: 'boat', water: W_FLOOD(266, 226, 0.18), wind: { base: 0, gust: 24 }, time: 330 }),
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
const STORY_FUNNY_POST = [
  { scene: { lvl: ['baghdad', 'night'], cam: 0.8, pan: 4, fx: [['heli', 'golden', 0.5]] }, chars: [['zat', 0.5]], cap: ['بعد منتصف الليل…', 'After midnight…'], lines: [['zat', '(زعطوط تسوق الصقر الذهبي… وتطير)', '(Zaatout flies the Golden Falcon… away)']] },
  { scene: { lvl: ['baghdad', 'night'], cam: 0.9, fx: [['steam', 0.85, 140]] }, cap: ['وعلى سطح بعيد… ضوء أزرق صغير يرجع يشتعل.', 'And on a distant roof… a small blue light flickers back on.'], note: ['يتبع… الجزء الثاني 😼', 'To be continued… Part Two 😼'] },
];



/* ============================================================
   قصة الرعب: صوت من الهور
   حيدر، طيار إنقاذ ليلي بالبصرة، يجيه نداء من قرية غرقت قبل 20 سنة.
   المهمات «dark»: ظلام كامل، بس ضوء الطيارة يكشف الناس.
   ============================================================ */
const H = (o) => Object.assign({ dark: true, pal: 'night' }, o);
// كلام الناس بمهمات الرعب (بدل النكت)
const HORROR_LINES = {
  wait: LL(['لا تطفي الضوا!', 'سمعته… جان ينادي بصوت أخوي', 'بسرعة! قبل لا يرجع!', 'هنا! إحنا هنا!', 'شفت عيون بالقصب…'], ['Don\'t turn off the light!', 'I heard it… it called in my brother\'s voice', 'Hurry! Before it comes back!', 'Here! We\'re here!', 'I saw eyes in the reeds…']),
  waitWater: LL(['الماي يصعد… وأكو شي يتحرك بيه', 'لا تخليني بالظلام!'], ['The water\'s rising… and something moves in it', 'Don\'t leave me in the dark!']),
  swim: LL(['أكو شي يمسك رجلي!', 'طلّعني من الماي! بسرعة!'], ['Something is grabbing my leg!', 'Get me out of the water! Now!']),
  jump: LL(['بسم الله!', 'لا تباوع لتحت…'], ['In God\'s name!', 'Don\'t look down…']),
  grab: LL(['مسكته!', 'الحمد لله… الحمد لله'], ['Got it!', 'Thank God… thank God']),
  hang: LL(['لا تنزل قريب من الماي…', 'سمعت؟ أحد يضحك تحت', 'ضوّي على القصب… لا، لا تضوّي', 'الهوا بارد… مو طبيعي'], ['Don\'t fly low over the water…', 'Did you hear? Someone is laughing below', 'Shine on the reeds… no, don\'t', 'The air is cold… not natural']),
  scared: LL(['أسرع! هو ورانا!', 'لا توگف! لا توگف!', 'يا ربي…'], ['Faster! It\'s behind us!', 'Don\'t stop! Don\'t stop!', 'Oh God…']),
  fingers: LL(['إيدي… ما أگدر…', 'لا تخليني أطيح بالماي!'], ['My hand… I can\'t…', 'Don\'t let me fall into the water!']),
  fall: LL(['لاااا!', 'مو بالماي! مو بالماي!'], ['NOOO!', 'Not the water! Not the water!']),
  dragged: LL(['ليش فلتت؟!', 'كلنا طحنا!'], ['Why did you let go?!', 'We\'re all falling!']),
  hit: LL(['آخ!', 'انتبه للبيوت!'], ['Ouch!', 'Watch the houses!']),
  missed: LL(['فاتني! ارجع!', 'لا تتركني هنا!'], ['Missed! Come back!', 'Don\'t leave me here!']),
  saved: LL(['وصلنا… الحمد لله', 'أبد ما أرجع لهالمكان', 'شكراً… لا تطفي الضوا'], ['We made it… thank God', 'I\'m never coming back here', 'Thank you… keep the light on']),
  landWater: LL(['طلّعوني! بسرعة!', 'الماي… جان بيه شي'], ['Get me out! Quickly!', 'The water… there was something in it']),
  landHard: LL(['آخ… بس عايش', 'لا تخلوني بالظلام'], ['Ugh… but alive', 'Don\'t leave me in the dark']),
  full: LL(['لا تتركوني! أرجوكم!', 'ارجع إلي… وعد؟'], ['Don\'t leave me! Please!', 'Come back for me… promise?']),
  board: LL(['بسرعة، سكّر الباب!', 'طير! طير!'], ['Quick, shut the door!', 'Fly! Fly!']),
  slip: LL(['زلگت!'], ['I slipped!']),
  groan: LL(['آخ…', 'هو هنا… أحس بيه…'], ['Ugh…', 'It\'s here… I can feel it…']),
};
const STORY_HORROR = [
  { // ───────── 1
    id: 'h1', title: ['النداء', 'The Call'], city: ['قرية أم الطيور', 'Umm al-Tuyur Village'],
    intro: [
      { scene: { room: 'tower' }, chars: [['nadia', 0.62, 1], ['haider', 0.32]], cap: ['البصرة. الساعة 3 وربع بعد نص الليل.', 'Basra. 3:15 in the morning.'], lines: [['nadia', 'حيدر… نداء استغاثة من قرية «أم الطيور».', 'Haider… a distress call from the village of Umm al-Tuyur.'], ['haider', 'أم الطيور؟ هاي غرقت قبل عشرين سنة. ماكو بيها أحد.', 'Umm al-Tuyur? That village drowned twenty years ago. Nobody lives there.'], ['nadia', 'أدري… بس اسمع.', 'I know… but listen.']] },
      { scene: { room: 'dark', fx: ['static'] }, cap: ['(صوت من الراديو، بعيد ومقطّع)', '(a voice on the radio, distant and broken)'], lines: [['radio', '…الماي دا يصعد… إحنا فوگ السطح… من زمان ننتظر… من زمان…', '…the water is rising… we are on the roof… we have been waiting so long… so long…']] },
    ],
    missions: [
      sm('h1_1', H({ at: 'marsh', style: 'marsh', name: ['الضوا', 'The Light'], desc: ['ظلام كامل. بس ضوا الطيارة يكشف. الناس فوگ المضايف القديمة.', 'Total darkness. Only your light reveals anything. People on the old mudhifs.'], goal: 3, people: 4, zones: 'boat', water: W_FLOOD(258, 258, 0), time: 240, lines: { wait: LL(['لا تطفي الضوا…', 'وأخيراً… وأخيراً جيت'], ['Don\'t turn off the light…', 'At last… at last you came']) } })),
      sm('h1_2', H({ at: 'marsh', style: 'marsh', name: ['القرية الغرقانة', 'The Drowned Village'], desc: ['البيوت نصها بالماي. الأصوات تجي من كل مكان.', 'Houses half underwater. The voices come from everywhere.'], goal: 4, zones: 'boat', water: W_FLOOD(258, 250, 0.03), weather: 'wind', wind: { base: -4, gust: 14 }, time: 250, lines: { hang: LL(['لا تباوع للماي…', 'سمعت؟ أحد ينادي اسمك'], ['Don\'t look at the water…', 'Did you hear? Someone is calling your name']) } })),
      sm('h1_3', H({ at: 'marsh', style: 'marsh', name: ['السبّاحين', 'The Swimmers'], desc: ['ناس بالماي… بس ماكو أي قارب وصلهم. منين جوا؟', 'People in the water… but no boat ever reached them. Where did they come from?'], goal: 4, zones: 'boat', water: W_FLOOD(258, 244, 0.05), weather: 'rain', time: 250 })),
      sm('h1_4', H({ at: 'marsh', style: 'marsh', name: ['الفجر بعيد', 'Dawn Is Far'], desc: ['آخر ناس بالقرية. والضوا يرمش.', 'The last people in the village. And your light keeps flickering.'], goal: 5, people: 7, zones: 'boat', water: W_FLOOD(258, 244, 0.06), weather: 'storm', time: 260 })),
    ],
    outro: [
      { scene: { lvl: ['marsh', 'night'], cam: 0.5, fx: [['flood', 230], ['fog']] }, chars: [['haider', 0.4]], lines: [['radio', 'حيدر: القارب استلم الناس؟ كم عددهم؟', 'Haider: Did the boat take the people? How many?'], ['radio', 'القارب: …أي ناس؟ ماكو أحد نزل عدنا. ولا واحد.', 'Boat: …What people? Nobody came down to us. Not a single one.']] },
      { scene: { lvl: ['marsh', 'night'], cam: 0.55, fx: [['flood', 230], ['fog'], ['eyes', 0.75, 200]] }, cap: ['وبين القصب… شي يباوع.', 'And in the reeds… something is watching.'] },
    ],
  },
  { // ───────── 2
    id: 'h2', title: ['الحجي كاظم', 'Hajji Kadhim'], city: ['الهور', 'The Marsh'],
    intro: [
      { scene: { lvl: ['marsh', 'dusk'], cam: 0.3, fx: [['flood', 236]] }, chars: [['kadhim', 0.35], ['haider', 0.66, 1]], lines: [['kadhim', 'رحت لأم الطيور؟ بالليل؟ الله يستر عليك يا ابني.', 'You went to Umm al-Tuyur? At night? God protect you, son.'], ['haider', 'حجي، أكو ناس هناك. سمعتهم.', 'Hajji, there are people there. I heard them.'], ['kadhim', 'لا. سمعت «الطنطل».', 'No. You heard the Tantal.']] },
      { scene: { lvl: ['marsh', 'night'], cam: 0.4, fx: [['tantal', 0.7], ['fog']] }, chars: [['kadhim', 0.3]], lines: [['kadhim', 'الطنطل يعيش بالهور من قبل جدّ جدّي. يقلّد صوت اللي تحبهم… حتى يجرّك للماي.', 'The Tantal has lived in the marsh since before my grandfather\'s grandfather. It imitates the voices of those you love… to drag you into the water.'], ['kadhim', 'إذا سمعت صوت ميت يناديك… لا تجاوب.', 'If you hear a dead voice calling you… don\'t answer.']] },
    ],
    missions: [
      sm('h2_1', H({ style: 'marsh', type: 'animals', name: ['الجاموس يصرخ', 'The Buffalo Scream'], desc: ['الحيوانات هربت من شي بالماي. رجّعها لأصحابها.', 'The animals fled from something in the water. Bring them back to their owners.'], goal: 3, zones: 'boat', water: W_FLOOD(258, 258, 0), time: 250 })),
      sm('h2_2', H({ style: 'marsh', name: ['الضباب', 'The Fog'], desc: ['ضباب وظلام. الصيادين ضايعين. ضوّي عليهم.', 'Fog and darkness. The fishermen are lost. Shine your light on them.'], goal: 5, zones: 'boat', water: W_FLOOD(258, 252, 0.03), weather: 'rain', time: 260, lines: { wait: LL(['شفت ظل طويل… أطول من النخلة', 'هنا! بس لا تنزل للماي!'], ['I saw a tall shadow… taller than a palm tree', 'Here! But don\'t go near the water!']) } })),
      sm('h2_3', H({ style: 'marsh', type: 'fire', fire: 3, name: ['القصب يحترگ', 'The Reeds Burn'], desc: ['أهل القرية ولّعوا نار حتى يبعدونه. النار وصلت للبيوت.', 'The villagers lit fires to keep it away. The fire reached the houses.'], goal: 5, time: 250 })),
      sm('h2_4', H({ style: 'marsh', name: ['بيت الحجي', 'The Hajji\'s House'], desc: ['عائلة الحجي كاظم محاصرة. الماي يصعد والضوا يرمش.', 'Hajji Kadhim\'s family is trapped. The water rises and your light flickers.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(258, 242, 0.07), weather: 'storm', time: 270 })),
    ],
    outro: [
      { scene: { room: 'cockpit', fx: ['static'] }, chars: [], cap: ['بطريق الرجعة، الراديو يشتغل وحده.', 'On the way back, the radio switches on by itself.'], lines: [['radio', '…حيدر… يمّه حيدر… تعال… البرد هنا…', '…Haider… my son Haider… come… it\'s so cold here…'], ['radio', 'حيدر: …يمّه؟', 'Haider: …Mom?']] },
      { scene: { room: 'dark' }, cap: ['أمه ماتت قبل 20 سنة. بفيضان أم الطيور.', 'His mother died 20 years ago. In the Umm al-Tuyur flood.'] },
    ],
  },
  { // ───────── 3
    id: 'h3', title: ['الصوت', 'The Voice'], city: ['البصرة القديمة', 'Old Basra'],
    intro: [
      { scene: { room: 'tower' }, chars: [['nadia', 0.62, 1], ['haider', 0.32]], lines: [['haider', 'نادية… سمعتي الراديو البارحة؟ صوت أمي.', 'Nadia… did you hear the radio last night? My mother\'s voice.'], ['nadia', 'حيدر… الراديو جان مطفي. آني طفيته قبل لا تطلع.', 'Haider… the radio was off. I switched it off before you took off.'], ['haider', '……', '……']] },
    ],
    missions: [
      sm('h3_1', H({ at: 'basra', style: 'baghdad', type: 'careful', careful: true, heli: 'medic', name: ['المستشفى المهجور', 'The Abandoned Hospital'], desc: ['نداء من مستشفى مسكّر من سنين. بس أكو مرضى فوگ السطح. بهدوء.', 'A call from a hospital closed for years. Yet there are patients on the roof. Gently.'], goal: 4, time: 270, lines: { wait: LL(['الممرضة گالت ننتظر هنا… من زمان', 'شكد صار الوقت؟ أي سنة؟'], ['The nurse said wait here… long ago', 'What time is it? What year?']) } })),
      sm('h3_2', H({ at: 'basra', style: 'baghdad', name: ['الشناشيل', 'The Shanasheel'], desc: ['البيوت القديمة. الأبواب تنفتح وحدها.', 'The old houses. The doors open by themselves.'], goal: 5, weather: 'rain', wind: { base: 4, gust: 12 }, time: 260 })),
      sm('h3_3', H({ at: 'basra', style: 'baghdad', name: ['الكورنيش', 'The Corniche'], desc: ['ناس على الكورنيش والماي يصعد بالليل… والمد ما المفروض يجي هالوكت.', 'People on the Corniche and the water rising at night… the tide shouldn\'t come at this hour.'], goal: 5, zones: 'boat', water: W_FLOOD(260, 244, 0.08), time: 260 })),
      sm('h3_4', H({ at: 'basra', style: 'baghdad', type: 'fire', fire: 4, name: ['الحريق', 'The Fire'], desc: ['حريق بعمارة… والناس فوگ يگولون «لا تخلي يطفي الضوا».', 'A building fire… and the people on top say "don\'t let the light go out."'], goal: 6, time: 260 })),
    ],
    outro: [
      { scene: { lvl: ['baghdad', 'night'], cam: 0.5, fx: [['fog'], ['tantal', 0.8]] }, chars: [['haider', 0.3]], cap: ['على سطح بعيد، ظل طويل… أطول من البيت.', 'On a distant roof, a tall shadow… taller than the house.'], lines: [['haider', 'إنت منو؟!', 'Who are you?!'], ['cap', '(الظل يحچي بصوت حيدر نفسه) «إنت منو؟!»', '(the shadow speaks in Haider\'s own voice) "Who are you?!"', '']] },
    ],
  },
  { // ───────── 4
    id: 'h4', title: ['زينب', 'Zainab'], city: ['أم الطيور', 'Umm al-Tuyur'],
    intro: [
      { scene: { room: 'home' }, chars: [['father', 0.35], ['haider', 0.66, 1]], lines: [['father', 'بنتي زينب، 8 سنين. طلعت تلعب على الجرف… وسمعت أحد يناديها من الهور.', 'My daughter Zainab, 8 years old. She went to play by the bank… and heard someone calling her from the marsh.'], ['father', 'الشرطة ما تروح لأم الطيور بالليل. إنت بس.', 'The police won\'t go to Umm al-Tuyur at night. Only you.'], ['haider', 'أرجّعها. وعد.', 'I\'ll bring her back. I promise.']] },
    ],
    missions: [
      sm('h4_1', H({ style: 'marsh', name: ['آثار رجول', 'Footprints'], desc: ['آثار رجول صغيرة على الجرف… تمشي للماي. أنقذ اللي تلگاهم بالطريق.', 'Small footprints on the bank… walking into the water. Rescue whoever you find on the way.'], goal: 5, zones: 'boat', water: W_FLOOD(258, 250, 0.04), weather: 'rain', time: 260 })),
      sm('h4_2', H({ style: 'marsh', name: ['المضيف الأسود', 'The Black Mudhif'], desc: ['مضيف محروگ بنص الهور. أصوات أطفال يضحكون.', 'A burnt mudhif in the middle of the marsh. The sound of children laughing.'], goal: 5, zones: 'boat', water: W_FLOOD(258, 248, 0.04), wind: { base: -6, gust: 16 }, time: 260, lines: { wait: LL(['شفت بنية صغيرة… مشت فوگ الماي', 'لا تصدّق كل صوت تسمعه'], ['I saw a little girl… she walked on the water', 'Don\'t believe every voice you hear']) } })),
      sm('h4_3', H({ style: 'marsh', type: 'animals', name: ['الطيور', 'The Birds'], desc: ['اسم القرية «أم الطيور»… والطيور كلها ساكتة. الحيوانات خايفة.', 'The village is named "Mother of Birds"… and every bird is silent. The animals are terrified.'], goal: 3, zones: 'boat', water: W_FLOOD(258, 258, 0), time: 250 })),
      sm('h4_4', H({ style: 'marsh', type: 'vip', careful: true, vipName: { ar: 'زينب', en: 'Zainab' }, name: ['⭐ زينب', '⭐ Zainab'], desc: ['زينب فوگ سطح بآخر القرية. بس أكو زينبين… وحدة منهن مو زينب. وصّلهم كلهم بهدوء.', 'Zainab is on a roof at the edge of the village. But there are two Zainabs… one of them isn\'t her. Bring them all, gently.'], goal: 5, zones: 'boat', water: W_FLOOD(258, 246, 0.05), weather: 'storm', time: 280, lines: { vip_wait: LL(['عمو… أريد بابا', 'عمو، ليش الماي بارد هواية؟'], ['Mister… I want my dad', 'Mister, why is the water so cold?']) } })),
    ],
    outro: [
      { scene: { lvl: ['marsh', 'night'], cam: 0.5, fx: [['flood', 230], ['fog']] }, chars: [['zainab', 0.4], ['haider', 0.62, 1]], lines: [['zainab', 'عمو… البنية اللي جانت وياي فوگ السطح… وين راحت؟', 'Mister… the girl who was with me on the roof… where did she go?'], ['haider', 'أي بنية؟', 'What girl?'], ['zainab', 'اللي تشبهني.', 'The one who looked like me.']] },
      { scene: { lvl: ['marsh', 'night'], cam: 0.6, fx: [['flood', 230], ['fog'], ['eyes', 0.3, 214], ['eyes', 0.8, 206]] }, cap: ['الطيور ما رجعت تغني.', 'The birds never sang again.'] },
    ],
  },
  { // ───────── 5
    id: 'h5', title: ['المراية', 'The Mirror'], city: ['الهور', 'The Marsh'],
    intro: [
      { scene: { room: 'tower' }, chars: [['nadia', 0.5]], cap: ['البرج. نادية وحدها.', 'The tower. Nadia, alone.'], lines: [['radio', 'حيدر: نادية، آني راجع. افتحي ضوا المهبط.', 'Haider: Nadia, I\'m coming back. Turn on the pad lights.'], ['radio', 'حيدر: نادية لا تفتحين الضوا! هذا مو آني!', 'Haider: Nadia, don\'t turn on the lights! That isn\'t me!'], ['nadia', '…صوتين. نفس الصوت.', '…Two voices. The same voice.']] },
      { scene: { room: 'tower' }, chars: [['nadia', 0.5]], lines: [['nadia', 'حيدر… شنو آخر شي گلته إلي قبل لا تطلع؟', 'Haider… what was the last thing you said to me before you took off?'], ['radio', '(الصوتين سوا) «لا تطفين الراديو».', '(both voices at once) "Don\'t switch off the radio."']] },
    ],
    missions: [
      sm('h5_1', H({ style: 'marsh', name: ['الدوامة', 'The Whirlpool'], desc: ['دوامة بنص الهور تسحب كل شي. الناس بطريقها.', 'A whirlpool in the middle of the marsh pulls everything in. People are in its path.'], goal: 5, weather: 'tornado', tornados: 1, zones: 'boat', water: W_FLOOD(258, 250, 0.03), time: 270 })),
      sm('h5_2', H({ style: 'marsh', name: ['القرية تتكرر', 'The Village Repeats'], desc: ['نفس البيوت… نفس الناس… كأن الليلة تعيد نفسها.', 'The same houses… the same people… as if the night is repeating itself.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(258, 244, 0.06), weather: 'rain', time: 270, lines: { wait: LL(['مو إنت أنقذتني قبل شوية؟', 'هاي ثاني مرة تجي…'], ['Didn\'t you save me a minute ago?', 'This is the second time you\'ve come…']) } })),
      sm('h5_3', H({ style: 'marsh', type: 'careful', careful: true, heli: 'medic', name: ['الجدّات', 'The Grandmothers'], desc: ['جدّات القرية يعرفون القصة من زمان. بهدوء… ولا وحدة تطيح.', 'The village grandmothers have known the story for ages. Gently… not one falls.'], goal: 4, zones: 'boat', water: W_FLOOD(258, 252, 0.03), time: 270, lines: { wait: LL(['يا ابني، اقرا المعوذات وانت طاير'], ['Son, say your prayers while you fly']) } })),
    ],
    outro: [
      { scene: { room: 'cockpit', fx: ['static'] }, chars: [], lines: [['radio', 'نادية: حيدر… إذا إنت إنت… الطنطل يخاف من شي واحد.', 'Nadia: Haider… if you\'re really you… the Tantal fears only one thing.'], ['radio', 'نادية: الفجر. الحجي كاظم گال: أول ضوا للشمس يرجّعه للماي.', 'Nadia: Dawn. Hajji Kadhim said: the first light of the sun sends it back to the water.'], ['radio', 'حيدر: كم باقي للفجر؟', 'Haider: How long until dawn?'], ['radio', 'نادية: ساعة.', 'Nadia: One hour.']] },
    ],
  },
  { // ───────── 6
    id: 'h6', title: ['الفجر', 'Dawn'], city: ['أم الطيور', 'Umm al-Tuyur'],
    intro: [
      { scene: { lvl: ['marsh', 'night'], cam: 0.5, fx: [['flood', 226], ['tantal', 0.5], 'storm'] }, cap: ['آخر ساعة بالليل. الطنطل ما يريد حيدر يوصل للفجر.', 'The last hour of night. The Tantal doesn\'t want Haider to reach dawn.'] },
      { scene: { room: 'dark', fx: ['static'] }, lines: [['radio', '…يمّه حيدر… انزل… الماي دافي…', '…my son Haider… come down… the water is warm…'], ['radio', 'حيدر: إنتي مو أمي. أمي جانت تگول «اصعد».', 'Haider: You\'re not my mother. My mother used to say "climb up."']] },
    ],
    missions: [
      sm('h6_1', H({ style: 'marsh', name: ['آخر الليل', 'End of the Night'], desc: ['الأصوات تزيد. الناس الحقيقيين ينتظرون. لا توگف.', 'The voices grow louder. The real people are waiting. Don\'t stop.'], goal: 6, people: 8, zones: 'boat', water: W_FLOOD(260, 240, 0.08), weather: 'storm', wind: { base: -6, gust: 20 }, time: 280 })),
      sm('h6_2', H({ style: 'marsh', name: ['دوامتين', 'Two Whirlpools'], desc: ['الهور كله يلف. دوامتين وشي طويل بينهم.', 'The whole marsh is spinning. Two whirlpools and something tall between them.'], goal: 6, weather: 'tornado', tornados: 2, zones: 'boat', water: W_FLOOD(258, 248, 0.04), time: 290 })),
      sm('h6_3', H({ style: 'marsh', heli: 'chinook', name: ['⭐ قبل الفجر', '⭐ Before Dawn'], desc: ['آخر أهل أم الطيور. السلّم نازل، والفجر بعد دقايق. كل واحد يصعد… لازم يكون حقيقي.', 'The last people of Umm al-Tuyur. The ladder is down and dawn is minutes away. Everyone who climbs… must be real.'], goal: 8, people: 10, zones: 'boat', water: W_FLOOD(260, 238, 0.1), weather: 'storm', time: 300 })),
    ],
    outro: [
      { scene: { lvl: ['marsh', 'dusk'], cam: 0.5, fx: [['flood', 232], 'sun'] }, chars: [['kadhim', 0.3], ['zainab', 0.5], ['haider', 0.7, 1]], cap: ['الشمس تطلع على أم الطيور لأول مرة من عشرين سنة.', 'The sun rises over Umm al-Tuyur for the first time in twenty years.'], lines: [['kadhim', 'رجع للماي. يمكن يرجع بعد عشرين سنة… يمكن ما يرجع.', 'It went back to the water. Maybe it returns in twenty years… maybe never.'], ['zainab', 'عمو، اسمع… الطيور رجعت تغني.', 'Mister, listen… the birds are singing again.']] },
      { scene: { room: 'tower' }, chars: [['nadia', 0.5]], cap: ['البرج. نادية تسجّل آخر شي بدفتر الليلة.', 'The tower. Nadia writes the last line in the night log.'], lines: [['radio', 'حيدر: نادية، آني نزلت. جاي للبرج.', 'Haider: Nadia, I\'ve landed. Coming up to the tower.'], ['nadia', '(تبتسم)… الحمد لله.', '(smiles)… Thank God.']] },
      { scene: { room: 'tower' }, chars: [['haider', 0.32], ['nadia', 0.62, 1]], cap: ['الباب ينفتح. حيدر يدخل.', 'The door opens. Haider walks in.'], lines: [['haider', 'نادية… آني نزلت قبل ساعة. ونمت بالطيارة.', 'Nadia… I landed an hour ago. I fell asleep in the heli.'], ['haider', '…منو اللي جان يحچي وياچ هسه؟', '…Who was talking to you just now?']] },
      { scene: { room: 'dark', fx: ['static'] }, cap: ['(الراديو يشتغل وحده)', '(the radio turns itself on)'], lines: [['radio', '…نادية… افتحي ضوا المهبط…', '…Nadia… turn on the pad lights…']] },
    ],
    ending: true,
  },
];
const STORY_HORROR_POST = [
  { scene: { lvl: ['marsh', 'night'], cam: 0.7, fx: [['flood', 230], ['fog'], ['eyes', 0.5, 210]] }, cap: ['بعد عشرين سنة…', 'Twenty years later…'], note: ['يتبع؟', 'To be continued?'] },
];

const STORIES = [
  { id: 'flood', title: ['الطوفان الأخير', 'The Last Flood'], sub: ['دراما — يونس، آخر طيار، يسابق الماي حتى يوصل لبنته', 'Drama — Younis, the last pilot, races the water to reach his daughter'], chapters: STORY_FLOOD, post: STORY_FLOOD_POST, icon: '🌊' },
  { id: 'funny', title: ['سعدون وغيمة بغداد', 'Saadoun and the Cloud over Baghdad'], sub: ['كوميديا — موصّل كباب صار طيار إنقاذ بالغلط', 'Comedy — a kebab delivery guy becomes a rescue pilot by mistake'], chapters: STORY_FUNNY, post: STORY_FUNNY_POST, icon: '😂' },
  { id: 'uruk', title: ['لوح أوروك', 'The Uruk Tablet'], sub: ['مغامرة — علي ونوال يرجّعون ألواح كلكامش المسروقة', 'Adventure — Ali and Nawal bring the stolen Gilgamesh tablets home'], chapters: STORY_URUK, post: STORY_URUK_POST, icon: '🏺' },
  { id: 'horror', title: ['صوت من الهور', 'A Voice from the Marsh'], sub: ['رعب — نداء استغاثة من قرية غرقت قبل 20 سنة', 'Horror — a distress call from a village that drowned 20 years ago'], chapters: STORY_HORROR, post: STORY_HORROR_POST, icon: '👁️' },
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
function stSave() { if (!save.story) save.story = { ch: {} }; const s = save.story; if (!s.c) s.c = {}; if (!s.c[CUR.id]) s.c[CUR.id] = { ch: CUR.id === 'funny' && s.ch ? Object.assign({}, s.ch) : {} }; return s.c[CUR.id]; }
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
