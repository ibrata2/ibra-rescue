'use strict';
/* ============================================================
   📋 المهمات — IBRA RESCUE
   ------------------------------------------------------------
   حتى تضيف مهمة جديدة: انسخ أي مهمة من الجدول وغيّر قيمها،
   وحطها بالمكان اللي تريده بالقائمة. اللعبة تقراها تلقائياً
   (تطلع بالكرة الأرضية وبقائمة المهمات وتنفتح بعد اللي قبلها).

   الحقول:
   id       : اسم فريد بالإنكليزي (يُستخدم لحفظ النجوم)
   style    : شكل المدينة → baghdad | tokyo | marsh | rotterdam | dubai | cairo | mountain | mumbai
   pal      : الألوان → night (ليل) | day (نهار) | dusk (غروب)
   heli     : small (5) | medic إسعاف (4، أهدأ) | police شرطة (3، أسرع) | news أخبار (4)
              | chinook شينوك (8، حبل أطول) | giant العملاق (10، أطول حبل، أثقل)
   type     : rescue إنقاذ | cargo صناديق | vip شخص مهم | animals حيوانات | careful جدّات (ممنوع يطيح أحد) | fire حريق
   cargo    : (لمهمات الصناديق) medicine | flour | melon (البطيخ يتفلّش إذا طاح)
   vipName  : (لمهمات الشخص المهم) { ar: 'العريس', en: 'the groom' }
   fire     : (لمهمات الحريق) عدد الحرائق
   careful  : true ← إذا طاح أحد تفشل المهمة
   goal     : كم شخص لازم يوصل حتى تنجح
   people   : كم شخص موجود بالمرحلة (خليه أكثر من goal)
   time     : الوقت بالثواني
   worldW   : طول المرحلة (1100 قصيرة — 2300 طويلة)
   lat/lon  : مكان المدينة على الكرة الأرضية
   city/name/desc : النصوص عربي وإنكليزي
   weather  : clear | rain | storm (مطر+برق) | wind | sand | tornado | flood
   zones    : pad (مهبط فوگ بناية) | boat (قوارب على الماي — تحتاج water)
   water    : { y: مستوى البداية, to: أعلى مستوى يوصله, rate: سرعة الصعود } (اختياري)
   wind     : { base: اتجاه ثابت, gust: قوة الهبّات } (اختياري)
   lines    : (اختياري) تعليقات خاصة بهاي المهمة تنضاف للتعليقات العامة، مثلاً:
              lines: { wait: { ar: ['...'], en: ['...'] } }
   ============================================================ */

