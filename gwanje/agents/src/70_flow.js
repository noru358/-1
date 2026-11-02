// ═════════ 하루 흐름: 도착, 납품, 목표, 지표, 카드 ═════════
const Flow = {
  arrAcc: 0, pick: [],
  rate() { const S = World.S, a = DATA.arrival, ph = (S.t % DATA.day.length) / DATA.day.length; return (a.base + a.perDay * (S.day - 1) + a.perGoal * S.goal) * (1 - a.wave / 2 + a.wave * Math.sin(ph * Math.PI * 2 - 1)); },
  spawn() {
    const S = World.S, r = S.recipes[Math.floor(Math.random() * S.recipes.length)];
    if (Derive.inboxList().length >= S.inboxCap) { World.day.lost++; UI.ticker(DATA.text.lost); return; }
    Make.order(r);
    if (Math.random() < 0.45) { const s = DATA.recipes[r].say; UI.ticker(`<b>인간</b> ${s[Math.floor(Math.random() * s.length)]}`); }
  },
  deliver(c, o) {
    const S = World.S; World.day.done++; World.day.wait += S.t - o.t0; o.state = 'done';
    S.delivered[o.r] = (S.delivered[o.r] || 0) + 1; World.orders.splice(World.orders.indexOf(o), 1);
    FX.pop(c, '#ffe27a'); c.carry = null; Flow.checkGoal();
  },
  checkGoal() {
    const S = World.S, g = DATA.goals[S.goal]; if (!g) return;
    if (!Object.entries(g.need).every(([r, n]) => (S.delivered[r] || 0) >= n)) return;
    S.goal++; S.delivered = {};
    if (g.recipe && !S.recipes.includes(g.recipe)) S.recipes.push(g.recipe);
    if (g.room) World.toPlace.push(g.room);
    UI.ticker(`<b>목표 달성!</b> ${g.n}.`); Edit.nextPlace(); UI.recipes();
  },
  metrics() {
    const d = World.day, roads = World.road.reduce((a, b) => a + b, 0), rooms = World.rooms.filter(r => !DATA.rooms[r.kind].fixed).length;
    return { done: d.done, avg: d.done ? d.wait / d.done : null, qual: d.qaPass + d.qaFail ? d.qaPass / (d.qaPass + d.qaFail) : null, cost: roads * DATA.upkeep.road + rooms * DATA.upkeep.room, lost: d.lost };
  },
  diagnose() {
    const d = World.day, out = [];
    const worst = Object.entries(d.qwait).sort((a, b) => b[1] - a[1])[0];
    out.push(worst && worst[1] > 5 ? `가장 막힌 곳: <b>${DATA.rooms[worst[0]].n}</b> (모두 합쳐 ${Math.round(worst[1])}초 줄 섬)` : '줄이 길게 선 곳은 없었어요.');
    const stuck = Object.entries(d.stuck).filter(e => e[1] >= 1).sort((a, b) => b[1] - a[1])[0]; if (stuck) out.push(`길이 없어 못 간 곳: <b>${DATA.rooms[stuck[0]].n}</b>`);
    const idle = World.crew.filter(c => c.st === 'idle' && c.why).reduce((m, c) => (m[c.why] = (m[c.why] || 0) + 1, m), {});
    for (const [w, n] of Object.entries(idle)) if (n >= 2) out.push(`노는 꼬물이 ${n}마리: ${w}`);
    return { text: out.join('<br>'), worst: worst && worst[1] > 5 ? worst[0] : null };
  },
  endDay() {
    const S = World.S; S.inDay = false; UI.closePop();
    const m = Flow.metrics(), diag = Flow.diagnose(), C = DATA.cards;
    const pool = C.specials.filter(c => !c.needPart || S.recipes.some(r => DATA.recipes[r].parts[c.needPart]));
    let sp = diag.worst && Math.random() < C.bottleneckChance && pool.find(c => c.room === diag.worst); if (!sp) sp = pool[Math.floor(Math.random() * pool.length)];
    Flow.pick = [{ ...sp, n: `${sp.n} + 길 ${C.strongRoads}칸`, roads: C.strongRoads }, C.alts[Math.floor(Math.random() * C.alts.length)]];
    UI.report(m, S.yday, S.best, diag.text, Flow.pick);
    const b = S.best; S.yday = m;
    S.best = b ? { done: Math.max(b.done, m.done), avg: m.avg == null ? b.avg : b.avg == null ? m.avg : Math.min(b.avg, m.avg), qual: Math.max(b.qual || 0, m.qual || 0), cost: Math.min(b.cost, m.cost) } : { ...m };
  },
  choose(card) {
    const S = World.S; UI.hideReport(); S.day++; S.inDay = true; World.day = newDayStats();
    S.roads += card.roads || 0;
    for (let k = 0; k < (card.crew || 0); k++) Make.crew();
    if (card.mul) for (const [k, v] of Object.entries(card.mul)) S[k] *= v;
    if (card.add) for (const [k, v] of Object.entries(card.add)) S[k] += v;
    if (card.room) World.toPlace.push(card.room);
    Teams.apply(); UI.ticker(`${card.n}.`); Edit.nextPlace(); UI.crewPanel();
  },
  step(dt) {
    const S = World.S; if (!S.inDay || S.paused) return;
    S.t += dt;
    Flow.arrAcc += dt * Flow.rate(); while (Flow.arrAcc >= 1) { Flow.arrAcc--; Flow.spawn(); }
    Derive.refresh(); Teams.tick(dt);
    for (const c of World.crew) Crew.step(c, dt);
    for (const f of World.fx) f.t += dt; World.fx = World.fx.filter(f => f.t < f.life);
    if (S.t >= S.day * DATA.day.length) Flow.endDay();
  },
};
