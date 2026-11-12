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
   heli     : small (5 أشخاص) | chinook (8 أشخاص، حبل أطول)
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