const MISSIONS = [
  {
    id: 'bgd1', style: 'baghdad', pal: 'day', heli: 'small', goal: 3, people: 4, time: 150, worldW: 1150,
    lat: 33.3, lon: 44.4,
    city: { ar: 'بغداد', en: 'Baghdad' }, name: { ar: 'اليوم الأول', en: 'First Day' },
    desc: { ar: 'أول يوم إلك بالشغل. نزّل 3 أشخاص على مهبط المستشفى… وحاول لا تضرب المنارة.', en: 'Your first day on the job. Drop 3 people on the hospital helipad… and try not to hit the minaret.' },
    weather: 'clear', zones: 'pad',
    lines: {
      wait: { ar: ['عمي جيبلي سمچ مسگوف وياك!', 'خلّصني گبل لا يجي الحر!', 'الشاي برد وآني هنا!'], en: ['Bring me some masgouf!', 'Hurry before the heat comes!', 'My tea is getting cold!'] },
      saved: { ar: ['تسلم إيدك يا بطل!', 'هسه أروح للمتنبي'], en: ['Bless your hands, hero!', 'Off to Mutanabbi street now'] }
    }
  },
  {
    id: 'bgd2', style: 'baghdad', pal: 'night', heli: 'small', goal: 6, people: 8, time: 210, worldW: 1500,
    lat: 33.3, lon: 44.4,
    city: { ar: 'بغداد', en: 'Baghdad' }, name: { ar: 'دجلة فاض', en: 'Tigris Flood' },
    desc: { ar: 'دجلة فاض بالليل والماي دا يصعد. الناس فوگ السطوح، وصّلهم للقوارب قبل ما يغرگ كلشي.', en: 'The Tigris flooded at night and the water keeps rising. Get the people off the roofs and onto the boats.' },
    weather: 'flood', zones: 'boat', water: { y: 262, to: 222, rate: 0.22 }
  },
  {
    id: 'marsh', style: 'marsh', pal: 'dusk', heli: 'small', goal: 6, people: 8, time: 210, worldW: 1600,
    lat: 31.0, lon: 47.0,
    city: { ar: 'الأهوار', en: 'Iraqi Marshes' }, name: { ar: 'المضيف', en: 'The Mudhif' },
    desc: { ar: 'رياح قوية بالأهوار. الصيادين عالقين فوگ المضايف. الهوا يدفع الطيارة، انتبه للحبل!', en: 'Strong winds over the marshes. Fishermen are stuck on the reed houses. The wind pushes the heli — watch the rope!' },
    weather: 'wind', zones: 'boat', water: { y: 258, to: 258, rate: 0 }, wind: { base: -10, gust: 26 }
  },
  {
    id: 'tky1', style: 'tokyo', pal: 'night', heli: 'small', goal: 6, people: 7, time: 200, worldW: 1600,
    lat: 35.7, lon: 139.7,
    city: { ar: 'طوكيو', en: 'Tokyo' }, name: { ar: 'ليلة هادئة', en: 'Quiet Night' },
    desc: { ar: 'ليلة هادئة بطوكيو… لحد ما وصلت إنت. انتبه للباگودا والأعمدة.', en: 'A quiet night in Tokyo… until you showed up. Mind the pagoda and the poles.' },
    weather: 'clear', zones: 'pad',
    lines: { wait: { ar: ['سوميماسين! هنا!', 'آني نينجا بس ما أعرف أطير!'], en: ['Sumimasen! Over here!', 'I\'m a ninja but I can\'t fly!'] } }
  },
  {
    id: 'tky2', style: 'tokyo', pal: 'night', heli: 'small', goal: 8, people: 10, time: 240, worldW: 1900,
    lat: 35.7, lon: 139.7,
    city: { ar: 'طوكيو', en: 'Tokyo' }, name: { ar: 'العاصفة', en: 'The Storm' },
    desc: { ar: 'مطر وبرق ورياح، والماي دا يصعد بالشوارع. 8 أشخاص لازم يوصلون القوارب.', en: 'Rain, lightning, wind — and the streets are flooding. Get 8 people to the boats.' },
    weather: 'storm', zones: 'boat', water: { y: 275, to: 238, rate: 0.16 }, wind: { base: 6, gust: 22 }
  },
  {
    id: 'rtm', style: 'rotterdam', pal: 'night', heli: 'chinook', goal: 10, people: 12, time: 260, worldW: 2100,
    lat: 51.9, lon: 4.5,
    city: { ar: 'روتردام', en: 'Rotterdam' }, name: { ar: 'الميناء', en: 'The Harbour' },
    desc: { ar: 'جبتلك شينوك! حبل أطول ويشيل 8. عمال الميناء فوگ الحاويات والرافعات. وصّلهم للسفينة.', en: 'You got a Chinook! Longer rope, carries 8. Dock workers are stuck on containers and cranes. Get them to the ship.' },
    weather: 'rain', zones: 'boat', water: { y: 264, to: 264, rate: 0 }, wind: { base: 4, gust: 10 }
  },
  {
    id: 'dxb', style: 'dubai', pal: 'dusk', heli: 'small', goal: 8, people: 10, time: 240, worldW: 1900,
    lat: 25.2, lon: 55.3,
    city: { ar: 'دبي', en: 'Dubai' }, name: { ar: 'العاصفة الترابية', en: 'Sandstorm' },
    desc: { ar: 'عاصفة ترابية والرؤية قليلة. الناس فوگ الأبراج العالية. المهبط فوگ برج المستشفى.', en: 'A sandstorm and low visibility. People are stuck on tall towers. The helipad is on the hospital tower.' },
    weather: 'sand', zones: 'pad', wind: { base: 12, gust: 30 },
    lines: { wait: { ar: ['ما أشوف شي غير تراب!', 'عيوني صارت رملية!'], en: ['All I see is sand!', 'My eyes are full of sand!'] } }
  },
  {
    id: 'cai', style: 'cairo', pal: 'day', heli: 'small', goal: 8, people: 10, time: 240, worldW: 1900,
    lat: 30.0, lon: 31.2,
    city: { ar: 'القاهرة', en: 'Cairo' }, name: { ar: 'النيل', en: 'The Nile' },
    desc: { ar: 'النيل طاف على البيوت. وصّل الناس للفلوكات… والأهرامات بالخلف بس للزينة، لا تروحلها.', en: 'The Nile flooded the houses. Get people onto the feluccas… the pyramids are just scenery, don\'t go there.' },
    weather: 'flood', zones: 'boat', water: { y: 270, to: 236, rate: 0.14 }
  },
  {
    id: 'mtn', style: 'mountain', pal: 'night', heli: 'small', goal: 6, people: 8, time: 240, worldW: 1900,
    lat: 46.5, lon: 8.0,
    city: { ar: 'الجبال', en: 'The Alps' }, name: { ar: 'الإعصار', en: 'The Twister' },
    desc: { ar: 'متسلقين عالقين فوگ الجبال، وإعصار يتمشى بالوادي. لا تقرب منه… الطيارة تدوخ.', en: 'Climbers are stuck on the peaks and a twister roams the valley. Keep away… the heli gets dizzy.' },
    weather: 'tornado', zones: 'pad', wind: { base: 0, gust: 14 }
  },
  {
    id: 'bom', style: 'mumbai', pal: 'night', heli: 'chinook', goal: 12, people: 15, time: 300, worldW: 2300,
    lat: 19.1, lon: 72.9,
    city: { ar: 'مومباي', en: 'Mumbai' }, name: { ar: 'موسم الأمطار', en: 'Monsoon' },
    desc: { ar: 'المهمة الأخيرة. فيضان كبير ومطر ما يوقف. 12 شخص، والماي يصعد بسرعة. ورّينا شطارتك!', en: 'The final mission. A massive flood and endless rain. 12 people and the water rises fast. Show us what you\'ve got!' },
    weather: 'storm', zones: 'boat', water: { y: 266, to: 206, rate: 0.24 }, wind: { base: -4, gust: 16 }
  },
];

