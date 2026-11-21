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
    controls: 'الأسهم أو WASD للطيران  •  Q/E رفع وتنزيل الحبل  •  P إيقاف  •  R إعادة',
    touchHint: 'اسحب بالجهة اليسرى للطيران',
    howto: 'قرّب الحبل من الناس ويقفزون عليه، وكل واحد يلزم رجول اللي فوگه. وصّلهم للقارب أو المهبط… ولا تهز السلسلة هواية!',
    credit: 'برمجة وتطوير إبراهيم الخزرجي',
    about: 'حول',
    aboutDesc: 'لعبة إنقاذ بالهليكوبتر والحبل — 210 مهمة بمدن العالم، 6 طيارات، أعاصير، وتعليقات مضحكة بالعراقي والإنكليزي.',
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
    story: 'نمط القصة', soon: 'قريباً', storyTitle: 'نمط القصة — قريباً', storyDrawing: 'جاري رسم القصة ✏️',
    storyTeaser: 'سعدون… أول يوم إله طيار إنقاذ ببغداد، وما يعرف يسوق غير بايسكل. ويّا البرج أبو جاسم، والجدّة أم رزاق اللي ما تسكت، والبزونة زعطوط اللي تلحگه بكل مهمة. رحلة من بغداد للأهوار ولآخر الدنيا… بقصص مرسومة ومضحكة.',
    storyNext: 'ينزل بالتحديث الجاي إن شاء الله', ok: 'تمام',
    whatsNew: 'ما الجديد', newIn: 'الجديد بالإصدار',
    textSize: 'حجم الكتابة', ts_s: 'صغير', ts_m: 'وسط', ts_l: 'كبير', ts_xl: 'كبير جداً',
    ch21: 'موسم الأعاصير 🌪️', beginnings: 'البداية',
    landHint: 'تگدر تهبط بهدوء على السطح أو القارب حتى الناس يصعدون للطيارة',
    h_small: 'الصغيرة', h_medic: 'الإسعاف', h_police: 'الشرطة', h_news: 'الأخبار', h_chinook: 'شينوك', h_giant: 'العملاق',
    recommended: 'مقترحة', heliLocked: 'مقفلة — تنفتح لما تخلص مهمة بيها هالطيارة', cap: 'السعة', speed: 'السرعة', ropeLen: 'الحبل', chooseHeli: 'اختار الطيارة',
    t_rescue: 'إنقاذ', t_cargo: 'نقل صناديق', t_vip: 'شخص مهم', t_animals: 'حيوانات', t_careful: 'بهدوء! (ممنوع يطيح أحد)', t_fire: 'حريق',
    type: 'نوع المهمة',
    chapter: 'الفصل', totalStars: 'النجوم',
    carefulFail: 'واحد طاح! المهمة تحتاج هدوء',
    vipFail: 'نسيت الشخص المهم!',
    notEnough: 'ما بقى عدد كافي',
    upChecking: 'جاري التحقق من التحديثات…', upLatest: '✔ النسخة حديثة', upNew: '⬆ توجد نسخة جديدة', upDownload: 'اضغط للتحميل', upInstall: 'اضغط للتحديث الآن', upDownloading: 'جاري تنزيل التحديث', upInstalling: 'جاري التثبيت… اللعبة راح تنفتح من جديد', upAllow: 'اسمح بتثبيت التطبيقات للعبة ثم اضغط هنا مرة ثانية', upErr: 'صار خطأ بالتنزيل — اضغط للمحاولة مرة ثانية', upFail: 'تعذّر التحقق من التحديثات (بدون إنترنت؟)',
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
    controls: 'Arrows or WASD to fly  •  Q/E reel rope up/down  •  P pause  •  R restart',
    touchHint: 'Drag on the left side to fly',
    howto: 'Bring the rope close and people jump on, each one grabbing the feet of the one above. Fly them to the boat or helipad… and don\'t swing the chain too hard!',
    credit: 'Programmed & developed by Ibrahim Al-Khazraji',
    about: 'About',
    aboutDesc: 'A helicopter rope-rescue game — 210 missions in world cities, 6 helicopters, twisters, funny Iraqi Arabic & English comments.',
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
    story: 'Story Mode', soon: 'Soon', storyTitle: 'Story Mode — Coming Soon', storyDrawing: 'The story is being drawn ✏️',
    storyTeaser: 'Saadoun… his first day as a rescue pilot in Baghdad, and he can only ride a bicycle. With Abu Jassim in the tower, Grandma Um Razzaq who never stops talking, and Zaatout the cat who follows him on every mission. From Baghdad to the Marshes and the end of the world… in funny hand-drawn comics.',
    storyNext: 'Coming in the next update', ok: 'OK',
    whatsNew: "What's new", newIn: 'New in version',
    textSize: 'Text size', ts_s: 'Small', ts_m: 'Medium', ts_l: 'Large', ts_xl: 'Extra large',
    ch21: 'Twister Season 🌪️', beginnings: 'Beginnings',
    landHint: 'Land gently on a roof or boat so people can climb into the helicopter',
    h_small: 'Small', h_medic: 'Ambulance', h_police: 'Police', h_news: 'News', h_chinook: 'Chinook', h_giant: 'Giant',
    recommended: 'Suggested', heliLocked: 'Locked — unlocks after you finish a mission that uses it', cap: 'Capacity', speed: 'Speed', ropeLen: 'Rope', chooseHeli: 'Choose helicopter',
    t_rescue: 'Rescue', t_cargo: 'Cargo', t_vip: 'VIP', t_animals: 'Animals', t_careful: 'Careful! (no one may fall)', t_fire: 'Fire',
    type: 'Mission type',
    chapter: 'Chapter', totalStars: 'Stars',
    carefulFail: 'Someone fell! This mission needed care',
    vipFail: 'You forgot the VIP!',
    notEnough: 'Not enough left',
    upChecking: 'Checking for updates…', upLatest: '✔ You have the latest version', upNew: '⬆ A new version is available', upDownload: 'click to download', upInstall: 'click to update now', upDownloading: 'Downloading update', upInstalling: 'Installing… the game will reopen', upAllow: 'Allow installing apps for the game, then tap here again', upErr: 'Download failed — tap to retry', upFail: 'Could not check for updates (offline?)',
  }
};

