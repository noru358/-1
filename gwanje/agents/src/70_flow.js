// ═════════ 하루 흐름: 도착, 검수, 납품, 목표, 지표, 카드 ═════════
const Flow = {
  arrAcc: 0, pick: [],
  rate() {
    const S = World.S, a = DATA.arrival, ph = (S.t % DATA.day.length) / DATA.day.length;
    return (a.base + a.perDay * (S.day - 1) + a.perGoal * S.goal) * (1 - a.wave / 2 + a.wave * Math.sin(ph * Math.PI * 2 - 1)) * (Derive.rush() ? DATA.day.rushArrival : 1);
  },
  spawn() {
    const S = World.S, r = Rand.pick(S.recipes);
    if (Derive.inboxList().length >= S.inboxCap) { World.day.lost++; UI.log(DATA.text.lost); return; }
    const o = Make.order(r);
    if (Rand() < 0.3) UI.log(`<b>[${o.client}]</b> ${Rand.pick(DATA.recipes[r].say)}`);
  },
  // 검수: 결과는 상자 상태(사실)로만 정해진다. 무작위 실패는 없다.
  inspect(c, o) {
    const q = World.day.qa;
    if (o.tag !== 'hallucinated') { q.pass++; FX.pop(c, '#7fe0d0'); return; }
    World.day.halBy[c.quirk] = (World.day.halBy[c.quirk] || 0) + 1;
    if (DATA.quirks[c.quirk].alchemy) { o.tag = 'inspired'; q.alchemy++; FX.add(c, 'burst'); UI.log(DATA.text.alchemy(c.name)); }
    else if (c.qaCaught) { o.tag = 'normal'; q.fix++; FX.pop(c, '#7fe0d0'); }
    else q.miss++;   // 못 알아채고 도장만 찍었다 → 발송구에서 사고
  },
  deliver(c, o) {
    const S = World.S, d = World.day, R = DATA.recipes[o.r], say = s => Rand.pick(s).replace('{c}', o.client);
    d.done++; d.wait += S.t - o.t0; o.state = 'done';
    if (o.tag === 'inspired') { d.master++; UI.log(DATA.text.masterLog(say(R.win))); FX.add(c, 'burst'); }
    else if (o.tag === 'hallucinated') { d.oops++; UI.log(DATA.text.oopsLog(say(R.oops)), 'bad'); FX.add(c, 'bang'); }
    else FX.pop(c, DATA.box.normal);
    S.delivered[o.r] = (S.delivered[o.r] || 0) + DATA.goalCredit[o.tag || 'normal'];
    World.orders.splice(World.orders.indexOf(o), 1);
    c.carry = null; Flow.checkGoal();
  },
  checkGoal() {
    const S = World.S, g = DATA.goals[S.goal]; if (!g) return;
    if (!Object.entries(g.need).every(([r, n]) => (S.delivered[r] || 0) >= n)) return;
    S.goal++; S.delivered = {};
    if (g.recipe && !S.recipes.includes(g.recipe)) S.recipes.push(g.recipe);
    if (g.room) World.toPlace.push(g.room);
    UI.log(`<b>목표 달성!</b> ${g.n}.`); Edit.nextPlace(); UI.recipes();
  },
  metrics() {
    const d = World.day;
    return { done: d.done, master: d.master, avg: d.done ? d.wait / d.done : null, trust: d.done ? 1 - d.oops / d.done : null, cost: Derive.upkeep(), lost: d.lost, oops: d.oops };
  },
  diagnose() {
    const d = World.day, out = [];
    const worst = Object.entries(d.qwait).sort((a, b) => b[1] - a[1])[0];
    out.push(worst && worst[1] > 5 ? `가장 막힌 곳: <b>${DATA.rooms[worst[0]].n}</b> (모두 합쳐 ${Math.round(worst[1])}초 줄 섬)` : '줄이 길게 선 곳은 없었어요.');
    const stuck = Object.entries(d.stuck).filter(e => e[1] >= 1).sort((a, b) => b[1] - a[1])[0]; if (stuck) out.push(`길이 없어 못 간 곳: <b>${DATA.rooms[stuck[0]].n}</b>`);
    const m = d.made; if (m.hallucinated) out.push(`!환각 부품 ${m.hallucinated}개 → 검수대가 고침 ${d.qa.fix}, 명작으로 뒤집음 ${d.qa.alchemy}, 꿀밤 ${d.knock}, <b>사고 ${d.oops}</b>`);
    if (d.qa.skip) out.push(`검수대 줄이 길어 건너뛴 상자 ${d.qa.skip}개`);
    if (d.qa.miss) out.push(`검수대가 못 알아챈 오류 상자 ${d.qa.miss}개 (감사관이나 Lv.2 검수대는 다 잡는다)`);
    out.push(`★영감 부품 ${m.inspired}개 · 커피 ${d.coffee}잔 · 수다 ${d.chats}번`);
    const idle = World.crew.filter(c => c.st === 'idle' && c.why).reduce((acc, c) => (acc[c.why] = (acc[c.why] || 0) + 1, acc), {});
    for (const [w, n] of Object.entries(idle)) if (n >= 2) out.push(`노는 꼬물이 ${n}마리: ${w}`);
    return { text: out.join('<br>'), worst: worst && worst[1] > 5 ? worst[0] : null };
  },
  endDay() {
    const S = World.S; S.inDay = false; UI.closePop();
    const m = Flow.metrics(), diag = Flow.diagnose(), C = DATA.cards;
    m.perfect = m.done > 0 && m.oops === 0;
    const pool = C.specials.filter(c => !c.needPart || S.recipes.some(r => DATA.recipes[r].parts[c.needPart]));
    let sp = diag.worst && Rand() < C.bottleneckChance && pool.find(c => c.room === diag.worst); if (!sp) sp = Rand.pick(pool);
    Flow.pick = [{ ...sp, n: `${sp.n} + 길 ${C.strongRoads}칸`, roads: C.strongRoads }, Rand.pick(C.alts)];
    UI.report(m, S.yday, S.best, diag.text, Flow.pick);
    const b = S.best; S.yday = m;
    const pickBest = (k, f) => m[k] == null ? b[k] : b[k] == null ? m[k] : f(b[k], m[k]);
    S.best = b ? { done: Math.max(b.done, m.done), master: Math.max(b.master, m.master), avg: pickBest('avg', Math.min), trust: pickBest('trust', Math.max), cost: Math.min(b.cost, m.cost) } : { ...m };
  },
  choose(card) {
    const S = World.S, perfect = S.yday && S.yday.perfect; UI.hideReport(); S.day++; S.inDay = true; World.day = newDayStats();
    S.roads += (card.roads || 0) + (perfect ? DATA.perfect.roads : 0);
    for (const q of card.crew || []) Make.crew(q);
    if (card.mul) for (const [k, v] of Object.entries(card.mul)) S[k] *= v;
    if (card.add) for (const [k, v] of Object.entries(card.add)) S[k] += v;
    if (card.room) World.toPlace.push(card.room);
    Teams.apply(); UI.log(`${card.n}.${perfect ? ' ' + DATA.text.perfect(DATA.perfect.roads) : ''}`); Edit.nextPlace(); UI.crewPanel();
  },
  step(dt) {
    const S = World.S; if (!S.inDay || S.paused) return;
    S.t += dt; S.pokeCd = Math.max(0, S.pokeCd - dt);
    Flow.arrAcc += dt * Flow.rate(); while (Flow.arrAcc >= 1) { Flow.arrAcc--; Flow.spawn(); }
    Derive.refresh(); Teams.tick(dt);
    for (const c of World.crew) Crew.step(c, dt);
    Crew.social();
    for (const f of World.fx) f.t += dt; World.fx = World.fx.filter(f => f.t < f.life);
    if (S.t >= S.day * DATA.day.length) Flow.endDay();
  },
};
