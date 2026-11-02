// ═════════ 파생 값 ═════════
// 매 틱 꼬물이들이 쥔 일감에서 다시 계산한다. 저장해 두지 않으므로 숫자가 새거나 어긋날 수 없다(교착 방지).
const Derive = {
  refresh() {
    const { rooms, orders, crew } = World;
    for (const r of rooms) { r.incoming = 0; r.slots = []; }
    for (const o of orders) { o.making = {}; o.claimed = null; }
    for (const c of crew) {
      const j = c.job; if (!j) continue;
      if (j.type !== 'part') j.o.claimed = c;
      if (j.type === 'part' && !j.delivered) j.o.making[j.part] = (j.o.making[j.part] || 0) + 1;
      if (c.room && (c.st === 'walk') && c.act && (c.act.act === 'work')) c.room.incoming++;
    }
    for (const o of orders) {
      // 일감을 쥔 꼬물이가 없는데 진행 중 상태면 되돌린다(자가 치유)
      if (o.state === 'toAsm' && !crew.some(c => c.job && c.job.type === 'dispatch' && c.job.o === o)) { o.state = 'inbox'; o.asmRoom = null; }
      if ((o.state === 'asm' || o.state === 'carry') && !crew.some(c => c.job && c.job.type === 'asm' && c.job.o === o)) o.state = 'placed';
      if (o.asmRoom && ['toAsm', 'placed', 'asm'].includes(o.state)) o.asmRoom.slots.push(o);
    }
  },
  load: r => (r.busy ? 1 : 0) + r.queue.length + (r.incoming || 0),
  partsLeft: o => Object.entries(o.need).filter(([p, n]) => n - (o.have[p] || 0) - (o.making[p] || 0) > 0).map(([p]) => p),
  ready: o => o.state === 'placed' && Object.entries(o.need).every(([p, n]) => (o.have[p] || 0) >= n),
  inboxList: () => World.orders.filter(o => o.state === 'inbox' || (o.state === 'toAsm' && !o.picked)),
  star: (c, kind) => Math.min(DATA.skill.maxStar, Math.floor((c.skill[kind] || 0) / DATA.skill.perStar)),
};
