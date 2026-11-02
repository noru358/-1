// ═════════ 꼬물이 상태 기계 ═════════
// idle → walk → (방 앞) → enter → work → 다음 행동
//                        ↘ queue(줄)      ↘ stuck(길 없음, 잠시 뒤 다시)
const Crew = {
  start(c) {
    c.act = c.job && c.job.acts[0];
    if (!c.act) { Crew.endJob(c); return; }
    const r = c.act.to();
    if (!r || r.held) { c.st = 'stuck'; c.why = '갈 방 없음'; c.retry = DATA.think.stuckRetry; return; }
    const p = Path.to(c, r);
    if (!p) { c.st = 'stuck'; c.why = DATA.text.noRoad(DATA.rooms[r.kind].n); c.retry = DATA.think.stuckRetry; World.day.stuck[r.kind] = (World.day.stuck[r.kind] || 0) + 1; return; }
    c.room = r; c.fin = p.pop() || [r.x, r.y]; c.path = p; c.st = 'walk'; c.why = '';
  },
  atDoor(c) {
    const r = c.room, a = c.act;
    if (!r || r.held) { Crew.start(c); return; }
    if (a.act === 'work') { if (!r.busy) { r.busy = c; c.path = [c.fin]; c.st = 'enter'; } else { if (!r.queue.includes(c)) r.queue.push(c); c.st = 'queue'; } return; }
    Crew.instant(c, a);
  },
  instant(c, a) {
    const j = c.job, o = j.o;
    if (a.act === 'take') { o.picked = true; c.carry = { slip: o }; }
    else if (a.act === 'drop' && j.type === 'dispatch') { o.state = 'placed'; o.picked = false; c.carry = null; FX.pop(c, '#e9e2cc'); }
    else if (a.act === 'drop' && j.type === 'part') { o.have[j.part] = (o.have[j.part] || 0) + 1; j.delivered = true; c.carry = null; FX.pop(c, DATA.parts[j.part].col); }
    else if (a.act === 'deliver') Flow.deliver(c, o);
    Crew.next(c);
  },
  next(c) { c.job.acts.shift(); Crew.start(c); },
  finish(c) {
    const r = c.room, a = c.act, j = c.job; r.busy = null;
    c.skill[r.kind] = (c.skill[r.kind] || 0) + 1;
    if (r.queue.length) { const n = r.queue.shift(); r.busy = n; n.path = [n.fin]; n.st = 'enter'; }
    if (j.type === 'part') c.carry = { part: j.part };
    if (a.what === 'asm') { c.carry = { result: j.o }; j.o.state = 'carry'; j.o.asmRoom = a.rework ? j.o.asmRoom : j.o.asmRoom; }
    if (a.what === 'qa') {
      if (Math.random() < World.S.qaFail) { World.day.qaFail++; FX.cross(c); const room = j.o.asmRoom; j.acts.splice(1, 0, { to: () => room && !room.held ? room : Jobs.room('asm'), act: 'work', what: 'asm', rework: true }, { to: () => Jobs.bestRoom(c, 'qa'), act: 'work', what: 'qa' }); }
      else World.day.qaPass++;
    }
    Crew.next(c);
  },
  endJob(c) {
    if (c.job && c.job.type === 'asm' && c.job.o.state !== 'done') c.job.o.state = 'placed';
    c.job = null; c.act = null; c.room = null; c.carry = null; c.st = 'idle'; c.look = 0;
  },
  arrived(c) { if (c.st === 'walk') Crew.atDoor(c); else if (c.st === 'enter') { c.st = 'work'; c.wt = Jobs.workTime(c, c.room, c.act); } },
  step(c, dt) {
    c.ph += dt;
    if (c.st === 'queue') { const k = c.room.kind; World.day.qwait[k] = (World.day.qwait[k] || 0) + dt; return; }
    if (c.path.length) {
      const [tx, ty] = c.path[0], [px, py] = Path.center(tx, ty), dx = px - c.x, dy = py - c.y, d = Math.hypot(dx, dy), v = DATA.walk.pxPerSec * World.S.walk * dt;
      if (Math.abs(dx) > .5) c.face = dx > 0 ? 1 : -1;
      if (d <= v) { c.x = px; c.y = py; c.path.shift(); if (!c.path.length) Crew.arrived(c); } else { c.x += dx / d * v; c.y += dy / d * v; }
      return;
    }
    if (c.st === 'walk' || c.st === 'enter') { Crew.arrived(c); return; }
    if (c.st === 'work') { c.wt -= dt; if (Math.random() < dt * 4) FX.spark(c, DATA.rooms[c.room.kind].top); if (c.wt <= 0) Crew.finish(c); return; }
    if (c.st === 'stuck') { c.retry -= dt; if (c.retry <= 0) Crew.start(c); return; }
    if (c.st === 'idle') {
      c.look -= dt; if (c.look > 0) return; c.look = DATA.think.idleLook;
      const j = Jobs.find(c); if (j) { c.job = j; c.why = ''; Crew.start(c); return; }
      if (Math.random() < 0.25) Crew.wander(c);
    }
  },
  wander(c) { const [sx, sy] = Path.tileOf(c), opts = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) if (Path.isRoad(sx + dx, sy + dy)) opts.push([sx + dx, sy + dy]); if (opts.length) { const o = opts[Math.floor(Math.random() * opts.length)]; c.path = Path.bfs(sx, sy, o[0], o[1]) || []; } },
  // 판이 바뀌면 걷던 꼬물이는 길을 다시 찾고, 길 밖에 선 꼬물이는 가까운 길로 옮긴다
  replan() { for (const c of World.crew) { const [sx, sy] = Path.tileOf(c); if (!Path.isRoad(sx, sy) && !Path.roomAt(sx, sy)) { const f = Path.nearestRoad(sx, sy); if (f) [c.x, c.y] = Path.center(f[0], f[1]); } if (c.st === 'walk') Crew.start(c); else if (c.st === 'idle') c.path = []; } },
  // 방을 들면 그 방에 걸린 일은 하던 일을 유지한 채 다시 찾기로
  release(r) { for (const c of World.crew) if (c.room === r && ['work', 'queue', 'enter', 'walk'].includes(c.st)) { const [sx, sy] = Path.tileOf(c); if (!Path.isRoad(sx, sy)) { const f = Path.nearestRoad(sx, sy); if (f) [c.x, c.y] = Path.center(f[0], f[1]); } c.path = []; c.st = 'stuck'; c.retry = 0.3; } r.busy = null; r.queue = []; },
};
const FX = {
  pop: (c, col) => World.fx.push({ k: 'pop', x: c.x, y: c.y - 20, t: 0, life: .6, col }),
  spark: (c, col) => World.fx.push({ k: 'spark', x: c.x + (Math.random() - .5) * 12, y: c.y - 16, t: 0, life: .4, col }),
  cross: c => World.fx.push({ k: 'x', x: c.x, y: c.y - 20, t: 0, life: 1 }),
};
