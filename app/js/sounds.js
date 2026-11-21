'use strict';
/* ============================================================
   🔊 الأصوات الحقيقية — IBRA RESCUE
   ------------------------------------------------------------
   حط ملفات mp3 بمجلد app/sounds/ بنفس الأسماء اللي بالجدول.
   الأصوات اللي بيها أكثر من نسخة: سمّيها _1 و _2 و _3 … (مثلاً scream_1.mp3)
   واللعبة تختار وحدة عشوائية كل مرة.
   إذا الملف مو موجود، اللعبة تستخدم الصوت المولّد القديم (ما يصير خطأ).
   ============================================================ */
const SOUND_LIST = {
  // أصوات مستمرة (تتكرر) — loop
  heli:       { loop: true,  vol: 0.55, desc: 'صوت الهليكوبتر العام (لأي طيارة ما إلها صوت خاص)' },
  // صوت خاص لكل طيارة (اختياري) — إذا مو موجود تستخدم heli.mp3 بنبرة مختلفة
  heli_small:   { loop: true, vol: 0.55, desc: 'الطيارة الصغيرة' },
  heli_medic:   { loop: true, vol: 0.55, desc: 'طيارة الإسعاف' },
  heli_police:  { loop: true, vol: 0.55, desc: 'طيارة الشرطة' },
  heli_news:    { loop: true, vol: 0.55, desc: 'طيارة الأخبار' },
  heli_chinook: { loop: true, vol: 0.6,  desc: 'الشينوك (دوّارين — صوت ثقيل)' },
  heli_giant:   { loop: true, vol: 0.65, desc: 'العملاقة (أثقل صوت)' },
  rain:       { loop: true,  vol: 0.45, desc: 'مطر مستمر' },
  wind:       { loop: true,  vol: 0.4,  desc: 'رياح / عاصفة ترابية' },
  tornado:    { loop: true,  vol: 0.6,  desc: 'هدير الإعصار' },
  fire:       { loop: true,  vol: 0.45, desc: 'نار تشتعل' },
  siren:      { loop: true,  vol: 0.25, desc: 'سرينة طيارة الشرطة' },
  water:      { loop: true,  vol: 0.3,  desc: 'ماي / فيضان (موج خفيف)' },
  music_menu: { loop: true,  vol: 0.35, desc: 'موسيقى القائمة' },
  music_game: { loop: true,  vol: 0.18, desc: 'موسيقى خفيفة أثناء اللعب' },
  // أصوات قصيرة — نسخ متعددة _1 _2 _3 …
  scream:     { n: 6, vol: 0.8,  desc: 'صراخ واحد يطيح (آآآآآ)' },
  help:       { n: 6, vol: 0.6,  desc: 'ناس تنادي (هنا! تعال!) — عراقي إذا تگدر' },
  cheer:      { n: 4, vol: 0.7,  desc: 'فرحة / شكر لما يوصل' },
  jump:       { n: 3, vol: 0.6,  desc: 'هوب! لما يقفز على الحبل' },
  ouch:       { n: 4, vol: 0.7,  desc: 'آخ! لما يدگ بالحايط' },
  grandma:    { n: 3, vol: 0.7,  desc: 'صوت جدّة (يمّه بشويش!)' },
  sheep:      { n: 2, vol: 0.7,  desc: 'ماع' },
  cat:        { n: 2, vol: 0.7,  desc: 'مياو' },
  thunder:    { n: 3, vol: 0.9,  desc: 'رعد' },
  explosion:  { n: 3, vol: 1.0,  desc: 'انفجار الطيارة (على الأرض / بناية)' },
  explosion_water: { n: 2, vol: 1.0, desc: 'انفجار الطيارة داخل الماي' },
  collapse:   { n: 3, vol: 0.9,  desc: 'بناية تنهار / حجار تطيح' },
  splash:     { n: 4, vol: 0.7,  desc: 'وگعة بالماي' },
  thud:       { n: 3, vol: 0.7,  desc: 'وگعة على الأرض' },
  slip:       { n: 1, vol: 0.9,  desc: 'واحد يقفز على الحبل ويزلگ منه (شتريد أگلك؟ عاشت إيدك!)' },
  grab:       { n: 4, vol: 0.5,  desc: 'مسك الحبل' },
  land:       { n: 1, vol: 0.7,  desc: 'هبوط الطيارة' },
  rip:        { n: 5, vol: 0.7,  desc: 'تمزيق حبل الغسيل' },
  camera:     { n: 2, vol: 0.5,  desc: 'فلاش كاميرا (طيارة الأخبار)' },
  radio:      { n: 3, vol: 0.4,  desc: 'تشويش راديو قبل كلام البرج' },
  win:        { n: 1, vol: 0.8,  desc: 'فوز بالمهمة' },
  fail:       { n: 1, vol: 0.8,  desc: 'خسارة' },
  click:      { n: 1, vol: 0.5,  desc: 'ضغطة زر' },
};

