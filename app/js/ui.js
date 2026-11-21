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
  $('#btnTS').textContent = T('textSize') + ': ' + T('ts_' + (save.ts || (isTouch() ? 'l' : 'm')));
  document.documentElement.style.setProperty('--ts', textScale());
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
  $('#chName').textContent = `${T('chapter')} ${curChapter} / ${CHAPTERS} · ${first.chapter === 1 ? T('beginnings') : first.chapter === 21 ? T('ch21') : first.city[lang()]}`;
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
  if (typeof wmSelect === 'function') wmSelect(i);
  if (!quiet) { const c = document.querySelector(`.mcard[data-i="${i}"]`); c && c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}

/* ---------------- اختيار الطيارة ---------------- */
let selHeli = 'small';
function unlockedHelis() {
  const u = new Set(['small']);
  MISSIONS.forEach(m => { if (save.stars[m.id]) u.add(m.heli); });
  if (typeof goldenUnlocked === 'function' && goldenUnlocked()) u.add('golden');
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
      if ($('#storyOv').classList.contains('on')) { $('#storyOv').classList.remove('on', 'playing'); return; }
      if (G) { if (G.state === 'play') { if (paused) toMenu(); else togglePause(); } else toMenu(); return; }
      if ($('#map').classList.contains('on')) { show('title'); return; }
      CAP.Plugins.App.exitApp();
    });
    CAP.Plugins.App && CAP.Plugins.App.addListener('pause', () => { if (G && G.state === 'play' && !paused) togglePause(); });
  } catch (e) { }
}

/* ---------------- فحص التحديثات ---------------- */
const REPO_API = 'https://api.github.com/repos/ibrata2/ibra-rescue/releases/latest';
const UPD = { state: 'checking', latest: null, url: null, assets: {}, p: 0 };
function appVersion() { return (window.ibra && window.ibra.version) || window.APP_VERSION || '0.0.0'; }
function verCmp(a, b) { const pa = a.replace(/^v/, '').split('.').map(Number), pb = b.replace(/^v/, '').split('.').map(Number); for (let i = 0; i < 3; i++) { const d = (pa[i] || 0) - (pb[i] || 0); if (d) return d > 0 ? 1 : -1; } return 0; }
function renderUpdate() {
  const v = appVersion();
  for (const el of document.querySelectorAll('.upd')) {
    el.classList.remove('new', 'ok', 'fail'); el.onclick = null;
    if (UPD.state === 'checking') el.textContent = `v${v} · ${T('upChecking')}`;
    else if (UPD.state === 'latest') { el.classList.add('ok'); el.textContent = `v${v} · ${T('upLatest')}`; }
    else if (UPD.state === 'new') {
      el.classList.add('new'); el.textContent = `${T('upNew')}: v${UPD.latest} — ${T(canSelfUpdate() ? 'upInstall' : 'upDownload')}`;
      el.onclick = startUpdate;
    }
    else if (UPD.state === 'downloading') { el.classList.add('new', 'busy'); el.textContent = `${T('upDownloading')} v${UPD.latest}… ${UPD.p >= 0 ? Math.round(UPD.p * 100) + '%' : ''}`; el.style.setProperty('--p', Math.max(0, UPD.p)); }
    else if (UPD.state === 'installing') { el.classList.add('new', 'busy'); el.textContent = T('upInstalling'); el.style.setProperty('--p', 1); }
    else if (UPD.state === 'allow') { el.classList.add('new'); el.textContent = T('upAllow'); el.onclick = startUpdate; }
    else if (UPD.state === 'error') { el.classList.add('new'); el.textContent = T('upErr'); el.onclick = startUpdate; } else { el.classList.add('fail'); el.textContent = `v${v} · ${T('upFail')}`; }
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
    for (const a of j.assets || []) {
      if (/setup\.exe$/i.test(a.name)) UPD.assets.setup = a.browser_download_url;
      else if (/portable\.exe$/i.test(a.name)) UPD.assets.portable = a.browser_download_url;
      else if (/android\.apk$/i.test(a.name)) UPD.assets.apk = a.browser_download_url;
    }
    UPD.state = verCmp(tag, appVersion()) > 0 ? 'new' : 'latest';
  } catch (e) { UPD.state = 'fail'; }
  renderUpdate();
}

