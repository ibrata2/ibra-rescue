'use strict';
/* ============================================================
   IBRA RESCUE — حبل النجاة
   النصوص، التعليقات المضحكة، والمهمات
   ============================================================ */

const STR = {
  ar: {
    subtitle: 'حبل النجاة',
    play: 'ابدأ المهمات',
    langBtn: 'English',
    sound: 'الصوت',
    on: 'شغّال',
    off: 'مطفّى',
    missions: 'المهمات',
    back: 'رجوع',
    start: 'انطلق!',
    goal: 'الهدف',
    goalTxt: 'أنقذ {n} أشخاص',
    time: 'الوقت',
    heli: 'الطيارة',
    rope: 'سعة الحبل',
    weather: 'الطقس',
    resume: 'كمّل',
    restart: 'إعادة',
    menu: 'القائمة',
    next: 'المهمة الجاية',
    retry: 'حاول مرة ثانية',
    saved: 'منقذين',
    onRope: 'على الحبل',
    locked: 'مقفلة — خلّص المهمة اللي قبلها',
    complete: 'مهمة ناجحة!',
    failed: 'فشلت المهمة',
    timeup: 'خلص الوقت!',
    crashed: 'الطيارة طاحت!',
    paused: 'استراحة',
    controls: 'الأسهم أو WASD للطيران  •  P للإيقاف  •  R للإعادة',
    touchHint: 'اسحب بالجهة اليسرى للطيران',
    howto: 'نزّل الحبل على الناس حتى يمسكونه، وبعدين وصّلهم للقارب أو المهبط. لا تهز الحبل هواية… يطيحون!',
    credit: 'برمجة وتطوير إبراهيم الخزرجي',
    about: 'حول',
    aboutDesc: 'لعبة إنقاذ بالهليكوبتر والحبل — 10 مهمات بمدن العالم، تعليقات مضحكة بالعراقي والإنكليزي.',
    version: 'الإصدار',
    close: 'إغلاق',
    follow: 'تابعنا للتحديثات والبرامج الجديدة',
    falls: 'طاحوا من الحبل',
    timeLeft: 'الوقت المتبقي',
    best: 'أفضل نتيجة',
    small: 'هليكوبتر صغيرة',
    chinook: 'شينوك (حبل طويل)',
    w_clear: 'صافي', w_rain: 'مطر', w_storm: 'عاصفة رعدية', w_sand: 'عاصفة ترابية', w_tornado: 'إعصار', w_wind: 'رياح', w_flood: 'فيضان يرتفع',
    allDone: 'خلّصت كل المهمات! أنت أحسن طيار بالعراق 🏆',
    loading: 'جاري التحميل…',
    medic: 'إسعاف', police: 'شرطة (سريعة)', news: 'الأخبار', giant: 'العملاق (حبل طويل جداً)',
    delivered: 'تم التسليم',
    t_rescue: 'إنقاذ', t_cargo: 'نقل صناديق', t_vip: 'شخص مهم', t_animals: 'حيوانات', t_careful: 'بهدوء! (ممنوع يطيح أحد)', t_fire: 'حريق',
    type: 'نوع المهمة',
    chapter: 'الفصل', totalStars: 'النجوم',
    carefulFail: 'واحد طاح! المهمة تحتاج هدوء',
    vipFail: 'نسيت الشخص المهم!',
    notEnough: 'ما بقى عدد كافي',
    upChecking: 'جاري التحقق من التحديثات…', upLatest: '✔ النسخة حديثة', upNew: '⬆ توجد نسخة جديدة', upDownload: 'اضغط للتحميل', upFail: 'تعذّر التحقق من التحديثات (بدون إنترنت؟)',
  },
  en: {
    subtitle: 'Rope of Hope',
    play: 'Start Missions',
    langBtn: 'عربي',
    sound: 'Sound',
    on: 'On',
    off: 'Off',
    missions: 'Missions',
    back: 'Back',
    start: 'Go!',
    goal: 'Goal',
    goalTxt: 'Rescue {n} people',
    time: 'Time',
    heli: 'Helicopter',
    rope: 'Rope capacity',
    weather: 'Weather',
    resume: 'Resume',
    restart: 'Restart',
    menu: 'Menu',
    next: 'Next mission',
    retry: 'Try again',
    saved: 'Rescued',
    onRope: 'On rope',
    locked: 'Locked — finish the previous mission',
    complete: 'Mission complete!',
    failed: 'Mission failed',
    timeup: "Time's up!",
    crashed: 'You crashed!',
    paused: 'Paused',
    controls: 'Arrows or WASD to fly  •  P pause  •  R restart',
    touchHint: 'Drag on the left side to fly',
    howto: 'Lower the rope onto people so they grab it, then bring them to the boat or helipad. Don\'t swing too hard… they fall!',
    credit: 'Programmed & developed by Ibrahim Al-Khazraji',
    about: 'About',
    aboutDesc: 'A helicopter rope-rescue game — 10 missions in world cities, funny Iraqi Arabic & English comments.',
    version: 'Version',
    close: 'Close',
    follow: 'Follow for updates and new apps',
    falls: 'Fell off the rope',
    timeLeft: 'Time left',
    best: 'Best',
    small: 'Small heli',
    chinook: 'Chinook (long rope)',
    w_clear: 'Clear', w_rain: 'Rain', w_storm: 'Thunderstorm', w_sand: 'Sandstorm', w_tornado: 'Tornado', w_wind: 'Windy', w_flood: 'Rising flood',
    allDone: 'All missions done! Best pilot in the world 🏆',
    loading: 'Loading…',
    medic: 'Ambulance', police: 'Police (fast)', news: 'News', giant: 'The Giant (very long rope)',
    delivered: 'Delivered',
    t_rescue: 'Rescue', t_cargo: 'Cargo', t_vip: 'VIP', t_animals: 'Animals', t_careful: 'Careful! (no one may fall)', t_fire: 'Fire',
    type: 'Mission type',
    chapter: 'Chapter', totalStars: 'Stars',
    carefulFail: 'Someone fell! This mission needed care',
    vipFail: 'You forgot the VIP!',
    notEnough: 'Not enough left',
    upChecking: 'Checking for updates…', upLatest: '✔ You have the latest version', upNew: '⬆ A new version is available', upDownload: 'click to download', upFail: 'Could not check for updates (offline?)',
  }
};

