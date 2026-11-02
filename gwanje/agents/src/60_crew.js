// ═════════ 꼬물이 상태 기계 ═════════
// idle → walk → (방 앞) → enter → work → 다음 행동
//                        ↘ queue(줄)      ↘ stuck(길 없음, 잠시 뒤 다시)
// 기질·카페인·버프는 모두 Crew.mul(속도)과 Crew.partTag(부품 상태) 두 곳에서만 계산한다.
const Crew = {
  // ── 속도 배율: 기질 × 버프 × 간식 × 카페인 ──
  rushOn(c) { const q = DATA.quirks[c.quirk]; return !!q.rushMul && (Derive.inboxList().length >= q.rushInbox || Derive.rush()); },
  mul(c, kind, room) {
    const q = DATA.quirks[c.quirk], S = World.S, b = c.buff; let m = S.pace;
    if (kind === 'walk') { m *= S.walk; if (c.energy <= 0 && !Crew.rushOn(c)) m *= DATA.energy.emptyWalk; }
    else {
      m *= q.workMul || 1;
      if (room && room.kind === 'qa') m *= q.qaMul || 1;
      if (q.soloMul && room && !DATA.rooms[room.kind].coffee) m *= c.solo ? q.soloMul : q.crowdMul;
    }
    if (q.rushMul) m *= Crew.rushOn(c) ? q.rushMul : q.baseMul;
    if (b.chat) m *= DATA.chat.mul; if (b.praise) m *= DATA.poke.praiseMul; if (b.coffee) m *= DATA.energy.coffeeBuff;
    return m;
  },
  // ── 부품 상태: 환각 확률 → 영감 확률 → 정상 순으로 한 번 굴린다 ──
  partTag(c, r) {
    const q = DATA.quirks[c.quirk], S = World.S;
    const hal = ((q.hallucinate || 0) + S.halluAdd) * S.halluMul;
    const ins = Derive.star(c, r.kind) * DATA.skill.inspirePerStar + (q.inspire || 0) + (q.soloInspire && c.solo ? q.soloInspire : 0) + (c.buff.chat ? S.chatInspire : 0);
    const x = Rand(); return x < hal ? 'hallucinated' : x < hal + ins ? 'inspired' : 'normal';
  },
  start(c) {
    c.act = c.job && c.job.acts[0];
    if (!c.act) { Crew.endJob(c); return; }
    const r = c.act.to();
    // 검수: 검수대가 없거나 줄이 너무 길면 건너뛰고 바로 발송구로(오류 상자면 사고가 난다)
    if (c.act.kind === 'qa' && (!r || r.queue.length >= DATA.qa.skipQueue)) {
      World.day.qa.skip++; if (c.job.o.tag === 'hallucinated') UI.log(DATA.text.skipQa(c.name));
      Crew.next(c); return;
    }
    if (!r || r.held) { c.st = 'stuck'; c.why = '갈 방 없음'; c.retry = DATA.think.stuckRetry; return; }
    const p = Path.to(c, r);
    if (!p) { c.st = 'stuck'; c.why = DATA.text.noRoad(DATA.rooms[r.kind].n); c.retry = DATA.think.stuckRetry; World.day.stuck[r.kind] = (World.day.stuck[r.kind] || 0) + 1; return; }
    c.room = r; c.fin = p.pop() || [r.x, r.y]; c.path = p; c.st = 'walk'; c.why = '';
  },
  atDoor(c) {
    const r = c.room, a = c.act;
    if (!r || r.held) { Crew.start(c); return; }
    if (a.act === 'work') { if (r.workers.length < Derive.cap(r)) Crew.enter(c, r); else { if (!r.queue.includes(c)) r.queue.push(c); c.st = 'queue'; } return; }
    Crew.instant(c, a);
  },
  enter(c, r) { r.workers.push(c); c.solo = r.queue.length === 0; c.path = [c.fin]; c.st = 'enter'; },
  pull(r) { while (r.queue.length && r.workers.length < Derive.cap(r)) Crew.enter(r.queue.shift(), r); },
  instant(c, a) {
    const j = c.job, o = j.o;
    if (a.act === 'take') { o.picked = true; c.carry = { slip: o }; }
    else if (a.act === 'drop' && j.type === 'dispatch') { o.state = 'placed'; o.picked = false; c.carry = null; FX.pop(c, '#e9e2cc'); }
    else if (a.act === 'drop' && j.type === 'part') { (o.got[j.part] = o.got[j.part] || []).push(c.carry.tag); j.delivered = true; c.carry = null; FX.pop(c, DATA.parts[j.part].col); }
    else if (a.act === 'deliver') Flow.deliver(c, o);
    Crew.next(c);
  },
  next(c) { c.job.acts.shift(); Crew.start(c); },
  finish(c) {
    const r = c.room, a = c.act, j = c.job, S = World.S;
    r.workers = r.workers.filter(x => x !== c); Crew.pull(r);
    if (a.what === 'coffee') { c.energy = DATA.energy.max; c.buff.coffee = DATA.energy.coffeeSec; World.day.coffee++; FX.add(c, 'cup'); Crew.next(c); return; }
    c.skill[r.kind] = (c.skill[r.kind] || 0) + S.skillMul;
    if (!Crew.rushOn(c)) { c.energy = Math.max(0, c.energy - 1); if (!c.energy) FX.add(c, 'cup'); }
    if (j.type === 'part') { const tag = Crew.partTag(c, r); c.carry = { part: j.part, tag }; World.day.made[tag]++; const mb = World.day.madeBy[c.quirk] = World.day.madeBy[c.quirk] || { normal: 0, inspired: 0, hallucinated: 0 }; mb[tag]++; if (tag !== 'normal') FX.add(c, tag === 'inspired' ? 'star' : 'bang'); }
    if (a.what === 'asm') { j.o.tag = Derive.boxTag(j.o); c.carry = { result: j.o }; j.o.state = 'carry'; }
    if (a.what === 'qa') Flow.inspect(c, j.o);
    Crew.next(c);
  },
  endJob(c) {
    if (c.job && c.job.type === 'asm' && c.job.o.state !== 'done') { c.job.o.state = 'placed'; c.job.o.tag = null; }
    c.job = null; c.act = null; c.room = null; c.carry = null; c.st = 'idle'; c.look = 0;
  },
  arrived(c) { if (c.st === 'walk') Crew.atDoor(c); else if (c.st === 'enter') { c.st = 'work'; c.wt = Jobs.workTime(c, c.room, c.act); } },
  step(c, dt) {
    c.ph += dt; c.chatCd -= dt;
    for (const k in c.buff) if ((c.buff[k] -= dt) <= 0) delete c.buff[k];
    if (c.st === 'queue') { const k = c.room.kind; World.day.qwait[k] = (World.day.qwait[k] || 0) + dt; return; }
    if (c.path.length) {
      const [tx, ty] = c.path[0], [px, py] = Path.center(tx, ty), dx = px - c.x, dy = py - c.y, d = Math.hypot(dx, dy), v = DATA.walk.pxPerSec * Crew.mul(c, 'walk') * dt;
      if (Math.abs(dx) > .5) c.face = dx > 0 ? 1 : -1;
      if (d <= v) { c.x = px; c.y = py; c.path.shift(); Crew.aura(c); if (!c.path.length) Crew.arrived(c); } else { c.x += dx / d * v; c.y += dy / d * v; }
      return;
    }
    if (c.st === 'walk' || c.st === 'enter') { Crew.arrived(c); return; }
    if (c.st === 'work') { c.wt -= dt; if (Rand() < dt * 4) FX.spark(c, DATA.rooms[c.room.kind].top); if (c.wt <= 0) Crew.finish(c); return; }
    if (c.st === 'stuck') { c.retry -= dt; if (c.retry <= 0) Crew.start(c); return; }
    if (c.st === 'idle') {
      c.look -= dt; if (c.look > 0) return; c.look = DATA.think.idleLook;
      const j = Jobs.find(c); if (j) { c.job = j; c.why = ''; Crew.start(c); return; }
      if (Rand() < 0.25) Crew.wander(c);
    }
  },
  // Lv.2 탕비실 근처 길을 지나가면 커피를 채운다(무정차 커피)
  aura(c) {
    if (c.energy >= DATA.energy.max) return;
    const [x, y] = Path.tileOf(c), R = DATA.energy.auraRange;
    if (World.rooms.some(r => !r.held && r.kind === 'pantry' && r.lv >= 2 && Math.abs(r.x - x) + Math.abs(r.y - y) <= R)) {
      c.energy = DATA.energy.max; c.buff.coffee = DATA.energy.coffeeSec; World.day.coffee++; FX.add(c, 'cup');
    }
  },
  // 수다쟁이: 걷다가 동료와 마주치면 둘 다 신난다
  social() {
    const ch = DATA.chat;
    for (const c of World.crew) {
      if (!DATA.quirks[c.quirk].chatty || c.chatCd > 0 || !c.path.length) continue;
      const d = World.crew.find(o => o !== c && ['walk', 'idle'].includes(o.st) && Math.hypot(o.x - c.x, o.y - c.y) < ch.reach);
      if (!d) continue;
      c.buff.chat = d.buff.chat = ch.sec; c.chatCd = ch.cd; World.day.chats++; FX.add(c, 'note'); FX.add(d, 'note');
    }
  },
  wander(c) { const [sx, sy] = Path.tileOf(c), opts = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) if (Path.isRoad(sx + dx, sy + dy)) opts.push([sx + dx, sy + dy]); if (opts.length) { const o = Rand.pick(opts); c.path = Path.bfs(sx, sy, o[0], o[1]) || []; } },
  // 판이 바뀌면 걷던 꼬물이는 길을 다시 찾고, 길 밖에 선 꼬물이는 가까운 길로 옮긴다
  replan() { for (const c of World.crew) { const [sx, sy] = Path.tileOf(c); if (!Path.isRoad(sx, sy) && !Path.roomAt(sx, sy)) { const f = Path.nearestRoad(sx, sy); if (f) [c.x, c.y] = Path.center(f[0], f[1]); } if (c.st === 'walk') Crew.start(c); else if (c.st === 'idle') c.path = []; } },
  // 방을 들면 그 방에 걸린 일은 하던 일을 유지한 채 다시 찾기로
  release(r) { for (const c of World.crew) if (c.room === r && ['work', 'queue', 'enter', 'walk'].includes(c.st)) { const [sx, sy] = Path.tileOf(c); if (!Path.isRoad(sx, sy)) { const f = Path.nearestRoad(sx, sy); if (f) [c.x, c.y] = Path.center(f[0], f[1]); } c.path = []; c.st = 'stuck'; c.retry = 0.3; } r.workers = []; r.queue = []; },
  // 판 위에서 누를 수 있는 꼬물이 찾기
  at: (px, py) => World.crew.find(c => Math.abs(c.x - px) < 9 && Math.abs(c.y - 8 - py) < 10),
};
const FX = {
  pop: (c, col) => World.fx.push({ k: 'pop', x: c.x, y: c.y - 20, t: 0, life: .6, col }),
  spark: (c, col) => World.fx.push({ k: 'spark', x: c.x + (Rand() - .5) * 12, y: c.y - 16, t: 0, life: .4, col }),
  // 그림 효과: star(★영감), bang(!환각), cup(커피), note(♪ 수다), heart(칭찬), knock(꿀밤), burst(명작 변환)
  add: (c, k) => World.fx.push({ k, x: c.x, y: c.y - 22, t: 0, life: k === 'burst' ? 1.2 : .9 }),
};
