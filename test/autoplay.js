// طيار آلي يجرب اللعبة: يروح للناس، ينزل الحبل، يرجعهم للمنطقة
const { chromium } = require('playwright');
(async () => {
  const mi = +(process.argv[2] || 0), out = process.argv[3];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + require('path').resolve(__dirname, '../app/index.html')); await p.waitForTimeout(300);
  await p.evaluate(mi => { for (let k = 0; k < mi; k++) save.stars[MISSIONS[k].id] = 1; startMission(mi); }, mi);
  const res = await p.evaluate(async () => {
    const g = G; const log = [];
    const ropeLen = g.ht.segs * g.ht.seg;
    const cruise = () => { const tops = g.L.solids.filter(s => !s.ground).map(s => s.y); return Math.max(18, Math.min(...tops) - 22); };
    const CR = cruise();
    let phase = 'go', target = null, tLast = 0, tStart = 0; const black = new Set();
    function ctrl() {
      const h = g.heli;
      const zones = g.zones(); const z = zones.reduce((a, b) => Math.abs(b.x - h.x) < Math.abs(a.x - h.x) ? b : a);
      const waiting = g.people.filter(q => (q.st === 'wait' || q.st === 'swim') && !black.has(q));
      const load = g.load();
      if (load >= g.ht.cap || (load > 0 && waiting.length === 0) || (load > 0 && g.saved + load >= g.goal)) phase = 'home'; else if (phase === 'home' && load === 0) phase = 'go';
      let tx, ty;
      if (phase === 'home') { tx = z.x + z.w / 2; const dx = Math.abs(tx - h.x); ty = dx < 12 ? z.y - ropeLen * 0.55 : CR; }
      else {
        if (target && g.t - tStart > 9) { black.add(target); target = null; }
        if (!target || !(target.st === 'wait' || target.st === 'swim') || black.has(target)) { target = waiting.sort((a, b) => Math.abs(a.x - h.x) - Math.abs(b.x - h.x))[0]; tStart = g.t; if (black.size > 4) black.clear(); }
        if (!target) { tx = h.x; ty = CR; }
        else { tx = target.x; const dx = Math.abs(tx - h.x); ty = dx < 10 ? target.y - ropeLen * 0.85 : CR; }
      }
      // لا تنزل تحت مستوى آمن فوگ البنايات القريبة
      const near = g.L.solids.filter(s => !s.ground && h.x + 30 > s.x && h.x - 30 < s.x + s.w).map(s => s.y);
      if (near.length) ty = Math.min(ty, Math.min(...near) - 14);
      let ex = tx - h.x; const ey = ty - h.y;
      if (Math.abs(ex) > 14 && h.y > CR + 8) ex = 0; // اصعد أول
      input.x = Math.max(-1, Math.min(1, ex * 0.04 - h.vx * 0.03));
      input.y = Math.max(-1, Math.min(1, ey * 0.07 - h.vy * 0.04 - 0.06 * load));
    }
    for (let i = 0; i < 120 * 200 && g.state === 'play'; i++) {
      ctrl(); g.step(1 / 120);
      if (g.state !== 'play') log.push('CRASH at ' + g.heli.x.toFixed(0) + ',' + g.heli.y.toFixed(0) + ' v=' + g.heli.vx.toFixed(0) + ',' + g.heli.vy.toFixed(0) + ' solids:' + JSON.stringify(g.L.solids.filter(s => Math.abs(s.x + s.w / 2 - g.heli.x) < 60).map(s => [s.x | 0, s.y | 0, s.w | 0, s.kind])));
      if (i % 240 === 0) log.push(`x=${g.heli.x.toFixed(0)} y=${g.heli.y.toFixed(0)} in=${input.x.toFixed(2)},${input.y.toFixed(2)} ` +`t=${g.t.toFixed(0)} saved=${g.saved} load=${g.load()} falls=${g.falls} phase=${phase}`);
    }
    return { state: g.state, saved: g.saved, goal: g.goal, falls: g.falls, t: g.t.toFixed(1), log };
  });
  await p.evaluate(() => { G.render(); });
  if (out) await p.screenshot({ path: out });
  console.log(JSON.stringify(res, null, 1), 'ERR', errs);
  await b.close();
})();