/* ============================================================
   🏭 مولّد المهمات: الفصل 1 = المهمات العشر فوگ (مصنوعة باليد)
   الفصول 2 → 20 تتولّد تلقائياً (190 مهمة) بنفس النتيجة كل مرة.
   حتى تضيف مدينة جديدة: ضيفها لـ CHAPTER_CITIES.
   حتى تغيّر الصعوبة: عدّل genMission.
   ============================================================ */
const CHAPTER_CITIES = [
  { style: 'baghdad',   ar: 'الموصل',          en: 'Mosul',            lat: 36.3, lon: 43.1 },
  { style: 'tokyo',     ar: 'كيوتو',           en: 'Kyoto',            lat: 35.0, lon: 135.8 },
  { style: 'marsh',     ar: 'البصرة',          en: 'Basra',            lat: 30.5, lon: 47.8 },
  { style: 'dubai',     ar: 'أبوظبي',          en: 'Abu Dhabi',        lat: 24.5, lon: 54.4 },
  { style: 'rotterdam', ar: 'أمستردام',        en: 'Amsterdam',        lat: 52.4, lon: 4.9 },
  { style: 'cairo',     ar: 'الإسكندرية',      en: 'Alexandria',       lat: 31.2, lon: 29.9 },
  { style: 'mountain',  ar: 'جبال كردستان',     en: 'Kurdistan Mountains', lat: 36.6, lon: 44.5 },
  { style: 'mumbai',    ar: 'كولكاتا',          en: 'Kolkata',          lat: 22.6, lon: 88.4 },
  { style: 'baghdad',   ar: 'كربلاء',           en: 'Karbala',          lat: 32.6, lon: 44.0 },
  { style: 'tokyo',     ar: 'أوساكا',           en: 'Osaka',            lat: 34.7, lon: 135.5 },
  { style: 'dubai',     ar: 'نيويورك',          en: 'New York',         lat: 40.7, lon: -74.0 },
  { style: 'rotterdam', ar: 'هامبورغ',          en: 'Hamburg',          lat: 53.5, lon: 10.0 },
  { style: 'cairo',     ar: 'الأقصر',           en: 'Luxor',            lat: 25.7, lon: 32.6 },
  { style: 'mumbai',    ar: 'بانكوك',           en: 'Bangkok',          lat: 13.7, lon: 100.5 },
  { style: 'mountain',  ar: 'الهيمالايا',        en: 'Himalayas',        lat: 28.0, lon: 84.0 },
  { style: 'marsh',     ar: 'الجبايش',          en: 'Chibayish',        lat: 31.0, lon: 47.0 },
  { style: 'dubai',     ar: 'شنغهاي',           en: 'Shanghai',         lat: 31.2, lon: 121.5 },
  { style: 'mumbai',    ar: 'ريو دي جانيرو',     en: 'Rio de Janeiro',   lat: -22.9, lon: -43.2 },
  { style: 'baghdad',   ar: 'بغداد — الكرادة',   en: 'Baghdad — Karrada', lat: 33.31, lon: 44.42 },
];

