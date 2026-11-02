// ═════════ 일감 ═════════
// 일감 = 행동 목록. 행동의 목적지는 시작할 때 고른다(방이 옮겨져도 맞게 간다).
// 고르는 순서: 조립(끝낼 것) > 부품 > 배부.
const Jobs = {
  // 방 고르기: 걷는 거리 + (일하는 중·줄·오는 중) × 일 시간. 빈 방으로 고르게 퍼진다.
  bestRoom(c, kind) {
    let best = null, bs = Infinity;
    for (const r of World.rooms) if (!r.held && r.kind === kind) {
      const p = Path.to(c, r); if (!p) continue;
      const sc = p.length / (DATA.walk.tilesPerSec * World.S.walk) + Derive.load(r) * (DATA.rooms[kind].work || 1);
      if (sc < bs) { bs = sc; best = r; }
    }
    return best;
  },
  asmFor(c, o) {
    let best = null, bl = Infinity;
    for (const r of World.rooms) if (!r.held && r.kind === 'asm' && r.slots.length < DATA.asm.slots && !r.reject.has(o.r)) { const p = Path.to(c, r); if (p && p.length + r.slots.length * 2 < bl) { bl = p.length + r.slots.length * 2; best = r; } }
    return best;
  },
  // 알아서 분업은 '부드러운' 역할: 내 역할 일이 없으면 다른 일을 돕는다. 직접 분업은 역할을 지킨다.
  find(c) {
    const j = Jobs.findWith(c, true); if (j || !c.role || Teams.mode !== 'auto') return j;
    const k = Jobs.findWith(c, false); if (k) c.why = ''; return k;
  },
  findWith(c, useRole) {
    const W_ = World, why = [], ok = job => !useRole || Teams.allows(c, job);
    // 1) 조립: 부품이 다 모인 주문
    const asmJob = { type: 'asm' };
    if (ok(asmJob)) for (const o of W_.orders) if (Derive.ready(o) && !o.claimed && Path.to(c, o.asmRoom)) {
      o.state = 'asm'; o.claimed = c;
      return { type: 'asm', o, acts: [{ to: () => o.asmRoom, act: 'work', what: 'asm' }, { to: () => Jobs.bestRoom(c, 'qa'), act: 'work', what: 'qa' }, { to: () => Jobs.room('out'), act: 'deliver' }] };
    }
    // 2) 부품: 오래된 주문 먼저, 잘하는 부품은 조금 앞당김
    const opts = [];
    for (const o of W_.orders) if (o.state === 'placed') for (const p of Derive.partsLeft(o)) {
      if (!ok({ type: 'part', part: p })) continue;
      const room = DATA.parts[p].room; if (!Jobs.bestRoom(c, room)) { why.push(DATA.text.noRoad(DATA.rooms[room].n)); W_.day.stuck[room] = (W_.day.stuck[room] || 0) + 0.02; continue; }
      if (!Path.to(c, o.asmRoom)) continue;
      opts.push({ o, p, sc: o.t0 - Derive.star(c, room) * DATA.skill.pickBias });
    }
    if (opts.length) {
      opts.sort((a, b) => a.sc - b.sc); const { o, p } = opts[0]; o.making[p] = (o.making[p] || 0) + 1;
      return { type: 'part', o, part: p, acts: [{ to: () => Jobs.bestRoom(c, DATA.parts[p].room), act: 'work', what: 'part' }, { to: () => o.asmRoom, act: 'drop' }] };
    }
    // 3) 배부: 접수함 주문서 → 받을 수 있는 조립실
    if (ok({ type: 'dispatch' })) {
      const inn = Jobs.room('in');
      for (const o of W_.orders) if (o.state === 'inbox') {
        const r = Jobs.asmFor(c, o);
        if (!r) { why.push(World.rooms.some(x => x.kind === 'asm' && !x.reject.has(o.r)) ? DATA.text.asmFull : DATA.text.noAsm(DATA.recipes[o.r].n)); continue; }
        if (!Path.to(c, inn)) { why.push(DATA.text.noRoad(DATA.rooms.in.n)); break; }
        o.state = 'toAsm'; o.asmRoom = r; r.slots.push(o); o.claimed = c;
        return { type: 'dispatch', o, acts: [{ to: () => inn, act: 'take' }, { to: () => o.asmRoom, act: 'drop' }] };
      }
    }
    c.why = why[0] || (c.role ? DATA.text.roleIdle(Teams.roleOf(c.role).n) : DATA.text.idle);
    return null;
  },
  room: kind => World.rooms.find(r => r.kind === kind && !r.held),
  workTime(c, r, act) {
    let base = DATA.rooms[r.kind].work || 1;
    if (act.what === 'asm') base = act.rework ? DATA.asm.rework : DATA.asm.base + DATA.asm.perPart * Object.values(c.job.o.need).reduce((a, b) => a + b, 0);
    return base * (1 - DATA.skill.speedBonus * Derive.star(c, r.kind));
  },
  // 알아서 분업에 쓰는 밀린 일의 양(초)
  demand() {
    const d = {};
    for (const o of World.orders) {
      if (o.state === 'placed') { for (const [p, n] of Object.entries(o.need)) { const left = n - (o.have[p] || 0); if (left > 0) d[p] = (d[p] || 0) + left * (DATA.rooms[DATA.parts[p].room].work || 1); } if (Derive.ready(o)) d.asm = (d.asm || 0) + DATA.teams.asmCost; }
      if (o.state === 'asm' || o.state === 'carry') d.asm = (d.asm || 0) + DATA.teams.asmCost;
    }
    // 배부는 조립실에 빈자리가 있을 때만 할 수 있는 일이다
    const free = World.rooms.filter(r => r.kind === 'asm' && !r.held).reduce((a, r) => a + Math.max(0, DATA.asm.slots - (r.slots ? r.slots.length : 0)), 0);
    const waiting = World.orders.filter(o => o.state === 'inbox').length;
    d.dispatch = Math.min(free, waiting) * DATA.teams.dispatchCost;
    return d;
  },
};
