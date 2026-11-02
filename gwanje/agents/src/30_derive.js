// ═════════ 파생 값 ═════════
// 매 틱 꼬물이들이 쥔 일감에서 다시 계산한다. 저장해 두지 않으므로 숫자가 새거나 어긋날 수 없다(교착 방지).
const Derive = {
  refresh() {
    const { rooms, orders, crew } = World;
    for (const r of rooms) { r.incoming = 0; r.slots = []; }
    for (const o of orders) { o.making = {}; o.claimed = null; }
    for (const c of crew) {
      const j = c.job; if (!j || !j.o) continue;
      if (j.type !== 'part') j.o.claimed = c;
      if (j.type === 'part' && !j.delivered) j.o.making[j.part] = (j.o.making[j.part] || 0) + 1;
    }
    for (const c of crew) if (c.room && c.st === 'walk' && c.act && c.act.act === 'work') c.room.incoming++;
    for (const o of orders) {
      // 일감을 쥔 꼬물이가 없는데 진행 중 상태면 되돌린다(자가 치유)
      if (o.state === 'toAsm' && !crew.some(c => c.job && c.job.type === 'dispatch' && c.job.o === o)) { o.state = 'inbox'; o.asmRoom = null; }
      if ((o.state === 'asm' || o.state === 'carry') && !crew.some(c => c.job && c.job.type === 'asm' && c.job.o === o)) { o.state = 'placed'; o.tag = null; }
      if (o.asmRoom && ['toAsm', 'placed', 'asm'].includes(o.state)) o.asmRoom.slots.push(o);
    }
  },
  cap: r => r.lv || 1,                                   // 동시에 일하는 수 = 층
  slotsOf: r => DATA.asm.slots[Math.min(r.lv, DATA.asm.slots.length - 1)],
  load: r => (r.workers.length + r.queue.length + (r.incoming || 0)) / Derive.cap(r),
  have: (o, p) => (o.got[p] || []).length,
  partsLeft: o => Object.entries(o.need).filter(([p, n]) => n - Derive.have(o, p) - (o.making[p] || 0) > 0).map(([p]) => p),
  leftCount: o => Object.entries(o.need).reduce((a, [p, n]) => a + Math.max(0, n - Derive.have(o, p)), 0),
  ready: o => o.state === 'placed' && Object.entries(o.need).every(([p, n]) => Derive.have(o, p) >= n),
  // 상자 상태: !환각이 하나라도 → 오류 상자, 아니고 ★영감이 하나라도 → 명작 상자
  boxTag(o) { const all = Object.values(o.got).flat(); return all.includes('hallucinated') ? 'hallucinated' : all.includes('inspired') ? 'inspired' : 'normal'; },
  inboxList: () => World.orders.filter(o => o.state === 'inbox' || (o.state === 'toAsm' && !o.picked)),
  star: (c, kind) => Math.min(DATA.skill.maxStar, Math.floor((c.skill[kind] || 0) / DATA.skill.perStar)),
  rush: () => { const ph = World.S.t - (World.S.day - 1) * DATA.day.length, [a, b] = DATA.day.rush; return ph >= a && ph < b; },
  upkeep() {
    const roads = World.road.reduce((a, b) => a + b, 0);
    return roads * DATA.upkeep.road + World.rooms.filter(r => !DATA.rooms[r.kind].fixed && !r.held).reduce((a, r) => a + DATA.upkeep.byLv[r.lv], 0);
  },
};