/* ---------- التعليقات المضحكة ---------- */
const LINES = {

  /* ----- الشخص المهم (VIP) ----- */
  vip_wait: {
    ar: ['آني {vip}! أنقذوني أول!', 'تعرفون منو آني؟!', 'وين الحرس؟! وين الطيارة؟!', 'صوّروني وآني أنقذ!'],
    en: ["I'm {vip}! Save me first!", 'Do you know who I am?!', 'Where are my bodyguards?!', 'Film me being rescued!']
  },
  vip_grab: { ar: ['أخيراً! سجّلوا هالمشهد', 'بشويش على البدلة!'], en: ['Finally! Record this moment', 'Careful with the suit!'] },
  vip_hang: { ar: ['هذا مو مستوى درجة أولى!', 'راح أشتكي على الحبل', 'شعري خرب!'], en: ['This is not first class!', "I'm filing a complaint", 'My hair is ruined!'] },
  vip_saved: { ar: ['راح أذكرك بخطابي الجاي!', 'تستاهل وسام!', 'وين الكاميرات؟'], en: ["I'll mention you in my next speech!", 'You deserve a medal!', 'Where are the cameras?'] },
  vip_fall: { ar: ['محاميييي!!', 'هذا مو بالعقد!!'], en: ['MY LAWYER!!', 'This was NOT in the contract!!'] },

  /* ----- الجدّات والأجداد ----- */
  grandma_wait: { ar: ['يمّه تعال ابني!', 'نظارتي وين؟ شايفة طيارة؟', 'ابني لا تستعجل، ركبتي توجعني', 'جبتلك دولمة!'], en: ['Come here, dear!', 'Where are my glasses? Is that a helicopter?', 'Slowly dear, my knees!', 'I made you dolma!'] },
  grandma_grab: { ar: ['يا ستّار!', 'بسم الله… مسكته', 'لزمني زين ابني'], en: ['Oh my goodness!', 'Got it, dear…', 'Hold me tight, dear'] },
  grandma_hang: { ar: ['بهاي العمر أطير؟!', 'لو يشوفني جدّك هسه…', 'ابني شغّل أم كلثوم'], en: ['Flying at my age?!', 'If grandpa could see me now…', 'Put on some old songs, dear'] },
  grandma_scared: { ar: ['يمّه بشويييش!!', 'عمري 90 سنة ابني!!', 'ضغطي صعد!!'], en: ['SLOWLY, DEAR!!', "I'm 90 years old!!", 'My blood pressure!!'] },
  grandma_saved: { ar: ['الله يرضى عليك ابني', 'تعال اتغدى عدنا!', 'هسه أحچي لكل الجيران'], en: ['Bless you, dear', 'Come over for lunch!', "I'm telling all the neighbours"] },
  grandma_fall: { ar: ['يااا ستّاااار!!'], en: ['OH MY GOODNEEESS!!'] },

  /* ----- الحيوانات ----- */
  sheep: { ar: ['مااااع!', 'ماع؟', 'ماااااااع!!', 'مع.'], en: ['Baaaa!', 'Baa?', 'BAAAAAA!!', 'Meh.'] },
  cat: { ar: ['مياو!', 'مياااو؟!', 'هسسسس!', 'مياو… (نظرة احتقار)'], en: ['Meow!', 'Meooow?!', 'HSSSS!', 'Meow… (judging you)'] },
  hot: { ar: ['حااار!!', 'احترگت!!', 'نااار!!'], en: ['HOT HOT HOT!!', "I'm burning!!", 'FIRE!!'] },
  wait: {
    ar: ['هنا! هنا!', 'عمي آني هنا!', 'يا طيارة! يا طيارة!', 'لا تنساني الله يخليك', 'تعال تعال!', 'آني أول واحد!', 'شوف وجهي، آني مهم!', 'وين صرت؟ صارلي ساعة!', 'جبت كيك، لا تخليني!', 'أبو الطيارة! هنااا!', 'آني خفيف والله!', 'شحن موبايلي خلص، تعال!'],
    en: ['Over here!', 'HEY! HELICOPTER!', "Don't forget me!", 'I brought snacks!', 'Pick me, I\'m important!', 'Hello?? TAXI!', 'I\'m very light, I promise!', 'My phone is at 1%!', 'Down here!!', 'I\'ve been waiting an hour!']
  },
  waitWater: {
    ar: ['الماي يصعد!!', 'الماي وصل للركبة!', 'ما أعرف أسبح زين!', 'أسرع! الماي!'],
    en: ['Water is rising!!', 'It\'s at my knees!', 'I can\'t swim well!', 'Hurry! The water!']
  },
  swim: {
    ar: ['الماي بارد!', 'صرت سمچة!', 'بلبل بلبل…', 'وين الحبل؟!'],
    en: ['Water is cold!!', 'I\'m a fish now', 'blub blub…', 'Where\'s the rope?!']
  },
  grab: {
    ar: ['يلا يلا!', 'مسكته!', 'أخيراً!', 'شد حيلك!', 'طير طير!', 'لزمته بإيديني الثنين!'],
    en: ['Got it!', 'Finally!', 'Go go go!', 'Holding on!', 'Lift off!', 'Both hands!']
  },
  hang: {
    ar: ['لا تفلتني!', 'المنظر حلو بس خايف', 'اكو هوا هواية فوگ', 'لا تباوع جوه… باوعت', 'هذا الحبل يتحمّلني؟', 'أحس بطني طار', 'لا تنساني معلّق'],
    en: ["Don't let go!", 'Nice view… I hate it', 'Is this rope rated for me?', "Don't look down. I looked down.", 'My stomach is flying', 'Windy up here!']
  },
  scared: {
    ar: ['بشويش!!', 'يا معوّد على كيفك!', 'شنو هذا، دوامة؟!', 'راح أطيح!!', 'دخت!!', 'بطّل تلف!!'],
    en: ['SLOW DOWN!', "I'm gonna be sick!", 'WHY ARE WE SPINNING', 'I\'m slipping!!', 'Easy!! EASY!!', 'Not like this!!']
  },
  hit: {
    ar: ['آخ راسي!', 'الحايط!!', 'منو حط هالبناية هنا؟!', 'وجهي!!', 'آخ آخ!'],
    en: ['OW!', 'Who put that building there?!', 'My face!', 'WALL!!', 'Ouch ouch!']
  },
  heavy: {
    ar: ['ثقيل هواية جوه!', 'منو أكل هواية؟!', 'لتدفعون!', 'الحبل راح ينقطع!'],
    en: ['Too heavy down there!', 'Who ate too much?!', 'Stop pushing!', 'The rope is stretching!']
  },
  fall: {
    ar: ['آآآآآآآ', 'لاااا! جنت قريب!', 'گولوا لأمي حاولت!', 'الحبل زلگ!!'],
    en: ['AAAAAAA', 'NOOO! I WAS SO CLOSE', 'Tell mom I tried!', 'Slippery rope!!']
  },
  landWater: {
    ar: ['ماكو مشكلة، أسبح!', 'بخير! بعدني عايش!', 'أعرف أسبح… شوية'],
    en: ['Still here! Still alive!', 'I can swim! Kinda!', 'I\'m OK!!']
  },
  landHard: {
    ar: ['آخ ظهري…', 'زين… زين… بخير', 'محد شافني صح؟', 'شفت نجوم'],
    en: ['Ow… I\'m fine', 'Nobody saw that.', 'I see stars…', 'Totally meant that']
  },
  landZone: {
    ar: ['وصلت… بطريقتي الخاصة', 'هم نزلت!'],
    en: ['Landed! My own way.', 'Still counts!']
  },
  saved: {
    ar: ['شكراً عمي!', 'الله يحفظك!', 'عاش البطل!', 'وين التكسي هسه؟', 'خمس نجوم!', 'سيلفي ويّاك؟', 'رجعولي الحبل اشتاقيتله'],
    en: ['Thank you!!', 'You\'re my hero!', '5 stars!', 'Can I get a selfie?', 'Where\'s my taxi now?', 'I\'m never flying again', 'Again! Again!']
  },
  full: {
    ar: ['ماكو مكان؟!', 'زين، أجي الدور الجاي', 'شدعوة؟ اكو مكان!'],
    en: ['No room?!', 'Next trip then!', 'Squeeze me in!']
  },
  crash: {
    ar: ['اليوم الأول بالشغل… آسف', 'والله ما شفت البناية', 'الطيارة بعدها بالأقساط…', 'ما صار شي… بس الطيارة'],
    en: ['first day, sorry', "I didn't see the building", 'it was a rental…', 'well… that happened']
  },
};