const TYPE_NAMES = {
  rescue:  { ar: ['سطوح محاصرة', 'نداء استغاثة', 'الحي القديم', 'آخر الليل', 'الكل فوگ السطح', 'زحمة إنقاذ', 'شارع الماي', 'صيحات من بعيد'], en: ['Trapped Rooftops', 'Distress Call', 'Old Quarter', 'Late Night', 'Everyone on the Roof', 'Rescue Rush', 'Water Street', 'Distant Cries'] },
  cargo:   { ar: ['نقل الدوا', 'صناديق الطحين', 'بطيخ عاجل!', 'مؤن للمستشفى', 'توصيل سريع'], en: ['Medicine Run', 'Flour Crates', 'Urgent Watermelons!', 'Hospital Supplies', 'Express Delivery'] },
  vip:     { ar: ['إنقاذ العريس', 'العمدة عالق', 'نجم السوشيال', 'المطرب المشهور', 'بطل كمال الأجسام'], en: ['Save the Groom', 'Mayor Stuck', 'Influencer Down', 'Famous Singer', 'The Bodybuilder'] },
  animals: { ar: ['خرفان على السطح', 'بزازين الحارة', 'مزرعة طايرة', 'قطيع ضايع'], en: ['Sheep on the Roof', 'Alley Cats', 'Flying Farm', 'Lost Flock'] },
  careful: { ar: ['الجدّات أولاً', 'بيت المسنّين', 'بشويش ابني'], en: ['Grandmas First', 'Retirement Home', 'Easy, Dear'] },
  fire:    { ar: ['حريق بالعمارة', 'دخان أسود', 'النار تقترب'], en: ['Building Fire', 'Black Smoke', 'Fire Closing In'] },
};
const VIP_NAMES = [
  { ar: 'العريس', en: 'the groom' }, { ar: 'العمدة', en: 'the mayor' }, { ar: 'نجم السوشيال', en: 'the influencer' },
  { ar: 'المطرب المشهور', en: 'the famous singer' }, { ar: 'بطل كمال الأجسام', en: 'the bodybuilder' }
];
const CARGO_NAMES = { medicine: { ar: 'دوا', en: 'medicine' }, flour: { ar: 'طحين', en: 'flour' }, melon: { ar: 'بطيخ', en: 'watermelons' } };

