// يفتح عينات من المهمات الجديدة ويصوّرها ويتأكد ما اكو أخطاء
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2]; const list = (process.argv[3] || '').split(',').map(Number);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + require('path').resolve(__dirname, '../app/index.html')); await p.waitForTimeout(600);
  await p.click('#btnPlay'); await p.waitForTimeout(900); await p.screenshot({ path: out + '/map.png' });
  for (const i of list) {
    const info = await p.evaluate(i => {
      for (let k = 0; k < i; k++) save.stars[MISSIONS[k].id] = 1; startMission(i);
      const g = G; g.heli.x = Math.min(g.L.W - 300, 520); g.heli.y = 40; g.initRope(); g.camX = g.heli.x - VW / 2;
      // علّق 3 من الموجودين
      for (let k = 0; k < Math.min(3, g.ht.cap); k++) { const q = g.people[k]; const s = g.freeSlot(); q.st = 'hang'; q.k = s; g.rope.occ[s] = q; g.rope.inv[s] = g.weightInv(q); }
      for (let k = 0; k < 360; k++) { input.x = k < 120 ? 0.6 : 0; g.step(1 / 120); }
      input.x = 0; const m = g.m;
      return `${i + 1} ${m.id} ${m.type || 'rescue'} heli=${m.heli} ppl=${g.people.length} goal=${g.goal} fires=${(g.L.fires || []).length} kinds=${[...new Set(g.people.map(q => q.kind))]} state=${g.state}`;
    }, i);
    await p.waitForTimeout(700); await p.screenshot({ path: `${out}/t${i}.png` }); console.log(info);
  }
  console.log('ERR', JSON.stringify(errs)); await b.close();
})();
