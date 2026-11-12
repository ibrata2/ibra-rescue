const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + require('path').resolve(__dirname, '../app/index.html')); await p.waitForTimeout(800);
  await p.screenshot({ path: out + '/01-title.png' });
  await p.click('#btnPlay'); await p.waitForTimeout(1200); await p.screenshot({ path: out + '/02-map.png' });
  const ids = process.argv[3] ? process.argv[3].split(',').map(Number) : [0];
  for (const i of ids) {
    await p.evaluate(i => { save.stars = {}; for (let k = 0; k < i; k++) save.stars[MISSIONS[k].id] = 1; startMission(i); }, i);
    await p.waitForTimeout(400);
    // fly a bit
    await p.keyboard.down('ArrowRight'); await p.waitForTimeout(1200); await p.keyboard.up('ArrowRight'); await p.waitForTimeout(1500);
    await p.screenshot({ path: out + `/m${i}.png` });
  }
  console.log('ERRORS:', JSON.stringify(errs));
  await b.close();
})();