function genMission(ch, slot) {
  const city = CHAPTER_CITIES[(ch - 2) % CHAPTER_CITIES.length];
  const rng = mulberry(hashStr('ch' + ch + 's' + slot) + 99);
  const ri = (a, b) => a + Math.floor(rng() * (b - a + 1));
  const pickR = arr => arr[Math.floor(rng() * arr.length)];
  const d = ((ch - 2) * 10 + slot) / 189;           // 0 → 1 صعوبة
  const boss = slot === 9;
  // نوع المهمة حسب الترتيب داخل الفصل
  const pattern = ['rescue', 'cargo', 'rescue', 'animals', 'vip', 'rescue', 'fire', 'careful', 'cargo', 'rescue'];
  let type = pattern[(slot + ch) % 10];
  if (boss) type = pickR(['rescue', 'vip', 'fire']);
  const st = city.style;
  if (type === 'fire' && st === 'marsh') type = 'rescue';
  // ماي؟
  const mustWater = st === 'marsh' || st === 'rotterdam';
  const noWater = st === 'mountain' || st === 'dubai';
  const flood = mustWater || (!noWater && type !== 'fire' && rng() < 0.45);
  const zones = flood ? 'boat' : 'pad';
  // الطيارة
  let heli = pickR(['small', 'small', 'medic', 'police', 'news']);
  if (type === 'careful' || type === 'vip') heli = rng() < 0.6 ? 'medic' : 'small';
  if (type === 'cargo') heli = rng() < 0.5 ? 'police' : 'news';
  let goal = 4 + Math.round(d * 7) + ri(0, 2);
  if (type === 'careful') goal = Math.max(3, goal - 2);
  if (boss) goal += 3;
  if (goal >= 9 && rng() < 0.65) heli = ch >= 10 && rng() < 0.5 ? 'giant' : 'chinook';
  if (boss && ch >= 12) heli = 'giant';
  // الطقس
  let weathers = ['clear', 'rain', 'wind', 'storm'];
  if (st === 'dubai' || st === 'cairo') weathers.push('sand', 'sand');
  if (st === 'mountain') weathers = ['tornado', 'tornado', 'wind', 'storm'];
  let weather = d < 0.08 ? 'clear' : pickR(weathers);
  if (flood && !mustWater && weather === 'clear') weather = 'flood';
  if (type === 'animals') goal = Math.max(3, Math.round(goal * 0.6));
  const people = type === 'animals' ? goal * 2 + 2 : goal + (type === 'careful' ? 1 : 2) + (d < 0.4 ? 1 : 0);
  const time = Math.round(Math.max(150, Math.min(380, 130 + goal * 19 - d * 30)) / 5) * 5;
  const worldW = Math.min(2600, 1150 + people * 75 + ri(0, 150));
  const pal = weather === 'sand' ? 'dusk' : pickR(['night', 'night', 'day', 'dusk']);
  const m = {
    id: 'c' + String(ch).padStart(2, '0') + 'm' + slot, chapter: ch, type, style: st, pal, heli, goal, people, time, worldW,
    lat: city.lat, lon: city.lon, city: { ar: city.ar, en: city.en }, weather, zones,
  };
  if (flood) {
    const y0 = st === 'rotterdam' ? 264 : st === 'marsh' ? 258 : 262 + ri(0, 8);
    const rises = st !== 'rotterdam' && st !== 'marsh';
    m.water = { y: y0, to: rises ? Math.max(206, y0 - 26 - Math.round(d * 30)) : y0, rate: rises ? +(0.1 + d * 0.22).toFixed(2) : 0 };
  }
  const gust = Math.round((weather === 'wind' || weather === 'sand' || weather === 'storm' ? 14 : 4) + d * 22);
  m.wind = { base: ri(-1, 1) * Math.round(4 + d * 8), gust };
  if (type === 'fire') m.fire = 2 + Math.round(d * 4) + (boss ? 2 : 0);
  if (type === 'careful') m.careful = true;
  if (type === 'cargo') { m.cargo = pickR(['medicine', 'flour', 'melon']); }
  if (type === 'vip') { m.vipName = pickR(VIP_NAMES); }
  // الاسم والوصف
  let nm = TYPE_NAMES[type];
  let ni = Math.floor(rng() * nm.ar.length);
  if (type === 'vip') ni = VIP_NAMES.indexOf(m.vipName);
  if (type === 'cargo') ni = { medicine: 0, flour: 1, melon: 2 }[m.cargo];
  m.name = { ar: (boss ? '⭐ ' : '') + nm.ar[ni], en: (boss ? '⭐ ' : '') + nm.en[ni] };
  const zAr = zones === 'boat' ? 'القوارب' : 'المهبط', zEn = zones === 'boat' ? 'the boats' : 'the helipad';
  const D = {
    rescue: [`الناس عالقين فوگ سطوح ${city.ar}. أنقذ ${goal} ووصّلهم لـ${zAr}.`, `People are stuck on the rooftops of ${city.en}. Rescue ${goal} and bring them to ${zEn}.`],
    cargo: m.cargo && [`${city.ar} محتاجة ${CARGO_NAMES[m.cargo].ar}! انقل ${goal} صناديق بالحبل لـ${zAr}.${m.cargo === 'melon' ? ' البطيخ إذا طاح من عالي يتفلّش!' : ' الصناديق ما تحچي… بس لا توگعها.'}`, `${city.en} needs ${CARGO_NAMES[m.cargo].en}! Carry ${goal} crates on the rope to ${zEn}.${m.cargo === 'melon' ? ' Watermelons smash if dropped from high!' : " Crates don't talk… but don't drop them."}`],
    vip: m.vipName && [`${m.vipName.ar} عالق بـ${city.ar}! أنقذ ${goal} أشخاص، و${m.vipName.ar} لازم يكون وياهم (أبو التاج 👑).`, `${m.vipName.en} is stuck in ${city.en}! Rescue ${goal} people — ${m.vipName.en} (the one with the crown 👑) must be one of them.`],
    animals: [`خرفان وبزازين عالقة فوگ سطوح ${city.ar} وياها أصحابها! الحيوانات ما تمسك الحبل… خلّي واحد من المعلّقين يشيلها بإيده. أنقذ ${goal} حيوانات.`, `Sheep and cats are stuck on the roofs of ${city.en} with their owners! Animals can't hold the rope — let someone hanging carry them. Rescue ${goal} animals.`],
    careful: [`جدّات وأجداد بـ${city.ar}. أنقذ ${goal} بهدوء… إذا واحد طاح من الحبل تفشل المهمة!`, `Grandmas and grandpas in ${city.en}. Rescue ${goal} gently… if anyone falls off the rope, you fail!`],
    fire: [`حريق بـ${city.ar}! الناس فوگ السطوح والنار قريبة. أنقذ ${goal} ولا تطير فوگ النار.`, `Fire in ${city.en}! People are on the roofs and the flames are close. Rescue ${goal} and don't fly over the fire.`],
  }[type];
  m.desc = { ar: D[0], en: D[1] };
  return m;
}

MISSIONS.forEach(m => { m.chapter = 1; });
for (let ch = 2; ch <= 20; ch++) for (let s = 0; s < 10; s++) MISSIONS.push(genMission(ch, s));
const CHAPTERS = 20;
