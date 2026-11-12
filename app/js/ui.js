'use strict';
/* ============================================================
   الواجهات: القائمة، الكرة الأرضية، الإيقاف، النتيجة
   ============================================================ */

let selMission = 0;

function show(id) {
  for (const s of document.querySelectorAll('.screen')) s.classList.toggle('on', s.id === id);
  $('#hud').classList.toggle('on', id === null);
}
function applyLang() {
  const ar = lang() === 'ar';
  document.documentElement.lang = ar ? 'ar' : 'en';
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = T(el.dataset.t);
  $('#btnSound').textContent = T('sound') + ': ' + (save.sound ? T('on') : T('off'));
  buildMissionList(); selectMission(selMission, true);
  $('#chPrev').textContent = ar ? '›' : '‹'; $('#chNext').textContent = ar ? '‹' : '›';
  renderUpdate();
  if (G) updateHUD();
}

/* ---------------- قائمة المهمات ---------------- */
function unlocked(i) { return i === 0 || (save.stars[MISSIONS[i - 1].id] || 0) > 0; }
function starStr(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
const TYPE_ICON = { rescue: '🛟', cargo: '📦', vip: '👑', animals: '🐑', careful: '👵', fire: '🔥' };
let curChapter = 1;
function chapterRange(ch) { const out = []; MISSIONS.forEach((m, i) => { if (m.chapter === ch) out.push(i); }); return out; }
function totalStars() { return MISSIONS.reduce((a, m) => a + (save.stars[m.id] || 0), 0); }
function buildMissionList() {
  const box = $('#mlist'); box.innerHTML = '';
  const idx = chapterRange(curChapter); const first = MISSIONS[idx[0]];
  const chStars = idx.reduce((a, i) => a + (save.stars[MISSIONS[i].id] || 0), 0);
  $('#chName').textContent = `${T('chapter')} ${curChapter} / ${CHAPTERS} · ${first.chapter === 1 ? (lang() === 'ar' ? 'البداية' : 'Beginnings') : first.city[lang()]}`;
  $('#chStars').textContent = `★ ${chStars}/${idx.length * 3}  ·  ${T('totalStars')} ${totalStars()}/${MISSIONS.length * 3}`;
  $('#chPrev').disabled = curChapter <= 1; $('#chNext').disabled = curChapter >= CHAPTERS;
  for (const i of idx) {
    const m = MISSIONS[i];
    const b = document.createElement('button'); b.className = 'mcard' + (unlocked(i) ? '' : ' locked') + (i === selMission ? ' sel' : '');
    const st = save.stars[m.id] || 0;
    b.innerHTML = `<span class="mn">${String(i + 1).padStart(3, '0')}</span><span class="mi">${TYPE_ICON[m.type || 'rescue']}</span><span class="mt"><b>${m.city[lang()]}</b><small>${m.name[lang()]}</small></span><span class="ms">${unlocked(i) ? starStr(st) : '🔒'}</span>`;
    b.dataset.i = i;
    b.onclick = () => { AU.init(); AU.click(); selectMission(i); };
    b.ondblclick = () => { if (unlocked(i)) startMission(i); };
    box.appendChild(b);
  }
}
function setChapter(ch) { curChapter = clamp(ch, 1, CHAPTERS); buildMissionList(); const idx = chapterRange(curChapter); const pickI = idx.find(i => unlocked(i) && !save.stars[MISSIONS[i].id]); selectMission(pickI != null ? pickI : idx[0], true); }
function selectMission(i, quiet) {
  selMission = i; const m = MISSIONS[i];
  if (m.chapter !== curChapter) { curChapter = m.chapter; buildMissionList(); }
  for (const c of document.querySelectorAll('.mcard')) c.classList.toggle('sel', +c.dataset.i === i);
  $('#mTitle').textContent = m.city[lang()] + ' — ' + m.name[lang()];
  $('#mDesc').textContent = m.desc[lang()];
  $('#mGoal').textContent = T('goalTxt').replace('{n}', m.goal);
  $('#mTime').textContent = fmtTime(m.time);
  $('#mWeather').textContent = T('w_' + m.weather) + (m.water && m.water.rate && m.weather !== 'flood' ? ' + ' + T('w_flood') : '');
  $('#mType').textContent = TYPE_ICON[m.type || 'rescue'] + ' ' + T('t_' + (m.type || 'rescue'));
  { const u = unlockedHelis(); selHeli = save.heli && u.has(save.heli) ? save.heli : m.heli; buildHeliPicker(); }
  const ok = unlocked(i);
  $('#btnGo').disabled = !ok; $('#mLock').textContent = ok ? '' : T('locked');
  globe.target = m.lon; globe.targetLat = m.lat;
  if (!quiet) { const c = document.querySelector(`.mcard[data-i="${i}"]`); c && c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}

/* ---------------- اختيار الطيارة ---------------- */
let selHeli = 'small';
function unlockedHelis() {
  const u = new Set(['small']);
  MISSIONS.forEach(m => { if (save.stars[m.id]) u.add(m.heli); });
  u.add(MISSIONS[selMission].heli); // المقترحة للمهمة دايماً متاحة
  return u;
}
function bars(v, max) { const n = Math.round(v / max * 5); return '▮'.repeat(n) + '▯'.repeat(5 - n); }
function buildHeliPicker() {
  const box = $('#heliPick'); if (!box) return; box.innerHTML = '';
  const u = unlockedHelis(), rec = MISSIONS[selMission].heli;
  for (const k of HELI_ORDER) {
    const ht = HELI_TYPES[k], ok = u.has(k);
    const b = document.createElement('button'); b.className = 'hcard' + (k === selHeli ? ' sel' : '') + (ok ? '' : ' locked');
    const c = document.createElement('canvas'); c.width = 72; c.height = 30; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    const sc = Math.min(2, 70 / ht.w); g.drawImage(SPR[k], (72 - ht.w * sc) / 2, (30 - ht.h * sc) / 2, ht.w * sc, ht.h * sc);
    b.appendChild(c);
    const nm = document.createElement('div'); nm.className = 'hn'; nm.textContent = (ok ? '' : '🔒 ') + T('h_' + k); b.appendChild(nm);
    if (k === rec) { const t = document.createElement('span'); t.className = 'hrec'; t.textContent = T('recommended'); b.appendChild(t); }
    b.title = ok ? '' : T('heliLocked');
    b.onclick = () => { AU.init(); AU.click(); if (!ok) { $('#heliInfo').textContent = T('heliLocked'); return; } selHeli = k; save.heli = k; persist(); buildHeliPicker(); };
    box.appendChild(b);
  }
  const ht = HELI_TYPES[selHeli];
  $('#heliInfo').textContent = `${T('h_' + selHeli)} — ${T('cap')}: ${ht.cap}  ·  ${T('speed')} ${bars(ht.acc, 1.35)}  ·  ${T('ropeLen')} ${bars(ht.segs, 16)}`;
}

/* ---------------- المنصة (ويندوز / أندرويد / آيفون / متصفح) ---------------- */
const CAP = window.Capacitor || null;
const PLATFORM = CAP && CAP.getPlatform ? CAP.getPlatform() : (window.ibra ? 'windows' : 'web');
function openExt(url) {
  if (window.ibra && window.ibra.open) return window.ibra.open(url);
  if (CAP && CAP.isNativePlatform && CAP.isNativePlatform()) { location.href = url; return; } // يفتح بالمتصفح الخارجي
  window.open(url, '_blank');
}
// موبايل: إخفاء شريط الحالة + زر الرجوع بالأندرويد
if (CAP && CAP.Plugins) {
  try { CAP.Plugins.StatusBar && CAP.Plugins.StatusBar.hide(); } catch (e) { }
  try {
    CAP.Plugins.App && CAP.Plugins.App.addListener('backButton', () => {
      if ($('#about').classList.contains('on')) { $('#about').classList.remove('on'); return; }
      if (G) { if (G.state === 'play') { if (paused) toMenu(); else togglePause(); } else toMenu(); return; }
      if ($('#map').classList.contains('on')) { show('title'); return; }
      CAP.Plugins.App.exitApp();
    });
    CAP.Plugins.App && CAP.Plugins.App.addListener('pause', () => { if (G && G.state === 'play' && !paused) togglePause(); });
  } catch (e) { }
}

/* ---------------- فحص التحديثات ---------------- */
const REPO_API = 'https://api.github.com/repos/ibrata2/ibra-rescue/releases/latest';
const UPD = { state: 'checking', latest: null, url: null };
function appVersion() { return (window.ibra && window.ibra.version) || window.APP_VERSION || '0.0.0'; }
function verCmp(a, b) { const pa = a.replace(/^v/, '').split('.').map(Number), pb = b.replace(/^v/, '').split('.').map(Number); for (let i = 0; i < 3; i++) { const d = (pa[i] || 0) - (pb[i] || 0); if (d) return d > 0 ? 1 : -1; } return 0; }
function renderUpdate() {
  const v = appVersion();
  for (const el of document.querySelectorAll('.upd')) {
    el.classList.remove('new', 'ok', 'fail'); el.onclick = null;
    if (UPD.state === 'checking') el.textContent = `v${v} · ${T('upChecking')}`;
    else if (UPD.state === 'latest') { el.classList.add('ok'); el.textContent = `v${v} · ${T('upLatest')}`; }
    else if (UPD.state === 'new') {
      el.classList.add('new'); el.textContent = `${T('upNew')}: v${UPD.latest} — ${T('upDownload')}`;
      el.onclick = () => openExt(UPD.url);
    } else { el.classList.add('fail'); el.textContent = `v${v} · ${T('upFail')}`; }
  }
}
async function checkUpdate() {
  UPD.state = 'checking'; renderUpdate();
  try {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(REPO_API, { headers: { Accept: 'application/vnd.github+json' }, signal: ctl.signal, cache: 'no-store' });
    clearTimeout(to);
    if (!r.ok) throw new Error('http ' + r.status);
    const j = await r.json(); const tag = (j.tag_name || '').replace(/^v/, '');
    if (!tag) throw new Error('no tag');
    UPD.latest = tag;
    const want = PLATFORM === 'android' ? /android\.apk$/i : PLATFORM === 'ios' ? /\.ipa$/i : /setup\.exe$/i;
    const asset = (j.assets || []).find(a => want.test(a.name));
    UPD.url = asset ? asset.browser_download_url : j.html_url;
    UPD.state = verCmp(tag, appVersion()) > 0 ? 'new' : 'latest';
  } catch (e) { UPD.state = 'fail'; }
  renderUpdate();
}

/* ---------------- الكرة الأرضية المنقّطة ---------------- */
const globe = { lon: 20, target: 44, lat0: 22, targetLat: 30, t: 0 };
const LAND = [
  [50, -100, 20, 30], [35, -95, 12, 20], [60, -120, 10, 25], [65, -150, 8, 15], [20, -100, 8, 8], [72, -40, 8, 12], [62, -95, 8, 20],
  [-10, -60, 18, 12], [-30, -63, 15, 8], [5, -70, 6, 8],
  [50, 10, 10, 18], [60, 20, 8, 15], [42, 15, 6, 10], [54, -3, 3, 3], [40, -4, 5, 5],
  [10, 15, 15, 22], [-5, 22, 15, 12], [-25, 25, 10, 10], [25, 10, 8, 25], [15, 40, 6, 6],
  [28, 45, 9, 10], [22, 50, 6, 8], [33, 44, 5, 6], [36, 60, 8, 10],
  [55, 90, 15, 45], [35, 105, 12, 20], [22, 80, 9, 8], [15, 103, 8, 6], [65, 130, 8, 30], [36, 138, 4, 3],
  [-3, 115, 4, 12], [-25, 135, 10, 15], [8, 125, 4, 3]
];
function isLand(lat, lon) {
  for (const [a, b, ra, rb] of LAND) { let dl = lon - b; if (dl > 180) dl -= 360; if (dl < -180) dl += 360; if (((lat - a) / ra) ** 2 + (dl / rb) ** 2 < 1) return true; }
  return false;
}
const GLOBE_DOTS = [];
for (let lat = -84; lat <= 84; lat += 3.2) { const step = 3.2 / Math.max(0.2, Math.cos(lat * Math.PI / 180)); for (let lon = -180; lon < 180; lon += step) GLOBE_DOTS.push([lat, lon, isLand(lat, lon)]); }

function drawGlobe(dt) {
  const c = $('#globe'); if (!c || !$('#map').classList.contains('on')) return;
  const size = Math.round(c.clientWidth * Math.min(2, devicePixelRatio || 1)); if (c.width !== size) { c.width = c.height = size; }
  const g = c.getContext('2d'); const R = size * 0.44, cx = size / 2, cy = size / 2;
  globe.t += dt;
  let dl = globe.target - globe.lon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
  globe.lon += dl * Math.min(1, dt * 2.5); globe.lat0 += (clamp(globe.targetLat, -10, 40) - globe.lat0) * Math.min(1, dt * 2);
  g.clearRect(0, 0, size, size);
  const glow = g.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.15); glow.addColorStop(0, 'rgba(201,168,76,0.06)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = glow; g.fillRect(0, 0, size, size);
  const D = Math.PI / 180, p0 = globe.lat0 * D, l0 = globe.lon * D, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
  const ds = Math.max(1, Math.round(size / 220));
  for (const [lat, lon, land] of GLOBE_DOTS) {
    const p = lat * D, l = lon * D - l0, cosc = sp0 * Math.sin(p) + cp0 * Math.cos(p) * Math.cos(l);
    if (cosc < 0) continue;
    const x = cx + R * Math.cos(p) * Math.sin(l), y = cy - R * (cp0 * Math.sin(p) - sp0 * Math.cos(p) * Math.cos(l));
    g.fillStyle = land ? `rgba(235,225,200,${0.35 + cosc * 0.65})` : `rgba(120,110,95,${0.12 + cosc * 0.15})`;
    g.fillRect(Math.round(x), Math.round(y), land ? ds + 1 : ds, land ? ds + 1 : ds);
  }
  // المدن
  const seen = {};
  MISSIONS.forEach((m, i) => {
    const key = m.lat + ',' + m.lon; const p = m.lat * D, l = m.lon * D - l0, cosc = sp0 * Math.sin(p) + cp0 * Math.cos(p) * Math.cos(l);
    if (cosc < 0.05) return;
    const x = cx + R * Math.cos(p) * Math.sin(l), y = cy - R * (cp0 * Math.sin(p) - sp0 * Math.cos(p) * Math.cos(l));
    const sel = MISSIONS[selMission].lat === m.lat && MISSIONS[selMission].lon === m.lon;
    if (seen[key]) return; seen[key] = 1;
    g.fillStyle = unlocked(i) ? '#c9a84c' : '#666'; g.beginPath(); g.arc(x, y, size * 0.008, 0, 7); g.fill();
    if (sel) {
      const s = size * 0.05 + Math.sin(globe.t * 4) * size * 0.004, k = s * 0.45, lw = Math.max(2, size * 0.005);
      g.fillStyle = '#c8323c';
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.fillRect(x + sx * s - (sx > 0 ? lw : 0), y + sy * s - (sy > 0 ? lw : 0), -sx * k, lw); g.fillRect(x + sx * s - (sx > 0 ? lw : 0), y + sy * s - (sy > 0 ? lw : 0), lw, -sy * k); }
      g.font = `bold ${Math.round(size * 0.04)}px Tahoma, Arial`; g.textAlign = 'center'; g.fillStyle = '#ebe1c8';
      g.fillText(m.city[lang()].toUpperCase(), x, y + s + size * 0.05);
    }
  });
  // نجمة مضيئة مثل الفيديو
  g.fillStyle = 'rgba(235,225,200,0.8)'; const sx = cx + R * 0.75, sy = cy - R * 0.85, sl = size * 0.03 * (0.8 + 0.2 * Math.sin(globe.t * 3));
  g.fillRect(sx - sl, sy, sl * 2, 1.5); g.fillRect(sx, sy - sl, 1.5, sl * 2);
}
(function globeLoop() { let last = performance.now(); function f(n) { const dt = Math.min(0.05, (n - last) / 1000); last = n; drawGlobe(dt); requestAnimationFrame(f); } requestAnimationFrame(f); })();

/* ---------------- بدء / إيقاف / نتيجة ---------------- */
function startMission(i, heliKey) {
  if (!unlocked(i)) return;
  AU.init(); AU.click();
  selMission = i; paused = false; acc = 0;
  if (!heliKey) { const u = unlockedHelis(); heliKey = save.heli && u.has(save.heli) ? save.heli : MISSIONS[i].heli; }
  selHeli = heliKey;
  G = new Game(i, heliKey); window.G = G;
  show(null); $('#pause').classList.remove('on'); $('#result').classList.remove('on');
  $('#howto').textContent = (matchMedia('(pointer:coarse)').matches ? T('touchHint') : T('controls'));
  $('#howto').classList.add('show'); setTimeout(() => $('#howto').classList.remove('show'), 6000);
  updateHUD();
}
function restartMission() { if (G) startMission(G.mi, G.heliKey); }
function togglePause() {
  if (!G || G.state !== 'play') return;
  paused = !paused; $('#pause').classList.toggle('on', paused);
}
function toMenu() { G = null; window.G = null; paused = false; $('#pause').classList.remove('on'); $('#result').classList.remove('on'); buildMissionList(); selectMission(selMission, true); show('map'); }
function showResult(g) {
  const win = g.state === 'win';
  const box = $('#result'); box.classList.add('on'); box.classList.toggle('win', win);
  $('#rTitle').textContent = win ? T('complete') : ({ timeup: T('timeup'), careful: T('carefulFail'), notEnough: T('notEnough'), crashed: T('crashed') }[g.why] || T('failed'));
  $('#rStars').textContent = win ? starStr(g.stars) : '';
  $('#rLine').textContent = win ? '' : (g.why === 'crashed' ? '“' + g.crashLine + '”' : '');
  $('#rStats').innerHTML = `<div><span>${g.type === 'cargo' ? T('delivered') : T('saved')}</span><b>${g.saved} / ${g.goal}</b></div><div><span>${T('falls')}</span><b>${g.falls}</b></div><div><span>${T('timeLeft')}</span><b>${fmtTime(g.timeLeft)}</b></div>`;
  const hasNext = win && g.mi + 1 < MISSIONS.length;
  $('#btnNext').style.display = hasNext ? '' : 'none';
  $('#rAll').textContent = win && g.mi + 1 >= MISSIONS.length ? T('allDone') : '';
}

/* ---------------- ربط الأزرار ---------------- */
$('#btnPlay').onclick = () => { AU.init(); AU.click(); const i = firstUnplayed(); curChapter = MISSIONS[i].chapter; buildMissionList(); selectMission(i, true); show('map'); setTimeout(() => selectMission(i), 50); };
function firstUnplayed() { for (let i = 0; i < MISSIONS.length; i++) if (!save.stars[MISSIONS[i].id]) return unlocked(i) ? i : Math.max(0, i - 1); return 0; }
$('#btnLang').onclick = () => { AU.click(); save.lang = lang() === 'ar' ? 'en' : 'ar'; persist(); applyLang(); };
$('#btnSound').onclick = () => { AU.init(); save.sound = !save.sound; persist(); AU.setSound(save.sound); AU.click(); applyLang(); };
$('#btnBack').onclick = () => { AU.click(); show('title'); };
$('#btnAbout').onclick = () => { AU.init(); AU.click(); $('#about').classList.add('on'); };
$('#btnAboutClose').onclick = () => { AU.click(); $('#about').classList.remove('on'); };
$('#about').onclick = e => { if (e.target.id === 'about') $('#about').classList.remove('on'); };
$('#btnGo').onclick = () => startMission(selMission, selHeli);
$('#btnPause').onclick = () => togglePause();
$('#btnResume').onclick = () => togglePause();
$('#btnRestart').onclick = () => restartMission();
$('#btnMenu').onclick = () => toMenu();
$('#btnRetry').onclick = () => restartMission();
$('#btnNext').onclick = () => startMission(G.mi + 1);
$('#btnMenu2').onclick = () => toMenu();
for (const a of document.querySelectorAll('a[data-ext]')) a.onclick = e => { e.preventDefault(); openExt(a.href); };
addEventListener('keydown', e => {
  if (G) return;
  if ($('#map').classList.contains('on')) {
    if (e.code === 'ArrowDown') { selectMission(Math.min(MISSIONS.length - 1, selMission + 1)); e.preventDefault(); }
    if (e.code === 'ArrowUp') { selectMission(Math.max(0, selMission - 1)); e.preventDefault(); }
    if (e.code === 'Enter') startMission(selMission);
    if (e.code === 'PageDown' || e.code === 'BracketRight') setChapter(curChapter + 1);
    if (e.code === 'PageUp' || e.code === 'BracketLeft') setChapter(curChapter - 1);
    if (e.code === 'Escape') show('title');
  } else if ($('#title').classList.contains('on') && e.code === 'Enter') $('#btnPlay').click();
});

$('#appVer').textContent = appVersion();
$('#chPrev').onclick = () => { AU.click(); setChapter(curChapter - 1); };
$('#chNext').onclick = () => { AU.click(); setChapter(curChapter + 1); };
applyLang();
show('title');
checkUpdate();