/* ---------- خطوط الراديو (البرج/الطيار) ---------- */
const RADIO = {

  vipNeed: { ar: ['البرج: لازم تجيب {vip}! بدونه ما ننجح', 'البرج: نسيت {vip}؟!'], en: ['Tower: you must bring {vip}!', 'Tower: did you forget {vip}?!'] },
  vipSaved: { ar: ['البرج: {vip} وصل! هسه يسوي مؤتمر صحفي'], en: ['Tower: {vip} is safe! now he wants a press conference'] },
  careFail: { ar: ['البرج: الجدّة طاحت!! هي بخير… بس زعلانة هواية'], en: ['Tower: grandma fell!! she\'s fine… but VERY angry'] },
  melon: { ar: ['البرج: البطيخ تفلّش! ', 'الطيار: راحت البطيخة…'], en: ['Tower: the watermelon exploded!', 'Pilot: RIP watermelon…'] },
  crate: { ar: ['البرج: الصندوق وصل سالم', 'البرج: تم التسليم، كمّل'], en: ['Tower: crate delivered', 'Tower: delivered, keep going'] },
  fire: { ar: ['البرج: ابتعد عن النار!', 'الطيار: الحرارة عالية هنا!'], en: ['Tower: stay away from the fire!', "Pilot: it's hot up here!"] },
  police: { ar: ['الطيار: شغّلت السرينة… بس ماكو أحد يسمع', 'الطيار: وضع المطاردة!'], en: ['Pilot: siren on… nobody cares', 'Pilot: pursuit mode!'] },
  news: { ar: ['المذيع: نحن على الهواء مباشرة!', 'المذيع: لقطة حصرية!'], en: ['Reporter: we are LIVE!', 'Reporter: exclusive shot!'] },
  start: {
    ar: ['البرج: اليوم بلا حوادث رجاءً', 'البرج: لا تطير فوگ بيت أمي', 'البرج: الطيارة جديدة، دير بالك', 'الطيار: يلا بسم الله'],
    en: ['Tower: no crashes today, please', 'Tower: the heli is brand new, careful', 'Pilot: here we go…', 'Tower: try to bring it back in one piece']
  },
  firstSave: {
    ar: ['البرج: زين! كمّل هيچ', 'البرج: أول واحد وصل، عفية'],
    en: ['Tower: nice! keep going', 'Tower: first one delivered, good job']
  },
  heavy: {
    ar: ['الطيار: حمولة زايدة… منو جاب جنطة؟', 'الطيار: الطيارة دتنزل!'],
    en: ['Pilot: overweight… who brought luggage?', 'Pilot: we\'re sinking!']
  },
  lowTime: {
    ar: ['البرج: الوقت يخلص!', 'البرج: أسرع شوية!'],
    en: ["Tower: time's running out!", 'Tower: hurry up!']
  },
  tornado: {
    ar: ['الطيار: الطيارة دايخة!!', 'الطيار: ابتعد عن الإعصار!'],
    en: ['Pilot: the heli is dizzy!!', 'Pilot: stay away from the twister!']
  },
  lightning: {
    ar: ['الطيار: هاي البرقة جانت قريبة!', 'الطيار: يمه!'],
    en: ['Pilot: that bolt was close!', 'Pilot: YIKES!']
  },
  flood: {
    ar: ['البرج: الماي دا يصعد، استعجل!'],
    en: ['Tower: water is rising, hurry!']
  },
  fell: {
    ar: ['البرج: واحد طاح! ارجعله', 'الطيار: أوبس…'],
    en: ['Tower: someone fell! go back', 'Pilot: oops…']
  },
  win: {
    ar: ['مهمة ناجحة! محد طاح… تقريباً', 'عفية عليك! ارجع للقاعدة', 'البرج: أحسن من البارحة بهواية'],
    en: ['Mission complete! Nobody fell… mostly', 'Great job! back to base', 'Tower: much better than yesterday']
  },
};