/* ---------- التعليقات المضحكة ---------- */
const LINES = {
  twister: { ar: ['يمّه أطير!!', 'الإعصار شالني!!', 'صرت طيارة بدون طيارة!!', 'دوخت دوخت دوخت!!', 'وين الأرض؟!', 'گولوا لأمي صرت غيمة!'], en: ['I\'m FLYING!!', 'The twister took me!!', 'I\'m a helicopter now!!', 'So dizzy!!', 'Where\'s the ground?!', 'Tell mom I\'m a cloud!'] },
  board: { ar: ['يلا اصعدوا!', 'آني جنب الشباك!', 'أكو مكيف جوه؟', 'دفعت الأجرة؟ لا؟ زين', 'عيني الطيارة نظيفة!', 'وين أحط رجلي؟'], en: ['All aboard!', 'Window seat is mine!', 'Is there AC in here?', 'Did I pay? No? Good', 'Nice clean helicopter!', 'Where do I put my feet?'] },
  grandma_board: { ar: ['ابني ساعدني أصعد', 'يمّه هاي الطيارة عالية', 'وين الكرسي؟ ركبتي!'], en: ['Help me up, dear', 'This helicopter is so high', 'Where\'s my seat? My knees!'] },
  jump: { ar: ['هوووب!', 'يا علي!', 'يلاااا!', 'شوفوني!', 'هسه أقفز!'], en: ['Hup!', 'Here I go!', 'Yallaaa!', 'Watch me!', 'JUMP!'] },
  slip: { ar: ['شتريد أگلك؟ عاشت إيدك!'], en: ['What can I say? Great job!'] },
  missed: { ar: ['فاتني!', 'گلت لك قرّب شوية!', 'آني مو سبايدرمان!', 'مرة ثانية، مرة ثانية!', 'حچيلك بالأشارات؟ قرّب!'], en: ['Missed!', 'I said come closer!', 'I\'m not Spider-Man!', 'Again, again!', 'Come CLOSER!'] },
  dragged: { ar: ['إنت طحت وطيحتني وياك!!', 'ليش فلتت؟! ليييش؟!', 'آني شعليه؟!', 'كلنا رحنا وطي!!'], en: ['You fell and took me with you!!', 'Why did you let go?! WHY?!', 'What did I do?!', 'We\'re ALL going down!!'] },
  fingers: { ar: ['باقي إصبع واحد!!', 'إيدي! إيدي ترتجف!', 'رجلك تزلگ يا أخي!', 'دا أحاول! دا أحاول!', 'اللي تحتي يقرصني!'], en: ['One finger left!!', 'My hand is shaking!', 'Your foot is slippery, man!', 'I\'m trying! I\'m trying!', 'The guy below is pinching me!'] },
  carry: { ar: ['شيلته بإيد وحدة… الله يستر!', 'هالبزونة تخرمش!!', 'الخروف أثقل مني!', 'لا تتحرك يا حيوان!', 'گولوا لصاحبه يدفع أجرة!', 'راح أوگع… والله راح أوگع!'], en: ['One hand only… pray for me!', 'This cat is scratching!!', 'The sheep is heavier than me!', 'Stop wiggling, animal!', 'Tell its owner to pay the fare!', 'I\'m gonna fall… I swear I\'m gonna fall!'] },
  carryDrop: { ar: ['راحت البزونة!! آسف!', 'الخروف فلت!! مو ذنبي!', 'ما گدرت أكثر!!'], en: ['There goes the cat!! Sorry!', 'The sheep slipped! Not my fault!', 'Couldn\'t hold it anymore!!'] },
  laundry: { ar: ['هدومي!! لك هدومي!!', 'هاي دشداشة أبوي!!', 'منو يغسلها هسه؟!', 'لك نشرتهن هسه!!', 'أمّي راح تذبحك!'], en: ['My laundry!! MY LAUNDRY!!', 'That was my dad\'s dishdasha!!', 'Who\'s washing that now?!', 'I JUST hung those!!', 'My mom is going to kill you!'] },
  laundryHang: { ar: ['آسفين على الهدوم!', 'لبست دشداشة غيري هسه', 'شنو هذا اللي على وجهي؟!'], en: ['Sorry about the laundry!', 'I\'m wearing someone\'s dishdasha now', 'What is this on my face?!'] },

  /* ----- الشخص المهم (VIP) ----- */
  vip_wait: {
    ar: ['آني {vip}! أنقذوني أول!', 'تعرفون منو آني؟!', 'وين الحرس؟! وين الطيارة؟!', 'صوّروني وآني أنقذ!'],
    en: ["I'm {vip}! Save me first!", 'Do you know who I am?!', 'Where are my bodyguards?!', 'Film me being rescued!']
  },
  vip_grab: { ar: ['أخيراً! سجّلوا هالمشهد', 'بشويش على البدلة!'], en: ['Finally! Record this moment', 'Careful with the suit!'] },
  vip_hang: { ar: ['هذا مو مستوى درجة أولى!', 'راح أشتكي على الحبل', 'شعري خرب!'], en: ['This is not first class!', "I'm filing a complaint", 'My hair is ruined!'] },
  vip_saved: { ar: ['راح أذكرك بخطابي الجاي!', 'تستاهل وسام!', 'وين الكاميرات؟'], en: ["I'll mention you in my next speech!", 'You deserve a medal!', 'Where are the cameras?'] },
  vip_jump: { ar: ['شوفوني! أقفز بأناقة!'], en: ['Watch me jump elegantly!'] },
  vip_fingers: { ar: ['أظافري! سويتها مانيكير البارحة!'], en: ['My nails! Fresh manicure!'] },
  vip_fall: { ar: ['محاميييي!!', 'هذا مو بالعقد!!'], en: ['MY LAWYER!!', 'This was NOT in the contract!!'] },

  /* ----- الجدّات والأجداد ----- */
  grandma_wait: { ar: ['يمّه تعال ابني!', 'نظارتي وين؟ شايفة طيارة؟', 'ابني لا تستعجل، ركبتي توجعني', 'جبتلك دولمة!'], en: ['Come here, dear!', 'Where are my glasses? Is that a helicopter?', 'Slowly dear, my knees!', 'I made you dolma!'] },
  grandma_grab: { ar: ['يا ستّار!', 'بسم الله… مسكته', 'لزمني زين ابني'], en: ['Oh my goodness!', 'Got it, dear…', 'Hold me tight, dear'] },
  grandma_hang: { ar: ['بهاي العمر أطير؟!', 'لو يشوفني جدّك هسه…', 'ابني شغّل أم كلثوم'], en: ['Flying at my age?!', 'If grandpa could see me now…', 'Put on some old songs, dear'] },
  grandma_scared: { ar: ['يمّه بشويييش!!', 'عمري 90 سنة ابني!!', 'ضغطي صعد!!'], en: ['SLOWLY, DEAR!!', "I'm 90 years old!!", 'My blood pressure!!'] },
  grandma_saved: { ar: ['الله يرضى عليك ابني', 'تعال اتغدى عدنا!', 'هسه أحچي لكل الجيران'], en: ['Bless you, dear', 'Come over for lunch!', "I'm telling all the neighbours"] },
  grandma_fingers: { ar: ['ابني إيدي ما تتحمل!', 'يمّه رح أطيح!!', 'وين حبوب الضغط؟!'], en: ['Dear, my hands are weak!', "I'm slipping, dear!!", 'Where are my pills?!'] },
  grandma_jump: { ar: ['يا ستّار… هوب!', 'بشويش… هوب!'], en: ['Oh my… hup!', 'Gently… hup!'] },
  grandma_missed: { ar: ['ابني آني ما أگدر أقفز هواية!', 'قرّب يمّه، قرّب!'], en: ["Dear, I can't jump that far!", 'Come closer, dear!'] },
  grandma_fall: { ar: ['يااا ستّاااار!!'], en: ['OH MY GOODNEEESS!!'] },

  /* ----- الحيوانات ----- */
  sheep: { ar: ['مااااع!', 'ماع؟', 'ماااااااع!!', 'مع.', 'ماع… (يبوّع)', 'مااع مااع!!'], en: ['Baaaa!', 'Baa?', 'BAAAAAA!!', 'Meh.'] },
  cat: { ar: ['مياو!', 'مياااو؟!', 'هسسسس!', 'مياو… (نظرة احتقار)', 'مرررر… (تخرمش)', 'مياااااو!!'], en: ['Meow!', 'Meooow?!', 'HSSSS!', 'Meow… (judging you)'] },
  hot: { ar: ['حااار!!', 'احترگت!!', 'نااار!!'], en: ['HOT HOT HOT!!', "I'm burning!!", 'FIRE!!'] },
  wait: {
    ar: ['ولك هنا! هنا! عمى بعيونك؟!', 'عمي آني أبو الدشداشة البيضة!', 'يمعود صارلي ساعتين واگف!', 'تعال أخذني وأعزمك على باچة!', 'آني أخف واحد هنا، والله!', 'الله يخليك، باچر عندي امتحان!', 'شو تطير يمّه يمنة؟ آني هنا!', 'هاي الطيارة مالتي؟ لا مو مالتي…', 'يمعود نزّل الحبل شوية!', 'أخذني وخلّي عمّي، هو يتدبر', 'عندي موعد بالكرادة!', 'ما شحنت الموبايل من البارحة!', 'آني جبت النستلة، أنقذني!', 'حبيبي الطيار، حبيبي!', 'لا تعوفني ويه أبو جاسم!', 'أخذني أول، أبو جاسم يشخر!', 'هنا! هنا!', 'عمي آني هنا!', 'يا طيارة! يا طيارة!', 'لا تنساني الله يخليك', 'تعال تعال!', 'آني أول واحد!', 'شوف وجهي، آني مهم!', 'وين صرت؟ صارلي ساعة!', 'جبت كيك، لا تخليني!', 'أبو الطيارة! هنااا!', 'آني خفيف والله!', 'شحن موبايلي خلص، تعال!'],
    en: ['Over here, are you blind?!', 'I\'m the one in the white dishdasha!', 'I\'ve been waiting two hours!', 'Save me, I\'ll buy you breakfast!', 'I\'m the lightest one, I swear!', 'I have an exam tomorrow!', 'Not that way! HERE!', 'Lower the rope a bit, man!', 'Take me, leave my uncle, he\'ll manage', 'I have an appointment downtown!', 'Don\'t leave me with Abu Jassim!', 'Take me first, Abu Jassim snores!', 'Over here!', 'HEY! HELICOPTER!', "Don't forget me!", 'I brought snacks!', 'Pick me, I\'m important!', 'Hello?? TAXI!', 'I\'m very light, I promise!', 'My phone is at 1%!', 'Down here!!', 'I\'ve been waiting an hour!']
  },
  waitWater: {
    ar: ['الماي يصعد!!', 'الماي وصل للركبة!', 'ما أعرف أسبح زين!', 'أسرع! الماي!'],
    en: ['Water is rising!!', 'It\'s at my knees!', 'I can\'t swim well!', 'Hurry! The water!']
  },
  swim: {
    ar: ['الماي بارد! بارد!', 'صرت سمچة مسگوف', 'بلبل… بلبل…', 'لا تتأخر، آني ما أعرف أسبح زين', 'الماي بارد!', 'صرت سمچة!', 'بلبل بلبل…', 'وين الحبل؟!'],
    en: ['Cold! Cold water!', 'I\'m a grilled fish now', 'blub… blub…', 'Hurry, I can\'t swim well', 'Water is cold!!', 'I\'m a fish now', 'blub blub…', 'Where\'s the rope?!']
  },
  grab: {
    ar: ['يلا يلا!', 'مسكته!', 'أخيراً!', 'شد حيلك!', 'طير طير!', 'لزمته بإيديني الثنين!'],
    en: ['Got it!', 'Finally!', 'Go go go!', 'Holding on!', 'Lift off!', 'Both hands!']
  },
  hang: {
    ar: ['هاي أحسن من الكيا!', 'أشوف بيتنا من هنا!', 'يمعود لا تلف، أكلت باچة', 'أمي إذا تشوفني هسه تذبحني', 'هاي الطيارة بيها مكيف؟', 'التكسي أرخص والله', 'أكو واي فاي فوگ؟', 'ما أحس برجلي… لا لا أحس', 'أبو الطيارة شغّل أغنية', 'هسه آني رسمياً طير', 'لا تفلتني!', 'المنظر حلو بس خايف', 'اكو هوا هواية فوگ', 'لا تباوع جوه… باوعت', 'هذا الحبل يتحمّلني؟', 'أحس بطني طار', 'لا تنساني معلّق'],
    en: ['Better than the minibus!', 'I can see my house!', 'Don\'t spin, I just ate', 'If mom sees me now she\'ll kill me', 'Is there AC up there?', 'A taxi is cheaper honestly', 'Is there wifi up here?', 'I can\'t feel my legs… nope, I can', 'Pilot, put on some music', 'I\'m officially a bird now', "Don't let go!", 'Nice view… I hate it', 'Is this rope rated for me?', "Don't look down. I looked down.", 'My stomach is flying', 'Windy up here!']
  },
  scared: {
    ar: ['يا معوّد شنو هذا؟! مدينة ألعاب؟!', 'لك على كيفك!! آني مو كيس طماطة!', 'وگّف وگّف وگّف!!', 'يمّه! يمّه! يمّه!', 'راح أتقيّأ على اللي جوه!', 'هذا مو إنقاذ، هذا تعذيب!', 'بطّل تتمرجح بينا!!', 'بشويش!!', 'يا معوّد على كيفك!', 'شنو هذا، دوامة؟!', 'راح أطيح!!', 'دخت!!', 'بطّل تلف!!'],
    en: ['Is this a theme park?!', 'Easy!! I\'m not a sack of tomatoes!', 'STOP STOP STOP!!', 'MOMMY! MOMMY!', 'I\'m gonna throw up on the guy below!', 'This isn\'t a rescue, it\'s torture!', 'Stop swinging us!!', 'SLOW DOWN!', "I'm gonna be sick!", 'WHY ARE WE SPINNING', 'I\'m slipping!!', 'Easy!! EASY!!', 'Not like this!!']
  },
  hit: {
    ar: ['آخ راسي! منو حط هالحايط؟!', 'لك ضربتني بالشبّاچ!', 'وجهي صار باچة!', 'الحايط مالكم عمي!', 'هاي ثالث مرة!!', 'آخ راسي!', 'الحايط!!', 'منو حط هالبناية هنا؟!', 'وجهي!!', 'آخ آخ!'],
    en: ['Ow my head! who put that wall?!', 'You hit me on the window!', 'My face is mush now!', 'Hey, that\'s your wall!', 'That\'s the third time!!', 'OW!', 'Who put that building there?!', 'My face!', 'WALL!!', 'Ouch ouch!']
  },
  heavy: {
    ar: ['منو اللي تحت؟ گلت لكم لا تتعشون!', 'يمعود اللي تحتي ياكل دولمة كل يوم!', 'رجلي راح تنخلع!', 'آني ماسك سبعة نفرات برجلي!', 'ثقيل هواية جوه!', 'منو أكل هواية؟!', 'لتدفعون!', 'الحبل راح ينقطع!'],
    en: ['Who\'s down there? I said skip dinner!', 'The guy below me eats dolma daily!', 'My leg is coming off!', 'I\'m holding seven people with my legs!', 'Too heavy down there!', 'Who ate too much?!', 'Stop pushing!', 'The rope is stretching!']
  },
  fall: {
    ar: ['گولوا لأمي اني حاولت!!', 'آآآه ولك لا!!', 'رحت وطي!!', 'ما مسكت زين… آآآ', 'آآآآآآآ', 'لاااا! جنت قريب!', 'گولوا لأمي حاولت!', 'الحبل زلگ!!'],
    en: ['Tell mom I tried!!', 'Noooo not like this!!', 'Here I goooo!!', 'Bad grip… AAAA', 'AAAAAAA', 'NOOO! I WAS SO CLOSE', 'Tell mom I tried!', 'Slippery rope!!']
  },
  landWater: {
    ar: ['الحمد لله صار عندي سباحة مجانية', 'مو مشكلة، الماي حلو اليوم', 'آني بخير! رجّعوا الحبل!', 'ماكو مشكلة، أسبح!', 'بخير! بعدني عايش!', 'أعرف أسبح… شوية'],
    en: ['Free swimming lesson, thanks', 'No problem, water\'s nice today', 'I\'m fine! Bring the rope back!', 'Still here! Still alive!', 'I can swim! Kinda!', 'I\'m OK!!']
  },
  landHard: {
    ar: ['ظهري! ظهري صار جسرين!', 'آني بخير… بس نسيت اسمي', 'محد صوّر؟ زين', 'آخ ظهري…', 'زين… زين… بخير', 'محد شافني صح؟', 'شفت نجوم'],
    en: ['My back! It\'s two backs now!', 'I\'m fine… forgot my name though', 'Nobody filmed that? Good', 'Ow… I\'m fine', 'Nobody saw that.', 'I see stars…', 'Totally meant that']
  },
  landZone: {
    ar: ['وصلت… بطريقتي الخاصة', 'هم نزلت!'],
    en: ['Landed! My own way.', 'Still counts!']
  },
  saved: {
    ar: ['تسلم إيدك عيني!', 'والله لأسوّيلك عزيمة!', 'الله يحفظك ويحفظ أهلك!', 'هسه أروح أحچي للحبايب', 'خمس نجوم وتعليق حلو!', 'باچر أجيبلك كاهي وگيمر!', 'وين الشاي؟ أريد شاي!', 'هاي أحسن رحلة بحياتي', 'كمان مرة! كمان مرة!', 'شكراً عمي!', 'الله يحفظك!', 'عاش البطل!', 'وين التكسي هسه؟', 'خمس نجوم!', 'سيلفي ويّاك؟', 'رجعولي الحبل اشتاقيتله'],
    en: ['Bless your hands!', 'I\'m inviting you to a feast!', 'God protect you and your family!', 'Now I\'ll tell everyone', 'Five stars and a nice review!', 'Tomorrow I\'m bringing you pastry!', 'Where\'s the tea? I need tea!', 'Best trip of my life', 'Again! Again!', 'Thank you!!', 'You\'re my hero!', '5 stars!', 'Can I get a selfie?', 'Where\'s my taxi now?', 'I\'m never flying again', 'Again! Again!']
  },
  full: {
    ar: ['ماكو مكان؟!', 'زين، أجي الدور الجاي', 'شدعوة؟ اكو مكان!'],
    en: ['No room?!', 'Next trip then!', 'Squeeze me in!']
  },
  crash: {
    ar: ['أول يوم بالشغل… آسف', 'والله الحايط هو اللي جاني', 'الطيارة بعدها بالأقساط يا جماعة', 'آني مو طيار، آني جنت أوصل طلبات', 'ماكو تأمين؟ ماكو تأمين.', 'گلت لهم أنا أعرف أسوق بايسكل بس', 'اليوم الأول بالشغل… آسف', 'والله ما شفت البناية', 'الطيارة بعدها بالأقساط…', 'ما صار شي… بس الطيارة'],
    en: ['first day, sorry', 'The wall came at me, I swear', 'The heli is still on installments', 'I\'m not a pilot, I was the delivery guy', 'No insurance? No insurance.', 'I told them I can only ride a bike', 'first day, sorry', "I didn't see the building", 'it was a rental…', 'well… that happened']
  },
};

