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
    credit: 'تصميم وتطوير إبراهيم الخزرجي',
    falls: 'طاحوا من الحبل',
    timeLeft: 'الوقت المتبقي',
    best: 'أفضل نتيجة',
    small: 'هليكوبتر صغيرة',
    chinook: 'شينوك (حبل طويل)',
    w_clear: 'صافي', w_rain: 'مطر', w_storm: 'عاصفة رعدية', w_sand: 'عاصفة ترابية', w_tornado: 'إعصار', w_wind: 'رياح', w_flood: 'فيضان يرتفع',
    allDone: 'خلّصت كل المهمات! أنت أحسن طيار بالعراق 🏆',
    loading: 'جاري التحميل…',
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
    credit: 'Designed & developed by Ibrahim Al-Khazraji',
    falls: 'Fell off the rope',
    timeLeft: 'Time left',
    best: 'Best',
    small: 'Small heli',
    chinook: 'Chinook (long rope)',
    w_clear: 'Clear', w_rain: 'Rain', w_storm: 'Thunderstorm', w_sand: 'Sandstorm', w_tornado: 'Tornado', w_wind: 'Windy', w_flood: 'Rising flood',
    allDone: 'All missions done! Best pilot in the world 🏆',
    loading: 'Loading…',
  }
};

/* ---------- التعليقات المضحكة ---------- */
const LINES = {
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
