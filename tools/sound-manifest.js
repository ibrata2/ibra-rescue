// يكتب قائمة ملفات الأصوات الموجودة بمجلد app/sounds حتى اللعبة تحمّل بس الموجود
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'app', 'sounds');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.mp3$/i.test(f)).sort() : [];
fs.writeFileSync(path.join(dir, 'manifest.js'), `// يتولّد تلقائياً وقت البناء — لا تعدّله باليد\nwindow.SOUND_MANIFEST = ${JSON.stringify(files)};\n`);
console.log('sounds:', files.length, files.join(', '));