/* ---------- خطوط الراديو (البرج/الطيار) ---------- */
const RADIO = {
  landed: { ar: ['الطيار: هبطنا… وبدون ما نفلّش شي هالمرة', 'البرج: هبوط نظيف، عفية!', 'الطيار: اصعدوا بسرعة، الطيارة مو موقف باص'], en: ['Pilot: landed… without breaking anything this time', 'Tower: clean landing, nice!', 'Pilot: hop in fast, this isn\'t a bus stop'] },
  cabinFull: { ar: ['الطيار: الطيارة فل! ماكو مكان'], en: ['Pilot: we\'re full! no more room'] },

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

/* ============================================================
   🎙️ الجمل المسجّلة بصوت — كل جملة إلها ملف بـ app/sounds/<id>.mp3
   cat: المواقف اللي تطلع بيها (person = الناس العاديين، vip_ للعمدة)
   لما تطلع، الفقاعة تكتب نفس الكلام اللي بالصوت.
   radio: كلام يطلع بالراديو قبلها (مثلاً الطيار يحچي وهو يرد)
   when: 'crowd' = بس إذا اكو 3 أو أكثر متعلقين
   ============================================================ */
const VOICE_LINES = [
  { id: 'v_help1', cat: ['wait', 'waitWater', 'swim'], ar: 'الحگولي، الحگولي، الحگولي!', en: 'Help me! Help me! Help me!' },
  { id: 'v_help2', cat: ['wait', 'waitWater', 'swim'], ar: 'ولك الحگولي!', en: 'Hey, HELP ME!' },
  { id: 'v_scream2', cat: ['fall', 'twister'], ar: 'يابو حيدر!!', en: 'Oh Abu Haider!!' },
  { id: 'v_panic1', cat: ['scared', 'fingers'], ar: 'يلا هيه خربانة خربانة!', en: "It's broken, it's all broken!" },
  { id: 'v_c14', cat: ['scared'], ar: 'أردت أن… أردت أن… أردت أن…', en: 'I w-w-wanted to… I wanted…' },
  { id: 'v_blame1', cat: ['dragged'], ar: 'آني شعليه؟ آني شكو؟', en: "What did I do?! What's it got to do with me?" },
  { id: 'v_blame2', cat: ['dragged'], ar: 'وما لي دخل بيكم!', en: 'I have nothing to do with you people!' },
  { id: 'v_slip', cat: ['slip'], ar: 'شتريد أگلك؟ عاشت إيدك!', en: 'What can I say? Great job!' },
  { id: 'v_u1', cat: ['slip'], ar: 'هاي شنو هاي؟!', en: 'What is THIS?!' },
  { id: 'v_u10', cat: ['missed'], ar: 'اوگف بروح أمك!', en: 'Stop, for your mother\'s sake!' },
  { id: 'v_u9', cat: ['missed'], ar: 'هلو؟ هاي شنو هاي؟', en: 'Hello? What is this?' },
  { id: 'v_c3', cat: ['jump'], ar: 'هاي كل قوتك؟', en: "That's all you've got?" },
  { id: 'v_c13', cat: ['hit'], ar: 'اشبيك وجه الدبس!', en: "What's wrong with you, molasses-face!" },
  { id: 'v_u11', cat: ['hit'], ar: 'هاي شبيك يمعود؟!', en: "What's wrong with you, man?!" },
  { id: 'v_c7', cat: ['hot'], ar: 'انعل أبوك لأبو شرفك…!', en: 'Curse you and your whole family…!' },
  { id: 'v_c4', cat: ['twister'], ar: 'عمي فتحولنا الحضر… وخلي يصير بينا أبو خريان!', en: 'Open the gates… let chaos rain on us!' },
  { id: 'v_u2', cat: ['twister'], ar: 'مو جايز… حرام!', en: 'Not fair… this is wrong!' },
  { id: 'v_u6', cat: ['heavy'], ar: 'هاي شنو؟ بغداد؟!', en: 'What is this, all of Baghdad?!' },
  { id: 'v_u12', cat: ['heavy'], ar: 'لتدوخني!', en: "Don't make me dizzy!" },
  { id: 'v_u4', cat: ['hang'], radio: { ar: 'الطيار: يمعود اثبت!', en: 'Pilot: Hold still, man!' }, ar: 'بخدمتك والله!', en: 'At your service, I swear!' },
  { id: 'v_u5', cat: ['hang'], when: 'crowd', ar: '(كلهم يحچون بنفس الوقت 😂)', en: '(everyone talking at once 😂)' },
  { id: 'v_sorry2', cat: ['full'], ar: 'مع كل الأسف، مع كل الأسف…', en: 'With all regret, with all regret…' },
  { id: 'v_betray', cat: ['full'], ar: 'ليش الغش… ليش الخيانة!', en: 'Why the cheating… why the BETRAYAL!' },
  { id: 'v_c2', cat: ['full'], ar: 'تف عليكم عارات!', en: 'Shame on all of you!' },
  { id: 'v_c12', cat: ['full'], ar: 'شبيكم؟ ما شايفين؟!', en: "What's wrong with you? Can't you see me?!" },
  { id: 'v_u3', cat: ['full'], ar: 'آآآآ… عافني!', en: 'Noooo… he left me!' },
  { id: 'v_c11', cat: ['saved', 'landZone'], ar: 'زين ابن زين إنت!', en: "You're a good man, son of a good man!" },
  { id: 'v_u8', cat: ['saved', 'landZone'], ar: 'أويلي!', en: 'Oh my!' },
  { id: 'v_bye', cat: ['saved', 'landZone'], ar: 'الله وياك، الله وياك… سد الباب وراك حبيبي', en: 'God be with you… close the door behind you, dear' },
  { id: 'v_c10', cat: ['landWater'], ar: 'رجعولي الكروة! لا أحرگ روحي!', en: 'Give me back my fare or I\'ll lose it!' },
  { id: 'v_c8', cat: ['landWater'], ar: 'شوية عدل… فشّلتونا!', en: 'A bit straighter… you embarrassed us!' },
  { id: 'v_c6', cat: ['landHard'], ar: 'خلص خلص…', en: 'Enough, enough…' },
  { id: 'v_c9', cat: ['landHard'], ar: 'ترجعولي الكروة لو لا؟', en: 'Are you giving my fare back or not?' },
  { id: 'v_vip', cat: ['vip_wait'], ar: 'ماي نيم إز مهند!', en: 'My name is Muhannad!' },
  // تطلع بغير الفقاعات
  { id: 'v_c5', cat: ['fail'], ar: 'لا والله شو عصبي… وتباوع صفح ومتنك!', en: 'Wow, so grumpy… looking sideways!' },
  { id: 'v_crash1', cat: ['crash'], ar: 'خايب أكل خره!', en: 'Loser, go eat dirt!' },
];