const SND = {
  ready: {}, loops: {}, ctx: null, web: location.protocol !== 'file:', started: false,
  has(name) { return !!(this.ready[name] && this.ready[name].length); },
  init(ctx) {
    if (this.started) return; this.started = true; this.ctx = ctx;
    const have = Array.isArray(window.SOUND_MANIFEST) ? new Set(window.SOUND_MANIFEST.map(f => f.toLowerCase())) : null;
    for (const [name, cfg] of Object.entries(SOUND_LIST)) {
      const files = cfg.loop || cfg.n === 1 ? [name] : Array.from({ length: cfg.n }, (_, i) => `${name}_${i + 1}`);
      for (const f of files) if (!have || have.has(f + '.mp3')) this.load(name, `sounds/${f}.mp3`);
    }
  },
  load(name, src) {
    const ok = item => { (this.ready[name] = this.ready[name] || []).push(item); };
    if (this.web && this.ctx) { // موبايل/ويب: WebAudio (أدق وأسرع)
      fetch(src).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(b => new Promise((res, rej) => this.ctx.decodeAudioData(b, res, rej)))
        .then(buf => ok({ buf })).catch(() => { });
    } else { // ويندوز (ملفات محلية): عنصر صوت عادي
      const a = new Audio(); a.preload = 'auto';
      a.addEventListener('canplaythrough', () => { if (!a._ok) { a._ok = 1; ok({ el: a }); } }, { once: true });
      a.addEventListener('error', () => { }, { once: true });
      a.src = src;
    }
  },
  play(name, vol = 1, rate = 1) {
    if (!save.sound || !this.has(name)) return false;
    const it = pick(this.ready[name]), v = (SOUND_LIST[name].vol || 1) * vol;
    try {
      if (it.buf) {
        const s = this.ctx.createBufferSource(), g = this.ctx.createGain(); s.buffer = it.buf; s.playbackRate.value = rate; g.gain.value = v;
        s.connect(g); g.connect(AU.master); s.start();
      } else { const a = it.el.cloneNode(); a.volume = clamp(v, 0, 1); a.playbackRate = rate; a.play().catch(() => { }); }
    } catch (e) { return false; }
    return true;
  },
  // صوت مستمر: يشغّل/يوقف ويغيّر العلو
  loop(name, level, rate = 1) {
    if (!this.has(name)) return false;
    let L = this.loops[name];
    const target = save.sound ? clamp(level * (SOUND_LIST[name].vol || 1), 0, 1) : 0;
    if (!L) {
      if (target <= 0.001) return true;
      const it = this.ready[name][0];
      if (it.buf) { const s = this.ctx.createBufferSource(), g = this.ctx.createGain(); s.buffer = it.buf; s.loop = true; g.gain.value = 0; s.connect(g); g.connect(AU.master); s.start(); L = { s, g }; }
      else { const a = it.el.cloneNode(); a.loop = true; a.volume = 0; a.play().catch(() => { }); L = { a }; }
      this.loops[name] = L;
    }
    if (L.g) { L.g.gain.setTargetAtTime(target, this.ctx.currentTime, 0.12); L.s.playbackRate.setTargetAtTime(rate, this.ctx.currentTime, 0.2); }
    else { L.a.volume = lerp(L.a.volume, target, 0.15); L.a.playbackRate = rate; }
    return true;
  },
  stopLoops() { for (const n in this.loops) this.loop(n, 0); },
};