/* التحديث الداخلي: ويندوز وأندرويد ينزّل ويثبّت من داخل اللعبة، الآيفون يفتح الرابط (يحتاج توقيع) */
function updPlugin() { return CAP && CAP.isNativePlatform && CAP.isNativePlatform() && PLATFORM === 'android' ? (CAP.registerPlugin ? CAP.registerPlugin('IbraUpdate') : CAP.Plugins.IbraUpdate) : null; }
function canSelfUpdate() { return (window.ibra && window.ibra.update && UPD.assets.setup) || (PLATFORM === 'android' && UPD.assets.apk && updPlugin()); }
let updListen = false;
async function startUpdate() {
  if (UPD.state === 'downloading' || UPD.state === 'installing') return;
  if (!canSelfUpdate()) return openExt(UPD.url);
  const prog = p => { UPD.p = p; UPD.state = p >= 1 ? 'installing' : 'downloading'; renderUpdate(); };
  UPD.state = 'downloading'; UPD.p = 0; renderUpdate();
  try {
    if (window.ibra && window.ibra.update) {
      if (!updListen) { window.ibra.onUpdateProgress(prog); updListen = true; }
      await window.ibra.update({ setup: UPD.assets.setup, portable: UPD.assets.portable || UPD.assets.setup });
      UPD.state = 'installing'; renderUpdate();
    } else {
      const pl = updPlugin();
      if (!updListen) { try { await pl.addListener('progress', d => prog(d.p)); } catch (e) { } updListen = true; }
      const r = await pl.install({ url: UPD.assets.apk });
      if (r && r.needPermission) { UPD.state = 'allow'; renderUpdate(); return; }
      UPD.state = 'new'; renderUpdate(); // شاشة التثبيت انفتحت؛ إذا رجع يكدر يعيد
    }
  } catch (e) { console.warn('update', e); UPD.state = 'error'; renderUpdate(); }
}

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
function restartMission() { if (!G) return; if (G.storyRef) startStoryGame(G.m, G.storyRef, G.heliKey); else startMission(G.mi, G.heliKey); }
// مهمة من نمط القصة
function startStoryGame(m, ref, heliKey) {
  AU.init(); AU.click(); paused = false; acc = 0;
  heliKey = heliKey || m.heli; selHeli = heliKey;
  G = new Game(m, heliKey); G.storyRef = ref; window.G = G;
  show(null); $('#pause').classList.remove('on'); $('#result').classList.remove('on');
  $('#howto').textContent = (matchMedia('(pointer:coarse)').matches ? T('touchHint') : T('controls'));
  $('#howto').classList.add('show'); setTimeout(() => $('#howto').classList.remove('show'), 6000);
  updateHUD();
}
function togglePause() {
  if (!G || G.state !== 'play') return;
  paused = !paused; $('#pause').classList.toggle('on', paused);
}
function toMenu() { if (G && G.storyRef) { G = null; window.G = null; paused = false; $('#pause').classList.remove('on'); $('#result').classList.remove('on'); show('title'); stOpenMenu(); return; } G = null; window.G = null; paused = false; $('#pause').classList.remove('on'); $('#result').classList.remove('on'); buildMissionList(); selectMission(selMission, true); show('map'); }
function showResult(g) {
  const win = g.state === 'win';
  const box = $('#result'); box.classList.add('on'); box.classList.toggle('win', win);
  $('#rTitle').textContent = win ? T('complete') : ({ timeup: T('timeup'), careful: T('carefulFail'), notEnough: T('notEnough'), crashed: T('crashed') }[g.why] || T('failed'));
  $('#rStars').textContent = win ? starStr(g.stars) : '';
  $('#rLine').textContent = win ? '' : (g.why === 'crashed' ? '“' + g.crashLine + '”' : '');
  $('#rStats').innerHTML = `<div><span>${g.type === 'cargo' ? T('delivered') : T('saved')}</span><b>${g.saved} / ${g.goal}</b></div><div><span>${T('falls')}</span><b>${g.falls}</b></div><div><span>${T('timeLeft')}</span><b>${fmtTime(g.timeLeft)}</b></div>`;
  if (g.storyRef) { $('#btnNext').style.display = win ? '' : 'none'; $('#btnNext').textContent = stT('cont'); $('#rAll').textContent = ''; return; }
  $('#btnNext').textContent = T('next');
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
$('#btnTS').onclick = () => { AU.click(); const cur = save.ts || (isTouch() ? 'l' : 'm'); save.ts = TS_STEPS[(TS_STEPS.indexOf(cur) + 1) % TS_STEPS.length]; persist(); applyLang(); };
$('#btnStory').onclick = () => { AU.init(); AU.click(); stOpenMenu(); };
$('#storyClose').onclick = () => { AU.click(); $('#storyOv').classList.remove('on', 'playing'); };
$('#stNextBtn').onclick = e => { e.stopPropagation(); AU.click(); stAdvance(); };
$('#stSkip').onclick = e => { e.stopPropagation(); AU.click(); if (ST.panel && ST.panel.startBtn) { stFinish(); return; } const q = ST.queue, k = q.findIndex((p, i) => i > ST.idx && p.startBtn); if (k > 0) { ST.idx = k; stShowPanel(); } else stFinish(); };
$('#stFrame').onclick = () => stAdvance();
addEventListener('keydown', e => { if (!$('#storyOv').classList.contains('playing')) return; if (['Space', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.code)) { e.preventDefault(); stAdvance(); } if (e.code === 'Escape') $('#stSkip').click(); });
$('#newsClose').onclick = () => { AU.click(); $('#newsOv').classList.remove('on'); save.seenVer = appVersion(); persist(); };
$('#btnGo').onclick = () => startMission(selMission, selHeli);
$('#btnPause').onclick = () => togglePause();
$('#btnResume').onclick = () => togglePause();
$('#btnRestart').onclick = () => restartMission();
$('#btnMenu').onclick = () => toMenu();
$('#btnRetry').onclick = () => restartMission();
$('#btnNext').onclick = () => { if (G && G.storyRef) { const ref = G.storyRef; G = null; window.G = null; $('#result').classList.remove('on'); show('title'); stAfterWin(ref); return; } const ni = G.mi + 1; if (typeof wmNodeOf === 'function' && wmNodeOf(ni) !== wmNodeOf(G.mi)) { toMenu(); selectMission(ni); return; } startMission(ni); };
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

/* ---------------- ما الجديد (مرة وحدة بعد كل تحديث) ---------------- */
function showNews(force) {
  if (typeof WHATS_NEW === 'undefined') return;
  if (!force && (save.seenVer === appVersion() || G)) return;
  if (!force && !save.seenVer && !Object.keys(save.stars).length) { save.seenVer = appVersion(); persist(); return; } // لاعب جديد
  $('#newsVer').textContent = 'v' + appVersion();
  $('#newsList').innerHTML = WHATS_NEW[lang()].map(t => `<li>${t.replace(/</g, '&lt;')}</li>`).join('');
  $('#newsOv').classList.add('on');
}
/* ---------------- رسم تجريبي لنمط القصة (قلم يرسم مشهد) ---------------- */
let sketchRAF = 0;
function sketchStart() {
  const c = $('#sketch'), g = c.getContext('2d'); cancelAnimationFrame(sketchRAF);
  const strokes = [];
  const line = (pts) => strokes.push(pts);
  // الأرض والبنايات
  line([[10, 260], [550, 260]]);
  line([[40, 260], [40, 170], [110, 170], [110, 260]]); line([[60, 190], [75, 190]]); line([[85, 210], [100, 210]]);
  line([[130, 260], [130, 120], [138, 110], [146, 120], [146, 260]]); line([[127, 160], [149, 160]]);
  line([[170, 260], [170, 200], [250, 200], [250, 260]]); line([[180, 200], [200, 180], [220, 180], [240, 200]]);
  line([[430, 260], [430, 150], [520, 150], [520, 260]]); line([[445, 170], [465, 170]]); line([[480, 190], [500, 190]]);
  // الطيارة
  line([[260, 70], [340, 70], [350, 85], [330, 100], [270, 100], [255, 85], [260, 70]]); line([[300, 70], [300, 58]]); line([[230, 56], [370, 56]]);
  line([[255, 85], [200, 80], [195, 70]]); line([[275, 108], [335, 108]]); line([[285, 100], [285, 108]]); line([[325, 100], [325, 108]]);
  // الحبل والناس
  line([[300, 108], [302, 140], [298, 175], [300, 205]]);
  for (let i = 0; i < 3; i++) { const y = 140 + i * 30; line([[296, y], [304, y]]); line([[300, y], [300, y + 14]]); line([[300, y + 14], [295, y + 22]]); line([[300, y + 14], [305, y + 22]]); }
  // فقاعة كلام
  line([[350, 120], [470, 120], [470, 150], [380, 150], [370, 162], [372, 150], [350, 150], [350, 120]]);
  let si = 0, pi = 1, t = 0;
  g.fillStyle = '#efe7d4'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#2a2520'; g.lineWidth = 2.2; g.lineCap = 'round'; g.lineJoin = 'round';
  const step = () => {
    if (!$('#storyOv').classList.contains('on')) return;
    for (let k = 0; k < 3 && si < strokes.length; k++) {
      const st = strokes[si], [x0, y0] = st[pi - 1], [x1, y1] = st[pi];
      g.beginPath(); g.moveTo(x0 + Math.random() - 0.5, y0 + Math.random() - 0.5); g.lineTo(x1 + Math.random() - 0.5, y1 + Math.random() - 0.5); g.stroke();
      pi++; if (pi >= st.length) { si++; pi = 1; }
    }
    if (si >= strokes.length) {
      g.font = 'bold 15px Tahoma'; g.fillStyle = '#2a2520'; g.textAlign = 'center'; g.fillText(lang() === 'ar' ? 'أول يوم بالشغل!' : 'First day!', 410, 140);
      t++; if (t > 160) { t = 0; si = 0; pi = 1; g.fillStyle = '#efe7d4'; g.fillRect(0, 0, c.width, c.height); }
    }
    // القلم
    sketchRAF = requestAnimationFrame(step);
  };
  step();
}
setTimeout(() => showNews(false), 900);

$('#appVer').textContent = appVersion();
$('#chPrev').onclick = () => { AU.click(); setChapter(curChapter - 1); };
$('#chNext').onclick = () => { AU.click(); setChapter(curChapter + 1); };
applyLang();
show('title');
checkUpdate();
